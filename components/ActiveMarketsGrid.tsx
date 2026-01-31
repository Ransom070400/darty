"use client";

import { motion } from "framer-motion";
import { Activity, Grid, List } from "lucide-react";
import MarketCard from "./MarketCard";
import { Market, MarketStatus, Outcome } from "@/lib/contracts/predictionMarket";

// TRENDING MARKETS - Inspired by Polymarket's most popular categories
const MOCK_MARKETS: Market[] = [
    {
        marketId: 1n,
        question: "Will Bitcoin reach $120,000 by end of 2025?",
        category: "Crypto",
        creator: "0x123",
        createdAt: 0n,
        resolutionTime: BigInt(Math.floor(Date.now() / 1000 + 86400 * 335)),
        status: MarketStatus.ACTIVE,
        outcomeA: "Yes",
        outcomeB: "No",
        totalPoolA: ethers.parseEther("4250"),
        totalPoolB: ethers.parseEther("1890"),
        result: Outcome.PENDING,
        proofHash: "",
        resolver: "0x0",
        resolvedAt: 0n,
        creatorFee: 0n,
        platformFee: 0n
    },
    {
        marketId: 2n,
        question: "Will Ethereum reach $6,000 by Q3 2025?",
        category: "Crypto",
        creator: "0x123",
        createdAt: 0n,
        resolutionTime: BigInt(Math.floor(Date.now() / 1000 + 86400 * 180)),
        status: MarketStatus.ACTIVE,
        outcomeA: "Yes",
        outcomeB: "No",
        totalPoolA: ethers.parseEther("3100"),
        totalPoolB: ethers.parseEther("2300"),
        result: Outcome.PENDING,
        proofHash: "",
        resolver: "0x0",
        resolvedAt: 0n,
        creatorFee: 0n,
        platformFee: 0n
    },
    {
        marketId: 3n,
        question: "Will GPT-5 be released in 2025?",
        category: "Tech",
        creator: "0x123",
        createdAt: 0n,
        resolutionTime: BigInt(Math.floor(Date.now() / 1000 + 86400 * 270)),
        status: MarketStatus.ACTIVE,
        outcomeA: "Yes",
        outcomeB: "No",
        totalPoolA: ethers.parseEther("5600"),
        totalPoolB: ethers.parseEther("2100"),
        result: Outcome.PENDING,
        proofHash: "",
        resolver: "0x0",
        resolvedAt: 0n,
        creatorFee: 0n,
        platformFee: 0n
    },
    {
        marketId: 4n,
        question: "Will SpaceX land on Mars before 2030?",
        category: "Science",
        creator: "0x123",
        createdAt: 0n,
        resolutionTime: BigInt(Math.floor(Date.now() / 1000 + 86400 * 1800)),
        status: MarketStatus.ACTIVE,
        outcomeA: "Yes",
        outcomeB: "No",
        totalPoolA: ethers.parseEther("1800"),
        totalPoolB: ethers.parseEther("8900"),
        result: Outcome.PENDING,
        proofHash: "",
        resolver: "0x0",
        resolvedAt: 0n,
        creatorFee: 0n,
        platformFee: 0n
    },
    {
        marketId: 5n,
        question: "Super Bowl LIX: Will Chiefs win?",
        category: "Sports",
        creator: "0x123",
        createdAt: 0n,
        resolutionTime: BigInt(Math.floor(Date.now() / 1000 + 86400 * 9)),
        status: MarketStatus.ACTIVE,
        outcomeA: "Chiefs Win",
        outcomeB: "Chiefs Lose",
        totalPoolA: ethers.parseEther("2890"),
        totalPoolB: ethers.parseEther("1920"),
        result: Outcome.PENDING,
        proofHash: "",
        resolver: "0x0",
        resolvedAt: 0n,
        creatorFee: 0n,
        platformFee: 0n
    },
    {
        marketId: 6n,
        question: "Will Apple release Vision Pro 2 in 2025?",
        category: "Tech",
        creator: "0x123",
        createdAt: 0n,
        resolutionTime: BigInt(Math.floor(Date.now() / 1000 + 86400 * 300)),
        status: MarketStatus.ACTIVE,
        outcomeA: "Yes",
        outcomeB: "No",
        totalPoolA: ethers.parseEther("1200"),
        totalPoolB: ethers.parseEther("3400"),
        result: Outcome.PENDING,
        proofHash: "",
        resolver: "0x0",
        resolvedAt: 0n,
        creatorFee: 0n,
        platformFee: 0n
    },
    {
        marketId: 7n,
        question: "Will Fed cut interest rates by 0.5% in Q1 2025?",
        category: "Finance",
        creator: "0x123",
        createdAt: 0n,
        resolutionTime: BigInt(Math.floor(Date.now() / 1000 + 86400 * 60)),
        status: MarketStatus.ACTIVE,
        outcomeA: "Yes",
        outcomeB: "No",
        totalPoolA: ethers.parseEther("980"),
        totalPoolB: ethers.parseEther("4200"),
        result: Outcome.PENDING,
        proofHash: "",
        resolver: "0x0",
        resolvedAt: 0n,
        creatorFee: 0n,
        platformFee: 0n
    },
    {
        marketId: 8n,
        question: "Will Solana reach $300 by June 2025?",
        category: "Crypto",
        creator: "0x123",
        createdAt: 0n,
        resolutionTime: BigInt(Math.floor(Date.now() / 1000 + 86400 * 150)),
        status: MarketStatus.ACTIVE,
        outcomeA: "Yes",
        outcomeB: "No",
        totalPoolA: ethers.parseEther("2100"),
        totalPoolB: ethers.parseEther("1600"),
        result: Outcome.PENDING,
        proofHash: "",
        resolver: "0x0",
        resolvedAt: 0n,
        creatorFee: 0n,
        platformFee: 0n
    },
    {
        marketId: 9n,
        question: "Will Tesla stock hit $500 by end of 2025?",
        category: "Finance",
        creator: "0x123",
        createdAt: 0n,
        resolutionTime: BigInt(Math.floor(Date.now() / 1000 + 86400 * 335)),
        status: MarketStatus.ACTIVE,
        outcomeA: "Yes",
        outcomeB: "No",
        totalPoolA: ethers.parseEther("3200"),
        totalPoolB: ethers.parseEther("2800"),
        result: Outcome.PENDING,
        proofHash: "",
        resolver: "0x0",
        resolvedAt: 0n,
        creatorFee: 0n,
        platformFee: 0n
    },
    {
        marketId: 10n,
        question: "Will DeepMind solve protein folding completely in 2025?",
        category: "Science",
        creator: "0x123",
        createdAt: 0n,
        resolutionTime: BigInt(Math.floor(Date.now() / 1000 + 86400 * 300)),
        status: MarketStatus.ACTIVE,
        outcomeA: "Yes",
        outcomeB: "No",
        totalPoolA: ethers.parseEther("450"),
        totalPoolB: ethers.parseEther("1800"),
        result: Outcome.PENDING,
        proofHash: "",
        resolver: "0x0",
        resolvedAt: 0n,
        creatorFee: 0n,
        platformFee: 0n
    },
    {
        marketId: 11n,
        question: "Will NBA Finals 2025 go to Game 7?",
        category: "Sports",
        creator: "0x123",
        createdAt: 0n,
        resolutionTime: BigInt(Math.floor(Date.now() / 1000 + 86400 * 150)),
        status: MarketStatus.ACTIVE,
        outcomeA: "Yes",
        outcomeB: "No",
        totalPoolA: ethers.parseEther("780"),
        totalPoolB: ethers.parseEther("1120"),
        result: Outcome.PENDING,
        proofHash: "",
        resolver: "0x0",
        resolvedAt: 0n,
        creatorFee: 0n,
        platformFee: 0n
    },
    {
        marketId: 12n,
        question: "Will a new COVID variant emerge by summer 2025?",
        category: "Health",
        creator: "0x123",
        createdAt: 0n,
        resolutionTime: BigInt(Math.floor(Date.now() / 1000 + 86400 * 150)),
        status: MarketStatus.ACTIVE,
        outcomeA: "Yes",
        outcomeB: "No",
        totalPoolA: ethers.parseEther("1400"),
        totalPoolB: ethers.parseEther("2600"),
        result: Outcome.PENDING,
        proofHash: "",
        resolver: "0x0",
        resolvedAt: 0n,
        creatorFee: 0n,
        platformFee: 0n
    }
];

import { ethers } from "ethers";

export default function ActiveMarketsGrid({ markets }: { markets: Market[] }) {
    // USE MOCK DATA if live data is empty (Development Mode Fallback)
    const displayMarkets = markets.length > 0 ? markets : MOCK_MARKETS;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 relative z-10 mb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Trending Markets</h2>
                </div>

                {/* View Toggle (Visual Helper) */}
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                    <button className="p-2 rounded bg-white/10 text-white shadow-lg">
                        <Grid className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* The Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayMarkets.map((market, i) => (
                    <motion.div
                        key={market.marketId.toString()}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <MarketCard market={market} />
                    </motion.div>
                ))}
            </div>

            {markets.length === 0 && (
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-600 font-mono uppercase">
                        * Displaying Mock Data (Connect Wallet & Deploy to see Live Markets)
                    </p>
                </div>
            )}
        </div>
    );
}
