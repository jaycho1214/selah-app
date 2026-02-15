import * as React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";
import { useColors } from "@/hooks/use-colors";

const Text = React.forwardRef<RNText, RNTextProps>(
  ({ style, ...props }, ref) => {
    const colors = useColors();
    return (
      <RNText ref={ref} style={[{ color: colors.text }, style]} {...props} />
    );
  },
);
Text.displayName = "Text";

export { Text };
