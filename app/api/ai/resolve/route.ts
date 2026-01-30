/**
 * AI Auto-Resolution API Route
 * Automatically resolves markets using AI oracle
 *
 * POST /api/ai/resolve
 */

import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { getOracleResolver } from "@/lib/ai/oracle-resolver";
import { PREDICTION_MARKET_ADDRESS } from "@/lib/contracts/constants";
import { PREDICTION_MARKET_ABI, Market } from "@/lib/contracts/predictionMarket";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { marketId } = body;

    if (!marketId) {
      return NextResponse.json(
        { success: false, error: "Market ID required" },
        { status: 400 }
      );
    }

    console.log(`[AI Resolve API] Resolving market ${marketId}`);

    // Fetch market data from blockchain
    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_ZG_TESTNET_RPC
    );

    const contract = new ethers.Contract(
      PREDICTION_MARKET_ADDRESS,
      PREDICTION_MARKET_ABI,
      provider
    );

    const marketData = await contract.getMarket(marketId);

    // Convert to Market interface
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

    console.log(`[AI Resolve API] Market fetched: ${market.question}`);

    // Check if market is already resolved
    if (market.status !== 0) {
      // 0 = ACTIVE
      return NextResponse.json(
        { success: false, error: "Market is not active" },
        { status: 400 }
      );
    }

    // Check if market has reached resolution time
    const now = Math.floor(Date.now() / 1000);
    if (now < Number(market.resolutionTime)) {
      return NextResponse.json(
        {
          success: false,
          error: "Market has not reached resolution time yet",
          resolutionTime: Number(market.resolutionTime),
          timeRemaining: Number(market.resolutionTime) - now,
        },
        { status: 400 }
      );
    }

    // Get oracle resolver and resolve
    const resolver = await getOracleResolver();

    // Check if market can be auto-resolved
    if (!resolver.canAutoResolve(market)) {
      return NextResponse.json(
        {
          success: false,
          error: "Market cannot be auto-resolved. Manual resolution required.",
          reason: "Market type not supported for automatic resolution",
        },
        { status: 400 }
      );
    }

    const resolution = await resolver.resolveMarket(market);

    console.log(`[AI Resolve API] Resolution complete:`, {
      outcome: resolution.outcome,
      confidence: resolution.confidence,
    });

    // Return resolution data (admin will submit to blockchain)
    return NextResponse.json({
      success: true,
      resolution: {
        marketId: marketId.toString(),
        outcome: resolution.outcome,
        outcomeName:
          resolution.outcome === 1 ? market.outcomeA : market.outcomeB,
        confidence: resolution.confidence,
        reasoning: resolution.reasoning,
        consensus: resolution.consensus,
        proofHash: resolution.proofHash,
        sources: resolution.sources.map((s) => ({
          name: s.name,
          data: s.data,
          timestamp: s.timestamp,
        })),
      },
    });
  } catch (error: any) {
    console.error("[AI Resolve API] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to resolve market",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check if market can be auto-resolved
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const marketId = searchParams.get("marketId");

    if (!marketId) {
      return NextResponse.json(
        { success: false, error: "Market ID required" },
        { status: 400 }
      );
    }

    // Fetch market data
    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_ZG_TESTNET_RPC
    );

    const contract = new ethers.Contract(
      PREDICTION_MARKET_ADDRESS,
      PREDICTION_MARKET_ABI,
      provider
    );

    const marketData = await contract.getMarket(marketId);

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

    const resolver = await getOracleResolver();
    const canAutoResolve = resolver.canAutoResolve(market);

    const now = Math.floor(Date.now() / 1000);
    const timeUntilResolution = Number(market.resolutionTime) - now;

    return NextResponse.json({
      success: true,
      marketId: marketId.toString(),
      canAutoResolve,
      status: market.status,
      isActive: market.status === 0,
      hasReachedResolutionTime: now >= Number(market.resolutionTime),
      timeUntilResolution: timeUntilResolution > 0 ? timeUntilResolution : 0,
      resolutionTime: Number(market.resolutionTime),
    });
  } catch (error: any) {
    console.error("[AI Resolve API] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to check market",
      },
      { status: 500 }
    );
  }
}
