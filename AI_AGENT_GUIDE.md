# AI Agent System Guide

## Overview

WordWars Arena features a complete AI-powered prediction market system using 0G Network's verifiable compute and decentralized storage. This guide covers all AI agent features and the complete end-to-end flow.

---

## System Architecture

```
User → Frontend → API Routes → 0G Compute (AI) → 0G Storage (Evidence) → Blockchain
```

### Components:

1. **0G Compute** - Verifiable AI inference with TEEML proofs
2. **0G Storage** - Decentralized storage for evidence
3. **Smart Contract** - On-chain market resolution
4. **Frontend** - User interfaces for all interactions

---

## AI Agents

### 1. Chat Assistant (`/lib/ai/chat-assistant.ts`)

**Purpose**: Personalized advice for users on prediction markets

**Features**:
- Context-aware responses (knows current page, user address, market data)
- Market analysis and probability insights
- Risk warnings and betting advice
- Suggestion chips for quick actions

**API Endpoint**: `POST /api/ai/chat`

**Usage**:
```typescript
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Should I bet on this market?' }],
    context: {
      userAddress: '0x...',
      currentPage: '/market/123',
      currentMarket: { /* market data */ }
    }
  })
});
```

**UI Component**: Floating chat widget (bottom-right corner)

---

### 2. Market Analyzer (`/lib/ai/market-analyzer.ts`)

**Purpose**: AI-powered probability predictions for markets

**Features**:
- Analyzes market question and category
- Generates probability estimates
- Provides reasoning and confidence scores
- Caches results for 5 minutes

**API Endpoint**: `POST /api/ai/analyze`

**Usage**:
```typescript
const response = await fetch('/api/ai/analyze', {
  method: 'POST',
  body: JSON.stringify({
    question: 'Will Bitcoin reach $100k by end of 2024?',
    category: 'Crypto',
    outcomeA: 'Yes',
    outcomeB: 'No'
  })
});
```

**UI Integration**: Shown on market detail pages with animated probability meters

---

### 3. Oracle Resolver (`/lib/ai/oracle-resolver.ts`)

**Purpose**: Automatic market resolution using multi-source data aggregation

**Features**:
- Auto-detection of resolvable markets (crypto prices, sports, weather)
- Fetches data from multiple sources (CoinGecko, Binance, Coinbase)
- AI analysis using 0G Compute
- Evidence storage on 0G Storage
- Fallback logic using price averages

**API Endpoints**:
- `POST /api/ai/resolve` - Resolve market with AI
- `GET /api/ai/resolve?marketId=X` - Check if market can be auto-resolved

**Supported Market Types**:
- ✅ Crypto prices (BTC, ETH)
- ⚠️ Sports scores (API integration needed)
- ⚠️ Election results (API integration needed)
- ⚠️ Weather data (API integration needed)

**Usage**:
```typescript
// Check if market can be auto-resolved
const check = await fetch('/api/ai/resolve?marketId=123');

// Resolve market
const resolution = await fetch('/api/ai/resolve', {
  method: 'POST',
  body: JSON.stringify({ marketId: 123 })
});

// Returns:
{
  success: true,
  resolution: {
    outcome: 1, // OUTCOME_A or OUTCOME_B
    confidence: 95,
    reasoning: "Average price from 3 sources: $98,500. Target: $100,000. Target not reached.",
    consensus: "3 price feeds averaged to $98,500",
    proofHash: "0x...", // 0G Storage hash for verification
    sources: [
      { name: "CoinGecko", data: { price: 98000 }, timestamp: 1234567890 },
      { name: "Binance", data: { price: 98500 }, timestamp: 1234567890 },
      { name: "Coinbase", data: { price: 99000 }, timestamp: 1234567890 }
    ]
  }
}
```

---

## User Interfaces

### 1. Resolution Interface (`/app/resolve/page.tsx`)

**Purpose**: Admin interface for resolving markets with AI assistance

**Access**: `/resolve`

**Features**:
- Lists all active markets past resolution time
- "Get AI Resolution" button
- Shows AI analysis:
  - Outcome (which side won)
  - Confidence percentage
  - Reasoning (natural language explanation)
  - Data sources (CoinGecko, Binance, Coinbase)
  - Proof hash (0G Storage verification)
- "Submit to Blockchain" button
- Wallet connection required

**Flow**:
1. Connect wallet
2. View markets ready for resolution
3. Click "Get AI Resolution"
4. Review AI analysis
5. Click "Submit to Blockchain"
6. Confirm transaction in wallet
7. Market resolved on-chain

---

### 2. Claims Interface (`/app/claims/page.tsx`)

**Purpose**: Users claim winnings from resolved markets

**Access**: `/claims`

**Features**:
- Lists all claimable positions
- Shows total winnings available
- "Claim All" button for batch claiming
- Individual "Claim" buttons
- Displays profit percentage
- Beautiful animations and toasts

**Flow**:
1. Connect wallet
2. View claimable positions
3. Click "Claim Winnings" (individual) or "Claim All"
4. Confirm transaction in wallet
5. Winnings sent to wallet

