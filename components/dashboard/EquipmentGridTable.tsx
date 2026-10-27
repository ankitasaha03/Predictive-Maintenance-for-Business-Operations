"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  SlidersHorizontal,
  Wrench,
  Bot,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import { usePredictiveMaintenance } from "@/context/PredictiveMaintenanceContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Equipment } from "@/types";

export function EquipmentGridTable({
  onScheduleMaintenance,
}: {
  onScheduleMaintenance: (equipment: Equipment) => void;
}) {
  const {
    equipment,
    selectedEquipmentId,
    setSelectedEquipmentId,
    setIsChatDrawerOpen,
    sendChatMessage,
    mitigateAnomaly,
  } = usePredictiveMaintenance();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "critical" | "warning" | "operational">("all");

  const filteredEquipment = useMemo(() => {
    return equipment.filter((eq) => {
      const matchesSearch =
        eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : eq.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [equipment, searchQuery, statusFilter]);

  const getStatusBadge = (status: Equipment["status"]) => {
    switch (status) {
      case "critical":
        return (
          <Badge variant="critical" className="gap-1.5">
            <AlertOctagon className="h-3 w-3" />
            <span>Critical Risk</span>
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="warning" className="gap-1.5">
            <AlertTriangle className="h-3 w-3" />
            <span>Elevated Risk</span>
          </Badge>
        );
      case "operational":
      default:
        return (
          <Badge variant="operational" className="gap-1.5">
            <CheckCircle2 className="h-3 w-3" />
            <span>Operational</span>
          </Badge>
        );
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  const getHealthBarColor = (score: number) => {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <Card className="border-slate-800/80 bg-slate-900/60 overflow-hidden">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Industrial Equipment Fleet Telemetry</CardTitle>
              <Badge variant="secondary" className="font-mono text-[10px]">
                {equipment.length} Assets Connected
              </Badge>
            </div>
            <CardDescription>
              Select any machine to lock live sensor streams and trigger AI diagnostic evaluations
            </CardDescription>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <Input
                placeholder="Filter machines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-slate-950/70 border-slate-800"
              />
            </div>

            <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950/70 p-0.5 text-xs">
              {(["all", "critical", "warning", "operational"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all ${
                    statusFilter === filter
                      ? "bg-slate-800 text-cyan-300 font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-t border-slate-800/80 bg-slate-950/40 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                <th className="py-3 px-4 font-semibold">Equipment / Asset</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Health Score</th>
                <th className="py-3 px-4 font-semibold">Vibration</th>
                <th className="py-3 px-4 font-semibold">Temperature</th>
                <th className="py-3 px-4 font-semibold">Pressure</th>
                <th className="py-3 px-4 font-semibold">Last Inspected</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filteredEquipment.map((eq) => {
                const isSelected = eq.id === selectedEquipmentId;

                return (
                  <tr
                    key={eq.id}
                    onClick={() => setSelectedEquipmentId(eq.id)}
                    className={`group cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-cyan-950/30 border-l-2 border-cyan-400"
                        : "hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Machine info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border font-mono font-bold text-xs ${
                            isSelected
                              ? "border-cyan-500/50 bg-cyan-500/20 text-cyan-300"
                              : "border-slate-800 bg-slate-800 text-slate-300 group-hover:border-slate-700"
                          }`}
                        >
                          {eq.code.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                            <span>{eq.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">({eq.code})</span>
                          </div>
                          <p className="text-[11px] text-slate-400">{eq.location}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(eq.status)}
                    </td>

                    {/* Health score */}
                    <td className="py-3.5 px-4 min-w-[130px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-mono font-bold ${getHealthScoreColor(eq.healthScore)}`}>
                            {eq.healthScore}%
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Risk: {eq.failureRisk}%
                          </span>
                        </div>
                        <Progress
                          value={eq.healthScore}
                          indicatorClassName={getHealthBarColor(eq.healthScore)}
                          className="h-1.5"
                        />
                      </div>
                    </td>

                    {/* Live Vibration */}
                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`${
                          eq.vibration > 4.5
                            ? "text-rose-400 font-semibold"
                            : eq.vibration > 3.0
                            ? "text-amber-400"
                            : "text-slate-300"
                        }`}
                      >
                        {eq.vibration.toFixed(2)} mm/s
                      </span>
                    </td>

                    {/* Live Temperature */}
                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`${
                          eq.temperature > 85
                            ? "text-rose-400 font-semibold"
                            : eq.temperature > 70
                            ? "text-amber-400"
                            : "text-slate-300"
                        }`}
                      >
                        {eq.temperature.toFixed(1)}°C
                      </span>
                    </td>

                    {/* Live Pressure */}
                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`${
                          eq.pressure > 175
                            ? "text-rose-400 font-semibold"
                            : eq.pressure > 140
                            ? "text-amber-400"
                            : "text-slate-300"
                        }`}
                      >
                        {eq.pressure.toFixed(1)} PSI
                      </span>
                    </td>

                    {/* Last Inspected */}
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {eq.lastInspected}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEquipmentId(eq.id);
                            setIsChatDrawerOpen(true);
                            sendChatMessage(`Perform full AI diagnosis on ${eq.name} (${eq.code})`, eq.id);
                          }}
                          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40"
                          title="Ask AI Diagnostic Copilot"
                        >
                          <Bot className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="outline"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onScheduleMaintenance(eq);
                          }}
                          className="border-slate-700 hover:border-slate-600 text-xs py-0.5 px-2"
                        >
                          <Wrench className="h-3 w-3 mr-1 text-slate-400" />
                          <span>Schedule</span>
                        </Button>

                        {eq.status !== "operational" && (
                          <Button
                            variant="emerald"
                            size="xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              mitigateAnomaly(eq.id);
                            }}
                            className="text-xs py-0.5 px-2"
                            title="Simulate applying preventive maintenance & restoring machine to operational state"
                          >
                            <span>Resolve</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
