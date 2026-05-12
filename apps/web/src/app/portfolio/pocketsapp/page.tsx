"use client";

import { PocketsAppDemoFrame } from "@/components/PocketsAppDemoFrame";

// iPhone 14/15 logical ratio: 390 / 844 ≈ 0.462 (19.5:9). Same constants as
// the bopomofo demo so the phone-viewport feel is consistent across the
// portfolio.
const PHONE_W = 390;
const PHONE_H = 844;

// next.config.ts sets NEXT_PUBLIC_BASE_PATH so the iframe src resolves
// correctly whether served at the root locally or under /benandtue on
// GitHub Pages. The expo export must be built with EXPO_WEB_BASE_URL
// matching this prefix + "/pocketsapp-demo" — see
// scripts/build-pocketsapp-demo.sh.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
// `?demo=1` triggers autofill + auto-submit in the embedded login screen
// using the demo account (see pockets-app login.tsx demoTriedRef effect).
const IFRAME_SRC = `${BASE_PATH}/pocketsapp-demo/index.html?demo=1`;

export default function PocketsAppFullscreen() {
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
        <PocketsAppDemoFrame src={IFRAME_SRC} />
      </div>
    </main>
  );
}
