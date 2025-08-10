import { type User, type InsertUser, type Device, type InsertDevice, type ContentAnalysis, type InsertContentAnalysis, type Subscription, type InsertSubscription } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;

  // Devices
  getDevice(id: string): Promise<Device | undefined>;
  getDevicesByUserId(userId: string): Promise<Device[]>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDevice(id: string, device: Partial<Device>): Promise<Device | undefined>;
  deleteDevice(id: string): Promise<boolean>;

  // Content Analysis
  getContentAnalysis(id: string): Promise<ContentAnalysis | undefined>;
  getContentAnalysisByUserId(userId: string, limit?: number): Promise<ContentAnalysis[]>;
  createContentAnalysis(analysis: InsertContentAnalysis): Promise<ContentAnalysis>;
  getContentAnalysisStats(userId: string, days?: number): Promise<{
    totalBlocked: number;
    totalAnalyzed: number;
    riskBreakdown: { safe: number; medium: number; high: number };
  }>;

  // Subscriptions
  getSubscription(id: string): Promise<Subscription | undefined>;
  getSubscriptionByUserId(userId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, subscription: Partial<Subscription>): Promise<Subscription | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private devices: Map<string, Device>;
  private contentAnalyses: Map<string, ContentAnalysis>;
  private subscriptions: Map<string, Subscription>;

  constructor() {
    this.users = new Map();
    this.devices = new Map();
    this.contentAnalyses = new Map();
    this.subscriptions = new Map();

    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample user
    const user = await this.createUser({
      email: "parent@example.com",
      name: "Johnson Family",
      subscriptionTier: "family",
      subscriptionStatus: "active",
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Create sample devices
    await this.createDevice({
      userId: user.id,
      name: "Emma's iPad",
      type: "tablet",
      isOnline: true,
      isProtected: true,
    });

    await this.createDevice({
      userId: user.id,
      name: "Alex's Phone",
      type: "phone",
      isOnline: true,
      isProtected: true,
    });

    await this.createDevice({
      userId: user.id,
      name: "Family Laptop",
      type: "laptop",
      isOnline: false,
      isProtected: true,
    });

    // Create sample content analyses
    const device1 = Array.from(this.devices.values())[0];
    const device2 = Array.from(this.devices.values())[1];

    await this.createContentAnalysis({
      userId: user.id,
      deviceId: device1.id,
      platform: "YouTube",
      contentUrl: "https://youtube.com/watch?v=example1",
      contentTitle: "Inappropriate AI-Generated Video",
      riskLevel: "high",
      aiConfidence: 97,
      wasBlocked: true,
      detectionReasons: ["synthetic_face_detected", "inappropriate_content_pattern", "voice_deepfake"],
    });

    await this.createContentAnalysis({
      userId: user.id,
      deviceId: device2.id,
      platform: "TikTok",
      contentUrl: "https://tiktok.com/@user/video/example2",
      contentTitle: "Suspicious Content",
      riskLevel: "medium",
      aiConfidence: 82,
      wasBlocked: true,
      detectionReasons: ["behavioral_pattern_anomaly", "moderate_risk_indicators"],
    });

    await this.createContentAnalysis({
      userId: user.id,
      deviceId: device1.id,
      platform: "YouTube Kids",
      contentUrl: "https://youtube.com/watch?v=example3",
      contentTitle: "Educational Animal Video",
      riskLevel: "safe",
      aiConfidence: 99,
      wasBlocked: false,
      detectionReasons: [],
    });

    // Create subscription
    await this.createSubscription({
      userId: user.id,
      tier: "family",
      status: "active",
      pricePerMonth: 900, // $9.00
      maxDevices: 5,
      maxStudents: null,
      features: ["real_time_detection", "parent_dashboard", "mobile_notifications", "24_7_support"],
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Devices
  async getDevice(id: string): Promise<Device | undefined> {
    return this.devices.get(id);
  }

  async getDevicesByUserId(userId: string): Promise<Device[]> {
    return Array.from(this.devices.values()).filter(device => device.userId === userId);
  }

  async createDevice(insertDevice: InsertDevice): Promise<Device> {
    const id = randomUUID();
    const device: Device = { 
      ...insertDevice, 
      id, 
      lastSeen: new Date(),
    };
    this.devices.set(id, device);
    return device;
  }

  async updateDevice(id: string, updateData: Partial<Device>): Promise<Device | undefined> {
    const device = this.devices.get(id);
    if (!device) return undefined;
    
    const updatedDevice = { ...device, ...updateData };
    this.devices.set(id, updatedDevice);
    return updatedDevice;
  }

  async deleteDevice(id: string): Promise<boolean> {
    return this.devices.delete(id);
  }

  // Content Analysis
  async getContentAnalysis(id: string): Promise<ContentAnalysis | undefined> {
    return this.contentAnalyses.get(id);
  }

  async getContentAnalysisByUserId(userId: string, limit: number = 50): Promise<ContentAnalysis[]> {
    return Array.from(this.contentAnalyses.values())
      .filter(analysis => analysis.userId === userId)
      .sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime())
      .slice(0, limit);
  }

  async createContentAnalysis(insertAnalysis: InsertContentAnalysis): Promise<ContentAnalysis> {
    const id = randomUUID();
    const analysis: ContentAnalysis = { 
      ...insertAnalysis, 
      id, 
      analyzedAt: new Date(),
    };
    this.contentAnalyses.set(id, analysis);
    return analysis;
  }

  async getContentAnalysisStats(userId: string, days: number = 30): Promise<{
    totalBlocked: number;
    totalAnalyzed: number;
    riskBreakdown: { safe: number; medium: number; high: number };
  }> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const userAnalyses = Array.from(this.contentAnalyses.values())
      .filter(analysis => 
        analysis.userId === userId && 
        new Date(analysis.analyzedAt) >= cutoffDate
      );

    const totalAnalyzed = userAnalyses.length;
    const totalBlocked = userAnalyses.filter(a => a.wasBlocked).length;
    
    const riskBreakdown = {
      safe: userAnalyses.filter(a => a.riskLevel === 'safe').length,
      medium: userAnalyses.filter(a => a.riskLevel === 'medium').length,
      high: userAnalyses.filter(a => a.riskLevel === 'high').length,
    };

    return { totalBlocked, totalAnalyzed, riskBreakdown };
  }

  // Subscriptions
  async getSubscription(id: string): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async getSubscriptionByUserId(userId: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(sub => sub.userId === userId);
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = randomUUID();
    const subscription: Subscription = { 
      ...insertSubscription, 
      id, 
      startDate: new Date(),
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async updateSubscription(id: string, updateData: Partial<Subscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription = { ...subscription, ...updateData };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
}

export const storage = new MemStorage();
