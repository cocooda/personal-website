import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { processSteps } from "../content/process";
import { profile } from "../content/profile";
import { featuredProjects, getProjectBySlug } from "../lib/content/projects";

const baseUrl = "http://127.0.0.1:3107";

function collectConsoleErrors(page: Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  return errors;
}

const explorerProjectSlugs = ["legolas-ai", "hanoiworld", "powfolio"] as const;
type ExplorerProjectSlug = (typeof explorerProjectSlugs)[number];

async function waitForExplorerGeometry(page: Page) {
  await page.waitForFunction(() => {
    const stage = document.getElementById("project-explorer-stage");
    const track = document.getElementById("project-rail-track");
    const firstPreview = document.querySelector(
      '#project-rail-track > [data-project-slug="legolas-ai"]',
    );
    const stageTop = stage ? stage.getBoundingClientRect().top + window.scrollY : 0;
    const documentContainsStage =
      stage && document.documentElement.scrollHeight >= stageTop + stage.offsetHeight - 2;

    return (
      stage &&
      track &&
      firstPreview &&
      documentContainsStage &&
      firstPreview.getBoundingClientRect().height > 0 &&
      window.getComputedStyle(track).rowGap !== ""
    );
  });
}

async function getExplorerTargets(page: Page) {
  return page.evaluate(() => {
    const stage = document.getElementById("project-explorer-stage");
    if (!stage) throw new Error("Project explorer stage missing");

    const identityRatio = Number(stage.dataset.identityRatio);
    const portalRatio = Number(stage.dataset.portalRatio);
    const navigationRatio = Number(stage.dataset.navigationRatio);
    const navigationStart = Number(stage.dataset.navigationStart);
    const navigationEnd = Number(stage.dataset.navigationEnd);
    const previewRevealStart = Number(stage.dataset.previewRevealStart);
    const previewRevealEnd = Number(stage.dataset.previewRevealEnd);

    if (
      !Number.isFinite(identityRatio) ||
      !Number.isFinite(portalRatio) ||
      !Number.isFinite(navigationRatio) ||
      !Number.isFinite(navigationStart) ||
      !Number.isFinite(navigationEnd) ||
      !Number.isFinite(previewRevealStart) ||
      !Number.isFinite(previewRevealEnd)
    ) {
      throw new Error("Project explorer phase ratios missing");
    }

    const navigationProgress = (projectProgress: number) =>
      navigationStart + projectProgress * navigationRatio;

    return {
      identityStart: 0,
      earlyIdentity: identityRatio * 0.5,
      portalStart: identityRatio,
      earlyPortal: identityRatio + portalRatio * 0.35,
      portalMidpoint: identityRatio + portalRatio / 2,
      latePortal: identityRatio + portalRatio * 0.8,
      previewRevealStart,
      previewRevealEnd,
      navigationStart,
      firstSecondMidpoint: navigationProgress(0.25),
      secondCentered: navigationProgress(0.5),
      secondThirdMidpoint: navigationProgress(0.75),
      navigationEnd,
      exitMidpoint: navigationEnd + (1 - navigationEnd) / 2,
      stickyRelease: 1,
    };
  });
}

async function scrollExplorerToProgress(page: Page, progress: number) {
  const targetY = await page.evaluate((targetProgress) => {
    const stage = document.getElementById("project-explorer-stage");
    if (!stage) throw new Error("Project explorer stage missing");

    const stageTop = stage.getBoundingClientRect().top + window.scrollY;
    const scrollableDistance = stage.offsetHeight - window.innerHeight;
    const nextScrollY = stageTop + scrollableDistance * targetProgress;
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    const clampedScrollY = Math.min(Math.max(nextScrollY, 0), maxScrollY);
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, clampedScrollY);
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
    return clampedScrollY;
  }, progress);

  await page.waitForFunction((expectedY) => Math.abs(window.scrollY - expectedY) < 2, targetY);
  await page.waitForTimeout(50);
}

async function getRailTransformY(page: Page) {
  return page.locator("#project-rail-track").evaluate((node) => {
    const transform = window.getComputedStyle(node).transform;
    if (transform === "none") return 0;

    const matrix = transform.match(/matrix.*\((.+)\)/);
    if (!matrix) return 0;

    const values = matrix[1].split(",").map((value) => Number.parseFloat(value.trim()));
    return transform.startsWith("matrix3d") ? values[13] : values[5];
  });
}

async function getActiveExplorerSlug(page: Page) {
  return page.locator("#project-explorer-stage").getAttribute("data-active-slug");
}

type OrbitalNodeCenter = {
  slug: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  state: string | null;
};

async function getOrbitalNodeCenters(page: Page): Promise<OrbitalNodeCenter[]> {
  return page
    .locator("[data-desktop-orbital-project-nodes] [data-project-node]")
    .evaluateAll((nodes) => {
      const cumulativeOpacity = (element: Element) => {
        let opacity = 1;
        let current: Element | null = element;

        while (current) {
          opacity *= Number(window.getComputedStyle(current).opacity);
          current = current.parentElement;
        }

        return opacity;
      };

      return nodes.map((node) => {
        const rect = node.getBoundingClientRect();

        return {
          slug: node.getAttribute("data-project-slug"),
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
          opacity: cumulativeOpacity(node),
          state: node.getAttribute("data-project-node-state"),
        };
      });
    });
}

function nodeCenter(nodes: OrbitalNodeCenter[], slug: ExplorerProjectSlug) {
  const node = nodes.find((candidate) => candidate.slug === slug);
  if (!node) throw new Error(`Missing orbital node ${slug}`);
  return node;
}

function centerDistance(first: OrbitalNodeCenter, second: OrbitalNodeCenter) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

async function getCumulativeOpacity(page: Page, selector: string) {
  return page.locator(selector).evaluate((node) => {
    let opacity = 1;
    let current: Element | null = node;

    while (current) {
      opacity *= Number(window.getComputedStyle(current).opacity);
      current = current.parentElement;
    }

    return opacity;
  });
}

async function getPreviewVisualState(page: Page, slug: ExplorerProjectSlug) {
  return page.locator(`#project-rail-track > [data-project-slug="${slug}"]`).evaluate((node) => {
    const media = node.querySelector("[data-preview-media]");
    const scrim = node.querySelector("[data-preview-scrim]");
    const edge = node.querySelector("[data-preview-active-edge]");

    if (!media || !scrim || !edge) {
      throw new Error(`Preview layers missing for ${slug}`);
    }

    return {
      activeSlug: node.getAttribute("data-active-slug"),
      activeEdgeAttribute: node.getAttribute("data-active-edge-opacity"),
      edgeOpacity: Number(window.getComputedStyle(edge).opacity),
      mediaBackgroundColor: window.getComputedStyle(media).backgroundColor,
      mediaAttribute: node.getAttribute("data-media-opacity"),
      mediaOpacity: Number(window.getComputedStyle(media).opacity),
      previewState: node.getAttribute("data-preview-state"),
      scrimAttribute: node.getAttribute("data-scrim-state"),
      scrimOpacity: Number(window.getComputedStyle(scrim).opacity),
      wrapperOpacity: Number(window.getComputedStyle(node).opacity),
    };
  });
}

