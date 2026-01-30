"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { Trophy, Sparkles, Loader2, CheckCircle, Clock, Gift } from "lucide-react";
import { PREDICTION_MARKET_ADDRESS } from "@/lib/contracts/constants";
import { PREDICTION_MARKET_ABI, Market, MarketStatus, Position } from "@/lib/contracts/predictionMarket";
import toast from "react-hot-toast";

interface ClaimablePosition {
  positionId: bigint;
  position: Position;
  market: Market;
  payout: bigint;
}

export default function ClaimsPage() {
  const [claimablePositions, setClaimablePositions] = useState<ClaimablePosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>("");
  const [claimingPosition, setClaimingPosition] = useState<string | null>(null);

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (account) {
      loadClaimablePositions();
    }
  }, [account]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await browserProvider.send("eth_requestAccounts", []);
        setProvider(browserProvider);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        toast.error("Failed to connect wallet");
      }
    } else {
      toast.error("Please install MetaMask");
    }
  };

  const loadClaimablePositions = async () => {
    if (!account) return;

    try {
      const rpcProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ZG_TESTNET_RPC);
      const contract = new ethers.Contract(PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI, rpcProvider);

      const totalPositions = await contract.nextPositionId();
      const claimable: ClaimablePosition[] = [];

      for (let i = 0; i < Number(totalPositions); i++) {
        try {
          const positionData = await contract.getPosition(i);
          const position: Position = {
            marketId: positionData[0],
            bettor: positionData[1],
            outcome: positionData[2],
            amount: positionData[3],
            timestamp: positionData[4],
            claimed: positionData[5],
          };

          // Check if position belongs to current user
          if (position.bettor.toLowerCase() !== account.toLowerCase()) {
            continue;
          }

          // Check if already claimed
          if (position.claimed) {
            continue;
          }

          // Get market data
          const marketData = await contract.getMarket(position.marketId);
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

          // Only show resolved markets
          if (market.status !== MarketStatus.RESOLVED) {
            continue;
          }

          // Calculate payout
          const payout = await contract.calculatePayout(i);

          // Only show if user won (payout > 0)
          if (payout > 0n) {
            claimable.push({ positionId: BigInt(i), position, market, payout });
          }
        } catch (err) {
          console.error(`Failed to load position ${i}:`, err);
        }
      }

      setClaimablePositions(claimable);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load claimable positions:", error);
      toast.error("Failed to load claimable positions");
      setLoading(false);
    }
  };

  const claimWinnings = async (positionId: bigint) => {
    if (!provider) return;

    setClaimingPosition(positionId.toString());

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI, signer);

      const tx = await contract.claimWinnings(positionId);

      toast.loading("Claiming winnings...", { id: "claim" });

      await tx.wait();

      toast.success("Winnings claimed successfully!", { id: "claim" });

      // Reload claimable positions
      setClaimingPosition(null);
      loadClaimablePositions();
    } catch (error: any) {
      console.error("Failed to claim winnings:", error);
      toast.error(error.message || "Failed to claim winnings", { id: "claim" });
      setClaimingPosition(null);
    }
  };

  const claimAll = async () => {
    if (!provider || claimablePositions.length === 0) return;

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI, signer);

      toast.loading(`Claiming ${claimablePositions.length} positions...`, { id: "claim-all" });

      for (const { positionId } of claimablePositions) {
        try {
          const tx = await contract.claimWinnings(positionId);
          await tx.wait();
        } catch (error) {
          console.error(`Failed to claim position ${positionId}:`, error);
        }
      }

      toast.success("All winnings claimed!", { id: "claim-all" });

      // Reload
      loadClaimablePositions();
    } catch (error: any) {
      console.error("Failed to claim all:", error);
      toast.error(error.message || "Failed to claim all winnings", { id: "claim-all" });
    }
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTotalPayout = () => {
    return claimablePositions.reduce((sum, cp) => sum + cp.payout, 0n);
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Claim Winnings
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            Collect your rewards from resolved markets
          </p>
        </motion.div>

        {/* Wallet Connection */}
        {!account && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8 text-center">
            <p className="text-yellow-400 mb-4">Connect your wallet to view claimable winnings</p>
            <button
              onClick={connectWallet}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && account && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading your winnings...</p>
          </div>
        )}

        {/* No Claimable Positions */}
        {!loading && account && claimablePositions.length === 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 text-center border border-white/10">
            <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Winnings to Claim</h3>
            <p className="text-gray-400 mb-6">
              You don't have any claimable winnings at the moment.
            </p>
            <a
              href="/"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Explore Markets
            </a>
          </div>
        )}

        {/* Claimable Positions */}
        {!loading && account && claimablePositions.length > 0 && (
          <>
            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 mb-1">Total Winnings Available</p>
                  <p className="text-4xl font-bold text-yellow-400">
                    {ethers.formatEther(getTotalPayout())} 0G
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {claimablePositions.length} winning position{claimablePositions.length > 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={claimAll}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Claim All
                </button>
              </div>
            </motion.div>

            {/* Positions List */}
            <div className="grid grid-cols-1 gap-6">
              {claimablePositions.map((cp, i) => (
                <motion.div
                  key={cp.positionId.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Resolved
                        </span>
                        <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-300">
                          {cp.market.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{cp.market.question}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Resolved on {formatTime(cp.market.resolvedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Your Bet</div>
                      <div className="text-purple-400 font-medium">
                        {cp.position.outcome === 1 ? cp.market.outcomeA : cp.market.outcomeB}
                      </div>
                      <div className="text-sm text-gray-400">
                        {ethers.formatEther(cp.position.amount)} 0G
                      </div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Your Payout</div>
                      <div className="text-yellow-400 font-bold text-xl">
                        {ethers.formatEther(cp.payout)} 0G
                      </div>
                      <div className="text-sm text-green-400">
                        +{((Number(cp.payout - cp.position.amount) / Number(cp.position.amount)) * 100).toFixed(1)}% profit
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => claimWinnings(cp.positionId)}
                    disabled={claimingPosition === cp.positionId.toString()}
                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {claimingPosition === cp.positionId.toString() ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Claiming...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4" />
                        Claim {ethers.formatEther(cp.payout)} 0G
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
