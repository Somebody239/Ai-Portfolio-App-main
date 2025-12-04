import { supabase } from '@/lib/supabase/client';

/**
 * AI Feature Types for categorizing AI operations
 */
export enum AIFeatureType {
  CourseExtraction = 'course_extraction',
  AcceptancePrediction = 'acceptance_prediction',
  PortfolioAdvice = 'portfolio_advice',
  CourseRecommendation = 'course_recommendation',
  GradeAnalysis = 'grade_analysis',
}

/**
 * AI Response structure from Grok Mini API
 */
export interface AIResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  metadata?: {
    response_time_ms: number;
    timestamp: string;
  };
}

/**
 * Options for AI requests
 */
export interface AIRequestOptions {
  temperature?: number;
  max_tokens?: number;
  featureType?: AIFeatureType;
}

/**
 * Call the Supabase AI Edge Function to interact with Grok Mini
 */
export async function callAI(
  prompt: string,
  options: AIRequestOptions = {}
): Promise<string> {
  const { temperature = 0.7, max_tokens = 2000 } = options;

  try {
    // Get session token for authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('User must be authenticated to use AI features');
    }

    // Call Edge Function
    const { data, error } = await supabase.functions.invoke('ai', {
      body: {
        prompt,
        temperature,
        max_tokens,
      },
    });

    if (error) {
      console.error('AI Edge Function error:', error);
      throw new Error(`AI request failed: ${error.message}`);
    }

    if (!data || !data.choices || data.choices.length === 0) {
      throw new Error('Invalid AI response: No choices returned');
    }

    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Invalid AI response: Empty content');
    }

    return content;
  } catch (error) {
    console.error('AI utility error:', error);
    throw error instanceof Error
      ? error
      : new Error('AI request failed: Unknown error');
  }
}

/**
 * Parse JSON response from AI with error handling
 */
export function parseAIResponse<T>(response: string): T {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\}|\[[\s\S]*\])\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;

    return JSON.parse(jsonString.trim());
  } catch (error) {
    console.error('Failed to parse AI response:', response);
    throw new Error('AI returned invalid JSON format');
  }
}

/**
 * Retry logic for AI requests
 */
