import * as React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { Text } from "./text";
import { useColors } from "@/hooks/use-colors";

interface CardProps extends ViewProps {}

const Card = React.memo(
  React.forwardRef<View, CardProps>(({ style, ...props }, ref) => {
    const colors = useColors();
    return (
      <View
        ref={ref}
        style={[
          styles.card,
          { borderColor: colors.border, backgroundColor: colors.card },
          style,
        ]}
        {...props}
      />
    );
  }),
);
Card.displayName = "Card";

const CardHeader = React.memo(
  React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
    <View ref={ref} style={[styles.cardHeader, style]} {...props} />
  )),
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps {
  style?: any;
  children?: React.ReactNode;
}

const CardTitle = React.memo(({ style, children }: CardTitleProps) => (
  <Text style={[styles.cardTitle, style]}>{children}</Text>
));
CardTitle.displayName = "CardTitle";

const CardContent = React.memo(
  React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
    <View ref={ref} style={[styles.cardContent, style]} {...props} />
  )),
);
CardContent.displayName = "CardContent";

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  cardContent: {
    paddingTop: 0,
  },
});

export { Card, CardHeader, CardTitle, CardContent };
export type { CardProps, CardTitleProps };
