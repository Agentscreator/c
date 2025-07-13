// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/auth-service';
import { insertUserSchema } from '@/lib/db/schema';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email(),
  phone: z.string().regex(/^\+?1?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Invalid phone number'),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  tagCode: z.string().optional(),
  skillLevel: z.string().optional(),
  location: z.string().optional(),
  interests: z.array(z.string()),
  agreedToTerms: z.boolean().refine(val => val === true, 'Must agree to terms'),
  allowLocation: z.boolean().refine(val => val === true, 'Must allow location access'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Debug: Log the incoming request body
    console.log('=== REGISTRATION DEBUG ===');
    console.log('Raw request body:', JSON.stringify(body, null, 2));
    console.log('Body type:', typeof body);
    
    // Debug: Check each field individually
    console.log('\n=== FIELD ANALYSIS ===');
    Object.entries(body).forEach(([key, value]) => {
      console.log(`${key}:`, {
        value,
        type: typeof value,
        isArray: Array.isArray(value),
        length: typeof value === 'string' ? value.length : 'N/A'
      });
    });
    
    // Debug: Check for missing required fields
    const requiredFields = ['username', 'email', 'phone', 'password', 'interests', 'agreedToTerms', 'allowLocation'];
    const missingFields = requiredFields.filter(field => !(field in body));
    if (missingFields.length > 0) {
      console.log('\n=== MISSING REQUIRED FIELDS ===');
      console.log('Missing fields:', missingFields);
    }
    
    // Use safeParse for better error handling
    const validationResult = registerSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.log('\n=== VALIDATION ERRORS ===');
      console.log('Validation failed with errors:');
      
      validationResult.error.issues.forEach((issue, index) => {
        console.log(`\nError ${index + 1}:`);
        console.log('  Field:', issue.path.join('.') || 'root');
        console.log('  Message:', issue.message);
        console.log('  Code:', issue.code);
        console.log('  Received value:', 'received' in issue ? issue.received : 'N/A');
        console.log('  Expected:', 'expected' in issue ? issue.expected : 'N/A');
        
        // Special handling for specific validation types
        if (issue.code === 'invalid_string' && 'validation' in issue) {
          console.log('  Validation type:', issue.validation);
        }
        if (issue.code === 'custom') {
          console.log('  Custom validation failed');
        }
      });
      
      // Return detailed error response
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error', 
          errors: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.') || 'root',
            message: issue.message,
            code: issue.code,
            received: 'received' in issue ? issue.received : undefined
          }))
        },
        { status: 400 }
      );
    }
    
    const validatedData = validationResult.data;
    console.log('\n=== VALIDATION SUCCESS ===');
    console.log('Validated data:', JSON.stringify(validatedData, null, 2));

    const result = await AuthService.register(validatedData);

    if (result.success) {
      const response = NextResponse.json({
        success: true,
        message: result.message,
        user: result.user,
      });

      // Set session cookie
      response.cookies.set('session', result.sessionToken!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('\n=== UNEXPECTED ERROR ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Full error:', error);
    
    if (error instanceof z.ZodError) {
      // This shouldn't happen now since we're using safeParse, but just in case
      console.error('Zod validation error (unexpected):', error.errors);
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}