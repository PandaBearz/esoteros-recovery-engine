"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";

interface Stage {
    title: string;
    timeline: string;
    status: "completed" | "active" | "upcoming";
    description: string;
}

const stages: Stage[] = [
    {
        title: "Stabilization",
        timeline: "Now",
        status: "active",
        description: "Securing housing, healthcare, and daily routine."
    },
    {
        title: "Foundation",
        timeline: "Month 1",
        status: "upcoming",
        description: "Building professional skills and community network."
    },
    {
        title: "Growth",
        timeline: "Month 6",
        status: "upcoming",
        description: "Career advancement and financial independence."
    },
    {
        title: "Thriving",
        timeline: "Year 1",
        status: "upcoming",
        description: "Long-term goals and giving back to the community."
    }
];

export default function VisionTimeline() {
    return (
        <section className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Vision Timeline</h2>

            <div className="relative pl-4">
                {/* Vertical Line */}
                <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-border" />

                <div className="space-y-8">
                    {stages.map((stage, i) => (
                        <div key={i} className="relative flex items-start gap-4">
                            {/* Icon/Indicator */}
                            <div className={`
                relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 
                ${stage.status === 'active' ? 'bg-primary border-primary text-primary-foreground' :
                                    stage.status === 'completed' ? 'bg-primary border-primary text-primary-foreground' :
                                        'bg-background border-secondary text-secondary'}
              `}>
                                {stage.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                                    stage.status === 'active' ? <Clock className="w-4 h-4" /> :
                                        <Circle className="w-4 h-4" />}
                            </div>

                            {/* Content */}
                            <div className={`flex-1 p-4 rounded-xl border transition-all ${stage.status === 'active' ? 'bg-card border-primary shadow-md' : 'bg-transparent border-transparent opacity-70'
                                }`}>
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className={`font-medium ${stage.status === 'active' ? 'text-primary' : 'text-foreground'}`}>
                                        {stage.title}
                                    </h3>
                                    <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                                        {stage.timeline}
                                    </span>
                                </div>
                                <p className="text-sm text-secondary">{stage.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
