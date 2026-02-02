import { BibleBook, BibleBookDetail } from './types';

/**
 * Ordered array of all Bible books in canonical order (Genesis to Revelation).
 * Use this for navigation UI - NOT alphabetical order.
 */
export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament (39 books)
  BibleBook.GENESIS,
  BibleBook.EXODUS,
  BibleBook.LEVITICUS,
  BibleBook.NUMBERS,
  BibleBook.DEUTERONOMY,
  BibleBook.JOSHUA,
  BibleBook.JUDGES,
  BibleBook.RUTH,
  BibleBook.FIRST_SAMUEL,
  BibleBook.SECOND_SAMUEL,
  BibleBook.FIRST_KINGS,
  BibleBook.SECOND_KINGS,
  BibleBook.FIRST_CHRONICLES,
  BibleBook.SECOND_CHRONICLES,
  BibleBook.EZRA,
  BibleBook.NEHEMIAH,
  BibleBook.ESTHER,
  BibleBook.JOB,
  BibleBook.PSALMS,
  BibleBook.PROVERBS,
  BibleBook.ECCLESIASTES,
  BibleBook.SONG_OF_SONGS,
  BibleBook.ISAIAH,
  BibleBook.JEREMIAH,
  BibleBook.LAMENTATIONS,
  BibleBook.EZEKIEL,
  BibleBook.DANIEL,
  BibleBook.HOSEA,
  BibleBook.JOEL,
  BibleBook.AMOS,
  BibleBook.OBADIAH,
  BibleBook.JONAH,
  BibleBook.MICAH,
  BibleBook.NAHUM,
  BibleBook.HABAKKUK,
  BibleBook.ZEPHANIAH,
  BibleBook.HAGGAI,
  BibleBook.ZECHARIAH,
  BibleBook.MALACHI,
  // New Testament (27 books)
  BibleBook.MATTHEW,
  BibleBook.MARK,
  BibleBook.LUKE,
  BibleBook.JOHN,
  BibleBook.ACTS,
  BibleBook.ROMANS,
  BibleBook.FIRST_CORINTHIANS,
  BibleBook.SECOND_CORINTHIANS,
  BibleBook.GALATIANS,
  BibleBook.EPHESIANS,
  BibleBook.PHILIPPIANS,
  BibleBook.COLOSSIANS,
  BibleBook.FIRST_THESSALONIANS,
  BibleBook.SECOND_THESSALONIANS,
  BibleBook.FIRST_TIMOTHY,
  BibleBook.SECOND_TIMOTHY,
  BibleBook.TITUS,
  BibleBook.PHILEMON,
  BibleBook.HEBREWS,
  BibleBook.JAMES,
  BibleBook.FIRST_PETER,
  BibleBook.SECOND_PETER,
  BibleBook.FIRST_JOHN,
  BibleBook.SECOND_JOHN,
  BibleBook.THIRD_JOHN,
  BibleBook.JUDE,
  BibleBook.REVELATION,
];

/**
 * Detailed metadata for each Bible book.
 * Includes display names, abbreviations, chapter counts, and testament.
 * Chapter counts are accurate for standard Protestant canon.
 */
