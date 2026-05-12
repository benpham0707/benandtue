"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  /** Native intrinsic width of the child in px. */
  width: number;
  /** Native intrinsic height of the child in px. */
  height: number;
  /** Never scale above this factor (default 1 — no upscaling). */
  maxScale?: number;
  children: ReactNode;
  className?: string;
};

// Renders `children` at their native pixel `width`/`height` and scales them
// down with CSS `transform: scale()` to fit the parent container's width.
// The outer box collapses to the scaled height so surrounding layout flows
// correctly. JS-driven (ResizeObserver) for cross-browser reliability —
// container-query / cqi-based scale calc misbehaves on iOS Safari.
export function ResponsiveScaler({
  width,
  height,
  maxScale = 1,
  children,
  className,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(maxScale);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w <= 0) return;
      setScale(Math.min(maxScale, w / width));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, maxScale]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        width: "100%",
        maxWidth: width,
        height: height * scale,
        marginInline: "auto",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width,
          height,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
