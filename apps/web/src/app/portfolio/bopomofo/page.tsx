"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const AppDemoShell = dynamic(
  () => import("@/components/AppDemoShell").then((m) => m.AppDemoShell),
  { ssr: false },
);

function BopomofoFullscreenContent() {
  const search = useSearchParams();
  const drinkId = search.get("drink");
  const freezeId = search.get("freezeMorph");
  const freezeAt = parseFloat(search.get("p") ?? "");
  const initialRoute = drinkId ? ({ name: "detail" as const, drinkId }) : undefined;
  const freezeMorph = freezeId && Number.isFinite(freezeAt)
    ? { drinkId: freezeId, progress: freezeAt }
    : undefined;

  // iPhone 14/15 logical ratio: 390 / 844 ≈ 0.462 (19.5:9). Constrain the phone
  // viewport so it never stretches taller than a real device on desktop.
  const PHONE_W = 390;
  const PHONE_H = 844;

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: `min(${PHONE_W}px, 100vw, calc(100vh * ${PHONE_W} / ${PHONE_H}))`,
          aspectRatio: `${PHONE_W} / ${PHONE_H}`,
          background: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <AppDemoShell initialRoute={initialRoute} freezeMorph={freezeMorph} />
      </div>
    </main>
  );
}

export default function BopomofoFullscreen() {
  return (
    <Suspense fallback={null}>
      <BopomofoFullscreenContent />
    </Suspense>
  );
}
