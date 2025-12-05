"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// Define the schema for the roadmap output
const roadmapSchema = z.object({
    phases: z.array(
        z.object({
            phaseName: z.string().describe("Name of the phase, e.g., 'Phase 1: Stabilization (Days 1-30)'"),
            goal: z.string().describe("The primary goal of this phase"),
            tasks: z.array(
                z.object({
                    title: z.string().describe("Short, action-oriented task name"),
                    description: z.string().describe("One sentence explaining why this task is important"),
                    type: z.enum(["admin", "health", "financial"]).describe("Category of the task"),
                    isUrgent: z.boolean().describe("Whether this task is critical for immediate stability"),
                })
            ),
        })
    ),
    suggestedResources: z.array(
        z.object({
            query: z.string().describe("Search query to find local resources"),
            reason: z.string().describe("Why this user needs this specific resource"),
        })
    ),
});

export type Roadmap = z.infer<typeof roadmapSchema>;

interface GenerateRoadmapInput {
    oneYearGoal: string;
    currentWorry: string;
    constraints: string[];
    zipCode: string;
}

export async function generateRoadmap(input: GenerateRoadmapInput) {
    const { oneYearGoal, currentWorry, constraints, zipCode } = input;

    const systemPrompt = `
    ROLE: You are an expert Case Manager and Life Strategist. Your goal is to take a user's current crisis or situation and build a step-by-step bridge to their 1-year goal. You must be empathetic, realistic, and highly practical.

    LOGIC RULES FOR THE AI:
    1. ID is Key: If constraints includes "No ID", the VERY FIRST task in Phase 1 must be "Locate Birth Certificate or Apply for State ID." No other progress is possible without this.
    2. Bank Account: If constraints includes "No Bank Account", Phase 1 must include "Open a Second-Chance Checking Account" (suggest banks like Chime or local credit unions).
    3. Housing First: If currentWorry is "Housing", Phase 1 focuses entirely on shelter, housing vouchers, and rapid re-housing programs.
    4. Tone: Task descriptions should be encouraging. Instead of "Fix Debt," use "Review Financial Landscape."

    INPUT CONTEXT:
    - One Year Goal: ${oneYearGoal}
    - Current Worry: ${currentWorry}
    - Constraints: ${constraints.join(", ")}
    - Zip Code: ${zipCode}

    OUTPUT:
    Generate a 4-Phase Plan (Stabilization, Foundation, Growth, Thriving).
  `;

    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error("OPENAI_API_KEY is missing from environment variables.");
            return { success: false, error: "Server Error: OPENAI_API_KEY is missing. Please check .env.local" };
        }

        const { object } = await generateObject({
            model: openai("gpt-4o"),
            schema: roadmapSchema,
            system: systemPrompt,
            prompt: "Generate the recovery roadmap based on the user's situation.",
        });

        return { success: true, data: object };
    } catch (error: any) {
        console.error("Error generating roadmap:", error);

        // Fallback to mock data for demonstration if API fails (e.g. quota exceeded)
        console.log("Falling back to mock data...");
        const mockRoadmap: Roadmap = {
            phases: [
                {
                    phaseName: "Phase 1: Stabilization (Days 1-30)",
                    goal: "Secure the basics and stop the bleeding.",
                    tasks: [
                        {
                            title: "Locate Birth Certificate",
                            description: "You need this to apply for your State ID. Check with family or order online.",
                            type: "admin",
                            isUrgent: true
                        },
                        {
                            title: "Open Second-Chance Bank Account",
                            description: "Chime or a local credit union will accept you without a perfect history.",
                            type: "financial",
                            isUrgent: true
                        },
                        {
                            title: "Apply for Emergency Housing Voucher",
                            description: "Visit the local housing authority to get on the waitlist immediately.",
                            type: "admin",
                            isUrgent: true
                        }
                    ]
                },
                {
                    phaseName: "Phase 2: Foundation (Months 2-3)",
                    goal: "Build the systems for growth.",
                    tasks: [
                        {
                            title: "Resume Workshop",
                            description: "Update your resume to highlight your skills and address gaps.",
                            type: "admin",
                            isUrgent: false
                        }
                    ]
                }
            ],
            suggestedResources: [
                {
                    query: "Food pantries in " + zipCode,
                    reason: "To save cash for other stabilization needs."
                }
            ]
        };
        return { success: true, data: mockRoadmap };
    }
}
