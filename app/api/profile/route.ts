import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, currency, timeZone } = body;

        // For MVP, we'll create a new user for each profile save to keep it simple
        // In a real app, this would be an update on the authenticated user
        const user = await prisma.user.create({
            data: {
                name,
                currency,
                timeZone,
                email: `demo-${Date.now()}@example.com`, // Unique email for demo
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Profile save error:', error);
        return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
    }
}
