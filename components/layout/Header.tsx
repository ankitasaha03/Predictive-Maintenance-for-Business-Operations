"use client";

import React, { useState } from "react";
import {
  Bell,
  Activity,
  Zap,
  Bot,
  Volume2,
  VolumeX,
  Radio,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Layers,
  Wrench,
} from "lucide-react";
import { usePredictiveMaintenance } from "@/context/PredictiveMaintenanceContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Header({ onOpenSchedule }: { onOpenSchedule: () => void }) {
  const {
    equipment,
    alerts,
    plantUptime,
    isStreaming,
    setIsStreaming,
    injectAnomaly,
    soundAlertsEnabled,
    setSoundAlertsEnabled,
    setIsChatDrawerOpen,
    setSelectedEquipmentId,
    setActiveTab,
  } = usePredictiveMaintenance();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadAlerts = alerts.filter((a) => !a.acknowledged);
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-4 md:px-6 backdrop-blur-md">
      {/* Left: Plant context & Telemetry live indicator */}
      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Activity className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white">PREDIX // AI</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                Plant Alpha
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Detroit Industrial Complex • Sector 4</p>
          </div>
        </div>

        {/* Live stream status pill */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1">
          <span className="relative flex h-2 w-2">
            {isStreaming && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isStreaming ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </span>
          <span className="text-xs font-mono text-slate-300">
            {isStreaming ? "TELEMETRY: STREAMING (2.4 kHz)" : "TELEMETRY: PAUSED"}
          </span>
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className="text-[10px] font-mono uppercase text-cyan-400 hover:text-cyan-300 ml-1 underline"
          >
            {isStreaming ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      {/* Right controls: Anomaly injector, notifications, chat, audio, user */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Plant Uptime Pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs">
          <span className="text-slate-400">Uptime:</span>
          <span className="font-mono font-semibold text-emerald-400">{plantUptime}%</span>
        </div>

        {/* Anomaly Injector for Testing */}
        <Button
          variant="outline"
          size="xs"
          onClick={() => {
            // Pick a non-critical equipment or CNC
            injectAnomaly("eq-1");
          }}
          className="border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs hidden md:flex items-center gap-1.5"
          title="Simulate sudden bearing failure / vibration spike on CNC-402"
        >
          <Zap className="h-3 w-3 text-amber-400" />
          <span>Inject Test Anomaly</span>
        </Button>

        {/* Audio Alerts Toggle */}
        <button
          onClick={() => setSoundAlertsEnabled(!soundAlertsEnabled)}
          className={`p-2 rounded-lg border transition-colors ${
            soundAlertsEnabled
              ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300"
              : "border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
          title={soundAlertsEnabled ? "Audio Alerts Enabled" : "Audio Alerts Muted"}
        >
          {soundAlertsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-sm animate-pulse">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-950/60">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Telemetry Alerts</span>
                  <Badge variant={criticalCount > 0 ? "critical" : "warning"} className="text-[10px]">
                    {unreadAlerts.length} Active
                  </Badge>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Close
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {alerts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active anomalies detected. All machine streams normal.
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setSelectedEquipmentId(alert.equipmentId);
                        setShowNotifications(false);
                      }}
                      className={`p-3.5 hover:bg-slate-800/60 transition-colors cursor-pointer ${
                        !alert.acknowledged ? "bg-slate-800/30" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {alert.severity === "critical" ? (
                          <AlertOctagon className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-slate-200 truncate">
                              {alert.equipmentName}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">{alert.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{alert.title}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-mono text-cyan-400">
                              Failure Window: {alert.predictedFailureWindow}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Conf: {alert.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-800 p-2.5 bg-slate-950/80 flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveTab("sensor-analytics");
                    setShowNotifications(false);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Open Anomaly Studio &rarr;
                </button>
                <button
                  onClick={onOpenSchedule}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
                >
                  <Wrench className="h-3 w-3" />
                  <span>Work Orders</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Floating AI Chat Launcher Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsChatDrawerOpen(true)}
          className="border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 hover:text-cyan-200 flex items-center gap-1.5"
        >
          <Bot className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline text-xs font-semibold">AI Assistant</span>
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-800 ml-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-cyan-400 border border-slate-700">
            MV
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-medium text-slate-200">Marcus Vance</p>
            <p className="text-[10px] text-slate-400">Lead Reliability Eng</p>
          </div>
        </div>
      </div>
    </header>
  );
}
