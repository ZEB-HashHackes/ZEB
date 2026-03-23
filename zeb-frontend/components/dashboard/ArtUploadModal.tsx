'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { X, UploadCloud, Image as ImageIcon, Type, BookOpen, Music, Video, Tag, DollarSign } from 'lucide-react'

interface ArtUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (newArt: {
    title: string
    description: string
    category: string
    genre: string
    img: string
    listImmediately?: boolean
    listingType?: 'fixed' | 'auction'
    minPrice?: string
    startBid?: string
    endTime?: number
  }) => void
}

export default function ArtUploadModal({ isOpen, onClose, onUpload }: ArtUploadModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'digital art',
    genre: 'other',
    minPrice: '',
  })
  const [listingOptions, setListingOptions] = useState({
    listImmediately: false,
    listingType: 'fixed' as 'fixed' | 'auction',
    startBid: '',
    endDateTime: '',
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const categories = [
    { value: 'digital art', label: 'Digital Art', icon: ImageIcon },
    { value: 'book', label: 'Book', icon: BookOpen },
    { value: 'literary work', label: 'Literary Work', icon: Type },
    { value: 'music', label: 'Music', icon: Music },
    { value: 'video', label: 'Video', icon: Video },
  ] as const

  const genres = [
    'hip hop', 'classic', 'rock', 'pop', 'jazz', 'other'
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      setFormData(prev => ({ ...prev }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !preview) return

    setIsUploading(true)
    
    // Simulate API upload
    setTimeout(() => {
      onUpload({
        title: formData.title,
        description: formData.description || 'No description provided',
        category: formData.category,
        genre: formData.genre,
        img: preview!,
        listImmediately: listingOptions.listImmediately,
        ...(listingOptions.listImmediately && {
          listingType: listingOptions.listingType,
          ...(listingOptions.listingType === 'fixed' && { minPrice: formData.minPrice }),
          ...(listingOptions.listingType === 'auction' && {
            startBid: listingOptions.startBid,
            endTime: listingOptions.endDateTime ? new Date(listingOptions.endDateTime).getTime() : undefined
          })
        })
      })
      setIsUploading(false)
      onClose()
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'digital art',
        genre: 'other',
        minPrice: '',
      })
      setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-surface/95 backdrop-blur-2xl border border-surface/50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface/100 backdrop-blur-xl border-b border-surface/50 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl shadow-lg">
                <UploadCloud size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Upload New Artwork
                </h2>
                <p className="text-foreground/70">Register your creation on the blockchain</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-surface/50 rounded-2xl transition-all group">
              <X className="w-6 h-6 text-foreground/70 group-hover:text-foreground" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid lg:grid-cols-2 gap-12">
          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-lg font-bold flex items-center gap-2">
              <ImageIcon size={20} className="text-primary/70" />
              Artwork Preview
            </label>
            <div className="relative">
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/*,.pdf"
                onChange={handleFileChange}
                className="w-full file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-primary file:to-secondary file:text-background hover:file:shadow-lg transition-all cursor-pointer"
                required
              />
              {preview && (
                <div className="mt-4 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-muted/50">
                  <Image
                    src={preview}
                    alt="Preview"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-lg font-bold mb-3 flex items-center gap-2">
                <Tag size={20} className="text-primary/70" />
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-6 py-4 bg-surface/50 border border-surface/30 rounded-2xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg placeholder:text-foreground/50"
                placeholder="Enter artwork title..."
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-bold mb-3 flex items-center gap-2">
                <Type size={20} className="text-primary/70" />
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-6 py-4 bg-surface/50 border border-surface/30 rounded-2xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-vertical"
                placeholder="Describe your artwork..."
              />
            </div>

            {/* Category & Genre */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-bold mb-3 flex items-center gap-2">
                  <div className="p-1.5 bg-primary/20 rounded-lg">
                    <ImageIcon size={16} />
                  </div>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-6 py-4 bg-surface/50 border border-surface/30 rounded-2xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-bold mb-3 flex items-center gap-2">
                  <div className="p-1.5 bg-secondary/20 rounded-lg">
                    <Music size={16} />
                  </div>
                  Genre
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                  className="w-full px-6 py-4 bg-surface/50 border border-surface/30 rounded-2xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre.charAt(0).toUpperCase() + genre.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Listing Options */}
            <div className="space-y-4">
              <label className="block text-xl font-bold mb-4 flex items-center gap-2">
                <Tag size={24} className="text-primary/70" />
                Listing Options
              </label>
              
              {/* Just Keep vs List Immediately */}
              <div className="space-y-3 p-6 bg-surface/50 backdrop-blur-xl rounded-3xl border border-surface/30">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg min-w-[120px]">Keep private?</span>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="keepPrivate"
                        checked={!listingOptions.listImmediately}
                        onChange={() => setListingOptions(prev => ({ ...prev, listImmediately: false }))}
                        className="w-5 h-5 text-primary bg-surface/50 border-surface/30 rounded-full focus:ring-primary focus:ring-2 cursor-pointer group-hover:ring-2 transition-all"
                      />
                      <span className="font-medium text-foreground/90 group-hover:text-foreground">Just keep</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="keepPrivate"
                        checked={listingOptions.listImmediately}
                        onChange={() => setListingOptions(prev => ({ ...prev, listImmediately: true }))}
                        className="w-5 h-5 text-primary bg-surface/50 border-surface/30 rounded-full focus:ring-primary focus:ring-2 cursor-pointer group-hover:ring-2 transition-all"
                      />
                      <span className="font-medium text-foreground/90 group-hover:text-foreground">List for sale</span>
                    </label>
                  </div>
                </div>

                {listingOptions.listImmediately && (
                  <>
                    <div className="pt-6 border-t border-surface/30">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-bold text-lg min-w-[120px]">Sale Type:</span>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="radio"
                              name="saleType"
                              checked={listingOptions.listingType === 'fixed'}
                              onChange={() => setListingOptions(prev => ({ ...prev, listingType: 'fixed' }))}
                              className="w-5 h-5 text-primary bg-surface/50 border-surface/30 rounded-full focus:ring-primary focus:ring-2 cursor-pointer group-hover:ring-2"
                            />
                            <span className="font-medium">Fixed Price</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="radio"
                              name="saleType"
                              checked={listingOptions.listingType === 'auction'}
                              onChange={() => setListingOptions(prev => ({ ...prev, listingType: 'auction' }))}
                              className="w-5 h-5 text-primary bg-surface/50 border-surface/30 rounded-full focus:ring-primary focus:ring-2 cursor-pointer group-hover:ring-2"
                            />
                            <span className="font-medium">Auction</span>
                          </label>
                        </div>
                      </div>

                      {listingOptions.listingType === 'fixed' ? (
                        <div className="space-y-3">
                          <label className="block w-full">
                            <span className="text-sm font-medium text-foreground/80 mb-2 block">Fixed Price (XLM)</span>
                            <input
                              type="number"
                              value={formData.minPrice}
                              onChange={(e) => setFormData(prev => ({ ...prev, minPrice: e.target.value }))}
                              className="w-full px-5 py-3 bg-surface/30 border border-surface/40 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg"
                              placeholder="e.g. 250"
                              min="0"
                              step="0.01"
                            />
                          </label>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block w-full">
                              <span className="text-sm font-medium text-foreground/80 mb-2 block">Starting Bid (XLM)</span>
                              <input
                                type="number"
                                value={listingOptions.startBid}
                                onChange={(e) => setListingOptions(prev => ({ ...prev, startBid: e.target.value }))}
                                className="w-full px-5 py-3 bg-surface/30 border border-surface/40 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg"
                                placeholder="e.g. 100"
                                min="0"
                                step="0.01"
                              />
                            </label>
                          </div>
                          <div>
                            <label className="block w-full">
                              <span className="text-sm font-medium text-foreground/80 mb-2 block">Auction End</span>
                              <input
                                type="datetime-local"
                                value={listingOptions.endDateTime}
                                onChange={(e) => setListingOptions(prev => ({ ...prev, endDateTime: e.target.value }))}
                                className="w-full px-5 py-3 bg-surface/30 border border-surface/40 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!formData.title.trim() || !preview || isUploading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-background font-black py-6 px-8 rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isUploading ? (
                <>
                  <div className="w-6 h-6 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Registering on Blockchain...
                </>
              ) : (
                <>
                  <UploadCloud size={24} />
                  Upload & Register
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

