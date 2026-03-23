import React from 'react';
import Link from 'next/link';
import { Wallet, User } from 'lucide-react';

export default function Navbar({ dashboardMode = false }: { dashboardMode?: boolean }) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/40 backdrop-blur-md border-b border-surface">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Cyan to Magenta Gradient logo */}
          <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            ZEB Web
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/80">
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#marketplace" className="hover:text-primary transition-colors">Marketplace</a>
          </div>
          
{dashboardMode ? (
            <Link href="/dashboard/profile" className="flex items-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/50 text-primary px-5 py-2.5 rounded-lg font-medium shadow-[0_0_15px_rgba(51,255,235,0.3)] hover:shadow-[0_0_25px_rgba(51,255,235,0.6)] transition-all duration-300">
              <User size={20} />
            </Link>
          ) : (
            <Link href="/signup" className="flex items-center gap-2 bg-surface/80 border border-primary text-primary px-5 py-2.5 rounded-lg font-medium shadow-[0_0_15px_rgba(51,255,235,0.4)] hover:shadow-[0_0_25px_rgba(51,255,235,0.8)] transition-all duration-300">
              <Wallet size={18} />
              <span className="hidden sm:inline">Connect Wallet</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
