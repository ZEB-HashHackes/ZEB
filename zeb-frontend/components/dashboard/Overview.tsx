'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, TrendingDown, DollarSign, 
  Palette, ShoppingCart, Clock 
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function Overview() {
  const [stats, setStats] = useState({
    totalCreated: 0,
    totalSold: 0,
    totalGained: 0,
    listedItems: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { getAddress } = await import('@stellar/freighter-api')
        const { address } = await getAddress()

        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api'
        const res = await fetch(`${baseUrl}/arts/creator/${address}`)
        const data = await res.json()

        if (data.status === 'ok') {
          const arts = data.data
          const created = arts.length
          const sold = arts.filter((art: any) => art.ownedBy !== address)
          const totalSold = sold.length
          const totalGained = sold.reduce((sum: number, art: any) => sum + (Number(art.minPrice) || 0), 0)
          
          const resOwned = await fetch(`${baseUrl}/arts/owner/${address}`)
          const dataOwned = await resOwned.json()
          let listedItems = 0
          if (dataOwned.status === 'ok') {
            listedItems = dataOwned.data.filter((art: any) => art.listingStatus === 'AUCTION' || art.listingStatus === 'FIXED_PRICE').length
          }

          setStats({
            totalCreated: created,
            totalSold,
            totalGained,
            listedItems
          })
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
      }
    }
    fetchStats()
  }, [])

  // Mock chart data
  const chartData = [30, 45, 35, 60, 55, 80, 75]
  const maxValue = Math.max(...chartData)
  const chartWidth = 600
  const chartHeight = 200

  const points = chartData.map((val, i) => {
    const x = (i / (chartData.length - 1)) * chartWidth
    const y = chartHeight - (val / maxValue) * chartHeight
    return `${x},${y}`
  }).join(' ')

  const cards = [
    { label: 'Total Created', value: stats.totalCreated, icon: Palette, color: 'text-primary' },
    { label: 'Total Sold', value: stats.totalSold, icon: ShoppingCart, color: 'text-secondary' },
    { label: 'Total Gained', value: `${stats.totalGained} XLM`, icon: DollarSign, color: 'text-green-400' },
    { label: 'Currently Listed', value: stats.listedItems, icon: Clock, color: 'text-orange-400' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface/30 backdrop-blur-xl p-8 rounded-[32px] border border-surface/50 shadow-xl hover:shadow-2xl hover:shadow-primary/5 transition-all group"
          >
            <div className={`w-12 h-12 rounded-2xl bg-surface/50 border border-surface/50 flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
              <card.icon className={card.color} size={24} />
            </div>
            <p className="text-foreground/50 font-bold mb-1">{card.label}</p>
            <h3 className="text-3xl font-black">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-surface/30 backdrop-blur-xl p-10 rounded-[40px] border border-surface/50 shadow-xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black mb-2">Earnings Performance</h3>
              <p className="text-foreground/50 font-medium">Your revenue over the last 7 days</p>
            </div>
            <div className="flex items-center gap-2 text-green-400 font-bold">
              <TrendingUp size={20} />
              <span>+12.5%</span>
            </div>
          </div>
          
          <div className="relative h-[240px] w-full group">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible drop-shadow-[0_0_15px_rgba(51,255,235,0.2)]">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#33FFEB" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#33FFEB" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M 0,${chartHeight} L ${points} L ${chartWidth},${chartHeight} Z`}
                fill="url(#chartGradient)"
                className="transition-all duration-1000"
              />
              <polyline
                fill="none"
                stroke="#33FFEB"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                className="transition-all duration-1000"
              />
              {chartData.map((val, i) => {
                const x = (i / (chartData.length - 1)) * chartWidth;
                const y = chartHeight - (val / maxValue) * chartHeight;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#0D1117"
                    stroke="#33FFEB"
                    strokeWidth="3"
                    className="hover:r-6 transition-all cursor-pointer"
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-surface/30 backdrop-blur-xl p-10 rounded-[40px] border border-surface/50 shadow-xl">
          <h3 className="text-2xl font-black mb-8">Recent Sales</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-surface/50 border border-surface overflow-hidden">
                  <img src="/file.svg" className="w-full h-full object-cover p-2 opacity-50" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold group-hover:text-primary transition-colors text-sm">Neon Rift #{i+1}</h4>
                  <p className="text-xs text-foreground/40 font-medium">Sold to GCF2A...3X9Y</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">240 XLM</p>
                  <p className="text-[10px] text-foreground/30">2h ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
