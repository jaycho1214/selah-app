import { isLiquidGlassAvailable } from "expo-glass-effect";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

import { useBehindDaysStore } from "@/lib/stores/behind-days-store";

const hasGlass = isLiquidGlassAvailable();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const behindDays = useBehindDaysStore((s) => s.behindDaysCount);

  return (
    <NativeTabs
      backgroundColor={hasGlass ? undefined : isDark ? "#0c0a09" : "#ffffff"}
      disableTransparentOnScrollEdge={!hasGlass}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label hidden>Bible</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md="home"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="posts">
        <NativeTabs.Trigger.Label hidden>Posts</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "text.bubble", selected: "text.bubble.fill" }}
          md="forum"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="plans">
        <NativeTabs.Trigger.Label hidden>
          Reading Plans
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "book", selected: "book.fill" }}
          md="menu_book"
        />
        {behindDays > 0 && (
          <NativeTabs.Trigger.Badge>{String(behindDays)}</NativeTabs.Trigger.Badge>
        )}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label hidden>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "person", selected: "person.fill" }}
          md="person"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role={hasGlass ? "search" : undefined}>
        <NativeTabs.Trigger.Label hidden>Search</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
