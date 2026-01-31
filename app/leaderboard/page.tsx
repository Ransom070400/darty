"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award, TrendingUp, Wallet, Search, Filter, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import { useState } from "react";

const LEADERBOARD_DATA = [
    { rank: 1, address: "0x7a...9e21", profit: "+428%", volume: "1,240 0G", winRate: "82%", badges: ["Whale", "Sniper"], history: [1, 1, 1, 0, 1] },
    { rank: 2, address: "0x3b...a1b4", profit: "+312%", volume: "980 0G", winRate: "75%", badges: ["Early Adopter"], history: [1, 0, 1, 1, 1] },
    { rank: 3, address: "0x9c...f4d2", profit: "+285%", volume: "850 0G", winRate: "71%", badges: ["Streak Master"], history: [1, 1, 1, 1, 0] },
    { rank: 4, address: "0x1d...8e9f", profit: "+210%", volume: "720 0G", winRate: "68%", badges: [], history: [0, 1, 1, 0, 1] },
    { rank: 5, address: "0x5e...2c3a", profit: "+195%", volume: "650 0G", winRate: "65%", badges: ["Veteran"], history: [1, 0, 1, 0, 1] },
    { rank: 6, address: "0x8f...6b7c", profit: "+178%", volume: "580 0G", winRate: "62%", badges: [], history: [1, 1, 0, 1, 0] },
    { rank: 7, address: "0x2a...4d5e", profit: "+150%", volume: "510 0G", winRate: "60%", badges: [], history: [0, 1, 1, 1, 0] },
    { rank: 8, address: "0x4b...9a1f", profit: "+135%", volume: "450 0G", winRate: "58%", badges: [], history: [1, 0, 0, 1, 1] },
    { rank: 9, address: "0x6c...1e2d", profit: "+120%", volume: "400 0G", winRate: "55%", badges: [], history: [0, 0, 1, 1, 1] },
    { rank: 10, address: "0x0d...5f8b", profit: "+95%", volume: "350 0G", winRate: "52%", badges: [], history: [1, 1, 0, 0, 0] },
    // Mock data extension
    { rank: 11, address: "0x11...2233", profit: "+85%", volume: "300 0G", winRate: "50%", badges: [], history: [1, 0, 1, 0, 0] },
    { rank: 12, address: "0x44...5566", profit: "+70%", volume: "250 0G", winRate: "48%", badges: [], history: [0, 1, 0, 1, 0] },
];

