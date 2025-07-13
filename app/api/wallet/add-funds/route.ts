// app/api/wallet/add-funds/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, transactions, paymentMethods } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { AuthService } from '@/lib/auth/auth-service'
import { stripe } from '@/lib/stripe'
import { z } from 'zod'

const addFundsSchema = z.object({
  amount: z.number().int().min(100).max(10000), // $1 to $100 in cents
  paymentMethodId: z.string().optional(),
})

export async function POST(request: NextRequest) {
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
    
    const body = await request.json()
    const { amount, paymentMethodId } = addFundsSchema.parse(body)

    // Fetch user data
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, currentUser.id))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's payment method
    let selectedPaymentMethod
    if (paymentMethodId) {
      [selectedPaymentMethod] = await db
        .select()
        .from(paymentMethods)
        .where(and(
          eq(paymentMethods.userId, currentUser.id),
          eq(paymentMethods.stripePaymentMethodId, paymentMethodId)
        ))
        .limit(1)
    } else {
      // Use default payment method
      [selectedPaymentMethod] = await db
        .select()
        .from(paymentMethods)
        .where(and(
          eq(paymentMethods.userId, currentUser.id),
          eq(paymentMethods.isDefault, true)
        ))
        .limit(1)
    }

    if (!selectedPaymentMethod) {
      return NextResponse.json({ error: 'No payment method found' }, { status: 400 })
    }

    // Create Stripe customer if not exists
    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
        phone: user.phone,
      })
      stripeCustomerId = customer.id
      
      // Update user with Stripe customer ID
      await db
        .update(users)
        .set({ stripeCustomerId })
        .where(eq(users.id, currentUser.id))
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: stripeCustomerId,
      payment_method: selectedPaymentMethod.stripePaymentMethodId,
      confirmation_method: 'automatic',
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/wallet`,
      metadata: {
        userId: currentUser.id,
        type: 'wallet_reload',
      },
    })

    // Create pending transaction
    const [transaction] = await db
      .insert(transactions)
      .values({
        userId: currentUser.id,
        type: 'deposit',
        amount,
        description: `Wallet Reload - $${(amount / 100).toFixed(2)}`,
        status: 'pending',
        stripePaymentIntentId: paymentIntent.id,
      })
      .returning()

    // Handle different payment intent statuses
    if (paymentIntent.status === 'succeeded') {
      // Payment succeeded immediately
      await db.transaction(async (tx) => {
        // Update transaction status
        await tx
          .update(transactions)
          .set({ status: 'completed' })
          .where(eq(transactions.id, transaction.id))

        // Update user wallet balance and total loaded
        // Handle null values by defaulting to 0
        const currentWalletBalance = user.walletBalance ?? 0
        const currentTotalLoaded = user.totalLoaded ?? 0
        
        await tx
          .update(users)
          .set({
            walletBalance: currentWalletBalance + amount,
            totalLoaded: currentTotalLoaded + amount,
          })
          .where(eq(users.id, currentUser.id))
      })

      return NextResponse.json({
        success: true,
        transactionId: transaction.id,
        paymentIntentId: paymentIntent.id,
      })
    } else if (paymentIntent.status === 'requires_action') {
      // Payment requires additional action (3D Secure)
      return NextResponse.json({
        requiresAction: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        redirectUrl: paymentIntent.next_action?.redirect_to_url?.url,
      })
    } else {
      // Payment failed
      await db
        .update(transactions)
        .set({ status: 'failed' })
        .where(eq(transactions.id, transaction.id))

      return NextResponse.json(
        { error: 'Payment failed' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error adding funds:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}