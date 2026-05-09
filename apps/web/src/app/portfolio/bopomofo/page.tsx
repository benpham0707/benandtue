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

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        background: "#F7F4EE",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, height: "100%" }}>
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
