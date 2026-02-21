/**
 * @generated SignedSource<<fc04afabffc5bc8e2c57a7266419c3aa>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ReadingPlanDayCardFragment$data = {
  readonly dayNumber: number | null | undefined;
  readonly id: string;
  readonly readings: ReadonlyArray<{
    readonly book: string | null | undefined;
    readonly endVerse: number | null | undefined;
    readonly id: string;
    readonly startChapter: number | null | undefined;
    readonly startVerse: number | null | undefined;
  }> | null | undefined;
  readonly title: string | null | undefined;
  readonly " $fragmentType": "ReadingPlanDayCardFragment";
};
export type ReadingPlanDayCardFragment$key = {
  readonly " $data"?: ReadingPlanDayCardFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ReadingPlanDayCardFragment">;
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
  "name": "ReadingPlanDayCardFragment",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dayNumber",
      "storageKey": null
    },
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
      "concreteType": "ReadingPlanDayReading",
      "kind": "LinkedField",
      "name": "readings",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "book",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "startChapter",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "startVerse",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "endVerse",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ReadingPlanDay",
  "abstractKey": null
};
})();

(node as any).hash = "080bb0f033b41ca030700799ec06b287";

export default node;
