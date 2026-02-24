import { Bot, AlertTriangle } from "lucide-react"

export default function ChatPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full text-center px-4">
            {/* Background UI placeholder to give the illusion of a chat interface underneath */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-5 pointer-events-none overflow-hidden blur-[2px]">
                <div className="w-full max-w-3xl mx-auto space-y-6">
                    <div className="flex justify-start"><div className="bg-primary/10 w-2/3 h-24 rounded-2xl rounded-bl-sm"></div></div>
                    <div className="flex justify-end"><div className="bg-primary/20 w-1/2 h-16 rounded-2xl rounded-br-sm"></div></div>
                    <div className="flex justify-start"><div className="bg-primary/10 w-3/4 h-32 rounded-2xl rounded-bl-sm"></div></div>
                </div>
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-md p-8 bg-card border rounded-2xl shadow-sm text-card-foreground animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Bot className="w-8 h-8 text-primary" />
                </div>

                <div className="flex items-center text-amber-500 mb-2 font-medium">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Temporariamente Indisponível
                </div>

                <h2 className="text-2xl font-bold tracking-tight mb-3">Chat com IA</h2>

                <p className="text-muted-foreground">
                    Estamos a afinar o nosso assistente inteligente para garantir que lhe dá as melhores e mais precisas as respostas. O serviço voltará em breve.
                </p>

                <div className="mt-8 pt-6 border-t w-full flex justify-center">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        Memba AI
                    </span>
                </div>
            </div>
        </div>
    )
}
