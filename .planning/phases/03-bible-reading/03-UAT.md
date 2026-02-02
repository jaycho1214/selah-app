---
status: diagnosed
phase: 03-bible-reading
source: [03-01-SUMMARY.md, 03-02-SUMMARY.md, 03-03-SUMMARY.md, 03-04-SUMMARY.md, 03-05-SUMMARY.md, 03-06-SUMMARY.md, 03-07-SUMMARY.md, 03-08-SUMMARY.md, 03-09-SUMMARY.md]
started: 2026-02-02T07:10:00Z
updated: 2026-02-02T07:20:00Z
---

## Current Test

[testing paused - fixing blockers]

## Tests

### 1. Continue Reading card navigates to Bible
expected: From the Home tab, tap the "Continue Reading" card. Should navigate to `/bible/[book]/[chapter]` route showing Bible text.
result: issue
reported: "Design must be the same as web one. First page should list Bible verses with navigator right above the bottom tab navigator."
severity: major

### 2. Bible chapter displays verses
expected: Bible chapter screen shows verses with verse numbers aligned left and text flowing to the right. Scrolling works smoothly through long chapters.
result: issue
reported: "SQLite error: no such table: translations. Drizzle migrations not run. Also wants scroll edge animation (bulge effect from edge on scroll)."
severity: blocker

### 3. Swipe navigation between chapters
expected: Swipe left to go to next chapter, swipe right to go to previous chapter. Navigation should be smooth 60fps animation.
result: [pending]

### 4. Book/chapter navigator modal
expected: Tap the header title (e.g., "Genesis 1"). A modal opens showing book list divided by Old/New Testament. Select a book and chapter to navigate there.
result: [pending]

### 5. Highlight a verse with color
expected: Tap any verse. A bottom sheet opens with 5 color options (yellow, green, blue, pink, orange). Select a color and the verse background tints to that color.
result: [pending]

### 6. Remove a highlight
expected: Tap a highlighted verse. The bottom sheet shows the current color selected with checkmark. Either tap the X button or tap the same color to remove the highlight.
result: [pending]

### 7. Bookmark a verse
expected: Tap a verse to open actions. Tap "Bookmark" button. The verse should show a bookmark indicator. Button text should change to "Remove Bookmark".
result: [pending]

### 8. View bookmarks list
expected: From Home tab, tap "Bookmarks" card. Screen shows list of saved bookmarks with verse reference (e.g., "Genesis 1:1"), text preview, and date. Shows empty state if no bookmarks.
result: [pending]

### 9. Navigate from bookmark to verse
expected: In bookmarks list, tap a bookmark. Should navigate to the Bible chapter containing that verse.
result: [pending]

### 10. Delete a bookmark from list
expected: In bookmarks list, tap the trash icon on a bookmark. It should be removed from the list.
result: [pending]

### 11. Add a note to a verse
expected: Tap a verse, then tap "Add Note" in the bottom sheet. A modal opens with verse reference at top and text input. Type a note and tap Save. Modal closes.
result: [pending]

### 12. View notes list
expected: From Home tab, tap "Notes" card. Screen shows list of saved notes with verse reference, note preview, and date. Shows empty state if no notes.
result: [pending]

### 13. Edit an existing note
expected: In notes list, tap a note. The note editor opens with the existing content. Edit and save. Changes should persist.
result: [pending]

### 14. Delete a note
expected: Either in the notes list (tap trash icon) or in the note editor (tap "Delete Note" button at bottom). Note should be removed.
result: [pending]

### 15. Search Bible for keyword
expected: From Home tab, tap "Search Bible" card OR tap search icon in Bible reader header. Enter at least 3 characters and submit. Results show matching verses with reference and text preview.
result: [pending]

### 16. Navigate from search result
expected: Tap a search result. Should navigate to the Bible chapter containing that verse.
result: [pending]

### 17. Change font size
expected: In Bible reader, tap gear icon in header. Settings sheet opens with "Font Size" tab. Select Small/Medium/Large. Verse text size changes immediately and preview shows new size.
result: [pending]

### 18. Font size persists
expected: Change font size, close app completely, reopen. Go to Bible reader - font size should still be the same setting.
result: [pending]

### 19. Translation picker shows available translations
expected: In settings sheet, tap "Translation" tab. Shows list of available translations with their names. Current translation has checkmark indicator.
result: [pending]

### 20. Switch translation
expected: In translation picker, tap a different translation. Bible text reloads showing verses in the new translation. Header subtitle updates to show new translation.
result: [pending]

## Summary

total: 20
passed: 0
issues: 2
pending: 18
skipped: 0

## Gaps

- truth: "Home tab shows Bible verses directly with navigator above tab bar (matching web design)"
  status: failed
  reason: "User reported: Design must be the same as web one. First page should list Bible verses with navigator right above the bottom tab navigator."
  severity: major
  test: 1
  root_cause: "Mobile app created hub-style home with cards linking to features. Web app (page.tsx) shows BibleReadingPage directly with BibleNavigator sticky at top and BibleVerseList below. Need to embed BibleReader directly on home tab."
  artifacts:
    - path: "app/(tabs)/index.tsx"
      issue: "Shows cards (Continue Reading, Search, Bookmarks, Notes) instead of Bible verses"
    - path: "/Users/jay/Codes/selah/selah-web/src/app/page.tsx"
      issue: "Reference - web shows BibleReadingPage directly"
  missing:
    - "Embed BibleReader component on home tab"
    - "Position BibleNavigator above bottom tab bar"
    - "Move utility cards (Search, Bookmarks, Notes) to profile tab or settings"
  debug_session: ""

- truth: "SQLite database tables exist and can be queried"
  status: failed
  reason: "User reported: SQLite error 'no such table: translations'. Drizzle migrations not run. Also requested scroll edge animation (bulge effect)."
  severity: blocker
  test: 2
  root_cause: "Drizzle schema defined in lib/db/schema.ts but migrations never run to create tables. With expo-sqlite + Drizzle, need to use useMigrations hook or run CREATE TABLE statements on app startup."
  artifacts:
    - path: "lib/db/client.ts"
      issue: "Opens database but doesn't run migrations"
    - path: "lib/db/schema.ts"
      issue: "Schema defined but tables never created in SQLite"
  missing:
    - "Add Drizzle migration runner on app startup (useMigrations hook)"
    - "Generate migration files with drizzle-kit generate"
    - "Optional: Add scroll edge animation (overscroll effect)"
  debug_session: ""
