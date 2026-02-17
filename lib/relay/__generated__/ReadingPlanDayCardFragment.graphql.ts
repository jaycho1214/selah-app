/**
 * @generated SignedSource<<9d03f5da01b4b39e7b464dbcbdd575ec>>
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
    readonly endChapter: number | null | undefined;
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
          "name": "endChapter",
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

(node as any).hash = "b5e20193dcf3e996309e09231e578e35";

export default node;
