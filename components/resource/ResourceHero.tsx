import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Calendar, User } from "lucide-react";
import Image from "next/image";
import { type ResourceType } from "../explorer/ResourceGrid";

interface ResourceHeroProps {
    title: string;
    author: string;
    type: ResourceType;
    category: string;
    year?: string | number | null;
    coverImage?: string | null;
}

export function ResourceHero({ title, author, type, category, year, coverImage }: ResourceHeroProps) {
    return (
        <section className="bg-muted/30 border-b">
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                {/* Cover Image Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-64 h-80 flex-shrink-0 shadow-2xl rounded-lg overflow-hidden border bg-background"
                >
                    {coverImage ? (
                        <Image
                            src={coverImage}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                            {type === "Livro" ? (
                                <BookOpen className="h-24 w-24 opacity-20" />
                            ) : (
                                <FileText className="h-24 w-24 opacity-20" />
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Content Details */}
                <div className="flex-1 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-wrap gap-2 justify-center md:justify-start"
                    >
                        <Badge variant={type === "Livro" ? "default" : "secondary"}>
                            {type === "Livro" ? <BookOpen className="w-3 h-3 mr-1" /> : <FileText className="w-3 h-3 mr-1" />}
                            {type}
                        </Badge>
                        <Badge variant="outline" className="bg-background">
                            {category}
                        </Badge>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-foreground"
                    >
                        {title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-wrap items-center gap-6 text-muted-foreground justify-center md:justify-start"
                    >
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            <span className="font-medium text-foreground">{author}</span>
                        </div>
                        {year && (
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>Publicado em {year}</span>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
