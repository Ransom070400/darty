"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketsSection from "@/components/MarketsSection";
import Preloader from "@/components/Preloader";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { PREDICTION_MARKET_ADDRESS } from "@/lib/contracts/constants";
import { PREDICTION_MARKET_ABI, Market } from "@/lib/contracts/predictionMarket";

export default function MarketsPage() {
    // Reusing the data fetching logic from the original page
    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState<string>("");

    useEffect(() => {
        connectWallet();
        loadMarkets();
    }, []);

    const connectWallet = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const browserProvider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await browserProvider.send("eth_requestAccounts", []);
                setAccount(accounts[0]);
            } catch (error) {
                console.error("Failed to connect wallet:", error);
            }
        }
    };

    const loadMarkets = async () => {
        try {
            if (!PREDICTION_MARKET_ADDRESS) {
                setLoading(false);
                return;
            }
            const rpcProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ZG_TESTNET_RPC);
            const contract = new ethers.Contract(PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI, rpcProvider);
            const totalMarkets = await contract.totalMarkets();
            const loadedMarkets: Market[] = [];

            // Load all markets for the dedicated page (up to reasonable limit or pagination)
            // For now, load last 20
            const start = totalMarkets > 20n ? totalMarkets - 20n : 1n;

            for (let i = start; i < totalMarkets + 1n; i++) {
                try {
                    const market = await contract.getMarket(i);
                    // ... map fields ... 
                    // To save space and avoid duplication errors, strict mapping:
                    loadedMarkets.push({
                        marketId: market[0],
                        question: market[1],
                        category: market[2],
                        creator: market[3],
                        createdAt: market[4],
                        resolutionTime: market[5],
                        status: market[6],
                        outcomeA: market[7],
                        outcomeB: market[8],
                        totalPoolA: market[9],
                        totalPoolB: market[10],
                        result: market[11],
                        proofHash: market[12],
                        resolver: market[13],
                        resolvedAt: market[14],
                        creatorFee: market[15],
                        platformFee: market[16],
                    });
                } catch (err) { console.error(err); }
            }
            setMarkets(loadedMarkets.reverse());
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Preloader />
            <Navbar account={account} connectWallet={connectWallet} />

            <main className="pt-24 min-h-screen">
                <div className="py-12 bg-black relative border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">MARKET <span className="text-[var(--color-zg-purple)]">TERMINAL</span></h1>
                        <p className="text-gray-400 max-w-2xl">Execute prediction contracts on the world's first Zero Gravity settlement layer.</p>
                    </div>
                </div>

                <MarketsSection markets={markets} loading={loading} />
            </main>

            <Footer />
        </div>
    );
}
