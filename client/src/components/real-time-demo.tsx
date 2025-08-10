import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Brain,
  Shield,
  Bell
} from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  platform: string;
  thumbnail: string;
  riskLevel: 'safe' | 'medium' | 'high';
  confidence: number;
  status: 'analyzing' | 'blocked' | 'approved';
  timestamp: Date;
}

export default function RealTimeDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ContentItem | null>(null);
  const [recentActivity, setRecentActivity] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState({
    analyzed: 0,
    blocked: 0,
    safe: 0
  });

  const mockContent: Omit<ContentItem, 'id' | 'timestamp' | 'status'>[] = [
    {
      title: "Educational Science Video",
      platform: "YouTube Kids",
      thumbnail: "🧪",
      riskLevel: 'safe',
      confidence: 98
    },
    {
      title: "Suspicious AI-Generated Content",
      platform: "TikTok",
      thumbnail: "🤖",
      riskLevel: 'high',
      confidence: 95
    },
    {
      title: "Kids Gaming Tutorial",
      platform: "YouTube",
      thumbnail: "🎮",
      riskLevel: 'safe',
      confidence: 97
    },
    {
      title: "Potentially Inappropriate Video",
      platform: "Instagram",
      thumbnail: "⚠️",
      riskLevel: 'medium',
      confidence: 78
    },
    {
      title: "Educational Math Lesson",
      platform: "Khan Academy",
      thumbnail: "📊",
      riskLevel: 'safe',
      confidence: 99
    },
    {
      title: "Deepfake Detection Alert",
      platform: "TikTok",
      thumbnail: "🚨",
      riskLevel: 'high',
      confidence: 93
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        // Select random content
        const randomContent = mockContent[Math.floor(Math.random() * mockContent.length)];
        const newItem: ContentItem = {
          ...randomContent,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          status: 'analyzing'
        };

        setCurrentAnalysis(newItem);

        // Simulate analysis time
        setTimeout(() => {
          const finalStatus = newItem.riskLevel === 'high' ? 'blocked' : 
                            newItem.riskLevel === 'medium' && Math.random() > 0.4 ? 'blocked' : 'approved';
          
          const completedItem = { ...newItem, status: finalStatus as 'blocked' | 'approved' };
          
          setCurrentAnalysis(null);
          setRecentActivity(prev => [completedItem, ...prev.slice(0, 4)]);
          setStats(prev => ({
            analyzed: prev.analyzed + 1,
            blocked: finalStatus === 'blocked' ? prev.blocked + 1 : prev.blocked,
            safe: finalStatus === 'approved' ? prev.safe + 1 : prev.safe
          }));
        }, Math.random() * 2000 + 1000); // 1-3 seconds analysis time

      }, Math.random() * 3000 + 2000); // New content every 2-5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const getRiskBadge = (riskLevel: string, status: string) => {
    if (status === 'blocked') {
      return <Badge variant="destructive" data-testid="badge-blocked">BLOCKED</Badge>;
    }
    if (status === 'approved') {
      return <Badge variant="secondary" className="bg-green-100 text-green-700" data-testid="badge-approved">SAFE</Badge>;
    }
    return <Badge variant="secondary" data-testid="badge-analyzing">ANALYZING...</Badge>;
  };

  const getIcon = (riskLevel: string, status: string) => {
    if (status === 'analyzing') {
      return <Brain className="h-4 w-4 text-blue-500 animate-pulse" />;
    }
    if (status === 'blocked') {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto" data-testid="real-time-demo">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-sans font-bold text-2xl text-gray-900" data-testid="demo-title">
          Real-Time Protection Demo
        </h3>
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className={`${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
          data-testid="demo-toggle"
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Stop Demo
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start Demo
            </>
          )}
        </Button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-blue-50" data-testid="demo-stat-analyzed">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500" data-testid="stat-analyzed-count">
              {stats.analyzed}
            </div>
            <div className="text-sm text-gray-600">Content Analyzed</div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50" data-testid="demo-stat-blocked">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500" data-testid="stat-blocked-count">
              {stats.blocked}
            </div>
            <div className="text-sm text-gray-600">Content Blocked</div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50" data-testid="demo-stat-safe">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500" data-testid="stat-safe-count">
              {stats.safe}
            </div>
            <div className="text-sm text-gray-600">Safe Content</div>
          </CardContent>
        </Card>
      </div>

      {/* Current Analysis */}
      {currentAnalysis && (
        <Card className="mb-6 border-2 border-blue-500" data-testid="current-analysis">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Brain className="h-5 w-5 text-blue-500 mr-2 animate-pulse" />
              Analyzing Content...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-2xl mr-3" data-testid="current-thumbnail">
                  {currentAnalysis.thumbnail}
                </div>
                <div>
                  <div className="font-medium text-gray-900" data-testid="current-title">
                    {currentAnalysis.title}
                  </div>
                  <div className="text-sm text-gray-600" data-testid="current-platform">
                    {currentAnalysis.platform} • AI Confidence: {currentAnalysis.confidence}%
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-500 font-medium" data-testid="current-status">Processing...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card data-testid="demo-recent-activity">
        <CardHeader>
          <CardTitle className="font-sans font-semibold text-lg text-gray-900">
            Recent Protection Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500" data-testid="no-activity">
              {isRunning ? "Waiting for content to analyze..." : "Click 'Start Demo' to see real-time protection in action"}
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
                    item.status === 'blocked'
                      ? 'bg-red-50 border-red-400'
                      : 'bg-green-50 border-green-400'
                  }`}
                  data-testid={`demo-activity-${index}`}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${
                      item.status === 'blocked' ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      {getIcon(item.riskLevel, item.status)}
                    </div>
                    <div className="flex items-center mr-3 text-2xl" data-testid={`demo-activity-thumbnail-${index}`}>
                      {item.thumbnail}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900" data-testid={`demo-activity-title-${index}`}>
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-600" data-testid={`demo-activity-details-${index}`}>
                        {item.platform} • {item.timestamp.toLocaleTimeString([], { 
                          hour: "numeric", 
                          minute: "2-digit",
                          second: "2-digit"
                        })}
                      </div>
                    </div>
                  </div>
                  {getRiskBadge(item.riskLevel, item.status)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert for blocked content */}
      {recentActivity.length > 0 && recentActivity[0].status === 'blocked' && (
        <Card className="mt-4 bg-yellow-50 border-yellow-200" data-testid="parent-notification">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <div className="font-medium text-yellow-800" data-testid="notification-title">
                  Parent Notification Sent
                </div>
                <div className="text-sm text-yellow-700" data-testid="notification-message">
                  Alert sent to parent's phone about blocked content: "{recentActivity[0].title}"
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}