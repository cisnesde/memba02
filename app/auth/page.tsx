"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { data, error } = await signIn.email({ email, password });
                if (error) setError(error.message || "Ocorreu um erro ao entrar");
                else window.location.href = "/";
            } else {
                const { data, error } = await signUp.email({ email, password, name });
                if (error) setError(error.message || "Ocorreu um erro ao registar");
                else window.location.href = "/";
            }
        } catch (err: any) {
            setError(err?.message || "Algo correu mal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-6 rounded-lg border p-6 shadow-sm">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">{isLogin ? "Entrar na Conta" : "Criar Conta"}</h1>
                    <p className="text-sm text-gray-500">
                        {isLogin ? "Introduza as suas credenciais para continuar." : "Preencha os dados abaixo para se registar."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Nome</label>
                            <Input
                                id="name"
                                placeholder="O seu nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Aguarde..." : isLogin ? "Entrar" : "Registar"}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    {isLogin ? "Não tem conta? " : "Já tem conta? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-medium underline underline-offset-4 hover:text-primary"
                        type="button"
                    >
                        {isLogin ? "Registar" : "Entrar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
