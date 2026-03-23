'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { User, Wallet, ShieldCheck, TrendingUp, Gavel, BarChart3, Edit } from 'lucide-react'

const mockUser = {
  avatar: '/file.svg',
  username: 'Mr. X',
  wallet: 'GBBN5OTU...ICD',
  totalNFTs: 12,
  activeAuctions: 3,
  winningBids: 2,
  portfolioGrowth: '+24%'
}

export default function ProfileHeader() {
  return (
    <section className="py-6  mx-6 text-center">
      {/* Profile Top */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 bg-surface/50 backdrop-blur-xl rounded-3xl px-4 py-2 border border-surface/30 shadow-2xl">
        <div className="relative">
          <Image 
            src={mockUser.avatar} 
            alt={mockUser.username}
            width={60}
            height={60}
            className="rounded-xl border-2 border-primary/50 shadow-xl shadow-primary/25"
          />
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary to-secondary p-2 rounded-2xl shadow-lg">
            <User size={10} className="text-background" />
          </div>
        </div>
        <div className="flex-1 text-left md:text-left">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent ">
              {mockUser.username}
            </h1>
            <a href="/dashboard/profile" className="ml-2 p-1.5 bg-primary/20 rounded-xl hover:bg-primary/40 transition-all group">
              <Edit size={16} className="text-primary group-hover:text-background transition-colors" />
            </a>
          </div>
          <div className="flex items-center gap-2 justify-center md:justify-start text-xs text-foreground/80 ">
            <Wallet size={24} className="text-primary shrink-0" />
            <span className="font-mono bg-surface/50 px-2 py-2 rounded-xl border border-surface/50 backdrop-blur-sm">
              {mockUser.wallet}
            </span>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-18">
        <div className="flex flex-col items-center p-2 bg-gradient-to-br from-surface/60 to-surface/30 rounded-3xl border border-surface/40 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all group">
          <BarChart3 size={28} className="text-primary group-hover:scale-110 transition-transform" />
          <div className="text-lg font-black text-foreground ">{mockUser.totalNFTs}</div>
          <p className="text-sm text-foreground/70">Total NFTs</p>
        </div>
        
        <div className="flex flex-col items-center p-2 bg-gradient-to-br from-surface/60 to-surface/30 rounded-3xl border border-surface/40 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all group">
          <ShieldCheck size={28} className="text-secondary group-hover:scale-110 transition-transform" />
          <div className="text-lg font-black text-foreground ">{mockUser.activeAuctions}</div>
          <p className="text-sm text-foreground/70">Active Auctions</p>
        </div>
        
        <div className="flex flex-col items-center p-2 bg-gradient-to-br from-surface/60 to-surface/30 rounded-3xl border border-surface/40 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all group">
          <Gavel size={28} className="text-green-500 group-hover:scale-110 transition-transform" />
          <div className="text-lg font-black text-green-500 ">{mockUser.winningBids}</div>
          <p className="text-sm text-foreground/70">Winning Bids</p>
        </div>
        
        <div className="flex flex-col items-center p-2 bg-gradient-to-br from-surface/60 to-surface/30 rounded-3xl border border-surface/40 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all group">
          <TrendingUp size={28} className="text-purple-500 group-hover:scale-110 transition-transform" />
          <div className="text-lg font-black text-purple-500 ">{mockUser.portfolioGrowth}</div>
          <p className="text-xs  text-foreground/70">Portfolio Growth</p>
        </div>
      </div>
    </section>
  )
}

