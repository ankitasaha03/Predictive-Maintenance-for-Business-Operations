import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "operational"
    | "warning"
    | "critical"
    | "cyan";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default:
      "border-transparent bg-slate-700 text-slate-100",
    secondary:
      "border-slate-700 bg-slate-800 text-slate-300",
    destructive:
      "border-rose-500/30 bg-rose-500/15 text-rose-300",
    outline:
      "border-slate-700 text-slate-300",
    operational:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-medium",
    warning:
      "border-amber-500/40 bg-amber-500/10 text-amber-300 font-medium",
    critical:
      "border-rose-500/40 bg-rose-500/15 text-rose-300 font-semibold animate-pulse-slow",
    cyan:
      "border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-medium",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
