/**
 * @generated SignedSource<<1fde7af985c495ad3a8c1ee86b1085ea>>
 * @relayHash 64c1e9e5a5291a59ed94e7cf918f8895
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 64c1e9e5a5291a59ed94e7cf918f8895

import { ConcreteRequest } from 'relay-runtime';
export type ReportPostInput = {
  anonymous?: boolean | null | undefined;
  description?: string | null | undefined;
  postId: string;
  reason: string;
};
export type reportSheetReportPostMutation$variables = {
  input: ReportPostInput;
};
export type reportSheetReportPostMutation$data = {
  readonly reportPost: {
    readonly success: boolean;
  };
};
export type reportSheetReportPostMutation = {
  response: reportSheetReportPostMutation$data;
  variables: reportSheetReportPostMutation$variables;
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
    "concreteType": "ReportPostPayload",
    "kind": "LinkedField",
    "name": "reportPost",
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
    "name": "reportSheetReportPostMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "reportSheetReportPostMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "64c1e9e5a5291a59ed94e7cf918f8895",
    "metadata": {},
    "name": "reportSheetReportPostMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "2a18d3a09638fd9bab9329f962fbaebd";

export default node;
