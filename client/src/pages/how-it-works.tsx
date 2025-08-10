import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import RealTimeDemo from "@/components/real-time-demo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Zap, 
  Shield, 
  Eye, 
  Bell, 
  BarChart3, 
  Clock, 
  Users, 
  Smartphone,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function HowItWorks() {
  const realTimeSteps = [
    {
      step: "1",
      title: "Content Interception",
      description: "SafeViewShield monitors video content as your child browses YouTube, TikTok, and other platforms",
      icon: <Eye className="h-6 w-6 text-blue-500" />,
      timeframe: "Instant",
      bgColor: "bg-blue-50"
    },
    {
      step: "2", 
      title: "AI Analysis",
      description: "Our advanced AI analyzes visual patterns, audio cues, and metadata to detect synthetic content",
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      timeframe: "< 500ms",
      bgColor: "bg-purple-50"
    },
    {
      step: "3",
      title: "Risk Assessment", 
      description: "Content is classified as Safe, Medium Risk, or High Risk based on AI confidence scores",
      icon: <Shield className="h-6 w-6 text-green-500" />,
      timeframe: "< 200ms",
      bgColor: "bg-green-50"
    },
    {
      step: "4",
      title: "Instant Action",
      description: "High-risk content is blocked immediately, while safe content plays normally",
      icon: <Zap className="h-6 w-6 text-red-500" />,
      timeframe: "< 100ms", 
      bgColor: "bg-red-50"
    },
    {
      step: "5",
      title: "Parent Notification",
      description: "You receive real-time alerts about blocked content with detailed analysis reports",
      icon: <Bell className="h-6 w-6 text-yellow-500" />,
      timeframe: "Immediate",
      bgColor: "bg-yellow-50"
    }
  ];

  const benefits = [
    {
      category: "For Parents",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      features: [
        "Real-time notifications when harmful content is blocked",
        "Daily/weekly summary reports of your child's online activity", 
        "Customizable protection levels for each child and device",
        "Peace of mind knowing AI-generated inappropriate content can't reach your kids",
        "No technical setup required - works automatically across all devices"
      ]
    },
    {
      category: "For Children",
      icon: <Shield className="h-8 w-8 text-green-500" />,
      features: [
        "Seamless browsing experience with no delays or interruptions",
        "Access to age-appropriate content without restrictions on educational videos",
        "Protection from sophisticated AI-generated content that looks real",
        "Safe exploration of online video platforms",
        "No need to understand complex safety settings"
      ]
    },
    {
      category: "For Schools",
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
      features: [
        "Protect hundreds of students simultaneously across all school devices",
        "Comprehensive reporting for administrators and teachers",
        "Compliance with child safety regulations and educational standards",
        "Bulk device management and policy enforcement",
        "Integration with existing school IT infrastructure"
      ]
    }
  ];

  const realTimeFeatures = [
    {
      title: "Instant Content Analysis",
      description: "Every video frame is analyzed in real-time using advanced computer vision",
      metric: "< 1 second processing time",
      icon: <Clock className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Live Dashboard Updates",
      description: "Parent dashboard updates immediately when content is blocked or analyzed",
      metric: "Real-time sync",
      icon: <BarChart3 className="h-5 w-5 text-green-500" />
    },
    {
      title: "Mobile Notifications",
      description: "Get instant push notifications on your phone when high-risk content is detected",
      metric: "Push notifications",
      icon: <Smartphone className="h-5 w-5 text-purple-500" />
    },
    {
      title: "Multi-Device Protection",
      description: "All family devices are protected simultaneously with centralized monitoring",
      metric: "Unlimited devices",
      icon: <Shield className="h-5 w-5 text-red-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="primary-gradient py-20" data-testid="section-how-it-works-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-sans font-bold text-4xl md:text-5xl text-gray-900 mb-6" data-testid="heading-how-it-works">
            How SafeViewShield Works in Real-Time
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-how-it-works-description">
            Advanced AI protection that works invisibly in the background, analyzing and blocking harmful content 
            before it reaches your child's screen - all in less than one second.
          </p>
        </div>
      </section>

      {/* Real-Time Process */}
      <section className="py-20 bg-white" data-testid="section-real-time-process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-gray-900 mb-4" data-testid="heading-real-time-process">
              Real-Time Protection Process
            </h2>
            <p className="text-lg text-gray-600" data-testid="text-process-description">
              Here's what happens in the split second between your child clicking a video and it playing
            </p>
          </div>

          <div className="space-y-8">
            {realTimeSteps.map((step, index) => (
              <div key={index} className="flex items-center" data-testid={`process-step-${index}`}>
                <div className={`${step.bgColor} p-4 rounded-full mr-6`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold mr-4" data-testid={`step-number-${index}`}>
                      Step {step.step}
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700" data-testid={`step-timeframe-${index}`}>
                      {step.timeframe}
                    </Badge>
                  </div>
                  <h3 className="font-sans font-semibold text-xl text-gray-900 mb-2" data-testid={`step-title-${index}`}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600" data-testid={`step-description-${index}`}>
                    {step.description}
                  </p>
                </div>
                {index < realTimeSteps.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-gray-400 ml-6" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-Time Features */}
      <section className="py-20 bg-gray-50" data-testid="section-real-time-features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-gray-900 mb-4" data-testid="heading-real-time-features">
              Real-Time Features
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {realTimeFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`real-time-feature-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-100 p-3 rounded-full mr-4">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900" data-testid={`feature-title-${index}`}>
                        {feature.title}
                      </h3>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700" data-testid={`feature-metric-${index}`}>
                        {feature.metric}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600" data-testid={`feature-description-${index}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white" data-testid="section-benefits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-gray-900 mb-4" data-testid="heading-benefits">
              Real Benefits for Real People
            </h2>
            <p className="text-lg text-gray-600" data-testid="text-benefits-description">
              See how SafeViewShield provides immediate value to families and schools
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`benefit-category-${index}`}>
                <CardHeader>
                  <div className="flex items-center mb-4">
                    {benefit.icon}
                    <CardTitle className="font-sans font-semibold text-xl text-gray-900 ml-3" data-testid={`benefit-category-title-${index}`}>
                      {benefit.category}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefit.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start" data-testid={`benefit-feature-${index}-${featureIndex}`}>
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-20 bg-primary-50" data-testid="section-live-demo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-gray-900 mb-4" data-testid="heading-live-demo">
              See SafeViewShield in Action
            </h2>
            <p className="text-lg text-gray-600" data-testid="text-live-demo-description">
              Watch our AI protection system analyze and block content in real-time
            </p>
          </div>
          <RealTimeDemo />
        </div>
      </section>

      {/* Technology Explanation */}
      <section className="py-20 bg-gray-50" data-testid="section-technology">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-sans font-bold text-3xl md:text-4xl text-gray-900 mb-6" data-testid="heading-technology">
                Advanced AI Technology That Works
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                    <Brain className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2" data-testid="tech-feature-1-title">
                      Computer Vision Analysis
                    </h3>
                    <p className="text-gray-600" data-testid="tech-feature-1-description">
                      Our AI examines every frame for unnatural facial movements, lighting inconsistencies, 
                      and other visual artifacts that indicate synthetic content.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-4 mt-1">
                    <Zap className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2" data-testid="tech-feature-2-title">
                      Audio Deepfake Detection
                    </h3>
                    <p className="text-gray-600" data-testid="tech-feature-2-description">
                      Advanced audio analysis detects voice synthesis, unnatural speech patterns, 
                      and AI-generated audio that could be used to manipulate children.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4 mt-1">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2" data-testid="tech-feature-3-title">
                      Behavioral Pattern Recognition
                    </h3>
                    <p className="text-gray-600" data-testid="tech-feature-3-description">
                      Machine learning models identify suspicious content patterns and behaviors 
                      that traditional filters completely miss.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="font-semibold text-xl text-gray-900 mb-6 text-center" data-testid="demo-analysis-title">
                Live Analysis Demo
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 border-l-4 border-red-400 rounded">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900" data-testid="demo-blocked-title">AI-Generated Content Detected</div>
                      <div className="text-sm text-gray-600" data-testid="demo-blocked-details">Confidence: 97% • Blocked in 0.8s</div>
                    </div>
                  </div>
                  <Badge variant="destructive" data-testid="demo-blocked-badge">BLOCKED</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 border-l-4 border-green-400 rounded">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900" data-testid="demo-safe-title">Educational Content Approved</div>
                      <div className="text-sm text-gray-600" data-testid="demo-safe-details">Confidence: 99% • Analyzed in 0.3s</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700" data-testid="demo-safe-badge">SAFE</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}