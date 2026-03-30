'use client';

import React from 'react';
import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { useWallet } from '../../providers/WalletProvider';

export default function Navbar({ showSearch = false }: { showSearch?: boolean }) {
  const { wallet, connectWallet, disconnectWallet, isConnecting } = useWallet();
  
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
          <div className="flex items-center gap-2">
            {wallet ? (
              <>
                <div className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded-full">
                  <User size={12} />
                  <span className="font-mono truncate max-w-[120px]">{wallet.address.slice(0,6)}...{wallet.address.slice(-4)}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-3 py-1.5 bg-red-500/10 text-red-500 text-xs font-black uppercase tracking-wide rounded-md hover:bg-red-500/20 transition-all border border-red-500/20"
                  disabled={isConnecting}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={connectWallet}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
