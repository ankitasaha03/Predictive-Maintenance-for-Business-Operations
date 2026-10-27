import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "emerald" | "amber";
  size?: "default" | "sm" | "lg" | "icon" | "xs";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]";

    const variantStyles = {
      default:
        "bg-cyan-600 text-white shadow-sm hover:bg-cyan-500 hover:shadow-cyan-500/25",
      destructive:
        "bg-rose-600 text-white shadow-sm hover:bg-rose-500 hover:shadow-rose-500/25",
      outline:
        "border border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600",
      secondary:
        "bg-slate-800 text-slate-200 shadow-sm hover:bg-slate-700 hover:text-white",
      ghost:
        "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100",
      link:
        "text-cyan-400 underline-offset-4 hover:underline",
      emerald:
        "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm hover:shadow-emerald-500/25",
      amber:
        "bg-amber-600 text-white hover:bg-amber-500 shadow-sm hover:shadow-amber-500/25",
    };

    const sizeStyles = {
      default: "h-9 px-4 py-2",
      xs: "h-7 px-2.5 text-xs rounded-md",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-lg px-6 text-base",
      icon: "h-9 w-9",
    };

    return (
      <button
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
