"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Plus, Crown, Calendar } from "lucide-react"
import Image from "next/image"

interface TeamManagementProps {
  onBack: () => void
}

export function TeamManagement({ onBack }: TeamManagementProps) {
  const teams = [
    {
      id: 1,
      name: "Alpha Squad",
      members: 5,
      maxMembers: 8,
      role: "Captain",
      wins: 12,
      losses: 3,
      nextGame: "Tomorrow 2:00 PM",
    },
    {
      id: 2,
      name: "Shadow Ops",
      members: 3,
      maxMembers: 6,
      role: "Member",
      wins: 8,
      losses: 2,
      nextGame: "Friday 6:00 PM",
    },
  ]

  const invitations = [
    {
      id: 1,
      teamName: "Elite Warriors",
      invitedBy: "TacticalTom",
      date: "2 hours ago",
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
              <span className="text-xl font-bold">Team Management</span>
            </div>
          </div>
          <p className="text-gray-300">Create and manage your paintball teams</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Create Team Button */}
        <Button className="w-full bg-[#00FF41] text-black hover:bg-[#00FF41]/90 rounded-2xl py-3 shadow-glow-green">
          <Plus className="w-4 h-4 mr-2" />
          Create New Team
        </Button>

        {/* Team Invitations */}
        {invitations.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Team Invitations</h2>
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <Card key={invitation.id} className="bg-[#404040] border-gray-600 p-4 rounded-2xl shadow-soft">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{invitation.teamName}</h3>
                      <p className="text-sm text-gray-400">
                        Invited by {invitation.invitedBy} • {invitation.date}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-[#00FF41] text-black hover:bg-[#00FF41]/90 rounded-xl">
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-500 text-gray-300 bg-transparent rounded-xl"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* My Teams */}
        <div>
          <h2 className="text-xl font-bold mb-4">My Teams</h2>
          <div className="space-y-4">
            {teams.map((team) => (
              <Card key={team.id} className="bg-[#404040] border-gray-600 p-6 rounded-2xl shadow-soft">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#00FF41]/20 rounded-2xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-[#00FF41]" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-lg">{team.name}</h3>
                          {team.role === "Captain" && <Crown className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <p className="text-sm text-gray-400">
                          {team.members}/{team.maxMembers} members
                        </p>
                      </div>
                    </div>
                    <Badge className={team.role === "Captain" ? "bg-[#FF6B35] text-white" : "bg-[#00FF41] text-black"}>
                      {team.role}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-[#00FF41] font-bold text-lg">{team.wins}</div>
                      <div className="text-gray-400 text-xs">Wins</div>
                    </div>
                    <div>
                      <div className="text-[#FF6B35] font-bold text-lg">{team.losses}</div>
                      <div className="text-gray-400 text-xs">Losses</div>
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">
                        {Math.round((team.wins / (team.wins + team.losses)) * 100)}%
                      </div>
                      <div className="text-gray-400 text-xs">Win Rate</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      Next: {team.nextGame}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-500 text-gray-300 bg-transparent rounded-xl"
                    >
                      Manage Team
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
