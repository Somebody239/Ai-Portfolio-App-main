"use client";

import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { AppPreviewSection } from "@/components/landing/AppPreviewSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function LandingView() {
    return (
        <main className="min-h-screen bg-black">
            <HeroSection />
            <FeaturesSection />
            <AppPreviewSection />
            <CTASection />
            <Footer />
        </main>
    );
}
