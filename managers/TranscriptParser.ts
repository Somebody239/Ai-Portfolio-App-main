import { ParsedTranscriptData, ParsedCourse } from "@/lib/types";

export class TranscriptParser {
    /**
     * Parses transcript text and extracts course information using AI
     * Note: Placeholder implementation - requires Gemini API integration
     */
    async parseTranscript(transcriptText: string): Promise<ParsedTranscriptData> {
        // TODO: Integrate with Gemini API for actual parsing
        // const prompt = this.buildParsingPrompt(transcriptText);
        // const response = await geminiAPI.generateContent(prompt);
        // return this.parseAIResponse(response);

        // Placeholder: Return empty data structure
        return {
            courses: [],
            parsingWarnings: [
                "Gemini API key required for transcript parsing",
                "This is a placeholder implementation"
            ]
        };
    }

    /**
     * Builds the AI prompt for transcript parsing
     * @private
     */
    private buildParsingPrompt(transcriptText: string): string {
        return `You are parsing a high school transcript. Extract course information into structured JSON.

TRANSCRIPT TEXT:
"""
${transcriptText}
"""

Extract the following information:
1. All courses with:
   - Course name
   - Grade received (standardized: A+, A, A-, B+, etc.)
   - Year taken (9, 10, 11, or 12)
   - Semester (Fall, Spring, or Full Year)
   - Course level: Regular, Honors, AP, IB, or DE
   - Credits (if shown)
   - Confidence level (0.0-1.0)

2. GPA if shown (weighted and/or unweighted)

3. Student info if shown (name, graduation year, school)

IMPORTANT CONVERSION RULES:
- Percentages: 93-100=A, 90-92=A-, 87-89=B+, 83-86=B, 80-82=B-, 77-79=C+, 73-76=C, 70-72=C-, 67-69=D+, 65-66=D, <65=F
- Grade levels: "9th Grade" → 9, "Sophomore" → 10, "Junior" → 11, "Senior" → 12
- Full year courses: Mark as "Full Year"
- AP/IB/Honors: Identify by course name (e.g., "AP Calculus", "Chemistry Honors")
- Mark confidence 0.9-1.0 for clear data, 0.5-0.8 for ambiguous, <0.5 for guesses

Return ONLY valid JSON:
{
  "courses": [
    {
      "name": "string",
      "year": number,
      "semester": "Fall" | "Spring" | "Full Year",
      "grade": "string",
      "credits": number,
      "level": "Regular" | "Honors" | "AP" | "IB" | "DE",
      "confidence": number
    }
  ],
  "gpa": {
    "weighted": number,
    "unweighted": number
  },
  "studentInfo": {
    "name": "string",
    "graduationYear": number,
    "schoolName": "string"
  },
  "parsingWarnings": ["string"]
}`;
    }

    /**
     * Parses AI response and validates structure
     * @private
     */
    private parseAIResponse(response: string): ParsedTranscriptData {
        try {
            const data = JSON.parse(response);

            // Validate required fields
            if (!data.courses || !Array.isArray(data.courses)) {
                throw new Error("Invalid response: missing courses array");
            }

            // Validate each course
            data.courses.forEach((course: ParsedCourse, index: number) => {
                if (!course.name || !course.year || !course.grade || !course.level) {
                    throw new Error(`Invalid course at index ${index}: missing required fields`);
                }
                if (course.year < 9 || course.year > 12) {
                    throw new Error(`Invalid year for course ${course.name}: ${course.year}`);
                }
            });

            return data as ParsedTranscriptData;
        } catch (error) {
            console.error("Failed to parse AI response:", error);
            return {
                courses: [],
                parsingWarnings: [`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`]
            };
        }
    }

    /**
     * Extracts text from uploaded file using Gemini Vision
     * @param fileUrl URL or base64 of uploaded file
     * @param fileType MIME type
     */
    async extractTextFromFile(fileUrl: string, fileType: string): Promise<string> {
        // TODO: Implement Gemini Vision API integration
        // For PDFs and images, use Gemini's multimodal capabilities

        // Placeholder: Return instruction message
        return `Gemini Vision API integration required.
        
File type: ${fileType}
File URL: ${fileUrl}

To enable:
1. Add GEMINI_API_KEY to environment
2. Implement Gemini Vision API call
3. Extract text from PDF/image
4. Return plain text content`;
    }
}
