"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import Preloader from "@/components/Preloader";

export default function GuidePage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Preloader />
            <Navbar account="" connectWallet={() => { }} /> {/* Placeholder auth for static page */}

            <main className="pt-24 min-h-screen">
                <div className="py-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">PROTOCOL <span className="text-[var(--color-zg-purple)]">GUIDE</span></h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">Understanding the cryptographic settlement layer of WordWars.</p>
                </div>

                <HowItWorks />

                <div className="max-w-4xl mx-auto px-4 pb-24 prose prose-invert">
                    <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                            <h3 className="font-bold mb-2 text-white">How are outcomes verified?</h3>
                            <p className="text-gray-400">We utilize 0G Compute nodes that execute off-chain verification scripts and post a Zero-Knowledge Proof (ZKP) to the settlement contract. This ensures no central authority can manipulate the result.</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                            <h3 className="font-bold mb-2 text-white">What is the Platform Fee?</h3>
                            <p className="text-gray-400">A flat 1% fee is applied to winning shares to fund protocol maintenance and the 0G Storage/Compute costs.</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
