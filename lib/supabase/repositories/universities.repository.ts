import { supabase } from '../client'
import { University } from '@/lib/types'

export class UniversitiesRepository {
  async getAll(): Promise<University[]> {
    const { data, error } = await supabase
      .from('universities_temp')
      .select('*')
      .order('name', { ascending: true })
      .limit(2000) // Show all universities (1,612 total)

    if (error) throw error
    return (data || []).map(this.mapToUniversity)
  }

  async getById(id: number): Promise<University | null> {
    const { data, error } = await supabase
      .from('universities_temp')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return this.mapToUniversity(data)
  }

  async search(query: string): Promise<University[]> {
    const { data, error } = await supabase
      .from('universities_temp')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name', { ascending: true })
      .limit(20)

    if (error) throw error
    return (data || []).map(this.mapToUniversity)
  }

  async getByCountry(country: string): Promise<University[]> {
    const { data, error } = await supabase
      .from('universities_temp')
      .select('*')
      .eq('country', country)
      .order('name', { ascending: true })
      .limit(50)

    if (error) throw error
    return (data || []).map(this.mapToUniversity)
  }

  // Removed create method as we are using a read-only dataset for now

  private mapToUniversity(row: any): University {
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

      // Admissions
      avg_gpa: row.avg_gpa ? Number(row.avg_gpa) : null,
      avg_sat: row.avg_sat ? Number(row.avg_sat) : null,
      avg_act: row.avg_act ? Number(row.avg_act) : null,
      acceptance_rate: row.acceptance_rate ? Number(row.acceptance_rate) : null,
      admissions_admission_rate: row.admissions_admission_rate ? Number(row.admissions_admission_rate) : null,

      // SAT Percentiles
      admissions_sat_math_25th: row.admissions_sat_math_25th,
      admissions_sat_math_75th: row.admissions_sat_math_75th,
      admissions_sat_reading_25th: row.admissions_sat_reading_25th,
      admissions_sat_reading_75th: row.admissions_sat_reading_75th,
      admissions_sat_writing_25th: row.admissions_sat_writing_25th,
      admissions_sat_writing_75th: row.admissions_sat_writing_75th,

      // ACT Percentiles
      admissions_act_midpoint: row.admissions_act_midpoint,
      admissions_act_cumulative_25th: row.admissions_act_cumulative_25th,
      admissions_act_cumulative_75th: row.admissions_act_cumulative_75th,
      admissions_act_english_25th: row.admissions_act_english_25th,
      admissions_act_english_75th: row.admissions_act_english_75th,
      admissions_act_math_25th: row.admissions_act_math_25th,
      admissions_act_math_75th: row.admissions_act_math_75th,
      admissions_act_writing_25th: row.admissions_act_writing_25th,
      admissions_act_writing_75th: row.admissions_act_writing_75th,

      // Costs
      tuition: row.tuition ? Number(row.tuition) : null,
      costs_tuition_in_state: row.costs_tuition_in_state,
      costs_tuition_out_of_state: row.costs_tuition_out_of_state,
      costs_total_cost_academic_year: row.costs_total_cost_academic_year,
      costs_books_supplies: row.costs_books_supplies,
      costs_roomboard_oncampus: row.costs_roomboard_oncampus,
      costs_roomboard_offcampus: row.costs_roomboard_offcampus,
      costs_avg_net_price: row.costs_avg_net_price,
      price_calculator_url: row.price_calculator_url,

      // Programs
      majors_offered: row.majors_offered,

      // Program Percentages
      program_percentage_engineering: row.program_percentage_engineering,
      program_percentage_computer: row.program_percentage_computer,
      program_percentage_business: row.program_percentage_business,
      program_percentage_psychology: row.program_percentage_psychology,
      program_percentage_biology: row.program_percentage_biology,
      program_percentage_visual_performing: row.program_percentage_visual_performing,
      program_percentage_mathematics: row.program_percentage_mathematics,
      program_percentage_health: row.program_percentage_health,

      // Demographics
      student_size: row.student_size,
      grad_students: row.grad_students,
      demographics_female_share: row.demographics_female_share,
      demographics_race_ethnicity_white: row.demographics_race_ethnicity_white,
      demographics_race_ethnicity_black: row.demographics_race_ethnicity_black,
      demographics_race_ethnicity_asian: row.demographics_race_ethnicity_asian,
      demographics_race_ethnicity_hispanic: row.demographics_race_ethnicity_hispanic,

      // Outcomes
      graduation_rate: row.graduation_rate,
      earnings_median_10yrs: row.earnings_median_10yrs,
      financial_aid_median_debt: row.financial_aid_median_debt,

      created_at: null, // universities_temp doesn't have created_at
    }
  }
}

