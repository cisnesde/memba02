"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Search, ArrowRight, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-2xl relative z-10"
            >
                <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-primary/10 border border-primary/20 mb-8">
                    <BookOpen className="h-12 w-12 text-primary" />
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-4">404</h1>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Página Não Encontrada</h2>
                <p className="text-muted-foreground text-lg mb-12">
                    Parece que o livro que procuras não está nesta prateleira. <br className="hidden md:block" />
                    Experimenta pesquisar no nosso acervo global.
                </p>

                <div className="w-full max-w-md mx-auto mb-16">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            type="text"
                            placeholder="Pesquisar livros, artigos..."
                            className="h-14 pl-12 pr-4 rounded-full border-muted-foreground/20 bg-background/50 backdrop-blur-md focus-visible:ring-primary shadow-lg"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button size="lg" className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20" asChild>
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Voltar ao Ínicio
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full px-8 h-12 font-bold border-muted-foreground/20 hover:bg-muted/50" asChild>
                        <Link href="/explorer">
                            Explorar Acervo
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </motion.div>

            {/* Suggested books section (Mock) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-24 w-full max-w-4xl"
            >
                <div className="flex items-center justify-between mb-8 px-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary/60">Sugestões de Leitura</h3>
                    <div className="h-px flex-1 bg-muted mx-6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {["O Império da Ciência", "A Era da Inteligência", "Geopolítica Moderna"].map((item, i) => (
                        <Card key={item} className="bg-card/40 backdrop-blur-sm border-muted/30 hover:border-primary/50 transition-all cursor-pointer group">
                            <CardContent className="p-6">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2 block">Destaque</span>
                                <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{item}</h4>
                                <div className="mt-4 flex items-center text-xs font-semibold text-primary">
                                    Ler agora <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
