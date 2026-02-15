import { Pressable } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

export function CircularProgress({
  progress,
  size = 24,
  strokeWidth = 2.5,
  color,
  trackColor,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  trackColor: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  const isOverLimit = progress > 1;
  const displayColor = isOverLimit ? "#ef4444" : color;

  return (
    <Svg
      width={size}
      height={size}
      style={{ transform: [{ rotate: "-90deg" }] }}
    >
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={displayColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
