import { BibleBook } from "./types";
import { BIBLE_BOOK_DETAILS } from "./constants";

export interface ParsedReference {
  book: BibleBook;
  bookName: string;
  chapter: number;
  verse?: number;
}

// Build alias map at module init
const aliasMap = new Map<string, BibleBook>();

for (const [enumVal, detail] of Object.entries(BIBLE_BOOK_DETAILS)) {
  const book = enumVal as BibleBook;
  aliasMap.set(detail.name.toLowerCase(), book);
  aliasMap.set(detail.shortName.toLowerCase(), book);
}

// Numbered book variants: "1 sam", "i sam", "1st samuel", "first samuel", etc.
const numberedPrefixes: Record<string, string[]> = {
  "1": ["1", "i", "1st", "first"],
  "2": ["2", "ii", "2nd", "second"],
  "3": ["3", "iii", "3rd", "third"],
};

const numberedBooks: [string, BibleBook][] = [
  ["samuel", BibleBook.FIRST_SAMUEL],
  ["samuel", BibleBook.SECOND_SAMUEL],
  ["kings", BibleBook.FIRST_KINGS],
  ["kings", BibleBook.SECOND_KINGS],
  ["chronicles", BibleBook.FIRST_CHRONICLES],
  ["chronicles", BibleBook.SECOND_CHRONICLES],
  ["corinthians", BibleBook.FIRST_CORINTHIANS],
  ["corinthians", BibleBook.SECOND_CORINTHIANS],
  ["thessalonians", BibleBook.FIRST_THESSALONIANS],
  ["thessalonians", BibleBook.SECOND_THESSALONIANS],
  ["timothy", BibleBook.FIRST_TIMOTHY],
  ["timothy", BibleBook.SECOND_TIMOTHY],
  ["peter", BibleBook.FIRST_PETER],
  ["peter", BibleBook.SECOND_PETER],
  ["john", BibleBook.FIRST_JOHN],
  ["john", BibleBook.SECOND_JOHN],
  ["john", BibleBook.THIRD_JOHN],
];

// Determine the number prefix for each book enum
function getNumberPrefix(book: BibleBook): string {
  const name = book.toString();
  if (name.startsWith("FIRST")) return "1";
  if (name.startsWith("SECOND")) return "2";
  if (name.startsWith("THIRD")) return "3";
  return "";
}

for (const [baseName, book] of numberedBooks) {
  const prefix = getNumberPrefix(book);
  const variants = numberedPrefixes[prefix];
  if (!variants) continue;

  const shortDetail = BIBLE_BOOK_DETAILS[book];
  // Also add short name variants like "1 sam", "i sam"
  const shortBase = shortDetail.shortName
    .replace(/^[123]\s*/, "")
    .toLowerCase();

  for (const v of variants) {
    aliasMap.set(`${v} ${baseName}`, book);
    if (shortBase !== baseName) {
      aliasMap.set(`${v} ${shortBase}`, book);
    }
  }
}

// Manual aliases for common variations
aliasMap.set("jn", BibleBook.JOHN);
aliasMap.set("psalm", BibleBook.PSALMS);
aliasMap.set("psa", BibleBook.PSALMS);
aliasMap.set("revelations", BibleBook.REVELATION);
aliasMap.set("song of solomon", BibleBook.SONG_OF_SONGS);
aliasMap.set("sos", BibleBook.SONG_OF_SONGS);
aliasMap.set("gen", BibleBook.GENESIS);
aliasMap.set("exo", BibleBook.EXODUS);
aliasMap.set("lev", BibleBook.LEVITICUS);
aliasMap.set("deut", BibleBook.DEUTERONOMY);
aliasMap.set("phil", BibleBook.PHILIPPIANS);
aliasMap.set("phm", BibleBook.PHILEMON);
aliasMap.set("heb", BibleBook.HEBREWS);
aliasMap.set("jas", BibleBook.JAMES);
aliasMap.set("rom", BibleBook.ROMANS);
aliasMap.set("gal", BibleBook.GALATIANS);
aliasMap.set("eph", BibleBook.EPHESIANS);
aliasMap.set("col", BibleBook.COLOSSIANS);
aliasMap.set("tit", BibleBook.TITUS);
aliasMap.set("matt", BibleBook.MATTHEW);
aliasMap.set("prov", BibleBook.PROVERBS);
aliasMap.set("eccl", BibleBook.ECCLESIASTES);
aliasMap.set("isa", BibleBook.ISAIAH);
aliasMap.set("jer", BibleBook.JEREMIAH);
aliasMap.set("lam", BibleBook.LAMENTATIONS);
aliasMap.set("ezek", BibleBook.EZEKIEL);
aliasMap.set("dan", BibleBook.DANIEL);
aliasMap.set("hos", BibleBook.HOSEA);
aliasMap.set("mic", BibleBook.MICAH);
aliasMap.set("nah", BibleBook.NAHUM);
aliasMap.set("hab", BibleBook.HABAKKUK);
aliasMap.set("zeph", BibleBook.ZEPHANIAH);
aliasMap.set("hag", BibleBook.HAGGAI);
aliasMap.set("zech", BibleBook.ZECHARIAH);
aliasMap.set("mal", BibleBook.MALACHI);
aliasMap.set("obad", BibleBook.OBADIAH);
aliasMap.set("neh", BibleBook.NEHEMIAH);
aliasMap.set("esth", BibleBook.ESTHER);

const REFERENCE_REGEX = /^(.+?)\s+(\d{1,3})(?:\s*[:.]\s*(\d{1,3}))?$/;

export function parseBibleReference(input: string): ParsedReference | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const match = trimmed.match(REFERENCE_REGEX);
  if (!match) return null;

  const [, bookText, chapterStr, verseStr] = match;
  const chapter = parseInt(chapterStr, 10);
  const verse = verseStr ? parseInt(verseStr, 10) : undefined;

  const book = aliasMap.get(bookText.toLowerCase());
  if (!book) return null;

  const details = BIBLE_BOOK_DETAILS[book];
  if (chapter < 1 || chapter > details.chapters) return null;

  return {
    book,
    bookName: details.name,
    chapter,
    verse,
  };
}
