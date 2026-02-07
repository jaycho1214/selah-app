import { useEffect } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const LOGO = require("@/assets/images/splash-icon.png");

export function AnimatedSplashScreen({ onFinish }: { onFinish: () => void }) {
  const colorScheme = useColorScheme();
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(
      300,
      withTiming(2.5, {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      }),
    );
    opacity.value = withDelay(
      300,
      withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) }, () => {
        runOnJS(onFinish)();
      }),
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.container,
        { backgroundColor: colorScheme === "dark" ? "#000000" : "#ffffff" },
        containerStyle,
      ]}
    >
      <Animated.Image
        source={LOGO}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 27,
  },
});
