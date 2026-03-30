'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUploadArt } from '../../hooks/useUploadArt';
import { useCreateAuction } from '../../hooks/useCreateAuction';
import { useWallet } from '../../providers/WalletProvider';

interface FormDataType {
  title: string;
  file: File | null;
  listingType: 'sell' | 'auction';
  minPrice: string;
  category: 'image' | 'video' | 'audio';
  auctionEndTime: string;
}

export function UploadArtModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { wallet } = useWallet();
  const uploadMutation = useUploadArt();
  const createAuctionMutation = useCreateAuction();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    file: null,
    listingType: 'sell',
    minPrice: '',
    category: 'image',
    auctionEndTime: '',
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Auto-detect category
    let category: FormDataType['category'] = 'image';
    if (file.type.startsWith('video/')) category = 'video';
    else if (file.type.startsWith('audio/')) category = 'audio';

    setFormData((prev) => ({ ...prev, file, category } as FormDataType));

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      file: null,
      listingType: 'sell',
      minPrice: '',
      category: 'image',
      auctionEndTime: '',
    });
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !wallet?.address) {
      alert('File and wallet are required');
      return;
    }

    try {
      // Upload file to backend
      const fd = new FormData();
      fd.append('file', formData.file);
      fd.append('title', formData.title);
      fd.append('description', formData.title);
      fd.append('creatorBy', wallet.address);
      fd.append('ownedBy', wallet.address);
      fd.append('category', formData.category);
      fd.append('minPrice', formData.minPrice);

      const result = await uploadMutation.mutateAsync(fd);
      const hash = result.hash || result.contentHash || result.art_hash || result.data?.hash;
      if (!hash) throw new Error('No hash returned from backend');
      // Register artwork on-chain
       await new Promise(resolve => setTimeout(resolve, 5000));
      // Fixed-price sale
      if (formData.listingType === 'sell') {
        const { listForSaleOnChain } = await import('../../lib/stellar');
        await listForSaleOnChain(hash, wallet.address, parseFloat(formData.minPrice));

      }

      // Auction
      if (formData.listingType === 'auction' && formData.auctionEndTime) {
        const { createAuctionOnChain } = await import('../../lib/stellar');
        const auctionEndSec = Math.floor(new Date(formData.auctionEndTime).getTime() / 1000);
        await createAuctionOnChain(hash, wallet.address, Date.now(),auctionEndSec);

        // Optional: backend mutation for auctions
        await createAuctionMutation.mutateAsync({
          art_hash: hash,
          seller: wallet.address, 
          end_time: auctionEndSec * 1000,
        });
      }

      alert('Artwork uploaded and listed successfully!');
      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
      alert((err as Error)?.message || 'An error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black">Upload Artwork</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">File</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={handleFileChange}
              required
              className="w-full p-3 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <AnimatePresence>
              {preview && (
                <motion.img
                  src={preview}
                  alt="Preview"
                  className="mt-3 h-40 w-full object-cover rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Title */}
          <input
            type="text"
            placeholder="Title *"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value as FormDataType['category'] }))
              }
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
          </div>

          {/* Creator Address */}
          <div>
            <label className="block text-sm font-medium mb-2">Creator</label>
            <input
              type="text"
              value={wallet?.address || ''}
              readOnly
              className="w-full p-3 bg-gray-100 rounded-xl text-xs font-mono truncate"
            />
          </div>

          {/* Listing Type */}
          <div className="flex gap-6 p-3 bg-gray-50 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.listingType === 'sell'}
                onChange={() => setFormData((prev) => ({ ...prev, listingType: 'sell' }))}
              />
              <span>Sell (Fixed Price)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.listingType === 'auction'}
                onChange={() => setFormData((prev) => ({ ...prev, listingType: 'auction' }))}
              />
              <span>Auction</span>
            </label>
          </div>

          {/* Price */}
          {formData.listingType === 'sell' && (
            <div>
              <label className="block text-sm font-medium mb-2">Fixed Price (XLM) *</label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="0.0"
                value={formData.minPrice}
                onChange={(e) => setFormData((prev) => ({ ...prev, minPrice: e.target.value }))}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Auction fields */}
          {formData.listingType === 'auction' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Starting Price (XLM) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.minPrice}
                  onChange={(e) => setFormData((prev) => ({ ...prev, minPrice: e.target.value }))}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Auction End *</label>
                <input
                  type="datetime-local"
                  value={formData.auctionEndTime}
                  min={new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)}
                  onChange={(e) => setFormData((prev) => ({ ...prev, auctionEndTime: e.target.value }))}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 p-3 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploadMutation.isPending || createAuctionMutation.isPending}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white p-3 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadMutation.isPending || createAuctionMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Uploading...
                </>
              ) : (
                'Upload & List'
              )}
            </button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {uploadMutation.isError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3"
              >
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-800">{(uploadMutation.error as Error)?.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </motion.div>
  );
}
