import { Link, useLocation } from "wouter";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center" data-testid="link-home">
              <Shield className="h-8 w-8 text-primary-500 mr-3" />
              <span className="font-sans font-bold text-xl text-gray-900">SafeViewShield</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/how-it-works" 
              className={`transition-colors ${location === '/how-it-works' ? 'text-primary-500' : 'text-gray-600 hover:text-primary-500'}`}
              data-testid="link-how-it-works"
            >
              How It Works
            </Link>
            <Link 
              href="/#features" 
              className={`transition-colors ${location.includes('#features') ? 'text-primary-500' : 'text-gray-600 hover:text-primary-500'}`}
              data-testid="link-features"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className={`transition-colors ${location === '/pricing' ? 'text-primary-500' : 'text-gray-600 hover:text-primary-500'}`}
              data-testid="link-pricing"
            >
              Pricing
            </Link>
            <Link 
              href="/dashboard" 
              className={`transition-colors ${location === '/dashboard' ? 'text-primary-500' : 'text-gray-600 hover:text-primary-500'}`}
              data-testid="link-dashboard"
            >
              Dashboard
            </Link>
            <Link href="/signup">
              <Button 
                className="bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                data-testid="button-get-started"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
