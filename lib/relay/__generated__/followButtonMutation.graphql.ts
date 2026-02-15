/**
 * @generated SignedSource<<6dd42cb29fc8d6a5a217eb4500b72246>>
 * @relayHash 72b22f502979eb9e1b85670b2834d1a3
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 72b22f502979eb9e1b85670b2834d1a3

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
      id: "72b22f502979eb9e1b85670b2834d1a3",
      metadata: {},
      name: "followButtonMutation",
      operationKind: "mutation",
      text: null,
    },
  };
})();

(node as any).hash = "b2c31a1ce4088436e014fe3824d9afa6";

export default node;
