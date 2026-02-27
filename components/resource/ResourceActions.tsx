"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Play,
    Heart,
    Library,
    Download,
    Share2,
    BookmarkCheck,
    ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { getCloudinaryDownloadUrl } from "@/lib/cloudinary-utils";

interface ResourceActionsProps {
    title: string;
    sourceType: string;
    fileUrl: string | null;
    externalUrl: string | null;
}

export function ResourceActions({ title, sourceType, fileUrl, externalUrl }: ResourceActionsProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [inLibrary, setInLibrary] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleLibrary = () => {
        setInLibrary(!inLibrary);
    };

    const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!fileUrl || isDownloading) return;

        setIsDownloading(true);
        try {
            // Fetch the raw file blob directly bypassing transformations
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error("Download HTTP error: " + response.status);

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.style.display = "none";
            a.href = blobUrl;

            // Generate clean filename
            const cleanTitle = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, '_');
            const ext = fileUrl.split('?')[0].split('.').pop();
            const finalExt = (ext && ext.length <= 4) ? ext : 'pdf';

            a.download = `${cleanTitle}.${finalExt}`;

            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Client-side download failed, falling back to direct link", error);
            window.open(fileUrl, '_blank');
        } finally {
            setIsDownloading(false);
        }
    };

    const actionUrl = sourceType === "upload" ? fileUrl : externalUrl;
    const isExternal = sourceType === "external_link";

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-4"
        >
            <div className="p-6 bg-card rounded-xl border shadow-sm space-y-4 sticky top-24">
                <h4 className="font-semibold text-foreground mb-4">Ações do Recurso</h4>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {actionUrl ? (
                        <Button
                            className="w-full h-12 text-lg font-semibold gap-2 shadow-lg shadow-primary/20"
                            variant="default"
                            asChild
                        >
                            <a href={actionUrl} target="_blank" rel="noopener noreferrer">
                                {isExternal ? (
                                    <>
                                        <ExternalLink className="w-5 h-5" />
                                        Abrir na Biblioteca
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5 fill-current" />
                                        Ler Online
                                    </>
                                )}
                            </a>
                        </Button>
                    ) : (
                        <Button className="w-full h-12 text-lg font-semibold gap-2 shadow-lg shadow-primary/20" variant="default" disabled>
                            <Play className="w-5 h-5 fill-current" />
                            Ler Online
                        </Button>
                    )}
                </motion.div>

                <div className="grid grid-cols-2 gap-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="outline"
                            className={`w-full gap-2 ${isFavorite ? "text-red-500 border-red-200 bg-red-50" : ""}`}
                            onClick={handleFavorite}
                        >
                            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                            Favoritar
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="outline"
                            className={`w-full gap-2 ${inLibrary ? "text-primary border-primary/20 bg-primary/5" : ""}`}
                            onClick={handleLibrary}
                        >
                            {inLibrary ? <BookmarkCheck className="w-4 h-4" /> : <Library className="w-4 h-4" />}
                            Biblioteca
                        </Button>
                    </motion.div>
                </div>

                <div className="h-px bg-border my-2" />

                {sourceType === "upload" && fileUrl && (
                    <Button
                        variant="secondary"
                        className="w-full gap-2 h-11"
                        onClick={handleDownload}
                        disabled={isDownloading}
                    >
                        {isDownloading ? (
                            <>
                                <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                Baixando...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Baixar PDF
                            </>
                        )}
                    </Button>
                )}

                <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                </Button>

                <p className="text-[10px] text-center text-muted-foreground mt-4 leading-tight">
                    Ao baixar ou ler este recurso, você concorda com os termos de uso da rede Memba.
                </p>
            </div>
        </motion.div>
    );
}
