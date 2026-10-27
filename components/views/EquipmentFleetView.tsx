"use client";

import React, { useState } from "react";
import {
  Cpu,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Wrench,
  Bot,
  Activity,
  Layers,
  Sparkles,
  Zap,
  Clock,
  Gauge,
  Thermometer,
  Waves,
} from "lucide-react";
import { usePredictiveMaintenance } from "@/context/PredictiveMaintenanceContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Equipment } from "@/types";

export function EquipmentFleetView({
  onScheduleMaintenance,
}: {
  onScheduleMaintenance: (equipment: Equipment) => void;
}) {
  const {
    equipment,
    selectedEquipmentId,
    setSelectedEquipmentId,
    setActiveTab,
    setIsChatDrawerOpen,
    sendChatMessage,
    injectAnomaly,
    mitigateAnomaly,
  } = usePredictiveMaintenance();

  const [searchQuery, setSearchQuery] = useState("");
  const [criticalityFilter, setCriticalityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = equipment.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" ? true : eq.status === statusFilter;
    const matchesCrit = criticalityFilter === "all" ? true : eq.criticality.includes(criticalityFilter);

    return matchesSearch && matchesStatus && matchesCrit;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-cyan-400" />
            <span>Industrial Equipment Fleet Catalog</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Real-time digital twin monitoring of {equipment.length} plant assets with sensor telemetry and MTBF wear indices
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => injectAnomaly("eq-7")}
            className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs"
          >
            <Zap className="h-3.5 w-3.5 mr-1 text-amber-400" />
            <span>Simulate Anomaly (Slurry Pump)</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by asset name, code, sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-950/80 border-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status buttons */}
          <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs">
            {["all", "critical", "warning", "operational"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                  statusFilter === s ? "bg-slate-800 text-cyan-300 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Criticality filter */}
          <select
            value={criticalityFilter}
            onChange={(e) => setCriticalityFilter(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">All Criticality Tiers</option>
            <option value="Tier 1">Tier 1 - Critical</option>
            <option value="Tier 2">Tier 2 - High</option>
            <option value="Tier 3">Tier 3 - Standard</option>
          </select>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((eq) => {
          const isSelected = eq.id === selectedEquipmentId;
          const isCritical = eq.status === "critical";
          const isWarning = eq.status === "warning";

          return (
            <Card
              key={eq.id}
              onClick={() => setSelectedEquipmentId(eq.id)}
              className={`cursor-pointer transition-all hover:scale-[1.01] hover:shadow-xl ${
                isSelected
                  ? "border-cyan-500/70 bg-slate-900/90 glow-cyan"
                  : isCritical
                  ? "border-rose-500/40 bg-rose-950/15"
                  : isWarning
                  ? "border-amber-500/30 bg-amber-950/10"
                  : "border-slate-800/80 bg-slate-900/60"
              }`}
            >
              <CardContent className="p-4 space-y-3.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      {eq.code} • {eq.type}
                    </span>
                    <h3 className="font-bold text-sm text-slate-100 hover:text-cyan-300 transition-colors">
                      {eq.name}
                    </h3>
                  </div>

                  <Badge
                    variant={isCritical ? "critical" : isWarning ? "warning" : "operational"}
                    className="text-[10px]"
                  >
                    {eq.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Health Score Meter */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Health Index</span>
                    <span
                      className={`font-mono font-bold ${
                        eq.healthScore >= 80
                          ? "text-emerald-400"
                          : eq.healthScore >= 60
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {eq.healthScore}%
                    </span>
                  </div>
                  <Progress
                    value={eq.healthScore}
                    indicatorClassName={
                      eq.healthScore >= 80
                        ? "bg-emerald-500"
                        : eq.healthScore >= 60
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }
                    className="h-1.5"
                  />
                </div>

                {/* Real-time Telemetry Metrics Triad */}
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-950/70 border border-slate-800/80 p-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Vib (RMS)</span>
                    <span
                      className={`font-mono text-xs font-bold ${
                        eq.vibration > 4.5
                          ? "text-rose-400"
                          : eq.vibration > 3.0
                          ? "text-amber-400"
                          : "text-slate-200"
                      }`}
                    >
                      {eq.vibration.toFixed(1)} <span className="text-[9px] text-slate-500">mm/s</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">Temp</span>
                    <span
                      className={`font-mono text-xs font-bold ${
                        eq.temperature > 85
                          ? "text-rose-400"
                          : eq.temperature > 70
                          ? "text-amber-400"
                          : "text-slate-200"
                      }`}
                    >
                      {eq.temperature.toFixed(0)} <span className="text-[9px] text-slate-500">°C</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">Pressure</span>
                    <span className="font-mono text-xs font-bold text-slate-200">
                      {eq.pressure.toFixed(0)} <span className="text-[9px] text-slate-500">PSI</span>
                    </span>
                  </div>
                </div>

                {/* Specs / Meta */}
                <div className="space-y-1 text-[11px] text-slate-400 border-t border-slate-800/60 pt-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-slate-300 truncate max-w-[140px]">{eq.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Run Hours:</span>
                    <span className="font-mono text-slate-300">{eq.operatingHours.toLocaleString()} hrs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">MTBF:</span>
                    <span className="font-mono text-cyan-400">{eq.mtbfHours} hrs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Lead Tech:</span>
                    <span className="text-slate-300">{eq.assignedTechnician}</span>
                  </div>
                </div>

                {/* Anomaly Callout if detected */}
                {eq.anomalyDetected && (
                  <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-2 text-[10px] text-rose-300">
                    <span className="font-bold">⚠️ Anomaly: </span>
                    {eq.anomalyReason}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-800/60">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEquipmentId(eq.id);
                      setActiveTab("sensor-analytics");
                    }}
                    className="text-cyan-400 hover:text-cyan-300 text-xs px-2"
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    <span>Telemetry</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onScheduleMaintenance(eq);
                      }}
                      className="text-xs px-2 border-slate-700"
                    >
                      <Wrench className="h-3 w-3 mr-1 text-slate-400" />
                      <span>Ticket</span>
                    </Button>

                    {eq.status !== "operational" && (
                      <Button
                        variant="emerald"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          mitigateAnomaly(eq.id);
                        }}
                        className="text-xs px-2"
                        title="Resolve & Reset"
                      >
                        <span>Fix</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
