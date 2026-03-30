'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { useWallet } from '../../providers/WalletProvider';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Wallet, User, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const { wallet, connectWallet, isConnecting } = useWallet();
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (wallet && step === 1) {
      checkUserExists(wallet.address);
    }
  }, [wallet, step]);

  const checkUserExists = async (address: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/check/${address}`);
      const data = await res.json();
      if (data.exists) {
        setError('Wallet already registered. Please login instead.');
      } else {
        setStep(2);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !wallet) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          publickey: wallet.address 
        }),
      });

      const data = await res.json();
      if (data.status === 'ok') {
        login(data.data);
        setStep(3);
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Connection to server failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase">Create Account</h1>
            <p className="text-slate-400 font-medium text-sm">Join the next generation of digital art collectors.</p>
          </div>

          {/* Steps Indicator */}
          <div className="flex justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 z-0"></div>
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${
                  step >= s ? 'bg-primary text-slate-900' : 'bg-white border-2 border-slate-100 text-slate-300'
                }`}
              >
                {step > s ? <CheckCircle size={18} /> : s}
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            {step === 1 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Wallet size={32} className="text-secondary" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Connect your Wallet</h2>
                <p className="text-slate-400 text-sm">To sign up for ZEB, you must first connect your Stellar wallet via Freighter.</p>
                {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
                <button 
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="w-full py-4 bg-primary text-slate-900 font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isConnecting ? <Loader2 className="animate-spin" /> : <Wallet size={20} />}
                  {isConnecting ? 'Connecting...' : 'Connect Freighter'}
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User size={28} className="text-cyan-500" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Choose Username</h2>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Unique Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your handle..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-cyan-400 transition-all font-bold"
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-slate-900 font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Finalize Signup'}
                  {!loading && <ArrowRight size={20} />}
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 scale-125">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Welcome, {username}!</h2>
                <p className="text-slate-400 text-sm">Your account has been successfully created. Redirecting to your dashboard...</p>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Already have an account? <a href="/login" className="text-cyan-500 hover:underline">Login with wallet</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
