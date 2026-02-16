import { memo, useCallback, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Calendar, Users } from "lucide-react-native";
import { graphql, useFragment } from "react-relay";

import { Text } from "@/components/ui/text";
import { UserAvatar } from "@/components/user/user-avatar";
import { useColors } from "@/hooks/use-colors";
import type { ReadingPlanCardFragment$key } from "@/lib/relay/__generated__/ReadingPlanCardFragment.graphql";

const fragment = graphql`
  fragment ReadingPlanCardFragment on ReadingPlan {
    id
    title
    description
    dayCount
    participantCount
    isFeatured
    status
    author {
      id
      name
      username
      image {
        url
      }
    }
  }
`;

interface ReadingPlanCardProps {
  dataKey: ReadingPlanCardFragment$key;
}

export const ReadingPlanCard = memo(function ReadingPlanCard({
  dataKey,
}: ReadingPlanCardProps) {
  const data = useFragment(fragment, dataKey);
  const colors = useColors();
  const router = useRouter();

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/reading-plans/${data.id}`);
  }, [data.id, router]);

  const dynamicStyles = useMemo(
    () => ({
      card: {
        backgroundColor: colors.card,
        borderColor: colors.border,
      },
      featuredBadge: {
        backgroundColor: colors.accent + "18",
      },
      featuredText: {
        color: colors.accent,
      },
    }),
    [colors],
  );

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.card, dynamicStyles.card]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
          >
            {data.title}
          </Text>
          {data.isFeatured && (
            <View style={[styles.badge, dynamicStyles.featuredBadge]}>
              <Text style={[styles.badgeText, dynamicStyles.featuredText]}>
                Featured
              </Text>
            </View>
          )}
        </View>
        {data.description && (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {data.description}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.authorRow}>
          <UserAvatar
            imageUrl={data.author.image?.url}
            name={data.author.name}
            size={20}
          />
          <Text style={[styles.authorName, { color: colors.textMuted }]}>
            {data.author.name || data.author.username}
          </Text>
        </View>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Calendar size={12} color={colors.textMuted} />
            <Text style={[styles.statText, { color: colors.textMuted }]}>
              {data.dayCount}
            </Text>
          </View>
          <View style={styles.stat}>
            <Users size={12} color={colors.textMuted} />
            <Text style={[styles.statText, { color: colors.textMuted }]}>
              {data.participantCount}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  header: {
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  authorName: {
    fontSize: 12,
    fontWeight: "500",
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  statText: {
    fontSize: 12,
  },
});
