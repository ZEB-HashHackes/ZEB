export interface Art {
  _id: string;
  title: string;
  description: string;
  contentHash: string;
  similarityHash?: string;
  filePath: string;
  fileType: string;
  mimeType: string;
  creatorBy: string;
  ownedBy: string;
  category: string;
  minPrice: number;
  listingStatus?: 'NOT_LISTED' | 'AUCTION' | 'FIXED_PRICE';
  listingType?: 'fixed' | 'auction';
  fixedPrice?: number;
  startingPrice?: number;
  auctionEndTime?: number;
  createdAt: string;
  updatedAt: string;
}

// Auction interfaces removed - reverted to static/mock data only
// AuctionWithArt and Auction removed

export interface Listing {
  artworkHash: string;
  seller: string;
  price: number;
  timestamp: number;
}

export interface Activity {
  _id: string;
  type: 'minted' | 'listing' | 'sale' | 'bid' | 'cancelled';
  artId: string;
  from?: string;
  to?: string;
  amount?: number;
  transactionHash?: string;
  timestamp: string;
}

export interface Wallet {
  address: string;
  isConnected: boolean;
}
