"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PanelProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function Panel({ title, subtitle, children, action, className = "" }: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className={`studio-panel studio-panel-hover p-8 rounded-3xl shadow-studio-float hover:shadow-studio-xl transition-all duration-700 ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-2">
            {title && <h3 className="text-xl font-medium text-studio-paper tracking-tight">{title}</h3>}
            {subtitle && (
              <p className="studio-text-label text-sm">{subtitle}</p>
            )}
          </div>
          {action && <div className="ml-4">{action}</div>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}
