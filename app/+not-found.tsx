import { Stack, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";

export default function NotFoundScreen() {
  const colors = useColors();
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Page not found
        </Text>
        <Text style={[styles.message, { color: colors.textMuted }]}>
          {"The page you're looking for doesn't exist."}
        </Text>
        <Pressable
          onPress={() => router.replace("/")}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>
            Go Home
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
