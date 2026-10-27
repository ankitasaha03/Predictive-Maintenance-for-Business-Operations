"use client";

import React from "react";
import {
  Cpu,
  AlertTriangle,
  Wrench,
  Activity,
  ArrowUpRight,
  TrendingDown,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { usePredictiveMaintenance } from "@/context/PredictiveMaintenanceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FleetOverviewCards() {
  const { equipment, tickets, alerts, plantUptime, setActiveTab } = usePredictiveMaintenance();

  const totalMachines = equipment.length;
  const criticalCount = equipment.filter((e) => e.status === "critical").length;
  const warningCount = equipment.filter((e) => e.status === "warning").length;
  const atRiskCount = criticalCount + warningCount;

  const pendingTickets = tickets.filter(
    (t) => t.status === "Pending" || t.status === "In Progress"
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Active Machines */}
      <Card
        onClick={() => setActiveTab("equipment")}
        className="cursor-pointer hover:border-slate-700 hover:shadow-lg transition-all border-slate-800/80 bg-slate-900/60"
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Active Fleet Assets
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-white font-mono">
              {totalMachines}
              <span className="text-xs font-sans text-slate-400 font-normal ml-1.5">
                / {totalMachines} Online
              </span>
            </div>
            <Badge variant="operational" className="text-[10px]">
              100% Connected
            </Badge>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Telemetry streaming on all channels</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Machines At Risk */}
      <Card
        onClick={() => setActiveTab("equipment")}
        className={`cursor-pointer hover:shadow-lg transition-all border-slate-800/80 ${
          criticalCount > 0
            ? "bg-rose-950/20 border-rose-500/30 glow-rose"
            : "bg-slate-900/60"
        }`}
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Machines At Risk
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-rose-400 font-mono">
              {atRiskCount}
              <span className="text-xs font-sans text-slate-400 font-normal ml-1.5">
                ({criticalCount} Critical, {warningCount} Elevated)
              </span>
            </div>
            <Badge variant={criticalCount > 0 ? "critical" : "warning"} className="text-[10px]">
              {criticalCount > 0 ? "Immediate Action" : "Monitor"}
            </Badge>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span className="text-rose-300 font-medium truncate">
              {criticalCount > 0 ? "HYD-201 Thermal Runaway" : "Bearing harmonics detected"}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Pending Maintenance Tickets */}
      <Card
        onClick={() => setActiveTab("maintenance")}
        className="cursor-pointer hover:border-slate-700 hover:shadow-lg transition-all border-slate-800/80 bg-slate-900/60"
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Pending Work Orders
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Wrench className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-white font-mono">
              {pendingTickets}
              <span className="text-xs font-sans text-slate-400 font-normal ml-1.5">Active</span>
            </div>
            <Badge variant="warning" className="text-[10px]">
              1 Critical Active
            </Badge>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Next: Shift 2 (Elena R.)</span>
            <span className="text-cyan-400 hover:underline">View Schedule &rarr;</span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Overall Factory Uptime */}
      <Card className="border-slate-800/80 bg-slate-900/60">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Factory Uptime
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-emerald-400 font-mono">
              {plantUptime}%
            </div>
            <Badge variant="operational" className="text-[10px]">
              MTBF: 420 hrs
            </Badge>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>OEE Index: 92.4%</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">ISO Class II</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
