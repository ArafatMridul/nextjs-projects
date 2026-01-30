"use client";

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Services', href: '#services' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-background/95 backdrop-blur-lg border-b border-border shadow-sm' 
                : 'bg-transparent'
        }`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg">B</span>
                        </div>
                        <span className="text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
                            Blooogy
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium group"
                            >
                                {item.name}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-200 group-hover:w-4" />
                            </a>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Log in</Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/signup">Sign up</Link>
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                            className="h-9 w-9"
                        >
                            <div className="relative h-5 w-5">
                                <Menu
                                    size={20}
                                    className={`absolute inset-0 transition-all duration-200 ${
                                        isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                                    }`}
                                />
                                <X
                                    size={20}
                                    className={`absolute inset-0 transition-all duration-200 ${
                                        isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                                    }`}
                                />
                            </div>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`md:hidden absolute top-full left-0 right-0 transition-all duration-300 ease-out ${
                    isOpen 
                        ? 'opacity-100 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
            >
                <div className="mx-4 mt-2 p-4 rounded-xl bg-card/95 backdrop-blur-lg border border-border shadow-lg">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="flex items-center px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200 text-sm font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/login" onClick={() => setIsOpen(false)}>Log in</Link>
                        </Button>
                        <Button className="w-full" asChild>
                            <Link href="/signup" onClick={() => setIsOpen(false)}>Sign up</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Backdrop for mobile menu */}
            <div
                className={`md:hidden fixed inset-0 bg-background/60 backdrop-blur-sm -z-10 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
            />
        </nav>
    );
};

export default NavBar;