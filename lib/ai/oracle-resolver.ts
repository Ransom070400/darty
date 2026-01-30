/**
 * Oracle Resolver Agent
 * AI-powered automatic market resolution using multiple data sources
 */

import { ZGCompute } from "../0g/compute";
import { ZGStorage } from "../0g/storage";
import { Market, Outcome } from "../contracts/predictionMarket";

export interface DataSource {
  name: string;
  url: string;
  data: any;
  timestamp: number;
}

export interface ResolutionResult {
  outcome: Outcome;
  confidence: number;
  reasoning: string;
  sources: DataSource[];
  consensus: string;
  proofHash?: string;
}

/**
 * Oracle Resolver using AI and multiple data sources
 */
export class OracleResolver {
  private compute: ZGCompute;
  private storage: ZGStorage;

  constructor(compute: ZGCompute, storage: ZGStorage) {
    this.compute = compute;
    this.storage = storage;
  }

  /**
   * Check if market can be auto-resolved
   */
  canAutoResolve(market: Market): boolean {
    const question = market.question.toLowerCase();

    // Crypto price markets
    if (
      question.includes("btc") ||
      question.includes("bitcoin") ||
      question.includes("eth") ||
      question.includes("ethereum")
    ) {
      return true;
    }

    // Add more patterns as needed
    // - Sports scores (if API available)
    // - Election results (if API available)
    // - Weather data (if API available)

    return false;
  }

  /**
   * Resolve market using AI and data aggregation
   */
  async resolveMarket(market: Market): Promise<ResolutionResult> {
    console.log(`[Oracle Resolver] Resolving market ${market.marketId}`);

    // Check if market has reached resolution time
    const now = Math.floor(Date.now() / 1000);
    if (now < Number(market.resolutionTime)) {
      throw new Error("Market has not reached resolution time yet");
    }

    // Fetch data from multiple sources
    const sources = await this.fetchDataSources(market);

    if (sources.length === 0) {
      throw new Error("No data sources available for this market");
    }

    // Use AI to analyze data and determine outcome
    const aiAnalysis = await this.analyzeWithAI(market, sources);

    // Store evidence on 0G Storage
    let proofHash: string | undefined;
    try {
      const uploadResult = await this.storage.uploadEvidence({
        marketId: market.marketId.toString(),
        question: market.question,
        outcome: aiAnalysis.outcome === Outcome.OUTCOME_A ? market.outcomeA : market.outcomeB,
        sources,
        consensus: aiAnalysis.consensus,
        timestamp: Date.now(),
      });
      proofHash = uploadResult.rootHash;
      console.log(`[Oracle Resolver] Evidence stored: ${proofHash}`);
    } catch (error) {
      console.warn("[Oracle Resolver] Failed to store evidence:", error);
    }

    return {
      ...aiAnalysis,
      sources,
      proofHash,
    };
  }

  /**
   * Fetch data from multiple sources
   */
  private async fetchDataSources(market: Market): Promise<DataSource[]> {
    const sources: DataSource[] = [];
    const question = market.question.toLowerCase();

    // Crypto price sources
    if (question.includes("btc") || question.includes("bitcoin")) {
      await this.fetchCryptoPrice("bitcoin", "BTC", sources);
    } else if (question.includes("eth") || question.includes("ethereum")) {
      await this.fetchCryptoPrice("ethereum", "ETH", sources);
    }

    return sources;
  }

