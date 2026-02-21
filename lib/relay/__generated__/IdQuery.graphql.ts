/**
 * @generated SignedSource<<df6c139753be32bf70b85ac411717ede>>
 * @relayHash 7a9a99c1b9adba96291fe151eb50048a
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 7a9a99c1b9adba96291fe151eb50048a

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
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
    readonly " $fragmentSpreads": FragmentRefs<"postsListFragment">;
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
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verse",
  "storageKey": null
},
v8 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
  }
],
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
};
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
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "BibleVerse",
        "kind": "LinkedField",
        "name": "bibleVerseByReference",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "postsListFragment"
          }
        ],
        "storageKey": null
      }
    ],
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
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "BibleVerse",
        "kind": "LinkedField",
        "name": "bibleVerseByReference",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": (v8/*: any*/),
            "concreteType": "BibleVersePostConnection",
            "kind": "LinkedField",
            "name": "posts",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "BibleVersePostEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BibleVersePost",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "content",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "createdAt",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "likesCount",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "childPostsCount",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "likedAt",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "User",
                        "kind": "LinkedField",
                        "name": "user",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "name",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "username",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Asset",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": [
                              (v9/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "images",
                        "plural": true,
                        "selections": [
                          (v9/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "width",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "height",
                            "storageKey": null
                          },
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Poll",
                        "kind": "LinkedField",
                        "name": "poll",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "totalVotes",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isExpired",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "deadline",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PollUserVote",
                            "kind": "LinkedField",
                            "name": "userVote",
                            "plural": false,
                            "selections": [
                              (v5/*: any*/),
                              (v6/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "PollOption",
                            "kind": "LinkedField",
                            "name": "options",
                            "plural": true,
                            "selections": [
                              (v5/*: any*/),
                              (v6/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "voteCount",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "votePercentage",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__typename",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "PageInfo",
                "kind": "LinkedField",
                "name": "pageInfo",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endCursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasNextPage",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "kind": "ClientExtension",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__id",
                    "storageKey": null
                  }
                ]
              }
            ],
            "storageKey": "posts(first:20)"
          },
          {
            "alias": null,
            "args": (v8/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "postsList_posts",
            "kind": "LinkedHandle",
            "name": "posts"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "7a9a99c1b9adba96291fe151eb50048a",
    "metadata": {},
    "name": "IdQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "6b5f604cce6022f19e637200cda92a6b";

export default node;
