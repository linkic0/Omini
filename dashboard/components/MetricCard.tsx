'use client'

interface MetricCardProps {
  title: string
  value: string
  growth: string
  positive: boolean
  icon: string
  subtitle?: string
}

export default function MetricCard({ title, value, growth, positive, icon, subtitle }: MetricCardProps) {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${positive ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
          {growth}
        </span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{title}</div>
      {subtitle && <div className="text-gray-500 text-xs mt-1">{subtitle}</div>}
    </div>
  )
}
