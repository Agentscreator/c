"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Users, MapPin, CheckCircle, AlertTriangle, Trophy, DollarSign, Calendar } from "lucide-react"
import Image from "next/image"

export function RefereeDashboard() {
  const todaysGames = [
    {
      id: 1,
      title: "Miller Park Speedball Tournament",
      time: "2:00 PM - 6:00 PM",
      location: "Miller Park Field A",
      players: { checked: 8, total: 12 },
      status: "ready", // ready, active, completed
      fee: 45,
    },
    {
      id: 2,
      title: "Beginner's Blast",
      time: "7:00 PM - 9:00 PM",
      location: "Downtown Arena",
      players: { checked: 3, total: 10 },
      status: "waiting",
      fee: 35,
    },
  ]

  const recentGames = [
    {
      id: 1,
      title: "Woodland Warriors",
      date: "Yesterday",
      duration: "3h 45m",
      players: 16,
      fee: 50,
      rating: 4.9,
    },
    {
      id: 2,
      title: "Tournament Finals",
      date: "2 days ago",
      duration: "4h 20m",
      players: 12,
      fee: 60,
      rating: 5.0,
    },
  ]

  const stats = [
    { label: "Today's Games", value: "2", icon: Calendar, color: "text-[#FF6B35]" },
    { label: "This Week", value: "$340", icon: DollarSign, color: "text-[#00FF41]" },
    { label: "Games Refereed", value: "47", icon: Trophy, color: "text-blue-400" },
    { label: "Avg Rating", value: "4.8", icon: CheckCircle, color: "text-yellow-400" },
  ]

  return (
    <div className="min-h-screen bg-[#2A2A2A] text-white">
      {/* Header */}
      <div className="bg-[#404040] border-b border-gray-600 shadow-soft">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Image src="/logo-green.png" alt="CrosspointX" width={32} height={32} className="rounded-xl" />
              <span className="text-lg sm:text-xl font-bold text-white">Referee Dashboard</span>
            </div>
            <Badge className="bg-[#FF6B35] text-white rounded-xl px-3 py-1 shadow-glow-orange">Certified Referee</Badge>
          </div>
          <div className="text-gray-300">
            Welcome back, <span className="text-[#FF6B35] font-semibold">Referee Mike</span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="bg-[#404040] border-gray-600 p-4 sm:p-6 rounded-2xl shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</div>
                  </div>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Today's Games */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">Today's Assignments</h2>
          <div className="space-y-3 sm:space-y-4">
            {todaysGames.map((game) => (
              <Card key={game.id} className="bg-[#404040] border-gray-600 p-4 sm:p-6 rounded-2xl shadow-soft">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base sm:text-lg text-white mb-2">{game.title}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {game.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {game.location}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={`rounded-xl px-3 py-1 text-xs sm:text-sm font-medium ${
                        game.status === "ready"
                          ? "bg-[#00FF41] text-black shadow-glow-green"
                          : game.status === "active"
                            ? "bg-[#FF6B35] text-white shadow-glow-orange"
                            : "bg-gray-600 text-white"
                      }`}
                    >
                      {game.status === "ready"
                        ? "Ready to Start"
                        : game.status === "active"
                          ? "In Progress"
                          : "Waiting"}
                    </Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-white">
                        <Users className="w-4 h-4 mr-1 text-[#00FF41]" />
                        <span>
                          {game.players.checked}/{game.players.total} checked in
                        </span>
                      </div>
                      <div className="flex items-center text-white">
                        <DollarSign className="w-4 h-4 mr-1 text-[#FF6B35]" />
                        <span>${game.fee} fee</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className={`rounded-xl px-4 py-2 font-medium transition-all duration-300 ${
                        game.status === "ready"
                          ? "bg-[#00FF41] text-black hover:bg-[#00FF41]/90 shadow-glow-green"
                          : "bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90 shadow-glow-orange"
                      }`}
                    >
                      {game.status === "ready" ? (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Start Game
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4 mr-1" />
                          Manage
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Games */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">Recent Games</h2>
          <div className="space-y-3">
            {recentGames.map((game) => (
              <Card key={game.id} className="bg-[#404040] border-gray-600 p-4 sm:p-6 rounded-2xl shadow-soft">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF6B35]/20 rounded-2xl flex items-center justify-center">
                      <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF6B35]" />
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm sm:text-base">{game.title}</div>
                      <div className="text-xs sm:text-sm text-gray-400 flex items-center space-x-2">
                        <span>{game.date}</span>
                        <span>•</span>
                        <span>{game.duration}</span>
                        <span>•</span>
                        <span>{game.players} players</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#00FF41] font-semibold text-sm sm:text-base">${game.fee}</div>
                    <div className="text-xs sm:text-sm text-gray-400 flex items-center">⭐ {game.rating}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="border-[#FF6B35] text-[#FF6B35] bg-transparent rounded-2xl py-3 hover:bg-[#FF6B35]/10 transition-all duration-300"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report Issue
          </Button>
          <Button
            variant="outline"
            className="border-[#00FF41] text-[#00FF41] bg-transparent rounded-2xl py-3 hover:bg-[#00FF41]/10 transition-all duration-300"
          >
            <Calendar className="w-4 h-4 mr-2" />
            View Schedule
          </Button>
        </div>
      </div>
    </div>
  )
}
