/**
 * @generated SignedSource<<16d7261fd1b1b52fbdfc7e537d909c75>>
 * @relayHash 31df552c4d60d94dc62b67d65bb5fb58
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 31df552c4d60d94dc62b67d65bb5fb58

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
export type useComposerStateVerseRefQuery$variables = {
  limit?: number | null | undefined;
  query: string;
  translation: BibleTranslation;
};
export type useComposerStateVerseRefQuery$data = {
  readonly bibleVersesByReferenceSearch: ReadonlyArray<{
    readonly book: BibleBook;
    readonly chapter: number;
    readonly id: string;
    readonly text: string;
    readonly translation: BibleTranslation;
    readonly verse: number;
  }>;
};
export type useComposerStateVerseRefQuery = {
  response: useComposerStateVerseRefQuery$data;
  variables: useComposerStateVerseRefQuery$variables;
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
        name: "bibleVersesByReferenceSearch",
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
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "translation",
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
      name: "useComposerStateVerseRefQuery",
      selections: v3 /*: any*/,
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [v2 /*: any*/, v1 /*: any*/, v0 /*: any*/],
      kind: "Operation",
      name: "useComposerStateVerseRefQuery",
      selections: v3 /*: any*/,
    },
    params: {
      id: "31df552c4d60d94dc62b67d65bb5fb58",
      metadata: {},
      name: "useComposerStateVerseRefQuery",
      operationKind: "query",
      text: null,
    },
  };
})();

(node as any).hash = "917a4e539e5c619ffeb11c4f8af209ae";

export default node;
