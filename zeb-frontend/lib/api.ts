import { Art, Activity } from './types';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

export async function uploadArt(formData: FormData) {
  const res = await fetch(`${API_BASE}/arts`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    if (res.status === 409) {
      const data = await res.json();
      throw new Error(data.message || 'Duplicate artwork');
    }
    throw new Error('Upload failed');
  }
  return res.json();
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

// Backend TODO: /api/listings, /api/auctions/seller/:addr
export async function getListings() {
  // Placeholder - backend needed
  return { data: [] as Art[] };
}

export async function getAuctions(address: string) {
  // Placeholder
  return { data: [] };
}
