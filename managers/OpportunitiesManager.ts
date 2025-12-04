/**
 * OpportunitiesManager - Business logic for opportunities
 * Single responsibility: Manage fetching and filtering of opportunities
 */

import { OpportunitiesRepository } from "@/lib/supabase/repositories/opportunities.repository";
import { Opportunity } from "@/lib/types";

export interface OpportunityFilters {
    type?: string;
    location?: string;
}

export class OpportunitiesManager {
    private repository: OpportunitiesRepository;

    constructor() {
        this.repository = new OpportunitiesRepository();
    }

    async getAll(): Promise<Opportunity[]> {
        return await this.repository.getAll();
    }

    async getFiltered(filters: OpportunityFilters): Promise<Opportunity[]> {
        let opportunities = await this.repository.getAll();

        if (filters.type && filters.type !== "all") {
            opportunities = opportunities.filter(
                (op) => op.type?.toLowerCase() === filters.type?.toLowerCase()
            );
        }

        if (filters.location && filters.location !== "all") {
            opportunities = opportunities.filter((op) =>
                op.location?.toLowerCase().includes(filters.location!.toLowerCase())
            );
        }

        return opportunities;
    }

    async getTypes(): Promise<string[]> {
        const opportunities = await this.getAll();
        const types = new Set(opportunities.map((op) => op.type).filter(Boolean));
        return Array.from(types) as string[];
    }

    async getLocations(): Promise<string[]> {
        const opportunities = await this.getAll();
        const locations = new Set(
            opportunities.map((op) => op.location).filter(Boolean)
        );
        return Array.from(locations) as string[];
    }
}