export const BIBLE_BOOK_DETAILS: Record<BibleBook, BibleBookDetail> = {
  // Old Testament - Pentateuch
  [BibleBook.GENESIS]: { name: 'Genesis', shortName: 'Gen', chapters: 50, testament: 'old' },
  [BibleBook.EXODUS]: { name: 'Exodus', shortName: 'Exod', chapters: 40, testament: 'old' },
  [BibleBook.LEVITICUS]: { name: 'Leviticus', shortName: 'Lev', chapters: 27, testament: 'old' },
  [BibleBook.NUMBERS]: { name: 'Numbers', shortName: 'Num', chapters: 36, testament: 'old' },
  [BibleBook.DEUTERONOMY]: { name: 'Deuteronomy', shortName: 'Deut', chapters: 34, testament: 'old' },
  // Old Testament - Historical
  [BibleBook.JOSHUA]: { name: 'Joshua', shortName: 'Josh', chapters: 24, testament: 'old' },
  [BibleBook.JUDGES]: { name: 'Judges', shortName: 'Judg', chapters: 21, testament: 'old' },
  [BibleBook.RUTH]: { name: 'Ruth', shortName: 'Ruth', chapters: 4, testament: 'old' },
  [BibleBook.FIRST_SAMUEL]: { name: '1 Samuel', shortName: '1 Sam', chapters: 31, testament: 'old' },
  [BibleBook.SECOND_SAMUEL]: { name: '2 Samuel', shortName: '2 Sam', chapters: 24, testament: 'old' },
  [BibleBook.FIRST_KINGS]: { name: '1 Kings', shortName: '1 Kgs', chapters: 22, testament: 'old' },
  [BibleBook.SECOND_KINGS]: { name: '2 Kings', shortName: '2 Kgs', chapters: 25, testament: 'old' },
  [BibleBook.FIRST_CHRONICLES]: { name: '1 Chronicles', shortName: '1 Chr', chapters: 29, testament: 'old' },
  [BibleBook.SECOND_CHRONICLES]: { name: '2 Chronicles', shortName: '2 Chr', chapters: 36, testament: 'old' },
  [BibleBook.EZRA]: { name: 'Ezra', shortName: 'Ezra', chapters: 10, testament: 'old' },
  [BibleBook.NEHEMIAH]: { name: 'Nehemiah', shortName: 'Neh', chapters: 13, testament: 'old' },
  [BibleBook.ESTHER]: { name: 'Esther', shortName: 'Esth', chapters: 10, testament: 'old' },
  // Old Testament - Wisdom/Poetry
  [BibleBook.JOB]: { name: 'Job', shortName: 'Job', chapters: 42, testament: 'old' },
  [BibleBook.PSALMS]: { name: 'Psalms', shortName: 'Ps', chapters: 150, testament: 'old' },
  [BibleBook.PROVERBS]: { name: 'Proverbs', shortName: 'Prov', chapters: 31, testament: 'old' },
  [BibleBook.ECCLESIASTES]: { name: 'Ecclesiastes', shortName: 'Eccl', chapters: 12, testament: 'old' },
  [BibleBook.SONG_OF_SONGS]: { name: 'Song of Songs', shortName: 'Song', chapters: 8, testament: 'old' },
  // Old Testament - Major Prophets
  [BibleBook.ISAIAH]: { name: 'Isaiah', shortName: 'Isa', chapters: 66, testament: 'old' },
  [BibleBook.JEREMIAH]: { name: 'Jeremiah', shortName: 'Jer', chapters: 52, testament: 'old' },
  [BibleBook.LAMENTATIONS]: { name: 'Lamentations', shortName: 'Lam', chapters: 5, testament: 'old' },
  [BibleBook.EZEKIEL]: { name: 'Ezekiel', shortName: 'Ezek', chapters: 48, testament: 'old' },
  [BibleBook.DANIEL]: { name: 'Daniel', shortName: 'Dan', chapters: 12, testament: 'old' },
  // Old Testament - Minor Prophets
  [BibleBook.HOSEA]: { name: 'Hosea', shortName: 'Hos', chapters: 14, testament: 'old' },
  [BibleBook.JOEL]: { name: 'Joel', shortName: 'Joel', chapters: 3, testament: 'old' },
  [BibleBook.AMOS]: { name: 'Amos', shortName: 'Amos', chapters: 9, testament: 'old' },
  [BibleBook.OBADIAH]: { name: 'Obadiah', shortName: 'Obad', chapters: 1, testament: 'old' },
  [BibleBook.JONAH]: { name: 'Jonah', shortName: 'Jonah', chapters: 4, testament: 'old' },
  [BibleBook.MICAH]: { name: 'Micah', shortName: 'Mic', chapters: 7, testament: 'old' },
  [BibleBook.NAHUM]: { name: 'Nahum', shortName: 'Nah', chapters: 3, testament: 'old' },
  [BibleBook.HABAKKUK]: { name: 'Habakkuk', shortName: 'Hab', chapters: 3, testament: 'old' },
  [BibleBook.ZEPHANIAH]: { name: 'Zephaniah', shortName: 'Zeph', chapters: 3, testament: 'old' },
  [BibleBook.HAGGAI]: { name: 'Haggai', shortName: 'Hag', chapters: 2, testament: 'old' },
  [BibleBook.ZECHARIAH]: { name: 'Zechariah', shortName: 'Zech', chapters: 14, testament: 'old' },
  [BibleBook.MALACHI]: { name: 'Malachi', shortName: 'Mal', chapters: 4, testament: 'old' },
  // New Testament - Gospels
  [BibleBook.MATTHEW]: { name: 'Matthew', shortName: 'Matt', chapters: 28, testament: 'new' },
  [BibleBook.MARK]: { name: 'Mark', shortName: 'Mark', chapters: 16, testament: 'new' },
  [BibleBook.LUKE]: { name: 'Luke', shortName: 'Luke', chapters: 24, testament: 'new' },
  [BibleBook.JOHN]: { name: 'John', shortName: 'John', chapters: 21, testament: 'new' },
  // New Testament - History
  [BibleBook.ACTS]: { name: 'Acts', shortName: 'Acts', chapters: 28, testament: 'new' },
  // New Testament - Pauline Epistles
  [BibleBook.ROMANS]: { name: 'Romans', shortName: 'Rom', chapters: 16, testament: 'new' },
  [BibleBook.FIRST_CORINTHIANS]: { name: '1 Corinthians', shortName: '1 Cor', chapters: 16, testament: 'new' },
  [BibleBook.SECOND_CORINTHIANS]: { name: '2 Corinthians', shortName: '2 Cor', chapters: 13, testament: 'new' },
  [BibleBook.GALATIANS]: { name: 'Galatians', shortName: 'Gal', chapters: 6, testament: 'new' },
  [BibleBook.EPHESIANS]: { name: 'Ephesians', shortName: 'Eph', chapters: 6, testament: 'new' },
  [BibleBook.PHILIPPIANS]: { name: 'Philippians', shortName: 'Phil', chapters: 4, testament: 'new' },
  [BibleBook.COLOSSIANS]: { name: 'Colossians', shortName: 'Col', chapters: 4, testament: 'new' },
  [BibleBook.FIRST_THESSALONIANS]: { name: '1 Thessalonians', shortName: '1 Thess', chapters: 5, testament: 'new' },
  [BibleBook.SECOND_THESSALONIANS]: { name: '2 Thessalonians', shortName: '2 Thess', chapters: 3, testament: 'new' },
  [BibleBook.FIRST_TIMOTHY]: { name: '1 Timothy', shortName: '1 Tim', chapters: 6, testament: 'new' },
  [BibleBook.SECOND_TIMOTHY]: { name: '2 Timothy', shortName: '2 Tim', chapters: 4, testament: 'new' },
  [BibleBook.TITUS]: { name: 'Titus', shortName: 'Titus', chapters: 3, testament: 'new' },
  [BibleBook.PHILEMON]: { name: 'Philemon', shortName: 'Phlm', chapters: 1, testament: 'new' },
  // New Testament - General Epistles
  [BibleBook.HEBREWS]: { name: 'Hebrews', shortName: 'Heb', chapters: 13, testament: 'new' },
  [BibleBook.JAMES]: { name: 'James', shortName: 'Jas', chapters: 5, testament: 'new' },
  [BibleBook.FIRST_PETER]: { name: '1 Peter', shortName: '1 Pet', chapters: 5, testament: 'new' },
  [BibleBook.SECOND_PETER]: { name: '2 Peter', shortName: '2 Pet', chapters: 3, testament: 'new' },
  [BibleBook.FIRST_JOHN]: { name: '1 John', shortName: '1 John', chapters: 5, testament: 'new' },
  [BibleBook.SECOND_JOHN]: { name: '2 John', shortName: '2 John', chapters: 1, testament: 'new' },
  [BibleBook.THIRD_JOHN]: { name: '3 John', shortName: '3 John', chapters: 1, testament: 'new' },
  [BibleBook.JUDE]: { name: 'Jude', shortName: 'Jude', chapters: 1, testament: 'new' },
  // New Testament - Prophecy
  [BibleBook.REVELATION]: { name: 'Revelation', shortName: 'Rev', chapters: 22, testament: 'new' },
};

