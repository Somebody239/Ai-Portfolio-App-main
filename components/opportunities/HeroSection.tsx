import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface HeroSectionProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function HeroSection({ searchQuery, onSearchChange }: HeroSectionProps) {
    return (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-zinc-900 to-zinc-900 border border-white/5 p-8 md:p-12 mb-12">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/20 backdrop-blur-md text-sm font-medium text-emerald-300">
                    <Sparkles size={14} />
                    <span>Discover Your Future</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                    Find the Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">Opportunity</span>
                </h1>

                <p className="text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                    Explore thousands of internships, summer programs, and competitions curated for high school students.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mt-8">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <Input
                            placeholder="Search for programs, roles, or organizations..."
                            className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-400 focus:bg-white/10 focus:ring-emerald-500/50 transition-all rounded-xl"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <Button
                        className="h-12 px-8 bg-white text-zinc-950 hover:bg-zinc-200 font-semibold rounded-xl transition-colors"
                        onClick={() => window.location.href = '/ai/portfolio-advisor'}
                    >
                        AI Match
                    </Button>
                </div>
            </div>
        </div>
    );
}
