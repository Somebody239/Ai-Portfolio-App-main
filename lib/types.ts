export type UUID = string;

export enum TestType {
  SAT = "SAT",
  ACT = "ACT",
  AP = "AP",
  IB = "IB",
  TOEFL = "TOEFL",
  IELTS = "IELTS",
  OTHER = "Other",
}

export enum CourseTerm {
  Fall = "Fall",
  Spring = "Spring",
  Summer = "Summer",
  Winter = "Winter",
}

// --- Database Models ---

export type CurriculumType = 'AP' | 'IB' | 'Both' | null;

export interface User {
  id: UUID;
  name: string | null;
  email: string | null;
  intended_major: string | null;
  current_gpa: number | null;
  curriculum_type?: CurriculumType;
  interests?: string[];
  target_universities?: string[];
  created_at?: string | null;
}

export enum CourseLevel {
  Regular = "Regular",
  Honors = "Honors",
  AP = "AP",
  IB = "IB",
  DualEnrollment = "Dual Enrollment",
}

export interface Course {
  id: UUID;
  user_id: UUID;
  name: string;
  grade: number | null; // 0-100, nullable since tracked via assignments
  level: CourseLevel;
  year: number;
  semester: CourseTerm;
  credits?: number;
  created_at?: string | null;
}

export enum AssignmentType {
  Homework = "homework",
  Quiz = "quiz",
  Test = "test",
  Project = "project",
  Lab = "lab",
  Participation = "participation",
  FinalExam = "final_exam",
  Midterm = "midterm",
  Other = "other",
}

export enum AssignmentStatus {
  Pending = "pending",
  Submitted = "submitted",
  Graded = "graded",
  Late = "late",
  Missing = "missing",
}

export interface Assignment {
  id: UUID;
  course_id: UUID;
  user_id: UUID;
  title: string;
  description?: string | null;
  assignment_type: AssignmentType;
  total_points: number;
  earned_points?: number | null;
  weight_percentage: number; // 0-100
  due_date?: string | null;
  submitted_date?: string | null;
  status: AssignmentStatus;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CourseGradeHistory {
  id: UUID;
  course_id: UUID;
  user_id: UUID;
  calculated_grade: number;
  report_card_grade?: number | null;
  grade_date: string;
  is_final: boolean;
  notes?: string | null;
  created_at?: string | null;
}

export interface StandardizedScore {
  id: UUID;
  user_id: UUID;
  test_type: TestType;
  score: number;
  section_scores?: Record<string, number>;
  date_taken?: string | null;
  created_at?: string | null;
}

export interface University {
  id: number; // Changed from UUID to number to match new schema
  name: string;
  alias?: string | null;
  website?: string | null;
  image_url?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  zip?: string | null;
  latitude?: number | null;
  longitude?: number | null;

  // Admissions
  avg_gpa?: number | null;
  avg_sat?: number | null;
  avg_act?: number | null;
  acceptance_rate?: number | null;
  admissions_admission_rate?: number | null;

  // SAT Percentiles
  admissions_sat_math_25th?: number | null;
  admissions_sat_math_75th?: number | null;
  admissions_sat_reading_25th?: number | null;
  admissions_sat_reading_75th?: number | null;
  admissions_sat_writing_25th?: number | null;
  admissions_sat_writing_75th?: number | null;

  // ACT Percentiles
  admissions_act_midpoint?: number | null;
  admissions_act_cumulative_25th?: number | null;
  admissions_act_cumulative_75th?: number | null;
  admissions_act_english_25th?: number | null;
  admissions_act_english_75th?: number | null;
  admissions_act_math_25th?: number | null;
  admissions_act_math_75th?: number | null;
  admissions_act_writing_25th?: number | null;
  admissions_act_writing_75th?: number | null;

  // Costs
  tuition?: number | null;
  costs_tuition_in_state?: number | null;
  costs_tuition_out_of_state?: number | null;
  costs_total_cost_academic_year?: number | null;
  costs_books_supplies?: number | null;
  costs_roomboard_oncampus?: number | null;
  costs_roomboard_offcampus?: number | null;
  costs_avg_net_price?: number | null;
  price_calculator_url?: string | null;

  // Programs (JSON)
  majors_offered?: any | null; // Using any for JSONB flexibility

  // Program Percentages
  program_percentage_engineering?: number | null;
  program_percentage_computer?: number | null;
  program_percentage_business?: number | null;
  program_percentage_psychology?: number | null;
  program_percentage_biology?: number | null;
  program_percentage_visual_performing?: number | null;
  program_percentage_mathematics?: number | null;
  program_percentage_health?: number | null;
  // ... (other program percentages can be accessed dynamically or added as needed)

  // Demographics
  student_size?: number | null;
  grad_students?: number | null;
  demographics_female_share?: number | null;
  demographics_race_ethnicity_white?: number | null;
  demographics_race_ethnicity_black?: number | null;
  demographics_race_ethnicity_asian?: number | null;
  demographics_race_ethnicity_hispanic?: number | null;

  // Outcomes
  graduation_rate?: number | null;
  earnings_median_10yrs?: number | null;
  financial_aid_median_debt?: number | null;

