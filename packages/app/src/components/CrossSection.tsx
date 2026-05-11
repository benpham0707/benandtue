// Cross-section section: drink photo on the left with leader lines pointing
// into stacked callouts on the right. When a drink has real photography we
// render the full PNG (via RealCup); fallback drinks render the procedural
// half-photo / half-illustration so the spec's Frame 19 layout still reads.

import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "./svg";
import { CupIllustration } from "./CupIllustration";
import { RealCup, hasRealImage } from "./RealCup";
import { colors, fontFamily, type } from "../theme/tokens";
import type { CrossSectionCallout } from "../types";

type Props = {
  drinkId: string;
  callouts: CrossSectionCallout[];
};

export function CrossSection({ drinkId, callouts }: Props) {
  const cupWidth = 158;
  const cupHeight = cupWidth * 1.4;
  const isReal = hasRealImage(drinkId);

  return (
    <View style={styles.row}>
      <View style={styles.cupCol}>
        {isReal ? (
          <RealCup drinkId={drinkId} size={cupWidth} />
        ) : (
          <>
            {/* Procedural half-photo / half-illustration look. */}
            <View style={[styles.half, { left: 0 }]}>
              <View style={styles.clipLeft}>
                <CupIllustration drinkId={drinkId} size={cupWidth} />
              </View>
            </View>
            <View style={[styles.half, { right: 0, opacity: 0.92 }]}>
              <View style={styles.clipRight}>
                <CupIllustration drinkId={drinkId} size={cupWidth} withLogo={false} />
              </View>
            </View>
          </>
        )}
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
    alignItems: "center",
    justifyContent: "center",
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
