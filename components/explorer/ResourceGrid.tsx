import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type ResourceType = "Livro" | "Artigo";

export interface Resource {
    id: string;
    title: string;
    author: string;
    type: ResourceType;
    category: string;
    coverImage?: string;
    description: string;
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
            {resources.map((resource, index) => (
                <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                >
                    <Card className="h-full flex flex-col overflow-hidden group border-muted/50 hover:border-primary/30 transition-colors shadow-sm hover:shadow-md">
                        <CardHeader className="p-0 relative aspect-[4/3] bg-muted overflow-hidden flex items-center justify-center">
                            {resource.coverImage ? (
                                <Image
                                    src={resource.coverImage}
                                    alt={resource.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-secondary/30 text-secondary-foreground">
                                    {resource.type === "Livro" ? (
                                        <BookOpen className="h-16 w-16 opacity-20" />
                                    ) : (
                                        <FileText className="h-16 w-16 opacity-20" />
                                    )}
                                </div>
                            )}
                            <div className="absolute top-3 left-3 flex gap-2">
                                <Badge variant={resource.type === "Livro" ? "default" : "secondary"} className="shadow-sm">
                                    {resource.type === "Livro" ? (
                                        <BookOpen className="w-3 h-3 mr-1" />
                                    ) : (
                                        <FileText className="w-3 h-3 mr-1" />
                                    )}
                                    {resource.type}
                                </Badge>
                                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-border/50 text-foreground shadow-sm hover:bg-background">
                                    {resource.category}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow p-5">
                            <h3 className="font-semibold text-lg line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                                {resource.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">{resource.author}</p>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {resource.description}
                            </p>
                        </CardContent>
                        <CardFooter className="p-5 pt-0 mt-auto">
                            <Button variant="ghost" className="w-full justify-between hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/10 transition-colors" asChild>
                                <Link href={`/resource/${resource.id}`}>
                                    Ver Detalhes
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
