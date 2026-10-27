export type MachineStatus = "operational" | "warning" | "critical";

export type MachineCriticality = "Tier 1 - Critical" | "Tier 2 - High" | "Tier 3 - Standard";

export interface Equipment {
  id: string;
  name: string;
  code: string;
  type: "CNC Milling" | "Hydraulic Press" | "Conveyor System" | "Robotic Arm" | "Rotary Kiln" | "Turbine Generator" | "Centrifugal Pump";
  location: string;
  facility: string;
  status: MachineStatus;
  healthScore: number; // 0 - 100
  vibration: number; // mm/s
  temperature: number; // °C
  pressure: number; // PSI
  rpm: number;
  operatingHours: number;
  lastInspected: string;
  lastMaintenance: string;
  model: string;
  serialNumber: string;
  criticality: MachineCriticality;
  failureRisk: number; // percentage 0 - 100
  predictedFailureHours?: number;
  anomalyDetected: boolean;
  anomalyReason?: string;
  mtbfHours: number; // Mean Time Between Failures
  assignedTechnician: string;
}

export interface SensorDataPoint {
  timestamp: string;
  timeFormatted: string;
  vibration: number; // mm/s
  temperature: number; // °C
  pressure: number; // PSI
  rpm: number;
  vibrationThresholdWarning: number;
  vibrationThresholdCritical: number;
  tempThresholdWarning: number;
  tempThresholdCritical: number;
  pressureThresholdWarning: number;
  pressureThresholdCritical: number;
}

export interface AnomalyAlert {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCode: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  predictedFailureWindow: string;
  confidence: number; // e.g. 91%
  anomalyType: "Vibration Harmonics" | "Thermal Dissipation" | "Pressure Cavitation" | "Bearing Spalling" | "Motor Insulation";
  rootCauses: string[];
  recommendedActions: {
    id: string;
    action: string;
    impact: string;
    urgency: "Immediate" | "Within 24h" | "Scheduled Shift";
    estimatedDowntime: string;
  }[];
  timestamp: string;
  acknowledged: boolean;
}

export type TicketPriority = "Critical" | "High" | "Medium" | "Low";
export type TicketStatus = "Pending" | "In Progress" | "Scheduled" | "Completed";

export interface MaintenanceTicket {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCode: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string;
  scheduledDate: string;
  estimatedHours: number;
  partsNeeded: string[];
  createdAt: string;
  costEstimate: number;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  equipmentContext?: {
    id: string;
    name: string;
    healthScore: number;
    vibration: number;
    temperature: number;
    pressure: number;
    status: MachineStatus;
  };
  suggestedActions?: {
    label: string;
    actionType: "schedule" | "derate" | "view_sensor" | "inspect";
    payload?: string;
  }[];
}
