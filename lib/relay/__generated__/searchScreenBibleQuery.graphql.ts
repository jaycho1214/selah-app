/**
 * @generated SignedSource<<f59f7ccc218a51a75a4eb877bcd98c87>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type BibleBook =
  | "ACTS"
  | "AMOS"
  | "COLOSSIANS"
  | "DANIEL"
  | "DEUTERONOMY"
  | "ECCLESIASTES"
  | "EPHESIANS"
  | "ESTHER"
  | "EXODUS"
  | "EZEKIEL"
  | "EZRA"
  | "FIRST_CHRONICLES"
  | "FIRST_CORINTHIANS"
  | "FIRST_JOHN"
  | "FIRST_KINGS"
  | "FIRST_PETER"
  | "FIRST_SAMUEL"
  | "FIRST_THESSALONIANS"
  | "FIRST_TIMOTHY"
  | "GALATIANS"
  | "GENESIS"
  | "HABAKKUK"
  | "HAGGAI"
  | "HEBREWS"
  | "HOSEA"
  | "ISAIAH"
  | "JAMES"
  | "JEREMIAH"
  | "JOB"
  | "JOEL"
  | "JOHN"
  | "JONAH"
  | "JOSHUA"
  | "JUDE"
  | "JUDGES"
  | "LAMENTATIONS"
  | "LEVITICUS"
  | "LUKE"
  | "MALACHI"
  | "MARK"
  | "MATTHEW"
  | "MICAH"
  | "NAHUM"
  | "NEHEMIAH"
  | "NUMBERS"
  | "OBADIAH"
  | "PHILEMON"
  | "PHILIPPIANS"
  | "PROVERBS"
  | "PSALMS"
  | "REVELATION"
  | "ROMANS"
  | "RUTH"
  | "SECOND_CHRONICLES"
  | "SECOND_CORINTHIANS"
  | "SECOND_JOHN"
  | "SECOND_KINGS"
  | "SECOND_PETER"
  | "SECOND_SAMUEL"
  | "SECOND_THESSALONIANS"
  | "SECOND_TIMOTHY"
  | "SONG_OF_SONGS"
  | "THIRD_JOHN"
  | "TITUS"
  | "ZECHARIAH"
  | "ZEPHANIAH"
  | "%future added value";
export type BibleTranslation = "ASV" | "KJV" | "%future added value";
export type searchScreenBibleQuery$variables = {
  limit?: number | null | undefined;
  query: string;
  translation: BibleTranslation;
};
export type searchScreenBibleQuery$data = {
  readonly bibleVersesByQuery: ReadonlyArray<{
    readonly book: BibleBook;
    readonly chapter: number;
    readonly id: string;
    readonly text: string;
    readonly verse: number;
  }>;
};
export type searchScreenBibleQuery = {
  response: searchScreenBibleQuery$data;
  variables: searchScreenBibleQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "limit",
    },
    v1 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "query",
    },
    v2 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "translation",
    },
    v3 = [
      {
        alias: null,
        args: [
          {
            kind: "Variable",
            name: "limit",
            variableName: "limit",
          },
          {
            kind: "Variable",
            name: "query",
            variableName: "query",
          },
          {
            kind: "Variable",
            name: "translation",
            variableName: "translation",
          },
        ],
        concreteType: "BibleVerse",
        kind: "LinkedField",
        name: "bibleVersesByQuery",
        plural: true,
        selections: [
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "id",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "book",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "chapter",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "verse",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "text",
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "searchScreenBibleQuery",
      selections: v3 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [v2 /*: any*/, v1 /*: any*/, v0 /*: any*/],
      kind: "Operation",
      name: "searchScreenBibleQuery",
      selections: v3 /*: any*/,
    },
    params: {
      cacheID: "856d49e98036da1974f89ad4c3c77e7b",
      id: null,
      metadata: {},
      name: "searchScreenBibleQuery",
      operationKind: "query",
      text: "query searchScreenBibleQuery(\n  $translation: BibleTranslation!\n  $query: String!\n  $limit: Int\n) {\n  bibleVersesByQuery(translation: $translation, query: $query, limit: $limit) {\n    id\n    book\n    chapter\n    verse\n    text\n  }\n}\n",
    },
  };
})();

(node as any).hash = "a886a0cf17be74a8e5e99a304418923d";

export default node;
