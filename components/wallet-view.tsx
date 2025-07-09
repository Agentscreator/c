"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, Gift, Settings } from "lucide-react"
import Image from "next/image"

export function WalletView() {
  const transactions = [
    { id: 1, type: "pending", title: "Game Entry - Miller Park", amount: -6.0, date: "2 hours ago" },
    { id: 2, type: "completed", title: "Referral Bonus - Jake M.", amount: 2.0, date: "1 day ago" },
    { id: 3, type: "completed", title: "Wallet Reload", amount: 25.0, date: "3 days ago" },
    { id: 4, type: "completed", title: "Game Winnings", amount: 4.0, date: "1 week ago" },
    { id: 5, type: "completed", title: "Game Entry - Woodland Warriors", amount: -8.0, date: "1 week ago" },
  ]

  const quickAmounts = [10, 25, 50, 100]

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="bg-[#2D2D2D] border-b border-gray-700">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Image src="/logo-green.png" alt="CrosspointX" width={32} height={32} />
            <span className="ml-3 font-bold text-lg">Wallet</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-[#00FF41]/20 to-[#FF6B35]/20 border-[#00FF41] p-6">
          <div className="text-center space-y-4">
            <div>
              <div className="text-4xl font-bold text-white">$43.50</div>
              <div className="text-sm text-gray-300">Available Balance</div>
            </div>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="text-center">
                <div className="text-[#00FF41] font-semibold">$24.00</div>
                <div className="text-gray-400">Earned</div>
              </div>
              <div className="text-center">
                <div className="text-[#FF6B35] font-semibold">$67.50</div>
                <div className="text-gray-400">Loaded</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          {quickAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              className="bg-[#2D2D2D] border-gray-600 text-white hover:bg-[#00FF41] hover:text-black transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />${amount}
            </Button>
          ))}
        </div>

        {/* Auto-reload Setting */}
        <Card className="bg-[#2D2D2D] border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#00FF41]/20 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-[#00FF41]" />
              </div>
              <div>
                <div className="font-medium">Auto-reload</div>
                <div className="text-sm text-gray-400">When balance drops below $10</div>
              </div>
            </div>
            <Switch />
          </div>
        </Card>

        {/* Referral Earnings */}
        <Card className="bg-[#2D2D2D] border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#FF6B35]/20 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div>
                <div className="font-medium">Referral Earnings</div>
                <div className="text-sm text-gray-400">From 12 successful referrals</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-[#FF6B35]">$24.00</div>
              <div className="text-xs text-gray-400">Total earned</div>
            </div>
          </div>
        </Card>

        {/* Transaction History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            <Button variant="ghost" size="sm" className="text-[#00FF41]">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="bg-[#2D2D2D] border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.amount > 0 ? "bg-[#00FF41]/20" : "bg-[#FF6B35]/20"
                      }`}
                    >
                      {transaction.amount > 0 ? (
                        <ArrowDownLeft className="w-5 h-5 text-[#00FF41]" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-[#FF6B35]" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.title}</div>
                      <div className="text-sm text-gray-400">{transaction.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${transaction.amount > 0 ? "text-[#00FF41]" : "text-white"}`}>
                      {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        transaction.type === "pending"
                          ? "border-[#FF6B35] text-[#FF6B35]"
                          : "border-[#00FF41] text-[#00FF41]"
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Add Payment Method */}
        <Button className="w-full bg-[#00FF41] text-black hover:bg-[#00FF41]/90 font-semibold py-3">
          <CreditCard className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </div>
    </div>
  )
}
