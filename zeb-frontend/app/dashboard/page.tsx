'use client'

import React, { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import Sidebar, { TabType } from '../../components/dashboard/Sidebar'
import Overview from '../../components/dashboard/Overview'
import ProfileHeader from '../../components/dashboard/ProfileHeader'
import ArtGrid from '../../components/dashboard/ArtGrid'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />
      case 'my-works': return (
        <ArtGrid 
          filter="created" 
          title="My Works" 
          emptyMessage="You haven't created any digital masterpieces yet. Start your journey by uploading your first work!" 
        />
      )
      case 'owned': return (
        <ArtGrid 
          filter="owned" 
          title="Owned Items" 
          emptyMessage="Your collection is currently empty. Browse the marketplace to find unique digital assets." 
        />
      )
      case 'marketplace': return (
        <ArtGrid 
          filter="all" 
          title="Marketplace" 
          emptyMessage="The market is quiet right now. Be the first to list a new artwork for sale!" 
          showMarketActions
        />
      )
      case 'profile': return (
        <div className="bg-surface/30 backdrop-blur-xl p-10 rounded-[40px] border border-surface/50">
          <ProfileHeader />
          <div className="mt-12 pt-12 border-t border-surface/30 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-black">Account Security</h3>
              <p className="text-foreground/50 font-medium">Your account is secured by Freighter Wallet. Connect your wallet to manage your profile and digital assets.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-black">Platform Settings</h3>
              <p className="text-foreground/50 font-medium">Manage your notification preferences, display settings, and marketplace configurations.</p>
            </div>
          </div>
        </div>
      )
      default: return <Overview />
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-sans relative">
      <Navbar dashboardMode />
      
      <div className="flex pt-20">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 lg:ml-64 p-6 md:p-12">
          <div className="max-w-7xl mx-auto space-y-12">
            <header className="mb-12">
              <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent capitalize">
                {activeTab.replace('-', ' ')}
              </h1>
              <p className="text-foreground/50 mt-4 text-xl font-medium italic">
                {activeTab === 'overview' && "Welcome back! Here's your creative performance overview."}
                {activeTab === 'my-works' && "Manage and track all the masterpieces you've created."}
                {activeTab === 'owned' && "Explore the unique digital assets currently in your collection."}
                {activeTab === 'marketplace' && "Browse world-class digital art from creators globally."}
                {activeTab === 'profile' && "Your personal identity and platform settings."}
              </p>
            </header>

            {renderContent()}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

