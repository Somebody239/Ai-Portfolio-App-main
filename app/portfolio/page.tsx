import { Suspense } from 'react';
import PortfolioView from "@/views/PortfolioView";

export default function PortfolioPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading portfolio...</div>}>
            <PortfolioView />
        </Suspense>
    );
}
