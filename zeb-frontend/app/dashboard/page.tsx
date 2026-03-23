'use client'

import Navbar from '../../components/layout/Navbar'
import ProfileHeader from '../../components/dashboard/ProfileHeader'
import NFTsTab from '../../components/dashboard/NFTsTab'
import ActivitiesTab from '../../components/dashboard/ActivitiesTab'
import { useState } from 'react'

import Footer from '../../components/layout/Footer';

export default function Dashboard() {
  return (
    <main className="min-h-screen pt-20 bg-background text-foreground overflow-hidden font-sans relative">
      <Navbar dashboardMode />
      <ProfileHeader />
      
      <div className="mx-auto px-6 pb-24 max-w-7xl space-y-16">
        {/* My NFTs Section */}
        <section>
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-12">
            My NFTs
          </h2>
          <NFTsTab />
        </section>

        {/* Recent Activities Section */}
        <section>
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text mb-12">
            Recent Activities
          </h2>
          <ActivitiesTab />
        </section>
      </div>

      <Footer />
    </main>
  );
}

