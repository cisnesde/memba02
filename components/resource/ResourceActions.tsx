"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Download,
    Share2,
    Bookmark,
    ExternalLink,
    Shield,
    FileText,
    BookOpen
} from "lucide-react";
import { useState } from "react";

interface ResourceActionsProps {
    title: string;
    sourceType: string;
    fileUrl: string | null;
    externalUrl: string | null;
}

export function ResourceActions({ title, sourceType, fileUrl, externalUrl }: ResourceActionsProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const isLocal = sourceType === "upload";

    const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!fileUrl || isDownloading) return;

        // If it's a simple link, we let it be. But for Cloudinary we might want to ensure download.
        // For now, let the default anchor behavior work or use the sophisticated blob-fetching logic if needed.
    };

    const actionUrl = isLocal ? fileUrl : externalUrl;

    return (
        <Card className="sticky top-24 border shadow-xl bg-background/50 backdrop-blur-md overflow-hidden p-0">
            <CardContent className="p-6 md:p-8 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-1 bg-primary rounded-full" />
                        <h3 className="text-xs uppercase tracking-[0.2em] font-black text-primary">Acesso ao Documento</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Escolha como deseja aceder a esta obra. Recursos verificados disponíveis para leitura imediata.
                    </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                    {actionUrl ? (
                        <Button className="w-full h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all gap-3 overflow-hidden group relative" asChild>
                            <a href={actionUrl} target="_blank" rel="noopener noreferrer">
                                <span className="relative z-10 flex items-center gap-3">
                                    {isLocal ? <Download className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
                                    {isLocal ? "Descarregar PDF" : "Aceder Fonte"}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transition-transform group-hover:scale-105" />
                            </a>
                        </Button>
                    ) : (
                        <Button className="w-full h-14 text-base font-bold rounded-xl gap-3" disabled>
                            Indisponível
                        </Button>
                    )}

                    <Button variant="outline" className="w-full h-14 text-base font-bold rounded-xl hover:bg-muted/50 transition-all gap-3 border-muted-foreground/20">
                        <Share2 className="w-5 h-5 text-muted-foreground" />
                        Partilhar Recurso
                    </Button>
                    <Button variant="ghost" className="w-full h-12 text-sm font-semibold rounded-xl text-muted-foreground hover:text-foreground gap-3 hover:bg-primary/5">
                        <Bookmark className="w-4 h-4" />
                        Guardar na Biblioteca
                    </Button>
                </div>

                <div className="pt-6 border-t mt-4 space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        <span>Estado</span>
                        <div className="flex items-center gap-2 text-green-600">
                            <Shield className="w-3 h-3" />
                            Verificado
                        </div>
                    </div>
                    <div className="flex items-center justify-center p-3 rounded-lg bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Ligação Segura SSL
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
