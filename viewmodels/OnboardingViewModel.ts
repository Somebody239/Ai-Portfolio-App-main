/**
 * OnboardingViewModel - Manages state and logic for onboarding flow
 * Single responsibility: Handle onboarding UI state and navigation
 */
import { useState, useCallback } from "react";
import type { OnboardingDataInput } from "@/lib/validation/Schemas";

export class OnboardingViewModel {
  private step: number = 1;
  private totalSteps: number = 3;
  private formData: Partial<OnboardingDataInput> = {};
  private isSubmitting: boolean = false;
  private error: string = "";

  constructor() {
    this.step = 1;
    this.totalSteps = 3;
    this.formData = {};
    this.isSubmitting = false;
    this.error = "";
  }

  getCurrentStep(): number {
    return this.step;
  }

  getTotalSteps(): number {
    return this.totalSteps;
  }

  getFormData(): Partial<OnboardingDataInput> {
    return { ...this.formData };
  }

  getIsSubmitting(): boolean {
    return this.isSubmitting;
  }

  getError(): string {
    return this.error;
  }

  setStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps + 1) {
      this.step = step;
    }
  }

  setFormData(data: Partial<OnboardingDataInput>): void {
    this.formData = { ...this.formData, ...data };
  }

  setIsSubmitting(isSubmitting: boolean): void {
    this.isSubmitting = isSubmitting;
  }

  setError(error: string): void {
    this.error = error;
  }

  nextStep(data?: Partial<OnboardingDataInput>): void {
    if (data) {
      this.setFormData(data);
    }
    this.setStep(Math.min(this.step + 1, this.totalSteps + 1));
  }

  prevStep(): void {
    this.setStep(Math.max(this.step - 1, 1));
  }

  getProgress(): number {
    return ((this.step - 1) / this.totalSteps) * 100;
  }
}

/**
 * React hook wrapper for OnboardingViewModel
 */
export function useOnboardingViewModel() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingDataInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const totalSteps = 3;

  const nextStep = useCallback((data?: Partial<OnboardingDataInput>) => {
    if (data) {
      setFormData((prev) => ({ ...prev, ...data }));
    }
    setStep((prev) => Math.min(prev + 1, totalSteps + 1));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const updateFormData = useCallback((data: Partial<OnboardingDataInput>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const progress = ((step - 1) / totalSteps) * 100;

  return {
    step,
    totalSteps,
    formData,
    isSubmitting,
    error,
    progress,
    nextStep,
    prevStep,
    setFormData: updateFormData,
    setSubmitting: setIsSubmitting,
    setError,
  };
}

