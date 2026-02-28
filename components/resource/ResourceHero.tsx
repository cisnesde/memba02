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
        <section className="relative overflow-hidden bg-background border-b py-12 md:py-24">
            {/* Soft decorative background element */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-end">
                {/* Cover Image Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative w-64 aspect-[2/3] flex-shrink-0 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] rounded-sm overflow-hidden border bg-background group"
                >
                    {coverImage ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={coverImage}
                                alt={title}
                                fill
                                className="object-contain transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/30">
                            {type === "Livro" ? (
                                <BookOpen className="h-20 w-20 text-muted-foreground/30" />
                            ) : (
                                <FileText className="h-20 w-20 text-muted-foreground/30" />
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Content Details */}
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-wrap gap-3 justify-center md:justify-start"
                    >
                        <Badge variant={type === "Livro" ? "default" : "secondary"} className="rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm">
                            {type}
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest bg-background/50 backdrop-blur-sm">
                            {category}
                        </Badge>
                    </motion.div>

                    <div className="space-y-3">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-4xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1]"
                        >
                            {title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex flex-wrap items-center gap-8 text-muted-foreground justify-center md:justify-start pt-2"
                        >
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-primary/60 mb-1">Autor / Investigador</span>
                                <div className="flex items-center text-foreground font-semibold text-lg">
                                    <User className="w-4 h-4 mr-2 text-primary" />
                                    {author}
                                </div>
                            </div>

                            {year && (
                                <div className="flex flex-col border-l pl-8 border-muted">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-primary/60 mb-1">Ano de Edição</span>
                                    <div className="flex items-center text-foreground font-semibold text-lg">
                                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                                        {year}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
