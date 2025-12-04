import { supabase } from '../client'
import { Extracurricular } from '@/lib/types'

export class ExtracurricularsRepository {
  async getByUserId(userId: string): Promise<Extracurricular[]> {
    const { data, error } = await supabase
      .from('extracurriculars')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(this.mapToExtracurricular)
  }

  async create(extracurricular: Omit<Extracurricular, 'id'>): Promise<Extracurricular> {
    const { data, error } = await supabase
      .from('extracurriculars')
      // @ts-ignore: Supabase generated types are too strict
      .insert({
        user_id: extracurricular.user_id,
        title: extracurricular.title,
        description: extracurricular.description,
        level: extracurricular.level,
        hours_per_week: extracurricular.hours_per_week,
        years_participated: extracurricular.years_participated,
      })
      .select()
      .single()

    if (error) throw error
    return this.mapToExtracurricular(data)
  }

  async update(id: string, updates: Partial<Extracurricular>): Promise<Extracurricular> {
    const { data, error } = await supabase
      .from('extracurriculars')
      // @ts-ignore: Supabase generated types are too strict
      .update({
        title: updates.title,
        description: updates.description,
        level: updates.level,
        hours_per_week: updates.hours_per_week,
        years_participated: updates.years_participated,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.mapToExtracurricular(data)
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('extracurriculars')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  private mapToExtracurricular(row: any): Extracurricular {
    return {
      id: row.id,
      user_id: row.user_id,
      name: row.title, // Map title to name for interface compatibility
      title: row.title,
      description: row.description || null,
      level: row.level,
      hours_per_week: Number(row.hours_per_week),
      years_participated: Number(row.years_participated),
      created_at: row.created_at || null,
    }
  }
}

