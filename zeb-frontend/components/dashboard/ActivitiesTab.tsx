'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Filter, Clock, ShoppingCart, Gavel, ArrowUp, ArrowDown, UploadCloud, Eye } from 'lucide-react'
import type { ReactNode } from 'react'

interface Transaction {
  id: number
  nftTitle: string
  nftImg: string
  type: 'purchase' | 'sale' | 'bid' | 'listing'
  amount: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  counterparty: string
}

type SubTabType = 'all' | 'purchases' | 'sales' | 'bids'

const rawTransactions: Transaction[] = [
  { id: 1, nftTitle: 'Cosmic Rift by NovaCollect', nftImg: '/file.svg', type: 'purchase', amount: '450 XLM', date: '2h ago', status: 'completed', counterparty: 'NovaC...K7P2' },
  { id: 2, nftTitle: 'Digital Lotus #44', nftImg: '/file.svg', type: 'sale', amount: '890 XLM', date: '1d ago', status: 'completed', counterparty: 'ArtByZ...4M9Q' },
  { id: 3, nftTitle: 'Aurora Code Rain', nftImg: '/file.svg', type: 'bid', amount: '320 XLM', date: '3h ago', status: 'pending', counterparty: 'CodeR...H8J5' },
  { id: 4, nftTitle: 'Pixel Nebula Drift', nftImg: '/file.svg', type: 'purchase', amount: '560 XLM', date: '5h ago', status: 'completed', counterparty: 'PixelN...2L6R' },
  { id: 5, nftTitle: 'Synthwave Horizon', nftImg: '/file.svg', type: 'sale', amount: '420 XLM', date: '1d ago', status: 'completed', counterparty: 'Synth...9F3V' },
  { id: 6, nftTitle: 'Glitch Archive #12', nftImg: '/file.svg', type: 'bid', amount: '290 XLM', date: '6h ago', status: 'outbid', counterparty: 'Glitch...M5T1' },
]

export default function ActivitiesTab() {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const transactions = rawTransactions

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch = tx.nftTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            tx.counterparty.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTab = activeSubTab === 'all' || tx.type === activeSubTab
      return matchesSearch && matchesTab
    })
  }, [transactions, searchQuery, activeSubTab])

  const getIcon = (type: Transaction['type']): ReactNode => {
    switch (type) {
      case 'purchase': return <ShoppingCart className="w-5 h-5" />
      case 'sale': return <ArrowUp className="w-5 h-5" />
      case 'bid': return <Gavel className="w-5 h-5" />
      case 'listing': return <Clock className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-400/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-400/30'
    }
  }

  return (
    <section className="w-full">
      <div className="px-1">
        {/* Sub-tab Header */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6">
          <div className="flex bg-surface/80 backdrop-blur-xl rounded-2xl shadow-xl border border-surface/50 w-full">
            <button
              onClick={() => setActiveSubTab('all')}
              className={`flex-1 py-4 px-6 rounded-2xl font-black text-lg transition-all duration-500 ${
                activeSubTab === 'all'
                  ? 'bg-gradient-to-r from-primary to-secondary text-background shadow-[0_10px_30px_rgba(51,255,235,0.4)] scale-[1.02]'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => setActiveSubTab('purchases')}
              className={`flex-1 py-3 px-4 rounded-2xl font-black text-base transition-all duration-500 ${
                activeSubTab === 'purchases'
                  ? 'bg-gradient-to-r from-primary to-secondary text-background shadow-[0_10px_30px_rgba(51,255,235,0.4)] scale-[1.02]'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Purchases
            </button>
            <button
              onClick={() => setActiveSubTab('sales')}
              className={`flex-1 py-3 px-4 rounded-2xl font-black text-base transition-all duration-500 ${
                activeSubTab === 'sales'
                  ? 'bg-gradient-to-r from-primary to-secondary text-background shadow-[0_10px_30px_rgba(51,255,235,0.4)] scale-[1.02]'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Sales
            </button>
            <button
              onClick={() => setActiveSubTab('bids')}
              className={`flex-1 py-3 px-4 rounded-2xl font-black text-base transition-all duration-500 ${
                activeSubTab === 'bids'
                  ? 'bg-gradient-to-r from-primary to-secondary text-background shadow-[0_10px_30px_rgba(51,255,235,0.4)] scale-[1.02]'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Bids
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-3xl bg-surface/60 backdrop-blur-2xl border border-surface shadow-2xl p-4">
          {/* Search */}
          <div className="relative mb-8 bg-surface/80 backdrop-blur-xl rounded-2xl p-2 border border-surface/50">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions by NFT title or wallet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface/50 border border-surface/30 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="group bg-surface/70 backdrop-blur-xl border border-surface/40 rounded-2xl p-6 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all overflow-hidden">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                    <img src={tx.nftImg} alt={tx.nftTitle} className="w-12 h-12 object-cover rounded-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getIcon(tx.type)}
                      <span className="font-bold text-sm uppercase tracking-wide text-primary">{tx.type}</span>
                    </div>
                    <h3 className="font-black text-lg leading-tight group-hover:text-primary transition-colors">{tx.nftTitle}</h3>
                    <p className="text-sm text-foreground/70 truncate">{tx.counterparty}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {tx.amount}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(tx.status)}`}>
                    {tx.status === 'completed' ? 'Completed' : tx.status === 'pending' ? 'Pending' : 'Failed'}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-foreground/60">
                  <span>{tx.date}</span>
                  <Link href={`/nft/${tx.id}`} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-xl transition-all group-hover:scale-105">
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                </div>
              </div>
            ))}
            {filteredTransactions.length === 0 && (
              <div className="col-span-full text-center py-32 text-foreground/50 bg-surface/30 rounded-2xl p-12">
                <Clock size={64} className="mx-auto mb-6 text-primary opacity-50" />
                <h3 className="text-2xl font-black mb-4 text-foreground/70">No Recent Activity</h3>
                <p className="text-xl mb-8 max-w-md mx-auto leading-relaxed">Your transaction history will appear here. Make your first purchase, sale, or bid!</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Link href="/market" className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-background font-bold rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all text-lg">
                    Browse Marketplace
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

