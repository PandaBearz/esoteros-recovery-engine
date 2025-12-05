"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Check } from "lucide-react";
import { getTasks, toggleTask } from "../actions/momentum";

interface Task {
    id: string;
    title: string;
    isCompleted: boolean;
}

export default function MomentumTracker() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [streakDays, setStreakDays] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const { tasks: fetchedTasks, streak } = await getTasks();
                setTasks(fetchedTasks);
                setStreakDays(streak);
            } catch (error) {
                console.error("Failed to load tasks:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadTasks();
    }, []);

    const completedCount = tasks.filter((t) => t.isCompleted).length;
    const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    useEffect(() => {
        // Check if all tasks are completed
        const allCompleted = tasks.length > 0 && tasks.every(t => t.isCompleted);

        if (allCompleted && !showCelebration) {
            setShowCelebration(true);
            triggerConfetti();
        } else if (!allCompleted && showCelebration) {
            setShowCelebration(false);
        }
    }, [tasks, showCelebration]);

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    };

    const handleToggleTask = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setTasks((prev) => {
            const newTasks = prev.map((t) =>
                t.id === id ? { ...t, isCompleted: !currentStatus } : t
            );
            return newTasks.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
        });

        try {
            await toggleTask(id, !currentStatus);
            // Ideally we'd re-fetch streak here to update it immediately if it changed
        } catch (error) {
            console.error("Failed to toggle task:", error);
            // Revert on error (could re-fetch here)
        }
    };

    if (isLoading) {
        return <div className="p-6 text-center text-slate-500">Loading your momentum...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Momentum Card */}
            <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-4">
                <h3 className="text-lg font-medium text-slate-500">Momentum</h3>
                <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* SVG Circle Progress */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-slate-100"
                        />
                        <motion.circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={351.86}
                            strokeDashoffset={351.86 - (351.86 * (progress / 100))}
                            className="text-teal-500"
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: 351.86 }}
                            animate={{ strokeDashoffset: 351.86 - (351.86 * (progress / 100)) }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-slate-800">{streakDays}</span>
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Days</span>
                    </div>
                </div>
                <p className="text-sm text-slate-500 text-center">
                    {progress === 100 ? "All done for today! Amazing work." : "Consistent progress builds a new life."}
                </p>
            </div>

            {/* Priority Stack (Task List) */}
            <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-0 left-0 right-0 bg-teal-500 text-white text-center py-1 text-sm font-medium z-10"
                    >
                        Day Complete! Great work.
                    </motion.div>
                )}

                <h3 className="text-lg font-medium text-slate-500 mb-4 mt-2">Today's Actions</h3>
                <div className="space-y-3">
                    <AnimatePresence>
                        {tasks.map((task) => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: task.isCompleted ? 0.5 : 1,
                                    y: 0,
                                    backgroundColor: task.isCompleted ? "#F9FAFB" : "#FFFFFF"
                                }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.02, translateY: -2 }}
                                onClick={() => handleToggleTask(task.id, task.isCompleted)}
                                className={`
                  flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                  ${task.isCompleted ? "border-slate-200" : "border-l-4 border-l-teal-500 border-slate-100 shadow-sm"}
                `}
                            >
                                <div className={`
                  w-5 h-5 rounded-full flex items-center justify-center border
                  ${task.isCompleted ? "bg-teal-500 border-teal-500 text-white" : "border-slate-300 text-transparent"}
                `}>
                                    <Check className="w-3 h-3" />
                                </div>
                                <span className={`text-slate-700 ${task.isCompleted ? "line-through text-slate-400" : ""}`}>
                                    {task.title}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
