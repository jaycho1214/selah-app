/**
 * @generated SignedSource<<6f1dea810f205159f82a39163b7d21fe>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type reflectionItemPollVoteMutation$variables = {
  optionId: string;
  pollId: string;
};
export type reflectionItemPollVoteMutation$data = {
  readonly pollVote: {
    readonly poll: {
      readonly id: string;
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
    };
  };
};
export type reflectionItemPollVoteMutation = {
  response: reflectionItemPollVoteMutation$data;
  variables: reflectionItemPollVoteMutation$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "optionId",
      },
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "pollId",
      },
    ],
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
      name: "text",
      storageKey: null,
    },
    v3 = [
      {
        alias: null,
        args: [
          {
            kind: "Variable",
            name: "optionId",
            variableName: "optionId",
          },
          {
            kind: "Variable",
            name: "pollId",
            variableName: "pollId",
          },
        ],
        concreteType: "PollVotePayload",
        kind: "LinkedField",
        name: "pollVote",
        plural: false,
        selections: [
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
                concreteType: "PollUserVote",
                kind: "LinkedField",
                name: "userVote",
                plural: false,
                selections: [v1 /*: any*/, v2 /*: any*/],
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
                  v2 /*: any*/,
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
        ],
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "reflectionItemPollVoteMutation",
      selections: v3 /*: any*/,
      type: "Mutation",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "reflectionItemPollVoteMutation",
      selections: v3 /*: any*/,
    },
    params: {
      cacheID: "b7fd269c124ec6ec243d699ef2dd68ca",
      id: null,
      metadata: {},
      name: "reflectionItemPollVoteMutation",
      operationKind: "mutation",
      text: "mutation reflectionItemPollVoteMutation(\n  $optionId: ID!\n  $pollId: ID!\n) {\n  pollVote(optionId: $optionId, pollId: $pollId) {\n    poll {\n      id\n      totalVotes\n      userVote {\n        id\n        text\n      }\n      options {\n        id\n        text\n        voteCount\n        votePercentage\n      }\n    }\n  }\n}\n",
    },
  };
})();

(node as any).hash = "a5d25f2d7b9f06e48f10c88cab9447c2";

export default node;
