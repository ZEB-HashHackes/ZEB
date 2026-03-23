import React from 'react';
import { Twitter, Github, DiscIcon as Discord, ShieldCheck } from 'lucide-react';

export default function Footer({ hideCTA = false }: { hideCTA?: boolean }) {
  return (
    <>
      {!hideCTA && (
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
          <button className="px-10 py-5 bg-gradient-to-r from-primary to-secondary text-background font-black rounded-lg text-lg shadow-[0_10px_30px_-10px_rgba(218,65,103,1)] hover:shadow-[0_15px_40px_-10px_rgba(51,255,235,1)] hover:-translate-y-1 transition-all duration-300">
            Launch ZEB Flow
          </button>
        </div>
      </section>
      )}

      <footer className="bg-surface py-12 border-t border-surface/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
              ZEB Web
            </span>
            <p className="text-sm font-mono text-foreground/50">
              Powered by Stellar Soroban
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="p-2 text-foreground/60 hover:text-primary transition-colors">
              <Twitter size={24} />
            </a>
            <a href="#" className="p-2 text-foreground/60 hover:text-primary transition-colors">
              <Discord size={24} />
            </a>
            <a href="#" className="p-2 text-foreground/60 hover:text-primary transition-colors">
              <Github size={24} />
            </a>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-background/20 text-center md:text-left text-xs text-foreground/40 float-left w-full h-full flex flex-col md:flex-row justify-between">
          <p>© {new Date().getFullYear()} ZEB Web. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0 justify-center">
             <a href="#" className="hover:text-foreground">Terms</a>
             <a href="#" className="hover:text-foreground">Privacy</a>
          </div>
        </div>
      </footer>
    </>
  );
}
