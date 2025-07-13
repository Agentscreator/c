// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { users, transactions, paymentMethods } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'setup_intent.succeeded':
        await handleSetupIntentSucceeded(event.data.object as Stripe.SetupIntent)
        break
      
      case 'payment_method.attached':
        await handlePaymentMethodAttached(event.data.object as Stripe.PaymentMethod)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata.userId
  const type = paymentIntent.metadata.type
  
  if (!userId || type !== 'wallet_reload') {
    console.log('Payment intent not related to wallet reload')
    return
  }

  // Find the pending transaction
  const [transaction] = await db
    .select()
    .from(transactions)
    .where(and(
      eq(transactions.stripePaymentIntentId, paymentIntent.id),
      eq(transactions.status, 'pending')
    ))
    .limit(1)

  if (!transaction) {
    console.log('No pending transaction found for payment intent:', paymentIntent.id)
    return
  }

  // Get user data
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    console.log('User not found:', userId)
    return
  }

  // Update transaction and user balance in a transaction
  await db.transaction(async (tx) => {
    // Update transaction status
    await tx
      .update(transactions)
      .set({ 
        status: 'completed',
        updatedAt: new Date(),
      })
      .where(eq(transactions.id, transaction.id))

    // Update user wallet balance and total loaded
    // Handle null values by defaulting to 0
    const currentWalletBalance = user.walletBalance ?? 0
    const currentTotalLoaded = user.totalLoaded ?? 0
    
    await tx
      .update(users)
      .set({
        walletBalance: currentWalletBalance + transaction.amount,
        totalLoaded: currentTotalLoaded + transaction.amount,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
  })

  console.log(`Payment succeeded for user ${userId}: ${transaction.amount / 100}`)
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata.userId
  const type = paymentIntent.metadata.type
  
  if (!userId || type !== 'wallet_reload') {
    console.log('Payment intent not related to wallet reload')
    return
  }

  // Find the pending transaction
  const [transaction] = await db
    .select()
    .from(transactions)
    .where(and(
      eq(transactions.stripePaymentIntentId, paymentIntent.id),
      eq(transactions.status, 'pending')
    ))
    .limit(1)

  if (!transaction) {
    console.log('No pending transaction found for failed payment intent:', paymentIntent.id)
    return
  }

  // Update transaction status to failed
  await db
    .update(transactions)
    .set({ 
      status: 'failed',
      updatedAt: new Date(),
    })
    .where(eq(transactions.id, transaction.id))

  console.log(`Payment failed for user ${userId}: ${transaction.amount / 100}`)
}

async function handleSetupIntentSucceeded(setupIntent: Stripe.SetupIntent) {
  const customerId = setupIntent.customer as string
  const paymentMethodId = setupIntent.payment_method as string
  
  if (!customerId || !paymentMethodId) {
    console.log('Setup intent missing customer or payment method')
    return
  }

  // Find user by Stripe customer ID
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1)

  if (!user) {
    console.log('User not found for customer:', customerId)
    return
  }

  // Get payment method details from Stripe
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
  
  if (paymentMethod.type === 'card' && paymentMethod.card) {
    // Check if payment method already exists
    const [existingPM] = await db
      .select()
      .from(paymentMethods)
      .where(and(
        eq(paymentMethods.userId, user.id),
        eq(paymentMethods.stripePaymentMethodId, paymentMethodId)
      ))
      .limit(1)

    if (!existingPM) {
      // Check if this is the user's first payment method
      const [firstPM] = await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.userId, user.id))
        .limit(1)

      const isDefault = !firstPM

      // Insert new payment method
      await db.insert(paymentMethods).values({
        userId: user.id,
        stripePaymentMethodId: paymentMethodId,
        type: 'card',
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        expiryMonth: paymentMethod.card.exp_month,
        expiryYear: paymentMethod.card.exp_year,
        isDefault,
        isActive: true,
      })

      console.log(`Payment method added for user ${user.id}: ${paymentMethod.card.brand} ending in ${paymentMethod.card.last4}`)
    }
  }
}

async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  const customerId = paymentMethod.customer as string
  
  if (!customerId) {
    console.log('Payment method not attached to customer')
    return
  }

  // Find user by Stripe customer ID
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1)

  if (!user) {
    console.log('User not found for customer:', customerId)
    return
  }

  if (paymentMethod.type === 'card' && paymentMethod.card) {
    // Check if payment method already exists
    const [existingPM] = await db
      .select()
      .from(paymentMethods)
      .where(and(
        eq(paymentMethods.userId, user.id),
        eq(paymentMethods.stripePaymentMethodId, paymentMethod.id)
      ))
      .limit(1)

    if (!existingPM) {
      // Check if this is the user's first payment method
      const [firstPM] = await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.userId, user.id))
        .limit(1)

      const isDefault = !firstPM

      // Insert new payment method
      await db.insert(paymentMethods).values({
        userId: user.id,
        stripePaymentMethodId: paymentMethod.id,
        type: 'card',
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        expiryMonth: paymentMethod.card.exp_month,
        expiryYear: paymentMethod.card.exp_year,
        isDefault,
        isActive: true,
      })

      console.log(`Payment method attached for user ${user.id}: ${paymentMethod.card.brand} ending in ${paymentMethod.card.last4}`)
    }
  }
}