// lib/referral/service.ts
import { db } from '@/lib/db'
import { users, referrals } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { addToWallet } from '@/lib/wallet/auto-reload'

export async function processReferralBonus(referrerId: string, referredId: string) {
  try {
    // Check if referral already exists
    const [existingReferral] = await db
      .select()
      .from(referrals)
      .where(and(
        eq(referrals.referrerId, referrerId),
        eq(referrals.referredId, referredId)
      ))
      .limit(1)

    if (existingReferral) {
      console.log('Referral already exists:', referrerId, referredId)
      return false
    }

    // Get referrer data
    const [referrer] = await db
      .select()
      .from(users)
      .where(eq(users.id, referrerId))
      .limit(1)

    if (!referrer) {
      console.log('Referrer not found:', referrerId)
      return false
    }

    // Get referred user data
    const [referredUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, referredId))
      .limit(1)

    if (!referredUser) {
      console.log('Referred user not found:', referredId)
      return false
    }

    const bonusAmount = 200 // $2 in cents

    // Create referral record and update referrer
    await db.transaction(async (tx) => {
      // Create referral record
      await tx.insert(referrals).values({
        referrerId,
        referredId,
        bonusAmount,
        bonusPaid: true,
        paidAt: new Date(),
      })

      // Update referrer's referral count
      await tx
        .update(users)
        .set({
          referralCount: (referrer.referralCount || 0) + 1,
          updatedAt: new Date(),
        })
        .where(eq(users.id, referrerId))
    })

    // Add bonus to referrer's wallet
    await addToWallet(
      referrerId,
      bonusAmount,
      `Referral Bonus - ${referredUser.username}`,
      'referral_bonus',
      undefined,
      referredId
    )

    console.log(`Referral bonus processed: ${referrer.username} referred ${referredUser.username}`)
    return true
  } catch (error) {
    console.error('Error processing referral bonus:', error)
    return false
  }
}

export async function getReferralStats(userId: string) {
  try {
    // Get user's referral data
    const userReferrals = await db
      .select({
        id: referrals.id,
        referredId: referrals.referredId,
        bonusAmount: referrals.bonusAmount,
        bonusPaid: referrals.bonusPaid,
        createdAt: referrals.createdAt,
        paidAt: referrals.paidAt,
        referredUsername: users.username,
      })
      .from(referrals)
      .leftJoin(users, eq(referrals.referredId, users.id))
      .where(eq(referrals.referrerId, userId))

    const totalEarned = userReferrals.reduce((sum, ref) => {
      return sum + (ref.bonusPaid ? (ref.bonusAmount || 0) : 0)
    }, 0)

    return {
      totalReferrals: userReferrals.length,
      totalEarned,
      referrals: userReferrals,
    }
  } catch (error) {
    console.error('Error getting referral stats:', error)
    return {
      totalReferrals: 0,
      totalEarned: 0,
      referrals: [],
    }
  }
}

export async function generateReferralCode(userId: string) {
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

    // Generate referral code based on username + random suffix
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
    const referralCode = `${user.username.toUpperCase()}-${randomSuffix}`

    return referralCode
  } catch (error) {
    console.error('Error generating referral code:', error)
    throw error
  }
}

export async function validateReferralCode(code: string, newUserId: string) {
  try {
    // Extract username from referral code
    const [username] = code.split('-')
    
    if (!username) {
      return { valid: false, referrerId: null }
    }

    // Find referrer by username
    const [referrer] = await db
      .select()
      .from(users)
      .where(eq(users.username, username.toLowerCase()))
      .limit(1)

    if (!referrer) {
      return { valid: false, referrerId: null }
    }

    // Can't refer yourself
    if (referrer.id === newUserId) {
      return { valid: false, referrerId: null }
    }

    return { valid: true, referrerId: referrer.id }
  } catch (error) {
    console.error('Error validating referral code:', error)
    return { valid: false, referrerId: null }
  }
}