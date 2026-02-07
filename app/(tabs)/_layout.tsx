import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  NativeTabs,
  Icon,
  Label,
  VectorIcon,
} from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
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
      <NativeTabs.Trigger name="notifications">
        <Label hidden />
        <Icon
          sf={{ default: "bell", selected: "bell.fill" }}
          androidSrc={
            <VectorIcon family={MaterialIcons} name="notifications" />
          }
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Label hidden />
        <Icon
          sf={{ default: "person", selected: "person.fill" }}
          androidSrc={<VectorIcon family={MaterialIcons} name="person" />}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <Label hidden />
        <Icon
          sf="magnifyingglass"
          androidSrc={<VectorIcon family={MaterialIcons} name="search" />}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
