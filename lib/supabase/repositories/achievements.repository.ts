import { supabase } from '../client'
import { Achievement } from '@/lib/types'

export class AchievementsRepository {
  async getByUserId(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('date_awarded', { ascending: false, nullsFirst: false })

    if (error) throw error
    return (data || []).map(this.mapToAchievement)
  }

  async create(achievement: Omit<Achievement, 'id'>): Promise<Achievement> {
    const { data, error } = await supabase
      .from('achievements')
      // @ts-ignore: Supabase generated types are too strict
      .insert({
        user_id: achievement.user_id,
        title: achievement.title,
        description: achievement.description,
        category: achievement.category,
        awarded_by: achievement.awarded_by,
        date_awarded: achievement.date_awarded,
      })
      .select()
      .single()

    if (error) throw error
    return this.mapToAchievement(data)
  }

  async update(id: string, updates: Partial<Achievement>): Promise<Achievement> {
    const updateData: Record<string, any> = {
      title: updates.title,
      description: updates.description,
      category: updates.category,
      awarded_by: updates.awarded_by,
      date_awarded: updates.date_awarded,
    };

    const { data, error } = await supabase
      .from('achievements')
      // @ts-ignore: Supabase generated types are too strict
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.mapToAchievement(data)
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  private mapToAchievement(row: any): Achievement {
    return {
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      description: row.description || null,
      category: row.category || null,
      awarded_by: row.awarded_by || null,
      date_awarded: row.date_awarded || null,
      created_at: row.created_at || null,
    }
  }
}

