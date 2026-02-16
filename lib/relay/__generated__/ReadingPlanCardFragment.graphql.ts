/**
 * @generated SignedSource<<fefc10578fd6bd8e9161a316962740af>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type ReadingPlanStatus = "ARCHIVED" | "DRAFT" | "PUBLISHED" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type ReadingPlanCardFragment$data = {
  readonly author: {
    readonly id: string;
    readonly image: {
      readonly url: string | null | undefined;
    } | null | undefined;
    readonly name: string | null | undefined;
    readonly username: string | null | undefined;
  };
  readonly dayCount: number;
  readonly description: string | null | undefined;
  readonly id: string;
  readonly isFeatured: boolean;
  readonly participantCount: number;
  readonly status: ReadingPlanStatus;
  readonly title: string;
  readonly " $fragmentType": "ReadingPlanCardFragment";
};
export type ReadingPlanCardFragment$key = {
  readonly " $data"?: ReadingPlanCardFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ReadingPlanCardFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ReadingPlanCardFragment",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dayCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "participantCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isFeatured",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "author",
      "plural": false,
      "selections": [
        (v0/*: any*/),
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
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "url",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ReadingPlan",
  "abstractKey": null
};
})();

(node as any).hash = "faec0c1dc510a57913c3bedb475bbc46";

export default node;
