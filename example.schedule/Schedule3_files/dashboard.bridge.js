'use strict';

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Notebook
 *| (C) Copyright IBM Corp. 2018, 2020
 *|
 *| US Government Users Restricted Rights - Use, duplication or disclosure
 *| restricted by GSA ADP Schedule Contract with IBM Corp.
 *+------------------------------------------------------------------------+
 */

define('notebook/DashboardWidget', ['notebook/bundles/dashboard.min'], function (entry) {
  return entry.DashboardWidget;
});
define('notebook/DashboardWidgetPropertiesProvider', ['notebook/bundles/dashboard.min'], function (entry) {
  return entry.DashboardWidgetPropertiesProvider;
});
define('notebook/DashboardWidgetCoreWidget', ['notebook/bundles/dashboard.min'], function (entry) {
  return entry.DashboardWidgetCoreWidget;
});

define('notebook/bundles/dashboard.bridge', function () {});
//# sourceMappingURL=dashboard.bridge.js.map
