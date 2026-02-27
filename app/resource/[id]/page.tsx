"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { ResourceHero } from "@/components/resource/ResourceHero";
import { ResourceContent } from "@/components/resource/ResourceContent";
import { ResourceActions } from "@/components/resource/ResourceActions";
import { FileQuestion } from "lucide-react"; // Fallback icon
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Same dummy data for demo purposes - in a real app this would be a fetch
const ALL_RESOURCES = [
    {
        id: "1",
        title: "A Revolução do Design Atômico",
        author: "Brad Frost",
        type: "Livro",
        category: "Tecnologia",
        year: 2013,
        description: "Uma metodologia essencial para criar sistemas de design robustos e escaláveis na era moderna da web. O Atomic Design permite que você construa designs de baixo para cima, de átomos a organismos.",
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2874&auto=format&fit=crop",
        source: "Memba Global Repository"
    },
    {
        id: "2",
        title: "O Padrão Singleton em TypeScript",
        author: "Alice Smith",
        type: "Artigo",
        category: "Tecnologia",
        year: 2024,
        description: "Uma análise profunda de como e quando utilizar o padrão Singleton em aplicações TypeScript de larga escala, abordando os problemas comuns e as melhores práticas de implementação.",
        source: "Directory of Open Access Journals"
    },
    {
        id: "3",
        title: "Sapiens: Uma Breve História da Humanidade",
        author: "Yuval Noah Harari",
        type: "Livro",
        category: "História",
        year: 2011,
        description: "Explore como a biologia e a história nos definiram e aprimoraram nossa compreensão do que significa ser humano. O livro detalha a jornada da nossa espécie desde a pré-história até o presente.",
        coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2712&auto=format&fit=crop",
        source: "Open Library"
    },
    {
        id: "r1", title: "The impact of artificial intelligence on modern healthcare", author: "Silva, M., & Johnson, A.", type: "Artigo", category: "Medicina", year: 2023, description: "Este artigo acadêmico explora como a inteligência artificial está transformando o diagnóstico e o tratamento hospitalar.", source: "DOAJ"
    },
    {
        id: "r2", title: "Introduction to Quantum Computing Algorithms", author: "Nielsen, M. A.", type: "Livro", category: "Computer Science", year: 2021, description: "Um guia fundamental para entender os fundamentos matemáticos e algorítmicos da computação quântica moderna.", coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop", source: "Memba Local Repository"
    }
];

export default function ResourcePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const resource = ALL_RESOURCES.find(r => r.id === resolvedParams.id);

    if (!resource) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Recurso não encontrado</h2>
                <p className="text-muted-foreground mb-6">Desculpe, não conseguimos localizar a obra solicitada.</p>
                <Button asChild>
                    <Link href="/explorer">Voltar ao Explorer</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Back Button */}
            <div className="bg-muted/30 pt-24 pb-4 border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
                        <Link href="/explorer">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar aos resultados
                        </Link>
                    </Button>
                </div>
            </div>

            <ResourceHero
                title={resource.title}
                author={resource.author}
                type={resource.type as any}
                category={resource.category}
                year={resource.year}
                coverImage={resource.coverImage}
            />

            <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content (Synopsis, etc) */}
                    <div className="lg:col-span-2">
                        <ResourceContent
                            description={resource.description}
                            category={resource.category}
                            source={resource.source}
                        />
                    </div>

                    {/* Sidebar Actions */}
                    <div className="lg:col-span-1">
                        <ResourceActions />
                    </div>
                </div>
            </main>
        </div>
    );
}
