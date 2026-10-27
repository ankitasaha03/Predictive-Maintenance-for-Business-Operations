"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  Activity,
  Play,
  Pause,
  Sliders,
  Maximize2,
  Gauge,
  Thermometer,
  Waves,
  Zap,
  Info,
} from "lucide-react";
import { usePredictiveMaintenance } from "@/context/PredictiveMaintenanceContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RealTimeSensorCharts() {
  const {
    selectedEquipment,
    sensorHistory,
    currentSensorData,
    isStreaming,
    setIsStreaming,
    timeRange,
    setTimeRange,
    injectAnomaly,
  } = usePredictiveMaintenance();

  const [activeMetricTab, setActiveMetricTab] = useState<"all" | "vibration" | "temperature" | "pressure">("all");

  const stream = sensorHistory[selectedEquipment.id] || [];

  // Metric status determination
  const isVibCritical = currentSensorData.vibration >= currentSensorData.vibrationThresholdCritical;
  const isVibWarning = currentSensorData.vibration >= currentSensorData.vibrationThresholdWarning;

  const isTempCritical = currentSensorData.temperature >= currentSensorData.tempThresholdCritical;
  const isTempWarning = currentSensorData.temperature >= currentSensorData.tempThresholdWarning;

  const isPressCritical = currentSensorData.pressure >= currentSensorData.pressureThresholdCritical;
  const isPressWarning = currentSensorData.pressure >= currentSensorData.pressureThresholdWarning;

  // Custom Dark Industrial Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs font-mono">
          <p className="text-slate-400 mb-1">Time: {label}</p>
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5" style={{ color: item.color }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}:</span>
              </span>
              <span className="font-bold text-white">
                {item.value} {item.unit || ""}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-slate-800/80 bg-slate-900/60 overflow-hidden">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="flex items-center gap-2">
                <span>Real-Time Sensor Telemetry Stream</span>
                <span className="text-cyan-400 font-mono text-sm">
                  [{selectedEquipment.code} • {selectedEquipment.name}]
                </span>
              </CardTitle>
            </div>
            <CardDescription>
              Continuous 2.4 kHz sensor telemetry stream analyzing vibration harmonics, thermal dissipation, and pressure fluctuations
            </CardDescription>
          </div>

          {/* Controls: Stream Pause/Play, Timeframe, Anomaly Injection */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Metric Switcher */}
            <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950/70 p-0.5 text-xs">
              {(
                [
                  { id: "all", label: "Composite" },
                  { id: "vibration", label: "Vibration (mm/s)" },
                  { id: "temperature", label: "Temp (°C)" },
                  { id: "pressure", label: "Pressure (PSI)" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMetricTab(tab.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    activeMetricTab === tab.id
                      ? "bg-slate-800 text-cyan-300 font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Timeframe */}
            <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950/70 p-0.5 text-xs">
              {(["1m", "5m", "1h", "24h"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                    timeRange === r
                      ? "bg-slate-800 text-white font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Pause / Play button */}
            <Button
              variant="outline"
              size="xs"
              onClick={() => setIsStreaming(!isStreaming)}
              className="border-slate-700 hover:border-slate-600 text-xs gap-1.5"
            >
              {isStreaming ? (
                <>
                  <Pause className="h-3 w-3 text-amber-400" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 text-emerald-400" />
                  <span>Resume</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Live metric summary cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
          {/* Vibration */}
          <div
            className={`rounded-lg border p-3 transition-colors ${
              isVibCritical
                ? "border-rose-500/50 bg-rose-500/10 text-rose-300"
                : isVibWarning
                ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                : "border-slate-800 bg-slate-950/40 text-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs flex items-center gap-1.5 font-medium text-slate-400">
                <Waves className="h-3.5 w-3.5 text-cyan-400" />
                Vibration (RMS)
              </span>
              <Badge
                variant={isVibCritical ? "critical" : isVibWarning ? "warning" : "operational"}
                className="text-[10px]"
              >
                {isVibCritical ? "CRITICAL" : isVibWarning ? "ELEVATED" : "NORMAL"}
              </Badge>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-xl font-bold font-mono">
                {currentSensorData.vibration.toFixed(2)}{" "}
                <span className="text-xs font-sans text-slate-400 font-normal">mm/s</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Limit: 3.5 / 5.5</span>
            </div>
          </div>

          {/* Temperature */}
          <div
            className={`rounded-lg border p-3 transition-colors ${
              isTempCritical
                ? "border-rose-500/50 bg-rose-500/10 text-rose-300"
                : isTempWarning
                ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                : "border-slate-800 bg-slate-950/40 text-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs flex items-center gap-1.5 font-medium text-slate-400">
                <Thermometer className="h-3.5 w-3.5 text-rose-400" />
                Thermal Dissipation
              </span>
              <Badge
                variant={isTempCritical ? "critical" : isTempWarning ? "warning" : "operational"}
                className="text-[10px]"
              >
                {isTempCritical ? "HOT" : isTempWarning ? "ELEVATED" : "NORMAL"}
              </Badge>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-xl font-bold font-mono">
                {currentSensorData.temperature.toFixed(1)}{" "}
                <span className="text-xs font-sans text-slate-400 font-normal">°C</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Limit: 75 / 85</span>
            </div>
          </div>

          {/* Pressure */}
          <div
            className={`rounded-lg border p-3 transition-colors ${
              isPressCritical
                ? "border-rose-500/50 bg-rose-500/10 text-rose-300"
                : isPressWarning
                ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                : "border-slate-800 bg-slate-950/40 text-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs flex items-center gap-1.5 font-medium text-slate-400">
                <Gauge className="h-3.5 w-3.5 text-amber-400" />
                Hydraulic Pressure
              </span>
              <Badge
                variant={isPressCritical ? "critical" : isPressWarning ? "warning" : "operational"}
                className="text-[10px]"
              >
                {isPressCritical ? "SPIKE" : isPressWarning ? "ELEVATED" : "STABLE"}
              </Badge>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-xl font-bold font-mono">
                {currentSensorData.pressure.toFixed(1)}{" "}
                <span className="text-xs font-sans text-slate-400 font-normal">PSI</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Limit: 155 / 180</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-1">
        {/* Main Chart Canvas */}
        <div className="h-[280px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetricTab === "all" ? (
              <AreaChart data={stream} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVib" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="timeFormatted"
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature (°C)"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTemp)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="vibration"
                  name="Vibration (mm/s)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVib)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="pressure"
                  name="Pressure (PSI)"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorPress)"
                  isAnimationActive={false}
                />
              </AreaChart>
            ) : activeMetricTab === "vibration" ? (
              <AreaChart data={stream} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="singleVib" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timeFormatted" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} domain={[0, 8]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={currentSensorData.vibrationThresholdWarning}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  label={{ value: "Warning (3.5 mm/s)", fill: "#f59e0b", fontSize: 10 }}
                />
                <ReferenceLine
                  y={currentSensorData.vibrationThresholdCritical}
                  stroke="#f43f5e"
                  strokeDasharray="3 3"
                  label={{ value: "Critical (5.5 mm/s)", fill: "#f43f5e", fontSize: 10 }}
                />
                <Area
                  type="monotone"
                  dataKey="vibration"
                  name="Vibration (mm/s)"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#singleVib)"
                  isAnimationActive={false}
                />
              </AreaChart>
            ) : activeMetricTab === "temperature" ? (
              <AreaChart data={stream} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="singleTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timeFormatted" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} domain={[30, 110]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={currentSensorData.tempThresholdWarning}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  label={{ value: "Warning (75°C)", fill: "#f59e0b", fontSize: 10 }}
                />
                <ReferenceLine
                  y={currentSensorData.tempThresholdCritical}
                  stroke="#f43f5e"
                  strokeDasharray="3 3"
                  label={{ value: "Critical (85°C)", fill: "#f43f5e", fontSize: 10 }}
                />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature (°C)"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#singleTemp)"
                  isAnimationActive={false}
                />
              </AreaChart>
            ) : (
              <AreaChart data={stream} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="singlePress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timeFormatted" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} domain={[50, 220]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={currentSensorData.pressureThresholdWarning}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  label={{ value: "Warning (155 PSI)", fill: "#f59e0b", fontSize: 10 }}
                />
                <ReferenceLine
                  y={currentSensorData.pressureThresholdCritical}
                  stroke="#f43f5e"
                  strokeDasharray="3 3"
                  label={{ value: "Critical (180 PSI)", fill: "#f43f5e", fontSize: 10 }}
                />
                <Area
                  type="monotone"
                  dataKey="pressure"
                  name="Pressure (PSI)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#singlePress)"
                  isAnimationActive={false}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend / Status Footnote */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>Vibration (RMS mm/s)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span>Thermal (°C)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Hydraulic (PSI)</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-slate-500">Sampling Rate: 2.4 kHz</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">Window: 60s Moving Avg</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
