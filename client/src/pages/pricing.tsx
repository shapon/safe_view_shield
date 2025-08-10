import Navigation from "@/components/navigation";
import PricingSection from "@/components/pricing-section";
import Footer from "@/components/footer";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-20">
        <PricingSection />
      </div>
      <Footer />
    </div>
  );
}
