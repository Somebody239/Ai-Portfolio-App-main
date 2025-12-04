import { supabase } from '../client'
import { Course } from '@/lib/types'

export class CoursesRepository {
  async getByUserId(userId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('user_id', userId)
      .order('year', { ascending: false })
      .order('semester', { ascending: false })

    if (error) throw error
    return (data || []).map(this.mapToCourse)
  }

  async getById(id: string): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return this.mapToCourse(data)
  }

  async create(course: Omit<Course, 'id'>): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      // @ts-ignore: Supabase generated types are too strict
      .insert({
        user_id: course.user_id,
        name: course.name,
        grade: course.grade,
        year: course.year,
        semester: course.semester,
      })
      .select()
      .single()

    if (error) throw error
    return this.mapToCourse(data)
  }

  async update(id: string, updates: Partial<Course>): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      // @ts-ignore: Supabase generated types are too strict
      .update({
        name: updates.name,
        grade: updates.grade,
        year: updates.year,
        semester: updates.semester,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.mapToCourse(data)
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  private mapToCourse(row: any): Course {
    return {
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      grade: (row.grade !== null && row.grade !== undefined) ? parseFloat(row.grade) : null,
      level: row.level,
      year: row.year,
      semester: row.semester as Course["semester"],
      created_at: row.created_at,
    };
  }
}
