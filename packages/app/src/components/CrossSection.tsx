// Half-photo / half-illustration cross section + leader lines + callouts.
// Pre-rendered per drink in production; here we synthesize from the cup recipe
// so layout/scale/leader-line behavior is exercised end-to-end.

import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "./svg";
import { CupIllustration } from "./CupIllustration";
import { colors, fontFamily, type } from "../theme/tokens";
import type { CrossSectionCallout } from "../types";

type Props = {
  drinkId: string;
  callouts: CrossSectionCallout[];
};

export function CrossSection({ drinkId, callouts }: Props) {
  // Layout: cup on left ~50% width, callouts stacked right.
  const cupWidth = 158;
  const cupHeight = cupWidth * 1.4; // matches CupIllustration ratio

  return (
    <View style={styles.row}>
      <View style={styles.cupCol}>
        {/* photo half (left of cup) — rendered via clip; we approximate with the same SVG */}
        <View style={[styles.half, { left: 0 }]}>
          <View style={styles.clipLeft}>
            <CupIllustration drinkId={drinkId} size={cupWidth} />
          </View>
        </View>
        {/* illustration half (right) — slightly desaturated to read as the cutaway */}
        <View style={[styles.half, { right: 0, opacity: 0.92 }]}>
          <View style={styles.clipRight}>
            <CupIllustration drinkId={drinkId} size={cupWidth} withLogo={false} />
          </View>
        </View>
      </View>

      <View style={[styles.calloutCol, { height: cupHeight }]}>
        <Svg
          width={36}
          height={cupHeight}
          style={StyleSheet.absoluteFill as any}
          pointerEvents="none"
        >
          {callouts.map((c, i) => {
            const y = (c.yPercent / 100) * cupHeight;
            return (
              <Path
                key={i}
                d={`M0 ${y - 6} Q14 ${y - 6} 24 ${y - 2} L36 ${y - 2}`}
                stroke="#C4C4C4"
                strokeWidth={0.8}
                fill="none"
              />
            );
          })}
        </Svg>
        {callouts.map((c, i) => {
          const y = (c.yPercent / 100) * cupHeight;
          return (
            <View key={i} style={[styles.calloutRow, { top: y - 14 }]}>
              {c.eyebrow ? <Text style={styles.eyebrow}>{c.eyebrow}</Text> : null}
              <Text style={styles.label}>{c.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 8,
    paddingBottom: 8,
  },
  cupCol: {
    width: 158,
    height: 158 * 1.4,
    position: "relative",
    overflow: "hidden",
  },
  half: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 79,
    overflow: "hidden",
  },
  clipLeft: { position: "absolute", left: 0, top: 0 },
  clipRight: { position: "absolute", right: 0, top: 0 },
  calloutCol: {
    flex: 1,
    paddingLeft: 24,
    position: "relative",
  },
  calloutRow: {
    position: "absolute",
    left: 24,
    right: 0,
  },
  eyebrow: {
    fontFamily: fontFamily.body,
    fontSize: type.calloutEyebrow.size,
    fontWeight: type.calloutEyebrow.weight,
    color: colors.textTertiary,
    letterSpacing: type.calloutEyebrow.tracking,
    lineHeight: type.calloutEyebrow.lineHeight,
  },
  label: {
    fontFamily: fontFamily.body,
    fontSize: type.callout.size,
    fontWeight: type.callout.weight,
    color: colors.textPrimary,
    lineHeight: type.callout.lineHeight,
  },
});
