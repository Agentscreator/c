// lib/wallet/auto-reload.ts
import { db } from '@/lib/db'
import { users, transactions, paymentMethods } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { stripe } from '@/lib/stripe'

export async function checkAndTriggerAutoReload(userId: string) {
  try {
    // Get user data
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      console.log('User not found for auto-reload check:', userId)
      return false
    }

    // Check if auto-reload is enabled and balance is below threshold
    const walletBalance = user.walletBalance ?? 0
    const autoReloadThreshold = user.autoReloadThreshold ?? 0
    const autoReloadAmount = user.autoReloadAmount ?? 0

    if (!user.autoReload || walletBalance >= autoReloadThreshold || autoReloadAmount <= 0) {
      return false
    }

    // Get user's default payment method
    const [defaultPaymentMethod] = await db
      .select()
      .from(paymentMethods)
      .where(and(
        eq(paymentMethods.userId, userId),
        eq(paymentMethods.isDefault, true),
        eq(paymentMethods.isActive, true)
      ))
      .limit(1)

    if (!defaultPaymentMethod) {
      console.log('No default payment method found for auto-reload:', userId)
      return false
    }

    // Check if user has a Stripe customer ID
    if (!user.stripeCustomerId) {
      console.log('No Stripe customer ID found for auto-reload:', userId)
      return false
    }

    // Create payment intent for auto-reload
    const paymentIntent = await stripe.paymentIntents.create({
      amount: autoReloadAmount,
      currency: 'usd',
      customer: user.stripeCustomerId,
      payment_method: defaultPaymentMethod.stripePaymentMethodId,
      confirmation_method: 'automatic',
      confirm: true,
      metadata: {
        userId,
        type: 'wallet_reload',
        autoReload: 'true',
      },
    })

    // Create transaction record
    const [transaction] = await db
      .insert(transactions)
      .values({
        userId,
        type: 'auto_reload',
        amount: autoReloadAmount,
        description: `Auto Reload - $${(autoReloadAmount / 100).toFixed(2)}`,
        status: 'pending',
        stripePaymentIntentId: paymentIntent.id,
        metadata: { autoReload: true },
      })
      .returning()

    // Handle immediate success
    if (paymentIntent.status === 'succeeded') {
      await db.transaction(async (tx) => {
        // Update transaction status
        await tx
          .update(transactions)
          .set({ status: 'completed' })
          .where(eq(transactions.id, transaction.id))

        // Update user wallet balance and total loaded
        const totalLoaded = user.totalLoaded ?? 0
        await tx
          .update(users)
          .set({
            walletBalance: walletBalance + autoReloadAmount,
            totalLoaded: totalLoaded + autoReloadAmount,
          })
          .where(eq(users.id, userId))
      })

      console.log(`Auto-reload succeeded for user ${userId}: $${autoReloadAmount / 100}`)
      return true
    } else if (paymentIntent.status === 'requires_action') {
      // Auto-reload requires action, mark as failed since user can't intervene
      await db
        .update(transactions)
        .set({ status: 'failed' })
        .where(eq(transactions.id, transaction.id))

      console.log(`Auto-reload requires action for user ${userId}, marking as failed`)
      return false
    } else {
      // Auto-reload failed
      await db
        .update(transactions)
        .set({ status: 'failed' })
        .where(eq(transactions.id, transaction.id))

      console.log(`Auto-reload failed for user ${userId}`)
      return false
    }
  } catch (error) {
    console.error('Error in auto-reload:', error)
    return false
  }
}

export async function deductFromWallet(userId: string, amount: number, description: string, gameId?: string) {
  try {
    // Get user data
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      throw new Error('User not found')
    }

    const walletBalance = user.walletBalance ?? 0

    // Check if user has sufficient balance
    if (walletBalance < amount) {
      // Try auto-reload first
      const autoReloadSuccess = await checkAndTriggerAutoReload(userId)
      
      if (!autoReloadSuccess) {
        throw new Error('Insufficient balance')
      }

      // Refresh user data after auto-reload
      const [refreshedUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)

      const refreshedWalletBalance = refreshedUser?.walletBalance ?? 0

      if (!refreshedUser || refreshedWalletBalance < amount) {
        throw new Error('Insufficient balance after auto-reload')
      }
    }

    // Create deduction transaction and update balance
    const [transaction] = await db.transaction(async (tx) => {
      // Create transaction record
      const [newTransaction] = await tx
        .insert(transactions)
        .values({
          userId,
          type: 'game_entry',
          amount: -amount, // Negative for deduction
          description,
          status: 'completed',
          relatedGameId: gameId,
        })
        .returning()

      // Update user wallet balance
      await tx
        .update(users)
        .set({
          walletBalance: walletBalance - amount,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))

      return [newTransaction]
    })

    console.log(`Deducted $${amount / 100} from user ${userId} wallet`)
    return transaction
  } catch (error) {
    console.error('Error deducting from wallet:', error)
    throw error
  }
}

export async function addToWallet(userId: string, amount: number, description: string, type: string = 'game_winnings', relatedGameId?: string, relatedUserId?: string) {
  try {
    // Get user data
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      throw new Error('User not found')
    }

    const walletBalance = user.walletBalance ?? 0
    const totalEarned = user.totalEarned ?? 0
    const referralEarnings = user.referralEarnings ?? 0

    // Create addition transaction and update balance
    const [transaction] = await db.transaction(async (tx) => {
      // Create transaction record
      const [newTransaction] = await tx
        .insert(transactions)
        .values({
          userId,
          type,
          amount,
          description,
          status: 'completed',
          relatedGameId,
          relatedUserId,
        })
        .returning()

      // Update user wallet balance and total earned
      const updateData: any = {
        walletBalance: walletBalance + amount,
        updatedAt: new Date(),
      }

      if (type === 'game_winnings') {
        updateData.totalEarned = totalEarned + amount
      } else if (type === 'referral_bonus') {
        updateData.totalEarned = totalEarned + amount
        updateData.referralEarnings = referralEarnings + amount
      }

      await tx
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId))

      return [newTransaction]
    })

    console.log(`Added $${amount / 100} to user ${userId} wallet`)
    return transaction
  } catch (error) {
    console.error('Error adding to wallet:', error)
    throw error
  }
}