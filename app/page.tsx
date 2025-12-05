"use client";

import MorningBrief from "./components/MorningBrief";
import Pathfinder from "./components/Pathfinder";
import VisionTimeline from "./components/VisionTimeline";
import DigitalVault from "./components/DigitalVault";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <header className="flex justify-between items-center mb-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            E
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Esoteros Analytics</span>
        </div>
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <SignedIn>
          {/* Left Column: Daily Operations (Morning Brief & Pathfinder) */}
          <div className="lg:col-span-8 space-y-8">
            <MorningBrief />
            <Pathfinder />
          </div>

          {/* Right Column: Long-term Vision (Timeline) */}
          <div className="lg:col-span-4 space-y-8">
            <VisionTimeline />
            <DigitalVault />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="col-span-12 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 max-w-2xl">
              Rebuild your life with <span className="text-teal-600">momentum</span>.
            </h1>
            <p className="text-lg text-slate-600 max-w-xl">
              Esoteros Analytics is your personal operating system for recovery.
              Track your progress, find resources, and build a vision for the future.
            </p>
            <SignInButton mode="modal">
              <button className="px-8 py-4 bg-teal-600 text-white rounded-xl font-semibold text-lg hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </main>
    </div>
  );
}
