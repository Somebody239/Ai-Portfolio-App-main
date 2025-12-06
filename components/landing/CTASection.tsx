"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
    return (
        <section className="relative w-full bg-zinc-950 py-24 md:py-32">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="container relative z-10 mx-auto px-4 md:px-6"
            >
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                        Ready to Transform Your{" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
                            College Application
                        </span>{" "}
                        Journey?
                    </h2>
                    <p className="mb-10 text-lg text-zinc-400 md:text-xl">
                        Join thousands of students using Path2Uni to organize their portfolios, track their progress, and get into their dream universities.
                    </p>

                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Link href="/login">
                            <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-black shadow-lg shadow-white/10 transition-all duration-300 hover:bg-zinc-200 sm:w-auto">
                                Start Building Your Portfolio
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </Link>
                    </div>

                    <p className="mt-6 text-sm text-zinc-500">
                        Free to start. No credit card required.
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
