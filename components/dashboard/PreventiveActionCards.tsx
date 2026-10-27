"use client";

import React, { useState } from "react";
import {
  Wrench,
  ShieldCheck,
  Clock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  Flame,
  Check,
} from "lucide-react";
import { usePredictiveMaintenance } from "@/context/PredictiveMaintenanceContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PreventiveActionCards({
  onScheduleMaintenance,
}: {
  onScheduleMaintenance: (customTitle?: string) => void;
}) {
  const {
    selectedEquipment,
    alerts,
    updateEquipmentStatus,
    mitigateAnomaly,
  } = usePredictiveMaintenance();

  const [executedActions, setExecutedActions] = useState<Record<string, boolean>>({});

  // Get recommendations from active alert or generate intelligent fallbacks
  const activeAlert =
    alerts.find((a) => a.equipmentId === selectedEquipment.id) || alerts[0];

  const actions = activeAlert?.recommendedActions || [
    {
      id: "std-1",
      action: "Perform Ultrasonic Lubrication & Clean Spindle Air Filters",
      impact: "Maintains hydrodynamic lubrication film and keeps vibration < 1.8 mm/s",
      urgency: "Within 24h" as const,
      estimatedDowntime: "30 minutes",
    },
    {
      id: "std-2",
      action: "Execute Precision Laser Shaft Alignment Verification",
      impact: "Eliminates angular misalignment stresses on coupling joints",
      urgency: "Scheduled Shift" as const,
      estimatedDowntime: "1 hour",
    },
  ];

  const handleApplyDerate = (actionId: string) => {
    setExecutedActions((prev) => ({ ...prev, [actionId]: true }));
    // Slightly dampen sensor values to simulate operator intervention
    updateEquipmentStatus(selectedEquipment.id, {
      vibration: Math.max(1.2, Number((selectedEquipment.vibration * 0.75).toFixed(2))),
      temperature: Math.max(45, Number((selectedEquipment.temperature - 12.0).toFixed(1))),
      pressure: Math.max(90, Number((selectedEquipment.pressure * 0.8).toFixed(1))),
      healthScore: Math.min(95, selectedEquipment.healthScore + 18),
    });
  };

  return (
    <Card className="border-slate-800/80 bg-slate-900/60 overflow-hidden">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                Prescriptive Maintenance Recommendations
              </CardTitle>
              <CardDescription>
                Algorithmically prioritized SOP interventions to prevent unplanned catastrophic downtime
              </CardDescription>
            </div>
          </div>
          <Badge variant="operational" className="text-[10px]">
            {actions.length} Interventions Available
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actions.map((act) => {
            const isDone = !!executedActions[act.id];
            const isImmediate = act.urgency === "Immediate";

            return (
              <div
                key={act.id}
                className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
                  isDone
                    ? "border-emerald-500/40 bg-emerald-950/20"
                    : isImmediate
                    ? "border-amber-500/40 bg-slate-950/70 hover:border-amber-500/60"
                    : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge
                      variant={isDone ? "operational" : isImmediate ? "warning" : "secondary"}
                      className="text-[10px]"
                    >
                      {isDone ? "EXECUTED" : act.urgency.toUpperCase()}
                    </Badge>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span>{act.estimatedDowntime}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-100 leading-snug">
                    {act.action}
                  </h4>

                  <div className="mt-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 p-2.5 text-xs text-slate-300">
                    <span className="font-semibold text-cyan-400">Prognosis Benefit: </span>
                    <span>{act.impact}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-slate-800/60">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onScheduleMaintenance(act.action)}
                    className="border-slate-700 hover:border-slate-600 text-xs"
                  >
                    <Wrench className="h-3 w-3 mr-1 text-slate-400" />
                    <span>Create Ticket</span>
                  </Button>

                  <Button
                    variant={isDone ? "outline" : "default"}
                    size="xs"
                    disabled={isDone}
                    onClick={() => handleApplyDerate(act.id)}
                    className={
                      isDone
                        ? "border-emerald-500/30 text-emerald-400"
                        : "bg-cyan-600 hover:bg-cyan-500 text-white"
                    }
                  >
                    {isDone ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        <span>Applied</span>
                      </>
                    ) : (
                      <>
                        <Sliders className="h-3 w-3 mr-1" />
                        <span>Execute SOP</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
