/**
 * @generated SignedSource<<5dc60472e3ffabc4c82666b3e4f9a470>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type BibleBook = "ACTS" | "AMOS" | "COLOSSIANS" | "DANIEL" | "DEUTERONOMY" | "ECCLESIASTES" | "EPHESIANS" | "ESTHER" | "EXODUS" | "EZEKIEL" | "EZRA" | "FIRST_CHRONICLES" | "FIRST_CORINTHIANS" | "FIRST_JOHN" | "FIRST_KINGS" | "FIRST_PETER" | "FIRST_SAMUEL" | "FIRST_THESSALONIANS" | "FIRST_TIMOTHY" | "GALATIANS" | "GENESIS" | "HABAKKUK" | "HAGGAI" | "HEBREWS" | "HOSEA" | "ISAIAH" | "JAMES" | "JEREMIAH" | "JOB" | "JOEL" | "JOHN" | "JONAH" | "JOSHUA" | "JUDE" | "JUDGES" | "LAMENTATIONS" | "LEVITICUS" | "LUKE" | "MALACHI" | "MARK" | "MATTHEW" | "MICAH" | "NAHUM" | "NEHEMIAH" | "NUMBERS" | "OBADIAH" | "PHILEMON" | "PHILIPPIANS" | "PROVERBS" | "PSALMS" | "REVELATION" | "ROMANS" | "RUTH" | "SECOND_CHRONICLES" | "SECOND_CORINTHIANS" | "SECOND_JOHN" | "SECOND_KINGS" | "SECOND_PETER" | "SECOND_SAMUEL" | "SECOND_THESSALONIANS" | "SECOND_TIMOTHY" | "SONG_OF_SONGS" | "THIRD_JOHN" | "TITUS" | "ZECHARIAH" | "ZEPHANIAH" | "%future added value";
export type BibleTranslation = "ASV" | "KJV" | "%future added value";
export type IdQuery$variables = {
  book: BibleBook;
  chapter: number;
  translation: BibleTranslation;
  verse: number;
};
export type IdQuery$data = {
  readonly bibleVerseByReference: {
    readonly id: string;
    readonly text: string;
    readonly verse: number;
  } | null | undefined;
};
export type IdQuery = {
  response: IdQuery$data;
  variables: IdQuery$variables;
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
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "verse"
},
v4 = [
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
      },
      {
        "kind": "Variable",
        "name": "verse",
        "variableName": "verse"
      }
    ],
    "concreteType": "BibleVerse",
    "kind": "LinkedField",
    "name": "bibleVerseByReference",
    "plural": false,
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
        "name": "text",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "verse",
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
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "IdQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "IdQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "0ed030c944857aedc647730109069518",
    "id": null,
    "metadata": {},
    "name": "IdQuery",
    "operationKind": "query",
    "text": "query IdQuery(\n  $translation: BibleTranslation!\n  $book: BibleBook!\n  $chapter: Int!\n  $verse: Int!\n) {\n  bibleVerseByReference(translation: $translation, book: $book, chapter: $chapter, verse: $verse) {\n    id\n    text\n    verse\n  }\n}\n"
  }
};
})();

(node as any).hash = "97afd9dd87becd55efa2b256cecd1f2c";

export default node;
