import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type ResourceType = "Livro" | "Artigo" | "Curso";

export interface Resource {
    id: string;
    slug: string;
    title: string;
    author: string;
    type: ResourceType;
    category: string;
    coverImage?: string;
    description: string;
    externalUrl?: string; // Links diretos para cursos externos
}

interface ResourceGridProps {
    resources: Resource[];
}

export function ResourceGrid({ resources }: ResourceGridProps) {
    if (resources.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center px-4"
            >
                <div className="bg-muted/30 p-6 rounded-full mb-4">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
                <p className="text-muted-foreground max-w-md">
                    Não conseguimos encontrar nenhum livro ou artigo correspondente à sua busca. Tente alterar os filtros ou o termo pesquisado.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 px-4 pb-12">
            {resources.map((index_res, index) => {
                const resource = index_res as any;
                const isCourse = resource.type === "Curso";
                const isExternalCourse = isCourse && resource.externalUrl;
                const cardHref = isExternalCourse ? resource.externalUrl : `/resource/${resource.slug || resource.id}`;
                const target = isExternalCourse ? "_blank" : undefined;
                const rel = isExternalCourse ? "noopener noreferrer" : undefined;
                const credentialType = resource.credentialType;

                return (
                    <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        whileHover={{ y: -6 }}
                        className="h-full"
                    >
                        <Link
                            href={cardHref || "#"}
                            target={target}
                            rel={rel}
                            className="block h-full group"
                        >
                            <Card className={`h-full flex flex-col overflow-hidden border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.06)] transition-all duration-500 bg-white dark:bg-zinc-900 p-3 rounded-2xl ${isCourse ? 'border border-zinc-100 dark:border-zinc-800' : ''}`}>
                                {!isCourse && (
                                    <CardHeader className="p-0 relative aspect-[2/3] bg-zinc-100 dark:bg-zinc-800/80 overflow-hidden flex items-center justify-center rounded-xl mb-3 shadow-sm border border-black/5 dark:border-white/5">
                                        {resource.coverImage ? (
                                            <div className="relative w-full h-full bg-zinc-200 dark:bg-zinc-800">
                                                <Image
                                                    src={resource.coverImage}
                                                    alt={resource.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                {resource.type === "Livro" ? (
                                                    <BookOpen className="h-8 w-8 opacity-10" />
                                                ) : (
                                                    <FileText className="h-8 w-8 opacity-10" />
                                                )}
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2 z-20">
                                            <Badge className="bg-black/80 dark:bg-white/80 text-white dark:text-black text-[7px] font-black uppercase tracking-tighter px-1.5 h-4 rounded-md shadow-md border-none w-fit">
                                                {resource.type}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                )}

                                <CardContent className={`flex-grow p-0 space-y-2 pb-1 ${isCourse ? 'pt-2' : ''}`}>
                                    {isCourse && (
                                        <div className="flex items-center justify-between mb-3">
                                            <Badge className="bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-widest px-2 h-4 rounded-full border-none">
                                                {resource.type}
                                            </Badge>
                                            {credentialType && (
                                                <span className="text-[8px] text-zinc-400 font-black uppercase tracking-tighter">
                                                    {credentialType}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <h3 className={`font-bold leading-tight text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors line-clamp-2 ${isCourse ? 'text-[14px]' : 'text-[13px]'}`}>
                                            {resource.title}
                                        </h3>
                                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium truncate">{resource.author}</p>
                                    </div>

                                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 line-clamp-3 leading-snug">
                                        {resource.description}
                                    </p>
                                </CardContent>

                                <CardFooter className="p-0 pt-3 flex justify-between items-center border-t border-zinc-50 dark:border-zinc-800/50 mt-auto">
                                    <span className="text-[9px] font-bold text-primary flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                                        {isExternalCourse ? "Ver curso oficial" : "Abrir recurso"}
                                        <ArrowRight className="h-2.5 w-2.5" />
                                    </span>
                                    {isCourse && (
                                        <span className="text-[9px] text-zinc-300 dark:text-zinc-600 font-bold italic">
                                            {resource.source}
                                        </span>
                                    )}
                                </CardFooter>
                            </Card>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}
