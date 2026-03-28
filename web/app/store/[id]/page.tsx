import { StoreDetailPage } from "@/components/store/store-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StoreDetailPage id={id} />;
}

