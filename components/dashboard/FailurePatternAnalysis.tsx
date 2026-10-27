"use client";

import React from "react";
import {
  BrainCircuit,
  AlertOctagon,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Cpu,
  ShieldAlert,
} from "lucide-react";
import { usePredictiveMaintenance } from "@/context/PredictiveMaintenanceContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function FailurePatternAnalysis({
  onScheduleMaintenance,
}: {
  onScheduleMaintenance: () => void;
}) {
  const {
    selectedEquipment,
    alerts,
    acknowledgeAlert,
    setIsChatDrawerOpen,
    sendChatMessage,
  } = usePredictiveMaintenance();

  // Find active alert for the selected machine, or fallback to the most severe alert
  const currentAlert =
    alerts.find((a) => a.equipmentId === selectedEquipment.id) ||
    alerts.find((a) => a.severity === "critical") ||
    alerts[0];

  if (!currentAlert) {
    return (
      <Card className="border-slate-800/80 bg-slate-900/60">
        <CardContent className="p-6 text-center text-slate-400 text-sm">
          <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
          <p className="font-semibold text-slate-200">No Failure Patterns Detected</p>
          <p className="text-xs text-slate-400 mt-1">
            Machine harmonics and thermal dissipation operate within standard ISO tolerances.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isCritical = currentAlert.severity === "critical";

  return (
    <Card
      className={`border-slate-800/80 transition-all ${
        isCritical
          ? "bg-rose-950/20 border-rose-500/40 glow-rose"
          : "bg-slate-900/60 border-amber-500/30"
      }`}
    >
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                isCritical
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                  : "bg-amber-500/20 border-amber-500/40 text-amber-300"
              }`}
            >
              <BrainCircuit className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold">
                  AI Anomaly Detection & Failure Prognosis
                </CardTitle>
                <Badge variant={isCritical ? "critical" : "warning"} className="text-[10px]">
                  {currentAlert.severity.toUpperCase()}
                </Badge>
              </div>
              <CardDescription>
                Proactive Machine Learning classification based on acoustic & thermodynamic degradation curves
              </CardDescription>
            </div>
          </div>

          <Badge variant="cyan" className="font-mono text-[10px] shrink-0">
            Model: CNN-LSTM-v4
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 space-y-4">
        {/* Main predicted failure banner */}
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-300 font-semibold">
                Predicted Failure Horizon
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-rose-400" />
                <span className="text-xl md:text-2xl font-bold font-mono text-white">
                  {currentAlert.predictedFailureWindow}
                </span>
                <span className="text-xs text-rose-300">
                  ({currentAlert.confidence}% AI Confidence)
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-mono text-slate-400">Target Asset</span>
              <p className="text-xs font-semibold text-slate-100">
                {currentAlert.equipmentName} ({currentAlert.equipmentCode})
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            {currentAlert.description}
          </p>
        </div>

        {/* Confidence & Failure Probability Meter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-rose-400" />
              <span>Failure Probability Index</span>
            </span>
            <span className="font-mono font-bold text-rose-400">
              {currentAlert.confidence}%
            </span>
          </div>
          <Progress
            value={currentAlert.confidence}
            indicatorClassName={isCritical ? "bg-rose-500" : "bg-amber-500"}
            className="h-2"
          />
        </div>

        {/* Identified Root Causes */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Identified Root Causes (FFT & Thermodynamic Attributions)
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {currentAlert.rootCauses.map((cause, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-lg bg-slate-950/60 border border-slate-800/80 p-2.5 text-xs text-slate-300"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[10px] font-mono text-cyan-400 shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{cause}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive action triggers */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={onScheduleMaintenance}
              className="bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold"
            >
              <Zap className="h-3.5 w-3.5 mr-1" />
              <span>Generate Work Order</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsChatDrawerOpen(true);
                sendChatMessage(
                  `Provide step-by-step diagnostic breakdown for ${currentAlert.equipmentName}: ${currentAlert.title}`,
                  currentAlert.equipmentId
                );
              }}
              className="border-slate-700 hover:border-slate-600 text-xs text-cyan-300"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1 text-cyan-400" />
              <span>Deep AI Analysis</span>
            </Button>
          </div>

          {!currentAlert.acknowledged && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => acknowledgeAlert(currentAlert.id)}
              className="text-xs text-slate-400 hover:text-white"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-slate-500" />
              <span>Acknowledge Risk</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
