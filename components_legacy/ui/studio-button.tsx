"use client";

import { motion } from "framer-motion";
import { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface StudioButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StudioButton({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: StudioButtonProps) {
  const baseClasses = "relative overflow-hidden rounded-2xl font-medium transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-studio-accent/50";

  const variantClasses = {
    primary: "bg-studio-accent text-white shadow-studio-glow hover:shadow-studio-glow hover:bg-studio-accentDim hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-studio-steel/60 text-studio-cloud hover:bg-studio-steel border border-white/[0.08] hover:border-white/[0.12] hover:scale-[1.02] active:scale-[0.98]",
    ghost: "text-studio-cloud hover:text-studio-paper hover:bg-studio-coal/30 hover:scale-[1.02] active:scale-[0.98]"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...(props as any)}
    >
      <span className="relative z-10">{children}</span>

      {/* Subtle shine effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
        initial={false}
        whileHover={{
          translateX: "100%",
          transition: { duration: 0.6, ease: "easeInOut" }
        }}
      />
    </motion.button>
  );
}