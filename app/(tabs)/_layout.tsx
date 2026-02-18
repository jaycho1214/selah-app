import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import {
  NativeTabs,
  Icon,
  Label,
  Badge,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
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
        <Label hidden />
        <Icon
          sf={{ default: "house", selected: "house.fill" }}
          androidSrc={<VectorIcon family={MaterialIcons} name="home" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="posts">
        <Label hidden />
        <Icon
          sf={{ default: "text.bubble", selected: "text.bubble.fill" }}
          androidSrc={<VectorIcon family={MaterialIcons} name="forum" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="plans">
        <Label hidden />
        <Icon
          sf={{ default: "book", selected: "book.fill" }}
          androidSrc={<VectorIcon family={MaterialIcons} name="menu-book" />}
        />
        <Badge hidden={behindDays === 0}>{String(behindDays)}</Badge>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Label hidden />
        <Icon
          sf={{ default: "person", selected: "person.fill" }}
          androidSrc={<VectorIcon family={MaterialIcons} name="person" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role={hasGlass ? "search" : undefined}>
        <Label hidden />
        <Icon
          sf="magnifyingglass"
          androidSrc={<VectorIcon family={MaterialIcons} name="search" />}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