export default function LeaderboardPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("All Time"); // "All Time", "Weekly", "Daily"

    const filteredData = LEADERBOARD_DATA.filter(item =>
        item.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Preloader />
            <Navbar account="" connectWallet={() => { }} />

            <main className="pt-32 pb-24 relative overflow-hidden">
                {/* Background ambient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[var(--color-zg-purple)]/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black tracking-tighter mb-6"
                        >
                            HALL OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-zg-purple)] to-white">FAME</span>
                        </motion.h1>
                        <p className="text-gray-400 max-w-xl mx-auto text-lg">
                            Recognizing the elite strategists of the Zero Gravity Network.
                        </p>
                    </div>

                    {/* Top 3 "Holographic Cards" */}
                    <div className="grid md:grid-cols-3 gap-8 mb-24 items-end">
                        {/* 2nd Place */}
                        <HallOfFameCard rank={2} data={LEADERBOARD_DATA[1]} delay={0.2} />
                        {/* 1st Place */}
                        <HallOfFameCard rank={1} data={LEADERBOARD_DATA[0]} delay={0} />
                        {/* 3rd Place */}
                        <HallOfFameCard rank={3} data={LEADERBOARD_DATA[2]} delay={0.4} />
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                        <div className="flex bg-white/5 border border-white/10 rounded-full p-1">
                            {["All Time", "Weekly", "Daily"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab
                                            ? "bg-[var(--color-zg-purple)] text-black font-bold shadow-[0_0_15px_rgba(212,173,255,0.3)]"
                                            : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search address..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-[var(--color-zg-purple)] transition-colors text-sm font-mono"
                            />
                        </div>
                    </div>

                    {/* The "Terminal Table" */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 border-b border-white/10 text-xs font-mono uppercase text-gray-400 tracking-wider">
                            <div className="col-span-1 text-center">Rank</div>
                            <div className="col-span-4">Trader</div>
                            <div className="col-span-2 text-center">Win Rate</div>
                            <div className="col-span-2 text-right">Volume</div>
                            <div className="col-span-2 text-right">PnL (ROI)</div>
                            <div className="col-span-1"></div>
                        </div>

                        <div className="divide-y divide-white/5">
                            {filteredData.map((item, index) => (
                                <motion.div
                                    key={item.rank}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors items-center group cursor-pointer"
                                >
                                    <div className="col-span-1 text-center font-mono font-bold text-gray-500 group-hover:text-white">
                                        #{item.rank}
                                    </div>
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center">
                                            <Wallet className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div>
                                            <div className="font-mono text-sm text-gray-200 group-hover:text-[var(--color-zg-purple)] transition-colors">{item.address}</div>
                                            <div className="flex gap-1 mt-1">
                                                {item.badges.map(badge => (
                                                    <span key={badge} className="text-[10px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-500">
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex flex-col items-center justify-center">
                                        <div className="text-sm font-bold text-white mb-1">{item.winRate}</div>
                                        <div className="flex gap-0.5">
                                            {item.history.map((win, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1.5 h-1.5 rounded-full ${win ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" : "bg-red-500/50"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-2 text-right font-mono text-gray-400">{item.volume}</div>

                                    <div className="col-span-2 text-right">
                                        <div className="font-mono font-bold text-[var(--color-zg-purple)] flex items-center justify-end gap-1 group-hover:scale-110 transition-transform origin-right">
                                            <TrendingUp className="w-3 h-3" />
                                            {item.profit}
                                        </div>
                                    </div>

                                    <div className="col-span-1 flex justify-end">
                                        <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function HallOfFameCard({ rank, data, delay }: { rank: number, data: any, delay: number }) {
    const isFirst = rank === 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.8, ease: "easeOut" }}
            className={`relative group ${isFirst ? "-mt-12 z-20" : "z-10"}`}
        >
            {/* Glow backing */}
            <div className={`absolute inset-0 bg-[var(--color-zg-purple)]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className={`
                relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300
                ${isFirst
                    ? "bg-black/60 border-[var(--color-zg-purple)]/50 shadow-[0_0_50px_rgba(212,173,255,0.15)] scale-105"
                    : "bg-black/40 border-white/10 hover:border-white/30"
                }
            `}>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />

                <div className="p-8 flex flex-col items-center text-center relative z-10">
                    <div className="absolute top-4 right-4 text-6xl font-black text-white/[0.03] pointer-events-none">
                        #{rank}
                    </div>

                    <div className={`
                        w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-2xl relative
                        ${isFirst ? "bg-[var(--color-zg-purple)] text-black" : "bg-gray-800 text-gray-400 border border-white/10"}
                    `}>
                        {isFirst ? <Trophy className="w-10 h-10" /> : <Medal className="w-10 h-10" />}
                        {isFirst && (
                            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white" />
                        )}
                    </div>

                    <div className="font-mono text-xs text-gray-500 mb-2 uppercase tracking-widest">
                        {isFirst ? "Champion" : "Elite Trader"}
                    </div>

                    <div className="font-bold text-xl text-white mb-6">
                        {data.address}
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4 py-4 border-t border-white/10">
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase font-mono">Profit</div>
                            <div className={`text-lg font-bold ${isFirst ? "text-[var(--color-zg-purple)]" : "text-white"}`}>
                                {data.profit}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase font-mono">Win Rate</div>
                            <div className="text-lg font-bold text-white">
                                {data.winRate}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
