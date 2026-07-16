import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buttonClassName, type ButtonVariant } from "@/components/ui/buttonStyles";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  external?: boolean;
  download?: React.AnchorHTMLAttributes<HTMLAnchorElement>["download"];
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "secondary",
  external,
  download,
  className,
}: ButtonLinkProps) {
  const classes = buttonClassName(variant, className);
  const isInternalRoute = (href.startsWith("/") && !href.startsWith("//")) || href.startsWith("#");
  const isHttpHref = /^https?:\/\//i.test(href);

  if (external || download !== undefined || !isInternalRoute) {
    return (
      <a
        className={classes}
        href={href}
        download={download}
        target={external && isHttpHref ? "_blank" : undefined}
        rel={external && isHttpHref ? "noreferrer" : undefined}
      >
        {children}
        {external ? <ArrowUpRight aria-hidden="true" size={16} /> : null}
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {children}
    </Link>
  );
}
