"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Mic, Rocket, Send } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { useDemoCartCount } from "@/components/store/demo-store";

export type PreviewMode = "edit" | "preview" | "publish";

function IconImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return <Image src={src} alt={alt} width={24} height={24} className={className} unoptimized />;
}

export function PreviewToolbar({
  mode,
  onModeChange,
  onPublish,
}: {
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
  onPublish?: () => void;
}) {
  const tabs = [
    { key: "edit" as const, label: "编辑模式", icon: "/figma/store/icon-edit.svg" },
    { key: "preview" as const, label: "预览模式", icon: "/figma/store/icon-preview.svg" },
    { key: "publish" as const, label: "发布", icon: "/figma/store/icon-publish.svg" },
  ];

  return (
    <div className="sticky top-0 z-50 border-b border-white/8 bg-[#171b22]/88 px-6 py-4 text-white shadow-[0_18px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1857px] items-center justify-between">
        <div className="flex items-center gap-2">
          <IconImage src="/figma/store/icon-preview-brand.svg" alt="Crystal Flow Store" className="h-6 w-6" />
          <span className="text-lg font-semibold leading-7">Crystal Flow Store</span>
        </div>

        <div className="flex items-center gap-6">
          {tabs.map((tab) => {
            const active = mode === tab.key;
            const activeClass =
              tab.key === "publish"
                ? "border-b-2 border-[#ef4444] pb-2.5 text-[#ef4444]"
                : "border-b-2 border-[#51a2ff] pb-2.5 text-[#51a2ff]";
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onModeChange(tab.key)}
                className={`relative flex items-center gap-2 px-4 py-2 text-base font-medium transition ${
                  active ? activeClass : "text-[#d1d5dc] hover:text-white"
                }`}
              >
                <IconImage src={tab.icon} alt={tab.label} className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPublish?.()}
          className="flex items-center gap-2 rounded-[10px] bg-[#2b7fff] px-6 py-2 text-base font-medium text-white transition hover:bg-[#3c8dff]"
        >
          <IconImage src="/figma/store/icon-rocket.svg" alt="一键发布" className="h-4 w-4" />
          <span>一键发布</span>
        </button>
      </div>
    </div>
  );
}

export function StoreSiteNav({
  topOffset = 0,
}: {
  topOffset?: number;
}) {
  const { count } = useDemoCartCount();

  return (
    <div
      className="sticky z-40 bg-[rgba(255,255,255,0.95)] px-6 py-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] backdrop-blur-[4px]"
      style={{ top: topOffset }}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between">
        <Link href="/store" className="flex items-center gap-2">
          <IconImage src="/figma/store/icon-brand.svg" alt="Crystal Flow" className="h-8 w-8" />
          <span className="text-xl font-semibold leading-7 text-[#1e2939]">Crystal Flow</span>
        </Link>

        <div className="flex items-center gap-8 text-base text-[#364153]">
          <Link href="/store" className="transition hover:text-[#9810fa]">
            Home
          </Link>
          <a href="#catalog" className="transition hover:text-[#9810fa]">
            Catalog
          </a>
          <a href="#about" className="transition hover:text-[#9810fa]">
            About
          </a>
          <button
            type="button"
            onClick={() => toast.info("购物车链路已接通，当前环境仅展示 demo 交互。")}
            className="relative transition hover:scale-[1.03]"
          >
            <IconImage src="/figma/store/icon-cart.svg" alt="cart" className="h-6 w-6" />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffd700] text-xs font-bold text-[#59168b]">
              {count}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function StoreFooter() {
  const [email, setEmail] = useState("");

  const submit = () => {
    const nextEmail = email.trim();

    if (!nextEmail) {
      toast.error("请先输入邮箱地址。");
      return;
    }

    if (!nextEmail.includes("@")) {
      toast.error("请输入有效的邮箱地址。");
      return;
    }

    toast.success("订阅请求已记录，演示环境不会真的发送邮件。");
    setEmail("");
  };

  return (
    <footer className="bg-[#4a148c] px-6 py-12 text-white">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-8">
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <h3 className="text-[21px] font-medium leading-8">Stay Connected</h3>
          <p className="max-w-[522px] text-base leading-6 text-[#e9d4ff]">
            Subscribe to receive updates on new collections and exclusive offers
          </p>
          <form
            className="flex w-full max-w-[448px] flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <input
              type="text"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="h-[50px] flex-1 rounded-[10px] border border-white/20 bg-white/10 px-[17px] text-base text-white outline-none placeholder:text-[#dab2ff]"
            />
            <button
              type="submit"
              className="h-[50px] rounded-[10px] bg-[#ffd700] px-6 text-base font-semibold text-[#59168b] transition hover:bg-[#ffeb47]"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-6">
          {[
            { src: "/figma/store/icon-instagram.svg", alt: "Instagram" },
            { src: "/figma/store/icon-twitter.svg", alt: "Twitter" },
            { src: "/figma/store/icon-youtube.svg", alt: "YouTube" },
          ].map((item) => (
            <Link
              key={item.alt}
              href="/store"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/16"
            >
              <IconImage src={item.src} alt={item.alt} className="h-6 w-6" />
            </Link>
          ))}
        </div>

        <p className="text-sm leading-5 text-[#dab2ff]">
          © 2024 Crystal Flow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export function StoreSectionTitle({ title }: { title: string }) {
  return <h2 className="text-center text-[32px] font-medium leading-10 text-white">{title}</h2>;
}

export function WhiteSectionTitle({ title }: { title: string }) {
  return <h2 className="text-center text-[32px] font-medium leading-10 text-[#1e2939]">{title}</h2>;
}

export function PreviewHint({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 right-6 z-[70] rounded-2xl border border-white/8 bg-[#1a2028]/92 px-4 py-3 text-sm text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl"
        >
          Click any area or refine the page below.
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function PreviewEditBar({
  show,
  editHistory,
  value,
  onValueChange,
  onSubmit,
}: {
  show: boolean;
  editHistory?: string[];
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const history = editHistory ?? [];

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          className="fixed bottom-0 left-0 right-0 z-[70] border-t border-white/8 bg-[#161b22]/92 px-6 py-4 shadow-[0_-18px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl"
        >
          <div className="mx-auto max-w-5xl">
            {history.length > 0 ? (
              <div className="mb-2 text-xs text-gray-400">
                {history.map((item) => (
                  <div key={item}>Updated: {item}</div>
                ))}
              </div>
            ) : null}
            <div className="flex items-center gap-3 rounded-[18px] border border-white/8 bg-white/[0.05] p-3">
              <Mic className="h-6 w-6 flex-shrink-0 text-gray-400" />
              <input
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                placeholder='Try: "Make the hero feel calmer and more premium"'
                className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-400"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onSubmit();
                  }
                }}
              />
              <button
                type="button"
                onClick={onSubmit}
                className="flex items-center gap-2 rounded-[14px] bg-[#2b7fff] px-4 py-2 text-white transition hover:bg-[#3c8dff]"
              >
                <Send className="h-4 w-4" />
                发送
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function PreviewAssistant({
  show,
  suggestions = ["更换主色调", "调整字体风格", "添加促销横幅", "修改产品描述"],
  onSelectSuggestion,
}: {
  show: boolean;
  suggestions?: string[];
  onSelectSuggestion: (value: string) => void;
}) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.aside
          initial={{ x: 320 }}
          animate={{ x: 0 }}
          exit={{ x: 320 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed right-0 top-20 z-[65] h-[calc(100vh-5rem)] w-80 overflow-y-auto border-l border-white/8 bg-[#f6f3ef] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.22)]"
        >
          <h3 className="text-xl font-semibold text-[#111827]">页面调整建议</h3>
          <div className="mt-4 space-y-2">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSelectSuggestion(item)}
                className="w-full rounded-xl border border-[#e8dfd0] bg-[#f1eadf] px-4 py-3 text-left text-[#5a4231] transition hover:border-[#d7c3ab] hover:bg-[#ece2d5]"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-6 text-sm text-gray-600">
            当前风格：<span className="font-medium">Calm / premium wellness</span>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

export function PreviewFrame({
  mode,
  children,
}: {
  mode: PreviewMode;
  children: ReactNode;
}) {
  return (
    <motion.div
      animate={{
        borderWidth: mode === "edit" ? 4 : 0,
        borderColor: mode === "edit" ? "rgba(0,212,255,1)" : "rgba(0,212,255,0)",
      }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

export function PreviewPublishButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-xl bg-[#2b7fff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3c8dff]"
    >
      <Rocket className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
}

export const EditorTopBar = PreviewToolbar;
