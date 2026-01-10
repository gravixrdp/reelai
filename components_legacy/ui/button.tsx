"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-studio-neon-cyan text-studio-black hover:bg-studio-neon-cyan/80 shadow-studio-glow-cyan hover:shadow-studio-glow-cyan active:shadow-studio-glow-cyan",
      destructive:
        "bg-studio-neon-pink text-studio-black hover:bg-studio-neon-pink/80 shadow-studio-glow-magenta hover:shadow-studio-glow-magenta",
      outline:
        "border border-studio-neon-cyan/50 bg-studio-slate/70 hover:bg-studio-slate text-studio-paper shadow-studio-glow-cyan hover:shadow-studio-glow-cyan",
      secondary:
        "bg-studio-slate text-studio-paper hover:bg-studio-iron shadow-studio-glow-magenta hover:shadow-studio-glow-magenta",
      ghost: "hover:bg-studio-slate hover:text-studio-paper text-studio-fog",
      link: "text-studio-neon-cyan underline-offset-4 hover:underline hover:text-studio-neon-cyan/80",
    };

    const sizes = {
      default: "h-10 px-4 py-2 rounded-organic",
      sm: "h-9 rounded-organic-sm px-3 text-xs",
      lg: "h-12 rounded-organic-lg px-8 text-base",
      icon: "h-10 w-10 rounded-organic",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:animate-press-shrink hover:animate-hover-tilt",
          variants[variant],
          sizes[size],
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
