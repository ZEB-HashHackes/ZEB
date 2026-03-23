'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login success - redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <main className="relative min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-background via-surface/30 to-background overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 20px #33FFEB40); }
          50% { opacity: 1; filter: drop-shadow(0 0 40px #33FFEB80); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .node { animation: pulse-glow 2s infinite; }
        .orbit { animation: rotate 20s linear infinite; }
        .orbit2 { animation: rotate 15s linear reverse infinite; }
        .float { animation: float 6s ease-in-out infinite; }
        .glow {
          filter: drop-shadow(0 0 10px rgba(51, 255, 235, 0.8));
        }
      `}</style>

      {/* Left Animation - Hidden on mobile */}
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-16 relative overflow-hidden">
        <div className="float relative w-[400px] h-[400px]">
          <svg viewBox="0 0 400 400" className="w-full h-full opacity-80">
            {/* Orbits */}
            <circle cx="200" cy="200" r="140" stroke="url(#orbit1)" strokeWidth="1.5" fill="none" className="orbit opacity-60"/>
            <circle cx="200" cy="200" r="100" stroke="url(#orbit2)" strokeWidth="1.5" fill="none" className="orbit2 opacity-60"/>
            <circle cx="200" cy="200" r="160" stroke="url(#orbit1)" strokeWidth="0.5" fill="none" className="orbit" style={{animationDuration: '25s'}} opacity="0.4"/>
            {/* Nodes */}
            <g className="node glow"><circle cx="200" cy="60" r="14" fill="#33FFEB"/></g>
            <g className="node glow" style={{animationDelay: '0.7s'}}><circle cx="340" cy="200" r="14" fill="#DA4167"/></g>
            <g className="node glow" style={{animationDelay: '1.4s'}}><circle cx="200" cy="340" r="14" fill="#33FFEB"/></g>
            <g className="node glow" style={{animationDelay: '2.1s'}}><circle cx="60" cy="200" r="12" fill="#DA4167"/></g>
            {/* Gradiants */}
            <defs>
              <linearGradient id="orbit1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#33FFEB20"/>
                <stop offset="50%" stopColor="#33FFEB40"/>
                <stop offset="100%" stopColor="#DA416740"/>
              </linearGradient>
              <linearGradient id="orbit2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#DA416740"/>
                <stop offset="50%" stopColor="#33FFEB40"/>
                <stop offset="100%" stopColor="#33FFEB20"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute text-5xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-glow top-1/4 left-1/4">
          Zeb
        </div>
        <div className="absolute text-2xl text-foreground/70 font-semibold bottom-1/4 left-1/4 max-w-xs">
          Decentralized Asset Registry & Marketplace
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 lg:p-20 bg-background/50 backdrop-blur-sm">
        <div className="w-full max-w-md space-y-8 bg-surface/95 backdrop-blur-xl border border-border/30 rounded-3xl p-12 shadow-2xl ring-1 ring-primary/20">
          <div className="text-center">
            <h1 className="text-5xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary via-foreground to-secondary bg-clip-text text-transparent mb-4 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xl text-foreground/60 max-w-sm mx-auto leading-relaxed">
              Sign in to access your Zeb dashboard and marketplace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="identifier" className="block text-sm font-semibold text-foreground tracking-wide">
                Username              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                value={formData.identifier}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-surface/60 hover:bg-surface/70 border border-border/40 hover:border-primary/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition-all duration-300 text-foreground placeholder:text-foreground/40 text-lg shadow-sm hover:shadow-md"
                placeholder="username"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground tracking-wide">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-surface/60 hover:bg-surface/70 border border-border/40 hover:border-primary/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition-all duration-300 text-foreground placeholder:text-foreground/40 text-lg shadow-sm hover:shadow-md"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 active:scale-95 text-background font-bold py-5 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl ring-2 ring-primary/30 hover:ring-primary/50 text-lg tracking-wide transform"
            >
              Sign In to Zeb
            </button>
          </form>

          <div className="text-center pt-8 border-t border-border/30">
            <p className="text-sm text-foreground/50 mb-4">
              Don't have an account yet, <Link href="/signup" className="text-primary hover:text-primary/80 font-semibold underline">signup</Link>?
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

