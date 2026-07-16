import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { buttonClassName } from "@/components/ui/buttonStyles";
import { profile } from "@/content/profile";

const resumeTitle = `${profile.name} Resume`;

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume for ${profile.name}, ${profile.role}.`,
  alternates: {
    canonical: profile.resume.pageHref,
  },
  openGraph: {
    title: resumeTitle,
    description: `Resume for ${profile.name}, ${profile.role}.`,
    url: profile.resume.pageHref,
    type: "website",
  },
};

export default function ResumePage() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-shell">
        <Link href="/" className={buttonClassName("ghost", "mb-6 px-0 hover:bg-transparent")}>
          <ArrowLeft aria-hidden="true" size={16} />
          Back to portfolio
        </Link>
        <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs font-bold uppercase text-steel">{profile.resume.label}</p>
            <h1 className="mt-3 text-4xl font-bold text-primary md:text-6xl">{resumeTitle}</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-secondary">
              Preview the PDF inside the portfolio, or use the download and raw-file actions if your browser does not
              support embedded PDF previews.
            </p>
            <p className="mt-3 text-sm leading-6 text-muted md:hidden">
              Mobile browsers may open PDFs outside the page. If the preview is blank, download the PDF or open the raw
              file.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className={buttonClassName("primary")} href={profile.resume.pdfHref} download={profile.resume.fileName}>
              <Download aria-hidden="true" size={16} />
              Download PDF
            </a>
            <a className={buttonClassName("secondary")} href={profile.resume.pdfHref}>
              <ExternalLink aria-hidden="true" size={16} />
              Open raw PDF
            </a>
          </div>
        </div>
        <div className="surface overflow-hidden rounded-lg">
          <object
            aria-label={`${resumeTitle} PDF preview`}
            className="h-[72vh] min-h-[520px] w-full bg-elevated"
            data={profile.resume.pdfHref}
            title={`${profile.name} resume PDF preview`}
            type="application/pdf"
          >
            <div className="grid min-h-[520px] place-items-center p-6 text-center">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold text-primary">Resume preview unavailable</h2>
                <p className="mt-3 text-base leading-7 text-secondary">
                  This browser cannot display the embedded PDF. Download the resume or open the raw PDF file instead.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    className={buttonClassName("primary")}
                    href={profile.resume.pdfHref}
                    download={profile.resume.fileName}
                  >
                    <Download aria-hidden="true" size={16} />
                    Download PDF
                  </a>
                  <a className={buttonClassName("secondary")} href={profile.resume.pdfHref}>
                    <ExternalLink aria-hidden="true" size={16} />
                    Open raw PDF
                  </a>
                </div>
              </div>
            </div>
          </object>
        </div>
      </div>
    </section>
  );
}
