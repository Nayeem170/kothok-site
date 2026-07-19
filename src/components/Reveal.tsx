import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Reveal stagger delays in seconds - sequential entry within a section. */
export const STAGGER = {
  lead: 0.05,
  follow: 0.1,
  trail: 0.14,
  late: 0.2,
} as const;

/** Reveal duration and easing (seconds, cubic bezier). */
const DURATION_SEC = 0.6;
const EASE = [0.2, 0.8, 0.2, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: DURATION_SEC, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
