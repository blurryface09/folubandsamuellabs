import React from "react";
import { motion } from "framer-motion";
import { hoverScale } from "@/lib/motion/animations";

interface AcademyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  index?: number;
  interactive?: boolean;
}

export function AcademyCard({
  children,
  index = 0,
  interactive = true,
  ...props
}: AcademyCardProps) {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      }}
      variants={interactive ? hoverScale : undefined}
      whileHover={interactive ? "hover" : undefined}
      whileTap={interactive ? "tap" : undefined}
      style={{
        background: "#0A0A0A",
        border: "1px solid rgba(201,168,76,0.1)",
        borderRadius: "12px",
        padding: "24px",
        transition: "all 0.3s ease",
        cursor: interactive ? "pointer" : "default",
        ...props.style,
      }}
    >
      {children}
    </motion.div>
  );
}
