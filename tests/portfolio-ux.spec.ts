import { expect, test, type Page } from "@playwright/test";
import { profile } from "../content/profile";

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

test.describe("existing portfolio interactions", () => {
  test("project quick view remains expandable and collapsible", async ({ page }) => {
    await page.goto("/#work");

    const quickView = page.getByRole("button", { name: "See evidence quick view" }).first();
    await expect(quickView).toHaveAttribute("aria-expanded", "false");

    await quickView.click();
    await expect(quickView).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("heading", { name: /evidence/i }).first()).toBeVisible();

    await quickView.click();
    await expect(quickView).toHaveAttribute("aria-expanded", "false");
  });
});