async function expectAnyProjectIntersectsViewport(page: Page) {
  const hasVisibleProject = await page
    .locator("#project-rail-track > [data-project-slug]")
    .evaluateAll((nodes) =>
      nodes.some((node) => {
        const rect = node.getBoundingClientRect();
        const styles = window.getComputedStyle(node);

        return (
          rect.bottom > 0 &&
          rect.top < window.innerHeight &&
          rect.right > 0 &&
          rect.left < window.innerWidth &&
          rect.width > 0 &&
          rect.height > 0 &&
          styles.visibility !== "hidden" &&
          styles.opacity !== "0"
        );
      }),
    );

  expect(hasVisibleProject).toBe(true);
}

async function expectPreviewCentered(page: Page, slug: ExplorerProjectSlug) {
  const centerDelta = await page
    .locator(`#project-rail-track > [data-project-slug="${slug}"]`)
    .evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
    });

  expect(centerDelta).toBeLessThan(16);
}

async function expectExplorerSlugAlignment(page: Page, slug: ExplorerProjectSlug) {
  const stage = page.locator("#project-explorer-stage");
  await expect(stage).toHaveAttribute("data-active-slug", slug);
  const phase = await stage.getAttribute("data-home-stage-phase");
  const activeNode = page.locator(
    `[data-desktop-orbital-project-nodes] [data-project-node][data-active-slug="${slug}"]`,
  );

  if (phase === "identity") {
    await expect(activeNode).toHaveCount(0);
  } else {
    await expect(activeNode).toHaveAttribute("data-project-slug", slug);
  }
  await expect(page.locator(`[data-explorer-slot="left-title"]`)).toHaveAttribute(
    "data-project-slug",
    slug,
  );
  await expect(page.locator(`[data-explorer-slot="right-metadata"]`)).toHaveAttribute(
    "data-project-slug",
    slug,
  );
  await expect(page.locator(`[data-explorer-slot="cta"]`)).toHaveAttribute(
    "data-project-slug",
    slug,
  );
  await expect(page.locator(`[data-explorer-slot="cta"]`)).toHaveAttribute(
    "href",
    `/work/${slug}`,
  );
  await expect(page.locator(`[data-explorer-slot="connector"]`)).toHaveAttribute(
    "data-project-slug",
    slug,
  );
  await expect(page.locator(`#project-rail-track > [data-project-slug="${slug}"]`)).toHaveAttribute(
    "data-active-slug",
    slug,
  );
}

async function scrollToFirstProject(page: Page) {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await waitForExplorerGeometry(page);
  const targets = await getExplorerTargets(page);
  await scrollExplorerToProgress(page, targets.navigationStart);
  await expectExplorerSlugAlignment(page, "legolas-ai");
  await expectPreviewCentered(page, "legolas-ai");
  return targets;
}

test.describe("resume experience", () => {
  test("desktop header opens the internal resume route with PDF actions", async ({ page, request }) => {
    const consoleErrors = collectConsoleErrors(page);

    await page.goto("/");

    const primaryNav = page.getByRole("navigation", { name: "Primary navigation" });
    const resumeLink = primaryNav.getByRole("link", { name: "Resume" });

    await expect(resumeLink).toHaveAttribute("href", profile.resume.pageHref);
    await expect(resumeLink).not.toHaveAttribute("target", "_blank");

    await resumeLink.click();
    await expect(page).toHaveURL(/\/resume$/);
    await expect(page.getByRole("banner")).toBeVisible();

    const backLink = page.getByRole("link", { name: "Back to portfolio" });
    await expect(backLink).toBeVisible();

    const viewer = page.locator('object[type="application/pdf"]');
    await expect(viewer).toHaveAttribute("data", profile.resume.pdfHref);
    await expect(viewer).toHaveAttribute("title", `${profile.name} resume PDF preview`);

    const download = page.getByRole("link", { name: "Download PDF" }).first();
    await expect(download).toHaveAttribute("href", profile.resume.pdfHref);
    await expect(download).toHaveAttribute("download", profile.resume.fileName);

    const rawPdf = await request.get(profile.resume.pdfHref);
    expect(rawPdf.ok()).toBe(true);
    expect(rawPdf.headers()["content-type"]).toContain("application/pdf");

    await backLink.click();
    await expect(page).toHaveURL(/\/$/);
    expect(consoleErrors).toEqual([]);
  });

  test("mobile navigation closes after opening the internal resume route", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByRole("button", { name: "Open navigation" }).click();
    const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
    const resumeLink = mobileNav.getByRole("link", { name: "Resume" });

    await expect(resumeLink).toHaveAttribute("href", profile.resume.pageHref);
    await expect(resumeLink).not.toHaveAttribute("target", "_blank");

    await resumeLink.click();
    await expect(page).toHaveURL(/\/resume$/);
    await expect(page.getByRole("button", { name: "Open navigation" })).toBeVisible();
  });

  test("hero and contact resume CTAs use the internal route without new tabs", async ({ page }) => {
    await page.goto("/");

    const heroResume = page.getByRole("link", { name: "View resume" }).first();
    await expect(heroResume).toHaveAttribute("href", profile.resume.pageHref);
    await expect(heroResume).not.toHaveAttribute("target", "_blank");

    await heroResume.click();
    await expect(page).toHaveURL(/\/resume$/);

    await page.goto("/#contact");
    const contactResume = page.locator("#contact").getByRole("link", { name: "View resume" });
    await expect(contactResume).toHaveAttribute("href", profile.resume.pageHref);
    await expect(contactResume).not.toHaveAttribute("target", "_blank");

    await contactResume.click();
    await expect(page).toHaveURL(/\/resume$/);
  });
});

