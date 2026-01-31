"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ActiveMarketsGrid from "@/components/ActiveMarketsGrid";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import { PREDICTION_MARKET_ADDRESS } from "@/lib/contracts/constants";
import { PREDICTION_MARKET_ABI, Market } from "@/lib/contracts/predictionMarket";

export default function HomePage() {
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
      const start = totalMarkets > 10n ? totalMarkets - 10n : 1n; // Last 10
      for (let i = start; i < totalMarkets + 1n; i++) {
        try {
          const market = await contract.getMarket(i);
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
    <div className="min-h-screen bg-[#050505]">
      <Preloader />
      <Navbar account={account} connectWallet={connectWallet} />

      {/* Integrated Terminal View */}
      <div className="pt-32">
        <ActiveMarketsGrid markets={markets} />
      </div>

      <Footer />
    </div>
  );
}
