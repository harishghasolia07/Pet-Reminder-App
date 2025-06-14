'use client';

import { useState, useEffect } from 'react';
import { getWeekDates } from '@/utils/dateUtils';
import { useReminderStore } from '@/store/useReminderStore';
import { CalendarDate } from '@/types';
import AllRemindersModal from './AllRemindersModal';

export default function CalendarStrip() {
    const { selectedDate, setSelectedDate, reminders } = useReminderStore();
    const [weekDates, setWeekDates] = useState<CalendarDate[]>([]);
    const [showAllReminders, setShowAllReminders] = useState(false);

    useEffect(() => {
        setWeekDates(getWeekDates(selectedDate));
    }, [selectedDate]);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    const hasCompletedReminders = (date: Date) => {
        const dateString = date.toISOString().split('T')[0];
        return reminders.some(reminder =>
            reminder.isCompleted &&
            (reminder.completedAt?.startsWith(dateString) ||
                reminder.completedDates?.includes(dateString))
        );
    };

    const getStreakConnection = (date: Date, index: number) => {
        const hasCompleted = hasCompletedReminders(date);

        if (!hasCompleted) return false;

        // Check if the next day also has completed reminders
        if (index >= weekDates.length - 1) return false;

        const nextDate = weekDates[index + 1].date;
        const nextHasCompleted = hasCompletedReminders(nextDate);

        return nextHasCompleted;
    };

    return (
        <>
            <div className="bg-emerald-500 px-4 pt-12 pb-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-white text-xl font-semibold">daily reminders</h1>
                    <button
                        onClick={() => setShowAllReminders(true)}
                        className="text-white text-sm hover:underline transition-all"
                    >
                        view all
                    </button>
                </div>

                <div className="mb-4">
                    <div className="flex items-center text-white mb-2">
                        <span className="text-sm mr-2">⚡</span>
                        <span className="text-sm">your streaks</span>
                    </div>

                    <div className="bg-white/20 rounded-2xl p-4">
                        <div className="text-white font-medium mb-3">march 2025</div>
                        <div className="flex justify-between items-center relative">
                            {weekDates.map((dateItem, index) => {
                                const hasCompleted = hasCompletedReminders(dateItem.date);
                                const isPastDate = dateItem.date < new Date(new Date().setHours(0, 0, 0, 0));
                                const hasConnection = getStreakConnection(dateItem.date, index);

                                return (
                                    <div key={index} className="relative flex items-center">
                                        <button
                                            onClick={() => handleDateSelect(dateItem.date)}
                                            className={`flex flex-col items-center min-w-[40px] p-2 rounded-lg transition-colors relative z-10 ${dateItem.isToday
                                                ? 'bg-white text-emerald-500 font-semibold'
                                                : hasCompleted
                                                    ? 'bg-emerald-400 text-white font-medium'
                                                    : isPastDate
                                                        ? 'text-white/50 line-through'
                                                        : 'text-white hover:bg-white/20'
                                                }`}
                                        >
                                            <span className="text-xs mb-1">
                                                {dateItem.dayName.slice(0, 2)}
                                            </span>
                                            <span className={`text-lg ${dateItem.isToday ? 'font-bold' : 'font-medium'}`}>
                                                {dateItem.day}
                                            </span>
                                        </button>

                                        {/* Connection line to next date */}
                                        {hasConnection && index < weekDates.length - 1 && (
                                            <div className="absolute top-1/2 -right-2 w-4 h-0.5 bg-emerald-300 z-0 transform -translate-y-1/2" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <AllRemindersModal
                isOpen={showAllReminders}
                onClose={() => setShowAllReminders(false)}
            />
        </>
    );
} 