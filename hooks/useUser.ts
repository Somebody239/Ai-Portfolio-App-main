import { useEffect, useState } from 'react'
import { User } from '@/lib/types'
import { UsersRepository } from '@/lib/supabase/repositories/users.repository'
import { supabase } from '@/lib/supabase/client'

const usersRepo = new UsersRepository()

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function load() {
      try {
        // Get current authenticated user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

        if (authError || !authUser) {
          setLoading(false)
          return
        }

        // Fetch user profile from database
        const userData = await usersRepo.getById(authUser.id)
        setUser(userData)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load user'))
        console.error('Error loading user:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const refreshUser = async () => {
    setLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const userData = await usersRepo.getById(authUser.id);
        setUser(userData);
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, refreshUser };
}

