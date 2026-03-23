'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Gavel, Eye } from 'lucide-react'

interface ArtListingCardProps {
  id: number
  title: string
  img: string
  currentBid: string
  creatorAddress?: string
  ownerAddress?: string
  isOwned?: boolean
  isOnAuction?: boolean
  auctionHref?: string
}

export default function ArtListingCard({
  id,
  title,
  img,
  currentBid,
  creatorAddress,
  ownerAddress,
  isOwned = false,
  isOnAuction = false,
  auctionHref = `/auction/${id}`
}: ArtListingCardProps) {
  return (
    <div className="group relative bg-surface/50 backdrop-blur-xl rounded-3xl border border-surface/50 p-6 hover:border-primary/75 hover:shadow-2xl hover:shadow-primary/25 transition-all duration-500 overflow-hidden h-full flex flex-col">
      {/* IMAGE */}
      <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video bg-gradient-to-br from-muted/50 to-transparent group-hover:scale-[1.02] transition-transform duration-700">
        <Image 
          src={img} 
          alt={title}
          fill 
          className="object-cover group-hover:brightness-110 transition-all duration-700"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
      </div>
      
      {/* [ Owned ]   [ On Auction ] */}
      <div className="flex gap-2 mb-4">
        {isOwned && (
          <div className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck size={12} />
            <span>Owned</span>
          </div>
        )}
        {isOnAuction && (
          <div className="inline-flex items-center gap-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 px-3 py-1 rounded-full text-xs font-bold">
            <Gavel size={12} />
            <span>On Auction</span>
          </div>
        )}
      </div>
      
      {/* Digital Sunset */}
      <h3 className="font-black text-xl mb-4">{title}</h3>
      
      {/* Created by / Current owner */}
      <div className="flex flex-row sm:flex-col gap-4 mb-4 text-sm text-foreground/70">
        {creatorAddress && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground/80">Created by:</span>
            <span>{creatorAddress}</span>
          </div>
        )}
        {ownerAddress && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground/80">Current owner:</span>
            <span className="text-primary font-semibold">{ownerAddress}</span>
          </div>
        )}
      </div>
      
      {/* Current Bid: 300
      <div className="mb-6 text-foreground/80 font-semibold text-lg">
        Current Bid: {currentBid}
      </div> */}
      
      {/* [ View Auction ] */}
      <div className="mt-auto pt-4 border-t border-surface/30">
        <Link 
          href={auctionHref}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-background font-bold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all whitespace-nowrap"
        >
          View Artwork
        </Link>
      </div>
      
      {/* Hover Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-x-full group-hover:translate-x-full" />
    </div>
  )
}
