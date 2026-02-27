"use client";

import { useState, useEffect, useMemo } from "react";
import { ExplorerHeader } from "@/components/explorer/ExplorerHeader";
import { CategoryFilter } from "@/components/explorer/CategoryFilter";
import { ResourceGrid, Resource } from "@/components/explorer/ResourceGrid";
import { Loader2 } from "lucide-react";

export default function ExplorerPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch resources from the API
    useEffect(() => {
        async function fetchResources() {
            try {
                setLoading(true);
                const res = await fetch("/api/resources");
                if (res.ok) {
                    const data = await res.json();
                    setResources(data);
                }
            } catch (error) {
                console.error("Error fetching resources:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchResources();
    }, []);

    // Build dynamic categories from actual data
    const categories = useMemo(() => {
        const cats = new Set<string>();
        resources.forEach((r) => cats.add(r.category));
        return ["Todos", "Livros", "Artigos", ...Array.from(cats).sort()];
    }, [resources]);

    // Filter resources client-side for instant feedback
    const filteredResources = useMemo(() => {
        return resources.filter((resource) => {
            const matchesSearch =
                searchQuery === "" ||
                resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                resource.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                activeCategory === "Todos" ||
                (activeCategory === "Livros" && resource.type === "Livro") ||
                (activeCategory === "Artigos" && resource.type === "Artigo") ||
                resource.category === activeCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory, resources]);

    return (
        <div className="min-h-screen bg-background pt-20">
            {/* Header with Background Pattern */}
            <div className="relative overflow-hidden bg-muted/20 border-b border-muted/50">
                <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:20px_20px]" />
                <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
                    <ExplorerHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <CategoryFilter
                        categories={categories}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                    />
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

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <ResourceGrid resources={filteredResources} />
                )}
            </main>
        </div>
    );
}
