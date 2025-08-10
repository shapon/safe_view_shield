import { Shield } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Security", href: "#" },
        { name: "API", href: "#" }
      ]
    },
    {
      title: "Support", 
      links: [
        { name: "Help Center", href: "#" },
        { name: "Contact", href: "#" },
        { name: "Status", href: "#" },
        { name: "Documentation", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Privacy", href: "#" },
        { name: "Terms", href: "#" },
        { name: "Careers", href: "#" }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-blue-400 mr-3" />
              <span className="font-sans font-bold text-xl" data-testid="footer-logo">SafeViewShield</span>
            </div>
            <p className="text-gray-400 text-sm" data-testid="footer-description">
              Advanced AI protection for children's online content consumption.
            </p>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4" data-testid={`footer-section-title-${index}`}>
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href} 
                      className="hover:text-white transition-colors"
                      data-testid={`footer-link-${index}-${linkIndex}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm" data-testid="footer-copyright">
            © 2024 SafeViewShield. All rights reserved. Protecting children's online safety with advanced AI technology.
          </p>
        </div>
      </div>
    </footer>
  );
}
