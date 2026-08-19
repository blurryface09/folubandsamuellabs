import React from "react";
import { motion } from "framer-motion";
import { buttonTap } from "@/lib/motion/animations";

type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

interface ButtonPrimaryProps extends NativeButtonProps {
  children: React.ReactNode;
  loading?: boolean;
}

export function ButtonPrimary({
  children,
  loading,
  disabled,
  onClick,
  ...props
}: ButtonPrimaryProps) {
  return (
    <motion.button
      {...props}
      onClick={onClick}
      variants={buttonTap}
      whileTap="tap"
      disabled={disabled || loading}
      style={{
        padding: "12px 32px",
        background: "linear-gradient(135deg, #C9A84C, #F0C040)",
        color: "#050505",
        border: "none",
        borderRadius: "8px",
        fontWeight: 700,
        fontSize: "14px",
        fontFamily: "var(--font-roboto-mono)",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.5 : 1,
        transition: "all 0.3s ease",
        boxShadow: "0 0 20px rgba(201,168,76,0.3)",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 0 40px rgba(201,168,76,0.6)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 0 20px rgba(201,168,76,0.3)";
        }
      }}
    >
      {loading ? "Loading..." : children}
    </motion.button>
  );
}
