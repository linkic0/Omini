"use client";

import type { ReactNode } from "react";
import type { WorkspaceTab } from "./types";

const tabs: Array<{ value: WorkspaceTab; label: string; hint: string }> = [
  { value: "overview", label: "Overview", hint: "GTM plan" },
  { value: "materials", label: "Materials", hint: "Launch assets" },
  { value: "analytics", label: "Analytics", hint: "Mock performance" },
];

type WorkspaceTabsProps = {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
};

export function WorkspaceTabs({ activeTab, onTabChange }: WorkspaceTabsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm sm:grid-cols-3">
      {tabs.map((tab) => {
        const active = tab.value === activeTab;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={[
              "relative rounded-xl px-4 py-3 text-left transition-all duration-200",
              active
                ? "bg-cyan-400/15 text-white shadow-[0_0_0_1px_rgba(34,211,238,0.35)]"
                : "text-white/65 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            <div className="text-sm font-semibold">{tab.label}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.22em] text-white/45">
              {tab.hint}
            </div>
            {active ? (
              <span className="absolute inset-x-4 bottom-2 h-px bg-gradient-to-r from-cyan-300 to-transparent" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

type PanelProps = {
  title: string;
  eyebrow: string;
  action?: ReactNode;
  children: ReactNode;
};

export function Panel({ title, eyebrow, action, children }: PanelProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,23,41,0.92),rgba(7,10,18,0.96))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/65">
            {eyebrow}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-white sm:text-xl">
            {title}
          </h3>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
