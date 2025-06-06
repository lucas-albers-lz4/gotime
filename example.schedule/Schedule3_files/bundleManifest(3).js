/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Content Explorer
 *| (C) Copyright IBM Corp. 2017, 2020
 *|
 *| US Government Users Restricted Rights - Use, duplication or disclosure
 *| restricted by GSA ADP Schedule Contract with IBM Corp.
 *+------------------------------------------------------------------------+
 */
// eslint-disable-next-line no-undef
requirejs.config({
	paths: {

	},
	map: {
		"*": {

		}
	},
	bundles: {
		"@dashboard-features/coreProfileBundle": [
			"@dashboard-features/contentStoreReferences/js/ContentStoreReferencesAPI",
			"@dashboard-features/contentStoreReferences/js/ContentStoreReferences",
			"@dashboard-features/dashboardDnd/js/api/DashboardDndAPI",
			"@dashboard-features/dashboardDnd/js/DashboardDndImpl",
			"@dashboard-features/dssQueryService/js/dataSources/api/DataSourcesMoserAPI",
			"@dashboard-features/dssQueryService/js/dataSources/api/CalculationUIAPI",
			"@dashboard-features/dssQueryService/js/dataSources/api/CustomGroupUIAPI",
			"@dashboard-features/dssQueryService/js/dataSources/api/CustomBinUIAPI",
			"@dashboard-features/dssQueryService/js/dataSources/api/TaxonomyAPI",
			"@dashboard-features/dssQueryService/js/dataSources/Taxonomy",
			"@dashboard-features/dssQueryService/js/dataSources/MetadataColumn",
			"@dashboard-features/dssQueryService/js/dataSources/DataSource",
			"@dashboard-features/dssQueryService/js/query/v2/v5/api/V5QuerySetAPI",
			"@dashboard-features/dssQueryService/js/query/v2/v5/api/V5QueryAPI",
			"@dashboard-features/dssQueryService/js/query/v2/v5/api/V5DataItemAPI",
			"@dashboard-features/dssQueryService/js/query/v2/v5/V5DataItem",
			"@dashboard-features/dssQueryService/js/query/v2/v5/api/V5DetailFilterAPI",
			"@dashboard-features/dssQueryService/js/query/v2/v5/V5DetailFilter",
			"@dashboard-features/dssQueryService/js/query/v2/v5/api/V5QueryHintAPI",
			"@dashboard-features/dssQueryService/js/query/v2/v5/V5QueryHint",
			"@dashboard-features/dssQueryService/js/query/v2/v5/V5Query",
			"@dashboard-features/dssQueryService/js/query/v2/v5/api/V5QueryResultDefinitionAPI",
			"@dashboard-features/dssQueryService/js/query/v2/v5/api/V5EdgeAPI",
			"@dashboard-features/dssQueryService/js/query/v2/v5/api/V5EdgeGroupAPI",
			"@dashboard-features/dssQueryService/js/query/v2/v5/api/V5ValueSetAPI",
			"@dashboard-features/dssQueryService/js/query/v2/v5/api/V5GroupBodyAPI",
			"@dashboard-features/dssQueryService/js/query/v2/v5/V5GroupBody",
			"@dashboard-features/dssQueryService/js/query/v2/v5/V5ValueSet",
			"@dashboard-features/dssQueryService/js/query/v2/v5/V5EdgeGroup",
			"@dashboard-features/dssQueryService/js/query/v2/v5/V5Edge",
			"@dashboard-features/dssQueryService/js/query/v2/v5/NameGenerator",
			"@dashboard-features/dssQueryService/js/query/v2/v5/V5QueryResultDefinition",
			"@dashboard-features/dssQueryService/js/query/v2/v5/V5QuerySet",
			"@dashboard-features/dssQueryService/js/query/v2/v5/api/V5ExpressionAPI",
			"@dashboard-features/dssQueryService/js/query/v2/v5/expression/V5FilterExpression",
			"@dashboard-features/dssQueryService/js/query/v2/v5/expression/V5ColumnExpression",
			"@dashboard-features/dssQueryService/js/query/v2/v5/expression/V5ExpressionConstant",
			"@dashboard-features/dssQueryService/js/query/v2/v5/expression/V5RankFilterExpression",
			"@dashboard-features/dssQueryService/js/query/v2/dashboardToV5/NoncontextualTopBottomExpressionHelper.v2",
			"@dashboard-features/dssQueryService/js/query/v2/dashboardToV5/FilterHelper.v2",
			"@dashboard-features/dssQueryService/js/query/v2/v5/api/V5RoleValueAPI",
			"@dashboard-features/dssQueryService/js/query/v2/v5/expression/V5FunctionExpression",
			"@dashboard-features/dssQueryService/js/query/v2/v5/api/V5GroupSortAPI",
			"@dashboard-features/dssQueryService/js/query/v2/v5/api/V5SortItemAPI",
			"@dashboard-features/dssQueryService/js/query/v2/v5/V5SortItem",
			"@dashboard-features/dssQueryService/js/query/v2/v5/V5GroupSort",
			"@dashboard-features/dssQueryService/js/query/v2/v5/expression/V5ContextualTopBottomExpression",
			"@dashboard-features/dssQueryService/js/query/v2/v5/expression/V5CalculationExpression",
			"@dashboard-features/dssQueryService/js/query/v2/dashboardToV5/DataItemExpressionHelper.v2",
			"@dashboard-features/dssQueryService/js/query/v2/dashboardToV5/SortHelper.v2",
			"@dashboard-features/dssQueryService/js/query/v2/v5/expression/V5StringExpression",
			"@dashboard-features/dssQueryService/js/query/v2/QueryCalculationHelper.v2",
			"@dashboard-features/dssQueryService/js/query/v2/dashboardToV5/DataItemSetHelper.v2",
			"@dashboard-features/dssQueryService/js/query/v2/queryResult/DataQueryResultItemSet",
			"@dashboard-features/dssQueryService/js/query/v2/queryResult/AbstractDataQueryResult.v2",
			"@dashboard-features/dssQueryService/js/query/v2/queryResult/multiEdge/multiMeasure/MultiMeasureValues.v2",
			"@dashboard-features/dssQueryService/js/query/v2/queryResult/multiEdge/multiMeasure/MultiMeasureEdgeResultInfo.v2",
			"@dashboard-features/dssQueryService/js/query/v2/queryResult/multiEdge/multiMeasure/AbstractMeasuresOnEdgeResultItem.v2",
			"@dashboard-features/dssQueryService/js/query/v2/queryResult/multiEdge/multiMeasure/MeasuresOnEdgeSuppressedTupleMapper.v2",
			"@dashboard-features/dssQueryService/js/query/v2/queryResult/multiEdge/multiMeasure/MeasuresOnEdgeResultItem.v2",
			"@dashboard-features/dssQueryService/js/query/v2/queryResult/multiEdge/multiMeasure/MeasuresOnEdgeMeasuresResultItem.v2",
			"@dashboard-features/dssQueryService/js/query/v2/queryResult/DataQueryResult.v2.multiEdge",
			"@dashboard-features/dssQueryService/js/query/v2/queryResult/DataQueryResult.v2.singleEdge",
			"@dashboard-features/dssQueryService/js/query/v2/queryResult/DataQueryResultBuilder.v2",
			"@dashboard-features/dssQueryService/js/query/v2/Query.v2",
			"@dashboard-features/dssQueryService/js/dataSources/DataSources2",
			"@dashboard-features/dssQueryService/js/dataSets/api/DataSetsAPI",
			"@dashboard-features/dssQueryService/js/dataSets/api/DataSetsInternalAPI",
			"@dashboard-features/dssQueryService/js/dataSets/DataSetQueryBase",
			"@dashboard-features/dssQueryService/js/dataSets/DataSetQueryDataItem",
			"@dashboard-features/dssQueryService/js/dataSets/DataSetQueryModifier",
			"@dashboard-features/dssQueryService/js/dataSets/DatasetQueryPostProcessor",
			"@dashboard-features/dssQueryService/js/dataSets/DataSetModel",
			"@dashboard-features/dssQueryService/js/dataSets/DataSets",
			"@dashboard-features/predictQuery/js/keyDrivers/api/KeyDriversQueryAPI",
			"@dashboard-features/predictQuery/js/keyDrivers/KeyDriversQuery",
			"@dashboard-features/dataFilters/js/api/DataFiltersAPI",
			"@dashboard-features/dataFilters/js/DataFiltersAPISpec",
			"@dashboard-features/dataFilters/js/DataFilters",
			"@dashboard-features/dataFilters/js/api/DataFiltersInternalAPI",
			"@dashboard-features/dataFilters/js/api/DataFilterAPI",
			"@dashboard-features/dataFilters/js/DataFilter",
			"@dashboard-features/dataFilters/js/legacy/PageContextHelper",
			"@dashboard-features/dataFilters/js/legacy/ExistingLocalFilterContextHelper",
			"@dashboard-features/dataFilters/js/legacy/LocalFiltersHelper",
			"@dashboard-features/dataFilters/js/DataFiltersInternal",
			"@dashboard-features/dataFilters/js/query/DataFiltersQueryUtils",
			"@dashboard-features/dataFilters/js/query/DataFiltersQueryModifier",
			"@dashboard-features/dataFilters/js/query/DataFiltersQueryDefinitionModifier",
			"@dashboard-features/dataFilters/js/query/FilterContentQueryModifier",
			"@dashboard-features/dataFilters/js/query/FilterContentQueryDefinitionModifier",
			"@dashboard-features/dataFilters/js/query/CrosstabQueryDefinitionModifier",
			"@dashboard-features/dataFilters/js/DataFilterProviders",
			"@dashboard-features/dssQueryService/js/poweredBy/PoweredByProvider",
			"@dashboard-features/forecast/js/Forecast",
			"@dashboard-features/forecast/js/ForecastQueryModifier",
			"@dashboard-features/insightsNarrator/js/DataVisInsightsQueryParams",
			"@dashboard-features/insightsNarrator/js/DataVisInsightsQuerySpec",
			"@dashboard-features/insightsNarrator/js/BaseInsightsProvider",
			"@dashboard-features/insightsNarrator/js/DataVisInsightsProvider",
			"@dashboard-features/insightsNarrator/js/DriverVisInsightsProvider",
			"@dashboard-features/insightsNarrator/js/InsightsNarratorAPISpec",
			"@dashboard-features/insightsNarrator/js/InsightsNarratorTask",
			"@dashboard-features/insightsNarrator/js/api/InsightsNarratorAPI",
			"@dashboard-features/insightsNarrator/js/InsightsNarrator",
			"@dashboard-features/predictQuery/js/keyDrivers/api/VisKeyDriversAPI",
			"@dashboard-features/predictQuery/js/keyDrivers/api/VisPossibleKeyDriversAPI",
			"@dashboard-features/predictQuery/js/keyDrivers/api/VisFastPatternDetectionAPI",
			"@dashboard-features/predictQuery/js/keyDrivers/api/VisKeyDriversScopingAPI",
			"@dashboard-features/predictQuery/js/keyDrivers/VisPossibleKeyDrivers",
			"@dashboard-features/predictQuery/js/keyDrivers/VisFastPatternDetection",
			"@dashboard-features/predictQuery/js/keyDrivers/VisKeyDriversScoping",
			"@dashboard-features/predictQuery/js/keyDrivers/KeyDriversTask",
			"@dashboard-features/predictQuery/js/keyDrivers/VisKeyDriversAPISpec",
			"@dashboard-features/predictQuery/js/keyDrivers/VisKeyDrivers",
			"@dashboard-features/smartAnnotations/js/api/SmartSuggestionsAPI",
			"@dashboard-features/smartAnnotations/js/SuggestionTask",
			"@dashboard-features/smartAnnotations/js/AnnotationTask",
			"@dashboard-features/smartAnnotations/js/SmartAnnotationProvider",
			"@dashboard-features/smartAnnotations/js/SmartAnnotations",
			"@dashboard-features/smartAnnotations/js/StatsQueryModifier",
			"@dashboard-features/smartAnnotations/js/api/AnnotatedResultsAPI",
			"@dashboard-features/smartAnnotations/js/AnnotatedResults",
			"@dashboard-features/smartAnnotations/js/SmartsExecution"
		],
		"@dashboard-features/consumeProfileBundle": [
			"@dashboard-features/dataFilters/js/content/FilterContentAPISpec",
			"@dashboard-features/dataFilters/js/content/FilterContent",
			"@dashboard-features/dataFilters/js/content/FilterContentProvider",
			"@dashboard-features/dataFilters/js/api/FilterControlAddOnsAPI",
			"@dashboard-features/dataFilters/js/FilterControlAddOns",
			"@dashboard-features/dataFilters/js/cascadingFilters/CascadingFiltersPropertiesProvider",
			"@dashboard-features/dataFilters/js/api/CascadingFiltersAPI",
			"@dashboard-features/dataFilters/js/api/FilterControlAddOnAPI",
			"@dashboard-features/dataFilters/js/cascadingFilters/CascadingFilters",
			"@dashboard-features/dataFilters/js/api/CascadeStrategyAPI",
			"@dashboard-features/dataFilters/js/cascadingFilters/FirstToLastClearStrategyProvider",
			"@dashboard-features/dataFilters/js/cascadingFilters/MultiDirectionClearStrategyProvider",
			"@dashboard-features/forecast/js/indicator/internal/ForecastPredictComponents",
			"@dashboard-features/forecast/js/multivariate/ForecastDndOptionalFactorItemHandler",
			"@dashboard-features/forecast/js/multivariate/ForecastOptionalFactorFieldDropdown",
			"@dashboard-features/forecast/js/multivariate/ForecastOptionalFactorPlaceHolder",
			"@dashboard-features/forecast/js/multivariate/ForecastOptionalFactorDeleteAction",
			"@dashboard-features/forecast/js/multivariate/ForecastOptionalFactorActionHandler",
			"@dashboard-features/forecast/js/multivariate/ForecastOptionalFactorFieldItem",
			"@dashboard-features/forecast/js/multivariate/ForecastOptionalFactorFlyout",
			"@dashboard-features/forecast/js/multivariate/ForecastOptionalFactorItem",
			"@dashboard-features/forecast/js/multivariate/ForecastOptionalFactorA11YHandler",
			"@dashboard-features/forecast/js/multivariate/ForecastOptionalFactorsSection",
			"text!@dashboard-features/forecast/js/indicator/templates/ForecastIndicator.html",
			"@dashboard-features/forecast/js/indicator/ForecastIndicator",
			"@dashboard-features/forecast/js/view/ForecastSection",
			"@dashboard-features/insightsNarrator/js/view/ChartInsightsItemActions",
			"@dashboard-features/insightsNarrator/js/util/UnescapedString",
			"@dashboard-features/insightsNarrator/js/util/AnimationConst",
			"@dashboard-features/insightsNarrator/js/view/ChartInsightsListItem",
			"@dashboard-features/insightsNarrator/js/view/ChartInsightsList",
			"@dashboard-features/insightsNarrator/js/view/InsightsNarratorSectionAPISpec",
			"text!@dashboard-features/insightsNarrator/js/templates/InsightsIndicator.html",
			"@dashboard-features/insightsNarrator/js/api/InsightsIndicatorAPI",
			"@dashboard-features/insightsNarrator/js/InsightsIndicatorAPISpec",
			"@dashboard-features/insightsNarrator/js/InsightsIndicator",
			"@dashboard-features/insightsNarrator/js/view/InsightsNarratorSection",
			"@dashboard-features/print-client/js/PrintClientAPI",
			"@dashboard-features/print-client/js/PrintClient",
			"@dashboard-features/save/js/SaveAPI",
			"@dashboard-features/save/js/Save",
			"@dashboard-features/smartAnnotations/js/view/AnalyticMessages",
			"@dashboard-features/smartAnnotations/js/view/AnalyticsViewCtrl",
			"@dashboard-features/smartAnnotations/js/api/AnalyticsViewAPI",
			"@dashboard-features/smartAnnotations/js/view/AnalyticsView",
			"@dashboard-features/smartAnnotations/js/internal/SAToggleButtons",
			"@dashboard-features/smartAnnotations/js/internal/FPDMessages",
			"@dashboard-features/smartAnnotations/js/api/SmartsIndicatorAPI",
			"text!@dashboard-features/smartAnnotations/js/templates/SmartAnnotiationsIndicator.html",
			"@dashboard-features/smartAnnotations/js/SmartsIndicator",
			"@dashboard-features/smartAnnotations/js/view/InsightsSection",
			"@dashboard-features/staticOutput/js/api/StaticOutputAPI",
			"@dashboard-features/staticOutput/js/StaticOutput",
			"@dashboard-features/caActions/js/datapoint/customGroupAction/api/CustomGroupActionAPI",
			"@dashboard-features/caActions/js/datapoint/customGroupAction/CustomGroupAction",
			"@dashboard-features/caActions/js/content/navigateAction/api/NavigationGroupsAPI",
			"@dashboard-features/caActions/js/content/navigateAction/NavigationGroupsAPISpec",
			"@dashboard-features/caActions/js/content/navigateAction/NavigationGroups",
			"@dashboard-features/caActions/js/content/navigateAction/api/NavigateActionAPI",
			"@dashboard-features/caActions/js/content/navigateAction/NavigateAction",
			"@dashboard-features/dataFilters/js/DataFiltersSelectionProvider",
			"@dashboard-features/dataFilters/js/api/LocalFiltersUIAPI",
			"@dashboard-features/dataFilters/js/LocalFiltersUI",
			"@dashboard-features/dataFilters/js/api/CascadeSetsAPI",
			"@dashboard-features/dataFilters/js/api/CascadeSetsUpdateControllerAPI",
			"@dashboard-features/dataFilters/js/cascadingFilters/CascadeSetsUpdateController",
			"@dashboard-features/dataFilters/js/api/CascadeSetAPI",
			"@dashboard-features/dataFilters/js/cascadingFilters/CascadeSetAPISpec",
			"@dashboard-features/dataFilters/js/cascadingFilters/CascadeSet",
			"@dashboard-features/dataFilters/js/cascadingFilters/CascadeSetsAPISpec",
			"@dashboard-features/dataFilters/js/cascadingFilters/CascadeSets",
			"@dashboard-features/dataFilters/js/content/DataPointFilterAction",
			"@dashboard-features/forecast/js/ForecastPropertiesProvider",
			"@dashboard-features/insightsNarrator/js/InsightNarratorTracking",
			"@dashboard-features/predictQuery/js/possibleKeyDriverAction/PossibleKeyDriverAction",
			"@dashboard-features/dataFilters/js/api/FiltersUIAPI",
			"@dashboard-features/dataFilters/js/FiltersUIAPISpec",
			"@dashboard-features/dataFilters/js/FiltersUI"
		],
		"@dashboard-features/authoringProfileBundle": [
			"@dashboard-features/caActions/js/slot/calculationAction/CalculationAction"
		]
	}
});
