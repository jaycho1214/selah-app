/**
 * @generated SignedSource<<93e0e60343e5780d3d970aa2a4c9b2d2>>
 * @relayHash 8d4d394e60ee27756abcfea8b2f16d88
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 8d4d394e60ee27756abcfea8b2f16d88

import { ConcreteRequest } from 'relay-runtime';
export type ReportUserInput = {
  anonymous?: boolean | null | undefined;
  description?: string | null | undefined;
  reason: string;
  userId: string;
};
export type reportSheetReportUserMutation$variables = {
  input: ReportUserInput;
};
export type reportSheetReportUserMutation$data = {
  readonly reportUser: {
    readonly success: boolean;
  };
};
export type reportSheetReportUserMutation = {
  response: reportSheetReportUserMutation$data;
  variables: reportSheetReportUserMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "ReportUserPayload",
    "kind": "LinkedField",
    "name": "reportUser",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
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
    "name": "reportSheetReportUserMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "reportSheetReportUserMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "8d4d394e60ee27756abcfea8b2f16d88",
    "metadata": {},
    "name": "reportSheetReportUserMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "1378f4ad14a0ce99ab0419eec61ed78c";

export default node;
