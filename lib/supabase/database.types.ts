export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    name: string | null
                    email: string | null
                    intended_major: string | null
                    current_gpa: number | null
                    curriculum_type: 'AP' | 'IB' | 'Both' | null
                    created_at: string | null
                }
                Insert: {
                    id: string
                    name?: string | null
                    email?: string | null
                    intended_major?: string | null
                    current_gpa?: number | null
                    curriculum_type?: 'AP' | 'IB' | 'Both' | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string | null
                    email?: string | null
                    intended_major?: string | null
                    current_gpa?: number | null
                    curriculum_type?: 'AP' | 'IB' | 'Both' | null
                    created_at?: string | null
                }
            }
            courses: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    grade: number | null
                    level: string
                    year: number
                    semester: string
                    credits: number
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    grade?: number | null
                    level: string
                    year: number
                    semester: string
                    credits?: number
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    grade?: number | null
                    level?: string
                    year?: number
                    semester?: string
                    credits?: number
                    created_at?: string | null
                }
            }
            assignments: {
                Row: {
                    id: string
                    course_id: string
                    user_id: string
                    title: string
                    description: string | null
                    assignment_type: string
                    total_points: number
                    earned_points: number | null
                    weight_percentage: number
                    due_date: string | null
                    submitted_date: string | null
                    status: string
                    notes: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    course_id: string
                    user_id: string
                    title: string
                    description?: string | null
                    assignment_type: string
                    total_points?: number
                    earned_points?: number | null
                    weight_percentage?: number
                    due_date?: string | null
                    submitted_date?: string | null
                    status?: string
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    course_id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    assignment_type?: string
                    total_points?: number
                    earned_points?: number | null
                    weight_percentage?: number
                    due_date?: string | null
                    submitted_date?: string | null
                    status?: string
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            course_grade_history: {
                Row: {
                    id: string
                    course_id: string
                    user_id: string
                    calculated_grade: number
                    report_card_grade: number | null
                    grade_date: string
                    is_final: boolean
                    notes: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    course_id: string
                    user_id: string
                    calculated_grade: number
                    report_card_grade?: number | null
                    grade_date: string
                    is_final?: boolean
                    notes?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    course_id?: string
                    user_id?: string
                    calculated_grade?: number
                    report_card_grade?: number | null
                    grade_date?: string
                    is_final?: boolean
                    notes?: string | null
                    created_at?: string | null
                }
            }
            standardized_scores: {
                Row: {
                    id: string
                    user_id: string
                    test_type: string
                    score: number
                    section_scores: Json | null
                    date_taken: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    test_type: string
                    score: number
                    section_scores?: Json | null
                    date_taken?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    test_type?: string
                    score?: number
                    section_scores?: Json | null
                    date_taken?: string | null
                    created_at?: string | null
                }
            }
            extracurriculars: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    role: string
                    organization: string | null
                    description: string | null
                    start_date: string | null
                    end_date: string | null
                    is_current: boolean
                    category: string
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    role: string
                    organization?: string | null
                    description?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    is_current?: boolean
                    category: string
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    role?: string
                    organization?: string | null
                    description?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    is_current?: boolean
                    category?: string
                    created_at?: string | null
                }
            }
            achievements: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    date_received: string | null
                    issuer: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    date_received?: string | null
                    issuer?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    date_received?: string | null
                    issuer?: string | null
                    created_at?: string | null
                }
            }
            universities_temp: {
                Row: {
                    id: number
                    name: string
                    alias: string | null
                    website: string | null
                    image_url: string | null
                    country: string | null
                    state: string | null
                    city: string | null
                    zip: string | null
                    latitude: number | null
                    longitude: number | null
                    branches: number | null
                    is_main_campus: boolean | null
                    carnegie_classification: string | null
                    carnegie_size_setting: string | null
                    avg_gpa: number | null
                    avg_sat: number | null
                    avg_act: number | null
                    acceptance_rate: number | null
                    admissions_admission_rate: number | null
                    admissions_sat_math_25th: number | null
                    admissions_sat_math_75th: number | null
                    admissions_sat_reading_25th: number | null
                    admissions_sat_reading_75th: number | null
                    admissions_sat_writing_25th: number | null
                    admissions_sat_writing_75th: number | null
                    admissions_act_midpoint: number | null
                    admissions_act_cumulative_25th: number | null
                    admissions_act_cumulative_75th: number | null
                    admissions_act_english_25th: number | null
                    admissions_act_english_75th: number | null
                    admissions_act_math_25th: number | null
                    admissions_act_math_75th: number | null
                    admissions_act_writing_25th: number | null
                    admissions_act_writing_75th: number | null
                    majors_offered: Json | null
                    program_percentage_engineering: number | null
                    program_percentage_computer: number | null
                    program_percentage_business: number | null
                    program_percentage_psychology: number | null
                    program_percentage_biology: number | null
                    program_percentage_visual_performing: number | null
                    program_percentage_mathematics: number | null
                    program_percentage_physical_science: number | null
                    program_percentage_social_science: number | null
                    program_percentage_multidiscipline: number | null
                    program_percentage_health: number | null
                    program_percentage_education: number | null
                    program_percentage_humanities: number | null
                    program_percentage_public_administration_social_service: number | null
                    program_percentage_architecture: number | null
                    program_percentage_agriculture: number | null
                    program_percentage_security_law_enforcement: number | null
                    program_percentage_communication: number | null
                    program_percentage_language: number | null
                    program_percentage_English: number | null
                    program_percentage_history: number | null
                    program_percentage_library: number | null
                    program_percentage_legal: number | null
                    program_percentage_theology_religious_vocation: number | null
                    program_percentage_parks_recreation_fitness: number | null
                    program_percentage_family_consumer_science: number | null
                    program_percentage_philosophy_religious: number | null
                    program_percentage_personal_culinary: number | null
                    program_percentage_resources: number | null
                    program_percentage_precision_production: number | null
                    program_percentage_transportation: number | null
                    program_percentage_construction: number | null
                    program_percentage_mechanic_repair_technology: number | null
                    program_percentage_ethnic_cultural_gender: number | null
                    tuition: number | null
                    costs_tuition_in_state: number | null
                    costs_tuition_out_of_state: number | null
                    costs_total_cost_academic_year: number | null
                    costs_books_supplies: number | null
                    costs_roomboard_oncampus: number | null
                    costs_roomboard_offcampus: number | null
                    costs_other_expenses_oncampus: number | null
                    costs_other_expenses_offcampus: number | null
                    costs_avg_net_price: number | null
                    costs_net_price_income_0_30k: number | null
                    costs_net_price_income_30_48k: number | null
                    costs_net_price_income_48_75k: number | null
                    costs_net_price_income_75_110k: number | null
                    costs_net_price_income_110k_plus: number | null
                    out_of_state_tuition: number | null
                    price_calculator_url: string | null
                    graduation_rate: number | null
                    completion_rate_4yr: number | null
                    completion_rate_less_than_4yr: number | null
                    completion_retention_rate_4yr_full_time: number | null
                    completion_retention_rate_4yr_part_time: number | null
                    completion_transfer_rate_4yr_full_time: number | null
                    completion_transfer_rate_4yr_part_time: number | null
                    financial_aid_federal_loan_rate: number | null
                    financial_aid_median_debt: number | null
                    financial_aid_debt_at_entry: number | null
                    financial_aid_debt_25th_percentile: number | null
                    financial_aid_debt_75th_percentile: number | null
                    financial_aid_debt_90th_percentile: number | null
                    financial_aid_median_monthly_payments: number | null
                    pell_grant_rate: number | null
                    student_size: number | null
                    grad_students: number | null
                    undergrad_12_month: number | null
                    demographics_age_entry: number | null
                    demographics_female_share: number | null
                    demographics_men: number | null
                    demographics_women: number | null
                    demographics_race_ethnicity_white: number | null
                    demographics_race_ethnicity_black: number | null
                    demographics_race_ethnicity_asian: number | null
                    demographics_race_ethnicity_hispanic: number | null
                    demographics_race_ethnicity_pacific_islander: number | null
                    demographics_race_ethnicity_native_american: number | null
                    demographics_race_ethnicity_two_or_more: number | null
                    demographics_race_ethnicity_non_resident_alien: number | null
                    demographics_race_ethnicity_unknown: number | null
                    hispanic_serving: boolean | null
                    historically_black: boolean | null
                    predominantly_black: boolean | null
                    tribal_college: boolean | null
                    men_only: boolean | null
                    women_only: boolean | null
                    part_time_share: number | null
                    earnings_mean_6yrs: number | null
                    earnings_mean_10yrs: number | null
                    earnings_median_6yrs: number | null
                    earnings_median_8yrs: number | null
                    earnings_median_10yrs: number | null
                    earnings_working_not_enrolled_6yrs: number | null
                    earnings_working_not_enrolled_10yrs: number | null
                    repayment_1yr_completers: number | null
                    repayment_3yr_overall: number | null
                    repayment_5yr_overall: number | null
                    repayment_7yr_overall: number | null
                    repayment_declining_balance_1yr: number | null
                    repayment_declining_balance_3yr: number | null
                    repayment_declining_balance_5yr: number | null
                    ownership: string | null
                    online_only: boolean | null
                    faculty_salary: number | null
                    ft_faculty_rate: number | null
                    religious_affiliation: string | null
                }
                Insert: {
                    id?: number
                    name: string
                    alias?: string | null
                    website?: string | null
                    image_url?: string | null
                    country?: string | null
                    state?: string | null
                    city?: string | null
                    zip?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    branches?: number | null
                    is_main_campus?: boolean | null
                    carnegie_classification?: string | null
                    carnegie_size_setting?: string | null
                    avg_gpa?: number | null
                    avg_sat?: number | null
                    avg_act?: number | null
                    acceptance_rate?: number | null
                    admissions_admission_rate?: number | null
                    admissions_sat_math_25th?: number | null
                    admissions_sat_math_75th?: number | null
                    admissions_sat_reading_25th?: number | null
                    admissions_sat_reading_75th?: number | null
                    admissions_sat_writing_25th?: number | null
                    admissions_sat_writing_75th?: number | null
                    admissions_act_midpoint?: number | null
                    admissions_act_cumulative_25th?: number | null
                    admissions_act_cumulative_75th?: number | null
                    admissions_act_english_25th?: number | null
                    admissions_act_english_75th?: number | null
                    admissions_act_math_25th?: number | null
                    admissions_act_math_75th?: number | null
                    admissions_act_writing_25th?: number | null
                    admissions_act_writing_75th?: number | null
                    majors_offered?: Json | null
                    program_percentage_engineering?: number | null
                    program_percentage_computer?: number | null
                    program_percentage_business?: number | null
                    program_percentage_psychology?: number | null
                    program_percentage_biology?: number | null
                    program_percentage_visual_performing?: number | null
                    program_percentage_mathematics?: number | null
                    program_percentage_physical_science?: number | null
                    program_percentage_social_science?: number | null
                    program_percentage_multidiscipline?: number | null
                    program_percentage_health?: number | null
                    program_percentage_education?: number | null
                    program_percentage_humanities?: number | null
                    program_percentage_public_administration_social_service?: number | null
                    program_percentage_architecture?: number | null
                    program_percentage_agriculture?: number | null
                    program_percentage_security_law_enforcement?: number | null
                    program_percentage_communication?: number | null
                    program_percentage_language?: number | null
                    program_percentage_English?: number | null
                    program_percentage_history?: number | null
                    program_percentage_library?: number | null
                    program_percentage_legal?: number | null
                    program_percentage_theology_religious_vocation?: number | null
                    program_percentage_parks_recreation_fitness?: number | null
                    program_percentage_family_consumer_science?: number | null
                    program_percentage_philosophy_religious?: number | null
                    program_percentage_personal_culinary?: number | null
                    program_percentage_resources?: number | null
                    program_percentage_precision_production?: number | null
                    program_percentage_transportation?: number | null
                    program_percentage_construction?: number | null
                    program_percentage_mechanic_repair_technology?: number | null
                    program_percentage_ethnic_cultural_gender?: number | null
                    tuition?: number | null
                    costs_tuition_in_state?: number | null
                    costs_tuition_out_of_state?: number | null
                    costs_total_cost_academic_year?: number | null
                    costs_books_supplies?: number | null
                    costs_roomboard_oncampus?: number | null
                    costs_roomboard_offcampus?: number | null
                    costs_other_expenses_oncampus?: number | null
                    costs_other_expenses_offcampus?: number | null
                    costs_avg_net_price?: number | null
                    costs_net_price_income_0_30k?: number | null
                    costs_net_price_income_30_48k?: number | null
                    costs_net_price_income_48_75k?: number | null
                    costs_net_price_income_75_110k?: number | null
                    costs_net_price_income_110k_plus?: number | null
                    out_of_state_tuition?: number | null
                    price_calculator_url?: string | null
                    graduation_rate?: number | null
                    completion_rate_4yr?: number | null
                    completion_rate_less_than_4yr?: number | null
                    completion_retention_rate_4yr_full_time?: number | null
                    completion_retention_rate_4yr_part_time?: number | null
                    completion_transfer_rate_4yr_full_time?: number | null
                    completion_transfer_rate_4yr_part_time?: number | null
                    financial_aid_federal_loan_rate?: number | null
                    financial_aid_median_debt?: number | null
                    financial_aid_debt_at_entry?: number | null
                    financial_aid_debt_25th_percentile?: number | null
                    financial_aid_debt_75th_percentile?: number | null
                    financial_aid_debt_90th_percentile?: number | null
                    financial_aid_median_monthly_payments?: number | null
                    pell_grant_rate?: number | null
                    student_size?: number | null
                    grad_students?: number | null
                    undergrad_12_month?: number | null
                    demographics_age_entry?: number | null
                    demographics_female_share?: number | null
                    demographics_men?: number | null
                    demographics_women?: number | null
                    demographics_race_ethnicity_white?: number | null
                    demographics_race_ethnicity_black?: number | null
                    demographics_race_ethnicity_asian?: number | null
                    demographics_race_ethnicity_hispanic?: number | null
                    demographics_race_ethnicity_pacific_islander?: number | null
                    demographics_race_ethnicity_native_american?: number | null
                    demographics_race_ethnicity_two_or_more?: number | null
                    demographics_race_ethnicity_non_resident_alien?: number | null
                    demographics_race_ethnicity_unknown?: number | null
                    hispanic_serving?: boolean | null
                    historically_black?: boolean | null
                    predominantly_black?: boolean | null
                    tribal_college?: boolean | null
                    men_only?: boolean | null
                    women_only?: boolean | null
                    part_time_share?: number | null
                    earnings_mean_6yrs?: number | null
                    earnings_mean_10yrs?: number | null
                    earnings_median_6yrs?: number | null
                    earnings_median_8yrs?: number | null
                    earnings_median_10yrs?: number | null
                    earnings_working_not_enrolled_6yrs?: number | null
                    earnings_working_not_enrolled_10yrs?: number | null
                    repayment_1yr_completers?: number | null
                    repayment_3yr_overall?: number | null
                    repayment_5yr_overall?: number | null
                    repayment_7yr_overall?: number | null
                    repayment_declining_balance_1yr?: number | null
                    repayment_declining_balance_3yr?: number | null
                    repayment_declining_balance_5yr?: number | null
                    ownership?: string | null
                    online_only?: boolean | null
                    faculty_salary?: number | null
                    ft_faculty_rate?: number | null
                    religious_affiliation?: string | null
                }
                Update: {
                    id?: number
                    name?: string
                    alias?: string | null
                    website?: string | null
                    image_url?: string | null
                    country?: string | null
                    state?: string | null
                    city?: string | null
                    zip?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    branches?: number | null
                    is_main_campus?: boolean | null
                    carnegie_classification?: string | null
                    carnegie_size_setting?: string | null
                    avg_gpa?: number | null
                    avg_sat?: number | null
                    avg_act?: number | null
                    acceptance_rate?: number | null
                    admissions_admission_rate?: number | null
                    admissions_sat_math_25th?: number | null
                    admissions_sat_math_75th?: number | null
                    admissions_sat_reading_25th?: number | null
                    admissions_sat_reading_75th?: number | null
                    admissions_sat_writing_25th?: number | null
                    admissions_sat_writing_75th?: number | null
                    admissions_act_midpoint?: number | null
                    admissions_act_cumulative_25th?: number | null
                    admissions_act_cumulative_75th?: number | null
                    admissions_act_english_25th?: number | null
                    admissions_act_english_75th?: number | null
                    admissions_act_math_25th?: number | null
                    admissions_act_math_75th?: number | null
                    admissions_act_writing_25th?: number | null
                    admissions_act_writing_75th?: number | null
                    majors_offered?: Json | null
                    program_percentage_engineering?: number | null
                    program_percentage_computer?: number | null
                    program_percentage_business?: number | null
                    program_percentage_psychology?: number | null
                    program_percentage_biology?: number | null
                    program_percentage_visual_performing?: number | null
                    program_percentage_mathematics?: number | null
                    program_percentage_physical_science?: number | null
                    program_percentage_social_science?: number | null
                    program_percentage_multidiscipline?: number | null
                    program_percentage_health?: number | null
                    program_percentage_education?: number | null
                    program_percentage_humanities?: number | null
                    program_percentage_public_administration_social_service?: number | null
                    program_percentage_architecture?: number | null
                    program_percentage_agriculture?: number | null
                    program_percentage_security_law_enforcement?: number | null
                    program_percentage_communication?: number | null
                    program_percentage_language?: number | null
                    program_percentage_English?: number | null
                    program_percentage_history?: number | null
                    program_percentage_library?: number | null
                    program_percentage_legal?: number | null
                    program_percentage_theology_religious_vocation?: number | null
                    program_percentage_parks_recreation_fitness?: number | null
                    program_percentage_family_consumer_science?: number | null
                    program_percentage_philosophy_religious?: number | null
                    program_percentage_personal_culinary?: number | null
                    program_percentage_resources?: number | null
                    program_percentage_precision_production?: number | null
                    program_percentage_transportation?: number | null
                    program_percentage_construction?: number | null
                    program_percentage_mechanic_repair_technology?: number | null
                    program_percentage_ethnic_cultural_gender?: number | null
                    tuition?: number | null
                    costs_tuition_in_state?: number | null
                    costs_tuition_out_of_state?: number | null
                    costs_total_cost_academic_year?: number | null
                    costs_books_supplies?: number | null
                    costs_roomboard_oncampus?: number | null
                    costs_roomboard_offcampus?: number | null
                    costs_other_expenses_oncampus?: number | null
                    costs_other_expenses_offcampus?: number | null
                    costs_avg_net_price?: number | null
                    costs_net_price_income_0_30k?: number | null
                    costs_net_price_income_30_48k?: number | null
                    costs_net_price_income_48_75k?: number | null
                    costs_net_price_income_75_110k?: number | null
                    costs_net_price_income_110k_plus?: number | null
                    out_of_state_tuition?: number | null
                    price_calculator_url?: string | null
                    graduation_rate?: number | null
                    completion_rate_4yr?: number | null
                    completion_rate_less_than_4yr?: number | null
                    completion_retention_rate_4yr_full_time?: number | null
                    completion_retention_rate_4yr_part_time?: number | null
                    completion_transfer_rate_4yr_full_time?: number | null
                    completion_transfer_rate_4yr_part_time?: number | null
                    financial_aid_federal_loan_rate?: number | null
                    financial_aid_median_debt?: number | null
                    financial_aid_debt_at_entry?: number | null
                    financial_aid_debt_25th_percentile?: number | null
                    financial_aid_debt_75th_percentile?: number | null
                    financial_aid_debt_90th_percentile?: number | null
                    financial_aid_median_monthly_payments?: number | null
                    pell_grant_rate?: number | null
                    student_size?: number | null
                    grad_students?: number | null
                    undergrad_12_month?: number | null
                    demographics_age_entry?: number | null
                    demographics_female_share?: number | null
                    demographics_men?: number | null
                    demographics_women?: number | null
                    demographics_race_ethnicity_white?: number | null
                    demographics_race_ethnicity_black?: number | null
                    demographics_race_ethnicity_asian?: number | null
                    demographics_race_ethnicity_hispanic?: number | null
                    demographics_race_ethnicity_pacific_islander?: number | null
                    demographics_race_ethnicity_native_american?: number | null
                    demographics_race_ethnicity_two_or_more?: number | null
                    demographics_race_ethnicity_non_resident_alien?: number | null
                    demographics_race_ethnicity_unknown?: number | null
                    hispanic_serving?: boolean | null
                    historically_black?: boolean | null
                    predominantly_black?: boolean | null
                    tribal_college?: boolean | null
                    men_only?: boolean | null
                    women_only?: boolean | null
                    part_time_share?: number | null
                    earnings_mean_6yrs?: number | null
                    earnings_mean_10yrs?: number | null
                    earnings_median_6yrs?: number | null
                    earnings_median_8yrs?: number | null
                    earnings_median_10yrs?: number | null
                    earnings_working_not_enrolled_6yrs?: number | null
                    earnings_working_not_enrolled_10yrs?: number | null
                    repayment_1yr_completers?: number | null
                    repayment_3yr_overall?: number | null
                    repayment_5yr_overall?: number | null
                    repayment_7yr_overall?: number | null
                    repayment_declining_balance_1yr?: number | null
                    repayment_declining_balance_3yr?: number | null
                    repayment_declining_balance_5yr?: number | null
                    ownership?: string | null
                    online_only?: boolean | null
                    faculty_salary?: number | null
                    ft_faculty_rate?: number | null
                    religious_affiliation?: string | null
                }
            }
            user_targets: {
                Row: {
                    id: string
                    user_id: string
                    university_id: string
                    reason_for_interest: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    university_id: string
                    reason_for_interest?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    university_id?: string
                    reason_for_interest?: string | null
                    created_at?: string | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
