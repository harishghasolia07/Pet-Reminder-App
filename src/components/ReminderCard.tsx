'use client';

import { Reminder } from '@/types';
import { formatTime } from '@/utils/dateUtils';
import { useReminderStore } from '@/store/useReminderStore';
import { CheckIcon, PencilIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReminderCardProps {
    reminder: Reminder;
    onEdit: (reminder: Reminder) => void;
}

export default function ReminderCard({ reminder, onEdit }: ReminderCardProps) {
    const { toggleReminderComplete, deleteReminder } = useReminderStore();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleComplete = async () => {
        setIsCompleting(true);

        // Add a small delay for animation effect
        setTimeout(() => {
            toggleReminderComplete(reminder.id);
            setIsCompleting(false);
        }, 600);
    };

    const handleDelete = () => {
        deleteReminder(reminder.id);
        setShowDeleteConfirm(false);
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Health': return 'bg-red-100 text-red-600';
            case 'Lifestyle': return 'bg-blue-100 text-blue-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        backgroundColor: isCompleting ? '#dcfce7' : (reminder.isCompleted ? '#f3f4f6' : '#ffffff')
                    }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                        backgroundColor: { duration: 0.6 }
                    }}
                    className={`bg-white rounded-2xl p-4 mb-3 shadow-sm border-l-4 transition-all ${reminder.isCompleted
                        ? 'border-emerald-500 bg-gray-50 opacity-75'
                        : 'border-transparent hover:shadow-md'
                        } ${isCompleting ? 'ring-2 ring-emerald-300' : ''}`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                                <motion.span
                                    className="text-2xl flex-shrink-0"
                                    animate={{
                                        scale: isCompleting ? [1, 1.2, 1] : 1,
                                        rotate: isCompleting ? [0, 10, -10, 0] : 0
                                    }}
                                    transition={{ duration: 0.6 }}
                                >
                                    🐕
                                </motion.span>
                                <div className="flex-1 min-w-0">
                                    <motion.h3
                                        className={`font-semibold text-gray-900 truncate ${reminder.isCompleted ? 'line-through text-gray-500' : ''
                                            }`}
                                        animate={{
                                            color: isCompleting ? '#10b981' : (reminder.isCompleted ? '#6b7280' : '#111827')
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {reminder.title}
                                    </motion.h3>
                                    {/* Mobile: Show only essential info */}
                                    <div className="block sm:hidden space-y-1">
                                        <div className="text-sm text-gray-500">
                                            For {reminder.petName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {formatTime(reminder.time)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {reminder.frequency}
                                        </div>
                                    </div>

                                    {/* Desktop: Show all info */}
                                    <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                                        <span>👤 For {reminder.petName}</span>
                                        <span>⏰ At {formatTime(reminder.time)}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(reminder.category)}`}>
                                            {reminder.category}
                                        </span>
                                        <span>🔄 {reminder.frequency}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded details for mobile */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        className="mt-3 pt-3 border-t border-gray-100 sm:hidden"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(reminder.category)}`}>
                                                    {reminder.category}
                                                </span>
                                            </div>

                                            {reminder.notes && (
                                                <p className="text-sm text-gray-600">
                                                    {reminder.notes}
                                                </p>
                                            )}

                                            {/* Action buttons for mobile expanded view */}
                                            <div className="flex items-center gap-2 pt-2">
                                                <motion.button
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </motion.button>

                                                <motion.button
                                                    onClick={() => onEdit(reminder)}
                                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Desktop: Notes */}
                            {reminder.notes && (
                                <motion.p
                                    className="hidden sm:block text-sm text-gray-600 mt-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    {reminder.notes}
                                </motion.p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Mobile: Expand button */}
                            <motion.button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="sm:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isExpanded ? (
                                    <ChevronUpIcon className="w-5 h-5" />
                                ) : (
                                    <ChevronDownIcon className="w-5 h-5" />
                                )}
                            </motion.button>

                            {/* Desktop: Action buttons */}
                            <motion.button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="hidden sm:block p-2 text-gray-400 hover:text-red-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <TrashIcon className="w-5 h-5" />
                            </motion.button>

                            <motion.button
                                onClick={() => onEdit(reminder)}
                                className="hidden sm:block p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <PencilIcon className="w-5 h-5" />
                            </motion.button>

                            {/* Complete button - always visible */}
                            <motion.button
                                onClick={handleComplete}
                                disabled={isCompleting}
                                className={`p-2 rounded-full transition-colors ${reminder.isCompleted
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-gray-200 text-gray-400 hover:bg-emerald-500 hover:text-white'
                                    }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                animate={{
                                    backgroundColor: isCompleting ? '#10b981' : undefined,
                                    scale: isCompleting ? [1, 1.2, 1] : 1
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {isCompleting ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                                    >
                                        <CheckIcon className="w-5 h-5" />
                                    </motion.div>
                                ) : (
                                    <CheckIcon className="w-5 h-5" />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.3 }}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Reminder</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete &ldquo;{reminder.title}&rdquo;? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <motion.button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
} 