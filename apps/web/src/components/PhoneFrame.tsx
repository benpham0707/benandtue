"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  width?: number;
  height?: number;
};

export function PhoneFrame({ children, width = 390, height = 844 }: Props) {
  const bezel = 14;
  const radius = 56;
  const innerRadius = radius - bezel;

  return (
    <motion.div
      className="relative"
      style={{ width: width + bezel * 2, height: height + bezel * 2 }}
      initial={{ opacity: 0, y: 30, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="absolute inset-0"
        style={{
          borderRadius: radius,
          background:
            "linear-gradient(160deg, #2a2a2a 0%, #0d0d0d 38%, #050505 64%, #1a1a1a 100%)",
          boxShadow:
            "0 50px 90px -40px rgba(0,0,0,0.65), 0 18px 30px -10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          inset: 4,
          borderRadius: radius - 4,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 16%, rgba(255,255,255,0) 84%, rgba(255,255,255,0.04) 100%)",
        }}
      />

      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: -1,
          top: 110,
          width: 3,
          height: 32,
          background: "linear-gradient(180deg, #1f1f1f, #050505)",
          borderRadius: 2,
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: -1,
          top: 156,
          width: 3,
          height: 56,
          background: "linear-gradient(180deg, #1f1f1f, #050505)",
          borderRadius: 2,
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: -1,
          top: 232,
          width: 3,
          height: 56,
          background: "linear-gradient(180deg, #1f1f1f, #050505)",
          borderRadius: 2,
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          right: -1,
          top: 196,
          width: 3,
          height: 86,
          background: "linear-gradient(180deg, #1f1f1f, #050505)",
          borderRadius: 2,
        }}
      />

      <div
        className="absolute overflow-hidden"
        style={{
          left: bezel,
          top: bezel,
          width,
          height,
          borderRadius: innerRadius,
          background: "#F7F4EE",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {children}
      </div>

      <div
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          bottom: bezel + 8,
          width: 134,
          height: 5,
          borderRadius: 3,
          background: "rgba(20, 16, 12, 0.18)",
        }}
      />
    </motion.div>
  );
}
