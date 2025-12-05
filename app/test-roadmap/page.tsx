"use client";

import { useState } from "react";
import { generateRoadmap, Roadmap } from "../actions";

export default function TestRoadmapPage() {
    const [result, setResult] = useState<Roadmap | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        const input = {
            oneYearGoal: "Living in my own place",
            currentWorry: "Housing",
            constraints: ["No ID", "No Bank Account"],
            zipCode: "08096"
        };

        try {
            const response = await generateRoadmap(input);
            if (response.success && response.data) {
                setResult(response.data);
            } else {
                setError(response.error || "Unknown error");
            }
        } catch (err) {
            setError("Failed to call server action");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">Test Roadmap Generation</h1>
            <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
                {loading ? "Generating..." : "Generate Roadmap"}
            </button>

            {error && <div className="text-red-500">Error: {error}</div>}

            {result && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Generated Roadmap:</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[500px]">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
