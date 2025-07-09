"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  User,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  Calendar,
  DollarSign,
} from "lucide-react"
import Image from "next/image"

interface RefereeSettingsProps {
  onSignOut?: () => void
}

export function RefereeSettings({ onSignOut }: RefereeSettingsProps) {
  const menuItems = [
    {
      category: "Account",
      items: [
        { icon: User, label: "Profile Settings", description: "Update your referee profile" },
        { icon: Bell, label: "Notifications", description: "Manage assignment alerts" },
        { icon: Shield, label: "Privacy & Security", description: "Account security settings" },
      ],
    },
    {
      category: "Referee Tools",
      items: [
        { icon: Calendar, label: "Availability", description: "Set your schedule preferences" },
        { icon: DollarSign, label: "Rate Settings", description: "Manage your referee rates" },
        { icon: Star, label: "Certification", description: "View your referee credentials", badge: "Level 3" },
      ],
    },
    {
      category: "Support",
      items: [
        { icon: HelpCircle, label: "Help & Support", description: "Get assistance" },
        { icon: Settings, label: "App Settings", description: "General app preferences" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="bg-[#2D2D2D] border-b border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Image src="/logo-green.png" alt="CrosspointX" width={32} height={32} />
              <span className="text-xl font-bold">Settings</span>
            </div>
            <Badge className="bg-[#FF6B35] text-white">Referee</Badge>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Summary */}
        <Card className="bg-gradient-to-r from-[#FF6B35]/20 to-[#00FF41]/20 border-[#FF6B35] p-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">RM</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Referee Mike</h3>
              <p className="text-gray-300 text-sm">Level 3 Certified • 4.8 ⭐ Rating</p>
              <p className="text-gray-400 text-xs">47 games refereed • $4,680 earned</p>
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
                    <button className="w-full p-4 flex items-center space-x-4 hover:bg-[#2D2D2D]/80 transition-colors">
                      <div className="w-10 h-10 bg-[#FF6B35]/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#FF6B35]" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.label}</span>
                          {item.badge && <Badge className="bg-[#00FF41] text-black">{item.badge}</Badge>}
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
              <span className="font-bold">CrosspointX Referee</span>
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
