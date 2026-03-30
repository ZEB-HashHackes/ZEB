'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { useWallet } from '../../providers/WalletProvider';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Wallet, LogIn, Loader2, ArrowRightCircle, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { wallet, connectWallet, isConnecting } = useWallet();
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleWalletLogin = async () => {
    if (!wallet) {
      await connectWallet();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/users/login-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publickey: wallet.address }),
      });

      const data = await res.json();
      if (data.status === 'ok') {
        login(data.data);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed. Are you registered?');
      }
    } catch (err) {
      setError('Connection to auth server failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-100/50">
            {/* Brand Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <ShieldCheck size={32} className="text-slate-900" />
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Welcome Back</h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Sign in to ZEB Vault</p>
            </div>

            <div className="space-y-6">
              {/* Primary Login Button */}
              <button 
                onClick={handleWalletLogin}
                disabled={loading || isConnecting}
                className="group w-full py-5 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-4 border-b-4 border-slate-950 active:border-b-0 active:translate-y-1"
              >
                {loading || isConnecting ? <Loader2 className="animate-spin" /> : <Wallet size={24} className="text-primary group-hover:scale-110 transition-transform" />}
                {loading ? 'Authenticating...' : isConnecting ? 'Connecting...' : 'Login with Wallet'}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-x-0 top-1/2 h-px bg-slate-100 -translate-y-1/2"></div>
                <span className="relative z-10 bg-white px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mx-auto block w-fit">One-click connect</span>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-shake">
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>
                </div>
              )}

              {wallet && !isAuthenticated && !loading && (
                <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 truncate">
                    Wallet: {wallet.address.slice(0, 10)}...{wallet.address.slice(-6)}
                  </p>
                </div>
              )}

              <p className="text-slate-500 text-[10px] font-black text-center uppercase tracking-widest mt-8 flex items-center justify-center gap-2">
                New to the platform? 
                <a href="/signup" className="text-cyan-500 hover:text-cyan-600 flex items-center gap-1 group">
                  Signup
                  <ArrowRightCircle size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </p>
            </div>
          </div>
          
          <p className="text-center mt-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
            Secure Blockchain Authentication
          </p>
        </div>
      </main>
    </div>
  );
}
