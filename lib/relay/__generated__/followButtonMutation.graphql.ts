/**
 * @generated SignedSource<<a47fea4d924b4261f291cd7a695e5d78>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type followButtonMutation$variables = {
  userId: string;
  value: boolean;
};
export type followButtonMutation$data = {
  readonly userFollow?: {
    readonly user: {
      readonly followedAt: any | null | undefined;
      readonly followerCount: number;
      readonly id: string;
    };
  };
  readonly userUnfollow?: {
    readonly user: {
      readonly followedAt: any | null | undefined;
      readonly followerCount: number;
      readonly id: string;
    };
  };
};
export type followButtonMutation = {
  response: followButtonMutation$data;
  variables: followButtonMutation$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "userId",
      },
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "value",
      },
    ],
    v1 = [
      {
        kind: "Variable",
        name: "userId",
        variableName: "userId",
      },
    ],
    v2 = [
      {
        alias: null,
        args: null,
        concreteType: "User",
        kind: "LinkedField",
        name: "user",
        plural: false,
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
            name: "followedAt",
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: "ScalarField",
            name: "followerCount",
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ],
    v3 = [
      {
        condition: "value",
        kind: "Condition",
        passingValue: true,
        selections: [
          {
            alias: null,
            args: v1 /*: any*/,
            concreteType: "UserFollowPayload",
            kind: "LinkedField",
            name: "userFollow",
            plural: false,
            selections: v2 /*: any*/,
            storageKey: null,
          },
        ],
      },
      {
        condition: "value",
        kind: "Condition",
        passingValue: false,
        selections: [
          {
            alias: null,
            args: v1 /*: any*/,
            concreteType: "UserUnfollowPayload",
            kind: "LinkedField",
            name: "userUnfollow",
            plural: false,
            selections: v2 /*: any*/,
            storageKey: null,
          },
        ],
      },
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "followButtonMutation",
      selections: v3 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "followButtonMutation",
      selections: v3 /*: any*/,
    },
    params: {
      cacheID: "72b22f502979eb9e1b85670b2834d1a3",
      id: null,
      metadata: {},
      name: "followButtonMutation",
      operationKind: "mutation",
      text: "mutation followButtonMutation(\n  $userId: ID!\n  $value: Boolean!\n) {\n  userFollow(userId: $userId) @include(if: $value) {\n    user {\n      id\n      followedAt\n      followerCount\n    }\n  }\n  userUnfollow(userId: $userId) @skip(if: $value) {\n    user {\n      id\n      followedAt\n      followerCount\n    }\n  }\n}\n",
    },
  };
})();

(node as any).hash = "b2c31a1ce4088436e014fe3824d9afa6";

export default node;
