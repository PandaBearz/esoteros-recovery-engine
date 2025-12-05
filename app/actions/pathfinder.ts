"use server";

import { tavily } from "@tavily/core";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// Initialize Tavily client
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export interface EnrichedOpportunity {
    title: string;
    url: string;
    matchReason: string;
    effortLevel: "Low" | "Med" | "High";
    deadline?: string;
}

const opportunitySchema = z.object({
    opportunities: z.array(
        z.object({
            title: z.string(),
            url: z.string(),
            matchReason: z.string().describe("Why this is a good fit for someone in recovery. Max 20 words."),
            effortLevel: z.enum(["Low", "Med", "High"]).describe("Estimated effort to apply/enroll."),
            deadline: z.string().optional().describe("Application deadline if mentioned, e.g. 'Dec 31' or 'Rolling'."),
        })
    ),
    summary: z.string().describe("A brief 1-sentence summary of the search findings."),
});

export async function searchResources(query: string, category: string, zipCode?: string) {
    try {
        // 1. Search Tavily
        const locationPart = zipCode ? `in ${zipCode}` : "";
        const fullQuery = `${category} opportunities ${locationPart} ${query} for people in recovery`;

        console.log(`Searching Tavily for: ${fullQuery}`);

        const searchResponse = await tvly.search(fullQuery, {
            searchDepth: "basic",
            maxResults: 5,
            includeAnswer: true,
        });

        // 2. Enrich with LLM
        // If OpenAI key is missing or quota exceeded, we might fail here.
        // We should wrap this in a try/catch or have a fallback.

        if (!process.env.OPENAI_API_KEY) {
            console.warn("Missing OPENAI_API_KEY, returning raw results mapped to schema.");
            return {
                results: searchResponse.results.map((r: any) => ({
                    title: r.title,
                    url: r.url,
                    matchReason: r.content.slice(0, 100) + "...",
                    effortLevel: "Med",
                })) as EnrichedOpportunity[],
                answer: searchResponse.answer,
            };
        }

        const { object } = await generateObject({
            model: openai("gpt-4o"),
            schema: opportunitySchema,
            prompt: `
        Analyze these search results for a user in recovery looking for ${category}.
        
        Search Results:
        ${JSON.stringify(searchResponse.results)}
        
        Task:
        1. Select the most relevant opportunities.
        2. Extract the deadline (if any).
        3. Estimate the effort level (Low/Med/High).
        4. Write a short "Match Reason" explaining why it helps.
        5. Ensure the URL matches the source.
      `,
        });

        return {
            results: object.opportunities,
            answer: object.summary || searchResponse.answer,
        };

    } catch (error) {
        console.error("Pathfinder Error:", error);
        return { results: [], answer: "Sorry, I couldn't find resources at this time." };
    }
}
