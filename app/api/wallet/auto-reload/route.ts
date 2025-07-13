// app/api/wallet/auto-reload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { AuthService } from '@/lib/auth/auth-service'

export async function PUT(request: NextRequest) {
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
    
    // Get request body
    const body = await request.json()
    const { autoReload, autoReloadAmount, autoReloadThreshold } = body

    // Validate input
    if (typeof autoReload !== 'boolean') {
      return NextResponse.json({ error: 'autoReload must be a boolean' }, { status: 400 })
    }

    if (autoReload) {
      if (!autoReloadAmount || autoReloadAmount <= 0) {
        return NextResponse.json({ error: 'autoReloadAmount must be greater than 0' }, { status: 400 })
      }
      if (!autoReloadThreshold || autoReloadThreshold < 0) {
        return NextResponse.json({ error: 'autoReloadThreshold must be 0 or greater' }, { status: 400 })
      }
    }

    // Update user auto-reload settings
    const [updatedUser] = await db
      .update(users)
      .set({
        autoReload,
        autoReloadAmount: autoReload ? autoReloadAmount : null,
        autoReloadThreshold: autoReload ? autoReloadThreshold : null,
      })
      .where(eq(users.id, currentUser.id))
      .returning({
        id: users.id,
        autoReload: users.autoReload,
        autoReloadAmount: users.autoReloadAmount,
        autoReloadThreshold: users.autoReloadThreshold,
      })

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Auto-reload settings updated successfully',
      settings: updatedUser,
    })
  } catch (error) {
    console.error('Error updating auto-reload settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}