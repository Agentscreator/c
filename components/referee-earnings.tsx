"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Calendar, Trophy, ArrowDownLeft } from "lucide-react"
import Image from "next/image"

export function RefereeEarnings() {
  const earnings = {
    thisWeek: 340,
    thisMonth: 1250,
    total: 4680,
    pending: 125,
  }

  const transactions = [
    { id: 1, type: "completed", title: "Weekend Warriors Tournament", amount: 60, date: "2 days ago" },
    { id: 2, type: "completed", title: "Corporate Team Building", amount: 80, date: "4 days ago" },
    { id: 3, type: "pending", title: "Youth League Championship", amount: 120, date: "Tomorrow" },
    { id: 4, type: "completed", title: "Sunday Speedball", amount: 45, date: "1 week ago" },
    { id: 5, type: "completed", title: "Miller Park Tournament", amount: 55, date: "1 week ago" },
  ]

  const monthlyData = [
    { month: "Jan", amount: 980 },
    { month: "Feb", amount: 1120 },
    { month: "Mar", amount: 1350 },
    { month: "Apr", amount: 1250 },
  ]

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="bg-[#2D2D2D] border-b border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Image src="/logo-green.png" alt="CrosspointX" width={32} height={32} />
              <span className="text-xl font-bold">Earnings</span>
            </div>
            <Badge className="bg-[#00FF41] text-black">+12% this month</Badge>
          </div>
          <div className="text-gray-300">Track your referee income and payments</div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Earnings Overview */}
        <Card className="bg-gradient-to-r from-[#00FF41]/20 to-[#FF6B35]/20 border-[#00FF41] p-6">
          <div className="text-center space-y-4">
            <div>
              <div className="text-4xl font-bold text-white">${earnings.thisMonth.toLocaleString()}</div>
              <div className="text-sm text-gray-300">This Month</div>
            </div>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-[#00FF41] font-semibold">${earnings.thisWeek}</div>
                <div className="text-gray-400">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-[#FF6B35] font-semibold">${earnings.pending}</div>
                <div className="text-gray-400">Pending</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-[#2D2D2D] border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#00FF41]">${earnings.total.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Earned</div>
              </div>
              <Trophy className="w-6 h-6 text-[#00FF41]" />
            </div>
          </Card>

          <Card className="bg-[#2D2D2D] border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#FF6B35]">47</div>
                <div className="text-sm text-gray-400">Games Refereed</div>
              </div>
              <Calendar className="w-6 h-6 text-[#FF6B35]" />
            </div>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card className="bg-[#2D2D2D] border-gray-700 p-4">
          <h3 className="font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#00FF41]" />
            Monthly Earnings
          </h3>
          <div className="space-y-3">
            {monthlyData.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{month.month} 2024</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-[#00FF41] h-2 rounded-full"
                      style={{ width: `${(month.amount / 1500) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">${month.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Payments</h2>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="bg-[#2D2D2D] border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#00FF41]/20 rounded-lg flex items-center justify-center">
                      <ArrowDownLeft className="w-5 h-5 text-[#00FF41]" />
                    </div>
                    <div>
                      <div className="font-medium">{transaction.title}</div>
                      <div className="text-sm text-gray-400">{transaction.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#00FF41]">+${transaction.amount}</div>
                    <Badge
                      className={transaction.type === "pending" ? "bg-[#FF6B35] text-white" : "bg-[#00FF41] text-black"}
                    >
                      {transaction.type}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Payout Settings */}
        <Card className="bg-[#2D2D2D] border-gray-700 p-4">
          <h3 className="font-semibold mb-3">Payout Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-payout threshold</span>
              <span className="text-[#00FF41] font-medium">$100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Payout method</span>
              <span className="text-gray-300">Bank Transfer</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Next payout</span>
              <span className="text-gray-300">Friday, Apr 12</span>
            </div>
          </div>
          <Button className="w-full mt-4 bg-[#00FF41] text-black hover:bg-[#00FF41]/90">Request Payout</Button>
        </Card>
      </div>
    </div>
  )
}
