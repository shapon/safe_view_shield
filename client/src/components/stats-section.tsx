export default function StatsSection() {
  const stats = [
    { value: "99.7%", label: "Detection Accuracy" },
    { value: "50K+", label: "Protected Families" },
    { value: "240%", label: "YoY Growth in Need" },
    { value: "<1s", label: "Detection Speed" }
  ];

  return (
    <section className="py-16 bg-white" data-testid="section-stats">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} data-testid={`stat-item-${index}`}>
              <div className="text-3xl font-bold text-primary-500 mb-2" data-testid={`stat-value-${index}`}>
                {stat.value}
              </div>
              <div className="text-gray-600" data-testid={`stat-label-${index}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
