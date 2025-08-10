import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Eye, CheckCircle, Tablet, Smartphone, Laptop } from "lucide-react";

export default function DashboardPreview() {
  const mockActivities = [
    {
      type: "blocked",
      title: "AI-Generated Content Blocked",
      platform: "YouTube",
      device: "Kids iPad",
      time: "2:34 PM",
      risk: "HIGH RISK",
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      bgColor: "bg-red-50",
      borderColor: "border-red-400",
      iconBg: "bg-red-100"
    },
    {
      type: "flagged",
      title: "Suspicious Content Flagged",
      platform: "TikTok",
      device: "Teen Phone",
      time: "1:15 PM",
      risk: "MEDIUM RISK",
      icon: <Eye className="h-4 w-4 text-yellow-500" />,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-400",
      iconBg: "bg-yellow-100"
    },
    {
      type: "approved",
      title: "Content Approved",
      platform: "YouTube Kids",
      device: "Kids Tablet",
      time: "12:45 PM",
      risk: "SAFE",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-400",
      iconBg: "bg-green-100"
    }
  ];

  const mockDevices = [
    {
      name: "Emma's iPad",
      icon: <Tablet className="h-6 w-6" />,
      status: "Protected • Online",
      isOnline: true
    },
    {
      name: "Alex's Phone", 
      icon: <Smartphone className="h-6 w-6" />,
      status: "Protected • Online",
      isOnline: true
    },
    {
      name: "Family Laptop",
      icon: <Laptop className="h-6 w-6" />,
      status: "Protected • Offline",
      isOnline: false
    }
  ];

  return (
    <section id="dashboard" className="py-20 bg-white" data-testid="section-dashboard-preview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-gray-900 mb-4" data-testid="heading-dashboard-preview">
            Parent Dashboard
          </h2>
          <p className="text-lg text-gray-600" data-testid="text-dashboard-description">
            Monitor and control your family's content protection in real-time
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="bg-gray-100 p-8 rounded-2xl">
          {/* Dashboard Header */}
          <Card className="mb-6" data-testid="card-dashboard-header">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-sans font-semibold text-2xl text-gray-900" data-testid="heading-protection-dashboard">
                    Protection Dashboard
                  </h3>
                  <p className="text-gray-600" data-testid="text-family-plan-preview">Family Plan - Johnson Family</p>
                </div>
                <div className="flex items-center bg-green-50 px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-green-600 font-medium" data-testid="status-active-protection">Active Protection</span>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg" data-testid="preview-stat-blocked-today">
                  <div className="text-2xl font-bold text-blue-500">23</div>
                  <div className="text-sm text-gray-600">Content Blocked Today</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg" data-testid="preview-stat-total-blocked">
                  <div className="text-2xl font-bold text-green-500">847</div>
                  <div className="text-sm text-gray-600">Total Blocked This Month</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg" data-testid="preview-stat-devices">
                  <div className="text-2xl font-bold text-blue-500">3</div>
                  <div className="text-sm text-gray-600">Protected Devices</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg" data-testid="preview-stat-detection">
                  <div className="text-2xl font-bold text-green-500">99.8%</div>
                  <div className="text-sm text-gray-600">Detection Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="mb-6" data-testid="card-recent-activity-preview">
            <CardHeader>
              <CardTitle className="font-sans font-semibold text-lg text-gray-900">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivities.map((activity, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 ${activity.bgColor} rounded-lg border-l-4 ${activity.borderColor}`}
                    data-testid={`preview-activity-${index}`}
                  >
                    <div className="flex items-center">
                      <div className={`${activity.iconBg} p-2 rounded-full mr-3`}>
                        {activity.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900" data-testid={`preview-activity-title-${index}`}>
                          {activity.title}
                        </div>
                        <div className="text-sm text-gray-600" data-testid={`preview-activity-details-${index}`}>
                          {activity.platform} • {activity.device} • {activity.time}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={activity.risk === "HIGH RISK" ? "destructive" : "secondary"}
                      className={
                        activity.risk === "MEDIUM RISK" 
                          ? "bg-yellow-100 text-yellow-700" 
                          : activity.risk === "SAFE" 
                          ? "bg-green-100 text-green-700" 
                          : ""
                      }
                      data-testid={`preview-activity-badge-${index}`}
                    >
                      {activity.risk}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Protected Devices */}
          <Card data-testid="card-protected-devices-preview">
            <CardHeader>
              <CardTitle className="font-sans font-semibold text-lg text-gray-900">
                Protected Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {mockDevices.map((device, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-4 bg-gray-50 rounded-lg"
                    data-testid={`preview-device-${index}`}
                  >
                    <div className={`text-2xl mr-3 ${device.isOnline ? 'text-primary-500' : 'text-gray-400'}`}>
                      {device.icon}
                    </div>
                    <div>
                      <div className={`font-medium ${device.isOnline ? 'text-gray-900' : 'text-gray-500'}`} data-testid={`preview-device-name-${index}`}>
                        {device.name}
                      </div>
                      <div className={`text-sm ${device.isOnline ? 'text-green-600' : 'text-gray-400'}`} data-testid={`preview-device-status-${index}`}>
                        {device.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
