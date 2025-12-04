/**
 * InputSanitizer - Security utility for sanitizing user inputs
 * Prevents XSS attacks and ensures data integrity
 */
export class InputSanitizer {
  /**
   * Sanitizes a string by removing potentially dangerous characters
   */
  static sanitizeString(input: string | null | undefined): string {
    if (!input) return "";
    
    return input
      .trim()
      .replace(/[<>]/g, "") // Remove angle brackets
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, ""); // Remove event handlers
  }

  /**
   * Sanitizes text for display (escapes HTML)
   */
  static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Validates and sanitizes email
   */
  static sanitizeEmail(email: string | null | undefined): string | null {
    if (!email) return null;
    
    const sanitized = this.sanitizeString(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(sanitized)) {
      throw new Error("Invalid email format");
    }
    
    return sanitized.toLowerCase();
  }

  /**
   * Validates numeric input within range
   */
  static sanitizeNumber(
    value: string | number | null | undefined,
    min: number,
    max: number
  ): number | null {
    if (value === null || value === undefined || value === "") return null;
    
    const num = typeof value === "string" ? parseFloat(value) : value;
    
    if (isNaN(num)) return null;
    if (num < min || num > max) {
      throw new Error(`Value must be between ${min} and ${max}`);
    }
    
    return num;
  }

  /**
   * Sanitizes UUID format
   */
  static sanitizeUUID(uuid: string | null | undefined): string | null {
    if (!uuid) return null;
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const sanitized = this.sanitizeString(uuid);
    
    if (!uuidRegex.test(sanitized)) {
      throw new Error("Invalid UUID format");
    }
    
    return sanitized;
  }
}

