"use strict";

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: BI Dashboard
 *| (C) Copyright IBM Corp. 2017, 2019
 *|
 *| US Government Users Restricted Rights - Use, duplication or disclosure
 *| restricted by GSA ADP Schedule Contract with IBM Corp.
 *+------------------------------------------------------------------------+
 */

/**
 * This Class encapsulates raw query result data returned from DSS and provides its accessors and iterators
 **/
define(['../../../lib/@waca/core-client/js/core-client/ui/core/Class', '../../../lib/@waca/dashboard-common/dist/query/FacetDataObject', 'underscore'], function (BaseClass, FacetData, _) {
  'use strict';

  var SingleQueryResult = BaseClass.extend({
    _facetData: null,
    /*QueryResultData Object*/
    _queryThreshHold: 3000,
    _attachedPayload: null,
    _dataViewId: null,
    init: function init(dataViewId, queryResultData, queryThreshold, attachedPayload, queryResultAPI) {
      this._queryThreshHold = queryThreshold;
      this._facetData = queryResultData;
      this._attachedPayload = attachedPayload;
      this._dataViewId = dataViewId;
      this.data = queryResultData; //TODO: Remove this in Endor
      this._queryResultAPI = queryResultAPI;
    },
    getFacetData: function getFacetData() {
      return this._facetData;
    },
    getQueryThreshhold: function getQueryThreshhold() {
      return this._queryThreshHold;
    },
    getTopBottomMappings: function getTopBottomMappings() {
      return this._attachedPayload ? this._attachedPayload.topBottomMappings : {};
    },
    setTopBottomMappings: function setTopBottomMappings(topBottomMappings) {
      this._attachedPayload = this._attachedPayload || {};
      this._attachedPayload.topBottomMappings = topBottomMappings;
    },
    getAttachedPayload: function getAttachedPayload() {
      return this._attachedPayload;
    },
    getHasMoreData: function getHasMoreData() {
      return this._facetDdata ? this._faectData.hasMoreData() : false;
    },
    getDataViewId: function getDataViewId() {
      return this._dataViewId;
    },
    // TODO temporarily provide an API to get the new QueryResultAPI
    getQueryResult: function getQueryResult() {
      return this._queryResultAPI;
    }
  });
  var QueryResultObject = BaseClass.extend({
    _renderContext: null,
    hasMoreData: false,
    queryThreshold: Number.MAX_VALUE,
    init: function init(renderContext) {
      this._aQueryResults = [];
      this._renderContext = renderContext;
    },
    addQueryResultObject: function addQueryResultObject(dataViewId, queryResultData, queryThreshold, attachedPayload, queryResultAPI) {
      this._aQueryResults.push(new SingleQueryResult(dataViewId, queryResultData, queryThreshold, attachedPayload, queryResultAPI));

      // summarize the clipping information among multiple query results
      this.hasMoreData = this.hasMoreData || queryResultData.hasMoreData();
      this.queryThreshold = Math.min(this.queryThreshold, queryThreshold);
    },
    getQueryResultByDataViewId: function getQueryResultByDataViewId(dataViewId) {
      return _.find(this._aQueryResults, function (entry) {
        return entry.getDataViewId() === dataViewId;
      });
    },
    getQueryResultByIndex: function getQueryResultByIndex(index) {
      return this._aQueryResults[index];
    },
    getDefaultQueryResult: function getDefaultQueryResult() {
      return this._aQueryResults[0];
    },
    getQueryResults: function getQueryResults() {
      return this._aQueryResults;
    },
    getRenderContext: function getRenderContext() {
      return this._renderContext;
    },
    /**
     * set top bottom mapping from top bottom spec
     * @param {Object} topBottomSpec
     * @param {int} index - optional. default to 0 if not set
     * eg. { Quantityavg: {
     *			max: xx,
     * 			min: xx
     * 		}, {
     * 		UnitCostsum: {
     * 			max: xx,
     * 			min: xx }
     * 		} }
     */
    setTopBottomMappings: function setTopBottomMappings(topBottomSpec, index) {
      var topBottomMapping = {};
      _.each(topBottomSpec, function (value, key) {
        var facetDataItemMax = new FacetData({
          u: value.max
        });
        var facetDataItemMin = new FacetData({
          u: value.min
        });
        topBottomMapping[key] = {
          bottomResult: facetDataItemMin,
          topResult: facetDataItemMax
        };
      });
      var queryResult = this.getQueryResultByIndex(index || 0);
      queryResult.setTopBottomMappings(topBottomMapping);
    }
  });
  return QueryResultObject;
});
//# sourceMappingURL=QueryResultObject.js.map
