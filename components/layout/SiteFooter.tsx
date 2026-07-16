import Link from "next/link";
import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="border-t border-subtle py-10">
      <div className="container-shell flex flex-col gap-5 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          {profile.name} - {profile.role}. Last updated {profile.lastUpdated}.
        </p>
        <div className="flex flex-wrap gap-4">
          <a className="text-secondary hover:text-primary" href={`mailto:${profile.email}`}>
            Email
          </a>
          <Link className="text-secondary hover:text-primary" href={profile.resume.href}>
            Resume
          </Link>
          {profile.links
            .filter((link) => link.kind === "external")
            .map((link) => (
              <a
                key={link.href}
                className="text-secondary hover:text-primary"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ))}
        </div>
      </div>
    </footer>
  );
}
