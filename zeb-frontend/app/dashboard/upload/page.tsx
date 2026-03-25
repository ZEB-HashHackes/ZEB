'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Upload, X, Shield, Clock, Plus, Tag, DollarSign, Image as ImageIcon, Video, Music, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { registerArtworkOnChain, listForSaleOnChain } from '@/lib/stellar';
import Navbar from '../../../components/layout/Navbar'
import Footer from '../../../components/layout/Footer'
import Swal from "sweetalert2";

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState<'idle' | 'uploading' | 'blockchain' | 'success'>('idle');
  const [txHash, setTxHash] = React.useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'image',
    listingType: 'fixed',
    price: '0.00',
    duration: '24 Hours',
  })
  
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null); // Added file state
  const fileRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: 'image', label: 'Image', icon: ImageIcon },
    { value: 'music', label: 'Music', icon: Music },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'text', label: 'Text', icon: FileText }, // Changed Type to FileText
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setPreview(url)
      setFile(selectedFile); // Set the file state
    }
  }

  const handleUpload = async () => {
   if (!file) {
    Swal.fire('No File', 'Please select a file first.', 'warning');
    return;   }
    const address = localStorage.getItem('zeb_user_address');
    if (!address) {
      Swal.fire('Wallet Required', 'Please connect your wallet first.', 'warning');
      router.push('/login');
      return;
    }
    setLoading(true);
    setUploadStatus('uploading');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('title', formData.title);
      formDataUpload.append('description', formData.description);
      formDataUpload.append('creatorBy', address);
      formDataUpload.append('ownedBy', address);
      formDataUpload.append('category', formData.category);
      formDataUpload.append('minPrice', formData.price);

      // 1. Backend Upload & Verification
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/arts`, {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Backend upload failed");

      const { hash } = data.data;

      // 2. Blockchain Registration
      setUploadStatus('blockchain');
      const hash_onchain = await registerArtworkOnChain(formData.title, hash, address);
      setTxHash(hash_onchain);

      // 3. (Optional) Chain Listing if Fixed Price
      if (formData.listingType === 'fixed') {
        await listForSaleOnChain(hash, address, parseFloat(formData.price));
      }

      setUploadStatus('success');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err: any) {
      console.error("Upload error:", err);
      
      let errorMsg = err.message || "Failed to register artwork";
      if (err.message?.includes("404") || err.message?.toLowerCase().includes("account not found")) {
        errorMsg = "Your Stellar account is not funded on Testnet. Please visit https://laboratory.stellar.org/#account-creator to fund it via Friendbot before registering.";
      }
      
      Swal.fire('Upload Failed', errorMsg, 'error');
      setUploadStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-12">
          <div className="mb-10">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create New Asset</h2>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Secure your creative work on the blockchain</p>
          </div>

          <div 
             onClick={() => fileRef.current?.click()}
             className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 transition-all mb-8 overflow-hidden group"
          >
             {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
             ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-cyan-400 shadow-sm mb-3 mx-auto">
                     <Upload size={24} />
                  </div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Drop artwork here</p>
                </div>
             )}
             <input type="file" ref={fileRef} onChange={handleFileChange} className="hidden" />
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6"> 
             <div className="flex gap-4">
                <div className="flex-[2] space-y-2">
                   <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Asset Title</label>
                   <input 
                     type="text" 
                     placeholder="Neon Horizon #001"
                     className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black focus:outline-none focus:border-cyan-400"
                     value={formData.title}
                     onChange={e => setFormData({...formData, title: e.target.value})}
                   />
                </div>
                <div className="flex-1 space-y-2">
                   <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Category</label>
                   <select 
                     className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black focus:outline-none focus:border-cyan-400 appearance-none uppercase"
                     value={formData.category}
                     onChange={e => setFormData({...formData, category: e.target.value})}
                   >
                     {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                     ))}
                   </select>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                   placeholder="Describe your creative vision..."
                   className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black focus:outline-none focus:border-cyan-400 min-h-[100px]"
                   value={formData.description}
                   onChange={e => setFormData({...formData, description: e.target.value})}
                />
             </div>

             <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                <div className="space-y-4">
                   <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Listing Type</label>
                   <div className="flex gap-3">
                      <button 
                        onClick={() => setFormData({...formData, listingType: 'fixed'})}
                        className={`flex-1 py-3 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.listingType === 'fixed' ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                      >
                         Fixed Price
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, listingType: 'auction'})}
                        className={`flex-1 py-3 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.listingType === 'auction' ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                      >
                         Auction
                      </button>
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">{formData.listingType === 'fixed' ? 'Sale Price' : 'Starting Bid'}</label>
                   <input 
                     type="text" 
                     placeholder="0.00"
                     className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black focus:outline-none focus:border-cyan-400"
                     value={formData.price} 
                     onChange={e => setFormData({...formData, price: e.target.value})} 
                   />
                </div>
             </div>

             {formData.listingType === 'auction' && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                   <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Auction Duration</label>
                   <select 
                     className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black focus:outline-none focus:border-cyan-400 appearance-none uppercase"
                     value={formData.duration} 
                     onChange={e => setFormData({...formData, duration: e.target.value})} 
                   >
                     <option>24 Hours</option>
                     <option>3 Days</option>
                     <option>7 Days</option>
                   </select>
                </div>
             )}

             <button 
              onClick={handleUpload}
              disabled={loading}
              className="w-full py-5 bg-cyan-400 text-slate-900 font-black rounded-2xl hover:bg-cyan-500 transition-all shadow-xl shadow-cyan-400/20 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {uploadStatus === 'uploading' ? 'Verifying & Uploading...' : 'Registering on Blockchain...'}
                </>
              ) : uploadStatus === 'success' ? (
                <>
                  <CheckCircle2 size={18} className="text-slate-900" />
                  Asset Secured!
                </>
              ) : 'Secure Asset on Blockchain'}
            </button>
          </form>
        </div>
        <p className="mt-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Gas fees will apply upon minting.</p>
      </div>
      <Footer />
    </main>
  )
}
