import { useEffect, useState } from 'react'
import { University } from '@/lib/types'
import { UniversitiesRepository } from '@/lib/supabase/repositories/universities.repository'

const universitiesRepo = new UniversitiesRepository()

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await universitiesRepo.getAll()
        setUniversities(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load universities'))
        console.error('Error loading universities:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { universities, loading, error }
}

