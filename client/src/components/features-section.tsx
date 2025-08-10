import { Brain, Zap, BarChart3, CheckCircle } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Content Detection",
      description: "Advanced machine learning algorithms analyze visual elements, audio cues, and behavioral patterns to identify synthetic content with 99.7% accuracy.",
      benefits: [
        "Visual pattern recognition",
        "Audio deepfake detection", 
        "Behavioral analysis"
      ],
      bgColor: "bg-blue-100",
      iconColor: "text-blue-500"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-Time Blocking",
      description: "Content is analyzed and blocked instantly before it reaches your child's screen, with no buffering or delays.",
      benefits: [
        "Instant content analysis",
        "Zero-delay blocking",
        "Seamless user experience"
      ],
      bgColor: "bg-green-100",
      iconColor: "text-green-500"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Parent Dashboard",
      description: "Comprehensive reporting and controls give you visibility into blocked content and protection statistics.",
      benefits: [
        "Detailed activity reports",
        "Customizable settings",
        "Mobile notifications"
      ],
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50" data-testid="section-features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-gray-900 mb-4" data-testid="heading-features">
            Advanced Protection Technology
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-testid="text-features-description">
            Our AI-powered system analyzes video content in real-time, detecting subtle patterns that traditional filters miss.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              data-testid={`feature-card-${index}`}
            >
              <div className={`${feature.bgColor} p-3 rounded-full w-fit mb-4`}>
                <div className={feature.iconColor}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-sans font-semibold text-xl text-gray-900 mb-3" data-testid={`feature-title-${index}`}>
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4" data-testid={`feature-description-${index}`}>
                {feature.description}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center" data-testid={`feature-benefit-${index}-${benefitIndex}`}>
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
