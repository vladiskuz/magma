/**
 * @generated
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 **/

 /**
 * @flow
 * @relayHash 960fea50de2b63c23ab49dff00c63a28
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type TextCommentPost_comment$ref = any;
export type CommentEntity = "PROJECT" | "WORK_ORDER" | "%future added value";
export type CommentInput = {|
  entityType: CommentEntity,
  id: string,
  text: string,
|};
export type AddCommentMutationVariables = {|
  input: CommentInput
|};
export type AddCommentMutationResponse = {|
  +addComment: {|
    +$fragmentRefs: TextCommentPost_comment$ref
  |}
|};
export type AddCommentMutation = {|
  variables: AddCommentMutationVariables,
  response: AddCommentMutationResponse,
|};
*/


/*
mutation AddCommentMutation(
  $input: CommentInput!
) {
  addComment(input: $input) {
    ...TextCommentPost_comment
    id
  }
}

fragment TextCommentPost_comment on Comment {
  id
  authorName
  text
  createTime
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "CommentInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "AddCommentMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addComment",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Comment",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "TextCommentPost_comment",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "AddCommentMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addComment",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Comment",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "authorName",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "text",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "createTime",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "AddCommentMutation",
    "id": null,
    "text": "mutation AddCommentMutation(\n  $input: CommentInput!\n) {\n  addComment(input: $input) {\n    ...TextCommentPost_comment\n    id\n  }\n}\n\nfragment TextCommentPost_comment on Comment {\n  id\n  authorName\n  text\n  createTime\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '18acd250d64b7a14e2d84071967d7cb9';
module.exports = node;
