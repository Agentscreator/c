// lib/db/schema.ts
import { pgTable, text, timestamp, boolean, integer, uuid, jsonb, decimal } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  passwordHash: text('password_hash').notNull(),
  tagCode: text('tag_code'), // Made nullable - removed .notNull()
  skillLevel: text('skill_level'),
  location: text('location'),
  interests: jsonb('interests').$type<string[]>().default([]),
  isActive: boolean('is_active').default(true),
  emailVerified: boolean('email_verified').default(false),
  phoneVerified: boolean('phone_verified').default(false),
  walletBalance: integer('wallet_balance').default(0), // in cents
  totalEarned: integer('total_earned').default(0), // in cents
  totalLoaded: integer('total_loaded').default(0), // in cents
  referralEarnings: integer('referral_earnings').default(0), // in cents
  referralCount: integer('referral_count').default(0),
  agreedToTerms: boolean('agreed_to_terms').default(false),
  allowLocation: boolean('allow_location').default(false),
  autoReload: boolean('auto_reload').default(false),
  autoReloadAmount: integer('auto_reload_amount').default(2500), // $25 in cents
  autoReloadThreshold: integer('auto_reload_threshold').default(1000), // $10 in cents
  // Stripe fields
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripePaymentMethodId: text('stripe_payment_method_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Sessions table for authentication
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: text('session_token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tag codes table (for validation)
export const tagCodes = pgTable('tag_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  isUsed: boolean('is_used').default(false),
  usedBy: uuid('used_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  usedAt: timestamp('used_at'),
});

// Transactions table for wallet history
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'deposit', 'withdrawal', 'game_entry', 'game_winnings', 'referral_bonus', 'auto_reload'
  amount: integer('amount').notNull(), // in cents, negative for debits
  description: text('description').notNull(),
  status: text('status').notNull().default('completed'), // 'pending', 'completed', 'failed'
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  relatedGameId: uuid('related_game_id'), // for game-related transactions
  relatedUserId: uuid('related_user_id'), // for referral bonuses
  metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Payment methods table
export const paymentMethods = pgTable('payment_methods', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stripePaymentMethodId: text('stripe_payment_method_id').notNull(),
  type: text('type').notNull(), // 'card', 'bank_account', etc.
  brand: text('brand'), // 'visa', 'mastercard', etc.
  last4: text('last4'),
  expiryMonth: integer('expiry_month'),
  expiryYear: integer('expiry_year'),
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Referrals table
export const referrals = pgTable('referrals', {
  id: uuid('id').primaryKey().defaultRandom(),
  referrerId: uuid('referrer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  referredId: uuid('referred_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  bonusAmount: integer('bonus_amount').default(200), // $2 in cents
  bonusPaid: boolean('bonus_paid').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  paidAt: timestamp('paid_at'),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email(),
  phone: (schema) => schema.regex(/^\+?1?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Invalid phone number'),
  username: (schema) => schema.min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  passwordHash: (schema) => schema.min(8),
});

export const selectUserSchema = createSelectSchema(users);

// Create transaction schema manually due to enum validation requirements
export const insertTransactionSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  type: z.enum(['deposit', 'withdrawal', 'game_entry', 'game_winnings', 'referral_bonus', 'auto_reload']),
  amount: z.number().int(),
  description: z.string(),
  status: z.enum(['pending', 'completed', 'failed']).default('completed'),
  stripePaymentIntentId: z.string().optional(),
  relatedGameId: z.string().uuid().optional(),
  relatedUserId: z.string().uuid().optional(),
  metadata: z.record(z.any()).default({}),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const selectTransactionSchema = createSelectSchema(transactions);

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods);
export const selectPaymentMethodSchema = createSelectSchema(paymentMethods);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type NewPaymentMethod = typeof paymentMethods.$inferInsert;
export type Referral = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;