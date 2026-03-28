import type { Metadata } from "next";
import { ChatPage } from "@/components/chat/chat-page";

type SearchParams = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "Chat Flow | Idea-to-Deploy",
  description:
    "Interactive positioning flow for selecting market, audience, and hook before generating a launch brief.",
};

function readQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ChatRoute({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  return <ChatPage initialIdea={readQueryValue(resolvedSearchParams?.idea)} />;
}
