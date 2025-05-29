/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| BI and PM: prmt
 *| (C) Copyright IBM Corp. 2002, 2016
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
*/


/* Use this file to override flags in the prompt controls. */

/*
	Use the following flag to disable search request when the user press Enter in the search input box.
	This is a workaround to prevent searches when users use japanese IME input control.
*/
var Search_DisableEnterKeyAutoSubmit = false;

var SYSTEMPROPERTY_CSEARCH_AUTO_RESIZE_RESULT_LIST = false;

var SYSTEMPROPERTY_CREATE_CUSTOM_SCRIPTS_REFS = true;
var SYSTEMPROPERTY_CUSTOM_SCRIPTS_OVERRIDE_FORM_SUBMIT = false;
var SYSTEMPROPERTY_REORDER_DROPDOWN_VALUES_IN_RANGES = false;
var SYSTEMPROPERTY_REORDER_TEXT_VALUES_IN_RANGES = true;
var SYSTEMPROPERTY_CHANGE_DROPDOWN_BACKGROUNDCOLOR_ALL = false;
var SYSTEMPROPERTY_SELECTVALUE_LINKS_NOWRAP = true;

var SYSTEMPROPERTY_TREE_CACHE_ENABLED = true;
var SYSTEMPROPERTY_TREE_CACHE_IGNORE_PRIOR_RSVP_RESPONSES = false;