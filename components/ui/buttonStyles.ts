import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export function buttonClassName(variant: ButtonVariant = "secondary", className?: string) {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition duration-200",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel",
    variant === "primary" &&
      "border-fog bg-fog cta-ink shadow-[0_12px_40px_rgba(231,226,216,0.16)] hover:-translate-y-0.5 hover:bg-primary",
    variant === "secondary" &&
      "border-strong bg-elevated/70 text-primary hover:-translate-y-0.5 hover:border-steel hover:bg-panel",
    variant === "ghost" &&
      "border-transparent bg-transparent text-secondary hover:text-primary",
    className,
  );
}
