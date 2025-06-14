'use client';

import { TimeSlot } from '@/types';

const timeSlots: { slot: TimeSlot; label: string; icon: string }[] = [
    { slot: 'morning', label: 'morning', icon: '🌅' },
    { slot: 'afternoon', label: 'afternoon', icon: '☀️' },
    { slot: 'evening', label: 'evening', icon: '🌆' },
    { slot: 'night', label: 'night', icon: '🌙' }
];

export default function TimeSlotNavigation() {
    // Default to afternoon
    const currentSlot = timeSlots[1];

    return (
        <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">{currentSlot.icon}</span>
            <span className="text-sm text-gray-600">{currentSlot.label}</span>
        </div>
    );
} 