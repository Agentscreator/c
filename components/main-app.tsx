"use client"

import { useState } from "react"
import { MapView } from "@/components/map-view"
import { ProfileView } from "@/components/profile-view"
import { WalletView } from "@/components/wallet-view"
import { LeaderboardView } from "@/components/leaderboard-view"
import { MoreView } from "@/components/more-view"
import { BottomNavigation } from "@/components/bottom-navigation"

interface MainAppProps {
  onSignOut?: () => void
}

export function MainApp({ onSignOut }: MainAppProps) {
  const [activeTab, setActiveTab] = useState("map")

  const renderActiveView = () => {
    switch (activeTab) {
      case "map":
        return <MapView />
      case "profile":
        return <ProfileView />
      case "wallet":
        return <WalletView />
      case "leaderboards":
        return <LeaderboardView />
      case "more":
        return <MoreView onSignOut={onSignOut} />
      default:
        return <MapView />
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="pb-20">{renderActiveView()}</div>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
