import { supabase } from '../client'
import { User } from '@/lib/types'

export class UsersRepository {
  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return this.mapToUser(data)
  }

  async create(user: Omit<User, 'id'> & { id: string }): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      // @ts-ignore: Supabase generated types are too strict
      .insert({
        id: user.id,
        name: user.name || null,
        email: user.email || null,
        intended_major: user.intended_major || null,
        current_gpa: user.current_gpa || null,
      })
      .select()
      .single()

    if (error) throw error
    return this.mapToUser(data)
  }

  async update(id: string, updates: Partial<Pick<User, 'name' | 'intended_major' | 'current_gpa' | 'curriculum_type'>>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      // @ts-ignore: Supabase generated types are too strict
      .update({
        name: updates.name !== undefined ? updates.name : undefined,
        intended_major: updates.intended_major !== undefined ? updates.intended_major : undefined,
        current_gpa: updates.current_gpa !== undefined ? updates.current_gpa : undefined,
        curriculum_type: updates.curriculum_type !== undefined ? updates.curriculum_type : undefined,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.mapToUser(data)
  }

  private mapToUser(row: any): User {
    return {
      id: row.id,
      name: row.name || null,
      email: row.email || null,
      intended_major: row.intended_major || null,
      current_gpa: row.current_gpa !== null && row.current_gpa !== undefined ? parseFloat(row.current_gpa) : null,
      curriculum_type: row.curriculum_type || null,
      created_at: row.created_at || null,
    }
  }
}

