import { Art, Activity } from './types';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

export async function uploadArt(formData: FormData) {
  const res = await fetch(`${API_BASE}/arts`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Upload failed');
  }
  return data;
}

export async function getArts(): Promise<{ data: Art[] }> {
  const res = await fetch(`${API_BASE}/arts`);
  if (!res.ok) throw new Error('Failed to fetch arts');
  return res.json();
}

export async function getUserArts(address: string): Promise<{ data: Art[] }> {
  const res = await fetch(`${API_BASE}/arts/creator/${address}`);
  if (!res.ok) throw new Error('Failed to fetch user arts');
  return res.json();
}

export async function getActivities(address: string): Promise<{ data: Activity[] }> {
  const res = await fetch(`${API_BASE}/activity/user/${address}`);
  if (!res.ok) throw new Error('Failed to fetch activities');
  return res.json();
}

export async function createAuction(data: { art_hash: string; seller: string; end_time: number }) {
  const res = await fetch(`${API_BASE}/auction/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create auction');
  }
  return res.json();
}

// Backend TODO: /api/listings, /api/auctions/seller/:addr
export async function getListings() {
  // Placeholder - backend needed
  return { data: [] as Art[] };
}

// Auctions reverted to static mock data only (removed real-time fetch)
// getAuctions removed - no backend /auction/active endpoint exists

export async function getSellerAuctions(seller: string) {
  return { data: [] as Art[] };
}

// Fixed price listing TODO
// export async function createFixedListing(...) { }
