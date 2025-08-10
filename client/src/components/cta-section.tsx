import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CTASection() {
  return (
    <section className="py-20 bg-primary-500" data-testid="section-cta">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-sans font-bold text-3xl md:text-4xl text-white mb-4" data-testid="heading-cta">
          Start Protecting Your Family Today
        </h2>
        <p className="text-xl text-blue-100 mb-8" data-testid="text-cta-description">
          Join thousands of parents who trust SafeViewShield to keep their children safe online
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button 
              size="lg"
              className="bg-white text-primary-500 hover:bg-gray-100 transition-colors font-semibold"
              data-testid="button-cta-trial"
            >
              Start Free Trial
            </Button>
          </Link>
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-primary-500 transition-colors font-semibold"
            data-testid="button-cta-demo"
          >
            Schedule Demo
          </Button>
        </div>
        <p className="text-blue-200 text-sm mt-4" data-testid="text-cta-terms">
          No credit card required • 7-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}
