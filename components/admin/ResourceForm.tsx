"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Upload,
    Link2,
    Loader2,
    FileUp,
    CheckCircle,
    Star,
} from "lucide-react";

interface ResourceFormData {
    title: string;
    author: string;
    type: string;
    category: string;
    year: string;
    description: string;
    coverImage: string;
    sourceType: "upload" | "external_link";
    fileUrl: string;
    filePublicId: string;
    externalUrl: string;
    source: string;
    citations: string;
    pages: string;
    featured: boolean;
}

interface ResourceFormProps {
    resource?: {
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
    } | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const RESOURCE_TYPES = ["Livro", "Artigo", "Review Paper", "Tese", "Monografia", "Curso"];
const CATEGORIES = [
    "Tecnologia",
    "Medicina",
    "Ciência",
    "História",
    "Ficção",
    "Acadêmico",
    "Economia",
    "Arquitectura",
    "Computer Science",
    "Outro",
];

export function ResourceForm({ resource, onSuccess, onCancel }: ResourceFormProps) {
    const [form, setForm] = useState<ResourceFormData>({
        title: resource?.title || "",
        author: resource?.author || "",
        type: resource?.type || "Artigo",
        category: resource?.category || "Tecnologia",
        year: resource?.year?.toString() || "",
        description: resource?.description || "",
        coverImage: resource?.coverImage || "",
        sourceType: (resource?.sourceType as "upload" | "external_link") || "upload",
        fileUrl: resource?.fileUrl || "",
        filePublicId: resource?.filePublicId || "",
        externalUrl: resource?.externalUrl || "",
        source: resource?.source || "",
        citations: resource?.citations?.toString() || "",
        pages: resource?.pages?.toString() || "",
        featured: resource?.featured || false,
    });

    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadedFileName(file.name);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", "memba/resources");

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Upload failed");
            }

            const data = await res.json();
            setForm((prev) => ({
                ...prev,
                fileUrl: data.url,
                filePublicId: data.publicId,
            }));
        } catch (error) {
            console.error("Upload error:", error);
            alert("Erro no upload: " + (error instanceof Error ? error.message : "Unknown"));
            setUploadedFileName("");
        } finally {
            setUploading(false);
        }
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", "memba/covers");

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Cover upload failed");

            const data = await res.json();
            setForm((prev) => ({ ...prev, coverImage: data.url }));
        } catch (error) {
            console.error("Cover upload error:", error);
            alert("Erro no upload da capa");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                title: form.title,
                author: form.author,
                type: form.type,
                category: form.category,
                year: form.year ? parseInt(form.year) : null,
                description: form.description,
                coverImage: form.coverImage || null,
                sourceType: form.sourceType,
                fileUrl: form.fileUrl || null,
                filePublicId: form.filePublicId || null,
                externalUrl: form.externalUrl || null,
                source: form.source || null,
                citations: form.citations ? parseInt(form.citations) : null,
                pages: form.pages ? parseInt(form.pages) : null,
                featured: form.featured,
            };

            const url = resource ? `/api/resources/${resource.id}` : "/api/resources";
            const method = resource ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save");
            }

            onSuccess();
        } catch (error) {
            console.error("Save error:", error);
            alert("Erro ao salvar: " + (error instanceof Error ? error.message : "Unknown"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Source Type Toggle */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tipo de Fonte</label>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, sourceType: "upload" }))}
                        className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${form.sourceType === "upload"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-muted hover:border-muted-foreground/30 text-muted-foreground"
                            }`}
                    >
                        <Upload className="h-5 w-5" />
                        <div className="text-left">
                            <p className="font-medium text-sm">Upload de Ficheiro</p>
                            <p className="text-xs opacity-70">PDF, DOC, imagem</p>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, sourceType: "external_link" }))}
                        className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${form.sourceType === "external_link"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-muted hover:border-muted-foreground/30 text-muted-foreground"
                            }`}
                    >
                        <Link2 className="h-5 w-5" />
                        <div className="text-left">
                            <p className="font-medium text-sm">Link Externo</p>
                            <p className="text-xs opacity-70">Outra biblioteca</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Título *</label>
                    <Input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Título do recurso"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Autor *</label>
                    <Input
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        placeholder="Nome do autor"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo *</label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                    >
                        {RESOURCE_TYPES.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Categoria *</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Ano</label>
                    <Input
                        name="year"
                        type="number"
                        value={form.year}
                        onChange={handleChange}
                        placeholder="2024"
                    />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Descrição *</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Breve descrição do recurso..."
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y min-h-[100px]"
                    required
                />
            </div>

            {/* Source-specific fields */}
            {form.sourceType === "upload" ? (
                <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-dashed">
                    <h3 className="font-medium flex items-center gap-2">
                        <FileUp className="h-4 w-4" />
                        Upload do Ficheiro
                    </h3>
                    {form.fileUrl ? (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>Ficheiro enviado: {uploadedFileName || "ficheiro existente"}</span>
                            <a
                                href={form.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline ml-2"
                            >
                                Ver
                            </a>
                        </div>
                    ) : null}
                    <div className="flex items-center gap-4">
                        <label className="flex-1">
                            <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                                {uploading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Upload className="h-5 w-5 text-muted-foreground" />
                                )}
                                <span className="text-sm text-muted-foreground">
                                    {uploading ? "Enviando..." : "Escolher ficheiro"}
                                </span>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.epub,.jpg,.jpeg,.png,.webp"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-dashed">
                    <h3 className="font-medium flex items-center gap-2">
                        <Link2 className="h-4 w-4" />
                        Link Externo
                    </h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">URL do recurso *</label>
                        <Input
                            name="externalUrl"
                            value={form.externalUrl}
                            onChange={handleChange}
                            placeholder="https://biblioteca.exemplo.com/recurso/123"
                            required={form.sourceType === "external_link"}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nome da Biblioteca/Fonte</label>
                        <Input
                            name="source"
                            value={form.source}
                            onChange={handleChange}
                            placeholder="ex: DOAJ, Open Library, SciELO"
                        />
                    </div>
                </div>
            )}

            {/* Cover Image */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Imagem de Capa</label>
                <div className="flex items-center gap-4">
                    <Input
                        name="coverImage"
                        value={form.coverImage}
                        onChange={handleChange}
                        placeholder="URL da imagem ou faça upload"
                        className="flex-1"
                    />
                    <label className="shrink-0">
                        <div className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-all text-sm">
                            {uploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Upload className="h-4 w-4" />
                            )}
                            Upload
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleCoverUpload}
                            disabled={uploading}
                        />
                    </label>
                </div>
                {form.coverImage && (
                    <div className="mt-2">
                        <img
                            src={form.coverImage}
                            alt="Preview"
                            className="h-24 w-auto rounded-md border object-cover"
                        />
                    </div>
                )}
            </div>

            {/* Extra fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Citações</label>
                    <Input
                        name="citations"
                        type="number"
                        value={form.citations}
                        onChange={handleChange}
                        placeholder="Nº de citações"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Páginas</label>
                    <Input
                        name="pages"
                        type="number"
                        value={form.pages}
                        onChange={handleChange}
                        placeholder="Nº de páginas"
                    />
                </div>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, featured: !prev.featured }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.featured ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.featured ? "translate-x-6" : "translate-x-1"
                            }`}
                    />
                </button>
                <div className="flex items-center gap-2">
                    <Star className={`h-4 w-4 ${form.featured ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium">Destacar na página inicial</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={saving || uploading} className="gap-2">
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {resource ? "Atualizar" : "Criar Recurso"}
                </Button>
            </div>
        </form>
    );
}
