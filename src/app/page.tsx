'use client';

import { useState, useEffect, useMemo } from 'react';
import { useReminderStore } from '@/store/useReminderStore';
import CalendarStrip from '@/components/CalendarStrip';
import ReminderCard from '@/components/ReminderCard';
import AddReminderForm from '@/components/AddReminderForm';
import FilterBar from '@/components/FilterBar';
import TimeSlotNavigation from '@/components/TimeSlotNavigation';
import { Reminder, TimeSlot } from '@/types';
import { getTimeSlot, getTimeSlotLabel, isSameDateAsToday, formatTime } from '@/utils/dateUtils';
import { PlusIcon, HomeIcon, HeartIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const { reminders, filters, initializeData } = useReminderStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Filter reminders for today and recurring reminders
  const todayReminders = useMemo(() => {
    let filteredReminders = reminders.filter(reminder => {
      // For "Once" reminders, only show if scheduled for today
      if (reminder.frequency === 'Once') {
        return isSameDateAsToday(reminder.startDate);
      }

      // For recurring reminders (Daily, Weekly, Monthly), show them all
      // since they should be active every day/week/month
      return true;
    });

    // Apply filters
    if (filters.petId) {
      filteredReminders = filteredReminders.filter(reminder => reminder.petId === filters.petId);
    }
    if (filters.category) {
      filteredReminders = filteredReminders.filter(reminder => reminder.category === filters.category);
    }

    return filteredReminders;
  }, [reminders, filters]);

  // Group reminders by completion status and sort by time
  const pendingReminders = todayReminders
    .filter(r => !r.isCompleted)
    .sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      const minutesA = timeA[0] * 60 + timeA[1];
      const minutesB = timeB[0] * 60 + timeB[1];
      return minutesA - minutesB;
    });
  const completedReminders = todayReminders.filter(r => r.isCompleted);

  // Group pending reminders by time slot and sort by time
  const remindersByTimeSlot = useMemo(() => {
    const grouped: Record<string, Reminder[]> = {};

    pendingReminders.forEach(reminder => {
      const timeSlot = getTimeSlot(reminder.time);
      if (!grouped[timeSlot]) {
        grouped[timeSlot] = [];
      }
      grouped[timeSlot].push(reminder);
    });

    // Sort reminders within each time slot by time (nearest first)
    Object.keys(grouped).forEach(timeSlot => {
      grouped[timeSlot].sort((a, b) => {
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        const minutesA = timeA[0] * 60 + timeA[1];
        const minutesB = timeB[0] * 60 + timeB[1];
        return minutesA - minutesB;
      });
    });

    return grouped;
  }, [pendingReminders]);

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingReminder(undefined);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Calendar Strip */}
      <CalendarStrip />

      {/* Filter Bar */}
      <FilterBar />

      {/* Main Content */}
      <div className="px-4 pb-20">
        {/* Time Slot Navigation */}
        <TimeSlotNavigation />

        {/* Pending Reminders by Time Slot */}
        <AnimatePresence>
          {Object.entries(remindersByTimeSlot).map(([timeSlot, slotReminders]) => {
            const isExpanded = expandedSections[`timeslot-${timeSlot}`];
            const displayedReminders = isExpanded ? slotReminders : slotReminders.slice(0, 3);

            return (
              <motion.div
                key={timeSlot}
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="flex items-center justify-between mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span>{getTimeSlotLabel(timeSlot as TimeSlot)}</span>
                    <motion.span
                      className="text-sm text-gray-500"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      ({slotReminders.length})
                    </motion.span>
                  </h3>

                  {slotReminders.length > 3 && (
                    <button
                      onClick={() => toggleSection(`timeslot-${timeSlot}`)}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <span>{isExpanded ? 'Show Less' : 'View All'}</span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    </button>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <AnimatePresence>
                    {displayedReminders.map((reminder, index) => (
                      <motion.div
                        key={reminder.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                      >
                        <ReminderCard
                          reminder={reminder}
                          onEdit={handleEditReminder}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* No pending reminders message */}
        {pendingReminders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">All caught up!</h3>
            <p className="text-gray-600 mb-4">No pending reminders for today</p>
          </div>
        )}

        {/* Pending Goals Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm text-gray-500">pending goals ({pendingReminders.length})</h3>
            {pendingReminders.length > 3 && (
              <button
                onClick={() => toggleSection('pending-goals')}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span>{expandedSections['pending-goals'] ? 'Show Less' : 'View All'}</span>
                <motion.div
                  animate={{ rotate: expandedSections['pending-goals'] ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>
            )}
          </div>

          {pendingReminders.length > 0 ? (
            <div className="space-y-2">
              <AnimatePresence>
                {(expandedSections['pending-goals'] ? pendingReminders : pendingReminders.slice(0, 3)).map((reminder) => (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-lg p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🐕</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{reminder.title}</p>
                        <p className="text-sm text-gray-500">For {reminder.petName} • At {formatTime(reminder.time)} • {reminder.frequency}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">No pending goals found</p>
              <p className="text-xs text-gray-400 mt-1">Check if filters are applied</p>
            </div>
          )}
        </div>

        {/* Completed Goals Section */}
        {completedReminders.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-gray-500">completed goals ({completedReminders.length})</h3>
              {completedReminders.length > 3 && (
                <button
                  onClick={() => toggleSection('completed-goals')}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <span>{expandedSections['completed-goals'] ? 'Show Less' : 'View All'}</span>
                  <motion.div
                    animate={{ rotate: expandedSections['completed-goals'] ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
              )}
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {(expandedSections['completed-goals'] ? completedReminders : completedReminders.slice(0, 3)).map((reminder) => (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-100 rounded-lg p-3 flex items-center gap-3"
                  >
                    <span className="text-xl opacity-50">🐕</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-500 line-through">{reminder.title}</p>
                    </div>
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <motion.button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-emerald-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-emerald-600 transition-colors z-50 aspect-square"
        whileHover={{ scale: 1.1, boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)" }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          delay: 1,
          duration: 0.6,
          bounce: 0.3
        }}
      >
        <motion.div
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          <PlusIcon className="w-8 h-8" />
        </motion.div>
      </motion.button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-center max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-8">
            <button className="p-3 text-gray-400">
              <HomeIcon className="w-6 h-6" />
            </button>
            <button className="p-3 text-gray-400">
              <HeartIcon className="w-6 h-6" />
            </button>
            <div className="bg-gray-900 px-6 py-2 rounded-full">
              <span className="text-white text-sm font-medium">🔔 reminders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Reminder Form Modal */}
      {showAddForm && (
        <AddReminderForm
          onClose={handleCloseForm}
          editingReminder={editingReminder}
        />
      )}
    </div>
  );
}
