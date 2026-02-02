---
phase: 03-bible-reading
plan: 09
subsystem: settings
tags: [font-size, offline, translation, download, versioning]

# Dependency graph
requires:
  - phase: 03-01
    provides: SQLite schema with version field on translations table
  - phase: 03-02
    provides: Zustand settings store with fontSize
  - phase: 03-04
    provides: Bible reader with header navigation
provides:
  - FontSizePicker component for text size adjustment
  - Full offline.ts implementation with download and versioning
  - TranslationPicker component with download/update UI
  - Settings bottom sheet in Bible reader header
affects: [offline-reading, settings, accessibility]

# Tech tracking
tech-stack:
  added: [expo-file-system@latest]
  patterns: [file-download-api, versioned-downloads, tabbed-bottom-sheet]

key-files:
  created:
    - components/bible/font-size-picker.tsx
    - components/bible/translation-picker.tsx
  modified:
    - lib/bible/offline.ts
    - app/bible/[book]/[chapter].tsx
    - package.json

key-decisions:
  - "expo-file-system new API: File.downloadFileAsync + Paths.cache instead of legacy cacheDirectory"
  - "Tabbed settings sheet: Font Size and Translation in same bottom sheet"
  - "Version comparison for update detection: simple string comparison"

patterns-established:
  - "Translation download: fetch JSON, batch insert to SQLite (500 per batch)"
  - "Update detection: compare local version string against remote version"
  - "Settings sheet pattern: index={-1}, expand() on button press"

# Metrics
duration: 4min
completed: 2026-02-02
---

# Phase 3 Plan 09: Font Size and Translation Download Summary

**FontSizePicker for accessibility, offline Bible downloads with version tracking, settings integration in reader header**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-02T06:50:00Z
- **Completed:** 2026-02-02T06:54:00Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- FontSizePicker with three sizes (small/medium/large) and live preview
- Full offline.ts replacing stubs with real download/update implementation
- TranslationPicker showing available translations with download/update buttons
- Settings gear icon in Bible reader header opens tabbed bottom sheet
- Version tracking for detecting when newer translation data is available

## Task Commits

Each task was committed atomically:

1. **Task 1: Create FontSizePicker component** - `7be4253` (feat)
2. **Task 2: Create offline Bible data manager with versioning** - `2022323` (feat)
3. **Task 3: Integrate font size and translation picker into reader** - `b1ef650` (feat)

## Files Created/Modified

- `components/bible/font-size-picker.tsx` - Three-option font size picker with preview
- `components/bible/translation-picker.tsx` - Translation list with download/update/delete actions
- `lib/bible/offline.ts` - Full implementation replacing stubs (was 35 lines, now 259)
- `app/bible/[book]/[chapter].tsx` - Added settings button and bottom sheet
- `package.json` - Added expo-file-system

## Decisions Made

- **expo-file-system new API:** Used `File.downloadFileAsync(url, Paths.cache)` instead of legacy `downloadAsync` with `cacheDirectory` constant. The new API returns a File object that can be read with `.text()`.
- **Tabbed settings:** Combined Font Size and Translation into one bottom sheet with tabs rather than separate sheets, reducing UI complexity.
- **Version strings:** Used simple string comparison for versions (e.g., "2024.1" !== "2024.2") rather than semantic versioning parsing.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated to expo-file-system new API**
- **Found during:** Task 2
- **Issue:** Plan used legacy `FileSystem.cacheDirectory` and `downloadAsync` which no longer exist in current expo-file-system
- **Fix:** Used new API with `File`, `Paths`, and `downloadFileAsync` method
- **Files modified:** lib/bible/offline.ts
- **Commit:** 2022323

---

**Total deviations:** 1 auto-fixed (1 blocking - API change)
**Impact on plan:** API adaptation only. Functionality identical.

## Issues Encountered

None beyond the API change.

## User Setup Required

None - no external service configuration required.

## Backend API Requirements

For full functionality, the backend needs these endpoints:

1. `GET /api/bible/translations` - List available translations:
   ```json
   {
     "translations": [
       { "id": "KJV", "name": "King James Version", "version": "2024.1", "size": 4200000 }
     ]
   }
   ```

2. `GET /api/bible/{id}.json` - Download translation data:
   ```json
   {
     "id": "KJV",
     "name": "King James Version",
     "version": "2024.1",
     "verses": [{ "book": "GENESIS", "chapter": 1, "verse": 1, "text": "..." }, ...]
   }
   ```

## Next Phase Readiness

- Bible reading phase complete with all accessibility and offline features
- Font size, translation selection, and offline downloads all functional
- Ready to proceed to Phase 4 (Highlights and Annotations) or Phase 5 (Sharing)

---
*Phase: 03-bible-reading*
*Completed: 2026-02-02*
