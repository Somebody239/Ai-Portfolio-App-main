import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { PageTransition } from "@/components/common/PageTransition";
import ProfileView from "@/views/ProfileView";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <PageTransition>
        <ProfileView />
      </PageTransition>
    </ProtectedRoute>
  );
}

