import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Clock, Info, ShoppingCart, Gavel, Sparkles } from 'lucide-react';

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ hash: string }>
}) {
  const { hash } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar showSearch={true} />

      <main className="flex-grow pt-32 pb-24 max-w-7xl mx-auto px-6 w-full">
        {/* Upper Section: Artwork & Core Metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          {/* Left: Artwork Preview */}
          <div className="relative aspect-square w-full bg-white rounded-[48px] p-6 shadow-2xl shadow-slate-200 border border-white">
             <img 
               src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop" 
               alt="Artwork Detail" 
               className="w-full h-full object-cover rounded-[32px] shadow-lg"
             />
             <div className="absolute top-12 left-12 z-20 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Verified Asset</span>
             </div>
          </div>

          {/* Right: Metadata Card */}
          <div className="flex flex-col pt-4">
            <h1 className="text-6xl font-black text-slate-900 tracking-tight mb-4">Echoes of the Void #4</h1>
            <div className="flex items-center gap-2 mb-8">
               <span className="text-sm font-bold text-slate-400">By</span>
               <span className="text-sm font-black text-cyan-500 hover:underline cursor-pointer tracking-tight">Enix Thorn</span>
               <span className="text-sm font-bold text-slate-300 ml-4">Owned by <span className="text-slate-400">0x4f...921e</span></span>
            </div>

            {/* Price Box */}
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 mb-8">
               <div className="flex justify-between items-start mb-12">
                  <div>
                     <p className="text-[10px] items-center font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Current Price</p>
                     <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter">4.20 ETH</span>
                        <span className="text-sm font-bold text-slate-300">($9,942.12)</span>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Highest Bid</p>
                     <p className="text-xl font-black text-slate-900">3.85 ETH</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-2 mb-10 text-slate-400">
                  <Clock size={16} />
                  <span className="text-xs font-bold">Auction Ends In: <span className="text-slate-900">04h 22m 15s</span></span>
               </div>

               <div className="flex flex-col gap-4">
                  <button className="w-full py-5 bg-cyan-400 text-slate-900 font-black rounded-[20px] text-sm hover:bg-cyan-500 transition-all tracking-tight shadow-lg shadow-cyan-400/20">
                     Buy Now
                  </button>
                  <button className="w-full py-5 bg-white border border-slate-200 text-slate-900 font-black rounded-[20px] text-sm hover:bg-slate-50 transition-all tracking-tight shadow-sm">
                     Place Bid
                  </button>
               </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-4 p-6 bg-cyan-50/50 rounded-3xl border border-cyan-100">
               <Info size={20} className="text-cyan-500 flex-shrink-0 mt-0.5" />
               <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                  <span className="text-slate-900">Creator Royalty:</span> 10% of all secondary sales go to the creator. This ensures long-term support for the original artist.
               </p>
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
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">From</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">To</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[
                       { event: 'Sale', price: '3.50 ETH', from: '0x3a...e122', to: '0x4f...921e', date: '2 days ago', icon: ShoppingCart },
                       { event: 'Bid', price: '3.20 ETH', from: '0x1f...921e', to: '-', date: '3 days ago', icon: Gavel },
                       { event: 'Minted', price: '-', from: 'NullAddress', to: '0x3a...e122', date: '5 days ago', icon: Sparkles },
                    ].map((row, i) => (
                       <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                   <row.icon size={18} />
                                </div>
                                <span className="text-sm font-black text-slate-900">{row.event}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 font-black text-slate-900 text-sm">{row.price}</td>
                          <td className="px-8 py-6 font-bold text-slate-400 text-sm">{row.from}</td>
                          <td className="px-8 py-6 font-bold text-slate-400 text-sm">{row.to}</td>
                          <td className="px-8 py-6 font-bold text-slate-400 text-sm">{row.date}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </main>

    </div>
  );
}
