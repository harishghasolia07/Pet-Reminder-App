'use client';

import { useReminderStore } from '@/store/useReminderStore';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function FilterBar() {
    const { pets, filters, setFilters } = useReminderStore();
    const [showFilters, setShowFilters] = useState(false);

    const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof typeof filters]);

    const clearFilters = () => {
        setFilters({});
    };

    const updateFilter = (key: string, value: string) => {
        setFilters({
            ...filters,
            [key]: value === 'all' ? undefined : value,
        });
    };

    return (
        <div className="px-4 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${hasActiveFilters
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <FunnelIcon className="w-4 h-4" />
                        <span className="text-sm">Filter</span>
                        {hasActiveFilters && (
                            <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-0.5">
                                {Object.values(filters).filter(Boolean).length}
                            </span>
                        )}
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        >
                            <XMarkIcon className="w-4 h-4" />
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {showFilters && (
                <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="space-y-4">
                        {/* Pet Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Pet</label>
                            <select
                                value={filters.petId || 'all'}
                                onChange={(e) => updateFilter('petId', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="all">All Pets</option>
                                {pets.map((pet) => (
                                    <option key={pet.id} value={pet.id}>
                                        {pet.avatar} {pet.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                            <select
                                value={filters.category || 'all'}
                                onChange={(e) => updateFilter('category', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="all">All Categories</option>
                                <option value="General">🏷️ General</option>
                                <option value="Lifestyle">🎯 Lifestyle</option>
                                <option value="Health">🏥 Health</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 