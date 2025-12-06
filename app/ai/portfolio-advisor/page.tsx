'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { PortfolioAdvisor } from '@/components/ai/PortfolioAdvisor';

export default function PortfolioAdvisorPage() {
    return (
        <AppShell>
            <Breadcrumbs items={[
                { label: "AI Tools", href: "/ai" },
                { label: "Portfolio Advisor" }
            ]} />

            <div className="max-w-5xl space-y-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                        AI Portfolio Advisor
                    </h1>
                    <p className="text-zinc-400">
                        Get personalized recommendations to strengthen your college application portfolio
                    </p>
                </header>

                <PortfolioAdvisor />
            </div>
        </AppShell>
    );
}
