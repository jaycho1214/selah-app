/**
 * @generated SignedSource<<dbf8e3e05272af7b2c08f67ac2ee9a93>>
 * @relayHash 91af1f03bd9adcbde8a39ec92e2908a9
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 91af1f03bd9adcbde8a39ec92e2908a9

import { ConcreteRequest } from 'relay-runtime';
export type BibleBook = "ACTS" | "AMOS" | "COLOSSIANS" | "DANIEL" | "DEUTERONOMY" | "ECCLESIASTES" | "EPHESIANS" | "ESTHER" | "EXODUS" | "EZEKIEL" | "EZRA" | "FIRST_CHRONICLES" | "FIRST_CORINTHIANS" | "FIRST_JOHN" | "FIRST_KINGS" | "FIRST_PETER" | "FIRST_SAMUEL" | "FIRST_THESSALONIANS" | "FIRST_TIMOTHY" | "GALATIANS" | "GENESIS" | "HABAKKUK" | "HAGGAI" | "HEBREWS" | "HOSEA" | "ISAIAH" | "JAMES" | "JEREMIAH" | "JOB" | "JOEL" | "JOHN" | "JONAH" | "JOSHUA" | "JUDE" | "JUDGES" | "LAMENTATIONS" | "LEVITICUS" | "LUKE" | "MALACHI" | "MARK" | "MATTHEW" | "MICAH" | "NAHUM" | "NEHEMIAH" | "NUMBERS" | "OBADIAH" | "PHILEMON" | "PHILIPPIANS" | "PROVERBS" | "PSALMS" | "REVELATION" | "ROMANS" | "RUTH" | "SECOND_CHRONICLES" | "SECOND_CORINTHIANS" | "SECOND_JOHN" | "SECOND_KINGS" | "SECOND_PETER" | "SECOND_SAMUEL" | "SECOND_THESSALONIANS" | "SECOND_TIMOTHY" | "SONG_OF_SONGS" | "THIRD_JOHN" | "TITUS" | "ZECHARIAH" | "ZEPHANIAH" | "%future added value";
export type BibleTranslation = "ASV" | "KJV" | "%future added value";
export type chapterViewQuery$variables = {
  book: BibleBook;
  chapter: number;
  translation: BibleTranslation;
};
export type chapterViewQuery$data = {
  readonly bibleVersesByReference: ReadonlyArray<{
    readonly hasUserPost: boolean;
    readonly id: string;
    readonly text: string;
    readonly verse: number;
  }>;
};
export type chapterViewQuery = {
  response: chapterViewQuery$data;
  variables: chapterViewQuery$variables;
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "hasUserPost",
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
    "name": "chapterViewQuery",
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
    "name": "chapterViewQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "id": "91af1f03bd9adcbde8a39ec92e2908a9",
    "metadata": {},
    "name": "chapterViewQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "f20fd86c4efeac04ac31bd58be7d1994";

export default node;
