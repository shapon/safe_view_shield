// Mock AI detection service for MVP
export interface AIDetectionResult {
  riskLevel: 'safe' | 'medium' | 'high';
  aiConfidence: number; // 0-100
  detectionReasons: string[];
  wasBlocked: boolean;
  processingTime: number;
}

export interface ContentAnalysisRequest {
  contentUrl: string;
  platform: string;
  deviceId: string;
  userId: string;
}

class AIDetectionService {
  async analyzeContent(request: ContentAnalysisRequest): Promise<AIDetectionResult> {
    // Simulate processing delay
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
    
    // Mock detection logic based on content patterns
    const riskLevel = this.determineRiskLevel(request.contentUrl);
    const aiConfidence = this.calculateConfidence(riskLevel);
    const detectionReasons = this.getDetectionReasons(riskLevel);
    const wasBlocked = riskLevel === 'high' || (riskLevel === 'medium' && Math.random() > 0.3);
    
    return {
      riskLevel,
      aiConfidence,
      detectionReasons,
      wasBlocked,
      processingTime: Date.now() - startTime
    };
  }

  private determineRiskLevel(contentUrl: string): 'safe' | 'medium' | 'high' {
    // Mock risk determination based on URL patterns
    const url = contentUrl.toLowerCase();
    
    // High risk indicators
    if (url.includes('deepfake') || url.includes('synthetic') || url.includes('inappropriate')) {
      return 'high';
    }
    
    // Medium risk indicators  
    if (url.includes('unverified') || url.includes('viral') || Math.random() > 0.7) {
      return 'medium';
    }
    
    // Default to safe with some randomness for demo
    return Math.random() > 0.8 ? 'medium' : 'safe';
  }

  private calculateConfidence(riskLevel: string): number {
    // Higher confidence for extreme classifications
    switch (riskLevel) {
      case 'high':
        return Math.floor(Math.random() * 10) + 90; // 90-99%
      case 'medium':
        return Math.floor(Math.random() * 20) + 70; // 70-89%
      case 'safe':
        return Math.floor(Math.random() * 15) + 85; // 85-99%
      default:
        return 80;
    }
  }

  private getDetectionReasons(riskLevel: string): string[] {
    const reasonsMap = {
      high: [
        'synthetic_face_detected',
        'deepfake_audio_pattern',
        'inappropriate_content_pattern',
        'ai_generated_imagery',
        'voice_synthesis_detected'
      ],
      medium: [
        'behavioral_pattern_anomaly',
        'moderate_risk_indicators',
        'unverified_source',
        'suspicious_metadata'
      ],
      safe: []
    };

    const availableReasons = reasonsMap[riskLevel] || [];
    
    if (availableReasons.length === 0) return [];
    
    // Return 1-3 random reasons for non-safe content
    const numReasons = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...availableReasons].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numReasons);
  }

  // Simulated real-time monitoring
  async startRealTimeMonitoring(deviceId: string, callback: (result: AIDetectionResult) => void) {
    const interval = setInterval(async () => {
      // Simulate random content being analyzed
      const mockRequest: ContentAnalysisRequest = {
        contentUrl: `https://platform.com/video/${Math.random().toString(36).substr(2, 9)}`,
        platform: ['YouTube', 'TikTok', 'Instagram'][Math.floor(Math.random() * 3)],
        deviceId,
        userId: 'demo-user'
      };

      const result = await this.analyzeContent(mockRequest);
      callback(result);
    }, Math.random() * 10000 + 5000); // Random interval 5-15 seconds

    return () => clearInterval(interval);
  }
}

export const aiDetectionService = new AIDetectionService();
