"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  Equipment,
  SensorDataPoint,
  AnomalyAlert,
  MaintenanceTicket,
  AIChatMessage,
  MachineStatus,
  TicketPriority,
  TicketStatus,
} from "@/types";
import {
  INITIAL_EQUIPMENT,
  INITIAL_ALERTS,
  INITIAL_TICKETS,
  INITIAL_CHAT_MESSAGES,
  generateHistoricalSensorData,
} from "@/lib/mock-data";

interface MaintenanceContextType {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Equipment Fleet
  equipment: Equipment[];
  selectedEquipmentId: string;
  selectedEquipment: Equipment;
  setSelectedEquipmentId: (id: string) => void;
  updateEquipmentStatus: (id: string, updates: Partial<Equipment>) => void;

  // Real-time sensor streaming
  sensorHistory: Record<string, SensorDataPoint[]>;
  currentSensorData: SensorDataPoint;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  telemetryRate: number; // Hz / updates count
  timeRange: "1m" | "5m" | "1h" | "24h";
  setTimeRange: (range: "1m" | "5m" | "1h" | "24h") => void;

  // Anomalies
  alerts: AnomalyAlert[];
  acknowledgeAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  injectAnomaly: (equipmentId: string) => void;
  mitigateAnomaly: (equipmentId: string) => void;

  // Tickets / Maintenance Schedule
  tickets: MaintenanceTicket[];
  addTicket: (ticket: Omit<MaintenanceTicket, "id" | "createdAt">) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  deleteTicket: (ticketId: string) => void;

  // AI Assistant
  chatMessages: AIChatMessage[];
  isAiThinking: boolean;
  sendChatMessage: (content: string, equipmentIdContext?: string) => Promise<void>;
  isChatDrawerOpen: boolean;
  setIsChatDrawerOpen: (open: boolean) => void;

  // System & UI
  soundAlertsEnabled: boolean;
  setSoundAlertsEnabled: (enabled: boolean) => void;
  plantUptime: number;
  totalDataPackets: number;
}

const PredictiveMaintenanceContext = createContext<MaintenanceContextType | null>(null);

