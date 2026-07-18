"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ContactActions } from "@/components/contact/ContactActions";
import { profile } from "@/content/profile";

export function ContactSection() {
  return (
    <section 
      id="contact" 
      className="scroll-mt-20 py-24 md:py-32 bg-bg-contact text-text-contact relative overflow-hidden border-t border-white/5"
    >
      {/* Soft liquid detail bubble in background */}
      <div className="absolute -bottom-20 -right-20 size-[320px] rounded-full bg-accent/5 blur-[80px] pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] size-6 rounded-full bg-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-md pointer-events-none" />

      <div className="container-shell relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Big Invitation Text */}
        <div className="lg:col-span-8 flex flex-col justify-between max-w-3xl">
          <div>
            <span className="font-mono text-xs text-secondary uppercase tracking-wider block mb-4">
              06 / CONTACT
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-primary">
              Need someone who can connect product ambiguity to measurable AI systems?
            </h2>
            <p className="mt-6 text-base text-secondary max-w-xl leading-relaxed">
              Let&apos;s build. I work across pipelines, evaluations, and product interfaces to turn AI prototypes into production features.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mt-12 flex flex-wrap gap-6 items-center">
            <a 
              href={profile.resume.pageHref} 
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase text-primary hover:text-accent group/res"
            >
              View resume 
              <ArrowUpRight size={14} className="transition-transform duration-200 group-hover/res:translate-x-0.5 group-hover/res:-translate-y-0.5" />
            </a>
            <span className="hidden md:inline text-secondary/30">|</span>
            <Link 
              href="/work/legolas-ai" 
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase text-primary hover:text-accent group/cs"
            >
              Flagship Case Study 
              <ArrowUpRight size={14} className="transition-transform duration-200 group-hover/cs:translate-x-0.5 group-hover/cs:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Copyable Email and Action Pill Triggers */}
        <div className="lg:col-span-4 flex flex-col justify-end">
          <div className="border-t border-white/10 pt-6">
            <span className="font-mono text-xs text-secondary/70 uppercase tracking-widest block mb-2">
              DIRECT_SIGNAL
            </span>
            {/* Clickable/copyable email display */}
            <span className="select-text font-mono text-lg font-bold text-primary tracking-tight block break-all">
              {profile.email}
            </span>
            
            {/* Custom styled contact buttons */}
            <ContactActions email={profile.email} mailtoHref={profile.contact.mailtoHref} />
          </div>
        </div>

      </div>
    </section>
  );
}
