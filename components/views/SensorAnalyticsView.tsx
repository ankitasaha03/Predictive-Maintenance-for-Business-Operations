"use client";

import React, { useState } from "react";
import {
  LineChart as LineChartIcon,
  Activity,
  Waves,
  Thermometer,
  Gauge,
  Sliders,
  Download,
  Play,
  Pause,
  AlertTriangle,
  RotateCw,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { usePredictiveMaintenance } from "@/context/PredictiveMaintenanceContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SensorAnalyticsView() {
  const {
    equipment,
    selectedEquipmentId,
    selectedEquipment,
    setSelectedEquipmentId,
    sensorHistory,
    currentSensorData,
    isStreaming,
    setIsStreaming,
  } = usePredictiveMaintenance();

  const [compareEquipmentId, setCompareEquipmentId] = useState<string>("eq-8");
  const [showFftSpectral, setShowFftSpectral] = useState(true);
  const [warningThreshold, setWarningThreshold] = useState(3.5);
  const [criticalThreshold, setCriticalThreshold] = useState(5.5);

  const primaryStream = sensorHistory[selectedEquipmentId] || [];
  const compareEquipment = equipment.find((e) => e.id === compareEquipmentId) || equipment[0];
  const compareStream = sensorHistory[compareEquipmentId] || [];

  // Simulated FFT Spectral Harmonic breakdown (Frequency domain Hz vs Amplitude mm/s)
  const fftData = [
    { freq: "120 Hz (1X)", amp: 0.45, label: "Running Speed" },
    { freq: "240 Hz (2X)", amp: 0.32, label: "2nd Harmonic" },
    { freq: "480 Hz (4X)", amp: 0.18, label: "Vane Pass" },
    { freq: "720 Hz", amp: 0.22, label: "Structural" },
    {
      freq: "1,420 Hz (BPFI)",
      amp: selectedEquipment.id === "eq-1" ? 3.85 : 0.42,
      label: "Spindle Inner Race",
      isSpike: selectedEquipment.id === "eq-1",
    },
    { freq: "1,850 Hz", amp: 0.38, label: "High Resonance" },
    { freq: "2,200 Hz", amp: 0.21, label: "Motor Slot" },
    { freq: "2,600 Hz", amp: 0.15, label: "Acoustic Noise" },
  ];

  const handleExportCSV = () => {
    const headers = ["Timestamp", "Vibration_mm_s", "Temperature_C", "Pressure_PSI", "RPM"];
    const rows = primaryStream.map((p) => [
      p.timestamp,
      p.vibration,
      p.temperature,
      p.pressure,
      p.rpm,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `telemetry_${selectedEquipment.code}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <LineChartIcon className="h-6 w-6 text-cyan-400" />
            <span>High-Frequency Sensor Analytics Studio</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Microsecond telemetry stream processing, Fast Fourier Transform (FFT) harmonic spectral decomposition, and multi-asset differential analysis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsStreaming(!isStreaming)}
            className="border-slate-700 text-xs gap-1.5"
          >
            {isStreaming ? (
              <>
                <Pause className="h-3.5 w-3.5 text-amber-400" />
                <span>Pause Live Stream</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                <span>Resume Live Stream</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="border-slate-700 text-xs gap-1.5 text-cyan-300 hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Primary Asset Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        {/* Primary Target Asset */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Target Asset Stream</label>
          <select
            value={selectedEquipmentId}
            onChange={(e) => setSelectedEquipmentId(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
          >
            {equipment.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.code} - {eq.name} ({eq.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Comparison Asset */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Differential Benchmark Asset</label>
          <select
            value={compareEquipmentId}
            onChange={(e) => setCompareEquipmentId(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            {equipment.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.code} - {eq.name} (Health: {eq.healthScore}%)
              </option>
            ))}
          </select>
        </div>

        {/* Real-time Status Gauge */}
        <div className="flex items-center justify-between rounded-lg bg-slate-950/80 border border-slate-800 p-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400">Current Health</span>
            <div className="text-xl font-bold font-mono text-cyan-400">
              {selectedEquipment.healthScore}%
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400">Status</span>
            <div>
              <Badge
                variant={
                  selectedEquipment.status === "critical"
                    ? "critical"
                    : selectedEquipment.status === "warning"
                    ? "warning"
                    : "operational"
                }
                className="text-[10px]"
              >
                {selectedEquipment.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Streaming Graph (Dual asset comparison) */}
      <Card className="border-slate-800/80 bg-slate-900/60">
        <CardHeader className="p-5 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <span>Vibration Differential Waveform (mm/s RMS)</span>
                <Badge variant="cyan" className="text-[10px] font-mono">
                  {selectedEquipment.code} vs {compareEquipment.code}
                </Badge>
              </CardTitle>
              <CardDescription>
                Synchronized telemetry streams demonstrating harmonic deviation from baseline
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                {selectedEquipment.code}: {currentSensorData.vibration.toFixed(2)} mm/s
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                {compareEquipment.code}: {compareEquipment.vibration.toFixed(2)} mm/s
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={primaryStream} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timeFormatted" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} domain={[0, 8]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                />
                <ReferenceLine
                  y={warningThreshold}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  label={{ value: "Warning (3.5)", fill: "#f59e0b", fontSize: 10 }}
                />
                <ReferenceLine
                  y={criticalThreshold}
                  stroke="#f43f5e"
                  strokeDasharray="3 3"
                  label={{ value: "Critical (5.5)", fill: "#f43f5e", fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="vibration"
                  name={`${selectedEquipment.code} Vibration`}
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Fast Fourier Transform (FFT) Spectral Harmonics Decomposition */}
      <Card className="border-slate-800/80 bg-slate-900/60">
        <CardHeader className="p-5 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Waves className="h-4 w-4 text-cyan-400" />
                <span>Fast Fourier Transform (FFT) Spectral Harmonics</span>
              </CardTitle>
              <CardDescription>
                Acoustic spectrum decomposition isolating Ball Pass Frequency Inner Ring (BPFI) and gear-mesh anomalies
              </CardDescription>
            </div>
            {selectedEquipment.id === "eq-1" && (
              <Badge variant="critical" className="text-[10px]">
                1,420 Hz BPFI Peak Detected
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fftData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="freq" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`${val} mm/s`, "Harmonic Amplitude"]}
                />
                <Bar
                  dataKey="amp"
                  fill="#06b6d4"
                  radius={[4, 4, 0, 0]}
                  // highlight spike
                  fillOpacity={0.9}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
            <span className="font-mono text-[11px] text-cyan-400">
              Fundamental Freq (1X): 120 Hz • Harmonics Analyzed: 1X to 22X
            </span>
            <span className="text-[10px] text-slate-500">ISO 10816-3 Vibration Evaluation Standard</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
