/**
 * IBM Confidential OCO Source Materials IBM Business Platform: Cognos Analytics Home
 * (C) Copyright IBM Corp. 2020
 *
 * The source code for this program is not published or otherwise divested of
 * its trade secrets, irrespective of what has been deposited with the U.S.
 * Copyright Office
 */
requirejs.config({
  paths: {
    'ca-content': 'js/ca-content',
    homeBridgeBundle: 'js/ca-content/homeBridgeBundle',
    contentBridgeBundle: 'js/ca-content/contentBridgeBundle',
    contentGlassBundle: 'js/ca-content/contentGlassBundle'
  },
  bundles: {
    contentGlassBundle: [
      'ca-content/bridge/nls/CognosAnalyticsHomeResources',
      'ca-content/bridge/nls/root/CognosAnalyticsHomeResources',
      'ca-content/bridge/nls/StringResources',
      'ca-content/bridge/glass/listActions/DetailsViewAction',
      'ca-content/bridge/glass/listActions/SetAsHomeActionHandler',
      'ca-content/bridge/glass/listActions/ShareFolderActionHandler',
      'ca-content/glass/glass',
      'ca-content/bridge/glass/searchBar/SearchBarController',
      'ca-content/bridge/glass/slideout/MRUView',
      'ca-content/content/content',
      'ca-content/bridge/glass/NavigatorDialog',
      'ca-content/bridge/glass/OpenDialog',
      'ca-content/bridge/glass/SaveAsDialog',
      'ca-content/bridge/glass/CopyMoveDialog',
      'ca-content/bridge/glass/ContentDialogFactory',
      'ca-content/bridge/glass/ContentMenuController',
      'ca-content/bridge/glass/ContentPageCallbacks',
      'ca-content/bridge/glass/Details'
    ],
    homeBridgeBundle: [
      'ca-content/common-home/HomeView',
      'ca-content/home/caHome',
      'ca-content/bridge/home/HomeView',
      'ca-content/bridge/home/NavigatorView',
      'ca-content/bridge/home/QuickLaunchView',
      'ca-content/bridge/home/GreetingView',
      'ca-content/bridge/home/GetStartedTabView'
    ],
    contentBridgeBundle: [
      'ca-content/bridge/content/ContentPageView',
      'ca-content/bridge/content/SearchContentPageView',
      'ca-content/bridge/content/SamplesTabView',
      'ca-content/bridge/content/PropertiesPageView'
    ]
  },
  map: {
    '*': {

    }
  }
});
//# sourceMappingURL=bundleManifest.js.map
