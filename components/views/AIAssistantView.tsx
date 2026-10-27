"use client";

import React from "react";
import {
  Bot,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Thermometer,
  Waves,
  ShieldAlert,
  ArrowRight,
  BrainCircuit,
} from "lucide-react";
import { usePredictiveMaintenance } from "@/context/PredictiveMaintenanceContext";
import { AIChatInterface } from "@/components/ai/AIChatInterface";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AIAssistantView({
  onScheduleMaintenance,
}: {
  onScheduleMaintenance: (customTitle?: string) => void;
}) {
  const {
    equipment,
    selectedEquipmentId,
    setSelectedEquipmentId,
    selectedEquipment,
    alerts,
    sendChatMessage,
  } = usePredictiveMaintenance();

  const handleTemplateClick = (prompt: string) => {
    sendChatMessage(prompt, selectedEquipment.id);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bot className="h-6 w-6 text-cyan-400" />
            <span>Industrial AI Diagnostic Copilot & Expert System</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Natural language interrogation of machine kinematics, anomaly harmonics, thermodynamic models, and prescriptive work order generation
          </p>
        </div>

        <Badge variant="cyan" className="font-mono text-xs px-3 py-1 self-start sm:self-auto">
          AI Engine: PREDIX-LLM-4.2 • ONLINE
        </Badge>
      </div>

      {/* Main Grid: Left side presets & machine picker, Right side Chat interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
        {/* Left Column (5 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
          {/* Machine Target Picker */}
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm">Active Diagnostic Focus</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              <select
                value={selectedEquipmentId}
                onChange={(e) => setSelectedEquipmentId(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold"
              >
                {equipment.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.code} - {eq.name} ({eq.healthScore}% • {eq.status.toUpperCase()})
                  </option>
                ))}
              </select>

              <div className="rounded-lg bg-slate-950/80 border border-slate-800 p-3 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Asset:</span>
                  <span className="font-semibold text-white">{selectedEquipment.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Operating Risk:</span>
                  <span
                    className={`font-mono font-bold ${
                      selectedEquipment.failureRisk > 60
                        ? "text-rose-400"
                        : selectedEquipment.failureRisk > 30
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {selectedEquipment.failureRisk}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Predicted Window:</span>
                  <span className="font-mono text-cyan-400">
                    {selectedEquipment.predictedFailureHours
                      ? `${selectedEquipment.predictedFailureHours} Hours`
                      : "Nominal"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diagnostic Investigation Blueprints */}
          <Card className="border-slate-800 bg-slate-900/60 flex-1">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-cyan-400" />
                <span>Diagnostic Blueprints</span>
              </CardTitle>
              <CardDescription className="text-xs">
                1-click expert prompts for deep mechanical interrogation
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-2">
              {[
                {
                  title: "Bearing Raceways & BPFI Harmonics",
                  desc: "Analyze 1,420 Hz sidebands and lubricant film breakdown",
                  prompt: `Analyze vibration FFT harmonics and bearing defect frequencies on ${selectedEquipment.name} (${selectedEquipment.code})`,
                  icon: Waves,
                  color: "text-cyan-400",
                },
                {
                  title: "Hydraulic Thermal Runaway Analysis",
                  desc: "Investigate bypass valve blockage and fluid viscosity degradation",
                  prompt: `Why is Hydraulic Press #2 showing high temperature and what is the cavitation risk?`,
                  icon: Thermometer,
                  color: "text-rose-400",
                },
                {
                  title: "7-Day AI Maintenance Schedule",
                  desc: "Synthesize shift schedules, technician skills, and parts inventory",
                  prompt: `Generate a maintenance schedule for next week based on current asset health scores`,
                  icon: Activity,
                  color: "text-amber-400",
                },
                {
                  title: "Lubrication & Tribology Audit",
                  desc: "Identify bearings and gearboxes with depleted oil thickness",
                  prompt: `What machines need immediate lubrication and grease replenishment?`,
                  icon: Zap,
                  color: "text-emerald-400",
                },
              ].map((template, idx) => {
                const Icon = template.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleTemplateClick(template.prompt)}
                    className="w-full text-left rounded-lg border border-slate-800/80 bg-slate-950/60 p-3 hover:border-cyan-500/40 hover:bg-slate-900 transition-all text-xs group"
                  >
                    <div className="flex items-center gap-2 font-semibold text-slate-200 group-hover:text-cyan-300">
                      <Icon className={`h-3.5 w-3.5 ${template.color}`} />
                      <span>{template.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{template.desc}</p>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (7 cols): Full Chat workspace */}
        <div className="lg:col-span-8 h-full">
          <AIChatInterface onScheduleMaintenance={onScheduleMaintenance} />
        </div>
      </div>
    </div>
  );
}
