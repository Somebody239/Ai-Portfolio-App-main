"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Loader2, X, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { University } from '@/lib/types';
import { UniversitiesRepository } from '@/lib/supabase/repositories/universities.repository';
import { useUser } from '@/hooks/useUser';

interface InlineUniversitySearchProps {
    onSelect: (uni: University) => void;
    onCancel: () => void;
}

export const InlineUniversitySearch: React.FC<InlineUniversitySearchProps> = ({
    onSelect,
    onCancel
}) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<University[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasTyped, setHasTyped] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const repoRef = useRef(new UniversitiesRepository());

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const searchUniversities = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const searchResults = await repoRef.current.search(query);
                setResults(searchResults);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounce = setTimeout(() => {
            if (query) {
                searchUniversities();
                setHasTyped(true);
            }
        }, 300);

        return () => clearTimeout(debounce);
    }, [query]);

    return (
        <div className="flex flex-col h-full bg-zinc-950/50 rounded-xl">
            {/* Search Header */}
            <div className="p-4 border-b border-zinc-800">
                <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500/50 transition-all shadow-lg shadow-black/20">
                    <Search size={18} className="text-zinc-500" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for a university..."
                        className="flex-1 bg-transparent border-none outline-none text-white text-base placeholder:text-zinc-500"
                    />
                    {isLoading ? (
                        <Loader2 size={18} className="text-emerald-500 animate-spin" />
                    ) : (
                        <button
                            onClick={onCancel}
                            className="p-1 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {results.length === 0 && hasTyped && !isLoading ? (
                    <div className="text-center py-8 text-sm text-zinc-500">
                        <p className="font-medium text-zinc-400">No universities found</p>
                        <p className="mt-1">Try checking your spelling</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {results.map((uni) => (
                            <motion.button
                                key={uni.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => onSelect(uni)}
                                className="w-full text-left p-3 rounded-lg hover:bg-white/5 active:bg-white/10 border border-transparent hover:border-zinc-700/50 transition-all group flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 shrink-0">
                                        <GraduationCap size={14} className="text-zinc-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-zinc-200 group-hover:text-white font-medium truncate">
                                            {uni.name}
                                        </div>
                                        <div className="text-xs text-zinc-500 group-hover:text-zinc-400 flex items-center gap-2">
                                            <span className="truncate">{uni.city}, {uni.state}</span>
                                            {/* We can add more info here if present in the data */}
                                        </div>
                                    </div>
                                </div>
                                <div className="pl-3">
                                    <Plus size={16} className="text-zinc-600 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110" />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}

                {/* Initial suggested or empty state */}
                {!hasTyped && !isLoading && (
                    <div className="text-center py-12 text-zinc-600">
                        <GraduationCap size={32} className="mx-auto mb-3 opacity-20" />
                        <p className="text-xs font-medium">Start typing to search</p>
                        <p className="text-[10px] mt-1 opacity-60">Over 4,000 universities available</p>
                    </div>
                )}
            </div>
        </div>
    );
};
