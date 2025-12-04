"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  intended_major: string | null;
  current_gpa: number | null;
  avatar_url?: string | null;
}

export function useUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
          } else {
            setUser(data as UserProfile);
          }
        }
      } catch (error) {
        console.error("Unexpected auth error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return { user, loading, signOut };
}

