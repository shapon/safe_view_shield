import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContentAnalysisSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  subscriptionTier: z.enum(["family", "school_basic", "school_enterprise"]),
  numberOfDevices: z.number().min(1)
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      
      // Create new user
      const newUser = await storage.createUser({
        name: validatedData.name,
        email: validatedData.email,
        subscriptionTier: validatedData.subscriptionTier,
        subscriptionStatus: "trial",
        trialEndsAt: new Date(Date.now() + (validatedData.subscriptionTier === "family" ? 7 : 
                             validatedData.subscriptionTier === "school_basic" ? 14 : 30) * 24 * 60 * 60 * 1000)
      });
      
      // Create subscription record
      const subscriptionPricing = {
        family: 900, // $9.00
        school_basic: 34900, // $349.00
        school_enterprise: 59900 // $599.00
      };
      
      await storage.createSubscription({
        userId: newUser.id,
        tier: validatedData.subscriptionTier,
        status: "trial",
        pricePerMonth: subscriptionPricing[validatedData.subscriptionTier],
        maxDevices: validatedData.subscriptionTier === "family" ? 5 : 
                   validatedData.subscriptionTier === "school_basic" ? 500 : null,
        maxStudents: validatedData.subscriptionTier === "family" ? null :
                    validatedData.subscriptionTier === "school_basic" ? 500 : null,
        features: validatedData.subscriptionTier === "family" 
          ? ["real_time_detection", "parent_dashboard", "mobile_notifications", "24_7_support"] as string[]
          : validatedData.subscriptionTier === "school_basic"
          ? ["real_time_detection", "admin_dashboard", "teacher_controls", "detailed_reporting", "priority_support"] as string[]
          : ["real_time_detection", "admin_dashboard", "custom_ai_training", "api_integration", "white_label", "sla_guarantee", "dedicated_support"] as string[]
      });
      
      res.status(201).json({ 
        message: "Account created successfully", 
        userId: newUser.id,
        trialEndsAt: newUser.trialEndsAt
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Get current user (for demo, return first user)
  app.get("/api/user", async (req, res) => {
    try {
      const users = await storage.getUserByEmail("parent@example.com");
      if (!users) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user devices
  app.get("/api/devices", async (req, res) => {
    try {
      const user = await storage.getUserByEmail("parent@example.com");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const devices = await storage.getDevicesByUserId(user.id);
      res.json(devices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch devices" });
    }
  });

  // Get content analysis history
  app.get("/api/content-analysis", async (req, res) => {
    try {
      const user = await storage.getUserByEmail("parent@example.com");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const analyses = await storage.getContentAnalysisByUserId(user.id, limit);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content analysis" });
    }
  });

  // Get content analysis stats
  app.get("/api/content-analysis/stats", async (req, res) => {
    try {
      const user = await storage.getUserByEmail("parent@example.com");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const stats = await storage.getContentAnalysisStats(user.id, days);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Create new content analysis (simulate AI detection)
  app.post("/api/content-analysis", async (req, res) => {
    try {
      const validatedData = insertContentAnalysisSchema.parse(req.body);
      const analysis = await storage.createContentAnalysis(validatedData);
      res.status(201).json(analysis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create content analysis" });
    }
  });

  // Get user subscription
  app.get("/api/subscription", async (req, res) => {
    try {
      const user = await storage.getUserByEmail("parent@example.com");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const subscription = await storage.getSubscriptionByUserId(user.id);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      res.json(subscription);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  // AI Detection simulation endpoint
  app.post("/api/ai-detection/analyze", async (req, res) => {
    try {
      const { contentUrl, platform, deviceId } = req.body;
      
      if (!contentUrl || !platform || !deviceId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock AI detection logic
      const analysis = {
        riskLevel: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "safe",
        aiConfidence: Math.floor(Math.random() * 20) + 80, // 80-100%
        detectionReasons: [],
        wasBlocked: false,
      };

      // Determine detection reasons based on risk level
      if (analysis.riskLevel === "high") {
        analysis.detectionReasons = ["synthetic_face_detected", "inappropriate_content_pattern"];
        analysis.wasBlocked = true;
      } else if (analysis.riskLevel === "medium") {
        analysis.detectionReasons = ["behavioral_pattern_anomaly"];
        analysis.wasBlocked = true;
      }

      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "AI detection analysis failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
