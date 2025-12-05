import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { label, type, startingBalance } = body;

        // For MVP, attach to the most recently created user
        const user = await prisma.user.findFirst({
            orderBy: { createdAt: 'desc' },
        });

        if (!user) {
            return NextResponse.json({ error: 'No user profile found. Please save profile first.' }, { status: 400 });
        }

        const account = await prisma.account.create({
            data: {
                label,
                type,
                startingBalance: parseFloat(startingBalance),
                userId: user.id,
            },
        });

        return NextResponse.json(account);
    } catch (error) {
        console.error('Account creation error:', error);
        return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }
}
