import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Copy } from 'lucide-react';

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ hash: string }>
}) {
  const { hash } = await params;
  const isBid = hash.endsWith('e') || hash.includes('bid');

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Navbar />

      <main className="flex-grow pb-24">
        <section className="pt-12 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10">
            {/* LEFT COLUMN (Artwork Media) */}
            <div className="w-full md:w-[55%] flex-shrink-0">
              <div className="bg-surface rounded-2xl overflow-hidden border border-surface transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(51,255,235,0.15)] flex items-center justify-center p-4 min-h-[500px]">
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                  alt="High-Res Artwork Placeholder" 
                  className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
                />
              </div>
            </div>

            {/* RIGHT COLUMN (Metadata & Actions) */}
            <div className="w-full md:w-[45%] flex flex-col bg-surface/40 backdrop-blur-md rounded-2xl border border-surface p-8 relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Header Information */}
                <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">Cyberpunk Cityscape #04</h1>
                
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-foreground/80">Artist:</span>
                  <span className="text-primary font-mono bg-primary/10 px-3 py-1 rounded-md">GCF2A...H9B</span>
                </div>
                
                <p className="text-foreground/70 mb-8 leading-relaxed">
                  A vivid depiction of a hyper-urbanized future where neon lights bleed into the perpetual rain. Meticulously generated reflecting the resilience of humanity.
                </p>

                {/* Price Display Box */}
                {isBid ? (
                  <div className="flex items-center gap-8 bg-background/50 border border-surface p-5 rounded-xl mb-8">
                    <div>
                      <h3 className="text-sm text-foreground/50 uppercase tracking-widest font-semibold mb-1">Current Bid</h3>
                      <p className="text-3xl font-black text-secondary">120 XLM</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-8 bg-background/50 border border-surface p-5 rounded-xl mb-8">
                    <div>
                      <h3 className="text-sm text-foreground/50 uppercase tracking-widest font-semibold mb-1">Buy Price</h3>
                      <p className="text-3xl font-black text-primary">150 XLM</p>
                    </div>
                  </div>
                )}

                {/* Blockchain Data Tabs */}
                <div className="mb-4 flex gap-6 border-b border-surface">
                  <button className="pb-3 text-primary font-semibold border-b-2 border-primary">
                    Ownership
                  </button>
                  <button className="pb-3 text-foreground/50 hover:text-foreground transition-colors font-medium border-b-2 border-transparent hover:border-foreground/30">
                    Activity
                  </button>
                </div>

                {/* Tab Content (Ownership) */}
                <div className="bg-background/30 rounded-lg p-5 mb-10 flex-grow border border-surface">
                  <div className="mb-4">
                    <p className="text-xs text-foreground/50 uppercase tracking-wider mb-2">Current Owner</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary" />
                      <span className="font-mono text-sm text-foreground">0x3b8d...4f1e</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/50 uppercase tracking-wider mb-2">Immutable Hash</p>
                    <div className="flex items-center justify-between bg-surface/50 rounded-md py-2 px-3 border border-surface">
                      <span className="font-mono text-xs text-primary truncate max-w-[80%]">
                        {hash || '0x8f4b23c...9a0b12'}
                      </span>
                      <button className="text-foreground/50 hover:text-primary transition-colors p-1" title="Copy Hash">
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mt-auto pt-4">
                  {isBid ? (
                    <button className="flex-1 py-4 bg-transparent border-2 border-secondary text-secondary font-black rounded-lg hover:bg-secondary hover:text-foreground hover:shadow-[0_0_25px_rgba(218,65,103,0.4)] hover:-translate-y-1 transition-all duration-300 text-lg">
                      Place Bid
                    </button>
                  ) : (
                    <button className="flex-1 py-4 bg-primary text-[#131515] font-black rounded-lg shadow-[0_0_20px_rgba(51,255,235,0.3)] hover:shadow-[0_0_35px_rgba(51,255,235,0.6)] hover:-translate-y-1 transition-all duration-300 text-lg">
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer hideCTA={true} />
    </div>
  );
}
