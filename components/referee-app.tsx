"use client"

import { useState } from "react"
import { RefereeDashboard } from "@/components/referee-dashboard"
import { ActiveGameManagement } from "@/components/active-game-management"
import { RefereeSchedule } from "@/components/referee-schedule"
import { RefereeEarnings } from "@/components/referee-earnings"
import { RefereeSettings } from "@/components/referee-settings"
import { RefereeBottomNavigation } from "@/components/referee-bottom-navigation"

interface RefereeAppProps {
  onSignOut?: () => void
}

export function RefereeApp({ onSignOut }: RefereeAppProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <RefereeDashboard />
      case "active":
        return <ActiveGameManagement />
      case "schedule":
        return <RefereeSchedule />
      case "earnings":
        return <RefereeEarnings />
      case "settings":
        return <RefereeSettings onSignOut={onSignOut} />
      default:
        return <RefereeDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="pb-20">{renderActiveView()}</div>
      <RefereeBottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
