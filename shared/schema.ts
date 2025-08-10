import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  subscriptionTier: text("subscription_tier").notNull().default("family"), // family, school_basic, school_enterprise
  subscriptionStatus: text("subscription_status").notNull().default("active"), // active, canceled, trial
  trialEndsAt: timestamp("trial_ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const devices = pgTable("devices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // tablet, phone, laptop
  isOnline: boolean("is_online").notNull().default(true),
  isProtected: boolean("is_protected").notNull().default(true),
  lastSeen: timestamp("last_seen").defaultNow(),
});

export const contentAnalysis = pgTable("content_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  deviceId: varchar("device_id").notNull().references(() => devices.id),
  platform: text("platform").notNull(), // youtube, tiktok, etc
  contentUrl: text("content_url"),
  contentTitle: text("content_title"),
  riskLevel: text("risk_level").notNull(), // safe, medium, high
  aiConfidence: integer("ai_confidence").notNull(), // 0-100
  wasBlocked: boolean("was_blocked").notNull(),
  detectionReasons: jsonb("detection_reasons"), // array of reasons
  analyzedAt: timestamp("analyzed_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  tier: text("tier").notNull(), // family, school_basic, school_enterprise
  status: text("status").notNull().default("active"),
  pricePerMonth: integer("price_per_month").notNull(), // in cents
  maxDevices: integer("max_devices"),
  maxStudents: integer("max_students"),
  features: jsonb("features"), // array of feature names
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertDeviceSchema = createInsertSchema(devices).omit({
  id: true,
  lastSeen: true,
});

export const insertContentAnalysisSchema = createInsertSchema(contentAnalysis).omit({
  id: true,
  analyzedAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  startDate: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = typeof devices.$inferSelect;
export type InsertContentAnalysis = z.infer<typeof insertContentAnalysisSchema>;
export type ContentAnalysis = typeof contentAnalysis.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
