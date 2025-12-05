"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getTasks() {
    const { userId: clerkId } = await auth();
    const user = await currentUser();

    if (!clerkId || !user) {
        throw new Error("Unauthorized");
    }

    // Find or create user in our DB
    let dbUser = await prisma.user.findUnique({
        where: { clerkId },
        include: { tasks: true },
    });

    if (!dbUser) {
        // Create user and seed initial tasks
        dbUser = await prisma.user.create({
            data: {
                clerkId,
                email: user.emailAddresses[0].emailAddress,
                name: `${user.firstName} ${user.lastName}`,
                tasks: {
                    create: [
                        { title: "Upload Discharge Paperwork", type: "admin", isUrgent: true },
                        { title: "Review Housing Options", type: "admin", isUrgent: true },
                        { title: "15 Minute Journal", type: "health", isUrgent: false },
                    ],
                },
            },
            include: { tasks: true },
        });
    }

    // Return tasks and streak
    return {
        tasks: dbUser.tasks.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted)),
        streak: dbUser.currentStreak,
    };
}

export async function toggleTask(taskId: string, isCompleted: boolean) {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
        throw new Error("Unauthorized");
    }

    // Verify ownership and get user data for streak calc
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { user: true },
    });

    if (!task || task.user.clerkId !== clerkId) {
        throw new Error("Unauthorized access to task");
    }

    // Update task status
    await prisma.task.update({
        where: { id: taskId },
        data: { isCompleted },
    });

    // Streak Logic (Only if completing a task)
    if (isCompleted) {
        const user = task.user;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
        if (lastActive) lastActive.setHours(0, 0, 0, 0);

        let newStreak = user.currentStreak;

        // If last active was yesterday, increment streak
        // If last active was today, do nothing
        // If last active was before yesterday, reset to 1

        if (!lastActive) {
            newStreak = 1;
        } else if (lastActive.getTime() === today.getTime()) {
            // Already active today, no change
        } else {
            const oneDay = 24 * 60 * 60 * 1000;
            const diffDays = Math.round((today.getTime() - lastActive.getTime()) / oneDay);

            if (diffDays === 1) {
                newStreak += 1;
            } else {
                newStreak = 1; // Broken streak
            }
        }

        // Update user streak and last active date
        await prisma.user.update({
            where: { id: user.id },
            data: {
                currentStreak: newStreak,
                lastActiveDate: new Date(),
            },
        });
    }

    revalidatePath("/");
}
