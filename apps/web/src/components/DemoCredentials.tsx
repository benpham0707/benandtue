"use client";

import { useState } from "react";

type Props = {
  email: string;
  password: string;
};

export function DemoCredentials({ email, password }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#28C840]" />
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">
          Demo access · sign in below
        </span>
      </div>
      <p className="text-xs text-white/60 leading-relaxed mb-4">
        Click to copy, then paste into the login screen in the embedded app.
        Real chocolate-shop data stays locked — demo sessions return canned
        responses so you can poke around the UI without touching anything
        sensitive.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <CredField label="Email" value={email} />
        <CredField label="Password" value={password} />
      </div>
    </div>
  );
}

function CredField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard API may be unavailable in some sandboxed contexts.
      // Silently no-op — the value is still visible for manual copy.
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="group flex flex-col items-start gap-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-left hover:border-white/25 transition"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
        {label}
      </span>
      <span className="flex items-center gap-2 w-full">
        <span
          className="text-xs text-white/85 truncate"
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          }}
        >
          {value}
        </span>
        <span className="ml-auto text-[10px] text-white/40 group-hover:text-white/70 transition">
          {copied ? "Copied" : "Copy"}
        </span>
      </span>
    </button>
  );
}
