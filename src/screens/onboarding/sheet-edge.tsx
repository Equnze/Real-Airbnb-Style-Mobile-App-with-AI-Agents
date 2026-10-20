import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme";

// The sheet's slanted, curved top edge, measured from roam-onboarding.png on a 390pt-wide grid.
// Stretches with the screen width; height scales with it.
const EDGE_PATH = "M0 72 L0 40 C0 14 14 0 44 0 L100 0 C200 0 290 18 352 32 C378 38 390 50 390 72 Z";

export const SHEET_EDGE_BASE = { width: 390, height: 72 } as const;

export function SheetEdge({ width }: { width: number }) {
  const height = (SHEET_EDGE_BASE.height * width) / SHEET_EDGE_BASE.width;
  return (
    <Svg width={width} height={height} viewBox="0 0 390 72" preserveAspectRatio="none">
      <Path d={EDGE_PATH} fill={colors.surface} />
    </Svg>
  );
}
