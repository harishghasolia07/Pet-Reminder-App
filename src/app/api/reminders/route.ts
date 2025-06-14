import { NextRequest, NextResponse } from 'next/server';
import { Reminder } from '@/types';

// In a real app, this would be stored in a database
// eslint-disable-next-line prefer-const
let reminders: Reminder[] = [];

export async function GET() {
    return NextResponse.json({ reminders });
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const newReminder = {
            id: Date.now().toString(),
            ...data,
            isCompleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        reminders.push(newReminder);
        return NextResponse.json({ reminder: newReminder }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, ...data } = await request.json();
        const reminderIndex = reminders.findIndex(r => r.id === id);

        if (reminderIndex === -1) {
            return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
        }

        reminders[reminderIndex] = {
            ...reminders[reminderIndex],
            ...data,
            updatedAt: new Date().toISOString(),
        };

        return NextResponse.json({ reminder: reminders[reminderIndex] });
    } catch {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const reminderIndex = reminders.findIndex(r => r.id === id);

        if (reminderIndex === -1) {
            return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
        }

        reminders.splice(reminderIndex, 1);
        return NextResponse.json({ message: 'Reminder deleted' });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
} 