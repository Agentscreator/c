"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Target, Users, Clock, Flag, AlertTriangle, CheckCircle } from "lucide-react"
import Image from "next/image"

interface RefereeToolsProps {
  onBack: () => void
}

export function RefereeTools({ onBack }: RefereeToolsProps) {
  const tools = [
    {
      title: "Game Timer",
      description: "Manage game time and rounds",
      icon: Clock,
      color: "bg-[#00FF41]",
      textColor: "text-black",
    },
    {
      title: "Player Check-in",
      description: "Track player attendance",
      icon: Users,
      color: "bg-[#FF6B35]",
      textColor: "text-white",
    },
    {
      title: "Score Tracking",
      description: "Record eliminations and objectives",
      icon: Target,
      color: "bg-blue-500",
      textColor: "text-white",
    },
    {
      title: "Flag Events",
      description: "Log game events and penalties",
      icon: Flag,
      color: "bg-yellow-500",
      textColor: "text-black",
    },
    {
      title: "Safety Alerts",
      description: "Report safety incidents",
      icon: AlertTriangle,
      color: "bg-red-500",
      textColor: "text-white",
    },
    {
      title: "Game Results",
      description: "Finalize and submit results",
      icon: CheckCircle,
      color: "bg-green-500",
      textColor: "text-white",
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
              <span className="text-xl font-bold">Referee Tools</span>
            </div>
          </div>
          <p className="text-gray-300">Professional tools for game management</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Pro Badge */}
        <Card className="bg-gradient-to-r from-[#FF6B35]/20 to-[#00FF41]/20 border-[#FF6B35] p-4 rounded-2xl shadow-soft">
          <div className="text-center">
            <Badge className="bg-[#FF6B35] text-white mb-2 rounded-xl px-4 py-2">PRO FEATURE</Badge>
            <h3 className="font-semibold text-lg mb-2">Unlock Advanced Referee Tools</h3>
            <p className="text-gray-300 text-sm mb-4">Get certified and access professional game management features</p>
            <Button className="bg-[#00FF41] text-black hover:bg-[#00FF41]/90 rounded-xl">Start Certification</Button>
          </div>
        </Card>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <Card key={index} className="bg-[#404040] border-gray-600 p-6 rounded-2xl shadow-soft">
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center mx-auto`}>
                    <Icon className={`w-8 h-8 ${tool.textColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{tool.title}</h3>
                    <p className="text-gray-400 text-sm">{tool.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-gray-500 text-gray-300 bg-transparent rounded-xl"
                    disabled
                  >
                    Requires Certification
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
