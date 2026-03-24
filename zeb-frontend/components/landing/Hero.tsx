'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 bg-white mb-8">
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-cyan-50 border border-cyan-100 text-[10px] font-black tracking-[0.2em] uppercase text-cyan-600 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Web3 Authorship Standard
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1] tracking-tighter text-slate-900">
            Permanent Proof of <br/>
            <span className="text-slate-400">Digital Authorship</span>
          </h1>
          
          <p className="text-lg text-slate-500 mb-10 max-w-lg leading-relaxed font-medium">
            Secure your creative legacy. The leading platform for creators to verify ownership, register artworks, and trade assets with total transparency.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/signup" className="flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all group tracking-tight">
              Register Artwork
            </Link>
            <Link href='/marketplace' className="flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 bg-slate-100 text-slate-900 font-black rounded-xl hover:bg-slate-200 transition-all tracking-tight">
              Explore Marketplace
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative aspect-square max-w-[550px] mx-auto">
             <div className="absolute inset-0 bg-cyan-400/5 rounded-[64px] -rotate-3 translate-x-4 translate-y-4" />
             <div className="relative h-full w-full rounded-[64px] overflow-hidden border border-slate-100 shadow-2xl p-4 bg-white">
                <img 
                   src="../../public/zeb.jpg" 
                   alt="3D Artwork" 
                   className="w-full h-full object-cover rounded-[48px]"
                />
                
                {/* Floating Badge */}
                <div className="absolute bottom-12 left-12 p-6 bg-white/90 backdrop-blur-md rounded-[32px] border border-slate-100 shadow-xl max-w-[240px]">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-white font-black">VK</div>
                      <div>
                         <h4 className="text-sm font-black text-slate-900">Victor Knyazev</h4>
                         <p className="text-[10px] font-bold text-slate-400">Verified Artist</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 text-cyan-500">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Minting Live</span>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

