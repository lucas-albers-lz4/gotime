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

define('explore/view', ['explore/bundles/component.min'], function (entry) {
  return entry.default;
});
define('explore/layout/ExploreContainer', ['explore/bundles/component.min'], function (entry) {
  return entry.ExploreContainer;
});
define('explore/layout/base', ['explore/bundles/component.min'], function (entry) {
  return entry.LayoutBase;
});
define('explore/layout/ExploreContainerAuthoring', ['explore/bundles/component.min'], function (entry) {
  return entry.ExploreContainerAuthoring;
});
define('explore/layout/ExploreCardAuthoring', ['explore/bundles/component.min'], function (entry) {
  return entry.ExploreCardAuthoring;
});
define('explore/layout/ExploreCard', ['explore/bundles/component.min'], function (entry) {
  return entry.ExploreCard;
});
define('explore/layout/ExploreWidget', ['explore/bundles/component.min'], function (entry) {
  return entry.ExploreWidget;
});
define('explore/layout/VisPlaceholder', ['explore/bundles/component.min'], function (entry) {
  return entry.VisPlaceholder;
});
define('explore/layout/container/authoring', ['explore/bundles/component.min'], function (entry) {
  return entry.AuthoringExploreContainer;
});
define('explore/interactions/selection', ['explore/bundles/component.min'], function (entry) {
  return entry.Selection;
});
define('explore/interactions/deselection', ['explore/bundles/component.min'], function (entry) {
  return entry.Deselection;
});
define('explore/links', ['explore/bundles/component.min'], function (entry) {
  return entry.Links;
});

define('explore/bundles/component.bridge', function () {});
//# sourceMappingURL=component.bridge.js.map
