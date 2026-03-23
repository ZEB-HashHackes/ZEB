/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

interface ArtCardProps {
  image?: string;
  createdAt: string;
  title: string;
  creator: string;
  description: string;
  price: string;
  hash?: string;
  saleType?: 'sale' | 'bid';
}

export default function ArtCard({
  image = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  createdAt,
  title,
  creator,
  description,
  price,
  hash = "0x123abc",
  saleType = "sale"
}: ArtCardProps) {
  return (
    <div className="bg-surface rounded-xl overflow-hidden shadow-lg border border-surface hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(51,255,235,0.15)] flex flex-col group">
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-primary border border-primary/20">
          {createdAt}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-foreground mb-1 truncate">{title}</h3>
        <p className="text-sm text-foreground/60 font-mono mb-3 truncate">By <span className="text-secondary">{creator}</span></p>
        <p className="text-sm text-foreground/80 mb-6 line-clamp-2 flex-grow overflow-hidden text-ellipsis h-[2.5rem]">
          {description}
        </p>
        
        {/* Footer / Price */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">
              {saleType === 'bid' ? 'Current Bid' : 'Current Price'}
            </p>
            <p className={`text-xl font-bold ${saleType === 'bid' ? 'text-secondary' : 'text-primary'}`}>{price}</p>
          </div>
          <Link 
            href={`/artwork/${hash}`} 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              saleType === 'bid' 
                ? 'bg-transparent border border-secondary text-secondary hover:bg-secondary/10 hover:shadow-[0_0_15px_rgba(218,65,103,0.3)]'
                : 'bg-transparent border border-primary text-primary hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(51,255,235,0.3)]'
            }`}
          >
            {saleType === 'bid' ? 'Place Bid' : 'Buy Now'}
          </Link>
        </div>
      </div>
    </div>
  );
}
