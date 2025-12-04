export class DatePickerManager {
    /**
     * Get the days to display in the calendar grid for a given month
     */
    static getCalendarDays(currentMonth: Date): Date[] {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

        // Get the day of week for the first day (0 = Sunday)
        const startDay = monthStart.getDay();

        // Calculate start date (go back to previous Sunday)
        const startDate = new Date(monthStart);
        startDate.setDate(monthStart.getDate() - startDay);

        // Calculate end date (go forward to next Saturday)
        const endDay = monthEnd.getDay();
        const endDate = new Date(monthEnd);
        endDate.setDate(monthEnd.getDate() + (6 - endDay));

        // Generate array of dates
        const days: Date[] = [];
        const current = new Date(startDate);

        while (current <= endDate) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return days;
    }

    /**
     * Navigate to the next month
     */
    static getNextMonth(currentMonth: Date): Date {
        const next = new Date(currentMonth);
        next.setMonth(next.getMonth() + 1);
        return next;
    }

    /**
     * Navigate to the previous month
     */
    static getPreviousMonth(currentMonth: Date): Date {
        const prev = new Date(currentMonth);
        prev.setMonth(prev.getMonth() - 1);
        return prev;
    }

    /**
     * Check if a date is selected
     */
    static isSelected(date: Date, selectedDate?: Date): boolean {
        if (!selectedDate) return false;
        return (
            date.getFullYear() === selectedDate.getFullYear() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getDate() === selectedDate.getDate()
        );
    }

    /**
     * Check if a date is today
     */
    static isToday(date: Date): boolean {
        const today = new Date();
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    }

    /**
     * Check if a date is in the current month being viewed
     */
    static isCurrentMonth(date: Date, currentMonth: Date): boolean {
        return (
            date.getFullYear() === currentMonth.getFullYear() &&
            date.getMonth() === currentMonth.getMonth()
        );
    }

    /**
     * Format date for display (e.g., "October 2023")
     */
    static formatMonthYear(date: Date): string {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }

    /**
     * Format date for input value (e.g., "Oct 25, 2023")
     */
    static formatInputValue(date: Date): string {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
}
