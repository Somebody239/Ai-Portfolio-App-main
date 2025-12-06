"use client";

import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Opportunity } from "@/lib/types";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { OpportunitiesFilter } from "@/components/opportunities/OpportunitiesFilter";
import { HeroSection } from "@/components/opportunities/HeroSection";
import { MOCK_OPPORTUNITIES } from "@/lib/mock-data/opportunities";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, SearchX } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { EmptyState } from "@/components/common/EmptyState";

export default function OpportunitiesView() {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedLocation, setSelectedLocation] = useState("all");

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Derived state for filters
    const uniqueTypes = useMemo(() => {
        const types = new Set(MOCK_OPPORTUNITIES.map(op => op.type).filter(Boolean) as string[]);
        return Array.from(types);
    }, []);

    const uniqueLocations = useMemo(() => {
        const locations = new Set(MOCK_OPPORTUNITIES.map(op => op.location).filter(Boolean) as string[]);
        return Array.from(locations);
    }, []);

    // Filtering Logic
    const filteredOpportunities = useMemo(() => {
        return MOCK_OPPORTUNITIES.filter(op => {
            const matchesSearch =
                op.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (op.description && op.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (op.type && op.type.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesType = selectedType === "all" || op.type === selectedType;
            const matchesLocation = selectedLocation === "all" || op.location === selectedLocation;

            return matchesSearch && matchesType && matchesLocation;
        });
    }, [searchQuery, selectedType, selectedLocation]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedType("all");
        setSelectedLocation("all");
    };

    return (
        <AppShell>
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                <Breadcrumbs items={[{ label: "Opportunities" }]} />

                <HeroSection
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <div className="space-y-6">
                    <OpportunitiesFilter
                        types={uniqueTypes}
                        locations={uniqueLocations}
                        selectedType={selectedType}
                        selectedLocation={selectedLocation}
                        onTypeChange={setSelectedType}
                        onLocationChange={setSelectedLocation}
                        onClearFilters={handleClearFilters}
                    />

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                            <p className="text-zinc-500 animate-pulse">Finding opportunities...</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {filteredOpportunities.length > 0 ? (
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {filteredOpportunities.map((opportunity, index) => (
                                        <motion.div
                                            layout
                                            key={opportunity.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                        >
                                            <OpportunityCard opportunity={opportunity} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <EmptyState
                                        icon={<SearchX size={48} />}
                                        title="No opportunities found"
                                        description="Try adjusting your filters or search query to see more results."
                                        action={
                                            <button
                                                onClick={handleClearFilters}
                                                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium underline underline-offset-4"
                                            >
                                                Clear all filters
                                            </button>
                                        }
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
