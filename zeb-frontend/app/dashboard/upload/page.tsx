'use client'

import { UploadArtModalTrigger } from '../../../components/dashboard/UploadArtModalTrigger';
import { useWallet } from '../../../providers/WalletProvider';
import Link from 'next/link';

export default function UploadPage() {
  const { wallet } = useWallet();

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Wallet Required</h1>
          <p className="text-slate-500 mb-8">Connect your Freighter wallet to upload artwork.</p>
          <Link href="/dashboard" className="py-4 px-8 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-6">
            Upload Artwork
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Register your creative work on ZEB. Files are verified for uniqueness and stored permanently.
          </p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-100 p-12">
          <UploadArtModalTrigger />
        </div>
        <div className="mt-12 text-center">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-lg transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

