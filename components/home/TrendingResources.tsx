"use client";

import { type Variants, motion } from "framer-motion";
import { BookOpen, FileText, ExternalLink, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Placeholder data covering both books and articles
const TRENDING_RESOURCES = [
    {
        id: "r1",
        title: "The impact of artificial intelligence on modern healthcare",
        authors: "Silva, M., & Johnson, A.",
        type: "Article",
        source: "Directory of Open Access Journals",
        year: 2023,
        category: "Medicine",
        citations: 142
    },
    {
        id: "r2",
        title: "Introduction to Quantum Computing Algorithms",
        authors: "Nielsen, M. A.",
        type: "Book",
        source: "Memba Local Repository",
        year: 2021,
        category: "Computer Science",
        pages: 420
    },
    {
        id: "r3",
        title: "Sustainable Urban Architectures: A Review",
        authors: "Chen, H., et al.",
        type: "Review Paper",
        source: "SciELO",
        year: 2024,
        category: "Architecture",
        citations: 56
    },
    {
        id: "r4",
        title: "Macroeconomics and the Global Market",
        authors: "Krugman, P.",
        type: "Book",
        source: "Open Library",
        year: 2018,
        category: "Economics",
        pages: 650
    }
];

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

export function TrendingResources() {
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
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {TRENDING_RESOURCES.map((resource) => (
                        <motion.div key={resource.id} variants={item} className="h-full">
                            <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md hover:border-primary/50">
                                <CardHeader className="p-5 pb-0 flex flex-row items-start justify-between">
                                    <Badge variant={resource.type === "Book" ? "default" : "secondary"} className="mb-2">
                                        {resource.type === "Book" ? <BookOpen className="h-3 w-3 mr-1" /> : <FileText className="h-3 w-3 mr-1" />}
                                        {resource.type}
                                    </Badge>
                                    <span className="text-xs font-semibold text-muted-foreground px-2 py-1 bg-muted rounded-md shrink-0">
                                        {resource.category}
                                    </span>
                                </CardHeader>
                                <CardContent className="flex-1 p-5 pt-3">
                                    <h3 className="font-bold text-lg leading-snug line-clamp-3 mb-2" title={resource.title}>
                                        {resource.title}
                                    </h3>
                                    <p className="text-sm text-foreground/80 mb-1">{resource.authors}</p>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-3">
                                        <span className="flex items-center">
                                            <Library className="h-3 w-3 mr-1" /> {resource.source}
                                        </span>
                                        <span>• {resource.year}</span>
                                        {resource.citations && <span className="text-primary font-medium">• {resource.citations} citações</span>}
                                    </div>
                                </CardContent>
                                <CardFooter className="p-5 pt-0 mt-auto border-t">
                                    <Button variant="ghost" className="w-full justify-between text-sm group" asChild>
                                        <Link href={`/resource/${resource.id}`}>
                                            Aceder ao Recurso
                                            <ExternalLink className="h-4 w-4 ml-2 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
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
