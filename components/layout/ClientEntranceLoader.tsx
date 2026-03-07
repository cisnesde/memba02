"use client";

import { useState, useEffect } from "react";
import { FullScreenLoader } from "../ui/BookLoader";
import { AnimatePresence } from "framer-motion";

export function ClientEntranceLoader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Force show the loader for at least 1.8s to give a premium feel
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && <FullScreenLoader key="entrance-loader" />}
        </AnimatePresence>
    );
}
