// lib/auth/auth-service.ts
import { db } from '@/lib/db';
import { users, sessions, tagCodes } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export interface RegisterData {
  username: string;
  email: string;
  phone: string;
  password: string;
  tagCode?: string; // Made optional
  skillLevel?: string;
  location?: string;
  interests: string[];
  agreedToTerms: boolean;
  allowLocation: boolean;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  sessionToken?: string;
}

export class AuthService {
  // Check if username is available
  static async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
      
      return existingUser.length === 0;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  }

  // Check if email is available
  static async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      return existingUser.length === 0;
    } catch (error) {
      console.error('Error checking email availability:', error);
      return false;
    }
  }

  // Validate tag code
  static async validateTagCode(code: string): Promise<boolean> {
    try {
      const tagCode = await db
        .select()
        .from(tagCodes)
        .where(and(eq(tagCodes.code, code), eq(tagCodes.isUsed, false)))
        .limit(1);
      
      return tagCode.length > 0;
    } catch (error) {
      console.error('Error validating tag code:', error);
      return false;
    }
  }

  // Register new user
  static async register(data: RegisterData): Promise<AuthResult> {
    try {
      // Validate tag code if provided
      if (data.tagCode) {
        const isValidTag = await this.validateTagCode(data.tagCode);
        if (!isValidTag) {
          return { success: false, message: 'Invalid or already used tag code' };
        }
      }

      // Check if username is available
      const usernameAvailable = await this.checkUsernameAvailability(data.username);
      if (!usernameAvailable) {
        return { success: false, message: 'Username is already taken' };
      }

      // Check if email is available
      const emailAvailable = await this.checkEmailAvailability(data.email);
      if (!emailAvailable) {
        return { success: false, message: 'Email is already registered' };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 12);

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          username: data.username,
          email: data.email,
          phone: data.phone,
          passwordHash,
          tagCode: data.tagCode || null, // Use null if no tagCode provided
          skillLevel: data.skillLevel,
          location: data.location,
          interests: data.interests,
          agreedToTerms: data.agreedToTerms,
          allowLocation: data.allowLocation,
        })
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
        });

      // Mark tag code as used (only if provided)
      if (data.tagCode) {
        await db
          .update(tagCodes)
          .set({ 
            isUsed: true, 
            usedBy: newUser.id,
            usedAt: new Date()
          })
          .where(eq(tagCodes.code, data.tagCode));
      }

      // Create session
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await db.insert(sessions).values({
        userId: newUser.id,
        sessionToken,
        expiresAt,
      });

      return {
        success: true,
        message: 'Account created successfully',
        user: newUser,
        sessionToken,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  }

  // Login user
  static async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Find user by email
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Create session
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await db.insert(sessions).values({
        userId: user.id,
        sessionToken,
        expiresAt,
      });

      return {
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        sessionToken,
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }

  // Validate session
  static async validateSession(sessionToken: string): Promise<AuthResult> {
    try {
      const [session] = await db
        .select({
          id: sessions.id,
          userId: sessions.userId,
          expiresAt: sessions.expiresAt,
          user: {
            id: users.id,
            username: users.username,
            email: users.email,
          },
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.sessionToken, sessionToken))
        .limit(1);

      if (!session) {
        return { success: false, message: 'Invalid session' };
      }

      if (session.expiresAt < new Date()) {
        // Session expired, clean it up
        await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
        return { success: false, message: 'Session expired' };
      }

      return {
        success: true,
        user: session.user,
        sessionToken,
      };
    } catch (error) {
      console.error('Session validation error:', error);
      return { success: false, message: 'Session validation failed' };
    }
  }

  // Logout user
  static async logout(sessionToken: string): Promise<boolean> {
    try {
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  // Generate session token
  private static generateSessionToken(): string {
    return randomBytes(32).toString('hex');
  }

  // Clean up expired sessions
  static async cleanupExpiredSessions(): Promise<void> {
    try {
      await db.delete(sessions).where(eq(sessions.expiresAt, new Date()));
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
    }
  }
}