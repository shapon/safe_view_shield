import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, Eye, Tablet, Smartphone, Laptop } from "lucide-react";
import type { User, Device, ContentAnalysis } from "@shared/schema";

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/user"]
  });

  const { data: devices, isLoading: devicesLoading } = useQuery<Device[]>({
    queryKey: ["/api/devices"]
  });

  const { data: contentAnalyses, isLoading: analysesLoading } = useQuery<ContentAnalysis[]>({
    queryKey: ["/api/content-analysis"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalBlocked: number;
    totalAnalyzed: number;
    riskBreakdown: { safe: number; medium: number; high: number };
  }>({
    queryKey: ["/api/content-analysis/stats"],
  });

  if (userLoading || devicesLoading || analysesLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "tablet": return <Tablet className="h-6 w-6" />;
      case "phone": return <Smartphone className="h-6 w-6" />;
      case "laptop": return <Laptop className="h-6 w-6" />;
      default: return <Tablet className="h-6 w-6" />;
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return <Badge variant="destructive" data-testid={`badge-risk-high`}>HIGH RISK</Badge>;
      case "medium":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700" data-testid={`badge-risk-medium`}>MEDIUM RISK</Badge>;
      case "safe":
        return <Badge variant="secondary" className="bg-green-100 text-green-700" data-testid={`badge-risk-safe`}>SAFE</Badge>;
      default:
        return null;
    }
  };

  const recentAnalyses = contentAnalyses?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-sans font-semibold text-3xl text-gray-900" data-testid="heading-dashboard">
                Protection Dashboard
              </h1>
              <p className="text-gray-600" data-testid="text-family-plan">
                Family Plan - {user?.name || "Johnson Family"}
              </p>
            </div>
            <div className="flex items-center bg-green-50 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-green-600 font-medium" data-testid="status-protection">Active Protection</span>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-blue-50" data-testid="card-blocked-today">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-500" data-testid="stat-blocked-today">
                  {recentAnalyses.filter(a => a.wasBlocked && 
                    new Date(a.analyzedAt).toDateString() === new Date().toDateString()
                  ).length}
                </div>
                <div className="text-sm text-gray-600">Content Blocked Today</div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50" data-testid="card-total-blocked">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-500" data-testid="stat-total-blocked">
                  {stats?.totalBlocked || 0}
                </div>
                <div className="text-sm text-gray-600">Total Blocked This Month</div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50" data-testid="card-protected-devices">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-500" data-testid="stat-protected-devices">
                  {devices?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Protected Devices</div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50" data-testid="card-detection-rate">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-500" data-testid="stat-detection-rate">
                  99.8%
                </div>
                <div className="text-sm text-gray-600">Detection Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="mb-6" data-testid="card-recent-activity">
          <CardHeader>
            <CardTitle className="font-sans font-semibold text-lg text-gray-900">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnalyses.map((analysis, index) => (
                <div
                  key={analysis.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
                    analysis.riskLevel === "high"
                      ? "bg-red-50 border-red-400"
                      : analysis.riskLevel === "medium"
                      ? "bg-yellow-50 border-yellow-400"
                      : "bg-green-50 border-green-400"
                  }`}
                  data-testid={`activity-item-${index}`}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-full mr-3 ${
                        analysis.riskLevel === "high"
                          ? "bg-red-100"
                          : analysis.riskLevel === "medium"
                          ? "bg-yellow-100"
                          : "bg-green-100"
                      }`}
                    >
                      {analysis.riskLevel === "high" ? (
                        <AlertTriangle className={`h-4 w-4 text-red-500`} />
                      ) : analysis.riskLevel === "medium" ? (
                        <Eye className={`h-4 w-4 text-yellow-500`} />
                      ) : (
                        <CheckCircle className={`h-4 w-4 text-green-500`} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900" data-testid={`activity-title-${index}`}>
                        {analysis.wasBlocked
                          ? analysis.riskLevel === "high"
                            ? "AI-Generated Content Blocked"
                            : "Suspicious Content Flagged"
                          : "Content Approved"}
                      </div>
                      <div className="text-sm text-gray-600" data-testid={`activity-details-${index}`}>
                        {analysis.platform} • {devices?.find(d => d.id === analysis.deviceId)?.name} • {
                          new Date(analysis.analyzedAt).toLocaleTimeString([], { 
                            hour: "numeric", 
                            minute: "2-digit" 
                          })
                        }
                      </div>
                    </div>
                  </div>
                  {getRiskBadge(analysis.riskLevel)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Protected Devices */}
        <Card data-testid="card-protected-devices-list">
          <CardHeader>
            <CardTitle className="font-sans font-semibold text-lg text-gray-900">
              Protected Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {devices?.map((device, index) => (
                <div 
                  key={device.id} 
                  className="flex items-center p-4 bg-gray-50 rounded-lg"
                  data-testid={`device-item-${index}`}
                >
                  <div className={`text-2xl mr-3 ${device.isOnline ? 'text-primary-500' : 'text-gray-400'}`}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <div className={`font-medium ${device.isOnline ? 'text-gray-900' : 'text-gray-500'}`} data-testid={`device-name-${index}`}>
                      {device.name}
                    </div>
                    <div className={`text-sm ${device.isOnline ? 'text-green-600' : 'text-gray-400'}`} data-testid={`device-status-${index}`}>
                      Protected • {device.isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
