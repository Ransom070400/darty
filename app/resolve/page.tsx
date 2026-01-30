"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Sparkles, Send, Loader2, AlertCircle } from "lucide-react";
import { PREDICTION_MARKET_ADDRESS } from "@/lib/contracts/constants";
import { PREDICTION_MARKET_ABI, Market, MarketStatus, Outcome } from "@/lib/contracts/predictionMarket";
import toast from "react-hot-toast";

export default function ResolvePage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>("");
  const [resolvingMarket, setResolvingMarket] = useState<string | null>(null);
  const [aiResolution, setAiResolution] = useState<any>(null);

  useEffect(() => {
    connectWallet();
    loadMarkets();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await browserProvider.send("eth_requestAccounts", []);
        setProvider(browserProvider);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  const loadMarkets = async () => {
    try {
      const rpcProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ZG_TESTNET_RPC);
      const contract = new ethers.Contract(PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI, rpcProvider);

      const totalMarkets = await contract.nextMarketId();
      const loadedMarkets: Market[] = [];

      for (let i = 0; i < Number(totalMarkets); i++) {
        try {
          const marketData = await contract.getMarket(i);
          const market: Market = {
            marketId: marketData[0],
            question: marketData[1],
            category: marketData[2],
            creator: marketData[3],
            createdAt: marketData[4],
            resolutionTime: marketData[5],
            status: marketData[6],
            outcomeA: marketData[7],
            outcomeB: marketData[8],
            totalPoolA: marketData[9],
            totalPoolB: marketData[10],
            result: marketData[11],
            proofHash: marketData[12],
            resolver: marketData[13],
            resolvedAt: marketData[14],
            creatorFee: marketData[15],
            platformFee: marketData[16],
          };

          // Only show active markets that have reached resolution time
          const now = Math.floor(Date.now() / 1000);
          if (market.status === MarketStatus.ACTIVE && now >= Number(market.resolutionTime)) {
            loadedMarkets.push(market);
          }
        } catch (err) {
          console.error(`Failed to load market ${i}:`, err);
        }
      }

      setMarkets(loadedMarkets);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load markets:", error);
      setLoading(false);
    }
  };

  const getAIResolution = async (marketId: string) => {
    setResolvingMarket(marketId);
    setAiResolution(null);

    try {
      const response = await fetch("/api/ai/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketId }),
      });

      const data = await response.json();

      if (data.success) {
        setAiResolution(data.resolution);
        toast.success("AI resolution generated!");
      } else {
        toast.error(data.error || "Failed to get AI resolution");
        setResolvingMarket(null);
      }
    } catch (error) {
      console.error("Failed to get AI resolution:", error);
      toast.error("Failed to get AI resolution");
      setResolvingMarket(null);
    }
  };

  const submitResolution = async () => {
    if (!provider || !aiResolution) return;

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI, signer);

      const proofHash = aiResolution.proofHash
        ? ethers.id(aiResolution.proofHash)
        : ethers.ZeroHash;

      const tx = await contract.resolveMarket(
        aiResolution.marketId,
        aiResolution.outcome,
        proofHash
      );

      toast.loading("Submitting resolution...", { id: "resolve" });

      await tx.wait();

      toast.success("Market resolved successfully!", { id: "resolve" });

      // Reload markets
      setAiResolution(null);
      setResolvingMarket(null);
      loadMarkets();
    } catch (error: any) {
      console.error("Failed to resolve market:", error);
      toast.error(error.message || "Failed to resolve market", { id: "resolve" });
    }
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Resolve Markets
          </h1>
          <p className="text-xl text-gray-400">
            AI-assisted market resolution with verifiable proofs
          </p>
        </motion.div>

        {/* Wallet Connection */}
        {!account && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8 text-center">
            <p className="text-yellow-400 mb-4">Connect your wallet to resolve markets</p>
            <button
              onClick={connectWallet}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading markets...</p>
          </div>
        )}

        {/* No Markets */}
        {!loading && markets.length === 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 text-center border border-white/10">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">All Markets Resolved!</h3>
            <p className="text-gray-400">No active markets need resolution at this time.</p>
          </div>
        )}

        {/* Markets List */}
        {!loading && markets.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {markets.map((market, i) => (
              <motion.div
                key={market.marketId.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        Needs Resolution
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-300">
                        {market.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{market.question}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Resolution time passed {formatTime(market.resolutionTime)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <div className="text-green-400 font-medium">{market.outcomeA}</div>
                    <div className="text-sm text-gray-400">{ethers.formatEther(market.totalPoolA)} 0G</div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <div className="text-purple-400 font-medium">{market.outcomeB}</div>
                    <div className="text-sm text-gray-400">{ethers.formatEther(market.totalPoolB)} 0G</div>
                  </div>
                </div>

                {resolvingMarket === market.marketId.toString() && aiResolution ? (
                  /* AI Resolution Result */
                  <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20 mb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <h4 className="font-bold text-white">AI Resolution</h4>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-400">Outcome: </span>
                        <span className="text-white font-bold">{aiResolution.outcomeName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Confidence: </span>
                        <span className="text-white font-bold">{aiResolution.confidence}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Reasoning: </span>
                        <span className="text-white">{aiResolution.reasoning}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Data Sources: </span>
                        <span className="text-white">{aiResolution.sources.length} sources</span>
                      </div>
                      {aiResolution.proofHash && (
                        <div>
                          <span className="text-gray-400">Proof Hash: </span>
                          <span className="text-xs text-purple-300">{aiResolution.proofHash.slice(0, 20)}...</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={submitResolution}
                        disabled={!account}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        Submit to Blockchain
                      </button>
                      <button
                        onClick={() => {
                          setResolvingMarket(null);
                          setAiResolution(null);
                        }}
                        className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Get AI Resolution Button */
                  <button
                    onClick={() => getAIResolution(market.marketId.toString())}
                    disabled={!account || resolvingMarket === market.marketId.toString()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {resolvingMarket === market.marketId.toString() ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Getting AI Resolution...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Get AI Resolution
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
