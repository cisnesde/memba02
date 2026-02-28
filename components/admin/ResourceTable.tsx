"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    FileText,
    Upload,
    Link2,
    Pencil,
    Trash2,
    Star,
    ExternalLink,
} from "lucide-react";

interface Resource {
    id: string;
    slug: string;
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

interface ResourceTableProps {
    resources: Resource[];
    onEdit: (resource: Resource) => void;
    onDelete: (id: string) => void;
}

export function ResourceTable({ resources, onEdit, onDelete }: ResourceTableProps) {
    return (
        <div className="bg-card border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/30">
                            <th className="text-left p-4 font-medium text-muted-foreground">Recurso</th>
                            <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Tipo</th>
                            <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Categoria</th>
                            <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Fonte</th>
                            <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Data</th>
                            <th className="text-right p-4 font-medium text-muted-foreground">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.map((resource) => (
                            <tr key={resource.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium truncate max-w-[300px]">
                                                    {resource.title}
                                                </p>
                                                {resource.featured && (
                                                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-muted-foreground text-xs mt-0.5">
                                                {resource.author}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 hidden md:table-cell">
                                    <Badge variant={resource.type === "Livro" ? "default" : "secondary"} className="gap-1">
                                        {resource.type === "Livro" ? (
                                            <BookOpen className="h-3 w-3" />
                                        ) : (
                                            <FileText className="h-3 w-3" />
                                        )}
                                        {resource.type}
                                    </Badge>
                                </td>
                                <td className="p-4 hidden lg:table-cell">
                                    <span className="text-muted-foreground">{resource.category}</span>
                                </td>
                                <td className="p-4 hidden md:table-cell">
                                    <Badge variant="outline" className="gap-1">
                                        {resource.sourceType === "upload" ? (
                                            <Upload className="h-3 w-3" />
                                        ) : (
                                            <Link2 className="h-3 w-3" />
                                        )}
                                        {resource.sourceType === "upload" ? "Upload" : resource.source || "Link"}
                                    </Badge>
                                </td>
                                <td className="p-4 hidden lg:table-cell">
                                    <span className="text-muted-foreground text-xs">
                                        {new Date(resource.createdAt).toLocaleDateString("pt-BR")}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-1">
                                        {(resource.fileUrl || resource.externalUrl) && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                asChild
                                            >
                                                <a
                                                    href={resource.fileUrl || resource.externalUrl || "#"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => onEdit(resource as any)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => onDelete(resource.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
