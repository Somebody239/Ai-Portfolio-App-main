"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import DashboardView from "@/views/DashboardView";
import LandingView from "@/views/LandingView";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { PageTransition } from "@/components/common/PageTransition";

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication status
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    }

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-white" />
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return <LandingView />;
  }

  // Show dashboard if authenticated
  return (
    <ProtectedRoute>
      <PageTransition>
        <DashboardView />
      </PageTransition>
    </ProtectedRoute>
  );
}
