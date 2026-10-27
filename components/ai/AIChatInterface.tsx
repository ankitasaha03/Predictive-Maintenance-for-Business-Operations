"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Activity,
  ArrowRight,
  Wrench,
  Sliders,
  HelpCircle,
  Clock,
  Cpu,
} from "lucide-react";
import { usePredictiveMaintenance } from "@/context/PredictiveMaintenanceContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIChatMessage } from "@/types";

export function AIChatInterface({
  onScheduleMaintenance,
}: {
  onScheduleMaintenance?: (customTitle?: string) => void;
}) {
  const {
    chatMessages,
    isAiThinking,
    sendChatMessage,
    selectedEquipment,
    setSelectedEquipmentId,
    setActiveTab,
    mitigateAnomaly,
  } = usePredictiveMaintenance();

  const [inputPrompt, setInputPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAiThinking]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isAiThinking) return;

    const query = inputPrompt;
    setInputPrompt("");
    await sendChatMessage(query, selectedEquipment.id);
  };

  const handleQuickPrompt = (promptText: string) => {
    if (isAiThinking) return;
    sendChatMessage(promptText, selectedEquipment.id);
  };

  const renderMessageContent = (content: string) => {
    // Simple markdown renderer for bold, lists, and headings
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-bold text-cyan-300 text-sm mt-2 mb-1">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("#### ")) {
        return (
          <h5 key={idx} className="font-semibold text-slate-200 text-xs mt-2 mb-0.5">
            {line.replace("#### ", "")}
          </h5>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const text = line.replace(/^[-*]\s+/, "");
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-300 my-0.5 leading-relaxed">
            {renderInlineMarkdown(text)}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-slate-300 my-0.5 leading-relaxed">
            {renderInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs text-slate-200 my-1 leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-cyan-300 font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/40 rounded-xl overflow-hidden border border-slate-800/80">
      {/* Active machine context header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">Active IoT Context:</span>
          <span className="font-mono text-cyan-400 font-bold">
            {selectedEquipment.code} • {selectedEquipment.name}
          </span>
        </div>
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
          {selectedEquipment.healthScore}% Health
        </Badge>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs ${
                  isUser
                    ? "bg-slate-800 border-slate-700 text-slate-300"
                    : "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                }`}
              >
                {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 shadow-md ${
                  isUser
                    ? "bg-cyan-600 text-white rounded-tr-none"
                    : "bg-slate-900/90 border border-slate-800/90 text-slate-200 rounded-tl-none"
                }`}
              >
                {!isUser ? renderMessageContent(msg.content) : <p className="text-xs">{msg.content}</p>}

                {/* Telemetry Snapshot Pill if present */}
                {msg.equipmentContext && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-3 text-[10px] font-mono text-slate-400">
                    <span>Vib: {msg.equipmentContext.vibration.toFixed(2)} mm/s</span>
                    <span>Temp: {msg.equipmentContext.temperature.toFixed(1)}°C</span>
                    <span>Press: {msg.equipmentContext.pressure.toFixed(1)} PSI</span>
                  </div>
                )}

                {/* Suggested Actions within bubble */}
                {msg.suggestedActions && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (action.actionType === "schedule") {
                            onScheduleMaintenance?.(`AI Recommended: Repair ${selectedEquipment.name}`);
                          } else if (action.actionType === "view_sensor") {
                            setActiveTab("sensor-analytics");
                          } else if (action.actionType === "derate") {
                            mitigateAnomaly(selectedEquipment.id);
                          } else if (action.payload) {
                            setSelectedEquipmentId(action.payload);
                            sendChatMessage(`Investigate ${action.label}`, action.payload);
                          }
                        }}
                        className="rounded-md border border-cyan-500/30 bg-cyan-950/50 px-2 py-1 text-[11px] text-cyan-300 hover:bg-cyan-900/60 hover:text-white transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-1 text-[9px] text-slate-400 text-right">{msg.timestamp}</div>
              </div>
            </div>
          );
        })}

        {/* AI Thinking Animation */}
        {isAiThinking && (
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 animate-pulse">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="rounded-xl rounded-tl-none bg-slate-900 border border-slate-800 px-4 py-3 text-xs text-cyan-400 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Analyzing live telemetry harmonics & sensor correlation matrices...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">Prompts:</span>
        <button
          onClick={() => handleQuickPrompt("Why is Hydraulic Press #2 showing high temperature?")}
          className="rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 whitespace-nowrap transition-colors"
        >
          Why is Hydraulic Press #2 overheating?
        </button>
        <button
          onClick={() => handleQuickPrompt("Analyze CNC Machine #4 vibration harmonics")}
          className="rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 whitespace-nowrap transition-colors"
        >
          Analyze CNC Machine #4 harmonics
        </button>
        <button
          onClick={() => handleQuickPrompt("Generate a maintenance schedule for next week")}
          className="rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 whitespace-nowrap transition-colors"
        >
          Generate maintenance schedule for next week
        </button>
        <button
          onClick={() => handleQuickPrompt("What machines need immediate lubrication?")}
          className="rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 whitespace-nowrap transition-colors"
        >
          Check lubrication status
        </button>
      </div>

      {/* Input form */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
        <input
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={`Ask anything about ${selectedEquipment.code} or factory telemetry...`}
          disabled={isAiThinking}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!inputPrompt.trim() || isAiThinking}
          className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-3.5"
        >
          <Send className="h-3.5 w-3.5 mr-1" />
          <span>Ask</span>
        </Button>
      </form>
    </div>
  );
}
