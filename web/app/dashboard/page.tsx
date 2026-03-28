'use client'

import { useEffect, useState } from 'react'
import MetricCard from '@/components/dashboard/MetricCard'
import PostRanking from '@/components/dashboard/PostRanking'
import SentimentPanel from '@/components/dashboard/SentimentPanel'
import SalesChart from '@/components/dashboard/SalesChart'

const mockPosts = [
  { id: 1, image: '🧣', caption: 'New winter collection is here!', likes: 342, comments: 28, clicks: 89, orders: 5, revenue: 420 },
  { id: 2, image: '👗', caption: 'Summer sale is here!', likes: 218, comments: 15, clicks: 43, orders: 2, revenue: 168 },
  { id: 3, image: '👜', caption: 'Handmade leather bags', likes: 567, comments: 42, clicks: 134, orders: 8, revenue: 960 },
  { id: 4, image: '🧤', caption: 'Cozy knit gloves', likes: 189, comments: 11, clicks: 28, orders: 1, revenue: 45 },
]

interface Sentiment {
  positive: number
  neutral: number
  negative: number
  keywords: string[]
}

export default function DashboardPage() {
  const [sentiment, setSentiment] = useState<Sentiment>({ positive: 72, neutral: 20, negative: 8, keywords: [] })
  const [sentimentLoading, setSentimentLoading] = useState(true)
  const [sentimentError, setSentimentError] = useState(false)

  useEffect(() => {
    fetch('/api/dashboard/sentiment')
      .then(r => r.json())
      .then(data => { setSentiment(data); setSentimentLoading(false) })
      .catch(() => { setSentimentLoading(false); setSentimentError(true) })
  }, [])

  const healthScore = 78
  const healthColor = healthScore >= 75 ? 'text-green-400' : healthScore >= 50 ? 'text-yellow-400' : 'text-red-400'
  const healthBg = healthScore >= 75 ? 'from-green-900/30 to-[#1a1a1a]' : healthScore >= 50 ? 'from-yellow-900/30 to-[#1a1a1a]' : 'from-red-900/30 to-[#1a1a1a]'

  return (
    <main className="min-h-screen bg-[#1a1a1a] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Omini Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">出海决策面板 · 实时更新</p>
          </div>
          <div className="text-xs text-gray-600">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
        </div>

        {/* Health Score */}
        <div className={`bg-gradient-to-r ${healthBg} rounded-2xl p-6 border border-[#2a2a2a] mb-6`}>
          <div className="flex items-center gap-6">
            <div>
              <div className={`text-7xl font-black ${healthColor}`}>{healthScore}</div>
              <div className="text-gray-400 text-sm mt-1">品牌健康度</div>
            </div>
            <div className="flex-1">
              <div className="text-white font-medium mb-2">整体状态：良好 ✅</div>
              <div className="text-gray-400 text-sm space-y-1">
                <div>• Instagram 互动率高于行业均值 2.1%</div>
                <div>• 本月 GMV 环比增长 23.4%</div>
                <div>• 建议：增加发帖频率，周三/周五效果最佳</div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <MetricCard title="Instagram 互动率" value="4.2%" growth="+0.8%" positive icon="📱" subtitle="12,400 粉丝" />
          <MetricCard title="独立站月流量" value="8,340" growth="+12.1%" positive icon="🌐" subtitle="转化率 2.8%" />
          <MetricCard title="月销售 GMV" value="$15,680" growth="+23.4%" positive icon="💰" subtitle="本月 142 单" />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <PostRanking posts={mockPosts} />
          <SentimentPanel {...sentiment} loading={sentimentLoading} error={sentimentError} />
        </div>

        {/* Sales Chart */}
        <SalesChart />
      </div>
    </main>
  )
}
