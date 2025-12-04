import { supabase } from '../client'
import { StandardizedScore, TestType } from '@/lib/types'

export class ScoresRepository {
  async getByUserId(userId: string): Promise<StandardizedScore[]> {
    const { data, error } = await supabase
      .from('standardized_scores')
      .select('*')
      .eq('user_id', userId)
      .order('date_taken', { ascending: false, nullsFirst: false })

    if (error) throw error
    return (data || []).map(this.mapToScore)
  }

  async getByTestType(userId: string, testType: TestType): Promise<StandardizedScore[]> {
    const { data, error } = await supabase
      .from('standardized_scores')
      .select('*')
      .eq('user_id', userId)
      .eq('test_type', testType)
      .order('score', { ascending: false })

    if (error) throw error
    return (data || []).map(this.mapToScore)
  }

  async create(score: Omit<StandardizedScore, 'id'>): Promise<StandardizedScore> {
    const { data, error } = await supabase
      .from('standardized_scores')
      // @ts-ignore: Supabase generated types are too strict
      .insert({
        user_id: score.user_id,
        test_type: score.test_type,
        score: score.score,
        section_scores: score.section_scores || null,
        date_taken: score.date_taken || null,
      })
      .select()
      .single()

    if (error) throw error
    return this.mapToScore(data)
  }

  async update(id: string, updates: Partial<StandardizedScore>): Promise<StandardizedScore> {
    const { data, error } = await supabase
      .from('standardized_scores')
      // @ts-ignore: Supabase generated types are too strict
      .update({
        test_type: updates.test_type,
        score: updates.score,
        section_scores: updates.section_scores || null,
        date_taken: updates.date_taken || null,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.mapToScore(data)
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('standardized_scores')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  private mapToScore(row: any): StandardizedScore {
    return {
      id: row.id,
      user_id: row.user_id,
      test_type: row.test_type as TestType,
      score: Number(row.score),
      section_scores: row.section_scores ? (row.section_scores as Record<string, number>) : undefined,
      date_taken: row.date_taken || null,
      created_at: row.created_at || null,
    }
  }
}

