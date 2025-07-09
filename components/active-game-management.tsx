"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Play, Pause, Square, AlertTriangle, Flag } from "lucide-react"
import Image from "next/image"

export function ActiveGameManagement() {
  const [gameStatus, setGameStatus] = useState<"active" | "paused" | "ended">("active")
  const [gameTime, setGameTime] = useState("23:45")

  const teams = [
    {
      name: "Team Alpha",
      color: "bg-[#00FF41]",
      players: [
        { name: "ShadowSniper", status: "active", eliminations: 3 },
        { name: "TacticalTom", status: "active", eliminations: 2 },
        { name: "QuickDraw", status: "eliminated", eliminations: 1 },
        { name: "StealthMaster", status: "active", eliminations: 4 },
      ],
    },
    {
      name: "Team Bravo",
      color: "bg-[#FF6B35]",
      players: [
        { name: "PaintSlinger", status: "active", eliminations: 2 },
        { name: "Rookie87", status: "eliminated", eliminations: 0 },
        { name: "FireStorm", status: "active", eliminations: 3 },
        { name: "GhostRecon", status: "active", eliminations: 1 },
      ],
    },
  ]

  const gameEvents = [
    { time: "23:45", event: "Game Started", type: "info" },
    { time: "21:30", event: "Rookie87 eliminated by ShadowSniper", type: "elimination" },
    { time: "19:15", event: "QuickDraw eliminated by FireStorm", type: "elimination" },
    { time: "18:00", event: "Flag captured by Team Alpha", type: "objective" },
  ]

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="bg-[#2D2D2D] border-b border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Image src="/logo-green.png" alt="CrosspointX" width={32} height={32} />
              <span className="text-xl font-bold">Active Game</span>
            </div>
            <Badge
              className={
                gameStatus === "active"
                  ? "bg-[#00FF41] text-black"
                  : gameStatus === "paused"
                    ? "bg-[#FF6B35] text-white"
                    : "bg-gray-600 text-white"
              }
            >
              {gameStatus === "active" ? "Live" : gameStatus === "paused" ? "Paused" : "Ended"}
            </Badge>
          </div>
          <div className="text-gray-300">Miller Park Speedball Tournament</div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Game Timer & Controls */}
        <Card className="bg-[#2D2D2D] border-gray-700 p-6">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-[#00FF41] font-mono">{gameTime}</div>
            <div className="text-gray-400">Game Time Remaining</div>

            <div className="flex justify-center space-x-3">
              {gameStatus === "active" ? (
                <Button
                  onClick={() => setGameStatus("paused")}
                  className="bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Game
                </Button>
              ) : gameStatus === "paused" ? (
                <Button
                  onClick={() => setGameStatus("active")}
                  className="bg-[#00FF41] text-black hover:bg-[#00FF41]/90"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume Game
                </Button>
              ) : null}

              <Button
                variant="outline"
                onClick={() => setGameStatus("ended")}
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
              >
                <Square className="w-4 h-4 mr-2" />
                End Game
              </Button>
            </div>
          </div>
        </Card>

        {/* Team Status */}
        <div className="grid gap-4">
          {teams.map((team, teamIndex) => (
            <Card key={teamIndex} className="bg-[#2D2D2D] border-gray-700 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${team.color}`}></div>
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                  </div>
                  <div className="text-sm text-gray-400">
                    {team.players.filter((p) => p.status === "active").length} active
                  </div>
                </div>

                <div className="space-y-2">
                  {team.players.map((player, playerIndex) => (
                    <div key={playerIndex} className="flex items-center justify-between p-2 bg-[#1A1A1A] rounded">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-[#2D2D2D] text-white text-xs">
                            {player.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{player.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-400">{player.eliminations} elims</span>
                        <Badge
                          className={player.status === "active" ? "bg-[#00FF41] text-black" : "bg-red-600 text-white"}
                        >
                          {player.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Game Events */}
        <div>
          <h2 className="text-xl font-bold mb-4">Game Events</h2>
          <Card className="bg-[#2D2D2D] border-gray-700 p-4">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {gameEvents.map((event, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-[#1A1A1A] rounded">
                  <div className="text-sm text-gray-400 font-mono w-12">{event.time}</div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      event.type === "elimination"
                        ? "bg-red-500"
                        : event.type === "objective"
                          ? "bg-[#00FF41]"
                          : "bg-blue-500"
                    }`}
                  ></div>
                  <div className="text-sm">{event.event}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="border-[#FF6B35] text-[#FF6B35] bg-transparent">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report Issue
          </Button>
          <Button variant="outline" className="border-[#00FF41] text-[#00FF41] bg-transparent">
            <Flag className="w-4 h-4 mr-2" />
            Log Event
          </Button>
        </div>
      </div>
    </div>
  )
}
