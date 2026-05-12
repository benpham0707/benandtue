import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { assetPath } from "../utils/assetPath";

export type SpinCupHandle = {
  setFrame: (idx: number) => void;
};

type Props = {
  drinkId: string;
  frameCount: number;
  size: number;
};

const SPIN_BASE = assetPath("/bopomofo/spin");
const SPIN_FRAME_COUNTS: Record<string, number> = {
  "jasmine-tea": 96,
  "matcha-guava-latte": 189,
};

export function hasSpinFrames(drinkId: string): boolean {
  return drinkId in SPIN_FRAME_COUNTS;
}

export function getSpinFrameCount(drinkId: string): number {
  return SPIN_FRAME_COUNTS[drinkId] ?? 0;
}

function frameUrl(drinkId: string, idx: number): string {
  return `${SPIN_BASE}/${drinkId}/frame_${String(idx).padStart(3, "0")}.webp`;
}

export const SpinCup = forwardRef<SpinCupHandle, Props>(function SpinCup(
  { drinkId, frameCount, size },
  ref,
) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const preloadRef = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(0);

  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image();
      img.src = frameUrl(drinkId, i);
      imgs.push(img);
    }
    preloadRef.current = imgs;
    currentFrame.current = 0;
    const el = imgRef.current;
    if (el) el.src = frameUrl(drinkId, 0);
  }, [drinkId, frameCount]);

  useImperativeHandle(
    ref,
    () => ({
      setFrame: (idx: number) => {
        const clamped = Math.max(0, Math.min(frameCount - 1, idx | 0));
        if (clamped === currentFrame.current) return;
        currentFrame.current = clamped;
        const el = imgRef.current;
        if (el) el.src = frameUrl(drinkId, clamped);
      },
    }),
    [drinkId, frameCount],
  );

  const height = size * 1.4;
  return (
    <img
      ref={imgRef}
      src={frameUrl(drinkId, 0)}
      alt=""
      width={size}
      height={height}
      draggable={false}
      style={{
        width: size,
        height,
        objectFit: "contain",
        display: "block",
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  );
});