/**
 * Available Bible translations with display names.
 * These are public domain translations that can be downloaded for offline use.
 */
export const TRANSLATIONS = [
  { id: 'KJV', name: 'King James Version' },
  { id: 'ASV', name: 'American Standard Version' },
  { id: 'WEB', name: 'World English Bible' },
] as const;

/**
 * Highlight colors available for verse highlighting.
 */
export const HIGHLIGHT_COLORS = [
  { id: 'yellow', name: 'Yellow', hex: '#FEF08A' },
  { id: 'green', name: 'Green', hex: '#BBF7D0' },
  { id: 'blue', name: 'Blue', hex: '#BFDBFE' },
  { id: 'pink', name: 'Pink', hex: '#FBCFE8' },
  { id: 'purple', name: 'Purple', hex: '#DDD6FE' },
] as const;

/**
 * Get the total number of chapters in the Bible.
 */
export function getTotalChapters(): number {
  return Object.values(BIBLE_BOOK_DETAILS).reduce((sum, book) => sum + book.chapters, 0);
}

/**
 * Get books filtered by testament.
 */
export function getBooksByTestament(testament: 'old' | 'new'): BibleBook[] {
  return BIBLE_BOOKS.filter((book) => BIBLE_BOOK_DETAILS[book].testament === testament);
}