export function PredictiveMaintenanceProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [equipment, setEquipment] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>("eq-2"); // Default to Hydraulic Press with alert
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(INITIAL_ALERTS);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(INITIAL_TICKETS);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<"1m" | "5m" | "1h" | "24h">("1m");
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState<boolean>(false);
  const [totalDataPackets, setTotalDataPackets] = useState<number>(142980);

  // Initialize sensor history for each machine
  const [sensorHistory, setSensorHistory] = useState<Record<string, SensorDataPoint[]>>(() => {
    const historyMap: Record<string, SensorDataPoint[]> = {};
    INITIAL_EQUIPMENT.forEach((eq) => {
      historyMap[eq.id] = generateHistoricalSensorData(eq);
    });
    return historyMap;
  });

  const selectedEquipment = useMemo(() => {
    return equipment.find((eq) => eq.id === selectedEquipmentId) || equipment[0];
  }, [equipment, selectedEquipmentId]);

  const currentSensorData = useMemo(() => {
    const stream = sensorHistory[selectedEquipmentId];
    if (stream && stream.length > 0) {
      return stream[stream.length - 1];
    }
    return {
      timestamp: "2026-10-27T12:00:00.000Z",
      timeFormatted: "00:00",
      vibration: selectedEquipment.vibration,
      temperature: selectedEquipment.temperature,
      pressure: selectedEquipment.pressure,
      rpm: selectedEquipment.rpm,
      vibrationThresholdWarning: 3.5,
      vibrationThresholdCritical: 5.5,
      tempThresholdWarning: 75.0,
      tempThresholdCritical: 85.0,
      pressureThresholdWarning: 155.0,
      pressureThresholdCritical: 180.0,
    };
  }, [sensorHistory, selectedEquipmentId, selectedEquipment]);

  // Overall plant uptime calculation
  const plantUptime = useMemo(() => {
    const totalHealth = equipment.reduce((acc, eq) => acc + eq.healthScore, 0);
    const avgHealth = totalHealth / equipment.length;
    // Normalized to realistic 97-99% range
    return Number((94 + (avgHealth / 100) * 5.8).toFixed(1));
  }, [equipment]);

  // Real-time sensor simulation interval
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeFormatted = now.toLocaleTimeString("en-US", {
        hour12: false,
        minute: "2-digit",
        second: "2-digit",
      });

      setSensorHistory((prevHistory) => {
        const nextHistory = { ...prevHistory };

        equipment.forEach((eq) => {
          const currentStream = nextHistory[eq.id] || [];
          const lastPoint = currentStream[currentStream.length - 1];

          // Small harmonic delta
          const vibNoise = (Math.random() - 0.49) * 0.18;
          const tempNoise = (Math.random() - 0.48) * 0.25;
          const pressNoise = (Math.random() - 0.49) * 1.2;
          const rpmNoise = Math.round((Math.random() - 0.5) * 15);

          // Mean reversion to equipment baseline
          const targetVib = eq.vibration;
          const targetTemp = eq.temperature;
          const targetPress = eq.pressure;

          const newVib = Math.max(0.1, Number((lastPoint ? lastPoint.vibration * 0.85 + targetVib * 0.15 + vibNoise : targetVib).toFixed(2)));
          const newTemp = Math.max(15, Number((lastPoint ? lastPoint.temperature * 0.9 + targetTemp * 0.1 + tempNoise : targetTemp).toFixed(1)));
          const newPress = Math.max(20, Number((lastPoint ? lastPoint.pressure * 0.85 + targetPress * 0.15 + pressNoise : targetPress).toFixed(1)));
          const newRpm = Math.max(0, (lastPoint ? lastPoint.rpm : eq.rpm) + rpmNoise);

          const newPoint: SensorDataPoint = {
            timestamp: now.toISOString(),
            timeFormatted,
            vibration: newVib,
            temperature: newTemp,
            pressure: newPress,
            rpm: newRpm,
            vibrationThresholdWarning: 3.5,
            vibrationThresholdCritical: 5.5,
            tempThresholdWarning: 75.0,
            tempThresholdCritical: 85.0,
            pressureThresholdWarning: 155.0,
            pressureThresholdCritical: 180.0,
          };

          // Keep sliding window of 35 items
          const updated = [...currentStream.slice(-34), newPoint];
          nextHistory[eq.id] = updated;
        });

        return nextHistory;
      });

      setTotalDataPackets((prev) => prev + 8);
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming, equipment]);

  const updateEquipmentStatus = useCallback((id: string, updates: Partial<Equipment>) => {
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, ...updates } : eq))
    );
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  // Inject a simulated anomaly for testing and interactive demonstration
  const injectAnomaly = useCallback((equipmentId: string) => {
    const target = equipment.find((e) => e.id === equipmentId);
    if (!target) return;

    const newAlert: AnomalyAlert = {
      id: `alt-${Date.now()}`,
      equipmentId: target.id,
      equipmentName: target.name,
      equipmentCode: target.code,
      severity: "critical",
      title: `Critical Spike & Resonant Vibration on ${target.name}`,
      description: `Sensor telemetry spiked to 6.8 mm/s vibration and ${target.temperature + 16}°C. High harmonic stress detected.`,
      predictedFailureWindow: "12 Hours",
      confidence: 97.8,
      anomalyType: "Vibration Harmonics",
      rootCauses: [
        "Unbalanced dynamic load or broken impeller tooth",
        "Loss of structural mounting torque",
        "Critical bearing cage distortion",
      ],
      recommendedActions: [
        {
          id: `act-${Date.now()}`,
          action: "Immediate Emergency Controlled Stop & Spindle Inspection",
          impact: "Avoids catastrophic mechanical seizure and catastrophic downtime",
          urgency: "Immediate",
          estimatedDowntime: "1 hour",
        },
      ],
      timestamp: "Just now",
      acknowledged: false,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    updateEquipmentStatus(equipmentId, {
      status: "critical",
      healthScore: Math.max(25, target.healthScore - 30),
      vibration: Number((target.vibration + 2.8).toFixed(2)),
      temperature: Number((target.temperature + 14.5).toFixed(1)),
      pressure: Number((target.pressure + 28.0).toFixed(1)),
      anomalyDetected: true,
      anomalyReason: "Live injected simulated anomaly: excessive vibration harmonics",
      failureRisk: 92,
      predictedFailureHours: 12,
    });
  }, [equipment, updateEquipmentStatus]);

  // Mitigate/Repair simulated machine
  const mitigateAnomaly = useCallback((equipmentId: string) => {
    const target = equipment.find((e) => e.id === equipmentId);
    if (!target) return;

    updateEquipmentStatus(equipmentId, {
      status: "operational",
      healthScore: 95,
      vibration: 1.45,
      temperature: 52.0,
      pressure: 105.0,
      anomalyDetected: false,
      anomalyReason: undefined,
      failureRisk: 8,
      predictedFailureHours: undefined,
    });

    setAlerts((prev) => prev.filter((a) => a.equipmentId !== equipmentId));
  }, [equipment, updateEquipmentStatus]);

  const addTicket = useCallback((ticketData: Omit<MaintenanceTicket, "id" | "createdAt">) => {
    const newTicket: MaintenanceTicket = {
      ...ticketData,
      id: `WO-${Math.floor(9000 + Math.random() * 999)}`,
      createdAt: "Just now",
    };
    setTickets((prev) => [newTicket, ...prev]);
  }, []);

  const updateTicketStatus = useCallback((ticketId: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  }, []);

  const deleteTicket = useCallback((ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
  }, []);

  // AI Assistant simulated reasoning engine
  const sendChatMessage = useCallback(
    async (content: string, equipmentIdContext?: string) => {
      const userMsg: AIChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        timestamp: "Just now",
      };

      setChatMessages((prev) => [...prev, userMsg]);
      setIsAiThinking(true);

      // Context determination
      const targetEq: Equipment =
        (equipmentIdContext
          ? equipment.find((e) => e.id === equipmentIdContext)
          : selectedEquipment) || selectedEquipment || equipment[0];

      // Simulate AI model latency (500ms)
      setTimeout(() => {
        let aiResponseText = "";
        const lower = content.toLowerCase();

        if (lower.includes("why") || lower.includes("temperature") || lower.includes("overheat") || lower.includes("hydraulic")) {
          const hyd: Equipment = equipment.find((e) => e.code === "HYD-201") || targetEq;
          aiResponseText = `### Diagnostic Report: ${hyd.name} (${hyd.code})
- **Current Reading:** ${hyd.temperature.toFixed(1)}°C (Operating threshold limit: 85.0°C)
- **Secondary Symptom:** Pressure fluctuating at ${hyd.pressure.toFixed(1)} PSI with elevated pump noise.

#### Root Cause Analysis:
1. **Heat Exchanger Restriction:** Telemetry shows bypass valve servo #3 is reporting 82% obstruction, restricting return coolant flow.
2. **Fluid Viscosity Drop:** Viscosity estimated at 28 cSt (nominal is 46 cSt), leading to shear breakdown under peak 188 PSI load.
3. **Cavitation Risk:** Risk score is **96.4%**. Unchecked operation risks cylinder seal blow-out within **18 hours**.

#### Recommended Interventions:
- 🛠️ **Immediate:** Throttle pump displacement or switch auxiliary cooler circuit online.
- 📋 **Maintenance Ticket:** Work Order #WO-9042 has already been generated for Shift 2 technician **Elena Rostova**.`;
        } else if (lower.includes("cnc") || lower.includes("vibration") || lower.includes("harmonic") || lower.includes("bearing")) {
          const cnc: Equipment = equipment.find((e) => e.code === "CNC-402") || targetEq;
          aiResponseText = `### Vibration FFT Diagnostic: ${cnc.name} (${cnc.code})
- **RMS Vibration:** ${cnc.vibration.toFixed(2)} mm/s (Warning threshold: 3.5 mm/s)
- **Spectral Harmonic:** Pronounced energy peak at **1,420 Hz** corresponding to the Ball Pass Frequency Inner Ring (BPFI) of the SKF 7014 spindle bearing.

#### Prediction & Prognosis:
- **Remaining Useful Life (RUL):** ~48 operating hours before micro-spalling escalates into race pitting.
- **Recommended SOP:**
  1. Derate spindle ceiling from 12,500 to 10,600 RPM (-15%) immediately.
  2. Perform high-precision ultrasonic grease injection (Klüber ISOFLEX NBU 15).`;
        } else if (lower.includes("schedule") || lower.includes("week") || lower.includes("plan")) {
          aiResponseText = `### AI-Optimized 7-Day Maintenance Plan
Based on current telemetry, MTBF wear rates, and shift schedules:

1. **Shift 2 Today:** Emergency valve flush & seal pack check on **Hydraulic Press #2** (Est: 3.5h downtime, Tech: Elena Rostova).
2. **Tomorrow 08:00 AM:** Spindle bearing ultrasonic lubrication on **CNC Milling Machine #4** (Est: 2.0h downtime, Tech: Marcus Vance).
3. **Oct 29:** Intake strainer backwash & mechanical seal inspection on **Centrifugal Slurry Pump #1** (Est: 2.5h, Tech: David Chen).
4. **Nov 01:** Preventive thermal imaging sweep of **Turbine Generator #3** switchgear.

*All required parts (ISO VG 46 fluid, Klüber grease, O-rings) are verified in Central Inventory Bay 3.*`;
        } else if (lower.includes("lubricat") || lower.includes("oil") || lower.includes("grease")) {
          aiResponseText = `### Lubrication Status & Urgent Assets
AI lubrication sensor audit identified **2 assets** requiring attention:

1. **CNC Milling Machine #4:** Spindle bearing lubricant film thickness depleted by 42%. Ultrasonic lubrication required within 24 hours.
2. **Robotic Arm Kuka-7:** Axis 4 planetary gearbox scheduled for oil change (4,890 / 5,000 hrs interval).
3. **Hydraulic Press #2:** Hydraulic fluid thermal breakdown; full flush and reservoir top-up scheduled today.`;
        } else {
          aiResponseText = `### Asset Telemetry Intelligence
Analyzing real-time signals for **${targetEq.name}**:
- **Health Score:** ${targetEq.healthScore}%
- **Status:** ${targetEq.status.toUpperCase()}
- **Vibration:** ${targetEq.vibration.toFixed(2)} mm/s | **Temperature:** ${targetEq.temperature.toFixed(1)}°C | **Pressure:** ${targetEq.pressure.toFixed(1)} PSI
- **Failure Risk:** ${targetEq.failureRisk}% (MTBF: ${targetEq.mtbfHours} hrs)

${
  targetEq.anomalyDetected
    ? `⚠️ **Active Anomaly:** ${targetEq.anomalyReason}. Preventive action recommended before end of current shift.`
    : `✅ All metrics are operating within ISO 10816-3 Class II vibration boundaries and thermal safety tolerances.`
}`;
        }

        const aiMsg: AIChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: aiResponseText,
          timestamp: "Just now",
          equipmentContext: {
            id: targetEq.id,
            name: targetEq.name,
            healthScore: targetEq.healthScore,
            vibration: targetEq.vibration,
            temperature: targetEq.temperature,
            pressure: targetEq.pressure,
            status: targetEq.status,
          },
          suggestedActions: [
            { label: "Create Work Order", actionType: "schedule", payload: targetEq.id },
            { label: "View Live Sensor Curves", actionType: "view_sensor", payload: targetEq.id },
            { label: "Mitigate & Reset Machine", actionType: "derate", payload: targetEq.id },
          ],
        };

        setChatMessages((prev) => [...prev, aiMsg]);
        setIsAiThinking(false);
      }, 650);
    },
    [equipment, selectedEquipment]
  );

  return (
    <PredictiveMaintenanceContext.Provider
      value={{
        activeTab,
        setActiveTab,
        equipment,
        selectedEquipmentId,
        selectedEquipment,
        setSelectedEquipmentId,
        updateEquipmentStatus,
        sensorHistory,
        currentSensorData,
        isStreaming,
        setIsStreaming,
        telemetryRate: 2,
        timeRange,
        setTimeRange,
        alerts,
        acknowledgeAlert,
        dismissAlert,
        injectAnomaly,
        mitigateAnomaly,
        tickets,
        addTicket,
        updateTicketStatus,
        deleteTicket,
        chatMessages,
        isAiThinking,
        sendChatMessage,
        isChatDrawerOpen,
        setIsChatDrawerOpen,
        soundAlertsEnabled,
        setSoundAlertsEnabled,
        plantUptime,
        totalDataPackets,
      }}
    >
      {children}
    </PredictiveMaintenanceContext.Provider>
  );
}

export function usePredictiveMaintenance() {
  const context = useContext(PredictiveMaintenanceContext);
  if (!context) {
    throw new Error("usePredictiveMaintenance must be used within a PredictiveMaintenanceProvider");
  }
  return context;
}
