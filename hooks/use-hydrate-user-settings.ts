import { useEffect } from "react";
import { graphql, fetchQuery } from "relay-runtime";
import { useRelayEnvironment } from "react-relay";
import { useSession } from "@/components/providers/session-provider";
import { useVerseHighlightStore } from "@/lib/stores/verse-highlight-store";
import type { useHydrateUserSettingsQuery } from "@/lib/relay/__generated__/useHydrateUserSettingsQuery.graphql";

const hydrateQuery = graphql`
  query useHydrateUserSettingsQuery {
    userSettings {
      bible {
        verseHighlight {
          enabled
          color
        }
      }
    }
  }
`;

export function useHydrateUserSettings() {
  const environment = useRelayEnvironment();
  const { isAuthenticated } = useSession();
  const hydrate = useVerseHighlightStore((s) => s.hydrate);

  useEffect(() => {
    if (!isAuthenticated) return;

    const sub = fetchQuery<useHydrateUserSettingsQuery>(
      environment,
      hydrateQuery,
      {},
    ).subscribe({
      next: (data) => {
        const vh = data.userSettings?.bible?.verseHighlight;
        if (vh) {
          hydrate(vh.enabled ?? true, vh.color ?? "#fef08a");
        }
      },
    });

    return () => sub.unsubscribe();
  }, [environment, isAuthenticated, hydrate]);
}
