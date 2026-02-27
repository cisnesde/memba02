import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Play,
    Heart,
    Library,
    Download,
    Share2,
    BookmarkCheck
} from "lucide-react";
import { useState } from "react";



export function ResourceActions() {
    const [isFavorite, setIsFavorite] = useState(false);
    const [inLibrary, setInLibrary] = useState(false);

    // Simple feedback animations
    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        // Notification logic would go here
    };

    const handleLibrary = () => {
        setInLibrary(!inLibrary);
    };

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
                    <Button className="w-full h-12 text-lg font-semibold gap-2 shadow-lg shadow-primary/20" variant="default">
                        <Play className="w-5 h-5 fill-current" />
                        Ler Online
                    </Button>
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

                <Button variant="secondary" className="w-full gap-2 h-11">
                    <Download className="w-4 h-4" />
                    Baixar PDF
                </Button>

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
