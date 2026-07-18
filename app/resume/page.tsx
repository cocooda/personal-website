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
    <section className="py-20 md:py-28 bg-base text-primary min-h-screen relative overflow-hidden">
      {/* Background grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 spatial-grid" />
      <div className="absolute top-[10%] right-[5%] size-4 rounded-full bg-white/10 glass-panel droplet-glow pointer-events-none" />

      <div className="container-shell relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-mono font-bold tracking-wider uppercase text-secondary hover:text-primary mb-10 transition-colors duration-200"
        >
          <ArrowLeft aria-hidden="true" size={14} />
          Back to portfolio
        </Link>

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="font-mono text-xs text-accent uppercase tracking-wider block mb-2">
              {profile.resume.label.toUpperCase()}
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primary leading-none">
              {resumeTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-secondary">
              Preview the PDF inside the portfolio, or download the raw file if your browser does not support embedded previews.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 shrink-0">
            <a 
              className={`${buttonClassName("primary")} !bg-accent !text-[#071014] hover:!bg-accent-bright hover:!text-[#071014]`} 
              href={profile.resume.pdfHref} 
              download={profile.resume.fileName}
            >
              <Download aria-hidden="true" size={16} />
              Download PDF
            </a>
            <a 
              className={buttonClassName("secondary")} 
              href={profile.resume.pdfHref}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink aria-hidden="true" size={16} />
              Open raw PDF
            </a>
          </div>
        </div>

        {/* Embedded Viewer Frame */}
        <div className="glass-panel overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
          <object
            aria-label={`${resumeTitle} PDF preview`}
            className="h-[75vh] min-h-[560px] w-full bg-elevated/40"
            data={profile.resume.pdfHref}
            title={`${profile.name} resume PDF preview`}
            type="application/pdf"
          >
            <div className="grid min-h-[560px] place-items-center p-6 text-center">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold text-primary">Resume preview unavailable</h2>
                <p className="mt-3 text-sm leading-relaxed text-secondary">
                  This browser cannot display the embedded PDF. Download the resume or open the raw PDF file instead.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a
                    className={`${buttonClassName("primary")} !bg-accent !text-[#071014] hover:!bg-accent-bright hover:!text-[#071014]`}
                    href={profile.resume.pdfHref}
                    download={profile.resume.fileName}
                  >
                    <Download aria-hidden="true" size={16} />
                    Download PDF
                  </a>
                  <a 
                    className={buttonClassName("secondary")} 
                    href={profile.resume.pdfHref}
                    target="_blank"
                    rel="noreferrer"
                  >
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

