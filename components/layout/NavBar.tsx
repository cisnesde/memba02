"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, Menu, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NavBar() {
    const { data: session, isPending } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navLinks: { name: string; href: string }[] = [
        { name: "Explorer", href: "/explorer" },
        { name: "Admin", href: "/admin" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold tracking-tight">Memba</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        {!mounted || isPending ? (
                            <div className="flex items-center gap-2">
                                <div className="h-9 w-[4.5rem] bg-muted animate-pulse rounded-md" />
                                <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
                            </div>
                        ) : session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8 border">
                                            <AvatarImage src={session.user.image || ""} alt={session.user.name || "User avatar"} />
                                            <AvatarFallback>{session.user.name?.charAt(0) || <User className="h-4 w-4" />}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {session.user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/library">My Library</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-700">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" asChild>
                                    <Link href="/auth/signin">Login</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/auth/signup">Cadastro</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader className="text-left mb-6">
                                <SheetTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                    Memba
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-6">
                                <nav className="flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="text-lg font-medium hover:text-primary transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="h-px bg-border" />
                                {!mounted || isPending ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                                            <div className="flex flex-col gap-2">
                                                <div className="h-4 w-24 bg-muted animate-pulse rounded-md" />
                                                <div className="h-3 w-32 bg-muted animate-pulse rounded-md" />
                                            </div>
                                        </div>
                                    </div>
                                ) : session ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border">
                                                <AvatarImage src={session.user.image || ""} alt={session.user.name || "User avatar"} />
                                                <AvatarFallback>{session.user.name?.charAt(0) || <User className="h-5 w-5" />}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{session.user.name}</span>
                                                <span className="text-xs text-muted-foreground">{session.user.email}</span>
                                            </div>
                                        </div>
                                        <nav className="flex flex-col gap-3">
                                            <Link href="/profile" className="text-sm font-medium hover:text-primary">Profile</Link>
                                            <Link href="/library" className="text-sm font-medium hover:text-primary">My Library</Link>
                                        </nav>
                                        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-2" onClick={() => signOut()}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Log out
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href="/auth/signin">Login</Link>
                                        </Button>
                                        <Button className="w-full" asChild>
                                            <Link href="/auth/signup">Cadastro</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
