
import { Opportunity } from "@/lib/types";
import { Card, Badge } from "@/components/ui/Atoms";
import { Button } from "@/components/ui/Button";
import { Calendar, MapPin, ExternalLink, DollarSign, Clock, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface OpportunityCardProps {
    opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
    const eligibility = opportunity.eligibility as Record<string, string> | undefined;
    const cost = eligibility?.cost;
    const deadline = eligibility?.deadline;
    const difficulty = eligibility?.difficulty;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            <Card className="h-full flex flex-col overflow-hidden hover:border-zinc-700 transition-colors duration-300 group bg-zinc-900/50 border-zinc-800">
                {opportunity.image_url && (
                    <div className="h-48 w-full overflow-hidden relative">
                        <Image
                            src={opportunity.image_url}
                            alt={opportunity.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />

                        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                            {opportunity.type && (
                                <Badge text={opportunity.type} variant="neutral" className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700 text-white" />
                            )}
                            {cost && (
                                <Badge
                                    text={cost}
                                    variant={cost.toLowerCase().includes('free') ? 'success' : 'neutral'}
                                    className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700"
                                />
                            )}
                        </div>
                    </div>
                )}

                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                        {opportunity.title}
                    </h3>

                    <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4 text-sm text-zinc-400">
                        {opportunity.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-zinc-500" />
                                <span>{opportunity.location}</span>
                            </div>
                        )}

                        {(opportunity.start_date || opportunity.end_date) && (
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-zinc-500" />
                                <span>
                                    {opportunity.start_date ? new Date(opportunity.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBA'}
                                    {opportunity.end_date ? ` - ${new Date(opportunity.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : ''}
                                </span>
                            </div>
                        )}
                    </div>

                    <p className="text-zinc-400 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                        {opportunity.description}
                    </p>

                    <div className="space-y-4 mt-auto">
                        <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-zinc-800/50">
                            {deadline && (
                                <div className="flex items-center gap-1.5 text-amber-400/80">
                                    <Clock size={14} />
                                    <span>Deadline: {deadline}</span>
                                </div>
                            )}
                            {difficulty && (
                                <div className="flex items-center gap-1.5">
                                    <BarChart size={14} />
                                    <span>{difficulty} Selectivity</span>
                                </div>
                            )}
                        </div>

                        <a
                            href={opportunity.link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                        >
                            <Button className="w-full justify-center gap-2 bg-white text-black hover:bg-zinc-200 transition-colors font-medium">
                                Apply Now
                                <ExternalLink size={14} />
                            </Button>
                        </a>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
