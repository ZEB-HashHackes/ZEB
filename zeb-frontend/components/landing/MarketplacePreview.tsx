import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ArtCard from '@/components/marketplace/ArtCard';

const artworks = [
  { id: 1, title: 'Ethereal Geometry', creator: 'Studio Arca', price: '2.4 ETH', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop' },
  { id: 2, title: 'Urban Flux', creator: 'Elena Voss', price: '1.8 ETH', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop' },
  { id: 3, title: 'Chromatic Drift', creator: 'Zero Vector', price: '4.2 ETH', img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop' },
];

export default function MarketplacePreview() {
  return (
    <section id="marketplace" className="py-24 bg-gray-100 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Featured Collections</h2>
            <p className="text-xs text-slate-400 font-bold">Curated assets from the world's leading digital architects.</p>
          </div>
          
          <Link href="/marketplace" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:opacity-60 transition-opacity">
            View Marketplace
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {artworks.map((art) => (
            <div key={art.id} className="group cursor-pointer">
              {/* Image Container */}
              <div className="relative aspect-square w-full overflow-hidden rounded-[32px] bg-slate-100 mb-6">
                 <img 
                   src={art.img} 
                   alt={art.title} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                 />
              </div>
              
              {/* Content */}
              <div className="flex items-start justify-between px-2">
                 <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">{art.title}</h3>
                    <p className="text-sm font-bold text-slate-400">by <span className="text-slate-500">{art.creator}</span></p>
                 </div>
                 <div className="px-3 py-1 bg-cyan-50 rounded-full">
                    <span className="text-xs font-black text-cyan-600 tracking-tight">{art.price}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
