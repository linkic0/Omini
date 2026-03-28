import { DeployWizard } from '@/components/deploy/DeployWizard'

interface SearchParams {
  brandName?: string
  category?: string
  color?: string
}

export default async function DeployPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  return (
    <DeployWizard
      initialBrandName={params.brandName ?? ''}
      initialCategory={params.category ?? 'Fashion'}
      initialColor={params.color ?? '#00d4ff'}
    />
  )
}
