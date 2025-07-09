"use client"

import { Map, User, Wallet, Trophy, MoreHorizontal } from "lucide-react"

interface BottomNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  const tabs = [
    { id: "map", label: "Map", icon: Map },
    { id: "profile", label: "Profile", icon: User },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "leaderboards", label: "Rankings", icon: Trophy },
    { id: "more", label: "More", icon: MoreHorizontal },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2D2D2D] border-t border-gray-700">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-2 flex flex-col items-center space-y-1 transition-colors ${
                isActive ? "text-[#00FF41]" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