  /**
   * Fetch crypto price from multiple APIs
   */
  private async fetchCryptoPrice(
    coinId: string,
    symbol: string,
    sources: DataSource[]
  ): Promise<void> {
    // CoinGecko
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
        { next: { revalidate: 60 } }
      );
      if (response.ok) {
        const data = await response.json();
        sources.push({
          name: "CoinGecko",
          url: `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}`,
          data: { price: data[coinId]?.usd, currency: "USD" },
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error("CoinGecko API error:", error);
    }

    // Binance
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`,
        { next: { revalidate: 60 } }
      );
      if (response.ok) {
        const data = await response.json();
        sources.push({
          name: "Binance",
          url: `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`,
          data: { price: parseFloat(data.price), currency: "USDT" },
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error("Binance API error:", error);
    }

    // Coinbase
    try {
      const response = await fetch(
        `https://api.coinbase.com/v2/prices/${symbol}-USD/spot`,
        { next: { revalidate: 60 } }
      );
      if (response.ok) {
        const data = await response.json();
        sources.push({
          name: "Coinbase",
          url: `https://api.coinbase.com/v2/prices/${symbol}-USD/spot`,
          data: { price: parseFloat(data.data.amount), currency: "USD" },
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error("Coinbase API error:", error);
    }
  }

  /**
   * Use AI to analyze data and determine outcome
   */
  private async analyzeWithAI(
    market: Market,
    sources: DataSource[]
  ): Promise<Omit<ResolutionResult, "sources" | "proofHash">> {
    const systemPrompt = `You are an oracle resolver for prediction markets. Your task is to analyze data from multiple sources and determine the correct outcome.

Rules:
1. Be objective and data-driven
2. Consider all sources equally
3. If sources disagree significantly, note the discrepancy
4. Provide clear reasoning for your decision
5. Return JSON format ONLY

Response format:
{
  "outcome": "OUTCOME_A" | "OUTCOME_B",
  "confidence": <number 0-100>,
  "reasoning": "<explanation>",
  "consensus": "<summary of data>"
}`;

    const userPrompt = `Resolve this prediction market:

**Question**: ${market.question}
**Outcome A**: ${market.outcomeA}
**Outcome B**: ${market.outcomeB}
**Resolution Time**: ${new Date(Number(market.resolutionTime) * 1000).toISOString()}

**Data Sources** (${sources.length} sources):
${sources
  .map(
    (s, i) =>
      `${i + 1}. ${s.name}: ${JSON.stringify(s.data)} (fetched at ${new Date(s.timestamp).toISOString()})`
  )
  .join("\n")}

Determine which outcome is correct based on the data. Return JSON only.`;

    try {
      const result = await this.compute.inference({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3, // Lower temperature for more deterministic results
        maxTokens: 500,
      });

      // Parse AI response
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        outcome:
          parsed.outcome === "OUTCOME_A"
            ? Outcome.OUTCOME_A
            : parsed.outcome === "OUTCOME_B"
              ? Outcome.OUTCOME_B
              : Outcome.INVALID,
        confidence: Math.min(100, Math.max(0, parsed.confidence || 0)),
        reasoning: parsed.reasoning || "AI analysis completed",
        consensus: parsed.consensus || "Data consensus reached",
      };
    } catch (error) {
      console.error("[Oracle Resolver] AI analysis failed:", error);

      // Fallback: Simple majority vote based on sources
      return this.fallbackResolution(market, sources);
    }
  }

  /**
   * Fallback resolution when AI fails
   */
  private fallbackResolution(
    market: Market,
    sources: DataSource[]
  ): Omit<ResolutionResult, "sources" | "proofHash"> {
    // For crypto price markets, calculate average and check against threshold
    const question = market.question.toLowerCase();
    const priceMatch = question.match(/\$?([\d,]+)/);

    if (priceMatch && sources.length > 0) {
      const targetPrice = parseFloat(priceMatch[1].replace(/,/g, ""));
      const prices = sources.map((s) => s.data.price).filter((p) => p > 0);

      if (prices.length > 0) {
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const reached = avgPrice >= targetPrice;

        // Determine which outcome represents "price reached"
        const outcomeA = market.outcomeA.toLowerCase();
        const isOutcomeAYes =
          outcomeA.includes("yes") || outcomeA.includes("reach") || outcomeA.includes("above");

        const outcome = (reached && isOutcomeAYes) || (!reached && !isOutcomeAYes)
          ? Outcome.OUTCOME_A
          : Outcome.OUTCOME_B;

        return {
          outcome,
          confidence: 90,
          reasoning: `Average price from ${sources.length} sources: $${avgPrice.toFixed(2)}. Target: $${targetPrice}. ${reached ? "Target reached" : "Target not reached"}.`,
          consensus: `${sources.length} price feeds averaged to $${avgPrice.toFixed(2)}`,
        };
      }
    }

    // Default to INVALID if we can't determine
    return {
      outcome: Outcome.INVALID,
      confidence: 0,
      reasoning: "Insufficient data to determine outcome",
      consensus: "No consensus reached",
    };
  }
}

/**
 * Create singleton oracle resolver
 */
let resolverInstance: OracleResolver | null = null;

export async function getOracleResolver(): Promise<OracleResolver> {
  if (!resolverInstance) {
    const { getZGCompute } = await import("../0g/compute");
    const { getZGStorage } = await import("../0g/storage");

    const compute = await getZGCompute();
    const storage = await getZGStorage();

    resolverInstance = new OracleResolver(compute, storage);
  }

  return resolverInstance;
}
