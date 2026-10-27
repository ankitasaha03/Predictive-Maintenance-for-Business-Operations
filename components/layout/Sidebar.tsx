"use client";

import React from "react";
import {
  LayoutDashboard,
  Cpu,
  LineChart,
  CalendarClock,
  Bot,
  AlertTriangle,
  Server,
  ShieldAlert,
  ChevronRight,
  Database,
} from "lucide-react";
import { usePredictiveMaintenance } from "@/context/PredictiveMaintenanceContext";
import { Badge } from "@/components/ui/badge";

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    equipment,
    alerts,
    tickets,
    totalDataPackets,
  } = usePredictiveMaintenance();

  const criticalMachinesCount = equipment.filter((e) => e.status === "critical").length;
  const warningMachinesCount = equipment.filter((e) => e.status === "warning").length;
  const pendingTicketsCount = tickets.filter((t) => t.status === "Pending" || t.status === "In Progress").length;

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: criticalMachinesCount > 0 ? `${criticalMachinesCount} Critical` : undefined,
      badgeVariant: "critical" as const,
    },
    {
      id: "equipment",
      label: "Equipment Fleet",
      icon: Cpu,
      badge: `${equipment.length}`,
      badgeVariant: "secondary" as const,
    },
    {
      id: "sensor-analytics",
      label: "Sensor Analytics",
      icon: LineChart,
      badge: "Live",
      badgeVariant: "cyan" as const,
    },
    {
      id: "maintenance",
      label: "Maintenance Schedule",
      icon: CalendarClock,
      badge: pendingTicketsCount > 0 ? `${pendingTicketsCount}` : undefined,
      badgeVariant: "warning" as const,
    },
    {
      id: "ai-assistant",
      label: "AI Diagnostic Copilot",
      icon: Bot,
      badge: "v4.2",
      badgeVariant: "cyan" as const,
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/70 hidden md:flex flex-col justify-between p-4 backdrop-blur-md">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">
            Operations Console
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant={item.badgeVariant} className="text-[10px] px-1.5 py-0 h-4">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Fleet Health Summary Widget */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Fleet Integrity</span>
            <span className="text-[10px] font-mono text-emerald-400">8/8 Monitored</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Operational
              </span>
              <span className="font-mono text-slate-300">
                {equipment.filter((e) => e.status === "operational").length}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Elevated Risk
              </span>
              <span className="font-mono text-amber-400 font-semibold">{warningMachinesCount}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                Critical Risk
              </span>
              <span className="font-mono text-rose-400 font-bold">{criticalMachinesCount}</span>
            </div>
          </div>

          {criticalMachinesCount > 0 && (
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-2 text-[11px] text-rose-300 flex items-start gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>Hydraulic Press #2 failure risk in ~18h. Action needed.</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer telemetry node metrics */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Database className="h-3 w-3 text-cyan-400" />
            <span>Telemetry Ingestion</span>
          </span>
          <span className="font-mono text-cyan-400 text-[10px]">
            {totalDataPackets.toLocaleString()} pts
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span>Industrial Gateway: GW-DET-04</span>
          <span className="text-emerald-400">ONLINE</span>
        </div>
        <p className="text-[10px] text-slate-600">Predix AI v4.2.1 • Enterprise ISO-13374</p>
      </div>
    </aside>
  );
}
