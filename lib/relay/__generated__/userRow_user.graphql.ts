/**
 * @generated SignedSource<<1e082c2b09e4bf33b3246c90fca902e8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type userRow_user$data = {
  readonly bio: string | null | undefined;
  readonly followedAt: any | null | undefined;
  readonly id: string;
  readonly image:
    | {
        readonly url: string | null | undefined;
      }
    | null
    | undefined;
  readonly name: string | null | undefined;
  readonly username: string | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"followButton_user">;
  readonly " $fragmentType": "userRow_user";
};
export type userRow_user$key = {
  readonly " $data"?: userRow_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"userRow_user">;
};

const node: ReaderFragment = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: null,
  name: "userRow_user",
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
      name: "username",
      storageKey: null,
    },
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
      name: "bio",
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
    {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "followedAt",
      storageKey: null,
    },
    {
      args: null,
      kind: "FragmentSpread",
      name: "followButton_user",
    },
  ],
  type: "User",
  abstractKey: null,
};

(node as any).hash = "03774e44ca9edbfaadb62cc7e8d07e89";

export default node;
