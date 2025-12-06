import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface OpportunitiesFilterProps {
    types: string[];
    locations: string[];
    selectedType: string;
    selectedLocation: string;
    onTypeChange: (type: string) => void;
    onLocationChange: (location: string) => void;
    onClearFilters: () => void;
}

export function OpportunitiesFilter({
    types,
    locations,
    selectedType,
    selectedLocation,
    onTypeChange,
    onLocationChange,
    onClearFilters,
}: OpportunitiesFilterProps) {
    const hasFilters = selectedType !== "all" || selectedLocation !== "all";

    // Ensure common types are always available if not fetched yet
    const displayTypes = types.length > 0 ? types : ["Internship", "Summer Program", "Competition", "Volunteering"];

    return (
        <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onTypeChange("all")}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                            selectedType === "all"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50"
                                : "bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white"
                        )}
                    >
                        All Opportunities
                    </button>
                    {displayTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => onTypeChange(type)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                selectedType === type
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50"
                                    : "bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-full sm:w-48">
                        <Select
                            value={selectedLocation}
                            onChange={(e) => onLocationChange(e.target.value)}
                            options={[
                                { value: "all", label: "All Locations" },
                                ...locations.map((loc) => ({ value: loc, label: loc })),
                            ]}
                            className="w-full bg-zinc-900/50 border-zinc-800 focus:ring-emerald-500/50"
                        />
                    </div>

                    {hasFilters && (
                        <Button
                            variant="ghost"
                            onClick={onClearFilters}
                            className="text-zinc-400 hover:text-white hover:bg-zinc-800 shrink-0 h-10 w-10 p-0 rounded-full border border-zinc-800"
                            title="Clear Filters"
                        >
                            <X size={16} />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
