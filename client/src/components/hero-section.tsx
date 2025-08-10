import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="primary-gradient py-20" data-testid="section-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-sans font-bold text-4xl md:text-5xl text-gray-900 leading-tight mb-6" data-testid="heading-hero">
              Protect Your Kids from AI-Generated Inappropriate Content
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed" data-testid="text-hero-description">
              Advanced AI detection technology that identifies and blocks harmful synthetic videos before they reach your children. SafeViewShield catches what traditional filters miss.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="bg-primary-500 text-white hover:bg-primary-600 transition-colors shadow-lg w-full"
                  data-testid="button-start-trial"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary-500 text-primary-500 hover:bg-primary-50 transition-colors w-full"
                  data-testid="button-watch-demo"
                >
                  See How It Works
                </Button>
              </Link>
            </div>
            <div className="flex items-center mt-6 text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span data-testid="text-trial-info">7-day free trial • No credit card required</span>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Parent and child safely using tablet together" 
              className="rounded-2xl shadow-2xl w-full"
              data-testid="img-hero"
            />
            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-xl" data-testid="card-content-blocked">
              <div className="flex items-center">
                <div className="bg-green-500 p-2 rounded-full mr-3">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900" data-testid="text-blocked-title">Content Blocked</div>
                  <div className="text-xs text-gray-500" data-testid="text-blocked-count">15 videos today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
