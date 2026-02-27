import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
    categories: string[];
    activeCategory: string;
    setActiveCategory: (category: string) => void;
}

export function CategoryFilter({ categories, activeCategory, setActiveCategory }: CategoryFilterProps) {
    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 hide-scrollbar">
            <div className="flex items-center gap-2 md:justify-center px-4 md:px-0 min-w-max">
                {categories.map((category, index) => {
                    const isActive = activeCategory === category;

                    return (
                        <motion.button
                            key={category}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border",
                                isActive
                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                    : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                            )}
                        >
                            {category}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
