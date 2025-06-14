export interface Pet {
    id: string;
    name: string;
    avatar?: string;
}

export interface Reminder {
    id: string;
    title: string;
    petId: string;
    petName: string;
    category: 'General' | 'Lifestyle' | 'Health';
    notes?: string;
    startDate: string;
    time: string;
    frequency: 'Once' | 'Daily' | 'Weekly' | 'Monthly';
    isCompleted: boolean;
    completedAt?: string;
    streak?: number;
    completedDates?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ReminderFormData {
    title: string;
    petId: string;
    category: 'General' | 'Lifestyle' | 'Health';
    notes?: string;
    startDate: string;
    time: string;
    frequency: 'Once' | 'Daily' | 'Weekly' | 'Monthly';
}

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';

export interface FilterOptions {
    petId?: string;
    category?: string;
    timeSlot?: TimeSlot;
}

export interface CalendarDate {
    date: Date;
    day: number;
    isToday: boolean;
    dayName: string;
} 