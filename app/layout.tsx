import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { profile } from "@/content/profile";
import { personJsonLd } from "@/lib/seo/jsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} - ${profile.role}`,
    template: `%s - ${profile.name}`,
  },
  description: profile.positioning,
  applicationName: "Nguyen Duy Duc Portfolio",
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} - ${profile.role}`,
    description: profile.positioning,
    url: profile.siteUrl,
    siteName: `${profile.name} Portfolio`,
    images: [
      {
        url: "/og/default.svg",
        width: 1200,
        height: 630,
        alt: `${profile.name} portfolio social preview`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} - ${profile.role}`,
    description: profile.positioning,
    images: ["/og/default.svg"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
      </body>
    </html>
  );
}
