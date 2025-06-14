'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ReminderFormData, Reminder } from '@/types';
import { useReminderStore } from '@/store/useReminderStore';
import { getCurrentDateString } from '@/utils/dateUtils';
import { ArrowLeftIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';

const reminderSchema = z.object({
    title: z.string().min(1, 'Reminder title is required').max(100, 'Title too long'),
    petId: z.string().min(1, 'Please select a pet'),
    category: z.enum(['General', 'Lifestyle', 'Health'], {
        required_error: 'Please select a category',
    }),
    notes: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    time: z.string().min(1, 'Time is required'),
    frequency: z.enum(['Once', 'Daily', 'Weekly', 'Monthly'], {
        required_error: 'Please select frequency',
    }),
});

interface AddReminderFormProps {
    onClose: () => void;
    editingReminder?: Reminder;
}

export default function AddReminderForm({ onClose, editingReminder }: AddReminderFormProps) {
    const { addReminder, updateReminder, deleteReminder, pets } = useReminderStore();
    const [showNotes, setShowNotes] = useState(!!editingReminder?.notes);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // State for 12-hour time input
    const [timeHour, setTimeHour] = useState('12');
    const [timeMinute, setTimeMinute] = useState('06');
    const [timeAmPm, setTimeAmPm] = useState('PM');

    // Convert 12-hour to 24-hour format for form submission
    const convertTo24Hour = (hour: string, minute: string, ampm: string) => {
        let hour24 = parseInt(hour);
        if (ampm === 'AM' && hour24 === 12) hour24 = 0;
        if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
        return `${hour24.toString().padStart(2, '0')}:${minute}`;
    };

    // Convert 24-hour to 12-hour format for display
    const convertFrom24Hour = (time24: string) => {
        if (!time24) return { hour: '12', minute: '06', ampm: 'PM' };
        const [hours, minutes] = time24.split(':');
        const hour24 = parseInt(hours);
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        const ampm = hour24 >= 12 ? 'PM' : 'AM';
        return { hour: hour12.toString(), minute: minutes, ampm };
    };

    // Initialize time state from editing reminder
    useEffect(() => {
        if (editingReminder?.time) {
            const { hour, minute, ampm } = convertFrom24Hour(editingReminder.time);
            setTimeHour(hour);
            setTimeMinute(minute);
            setTimeAmPm(ampm);
        }
    }, [editingReminder]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<ReminderFormData>({
        resolver: zodResolver(reminderSchema),
        defaultValues: editingReminder || {
            title: '',
            petId: '',
            category: 'General',
            notes: '',
            startDate: getCurrentDateString(),
            time: '12:06',
            frequency: 'Daily',
        },
    });

    const onSubmit = async (data: ReminderFormData) => {
        try {
            // Convert the 12-hour time to 24-hour format
            const time24 = convertTo24Hour(timeHour, timeMinute, timeAmPm);
            const formData = { ...data, time: time24 };

            if (editingReminder) {
                updateReminder(editingReminder.id, formData);
            } else {
                addReminder(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving reminder:', error);
        }
    };

    const handleDelete = () => {
        if (editingReminder) {
            deleteReminder(editingReminder.id);
            onClose();
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
                <div className="bg-white w-full max-w-md mx-4 mb-4 rounded-t-3xl max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-gray-900">
                        <button onClick={onClose} className="p-2 text-white">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg font-semibold text-white">
                            {editingReminder ? 'Edit Reminder' : 'Add Reminder'}
                        </h2>
                        <div className="flex items-center gap-2">
                            {editingReminder && (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="p-2 text-red-400 hover:text-red-300"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            )}
                            <button
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                                className="text-emerald-400 font-semibold px-3 py-1 disabled:opacity-50"
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
                        {/* Pet and Category Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600 font-medium">Select Pet</label>
                                <select
                                    {...register('petId')}
                                    className="w-full mt-1 p-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                >
                                    <option value="">Select Pet</option>
                                    {pets.map((pet) => (
                                        <option key={pet.id} value={pet.id}>
                                            {pet.avatar} {pet.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.petId && <p className="text-red-500 text-xs mt-1">{errors.petId.message}</p>}
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 font-medium">Select Category</label>
                                <select
                                    {...register('category')}
                                    className="w-full mt-1 p-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                >
                                    <option value="General">🏷️ General</option>
                                    <option value="Lifestyle">🎯 Lifestyle</option>
                                    <option value="Health">🏥 Health</option>
                                </select>
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                            </div>
                        </div>

                        {/* Reminder Info */}
                        <div className="bg-gray-900 rounded-lg p-4">
                            <h3 className="text-white font-medium mb-3">Reminder Info</h3>
                            <div>
                                <input
                                    {...register('title')}
                                    placeholder="Set a reminder for..."
                                    className="w-full bg-gray-800 text-white placeholder-gray-400 p-3 rounded-lg border-0 focus:ring-2 focus:ring-emerald-500"
                                />
                                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                                <div className="text-gray-400 text-xs mt-1">
                                    {watch('title')?.length || 0}/100
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-600">Add Notes (Optional)</label>
                                {!showNotes && (
                                    <button
                                        type="button"
                                        onClick={() => setShowNotes(true)}
                                        className="text-emerald-500 text-sm font-medium"
                                    >
                                        Add
                                    </button>
                                )}
                            </div>
                            {showNotes && (
                                <textarea
                                    {...register('notes')}
                                    placeholder="Type here..."
                                    rows={3}
                                    className="w-full p-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                                />
                            )}
                        </div>

                        {/* Reminder Settings */}
                        <div className="bg-gray-900 rounded-lg p-4">
                            <h3 className="text-white font-medium mb-4">Reminder Settings</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-gray-300 text-sm">Start Date</label>
                                    <input
                                        type="date"
                                        {...register('startDate')}
                                        className="w-full mt-1 p-3 bg-gray-800 text-white rounded-lg border-0 focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate.message}</p>}
                                </div>

                                <div>
                                    <label className="text-gray-300 text-sm">Reminder Time</label>
                                    <div className="flex gap-2 mt-1">
                                        {/* Hour Input */}
                                        <select
                                            value={timeHour}
                                            onChange={(e) => {
                                                setTimeHour(e.target.value);
                                                const time24 = convertTo24Hour(e.target.value, timeMinute, timeAmPm);
                                                register('time').onChange({ target: { value: time24 } });
                                            }}
                                            className="w-16 p-3 bg-gray-800 text-white rounded-lg border-0 focus:ring-2 focus:ring-emerald-500 text-center"
                                        >
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                                                <option key={hour} value={hour.toString()}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>

                                        <span className="text-white text-xl flex items-center">:</span>

                                        {/* Minute Input */}
                                        <select
                                            value={timeMinute}
                                            onChange={(e) => {
                                                setTimeMinute(e.target.value);
                                                const time24 = convertTo24Hour(timeHour, e.target.value, timeAmPm);
                                                register('time').onChange({ target: { value: time24 } });
                                            }}
                                            className="w-16 p-3 bg-gray-800 text-white rounded-lg border-0 focus:ring-2 focus:ring-emerald-500 text-center"
                                        >
                                            {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(minute => (
                                                <option key={minute} value={minute}>
                                                    {minute}
                                                </option>
                                            ))}
                                        </select>

                                        {/* AM/PM Selector */}
                                        <select
                                            value={timeAmPm}
                                            onChange={(e) => {
                                                setTimeAmPm(e.target.value);
                                                const time24 = convertTo24Hour(timeHour, timeMinute, e.target.value);
                                                register('time').onChange({ target: { value: time24 } });
                                            }}
                                            className="w-20 p-3 bg-gray-800 text-white rounded-lg border-0 focus:ring-2 focus:ring-emerald-500 text-center"
                                        >
                                            <option value="AM">AM</option>
                                            <option value="PM">PM</option>
                                        </select>

                                        {/* Clock Icon */}
                                        <div className="flex items-center justify-center w-12 bg-gray-800 rounded-lg">
                                            <ClockIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                    {/* Hidden input for form registration */}
                                    <input
                                        type="hidden"
                                        {...register('time')}
                                        value={convertTo24Hour(timeHour, timeMinute, timeAmPm)}
                                    />
                                    {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time.message}</p>}
                                </div>

                                <div>
                                    <label className="text-gray-300 text-sm">Reminder Frequency</label>
                                    <p className="text-gray-400 text-xs mb-2">How often should this reminder repeat?</p>
                                    <select
                                        {...register('frequency')}
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg border-0 focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="Once">Once</option>
                                        <option value="Daily">Everyday</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                    </select>
                                    {errors.frequency && <p className="text-red-400 text-xs mt-1">{errors.frequency.message}</p>}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Reminder</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this reminder? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 