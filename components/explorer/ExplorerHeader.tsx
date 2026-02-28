import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface ExplorerHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function ExplorerHeader({ searchQuery, setSearchQuery }: ExplorerHeaderProps) {
    return (
        <div className="flex flex-col items-center justify-center space-y-6 pt-12 pb-8 px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 max-w-2xl"
            >
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
                    Explore nosso Acervo
                </h1>
                <p className="text-lg text-zinc-500 dark:text-zinc-400">
                    Descubra milhares de livros, artigos e cursos online. Busque por título, autor ou assunto.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-xl relative"
            >
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        type="text"
                        placeholder="O que você está procurando?"
                        className="pl-12 pr-4 h-14 text-lg rounded-full shadow-sm border-muted/40 focus-visible:ring-primary focus-visible:ring-offset-0 bg-background hover:bg-muted/5 transition-colors w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>
        </div>
    );
}
