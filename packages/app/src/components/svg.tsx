// Minimal SVG primitives. We render plain DOM elements via React so this
// works on both pure RN Web (Next.js) and native (where react-native-svg
// would normally pick up; if/when this code ships to native, replace this
// shim with `import * as Svg from "react-native-svg"`).
//
// Using React.createElement keeps RN's element factory out of the equation —
// the host renderer (ReactDOM in our web demo) sees lowercase tags and emits
// real <svg> DOM, which is exactly what we need.

import { createElement, type CSSProperties, type ReactNode } from "react";

type CommonProps = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "miter" | "round" | "bevel";
  strokeOpacity?: number;
  fillOpacity?: number;
  opacity?: number;
  clipPath?: string;
  transform?: string;
  style?: CSSProperties;
  children?: ReactNode;
  pointerEvents?: "auto" | "none" | "box-none" | "box-only";
};

type SvgProps = CommonProps & {
  width?: number | string;
  height?: number | string;
  viewBox?: string;
};

export default function Svg({ children, ...rest }: SvgProps) {
  return createElement("svg", { xmlns: "http://www.w3.org/2000/svg", ...rest }, children);
}

export function Path(props: CommonProps & { d: string }) {
  return createElement("path", props);
}

export function Circle(props: CommonProps & { cx: number | string; cy: number | string; r: number | string }) {
  return createElement("circle", props);
}

export function Ellipse(props: CommonProps & { cx: number | string; cy: number | string; rx: number | string; ry: number | string }) {
  return createElement("ellipse", props);
}

export function Rect(props: CommonProps & { x?: number | string; y?: number | string; width: number | string; height: number | string; rx?: number | string; ry?: number | string }) {
  return createElement("rect", props);
}

export function G(props: CommonProps) {
  return createElement("g", props);
}

export function Defs({ children }: { children?: ReactNode }) {
  return createElement("defs", null, children);
}

export function ClipPath({ id, children }: { id: string; children?: ReactNode }) {
  return createElement("clipPath", { id }, children);
}

export function LinearGradient(props: { id: string; x1?: string | number; x2?: string | number; y1?: string | number; y2?: string | number; children?: ReactNode }) {
  return createElement("linearGradient", props, props.children);
}

export function Stop(props: { offset: string | number; stopColor: string; stopOpacity?: string | number }) {
  return createElement("stop", props);
}
