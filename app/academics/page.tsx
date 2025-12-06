import { Suspense } from 'react';
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { PageTransition } from "@/components/common/PageTransition";
import AcademicsView from "@/views/AcademicsView";

export default function PortfolioPage() {
  return (
    <ProtectedRoute>
      <PageTransition>
        <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading academics...</div>}>
          <AcademicsView />
        </Suspense>
      </PageTransition>
    </ProtectedRoute>
  );
}

