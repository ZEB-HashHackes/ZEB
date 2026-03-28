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
  id: string;
  type: 'purchase' | 'sale' | 'bid' | 'listing';
  artworkHash: string;
  amount: number;
  counterparty: string;
  timestamp: string;
  status: 'completed' | 'pending';
}

export interface Wallet {
  address: string;
  isConnected: boolean;
}
