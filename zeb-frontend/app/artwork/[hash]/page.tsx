'use client';

import React, { useState, use } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Clock, Info, ShoppingCart, Gavel, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getArtById, getArtActivity, recordActivity } from '@/lib/api';
import { buyNowOnChain, listForSaleOnChain } from '@/lib/stellar';
import { useWallet } from '@/providers/WalletProvider';
import { formatDistanceToNow } from '@/lib/utils';

export default function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ hash: string }>
}) {
  const { hash: artId } = use(params);
  const { wallet } = useWallet();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Fetch Art Details
  const { data: artRes, isLoading: artLoading, error: artError } = useQuery({
    queryKey: ['art', artId],
    queryFn: () => getArtById(artId),
  });

  // 2. Fetch Activity History
  const { data: activityRes, isLoading: activityLoading } = useQuery({
    queryKey: ['activity', artId],
    queryFn: () => getArtActivity(artId),
    enabled: !!artRes,
  });

  const art = artRes?.data;
  const history = activityRes?.data || [];

  // 3. Buy Logic
  const handleBuy = async () => {
    if (!wallet?.isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    if (!art) return;

    try {
      setIsProcessing(true);
      // a. On-chain
      await buyNowOnChain(art.contentHash, wallet.address);
      
      // b. Sync to backend
      await recordActivity({
        type: 'sale',
        artId: art._id,
        from: art.ownedBy,
        to: wallet.address,
        amount: art.fixedPrice || art.minPrice,
      } as any);

      alert("Purchase successful!");
      queryClient.invalidateQueries({ queryKey: ['art', artId] });
      queryClient.invalidateQueries({ queryKey: ['activity', artId] });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Purchase failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (artLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (artError || !art) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <AlertCircle className="w-16 h-16 text-red-400" />
        <h1 className="text-2xl font-black text-slate-900">Artwork not found</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">The requested asset may have been removed or the ID is invalid.</p>
      </div>
    );
  }

  const isOwner = wallet?.address === art.ownedBy;
  const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL?.replace('/api', '')}/${art.filePath}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar showSearch={true} />

      <main className="flex-grow pt-32 pb-24 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          {/* Left: Artwork Preview */}
          <div className="relative aspect-square w-full bg-white rounded-[48px] p-6 shadow-2xl shadow-slate-200 border border-white">
             <img 
               src={imageUrl} 
               alt={art.title} 
               className="w-full h-full object-cover rounded-[32px] shadow-lg"
             />
             <div className="absolute top-12 left-12 z-20 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Verified Asset</span>
             </div>
          </div>

          {/* Right: Metadata Card */}
          <div className="flex flex-col pt-4">
            <h1 className="text-6xl font-black text-slate-900 tracking-tight mb-4 uppercase">{art.title}</h1>
            <div className="flex items-center gap-2 mb-8">
               <span className="text-sm font-bold text-slate-400">Creator</span>
               <span className="text-sm font-black text-cyan-500 hover:underline cursor-pointer tracking-tight">{art.creatorBy.slice(0, 6)}...{art.creatorBy.slice(-4)}</span>
               <span className="text-sm font-bold text-slate-300 ml-4">Owned by <span className="text-slate-400">{art.ownedBy.slice(0, 6)}...{art.ownedBy.slice(-4)}</span></span>
            </div>

            {/* Price Box */}
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 mb-8">
               <div className="flex justify-between items-start mb-12">
                  <div>
                     <p className="text-[10px] items-center font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Current Price</p>
                     <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter">{art.fixedPrice || art.minPrice} XLM</span>
                        <span className="text-sm font-bold text-slate-300">(Platform: ZEB)</span>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-4">
                  {isOwner ? (
                    <button 
                      disabled={true}
                      className="w-full py-5 bg-slate-100 text-slate-400 font-black rounded-[20px] text-sm tracking-tight cursor-not-allowed"
                    >
                      You own this asset
                    </button>
                  ) : (
                    <button 
                      onClick={handleBuy}
                      disabled={isProcessing}
                      className="w-full py-5 bg-cyan-400 text-slate-900 font-black rounded-[20px] text-sm hover:bg-cyan-500 transition-all tracking-tight shadow-lg shadow-cyan-400/20 flex items-center justify-center"
                    >
                      {isProcessing ? <Loader2 className="animate-spin mr-2" size={18} /> : "Buy Now"}
                    </button>
                  )}
                  <button className="w-full py-5 bg-white border border-slate-200 text-slate-900 font-black rounded-[20px] text-sm hover:bg-slate-50 transition-all tracking-tight shadow-sm">
                     Make Offer
                  </button>
               </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-4 p-6 bg-cyan-50/50 rounded-3xl border border-cyan-100">
               <Info size={20} className="text-cyan-500 flex-shrink-0 mt-0.5" />
               <div className="space-y-1">
                 <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Metadata</p>
                 <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                   {art.description}
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* Ownership History Section */}
        <div className="max-w-7xl mx-auto">
           <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-12">Ownership History</h2>
           
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Event</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">From</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">To</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {history.length > 0 ? history.map((row, i) => (
                       <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                   {row.type === 'minted' ? <Sparkles size={18} /> : row.type === 'sale' ? <ShoppingCart size={18} /> : <Gavel size={18} />}
                                </div>
                                <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{row.type}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 font-bold text-slate-400 text-sm">{row.from ? `${row.from.slice(0, 6)}...` : '-'}</td>
                          <td className="px-8 py-6 font-bold text-slate-400 text-sm">{row.to ? `${row.to.slice(0, 6)}...` : '-'}</td>
                          <td className="px-8 py-6 font-bold text-slate-400 text-sm">
                            {formatDistanceToNow(new Date(row.timestamp), { addSuffix: true })}
                          </td>
                       </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]">No history recorded yet</td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
