"use client";

import { motion } from "framer-motion";
import { Brain, TrendingUp, Target, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    className?: string;
    gradient?: string;
}

function FeatureCard({ title, description, icon, className, gradient }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80",
                className
            )}
        >
            {/* Background gradient */}
            <div className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                gradient || "bg-gradient-to-br from-emerald-500/10 to-transparent"
            )} />

            <div className="relative z-10">
                <div className="mb-4 inline-flex rounded-xl bg-white/5 p-3 text-white border border-white/10">
                    {icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
        </motion.div>
    );
}

export function FeaturesSection() {
    return (
        <section className="relative w-full bg-zinc-950 py-24 md:py-32 overflow-hidden">
            {/* Background grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                        Everything You Need to <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">Succeed</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-zinc-400">
                        Powerful tools to track, analyze, and optimize your university application portfolio
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <FeatureCard
                        title="AI-Powered Insights"
                        description="Get intelligent recommendations based on your academic profile, extracurriculars, and target universities."
                        icon={<Brain className="h-6 w-6" />}
                        className="md:col-span-2"
                        gradient="bg-gradient-to-br from-emerald-500/10 to-transparent"
                    />

                    <FeatureCard
                        title="GPA Tracking"
                        description="Automatically calculate weighted and unweighted GPA with support for AP, IB, and Honors courses."
                        icon={<TrendingUp className="h-6 w-6" />}
                        gradient="bg-gradient-to-br from-amber-500/10 to-transparent"
                    />

                    <FeatureCard
                        title="University Comparison"
                        description="Compare your stats with admission requirements and see if schools are Safety, Target, or Reach."
                        icon={<Target className="h-6 w-6" />}
                        gradient="bg-gradient-to-br from-rose-500/10 to-transparent"
                    />

                    <FeatureCard
                        title="Course Planning"
                        description="Plan your academic schedule across all four years of high school with our intuitive timeline view."
                        icon={<Calendar className="h-6 w-6" />}
                        className="md:col-span-2"
                        gradient="bg-gradient-to-br from-emerald-500/10 via-amber-500/10 to-transparent"
                    />

                    <FeatureCard
                        title="Test Score Management"
                        description="Track SAT, ACT, AP, and IB scores in one place. See how you stack up against your target schools."
                        icon={<TrendingUp className="h-6 w-6" />}
                        className="md:col-span-2"
                        gradient="bg-gradient-to-br from-amber-500/10 to-rose-500/10"
                    />
                </div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 grid grid-cols-1 gap-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 backdrop-blur-sm sm:grid-cols-3"
                >
                    <div className="text-center">
                        <div className="mb-2 text-4xl font-bold text-white">99.9%</div>
                        <div className="text-sm text-zinc-400">GPA Calculation Accuracy</div>
                    </div>
                    <div className="text-center">
                        <div className="mb-2 text-4xl font-bold text-white">Unlimited</div>
                        <div className="text-sm text-zinc-400">Courses & Activities</div>
                    </div>
                    <div className="text-center">
                        <div className="mb-2 text-4xl font-bold text-white">AI-Powered</div>
                        <div className="text-sm text-zinc-400">Personalized Insights</div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
