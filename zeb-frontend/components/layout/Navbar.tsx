'use client';

import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default function Navbar({ showSearch = false }: { showSearch?: boolean }) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <Link href="/" className="text-2xl font-black tracking-tighter text-slate-900">
            ZEB
          </Link>
        </div>
        
        <div className="hidden md:flex flex-1 justify-center items-center gap-12">
          <Link href="/marketplace" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors">Explore</Link>
          <Link href="/auctions" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors">Auctions</Link>
          <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors">Dashboard</Link>
        </div>

        <div className="flex-1 flex items-center justify-end gap-6">
          {showSearch && (
            <div className="relative hidden lg:block group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-slate-300 group-focus-within:text-cyan-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search vault..." 
                className="bg-slate-50 border border-slate-100 rounded-lg py-2 pl-9 pr-4 text-[10px] font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-cyan-400/30 transition-all w-64"
              />
            </div>
          )}
          <Link 
            href="/signup"
            className="px-6 py-2.5 bg-cyan-400 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-cyan-500 transition-all shadow-md shadow-cyan-400/10"
          >
            Connect Wallet
          </Link>
        </div>
      </div>
    </nav>
  );
}
