import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Finally, peace of mind when my kids are watching videos online. The AI detection caught things I never would have noticed.",
      author: "Sarah M., Mother of 2",
      rating: 5
    },
    {
      quote: "As a teacher, SafeViewShield has been essential for protecting our students during computer lab time. The reporting features are excellent.",
      author: "Michael R., Elementary Teacher", 
      rating: 5
    },
    {
      quote: "The technology is impressive - it catches subtle inappropriate content that other filters miss completely. Worth every penny.",
      author: "Jennifer K., Parent & Tech Professional",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white" data-testid="section-testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-gray-900 mb-4" data-testid="heading-testimonials">
            Trusted by Parents Everywhere
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl" data-testid={`testimonial-${index}`}>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400" data-testid={`rating-${index}`}>
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4" data-testid={`quote-${index}`}>
                "{testimonial.quote}"
              </p>
              <div className="font-medium text-gray-900" data-testid={`author-${index}`}>
                {testimonial.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
