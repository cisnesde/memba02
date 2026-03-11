"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { BookLoader } from "@/components/ui/BookLoader";
import { ResourceGrid, Resource } from "@/components/explorer/ResourceGrid";
import { Button } from "@/components/ui/button";
import { Folder, Bookmark, LayoutGrid, Plus, MoreVertical, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FolderType {
    id: string;
    name: string;
    createdAt: string;
}

export default function LibraryPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/auth/signin");
        }
    }, [session, isPending, router]);

    useEffect(() => {
        if (session) {
            fetchData();
        }
    }, [session, selectedFolderId]);

    async function fetchData() {
        setLoading(true);
        try {
            // Fetch folders
            const foldersRes = await fetch("/api/library/folders");
            if (foldersRes.ok) {
                const foldersData = await foldersRes.json();
                setFolders(foldersData);
            }

            // Fetch resources
            const url = selectedFolderId 
                ? `/api/library/resources?folderId=${selectedFolderId}` 
                : "/api/library/resources";
            const resourcesRes = await fetch(url);
            if (resourcesRes.ok) {
                const resourcesData = await resourcesRes.json();
                setResources(resourcesData);
            }
        } catch (error) {
            console.error("Error fetching library data:", error);
        } finally {
            setLoading(false);
        }
    }

    if (isPending || (loading && resources.length === 0)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                {/* Usando o BookLoader conforme solicitado */}
                <div className="flex flex-col items-center gap-8">
                    {/* Verificando o nome correto do componente na sua pasta components/ui */}
                    {/* Notei que se chama BookLoader no seu sistema */}
                    <div className="scale-125">
                        <BookLoader size="lg" />
                    </div>
                    <p className="text-muted-foreground font-medium animate-pulse">A carregar a sua biblioteca...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-primary">Minha Biblioteca</h1>
                        <p className="text-muted-foreground">Gerencie seus estudos, livros e artigos salvos.</p>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl border border-muted-foreground/10">
                        <Button 
                            variant={selectedFolderId === null ? "secondary" : "ghost"}
                            className="rounded-xl font-bold h-10 px-4"
                            onClick={() => setSelectedFolderId(null)}
                        >
                            <LayoutGrid className="w-4 h-4 mr-2" />
                            Tudo
                        </Button>
                        <Button 
                            variant={selectedFolderId === "none" ? "secondary" : "ghost"}
                            className="rounded-xl font-bold h-10 px-4"
                            onClick={() => setSelectedFolderId("none")}
                        >
                            <Bookmark className="w-4 h-4 mr-2" />
                            Sem Pasta
                        </Button>
                    </div>
                </div>

                {/* Folders Scroll */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                            <Folder className="w-4 h-4" />
                            Pastas
                        </h3>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {folders.map((folder) => (
                            <motion.div
                                key={folder.id}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant={selectedFolderId === folder.id ? "secondary" : "outline"}
                                    className={`h-24 w-40 flex-col items-start p-4 rounded-2xl border-muted/50 relative overflow-hidden group transition-all ${
                                        selectedFolderId === folder.id ? "ring-2 ring-primary/20 bg-primary/5" : ""
                                    }`}
                                    onClick={() => setSelectedFolderId(folder.id)}
                                >
                                    <Folder className={`w-6 h-6 mb-2 ${selectedFolderId === folder.id ? "text-primary" : "text-muted-foreground"}`} />
                                    <span className="font-bold text-sm truncate w-full text-left">{folder.name}</span>
                                    
                                    <div className="absolute top-2 right-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="w-3 h-3" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem className="text-destructive font-medium cursor-pointer">
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </Button>
                            </motion.div>
                        ))}
                        
                        <Button
                            variant="outline"
                            className="h-24 w-40 flex-col items-center justify-center p-4 rounded-2xl border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        >
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                                <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground group-hover:text-primary uppercase tracking-tighter">Nova Pasta</span>
                        </Button>
                    </div>
                </div>

                {/* Resources Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                            <Bookmark className="w-4 h-4" />
                            Recursos ({resources.length})
                        </h3>
                    </div>

                    <AnimatePresence mode="wait">
                        {resources.length > 0 ? (
                            <motion.div
                                key={selectedFolderId || "all"}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ResourceGrid resources={resources} />
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl border-muted/30"
                            >
                                <div className="bg-muted/50 p-6 rounded-full mb-4">
                                    <Bookmark className="w-10 h-10 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-xl font-bold">Ainda não guardou nada</h3>
                                <p className="text-muted-foreground max-w-xs mt-2">
                                    {selectedFolderId 
                                        ? "Esta pasta está vazia no momento." 
                                        : "Explore o acervo e guarde os seus recursos favoritos aqui."}
                                </p>
                                {!selectedFolderId && (
                                    <Button className="mt-6 rounded-xl font-bold px-8" onClick={() => router.push("/explorer")}>
                                        Explorar agora
                                    </Button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
