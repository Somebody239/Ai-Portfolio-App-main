import { useEffect, useState } from 'react'
import { Course, StandardizedScore, AIRecommendation, Extracurricular, Achievement } from '@/lib/types'
import { CoursesRepository } from '@/lib/supabase/repositories/courses.repository'
import { ScoresRepository } from '@/lib/supabase/repositories/scores.repository'
import { UserTargetsRepository, UserTargetWithUniversity } from '@/lib/supabase/repositories/userTargets.repository'
import { RecommendationsRepository } from '@/lib/supabase/repositories/recommendations.repository'
import { ExtracurricularsRepository } from '@/lib/supabase/repositories/extracurriculars.repository'
import { AchievementsRepository } from '@/lib/supabase/repositories/achievements.repository'
import { supabase } from '@/lib/supabase/client'

const coursesRepo = new CoursesRepository()
const scoresRepo = new ScoresRepository()
const targetsRepo = new UserTargetsRepository()
const recommendationsRepo = new RecommendationsRepository()
const extracurricularsRepo = new ExtracurricularsRepository()
const achievementsRepo = new AchievementsRepository()

export function usePortfolio() {
  const [userId, setUserId] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [scores, setScores] = useState<StandardizedScore[]>([])
  const [targets, setTargets] = useState<UserTargetWithUniversity[]>([])
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function init() {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError(new Error('User not authenticated'))
          setLoading(false)
          return
        }

        setUserId(user.id)

        // Fetch all portfolio data in parallel
        const [coursesData, scoresData, targetsData, recommendationsData, extracurricularsData, achievementsData] = await Promise.all([
          coursesRepo.getByUserId(user.id),
          scoresRepo.getByUserId(user.id),
          targetsRepo.getByUserId(user.id),
          recommendationsRepo.getByUserId(user.id),
          extracurricularsRepo.getByUserId(user.id),
          achievementsRepo.getByUserId(user.id),
        ])

        setCourses(coursesData)
        setScores(scoresData)
        setTargets(targetsData)
        setRecommendations(recommendationsData)
        setExtracurriculars(extracurricularsData)
        setAchievements(achievementsData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load portfolio'))
        console.error('Error loading portfolio:', err)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  return {
    userId,
    courses,
    scores,
    targets,
    recommendations,
    extracurriculars,
    achievements,
    loading,
    error,
    refetch: async () => {
      if (!userId) return
      try {
        const [coursesData, scoresData, targetsData, recommendationsData, extracurricularsData, achievementsData] = await Promise.all([
          coursesRepo.getByUserId(userId),
          scoresRepo.getByUserId(userId),
          targetsRepo.getByUserId(userId),
          recommendationsRepo.getByUserId(userId),
          extracurricularsRepo.getByUserId(userId),
          achievementsRepo.getByUserId(userId),
        ])
        setCourses(coursesData)
        setScores(scoresData)
        setTargets(targetsData)
        setRecommendations(recommendationsData)
        setExtracurriculars(extracurricularsData)
        setAchievements(achievementsData)
        setError(null)
        // Notify other components (like Sidebar) to update
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('portfolio-updated'))
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to refetch portfolio'))
      }
    },
  }
}

