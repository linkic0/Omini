import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
};

const toneClassMap = {
  primary:
    "bg-[linear-gradient(135deg,var(--brand-cyan),#8abaff)] text-slate-950 shadow-[0_16px_50px_rgba(91,215,255,0.28)] hover:brightness-110",
  secondary:
    "panel-soft text-[var(--text-primary)] hover:border-[var(--border-strong)]",
  ghost:
    "text-[var(--text-secondary)] hover:bg-white/6 hover:text-white",
};

const sizeClassMap = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm md:text-[15px]",
  lg: "h-14 px-6 text-base",
};

export function Button({
  className,
  tone = "primary",
  size = "md",
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-transparent font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        toneClassMap[tone],
        sizeClassMap[size],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
