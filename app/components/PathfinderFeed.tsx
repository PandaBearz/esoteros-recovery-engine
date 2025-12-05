"use client";

import { useState, useEffect } from "react";
import OpportunityCard from "./OpportunityCard";
import { searchResources, EnrichedOpportunity } from "../actions/pathfinder";
import { Loader2 } from "lucide-react";

const filters = ["Housing", "Career", "Financial", "Legal", "Health"];

export default function PathfinderFeed() {
    const [activeFilter, setActiveFilter] = useState("Housing");
    const [results, setResults] = useState<EnrichedOpportunity[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [aiSummary, setAiSummary] = useState("");

    useEffect(() => {
        const fetchOpportunities = async () => {
            setIsLoading(true);
            try {
                // Default zip code for now, can be dynamic later
                const { results, answer } = await searchResources("grants and assistance", activeFilter, "08096");
                setResults(results);
                setAiSummary(answer || "");
            } catch (error) {
                console.error("Failed to fetch resources:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOpportunities();
    }, [activeFilter]);

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-800">Pathfinder</h2>

                {/* Filter Bar */}
                <div className="flex flex-wrap gap-2">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeFilter === filter
                                    ? "bg-teal-600 text-white shadow-sm"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* AI Summary of the Search */}
            {aiSummary && (
                <div className="bg-teal-50 border border-teal-100 p-4 rounded-xl text-sm text-teal-800">
                    <span className="font-semibold">AI Insight:</span> {aiSummary}
                </div>
            )}

            {/* Grid Layout */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {results.map((r, i) => (
                        <OpportunityCard
                            key={i}
                            title={r.title}
                            category={activeFilter as any}
                            matchReason={r.matchReason}
                            effortLevel={r.effortLevel}
                            deadline={r.deadline}
                            url={r.url}
                        />
                    ))}
                </div>
            )}

            {!isLoading && results.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-500">No opportunities found for this category.</p>
                </div>
            )}
        </section>
    );
}
