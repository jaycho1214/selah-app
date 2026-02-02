/**
 * BibleBook enum - must match backend exactly (66 books).
 * Values are uppercase with underscores for numbered books.
 * Ported from selah-web/src/server/db-types.ts
 */
export enum BibleBook {
  // Old Testament
  GENESIS = 'GENESIS',
  EXODUS = 'EXODUS',
  LEVITICUS = 'LEVITICUS',
  NUMBERS = 'NUMBERS',
  DEUTERONOMY = 'DEUTERONOMY',
  JOSHUA = 'JOSHUA',
  JUDGES = 'JUDGES',
  RUTH = 'RUTH',
  FIRST_SAMUEL = 'FIRST_SAMUEL',
  SECOND_SAMUEL = 'SECOND_SAMUEL',
  FIRST_KINGS = 'FIRST_KINGS',
  SECOND_KINGS = 'SECOND_KINGS',
  FIRST_CHRONICLES = 'FIRST_CHRONICLES',
  SECOND_CHRONICLES = 'SECOND_CHRONICLES',
  EZRA = 'EZRA',
  NEHEMIAH = 'NEHEMIAH',
  ESTHER = 'ESTHER',
  JOB = 'JOB',
  PSALMS = 'PSALMS',
  PROVERBS = 'PROVERBS',
  ECCLESIASTES = 'ECCLESIASTES',
  SONG_OF_SONGS = 'SONG_OF_SONGS',
  ISAIAH = 'ISAIAH',
  JEREMIAH = 'JEREMIAH',
  LAMENTATIONS = 'LAMENTATIONS',
  EZEKIEL = 'EZEKIEL',
  DANIEL = 'DANIEL',
  HOSEA = 'HOSEA',
  JOEL = 'JOEL',
  AMOS = 'AMOS',
  OBADIAH = 'OBADIAH',
  JONAH = 'JONAH',
  MICAH = 'MICAH',
  NAHUM = 'NAHUM',
  HABAKKUK = 'HABAKKUK',
  ZEPHANIAH = 'ZEPHANIAH',
  HAGGAI = 'HAGGAI',
  ZECHARIAH = 'ZECHARIAH',
  MALACHI = 'MALACHI',
  // New Testament
  MATTHEW = 'MATTHEW',
  MARK = 'MARK',
  LUKE = 'LUKE',
  JOHN = 'JOHN',
  ACTS = 'ACTS',
  ROMANS = 'ROMANS',
  FIRST_CORINTHIANS = 'FIRST_CORINTHIANS',
  SECOND_CORINTHIANS = 'SECOND_CORINTHIANS',
  GALATIANS = 'GALATIANS',
  EPHESIANS = 'EPHESIANS',
  PHILIPPIANS = 'PHILIPPIANS',
  COLOSSIANS = 'COLOSSIANS',
  FIRST_THESSALONIANS = 'FIRST_THESSALONIANS',
  SECOND_THESSALONIANS = 'SECOND_THESSALONIANS',
  FIRST_TIMOTHY = 'FIRST_TIMOTHY',
  SECOND_TIMOTHY = 'SECOND_TIMOTHY',
  TITUS = 'TITUS',
  PHILEMON = 'PHILEMON',
  HEBREWS = 'HEBREWS',
  JAMES = 'JAMES',
  FIRST_PETER = 'FIRST_PETER',
  SECOND_PETER = 'SECOND_PETER',
  FIRST_JOHN = 'FIRST_JOHN',
  SECOND_JOHN = 'SECOND_JOHN',
  THIRD_JOHN = 'THIRD_JOHN',
  JUDE = 'JUDE',
  REVELATION = 'REVELATION',
}

/**
 * Supported Bible translations.
 * These are public domain translations available for offline download.
 */
export type BibleTranslation = 'KJV' | 'ASV' | 'WEB';

/**
 * A Bible verse with its text and location.
 */
export interface BibleVerse {
  /** Composite ID: "{translationId}:{book}:{chapter}:{verse}" */
  id: string;
  /** Book enum value */
  book: BibleBook;
  /** Chapter number (1-indexed) */
  chapter: number;
  /** Verse number (1-indexed) */
  verse: number;
  /** The verse text content */
  text: string;
  /** Translation code: 'KJV', 'ASV', 'WEB' */
  translationId: string;
}

/**
 * Metadata about a Bible book for navigation and display.
 */
export interface BibleBookDetail {
  /** Display name: 'Genesis' */
  name: string;
  /** Abbreviated name: 'Gen' */
  shortName: string;
  /** Number of chapters in this book */
  chapters: number;
  /** Old or New Testament */
  testament: 'old' | 'new';
}

/**
 * A verse reference for navigation.
 */
export interface BibleReference {
  book: BibleBook;
  chapter: number;
  verse?: number;
  translationId?: BibleTranslation;
}
