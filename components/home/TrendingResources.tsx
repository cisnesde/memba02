"use client";

import { type Variants, motion } from "framer-motion";
import { BookOpen, FileText, ExternalLink, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

interface Resource {
    id: string;
    slug: string;
    title: string;
    author: string;
    type: string;
    source: string | null;
    year: number | null;
    category: string;
    citations: number | null;
    pages: number | null;
    coverImage?: string;
    description: string;
}

interface TrendingResourcesProps {
    resources: Resource[];
}

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function TrendingResources({ resources }: TrendingResourcesProps) {
    if (resources.length === 0) {
        return null; // Don't render section if no featured resources
    }

    return (
        <section className="w-full py-16 md:py-24 bg-muted/20 border-b">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Recursos em Destaque</h2>
                        <p className="text-muted-foreground mt-2">Publicações mais acedidas recentemente na nossa rede federada.</p>
                    </div>
                    <Button variant="outline" className="hidden md:flex" asChild>
                        <Link href="/explorer">Explorar Acervo</Link>
                    </Button>
                </div>

                <motion.div
                    className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {resources.map((resource, index) => (
                        <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                        >
                            <Link href={resource.type === "Curso" ? ((resource as any).externalUrl || "#") : `/resource/${resource.slug || resource.id}`} target={resource.type === "Curso" ? "_blank" : undefined} rel={resource.type === "Curso" ? "noopener noreferrer" : undefined} className="block h-full">
                                <Card className={`h-full flex flex-col overflow-hidden group border-muted/30 hover:border-primary/50 transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] bg-card/80 backdrop-blur-sm ${resource.type === "Curso" ? 'p-1' : ''}`}>
                                    {resource.type !== "Curso" && (
                                        <CardHeader className="p-0 relative aspect-[2/3] bg-muted/10 overflow-hidden flex items-center justify-center border-b border-muted/5">
                                            {resource.coverImage ? (
                                                <div className="relative w-full h-full p-1.5 flex items-center justify-center">
                                                    <Image
                                                        src={resource.coverImage}
                                                        alt={resource.title}
                                                        fill
                                                        className="object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-secondary/10 text-secondary-foreground">
                                                    {resource.type === "Livro" ? (
                                                        <BookOpen className="h-6 w-6 opacity-20" />
                                                    ) : (
                                                        <FileText className="h-6 w-6 opacity-20" />
                                                    )}
                                                </div>
                                            )}
                                        </CardHeader>
                                    )}

                                    <CardContent className={`flex-grow p-1.5 space-y-0.5 ${resource.type === "Curso" ? 'pt-2' : 'pt-0.5'}`}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <Badge variant={resource.type === "Livro" ? "default" : "secondary"} className="h-3 px-1 text-[7px] font-bold uppercase tracking-tighter shadow-sm w-fit border-none">
                                                {resource.type}
                                            </Badge>
                                            {resource.type === "Curso" && resource.source && (
                                                <span className="text-[7px] text-muted-foreground/60 font-black italic">{resource.source}</span>
                                            )}
                                        </div>

                                        <h3 className="font-bold text-[11px] leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                            {resource.title}
                                        </h3>
                                        <p className="text-[9px] text-muted-foreground font-medium truncate opacity-70">{resource.author}</p>

                                        {resource.description && (
                                            <p className="text-[8px] text-muted-foreground line-clamp-2 mt-0.5 leading-tight opacity-50 group-hover:opacity-70 transition-opacity">
                                                {resource.description}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="mt-8 flex justify-center md:hidden">
                    <Button variant="outline" className="w-full sm:w-auto" asChild>
                        <Link href="/explorer">Explorar Acervo Completo</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
