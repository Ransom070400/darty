"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Wallet, TrendingUp, Trophy, ArrowRight, Zap, Target, MousePointer2 } from "lucide-react";
import { useRef } from "react";

const STEPS = [
    {
        id: "01",
        title: "Connect Identity",
        desc: "Link your verified wallet to the Zero Gravity Network.",
        icon: <Wallet className="w-6 h-6" />,
        stat: "SECURE"
    },
    {
        id: "02",
        title: "Execute Prediction",
        desc: "Deploy capital into a market contract.",
        icon: <Target className="w-6 h-6" />,
        stat: "INSTANT"
    },
    {
        id: "03",
        title: "Claim Settlement",
        desc: "Automated payout via smart contract logic.",
        icon: <Trophy className="w-6 h-6" />,
        stat: "TRUSTLESS"
    }
];

export default function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    // Animate the pipeline line filling
    const lineFill = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

    return (
        <section ref={containerRef} id="how-it-works" className="py-32 bg-[#050505] relative overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)",
                    backgroundSize: "50px 50px"
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-blue-500/30 bg-blue-500/5 mb-6"
                    >
                        <Zap className="w-3 h-3 text-blue-400" />
                        <span className="text-xs font-mono text-blue-300 uppercase tracking-widest">Protocol Logic</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl font-medium tracking-tighter text-white mb-6">
                        EXECUTION <span className="font-serif italic text-gray-500">PIPELINE</span>
                    </h2>
                </div>

                <div className="relative">
                    {/* The Schematic Pipeline Line */}
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 hidden md:block rounded-full" />
                    <motion.div
                        style={{ width: lineFill }}
                        className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 -translate-y-1/2 hidden md:block shadow-[0_0_20px_rgba(59,130,246,0.5)] rounded-full z-0"
                    />

                    <div className="grid md:grid-cols-3 gap-12 relative z-10">
                        {STEPS.map((step, index) => (
                            <PipelineNode key={step.id} step={step} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function PipelineNode({ step, index }: { step: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="group relative"
        >
            {/* Connection Node (Center) */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border-2 border-white/10 items-center justify-center z-10 group-hover:border-blue-500 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            </div>

            {/* Card Content */}
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden group-hover:translate-y-[-5px]">
                {/* ID Watermark */}
                <div className="absolute -right-4 -top-4 text-8xl font-black text-white/[0.02] group-hover:text-blue-500/[0.05] transition-colors select-none">
                    {step.id}
                </div>

                <div className="flex justify-between items-start mb-6 relative">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-sm text-gray-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                        {step.icon}
                    </div>
                    <div className="text-[10px] font-mono border border-white/10 px-2 py-1 rounded-sm text-gray-500 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-colors">
                        {step.stat}
                    </div>
                </div>

                <h3 className="text-xl font-medium text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {step.title}
                </h3>
                <p className="text-sm text-gray-400 font-mono leading-relaxed">
                    {step.desc}
                </p>
            </div>
        </motion.div>
    );
}
