'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, UploadCloud, Image as ImageIcon, Type, 
  BookOpen, Music, Video, Tag, DollarSign, Clock, ShieldCheck, AlertCircle
} from 'lucide-react'
import Navbar from '../../../components/layout/Navbar'
import Footer from '../../../components/layout/Footer'

export default function UploadPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'digital art',
    genre: 'other',
    minPrice: '',
  })
  
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDuplicate, setIsDuplicate] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: 'digital art', label: 'Digital Art', icon: ImageIcon },
    { value: 'book', label: 'Book', icon: BookOpen },
    { value: 'literary work', label: 'Literary Work', icon: Type },
    { value: 'music', label: 'Music', icon: Music },
    { value: 'video', label: 'Video', icon: Video },
  ] as const

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !preview || !fileRef.current?.files?.[0]) return

    setIsUploading(true)
    setIsDuplicate(false)
    
    try {
      const file = fileRef.current.files[0];
      const { isConnected, getAddress } = await import('@stellar/freighter-api');
      
      const connected = await isConnected();
      if (!connected.isConnected) {
        alert("Please connect your Freighter wallet first.");
        setIsUploading(false);
        return;
      }

      const { address: userAddress } = await getAddress();
      
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('title', formData.title);
      formDataUpload.append('description', formData.description);
      formDataUpload.append('creatorBy', userAddress);
      formDataUpload.append('ownedBy', userAddress);
      formDataUpload.append('category', formData.category);
      formDataUpload.append('minPrice', formData.minPrice || '0');

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
      const response = await fetch(`${baseUrl}/arts`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.status === 409) {
        setIsDuplicate(true);
        setIsUploading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Registration failed on server');
      }

      const result = await response.json();
      const contentHash = result.data?.contentHash;

      // 2. Register on Soroban
      const { 
        BASE_FEE, 
        TransactionBuilder, 
        Networks, 
        Address, 
        Contract,
        TimeoutInfinite
      } = await import('@stellar/stellar-sdk');
      const { signTransaction } = await import('@stellar/freighter-api');

      const server = new (await import('@stellar/stellar-sdk')).rpc.Server("https://soroban-testnet.stellar.org");
      const contractId = "CCM2A5Z7GJSCO7G274N65B7YYAAV44QZ2X46UUTI3V37Z3L7XY7XZEB2"; // Replace with your actual contract ID
      const contract = new Contract(contractId);

      // Check account
      try {
        await server.getAccount(userAddress);
      } catch (err: any) {
        if (err.message?.includes("not found")) {
          alert(`Account not found on Testnet. Please fund your account ${userAddress} via Friendbot first.`);
          setIsUploading(false);
          return;
        }
      }

      const tx = new TransactionBuilder(
        await server.getAccount(userAddress),
        { fee: BASE_FEE, networkPassphrase: Networks.TESTNET }
      )
      .addOperation(
        contract.call(
          "register_artwork",
          new Address(userAddress).toScVal(),
          (await import('@stellar/stellar-sdk')).nativeToScVal(contentHash, { type: 'string' }),
          (await import('@stellar/stellar-sdk')).nativeToScVal(formData.title, { type: 'string' }),
          (await import('@stellar/stellar-sdk')).nativeToScVal(parseInt(formData.minPrice) || 0, { type: 'u32' })
        )
      )
      .setTimeout(TimeoutInfinite)
      .build();

      const signedTx = await signTransaction(tx.toXDR(), { network: 'TESTNET' } as any);
      const signedTxXdr = typeof signedTx === 'string' ? signedTx : (signedTx as any).signedTxXdr;
      const resultTx = await server.sendTransaction(TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET));

      if (resultTx.status !== "PENDING") {
        throw new Error("Transaction failed");
      }

      alert("Artwork registered successfully!");
      router.push('/dashboard');
    } catch (error) {
      console.error("Registration error:", error);
      alert(error instanceof Error ? error.message : "Registration failed. Please check console.");
    } finally {
      setIsUploading(false);
    }
  }

  if (isDuplicate) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col pt-20">
        <Navbar dashboardMode />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-surface/50 backdrop-blur-3xl p-10 rounded-3xl border border-primary/30 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
            <Clock className="w-20 h-20 text-primary mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-black mb-4">Under Review</h2>
            <p className="text-foreground/70 mb-8 leading-relaxed">
              Our system detected an artwork similar to yours. To ensure originality and protect creators, 
              our admin team will review this submission within <span className="text-primary font-bold">24-48 hours</span>.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-background font-black rounded-2xl hover:shadow-2xl hover:shadow-primary/40 transition-all transform hover:-translate-y-1 active:scale-95"
            >
              I UNDERSTAND
            </button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pt-20">
      <Navbar dashboardMode />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Back to Dashboard</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-surface/30 backdrop-blur-xl p-8 md:p-12 rounded-[40px] border border-surface/50 shadow-2xl">
          {/* Left: Upload & Preview */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-8">
              Visual Preview
            </h2>
            
            <div 
              onClick={() => fileRef.current?.click()}
              className={`relative aspect-square rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden
                ${preview ? 'border-primary/50 bg-surface/50' : 'border-surface/50 hover:border-primary/50 hover:bg-primary/5'}`}
            >
              {preview ? (
                <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
              ) : (
                <div className="text-center p-8">
                  <UploadCloud size={48} className="text-primary/50 mx-auto mb-4" />
                  <p className="font-bold text-foreground/70">Click to upload your artwork</p>
                  <p className="text-sm text-foreground/40 mt-2">Supports Image, Video, Audio, or PDF</p>
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*,video/*,audio/*,application/pdf"
            />
          </div>

          {/* Right: Form Info */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-black mb-8">Artwork Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground/50 mb-2 ml-1">Title</label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    type="text"
                    required
                    placeholder="Enter artwork title..."
                    className="w-full bg-surface/50 border border-surface/50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground/50 mb-2 ml-1">Category</label>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.value })}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all text-xs font-bold
                        ${formData.category === cat.value 
                          ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20' 
                          : 'bg-surface/50 border-surface/50 text-foreground/60 hover:border-primary/30'}`}
                    >
                      <cat.icon size={20} />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground/50 mb-2 ml-1">Description</label>
                <textarea
                  placeholder="Tell us about your masterpiece..."
                  rows={4}
                  className="w-full bg-surface/50 border border-surface/50 rounded-2xl p-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium resize-none"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground/50 mb-2 ml-1">Minimum Price (XLM)</label>
                <div className="relative group">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-surface/50 border border-surface/50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                    value={formData.minPrice}
                    onChange={e => setFormData({ ...formData, minPrice: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-5 bg-gradient-to-r from-primary to-secondary text-background font-black text-xl rounded-2xl hover:shadow-2xl hover:shadow-primary/40 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 mt-8 flex items-center justify-center gap-3"
            >
              {isUploading ? (
                <>
                  <div className="w-6 h-6 border-4 border-background/30 border-t-background rounded-full animate-spin" />
                  MINTING...
                </>
              ) : (
                <>
                  <UploadCloud size={24} />
                  REGISTER ARTWORK
                </>
              )}
            </button>
            
            <p className="text-center text-xs text-foreground/40 font-medium">
              By registering, you confirm that you are the original creator of this content.
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  )
}
