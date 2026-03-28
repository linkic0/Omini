"use client";

import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TabsProps<T extends string> = {
  value: T;
  items: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  className?: string;
};

export function Tabs<T extends string>({
  value,
  items,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex rounded-full border border-[var(--border-subtle)] bg-white/6 p-1.5 backdrop-blur",
        className,
      )}
    >
      {items.map((item) => (
        <TabButton
          key={item.value}
          active={item.value === value}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </TabButton>
      ))}
    </div>
  );
}

function TabButton({
  active,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition",
        active
          ? "bg-[rgba(91,215,255,0.14)] text-white shadow-[inset_0_0_0_1px_rgba(91,215,255,0.24)]"
          : "text-[var(--text-muted)] hover:text-white",
        className,
      )}
      {...props}
    />
  );
}
