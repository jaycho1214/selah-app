import { memo, useEffect, useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const PARTICLE_COUNT = 15;
const DURATION = 1500;
const COLORS = [
  "#000000",
  "#333333",
  "#666666",
  "#999999",
  "#BBBBBB",
  "#FFFFFF",
];

interface MiniConfettiParticleProps {
  delay: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  rotation: number;
  color: string;
  size: number;
}

function MiniConfettiParticle({
  delay,
  startX,
  startY,
  endX,
  endY,
  rotation,
  color,
  size,
}: MiniConfettiParticleProps) {
  const progress = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration: DURATION, easing: Easing.out(Easing.quad) }),
    );
    opacity.value = withDelay(
      delay + DURATION * 0.6,
      withTiming(0, { duration: DURATION * 0.4 }),
    );
  }, [delay, progress, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: startX + (endX - startX) * progress.value },
      {
        translateY:
          startY +
          (endY - startY) * progress.value +
          150 * progress.value * progress.value,
      },
      { rotate: `${rotation * progress.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size * 0.6,
          backgroundColor: color,
          borderRadius: 2,
        },
        animatedStyle,
      ]}
    />
  );
}

interface MiniConfettiProps {
  onComplete?: () => void;
}

export const MiniConfetti = memo(function MiniConfetti({
  onComplete,
}: MiniConfettiProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        key: i,
        delay: Math.random() * 200,
        startX: SCREEN_WIDTH * 0.3 + Math.random() * SCREEN_WIDTH * 0.4,
        startY: SCREEN_HEIGHT * 0.35,
        endX: Math.random() * SCREEN_WIDTH,
        endY: SCREEN_HEIGHT * 0.25 + Math.random() * SCREEN_HEIGHT * 0.25,
        rotation: (Math.random() - 0.5) * 540,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 5 + Math.random() * 4,
      })),
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, DURATION + 300);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Animated.View style={styles.container} pointerEvents="none">
      {particles.map((p) => (
        <MiniConfettiParticle
          key={p.key}
          delay={p.delay}
          startX={p.startX}
          startY={p.startY}
          endX={p.endX}
          endY={p.endY}
          rotation={p.rotation}
          color={p.color}
          size={p.size}
        />
      ))}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
});
