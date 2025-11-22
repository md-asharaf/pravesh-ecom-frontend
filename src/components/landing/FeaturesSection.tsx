import { motion } from "framer-motion";
import { cloneElement } from "react";
import { FaTools, FaTruckMoving, FaShieldAlt } from "react-icons/fa"; // Using React Icons

// Define an array of distinct colors for the icons
const iconColors = [
    "#10B981", // Emerald Green for Tools
    "#3B82F6", // Royal Blue for Truck
    "#EF4444", // Red for Shield
];

export default function FeaturesSection() {
    const features = [
        {
            icon: <FaTools />,
            title: "Industrial Grade Quality",
            sub: "Trusted materials from certified manufacturers.",
        },
        {
            icon: <FaTruckMoving />,
            title: "Pan-India Delivery",
            sub: "Fast & reliable shipping for all orders.",
        },
        {
            icon: <FaShieldAlt />,
            title: "100% Genuine Products",
            sub: "Guaranteed authentic & verified items.",
        },
    ];

    return (
        <section className="py-8 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
                    {features.map((item, i) => (
                        <motion.div
                            key={i}
                            className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl transition-all duration-200 hover:shadow-md border border-gray-100 dark:border-gray-700"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <motion.div
                                className="flex-shrink-0" // Prevent icon from shrinking
                                style={{ color: iconColors[i % iconColors.length] }} // Apply distinct color
                                // Individual icon animations
                                animate={
                                    i === 0 // FaTools animation (subtle rotation)
                                        ? { rotate: [0, -5, 5, -5, 0] }
                                        : i === 1 // FaTruckMoving animation (simulated movement)
                                            ? {
                                                x: [0, 2, -2, 2, 0], // Slight horizontal bob
                                                y: [0, -1, 1, -1, 0], // Slight vertical bob
                                            }
                                            : i === 2 // FaShieldAlt animation (subtle pulse)
                                                ? { scale: [1, 1.05, 1] }
                                                : {}
                                }
                                transition={{
                                    duration: i === 1 ? 1.5 : 2.5, // Truck animation can be faster
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                    repeatType: "mirror",
                                }}
                            >
                                {/* Clone icon and adjust size based on screen */}
                                {cloneElement(item.icon, {
                                    className: "h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8", // Responsive icon sizing
                                })}
                            </motion.div>
                            <div>
                                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white leading-snug">
                                    {item.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-tight">
                                    {item.sub}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}