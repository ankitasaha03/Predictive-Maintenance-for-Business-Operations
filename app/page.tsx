"use client";

import React, { useState } from "react";
import { usePredictiveMaintenance } from "@/context/PredictiveMaintenanceContext";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { FleetOverviewCards } from "@/components/dashboard/FleetOverviewCards";
import { EquipmentGridTable } from "@/components/dashboard/EquipmentGridTable";
import { RealTimeSensorCharts } from "@/components/dashboard/RealTimeSensorCharts";
import { FailurePatternAnalysis } from "@/components/dashboard/FailurePatternAnalysis";
import { PreventiveActionCards } from "@/components/dashboard/PreventiveActionCards";
import { ScheduleMaintenanceDialog } from "@/components/modals/ScheduleMaintenanceDialog";
import { AIChatDrawer } from "@/components/ai/AIChatDrawer";
import { EquipmentFleetView } from "@/components/views/EquipmentFleetView";
import { SensorAnalyticsView } from "@/components/views/SensorAnalyticsView";
import { MaintenanceScheduleView } from "@/components/views/MaintenanceScheduleView";
import { AIAssistantView } from "@/components/views/AIAssistantView";
import { Equipment } from "@/types";

export default function Home() {
  const { activeTab, selectedEquipment } = usePredictiveMaintenance();

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [modalInitialEquipment, setModalInitialEquipment] = useState<Equipment | null>(null);
  const [modalInitialTitle, setModalInitialTitle] = useState<string | undefined>(undefined);

  const handleOpenSchedule = (equipment?: Equipment, title?: string) => {
    setModalInitialEquipment(equipment || selectedEquipment);
    setModalInitialTitle(title);
    setIsScheduleModalOpen(true);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 bg-industrial-grid">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header onOpenSchedule={() => handleOpenSchedule()} />

        {/* Scrollable Dashboard Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* 1. Fleet Overview KPI Cards */}
              <FleetOverviewCards />

              {/* 2. Real-Time Streaming Charts (7 cols) + AI Anomaly Analysis (5 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <RealTimeSensorCharts />
                </div>
                <div className="lg:col-span-5">
                  <FailurePatternAnalysis
                    onScheduleMaintenance={() =>
                      handleOpenSchedule(
                        selectedEquipment,
                        `AI Anomaly Work Order: Inspect ${selectedEquipment.name}`
                      )
                    }
                  />
                </div>
              </div>

              {/* 3. Preventive Action Recommendations */}
              <PreventiveActionCards
                onScheduleMaintenance={(customTitle) =>
                  handleOpenSchedule(selectedEquipment, customTitle)
                }
              />

              {/* 4. Equipment Fleet Grid/Table */}
              <EquipmentGridTable
                onScheduleMaintenance={(eq) => handleOpenSchedule(eq)}
              />
            </div>
          )}

          {activeTab === "equipment" && (
            <div className="max-w-7xl mx-auto">
              <EquipmentFleetView
                onScheduleMaintenance={(eq) => handleOpenSchedule(eq)}
              />
            </div>
          )}

          {activeTab === "sensor-analytics" && (
            <div className="max-w-7xl mx-auto">
              <SensorAnalyticsView />
            </div>
          )}

          {activeTab === "maintenance" && (
            <div className="max-w-7xl mx-auto">
              <MaintenanceScheduleView
                onOpenCreateTicket={() => handleOpenSchedule()}
              />
            </div>
          )}

          {activeTab === "ai-assistant" && (
            <div className="max-w-7xl mx-auto">
              <AIAssistantView
                onScheduleMaintenance={(title) =>
                  handleOpenSchedule(selectedEquipment, title)
                }
              />
            </div>
          )}
        </main>
      </div>

      {/* Persistent Floating / Sliding AI Chat Drawer */}
      <AIChatDrawer
        onScheduleMaintenance={(title) =>
          handleOpenSchedule(selectedEquipment, title)
        }
      />

      {/* Work Order Schedule Modal Dialog */}
      <ScheduleMaintenanceDialog
        open={isScheduleModalOpen}
        onOpenChange={setIsScheduleModalOpen}
        initialEquipment={modalInitialEquipment}
        initialTitle={modalInitialTitle}
      />
    </div>
  );
}
