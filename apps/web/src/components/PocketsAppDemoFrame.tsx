"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Props = {
  src: string;
  title?: string;
  style?: CSSProperties;
  background?: string;
};

// Wraps the pockets-app demo iframe with a "Loading demo…" overlay so
// visitors don't see a blank cream screen during the ~3–8s the embedded
// Expo bundle takes to boot, hydrate, auto-sign-in, and route to the home
// screen. The overlay fades out as soon as the iframe fires its load event.
export function PocketsAppDemoFrame({
  src,
  title = "Pocket's App — live demo",
  style,
  background = "#FAF8F5",
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  // React's synthetic `onLoad` can miss the event if the iframe finishes
  // loading before React attaches the listener (common in dev with HMR).
  // Attach via the DOM listener and also check the current readyState so
  // we recover the already-loaded case.
  useEffect(() => {
    const el = iframeRef.current;
    if (!el) return;
    // The iframe HTML loads quickly (~hundreds of ms) but the 5MB Expo
    // bundle inside continues downloading and executing for several seconds
    // after `load`. Yanking the overlay immediately on `load` exposes the
    // iframe's own cream auth-loading state. So we wait a short grace
    // period after load fires before fading the overlay out.
    const GRACE_MS = 2000;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const markLoaded = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setLoaded(true), GRACE_MS);
    };

    // Already-loaded recovery — React may attach the listener after the
    // load event already fired (HMR, fast-refresh in dev).
    try {
      if (el.contentDocument && el.contentDocument.readyState === "complete") {
        markLoaded();
      }
    } catch {
      // Same-origin so this shouldn't throw, but be defensive.
    }
    el.addEventListener("load", markLoaded);
    return () => {
      el.removeEventListener("load", markLoaded);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          color: "#8C7B6B",
          fontSize: 13,
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          opacity: loaded ? 0 : 1,
          transition: "opacity 300ms ease",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            border: "2px solid rgba(232, 108, 44, 0.25)",
            borderTopColor: "#E86C2C",
            animation: "pocketsapp-spin 0.9s linear infinite",
          }}
        />
        <span>Booting demo…</span>
        <style>{`
          @keyframes pocketsapp-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        allow="camera; geolocation; clipboard-read; clipboard-write"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
          background,
        }}
      />
    </div>
  );
}
