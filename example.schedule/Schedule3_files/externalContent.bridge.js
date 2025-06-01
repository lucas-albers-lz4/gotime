'use strict';

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Notebook
 *| (C) Copyright IBM Corp. 2020
 *|
 *| US Government Users Restricted Rights - Use, duplication or disclosure
 *| restricted by GSA ADP Schedule Contract with IBM Corp.
 *+------------------------------------------------------------------------+
 */

define('notebook/ImportWSNotebookHandler', ['notebook/bundles/externalContent.min'], function (entry) {
  return entry.ImportWSNotebookHandler;
});
define('notebook/OpenWSProjectHandler', ['notebook/bundles/externalContent.min'], function (entry) {
  return entry.OpenWSProjectHandler;
});
define('notebook/ExternalContentModule', ['notebook/bundles/externalContent.min'], function (entry) {
  return entry.ExternalContentModule;
});
define('notebook/ExternalContentUrlCallbackClass', ['notebook/bundles/externalContent.min'], function (entry) {
  return entry.ExternalContentUrlCallbackClass;
});

define('notebook/bundles/externalContent.bridge', function () {});
//# sourceMappingURL=externalContent.bridge.js.map
