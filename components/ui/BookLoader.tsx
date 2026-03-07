"use client";

import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface BookLoaderProps {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

export function BookLoader({ size = "md", className = "" }: BookLoaderProps) {
    // Standardized loader sizes (2:1 width to height for a perfect semi-circle fan)
    const sizeMap = {
        sm: { w: "w-24", h: "h-12" },
        md: { w: "w-32", h: "h-16" },
        lg: { w: "w-48", h: "h-24" },
        xl: { w: "w-64", h: "h-32" },
    };

    const d = sizeMap[size];

    return (
        <div className={`flex items-end justify-center ${className}`}>
            <div
                className={`relative flex justify-center items-end ${d.w} ${d.h}`}
            >
                {/* Book Spine (Center Bottom Hinge) */}
                <Skeleton className="absolute bottom-0 w-8 h-3 bg-zinc-800 dark:bg-zinc-950 rounded-t-full z-40" />

                {/* Left Cover (thickest, lying flat at -88 degrees) */}
                <div
                    className="absolute bottom-1 w-[4px] h-[95%] origin-bottom z-30"
                    style={{ transform: "rotateZ(-88deg)" }}
                >
                    <Skeleton className="w-full h-full bg-zinc-700 dark:bg-zinc-800 rounded-full shadow-lg" />
                </div>

                {/* Right Cover (thickest, lying flat at 88 degrees) */}
                <div
                    className="absolute bottom-1 w-[4px] h-[95%] origin-bottom z-30"
                    style={{ transform: "rotateZ(88deg)" }}
                >
                    <Skeleton className="w-full h-full bg-zinc-700 dark:bg-zinc-800 rounded-full shadow-lg" />
                </div>

                {/* Left Static Fanned Pages */}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={`left-static-${i}`}
                        className="absolute bottom-1 w-[2.5px] h-[90%] origin-bottom z-10"
                        style={{
                            transform: `rotateZ(${-85 + (i * 12)}deg)`,
                        }}
                    >
                        <Skeleton className="w-full h-full bg-zinc-300 dark:bg-zinc-700/80 rounded-t-full shadow-inner opacity-80" />
                    </div>
                ))}

                {/* Right Static Fanned Pages */}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={`right-static-${i}`}
                        className="absolute bottom-1 w-[2.5px] h-[90%] origin-bottom z-10"
                        style={{
                            transform: `rotateZ(${85 - (i * 12)}deg)`,
                        }}
                    >
                        <Skeleton className="w-full h-full bg-zinc-300 dark:bg-zinc-700/80 rounded-t-full shadow-inner opacity-80" />
                    </div>
                ))}

                {/* Animated Pages Sweeping ~180 degrees Right to Left like a breeze */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={`animated-${i}`}
                        className="absolute bottom-1 w-[3px] h-[92%] origin-bottom z-20"
                        initial={{ rotateZ: 85, opacity: 0 }}
                        animate={{
                            rotateZ: -85,
                            opacity: [0, 1, 1, 0] // Fade in as it lifts, fade out as it lands
                        }}
                        transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.25, // Sequential sweep representing the breeze
                        }}
                    >
                        <Skeleton className="w-full h-full bg-zinc-400 dark:bg-zinc-500 rounded-t-full shadow-md" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export function FullScreenLoader() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-colors duration-500"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-10"
            >
                <BookLoader size="lg" />

                {/* Skeleton placeholders for text */}
                <div className="flex flex-col items-center gap-3 text-center mt-2">
                    <Skeleton className="h-6 w-32 rounded-md" />
                    <Skeleton className="h-2 w-48 rounded-md" />
                </div>
            </motion.div>
        </motion.div>
    );
}
