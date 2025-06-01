/**
 * IBM Confidential OCO Source Materials IBM Business Platform: CA Reporting
 * (C) Copyright IBM Corp. 2018
 *
 * The source code for this program is not published or otherwise divested of
 * its trade secrets, irrespective of what has been deposited with the U.S.
 * Copyright Office
 */
require.config({
  bundles: {
    "js/authoring/bundle": [
      "bi/authoring/nls/AuthoringMessages",
      "bi/authoring/nls/root/AuthoringMessages",
      "bi/authoring/nls/StringResource",
      "bi/classicviewer/nls/ClassicViewerMessages",
      "bi/classicviewer/nls/root/ClassicViewerMessages",
      "bi/classicviewer/nls/StringResource",
      "bi/authoring/utils/pat/rsCommon",
      "bi/authoring/utils/pat/rsPromptParameters",
      "bi/authoring/utils/C_Defer",
      "bi/authoring/utils/rsIFrameManager",
      "text!bi/authoring/res/DatasetList.xml",
      "bi/authoring/utils/pat/rsLaunchParameters",
      "bi/authoring/utils/rsOpenHelper",
      "bi/authoring/utils/rsPerformance",
      "bi/authoring/common/utils/rptShareHelper",
      "bi/authoring/rsContentView",
      "bi/authoring/common/ReportingBehaviour",
      "bi/authoring/AuthoringBehaviour",
      "bi/authoring/authoringContentView",
      "bi/authoring/plugins/rsAppButtonActions",
      "bi/authoring/utils/rsSaveReportView",
      "bi/authoring/plugins/rsContextMenuActions",
      "bi/authoring/plugins/rsCreateMenuActions",
      "bi/authoring/utils/U_Object",
      "bi/authoring/utils/U_Blocker",
      "bi/authoring/utils/U_ClearableTimeout",
      "bi/authoring/utils/rsPromptHandler",
      "bi/authoring/utils/C_rsRestRequest",
      "bi/authoring/plugins/rsDrillInfoService",
      "bi/authoring/utils/V5ToDashboard",
      "bi/authoring/plugins/rsReportToDashboardService",
      "bi/authoring/DatasetsBehaviour",
      "bi/authoring/datasetsContentView",
      "bi/authoring/common/plugins/rptSetAsHomeActionHandler"
    ],
    "js/classicviewer/bundle": [
      "bi/authoring/common/ReportingBehaviour",
      "bi/classicviewer/nls/ClassicViewerMessages",
      "bi/classicviewer/nls/root/ClassicViewerMessages",
      "bi/classicviewer/nls/StringResource",
      "bi/authoring/utils/pat/rsCommon",
      "bi/classicviewer/ClassicBehaviour",
      "text!bi/authoring/res/DatasetList.xml",
      "bi/authoring/utils/pat/rsLaunchParameters",
      "bi/authoring/utils/pat/rsPromptParameters",
      "bi/authoring/utils/rsPerformance",
      "bi/authoring/utils/C_Defer",
      "bi/authoring/utils/rsIFrameManager",
      "bi/authoring/nls/AuthoringMessages",
      "bi/authoring/nls/root/AuthoringMessages",
      "bi/authoring/nls/StringResource",
      "bi/authoring/utils/rsOpenHelper",
      "bi/authoring/common/utils/rptShareHelper",
      "bi/authoring/utils/U_Blocker",
      "bi/authoring/utils/U_Object",
      "bi/authoring/utils/U_ClearableTimeout",
      "bi/authoring/utils/rsPromptHandler",
      "bi/classicviewer/cvContentView",
      "bi/classicviewer/plugins/cvAppEditButtonAction",
      "bi/classicviewer/plugins/cvAppFormatMenuActions",
      "bi/classicviewer/plugins/cvAppRunButtonAction",
      "bi/classicviewer/plugins/cvAppRefreshButtonAction",
      "bi/classicviewer/plugins/cvAppSaveMenuActions",
      "bi/classicviewer/plugins/cvContextMenuActions",
      "bi/authoring/common/plugins/rptSetAsHomeActionHandler"
    ]
  }
});
