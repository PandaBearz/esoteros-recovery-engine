"use client";

import { Sun } from "lucide-react";
import MomentumTracker from "./MomentumTracker";

export default function MorningBrief() {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-teal-100 rounded-full text-teal-600">
          <Sun className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Good Morning, Sam.</h1>
          <p className="text-slate-500">You're on track.</p>
        </div>
      </div>

      <MomentumTracker />
    </section>
  );
}
