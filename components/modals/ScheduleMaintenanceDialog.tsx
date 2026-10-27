"use client";

import React, { useState, useEffect } from "react";
import {
  Wrench,
  Calendar,
  User,
  Clock,
  Package,
  AlertTriangle,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { usePredictiveMaintenance } from "@/context/PredictiveMaintenanceContext";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Equipment, TicketPriority } from "@/types";

interface ScheduleMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEquipment?: Equipment | null;
  initialTitle?: string;
}

export function ScheduleMaintenanceDialog({
  open,
  onOpenChange,
  initialEquipment,
  initialTitle,
}: ScheduleMaintenanceDialogProps) {
  const { equipment, addTicket, selectedEquipment } = usePredictiveMaintenance();

  const targetEquipment = initialEquipment || selectedEquipment;

  const [equipmentId, setEquipmentId] = useState(targetEquipment.id);
  const [title, setTitle] = useState(
    initialTitle || `Emergency Inspection & Maintenance on ${targetEquipment.name}`
  );
  const [description, setDescription] = useState(
    targetEquipment.anomalyReason
      ? `Investigate active telemetry anomaly: ${targetEquipment.anomalyReason}. Inspect mechanical assemblies and verify operating tolerances.`
      : `Routine preventive maintenance and precision sensor recalibration.`
  );
  const [priority, setPriority] = useState<TicketPriority>(
    targetEquipment.status === "critical"
      ? "Critical"
      : targetEquipment.status === "warning"
      ? "High"
      : "Medium"
  );
  const [assignedTo, setAssignedTo] = useState(targetEquipment.assignedTechnician || "Elena Rostova");
  const [scheduledDate, setScheduledDate] = useState("Today • Shift 2 (14:00 - 22:00)");
  const [estimatedHours, setEstimatedHours] = useState(2.5);
  const [partsInput, setPartsInput] = useState("Klüber ISOFLEX NBU 15, O-Ring Seal Pack, Filter Mesh");
  const [costEstimate, setCostEstimate] = useState(1450);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialEquipment) {
      setEquipmentId(initialEquipment.id);
      setTitle(initialTitle || `Emergency Maintenance on ${initialEquipment.name}`);
      setPriority(
        initialEquipment.status === "critical"
          ? "Critical"
          : initialEquipment.status === "warning"
          ? "High"
          : "Medium"
      );
      setAssignedTo(initialEquipment.assignedTechnician);
    }
  }, [initialEquipment, initialTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currEq = equipment.find((e) => e.id === equipmentId) || targetEquipment;

    const parts = partsInput
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    addTicket({
      equipmentId: currEq.id,
      equipmentName: currEq.name,
      equipmentCode: currEq.code,
      title,
      description,
      priority,
      status: "Scheduled",
      assignedTo,
      scheduledDate,
      estimatedHours: Number(estimatedHours),
      partsNeeded: parts,
      costEstimate: Number(costEstimate),
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onOpenChange(false);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader onClose={() => onOpenChange(false)}>
        <DialogTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-cyan-400" />
          <span>Schedule Industrial Work Order</span>
        </DialogTitle>
        <DialogDescription>
          Dispatch certified field technicians and reserve replacement parts from Central Inventory
        </DialogDescription>
      </DialogHeader>

      {isSuccess ? (
        <div className="py-12 text-center space-y-3">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Work Order Generated Successfully!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Dispatched to technician <span className="text-cyan-400">{assignedTo}</span> for{" "}
            <span className="text-white">{scheduledDate}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <DialogContent className="space-y-4">
            {/* Asset Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Asset</label>
              <select
                value={equipmentId}
                onChange={(e) => {
                  setEquipmentId(e.target.value);
                  const eq = equipment.find((m) => m.id === e.target.value);
                  if (eq) {
                    setTitle(`Intervention on ${eq.name}`);
                    setAssignedTo(eq.assignedTechnician);
                  }
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {equipment.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.code} - {eq.name} ({eq.status.toUpperCase()} • Health: {eq.healthScore}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Work Order Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Replace Hydraulic Valve Pack & Flush Oil"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">SOP Instructions & Scope</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>

            {/* Priority & Assigned Technician */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Urgency Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Critical">Critical (Immediate Stop)</option>
                  <option value="High">High (Within 24 Hours)</option>
                  <option value="Medium">Medium (Scheduled Shift)</option>
                  <option value="Low">Low (Routine Check)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Lead Certified Technician</label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Elena Rostova">Elena Rostova (Fluid & Pressure Specialist)</option>
                  <option value="Marcus Vance">Marcus Vance (Vibration & Spindle Lead)</option>
                  <option value="David Chen">David Chen (Rotating Equipment Tech)</option>
                  <option value="Sarah Jenkins">Sarah Jenkins (Robotics & Automation)</option>
                </select>
              </div>
            </div>

            {/* Schedule & Downtime */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Scheduled Execution Slot</label>
                <Input
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  placeholder="e.g. Tomorrow 08:00 AM"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Est. Downtime (Hours)</label>
                <Input
                  type="number"
                  step="0.5"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 1)}
                />
              </div>
            </div>

            {/* Required Spare Parts */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Reserved Spare Parts (Comma-separated)
              </label>
              <Input
                value={partsInput}
                onChange={(e) => setPartsInput(e.target.value)}
                placeholder="Part numbers or descriptions"
              />
            </div>
          </DialogContent>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-xs text-slate-400"
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" className="text-xs bg-cyan-600 hover:bg-cyan-500 font-semibold">
              Dispatch Work Order
            </Button>
          </DialogFooter>
        </form>
      )}
    </Dialog>
  );
}
