import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import { Heart, LogOut, Trash2, type LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { graphql, useMutation, useRelayEnvironment } from "react-relay";
import {
  Alert,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSession } from "@/components/providers/session-provider";
import { useAnalytics } from "@/lib/analytics";
import { useTheme } from "@/components/providers/theme-provider";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import { signOutFromGoogle } from "@/lib/google-signin";
import {
  useSettingsStore,
  type FontSize,
  FONT_SIZES,
} from "@/lib/stores/settings-store";
import {
  useVerseHighlightStore,
  VERSE_HIGHLIGHT_COLORS,
} from "@/lib/stores/verse-highlight-store";
import {
  registerForPushNotificationsAsync,
  registerTokenWithServer,
  unregisterTokenFromServer,
} from "@/lib/notifications";
import {
  getStoredPushToken,
  clearStoredPushToken,
} from "@/hooks/use-notifications";
import { getStorage } from "@/lib/storage";
import type { settingsDeleteAccountMutation } from "@/lib/relay/__generated__/settingsDeleteAccountMutation.graphql";

const deleteAccountMutation = graphql`
  mutation settingsDeleteAccountMutation {
    deleteMyAccount {
      success
    }
  }
`;

// ---------------------------------------------------------------------------
// Reusable primitives
// ---------------------------------------------------------------------------

function SettingsItem({
  icon: Icon,
  label,
  onPress,
  destructive,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  const colors = useColors();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={{ backgroundColor: colors.surface }}
    >
      <View style={styles.menuItemRow}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: destructive
                ? "rgba(220, 38, 38, 0.08)"
                : colors.surfaceElevated,
            },
          ]}
        >
          <Icon
            size={18}
            color={destructive ? "#dc2626" : colors.accent}
            strokeWidth={1.5}
          />
        </View>
        <Text
          style={[
            styles.menuItemText,
            { color: destructive ? "#dc2626" : colors.text },
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const colors = useColors();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
        {title}
      </Text>
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Theme selector (3-tab: Light / Dark / System)
// ---------------------------------------------------------------------------

const THEME_OPTIONS = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
] as const;

function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const colors = useColors();

  return (
    <View
      style={[
        styles.selectorTrack,
        { backgroundColor: colors.surfaceElevated },
      ]}
    >
      {THEME_OPTIONS.map((option) => {
        const isActive = theme === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setTheme(option.id);
            }}
            style={[
              styles.selectorTab,
              isActive && [
                styles.selectorTabActive,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ],
            ]}
          >
            <Text
              style={[
                styles.selectorLabel,
                {
                  color: isActive ? colors.text : colors.textMuted,
                  fontWeight: isActive ? "600" : "400",
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Font size selector (3-tab: Small / Medium / Large)
// ---------------------------------------------------------------------------

const FONT_SIZE_OPTIONS: { id: FontSize; label: string }[] = [
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
];

function FontSizeSelector() {
  const fontSize = useSettingsStore((s) => s.fontSize);
  const setFontSize = useSettingsStore((s) => s.setFontSize);
  const colors = useColors();

  return (
    <View
      style={[
        styles.selectorTrack,
        { backgroundColor: colors.surfaceElevated },
      ]}
    >
      {FONT_SIZE_OPTIONS.map((option) => {
        const isActive = fontSize === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFontSize(option.id);
            }}
            style={[
              styles.selectorTab,
              isActive && [
                styles.selectorTabActive,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ],
            ]}
          >
            <Text
              style={{
                fontSize: FONT_SIZES[option.id].verse,
                color: isActive ? colors.text : colors.textMuted,
                fontWeight: isActive ? "600" : "400",
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Verse highlight settings
// ---------------------------------------------------------------------------

function VerseHighlightSettings() {
  const enabled = useVerseHighlightStore((s) => s.enabled);
  const color = useVerseHighlightStore((s) => s.color);
  const setEnabled = useVerseHighlightStore((s) => s.setEnabled);
  const setColor = useVerseHighlightStore((s) => s.setColor);
  const colors = useColors();

  return (
    <View style={{ gap: 12 }}>
      <View style={styles.highlightToggleRow}>
        <Text style={[styles.highlightToggleLabel, { color: colors.text }]}>
          Highlight Posted Verses
        </Text>
        <Switch
          value={enabled}
          onValueChange={(v) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setEnabled(v);
          }}
          trackColor={{ false: colors.surfaceElevated, true: colors.accent }}
        />
      </View>
      {enabled && (
        <View style={styles.highlightColorRow}>
          {VERSE_HIGHLIGHT_COLORS.map((c) => {
            const isActive = color === c.value;
            return (
              <Pressable
                key={c.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setColor(c.value);
                }}
                hitSlop={4}
              >
                <View
                  style={[
                    styles.highlightDot,
                    {
                      backgroundColor: c.value,
                      borderColor: isActive ? colors.text : "transparent",
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Notification settings
// ---------------------------------------------------------------------------

const PUSH_TOKEN_KEY = "expo-push-token";

function NotificationSettings() {
  const colors = useColors();
  const environment = useRelayEnvironment();
  const storedToken = getStoredPushToken();
  const [enabled, setEnabled] = useState(!!storedToken);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEnabled(value);
    setIsLoading(true);

    try {
      if (value) {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          getStorage().set(PUSH_TOKEN_KEY, token);
          await registerTokenWithServer(environment, token);
        } else {
          setEnabled(false);
        }
      } else {
        const token = getStoredPushToken();
        if (token) {
          await unregisterTokenFromServer(environment, token);
          clearStoredPushToken();
        }
      }
    } catch (error) {
      console.error("Notification toggle failed:", error);
      setEnabled(!value);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.highlightToggleRow}>
      <Text style={[styles.highlightToggleLabel, { color: colors.text }]}>
        Push Notifications
      </Text>
      <Switch
        value={enabled}
        onValueChange={handleToggle}
        disabled={isLoading}
        trackColor={{ false: colors.surfaceElevated, true: colors.accent }}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function SettingsScreen() {
  const { isAuthenticated, signOut } = useSession();
  const colors = useColors();
  const { capture } = useAnalytics();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [commitDeleteAccount] = useMutation<settingsDeleteAccountMutation>(
    deleteAccountMutation,
  );

  const handleSignOut = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    capture("sign_out", {});
    await signOutFromGoogle();
    await signOut();
  };

  const handleDeleteAccount = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Delete Account?",
      "This will permanently delete your account, all your posts, and all your data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Are you absolutely sure?",
              "There is no way to recover your account after deletion.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Yes, Delete Everything",
                  style: "destructive",
                  onPress: () => {
                    commitDeleteAccount({
                      variables: {},
                      onCompleted: () => {
                        capture("account_deleted", {});
                        signOutFromGoogle().then(() => {
                          getStorage().clearAll();
                          clearStoredPushToken();
                          signOut();
                        });
                      },
                      onError: (error) => {
                        console.error("Delete account failed:", error);
                        Alert.alert(
                          "Error",
                          "Failed to delete account. Please try again.",
                        );
                      },
                    });
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          title: "Settings",
          headerBackButtonDisplayMode: "minimal",
          headerTransparent: true,
          headerStyle: { backgroundColor: "transparent" },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: colors.text,
            fontSize: 17,
            fontWeight: "600",
          },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 52,
          paddingBottom: insets.bottom + 40,
        }}
        contentInsetAdjustmentBehavior="never"
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            Appearance
          </Text>
          <ThemeSelector />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            Font Size
          </Text>
          <FontSizeSelector />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            Verse Highlight
          </Text>
          <VerseHighlightSettings />
        </View>

        {isAuthenticated && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
              Notifications
            </Text>
            <NotificationSettings />
          </View>
        )}

        <SettingsSection title="Support">
          <SettingsItem
            icon={Heart}
            label="Support Selah"
            onPress={() => router.push("/donate")}
          />
        </SettingsSection>

        {isAuthenticated && (
          <SettingsSection title="Account">
            <SettingsItem
              icon={LogOut}
              label="Sign Out"
              onPress={handleSignOut}
              destructive
            />
            <SettingsItem
              icon={Trash2}
              label="Delete Account"
              onPress={handleDeleteAccount}
              destructive
            />
          </SettingsSection>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 8,
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  // Tab selectors (theme + font size)
  selectorTrack: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
  },
  selectorTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectorTabActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  selectorLabel: {
    fontSize: 14,
  },
  // Verse highlight
  highlightToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  highlightToggleLabel: {
    fontSize: 16,
  },
  highlightColorRow: {
    flexDirection: "row",
    gap: 12,
  },
  highlightDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2.5,
  },
});
