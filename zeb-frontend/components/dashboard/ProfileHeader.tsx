'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { User, Wallet, ShieldCheck, TrendingUp, Gavel, BarChart3, Edit } from 'lucide-react'

export default function ProfileHeader() {
  const [userData, setUserData] = React.useState<any>(null)
  const [address, setAddress] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const { getAddress } = await import('@stellar/freighter-api');
        const { address: userAddr } = await getAddress();
        setAddress(userAddr);

        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
        const response = await fetch(`${baseUrl}/users/${userAddr}`);
        const result = await response.json();

        if (result.status === 'ok') {
          setUserData(result.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const displayUser = {
    username: userData?.username || 'User',
    wallet: address ? `${address.slice(0, 8)}...${address.slice(-3)}` : 'Not Connected',
    totalNFTs: userData?.totalNFTs || 0, // In a real app, we'd fetch this from another endpoint or aggregate
    activeAuctions: 0,
    winningBids: 0,
    portfolioGrowth: '0%'
  }

  return (
    <section className="py-6 mx-6 text-center">
      {/* Profile Top */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 bg-surface/50 backdrop-blur-xl rounded-3xl px-4 py-2 border border-surface/30 shadow-2xl">
        <div className="relative">
          <div className="w-[60px] h-[60px] bg-gradient-to-br from-primary/30 to-secondary/30 rounded-xl flex items-center justify-center border-2 border-primary/50 shadow-xl shadow-primary/25">
             <User size={30} className="text-primary" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary to-secondary p-2 rounded-2xl shadow-lg">
            <User size={10} className="text-background" />
          </div>
        </div>
        <div className="flex-1 text-left md:text-left">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent ">
              {isLoading ? 'Loading...' : displayUser.username}
            </h1>
            <Link href="/dashboard/profile" className="ml-2 p-1.5 bg-primary/20 rounded-xl hover:bg-primary/40 transition-all group">
              <Edit size={16} className="text-primary group-hover:text-background transition-colors" />
            </Link>
          </div>
          <div className="flex items-center gap-2 justify-center md:justify-start text-xs text-foreground/80 ">
            <Wallet size={24} className="text-primary shrink-0" />
            <span className="font-mono bg-surface/50 px-2 py-2 rounded-xl border border-surface/50 backdrop-blur-sm">
              {displayUser.wallet}
            </span>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-18">
        <div className="flex flex-col items-center p-2 bg-gradient-to-br from-surface/60 to-surface/30 rounded-3xl border border-surface/40 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all group">
          <BarChart3 size={28} className="text-primary group-hover:scale-110 transition-transform" />
          <div className="text-lg font-black text-foreground ">{displayUser.totalNFTs}</div>
          <p className="text-sm text-foreground/70">Total NFTs</p>
        </div>
        
        <div className="flex flex-col items-center p-2 bg-gradient-to-br from-surface/60 to-surface/30 rounded-3xl border border-surface/40 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all group">
          <ShieldCheck size={28} className="text-secondary group-hover:scale-110 transition-transform" />
          <div className="text-lg font-black text-foreground ">{displayUser.activeAuctions}</div>
          <p className="text-sm text-foreground/70">Active Auctions</p>
        </div>
        
        <div className="flex flex-col items-center p-2 bg-gradient-to-br from-surface/60 to-surface/30 rounded-3xl border border-surface/40 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all group">
          <Gavel size={28} className="text-green-500 group-hover:scale-110 transition-transform" />
          <div className="text-lg font-black text-green-500 ">{displayUser.winningBids}</div>
          <p className="text-sm text-foreground/70">Winning Bids</p>
        </div>
        
        <div className="flex flex-col items-center p-2 bg-gradient-to-br from-surface/60 to-surface/30 rounded-3xl border border-surface/40 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all group">
          <TrendingUp size={28} className="text-purple-500 group-hover:scale-110 transition-transform" />
          <div className="text-lg font-black text-purple-500 ">{displayUser.portfolioGrowth}</div>
          <p className="text-xs  text-foreground/70">Growth</p>
        </div>
      </div>
    </section>
  )
}

