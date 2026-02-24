"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useState } from "react"

export default function DashboardPage() {
    const [query, setQuery] = useState("")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // A integração da pesquisa real pode ser feita aqui.
        console.log("A pesquisar por:", query)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-3xl mx-auto px-4">
            <div className="flex flex-col items-center w-full space-y-8 animate-in fade-in zoom-in duration-500">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent pb-2">
                    Do que precisa de saber hoje?
                </h1>
                <p className="text-muted-foreground text-center max-w-xl text-lg">
                    Pesquise por documentos académicos, artigos, ou referências no nosso repositório.
                </p>

                <form onSubmit={handleSearch} className="w-full relative group">
                    <div className="relative flex items-center shadow-sm rounded-full bg-background border border-input focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all duration-300">
                        <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Pesquise por um termo, autor, ou tema..."
                            className="w-full rounded-full border-0 bg-transparent pl-12 pr-24 py-6 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                        />
                        <Button
                            type="submit"
                            className="absolute right-2 rounded-full px-6 transition-all duration-300 group-hover:bg-primary/90"
                            disabled={!query.trim()}
                        >
                            Procurar
                        </Button>
                    </div>
                </form>

                <div className="pt-8 flex gap-4 flex-wrap justify-center">
                    <Button variant="outline" className="rounded-full text-muted-foreground">Neurociência</Button>
                    <Button variant="outline" className="rounded-full text-muted-foreground">Física Quântica</Button>
                    <Button variant="outline" className="rounded-full text-muted-foreground">Inteligência Artificial</Button>
                    <Button variant="outline" className="rounded-full text-muted-foreground">Biologia Celular</Button>
                </div>
            </div>
        </div>
    )
}
