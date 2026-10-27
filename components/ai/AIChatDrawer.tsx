"use client";

import React from "react";
import { X, Bot, Sparkles, MessageSquare } from "lucide-react";
import { usePredictiveMaintenance } from "@/context/PredictiveMaintenanceContext";
import { AIChatInterface } from "./AIChatInterface";
import { Button } from "@/components/ui/button";

export function AIChatDrawer({
  onScheduleMaintenance,
}: {
  onScheduleMaintenance: (customTitle?: string) => void;
}) {
  const { isChatDrawerOpen, setIsChatDrawerOpen } = usePredictiveMaintenance();

  if (!isChatDrawerOpen) {
    // Render persistent floating pill button in bottom right
    return (
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsChatDrawerOpen(true)}
          className="flex items-center gap-2.5 rounded-full border border-cyan-500/40 bg-slate-900/95 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md hover:bg-slate-800 hover:border-cyan-400 hover:scale-105 transition-all glow-cyan"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-slate-950 font-bold">
            <Bot className="h-3.5 w-3.5" />
          </div>
          <span>AI Diagnostics</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsChatDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className="relative z-50 flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-950 shadow-2xl transition-transform duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3.5 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Predix AI Diagnostics Drawer</h3>
              <p className="text-[11px] text-slate-400">Contextual Industrial LLM & Sensor Reasoning</p>
            </div>
          </div>
          <button
            onClick={() => setIsChatDrawerOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-3 overflow-hidden">
          <AIChatInterface onScheduleMaintenance={onScheduleMaintenance} />
        </div>
      </div>
    </div>
  );
}
