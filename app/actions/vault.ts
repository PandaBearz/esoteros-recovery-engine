"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";

const prisma = new PrismaClient();

export async function getVaultItems() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return [];

    const user = await prisma.user.findUnique({
        where: { clerkId },
        include: { vaultItems: { orderBy: { createdAt: 'desc' } } },
    });

    return user?.vaultItems || [];
}

export async function uploadVaultItem(formData: FormData) {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    const category = formData.get("category") as string || "General";

    if (!file) throw new Error("No file provided");

    // 1. Upload to Vercel Blob
    const blob = await put(file.name, file, {
        access: "public",
    });

    // 2. Save metadata to DB
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new Error("User not found");

    await prisma.vaultItem.create({
        data: {
            title: file.name,
            fileUrl: blob.url,
            fileType: file.type,
            category,
            userId: user.id,
        },
    });

    revalidatePath("/");
}

export async function deleteVaultItem(id: string) {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const item = await prisma.vaultItem.findUnique({
        where: { id },
        include: { user: true },
    });

    if (!item || item.user.clerkId !== clerkId) {
        throw new Error("Unauthorized");
    }

    // 1. Delete from Vercel Blob
    // We need the full URL to delete
    await del(item.fileUrl);

    // 2. Delete from DB
    await prisma.vaultItem.delete({ where: { id } });

    revalidatePath("/");
}
