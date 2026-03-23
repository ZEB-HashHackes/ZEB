'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ImagePlus } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Mesh */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        {/* Glowing Orbs */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-primary/20 blur-[100px]"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-secondary/20 blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-surface/80 border border-primary/30 text-primary text-sm font-semibold tracking-wide mb-6 shadow-[0_0_10px_rgba(51,255,235,0.2)]">
            Powered by Stellar Soroban
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            Permanent Proof of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Digital Authorship
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl mx-auto">
            Secure, immutable, and decentralized registration for your creative work. Mint directly onto the Stellar network and trade fluidly on our Soroban-powered marketplace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-primary text-background font-bold rounded-lg shadow-[0_0_20px_rgba(51,255,235,0.4)] hover:shadow-[0_0_30px_rgba(51,255,235,0.7)] transition-all duration-300 transform hover:-translate-y-1">
              <ImagePlus size={20} />
              Register Artwork
            </Link>
            <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-secondary text-secondary font-bold rounded-lg shadow-[0_0_15px_rgba(218,65,103,0.2)] hover:shadow-[0_0_25px_rgba(218,65,103,0.5)] hover:bg-secondary/10 transition-all duration-300 transform hover:-translate-y-1">
              Explore Marketplace
              <ArrowRight size={20} />
            </button>
          </div>

        </motion.div>

      </div>
    </section>
  );
}

