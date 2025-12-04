import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { PageTransition } from "@/components/common/PageTransition";
import AcademicsView from "@/views/AcademicsView";

export default function PortfolioPage() {
  return (
    <ProtectedRoute>
      <PageTransition>
        <AcademicsView />
      </PageTransition>
    </ProtectedRoute>
  );
}

