
"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { OpportunitiesManager } from "@/managers/OpportunitiesManager";
import { Opportunity } from "@/lib/types";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { OpportunitiesFilter } from "@/components/opportunities/OpportunitiesFilter";
import { motion } from "framer-motion";
import { Loader2, SearchX, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { EmptyState } from "@/components/common/EmptyState";

export default function OpportunitiesView() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [types, setTypes] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState("all");
    const [selectedLocation, setSelectedLocation] = useState("all");

    const manager = new OpportunitiesManager();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchFilteredData();
    }, [selectedType, selectedLocation]);

    const fetchData = async () => {
        try {
            const [allOps, allTypes, allLocations] = await Promise.all([
                manager.getAll(),
                manager.getTypes(),
                manager.getLocations(),
            ]);
            setOpportunities(allOps);
            setTypes(allTypes);
            setLocations(allLocations);
        } catch (error) {
            console.error("Failed to fetch opportunities:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredData = async () => {
        // Don't set loading to true here for smoother filtering experience
        try {
            const filtered = await manager.getFiltered({
                type: selectedType,
                location: selectedLocation,
            });
            setOpportunities(filtered);
        } catch (error) {
            console.error("Failed to filter opportunities:", error);
        }
    };

    const handleClearFilters = () => {
        setSelectedType("all");
        setSelectedLocation("all");
    };

    return (
        <AppShell>
            <div className="max-w-7xl mx-auto space-y-8">
                <Breadcrumbs items={[{ label: "Opportunities" }]} />

                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Opportunities
                    </h1>
                    <p className="text-zinc-400">
                        Discover curated summer programs, internships, and university open days.
                    </p>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={() => window.location.href = '/ai/portfolio-advisor'}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors text-sm font-medium"
                    >
                        <Sparkles size={16} />
                        Find Matches with AI
                    </button>
                </div>

                <OpportunitiesFilter
                    types={types}
                    locations={locations}
                    selectedType={selectedType}
                    selectedLocation={selectedLocation}
                    onTypeChange={setSelectedType}
                    onLocationChange={setSelectedLocation}
                    onClearFilters={handleClearFilters}
                />

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                ) : opportunities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {opportunities.map((opportunity, index) => (
                            <motion.div
                                key={opportunity.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <OpportunityCard opportunity={opportunity} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<SearchX size={48} />}
                        title="No opportunities found"
                        description="Try adjusting your filters to see more results."
                        action={
                            <button
                                onClick={handleClearFilters}
                                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                            >
                                Clear all filters
                            </button>
                        }
                    />
                )}
            </div>
        </AppShell>
    );
}
