'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { DatePickerManager } from '@/managers/DatePickerManager';
import { cn } from '@/lib/utils';

interface DatePickerProps {
    value?: Date | string | null;
    onChange: (date: Date | null) => void;
    label?: string;
    placeholder?: string;
    helperText?: string;
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    className?: string;
}

export function DatePicker({
    value,
    onChange,
    label,
    placeholder = 'Select date',
    helperText,
    minDate,
    maxDate,
    disabled = false,
    className,
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Normalize value to Date
    const dateValue = useMemo(() => typeof value === 'string' ? (value ? new Date(value) : null) : value, [value]);

    // Update current month when value changes
    useEffect(() => {
        if (dateValue) {
            setCurrentMonth(dateValue);
        }
    }, [dateValue]);

    const handlePrevMonth = () => {
        setCurrentMonth(DatePickerManager.getPreviousMonth(currentMonth));
    };

    const handleNextMonth = () => {
        setCurrentMonth(DatePickerManager.getNextMonth(currentMonth));
    };

    const handleDateSelect = (date: Date) => {
        onChange(date);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
    };

    const handleToday = () => {
        const today = new Date();
        onChange(today);
        setCurrentMonth(today);
        setIsOpen(false);
    };

    const calendarDays = DatePickerManager.getCalendarDays(currentMonth);
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-zinc-300">
                    {label}
                </label>
            )}
            <div className={cn("relative w-full", className)} ref={containerRef}>
                {/* Input Trigger */}
                <div
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={cn(
                        "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm text-zinc-300 cursor-pointer hover:border-zinc-700 transition-colors",
                        disabled && "opacity-50 cursor-not-allowed",
                        isOpen && "border-zinc-600 ring-1 ring-zinc-600"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-zinc-500" />
                        <span className={cn(!dateValue && "text-zinc-500")}>
                            {dateValue ? DatePickerManager.formatInputValue(dateValue) : placeholder}
                        </span>
                    </div>
                    {dateValue && !disabled && (
                        <div
                            onClick={handleClear}
                            className="p-1 hover:bg-zinc-800 rounded-full transition-colors"
                        >
                            <X className="w-3 h-3 text-zinc-500" />
                        </div>
                    )}
                </div>

                {/* Calendar Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 mt-2 p-4 w-[280px] bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-1 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="font-medium text-white">
                                    {DatePickerManager.formatMonthYear(currentMonth)}
                                </span>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-1 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Week Days */}
                            <div className="grid grid-cols-7 mb-2">
                                {weekDays.map((day) => (
                                    <div key={day} className="text-center text-xs text-zinc-500 font-medium">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map((date, index) => {
                                    const isCurrentMonth = DatePickerManager.isCurrentMonth(date, currentMonth);
                                    const isSelected = DatePickerManager.isSelected(date, dateValue || undefined);
                                    const isToday = DatePickerManager.isToday(date);

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleDateSelect(date)}
                                            className={cn(
                                                "h-8 w-8 rounded-md text-sm flex items-center justify-center transition-all relative",
                                                !isCurrentMonth && "text-zinc-700",
                                                isCurrentMonth && !isSelected && "text-zinc-300 hover:bg-zinc-800 hover:text-white",
                                                isSelected && "bg-blue-600 text-white shadow-lg shadow-blue-900/20",
                                                isToday && !isSelected && "text-blue-400 font-medium"
                                            )}
                                        >
                                            {date.getDate()}
                                            {isToday && !isSelected && (
                                                <div className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div className="mt-4 pt-3 border-t border-zinc-800">
                                <button
                                    onClick={handleToday}
                                    className="w-full py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                                >
                                    Today
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {helperText && (
                <p className="text-xs text-zinc-500">{helperText}</p>
            )}
        </div>
    );
}
