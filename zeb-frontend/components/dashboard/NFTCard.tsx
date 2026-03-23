'use client'

import React from 'react'
import Image from "next/image"
import Link from "next/link"
import { ShieldCheck, Gavel, Clock, DollarSign, Eye } from "lucide-react"

export type Status = "NOT_LISTED" | "FIXED_PRICE" | "AUCTION"

export interface NFTCardProps {
  id: string;
  title: string;
  image: string;

  // ownership context
  isOwner?: boolean;
  isCreator?: boolean;
  creatorAddress?: string;

  // listing state
  status: Status;
  price?: number;        // for fixed price / starting price
  currentBid?: number;   // for auction
  endTime?: number;      // auction timer

  // actions
  onSell?: () => void;
  onUpdatePrice?: () => void;
  onViewAuction?: () => void;
  onView?: () => void;
  onCardClick?: () => void;
}



export default function NFTCard({ id, title, image, isOwner, isCreator, status, price, currentBid, endTime, onSell, onUpdatePrice, onViewAuction, onView, onCardClick }: NFTCardProps) {
  const getStatusColor = (s: Status) => {
    switch (s) {
      case "NOT_LISTED": return "gray";
      case "FIXED_PRICE": return "blue";
      case "AUCTION": return "orange";
    }
  };

  const getPrimaryValue = () => {
    if (status === "FIXED_PRICE" && price) return `Price: ${price} XLM`;
    if (status === "AUCTION" && currentBid) return `Current Bid: ${currentBid} XLM`;
    return "Not Listed";
  };

  const getPrimaryAction = () => {
    if (status === "NOT_LISTED" && onSell) return (
      <button onClick={onSell} className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
        Sell
      </button>
    );
    if (status === "FIXED_PRICE" && onUpdatePrice) return (
      <button onClick={onUpdatePrice} className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        Update Price
      </button>
    );
    if (status === "AUCTION") {
      return onViewAuction ? (
        <button onClick={onViewAuction} className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
          View Auction
        </button>
      ) : (
        <Link href={`/auction/${id}`} className="w-full block text-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
          View Auction
        </Link>
      );
    }
    return onView ? (
      <button onClick={onView} className="w-full bg-primary text-background px-4 py-2 rounded-lg hover:shadow-lg">
        View
      </button>
    ) : (
      <Link href={`/art/${id}`} className="w-full block text-center bg-primary text-background px-4 py-2 rounded-lg hover:shadow-lg">
        View
      </Link>
    );
  };

  const getTimeLeft = () => {
    if (!endTime) return null;
    const now = Date.now();
    const left = endTime - now;
    if (left <= 0) return "Ended";
    const hours = Math.floor(left / 3600000);
    const mins = Math.floor((left % 3600000) / 60000);
    return `${hours}h ${mins}m`;
  };

  return (
<div 
  className="group relative bg-surface/50 backdrop-blur-xl rounded-3xl border border-surface/50 p-6 hover:border-primary/75 hover:shadow-2xl hover:shadow-primary/25 transition-all duration-500 overflow-hidden h-full flex flex-col cursor-pointer" 
  onClick={onCardClick}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onCardClick?.();
    }
  }}
>
      {/* IMAGE */}
      <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video bg-gradient-to-br from-muted/50 to-transparent group-hover:scale-[1.02] transition-transform duration-700">
        <Image 
          src={image} 
          alt={title}
          fill 
          className="object-cover group-hover:brightness-110 transition-all duration-700"
        />
      </div>

      {/* Status Badge */}
      <div className={`inline-flex items-center gap-1 bg-${getStatusColor(status)}-500/20 border border-${getStatusColor(status)}-500/40 text-${getStatusColor(status)}-400 px-3 py-1 rounded-full text-xs font-bold mb-4`}>
        {status === "FIXED_PRICE" && <DollarSign size={12} />}
        {status === "AUCTION" && <Gavel size={12} />}
        {status === "NOT_LISTED" && <ShieldCheck size={12} />}
        <span>{status.replace(/_/g, " ").toUpperCase()}</span>
      </div>

      {/* Title */}
      <h3 className="font-black text-xl mb-4">{title}</h3>

      {/* Ownership */}
      <div className="flex gap-2 mb-4">
        {isOwner && (
          <div className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck size={12} />
            <span>Owned</span>
          </div>
        )}
        {isCreator && (
          <div className="inline-flex items-center gap-1 bg-primary/20 border border-primary/40 text-primary px-3 py-1 rounded-full text-xs font-bold">
            Created
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-6 text-foreground/80 font-semibold text-lg">
        {getPrimaryValue()}
        {status === "AUCTION" && endTime && (
          <div className="text-orange-400 flex items-center gap-1 mt-1 text-sm">
            <Clock size={14} />
            <span>{getTimeLeft()}</span>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="mt-auto pt-4 border-t border-surface/30">
        {getPrimaryAction()}
      </div>

      {/* Shine */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-x-full group-hover:translate-x-full" />
    </div>
  )
}
