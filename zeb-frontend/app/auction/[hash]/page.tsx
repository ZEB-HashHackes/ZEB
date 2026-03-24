'use client'

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Clock, ShieldCheck, User, MessageSquare, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function AuctionDetailPage() {
  const [bidAmount, setBidAmount] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 max-w-7xl mx-auto px-6 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest mb-12">
           <span className="hover:text-slate-900 cursor-pointer">Marketplace</span>
           <span>/</span>
           <span className="hover:text-slate-900 cursor-pointer">Live Auctions</span>
           <span>/</span>
           <span className="text-slate-900">Ethereal Fragment #402</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: Artwork (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            <div className="relative aspect-square w-full bg-white rounded-[48px] p-6 shadow-2xl shadow-slate-200 border border-white">
               <img 
                 src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&auto=format&fit=crop" 
                 alt="Auction Item" 
                 className="w-full h-full object-cover rounded-[32px]"
               />
               <div className="absolute top-12 left-12 z-20 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Verified Asset</span>
               </div>
            </div>

            <div className="space-y-6 max-w-2xl">
               <h1 className="text-5xl font-black text-slate-900 tracking-tight">Ethereal Fragment <span className="text-slate-300">#402</span></h1>
               <p className="text-sm text-slate-400 font-bold leading-relaxed">
                  A singular study in digital permanence and light refraction. This piece explores the boundary between the tangible and the algorithmic, minted on the Ethereum mainnet as a testament to sovereign digital authorship.
               </p>

               <div className="flex gap-12 pt-4">
                  <div>
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3">Creator</p>
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-900" />
                        <span className="text-xs font-black text-slate-900">@AETHER_LABS</span>
                     </div>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3">Collection</p>
                     <span className="text-xs font-black text-slate-900">Primordial Forms</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Right: Bidding Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/50">
               <div className="flex justify-between items-start mb-12">
                  <div>
                     <p className="text-[10px] items-center font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Current Highest Bid</p>
                     <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter">8.50 ETH</span>
                        <span className="text-sm font-bold text-slate-300">($19,240.45 USD)</span>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Time Left</p>
                     <div className="flex items-center gap-1.5 text-slate-900 justify-end">
                        <Clock size={16} />
                        <span className="text-xl font-black">22:15:04</span>
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-900" />
                     <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Highest Bidder</p>
                        <p className="text-xs font-black text-slate-900">0x7d2...F291</p>
                     </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-white">
                     <ShieldCheck size={12} />
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1 mb-3">Your Bid</p>
                     <div className="relative">
                        <input 
                           type="text" 
                           placeholder="Enter amount in ETH"
                           className="w-full p-6 bg-white border border-slate-200 rounded-3xl text-sm font-black focus:outline-none focus:border-cyan-400 shadow-sm"
                           value={bidAmount}
                           onChange={(e) => setBidAmount(e.target.value)}
                        />
                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">ETH</span>
                     </div>
                  </div>

                  <button className="w-full py-5 bg-cyan-400 text-slate-900 font-black rounded-3xl text-sm hover:bg-cyan-500 transition-all tracking-tight shadow-xl shadow-cyan-400/20">
                     Place Bid
                  </button>
                  <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest">Minimum increment: 0.10 ETH</p>
               </div>
            </div>

            {/* Bidding History */}
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
               <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Bidding History</h3>
               <div className="space-y-6">
                  {[
                     { user: '0x3a...e216', val: '8.10 ETH', time: '2 hours ago' },
                     { user: '0x2d...a452', val: '7.90 ETH', time: '5 hours ago' },
                     { user: '0xf2...02b9', val: '7.50 ETH', time: '8 hours ago' },
                     { user: '0x1c...a52e', val: '7.00 ETH', time: '12 hours ago' },
                  ].map((bid, i) => (
                     <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                              <User size={14} />
                           </div>
                           <div>
                              <p className="text-[11px] font-black text-slate-900">{bid.user}</p>
                              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{bid.time}</p>
                           </div>
                        </div>
                        <span className="text-sm font-black text-slate-900">{bid.val}</span>
                     </div>
                  ))}
               </div>
               <button className="w-full mt-10 py-3 bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all">
                  View All 24 Bids
               </button>
            </div>
          </div>
        </div>
      </main>

      <Footer hideCTA={true} />
    </div>
  );
}
