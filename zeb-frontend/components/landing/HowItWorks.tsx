'use client';

import { motion } from 'framer-motion';
import { Wallet, UploadCloud, Coins, BadgeCheck } from 'lucide-react';

const steps = [
  { id: '01', title: '1. Connect Wallet', icon: Wallet },
  { id: '02', title: '2. Upload & Hash', icon: UploadCloud },
  { id: '03', title: '3. Mint on Soroban', icon: Coins },
  { id: '04', title: '4. Trade Freely', icon: BadgeCheck },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-4">How It Works</h2>
          <p className="text-foreground/70 max-w-xl mx-auto text-lg">The transparent path from creative idea to immutable digital asset.</p>
        </div>

        {/* Desktop Diamond/Cross Layout */}
        <div className="hidden lg:grid grid-cols-3 grid-rows-3 gap-8 items-center justify-items-center relative w-full max-w-4xl mx-auto h-[600px]">
          {/* Decorative lines behind */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="w-[1px] h-full bg-primary/50 absolute top-0"></div>
            <div className="h-[1px] w-full bg-primary/50 absolute left-0"></div>
            <div className="w-[70%] h-[70%] border border-primary/30 rounded-full absolute"></div>
          </div>

          <div className="col-start-2 row-start-1 z-10">
             <StepCard step={steps[0]} />
          </div>
          <div className="col-start-3 row-start-2 z-10">
             <StepCard step={steps[1]} />
          </div>
          <div className="col-start-2 row-start-3 z-10">
             <StepCard step={steps[2]} />
          </div>
          <div className="col-start-1 row-start-2 z-10">
             <StepCard step={steps[3]} />
          </div>
          
          {/* Center Text */}
          <div className="col-start-2 row-start-2 z-10 bg-background/80 backdrop-blur-md border-2 border-primary/50 w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(51,255,235,0.2)]">
            <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary text-center leading-tight">
              The<br/>ZEB<br/>Flow
            </span>
          </div>
        </div>

        {/* Mobile/Tablet Fallback Layout */}
        <div className="lg:hidden flex flex-col items-center gap-8 relative z-10">
           {steps.map((step, index) => (
             <div key={index} className="flex items-center gap-4 w-full max-w-sm">
                <div className="hidden sm:block text-primary/30 font-black text-4xl w-12 text-center">
                  {step.id}
                </div>
                <div className="flex-1">
                  <StepCard step={step} />
                </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ step }: { step: any }) {
  const Icon = step.icon;
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-surface border border-surface/50 p-6 rounded-2xl w-full sm:w-64 flex flex-col items-center text-center group transition-all duration-300 hover:border-primary hover:shadow-[0_0_25px_rgba(51,255,235,0.3)] cursor-default relative overflow-hidden"
    >
      <div className="absolute -top-4 -right-4 text-7xl font-black text-foreground/[0.03] group-hover:text-primary/5 transition-colors duration-500">
        {step.id}
      </div>
      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-5 text-primary group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_15px_rgba(51,255,235,0.5)]">
        <Icon size={28} />
      </div>
      <h3 className="font-bold text-xl mb-3 relative z-10 text-foreground/90 group-hover:text-primary transition-colors">{step.title}</h3>
      <div className="h-1 w-12 bg-surface brightness-150 rounded-full group-hover:bg-primary transition-colors mt-2"></div>
    </motion.div>
  );
}
