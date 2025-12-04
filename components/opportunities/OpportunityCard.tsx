
import { Opportunity } from "@/lib/types";
import { Card, Badge } from "@/components/ui/Atoms";
import { Button } from "@/components/ui/Button";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface OpportunityCardProps {
    opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            <Card className="h-full flex flex-col overflow-hidden hover:border-zinc-700 transition-colors duration-300">
                {opportunity.image_url && (
                    <div className="h-48 w-full overflow-hidden relative">
                        <Image
                            src={opportunity.image_url}
                            alt={opportunity.title}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                        {opportunity.type && (
                            <div className="absolute top-3 right-3">
                                <Badge text={opportunity.type} variant="neutral" />
                            </div>
                        )}
                    </div>
                )}

                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                        {opportunity.title}
                    </h3>

                    <div className="flex flex-wrap gap-3 mb-4 text-sm text-zinc-400">
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
                                    {opportunity.start_date ? new Date(opportunity.start_date).toLocaleDateString() : 'TBA'}
                                    {opportunity.end_date ? ` - ${new Date(opportunity.end_date).toLocaleDateString()}` : ''}
                                </span>
                            </div>
                        )}
                    </div>

                    <p className="text-zinc-400 text-sm mb-6 line-clamp-3 flex-grow">
                        {opportunity.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-zinc-800/50">
                        <a
                            href={opportunity.link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                        >
                            <Button variant="outline" className="w-full justify-center gap-2 group">
                                Learn More
                                <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </Button>
                        </a>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
