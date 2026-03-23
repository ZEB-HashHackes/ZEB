'use client'

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { User, Wallet, Camera, Edit, Check, X, Upload, ShieldCheck, Gavel, TrendingUp, BarChart3 } from "lucide-react"
import ProfileHeader from "../../../components/dashboard/ProfileHeader"

interface UserProfile {
  avatar: string
  username: string
  wallet: string
}

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    avatar: "/file.svg",
    username: "Mr. X",
    wallet: "GBBN5OTUVHD5DLYXHLDCSLDS64ZWYTL7RMEWJ25VDLFDE3KVI6ZB6ICD"
  })
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile)
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("userProfile")
    if (saved) {
      const parsed = JSON.parse(saved)
      setProfile(parsed)
      setTempProfile(parsed)
    }
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewAvatar(url)
      setTempProfile(prev => ({ ...prev, avatar: url }))
    }
  }

  const validateWallet = (address: string) => {
    return address.startsWith("G") && address.length === 56
  }

  const handleSave = async () => {
    if (!validateWallet(tempProfile.wallet)) {
      alert("Invalid Stellar wallet address")
      return
    }

    setIsSaving(true)
    // Simulate save
    setTimeout(() => {
      setProfile(tempProfile)
      localStorage.setItem("userProfile", JSON.stringify(tempProfile))
      setEditMode(false)
      setPreviewAvatar(null)
      setIsSaving(false)
    }, 1000)
  }

  const handleCancel = () => {
    setTempProfile(profile)
    setPreviewAvatar(null)
    if (fileRef.current) fileRef.current.value = ""
    setEditMode(false)
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto p-8 space-y-12">
        {/* Profile Hero */}
        <div className="text-center">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl mx-auto bg-gradient-to-br from-primary/10 to-secondary/10">
              <Image
                src={previewAvatar || profile.avatar}
                alt="Profile Avatar"
                width={160}
                height={160}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {editMode && (
                <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary to-secondary p-3 rounded-3xl shadow-2xl cursor-pointer hover:shadow-primary/50 transition-all group">
                  <Camera size={20} className="text-background group-hover:scale-110 transition-transform" />
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-4">
            {editMode ? (
              <input
                type="text"
                value={tempProfile.username}
                onChange={(e) => setTempProfile(prev => ({ ...prev, username: e.target.value }))}
                className="text-4xl md:text-5xl bg-transparent border-none outline-none w-full text-center font-black bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent"
                placeholder="Username"
              />
            ) : (
              profile.username
            )}
          </h1>
          
          <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-surface/50 backdrop-blur-xl rounded-3xl border border-surface/30 max-w-md mx-auto">
            <Wallet size={24} className="text-primary shrink-0" />
              <div className="font-mono text-lg bg-surface/70 px-4 py-2 rounded-2xl border border-surface/50 backdrop-blur-sm truncate">
                {editMode ? (
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg">{tempProfile.wallet || "Not connected"}</span>
                    <button
                      onClick={() => {
                        // Mock Freighter/MetaMask connect
                        const newWallet = "GC" + Math.random().toString(36).substring(2, 58).toUpperCase()
                        setTempProfile(prev => ({ ...prev, wallet: newWallet }))
                      }}
                      className="px-4 py-1.5 bg-gradient-to-r from-primary to-secondary text-background font-bold rounded-xl hover:shadow-lg transition-all text-sm whitespace-nowrap flex items-center gap-1"
                    >
                      <Upload size={14} />
                      Connect Wallet
                    </button>
                  </div>
                ) : (
                  profile.wallet
                )}
              </div>
          </div>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-background font-bold rounded-3xl hover:shadow-2xl hover:shadow-primary/40 transition-all text-lg"
            >
              <Edit size={20} />
              Edit Profile
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 max-w-sm bg-gradient-to-r from-green-500 to-emerald-600 text-background font-bold py-4 px-8 rounded-3xl hover:shadow-2xl hover:shadow-green-500/40 transition-all text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 max-w-sm bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground font-bold py-4 px-8 rounded-3xl hover:shadow-lg transition-all text-lg border border-destructive/50"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group p-8 bg-surface/60 backdrop-blur-xl rounded-3xl border border-surface/40 hover:border-primary/75 hover:shadow-2xl hover:shadow-primary/25 transition-all text-center">
            <ShieldCheck size={48} className="mx-auto mb-4 text-primary group-hover:scale-110 transition-all" />
            <div className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              12
            </div>
            <p className="text-lg font-medium text-foreground/80">Total NFTs</p>
          </div>
          
          <div className="group p-8 bg-surface/60 backdrop-blur-xl rounded-3xl border border-surface/40 hover:border-secondary/75 hover:shadow-2xl hover:shadow-secondary/25 transition-all text-center">
            <Gavel size={48} className="mx-auto mb-4 text-secondary group-hover:scale-110 transition-all" />
            <div className="text-3xl font-black text-secondary mb-2">
              3
            </div>
            <p className="text-lg font-medium text-foreground/80">Active Auctions</p>
          </div>
          
          <div className="group p-8 bg-surface/60 backdrop-blur-xl rounded-3xl border border-surface/40 hover:border-green-500/75 hover:shadow-2xl hover:shadow-green-500/25 transition-all text-center">
            <TrendingUp size={48} className="mx-auto mb-4 text-green-500 group-hover:scale-110 transition-all" />
            <div className="text-3xl font-black text-green-500 mb-2">
              +24%
            </div>
            <p className="text-lg font-medium text-foreground/80">Portfolio Growth</p>
          </div>
          
          <div className="group p-8 bg-surface/60 backdrop-blur-xl rounded-3xl border border-surface/40 hover:border-orange-500/75 hover:shadow-2xl hover:shadow-orange-500/25 transition-all text-center">
            <BarChart3 size={48} className="mx-auto mb-4 text-orange-500 group-hover:scale-110 transition-all" />
            <div className="text-3xl font-black text-orange-500 mb-2">
              2
            </div>
            <p className="text-lg font-medium text-foreground/80">Winning Bids</p>
          </div>
        </div>
      </main>
    </div>
  )
}

