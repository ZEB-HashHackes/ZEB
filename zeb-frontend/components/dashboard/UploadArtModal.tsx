'use client'

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image, FileText, Tag, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUploadArt } from '../../hooks/useUploadArt';
import { useWallet } from '../../providers/WalletProvider';

interface UploadFormData {
  title: string;
  description: string;
  category: string;
  minPrice: string;
  file: File | null;
}

const categories = [
  { value: 'digital art', label: 'Digital Art' },
  { value: 'image', label: 'Image' },
  { value: 'book', label: 'Book' },
  { value: 'literary work', label: 'Literary Work' },
  { value: 'music', label: 'Music' },
  { value: 'video', label: 'Video' },
  { value: 'text', label: 'Text' },
] as const;

export function UploadArtModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    category: 'digital art',
    minPrice: '0',
    file: null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { wallet } = useWallet();
  const uploadMutation = useUploadArt();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !wallet?.address) {
      alert('File and wallet required');
      return;
    }

    const fd = new FormData();
    fd.append('file', formData.file);
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('creatorBy', wallet.address);
    fd.append('ownedBy', wallet.address);
    fd.append('category', formData.category);
    fd.append('minPrice', formData.minPrice);

    uploadMutation.mutate(fd, {
      onSuccess: () => {
        alert('Upload successful!');
        resetForm();
        onClose();
      },
    });
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', category: 'digital art', minPrice: '0', file: null });
    setPreview(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Upload New Artwork</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Artwork File *</label>
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,audio/*,video/*,.pdf,.txt"
                onChange={handleFileChange}
                className="w-full p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-slate-300 focus:border-cyan-400 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-slate-700 hover:file:bg-cyan-100 cursor-pointer"
                required
              />
              {!formData.file && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <UploadCloud size={48} className="text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500">Click to upload or drag & drop</p>
                </div>
              )}
            </div>
            <AnimatePresence>
              {preview && (
                <motion.img
                  src={preview}
                  alt="Preview"
                  className="mt-4 w-full h-48 object-cover rounded-xl shadow-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-4 border border-slate-200 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 focus:outline-none"
                required
                maxLength={128}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-4 border border-slate-200 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Min Price (XLM)</label>
              <div className="relative">
                <DollarSign size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, minPrice: e.target.value }))}
                  className="w-full pl-12 p-4 border border-slate-200 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Creator Address</label>
              <input
                type="text"
                value={wallet?.address || ''}
                readOnly
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              maxLength={512}
              className="w-full p-4 border border-slate-200 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 focus:outline-none resize-vertical"
              placeholder="Tell the story behind your creation..."
            />
            <p className="text-xs text-slate-500 mt-1">{formData.description.length}/512</p>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 bg-slate-100 text-slate-700 font-black rounded-xl hover:bg-slate-200 transition-all text-sm uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadMutation.isPending || !formData.file}
              className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-black rounded-xl hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all text-sm uppercase tracking-wider"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Artwork'
              )}
            </button>
          </div>
        </form>

        {uploadMutation.isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
          >
            <AlertCircle size={20} className="text-red-500" />
            <span className="text-sm text-red-900 font-medium">{(uploadMutation.error as Error)?.message}</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

