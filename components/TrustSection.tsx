"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Shield, Lock, Database, Cpu, CheckCircle, Activity, Hash, Server } from "lucide-react";
import { useState, useEffect } from "react";

const FEATURES = [
    {
        icon: <Cpu className="w-6 h-6" />,
        title: "Verifiable Compute",
        desc: "Off-chain execution, on-chain proof.",
        stat: "99.9% Uptime",
        hash: "0x7a...9e21"
    },
    {
        icon: <Database className="w-6 h-6" />,
        title: "0G Storage Layer",
        desc: "Permanent, immutable data availability.",
        stat: "50ms Latency",
        hash: "0x3b...a1b4"
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: "Trustless Settlement",
        desc: "Smart contracts enforce every payout.",
        stat: "Automated",
        hash: "0x9c...f4d2"
    },
    {
        icon: <Lock className="w-6 h-6" />,
        title: "ZK-Proof Security",
        desc: "Zero-knowledge verification of all outcomes.",
        stat: "Encrypted",
        hash: "0x1d...8e9f"
    }
];

export default function TrustSection() {
    const [blockHeight, setBlockHeight] = useState(18249210);

    // Simulate block height increasing
    useEffect(() => {
        const interval = setInterval(() => {
            setBlockHeight(prev => prev + 1);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-32 bg-[var(--color-zg-black)] relative overflow-hidden">
            {/* Background Circuitry */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle at center, #ffffff 1px, transparent 1px)",
                    backgroundSize: "24px 24px"
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    {/* Left: Manifesto */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-zg-purple)]/30 bg-[var(--color-zg-purple)]/5 mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-[var(--color-zg-purple)] animate-pulse" />
                            <span className="text-xs font-mono text-[var(--color-zg-purple)] uppercase tracking-wider">Cryptographic Truth</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
                            DON'T TRUST. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-zg-purple)] to-white">VERIFY.</span>
                        </h2>

                        <p className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
                            Traditional markets rely on central authorities. <span className="text-white font-medium">Dart</span> relies on math.
                            Built on the 0G Network, every prediction, outcome, and payout is cryptographically proven and permanently stored.
                        </p>

                        <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-green-500" />
                                LIVE NETWORK STATUS
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div>BLOCK: #{blockHeight.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Right: The "Secure Enclave" Grid */}
                    <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {FEATURES.map((feature, index) => (
                            <VerificationCard key={feature.title} feature={feature} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function VerificationCard({ feature, index }: { feature: any, index: number }) {
    const [verified, setVerified] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onHoverStart={() => setVerified(true)}
            onHoverEnd={() => setVerified(false)}
            className="group relative bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-[var(--color-zg-purple)]/50 transition-all duration-300 min-h-[180px]"
        >
            {/* "Scanning" Bar */}
            <div className="absolute top-0 left-0 h-0.5 bg-[var(--color-zg-purple)] w-0 group-hover:w-full transition-all duration-700 ease-in-out" />

            <div className="p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-[var(--color-zg-purple)]/20 group-hover:border-[var(--color-zg-purple)]/30 transition-colors`}>
                        <div className="group-hover:scale-110 transition-transform duration-300 text-gray-300 group-hover:text-[var(--color-zg-purple)]">
                            {verified ? <CheckCircle className="w-6 h-6" /> : feature.icon}
                        </div>
                    </div>

                    <div className="text-[10px] font-mono text-gray-600 group-hover:text-[var(--color-zg-purple)] transition-colors flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {verified ? "VERIFIED" : "PENDING"}
                    </div>
                </div>

                <div>
                    <h3 className="text-white font-bold mb-1 group-hover:text-[var(--color-zg-purple)] transition-colors">{feature.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">{feature.desc}</p>

                    <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-gray-500">{feature.hash}</span>
                        <span className="text-[10px] font-bold text-gray-300 bg-white/5 px-2 py-0.5 rounded-sm">{feature.stat}</span>
                    </div>
                </div>
            </div>

            {/* Background Verification flash */}
            <div className={`absolute inset-0 bg-[var(--color-zg-purple)]/5 pointer-events-none transition-opacity duration-300 ${verified ? 'opacity-100' : 'opacity-0'}`} />
        </motion.div>
    );
}
