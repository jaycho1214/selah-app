import * as Haptics from "expo-haptics";
import { RelativePathString, router } from "expo-router";
import {
  Bookmark,
  ChevronRight,
  FileText,
  Search,
} from "lucide-react-native";
import React, { Suspense, useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { graphql, useLazyLoadQuery, useMutation } from "react-relay";

import { useSession } from "@/components/providers/session-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { ProfileHeader } from "@/components/profile/profile-header";
import {
  ProfilePostsList,
  type ProfilePostsListRef,
} from "@/components/profile/profile-posts-list";
import { ProfileSkeleton } from "@/components/profile/profile-skeleton";
import { ProfileStatsRow } from "@/components/profile/profile-stats-row";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import { signOutFromGoogle } from "@/lib/google-signin";
import type { profileLikeReflectionMutation } from "@/lib/relay/__generated__/profileLikeReflectionMutation.graphql";
import type { profileUnlikeReflectionMutation } from "@/lib/relay/__generated__/profileUnlikeReflectionMutation.graphql";
import type { profileDeleteReflectionMutation } from "@/lib/relay/__generated__/profileDeleteReflectionMutation.graphql";
import type { profileOwnProfileQuery } from "@/lib/relay/__generated__/profileOwnProfileQuery.graphql";
import { useAnnotationsStore } from "@/lib/stores/annotations-store";

// GraphQL query for own profile
const ownProfileQuery = graphql`
  query profileOwnProfileQuery {
    user {
      id
      name
      username
      bio
      image {
        url
      }
      followerCount
      followingCount
      ...profilePostsListFragment
    }
  }
`;

// Like mutation
const likeReflectionMutation = graphql`
  mutation profileLikeReflectionMutation($id: ID!) {
    bibleVersePostLike(id: $id) {
      likedAt
    }
  }
`;

// Unlike mutation
const unlikeReflectionMutation = graphql`
  mutation profileUnlikeReflectionMutation($id: ID!) {
    bibleVersePostUnlike(id: $id) {
      likedAt
    }
  }
`;

// Delete mutation
const deleteReflectionMutation = graphql`
  mutation profileDeleteReflectionMutation($id: ID!, $connections: [ID!]!) {
    bibleVersePostDelete(id: $id) {
      deletedIds @deleteEdge(connections: $connections)
    }
  }
`;

export default function ProfileScreen() {
  const { isAuthenticated, presentSignIn } = useSession();
  const colors = useColors();

  if (!isAuthenticated) {
    return <UnauthenticatedProfile />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Suspense fallback={<ProfileSkeleton />}>
        <AuthenticatedProfile />
      </Suspense>
    </SafeAreaView>
  );
}

function UnauthenticatedProfile() {
  const { presentSignIn } = useSession();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { bookmarks, notes } = useAnnotationsStore();
  const colors = useColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView style={styles.scrollView}>
        {/* Welcome message for unauthenticated users */}
        <View style={styles.welcomeContainer}>
          <View
            style={[
              styles.welcomeAvatar,
              { backgroundColor: colors.surfaceElevated },
            ]}
          >
            <Text style={styles.welcomeEmoji}>?</Text>
          </View>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Welcome to Selah
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.textMuted }]}>
            Sign in to save your reading progress, post reflections, and connect
            with the community
          </Text>
          <Button style={styles.signInButton} onPress={presentSignIn}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </Button>
        </View>

        {/* Bible Utilities */}
        <BibleUtilities bookmarks={bookmarks} notes={notes} colors={colors} />

        {/* Settings */}
        <SettingsSection
          resolvedTheme={resolvedTheme}
          toggleTheme={toggleTheme}
          colors={colors}
          isAuthenticated={false}
          onSignOut={() => {}}
        />

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

function AuthenticatedProfile() {
  const { session, signOut } = useSession();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { bookmarks, notes } = useAnnotationsStore();
  const colors = useColors();
  const postsListRef = useRef<ProfilePostsListRef>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch profile data
  const data = useLazyLoadQuery<profileOwnProfileQuery>(ownProfileQuery, {});

  const user = data.user;

  // Mutations
  const [commitLike] = useMutation<profileLikeReflectionMutation>(
    likeReflectionMutation
  );
  const [commitUnlike] = useMutation<profileUnlikeReflectionMutation>(
    unlikeReflectionMutation
  );
  const [commitDelete] = useMutation<profileDeleteReflectionMutation>(
    deleteReflectionMutation
  );

  const handleLike = useCallback(
    (postId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      commitLike({
        variables: { id: postId },
        optimisticUpdater: (store) => {
          const post = store.get(postId);
          if (post) {
            post.setValue(new Date().toISOString(), "likedAt");
            const currentCount = (post.getValue("likesCount") as number) ?? 0;
            post.setValue(currentCount + 1, "likesCount");
          }
        },
      });
    },
    [commitLike]
  );

  const handleUnlike = useCallback(
    (postId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      commitUnlike({
        variables: { id: postId },
        optimisticUpdater: (store) => {
          const post = store.get(postId);
          if (post) {
            post.setValue(null, "likedAt");
            const currentCount = (post.getValue("likesCount") as number) ?? 0;
            post.setValue(Math.max(0, currentCount - 1), "likesCount");
          }
        },
      });
    },
    [commitUnlike]
  );

  const handleDelete = useCallback(
    (postId: string) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      const connectionId = postsListRef.current?.connectionId;
      const connections = connectionId ? [connectionId] : [];

      commitDelete({
        variables: { id: postId, connections },
        onError: (error) => {
          console.error("Failed to delete post:", error);
        },
      });
    },
    [commitDelete]
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    postsListRef.current?.refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  const handleSignOut = async () => {
    await signOutFromGoogle();
    await signOut();
  };

  const handleEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/user-edit" as RelativePathString);
  };

  if (!user) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.textMuted}
          colors={[colors.accent]}
        />
      }
    >
      {/* Profile Header */}
      <ProfileHeader
        name={user.name}
        username={user.username}
        bio={user.bio}
        imageUrl={user.image?.url}
      >
        <Button
          variant="outline"
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Text style={[styles.editButtonText, { color: colors.text }]}>
            Edit Profile
          </Text>
        </Button>
      </ProfileHeader>

      {/* Stats Row */}
      <ProfileStatsRow
        userId={user.id}
        followerCount={user.followerCount}
        followingCount={user.followingCount}
      />

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Posts List */}
      <ProfilePostsList
        ref={postsListRef}
        userRef={user}
        currentUserId={session?.user?.id}
        onLike={handleLike}
        onUnlike={handleUnlike}
        onDelete={handleDelete}
      />

      {/* Divider before utilities */}
      <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />

      {/* Bible Utilities */}
      <BibleUtilities bookmarks={bookmarks} notes={notes} colors={colors} />

      {/* Settings */}
      <SettingsSection
        resolvedTheme={resolvedTheme}
        toggleTheme={toggleTheme}
        colors={colors}
        isAuthenticated={true}
        onSignOut={handleSignOut}
      />

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

