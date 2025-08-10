import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function PricingSection() {
  const plans = [
    {
      name: "Family Plan",
      price: "$9",
      period: "per month",
      description: "",
      features: [
        "Up to 5 devices",
        "Real-time AI detection", 
        "Parent dashboard",
        "Mobile notifications",
        "24/7 support"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: false
    },
    {
      name: "School Basic",
      price: "$349",
      period: "per month",
      description: "Up to 500 students",
      features: [
        "Unlimited devices",
        "Advanced AI detection",
        "Admin dashboard", 
        "Teacher controls",
        "Detailed reporting",
        "Priority support"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "School Enterprise", 
      price: "$599",
      period: "per month",
      description: "Unlimited students",
      features: [
        "Everything in Basic",
        "Custom AI training",
        "API integration",
        "White-label option",
        "SLA guarantee", 
        "Dedicated support"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50" data-testid="section-pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-gray-900 mb-4" data-testid="heading-pricing">
            Choose Your Protection Plan
          </h2>
          <p className="text-lg text-gray-600" data-testid="text-pricing-description">
            Affordable protection for families and comprehensive solutions for schools
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative shadow-sm hover:shadow-lg transition-shadow ${
                plan.popular ? 'border-2 border-primary-500' : ''
              }`}
              data-testid={`pricing-card-${index}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary-500 text-white" data-testid={`badge-popular-${index}`}>
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="font-sans font-semibold text-xl text-gray-900 mb-2" data-testid={`plan-name-${index}`}>
                  {plan.name}
                </CardTitle>
                <div className="text-4xl font-bold text-primary-500 mb-1" data-testid={`plan-price-${index}`}>
                  {plan.price}
                </div>
                <div className="text-gray-500" data-testid={`plan-period-${index}`}>{plan.period}</div>
                {plan.description && (
                  <div className="text-sm text-gray-500 mt-1" data-testid={`plan-description-${index}`}>
                    {plan.description}
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center" data-testid={`plan-feature-${index}-${featureIndex}`}>
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {plan.buttonText === "Start Free Trial" ? (
                  <Link href="/signup">
                    <Button 
                      variant={plan.buttonVariant}
                      className={`w-full py-3 font-medium transition-colors ${
                        plan.buttonVariant === 'default' 
                          ? 'bg-primary-500 text-white hover:bg-primary-600' 
                          : 'border-primary-500 text-primary-500 hover:bg-primary-50'
                      }`}
                      data-testid={`button-plan-${index}`}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    variant={plan.buttonVariant}
                    className={`w-full py-3 font-medium transition-colors ${
                      plan.buttonVariant === 'default' 
                        ? 'bg-primary-500 text-white hover:bg-primary-600' 
                        : 'border-primary-500 text-primary-500 hover:bg-primary-50'
                    }`}
                    data-testid={`button-plan-${index}`}
                  >
                    {plan.buttonText}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
