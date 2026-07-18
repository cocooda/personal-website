import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export function buttonClassName(variant: ButtonVariant = "secondary", className?: string) {
  return cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-6 py-2.5 text-sm font-semibold transition-all duration-300 active:scale-95 shadow-sm",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
    
    // Primary variant: solid high-contrast capsule
    variant === "primary" &&
      "border-transparent bg-primary text-base hover:bg-accent hover:shadow-[0_0_15px_rgba(169, 214, 255,0.3)] dark:bg-primary dark:text-base dark:hover:bg-accent",
      
    // Secondary variant: outline / frosted glass capsule
    variant === "secondary" &&
      "border-white/10 bg-elevated/60 text-primary hover:border-white/30 hover:bg-panel hover:shadow-md",
      
    // Ghost variant: text only with hover background
    variant === "ghost" &&
      "border-transparent bg-transparent text-secondary hover:text-primary hover:bg-white/5",
      
    className
  );
}