interface BibleUtilitiesProps {
  bookmarks: Record<string, unknown>;
  notes: Record<string, unknown>;
  colors: {
    bg: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
  };
}

function BibleUtilities({ bookmarks, notes, colors }: BibleUtilitiesProps) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
        Bible
      </Text>

      <Pressable
        onPress={() => router.push("/search")}
        style={({ pressed }) => [
          styles.menuItem,
          { backgroundColor: colors.surface, borderColor: colors.border },
          styles.menuItemFirst,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <View style={styles.menuItemLeft}>
          <Search size={20} color={colors.textMuted} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>
            Search Bible
          </Text>
        </View>
        <ChevronRight size={20} color={colors.textMuted} />
      </Pressable>

      <Pressable
        onPress={() => router.push("/bookmarks")}
        style={({ pressed }) => [
          styles.menuItem,
          { backgroundColor: colors.surface, borderColor: colors.border },
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <View style={styles.menuItemLeft}>
          <Bookmark size={20} color={colors.textMuted} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>
            Bookmarks
          </Text>
        </View>
        <View style={styles.menuItemRight}>
          <Text style={[styles.menuItemCount, { color: colors.textMuted }]}>
            {Object.keys(bookmarks).length}
          </Text>
          <ChevronRight size={20} color={colors.textMuted} />
        </View>
      </Pressable>

      <Pressable
        onPress={() => router.push("/notes")}
        style={({ pressed }) => [
          styles.menuItem,
          { backgroundColor: colors.surface, borderColor: colors.border },
          styles.menuItemLast,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <View style={styles.menuItemLeft}>
          <FileText size={20} color={colors.textMuted} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>
            Notes
          </Text>
        </View>
        <View style={styles.menuItemRight}>
          <Text style={[styles.menuItemCount, { color: colors.textMuted }]}>
            {Object.keys(notes).length}
          </Text>
          <ChevronRight size={20} color={colors.textMuted} />
        </View>
      </Pressable>
    </View>
  );
}

interface SettingsSectionProps {
  resolvedTheme: string;
  toggleTheme: () => void;
  colors: {
    bg: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
  };
  isAuthenticated: boolean;
  onSignOut: () => void;
}

function SettingsSection({
  resolvedTheme,
  toggleTheme,
  colors,
  isAuthenticated,
  onSignOut,
}: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
        Settings
      </Text>

      <Pressable
        onPress={toggleTheme}
        style={({ pressed }) => [
          styles.menuItem,
          { backgroundColor: colors.surface, borderColor: colors.border },
          styles.menuItemFirst,
          !isAuthenticated && styles.menuItemLast,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text style={[styles.menuItemText, { color: colors.text }]}>
          Switch to {resolvedTheme === "light" ? "Dark" : "Light"} Mode
        </Text>
        <ChevronRight size={20} color={colors.textMuted} />
      </Pressable>

      {isAuthenticated && (
        <Pressable
          onPress={onSignOut}
          style={({ pressed }) => [
            styles.menuItem,
            { backgroundColor: colors.surface, borderColor: colors.border },
            styles.menuItemLast,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.signOutText]}>Sign Out</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  // Welcome section for unauthenticated
  welcomeContainer: {
    alignItems: "center",
    padding: 24,
  },
  welcomeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  welcomeEmoji: {
    fontSize: 32,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  signInButton: {
    width: "100%",
    maxWidth: 280,
  },
  signInButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  // Edit button
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  // Dividers
  divider: {
    height: StyleSheet.hairlineWidth,
    marginTop: 8,
  },
  sectionDivider: {
    height: 8,
    marginTop: 16,
  },
  // Sections
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "500",
    paddingHorizontal: 16,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Menu items
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuItemFirst: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  menuItemLast: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuItemText: {
    fontSize: 16,
  },
  menuItemCount: {
    fontSize: 15,
  },
  signOutText: {
    fontSize: 16,
    color: "#dc2626",
  },
  // Bottom padding
  bottomPadding: {
    height: 32,
  },
});
