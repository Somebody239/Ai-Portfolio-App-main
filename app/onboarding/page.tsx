import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import OnboardingFlow from "@/views/OnboardingView";

export default function OnboardingPage() {
  return (
    <ProtectedRoute mode="require-incomplete">
      <OnboardingFlow />
    </ProtectedRoute>
  );
}
