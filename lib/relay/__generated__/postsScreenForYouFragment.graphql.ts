/**
 * @generated SignedSource<<995ad787781ab05e8ef0f6fded424175>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
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
import { FragmentRefs } from "relay-runtime";
export type postsScreenForYouFragment$data = {
  readonly bibleVersePosts: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly childPostsCount: number;
        readonly content: string | null | undefined;
        readonly createdAt: any;
        readonly id: string;
        readonly images: ReadonlyArray<{
          readonly height: number | null | undefined;
          readonly url: string | null | undefined;
          readonly width: number | null | undefined;
        }>;
        readonly likedAt: any | null | undefined;
        readonly likesCount: number;
        readonly poll:
          | {
              readonly deadline: any | null | undefined;
              readonly id: string;
              readonly isExpired: boolean | null | undefined;
              readonly options:
                | ReadonlyArray<{
                    readonly id: string;
                    readonly text: string | null | undefined;
                    readonly voteCount: number | null | undefined;
                    readonly votePercentage: number | null | undefined;
                  }>
                | null
                | undefined;
              readonly totalVotes: number | null | undefined;
              readonly userVote:
                | {
                    readonly id: string | null | undefined;
                    readonly text: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
        readonly user: {
          readonly id: string;
          readonly image:
            | {
                readonly url: string | null | undefined;
              }
            | null
            | undefined;
          readonly name: string | null | undefined;
          readonly username: string | null | undefined;
        };
        readonly verse:
          | {
              readonly book: BibleBook;
              readonly chapter: number;
              readonly id: string;
              readonly translation: BibleTranslation;
              readonly verse: number;
            }
          | null
          | undefined;
      };
    }>;
  };
  readonly " $fragmentType": "postsScreenForYouFragment";
};
export type postsScreenForYouFragment$key = {
  readonly " $data"?: postsScreenForYouFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"postsScreenForYouFragment">;
};

import postsScreenForYouPaginationQuery_graphql from "./postsScreenForYouPaginationQuery.graphql";

const node: ReaderFragment = (function () {
  var v0 = ["bibleVersePosts"],
    v1 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    },
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "url",
      storageKey: null,
    },
    v3 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "text",
      storageKey: null,
    };
  return {
    argumentDefinitions: [
      {
        defaultValue: 20,
        kind: "LocalArgument",
        name: "count",
      },
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "cursor",
      },
    ],
    kind: "Fragment",
    metadata: {
      connection: [
        {
          count: "count",
          cursor: "cursor",
          direction: "forward",
          path: v0 /*: any*/,
        },
      ],
      refetch: {
        connection: {
          forward: {
            count: "count",
            cursor: "cursor",
          },
          backward: null,
          path: v0 /*: any*/,
        },
        fragmentPathInResult: [],
        operation: postsScreenForYouPaginationQuery_graphql,
      },
    },
    name: "postsScreenForYouFragment",
    selections: [
      {
        alias: "bibleVersePosts",
        args: null,
        concreteType: "BibleVersePostConnection",
        kind: "LinkedField",
        name: "__forYouFeed_bibleVersePosts_connection",
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            concreteType: "BibleVersePostEdge",
            kind: "LinkedField",
            name: "edges",
            plural: true,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "BibleVersePost",
                kind: "LinkedField",
                name: "node",
                plural: false,
                selections: [
                  v1 /*: any*/,
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "content",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "createdAt",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "likesCount",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "childPostsCount",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "likedAt",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    concreteType: "User",
                    kind: "LinkedField",
                    name: "user",
                    plural: false,
                    selections: [
                      v1 /*: any*/,
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "name",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "username",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        concreteType: "Asset",
                        kind: "LinkedField",
                        name: "image",
                        plural: false,
                        selections: [v2 /*: any*/],
                        storageKey: null,
                      },
                    ],
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    concreteType: "Asset",
                    kind: "LinkedField",
                    name: "images",
                    plural: true,
                    selections: [
                      v2 /*: any*/,
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "width",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "height",
                        storageKey: null,
                      },
                    ],
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    concreteType: "Poll",
                    kind: "LinkedField",
                    name: "poll",
                    plural: false,
                    selections: [
                      v1 /*: any*/,
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "totalVotes",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "isExpired",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "deadline",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        concreteType: "PollUserVote",
                        kind: "LinkedField",
                        name: "userVote",
                        plural: false,
                        selections: [v1 /*: any*/, v3 /*: any*/],
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        concreteType: "PollOption",
                        kind: "LinkedField",
                        name: "options",
                        plural: true,
                        selections: [
                          v1 /*: any*/,
                          v3 /*: any*/,
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "voteCount",
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "votePercentage",
                            storageKey: null,
                          },
                        ],
                        storageKey: null,
                      },
                    ],
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    concreteType: "BibleVerse",
                    kind: "LinkedField",
                    name: "verse",
                    plural: false,
                    selections: [
                      v1 /*: any*/,
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
                        name: "translation",
                        storageKey: null,
                      },
                    ],
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "__typename",
                    storageKey: null,
                  },
                ],
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "cursor",
                storageKey: null,
              },
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "PageInfo",
            kind: "LinkedField",
            name: "pageInfo",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "endCursor",
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "hasNextPage",
                storageKey: null,
              },
            ],
            storageKey: null,
          },
          {
            kind: "ClientExtension",
            selections: [
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "__id",
                storageKey: null,
              },
            ],
          },
        ],
        storageKey: null,
      },
    ],
    type: "Query",
    abstractKey: null,
  };
})();

(node as any).hash = "3d23566c2bb5e4c790690239d1c0ccf4";

export default node;
