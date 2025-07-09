"use client"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Target, Users, Award, MapPin, Camera } from "lucide-react"
import Image from "next/image"

export function ProfileView() {
  const achievements = [
    { id: 1, name: "First Blood", description: "Complete your first game", earned: true },
    { id: 2, name: "Sharpshooter", description: "10 MVP awards", earned: true },
    { id: 3, name: "Social Butterfly", description: "Refer 5 friends", earned: true },
    { id: 4, name: "Streak Master", description: "10 game attendance streak", earned: false },
    { id: 5, name: "Tournament Champion", description: "Win a tournament", earned: false },
  ]

  const recentGames = [
    { id: 1, title: "Miller Park Speedball", date: "2 days ago", result: "MVP", team: "Team Alpha" },
    { id: 2, title: "Woodland Warriors", date: "1 week ago", result: "Win", team: "Team Bravo" },
    { id: 3, title: "Tournament Finals", date: "2 weeks ago", result: "2nd Place", team: "Solo" },
  ]

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="bg-[#2D2D2D] border-b border-gray-700">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Image src="/logo-green.png" alt="CrosspointX" width={32} height={32} />
            <span className="ml-3 font-bold text-lg">Profile</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <Avatar className="w-24 h-24 border-4 border-[#00FF41]">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback className="bg-[#2D2D2D] text-white text-2xl">SS</AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#00FF41] rounded-full flex items-center justify-center border-2 border-[#2A2A2A]">
              <Camera className="w-4 h-4 text-black" />
            </button>
            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FF6B35] text-white">Elite</Badge>
          </div>
          <div>
            <h1 className="text-2xl font-bold">ShadowSniper</h1>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#2D2D2D] border border-gray-700 p-3 rounded-xl">
            <div className="flex items-center space-x-2 mb-1">
              <Trophy className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Games</span>
            </div>
            <div className="text-lg font-medium text-gray-300">47</div>
          </div>

          <div className="bg-[#2D2D2D] border border-gray-700 p-3 rounded-xl">
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Win Rate</span>
            </div>
            <div className="text-lg font-medium text-gray-300">68%</div>
          </div>

          <div className="bg-[#2D2D2D] border border-gray-700 p-3 rounded-xl">
            <div className="flex items-center space-x-2 mb-1">
              <Award className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">MVPs</span>
            </div>
            <div className="text-lg font-medium text-gray-300">12</div>
          </div>

          <div className="bg-[#2D2D2D] border border-gray-700 p-3 rounded-xl">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Streak</span>
            </div>
            <div className="text-lg font-medium text-gray-300">8</div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-lg font-medium mb-3 text-gray-300">Achievements</h2>
          <div className="grid grid-cols-5 gap-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-2 text-center rounded-lg ${
                  achievement.earned
                    ? "bg-[#00FF41]/5 border border-[#00FF41]/20"
                    : "bg-[#2D2D2D] border border-gray-700"
                }`}
              >
                <Award className={`w-5 h-5 mx-auto mb-1 ${achievement.earned ? "text-[#00FF41]" : "text-gray-600"}`} />
                <div className={`text-xs ${achievement.earned ? "text-[#00FF41]" : "text-gray-500"}`}>
                  {achievement.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-medium mb-3 text-gray-300">Recent Games</h2>
          <div className="space-y-2">
            {recentGames.map((game) => (
              <div key={game.id} className="bg-[#2D2D2D] border border-gray-700 p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#00FF41]/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#00FF41]" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{game.title}</div>
                      <div className="text-xs text-gray-500">{game.date}</div>
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-md bg-gray-700 text-gray-300">{game.result}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
