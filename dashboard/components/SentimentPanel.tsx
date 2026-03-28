'use client'

interface SentimentProps {
  positive: number
  neutral: number
  negative: number
  keywords: string[]
  loading: boolean
  error?: boolean
}

export default function SentimentPanel({ positive, neutral, negative, keywords, loading, error }: SentimentProps) {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <h3 className="text-lg font-semibold mb-4 text-white">🧠 市场反馈信号 <span className="text-xs text-purple-400 font-normal ml-1">Claude AI</span></h3>
      {error ? (
        <div className="flex items-center justify-center h-32 bg-red-900/20 border border-red-800/40 rounded-xl text-red-400 text-sm">
          分析失败，显示默认数据
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="animate-spin mr-2">⟳</div> 分析中...
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-5">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-400">正面</span>
                <span className="text-green-400">{positive}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all duration-700" style={{ width: `${positive}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">中性</span>
                <span className="text-gray-400">{neutral}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gray-500 rounded-full transition-all duration-700" style={{ width: `${neutral}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-400">负面</span>
                <span className="text-red-400">{negative}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full transition-all duration-700" style={{ width: `${negative}%` }} />
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-2">高频关键词</div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw) => (
                <span key={kw} className="px-2 py-1 bg-purple-900/40 text-purple-300 rounded-full text-xs">{kw}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
