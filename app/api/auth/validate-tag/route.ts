// app/api/auth/validate-tag/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/auth-service';
import { z } from 'zod';

const validateTagSchema = z.object({
  tagCode: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tagCode } = validateTagSchema.parse(body);

    const isValid = await AuthService.validateTagCode(tagCode);

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Tag validation error:', error);
    return NextResponse.json(
      { valid: false },
      { status: 500 }
    );
  }
}