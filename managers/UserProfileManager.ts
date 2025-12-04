
/**
 * UserProfileManager - Business logic for user profile
 * Single responsibility: Manage user profile data and updates
 */

import { UsersRepository } from "@/lib/supabase/repositories/users.repository";
import { User, CurriculumType } from "@/lib/types";

export interface UpdateProfileData {
    name?: string;
    intended_major?: string;
    curriculum_type?: CurriculumType;
}

export class UserProfileManager {
    private repository: UsersRepository;

    constructor() {
        this.repository = new UsersRepository();
    }

    async getProfile(userId: string): Promise<User | null> {
        return await this.repository.getById(userId);
    }

    async updateProfile(userId: string, data: UpdateProfileData): Promise<User> {
        this.validateProfileData(data);
        return await this.repository.update(userId, data);
    }

    private validateProfileData(data: UpdateProfileData): void {
        if (data.name !== undefined && data.name.trim().length === 0) {
            throw new Error("Name cannot be empty");
        }

        if (data.intended_major !== undefined && data.intended_major.trim().length === 0) {
            throw new Error("Intended major cannot be empty");
        }
    }
}
