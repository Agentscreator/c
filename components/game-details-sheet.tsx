"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Users, Clock, DollarSign, X, Navigation, Calendar } from "lucide-react"

interface GameDetailsSheetProps {
  game: any
  onClose: () => void
}

export function GameDetailsSheet({ game, onClose }: GameDetailsSheetProps) {
  const players = [
    { id: 1, name: "ShadowSniper", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 2, name: "PaintSlinger", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 3, name: "TacticalTom", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 4, name: "Rookie87", avatar: "/placeholder.svg?height=32&width=32" },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute bottom-0 left-0 right-0 bg-[#2D2D2D] rounded-t-3xl max-h-[80vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{game.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {game.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {game.distance}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-[#1A1A1A] border-gray-700 p-4 text-center">
              <Users className="w-6 h-6 text-[#00FF41] mx-auto mb-2" />
              <div className="text-lg font-bold text-white">
                {game.players.current}/{game.players.max}
              </div>
              <div className="text-xs text-gray-400">Players</div>
            </Card>
            <Card className="bg-[#1A1A1A] border-gray-700 p-4 text-center">
              <DollarSign className="w-6 h-6 text-[#FF6B35] mx-auto mb-2" />
              <div className="text-lg font-bold text-white">${game.cost}</div>
              <div className="text-xs text-gray-400">Entry Fee</div>
            </Card>
            <Card className="bg-[#1A1A1A] border-gray-700 p-4 text-center">
              <Navigation className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{game.distance.split(" ")[0]}</div>
              <div className="text-xs text-gray-400">Miles Away</div>
            </Card>
          </div>

          {/* Game Type */}
          <div className="flex space-x-2">
            <Badge className="bg-[#00FF41] text-black">{game.type.charAt(0).toUpperCase() + game.type.slice(1)}</Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              All Skill Levels
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              Equipment Provided
            </Badge>
          </div>

          {/* Players List */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Players ({game.players.current}/{game.players.max})
            </h3>
            <div className="flex -space-x-2 mb-4">
              {players.slice(0, game.players.current).map((player, index) => (
                <Avatar key={player.id} className="border-2 border-[#2D2D2D] w-10 h-10">
                  <AvatarImage src={player.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-[#00FF41] text-black text-xs">
                    {player.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {game.players.current < game.players.max && (
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">+{game.players.max - game.players.current}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full bg-[#00FF41] text-black hover:bg-[#00FF41]/90 font-semibold py-3">
              RSVP for ${game.cost} • From your $43.50 balance
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1 border-gray-600 text-gray-300 bg-transparent">
                <Calendar className="w-4 h-4 mr-2" />
                Add to Calendar
              </Button>
              <Button variant="outline" className="flex-1 border-gray-600 text-gray-300 bg-transparent">
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
