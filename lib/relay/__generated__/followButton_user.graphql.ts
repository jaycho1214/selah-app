/**
 * @generated SignedSource<<4705bd083e01a0ac5a0a3b8bac84d698>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type followButton_user$data = {
  readonly followedAt: any | null | undefined;
  readonly followerCount: number;
  readonly id: string;
  readonly " $fragmentType": "followButton_user";
};
export type followButton_user$key = {
  readonly " $data"?: followButton_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"followButton_user">;
};

const node: ReaderFragment = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: null,
  name: "followButton_user",
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
  type: "User",
  abstractKey: null,
};

(node as any).hash = "98a79cb95e339f700165292f8757dd64";

export default node;
