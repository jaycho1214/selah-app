import { useCallback, useMemo } from "react";
import { usePostHogClient } from "@/components/providers/posthog-provider";

// ─── Event property types ────────────────────────────────────────────

type PostCreatedProps = {
  post_id: string;
  has_images: boolean;
  has_poll: boolean;
  is_reply: boolean;
};

type PostIdProps = { post_id: string };

type PostSharedProps = { post_id: string; method: string };

type PostReportedProps = {
  post_id: string;
  reason: string;
};

type UserTargetProps = { target_user_id: string };

type UserReportedProps = {
  target_user_id: string;
  reason: string;
};

type ChapterViewedProps = {
  book: string;
  chapter: number;
  translation?: string;
};

type VerseSelectedProps = { verse_id: string };

type BibleSearchProps = {
  query: string;
  translation?: string;
};

type SignInProps = { provider: "google" | "apple" };

type ProfileEditedProps = {
  fields_updated: string[];
};

type ProfileSharedProps = { username: string };

type PollVotedProps = {
  post_id: string;
  option_id: string;
};

type PollUnvotedProps = { post_id: string };

// ─── Event map ───────────────────────────────────────────────────────

type AnalyticsEventMap = {
  // Posts
  post_created: PostCreatedProps;
  post_liked: PostIdProps;
  post_unliked: PostIdProps;
  post_deleted: PostIdProps;
  post_shared: PostSharedProps;
  post_reported: PostReportedProps;

  // Social
  user_followed: UserTargetProps;
  user_unfollowed: UserTargetProps;
  user_blocked: UserTargetProps;
  user_unblocked: UserTargetProps;
  user_reported: UserReportedProps;

  // Bible
  chapter_viewed: ChapterViewedProps;
  verse_selected: VerseSelectedProps;
  bible_search: BibleSearchProps;

  // Auth
  sign_in: SignInProps;
  sign_out: Record<string, never>;
  account_deleted: Record<string, never>;

  // Profile
  profile_edited: ProfileEditedProps;
  profile_shared: ProfileSharedProps;

  // Polls
  poll_voted: PollVotedProps;
  poll_unvoted: PollUnvotedProps;
};

// ─── Hook ────────────────────────────────────────────────────────────

export function useAnalytics() {
  const posthog = usePostHogClient();

  const capture = useCallback(
    <E extends keyof AnalyticsEventMap>(
      event: E,
      properties: AnalyticsEventMap[E],
    ) => {
      posthog?.capture(event, properties);
    },
    [posthog],
  );

  return useMemo(() => ({ capture }), [capture]);
}
