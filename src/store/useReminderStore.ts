import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Reminder, Pet, ReminderFormData, FilterOptions } from '@/types';
// Import date utilities for future use

interface ReminderStore {
    reminders: Reminder[];
    pets: Pet[];
    filters: FilterOptions;
    selectedDate: Date;

    // Actions
    addReminder: (data: ReminderFormData) => void;
    updateReminder: (id: string, data: Partial<Reminder>) => void;
    deleteReminder: (id: string) => void;
    toggleReminderComplete: (id: string) => void;
    setFilters: (filters: FilterOptions) => void;
    setSelectedDate: (date: Date) => void;
    initializeData: () => void;
    calculateStreak: (reminderId: string) => number;
}

export const useReminderStore = create<ReminderStore>()(
    persist(
        (set, get) => ({
            reminders: [],
            pets: [],
            filters: {},
            selectedDate: new Date(),

            addReminder: (data: ReminderFormData) => {
                const pet = get().pets.find(p => p.id === data.petId);
                const newReminder: Reminder = {
                    id: uuidv4(),
                    ...data,
                    petName: pet?.name || '',
                    isCompleted: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    streak: 0,
                };

                set(state => ({
                    reminders: [...state.reminders, newReminder]
                }));
            },

            updateReminder: (id: string, data: Partial<Reminder>) => {
                set(state => ({
                    reminders: state.reminders.map(reminder =>
                        reminder.id === id
                            ? { ...reminder, ...data, updatedAt: new Date().toISOString() }
                            : reminder
                    )
                }));
            },

            deleteReminder: (id: string) => {
                set(state => ({
                    reminders: state.reminders.filter(reminder => reminder.id !== id)
                }));
            },

            calculateStreak: (reminderId: string) => {
                const { reminders } = get();
                const reminder = reminders.find(r => r.id === reminderId);
                if (!reminder || reminder.frequency === 'Once') return 0;

                // Return current streak value
                // In a real app, you'd calculate based on completion history
                return reminder.streak || 0;
            },

            toggleReminderComplete: (id: string) => {
                set(state => ({
                    reminders: state.reminders.map(reminder => {
                        if (reminder.id === id) {
                            const isNowCompleted = !reminder.isCompleted;
                            let newStreak = reminder.streak || 0;

                            if (isNowCompleted) {
                                // Increment streak when completing
                                newStreak = (reminder.streak || 0) + 1;
                            } else {
                                // Reset or decrement streak when uncompleting
                                newStreak = Math.max(0, (reminder.streak || 0) - 1);
                            }

                            return {
                                ...reminder,
                                isCompleted: isNowCompleted,
                                completedAt: isNowCompleted ? new Date().toISOString() : undefined,
                                updatedAt: new Date().toISOString(),
                                streak: newStreak,
                            };
                        }
                        return reminder;
                    })
                }));
            },

            setFilters: (filters: FilterOptions) => {
                set({ filters });
            },

            setSelectedDate: (date: Date) => {
                set({ selectedDate: date });
            },

            initializeData: () => {
                const { pets, reminders } = get();
                if (pets.length === 0) {
                    // Initialize with sample pets
                    const samplePets: Pet[] = [
                        { id: '1', name: 'Browny', avatar: '🐕' },
                        { id: '2', name: 'Whiskers', avatar: '🐱' },
                        { id: '3', name: 'Buddy', avatar: '🐶' },
                    ];

                    set({ pets: samplePets });
                }

                if (reminders.length === 0) {
                    // Initialize with sample reminders
                    const sampleReminders: Reminder[] = [
                        {
                            id: '1',
                            title: 'Morning Walk',
                            petId: '1',
                            petName: 'Browny',
                            category: 'Lifestyle',
                            startDate: new Date().toISOString().split('T')[0],
                            time: '07:00', // 7:00 AM - Morning
                            frequency: 'Daily',
                            isCompleted: true,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            streak: 15,
                            completedDates: [
                                '2025-01-09',
                                '2025-01-10',
                                '2025-01-11',
                                '2025-01-12',
                                '2025-01-13',
                                '2025-01-14'
                            ]
                        },
                        {
                            id: '2',
                            title: 'Evening Walk',
                            petId: '1',
                            petName: 'Browny',
                            category: 'Lifestyle',
                            startDate: new Date().toISOString().split('T')[0],
                            time: '18:00', // 6:00 PM - Evening
                            frequency: 'Daily',
                            isCompleted: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            streak: 3,
                        },
                        {
                            id: '3',
                            title: 'Breakfast',
                            petId: '1',
                            petName: 'Browny',
                            category: 'General',
                            startDate: new Date().toISOString().split('T')[0],
                            time: '08:00', // 8:00 AM - Morning
                            frequency: 'Daily',
                            isCompleted: true,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            streak: 10,
                            completedDates: [
                                '2025-01-05',
                                '2025-01-06',
                                '2025-01-07',
                                '2025-01-08',
                                '2025-01-09',
                                '2025-01-10',
                                '2025-01-11',
                                '2025-01-12',
                                '2025-01-13',
                                '2025-01-14'
                            ]
                        },
                        {
                            id: '4',
                            title: 'Lunch',
                            petId: '1',
                            petName: 'Browny',
                            category: 'General',
                            startDate: new Date().toISOString().split('T')[0],
                            time: '13:00', // 1:00 PM - Afternoon
                            frequency: 'Daily',
                            isCompleted: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            streak: 4,
                        },
                        {
                            id: '5',
                            title: 'Medication',
                            petId: '2',
                            petName: 'Whiskers',
                            category: 'Health',
                            startDate: new Date().toISOString().split('T')[0],
                            time: '22:00', // 10:00 PM - Night
                            frequency: 'Daily',
                            isCompleted: true,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            streak: 8,
                            completedDates: [
                                '2025-01-07',
                                '2025-01-08',
                                '2025-01-09',
                                '2025-01-10',
                                '2025-01-11',
                                '2025-01-12',
                                '2025-01-13',
                                '2025-01-14'
                            ]
                        },
                        {
                            id: '6',
                            title: 'Afternoon Playtime',
                            petId: '3',
                            petName: 'Buddy',
                            category: 'Lifestyle',
                            startDate: new Date().toISOString().split('T')[0],
                            time: '15:00', // 3:00 PM - Afternoon
                            frequency: 'Daily',
                            isCompleted: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            streak: 2,
                        },
                    ];

                    set({ reminders: sampleReminders });
                }
            },
        }),
        {
            name: 'reminder-store',
            partialize: (state) => ({
                reminders: state.reminders,
                pets: state.pets,
            }),
        }
    )
); 