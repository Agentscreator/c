"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Bell, Shield, Smartphone } from "lucide-react"
import Image from "next/image"

interface SettingsPageProps {
  onBack: () => void
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const settingsGroups = [
    {
      title: "Notifications",
      icon: Bell,
      settings: [
        { label: "Game Invitations", description: "Get notified when invited to games", enabled: true },
        { label: "Game Reminders", description: "Reminders 30 minutes before games", enabled: true },
        { label: "Friend Requests", description: "New friend request notifications", enabled: true },
        { label: "Tournament Updates", description: "Updates about tournament progress", enabled: false },
      ],
    },
    {
      title: "Privacy",
      icon: Shield,
      settings: [
        { label: "Profile Visibility", description: "Show your profile to other players", enabled: true },
        { label: "Game History", description: "Allow others to see your game history", enabled: true },
        { label: "Location Sharing", description: "Share location for nearby games", enabled: true },
        { label: "Analytics", description: "Help improve the app with usage data", enabled: false },
      ],
    },
    {
      title: "App Preferences",
      icon: Smartphone,
      settings: [
        { label: "Sound Effects", description: "Play sounds for app interactions", enabled: true },
        { label: "Haptic Feedback", description: "Vibrate for button presses", enabled: true },
        { label: "Auto-refresh", description: "Automatically refresh game data", enabled: true },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#2A2A2A] text-white">
      {/* Header */}
      <div className="bg-[#404040] border-b border-gray-600 shadow-soft">
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white p-0">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center space-x-3">
              <Image src="/logo-green.png" alt="CrosspointX" width={32} height={32} className="rounded-xl" />
              <span className="text-xl font-bold">Settings</span>
            </div>
          </div>
          <p className="text-gray-300">Customize your CrosspointX experience</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {settingsGroups.map((group, groupIndex) => {
          const Icon = group.icon
          return (
            <div key={groupIndex}>
              <div className="flex items-center space-x-2 mb-4">
                <Icon className="w-5 h-5 text-[#00FF41]" />
                <h2 className="text-lg font-semibold">{group.title}</h2>
              </div>
              <Card className="bg-[#404040] border-gray-600 rounded-2xl shadow-soft">
                <div className="divide-y divide-gray-600">
                  {group.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{setting.label}</div>
                        <div className="text-sm text-gray-400">{setting.description}</div>
                      </div>
                      <Switch checked={setting.enabled} disabled={setting.disabled} className="ml-4" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
