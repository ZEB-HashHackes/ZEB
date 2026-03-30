'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Clock, Info, ShoppingCart, Gavel, Sparkles } from 'lucide-react'
import { useParams } from 'next/navigation'
import { buynow } from '../../../lib/stellar'

interface ArtistCardProps {
  id?: string
  username?: string
  name?: string
  avatar?: string
  // Add other properties as needed
}


interface ArtCardProps {
  image?: string
  title: string
  creator: string
  price: string
  timer?: string
  hash?: string
  createdAt?: string
  description?: string
  saleType?: 'sale' | 'bid'
  bidders?: number
  fileType?: string
  filePath?: string
  creatorBy?: string
  minPrice?: string
  contentHash?: string
}

const handleBuy = async (hash: string, buyer: string) => {
  try {
    if (!buyer) {
      alert('Connect wallet first')
      return
    }

    if (!hash) {
      alert('Invalid artwork')
      return
    }

    console.log('Buying:', hash, buyer)

    const tx = await buynow(hash, buyer)

    console.log('Transaction success:', tx)

    // optional: refetch or update UI
  } catch (err) {
    console.error('Buy failed:', err)
  }
}

export default function ArtworkDetailPage() {
  const params = useParams()
  const hash = params.hash as string
  const [art, setArt] = useState<ArtCardProps | null>(null)
  const [buyer, setBuyer] = useState('')
  const [creator , setCreator] = useState<ArtistCardProps | null>(null)

  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { getAddress } = await import('@stellar/freighter-api');
        const { address: buyer } = await getAddress();
        setBuyer(buyer);

        const artres = await fetch(`http://localhost:5000/api/arts/${hash}`)
        const data = await artres.json()

        if (data.status === 'ok') {
          setArt(data.data)
          console.log(data.data)
        }

        const creatorRes = await fetch(`http://localhost:5000/api/users/${data.data.creatorBy}`) // speling intentional
        const cdata = await creatorRes.json();

        if (cdata.status === 'ok') {
          setCreator(cdata.data)
          console.log(cdata.data)
        }


      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [hash])



  if (loading) return <div className="p-10 text-center">Loading...</div>
  if (!art) return <div className="p-10 text-center">Not found</div>

  // 🔥 fix image path
   
  const imageUrl = art.fileType === "image"? `http://localhost:5000/${art.filePath}` : ""
 const creatorname = creator != null ? creator.username : art.creatorBy;
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar showSearch={true} />
      <main className="flex-grow pt-32 pb-24 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          
          {/* LEFT IMAGE */}
          <div className="relative aspect-square w-full bg-white rounded-[48px] p-6 shadow-2xl border border-white">
            <img
              src={imageUrl || '/placeholder.png'}
              alt={art.title}
              className="w-full h-full object-cover rounded-[32px] shadow-lg"
            />

            <div className="absolute top-12 left-12 z-20 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                Verified Asset
              </span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col pt-4">
            <h1 className="text-6xl font-black text-slate-900 tracking-tight mb-4">
              {art.title}
            </h1>

            <div className="flex items-center gap-2 mb-8">
              <span className="text-sm font-bold text-slate-400">By</span>
              <span className="text-sm font-black text-cyan-500">
                {creatorname}
              </span>
            </div>

            {/* PRICE BOX */}
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl mb-8">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
                    Current Price
                  </p>
                  <span className="text-5xl font-black text-slate-900">
                    {art.minPrice}
                  </span>
                </div>

                {art.saleType === 'bid' && (
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-4">
                      Bidders
                    </p>
                    <p className="text-xl font-black text-slate-900">
                      {art.bidders || 0}
                    </p>
                  </div>
                )}
              </div>

              {art.saleType === 'bid' && (
                <div className="flex items-center gap-2 mb-10 text-slate-400">
                  <Clock size={16} />
                  <span className="text-xs font-bold">
                    Ends In:{' '}
                    <span className="text-slate-900">
                      {art.timer || 'N/A'}
                    </span>
                  </span>
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex flex-col gap-4">
                <button onClick={() => handleBuy(art.contentHash || '', buyer)} className="w-full py-5 bg-cyan-400 text-slate-900 font-black rounded-[20px] text-sm hover:bg-cyan-500 transition-all">
                  Buy Now
                </button>

                {art.saleType === 'bid' && (
                  <button className="w-full py-5 bg-white border border-slate-200 text-slate-900 font-black rounded-[20px] text-sm hover:bg-slate-50">
                    Place Bid
                  </button>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            {art.description && (
              <div className="flex items-start gap-4 p-6 bg-cyan-50 rounded-3xl border">
                <Info size={20} className="text-cyan-500" />
                <p className="text-[11px] font-bold text-slate-500">
                  {art.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 