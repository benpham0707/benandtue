import type { NextConfig } from "next";

const repoName = "benandtue";
// basePath is only applied in production (GitHub Pages deploy). In local
// dev `next dev` serves routes at the natural URL (localhost:3000/portfolio/
// etc.), which is what humans expect. The embedded pockets-app demo whose
// internal asset paths are baked at build time WILL resolve only in
// production builds — its iframe will load locally but its CSS/JS will
// 404 in dev. That's an accepted trade-off for sane URLs everywhere else.
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? `/${repoName}` : "";

const transpiledPackages = [
  "app",
  "react-native",
  "react-native-web",
  "react-native-reanimated",
  "react-native-safe-area-context",
  "react-native-svg",
  "react-native-gesture-handler",
];

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Only set basePath/assetPrefix when they're non-empty — Next.js treats
  // empty string as invalid for these.
  ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  transpilePackages: transpiledPackages,
  turbopack: {
    resolveAlias: {
      "react-native": "react-native-web",
    },
    resolveExtensions: [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
      ".mjs",
      ".cjs",
      ".json",
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
    };
    config.resolve.extensions = [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ...(config.resolve.extensions || []),
    ];
    return config;
  },
};

export default nextConfig;
