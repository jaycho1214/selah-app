/**
 * @generated SignedSource<<233ed9bc832f8bc9de3064928522abe7>>
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
export type NotificationType =
  | "BIBLE_VERSE_POST_FOLLOWER_POST"
  | "BIBLE_VERSE_POST_LIKE"
  | "BIBLE_VERSE_POST_MENTION"
  | "BIBLE_VERSE_POST_REPLY"
  | "USER_FOLLOWED"
  | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type notificationItemFragment$data = {
  readonly createdAt: any | null | undefined;
  readonly id: string;
  readonly post:
    | {
        readonly content: string | null | undefined;
        readonly id: string;
        readonly parentPost:
          | {
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
            }
          | null
          | undefined;
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
      }
    | null
    | undefined;
  readonly sender: {
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
  readonly type: NotificationType | null | undefined;
  readonly " $fragmentType": "notificationItemFragment";
};
export type notificationItemFragment$key = {
  readonly " $data"?: notificationItemFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"notificationItemFragment">;
};

const node: ReaderFragment = (function () {
  var v0 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    },
    v1 = {
      alias: null,
      args: null,
      concreteType: "BibleVerse",
      kind: "LinkedField",
      name: "verse",
      plural: false,
      selections: [
        v0 /*: any*/,
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
    };
  return {
    argumentDefinitions: [],
    kind: "Fragment",
    metadata: null,
    name: "notificationItemFragment",
    selections: [
      v0 /*: any*/,
      {
        alias: null,
        args: null,
        kind: "ScalarField",
        name: "type",
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
        concreteType: "User",
        kind: "LinkedField",
        name: "sender",
        plural: false,
        selections: [
          v0 /*: any*/,
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
            selections: [
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "url",
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
        concreteType: "BibleVersePost",
        kind: "LinkedField",
        name: "post",
        plural: false,
        selections: [
          v0 /*: any*/,
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "content",
            storageKey: null,
          },
          v1 /*: any*/,
          {
            alias: null,
            args: null,
            concreteType: "BibleVersePost",
            kind: "LinkedField",
            name: "parentPost",
            plural: false,
            selections: [v1 /*: any*/],
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ],
    type: "Notification",
    abstractKey: null,
  };
})();

(node as any).hash = "1a7ed26162f6e6516cd960bcea2bd1fa";

export default node;
