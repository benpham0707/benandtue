import type { NextConfig } from "next";

const repoName = "benandtue";
const isGithubActions = process.env.GITHUB_ACTIONS === "true";

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
  basePath: isGithubActions ? `/${repoName}` : "",
  assetPrefix: isGithubActions ? `/${repoName}/` : undefined,
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
