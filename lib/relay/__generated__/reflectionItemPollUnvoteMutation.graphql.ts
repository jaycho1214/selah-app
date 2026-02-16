/**
 * @generated SignedSource<<f5e9b3ee19d99ee82aff7d9a4d902107>>
 * @relayHash 65129abce97bc5625a243a37cb18c600
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 65129abce97bc5625a243a37cb18c600

import { ConcreteRequest } from 'relay-runtime';
export type reflectionItemPollUnvoteMutation$variables = {
  pollId: string;
};
export type reflectionItemPollUnvoteMutation$data = {
  readonly pollUnvote: {
    readonly poll: {
      readonly id: string;
      readonly options: ReadonlyArray<{
        readonly id: string;
        readonly text: string | null | undefined;
        readonly voteCount: number | null | undefined;
        readonly votePercentage: number | null | undefined;
      }> | null | undefined;
      readonly totalVotes: number | null | undefined;
      readonly userVote: {
        readonly id: string | null | undefined;
        readonly text: string | null | undefined;
      } | null | undefined;
    };
  };
};
export type reflectionItemPollUnvoteMutation = {
  response: reflectionItemPollUnvoteMutation$data;
  variables: reflectionItemPollUnvoteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "pollId"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "pollId",
        "variableName": "pollId"
      }
    ],
    "concreteType": "PollUnvotePayload",
    "kind": "LinkedField",
    "name": "pollUnvote",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Poll",
        "kind": "LinkedField",
        "name": "poll",
        "plural": false,
        "selections": [
          (v1/*: any*/),
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
            "concreteType": "PollUserVote",
            "kind": "LinkedField",
            "name": "userVote",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/)
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
              (v1/*: any*/),
              (v2/*: any*/),
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
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "reflectionItemPollUnvoteMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "reflectionItemPollUnvoteMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "id": "65129abce97bc5625a243a37cb18c600",
    "metadata": {},
    "name": "reflectionItemPollUnvoteMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "fa7bc327eae94e370dcc365ce1f4403f";

export default node;
