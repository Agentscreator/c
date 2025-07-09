"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, DollarSign, CheckCircle, X } from "lucide-react"
import Image from "next/image"

export function RefereeSchedule() {
  const upcomingGames = [
    {
      id: 1,
      title: "Weekend Warriors Tournament",
      date: "Tomorrow",
      time: "10:00 AM - 2:00 PM",
      location: "Central Park Field",
      players: 16,
      fee: 60,
      status: "confirmed",
    },
    {
      id: 2,
      title: "Corporate Team Building",
      date: "Friday",
      time: "6:00 PM - 8:00 PM",
      location: "Business District Arena",
      players: 20,
      fee: 80,
      status: "pending",
    },
    {
      id: 3,
      title: "Youth League Championship",
      date: "Saturday",
      time: "9:00 AM - 5:00 PM",
      location: "Youth Sports Complex",
      players: 32,
      fee: 120,
      status: "confirmed",
    },
    {
      id: 4,
      title: "Sunday Speedball",
      date: "Sunday",
      time: "2:00 PM - 6:00 PM",
      location: "Miller Park",
      players: 12,
      fee: 45,
      status: "available",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-[#00FF41] text-black"
      case "pending":
        return "bg-[#FF6B35] text-white"
      case "available":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="bg-[#2D2D2D] border-b border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Image src="/logo-green.png" alt="CrosspointX" width={32} height={32} />
              <span className="text-xl font-bold">Schedule</span>
            </div>
            <Badge className="bg-[#FF6B35] text-white">4 Upcoming</Badge>
          </div>
          <div className="text-gray-300">Manage your referee assignments</div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Weekly Summary */}
        <Card className="bg-gradient-to-r from-[#FF6B35]/20 to-[#00FF41]/20 border-[#FF6B35] p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#FF6B35]">4</div>
              <div className="text-xs text-gray-300">This Week</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#00FF41]">$305</div>
              <div className="text-xs text-gray-300">Potential Earnings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">18h</div>
              <div className="text-xs text-gray-300">Total Hours</div>
            </div>
          </div>
        </Card>

        {/* Upcoming Games */}
        <div>
          <h2 className="text-xl font-bold mb-4">Upcoming Assignments</h2>
          <div className="space-y-4">
            {upcomingGames.map((game) => (
              <Card key={game.id} className="bg-[#2D2D2D] border-gray-700 p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{game.title}</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {game.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {game.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {game.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {game.players} players
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(game.status)}>{game.status}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#00FF41] font-semibold">
                      <DollarSign className="w-4 h-4 mr-1" />${game.fee}
                    </div>

                    <div className="flex space-x-2">
                      {game.status === "available" && (
                        <Button size="sm" className="bg-[#00FF41] text-black hover:bg-[#00FF41]/90">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                      )}
                      {game.status === "pending" && (
                        <>
                          <Button size="sm" className="bg-[#00FF41] text-black hover:bg-[#00FF41]/90">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Confirm
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-600 text-red-400 bg-transparent">
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </>
                      )}
                      {game.status === "confirmed" && (
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Availability Settings */}
        <Card className="bg-[#2D2D2D] border-gray-700 p-4">
          <h3 className="font-semibold mb-3">Availability Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Accept new assignments</span>
              <div className="w-12 h-6 bg-[#00FF41] rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Weekend availability</span>
              <div className="w-12 h-6 bg-[#00FF41] rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tournament assignments</span>
              <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
