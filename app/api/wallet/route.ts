// app/api/wallet/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, transactions, paymentMethods } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { AuthService } from '@/lib/auth/auth-service'

export async function GET(request: NextRequest) {
  try {
    // Extract session token from cookies or headers
    const sessionToken = request.cookies.get('session')?.value || 
                        request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'No session token provided' }, { status: 401 })
    }

    // Validate session using your auth service
    const authResult = await AuthService.validateSession(sessionToken)
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
    }

    const currentUser = authResult.user
    
    // Fetch user data from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, currentUser.id))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch recent transactions (last 10)
    const userTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, currentUser.id))
      .orderBy(desc(transactions.createdAt))
      .limit(10)

    // Fetch payment methods
    const userPaymentMethods = await db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.userId, currentUser.id))

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        walletBalance: user.walletBalance,
        totalEarned: user.totalEarned,
        totalLoaded: user.totalLoaded,
        referralEarnings: user.referralEarnings,
        referralCount: user.referralCount,
        autoReload: user.autoReload,
        autoReloadAmount: user.autoReloadAmount,
        autoReloadThreshold: user.autoReloadThreshold,
      },
      transactions: userTransactions,
      paymentMethods: userPaymentMethods,
    })
  } catch (error) {
    console.error('Error fetching wallet data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}