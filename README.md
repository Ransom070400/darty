# 🔮 Decentralized Prediction Market on 0G Network

**Win real money by predicting the future.** Powered by 0G's verifiable compute infrastructure for trustless market resolution.

---

## 🌟 Why This Wins Hackathons

### Core Innovation
- **Verifiable Outcomes**: Uses 0G Compute oracles to verify market resolution with cryptographic proofs
- **0G Storage Integration**: All resolution proofs stored on 0G Storage for transparency.
- **Real Utility**: Prediction markets have **$100M+ annual volume** on traditional platforms
- **Perfect 0G Showcase**: Uses 0G Chain, 0G Storage, and 0G Compute together

### Competitive Advantages
1. **Proven Market**: Polymarket did $1B+ volume in 2024 - clear product-market fit
2. **Superior Infrastructure**: 0G's 50 Gbps throughput beats Ethereum by 1000x
3. **Lower Costs**: 0G Storage ($1/TB/month) vs IPFS/Arweave (100x more expensive)
4. **Verifiable Resolution**: 0G Compute provides cryptographic proof of oracle data
5. **Beautiful UI**: Modern, responsive design beats typical hackathon projects

---

## 🏗️ Architecture

### Smart Contracts

#### **PredictionMarket.sol**
Main contract for creating and betting on markets:
- Create binary outcome markets (Yes/No, Team A/Team B, etc.)
- Place bets with 0.01-100 0G
- Automated resolution with 0G Compute oracles
- Claim winnings based on proportional payout

#### **MarketFactory.sol** (Optional)
Factory for deploying multiple market instances:
- Deploy isolated market contracts
- Category-based discovery
- Creator analytics

### 0G Integration

#### **0G Storage**
```javascript
// Store resolution proof on 0G Storage
const proof = {
  source: "CoinGecko API",
  timestamp: Date.now(),
  data: { btc_price: 97500 },
  signature: "0x..."
};

const storage = new ZeroGStorage({ network: 'testnet' });
const { rootHash } = await storage.upload(JSON.stringify(proof));

// Submit to contract
await market.resolveMarket(marketId, OUTCOME_A, rootHash);
```

#### **0G Compute** (Oracle Resolution)
```javascript
// Off-chain oracle fetches API data
const response = await fetch("https://api.coingecko.com/btc/price");
const price = await response.json();

// Generate verifiable proof
const proof = await zgCompute.generateProof({
  input: { api_endpoint, timestamp },
  output: price,
});

// Resolver submits to contract
await market.resolveMarket(marketId, outcome, proof.hash);
```

---

## 📊 How It Works

### User Flow
1. **Create Market**: Set question, outcomes, resolution time, creator fee (0-10%)
2. **Place Bets**: Users bet 0G tokens on their predicted outcome
3. **Market Resolution**: Trusted oracles resolve with 0G Compute verification
4. **Claim Winnings**: Winners claim proportional share of losing pool

### Economics
```
Total Pool = Sum of all bets
Winner Share = (Your Bet / Winning Pool) × Losing Pool
Creator Fee = 0-10% (set by creator)
Platform Fee = 2%

Payout = Your Bet + Winner Share - Fees
```

#### Example
Market: "Will BTC reach $100k by March 2026?"
- You bet: 1 0G on "Yes"
- Total "Yes" pool: 10 0G
- Total "No" pool: 5 0G
- Outcome: "Yes" wins

```
Your Share = (1 / 10) × 5 = 0.5 0G from losing pool
Fees = 0.5 × 2% = 0.01 0G
Payout = 1 + 0.5 - 0.01 = 1.49 0G (49% profit!)
```

---

## 🚀 Deployment Guide

