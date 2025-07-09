"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Target, Users, Crown, Medal, Award } from "lucide-react"
import Image from "next/image"

export function LeaderboardView() {
  const [activeTab, setActiveTab] = useState("local")

  const tabs = [
    { id: "local", label: "Local", icon: Target },
    { id: "friends", label: "Friends", icon: Users },
  ]

  const leaderboardData = {
    overall: [
      {
        rank: 1,
        name: "TacticalTom",
        rating: 2847,
        games: 89,
        winRate: 78,
        mvps: 23,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        rank: 2,
        name: "ShadowSniper",
        rating: 2654,
        games: 47,
        winRate: 68,
        mvps: 12,
        avatar: "/placeholder.svg?height=40&width=40",
        isCurrentUser: true,
      },
      {
        rank: 3,
        name: "PaintSlinger",
        rating: 2543,
        games: 23,
        winRate: 71,
        mvps: 8,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        rank: 4,
        name: "StealthMaster",
        rating: 2398,
        games: 67,
        winRate: 65,
        mvps: 15,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        rank: 5,
        name: "QuickDraw",
        rating: 2287,
        games: 34,
        winRate: 72,
        mvps: 9,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        rank: 6,
        name: "Rookie87",
        rating: 1987,
        games: 5,
        winRate: 40,
        mvps: 1,
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    local: [
      {
        rank: 1,
        name: "ShadowSniper",
        rating: 2654,
        games: 47,
        winRate: 68,
        mvps: 12,
        avatar: "/placeholder.svg?height=40&width=40",
        isCurrentUser: true,
      },
      {
        rank: 2,
        name: "LocalHero",
        rating: 2543,
        games: 34,
        winRate: 74,
        mvps: 11,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        rank: 3,
        name: "CitySlicker",
        rating: 2398,
        games: 28,
        winRate: 71,
        mvps: 8,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        rank: 4,
        name: "NeighborhoodNinja",
        rating: 2287,
        games: 22,
        winRate: 68,
        mvps: 6,
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    friends: [
      {
        rank: 1,
        name: "ShadowSniper",
        rating: 2654,
        games: 47,
        winRate: 68,
        mvps: 12,
        avatar: "/placeholder.svg?height=40&width=40",
        isCurrentUser: true,
      },
      {
        rank: 2,
        name: "BestBuddy",
        rating: 2234,
        games: 31,
        winRate: 65,
        mvps: 7,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        rank: 3,
        name: "TeamMate",
        rating: 2156,
        games: 29,
        winRate: 62,
        mvps: 5,
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    monthly: [
      {
        rank: 1,
        name: "MonthlyKing",
        rating: 1847,
        games: 23,
        winRate: 87,
        mvps: 8,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        rank: 2,
        name: "ShadowSniper",
        rating: 1654,
        games: 18,
        winRate: 78,
        mvps: 6,
        avatar: "/placeholder.svg?height=40&width=40",
        isCurrentUser: true,
      },
      {
        rank: 3,
        name: "NewRising",
        rating: 1543,
        games: 15,
        winRate: 73,
        mvps: 4,
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="text-gray-400 font-bold">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "border-yellow-500 bg-yellow-500/10"
      case 2:
        return "border-gray-400 bg-gray-400/10"
      case 3:
        return "border-amber-600 bg-amber-600/10"
      default:
        return "border-gray-700 bg-[#2D2D2D]"
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="bg-[#2D2D2D] border-b border-gray-700">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Image src="/logo-green.png" alt="CrosspointX" width={32} height={32} />
            <span className="ml-3 font-bold text-lg">Leaderboards</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#2D2D2D] border-b border-gray-700">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 px-4 py-3 flex items-center justify-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? "text-[#00FF41] border-b-2 border-[#00FF41]"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Your Rank Card */}
        <Card className="bg-gradient-to-r from-[#00FF41]/20 to-[#FF6B35]/20 border-[#00FF41] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#00FF41] rounded-full flex items-center justify-center">
                <span className="text-black font-bold">
                  #
                  {leaderboardData[activeTab as keyof typeof leaderboardData].find((p) => p.isCurrentUser)?.rank ||
                    "N/A"}
                </span>
              </div>
              <div>
                <div className="font-bold">Your Rank</div>
                <div className="text-sm text-gray-300">{tabs.find((t) => t.id === activeTab)?.label} Leaderboard</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#00FF41]">
                {leaderboardData[activeTab as keyof typeof leaderboardData]
                  .find((p) => p.isCurrentUser)
                  ?.rating.toLocaleString() || "N/A"}
              </div>
              <div className="text-sm text-gray-300">Skill Rating</div>
            </div>
          </div>
        </Card>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {leaderboardData[activeTab as keyof typeof leaderboardData].map((player) => (
            <Card
              key={player.rank}
              className={`p-4 transition-all ${
                player.isCurrentUser ? "border-[#00FF41] bg-[#00FF41]/5" : getRankColor(player.rank)
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Rank */}
                <div className="w-8 flex justify-center">{getRankIcon(player.rank)}</div>

                {/* Avatar */}
                <Avatar className="w-12 h-12 border-2 border-gray-600">
                  <AvatarImage src={player.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-[#2D2D2D] text-white">
                    {player.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Player Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{player.name}</span>
                    {player.isCurrentUser && <Badge className="bg-[#00FF41] text-black text-xs">You</Badge>}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{player.games} games</span>
                    <span>{player.winRate}% win rate</span>
                    <span>{player.mvps} MVPs</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="text-right">
                  <div className="text-xl font-bold text-white">{player.rating.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Skill Rating</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <button className="text-[#00FF41] hover:text-[#00FF41]/80 font-medium">Load More Players</button>
        </div>
      </div>
    </div>
  )
}
