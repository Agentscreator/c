// app/api/auth/check-username/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/auth-service';
import { z } from 'zod';

const checkUsernameSchema = z.object({
  username: z.string().min(3).max(20),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = checkUsernameSchema.parse(body);

    const isAvailable = await AuthService.checkUsernameAvailability(username);

    return NextResponse.json({ available: isAvailable });
  } catch (error) {
    console.error('Username check error:', error);
    return NextResponse.json(
      { available: false },
      { status: 500 }
    );
  }
}
