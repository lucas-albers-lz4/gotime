'use strict';

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Explore
 *| (C) Copyright IBM Corp. 2018
 *|
 *| US Government Users Restricted Rights - Use, duplication or disclosure
 *| restricted by GSA ADP Schedule Contract with IBM Corp.
 *+------------------------------------------------------------------------+
 */
/**
 * WARNING: The files in the src/js/bridges directory are bundle dropins.
 * Please exercise extra caution while modifying paths.
 */

define('explore/create', ['explore/bundles/action-handlers.min'], function (entry) {
  return entry.NewActionHandler;
});
define('explore/open', ['explore/bundles/action-handlers.min'], function (entry) {
  return entry.OpenActionHandler;
});
define('explore/share', ['explore/bundles/action-handlers.min'], function (entry) {
  return entry.ShareActionHandler;
});

define('explore/bundles/action-handlers.bridge', function () {});
//# sourceMappingURL=action-handlers.bridge.js.map
