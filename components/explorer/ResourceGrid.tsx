import { motion } from "framer-motion";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pb-12">
            {resources.map((resource, index) => {
                const cardHref = `/resource/${resource.slug || resource.id}`;

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
                            href={cardHref}
                            className="block h-full group"
                        >
                            <Card className="relative h-full flex flex-col overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-0 rounded-2xl shadow-sm group-hover:shadow-xl group-hover:shadow-primary/5 transition-all duration-500">
                                <div className="relative aspect-video w-full overflow-hidden">
                                    <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                                    {resource.coverImage ? (
                                        <Image
                                            src={resource.coverImage}
                                            alt={resource.title}
                                            fill
                                            className="relative z-0 object-cover brightness-90 grayscale-[0.2] transition-transform duration-700 group-hover:scale-110 group-hover:brightness-100 group-hover:grayscale-0"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-400">
                                            {resource.type === "Livro" ? (
                                                <BookOpen className="h-12 w-12 opacity-20" />
                                            ) : (
                                                <FileText className="h-12 w-12 opacity-20" />
                                            )}
                                        </div>
                                    )}
                                </div>

                                <CardHeader className="px-5 py-5 gap-1.5">
                                    <CardAction>
                                        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider px-2 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-none">
                                            {resource.type}
                                        </Badge>
                                    </CardAction>
                                    <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors line-clamp-1">
                                        {resource.title}
                                    </CardTitle>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium -mt-1">{resource.author}</p>
                                    <CardDescription className="text-xs text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed mt-1">
                                        {resource.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardFooter className="px-5 pb-5 pt-0 mt-auto">
                                    <Button variant="outline" className="w-full h-10 text-xs font-bold rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                                        Abrir recurso
                                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}
