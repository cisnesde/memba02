import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Library, Info, BookOpen } from "lucide-react";

interface ResourceContentProps {
    description: string;
    source?: string | null;
    category: string;
}

export function ResourceContent({ description, source, category }: ResourceContentProps) {
    return (
        <div className="space-y-12">
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full md:w-auto h-12 bg-muted/30 p-1 rounded-full border">
                    <TabsTrigger value="overview" className="flex-1 md:flex-none rounded-full px-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">Sinopse</TabsTrigger>
                    <TabsTrigger value="details" className="flex-1 md:flex-none rounded-full px-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">Ficha Técnica</TabsTrigger>
                    <TabsTrigger value="reviews" className="flex-1 md:flex-none rounded-full px-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">Comentários</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <div className="relative">
                            <span className="absolute -top-10 -left-6 text-[120px] font-serif text-primary/5 select-none pointer-events-none">&quot;</span>
                            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed font-serif italic py-2 relative z-10">
                                {description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t font-sans">
                            <div className="space-y-2">
                                <h4 className="text-[10px] uppercase tracking-widest font-black text-primary">Contextualização</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Esta obra insere-se na categoria de <strong className="text-foreground">{category}</strong>, oferecendo uma perspetiva aprofundada sobre os temas abordados, sendo recohecida pela sua relevância no meio académico e literário.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] uppercase tracking-widest font-black text-primary">Fonte & Autoria</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Provindo de <strong className="text-foreground">{source || "Acervo Local Memba"}</strong>, o recurso mantém os mais altos padrões de verificação e qualidade informativa.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </TabsContent>

                <TabsContent value="details" className="mt-10">
                    <Card className="border shadow-none bg-muted/10">
                        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-background rounded-lg border shadow-sm">
                                    <Info className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Classificação</p>
                                    <p className="text-lg font-semibold text-foreground">{category}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-background rounded-lg border shadow-sm">
                                    <Library className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Repositório Originário</p>
                                    <p className="text-lg font-semibold text-foreground">{source || "Memba Local Repository"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-10">
                    <div className="py-20 text-center border rounded-2xl bg-muted/5 flex flex-col items-center">
                        <div className="h-12 w-12 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                            <Info className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                        <p className="text-muted-foreground font-medium">Ainda não há avaliações para este recurso.</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Seja o primeiro a deixar a sua opinião após a leitura.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
