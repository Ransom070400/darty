"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Menu, X, Terminal, ExternalLink, BarChart3, BookOpen } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface NavbarProps {
    account: string;
    connectWallet: () => void;
}

export default function Navbar({ account, connectWallet }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Terminal", href: "/markets", icon: <Terminal size={14} /> },
        { name: "Fame", href: "/leaderboard", icon: <BarChart3 size={14} /> },
        { name: "Guide", href: "/how-it-works", icon: <BookOpen size={14} /> },
    ];

    return (
        <>
            {/* Floating Island Container */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
            >
                <div className={`pointer-events-auto transition-all duration-300 ease-out border border-white/10 ${scrolled ? "bg-black/90 shadow-2xl shadow-purple-900/10" : "bg-black/70"
                    } backdrop-blur-xl rounded-full px-2 py-2 flex items-center gap-2 md:gap-4 min-w-[320px] md:min-w-[600px] justify-between group/dock`}>

                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-2 pl-3 pr-2 group/logo relative">
                        <div className="relative w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-full overflow-hidden group-hover/logo:bg-[var(--color-zg-purple)]/20 transition-colors">
                            <span className="text-white font-bold text-sm tracking-tighter">0G</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - The "Pill" Links */}
                    <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onMouseEnter={() => setHoveredLink(link.name)}
                                    onMouseLeave={() => setHoveredLink(null)}
                                    className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 ${isActive ? "text-white" : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-white/10 rounded-full border border-white/5"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 opacity-70 group-hover:opacity-100">{link.icon}</span>
                                    <span className="relative z-10">{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 pr-1">
                        {account ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[var(--color-zg-purple)]/30 transition-colors cursor-default">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                <span className="text-[10px] font-mono font-bold text-gray-300">
                                    {account.slice(0, 4)}...{account.slice(-4)}
                                </span>
                            </div>
                        ) : (
                            <button
                                onClick={connectWallet}
                                className="group relative px-4 py-2 rounded-full overflow-hidden bg-[var(--color-zg-purple)] text-black text-xs font-bold uppercase tracking-wider hover:scale-105 transition-transform"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Wallet size={12} />
                                    <span>Connect</span>
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={18} />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="fixed inset-x-4 top-24 z-[60] p-4 bg-[#111] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl md:hidden"
                    >
                        <div className="flex justify-between items-center mb-6 px-2">
                            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Navigation</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-full"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="grid gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                                >
                                    <div className="flex items-center gap-3 text-white">
                                        <div className="p-2 bg-black rounded-lg text-[var(--color-zg-purple)]">
                                            {link.icon}
                                        </div>
                                        <span className="font-medium">{link.name}</span>
                                    </div>
                                    <ExternalLink size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
