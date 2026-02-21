/**
 * @generated SignedSource<<2a8a53a46c9841fbe78f66eb2f95a975>>
 * @relayHash af6ba83524390d5f821276b747522d80
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID af6ba83524390d5f821276b747522d80

import { ConcreteRequest } from 'relay-runtime';
export type useHydrateUserSettingsQuery$variables = Record<PropertyKey, never>;
export type useHydrateUserSettingsQuery$data = {
  readonly userSettings: {
    readonly bible: {
      readonly verseHighlight: {
        readonly color: string | null | undefined;
        readonly enabled: boolean | null | undefined;
      } | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type useHydrateUserSettingsQuery = {
  response: useHydrateUserSettingsQuery$data;
  variables: useHydrateUserSettingsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "UserSettings",
    "kind": "LinkedField",
    "name": "userSettings",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "BibleSettings",
        "kind": "LinkedField",
        "name": "bible",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "VerseHighlightSettings",
            "kind": "LinkedField",
            "name": "verseHighlight",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "enabled",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "color",
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "useHydrateUserSettingsQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "useHydrateUserSettingsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "af6ba83524390d5f821276b747522d80",
    "metadata": {},
    "name": "useHydrateUserSettingsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "738390294ff8d54930241a2e8b24924e";

export default node;