  // Meta
  created_at?: string | null;
}

export interface UniversityAdmissions {
  acceptanceRate: number;
  avgGpa: number;
  sat: {
    average: number;
    math25th: number;
    math75th: number;
    reading25th: number;
    reading75th: number;
  };
  act: {
    average: number;
    composite25th: number;
    composite75th: number;
  };
}

export interface UniversityCosts {
  tuitionInState: number;
  tuitionOutOfState: number;
  totalCost: number;
  avgNetPrice: number;
}

export interface UserTarget {
  id: UUID;
  user_id: UUID;
  university_id: number;
  university?: University; // Joined data
  reason_for_interest?: string | null;
  created_at?: string | null;
}
export interface UserTargetWithUniversity extends UserTarget {
  university: University;
}


export interface AIRecommendation {
  id: UUID;
  user_id: UUID;
  feature_type: AIFeatureType;
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown>;
  confidence_score?: number | null;
  created_at?: string | null;
}

export enum AIFeatureType {
  CourseExtraction = 'course_extraction',
  AcceptancePrediction = 'acceptance_prediction',
  PortfolioAdvice = 'portfolio_advice',
  CourseRecommendation = 'course_recommendation',
  GradeAnalysis = 'grade_analysis',
}

export interface AIQueryLog {
  id: UUID;
  user_id: UUID;
  feature_type: string;
  prompt_length: number;
  response_time_ms?: number | null;
  status: 'success' | 'error' | 'timeout';
  error_message?: string | null;
  tokens_used?: number | null;
  created_at?: string | null;
}

// Specific AI Response Types

export interface ExtractedCourse {
  name: string;
  level: CourseLevel;
  year: number;
  semester: CourseTerm;
  credits: number;
  grade: number | null;
}

export interface CourseExtractionResult {
  courses: ExtractedCourse[];
  questionsToAskUser: string[];
}

export interface AcceptancePredictionResult {
  acceptanceLikelihood: number;
  confidenceLevel: 'Low' | 'Medium' | 'High';
  scoreBreakdown: {
    academicStrength: number;
    testScoreStrength: number;
    extracurricularStrength: number;
    programFit: number;
  };
  improvementSteps: string[];
  analysis: string;
}

export interface PortfolioRecommendation {
  title: string;
  description: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  url?: string;
  type?: string;
  skills?: string[];
  timeCommitment?: string;
}

export interface PortfolioAdviceResult {
  competitions: PortfolioRecommendation[];
  volunteerOpportunities: PortfolioRecommendation[];
  projectIdeas: PortfolioRecommendation[];
  gapAnalysis: {
    strengths: string[];
    areasToImprove: string[];
    recommendations: string[];
  };
}

export interface CourseRecommendationResult {
  recommendedCourses: Array<{
    courseName: string;
    level: CourseLevel;
    reason: string;
    alignment: string;
    difficulty: 'Low' | 'Medium' | 'High';
    priority: 'High' | 'Medium' | 'Low';
  }>;
  alternativePathways: Array<{
    pathway: string;
    courses: string[];
    pros: string[];
    cons: string[];
  }>;
  universityRequirements: {
    met: string[];
    remaining: string[];
  };
}

export interface GradeAnalysisResult {
  currentStanding: {
    grade: number;
    letterGrade: string;
    strengths: string[];
    weaknesses: string[];
  };
  projections: {
    bestCase: number;
    worstCase: number;
    mostLikely: number;
    toReachTarget?: {
      required: number;
      achievable: boolean;
    };
  };
  studyStrategy: {
    priorities: string[];
    timeAllocation: {
      homework: string;
      testPrep: string;
      review: string;
    };
    specificAdvice: string[];
  };
  weaknessPatterns: string[];
}

export interface Extracurricular {
  id: UUID;
  user_id: UUID;
  name: string;
  title: string;
  description?: string | null;
  level: string; // Local/State/National/International/School/Community
  hours_per_week: number;
  years_participated: number;
  created_at?: string | null;
}

export interface Achievement {
  id: UUID;
  user_id: UUID;
  title: string;
  description?: string | null;
  category?: string | null;
  awarded_by?: string | null;
  date_awarded?: string | null;
  created_at?: string | null;
}

export interface PersonalityInput {
  id: UUID;
  user_id: UUID;
  question: string;
  answer: string;
  created_at?: string | null;
}

export interface Opportunity {
  id: UUID;
  title: string;
  description?: string | null;
  eligibility?: Record<string, unknown> | null;
  image_url?: string | null;
  link?: string | null;
  type?: string | null;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;
}

export interface UserSettings {
  id: UUID;
  user_id: UUID;
  notifications_enabled: boolean;
  email_frequency: 'daily' | 'weekly' | 'never';
  theme: 'dark' | 'light';
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PersonalityInput {
  id: UUID;
  user_id: UUID;
  question: string;
  answer: string;
  created_at?: string | null;
}

export interface PersonalityQuestion {
  id: UUID;
  user_id: UUID;
  question: string;
  answer: string;
  created_at?: string | null;
}

export interface EssayPrompt {
  id: string; // Can be hardcoded ID
  prompt_text: string;
  category: 'common_app' | 'personal' | 'supplemental';
  word_limit: number;
}

