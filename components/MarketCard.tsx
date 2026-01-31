"use client";

import { motion } from "framer-motion";
import { TrendingUp, User, Clock } from "lucide-react";
import Link from "next/link";
import { ethers } from "ethers";
import { Market } from "@/lib/contracts/predictionMarket";

// Visual mapping for categories to placeholder images
const CATEGORY_IMAGES: Record<string, string> = {
    "Crypto": "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=1000",
    "Tech": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
    "Politics": "https://images.unsplash.com/photo-1529101091760-6149d4c8af92?auto=format&fit=crop&q=80&w=1000",
    "Sports": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1000",
    "Science": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1000",
    "Pop Culture": "https://images.unsplash.com/photo-1514525253440-b393452e3383?auto=format&fit=crop&q=80&w=1000",
    "default": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000" // 3D Abstract
};

const calculateProbability = (poolA: bigint, poolB: bigint) => {
    const total = poolA + poolB;
    if (total === 0n) return { probA: 50, probB: 50 };
    const probA = Number((poolA * 10000n) / total) / 100;
    return { probA, probB: 100 - probA };
};

const formatVolume = (amount: bigint) => {
    const vol = parseFloat(ethers.formatEther(amount));
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}k`;
    return vol.toFixed(0);
};

export default function MarketCard({ market }: { market: Market }) {
    const { probA, probB } = calculateProbability(market.totalPoolA, market.totalPoolB);
    const image = CATEGORY_IMAGES[market.category] || CATEGORY_IMAGES["default"];

    return (
        <Link href={`/markets/${market.marketId}`} className="block h-full">
            <motion.div
                whileHover={{ y: -4 }}
                className="h-full bg-[#1A1A1A] border border-white/10 hover:border-[var(--color-zg-purple)]/50 rounded-xl overflow-hidden shadow-lg transition-all flex flex-col group"
            >
                {/* Image Header (Polymarket Style) */}
                <div className="h-32 bg-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent opacity-80" />

                    <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-wider text-white">
                            {market.category}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-medium text-white leading-snug mb-4 line-clamp-2 group-hover:text-[var(--color-zg-purple)] transition-colors">
                        {market.question}
                    </h3>

                    <div className="mt-auto space-y-4">
                        {/* Probability Outcomes */}
                        <div className="space-y-2">
                            {/* Yes Outcome */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 relative h-8 bg-green-900/20 rounded md overflow-hidden border border-green-500/10">
                                    <div className="absolute top-0 left-0 h-full bg-green-500/20" style={{ width: `${probA}%` }} />
                                    <div className="absolute inset-0 flex items-center justify-between px-3">
                                        <span className="text-xs font-bold text-green-500 uppercase">Yes</span>
                                        <span className="text-xs font-mono font-bold text-white">{probA.toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* No Outcome */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 relative h-8 bg-red-900/20 rounded md overflow-hidden border border-red-500/10">
                                    <div className="absolute top-0 left-0 h-full bg-red-500/20" style={{ width: `${probB}%` }} />
                                    <div className="absolute inset-0 flex items-center justify-between px-3">
                                        <span className="text-xs font-bold text-red-500 uppercase">No</span>
                                        <span className="text-xs font-mono font-bold text-white">{probB.toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Stats */}
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-mono">
                            <div className="flex items-center gap-1.5">
                                <TrendingUp className="w-3 h-3" />
                                <span>Vol: {formatVolume(market.totalPoolA + market.totalPoolB)} 0G</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <User className="w-3 h-3" />
                                <span>0g_User</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