**Display Information**:
- Market question
- Your bet (outcome + amount)
- Your payout
- Profit percentage
- Resolution date

---

## Complete End-to-End Flow

### Phase 1: Market Creation
1. User creates market via `/create`
2. Market deployed to blockchain
3. Market appears on homepage

### Phase 2: Betting
1. Users view market on `/market/[id]`
2. AI analyzer shows probability prediction
3. Chat assistant provides personalized advice
4. Users place bets
5. Positions recorded on-chain

### Phase 3: Market Active
- Users can continue betting until resolution time
- Market odds update in real-time
- Chat assistant provides ongoing advice

### Phase 4: Auto-Resolution (Admin)
1. Market reaches resolution time
2. Admin visits `/resolve`
3. Market appears in resolution list
4. Admin clicks "Get AI Resolution"
5. Oracle resolver:
   - Fetches data from 3+ sources
   - AI analyzes data using 0G Compute
   - Evidence stored on 0G Storage
   - Returns resolution + proof hash
6. Admin reviews AI analysis
7. Admin clicks "Submit to Blockchain"
8. Market resolved on-chain with proof hash

### Phase 5: Claims (Winners)
1. Winners visit `/claims`
2. Claimable positions displayed
3. User clicks "Claim Winnings"
4. Payout sent to wallet
5. Position marked as claimed

---

## Data Verification

### 0G Storage Evidence

All resolution evidence is stored on 0G Storage with the following structure:

```json
{
  "type": "resolution_evidence",
  "version": "1.0",
  "marketId": "123",
  "question": "Will Bitcoin reach $100k by end of 2024?",
  "outcome": "No",
  "sources": [
    {
      "name": "CoinGecko",
      "url": "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin",
      "data": { "price": 98000, "currency": "USD" },
      "timestamp": 1234567890
    },
    {
      "name": "Binance",
      "url": "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
      "data": { "price": 98500, "currency": "USDT" },
      "timestamp": 1234567890
    },
    {
      "name": "Coinbase",
      "url": "https://api.coinbase.com/v2/prices/BTC-USD/spot",
      "data": { "price": 99000, "currency": "USD" },
      "timestamp": 1234567890
    }
  ],
  "consensus": "3 price feeds averaged to $98,500",
  "timestamp": 1234567890
}
```

**Merkle Root**: Stored on-chain as `proofHash`

**Verification**:
1. Download evidence from 0G Storage using `proofHash`
2. Verify Merkle root matches
3. Check data sources
4. Validate consensus logic

---

## AI Prompts

### Chat Assistant System Prompt

```
You are an expert prediction market advisor on WordWars Arena, powered by 0G Network.

Your role:
- Analyze markets and provide probability insights
- Help users make informed betting decisions
- Explain market mechanics and risks
- Suggest relevant markets based on user interests

Guidelines:
1. Be honest about uncertainty
2. Always mention risks
3. Use data when available
4. Keep responses concise (2-3 sentences)
5. Include 1-2 actionable suggestions

Current Context:
- User Address: 0x...
- Current Page: /market/123
- Current Market: {...}
```

### Market Analyzer System Prompt

```
You are a prediction market analyst. Analyze the following market and provide probability estimates.

Market Question: [question]
Category: [category]
Outcome A: [outcomeA]
Outcome B: [outcomeB]

Return JSON format:
{
  "probabilityA": <0-100>,
  "probabilityB": <0-100>,
  "confidence": <0-100>,
  "reasoning": "<2-3 sentences>",
  "factors": ["factor1", "factor2", "factor3"]
}
```

### Oracle Resolver System Prompt

```
You are an oracle resolver for prediction markets. Analyze data from multiple sources and determine the correct outcome.

Rules:
1. Be objective and data-driven
2. Consider all sources equally
3. If sources disagree significantly, note the discrepancy
4. Provide clear reasoning for your decision
5. Return JSON format ONLY

Response format:
{
  "outcome": "OUTCOME_A" | "OUTCOME_B",
  "confidence": <0-100>,
  "reasoning": "<explanation>",
  "consensus": "<summary of data>"
}
```

---

## Configuration

### Environment Variables

```bash
# 0G Network
NEXT_PUBLIC_ZG_TESTNET_RPC=https://evmrpc-testnet.0g.ai
NEXT_PUBLIC_ZG_CHAIN_ID=16602
NEXT_PUBLIC_ZG_COMPUTE_BROKER=https://broker-turbo.0g.ai
NEXT_PUBLIC_ZG_STORAGE_INDEXER=https://indexer-storage-testnet-turbo.0g.ai

# AI Agent Private Key (for 0G Compute and Storage)
AI_AGENT_PRIVATE_KEY=0x...

# Contract Addresses
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=0x4023DCe2A80Ae29CeE3B9B6e4d1E76E614622FBB
```

### 0G Compute Settings

