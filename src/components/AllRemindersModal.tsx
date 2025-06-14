'use client';

import { useState } from 'react';
import { useReminderStore } from '@/store/useReminderStore';
import { Reminder } from '@/types';
import { formatTime, getTimeSlot, getTimeSlotLabel } from '@/utils/dateUtils';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface AllRemindersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AllRemindersModal({ isOpen, onClose }: AllRemindersModalProps) {
    const { reminders, filters } = useReminderStore();
    const [viewMode, setViewMode] = useState<'all' | 'pending' | 'completed'>('all');

    // First apply store filters to all reminders
    const storeFilteredReminders = reminders.filter(reminder => {
        if (filters.petId && reminder.petId !== filters.petId) return false;
        if (filters.category && reminder.category !== filters.category) return false;
        return true;
    });

    // Then apply view mode filter
    const filteredReminders = storeFilteredReminders.filter(reminder => {
        if (viewMode === 'pending' && reminder.isCompleted) return false;
        if (viewMode === 'completed' && !reminder.isCompleted) return false;
        return true;
    });

    // Calculate counts for each tab
    const allCount = storeFilteredReminders.length;
    const pendingCount = storeFilteredReminders.filter(r => !r.isCompleted).length;
    const completedCount = storeFilteredReminders.filter(r => r.isCompleted).length;

    // Group reminders by frequency
    const groupedReminders = filteredReminders.reduce((acc, reminder) => {
        const key = reminder.frequency;
        if (!acc[key]) acc[key] = [];
        acc[key].push(reminder);
        return acc;
    }, {} as Record<string, Reminder[]>);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">All Reminders</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* View Mode Toggles */}
                        <div className="flex gap-2">
                            {(['all', 'pending', 'completed'] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === mode
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {mode.charAt(0).toUpperCase() + mode.slice(1)} ({
                                        mode === 'all' ? allCount :
                                            mode === 'pending' ? pendingCount :
                                                completedCount
                                    })
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                        {Object.keys(groupedReminders).length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📋</div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">No reminders found</h3>
                                <p className="text-gray-600">Try adjusting your filters or add some new reminders.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {Object.entries(groupedReminders).map(([frequency, reminders]) => (
                                    <div key={frequency}>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <span>🔄 {frequency} Reminders</span>
                                            <span className="text-sm text-gray-500">({reminders.length})</span>
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {reminders.map((reminder) => (
                                                <motion.div
                                                    key={reminder.id}
                                                    className={`p-4 rounded-xl border-2 transition-all ${reminder.isCompleted
                                                        ? 'bg-gray-50 border-emerald-200 opacity-75'
                                                        : 'bg-white border-gray-200 hover:border-emerald-300'
                                                        }`}
                                                    whileHover={{ scale: 1.02 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-2xl">🐕</span>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className={`font-medium text-gray-900 truncate ${reminder.isCompleted ? 'line-through text-gray-500' : ''
                                                                }`}>
                                                                {reminder.title}
                                                            </h4>

                                                            <div className="mt-2 space-y-1 text-xs text-gray-500">
                                                                <div className="flex items-center gap-1">
                                                                    <span>👤</span>
                                                                    <span>{reminder.petName}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <span>⏰</span>
                                                                    <span>{formatTime(reminder.time)}</span>
                                                                    <span className="text-gray-400">
                                                                        ({getTimeSlotLabel(getTimeSlot(reminder.time))})
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <span>📂</span>
                                                                    <span>{reminder.category}</span>
                                                                </div>
                                                            </div>



                                                            {reminder.notes && (
                                                                <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                                                                    {reminder.notes}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {reminder.isCompleted && (
                                                            <div className="flex-shrink-0">
                                                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                                    <span className="text-white text-sm">✓</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
} 