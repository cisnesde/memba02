"use client";

import { use, useEffect, useState } from "react";
import { ResourceHero } from "@/components/resource/ResourceHero";
import { ResourceContent } from "@/components/resource/ResourceContent";
import { ResourceActions } from "@/components/resource/ResourceActions";
import { FileQuestion, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Resource {
    id: string;
    title: string;
    author: string;
    type: string;
    category: string;
    year: number | null;
    description: string;
    coverImage: string | null;
    sourceType: string;
    fileUrl: string | null;
    externalUrl: string | null;
    source: string | null;
    citations: number | null;
    pages: number | null;
}

export default function ResourcePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [resource, setResource] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchResource() {
            try {
                const res = await fetch(`/api/resources/${resolvedParams.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setResource(data);
                } else if (res.status === 404) {
                    setNotFound(true);
                }
            } catch (error) {
                console.error("Error fetching resource:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        }
        fetchResource();
    }, [resolvedParams.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (notFound || !resource) {
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
                        <ResourceActions
                            title={resource.title}
                            sourceType={resource.sourceType}
                            fileUrl={resource.fileUrl}
                            externalUrl={resource.externalUrl}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
