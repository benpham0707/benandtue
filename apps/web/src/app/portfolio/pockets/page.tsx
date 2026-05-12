"use client";

const POCKETS_URL = "https://pocketsmcp.lovable.app/?demo=1";

export default function PocketsFullscreen() {
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
      <iframe
        src={POCKETS_URL}
        title="Pocket's Chocolates Backend"
        style={{
          width: "100vw",
          height: "100vh",
          border: "none",
          background: "#FFFFFF",
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </main>
  );
}
