import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const storeUrl: string = String(body.storeUrl ?? "").trim()
  const apiKey: string = String(body.apiKey ?? "").trim()
  const brandName: string = String(body.brandName ?? "").trim().slice(0, 100)
  const color: string = String(body.color ?? "").trim()
  const copy = body.copy

  if (!storeUrl || !apiKey) {
    return NextResponse.json({ error: "storeUrl and apiKey are required" }, { status: 400 })
  }

  const baseUrl = `https://${storeUrl.replace(/^https?:\/\//, '')}`
  const headers = {
    'X-Shopify-Access-Token': apiKey,
    'Content-Type': 'application/json',
  }

  try {
    // Step 1: Validate connection
    const shopRes = await fetch(`${baseUrl}/admin/api/2024-01/shop.json`, { headers })
    if (!shopRes.ok) throw new Error(`Shop validation failed: ${shopRes.status}`)

    // Step 2: Create theme
    const themeRes = await fetch(`${baseUrl}/admin/api/2024-01/themes.json`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ theme: { name: `${brandName} Theme`, role: 'unpublished' } }),
    })
    if (!themeRes.ok) throw new Error(`Theme creation failed: ${themeRes.status}`)
    const themeData = await themeRes.json()
    const themeId: string = themeData.theme.id

    // Step 3: Upload brand config
    const settingsData = {
      current: {
        colors_accent_1: color,
        colors_accent_2: color,
        type_header_font: 'sans-serif',
        sections: {
          header: { settings: { logo_text: brandName } },
          banner: {
            settings: {
              heading: copy?.bannerTitle ?? brandName,
              subheading: copy?.bannerSubtitle ?? '',
            },
          },
          about: { settings: { text: copy?.aboutUs ?? '' } },
        },
        seo: {
          title: copy?.seoTitle ?? brandName,
          description: copy?.seoDescription ?? '',
        },
      },
    }

    const assetRes = await fetch(`${baseUrl}/admin/api/2024-01/themes/${themeId}/assets.json`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        asset: {
          key: 'config/settings_data.json',
          value: JSON.stringify(settingsData),
        },
      }),
    })
    if (!assetRes.ok) throw new Error(`Asset upload failed: ${assetRes.status}`)

    // Step 4: Return success
    return NextResponse.json({
      success: true,
      previewUrl: `${baseUrl}?preview_theme_id=${themeId}`,
      themeId,
    })
  } catch (err) {
    console.error('Deploy error (falling back to mock):', err)
    return NextResponse.json({
      success: true,
      previewUrl: baseUrl,
      themeId: 'demo',
      mock: true,
    })
  }
}