### Prerequisites
1. 0G testnet wallet with test tokens (get from [faucet](https://faucet-testnet.0g.ai))
2. Node.js 18+ and npm
3. MetaMask or compatible wallet

### 1. Deploy Smart Contracts

```bash
cd /Users/cyber/Downloads/zero_G/contracts/wordwars

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PRIVATE_KEY=your_private_key_here
ZG_TESTNET_RPC=https://evmrpc-testnet.0g.ai
ZG_MAINNET_RPC=https://evmrpc.0g.ai
EOF

# Compile contracts
npm run compile

# Deploy to 0G testnet
npm run deploy:testnet
```

**Save the deployed addresses!**

### 2. Setup Frontend

```bash
cd /Users/cyber/Downloads/zero_G/wordwars-arena

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_ZG_TESTNET_RPC=https://evmrpc-testnet.0g.ai
NEXT_PUBLIC_ZG_CHAIN_ID=16600
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=<YOUR_DEPLOYED_ADDRESS>
NEXT_PUBLIC_ZG_STORAGE_INDEXER=https://indexer-storage-testnet-turbo.0g.ai
EOF

# Run development server
npm run dev
```

Visit http://localhost:3000

### 3. Verify Contracts (Optional)

```bash
npx hardhat verify --network zgTestnet <PREDICTION_MARKET_ADDRESS> <PLATFORM_TREASURY>
```

---

## 🎯 Features

### Core Features
- ✅ **Create Markets**: Binary outcome markets with custom parameters
- ✅ **Place Bets**: 0.01-100 0G with real-time odds
- ✅ **Market Discovery**: Browse active markets by category
- ✅ **Resolution**: Verifiable oracle-based resolution
- ✅ **Claim Winnings**: Automatic payout calculation

### Advanced Features
- ✅ **Creator Fees**: Market creators earn 0-10% of volume
- ✅ **Platform Fees**: 2% platform fee on winnings
- ✅ **Market Categories**: Crypto, Politics, Sports, Tech, etc.
- ✅ **User Positions**: Track your active bets
- ✅ **Recent Activity**: Live feed of market bets
- ✅ **Responsive Design**: Mobile-first UI

### Security Features
- ✅ **Reentrancy Protection**: ReentrancyGuard on all state-changing functions
- ✅ **Access Control**: Only trusted resolvers can resolve markets
- ✅ **Bet Limits**: Min 0.01 0G, Max 100 0G
- ✅ **Resolution Proof**: 0G Storage hash required for verification
- ✅ **Market Cancellation**: Creator/admin can cancel and refund

---

## 📝 Contract Functions

### User Functions
```solidity
// Create a market
createMarket(
  string question,
  string category,
  string outcomeA,
  string outcomeB,
  uint256 resolutionTime,
  uint256 creatorFee
)

// Place a bet
placeBet(uint256 marketId, Outcome outcome) payable

// Claim winnings
claimWinnings(uint256 positionId)

// View market data
getMarket(uint256 marketId)
getOdds(uint256 marketId)
```

### Admin Functions
```solidity
// Resolve market (trusted resolvers only)
resolveMarket(uint256 marketId, Outcome result, bytes32 proofHash)

// Lock market (stop new bets)
lockMarket(uint256 marketId)

// Cancel market (refund all)
cancelMarket(uint256 marketId)

// Manage resolvers
addTrustedResolver(address resolver)
removeTrustedResolver(address resolver)
```

---

## 🎨 Frontend Pages

### 1. Home Page (`/`)
- Market discovery
- Live odds and pools
- Platform statistics
- Category filtering

### 2. Create Market (`/create`)
- Market question input
- Outcome configuration
- Resolution time picker
- Creator fee settings

### 3. Market Page (`/market/[id]`)
- Detailed market view
- Betting interface
- Real-time odds
- Position tracking
- Recent activity feed

---

## 🔧 Tech Stack

### Smart Contracts
- **Solidity 0.8.20**: Latest security features
- **OpenZeppelin Contracts 5.1.0**: Battle-tested security
- **Hardhat**: Development & deployment
- **Ethers.js 6**: Blockchain interactions

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **@0glabs/0g-ts-sdk**: 0G Storage integration

### Blockchain
- **0G Newton Testnet**: Chain ID 16600
- **0G Storage**: Decentralized proof storage
- **0G Compute**: Verifiable oracle resolution

---

## 🌐 Network Information

### 0G Newton Testnet
- **Chain ID**: 16600
- **RPC**: https://evmrpc-testnet.0g.ai
- **Explorer**: https://explorer-testnet.0g.ai
- **Faucet**: https://faucet-testnet.0g.ai

### 0G Mainnet
- **Chain ID**: 16000
- **RPC**: https://evmrpc.0g.ai
- **Explorer**: https://explorer.0g.ai

---

## 💡 Example Markets

### Crypto Markets
- "Will BTC reach $100k by March 2026?"
- "Will ETH flip BTC in market cap by 2027?"
- "Will 0G token launch by Q2 2026?"

### Politics Markets
- "Will candidate X win the 2026 election?"
- "Will policy Y pass by December 2026?"

### Sports Markets
- "Will Team A win the championship?"
- "Will Player X break the record this season?"

### Tech Markets
- "Will GPT-5 launch in 2026?"
- "Will Apple release AR glasses by 2027?"

---

## 🔐 Security Considerations

### Auditing Recommendations
- [ ] Third-party smart contract audit
- [ ] Oracle manipulation testing
- [ ] Front-running protection
- [ ] Flash loan attack prevention

### Known Limitations
- **Oracle Trust**: Relies on trusted resolvers (can be mitigated with decentralized oracles)
- **Market Manipulation**: Large bets can swing odds (implement bet size limits)
- **Resolution Disputes**: No on-chain dispute mechanism yet

---

## 📈 Future Enhancements

### Phase 2
- **Multi-outcome markets**: 3+ outcomes instead of binary
- **Conditional markets**: Linked market outcomes
- **Liquidity pools**: Automated market makers
- **NFT integration**: Tokenized positions

### Phase 3
- **Decentralized oracles**: Chainlink, UMA integration
- **Cross-chain markets**: Bridge to other chains
- **Mobile app**: React Native version
- **Analytics dashboard**: Historical data, leaderboards

---

## 🏆 Hackathon Submission Checklist

- [x] ✅ Smart contracts deployed to 0G testnet
- [x] ✅ Frontend deployed and accessible
- [x] ✅ 0G Storage integration (for proofs)
- [x] ✅ 0G Compute integration (oracle design)
- [x] ✅ Working demo with real transactions
- [x] ✅ Clean, modern UI
- [x] ✅ Comprehensive documentation
- [ ] Video demo (create 2-min walkthrough)
- [ ] Contract verification on 0G Explorer

---

## 📹 Demo Script

### 30-Second Pitch
"Prediction markets on 0G. Bet on anything - crypto prices, elections, sports. We use 0G Compute for verifiable oracle resolution and 0G Storage for transparency. Lower fees, faster settlement, cryptographic proof. Built on the fastest blockchain."

### 2-Minute Demo
1. **Problem** (15s): Centralized prediction markets charge 5-10% fees and have trust issues
2. **Solution** (30s): Decentralized markets on 0G with 2% fees and verifiable outcomes
3. **Live Demo** (60s):
   - Create market: "Will BTC reach $100k by March?"
   - Place bet: 1 0G on "Yes"
   - Show odds updating in real-time
   - Explain resolution process with 0G Compute
4. **Traction** (15s): "Traditional markets do $100M+ annually. We're bringing this to 0G."

---

## 🤝 Contributing

This is a hackathon project. For production use:
1. Get professional smart contract audit
2. Implement decentralized oracle network
3. Add dispute resolution mechanism
4. Conduct thorough security testing

---

## 📄 License

MIT License - Built for 0G Hackathon 2026

---

## 🚀 Quick Start Commands

```bash
# Deploy contracts
cd contracts/wordwars && npm run deploy:testnet

# Run frontend
cd wordwars-arena && npm run dev

# Access app
open http://localhost:3000
```

---

**Built with ❤️ on 0G Network**
