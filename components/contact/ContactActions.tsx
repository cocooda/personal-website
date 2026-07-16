"use client";

import { Check, Clipboard, ExternalLink, Mail, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { buttonClassName } from "@/components/ui/buttonStyles";

type CopyStatus = "idle" | "success" | "error";

type ContactActionsProps = {
  email: string;
  mailtoHref: string;
};

export function ContactActions({ email, mailtoHref }: ContactActionsProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const [message, setMessage] = useState("");

  const gmailHref = useMemo(() => {
    const params = new URLSearchParams({
      view: "cm",
      fs: "1",
      to: email,
    });

    return `https://mail.google.com/mail/?${params.toString()}`;
  }, [email]);

  useEffect(() => {
    if (copyStatus !== "success") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopyStatus("idle");
      setMessage("");
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [copyStatus]);

  async function copyEmail() {
    if (!navigator.clipboard?.writeText) {
      setCopyStatus("error");
      setMessage("Clipboard access is unavailable. Select the email address above and copy it manually.");
      return;
    }

    try {
      await navigator.clipboard.writeText(email);
      setCopyStatus("success");
      setMessage("Email copied");
    } catch {
      setCopyStatus("error");
      setMessage("Copy failed. Select the email address above and copy it manually.");
    }
  }

  const copyLabel = copyStatus === "success" ? "Email copied" : "Copy email";

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-3">
        <button type="button" className={buttonClassName("primary")} onClick={copyEmail}>
          {copyStatus === "success" ? (
            <Check aria-hidden="true" size={16} />
          ) : (
            <Clipboard aria-hidden="true" size={16} />
          )}
          {copyLabel}
        </button>
        <a className={buttonClassName("secondary")} href={gmailHref} target="_blank" rel="noreferrer">
          <ExternalLink aria-hidden="true" size={16} />
          Open Gmail
        </a>
        <a className={buttonClassName("ghost")} href={mailtoHref}>
          <Mail aria-hidden="true" size={16} />
          Open mail app
        </a>
      </div>
      {message ? (
        <p
          className="mt-3 flex items-start gap-2 text-sm leading-6 text-secondary"
          role={copyStatus === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {copyStatus === "error" ? (
            <TriangleAlert aria-hidden="true" className="mt-1 shrink-0 text-danger" size={16} />
          ) : (
            <Check aria-hidden="true" className="mt-1 shrink-0 text-success" size={16} />
          )}
          <span>{message}</span>
        </p>
      ) : null}
    </div>
  );
}
