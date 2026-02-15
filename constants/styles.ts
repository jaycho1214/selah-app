import { StyleSheet } from "react-native";

/**
 * Common reusable styles used across the app.
 * Use these instead of duplicating the same styles in every component.
 */
export const CommonStyles = StyleSheet.create({
  // Layout
  flex1: { flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowStart: { flexDirection: "row", alignItems: "flex-start" },

  // PagerView pages (use width/height, NOT flex: 1)
  page: { width: "100%", height: "100%" },

  // Divider
  hairline: { height: StyleSheet.hairlineWidth },

  // Empty state card (shared across profile, posts, notifications screens)
  emptyCard: {
    alignItems: "center",
    padding: 36,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 260,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
  },

  // CTA button (shared across sign-in empty states)
  ctaButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  // Screen header
  screenHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  screenHeaderTitle: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },

  // Section (used in settings)
  sectionTitle: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 8,
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Loading indicator (list footer)
  loadingMore: {
    paddingVertical: 20,
    alignItems: "center",
  },

  // Modal overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Bottom padding spacer
  bottomPadding: { height: 40 },
});
