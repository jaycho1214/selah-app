/**
 * @generated SignedSource<<8be2d629b4723a6b1df3ce05d34abb43>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type BibleBook = "ACTS" | "AMOS" | "COLOSSIANS" | "DANIEL" | "DEUTERONOMY" | "ECCLESIASTES" | "EPHESIANS" | "ESTHER" | "EXODUS" | "EZEKIEL" | "EZRA" | "FIRST_CHRONICLES" | "FIRST_CORINTHIANS" | "FIRST_JOHN" | "FIRST_KINGS" | "FIRST_PETER" | "FIRST_SAMUEL" | "FIRST_THESSALONIANS" | "FIRST_TIMOTHY" | "GALATIANS" | "GENESIS" | "HABAKKUK" | "HAGGAI" | "HEBREWS" | "HOSEA" | "ISAIAH" | "JAMES" | "JEREMIAH" | "JOB" | "JOEL" | "JOHN" | "JONAH" | "JOSHUA" | "JUDE" | "JUDGES" | "LAMENTATIONS" | "LEVITICUS" | "LUKE" | "MALACHI" | "MARK" | "MATTHEW" | "MICAH" | "NAHUM" | "NEHEMIAH" | "NUMBERS" | "OBADIAH" | "PHILEMON" | "PHILIPPIANS" | "PROVERBS" | "PSALMS" | "REVELATION" | "ROMANS" | "RUTH" | "SECOND_CHRONICLES" | "SECOND_CORINTHIANS" | "SECOND_JOHN" | "SECOND_KINGS" | "SECOND_PETER" | "SECOND_SAMUEL" | "SECOND_THESSALONIANS" | "SECOND_TIMOTHY" | "SONG_OF_SONGS" | "THIRD_JOHN" | "TITUS" | "ZECHARIAH" | "ZEPHANIAH" | "%future added value";
export type BibleTranslation = "ASV" | "KJV" | "%future added value";
export type verseActionsCompareQuery$variables = {
  book: BibleBook;
  chapter: number;
  translation: BibleTranslation;
};
export type verseActionsCompareQuery$data = {
  readonly bibleVersesByReference: ReadonlyArray<{
    readonly id: string;
    readonly text: string;
    readonly verse: number;
  }>;
};
export type verseActionsCompareQuery = {
  response: verseActionsCompareQuery$data;
  variables: verseActionsCompareQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "book"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "chapter"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "translation"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "book",
        "variableName": "book"
      },
      {
        "kind": "Variable",
        "name": "chapter",
        "variableName": "chapter"
      },
      {
        "kind": "Variable",
        "name": "translation",
        "variableName": "translation"
      }
    ],
    "concreteType": "BibleVerse",
    "kind": "LinkedField",
    "name": "bibleVersesByReference",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "verse",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "text",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "verseActionsCompareQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "verseActionsCompareQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "e6c311571d155fa00eed85623f29c973",
    "id": null,
    "metadata": {},
    "name": "verseActionsCompareQuery",
    "operationKind": "query",
    "text": "query verseActionsCompareQuery(\n  $translation: BibleTranslation!\n  $book: BibleBook!\n  $chapter: Int!\n) {\n  bibleVersesByReference(translation: $translation, book: $book, chapter: $chapter) {\n    id\n    verse\n    text\n  }\n}\n"
  }
};
})();

(node as any).hash = "9e7468ddaa5b8a79333e5905cd6c873c";

export default node;