export async function callAIWithRetry(
  prompt: string,
  options: AIRequestOptions = {},
  maxRetries: number = 2
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await callAI(prompt, options);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      // Don't retry authentication errors
      if (lastError.message.includes('authenticated')) {
        throw lastError;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new Error('AI request failed after retries');
}

// ============================================
// PROMPT TEMPLATES FOR EACH AI FEATURE
// ============================================

/**
 * Generate prompt for course extraction from OCR text
 */
export function generateCourseExtractionPrompt(ocrText: string): string {
  return `You are an expert at analyzing course schedules and transcripts. Extract structured course information from the following text.

Return a JSON object with this exact structure:
{
  "courses": [
    {
      "name": "Course name",
      "level": "Regular|Honors|AP|IB|Dual Enrollment",
      "year": 9-12,
      "semester": "Fall|Spring|Summer|Winter",
      "credits": 1.0,
      "grade": null
    }
  ],
  "questionsToAskUser": ["question 1", "question 2"]
}

If any information is unclear or missing, add specific questions to the questionsToAskUser array.
Only extract actual courses, not headers or labels.

TEXT:
${ocrText}`;
}

/**
 * Generate prompt for university acceptance prediction
 */
export const generateAcceptancePredictionPrompt = (data: {
  universityName: string;
  major: string;
  gpa: number;
  satScore?: number;
  actScore?: number;
  apCourses: number;
  extracurriculars: string[];
  universityStats?: {
    acceptanceRate?: number | null;
    avgGpa?: number | null;
    sat25th?: number | null;
    sat75th?: number | null;
  };
}) => {
  const {
    universityName,
    major,
    gpa,
    satScore,
    actScore,
    apCourses,
    extracurriculars,
    universityStats
  } = data;

  let statsContext = "";
  if (universityStats) {
    statsContext = `
University Context:
- Acceptance Rate: ${universityStats.acceptanceRate ? (universityStats.acceptanceRate * 100).toFixed(1) + '%' : 'N/A'}
- Average GPA: ${universityStats.avgGpa || 'N/A'}
- SAT Range (25th-75th): ${universityStats.sat25th || 'N/A'} - ${universityStats.sat75th || 'N/A'}
`;
  }

  return `
You are an expert college admissions counselor. Analyze the following student profile for admission to ${universityName} for the ${major} major.
${statsContext}
Student Profile:
- GPA: ${gpa}
- SAT: ${satScore || "N/A"}
- ACT: ${actScore || "N/A"}
- AP/Honors Courses: ${apCourses}
- Extracurriculars: ${extracurriculars.join(", ")}

Provide a JSON response with the following structure:
{
  "acceptanceLikelihood": <number 0-100>,
  "confidenceLevel": <"Low" | "Medium" | "High">,
  "scoreBreakdown": {
    "academicStrength": <number 0-100>,
    "testScoreStrength": <number 0-100>,
    "extracurricularStrength": <number 0-100>,
    "programFit": <number 0-100>
  },
  "improvementSteps": [<string array of 3-5 specific actionable steps>],
  "analysis": "<string paragraph explaining the assessment>"
}
`;
};

/**
 * Generate prompt for personalized portfolio advice
 */
export function generatePortfolioAdvicePrompt(data: {
  interests: string[];
  careerGoals: string;
  currentActivities: string[];
  personalityTraits?: string[];
}): string {
  return `Provide personalized portfolio-building advice for this student:

Interests: ${data.interests.join(', ')}
Career Goals: ${data.careerGoals}
Current Activities: ${data.currentActivities.join(', ')}
${data.personalityTraits ? `Personality Traits: ${data.personalityTraits.join(', ')}` : ''}

Return recommendations in JSON format:
{
  "competitions": [
    {"title": "Competition name", "description": "Brief description", "difficulty": "Beginner|Intermediate|Advanced", "url": "link"}
  ],
  "volunteerOpportunities": [
    {"title": "Opportunity name", "description": "Brief description", "type": "Local|Virtual|International"}
  ],
  "projectIdeas": [
    {"title": "Project name", "description": "Brief description", "skills": ["skill1", "skill2"], "timeCommitment": "hours per week"}
  ],
  "gapAnalysis": {
    "strengths": ["strength 1", "strength 2"],
    "areasToImprove": ["area 1", "area 2"],
    "recommendations": ["rec 1", "rec 2"]
  }
}`;
}

/**
 * Generate prompt for course recommendations
 */
export function generateCourseRecommendationPrompt(data: {
  currentCourses: string[];
  currentYear: number;
  intendedMajor: string;
  targetUniversities: string[];
  interests: string[];
}): string {
  return `Recommend courses for next academic year based on this student profile:

Current Year: Grade ${data.currentYear}
Current Courses: ${data.currentCourses.join(', ')}
Intended Major: ${data.intendedMajor}
Target Universities: ${data.targetUniversities.join(', ')}
Interests: ${data.interests.join(', ')}

Provide recommendations in JSON format:
{
  "recommendedCourses": [
    {
      "courseName": "Course name",
      "level": "Regular|Honors|AP|IB",
      "reason": "Why this course",
      "alignment": "How it aligns with goals",
      "difficulty": "Low|Medium|High",
      "priority": "High|Medium|Low"
    }
  ],
  "alternativePathways": [
    {
      "pathway": "Pathway description",
      "courses": ["course1", "course2"],
      "pros": ["pro1", "pro2"],
      "cons": ["con1", "con2"]
    }
  ],
  "universityRequirements": {
    "met": ["requirement 1"],
    "remaining": ["requirement 2"]
  }
}`;
}

/**
 * Generate prompt for grade analysis and study advice
 */
export function generateGradeAnalysisPrompt(data: {
  courseName: string;
  currentGrade: number;
  assignments: Array<{
    title: string;
    type: string;
    earnedPoints: number | null;
    totalPoints: number;
    weight: number;
  }>;
  targetGrade?: number;
}): string {
  const assignmentsText = data.assignments
    .map(
      (a) =>
        `- ${a.title} (${a.type}): ${a.earnedPoints ?? 'Not graded'}/${a.totalPoints} points, ${a.weight}% weight`
    )
    .join('\n');

  return `Analyze this course grade and provide study advice:

Course: ${data.courseName}
Current Grade: ${data.currentGrade}%
${data.targetGrade ? `Target Grade: ${data.targetGrade}%` : ''}

Assignments:
${assignmentsText}

Provide analysis in JSON format:
{
  "currentStanding": {
    "grade": ${data.currentGrade},
    "letterGrade": "A|B|C|D|F",
    "strengths": ["strength 1"],
    "weaknesses": ["weakness 1"]
  },
  "projections": {
    "bestCase": 0-100,
    "worstCase": 0-100,
    "mostLikely": 0-100,
    "toReachTarget": {
      "required": 0-100,
      "achievable": true|false
    }
  },
  "studyStrategy": {
    "priorities": ["priority 1", "priority 2"],
    "timeAllocation": {
      "homework": "X hours/week",
      "testPrep": "X hours/week",
      "review": "X hours/week"
    },
    "specificAdvice": ["advice 1", "advice 2"]
  },
  "weaknessPatterns": ["pattern 1", "pattern 2"]
}`;
}
