"use client";

import React, { useState } from "react";
import {
  CalendarClock,
  Plus,
  Wrench,
  Clock,
  User,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Filter,
} from "lucide-react";
import { usePredictiveMaintenance } from "@/context/PredictiveMaintenanceContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TicketPriority, TicketStatus, MaintenanceTicket } from "@/types";

export function MaintenanceScheduleView({
  onOpenCreateTicket,
}: {
  onOpenCreateTicket: () => void;
}) {
  const { tickets, updateTicketStatus, deleteTicket, setActiveTab } = usePredictiveMaintenance();
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const columns: { status: TicketStatus; label: string; color: string }[] = [
    { status: "Pending", label: "Pending Triage", color: "border-slate-700" },
    { status: "Scheduled", label: "Scheduled Shifts", color: "border-cyan-500/40" },
    { status: "In Progress", label: "Actively Under Repair", color: "border-amber-500/40" },
    { status: "Completed", label: "Completed & Verified", color: "border-emerald-500/40" },
  ];

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case "Critical":
        return <Badge variant="critical">Critical</Badge>;
      case "High":
        return <Badge variant="warning">High</Badge>;
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "Low":
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const filteredTickets = tickets.filter((t) =>
    priorityFilter === "all" ? true : t.priority === priorityFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-cyan-400" />
            <span>Preventive & Corrective Maintenance Schedule</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Kanban work order management, technician dispatching, and spare parts inventory tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
          </select>

          <Button
            variant="default"
            size="sm"
            onClick={onOpenCreateTicket}
            className="bg-cyan-600 hover:bg-cyan-500 text-xs gap-1.5 font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>New Work Order</span>
          </Button>
        </div>
      </div>

      {/* Spare Parts Quick Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Hydraulic Fluid (ISO VG 46)</span>
            <Package className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 text-lg font-bold font-mono text-emerald-400">820 Liters</div>
          <p className="text-[10px] text-slate-500">Inventory: Optimal</p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Klüber ISOFLEX Grease</span>
            <Package className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="mt-1 text-lg font-bold font-mono text-amber-400">4 Cartridges</div>
          <p className="text-[10px] text-amber-500">Low stock reorder sent</p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>SKF Spindle Bearing Kits</span>
            <Package className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 text-lg font-bold font-mono text-emerald-400">12 Units</div>
          <p className="text-[10px] text-slate-500">Central Bay 3</p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Technician Availability</span>
            <User className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 text-lg font-bold font-mono text-white">4 Certified On Duty</div>
          <p className="text-[10px] text-emerald-400">Shift 1 & 2 Covered</p>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTickets = filteredTickets.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className="flex flex-col rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                    {col.label}
                  </h3>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[11px] font-mono font-bold text-cyan-400">
                    {colTickets.length}
                  </span>
                </div>
              </div>

              {/* Tickets List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTickets.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-800/80 rounded-lg">
                    No tickets in this lane
                  </div>
                ) : (
                  colTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 shadow-md hover:border-slate-700 transition-all space-y-2.5"
                    >
                      {/* Ticket code & priority */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">
                          {ticket.id}
                        </span>
                        {getPriorityBadge(ticket.priority)}
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-bold text-slate-100 leading-snug">
                        {ticket.title}
                      </h4>

                      {/* Target Machine */}
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Wrench className="h-3 w-3 text-slate-500" />
                        <span className="text-slate-300 font-semibold">{ticket.equipmentName}</span>
                        <span className="font-mono text-slate-500">({ticket.equipmentCode})</span>
                      </div>

                      {/* Meta info */}
                      <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3 text-slate-500" />
                            <span>Tech:</span>
                          </span>
                          <span className="text-slate-200 font-medium">{ticket.assignedTo}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <span>Slot:</span>
                          </span>
                          <span className="text-slate-300">{ticket.scheduledDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-slate-500" />
                            <span>Cost:</span>
                          </span>
                          <span className="font-mono text-slate-300">${ticket.costEstimate}</span>
                        </div>
                      </div>

                      {/* Parts Needed Tags */}
                      {ticket.partsNeeded.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {ticket.partsNeeded.map((part, i) => (
                            <span
                              key={i}
                              className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-300"
                            >
                              {part}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Status Transition Buttons */}
                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1">
                        {col.status !== "In Progress" && col.status !== "Completed" && (
                          <button
                            onClick={() => updateTicketStatus(ticket.id, "In Progress")}
                            className="text-[10px] text-amber-400 hover:text-amber-300 underline font-medium"
                          >
                            Start Work &rarr;
                          </button>
                        )}
                        {col.status === "In Progress" && (
                          <button
                            onClick={() => updateTicketStatus(ticket.id, "Completed")}
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-medium"
                          >
                            Mark Completed &rarr;
                          </button>
                        )}
                        {col.status === "Completed" && (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Signed Off</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
