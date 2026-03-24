'use client'

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ArtCard from '@/components/marketplace/ArtCard';
import { ChevronLeft, ChevronRight, ChevronDown, Search, X, Users } from 'lucide-react';

const auctions = [
  { id: 1, title: 'Ethereal Pulse #04', creator: '@Arthemus_Design', price: '2.45 ETH', timer: '04h 12m', saleType: 'bid', category: 'image', bidders: 12, hash: 'pulse-04', image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop' },
  { id: 3, title: 'Cyber Nomad G7', creator: '@Future_Studio', price: '12.20 ETH', timer: '12h 05m', saleType: 'bid', category: 'video', bidders: 45, hash: 'nomad-g7', image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=800&auto=format&fit=crop' },
  { id: 6, title: 'Nocturnal Muse', creator: '@Classical_Remix', price: '5.88 ETH', timer: '01h 45m', saleType: 'bid', category: 'image', bidders: 8, hash: 'muse-v1', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop' },
  { id: 9, title: 'Prism Fragment', creator: '@Macro_Gen', price: '3.40 ETH', timer: '08h 22m', saleType: 'bid', category: 'text', bidders: 18, hash: 'prism-09', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop' },
];

export default function AuctionsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = ['all', 'image', 'video', 'text', 'music'];

  const filteredAuctions = useMemo(() => {
    return auctions.filter(art => {
      const matchesSearch = art.creator.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'all' || art.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar showSearch={false} />
      
      <main className="flex-grow pt-32 pb-24 max-w-7xl mx-auto px-6 w-full">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4 text-center">Live Auctions</h1>
          <p className="text-md text-slate-500 font-bold max-w-xl mx-auto text-center font-bold">
            Participate in high-stakes bidding for the world's most exclusive digital masterpieces.
          </p>
        </div>

        {/* Status Row */}
        <div className="flex flex-col gap-8 mb-12">
           <div className="flex items-center justify-between bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-8">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{filteredAuctions.length} Active Auctions</span>
                 </div>
              </div>

              <div className="flex-1 max-w-md mx-12 relative">
                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                 <input 
                   type="text" 
                   placeholder="Search by creator name..." 
                   className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 text-xs font-black text-slate-900 focus:outline-none focus:border-cyan-400/30 transition-all placeholder:text-slate-300"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                 />
              </div>
              
              <div className="flex items-center gap-4">
                 <button className="flex items-center gap-8 px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">
                    Filter By Price
                    <ChevronDown size={14} />
                 </button>
              </div>
           </div>

           <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => (
                 <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategory === cat ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-cyan-400 hover:text-slate-900'}`}
                 >
                    {cat}
                 </button>
              ))}
           </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAuctions.map((art) => (
            <ArtCard 
               key={art.id}
               title={art.title}
               creator={art.creator}
               price={art.price}
               timer={art.timer}
               saleType={art.saleType as any}
               image={art.image}
               hash={art.hash}
               bidders={art.bidders}
            />
          ))}
        </div>

        {filteredAuctions.length === 0 && (
           <div className="py-32 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-sm">
                 <Search size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">No auctions found</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Try adjusting your filters or search terms.</p>
           </div>
        )}

        {/* Pagination placeholder */}
        {filteredAuctions.length > 0 && (
          <div className="mt-20 flex items-center justify-center gap-8">
             <button className="text-slate-300 hover:text-slate-900 transition-colors">
                <ChevronLeft size={24} />
             </button>
             <span className="text-xs font-black text-slate-900 tracking-widest">Page 1 of 1</span>
             <button className="text-slate-300 hover:text-slate-900 transition-colors">
                <ChevronRight size={24} />
             </button>
          </div>
        )}
      </main>
      
      <Footer hideCTA={true} />
    </div>
  );
}
