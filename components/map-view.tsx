"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MapPin, Filter, Plus } from "lucide-react"
import { GameDetailsSheet } from "@/components/game-details-sheet"
import Image from "next/image"

export function MapView() {
  const [selectedGame, setSelectedGame] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)

  const games = [
    {
      id: 1,
      title: "Miller Park Speedball Tournament",
      time: "Today 2:00 PM - 6:00 PM",
      distance: "3.2 miles away",
      players: { current: 8, max: 12 },
      cost: 6,
      type: "speedball",
      status: "active",
      location: { lat: 40.7128, lng: -74.006 },
    },
    {
      id: 2,
      title: "Woodsball Warfare",
      time: "Tomorrow 10:00 AM - 4:00 PM",
      distance: "7.1 miles away",
      players: { current: 6, max: 16 },
      cost: 8,
      type: "woodsball",
      status: "upcoming",
      location: { lat: 40.7589, lng: -73.9851 },
    },
    {
      id: 3,
      title: "Beginner's Blast",
      time: "Saturday 1:00 PM - 5:00 PM",
      distance: "2.8 miles away",
      players: { current: 4, max: 10 },
      cost: 5,
      type: "beginner",
      status: "upcoming",
      location: { lat: 40.6892, lng: -74.0445 },
    },
  ]

  return (
    <div className="relative h-screen bg-[#2A2A2A]">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-[#404040]/90 backdrop-blur-sm border-b border-gray-600 shadow-soft">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Image src="/logo-green.png" alt="CrosspointX" width={32} height={32} className="rounded-xl" />
            <span className="font-bold text-base sm:text-lg text-white">CrosspointX</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-gray-500 text-gray-300 bg-transparent rounded-xl hover:bg-gray-600/20"
            >
              <Filter className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button size="sm" className="bg-[#00FF41] text-black hover:bg-[#00FF41]/90 rounded-xl shadow-glow-green">
              <Plus className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="px-4 pb-4 max-w-7xl mx-auto">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <Badge className="bg-[#00FF41] text-black border-[#00FF41] whitespace-nowrap rounded-xl px-3 py-1 shadow-glow-green">
                All Games
              </Badge>
              <Badge className="border-gray-500 text-gray-300 bg-transparent whitespace-nowrap rounded-xl px-3 py-1">
                Today
              </Badge>
              <Badge className="border-gray-500 text-gray-300 bg-transparent whitespace-nowrap rounded-xl px-3 py-1">
                Under $10
              </Badge>
              <Badge className="border-gray-500 text-gray-300 bg-transparent whitespace-nowrap rounded-xl px-3 py-1">
                Beginner
              </Badge>
              <Badge className="border-gray-500 text-gray-300 bg-transparent whitespace-nowrap rounded-xl px-3 py-1">
                {"< 5 miles"}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Map Area */}
      <div className="absolute inset-0 bg-[#404040]">
        <div className="relative w-full h-full bg-gradient-to-br from-[#2A2A2A] via-[#404040] to-[#2A2A2A]">
          {/* Mock map with game markers */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Distance rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-[#00FF41]/20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#00FF41]/10 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#00FF41]/5 rounded-full"></div>

            {/* User location */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>

            {/* Game markers */}
            <button
              onClick={() => setSelectedGame(games[0])}
              className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-[#00FF41] rounded-2xl flex items-center justify-center animate-pulse shadow-glow-green">
                  <MapPin className="w-5 h-5 text-black" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-[#FF6B35] text-white text-xs px-2 py-1 rounded-xl shadow-glow-orange">
                  8
                </Badge>
              </div>
            </button>

            <button
              onClick={() => setSelectedGame(games[1])}
              className="absolute top-2/3 left-1/4 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-[#FF6B35] rounded-2xl flex items-center justify-center shadow-glow-orange">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-[#00FF41] text-black text-xs px-2 py-1 rounded-xl shadow-glow-green">
                  6
                </Badge>
              </div>
            </button>

            <button
              onClick={() => setSelectedGame(games[2])}
              className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-[#FF6B35] rounded-2xl flex items-center justify-center shadow-glow-orange">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-[#00FF41] text-black text-xs px-2 py-1 rounded-xl shadow-glow-green">
                  4
                </Badge>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="absolute bottom-24 left-4 right-4 z-10 max-w-7xl mx-auto">
        <Card className="bg-[#404040]/90 backdrop-blur-sm border-gray-600 p-4 sm:p-6 rounded-2xl shadow-soft">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[#00FF41] font-bold text-lg sm:text-xl">3</div>
              <div className="text-gray-400 text-xs sm:text-sm">Active Games</div>
            </div>
            <div>
              <div className="text-[#FF6B35] font-bold text-lg sm:text-xl">18</div>
              <div className="text-gray-400 text-xs sm:text-sm">Players Online</div>
            </div>
            <div>
              <div className="text-white font-bold text-lg sm:text-xl">2.8mi</div>
              <div className="text-gray-400 text-xs sm:text-sm">Nearest Game</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Game Details Sheet */}
      {selectedGame && <GameDetailsSheet game={selectedGame} onClose={() => setSelectedGame(null)} />}
    </div>
  )
}
