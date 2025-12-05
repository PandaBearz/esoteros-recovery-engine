import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { transactions } = body; // Expecting array of { date, description, amount, ... }

        // For MVP, just log success. In real app, we'd parse and insert.
        // We need an accountId to insert.

        return NextResponse.json({ success: true, count: transactions?.length || 0 });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json({ error: 'Failed to import transactions' }, { status: 500 });
    }
}
