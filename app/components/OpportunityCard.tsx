"use client";

import { ArrowUpRight, Sparkles, Zap } from "lucide-react";

interface OpportunityCardProps {
    title: string;
    category: "Housing" | "Career" | "Legal" | "Financial" | "Health";
    matchReason: string;
    effortLevel: "Low" | "Med" | "High";
    deadline?: string;
    url?: string;
}

const categoryColors = {
    Housing: "bg-orange-100 text-orange-700 border-orange-200",
    Career: "bg-blue-100 text-blue-700 border-blue-200",
    Legal: "bg-slate-100 text-slate-700 border-slate-200",
    Financial: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Health: "bg-rose-100 text-rose-700 border-rose-200",
};

const effortColors = {
    Low: "text-emerald-600 bg-emerald-50 border-emerald-100",
    Med: "text-amber-600 bg-amber-50 border-amber-100",
    High: "text-rose-600 bg-rose-50 border-rose-100",
};

export default function OpportunityCard({
    title,
    category,
    matchReason,
    effortLevel,
    deadline,
    url,
}: OpportunityCardProps) {
    return (
        <div className="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
            {/* Header: Category & Deadline */}
            <div className="flex justify-between items-start mb-3">
                <span
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${categoryColors[category]}`}
                >
                    {category}
                </span>
                {deadline && (
                    <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        Due {deadline}
                    </span>
                )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-800 mb-3 leading-tight group-hover:text-teal-700 transition-colors">
                {title}
            </h3>

            {/* AI Insight Box */}
            <div className="bg-slate-50 rounded-lg p-3 mb-4 border border-slate-100">
                <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">
                        AI Insight
                    </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{matchReason}</p>
            </div>

            {/* Footer: Effort & Action */}
            <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${effortColors[effortLevel]}`}>
                    <Zap className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">{effortLevel} Effort</span>
                </div>
            </div>

            <a
                href={url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                View Details
                <ArrowUpRight className="w-4 h-4" />
            </a>
        </div>
    );
}
