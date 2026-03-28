import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Toaster } from "sonner";

import { DemoSessionProvider } from "@/components/providers/demo-session-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import "./globals.css";

type FontVariableStyle = CSSProperties & Record<`--${string}`, string>;

const fontVariables = {
  "--font-body":
    '"Inter", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  "--font-geist-sans":
    '"Inter", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  "--font-display":
    '"Inter", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  "--font-geist-mono":
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
} as FontVariableStyle;

export const metadata: Metadata = {
  title: "Idea-to-Deploy",
  description:
    "从一句产品想法到完整出海首发包，串起定位、GTM Workspace 与对外落地页预览。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
      style={fontVariables}
    >
      <body className="min-h-full bg-[var(--page-bg)] text-[var(--text-primary)]">
        <LanguageProvider>
          <DemoSessionProvider>
            {children}
            <Toaster position="top-center" theme="dark" richColors />
          </DemoSessionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
