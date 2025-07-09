"use client"

import { LayoutDashboard, Play, Calendar, DollarSign, Settings } from "lucide-react"

interface RefereeBottomNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function RefereeBottomNavigation({ activeTab, setActiveTab }: RefereeBottomNavigationProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "active", label: "Active", icon: Play },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "earnings", label: "Earnings", icon: DollarSign },
    { id: "settings", label: "Settings", icon: Settings },
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
                isActive ? "text-[#FF6B35]" : "text-gray-400 hover:text-gray-300"
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
