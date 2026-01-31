"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, BarChart3, Activity } from "lucide-react";
import Link from "next/link";
import { ethers } from "ethers";
import { Market } from "@/lib/contracts/predictionMarket";

// Helper to calculate probability from pools
const calculateProbability = (poolA: bigint, poolB: bigint) => {
    const total = poolA + poolB;
    if (total === 0n) return { probA: 50, probB: 50 };
    const probA = Number((poolA * 10000n) / total) / 100;
    return { probA, probB: 100 - probA };
};

const formatVolume = (amount: bigint) => {
    return ethers.formatEther(amount);
};

export default function TopMarketsList({ markets }: { markets: Market[] }) {
    // Show top 5 markets for the home page
    const topMarkets = markets.slice(0, 5);

    return (
        <div className="w-full max-w-5xl mx-auto px-4 relative z-10 mb-24">
            {/* Terminal Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[var(--color-zg-purple)] animate-pulse" />
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Live Feed</span>
                </div>
                <Link href="/markets" className="text-xs font-mono text-[var(--color-zg-purple)] hover:text-white transition-colors flex items-center gap-1 group">
                    VIEW TERMINAL <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* The "Bloomberg" List */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white/5 border-b border-white/10 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                    <div className="col-span-6 md:col-span-5">Market</div>
                    <div className="col-span-2 hidden md:block text-right">Volume (24h)</div>
                    <div className="col-span-3 md:col-span-3 text-center">Probability</div>
                    <div className="col-span-3 md:col-span-2 text-right">Action</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-white/5">
                    {topMarkets.map((market, i) => {
                        const { probA, probB } = calculateProbability(market.totalPoolA, market.totalPoolB);

                        return (
                            <motion.div
                                key={market.marketId.toString()}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group"
                            >
                                {/* Question */}
                                <div className="col-span-6 md:col-span-5">
                                    <div className="flex items-start gap-3">
                                        {/* Category Icon Placeholder */}
                                        <div className="mt-1 w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-gray-400">
                                            {market.category.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <Link href={`/markets/${market.marketId}`} className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                                                {market.question}
                                            </Link>
                                            <div className="mt-1 text-[10px] text-gray-500 font-mono hidden sm:block">
                                                Ends {new Date(Number(market.resolutionTime) * 1000).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Volume */}
                                <div className="col-span-2 hidden md:block text-right">
                                    <div className="font-mono text-xs text-gray-300">
                                        {Math.round(parseFloat(formatVolume(market.totalPoolA + market.totalPoolB))).toLocaleString()} 0G
                                    </div>
                                    <div className="text-[10px] text-green-500 flex justify-end items-center gap-1">
                                        <TrendingUp className="w-2 h-2" /> +12%
                                    </div>
                                </div>

                                {/* Probability Bars */}
                                <div className="col-span-3 md:col-span-3">
                                    <div className="flex gap-2 items-center h-full">
                                        <div className="flex-1 bg-green-500/10 rounded h-8 relative overflow-hidden group/yes cursor-pointer border border-transparent hover:border-green-500/30 transition-all">
                                            <div className="absolute inset-0 flex items-center justify-between px-2">
                                                <span className="text-[10px] font-bold text-green-500 uppercase">Yes</span>
                                                <span className="text-xs font-bold text-white shadow-black drop-shadow-md">{probA.toFixed(0)}%</span>
                                            </div>
                                            <div style={{ width: `${probA}%` }} className="h-full bg-green-500/20" />
                                        </div>
                                        <div className="flex-1 bg-red-500/10 rounded h-8 relative overflow-hidden group/no cursor-pointer border border-transparent hover:border-red-500/30 transition-all">
                                            <div className="absolute inset-0 flex items-center justify-between px-2">
                                                <span className="text-[10px] font-bold text-red-500 uppercase">No</span>
                                                <span className="text-xs font-bold text-white shadow-black drop-shadow-md">{probB.toFixed(0)}%</span>
                                            </div>
                                            <div style={{ width: `${probB}%` }} className="h-full bg-red-500/20" />
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="col-span-3 md:col-span-2 text-right">
                                    <Link
                                        href={`/markets/${market.marketId}`}
                                        className="inline-flex items-center justify-center px-4 py-1.5 bg-white text-black text-xs font-bold font-mono uppercase tracking-wide rounded hover:bg-[var(--color-zg-purple)] transition-colors"
                                    >
                                        Trade
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Empty State */}
                    {markets.length === 0 && (
                        <div className="px-6 py-12 text-center text-gray-500 font-mono text-sm">
                            INITIALIZING DATA FEED...
                        </div>
                    )}
                </div>

                {/* Footer of the List */}
                <div className="px-6 py-3 bg-white/5 border-t border-white/10 text-center">
                    <Link href="/markets" className="text-xs text-gray-400 hover:text-white transition-colors">
                        Show all markets ({markets.length})
                    </Link>
                </div>
            </div>
        </div>
    );
}
