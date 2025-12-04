
/**
 * UserSettingsManager - Business logic for user settings
 * Single responsibility: Manage user preferences and account settings
 */

import { UserSettingsRepository } from "@/lib/supabase/repositories/userSettings.repository";
import { UserSettings } from "@/lib/types";

export class UserSettingsManager {
    private repository: UserSettingsRepository;

    constructor() {
        this.repository = new UserSettingsRepository();
    }

    async getSettings(userId: string): Promise<UserSettings> {
        const settings = await this.repository.getByUserId(userId);
        if (!settings) {
            // Return defaults if no settings exist
            return this.createDefaultSettings(userId);
        }
        return settings;
    }

    async updateSettings(userId: string, settings: Partial<UserSettings>): Promise<UserSettings> {
        return await this.repository.upsert(userId, settings);
    }

    private async createDefaultSettings(userId: string): Promise<UserSettings> {
        return await this.repository.upsert(userId, {
            notifications_enabled: true,
            email_frequency: "weekly",
            theme: "dark",
        });
    }
}
