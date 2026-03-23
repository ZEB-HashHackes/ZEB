'use client';

import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
        {/* Abstract CTA Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface to-background"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-secondary/5 blur-[150px] pointer-events-none"></div>
        
        
     
    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface border border-primary/30 shadow-[0_0_30px_rgba(51,255,235,0.2)]">
            <ShieldCheck size={40} className="text-primary" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6">Secure Your Digital Legacy</h2>
          <p className="text-xl text-foreground/70 mb-10 max-w-2xl mx-auto">
            Join the future of verifiable creativity. Mint your first immutable asset on the Stellar network today with zero gas fees for early adopters.
          </p>
          <Link href="/signup" className="px-10 py-5 bg-gradient-to-r from-primary to-secondary text-background font-black rounded-lg text-lg shadow-[0_10px_30px_-10px_rgba(218,65,103,1)] hover:shadow-[0_15px_40px_-10px_rgba(51,255,235,1)] hover:-translate-y-1 transition-all duration-300 block text-center">
            Launch ZEB Flow
          </Link>
        </div>
         </section>
  );
}