test.describe("contact experience", () => {
  test("header and hero contact links target the homepage contact section", async ({ page }) => {
    await page.goto("/resume");

    const primaryNav = page.getByRole("navigation", { name: "Primary navigation" });
    const headerContact = primaryNav.getByRole("link", { name: "Contact" });
    await expect(headerContact).toHaveAttribute("href", profile.contact.pageHref);

    await headerContact.click();
    await expect(page).toHaveURL(/\/#contact$/);
    await expect(page.locator("#contact")).toBeInViewport();

    await page.goto("/");
    const heroContact = page.getByRole("link", { name: "Contact" }).last();
    await expect(heroContact).toHaveAttribute("href", profile.contact.pageHref);
  });

  test("copy email succeeds and announces the result", async ({ browser }) => {
    const context = await browser.newContext({
      baseURL: baseUrl,
    });
    await context.grantPermissions(["clipboard-read", "clipboard-write"], {
      origin: baseUrl,
    });
    const page = await context.newPage();

    await page.goto("/#contact");

    await expect(page.locator("#contact")).toContainText(profile.email);
    await page.getByRole("button", { name: "Copy email" }).click();

    await expect(page.getByRole("status")).toContainText("Email copied");
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(profile.email);

    await context.close();
  });

  test("clipboard failure displays a manual-copy fallback", async ({ page }) => {
    await page.goto("/#contact");
    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async () => {
            throw new Error("Clipboard blocked");
          },
        },
      });
    });

    await page.getByRole("button", { name: "Copy email" }).click();
    const contactAlert = page.locator("#contact").getByRole("alert");
    await expect(contactAlert).toContainText("Copy failed");
    await expect(contactAlert).toContainText("copy it manually");
  });

  test("Gmail and mail app actions use explicit native links", async ({ page }) => {
    await page.goto("/#contact");

    const encodedEmail = encodeURIComponent(profile.email);
    const gmail = page.getByRole("link", { name: "Open Gmail" });
    await expect(gmail).toHaveAttribute(
      "href",
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}`,
    );
    await expect(gmail).toHaveAttribute("target", "_blank");

    const mailApp = page.getByRole("link", { name: "Open mail app" });
    await expect(mailApp).toHaveAttribute("href", profile.contact.mailtoHref);
  });
});

test.describe("deprecated build-log route removal", () => {
  test("public navigation and homepage do not expose the removed feature", async ({ page, request }) => {
    await page.goto("/");

    const primaryNav = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(primaryNav.getByRole("link", { name: /challenge/i })).toHaveCount(0);

    const publicChallengeLinks = await page.locator('a[href="/challenge"], a[href^="/challenge"]').count();
    expect(publicChallengeLinks).toBe(0);

    await expect(page.locator("main")).not.toContainText(/\bChallenge\b/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Open navigation" }).click();
    const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(mobileNav.getByRole("link", { name: /challenge/i })).toHaveCount(0);

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).not.toContain("/challenge");
  });

  test("direct deprecated route navigation redirects to selected work", async ({ page }) => {
    await page.goto("/challenge");

    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.locator("main")).not.toContainText(/\bChallenge\b/);
    await expect(page.locator("#work")).toBeAttached();
  });
});

test.describe("redesigned portfolio interactions", () => {
  test("homepage project click opens intercepted modal", async ({ page }) => {
    await scrollToFirstProject(page);
    
    const trigger = page.locator("#project-trigger-legolas-ai");
    await trigger.click();
    
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute("aria-modal", "true");
    
    await expect(page).toHaveURL(/\/work\/legolas-ai$/);
    const heading = page.locator("#work");
    await expect(heading).toBeAttached();
  });

  test("direct project URL renders standalone page", async ({ page }) => {
    await page.goto("/work/legolas-ai");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.locator("h1")).toContainText("Legolas AI");
  });

  test("refreshing an open project URL renders standalone page", async ({ page }) => {
    await scrollToFirstProject(page);
    await page.locator("#project-trigger-legolas-ai").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    
    await page.reload();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.locator("h1")).toContainText("Legolas AI");
  });

  test("browser Back closes the modal and Forward reopens it", async ({ page }) => {
    await scrollToFirstProject(page);
    await page.locator("#project-trigger-legolas-ai").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    
    await page.goBack();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page).toHaveURL(/\/$/);
    
    await page.goForward();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page).toHaveURL(/\/work\/legolas-ai$/);
  });

  test("catch-all route clears stale modal state", async ({ page }) => {
    await scrollToFirstProject(page);
    await page.locator("#project-trigger-legolas-ai").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    
    await page.goto("/resume");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.locator("h1")).toContainText("Resume");
  });

  test("unknown slug returns 404", async ({ page }) => {
    const response = await page.goto("/work/unknown-project-slug");
    expect(response?.status()).toBe(404);
  });

  test("focus is trapped inside the modal and returns to the original preview", async ({ page }) => {
    await scrollToFirstProject(page);
    const trigger = page.locator("#project-trigger-legolas-ai");
    await trigger.focus();
    await trigger.click();
    
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    
    const closeBtn = modal.getByRole("button", { name: "Close dialog" });
    await expect(closeBtn).toBeFocused();
    
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("scroll position is restored and background does not scroll", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await waitForExplorerGeometry(page);

    const targets = await getExplorerTargets(page);
    await scrollExplorerToProgress(page, targets.navigationStart);
    const trigger = page.locator("#project-trigger-legolas-ai");
    await expect(trigger).toBeInViewport();
    
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    expect(scrollYBefore).toBeGreaterThan(0);
    
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    
    const overflow = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
    expect(overflow).toBe("hidden");
    
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    expect(Math.abs(scrollYAfter - scrollYBefore)).toBeLessThan(20);
  });

  test("no project text depends on hover for visibility", async ({ page }) => {
    await scrollToFirstProject(page);

    const hiddenVisibleText = await page.locator("#work").evaluate((root) => {
      function cumulativeOpacity(element: Element) {
        let opacity = 1;
        let current: Element | null = element;

        while (current) {
          opacity *= Number(window.getComputedStyle(current).opacity);
          current = current.parentElement;
        }

        return opacity;
      }

      return Array.from(root.querySelectorAll("p, h1, h2, span, a"))
        .filter((node) => {
          const rect = node.getBoundingClientRect();
          const styles = window.getComputedStyle(node);

          return (
            node.textContent?.trim() &&
            !node.closest('[aria-hidden="true"]') &&
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom > 0 &&
            rect.top < window.innerHeight &&
            styles.display !== "none" &&
            styles.visibility !== "hidden" &&
            cumulativeOpacity(node) < 0.05
          );
        })
        .map((node) => node.textContent?.trim());
    });

    expect(hiddenVisibleText).toEqual([]);
  });

  test("the website remains dark across homepage sections", async ({ page }) => {
    await page.goto("/");
    const sections = ["#work", "#process", "#about", "#contact"];
    for (const selector of sections) {
      const el = page.locator(selector);
      await expect(el).toBeAttached();
      
      const bgColor = await el.evaluate((node) => window.getComputedStyle(node).backgroundColor);
      const rgb = bgColor.match(/\d+/g);
      if (rgb) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        expect(brightness).toBeLessThan(60);
      }
    }
  });

  test("process horizon is compact, accessible, and preserves the process order", async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("portfolio-loaded", "true"));
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.locator("#process").scrollIntoViewIfNeeded();

    const expectedSteps = processSteps.map((step) => step.verb);
    const renderedSteps = await page.locator("#process [data-process-desktop] [data-process-step]").evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("data-process-step")),
    );
    expect(renderedSteps).toEqual(expectedSteps);

    await expect(page.locator("[data-process-planet-body]")).toBeVisible();
    await expect(page.locator("[data-process-rim-light]")).toBeVisible();
    await expect(page.locator("[data-process-planet]")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("[data-process-planet]")).toHaveCSS("pointer-events", "none");
    await expect(page.getByRole("heading", { name: "How I Build" })).toBeVisible();
    await expect(page.locator("#process [data-process-desktop] [data-process-node-state='active']")).toHaveAttribute(
      "data-process-step",
      "Discover",
    );
    await expect(page.locator("#process [data-process-desktop] [aria-current='step']")).toHaveAttribute(
      "data-process-step",
      "Discover",
    );
    await expect(page.locator("[data-process-active-indicator]")).toBeVisible();
    await expect(page.locator("[data-process-active-detail]")).toHaveCount(0);
    await expect(page.getByText("SYSTEM_STAGE", { exact: false })).toHaveCount(0);
    await expect(page.getByText("TRACE EVIDENCE", { exact: false })).toHaveCount(0);

    await page.locator("#process [data-process-desktop] [data-process-step='Build']").click();
    await expect(page.locator("#process [data-process-desktop] [data-process-node-state='active']")).toHaveAttribute(
      "data-process-step",
      "Build",
    );
    await expect(page.locator("#process [data-process-desktop] [aria-current='step']")).toHaveAttribute(
      "data-process-step",
      "Build",
    );
    await expect(page.getByText(processSteps[3].action, { exact: true })).toHaveCount(0);

    const geometry = await page.locator("#process").evaluate((section) => {
      const process = section as HTMLElement;
      const labels = [...process.querySelectorAll<HTMLElement>("[data-process-desktop] [data-process-step] > span:last-child")];
      const labelBottom = Math.max(...labels.map((label) => label.getBoundingClientRect().bottom));
      const rimTop = process.querySelector<HTMLElement>("[data-process-rim-light]")?.getBoundingClientRect().top;
      const sectionRect = process.getBoundingClientRect();

      return {
        height: process.offsetHeight,
        labelToRim: rimTop === undefined ? null : rimTop - labelBottom,
        sectionTop: sectionRect.top,
      };
    });
    expect(geometry.height).toBeGreaterThanOrEqual(540);
    expect(geometry.height).toBeLessThanOrEqual(720);
    expect(geometry.labelToRim).not.toBeNull();
    expect(geometry.labelToRim ?? 0).toBeGreaterThanOrEqual(32);
    expect(geometry.labelToRim ?? 0).toBeLessThanOrEqual(72);

    const contrast = await page.locator("[data-process-supporting-copy]").evaluate((copy) => {
      const parseRgb = (value: string) => (value.match(/\d+(?:\.\d+)?/g) ?? []).slice(0, 3).map(Number);
      const linearize = (value: number) => {
        const normalized = value / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      };
      const luminance = ([red, green, blue]: number[]) =>
        0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
      const text = luminance(parseRgb(window.getComputedStyle(copy).color));
      const background = luminance(parseRgb(window.getComputedStyle(document.getElementById("process")!).backgroundColor));

      return (Math.max(text, background) + 0.05) / (Math.min(text, background) + 0.05);
    });
    expect(contrast).toBeGreaterThanOrEqual(4.5);

    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 1280, height: 800 },
      { width: 1366, height: 768 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(horizontalOverflow).toBeLessThanOrEqual(1);
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("#process").scrollIntoViewIfNeeded();
    await expect(page.locator("[data-process-mobile]")).toBeVisible();
    await expect(page.locator("[data-process-desktop]")).toBeHidden();
    const mobileFlow = await page.locator("[data-process-mobile] [data-process-step]").evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return { left: rect.left, top: rect.top };
      }),
    );
    expect(mobileFlow).toHaveLength(processSteps.length);
    for (let index = 1; index < mobileFlow.length; index += 1) {
      expect(mobileFlow[index].top).toBeGreaterThan(mobileFlow[index - 1].top);
      expect(Math.abs(mobileFlow[index].left - mobileFlow[0].left)).toBeLessThanOrEqual(2);
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.locator("#process").scrollIntoViewIfNeeded();
    await expect(page.locator("[data-process-planet]")).toBeVisible();
    const reducedMotionStyles = await page.locator("#process [data-process-desktop] [data-process-step]").first().evaluate((node) => {
      const styles = window.getComputedStyle(node);
      return { animationName: styles.animationName, transitionDuration: styles.transitionDuration };
    });
    expect(reducedMotionStyles.animationName).toBe("none");
    const reducedTransitionDuration = Number.parseFloat(reducedMotionStyles.transitionDuration);
    const reducedTransitionMilliseconds = reducedMotionStyles.transitionDuration.endsWith("ms")
      ? reducedTransitionDuration
      : reducedTransitionDuration * 1_000;
    expect(reducedTransitionMilliseconds).toBeLessThanOrEqual(0.01);
  });

  test("work layers remain out of identity and reveal only during late portal", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await waitForExplorerGeometry(page);

    const targets = await getExplorerTargets(page);
    const stage = page.locator("#project-explorer-stage");
    const explorer = page.locator("[data-explorer-layer]");
    const title = page.locator('[data-explorer-slot="left-title"]');
    const metadata = page.locator('[data-explorer-slot="right-metadata"]');
    const projectCta = page.locator('[data-explorer-slot="cta"]');
    const connector = page.locator('[data-explorer-slot="connector"]');
    const preview = page.locator("#project-trigger-legolas-ai");
    const persistentD = page.locator("[data-persistent-d]");
    const heroCopy = page.locator("[data-hero-identity-headline]");
    const heroCta = page.getByRole("button", { name: "Explore Selected Work" });

    await expect(stage).toHaveAttribute("data-home-stage-phase", "identity");
    await expect(explorer).toHaveCSS("visibility", "hidden");
    await expect(explorer).toHaveCSS("opacity", "0");
    await expect(explorer).toHaveCSS("pointer-events", "none");
    await expect(explorer).toHaveAttribute("aria-hidden", "true");
    await expect(title).toHaveCSS("visibility", "hidden");
    await expect(title).toHaveCSS("opacity", "0");
    await expect(title).toHaveAttribute("aria-hidden", "true");
    await expect(metadata).toHaveCSS("visibility", "hidden");
    await expect(metadata).toHaveCSS("opacity", "0");
    await expect(metadata).toHaveAttribute("aria-hidden", "true");
    await expect(projectCta).toHaveCSS("visibility", "hidden");
    await expect(connector).toHaveCSS("visibility", "hidden");
    await expect(preview).toHaveCSS("pointer-events", "none");
    await expect(preview).toHaveAttribute("tabindex", "-1");
    await expect(persistentD).toBeVisible();
    await expect(persistentD).toHaveAttribute("aria-hidden", "true");
    await expect(persistentD).toHaveCSS("pointer-events", "none");
    expect(await getCumulativeOpacity(page, "[data-persistent-d] [data-liquid-d]")).toBeGreaterThan(0);
    await expect(heroCopy).toBeVisible();
    await expect(heroCta).toBeVisible();

    const initialVisualState = await page.evaluate(() => {
      const d = document.querySelector("[data-persistent-d]");
      const explorerLayer = document.querySelector("[data-explorer-layer]");
      const previewLink = document.querySelector("#project-trigger-legolas-ai");
      if (!d || !explorerLayer || !previewLink) throw new Error("Identity layers missing");

      const dRect = d.getBoundingClientRect();
      const previewRect = previewLink.getBoundingClientRect();
      const overlapsD =
        previewRect.left < dRect.right &&
        previewRect.right > dRect.left &&
        previewRect.top < dRect.bottom &&
        previewRect.bottom > dRect.top;
      const explorerStyles = window.getComputedStyle(explorerLayer);

      return {
        explorerOpacity: Number(explorerStyles.opacity),
        explorerVisibility: explorerStyles.visibility,
        overlapsD,
        previewCanCoverD: overlapsD && explorerStyles.visibility !== "hidden" && Number(explorerStyles.opacity) > 0,
      };
    });
    expect(initialVisualState.explorerVisibility).toBe("hidden");
    expect(initialVisualState.explorerOpacity).toBe(0);
    expect(initialVisualState.previewCanCoverD).toBe(false);

    const ctaTarget = await page.evaluate(() => {
      const explorerStage = document.getElementById("project-explorer-stage");
      if (!explorerStage) throw new Error("Project explorer stage missing");

      const stageTop = explorerStage.getBoundingClientRect().top + window.scrollY;
      const navigationStart = Number(explorerStage.dataset.navigationStart);
      return stageTop + (explorerStage.offsetHeight - window.innerHeight) * navigationStart;
    });
    await heroCta.click();
    await page.waitForFunction((expectedY) => Math.abs(window.scrollY - expectedY) < 3, ctaTarget);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(stage).toHaveAttribute("data-home-stage-phase", "navigation");
    await expect(stage).toHaveAttribute("data-active-slug", "legolas-ai");

    await scrollExplorerToProgress(page, targets.earlyIdentity);
    await expect(stage).toHaveAttribute("data-home-stage-phase", "identity");
    await expect(explorer).toHaveCSS("visibility", "hidden");
    await expect(explorer).toHaveCSS("opacity", "0");
    await expect(title).toHaveCSS("visibility", "hidden");
    await expect(metadata).toHaveCSS("visibility", "hidden");

    await scrollExplorerToProgress(page, targets.earlyPortal);
    await expect(stage).toHaveAttribute("data-home-stage-phase", "portal");
    expect(await getCumulativeOpacity(page, "[data-persistent-d] [data-liquid-d]")).toBeGreaterThan(0);
    await expect(explorer).toHaveCSS("opacity", "0");
    await expect(title).toHaveCSS("opacity", "0");
    await expect(metadata).toHaveCSS("opacity", "0");
    await expect(preview).toHaveCSS("pointer-events", "none");
    await expect(preview).toHaveAttribute("tabindex", "-1");

    await scrollExplorerToProgress(page, targets.latePortal);
    await expect(stage).toHaveAttribute("data-home-stage-phase", "portal");
    const latePortalOpacities = await page.evaluate(() => {
      const selectors = ["[data-explorer-layer]", '[data-explorer-slot="left-title"]', '[data-explorer-slot="right-metadata"]'];
      return selectors.map((selector) => {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Missing ${selector}`);
        return Number(window.getComputedStyle(element).opacity);
      });
    });
    expect(latePortalOpacities.every((opacity) => opacity > 0 && opacity < 1)).toBe(true);
    await expect(preview).toHaveCSS("pointer-events", "none");
    await expect(preview).toHaveAttribute("tabindex", "-1");

    await scrollExplorerToProgress(page, targets.navigationStart);
    await expect(explorer).toHaveCSS("visibility", "visible");
    await expect(explorer).toHaveCSS("opacity", "1");
    await expect(preview).toHaveCSS("pointer-events", "auto");
    await expect(preview).toHaveAttribute("tabindex", "0");
    await expectExplorerSlugAlignment(page, "legolas-ai");
  });

  test("identity scroll cue fades with the identity phase and remains decorative", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await waitForExplorerGeometry(page);

    const targets = await getExplorerTargets(page);
    const stage = page.locator("#project-explorer-stage");
    const cue = page.locator("[data-scroll-cue]");

    await expect(stage).toHaveAttribute("data-home-stage-phase", "identity");
    await expect(cue).toBeVisible();
    await expect(cue).toHaveText("SCROLL TO EXPLORE");
    await expect(cue).toHaveCSS("pointer-events", "none");
    await expect(cue).toHaveAttribute("aria-hidden", "true");
    expect(await page.locator("body").ariaSnapshot()).not.toContain("SCROLL TO EXPLORE");

    const topOpacity = Number(await cue.evaluate((node) => window.getComputedStyle(node).opacity));
    await scrollExplorerToProgress(page, targets.earlyIdentity);
    const earlyIdentityOpacity = Number(await cue.evaluate((node) => window.getComputedStyle(node).opacity));
    expect(earlyIdentityOpacity).toBeGreaterThan(0);
    expect(earlyIdentityOpacity).toBeLessThanOrEqual(topOpacity);

    await scrollExplorerToProgress(page, targets.portalStart * 0.9);
    const prePortalOpacity = Number(await cue.evaluate((node) => window.getComputedStyle(node).opacity));
    expect(prePortalOpacity).toBeGreaterThan(0);
    expect(prePortalOpacity).toBeLessThan(earlyIdentityOpacity);

    await scrollExplorerToProgress(page, targets.portalStart);
    await expect(stage).toHaveAttribute("data-home-stage-phase", "portal");
    await expect(cue).toBeHidden();

    await scrollExplorerToProgress(page, targets.navigationStart);
    await expect(stage).toHaveAttribute("data-home-stage-phase", "navigation");
    await expect(cue).toBeHidden();

    await scrollExplorerToProgress(page, targets.earlyIdentity);
    await expect(stage).toHaveAttribute("data-home-stage-phase", "identity");
    await expect(cue).toBeVisible();
  });

  test("phase gates synchronize after top refresh and browser Back scroll restoration", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await waitForExplorerGeometry(page);

    const stage = page.locator("#project-explorer-stage");
    const explorer = page.locator("[data-explorer-layer]");
    const targets = await getExplorerTargets(page);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.reload();
    await waitForExplorerGeometry(page);
    await expect(stage).toHaveAttribute("data-home-stage-phase", "identity");
    await expect(explorer).toHaveCSS("visibility", "hidden");
    await expect(explorer).toHaveCSS("opacity", "0");

    await scrollExplorerToProgress(page, targets.navigationStart);
    await expect(stage).toHaveAttribute("data-home-stage-phase", "navigation");
    await expect(explorer).toHaveCSS("visibility", "visible");
    await expect(explorer).toHaveCSS("opacity", "1");

    await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Resume" }).click();
    await expect(page).toHaveURL(/\/resume$/);
    await page.goBack();
    await waitForExplorerGeometry(page);
    await expect(stage).toHaveAttribute("data-home-stage-phase", "navigation");
    await expect(explorer).toHaveCSS("visibility", "visible");
    await expect(explorer).toHaveCSS("opacity", "1");
  });

  test("orbital project nodes derive from canonical project data and sync with active slug", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await waitForExplorerGeometry(page);

    const canonicalNodes = featuredProjects.map((project) => ({
      slug: project.slug,
      label: `Select ${project.title}`,
      tagName: "BUTTON",
    }));
    const renderedNodes = await page
      .locator("[data-desktop-orbital-project-nodes] [data-project-node]")
      .evaluateAll((nodes) =>
        nodes.map((node) => ({
          slug: node.getAttribute("data-project-slug"),
          label: node.getAttribute("aria-label"),
          tagName: node.tagName,
        })),
      );

    expect(renderedNodes).toEqual(canonicalNodes);

    const targets = await getExplorerTargets(page);
    await scrollExplorerToProgress(page, targets.navigationStart);
    await expectExplorerSlugAlignment(page, "legolas-ai");

    await scrollExplorerToProgress(page, targets.secondCentered);
    await expectExplorerSlugAlignment(page, "hanoiworld");

    await scrollExplorerToProgress(page, targets.navigationEnd);
    await expectExplorerSlugAlignment(page, "powfolio");
  });

  test("scroll drives orbital project coordinates around D instead of a fixed node rail", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await waitForExplorerGeometry(page);

    const targets = await getExplorerTargets(page);
    const firstNodeHandle = await page
      .locator('[data-desktop-orbital-project-nodes] [data-project-node][data-project-slug="legolas-ai"]')
      .elementHandle();
    expect(firstNodeHandle).not.toBeNull();

    await scrollExplorerToProgress(page, targets.navigationStart);
    const legolasActive = await getOrbitalNodeCenters(page);
    await expectExplorerSlugAlignment(page, "legolas-ai");

    await scrollExplorerToProgress(page, targets.firstSecondMidpoint);
    const betweenLegolasAndHanoi = await getOrbitalNodeCenters(page);

    await scrollExplorerToProgress(page, targets.secondCentered);
    const hanoiActive = await getOrbitalNodeCenters(page);
    await expectExplorerSlugAlignment(page, "hanoiworld");

    await scrollExplorerToProgress(page, targets.navigationEnd);
    const powfolioActive = await getOrbitalNodeCenters(page);
    await expectExplorerSlugAlignment(page, "powfolio");

    const legolasFocal = nodeCenter(legolasActive, "legolas-ai");
    const hanoiFocal = nodeCenter(hanoiActive, "hanoiworld");
    const powfolioFocal = nodeCenter(powfolioActive, "powfolio");
    expect(centerDistance(legolasFocal, hanoiFocal)).toBeLessThan(8);
    expect(centerDistance(hanoiFocal, powfolioFocal)).toBeLessThan(8);

    const movedDistance = centerDistance(
      nodeCenter(legolasActive, "hanoiworld"),
      nodeCenter(betweenLegolasAndHanoi, "hanoiworld"),
    );
    expect(movedDistance).toBeGreaterThan(36);

    for (const sample of [legolasActive, hanoiActive, powfolioActive]) {
      const xValues = sample.map((node) => node.x);
      const yValues = sample.map((node) => node.y);
      expect(Math.max(...xValues) - Math.min(...xValues)).toBeGreaterThan(180);
      expect(Math.max(...yValues) - Math.min(...yValues)).toBeGreaterThan(120);
    }

    const dOpacity = await getCumulativeOpacity(page, "[data-persistent-d] [data-liquid-d]");
    const orbitPathOpacity = await getCumulativeOpacity(page, "[data-orbit-paths]");
    expect(dOpacity).toBeGreaterThan(0.35);
    expect(orbitPathOpacity).toBeGreaterThan(0.18);

    await scrollExplorerToProgress(page, targets.navigationStart);
    const reversedToLegolas = await getOrbitalNodeCenters(page);
    expect(centerDistance(nodeCenter(reversedToLegolas, "legolas-ai"), legolasFocal)).toBeLessThan(8);
    expect(centerDistance(nodeCenter(reversedToLegolas, "hanoiworld"), nodeCenter(legolasActive, "hanoiworld"))).toBeLessThan(8);
    await expectExplorerSlugAlignment(page, "legolas-ai");

    const stillSameElement = await firstNodeHandle?.evaluate(
      (node) => node.isConnected && node.getAttribute("data-project-slug") === "legolas-ai",
    );
    expect(stillSameElement).toBe(true);
  });

  test("identity uses a measured supporting headline and a dominant liquid serif D", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForExplorerGeometry(page);

    const headline = page.locator("[data-hero-identity-headline]");
    const nav = page.getByRole("navigation", { name: "Primary navigation" });
    const liquidD = page.locator("[data-persistent-d] [data-liquid-d]");
    const dimensions = await Promise.all([headline.boundingBox(), nav.boundingBox(), liquidD.boundingBox()]);
    const [headlineBox, navBox, dBox] = dimensions;

    expect(headlineBox).not.toBeNull();
    expect(navBox).not.toBeNull();
    expect(dBox).not.toBeNull();
    expect(headlineBox?.width).toBeLessThanOrEqual(391);
    expect(headlineBox?.y).toBeGreaterThan((navBox?.y ?? 0) + (navBox?.height ?? 0) + 16);
    expect(dBox?.height).toBeGreaterThan(headlineBox?.height ?? 0);
    await expect(liquidD).toHaveAttribute("data-liquid-d-variant", "portal");
    await expect(page.locator("[data-persistent-d] .font-sans.font-black")).toHaveCount(0);
  });

  test("identity starts with comparable unlabelled liquid planets and morphs the same elements into nodes", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await waitForExplorerGeometry(page);

    const stage = page.locator("#project-explorer-stage");
    const nodes = page.locator("[data-desktop-orbital-project-nodes] [data-project-node]");
    await expect(stage).toHaveAttribute("data-home-stage-phase", "identity");
    await expect(page.locator("[data-desktop-orbital-project-nodes]")).toHaveAttribute(
      "data-orbital-mode",
      "planet",
    );
    await expect(nodes).toHaveCount(3);
    expect(await nodes.evaluateAll((elements) => elements.map((element) => element.getAttribute("data-project-node-state")))).toEqual([
      "planet",
      "planet",
      "planet",
    ]);

    const startingOpacities = await nodes.evaluateAll((elements) =>
      elements.map((element) => Number(window.getComputedStyle(element).opacity)),
    );
    expect(Math.max(...startingOpacities) - Math.min(...startingOpacities)).toBeLessThan(0.02);

    const hanoiNode = page.getByRole("button", { name: "Select HanoiWorld" });
    await hanoiNode.focus();
    await expect(hanoiNode).toBeFocused();
    await expect(hanoiNode.locator("xpath=./span[last()]")).toHaveCSS("opacity", "0");

    const targets = await getExplorerTargets(page);
    await scrollExplorerToProgress(page, targets.portalMidpoint);
    await expect(page.locator("[data-desktop-orbital-project-nodes]")).toHaveAttribute(
      "data-orbital-mode",
      "morphing",
    );
    await expect(nodes).toHaveCount(3);
    await expect(nodes.nth(0).locator("[data-project-node-label]")).not.toHaveCSS("opacity", "0");
  });

  test("orbital controls use native scroll selection without opening a case study", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await waitForExplorerGeometry(page);

    for (const project of featuredProjects) {
      const node = page.getByRole("button", { name: `Select ${project.title}` });
      await expect(node).toBeVisible();
      await node.focus();
      await expect(node).toBeFocused();
    }

    const hanoiNode = page.getByRole("button", { name: "Select HanoiWorld" });
    await hanoiNode.focus();
    await hanoiNode.click();
    await expect.poll(() => getActiveExplorerSlug(page)).toBe("hanoiworld");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);

    const powfolioNode = page.getByRole("button", { name: "Select Powfolio" });
    await powfolioNode.focus();
    await powfolioNode.click();
    await expect.poll(() => getActiveExplorerSlug(page)).toBe("powfolio");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("preview emphasis and node fading normalize at every centered project", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await waitForExplorerGeometry(page);
    const targets = await getExplorerTargets(page);

    const expectCenteredPreview = async (slug: ExplorerProjectSlug) => {
      const state = await getPreviewVisualState(page, slug);
      expect(state.previewState).toBe("active");
      expect(state.activeSlug).toBe(slug);
      expect(state.mediaAttribute).toBe("1");
      expect(state.scrimAttribute).toBe("clear");
      expect(state.activeEdgeAttribute).toBe("1");
      expect(state.mediaBackgroundColor).toBe("rgb(7, 16, 20)");
      expect(state.wrapperOpacity).toBeGreaterThan(0.99);
      expect(state.mediaOpacity).toBeGreaterThan(0.99);
      expect(state.scrimOpacity).toBeLessThan(0.01);
      expect(state.edgeOpacity).toBeGreaterThan(0.99);
      expect(
        await page.locator("[data-explorer-layer]").evaluate((node) => Number(window.getComputedStyle(node).opacity)),
      ).toBeGreaterThan(0.99);
    };

    await scrollExplorerToProgress(page, targets.navigationStart);
    await expectCenteredPreview("legolas-ai");
    await scrollExplorerToProgress(page, targets.firstSecondMidpoint + 0.01);
    await expectExplorerSlugAlignment(page, "hanoiworld");
    await expectCenteredPreview("hanoiworld");

    const legolasInactive = await getPreviewVisualState(page, "legolas-ai");
    expect(legolasInactive.previewState).toBe("inactive");
    expect(legolasInactive.mediaOpacity).toBeLessThan(0.9);
    expect(legolasInactive.scrimOpacity).toBeGreaterThan(0.25);

    await scrollExplorerToProgress(page, targets.secondCentered);
    await expectCenteredPreview("hanoiworld");
    await scrollExplorerToProgress(page, targets.secondThirdMidpoint + 0.01);
    await expectExplorerSlugAlignment(page, "powfolio");
    await expectCenteredPreview("powfolio");
    await scrollExplorerToProgress(page, targets.navigationEnd);
    await expectCenteredPreview("powfolio");

    const legolasNode = page.locator('[data-desktop-orbital-project-nodes] [data-project-node][data-project-slug="legolas-ai"]');
    const hanoiNode = page.locator('[data-desktop-orbital-project-nodes] [data-project-node][data-project-slug="hanoiworld"]');
    const powfolioNode = page.locator('[data-desktop-orbital-project-nodes] [data-project-node][data-project-slug="powfolio"]');
    expect(Number(await legolasNode.evaluate((node) => window.getComputedStyle(node).opacity))).toBeLessThan(0.14);
    expect(Number(await hanoiNode.evaluate((node) => window.getComputedStyle(node).opacity))).toBeLessThan(0.2);
    expect(Number(await powfolioNode.evaluate((node) => window.getComputedStyle(node).opacity))).toBeGreaterThan(0.98);
    await expect(powfolioNode.locator("[data-project-node-label]")).toHaveCSS("opacity", "1");
    await expect(legolasNode.locator("[data-project-node-label]")).toHaveCSS("opacity", "0");
    await expect(hanoiNode.locator("[data-project-node-label]")).toHaveCSS("opacity", "0");

    const dLayerZ = await page.locator("[data-persistent-d]").evaluate((node) => Number(window.getComputedStyle(node).zIndex));
    const explorerLayerZ = await page.locator("[data-explorer-layer]").evaluate((node) => Number(window.getComputedStyle(node).zIndex));
    expect(dLayerZ).toBeLessThan(explorerLayerZ);
  });

  test("decorative bubbles remain non-interactive and distinct from project nodes", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await waitForExplorerGeometry(page);

    await expect(page.locator("[data-desktop-orbital-project-nodes] [data-project-node]")).toHaveCount(3);
    await expect(page.locator("[data-ambient-future-bubble]")).toHaveCount(6);
    await expect(page.locator("[data-persistent-d] [data-d-base-bubble]")).toHaveCount(7);
    await expect(page.locator("[data-ambient-future-bubbles]")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("[data-persistent-d]")).toHaveAttribute("aria-hidden", "true");

    const ambientBubbleState = await page.locator("[data-ambient-future-bubble]").evaluateAll((nodes) =>
      nodes.map((node) => ({
        activeSlug: node.getAttribute("data-active-slug"),
        ariaHidden: node.getAttribute("aria-hidden"),
        pointerEvents: window.getComputedStyle(node).pointerEvents,
        projectSlug: node.getAttribute("data-project-slug"),
      })),
    );

    expect(ambientBubbleState.every((node) => node.ariaHidden === "true")).toBe(true);
    expect(ambientBubbleState.every((node) => node.pointerEvents === "none")).toBe(true);
    expect(ambientBubbleState.every((node) => node.projectSlug === null && node.activeSlug === null)).toBe(true);

    const baseBubblePointerEvents = await page.locator("[data-persistent-d] [data-d-base-bubble]").evaluateAll((nodes) =>
      nodes.map((node) => window.getComputedStyle(node).pointerEvents),
    );
    expect(baseBubblePointerEvents.every((value) => value === "none")).toBe(true);
  });

  test("reduced motion uses the shared liquid D and static deterministic bubbles", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const bubbles = page.locator('#work > .container-shell [data-orbital-project-nodes][data-orbital-mode="planet"] [data-project-node]');
    await expect(page.locator("#project-explorer-stage")).toBeHidden();
    await expect(page.locator('[data-liquid-d-variant="compact"]')).toBeVisible();
    await expect(bubbles).toHaveCount(3);
    const firstBefore = await bubbles.nth(0).boundingBox();
    await page.waitForTimeout(250);
    expect(await bubbles.nth(0).boundingBox()).toEqual(firstBefore);

    const dBaseBubbles = page.locator('#work [data-liquid-d-variant="compact"] [data-d-base-bubble]');
    await expect(dBaseBubbles).toHaveCount(3);
    const dBubbleBefore = await dBaseBubbles.nth(0).boundingBox();
    await page.waitForTimeout(250);
    expect(await dBaseBubbles.nth(0).boundingBox()).toEqual(dBubbleBefore);
  });

  test("HanoiWorld uses a simulation homepage preview and a labelled dot-free diagram fallback", async ({ page }) => {
    const hanoiWorld = getProjectBySlug("hanoiworld");
    expect(hanoiWorld?.visual.kind).toBe("simulation");
    expect(hanoiWorld?.visual.src).toBe("/projects/hanoiworld/roundabout-simulation.png");
    expect(hanoiWorld?.gallery.some((item) => item.kind === "diagram" && /system diagram/i.test(item.caption ?? ""))).toBe(true);

    const diagramSvg = readFileSync("public/projects/hanoiworld/world-model.svg", "utf8");
    expect(diagramSvg).not.toContain("<circle");
    expect(diagramSvg).toContain("DRIVING SCENE");
    expect(diagramSvg).toContain("OBSERVATION ENCODER");
    expect(diagramSvg).toContain("LATENT DYNAMICS");
    expect(diagramSvg).toContain("CONTROL POLICY");
    expect(diagramSvg).toContain("SCENARIO EVALUATION");

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await waitForExplorerGeometry(page);
    const targets = await getExplorerTargets(page);

    await scrollExplorerToProgress(page, targets.secondCentered);
    await expectExplorerSlugAlignment(page, "hanoiworld");
    await expect(page.locator('#project-trigger-hanoiworld [data-preview-kind="simulation"]')).toBeVisible();
    await expect(page.locator("#project-trigger-hanoiworld")).toContainText("[SIMULATION]");
  });

  test("mobile uses the normal project flow with the D node motif", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.locator("#project-explorer-stage")).toBeHidden();
    await expect(page.locator("#project-list")).toBeVisible();
    const visibleNodeCount = await page
      .locator("[data-orbital-project-nodes] [data-project-node]")
      .evaluateAll((nodes) =>
        nodes.filter((node) => {
          const rect = node.getBoundingClientRect();
          const styles = window.getComputedStyle(node);

          return rect.width > 0 && rect.height > 0 && styles.display !== "none";
        }).length,
      );
    expect(visibleNodeCount).toBe(3);

    for (const slug of explorerProjectSlugs) {
      const fallbackTrigger = page.locator(`#project-trigger-fallback-${slug}`);
      await expect(fallbackTrigger).toBeVisible();
      await expect(fallbackTrigger).toHaveAttribute("href", `/work/${slug}`);
    }
  });

  test("reduced motion uses static project flow instead of sticky rail", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    await expect(page.locator("#project-explorer-stage")).toBeHidden();
    await expect(page.locator("#project-list")).toBeVisible();
    await expect(page.locator("#project-rail-track")).toBeHidden();

    for (const slug of explorerProjectSlugs) {
      await expect(page.locator(`#project-trigger-fallback-${slug}`)).toHaveAttribute(
        "href",
        `/work/${slug}`,
      );
    }
  });

  test("project transform changes continuously and monotonically through scroll", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await waitForExplorerGeometry(page);

    const targets = await getExplorerTargets(page);

    await scrollExplorerToProgress(page, targets.navigationStart);
    const y0 = await getRailTransformY(page);

    await scrollExplorerToProgress(page, targets.secondCentered);
    const y1 = await getRailTransformY(page);

    await scrollExplorerToProgress(page, targets.navigationEnd);
    const y2 = await getRailTransformY(page);
    
    expect(y1).toBeLessThan(y0);
    expect(y2).toBeLessThan(y1);
  });

  test("project explorer respects the late-portal reveal across every sticky phase", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/?debugExplorer=1");
    await waitForExplorerGeometry(page);
    await expect(page.locator("[data-explorer-debug]")).toBeVisible();

    const targets = await getExplorerTargets(page);
    const samples = [
      { label: "identity start", progress: targets.identityStart, previewVisible: false },
      { label: "portal midpoint", progress: targets.portalMidpoint, previewVisible: false },
      { label: "project navigation start", progress: targets.navigationStart, previewVisible: true },
      { label: "first-to-second midpoint", progress: targets.firstSecondMidpoint, previewVisible: true },
      { label: "second project centered", progress: targets.secondCentered, previewVisible: true },
      { label: "second-to-third midpoint", progress: targets.secondThirdMidpoint, previewVisible: true },
      { label: "third project centered", progress: targets.navigationEnd, previewVisible: true },
      { label: "exit midpoint", progress: targets.exitMidpoint, previewVisible: true },
      { label: "sticky release", progress: targets.stickyRelease, previewVisible: true },
    ];

    for (const sample of samples) {
      await test.step(sample.label, async () => {
        await scrollExplorerToProgress(page, sample.progress);
        if (sample.previewVisible) {
          await expectAnyProjectIntersectsViewport(page);
        } else {
          await expect(page.locator("[data-explorer-layer]")).toHaveCSS("opacity", "0");
        }
        const activeSlug = await getActiveExplorerSlug(page);
        expect(explorerProjectSlugs).toContain(activeSlug as ExplorerProjectSlug);
        await expectExplorerSlugAlignment(page, activeSlug as ExplorerProjectSlug);
      });
    }

    await scrollExplorerToProgress(page, targets.navigationStart);
    await expectExplorerSlugAlignment(page, "legolas-ai");
    await expectPreviewCentered(page, "legolas-ai");

    await scrollExplorerToProgress(page, targets.secondCentered);
    await expectExplorerSlugAlignment(page, "hanoiworld");
    await expectPreviewCentered(page, "hanoiworld");

    await scrollExplorerToProgress(page, targets.navigationEnd);
    await expectExplorerSlugAlignment(page, "powfolio");
    await expectPreviewCentered(page, "powfolio");

    const railYAtNavigationEnd = await getRailTransformY(page);
    await scrollExplorerToProgress(page, targets.exitMidpoint);
    const railYAtExitMidpoint = await getRailTransformY(page);
    expect(Math.abs(railYAtExitMidpoint - railYAtNavigationEnd)).toBeLessThan(1);

    await page.evaluate(() => {
      const stage = document.getElementById("project-explorer-stage");
      if (!stage) throw new Error("Project explorer stage missing");

      const stageTop = stage.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, stageTop + stage.offsetHeight + 120);
    });
    await expect(page.locator("#process")).toBeInViewport();
  });

  test("project explorer survives fast forward and reverse scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/?debugExplorer=1");
    await waitForExplorerGeometry(page);

    const targets = await getExplorerTargets(page);
    const fastForwardProgress = [
      targets.navigationStart,
      targets.firstSecondMidpoint,
      targets.secondCentered,
      targets.secondThirdMidpoint,
      targets.navigationEnd,
    ];
    const seen = new Set<string>();

    for (const progress of fastForwardProgress) {
      await scrollExplorerToProgress(page, progress);
      await expectAnyProjectIntersectsViewport(page);
      const activeSlug = await getActiveExplorerSlug(page);
      if (activeSlug === null) throw new Error("Explorer active slug missing");
      seen.add(activeSlug);
      await expectExplorerSlugAlignment(page, activeSlug as ExplorerProjectSlug);
    }

    expect([...seen]).toEqual(expect.arrayContaining([...explorerProjectSlugs]));

    await scrollExplorerToProgress(page, targets.navigationEnd);
    await expectExplorerSlugAlignment(page, "powfolio");

    await scrollExplorerToProgress(page, targets.secondCentered);
    await expectExplorerSlugAlignment(page, "hanoiworld");
    await expectPreviewCentered(page, "hanoiworld");

    await scrollExplorerToProgress(page, targets.navigationStart);
    await expectExplorerSlugAlignment(page, "legolas-ai");
    await expectPreviewCentered(page, "legolas-ai");
  });
});
