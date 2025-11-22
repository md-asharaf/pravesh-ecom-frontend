import { Wrench, Truck, ShieldCheck } from "lucide-react";

const features = [
  {
    Icon: Wrench,
    title: "Industrial Grade Quality",
    sub: "Trusted materials from certified manufacturers.",
  },
  {
    Icon: Truck,
    title: "Pan-India Delivery",
    sub: "Fast & reliable shipping for all orders.",
  },
  {
    Icon: ShieldCheck,
    title: "100% Genuine Products",
    sub: "Guaranteed authentic & verified items.",
  },
];


const iconColors = [
  "#10B981", 
  "#3B82F6",
  "#EF4444", 
];

export default function FeaturesSection() {

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-3 sm:px-4">
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 sm:mb-8">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {features.map(({title,sub,Icon}, i) => (
            <div
              key={i}
              className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <div
                className="flex-shrink-0"
                style={{ color: iconColors[i % iconColors.length] }}
              >
                <Icon className= "h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
              </div>

              <div>
                <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 dark:text-white leading-snug">
                  {title}
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-tight">
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
