import { useHeaderHeight } from "@react-navigation/elements";
import { isLiquidGlassAvailable } from "expo-glass-effect";

export const IS_LIQUID_GLASS = isLiquidGlassAvailable();

/**
 * Returns the paddingTop needed for content when using a transparent header.
 * When liquid glass is available, the header is transparent and floats over content,
 * so we need paddingTop = headerHeight. Otherwise the header occupies layout space
 * and no extra padding is needed.
 */
export function useTransparentHeaderPadding() {
  const headerHeight = useHeaderHeight();
  return IS_LIQUID_GLASS ? headerHeight : 0;
}
