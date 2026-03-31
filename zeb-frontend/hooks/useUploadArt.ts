import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadArt } from '../lib/api';

import { useWallet } from '../providers/WalletProvider';
import { useCallback } from 'react';

interface UploadResult {
  status?: string;
  artId?: string;
  hash?: string;
  contentHash?: string;
  art_hash?: string;
  data?: { hash: string; artId: string };
  onchainTx?: string;
}

export function useUploadArt() {
  const queryClient = useQueryClient();
  const { wallet } = useWallet();

  const mutationFn = useCallback(async (formData: FormData): Promise<UploadResult> => {
    // 1. Upload to backend/DB
    const uploadResult = await uploadArt(formData);
    
    // 2. Extract data
    const title = (formData.get('title') as string) || '';
    const hash = uploadResult.data?.hash || uploadResult.contentHash || uploadResult.hash || uploadResult.art_hash;
    if (!hash) throw new Error('No hash returned from upload');
    
    // 3. Optional: Register onchain (if wallet connected)
    let onchainTx: string | undefined;
    if (wallet?.isConnected && wallet.address) {
      const { registerArtworkOnChain } = await import('../lib/stellar');
      onchainTx = await registerArtworkOnChain(title, hash, wallet.address);
    }
    
    return {
      ...uploadResult,
      hash,
      onchainTx
    };
  }, [wallet]);

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      console.error('✅ Full upload+onchain success:', data);
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['arts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-arts'] });
    },
    onError: (error: any) => {
      console.error('❌ Upload+onchain failed:', error);
      // Removed alerts here to allow the Modal UI to handle specific states 
      // (e.g., Duplicates/Flagged messages).
    },
  });
}
