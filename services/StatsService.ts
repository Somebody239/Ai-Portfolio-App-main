import { Course, University, UserTarget, StandardizedScore, TestType } from "@/lib/types";

export class StatsService {

  // Singleton instance (optional, but good for managers)
  private static instance: StatsService;


  public static getInstance(): StatsService {

    if (!StatsService.instance) {
      StatsService.instance = new StatsService();
    }

    return StatsService.instance;
  }


  /**
   * Calculates unweighted GPA on a 4.0 scale from 0-100 grades.
   */
  public calculateGPA(courses: Course[]): number {
    const gradedCourses = courses.filter(c => c.grade !== null);
    if (gradedCourses.length === 0) return 0.0;

    let totalPoints = 0;

    gradedCourses.forEach((course) => {
      let gpaPoints = 0;
      const grade = course.grade!;

      if (grade >= 93) gpaPoints = 4.0;
      else if (grade >= 90) gpaPoints = 3.7;
      else if (grade >= 87) gpaPoints = 3.3;
      else if (grade >= 83) gpaPoints = 3.0;
      else if (grade >= 80) gpaPoints = 2.7;
      else if (grade >= 70) gpaPoints = 2.0;
      else if (grade >= 60) gpaPoints = 1.0;

      totalPoints += gpaPoints;
    });

    return parseFloat((totalPoints / gradedCourses.length).toFixed(2));
  }


  /**
   * Determines if a university is a Safety, Target, or Reach.
   */
  /**
   * Determines if a university is a Safety, Target, or Reach.
   */
  public calculateAdmissionsRisk(
    userGpa: number,
    userSat: number | null,
    uni: University
  ): "Safety" | "Target" | "Reach" | "High Reach" {

    let score = 0;
    const uniGpa = uni.avg_gpa || 3.5; // Default fallback
    const uniSat = uni.avg_sat || 1200; // Default fallback
    const acceptanceRate = uni.acceptance_rate || 0.5; // Default fallback

    // GPA Check
    if (userGpa >= uniGpa + 0.2) score += 2;
    else if (userGpa >= uniGpa - 0.1) score += 1;
    else score -= 2;

    // SAT Check (if available)
    if (userSat) {
      if (userSat >= uniSat + 50) score += 2;
      else if (userSat >= uniSat - 30) score += 1;
      else score -= 2;
    }

    // Acceptance Rate Weighting (acceptance_rate is 0-1)
    if (acceptanceRate < 0.15) score -= 2; // Ivy logic (< 15%)
    else if (acceptanceRate < 0.30) score -= 1; // Competitive (< 30%)

    if (score >= 3) return "Safety";
    if (score >= 0) return "Target";
    if (score >= -2) return "Reach";
    return "High Reach";
  }


  public getBestScore(scores: StandardizedScore[], type: TestType): number | null {

    const specificScores = scores.filter((s) => s.test_type === type);

    if (specificScores.length === 0) return null;

    return Math.max(...specificScores.map((s) => s.score));
  }
}


