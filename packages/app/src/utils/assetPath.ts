// NEXT_PUBLIC_BASE_PATH is injected by apps/web/next.config.ts at build time.
// Empty in local dev, "/benandtue" on the GitHub Pages deploy. Wrap any
// absolute-from-root image URI so it resolves under the basePath.
const BASE =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_BASE_PATH) || "";

export const assetPath = (p: string): string => {
  if (!p) return p;
  if (/^([a-z]+:)?\/\//i.test(p)) return p; // already absolute URL
  return `${BASE}${p.startsWith("/") ? "" : "/"}${p}`;
};
