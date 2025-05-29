"use strict";

/**
 * IBM Confidential OCO Source Materials IBM Business Platform: Glass Foundation
 * (C) Copyright IBM Corp. 2018
 *
 * The source code for this program is not published or otherwise divested of
 * its trade secrets, irrespective of what has been deposited with the U.S.
 * Copyright Office
 */
requirejs.config({
  map: {
    "*": {

    }
  },
  bundles: {
    "js/admin/entryBundle": [
      "bi/admin/globalparameters/controller/GlobalParametersController",
      "bi/admin/job/JobCreateButtonView",
      "bi/admin/status/slideout/ScheduleManagementButtonView",
      "bi/admin/nls/admin_client_resources",
      "bi/admin/nls/root/admin_client_resources",
      "bi/admin/nls/StringResource",
      "bi/admin/system/services/SessionLoggingController"
    ],
    "js/admin/manageBundle": [
      "bi/admin/common/utils/AJAXUtils",
      "bi/admin/common/services/ApiBase",
      "bi/admin/datasource/services/ApiSvc",
      "bi/admin/datasource/App",
      "bi/admin/common/utils/CapabilityHelper",
      "bi/admin/common/slideout/admin",
      "bi/admin/system/slideout/PluginsDefinition",
      "bi/admin/common/slideout/AdminPane"
    ],
    "js/admin/dataServerConnectionsBundle": [
      "text!bi/admin/common/templates/Menu.html",
      "bi/admin/common/ui/Menu",
      "bi/admin/common/ui/MenuWithTick",
      "bi/admin/common/ui/GeminiToggleMenuBar",
      "bi/admin/common/ui/ToggleMenuBar",
      "text!bi/admin/common/templates/BasePane.html",
      "bi/admin/common/slideout/BasePane",
      "bi/admin/common/ui/MagicWand",
      "bi/admin/common/ui/listview/ListDataAdaptor",
      "bi/admin/datasource/services/DataSourceListController",
      "bi/admin/datasource/services/DatasourceListAdapter",
      "bi/admin/common/services/ExtensionService",
      "bi/admin/common/Uploader",
      "bi/admin/common/actions/ListAction",
      "bi/admin/common/actions/AddInputRow",
      "text!bi/admin/common/ui/listview/templates/ListViewTemplate.html",
      "text!bi/admin/common/ui/listview/templates/EmptyListViewTemplate.html",
      "bi/admin/common/ui/listview/ListView",
      "text!bi/admin/datasource/templates/DataSourceListTemplate.html",
      "bi/admin/common/dialog/SimpleDialog",
      "bi/admin/datasource/ActionHandler",
      "bi/admin/datasource/ui/DataSourceListView",
      "bi/admin/datasource/slideout/DataSourceListPane"
    ],
    "js/admin/parametersBundle": [
      "bi/admin/globalparameters/helpers/SoapHelper",
      "bi/admin/common/utils/parameters/SimpleParmValueItem",
      "bi/admin/common/utils/parameters/BoundRangeParmValueItem",
      "bi/admin/common/utils/parameters/UnboundedStartRangeParmValueItem",
      "bi/admin/common/utils/parameters/UnboundedEndRangeParmValueItem",
      "bi/admin/common/utils/parameters/HierarchicalParmValueItem",
      "bi/admin/common/utils/parameters/ParameterValue",
      "bi/admin/common/utils/parameters/ParameterValues"
    ],
    "js/admin/jobsBundle": [
      "bi/admin/account/AccountExplorer",
      "bi/admin/account/services/SecurityObjectSelectorAdaptor",
      "text!bi/admin/account/templates/SecurityObjectSelectorTemplate.html",
      "text!bi/admin/account/templates/SecurityObjectExplorerTemplate.html",
      "text!bi/admin/account/templates/CreateNewGroupTemplate.html",
      "text!bi/admin/account/templates/CreateNewUserTemplate.html",
      "bi/admin/account/ui/SecurityObjectExplorerView",
      "bi/admin/account/slideout/SecurityObjectSelectorPane",
      "bi/admin/job/JobPane"
    ]
  }
});