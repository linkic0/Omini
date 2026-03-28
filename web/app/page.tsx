import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing/marketing-page";

type SearchParams = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "Idea-to-Deploy | From idea to first launch",
  description:
    "A polished demo that turns a product idea into a GTM workspace, positioning card, and landing page preview.",
};

function readQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  return <MarketingPage initialIdea={readQueryValue(resolvedSearchParams?.idea)} />;
}
