"use client";

import { motion } from "framer-motion";

export const FadeIn = ({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }} // "Slow, deliberate" curve
        className={className}
    >
        {children}
    </motion.div>
);

export const FadeInStagger = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <motion.div
        initial="hidden"
        animate="visible"
        variants={{
            visible: { transition: { staggerChildren: 0.1 } }
        }}
        className={className}
    >
        {children}
    </motion.div>
);

export const FadeInItem = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
        }}
    >
        {children}
    </motion.div>
);
