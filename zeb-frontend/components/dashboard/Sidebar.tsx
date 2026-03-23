'use client'

import React from 'react'
import { 
  LayoutDashboard, Palette, Briefcase, 
  ShoppingBag, User, PlusCircle, LogOut 
} from 'lucide-react'
import Link from 'next/link'

export type TabType = 'overview' | 'my-works' | 'owned' | 'marketplace' | 'profile'

interface SidebarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'my-works', label: 'My Works', icon: Palette },
    { id: 'owned', label: 'Owned', icon: Briefcase },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const

  return (
    <aside className="fixed left-0 top-20 bottom-0 w-64 bg-surface/30 backdrop-blur-2xl border-r border-surface/50 p-6 hidden lg:flex flex-col z-40">
      <div className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as TabType)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all
              ${activeTab === item.id 
                ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30 shadow-lg shadow-primary/5' 
                : 'text-foreground/60 hover:text-foreground hover:bg-surface/50 border border-transparent'}`}
          >
            <item.icon size={22} className={activeTab === item.id ? 'text-primary' : 'text-foreground/40'} />
            {item.label}
          </button>
        ))}
        
        <Link
          href="/dashboard/upload"
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black bg-gradient-to-r from-primary to-secondary text-background hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:scale-95 mt-8"
        >
          <PlusCircle size={22} />
          Upload New
        </Link>
      </div>

      <button className="flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all mb-4">
        <LogOut size={22} />
        Log Out
      </button>
    </aside>
  )
}
