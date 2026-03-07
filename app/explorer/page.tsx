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

                    {/* Simple Category Breadcrumb will be below */}
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
