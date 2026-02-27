"use client";

import { useState, useMemo } from "react";
import { ExplorerHeader } from "@/components/explorer/ExplorerHeader";
import { CategoryFilter } from "@/components/explorer/CategoryFilter";
import { ResourceGrid, Resource } from "@/components/explorer/ResourceGrid";

// Simulated dummy data for the Acervo
const DUMMY_RESOURCES: Resource[] = [
    {
        id: "1",
        title: "A Revolução do Design Atômico",
        author: "Brad Frost",
        type: "Livro",
        category: "Tecnologia",
        description: "Uma metodologia essencial para criar sistemas de design robustos e escaláveis na era moderna da web.",
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2874&auto=format&fit=crop",
    },
    {
        id: "2",
        title: "O Padrão Singleton em TypeScript",
        author: "Alice Smith",
        type: "Artigo",
        category: "Tecnologia",
        description: "Uma análise profunda de como e quando utilizar o padrão Singleton em aplicações TypeScript de larga escala.",
    },
    {
        id: "3",
        title: "Sapiens: Uma Breve História da Humanidade",
        author: "Yuval Noah Harari",
        type: "Livro",
        category: "História",
        description: "Explore como a biologia e a história nos definiram e aprimoraram nossa compreensão do que significa ser humano.",
        coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2712&auto=format&fit=crop",
    },
    {
        id: "4",
        title: "Avanços em Computação Quântica",
        author: "Dr. Richard Feynman",
        type: "Artigo",
        category: "Ciência",
        description: "Um artigo acadêmico detalhando os recentes desdobramentos na correção de erros quânticos e suas aplicações.",
    },
    {
        id: "5",
        title: "1984",
        author: "George Orwell",
        type: "Livro",
        category: "Ficção",
        description: "O clássico distópico sobre vigilância governamental, totalitarismo e a manipulação da verdade.",
        coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop",
    },
    {
        id: "6",
        title: "Design de Interface Emocional",
        author: "Helen Chang",
        type: "Artigo",
        category: "Tecnologia",
        description: "Como construir produtos digitais que ressoam e se conectam emocionalmente com seus usuários.",
    },
    {
        id: "7",
        title: "Breves Respostas para Grandes Questões",
        author: "Stephen Hawking",
        type: "Livro",
        category: "Ciência",
        description: "As reflexões finais de um dos maiores cientistas do nosso tempo sobre as maiores questões do universo.",
    },
    {
        id: "8",
        title: "Metodologias Ágeis no Século 21",
        author: "Carlos Santana",
        type: "Artigo",
        category: "Acadêmico",
        description: "Um estudo comparativo sobre a eficácia de diferentes abordagens ágeis em startups vs grandes corporações.",
    }
];

export default function ExplorerPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("Todos");

    // Memoize the filtered resources so we don't recalculate on every render unless dependencies change
    const filteredResources = useMemo(() => {
        return DUMMY_RESOURCES.filter((resource) => {
            // 1. Filter by search query
            const matchesSearch =
                searchQuery === "" ||
                resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                resource.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchQuery.toLowerCase());

            // 2. Filter by category
            const matchesCategory =
                activeCategory === "Todos" ||
                (activeCategory === "Livros" && resource.type === "Livro") ||
                (activeCategory === "Artigos" && resource.type === "Artigo") ||
                resource.category === activeCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    return (
        <div className="min-h-screen bg-background pt-20">
            {/* Header with Background Pattern */}
            <div className="relative overflow-hidden bg-muted/20 border-b border-muted/50">
                <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:20px_20px]" />
                <div className="max-w-7xl mx-auto relative relative z-10 px-4 sm:px-6 lg:px-8">
                    <ExplorerHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                </div>
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto py-8 lg:py-12 sm:px-6 lg:px-8">
                <div className="mb-6 px-4 flex justify-between items-center text-sm text-muted-foreground">
                    <p>
                        Mostrando <strong>{filteredResources.length}</strong> {filteredResources.length === 1 ? "resultado" : "resultados"}
                        {activeCategory !== "Todos" && <span> em <strong>{activeCategory}</strong></span>}
                        {searchQuery && <span> para &quot;<strong>{searchQuery}</strong>&quot;</span>}
                    </p>
                </div>

                <ResourceGrid resources={filteredResources} />
            </main>
        </div>
    );
}
