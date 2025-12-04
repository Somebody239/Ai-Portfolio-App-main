import { Select } from "@/components/ui/Select";
import { Card, Badge } from "@/components/ui/Atoms";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

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

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 mr-2">
                <span className="uppercase tracking-wider text-xs">Filter By:</span>
            </div>

            <div className="w-full sm:w-48">
                <Select
                    value={selectedType}
                    onChange={(e) => onTypeChange(e.target.value)}
                    options={[
                        { value: "all", label: "All Types" },
                        ...types.map((type) => ({ value: type, label: type })),
                    ]}
                    className="w-full"
                />
            </div>

            <div className="w-full sm:w-48">
                <Select
                    value={selectedLocation}
                    onChange={(e) => onLocationChange(e.target.value)}
                    options={[
                        { value: "all", label: "All Locations" },
                        ...locations.map((loc) => ({ value: loc, label: loc })),
                    ]}
                    className="w-full"
                />
            </div>

            {hasFilters && (
                <Button
                    variant="ghost"
                    onClick={onClearFilters}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 gap-2 ml-auto"
                >
                    <X size={14} />
                    Clear Filters
                </Button>
            )}
        </div>
    );
}
