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
        <div className="space-y-8">
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full md:w-auto h-12 bg-muted/50 p-1">
                    <TabsTrigger value="overview" className="flex-1 md:flex-none">Sinopse</TabsTrigger>
                    <TabsTrigger value="details" className="flex-1 md:flex-none">Detalhes Técnicos</TabsTrigger>
                    <TabsTrigger value="reviews" className="flex-1 md:flex-none">Avaliações</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card className="border-none shadow-none bg-transparent">
                            <CardContent className="p-0">
                                <h3 className="text-xl font-semibold mb-4 flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2 text-primary" />
                                    Sobre a obra
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-lg italic border-l-4 border-primary/20 pl-6 py-2">
                                    &quot;{description}&quot;
                                </p>
                                <div className="mt-8 space-y-4 text-muted-foreground">
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                    <Card>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                                    <p className="text-foreground">{category}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Library className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Origem do Recurso</p>
                                    <p className="text-foreground">{source || "Memba Local Repository"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                    <div className="py-12 text-center border-2 border-dashed rounded-lg bg-muted/20">
                        <p className="text-muted-foreground">Ainda não há avaliações para este recurso.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
