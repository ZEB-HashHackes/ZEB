import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ArtCard from '@/components/marketplace/ArtCard';
import ArtistCard from '@/components/marketplace/ArtistCard';
import CategoryCard from '@/components/marketplace/CategoryCard';
import { Search } from 'lucide-react';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero / Search Section */}
        <section className="relative py-20 px-6 flex flex-col items-center justify-center min-h-[40vh]">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 w-full max-w-3xl text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Extraordinary</span><br />
              Digital Assets
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
              The premier Web3-cyberpunk marketplace for digital art, writing, and music.
            </p>
            
            {/* Global Search Bar */}
            <div className="relative mt-8 max-w-2xl mx-auto group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-foreground/50 group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search artworks, creators, or hashes..." 
                className="w-full bg-surface/40 backdrop-blur-md border border-surface text-foreground rounded-2xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary shadow-[0_4px_30px_rgba(0,0,0,0.1)] focus:shadow-[0_0_20px_rgba(51,255,235,0.2)] transition-all duration-300 placeholder:text-foreground/40"
              />
            </div>
          </div>
        </section>

        {/* Explore Categories Section */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Explore Categories</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-transparent mt-4" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CategoryCard 
              title="Digital Art" 
              slug="digital-art" 
              image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
              count={2453}
            />
            <CategoryCard 
              title="Writing" 
              slug="writing" 
              image="https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=2674&auto=format&fit=crop"
              count={892}
            />
            <CategoryCard 
              title="Music" 
              slug="music" 
              image="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2670&auto=format&fit=crop"
              count={1204}
            />
          </div>
        </section>

        {/* Popular Artworks Section */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Popular Artworks</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-secondary to-transparent mt-4" />
            </div>
            <button className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              View All &rarr;
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ArtCard 
              hash="0x7f4a9b21"
              saleType="sale"
              image="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2670&auto=format&fit=crop"
              title="Neon Dreams #042"
              creator="0x7f4a...9b21"
              createdAt="12h ago"
              description="A vibrant exploration of retro-futuristic cityscapes imbued with neon hues."
              price="2.5 XLM"
            />
            <ArtCard 
              hash="0x3b8d4f1e"
              saleType="bid"
              image="https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=80&w=2670&auto=format&fit=crop"
              title="Cyber Samurai"
              creator="0x3b8d...4f1e"
              createdAt="1d ago"
              description="Digital manifestation of the ancient warrior spirit in the year 2142."
              price="4.2 XLM"
            />
            <ArtCard 
              hash="0x9c221a55"
              saleType="sale"
              image="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop"
              title="Glitch Protocol"
              creator="0x9c22...1a55"
              createdAt="3h ago"
              description="Abstract representation of a system override in a decentralized network."
              price="1.8 XLM"
            />
          </div>
        </section>

        {/* Popular Artists Section */}
        <section className="py-16 px-6 max-w-7xl mx-auto mb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Trending Creators</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-transparent mt-4" />
            </div>
            <button className="text-sm font-medium text-foreground/70 hover:text-secondary transition-colors">
              View Leaderboard &rarr;
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ArtistCard 
              name="SynthWave Master" 
              artworksCount={42} 
              avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop" 
            />
            <ArtistCard 
              name="Neon Ninja" 
              artworksCount={128} 
              avatar="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2487&auto=format&fit=crop" 
            />
            <ArtistCard 
              name="Pixel Prophet" 
              artworksCount={89} 
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop" 
            />
          </div>
        </section>
      </main>
      
      <Footer hideCTA={true} />
    </div>
  );
}
