'use client'

interface Post {
  id: number
  image: string
  caption: string
  likes: number
  comments: number
  clicks: number
  orders: number
  revenue: number
}

export default function PostRanking({ posts }: { posts: Post[] }) {
  const sorted = [...posts].sort((a, b) => b.revenue - a.revenue)
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <h3 className="text-lg font-semibold mb-4 text-white">📊 内容表现排行</h3>
      <div className="space-y-3">
        {sorted.map((post, idx) => (
          <div key={post.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50">
            <span className="text-gray-500 text-sm w-4">{idx + 1}</span>
            <span className="text-2xl">{post.image}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{post.caption}</div>
              <div className="flex gap-3 mt-1 text-xs text-gray-400">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
                <span>🔗 {post.clicks} 点击</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-400 font-semibold text-sm">${post.revenue}</div>
              <div className="text-gray-500 text-xs">{post.orders} 单</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
