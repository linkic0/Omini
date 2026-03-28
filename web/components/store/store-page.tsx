"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { useDemoSession } from "@/components/providers/demo-session-provider";
import { storeFaqs, storeProducts, storyParagraphs } from "@/components/site-data";
import {
  StoreFooter,
  StoreSectionTitle,
  StoreSiteNav,
  WhiteSectionTitle,
} from "@/components/store/store-shell";

function AssetImage({
  src,
  alt,
  className,
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
}) {
  return <Image src={src} alt={alt} width={width} height={height} className={className} unoptimized />;
}

function StoreHeroSection({
  title,
  subtitle,
  ctaLabel,
  shippingNote,
}: {
  title: string;
  subtitle: string;
  ctaLabel: string;
  shippingNote: string;
}) {
  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden px-6 text-center md:h-[534.59px]">
      <div className="absolute inset-0">
        <Image
          alt="Crystal background"
          className="h-full w-full object-cover opacity-40"
          fill
          priority
          sizes="100vw"
          src="/figma/store/hero-bg.png"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(89,22,139,0.5)] to-[rgba(89,22,139,0)]" />
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex max-w-[707px] flex-col items-center gap-4 px-6"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-[44px] font-medium leading-[1.04] text-white md:text-[70px] md:leading-[72px]">
          {title}
        </h1>
        <p className="pb-4 text-lg leading-8 text-[#f3e8ff] md:text-2xl">
          {subtitle}
        </p>
        <motion.button
          type="button"
          onClick={scrollToCatalog}
          className="inline-flex h-[60px] items-center gap-2 rounded-full bg-[#ffd700] px-8 text-lg font-semibold text-[#59168b] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] transition hover:bg-[#ffeb47]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AssetImage alt="Shop Now" className="h-5 w-5" height={20} src="/figma/store/icon-bag.svg" width={20} />
          {ctaLabel}
        </motion.button>
        <p className="text-sm leading-5 text-[#e9d4ff]">{shippingNote}</p>
      </motion.div>
    </section>
  );
}

function ProductGrid() {
  return (
    <section id="catalog" className="px-6 py-16 md:py-[64px]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
        <StoreSectionTitle title="Best Sellers" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {storeProducts.map((product, index) => (
            <motion.div
              key={product.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            >
              <Link href={`/store/${product.id}`}>
                <div className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_28px_40px_-12px_rgba(0,0,0,0.22)]">
                  <div className="relative h-64 overflow-hidden bg-[linear-gradient(147.72deg,#f3e8ff_0%,#faf5ff_100%)]">
                    <AssetImage
                      alt={product.name}
                      className="h-full w-full object-cover"
                      height={256}
                      src={product.cardImage}
                      width={405}
                    />
                  </div>

                  <div className="flex flex-col gap-2 p-6">
                    <h3 className="text-xl font-semibold leading-7 text-[#1e2939]">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-3 pb-2">
                      <span className="text-2xl font-bold text-[#ffd700]">
                        ${product.price}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        ${product.compareAt}
                      </span>
                    </div>
                    <div className="w-full rounded-[10px] bg-[#9810fa] py-2 text-center text-base font-medium text-white transition hover:bg-[#8403df]">
                      View Details
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section id="about" className="bg-[rgba(89,22,139,0.3)] px-6 py-16">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <motion.div
          className="overflow-hidden rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
          initial={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <AssetImage
            alt="Artisan making jewelry"
            className="h-96 w-full object-cover"
            height={384}
            src="/figma/store/artisan.png"
            width={616}
          />
        </motion.div>

        <motion.div
          className="text-white"
          initial={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h2 className="mb-6 text-[35px] font-medium leading-10">Handmade with Intention</h2>
          <div className="space-y-4 text-lg leading-[29.25px] text-[#f3e8ff]">
            {storyParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto flex max-w-[896px] flex-col gap-12">
        <WhiteSectionTitle title="Questions?" />
        <div className="space-y-4">
          {storeFaqs.map((faq, index) => (
            <div
              key={faq.question}
              className="overflow-hidden rounded-[10px] border border-[#e5e7eb]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="text-lg font-semibold leading-7 text-[#1e2939]">
                  {faq.question}
                </span>
                <AssetImage
                  alt={openIndex === index ? "Collapse" : "Expand"}
                  className="h-5 w-5"
                  height={20}
                  src={openIndex === index ? "/figma/store/icon-faq-open.svg" : "/figma/store/icon-faq-closed.svg"}
                  width={20}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-base leading-[26px] text-[#4a5565]">
                      {faq.answer}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StoreHomeSections({
  heroTitle,
  heroSubtitle,
  heroCta = "Shop Now",
  shippingNote = "Free shipping over $50",
  navOffset = 0,
}: {
  heroTitle: string;
  heroSubtitle: string;
  heroCta?: string;
  shippingNote?: string;
  navOffset?: number;
}) {
  return (
    <div className="bg-gradient-to-b from-[#4a148c] via-[#6a1b9a] to-[#1a237e]">
      <StoreSiteNav topOffset={navOffset} />
      <StoreHeroSection
        subtitle={heroSubtitle}
        title={heroTitle}
        ctaLabel={heroCta}
        shippingNote={shippingNote}
      />
      <ProductGrid />
      <BrandStory />
      <FAQSection />
      <StoreFooter />
    </div>
  );
}

export const StoreHomeContent = StoreHomeSections;

export function StoreHomePage() {
  const { session } = useDemoSession();

  return (
    <StoreHomeSections
      heroCta={session.landing?.heroCta ?? "Shop Now"}
      shippingNote={session.landing?.shippingNote ?? "Free shipping over $50"}
      heroSubtitle={session.landing?.heroSubtitle ?? "Handmade Crystal Bracelets for Mindful Living"}
      heroTitle={session.landing?.heroTitle ?? "Wear Your Intention"}
    />
  );
}
