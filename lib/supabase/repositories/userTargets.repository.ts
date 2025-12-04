import { supabase } from '../client';
import { UserTarget, University } from '@/lib/types';

export interface UserTargetWithUniversity extends UserTarget {
  university: University;
}

export class UserTargetsRepository {
  /** Get all targets for a user, including joined university data */
  async getByUserId(userId: string): Promise<UserTargetWithUniversity[]> {
    // 1. Get targets
    const { data: targets, error: targetsError } = await supabase
      .from('user_targets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (targetsError) throw targetsError;
    if (!targets || targets.length === 0) return [];

    // 2. Get university IDs
    const universityIds = targets
      .map((t: any) => t.university_id)
      .filter((id: any) => typeof id === 'number' || (!isNaN(Number(id)) && String(id).trim() !== ''));

    if (universityIds.length === 0) {
      return [];
    }

    // 3. Fetch university details from universities_temp
    const { data: universities, error: uniError } = await supabase
      .from('universities_temp')
      .select('*')
      .in('id', universityIds);

    if (uniError) throw uniError;

    // 4. Map to University objects
    const uniMap = new Map<number, University>();
    (universities || []).forEach((row: any) => {
      uniMap.set(row.id, this.mapRowToUniversity(row));
    });

    // 5. Combine
    return targets.map((target: any) => {
      // Try to find the university. ID in target is string, ID in map is number.
      const uniId = Number(target.university_id);
      const university = uniMap.get(uniId);

      // If university not found (e.g. old UUID target), we might need to handle gracefully
      // For now, we filter out or return partial? 
      // Let's return a placeholder if missing to avoid crashing, or filter later.
      if (!university) {
        // Fallback or skip. For type safety, we need a University.
        // We'll create a dummy one or log error.
        console.warn(`University details not found for target ${target.id} (uni_id: ${target.university_id})`);
        return null;
      }

      return {
        id: target.id,
        user_id: target.user_id,
        university_id: uniId,
        university,
        reason_for_interest: target.reason_for_interest || undefined,
        created_at: target.created_at || null,
      };
    }).filter((t: any): t is UserTargetWithUniversity => t !== null);
  }

  /** Create a new target */
  async create(userId: string, universityId: number, reason?: string): Promise<UserTarget> {
    // Note: This might fail if user_targets.university_id is strictly UUID type in DB
    const { data, error } = await supabase
      .from('user_targets')
      // @ts-ignore: Supabase generated types are too strict
      .insert({
        user_id: userId,
        university_id: universityId, // Store as number
        reason_for_interest: reason || null,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapToUserTarget(data);
  }

  /** Update an existing target (currently only reason_for_interest is mutable) */
  async update(id: string, updates: Partial<{ reason_for_interest: string | null }>): Promise<UserTarget> {
    const { data, error } = await supabase
      .from('user_targets')
      // @ts-ignore: Supabase generated types are too strict
      .update({ reason_for_interest: updates.reason_for_interest ?? null })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToUserTarget(data);
  }

  /** Delete a target by its id */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_targets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /** Delete a target for a specific user/university pair */
  async deleteByUserAndUniversity(userId: string, universityId: number): Promise<void> {
    const { error } = await supabase
      .from('user_targets')
      .delete()
      .eq('user_id', userId)
      .eq('university_id', universityId);

    if (error) throw error;
  }

  /** Map raw row to UserTarget */
  private mapToUserTarget(row: any): UserTarget {
    return {
      id: row.id,
      user_id: row.user_id,
      university_id: Number(row.university_id),
      reason_for_interest: row.reason_for_interest || undefined,
      created_at: row.created_at || null,
    };
  }

  // Helper to map university row (duplicated from UniversitiesRepository to avoid circular dependency or just for ease)
  private mapRowToUniversity(row: any): University {
    return {
      id: row.id,
      name: row.name,
      alias: row.alias,
      website: row.website,
      image_url: row.image_url,
      country: row.country,
      state: row.state,
      city: row.city,
      zip: row.zip,
      latitude: row.latitude,
      longitude: row.longitude,

      avg_gpa: row.avg_gpa ? Number(row.avg_gpa) : null,
      avg_sat: row.avg_sat ? Number(row.avg_sat) : null,
      avg_act: row.avg_act ? Number(row.avg_act) : null,
      acceptance_rate: row.acceptance_rate ? Number(row.acceptance_rate) : null,
      admissions_admission_rate: row.admissions_admission_rate ? Number(row.admissions_admission_rate) : null,

      admissions_sat_math_25th: row.admissions_sat_math_25th,
      admissions_sat_math_75th: row.admissions_sat_math_75th,
      admissions_sat_reading_25th: row.admissions_sat_reading_25th,
      admissions_sat_reading_75th: row.admissions_sat_reading_75th,
      admissions_sat_writing_25th: row.admissions_sat_writing_25th,
      admissions_sat_writing_75th: row.admissions_sat_writing_75th,

      admissions_act_midpoint: row.admissions_act_midpoint,
      admissions_act_cumulative_25th: row.admissions_act_cumulative_25th,
      admissions_act_cumulative_75th: row.admissions_act_cumulative_75th,
      admissions_act_english_25th: row.admissions_act_english_25th,
      admissions_act_english_75th: row.admissions_act_english_75th,
      admissions_act_math_25th: row.admissions_act_math_25th,
      admissions_act_math_75th: row.admissions_act_math_75th,
      admissions_act_writing_25th: row.admissions_act_writing_25th,
      admissions_act_writing_75th: row.admissions_act_writing_75th,

      tuition: row.tuition ? Number(row.tuition) : null,
      costs_tuition_in_state: row.costs_tuition_in_state,
      costs_tuition_out_of_state: row.costs_tuition_out_of_state,
      costs_total_cost_academic_year: row.costs_total_cost_academic_year,
      costs_books_supplies: row.costs_books_supplies,
      costs_roomboard_oncampus: row.costs_roomboard_oncampus,
      costs_roomboard_offcampus: row.costs_roomboard_offcampus,
      costs_avg_net_price: row.costs_avg_net_price,
      price_calculator_url: row.price_calculator_url,

      majors_offered: row.majors_offered,

      program_percentage_engineering: row.program_percentage_engineering,
      program_percentage_computer: row.program_percentage_computer,
      program_percentage_business: row.program_percentage_business,
      program_percentage_psychology: row.program_percentage_psychology,
      program_percentage_biology: row.program_percentage_biology,
      program_percentage_visual_performing: row.program_percentage_visual_performing,
      program_percentage_mathematics: row.program_percentage_mathematics,
      program_percentage_health: row.program_percentage_health,

      student_size: row.student_size,
      grad_students: row.grad_students,
      demographics_female_share: row.demographics_female_share,
      demographics_race_ethnicity_white: row.demographics_race_ethnicity_white,
      demographics_race_ethnicity_black: row.demographics_race_ethnicity_black,
      demographics_race_ethnicity_asian: row.demographics_race_ethnicity_asian,
      demographics_race_ethnicity_hispanic: row.demographics_race_ethnicity_hispanic,

      graduation_rate: row.graduation_rate,
      earnings_median_10yrs: row.earnings_median_10yrs,
      financial_aid_median_debt: row.financial_aid_median_debt,

      created_at: null,
    };
  }
}
