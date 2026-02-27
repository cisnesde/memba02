"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { ResourceTable } from "@/components/admin/ResourceTable";
import { Button } from "@/components/ui/button";
import { Plus, Shield, Loader2, AlertTriangle } from "lucide-react";

export interface Resource {
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
    filePublicId: string | null;
    externalUrl: string | null;
    source: string | null;
    citations: number | null;
    pages: number | null;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function AdminPage() {
    const { data: session, isPending } = useSession();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);

    const fetchResources = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const handleCreate = () => {
        setEditingResource(null);
        setShowForm(true);
    };

    const handleEdit = (resource: Resource) => {
        setEditingResource(resource);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja deletar este recurso?")) return;

        try {
            const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
            if (res.ok) {
                setResources((prev) => prev.filter((r) => r.id !== id));
            } else {
                const data = await res.json();
                alert(data.error || "Erro ao deletar");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Erro ao deletar recurso");
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingResource(null);
        fetchResources();
    };

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Shield className="h-16 w-16 text-muted-foreground" />
                <h2 className="text-2xl font-bold">Acesso Restrito</h2>
                <p className="text-muted-foreground">Faça login para aceder ao painel admin.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Painel Admin</h1>
                        <p className="text-muted-foreground mt-1">
                            Gerencie os recursos da biblioteca Memba.
                        </p>
                    </div>
                    <Button onClick={handleCreate} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Novo Recurso
                    </Button>
                </div>

                {/* Form Dialog */}
                {showForm && (
                    <div className="mb-8 p-6 bg-card border rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">
                                {editingResource ? "Editar Recurso" : "Novo Recurso"}
                            </h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingResource(null);
                                }}
                            >
                                Cancelar
                            </Button>
                        </div>
                        <ResourceForm
                            resource={editingResource}
                            onSuccess={handleFormSuccess}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingResource(null);
                            }}
                        />
                    </div>
                )}

                {/* Resources Table */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : resources.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Nenhum recurso encontrado</h3>
                        <p className="text-muted-foreground mb-4">
                            Comece adicionando o primeiro recurso à biblioteca.
                        </p>
                        <Button onClick={handleCreate} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Adicionar Recurso
                        </Button>
                    </div>
                ) : (
                    <ResourceTable
                        resources={resources}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
}
