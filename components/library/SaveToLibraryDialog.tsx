"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Bookmark, Plus, Loader2, Check, Trash2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface Folder {
    id: string;
    name: string;
}

interface SaveToLibraryDialogProps {
    resourceId: string;
    resourceTitle: string;
    initialFolderId?: string | null;
    isSaved?: boolean;
    onSaveChange?: (isSaved: boolean, folderId?: string | null) => void;
}

export function SaveToLibraryDialog({
    resourceId,
    resourceTitle,
    initialFolderId = null,
    isSaved = false,
    onSaveChange
}: SaveToLibraryDialogProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(initialFolderId);
    const [newFolderName, setNewFolderName] = useState("");
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [loading, setLoading] = useState(false);
    const [foldersLoading, setFoldersLoading] = useState(false);
    const [internalIsSaved, setInternalIsSaved] = useState(isSaved);

    useEffect(() => {
        if (open && session) {
            fetchFolders();
            checkIfSaved();
        }
    }, [open, session]);

    async function fetchFolders() {
        setFoldersLoading(true);
        try {
            const res = await fetch("/api/library/folders");
            if (res.ok) {
                const data = await res.json();
                setFolders(data);
            }
        } catch (error) {
            console.error("Error fetching folders:", error);
        } finally {
            setFoldersLoading(false);
        }
    }

    async function checkIfSaved() {
        // Opção de API para verificar status individual
        // Se não tivermos, usamos os props iniciais
    }

    async function handleCreateFolder() {
        if (!newFolderName.trim()) return;
        setIsCreatingFolder(true);
        try {
            const res = await fetch("/api/library/folders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newFolderName }),
            });
            if (res.ok) {
                const newFolder = await res.json();
                setFolders([...folders, newFolder]);
                setSelectedFolderId(newFolder.id);
                setNewFolderName("");
                setIsCreatingFolder(false);
            }
        } catch (error) {
            console.error("Error creating folder:", error);
        } finally {
            setIsCreatingFolder(false);
        }
    }

    async function handleSave() {
        if (!session) {
            router.push("/auth/signin");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/library/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resourceId,
                    folderId: selectedFolderId === "none" ? null : selectedFolderId,
                }),
            });

            if (res.ok) {
                setInternalIsSaved(true);
                onSaveChange?.(true, selectedFolderId);
                setOpen(false);
            }
        } catch (error) {
            console.error("Error saving to library:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleRemove() {
        setLoading(true);
        try {
            const res = await fetch("/api/library/save", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resourceId }),
            });

            if (res.ok) {
                setInternalIsSaved(false);
                onSaveChange?.(false, null);
                setOpen(false);
            }
        } catch (error) {
            console.error("Error removing from library:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={internalIsSaved ? "secondary" : "outline"}
                    className="w-full h-11 rounded-xl font-bold gap-2"
                >
                    {internalIsSaved ? (
                        <>
                            <Check className="w-4 h-4" />
                            Guardado
                        </>
                    ) : (
                        <>
                            <Bookmark className="w-4 h-4" />
                            Guardar na Biblioteca
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Guardar na Biblioteca
                    </DialogTitle>
                </DialogHeader>
                
                <div className="py-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground px-1">
                            Escolha uma pasta
                        </label>
                        <div className="flex gap-2">
                            <Select
                                value={selectedFolderId || "none"}
                                onValueChange={(val) => setSelectedFolderId(val === "none" ? null : val)}
                                disabled={foldersLoading}
                            >
                                <SelectTrigger className="flex-1 h-12 rounded-xl border-muted/50">
                                    <SelectValue placeholder="Sem pasta (Geral)" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="none">Sem pasta (Geral)</SelectItem>
                                    {folders.map((folder) => (
                                        <SelectItem key={folder.id} value={folder.id}>
                                            {folder.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground px-1">
                            Ou crie uma nova pasta
                        </label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Nome da pasta..."
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                className="h-12 rounded-xl border-muted/50"
                                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="h-12 w-12 shrink-0 rounded-xl"
                                onClick={handleCreateFolder}
                                disabled={isCreatingFolder || !newFolderName.trim()}
                            >
                                {isCreatingFolder ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
                    {internalIsSaved && (
                        <Button
                            variant="ghost"
                            className="flex-1 h-12 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 font-bold"
                            onClick={handleRemove}
                            disabled={loading}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover
                        </Button>
                    )}
                    <Button
                        className="flex-1 h-12 rounded-xl font-bold"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Check className="w-4 h-4 mr-2" />
                        )}
                        {internalIsSaved ? "Atualizar" : "Confirmar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
