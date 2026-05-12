"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  url: string;
  width?: number | string;
  height?: number | string;
};

export function BrowserFrame({ children, url, width = 1100, height = 680 }: Props) {
  const radius = 14;
  const chromeHeight = 44;

  return (
    <motion.div
      className="relative"
      style={{ width, height }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
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
        className="absolute flex items-center px-4 gap-3"
        style={{
          left: 0,
          right: 0,
          top: 0,
          height: chromeHeight,
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>

        <div className="flex-1 flex justify-center">
          <div
            className="px-4 py-1.5 rounded-md text-xs text-white/70 flex items-center gap-2 max-w-[60%] truncate"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z"
                fill="currentColor"
              />
            </svg>
            <span className="truncate">{url}</span>
          </div>
        </div>

        <div style={{ width: 54 }} />
      </div>

      <div
        className="absolute overflow-hidden bg-white"
        style={{
          left: 1,
          right: 1,
          top: chromeHeight,
          bottom: 1,
          borderBottomLeftRadius: radius - 1,
          borderBottomRightRadius: radius - 1,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
