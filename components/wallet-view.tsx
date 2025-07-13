"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, Gift, Settings, Loader2 } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  status: string
  createdAt: string
  relatedGameId?: string
  relatedUserId?: string
}

interface User {
  id: string
  username: string
  walletBalance: number
  totalEarned: number
  totalLoaded: number
  referralEarnings: number
  referralCount: number
  autoReload: boolean
  autoReloadAmount: number
  autoReloadThreshold: number
}

interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
}

export function WalletView() {
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [addingFunds, setAddingFunds] = useState(false)
  const [updatingAutoReload, setUpdatingAutoReload] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const quickAmounts = [10, 25, 50, 100]

  useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    try {
      const response = await fetch('/api/wallet')
      if (!response.ok) throw new Error('Failed to fetch wallet data')
      
      const data = await response.json()
      setUser(data.user)
      setTransactions(data.transactions)
      setPaymentMethods(data.paymentMethods)
    } catch (error) {
      console.error('Error fetching wallet data:', error)
      toast({
        title: "Error",
        description: "Failed to load wallet data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddFunds = async (amount: number) => {
    if (!user || paymentMethods.length === 0) {
      toast({
        title: "No Payment Method",
        description: "Please add a payment method first.",
        variant: "destructive",
      })
      return
    }

    setAddingFunds(true)
    try {
      const response = await fetch('/api/wallet/add-funds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount * 100 }), // Convert to cents
      })

      if (!response.ok) throw new Error('Failed to add funds')

      const data = await response.json()
      
      if (data.requiresAction) {
        // Handle 3D Secure or other authentication
        window.location.href = data.redirectUrl
      } else {
        // Payment succeeded
        await fetchWalletData()
        toast({
          title: "Funds Added",
          description: `$${amount} has been added to your wallet.`,
        })
      }
    } catch (error) {
      console.error('Error adding funds:', error)
      toast({
        title: "Error",
        description: "Failed to add funds. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAddingFunds(false)
    }
  }

  const handleAutoReloadToggle = async (enabled: boolean) => {
    setUpdatingAutoReload(true)
    try {
      const response = await fetch('/api/wallet/auto-reload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
      })

      if (!response.ok) throw new Error('Failed to update auto-reload setting')

      const data = await response.json()
      setUser(data.user)
      
      toast({
        title: "Auto-reload Updated",
        description: `Auto-reload has been ${enabled ? 'enabled' : 'disabled'}.`,
      })
    } catch (error) {
      console.error('Error updating auto-reload:', error)
      toast({
        title: "Error",
        description: "Failed to update auto-reload setting.",
        variant: "destructive",
      })
    } finally {
      setUpdatingAutoReload(false)
    }
  }

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} day${Math.floor(diffInHours / 24) > 1 ? 's' : ''} ago`
    return `${Math.floor(diffInHours / 168)} week${Math.floor(diffInHours / 168) > 1 ? 's' : ''} ago`
  }

  const getTransactionTitle = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'deposit':
        return 'Wallet Reload'
      case 'game_entry':
        return transaction.description || 'Game Entry'
      case 'game_winnings':
        return 'Game Winnings'
      case 'referral_bonus':
        return transaction.description || 'Referral Bonus'
      case 'auto_reload':
        return 'Auto Reload'
      default:
        return transaction.description
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to Load Wallet</h2>
          <Button onClick={() => router.push('/login')}>
            Return to Login
          </Button>
        </div>
      </div>
    )
  }

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
              <div className="text-4xl font-bold text-white">
                {formatCurrency(user.walletBalance)}
              </div>
              <div className="text-sm text-gray-300">Available Balance</div>
            </div>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="text-center">
                <div className="text-[#00FF41] font-semibold">
                  {formatCurrency(user.totalEarned)}
                </div>
                <div className="text-gray-400">Earned</div>
              </div>
              <div className="text-center">
                <div className="text-[#FF6B35] font-semibold">
                  {formatCurrency(user.totalLoaded)}
                </div>
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
              onClick={() => handleAddFunds(amount)}
              disabled={addingFunds}
            >
              {addingFunds ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />${amount}
                </>
              )}
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
                <div className="text-sm text-gray-400">
                  When balance drops below {formatCurrency(user.autoReloadThreshold)}
                </div>
              </div>
            </div>
            <Switch
              checked={user.autoReload}
              onCheckedChange={handleAutoReloadToggle}
              disabled={updatingAutoReload}
            />
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
                <div className="text-sm text-gray-400">
                  From {user.referralCount} successful referrals
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-[#FF6B35]">
                {formatCurrency(user.referralEarnings)}
              </div>
              <div className="text-xs text-gray-400">Total earned</div>
            </div>
          </div>
        </Card>

        {/* Transaction History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#00FF41]"
              onClick={() => router.push('/wallet/transactions')}
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {transactions.length === 0 ? (
              <Card className="bg-[#2D2D2D] border-gray-700 p-8">
                <div className="text-center text-gray-400">
                  No transactions yet. Add funds to get started!
                </div>
              </Card>
            ) : (
              transactions.map((transaction) => (
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
                        <div className="font-medium">{getTransactionTitle(transaction)}</div>
                        <div className="text-sm text-gray-400">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${transaction.amount > 0 ? "text-[#00FF41]" : "text-white"}`}>
                        {transaction.amount > 0 ? "+" : ""}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          transaction.status === "pending"
                            ? "border-[#FF6B35] text-[#FF6B35]"
                            : "border-[#00FF41] text-[#00FF41]"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Add Payment Method */}
        <Button 
          className="w-full bg-[#00FF41] text-black hover:bg-[#00FF41]/90 font-semibold py-3"
          onClick={() => router.push('/wallet/payment-methods')}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {paymentMethods.length === 0 ? 'Add Payment Method' : 'Manage Payment Methods'}
        </Button>
      </div>
    </div>
  )
}