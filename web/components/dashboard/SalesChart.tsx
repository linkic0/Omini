'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

const data = [
  { date: '3/1', sales: 320, post: false },
  { date: '3/3', sales: 280, post: true },
  { date: '3/5', sales: 650, post: false },
  { date: '3/7', sales: 420, post: true },
  { date: '3/10', sales: 380, post: false },
  { date: '3/12', sales: 890, post: true },
  { date: '3/15', sales: 560, post: false },
]

export default function SalesChart() {
  return (
    <div className="bg-[#242424] rounded-2xl p-6 border border-[#2a2a2a]">
      <h3 className="text-lg font-semibold mb-1 text-white">📈 Ins 发帖 → 销售归因</h3>
      <p className="text-xs text-gray-500 mb-4">竖线 = 发帖时间点</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#242424', border: '1px solid #2a2a2a', borderRadius: 8 }}
            labelStyle={{ color: '#9ca3af' }}
            itemStyle={{ color: '#00d4ff' }}
            formatter={(v: number) => [`$${v}`, '销售额']}
          />
          {data.filter(d => d.post).map(d => (
            <ReferenceLine key={d.date} x={d.date} stroke="#a78bfa" strokeDasharray="4 2" label={{ value: '📸', position: 'top', fontSize: 12 }} />
          ))}
          <Line type="monotone" dataKey="sales" stroke="#00d4ff" strokeWidth={2} dot={{ fill: '#00d4ff', r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
