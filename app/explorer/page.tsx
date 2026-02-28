"use client";

import { useState, useEffect, useMemo } from "react";
import { ExplorerHeader } from "@/components/explorer/ExplorerHeader";
import { CategoryFilter } from "@/components/explorer/CategoryFilter";
import { ResourceGrid, Resource } from "@/components/explorer/ResourceGrid";
import { ResourceGridSkeleton } from "@/components/explorer/ResourceSkeleton";
import { Loader2 } from "lucide-react";

export default function ExplorerPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch resources from the API with dynamic filters
    useEffect(() => {
        async function fetchResources() {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (searchQuery) params.append("search", searchQuery);
                if (activeCategory !== "Todos") params.append("category", activeCategory);

                const res = await fetch(`/api/resources?${params.toString()}`);
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

        // Add a small debounce to search
        const debounce = setTimeout(() => {
            fetchResources();
        }, 300);

        return () => clearTimeout(debounce);
    }, [searchQuery, activeCategory]);

    // Build dynamic categories from actual data
    const categories = useMemo(() => {
        const cats = new Set<string>();
        resources.forEach((r) => cats.add(r.category));
        return ["Todos", "Livros", "Artigos", ...Array.from(cats).sort()];
    }, [resources]);

    // Since we now filter API-side, filteredResources is just the resources returned by the API
    const filteredResources = resources;

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pt-20">
            {/* Search Header */}
            <div className="bg-white dark:bg-zinc-950 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
                    <ExplorerHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>
            </div>

            {/* Results Info & Specific Filters (edX Style) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="space-y-6">
                    {/* Active Search Summary */}
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                            {loading ? (
                                <span className="animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-lg inline-block w-48 h-10" />
                            ) : (
                                <>
                                    {filteredResources.length} resultados para "{searchQuery || activeCategory}"
                                </>
                            )}
                        </h1>
                    </div>

                    {/* Filter Chips Layer (edX Style) */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-bold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap">
                            <span className="h-4 w-4 border-2 border-t-transparent animate-spin hidden" />
                            All filters
                        </button>
                        {["Subject", "Skills", "Educador", "Nível", "Idioma", "Parceiro"].map((filter) => (
                            <button
                                key={filter}
                                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-sm hover:border-zinc-400 dark:hover:border-zinc-600 transition-all whitespace-nowrap group"
                            >
                                {filter}
                                <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Category Breadcrumb (Original Filter logic preserved) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
                <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                />
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                {loading ? (
                    <ResourceGridSkeleton count={24} />
                ) : (
                    <ResourceGrid resources={filteredResources} />
                )}
            </main>
        </div>
    );
}
