import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';
import { CalendarDate, TimeSlot } from '@/types';

export const getWeekDates = (date: Date): CalendarDate[] => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
    const dates: CalendarDate[] = [];

    for (let i = 0; i < 7; i++) {
        const currentDate = addDays(start, i);
        dates.push({
            date: currentDate,
            day: currentDate.getDate(),
            isToday: isToday(currentDate),
            dayName: format(currentDate, 'EEE'),
        });
    }

    return dates;
};

export const getTimeSlot = (time: string): TimeSlot => {
    const hour = parseInt(time.split(':')[0]);

    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
};

export const getTimeSlotIcon = (timeSlot: TimeSlot): string => {
    switch (timeSlot) {
        case 'morning': return '🌅';
        case 'afternoon': return '☀️';
        case 'evening': return '🌆';
        case 'night': return '🌙';
        default: return '⏰';
    }
};

export const getTimeSlotLabel = (timeSlot: TimeSlot): string => {
    switch (timeSlot) {
        case 'morning': return 'Morning';
        case 'afternoon': return 'Afternoon';
        case 'evening': return 'Evening';
        case 'night': return 'Night';
        default: return 'Other';
    }
};

export const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
};

export const getCurrentDateString = (): string => {
    return format(new Date(), 'yyyy-MM-dd');
};

export const isDateInFuture = (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    return date > today;
};

export const isSameDateAsToday = (dateString: string): boolean => {
    const date = new Date(dateString);
    return isSameDay(date, new Date());
}; 