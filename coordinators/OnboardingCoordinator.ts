/**
 * OnboardingCoordinator - Handles navigation and flow control for onboarding
 * Single responsibility: Coordinate onboarding flow and navigation
 */
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { OnboardingDataManager } from "@/managers/OnboardingDataManager";
import { RateLimiter } from "@/lib/security/RateLimiter";
import type { OnboardingDataInput } from "@/lib/validation/Schemas";

export class OnboardingCoordinator {
  private router: ReturnType<typeof useRouter>;
  private dataManager: OnboardingDataManager;
  private readonly RATE_LIMIT_KEY = "onboarding_submit";

  constructor(router: ReturnType<typeof useRouter>) {
    this.router = router;
    this.dataManager = new OnboardingDataManager();
  }

  /**
   * Completes onboarding and redirects to dashboard
   */
  async completeOnboarding(data: OnboardingDataInput): Promise<void> {
    // Rate limiting check
    if (!RateLimiter.isAllowed(this.RATE_LIMIT_KEY, 3, 60000)) {
      throw new Error(
        "Too many requests. Please wait a moment before trying again."
      );
    }

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("You must be logged in to complete onboarding");
    }

    // Get user email
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    // Save data
    await this.dataManager.saveOnboardingData(
      user.id,
      authUser?.email || null,
      data
    );

    // Redirect to dashboard
    this.router.push("/");
  }
}

/**
 * React hook wrapper for OnboardingCoordinator
 */
export function useOnboardingCoordinator() {
  const router = useRouter();
  const [coordinator] = useState(() => new OnboardingCoordinator(router));

  const completeOnboarding = useCallback(
    async (data: OnboardingDataInput) => {
      await coordinator.completeOnboarding(data);
    },
    [coordinator]
  );

  return { completeOnboarding };
}

