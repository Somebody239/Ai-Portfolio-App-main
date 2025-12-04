"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type OnboardingRequirement = "require-complete" | "require-incomplete" | "skip";

type ProtectedRouteProps = {
  children: ReactNode;
  mode?: OnboardingRequirement;
  fallback?: ReactNode;
  redirectToLogin?: string;
  redirectWhenIncomplete?: string;
  redirectWhenComplete?: string;
};

async function fetchOnboardingStatus(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("name, intended_major")
    .eq("id", userId)
    .single() as { data: { name: string | null; intended_major: string | null } | null; error: any };

  if (error && error.code !== "PGRST116") {
    console.error("Error checking onboarding status:", error);
  }

  return Boolean(data?.name && data?.intended_major);
}

export function ProtectedRoute({
  children,
  mode = "require-complete",
  fallback,
  redirectToLogin = "/login",
  redirectWhenIncomplete = "/onboarding",
  redirectWhenComplete = "/",
}: ProtectedRouteProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const handleSession = async (session: Session | null) => {
      if (!session) {
        router.replace(redirectToLogin);
        return;
      }

      if (mode === "skip") {
        isMounted && setReady(true);
        return;
      }

      const onboarded = await fetchOnboardingStatus(session.user.id);

      if (mode === "require-complete" && !onboarded) {
        router.replace(redirectWhenIncomplete);
        return;
      }

      if (mode === "require-incomplete" && onboarded) {
        router.replace(redirectWhenComplete);
        return;
      }

      if (isMounted) {
        setReady(true);
      }
    };

    const init = async () => {
      setReady(false);
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth error:", error);
        router.replace(redirectToLogin);
        return;
      }

      await handleSession(data.session);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [mode, redirectToLogin, redirectWhenComplete, redirectWhenIncomplete, router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        {fallback ?? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <p className="text-zinc-400 text-sm">Loading...</p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}


