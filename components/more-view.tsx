"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Settings,
  Share2,
  Users,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  MapPin,
  Trophy,
  Gift,
  Target,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { RefereeTools } from "@/components/referee-tools"
import { TeamManagement } from "@/components/team-management"
import { SettingsPage } from "@/components/settings-page"

interface MoreViewProps {
  onSignOut?: () => void
}

export function MoreView({ onSignOut }: MoreViewProps) {
  const [currentPage, setCurrentPage] = useState<string | null>(null)

  const handleNavigation = (page: string) => {
    setCurrentPage(page)
  }

  if (currentPage === "referee-tools") {
    return <RefereeTools onBack={() => setCurrentPage(null)} />
  }
  if (currentPage === "team-management") {
    return <TeamManagement onBack={() => setCurrentPage(null)} />
  }
  if (currentPage === "settings") {
    return <SettingsPage onBack={() => setCurrentPage(null)} />
  }

  const menuItems = [
    {
      category: "Game Management",
      items: [
        { icon: Target, label: "Referee Tools", description: "Manage games and results", badge: "Pro" },
        { icon: Trophy, label: "Create Tournament", description: "Organize competitive events" },
        { icon: MapPin, label: "Venue Partnership", description: "Register your field" },
      ],
    },
    {
      category: "Growth & Rewards",
      items: [
        { icon: Gift, label: "Viral Dashboard", description: "Track referrals and earnings" },
        { icon: Share2, label: "Invite Friends", description: "Share CrosspointX with friends" },
        { icon: Users, label: "Team Management", description: "Create and manage teams" },
      ],
    },
    {
      category: "Account",
      items: [
        { icon: Settings, label: "Settings", description: "Preferences and notifications" },
        { icon: Shield, label: "Privacy & Security", description: "Manage your data" },
        { icon: HelpCircle, label: "Help & Support", description: "Get assistance" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="bg-[#2D2D2D] border-b border-gray-700">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Image src="/logo-green.png" alt="CrosspointX" width={32} height={32} />
            <span className="ml-3 font-bold text-lg">More</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <Card className="bg-gradient-to-r from-[#00FF41]/20 to-[#FF6B35]/20 border-[#00FF41] p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#00FF41]">4/4</div>
              <div className="text-xs text-gray-300">Tags Claimed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#FF6B35]">8</div>
              <div className="text-xs text-gray-300">Referrals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">$24</div>
              <div className="text-xs text-gray-300">Earned</div>
            </div>
          </div>
        </Card>

        {/* Menu Sections */}
        {menuItems.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-semibold mb-3 text-gray-300">{section.category}</h2>
            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.label} className="bg-[#2D2D2D] border-gray-700">
                    <button
                      className="w-full p-4 flex items-center space-x-4 hover:bg-[#2D2D2D]/80 transition-colors"
                      onClick={() => {
                        if (item.label === "Referee Tools") handleNavigation("referee-tools")
                        else if (item.label === "Team Management") handleNavigation("team-management")
                        else if (item.label === "Settings") handleNavigation("settings")
                      }}
                    >
                      <div className="w-10 h-10 bg-[#00FF41]/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#00FF41]" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.label}</span>
                          {item.badge && (
                            <Badge
                              className={item.badge === "Pro" ? "bg-[#FF6B35] text-white" : "bg-[#00FF41] text-black"}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">{item.description}</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}

        {/* App Info */}
        <Card className="bg-[#2D2D2D] border-gray-700 p-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Image src="/logo-green.png" alt="CrosspointX" width={24} height={24} />
              <span className="font-bold">CrosspointX</span>
            </div>
            <div className="text-sm text-gray-400">Version 1.2.0</div>
            <div className="text-xs text-gray-500">© 2024 CrosspointX. All rights reserved.</div>
          </div>
        </Card>

        {/* Sign Out */}
        <Button
          variant="outline"
          onClick={onSignOut}
          className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
