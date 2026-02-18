import { memo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useColors } from "@/hooks/use-colors";

interface ReadingPlanCircleProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export const ReadingPlanCircleProgress = memo(
  function ReadingPlanCircleProgress({
    progress,
    size = 24,
    strokeWidth = 2,
    children,
  }: ReadingPlanCircleProgressProps) {
    const colors = useColors();
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clampedProgress = Math.min(1, Math.max(0, progress));
    const strokeDashoffset = circumference * (1 - clampedProgress);

    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          {/* Background track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress arc */}
          {clampedProgress > 0 && (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.text}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation={-90}
              origin={`${size / 2}, ${size / 2}`}
            />
          )}
        </Svg>
        {children}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
