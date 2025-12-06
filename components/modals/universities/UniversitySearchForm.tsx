"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { University } from "@/lib/types";
import { UniversitiesRepository } from "@/lib/supabase/repositories/universities.repository";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface UniversitySearchFormProps {
  onSelect: (university: University) => void;
  excludeIds?: number[];
}

export function UniversitySearchForm({ onSelect, excludeIds = [] }: UniversitySearchFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = new UniversitiesRepository();

  useEffect(() => {
    searchUniversities(debouncedSearchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  const searchUniversities = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      let data: University[] = [];

      if (!query.trim()) {
        // If empty query, load top/default universities
        data = await repository.search('');
      } else {
        // Perform server-side search
        data = await repository.search(query);
      }

      const filtered = data.filter((uni) => !excludeIds.includes(uni.id));
      setUniversities(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to load universities");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="Search universities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
      </div>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      {isLoading ? (
        <div className="text-center py-8 text-zinc-500">Loading universities...</div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto space-y-2">
          {universities.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              {searchQuery ? "No universities found" : "No universities available"}
            </div>
          ) : (
            universities.map((uni) => (
              <button
                key={uni.id}
                type="button"
                onClick={() => onSelect(uni)}
                className="w-full text-left p-4 rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h4 className="text-sm font-medium text-white truncate">{uni.name}</h4>
                    {/* Added City/State context */}
                    <p className="text-xs text-zinc-500 mt-1 truncate">
                      {uni.city ? `${uni.city}, ` : ''}{uni.state || uni.country}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-zinc-500">Acceptance Rate</p>
                    <p className="text-sm font-medium text-white">
                      {/* Smart Formatting Logic */}
                      {uni.acceptance_rate != null
                        ? (uni.acceptance_rate > 1
                          ? `${uni.acceptance_rate.toFixed(1)}%`
                          : `${(uni.acceptance_rate * 100).toFixed(1)}%`)
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
