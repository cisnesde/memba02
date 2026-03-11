"use client";

import { motion } from "framer-motion";
import { Search, Book, FileText, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function HeroSection() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [resourceType, setResourceType] = useState("all");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const params = new URLSearchParams();
            params.append("search", searchQuery.trim());
            if (resourceType !== "all") {
                // Map the tabs to categories/types as expected by the API
                const typeMap: Record<string, string> = {
                    "books": "Livros",
                    "articles": "Artigos"
                };
                params.append("category", typeMap[resourceType] || resourceType);
            }
            router.push(`/explorer?${params.toString()}`);
        }
    };

    return (
        <section className="relative w-full bg-background pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col items-center border-b">
            <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center">

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4 max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none ring-2 ring-transparent bg-secondary text-secondary-foreground mb-6">
                        <Library className="mr-2 h-3 w-3" />
                        Meta-Motor de Pesquisa Académica e Literária
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground">
                        Acesso Global ao <br className="hidden sm:block" />
                        <span className="text-primary">Conhecimento Científico</span>
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg lg:text-xl">
                        Pesquise simultaneamente em múltiplas bibliotecas virtuais, repositórios universitários e no nosso acervo local. Milhões de livros, artigos e teses num só lugar.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full max-w-2xl mt-12"
                >
                    <Tabs defaultValue="all" onValueChange={setResourceType} className="w-full flex flex-col items-center">
                        <TabsList className="mb-4 grid w-full max-w-[400px] grid-cols-3">
                            <TabsTrigger value="all" className="text-xs sm:text-sm">Todos</TabsTrigger>
                            <TabsTrigger value="books" className="text-xs sm:text-sm">
                                <Book className="mr-2 h-4 w-4 hidden sm:block" /> Livros
                            </TabsTrigger>
                            <TabsTrigger value="articles" className="text-xs sm:text-sm">
                                <FileText className="mr-2 h-4 w-4 hidden sm:block" /> Artigos
                            </TabsTrigger>
                        </TabsList>

                        <form onSubmit={handleSearch} className="relative w-full shadow-sm">
                            <div className="relative flex items-center w-full">
                                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Pesquisar por título, autor, DOI ou palavras-chave..."
                                    className="h-16 w-full rounded-lg bg-background pl-12 pr-32 text-base md:text-lg border-2 border-muted-foreground/20 focus-visible:ring-primary focus-visible:border-primary transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="absolute right-2 h-12 rounded-md px-8 text-base font-medium"
                                >
                                    Pesquisar
                                </Button>
                            </div>
                        </form>
                    </Tabs>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <span className="font-medium mr-2">Tópicos Recentes:</span>
                        {["Inteligência Artificial", "Sustentabilidade", "Medicina Moderna", "Economia Circular"].map((tag) => (
                            <span key={tag} className="hover:text-primary hover:underline cursor-pointer transition-colors" onClick={() => router.push(`/explorer?search=${encodeURIComponent(tag)}`)}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
