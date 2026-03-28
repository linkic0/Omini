import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-[28px] border border-[var(--border-subtle)] bg-[rgba(8,20,34,0.82)] px-5 py-4 text-[15px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)] focus:shadow-[0_0_0_4px_rgba(91,215,255,0.08)]",
        className,
      )}
      {...props}
    />
  );
}
