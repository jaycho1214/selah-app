import React, { Component, type ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WifiOff, AlertCircle } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /**
   * When true, network/server errors are re-thrown so a parent
   * ErrorBoundary (e.g. at root level) can catch them full-screen.
   * Use this on screen-level boundaries inside tab navigators.
   */
  propagateServerErrors?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/** Check whether an error originates from a network / server failure */
function isNetworkError(error: Error | null): boolean {
  if (!error) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes("relaynetwork") ||
    msg.includes("network request failed") ||
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("timeout") ||
    msg.includes("econnrefused") ||
    msg.includes("socket hang up") ||
    msg.includes("502") ||
    msg.includes("503") ||
    msg.includes("504")
  );
}

/**
 * Error boundary that catches Relay and other JS errors,
 * displaying a graceful full-page error screen instead of crashing.
 *
 * With `propagateServerErrors`, network errors are re-thrown
 * so the root boundary renders a true full-screen error (hiding tabs).
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Propagate network errors to the parent (root) error boundary
      // so they appear full-screen, covering the bottom tab bar.
      if (
        this.props.propagateServerErrors &&
        isNetworkError(this.state.error)
      ) {
        throw this.state.error;
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorScreen error={this.state.error} onRetry={this.handleRetry} />
      );
    }

    return this.props.children;
  }
}

/** Extract a human-readable message from Relay or generic errors */
function getErrorMessage(error: Error | null): string {
  if (!error) return "Something went wrong";

  if (isNetworkError(error)) {
    return "Check your connection and try again.";
  }

  // Relay errors embed details in the message
  if (error.message.includes("RelayNetwork")) {
    const match = error.message.match(/got error\(s\):\n(.+?)(?:\n\nSee|$)/s);
    if (match) return match[1].trim();
  }

  return error.message;
}

function ErrorScreen({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const message = getErrorMessage(error);
  const serverError = isNetworkError(error);
  const Icon = serverError ? WifiOff : AlertCircle;

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.surfaceElevated },
          ]}
        >
          <Icon size={24} color={colors.textMuted} strokeWidth={1.5} />
        </View>

        <Text style={[styles.heading, { color: colors.text }]}>
          {serverError ? "Unable to connect" : "Something went wrong"}
        </Text>

        <Text style={[styles.message, { color: colors.textMuted }]}>
          {message}
        </Text>

        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [
            styles.retryButton,
            {
              backgroundColor: colors.text,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.retryLabel, { color: colors.bg }]}>
            Try again
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 260,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 32,
    paddingVertical: 13,
    borderRadius: 100,
  },
  retryLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
});
