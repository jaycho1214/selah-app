/**
 * @generated SignedSource<<fe62b073c6f313f85e13f0229735b774>>
 * @relayHash c7c3b30d470acc91fc307ff257991f85
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c7c3b30d470acc91fc307ff257991f85

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type plansTabBrowseQuery$variables = {
  official?: boolean | null | undefined;
};
export type plansTabBrowseQuery$data = {
  readonly readingPlans:
    | ReadonlyArray<{
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"ReadingPlanCardFragment">;
      }>
    | null
    | undefined;
};
export type plansTabBrowseQuery = {
  response: plansTabBrowseQuery$data;
  variables: plansTabBrowseQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: "LocalArgument",
        name: "official",
      },
    ],
    v1 = [
      {
        kind: "Literal",
        name: "first",
        value: 50,
      },
      {
        kind: "Variable",
        name: "official",
        variableName: "official",
      },
    ],
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    },
    v3 = [
      {
        alias: null,
        args: null,
        kind: "ScalarField",
        name: "url",
        storageKey: null,
      },
      v2 /*: any*/,
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Fragment",
      metadata: null,
      name: "plansTabBrowseQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "ReadingPlan",
          kind: "LinkedField",
          name: "readingPlans",
          plural: true,
          selections: [
            v2 /*: any*/,
            {
              args: null,
              kind: "FragmentSpread",
              name: "ReadingPlanCardFragment",
            },
          ],
          storageKey: null,
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: "Operation",
      name: "plansTabBrowseQuery",
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: "ReadingPlan",
          kind: "LinkedField",
          name: "readingPlans",
          plural: true,
          selections: [
            v2 /*: any*/,
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "title",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "description",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "dayCount",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "participantCount",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "isFeatured",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "isOfficial",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "status",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "coversFullBible",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "coversOldTestament",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "coversNewTestament",
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "Asset",
              kind: "LinkedField",
              name: "coverImage",
              plural: false,
              selections: v3 /*: any*/,
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              concreteType: "User",
              kind: "LinkedField",
              name: "author",
              plural: false,
              selections: [
                v2 /*: any*/,
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
                  selections: v3 /*: any*/,
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      id: "c7c3b30d470acc91fc307ff257991f85",
      metadata: {},
      name: "plansTabBrowseQuery",
      operationKind: "query",
      text: null,
    },
  };
})();

(node as any).hash = "8a0626eec9643caa2375b87c9183bdb8";

export default node;
