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
  createdAt: string;
  updatedAt: string;
}

export interface Auction {
  artworkHash: string;
  seller: string;
  startTime: number;
  endTime: number;
  highestBid: number;
  highestBidder?: string;
}

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
