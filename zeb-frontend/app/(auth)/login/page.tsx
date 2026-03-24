'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, Wallet, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleWalletConnect = async () => {
    try {
      const { isConnected, requestAccess, getAddress } = await import("@stellar/freighter-api");
      
      const connectedStatus = await isConnected();
      if (!connectedStatus.isConnected) {
        alert("Freighter not installed!");
        return;
      }

      await requestAccess();
      const { address } = await getAddress();
      
      if (address) {
        // Verify user on backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${address}`);
        const data = await response.json();

        if (response.ok && data.status === 'ok') {
          localStorage.setItem('zeb_user_address', address);
          localStorage.setItem('zeb_username', data.data.username);
          router.push('/dashboard');
        } else {
          alert("Account not found. Please sign up first.");
          router.push('/signup');
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Failed to connect wallet.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, redirect to dashboard as mock login
    // If we have a backend login endpoint /users/login, we'd call it here
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-100/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-200/30 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-[480px] relative z-10">
        <div className="text-center mb-10">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">The Digital Atelier</p>
           <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Welcome back</h1>
           <p className="text-sm font-bold text-slate-400">Access your curated digital collection.</p>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 p-12">
          <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Username</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-900 font-medium"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Password</label>
                <input 
                  type="password" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-900 font-medium"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-cyan-400 text-slate-900 font-black rounded-xl hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/20 uppercase tracking-widest text-xs"
              >
                Sign In
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                <span className="px-4 bg-white text-slate-300">Or continue with</span>
              </div>
            </div>

            <button 
              onClick={handleWalletConnect}
              className="w-full py-5 bg-slate-50 border border-slate-100 text-slate-900 font-black rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
            >
              <Wallet size={18} className="text-cyan-500" />
              Connect Wallet
            </button>

          <div className="mt-10 text-center">
             <p className="text-xs font-bold text-slate-400">
                New to the Atelier? <Link href="/signup" className="text-cyan-500 hover:text-cyan-600 transition-colors">Sign Up</Link>
             </p>
          </div>
        </div>
      </div>
    </main>
  );
}

