import * as React from "react";
import { Pressable, PressableProps, View, StyleSheet } from "react-native";
import { Text } from "./text";
import { useColors } from "@/hooks/use-colors";

type ButtonVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
}

const Button = React.memo(
  React.forwardRef<View, ButtonProps>(
    (
      { variant = "default", size = "default", children, style, ...props },
      ref,
    ) => {
      const colors = useColors();

      const variantStyles: Record<ButtonVariant, any> = {
        default: { backgroundColor: colors.primary },
        secondary: { backgroundColor: colors.secondary },
        destructive: { backgroundColor: colors.destructive },
        outline: {
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: "transparent",
        },
        ghost: { backgroundColor: "transparent" },
      };

      const textColors: Record<ButtonVariant, string> = {
        default: colors.primaryForeground,
        secondary: colors.secondaryForeground,
        destructive: colors.destructiveForeground,
        outline: colors.text,
        ghost: colors.text,
      };

      const sizeStyles: Record<ButtonSize, any> = {
        default: { height: 40, paddingHorizontal: 16, paddingVertical: 8 },
        sm: { height: 36, paddingHorizontal: 12 },
        lg: { height: 44, paddingHorizontal: 32 },
        icon: { height: 40, width: 40 },
      };

      return (
        <Pressable
          ref={ref}
          style={[
            styles.base,
            sizeStyles[size],
            variantStyles[variant],
            style as any,
          ]}
          {...props}
        >
          {typeof children === "string" ? (
            <Text style={[styles.text, { color: textColors[variant] }]}>
              {children}
            </Text>
          ) : (
            children
          )}
        </Pressable>
      );
    },
  ),
);
Button.displayName = "Button";

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