```typescript
{
  temperature: 0.8,    // Chat Assistant (creative)
  temperature: 0.7,    // Market Analyzer (balanced)
  temperature: 0.3,    // Oracle Resolver (deterministic)
  maxTokens: 500,
  model: "Meta-Llama-3.1-8B-Instruct-FP8"
}
```

---

## Cost Optimization

### Caching Strategy

- **Market Analysis**: 5-minute cache (reduces AI calls by ~80%)
- **Chat History**: Client-side storage (no server cost)
- **Evidence Storage**: Once per resolution (no redundant uploads)

### Fallback Logic

- **Chat Assistant**: Pre-defined helpful responses
- **Market Analyzer**: Current market odds as fallback
- **Oracle Resolver**: Simple price average without AI

---

## Error Handling

### AI Service Unavailable

```typescript
try {
  const result = await compute.inference({ /* ... */ });
  return parseAIResponse(result);
} catch (error) {
  console.error("AI failed, using fallback");
  return this.fallbackResponse();
}
```

### Data Source Failures

- Continue with available sources
- Require minimum 2 sources for resolution
- Note missing sources in evidence

### Blockchain Failures

- Show clear error messages
- Suggest gas increase if needed
- Allow retry without re-fetching AI data

---

## Testing

### Manual Testing Checklist

**Chat Assistant**:
- [ ] Open chat widget
- [ ] Send message
- [ ] Check context awareness
- [ ] Click suggestion chip
- [ ] Verify response quality

**Market Analyzer**:
- [ ] Create market
- [ ] Wait for AI analysis
- [ ] Verify probability display
- [ ] Check reasoning text
- [ ] Verify factors list

**Oracle Resolver**:
- [ ] Create crypto price market
- [ ] Wait for resolution time
- [ ] Visit `/resolve`
- [ ] Click "Get AI Resolution"
- [ ] Verify data sources
- [ ] Submit resolution
- [ ] Check on-chain proof hash

**Claims Interface**:
- [ ] Resolve market with winning position
- [ ] Visit `/claims`
- [ ] Verify claimable position appears
- [ ] Check payout calculation
- [ ] Claim winnings
- [ ] Verify wallet balance

---

## Security Considerations

### AI Agent Private Key

- Stored in `.env.local` (never commit)
- Used for 0G Compute and Storage
- Needs 0G testnet tokens for gas
- Separate from admin wallet

### Proof Verification

- All resolutions include 0G Storage proof hash
- Anyone can verify evidence
- Merkle tree ensures data integrity
- Tampering would change hash

### Access Control

- Resolution interface requires wallet connection
- Only intended for admins (no on-chain restriction yet)
- Consider adding admin whitelist

---

## Future Enhancements

### New Market Types

1. **Sports Scores** - Add ESPN/SportRadar APIs
2. **Election Results** - Add AP/Reuters APIs
3. **Weather Data** - Add NOAA/OpenWeatherMap APIs
4. **NFT Sales** - Add OpenSea/Blur APIs

### Advanced Features

1. **Automated Resolution** - Schedule cron job for auto-resolution
2. **Dispute System** - Allow users to challenge AI resolutions
3. **Multi-Agent Consensus** - Use multiple AI models and compare
4. **Confidence Thresholds** - Only auto-resolve if confidence > 90%

---

## Troubleshooting

### Issue: AI Analysis Not Loading

**Symptoms**: Spinner on market page, no probability shown

**Solutions**:
1. Check 0G Compute service status
2. Verify AI_AGENT_PRIVATE_KEY has 0G testnet tokens
3. Check browser console for errors
4. Verify NEXT_PUBLIC_ZG_COMPUTE_BROKER URL

### Issue: Resolution Fails

**Symptoms**: "Failed to resolve market" error

**Solutions**:
1. Check if market has reached resolution time
2. Verify market status is ACTIVE
3. Ensure wallet is connected
4. Check data sources are accessible
5. Review browser console for detailed error

### Issue: Claims Not Showing

**Symptoms**: No claimable positions when user won

**Solutions**:
1. Verify wallet is connected
2. Check if market is resolved
3. Ensure position hasn't been claimed already
4. Verify payout > 0 (winning side)
5. Check blockchain for position data

---

## Support & Resources

- **0G Network Docs**: https://docs.0g.ai
- **0G Compute SDK**: https://github.com/0glabs/0g-serving-broker
- **0G Storage SDK**: https://github.com/0glabs/0g-ts-sdk
- **Smart Contract**: 0x4023DCe2A80Ae29CeE3B9B6e4d1E76E614622FBB
- **GitHub**: https://github.com/shaibuafeez/darty

---

## Conclusion

The AI Agent System provides a complete end-to-end experience for prediction markets:

1. **Users** get AI-powered advice and probability predictions
2. **Admins** get automated resolution with verifiable evidence
3. **Winners** get seamless claims interface
4. **Everyone** benefits from transparent, verifiable AI decisions

All AI computations are verifiable via 0G Compute (TEEML proofs) and all evidence is stored permanently on 0G Storage with Merkle tree verification.
