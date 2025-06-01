/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: authoring
	(C) Copyright IBM Corp. 2015, 2018
	The source code for this program is not published or otherwise divested
	of its trade secrets, irrespective of what has been deposited with the
	U.S. Copyright Office.
*/

define('bi/authoring/nls/AuthoringMessages',{
	"root": true,
	"cs": true,
	"cy": true,
	"da": true,
	"de": true,
	"es": true,
	"fi": true,
	"fr": true,
	"gl": true,
	"hr": true,
	"hu": true,
	"it": true,
	"ja": true,
	"kk": true,
	"ko": true,
	"nb": true,
	"nl": true,
	"no": true,
	"pl": true,
	"pt": true,
	"pt-br": true,
	"ro": true,
	"ru": true,
	"sl": true,
	"sv": true,
	"th": true,
	"tr": true,
	"zh": true,
	"zh-cn": true,
	"zh-tw": true
});

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Authoring
 *| (C) Copyright IBM Corp. 2015, 2022
 *|
 *| US Government Users Restricted Rights - Use, duplication or disclosure
 *| restricted by GSA ADP Schedule Contract with IBM Corp.
 *+------------------------------------------------------------------------+
 */

define('bi/authoring/nls/root/AuthoringMessages',{
	authoring_welcome: 'Reporting',
	viewer_welcome: 'Reporting',
	dataset_welcome: 'Data set',
	report_view_of: 'Report view of %{reportName}',
	powerplay_view_of: 'PowerPlay view of %{reportName}',
	no_action_available: 'You are currently not authorized to access this object.',
	no_output_available: 'There is currently no report output available.',
	no_version_ok: 'View latest version',
	no_version_title: 'Version not found',
	no_version_message: 'The report output version cannot be found. Would you like to view the latest version?',
	no_output_format_capability: 'The user does not have the assigned capability to generate %{outputFormat} output.',
	ok_button_label: 'OK'
});


/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: authoring
	(C) Copyright IBM Corp. 2015, 2018
	The source code for this program is not published or otherwise divested
	of its trade secrets, irrespective of what has been deposited with the
	U.S. Copyright Office.
*/

define('bi/authoring/nls/StringResource',['i18n!bi/authoring/nls/AuthoringMessages', 'bi/glass/utils/Lexicon'], function(localeResources, Lexicon) {
	'use strict';

	var lexicon = new Lexicon( { data: localeResources, verbose: true } );

	var StringResources = function()
	{
		return undefined;
	};

	/**
	 * Get the string resource for the given key and interpolation options
	 *
	 * @param key						The  key of the string to return
	 * @param interpolationOptions		Optional interpolation options (see poly.t documentation for details)
	 * @returns							The string to display
	 */
	StringResources.prototype.get = function(key, interpolationOptions)
	{
		return lexicon.translate(key, interpolationOptions);
	};

	return new StringResources();
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: authoring
	(C) Copyright IBM Corp. 2015, 2018
	The source code for this program is not published or otherwise divested
	of its trade secrets, irrespective of what has been deposited with the
	U.S. Copyright Office.
*/

define('bi/classicviewer/nls/ClassicViewerMessages',{
	"root": true,
	"cs": true,
	"cy": true,
	"da": true,
	"de": true,
	"es": true,
	"fi": true,
	"fr": true,
	"gl": true,
	"hr": true,
	"hu": true,
	"it": true,
	"ja": true,
	"kk": true,
	"ko": true,
	"nb": true,
	"nl": true,
	"no": true,
	"pl": true,
	"pt": true,
	"pt-br": true,
	"ro": true,
	"ru": true,
	"sl": true,
	"sv": true,
	"th": true,
	"tr": true,
	"zh": true,
	"zh-cn": true,
	"zh-tw": true
});

/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Authoring
 *| (C) Copyright IBM Corp. 2015, 2021
 *|
 *| US Government Users Restricted Rights - Use, duplication or disclosure
 *| restricted by GSA ADP Schedule Contract with IBM Corp.
 *+------------------------------------------------------------------------+
 */

define('bi/classicviewer/nls/root/ClassicViewerMessages',{
	classicviewer_welcome: 'Reporting',
	viewer_welcome: 'Reporting',
	no_write_permission:
		'You do not have the appropriate permissions to save the object.',
	invalid_refresh: 'Browser refresh is not supported.',

	formatHTML: 'HTML',
	formatXHTML: 'XHTML',
	formatHTMLFragment: 'HTMLFragment',
	formatXHTMLFragment: 'XHTMLFragment',
	formatPDF: 'PDF',
	formatspreadsheetML: 'Excel',
	formatxlsxData: 'Excel data',
	formatCSV: 'CSV',
	formatXML: 'XML'
});


/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: authoring
	(C) Copyright IBM Corp. 2015, 2015
	The source code for this program is not published or otherwise divested
	of its trade secrets, irrespective of what has been deposited with the
	U.S. Copyright Office.
*/


define('bi/classicviewer/nls/StringResource',['i18n!bi/classicviewer/nls/ClassicViewerMessages', 'bi/glass/utils/Lexicon'], function(localeResources, Lexicon) {
	'use strict';

	var lexicon = new Lexicon( { data: localeResources, verbose: true } );

	var StringResources = function()
	{
		return undefined;
	};

	/**
	 * Get the string resource for the given key and interpolation options
	 *
	 * @param key						The  key of the string to return
	 * @param interpolationOptions		Optional interpolation options (see poly.t documentation for details)
	 * @returns							The string to display
	 */
	StringResources.prototype.get = function(key, interpolationOptions)
	{
		return lexicon.translate(key, interpolationOptions);
	};

	return new StringResources();
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
	(C) Copyright IBM Corp. 2003, 2022
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define('bi/authoring/utils/pat/rsCommon',[
	'jquery',
	'doT',
	'bi/commons/utils/Downloader',
	'bi/classicviewer/nls/StringResource'
	],
function($, dot, Downloader, ClassicStringResource) {
	'use strict';


	var k_oDownloadOnlyOutputFormats = new Set(["spreadsheetML", "xlsxData", "CSV", "XML"] );

	var k_sOutputTypeToFileExtension =
	{
		HTML: ".htm",
		XHTML: ".htm",
		HTMLFragment: ".htm",
		XHTMLFragment: ".htm",
		PDF: ".pdf",
		XML: ".xml",
		CSV: ".csv",
		spreadsheetML: ".xlsx",
		xlsxData: ".xlsx",
		MHT: ".mht"
	};

	/**
	 * convert UTC date string to local date string
	 */
	function utcToLocalString(v_sUTCDate)
	{
		var localDate = new Date(v_sUTCDate);
		return ([localDate.getFullYear(), ('0' + (localDate.getMonth() + 1)).slice(-2), ('0' + localDate.getDate()).slice(-2)].join('-')) + ' ' +
			([('0' + localDate.getHours()).slice(-2), ('0' + localDate.getMinutes()).slice(-2), ('0' + localDate.getSeconds()).slice(-2)].join(':'));
	}

	function isObjectOfTypeImpl( cmProperties, v_oType )
	{
		if (cmProperties)
		{
			if (Array.isArray(v_oType))
			{
				for (var idx = 0; idx < v_oType.length; ++idx)
				{
					if (isObjectOfTypeImpl(cmProperties, v_oType[idx]))
					{
						return true;
					}
				}
				return false;
			}

			if (cmProperties.base && cmProperties.base[0].type === v_oType)
			{
				return true;
			}
			switch (cmProperties.type)
			{
				case v_oType:
					return true;

				case 'reportVersion':
				case 'output':
					// Check type of parent
					return isObjectOfTypeImpl(cmProperties.parent && cmProperties.parent[0], v_oType);
			}
		}
		return false;
	}

	function generateSavedOutputNameImpl( v_oOutput, v_bFormatSuffix )
	{
		const v_bInteractive = isObjectOfTypeImpl(v_oOutput, 'interactiveReport');
		// Report is before last ancestor
		var v_oReport = (v_oOutput.ancestors && v_oOutput.ancestors.length > 1) ? v_oOutput.ancestors[v_oOutput.ancestors.length - 2] : null;
		var v_sReportName = v_oReport ? v_oReport.defaultName : "";
		let v_sFormatSuffix = '';
		if (v_bFormatSuffix !== false)
		{
			v_sFormatSuffix = " - " + (v_bInteractive ? "MHT" : ClassicStringResource.get("format" + v_oOutput.format));
		}
		return v_sReportName + " - " + utcToLocalString(v_oOutput.modificationTime).substring(0, 10) + v_sFormatSuffix;
	}


	return {
		getNodeText: function(v_nNode)
		{
			const ATTRIBUTE_NODE = 2;
			return v_nNode && (v_nNode.nodeType == ATTRIBUTE_NODE ? v_nNode.nodeValue : v_nNode.textContent);
		},

		parseXML: function(v_sXML)
		{
			if (v_sXML)
			{
				if (window.DOMParser)
				{
					return (new window.DOMParser()).parseFromString(v_sXML, "text/xml");
				}
				if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM"))
				{
					const xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
					xmlDoc.async = "false";
					xmlDoc.loadXML(v_sXML);
					return xmlDoc;
				}
			}
			return null;
		},

		reject: function( deferred, msg, tag )
		{
			console.log( (tag ? (tag + ': ') : '' ) + msg );
			deferred.reject( new Error(msg) );

			return deferred.promise;
		},

		isObjectOfType: function( cmProperties, v_oType )
		{
			return isObjectOfTypeImpl( cmProperties, v_oType );
		},

		createTemplateParameters: function(v_oRSParameters)
		{
			var v_oTemplateParameters = {};

			v_oTemplateParameters.rsUrl = "pat/rsapp.htm";

			v_oTemplateParameters.rsParameters = JSON.stringify(v_oRSParameters);

			return v_oTemplateParameters;
		},

		/**
		 * Takes an object representing global parameter values where the name of the parameter is used
		 * as the the object property name and converts to an array of parameter values.
		 * e.g.
		 *  { 'product': {'name': 'product', 'values': [...]}, 'date': {'name':'date', 'values':[...]} }
		 * becomes
		 *  [ {'name': 'product', 'values': [...]}, {'name':'date', 'values':[...]} ]
		 */
		convertToArray: function( v_oParameterValues )
		{
			const v_aParameterValues = [];

			if (v_oParameterValues != null)
			{
				for (var v_sKey in v_oParameterValues)
				{
					if (v_oParameterValues.hasOwnProperty(v_sKey) && v_oParameterValues[v_sKey])
					{
						v_aParameterValues.push( v_oParameterValues[v_sKey] );
					}
				}
			}

			return v_aParameterValues;
		},

		extractGlassSettings: function( options )
		{
			var glassSettings;
			if (typeof options.ui_appbar !== 'undefined' || typeof options.ui_navbar !== 'undefined' || typeof options.ui_toolbar !== 'undefined')
			{
				glassSettings = {};
				// Anything other than true is considered false by glass
				if (typeof options.ui_appbar !== 'undefined' && options.ui_appbar !== true)
				{
					glassSettings.ui_appbar = false;
				}
				if (typeof options.ui_navbar !== 'undefined' && options.ui_navbar !== true)
				{
					glassSettings.ui_navbar = false;
				}
				if (typeof options.ui_toolbar !== 'undefined')
				{
					// Need to specify both true and false so it can override ui_appbar
					// Like glass, anything other than 'true' is considered false
					glassSettings.ui_toolbar = options.ui_toolbar === true;
				}
			}
			return glassSettings;
		},

		isOutputFormatAllowed: function(v_sOutputFormat, glassContext)
		{
			switch (v_sOutputFormat)
			{
				case "CSV":
					return glassContext.hasCapability("canGenerateCSVOutput");

				case "XML":
					return glassContext.hasCapability("canGenerateXMLOutput");

				case "PDF":
					return glassContext.hasCapability("canGeneratePDFOutput");

				case "spreadsheetML":
				case "xlsxData":
					return glassContext.hasCapability("canGenerateXLSOutput");

				default:
					//"HTML"
			}
			return true;
		},

		_hackFindPlugin: function(appView, id)
		{
			// If we used glassContext.findPlugin() it will find
			// plugins from the current perspective -- which MAY NOT be us!
			//
			// instead use the registeredPlugins on our app view
			// HACK - glass does not provide away to go from content-view to app-view
			// so have to use our cached value
			var plugin;
			if (id && appView )
			{
				plugin = appView.registeredPlugins[id];
			}
			return plugin;
		},

		hackLockGlass: function(appView) {
			// glassContext.lockGlass() locks the glass for the current perspective
			// we only want to lock the glass for our perspective
			// when lockglass is called we may not be the current perspective
			// HACK until glass provides
			//console.log('rsCommon.hackLockGlass');
			if (appView)
			{
				appView.$('.navbar').addClass('disabled');
				appView.$('.appbar').addClass('disabled');
			}
		},

		hackUnlockGlass: function(appView)
		{
			// glassContext.lockGlass() locks the glass for the current perspective
			// we only want to lock the glass for our perspective
			// when lockglass is called we may not be the current perspective
			// HACK until glass provides
			//console.log('rsCommon.hackUnlockGlass');
			if (appView)
			{
				appView.$('.navbar').removeClass('disabled');
				appView.$('.appbar').removeClass('disabled');
			}
		},

		getAuthoringApplicationFromIFrame: function(iFrame)
		{
			return iFrame && iFrame.contentWindow && iFrame.contentWindow.Application;
		},

		F_XMLEncode: function(v_sString)
		{
			// &lt; for <
			// &gt; for >
			// &amp; for &
			// &apos; for ' (required for attribute values delimited by the same character)
			// &quot; for " (required for attribute values delimited by the same character)
			return v_sString.replace( /&/g, "&amp;" ).replace( /</g, "&lt;" ).replace( />/g, "&gt;" ).replace( /'/g, "&apos;" ).replace( /"/g, "&quot;" );
		},

		/**
		 * The content view getContent method adds cmProperties to the response.  However, when the resulting URL is submitted after pressing F5,
		 * the cmProeprties is passed to the content view init() method not as the original object but rather a series of properties whose name is
		 * "cmProperties[prop name]".
		 * To avoid this unexpected flatening of the object, getContent puts the JSON string representation of cmProperties instead.
		 * In the case of saved output, reportProperties is also stringified.
		 * This method turns these string back into the original object form.
		 */
		decodeAndMoveCMProperties: function(options)
		{
			if (options && options.cmPropStr && !options.cmProperties)
			{
				var v_oCmProperties;

				try
				{
					v_oCmProperties = JSON.parse(options.cmPropStr);
				}
				catch (e)
				{
					v_oCmProperties = null;
				}
				if (v_oCmProperties)
				{
					options.cmProperties = v_oCmProperties;
				}
			}
			delete options.cmPropStr;

			if (options && options.reportPropStr && !options.reportProperties)
			{
				var v_oReportProperties;

				try
				{
					v_oReportProperties = JSON.parse(options.reportPropStr);
				}
				catch (e)
				{
					v_oReportProperties = null;
				}
				if (v_oReportProperties)
				{
					options.reportProperties = v_oReportProperties;
				}
			}
			delete options.reportPropStr;
		},

		/**
		 * rsEncodedOptions are used to pass rs options in such a way as to avoid any possible conflict with other
		 * parameters that exist or may exist in the future that originate from some other component.
		 */
		decodeAndMoveRSOptions: function(options)
		{
			if (options && options.rsEncodedOptions)
			{
				// options.rsEncodedOptions exists, decode it and copy it into options
				var v_oRsOptions = JSON.parse(options.rsEncodedOptions);

				Object.keys(v_oRsOptions).forEach( function(v_sKey) {
					options[v_sKey] = v_oRsOptions[v_sKey];
					});

				delete options.rsEncodedOptions;
			}
		},

		M_aConvertList: [
			'isViewer',
			'isNew',
			'isApplication',
			'a11y',
			'bidi',
			'runInAdvancedViewer',
			'prompt',
			'rsFinalRunOptions',
			'promptParameters',
			'ui_appbar',
			'ui_navbar',
			'ui_toolbar'
		],

		convertStringQSToValues: function(options, glassContext, trimURLParameterValues)
		{
			var v_bStringOnlyQS = glassContext.getCoreSvc('.FeatureChecker').checkValue('ba-glass', 'stringOnlyQS', 'enabled');
			if (!v_bStringOnlyQS)
			{
				return;
			}

			for (var propertyName in options)
			{
				if (options[propertyName])
				{
					if (this.M_aConvertList.indexOf(propertyName) != -1)
					{
						if (typeof options[propertyName] === 'object')
						{
							this.convertStringQSToValues(options[propertyName], glassContext);
						}
						else if (typeof options[propertyName] === 'string')
						{
							if (options[propertyName] === 'true')
							{
								options[propertyName] = true;
							}
							else if (options[propertyName] === 'false')
							{
								options[propertyName] = false;
							}
							else
							{
								var v_numberValue = Number(options[propertyName]);
								options[propertyName] = isNaN(v_numberValue) ? options[propertyName] : v_numberValue;
							}
						}
					}
					else if (propertyName.indexOf('p_') == 0 && trimURLParameterValues === true)
					{
						options[propertyName] = options[propertyName].trim();
					}
				}
			}
		},

		getAvailableOutputs: function(glassContext, v_oOutputProperties)
		{
			return glassContext.getSvc('.Content')
			.then(function(v_oContentSvc) {
				var v_sCMQueryUrl = v_oContentSvc.getBaseObjectsURL() + '/' + v_oOutputProperties.parent[0].id + '/outputs?fields=dataDescriptor,parent,locale,format,permissions,ancestors,lastPage';
				return v_oContentSvc.get(v_sCMQueryUrl, {});
			});
		},

		/**
		 * Generic implementation of glass getContent method.
		 * @param options The options parameter passed from glass
		 * @param v_oContentView	The actual content view instance (rv or cv) being called
		 * @param rptShareHelper		Pass share helper module to avoid having to declare it and introduce circular dependency
		 */
		getContent: function( options, v_oContentView, rptShareHelper )
		{
			var v_bOnlyBookmarkContent = options && options.mode == "bookmark";

			var v_oReturn = {};

			var v_oCmProperties;
			if (v_oContentView.cmProperties)
			{
				// Start with the basic share link
				v_oReturn = rptShareHelper.buildShareUrlMap(v_oContentView);

				// The glass adds the perspective to the URL created from the getContent response.
				// As a result, when the URL is processed by the browser (via F5 or copy/paste)
				// it is not handled as a share link due to the presence of the perspective.
				// Therefore the authoring code that expands the share link information to the full set of data needed by authoring is not called.
				// As a result, we are forced to add additional information to ensure the URL created from the getContent response
				// actually works.

				// Need minimal cm property information
				v_oCmProperties = {
						id: v_oContentView.cmProperties.id,
						type: v_oContentView.cmProperties.type,
						defaultName: v_oContentView.cmProperties.defaultName,
						permissions: v_oContentView.cmProperties.permissions
					  };
				if (v_oContentView.cmProperties.type == 'output')
				{
					// Saved output requires more info
					v_oCmProperties.defaultName = generateSavedOutputNameImpl(v_oContentView.cmProperties);
					v_oCmProperties.modificationTime = v_oContentView.cmProperties.modificationTime;
					v_oCmProperties.format = v_oContentView.cmProperties.format;
					if (v_oContentView.cmProperties.parent && v_oContentView.cmProperties.parent.length > 0)
					{
						v_oCmProperties.parent = [
							{
								id: v_oContentView.cmProperties.parent[0].id,
								type: v_oContentView.cmProperties.parent[0].type
							}
						];
					}

					if (v_oContentView.reportProperties)
					{
						v_oReturn.reportPropStr = JSON.stringify( {
								id: v_oContentView.reportProperties.id,
								type: v_oContentView.reportProperties.type,
								defaultName: v_oContentView.reportProperties.defaultName
							} );
					}
					v_oReturn.type = 'output';
					delete v_oReturn.objRef;
				}
				v_oReturn.cmPropStr = JSON.stringify( v_oCmProperties );
			}
			if (v_oContentView.id)
			{
				v_oReturn.id = v_oContentView.id;
			}

			if (!v_bOnlyBookmarkContent)
			{
				v_oReturn.application = v_oContentView.getApplicationContent( v_oReturn, v_oCmProperties );
			}
			else
			{
				// APAR 120836 REPORT FAILS TO RUN IN IE11 IF THE DRILL-THROUGH PROMPTPARAMETER VALUES ARE LARGER THAN 2,083 CHAR LIMIT
				// On bookmark, remove the prompt params as that can make the URL too long leading to a long REFERER header
				delete v_oReturn.promptParameters;
			}

			return v_oReturn;
		},

		/**
		 * Generate the name used to represent saved output.
		 * @param {object} The output object whose name is generated
		 * @param {bool} Whether or not to include the format in the name, true if unspecified
		 * @return The name representing the output object
		 */
		generateSavedOutputName: function( v_oOutput, v_bFormatSuffix )
		{
			return generateSavedOutputNameImpl( v_oOutput, v_bFormatSuffix );
		},

		/**
		 * @param {string} v_sOutputFormat The format to check
		 * @returns Whether or not the specified format should be downloaded
		 */
		isOutputForDownload: function(v_sOutputFormat)
		{
			return k_oDownloadOnlyOutputFormats.has(v_sOutputFormat);
		},

		/**
		 * @param {string} v_sOutputType The output format to process
		 * @returns The filename extension (including .) for the given format
		 */
		outputTypeToFileExtension: function( v_sOutputType )
		{
			return k_sOutputTypeToFileExtension[v_sOutputType];
		},

		/**
		 * Download the specified resource.
		 * @param {string} The URL of the resource to be downloaded
		 * @param {string} The file name to be used if the response does not specify a name
		 */
		download: function( v_sURL, v_sFileName )
		{
			return new Downloader({
				'url': v_sURL,
				'name': v_sFileName
			}).doDownload().catch( function(err) {
				console.log('rsCommon.download FAILED ' + (err.message || "") );
			});
		}
	};
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
	(C) Copyright IBM Corp. 2017, 2022
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define('bi/authoring/utils/pat/rsPromptParameters',['bi/authoring/utils/pat/rsCommon'], function(rsCommon) {
	'use strict';

	//F_XMLEncode
	function xmlEncode(v_sString)
	{
		// &lt; for <
		// &gt; for >
		// &amp; for &
		// &apos; for ' (required for attribute values delimited by the same character)
		// &quot; for " (required for attribute values delimited by the same character)
		return v_sString.replace( /&/g, "&amp;" ).replace( /</g, "&lt;" ).replace( />/g, "&gt;" ).replace( /'/g, "&apos;" ).replace( /"/g, "&quot;" );
	}

	function addClassicViewerPrompts(v_elForm, v_aPromptParameters)
	{
		//Simple prompt values: p_Product = Bear+Edge
		for (var i = 0; i < v_aPromptParameters.length; i++)
		{
			var v_oParameter = v_aPromptParameters[i];
			if (Array.isArray(v_oParameter.value))
			{
				for (var j = 0; j < v_oParameter.value.length; j++)
				{
					var v_elInput = v_elForm.appendChild( document.createElement("input") );
					v_elInput.type = "hidden";
					v_elInput.name = v_oParameter.name;
					v_elInput.value = v_oParameter.value[j];
				}
			}
			else
			{
				var v_elInput = v_elForm.appendChild( document.createElement("input") );
				v_elInput.type = "hidden";
				v_elInput.name = v_oParameter.name;
				v_elInput.value = v_oParameter.value != undefined ? v_oParameter.value : "";
			}
		}
	}

	function buildSelectOptionXML(v_oValue)
	{
		const use = v_oValue.use != undefined ? 'useValue="' + xmlEncode(v_oValue.use.toString()) + '"' : "nullUse=\"1\"";
		return "<selectOption " + use + (v_oValue.hasOwnProperty("display") ? (" displayValue=\"" + xmlEncode(v_oValue.display.toString()) + "\"") : "") + "/>";
	}

	function buildBoundRangeXML(v_oValue)
	{
		const startUse = v_oValue.boundRange.start.use != undefined ? 'useValue="' + xmlEncode(v_oValue.boundRange.start.use.toString()) + '"' : "nullUse=\"1\"";
		const endUse = v_oValue.boundRange.end.use != undefined ? 'useValue="' + xmlEncode(v_oValue.boundRange.end.use.toString()) + '"' : "nullUse=\"1\"";
		return "<selectBoundRange>" +
				"<start " + startUse +
					(v_oValue.boundRange.start.hasOwnProperty("display") ? (" displayValue=\"" + xmlEncode(v_oValue.boundRange.start.display.toString()) + "\"") : "") + "/>" +
				"<end " + endUse +
					(v_oValue.boundRange.end.hasOwnProperty("display") ? (" displayValue=\"" + xmlEncode(v_oValue.boundRange.end.display.toString()) + "\"") : "") + "/>" +
			"</selectBoundRange>";
	}

	function buildUnboundedEndRangeXML(v_oValue)
	{
		const startUse = v_oValue.unboundedEndRange.start.use != undefined ? 'useValue="' + xmlEncode(v_oValue.unboundedEndRange.start.use.toString()) + '"' : "nullUse=\"1\"";
		return "<selectUnboundedEndRange>" +
					"<start " + startUse +
						(v_oValue.unboundedEndRange.start.hasOwnProperty("display") ? (" displayValue=\"" + xmlEncode(v_oValue.unboundedEndRange.start.display.toString()) + "\"") : "") + "/>" +
				"</selectUnboundedEndRange>";
	}

	function buildUnboundedStartRangeXML(v_oValue)
	{
		const endUse = v_oValue.unboundedStartRange.end.use != undefined ? 'useValue="' + xmlEncode(v_oValue.unboundedStartRange.end.use.toString()) + '"' : "nullUse=\"1\"";
		return "<selectUnboundedStartRange>" +
					"<end " + endUse +
						(v_oValue.unboundedStartRange.end.hasOwnProperty("display") ? (" displayValue=\"" + xmlEncode(v_oValue.unboundedStartRange.end.display.toString()) + "\"") : "") + "/>" +
				"</selectUnboundedStartRange>";
	}

	function convertPromptValuesToXML(v_aValues)
	{
		var v_sXMLValues = "";
		for (var i = 0; i < v_aValues.length; i++)
		{
			var v_oValue = v_aValues[i];
			if (v_oValue.hasOwnProperty("boundRange"))
			{
				if (v_oValue.boundRange.start && v_oValue.boundRange.end)
				{
					v_sXMLValues += buildBoundRangeXML(v_oValue);
				}
				else
				{
					console.log("rsPromptParameters.convertPromptValuesToXML ... unexpected boundRange format.");
					break;
				}
			}
			else if (v_oValue.hasOwnProperty("unboundedEndRange"))
			{
				if (v_oValue.unboundedEndRange.start)
				{
					v_sXMLValues += buildUnboundedEndRangeXML(v_oValue);
				}
				else
				{
					console.log("rsPromptParameters.convertPromptValuesToXML ... unexpected unboundedEndRange format.");
					break;
				}
			}
			else if (v_oValue.hasOwnProperty("unboundedStartRange"))
			{
				if (v_oValue.unboundedStartRange.end)
				{
					v_sXMLValues += buildUnboundedStartRangeXML(v_oValue);
				}
				else
				{
					console.log("rsPromptParameters.convertPromptValuesToXML ... unexpected unboundStartRange format.");
					break;
				}
			}
			else
			{
				v_sXMLValues += buildSelectOptionXML(v_oValue);
			}
		}

		return v_sXMLValues;
	}

	function convertComplexParameterToClassicViewerXML(v_oPromptParametersXML, v_aComplexParameterObject)
	{
		for (var i = 0; i < v_aComplexParameterObject.length; i++)
		{
			var v_oPromptParameter = v_aComplexParameterObject[i];
			var v_sName = v_oPromptParameter.name;
			var v_aValues = v_oPromptParameter.value;
			var v_sValues = convertPromptValuesToXML( Array.isArray(v_aValues) ? v_aValues : [v_aValues]);

			if (v_sName)
			{
				if (!v_oPromptParametersXML[v_sName])
				{
					v_oPromptParametersXML[v_sName] = [];
				}
				v_oPromptParametersXML[v_sName].push(v_sValues);
			}
		}
	}

	function addClassicViewerPromptsComplex(v_elForm, v_aPromptParametersComplex) {
		//Complex json prompt values, e.g.:
		//	[{"name":"ProductLine","value":[{"use":"Camping Equipment"},{"use":"Outdoor Protection"}]},{"name":"Product","value":[{"use":"BugShield Lotion"}]}]
		//	[{"name":"ProductLine","value":[{"boundRange":{"start":{"use":"36110","display":"36110"},"end":{"use":"77110","display":"77110"}}}]}]
		//	[{"name":"UnitPrice","value":[{"unboundedStartRange":{"end":{"use":"100","display":"100"}}}]}]
		var v_oPromptParametersXML = {};

		//For each promptParameters passed in from options, parse, convert to XML then store the result in v_oPromptParametersXML
		for (var i = 0; i < v_aPromptParametersComplex.length; i++)
		{
			var v_aComplexParameterObject;
			try
			{
				v_aComplexParameterObject = JSON.parse(v_aPromptParametersComplex[i]);
				if (!Array.isArray(v_aComplexParameterObject))
				{
					v_aComplexParameterObject = [v_aComplexParameterObject];
				}
			}
			catch (e)
			{
				console.log("rsPromptParameters.addClassicViewerPromptsComplex ... invalid promptParameters input : " + v_aPromptParametersComplex[i]);
				v_aComplexParameterObject = undefined;
				return "";
			}

			convertComplexParameterToClassicViewerXML(v_oPromptParametersXML, v_aComplexParameterObject);
		}

		for (var v_sName in v_oPromptParametersXML)
		{
			if (v_oPromptParametersXML.hasOwnProperty(v_sName))
			{
				var v_sXMLValues = "";
				for (var i = 0; i < v_oPromptParametersXML[v_sName].length; i++)
				{
					v_sXMLValues += v_oPromptParametersXML[v_sName][i];
				}
				v_sXMLValues = "<selectChoices>" + v_sXMLValues + "</selectChoices>";
				var v_elInput = v_elForm.appendChild( document.createElement("input") );
				v_elInput.type = "hidden";
				v_elInput.name = "p_" + v_sName;
				v_elInput.value = v_sXMLValues;
			}
		}
	}

	/**
	 * Convert the value of a parameter into the simple JSON form.
	 * @param v_oValue The value that is either in SOAP-JSON or simple-JSON form
	 * @return The simple-JSON representation of v_oValue
	 */
	function valueToSimpleJson( v_oValue )
	{
		// SOAP JSON has a type property
		switch (v_oValue.type)
		{
			case 'simpleParmValueItem':
				// soapJson and simpleJson are equivalent except the SOAP form has a few extra bits
				delete v_oValue.type;
				delete v_oValue.inclusive;
				break;

			case 'boundRangeParmValueItem':
				v_oValue = { boundRange: { start: v_oValue.start, end: v_oValue.end } };
				break;

			case 'unboundedStartRangeParmValueItem':
				v_oValue = { unboundedStartRange: { end: v_oValue.end } };
				break;

			case 'unboundedEndRangeParmValueItem':
				v_oValue = { unboundedEndRange: { start: v_oValue.start } };
				break;

			default:
				// If no type then assume input is already simple JSON
				break;
		}

		return v_oValue;
	}

	function groupPromptParamters(v_oPromptParameters, v_oPromptParametersComplex)
	{
		//Merge m_aPromptParametersComplex into m_oPromptParameters

		// The format of v_oPromptParametersComplex can be just about anything: SOAP JSON, simple JSON, compound JSON.
		// compound JSON is an array representation (like SOAP JSON) but where the value uses the simple JSON representation.
		// This method must determine what it is and process accordingly.
		var v_aPromptParametersComplex;

		if (typeof v_oPromptParametersComplex == 'string')
		{
			try
			{
				v_oPromptParametersComplex = JSON.parse(v_oPromptParametersComplex);
			}
			catch (e)
			{
				console.log("rsPromptParameters.groupPromptParamters ... invalid promptParameters input : " + v_oPromptParametersComplex);
				return undefined;
			}
		}

		if (!v_oPromptParameters)
		{
			v_oPromptParameters = {};
		}

		if (v_oPromptParametersComplex)
		{
			if (Array.isArray(v_oPromptParametersComplex))
			{
				v_aPromptParametersComplex = v_oPromptParametersComplex;
			}
			else
			{
				// Check if we have simple JSON or a single compound JSON parameter
				// share URL format for some reason represents a single parameter as an object but multiple parameters as an array
				if (typeof v_oPromptParametersComplex.name == 'string')
				{
					// We have an object of the form { name: "text", ...} which is not the simple JSON form
					// turn it into an array for further processing
					v_aPromptParametersComplex = [v_oPromptParametersComplex];
				}
				else
				{
					// We have simple JSON, merge it into v_oPromptParameters
					Object.keys(v_oPromptParametersComplex).forEach( function(key) {
						v_oPromptParameters[key] = v_oPromptParametersComplex[key];
					} );
				}
			}
		}
		if (v_aPromptParametersComplex)
		{
			for (var i = 0; i < v_aPromptParametersComplex.length; ++i)
			{
				var v_aPromptParametersComplexObject;
				try
				{
					v_aPromptParametersComplexObject = typeof v_aPromptParametersComplex[i] == 'string' ? JSON.parse(v_aPromptParametersComplex[i]) : v_aPromptParametersComplex[i];
					if (!Array.isArray(v_aPromptParametersComplexObject))
					{
						v_aPromptParametersComplexObject = [v_aPromptParametersComplexObject];
					}
				}
				catch (e)
				{
					console.log("rsPromptParameters.groupPromptParamters ... invalid promptParameters input : " + v_aPromptParametersComplex[i]);
					return undefined;
				}

				for (var j = 0; j < v_aPromptParametersComplexObject.length; j++)
				{
					// We could have either a SOAP JSON parameter value or a compound JSON parameter value
					var v_oPromptParameter = v_aPromptParametersComplexObject[j];
					var v_sName = v_oPromptParameter.name;
					var v_aValues = [];
					if (v_oPromptParameter.value)
					{
						v_aValues = (Array.isArray(v_oPromptParameter.value) || typeof v_oPromptParameter.value.length == "number") ? v_oPromptParameter.value : [v_oPromptParameter.value];
					}
					if (v_sName && v_aValues)
					{
						if (!v_oPromptParameters[v_sName])
						{
							v_oPromptParameters[v_sName] = [];
						}
						// It is valid for the value array to be empty
						for (var k = 0; k < v_aValues.length; ++k)
						{
							var v_oValue = valueToSimpleJson(v_aValues[k]);
							if (v_oValue.hasOwnProperty("use"))
							{
								v_oPromptParameters[v_sName].push({ use: v_oValue.use, display: (v_oValue.hasOwnProperty("display") ? v_oValue.display : v_oValue.use) });
							}
							if (v_oValue.hasOwnProperty("boundRange"))
							{
								if (v_oValue.boundRange.start && v_oValue.boundRange.start.hasOwnProperty("use") && v_oValue.boundRange.end && v_oValue.boundRange.end.hasOwnProperty("use"))
								{
									v_oPromptParameters[v_sName].push({
										boundRange: {
											start: { use: v_oValue.boundRange.start.use, display: (v_oValue.boundRange.start.hasOwnProperty("display") ? v_oValue.boundRange.start.display : v_oValue.boundRange.start.use) },
											end: { use: v_oValue.boundRange.end.use, display: (v_oValue.boundRange.end.hasOwnProperty("display") ? v_oValue.boundRange.end.display : v_oValue.boundRange.end.use) }
										}
									});
								}
								else
								{
									console.log("rsPromptParameters.groupPromptParamters ... unexpected boundRange format");
								}
							}
							else if (v_oValue.hasOwnProperty("unboundedEndRange"))
							{
								if (v_oValue.unboundedEndRange.start && v_oValue.unboundedEndRange.start.hasOwnProperty("use"))
								{
									v_oPromptParameters[v_sName].push({
										unboundedEndRange: {
											start: {
												use: v_oValue.unboundedEndRange.start.use,
												display: (v_oValue.unboundedEndRange.start.hasOwnProperty("display") ? v_oValue.unboundedEndRange.start.display : v_oValue.unboundedEndRange.start.use)
											}
										}
									});
								}
								else
								{
									console.log("rsPromptParameters.groupPromptParamters ... unexpected unboundedEndRange format.");
								}
							}
							else if (v_oValue.hasOwnProperty("unboundedStartRange"))
							{
								if (v_oValue.unboundedStartRange.end && v_oValue.unboundedStartRange.end.hasOwnProperty("use"))
								{
									v_oPromptParameters[v_sName].push({
										unboundedStartRange: {
											end: {
												use: v_oValue.unboundedStartRange.end.use,
												display: (v_oValue.unboundedStartRange.end.hasOwnProperty("display") ? v_oValue.unboundedStartRange.end.display : v_oValue.unboundedStartRange.end.use)
											}
										}
									});
								}
								else
								{
									console.log("rsPromptParameters.groupPromptParamters ... unexpected unboundedStartRange format.");
								}
							}
						}
					}
				}
			}
		}

		return v_oPromptParameters;
	}

	function emitValue( v_sTtype, v_oValue )
	{
		var v_aValue = [];
		if (v_oValue !== undefined) { // test for actual undefined
			v_aValue.push( "<bus:");
			v_aValue.push( v_sTtype );
			v_aValue.push( " xsi:type=\"xs:string\"" );
			if (v_oValue === null) { // test for actual null
				v_aValue.push( " xsi:nil=\"true\"/>" );
			}
			else {
				v_aValue.push( ">" );
				v_aValue.push( xmlEncode(v_oValue.toString()));
				v_aValue.push( "</bus:" );
				v_aValue.push( v_sTtype );
				v_aValue.push( ">" );
			}
		}
		return v_aValue.join("");
	}

	function emitUseDisplay( v_oValue )
	{
		return emitValue( "use", v_oValue.use ) + emitValue( "display", v_oValue.display );
	}

	function buildSimpleParmValue(v_oValue)
	{
		return	"<item xsi:type=\"bus:simpleParmValueItem\">" +
					"<bus:inclusive xsi:type=\"xs:boolean\">true</bus:inclusive>" +
					emitUseDisplay( v_oValue ) +
				"</item>";
	}

	function buildBoundRangeParmValue(v_oValue)
	{
		return	"<item xsi:type=\"bus:boundRangeParmValueItem\">" +
					"<bus:inclusive xsi:type=\"xs:boolean\">true</bus:inclusive>" +
					"<bus:start xsi:type=\"bus:simpleParmValueItem\">" +
						"<bus:inclusive xsi:type=\"xs:boolean\">true</bus:inclusive>" +
						emitUseDisplay( v_oValue.boundRange.start ) +
					"</bus:start>" +
					"<bus:end xsi:type=\"bus:simpleParmValueItem\">" +
						"<bus:inclusive xsi:type=\"xs:boolean\">true</bus:inclusive>" +
						emitUseDisplay( v_oValue.boundRange.end ) +
					"</bus:end>" +
				"</item>";
	}

	function buildUnboundedEndRangeParmValue(v_oValue)
	{
		return	"<item xsi:type=\"bus:unboundedEndRangeParmValueItem\">" +
					"<bus:inclusive xsi:type=\"xs:boolean\">true</bus:inclusive>" +
					"<bus:start xsi:type=\"bus:simpleParmValueItem\">" +
						"<bus:inclusive xsi:type=\"xs:boolean\">true</bus:inclusive>" +
						emitUseDisplay( v_oValue.unboundedEndRange.start ) +
					"</bus:start>" +
				"</item>";
	}

	function buildUnboundedStartRangeParmValue(v_oValue)
	{
		return	"<item xsi:type=\"bus:unboundedStartRangeParmValueItem\">" +
					"<bus:inclusive xsi:type=\"xs:boolean\">true</bus:inclusive>" +
					"<bus:end xsi:type=\"bus:simpleParmValueItem\">" +
						"<bus:inclusive xsi:type=\"xs:boolean\">true</bus:inclusive>" +
						emitUseDisplay( v_oValue.unboundedStartRange.end ) +
					"</bus:end>" +
				"</item>";
	}

	function buildBusParameterValues(v_oPromptParameters, v_oPromptParametersComplex, v_sParamsTagName)
	{
		var v_sParameterValues = "<bus:" + (v_sParamsTagName || "parameterValues") + " xmlns:bus=\"http://developer.cognos.com/schemas/bibus/3/\" xmlns:xs=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
								" xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\" SOAP-ENC:arrayType=\"bus:parameterValue[]\" xsi:type=\"SOAP-ENC:Array\">";
		var v_oPromptParameters = groupPromptParamters(v_oPromptParameters, v_oPromptParametersComplex);

		for (var v_sName in v_oPromptParameters)
		{
			if (v_oPromptParameters.hasOwnProperty(v_sName))
			{
				v_sParameterValues += "<item xsi:type=\"bus:parameterValue\">";
				v_sParameterValues += 	"<bus:name xsi:type=\"xs:string\">" + xmlEncode(v_sName) + "</bus:name>";
				v_sParameterValues += 	"<bus:value xsi:type=\"SOAP-ENC:Array\" SOAP-ENC:arrayType=\"bus:parmValueItem[]\">";

				var v_aCurParams = v_oPromptParameters[v_sName];
				var v_iCurParamsLen = v_aCurParams.length;

				for (var i = 0; i < v_iCurParamsLen; i++)
				{
					var v_oValue = v_aCurParams[i];

					if (v_oValue.hasOwnProperty("use"))
					{
						v_sParameterValues += buildSimpleParmValue(v_oValue);
					}
					else if (v_oValue.hasOwnProperty("boundRange"))
					{
						v_sParameterValues += buildBoundRangeParmValue(v_oValue);
					}
					else if (v_oValue.hasOwnProperty("unboundedEndRange"))
					{
						v_sParameterValues += buildUnboundedEndRangeParmValue(v_oValue);
					}
					else if (v_oValue.hasOwnProperty("unboundedStartRange"))
					{
						v_sParameterValues += buildUnboundedStartRangeParmValue(v_oValue);
					}
				}
				v_sParameterValues +=	"</bus:value>";
				v_sParameterValues += "</item>";
			}
		}
		v_sParameterValues += "</bus:" + (v_sParamsTagName || "parameterValues") + ">";
		return v_sParameterValues;
	}

	function convertValueToBoundedRangeFormat(v_oValue)
	{
		v_oValue.boundRange = { start: { use: v_oValue.start.use, display: v_oValue.start.display },
								end: { use: v_oValue.end.use, display: v_oValue.end.display } };
		delete v_oValue.start;
		delete v_oValue.end;
	}

	function convertValueToUnboundedStartRangeFormat(v_oValue)
	{
		v_oValue.unboundedStartRange = { end: { use: v_oValue.end.use, display: v_oValue.end.display } };
		delete v_oValue.end;
	}

	function convertValueToUnboundedEndRangeFormat(v_oValue)
	{
		v_oValue.unboundedEndRange = { start: { use: v_oValue.start.use, display: v_oValue.start.display } };
		delete v_oValue.start;
	}


	function getValuesFromBusValueNode(v_sType, v_nlNodeList)
	{
		const v_oGlassParamValue = {
				use: null, // Unless explicitly specified, it is null
				type: v_sType.substring(4) // strip off the bus: portion
			};

		for ( var j = 0; j < v_nlNodeList.length; j++ )
		{
			const v_nNode = v_nlNodeList.item( j );
			let v_bStart = false;
			const v_oStartEnd = { use: null };	// Unless explicitly specified, it is null

			switch (v_nNode.nodeName)
			{
				case "bus:start":
					v_bStart = true;
					// fall through
				case "bus:end":
					// get all the children nodes
					for (let v_nChildNode = v_nNode.firstChild; v_nChildNode; v_nChildNode = v_nChildNode.nextSibling)
					{
						switch (v_nChildNode.nodeName)
						{
							case "bus:inclusive":
								// Default is true so since the element is there, anything other than false is considered true
								v_oStartEnd.inclusive = rsCommon.getNodeText(v_nNode) != 'false';
								break;

							case "bus:display":
								if (v_nChildNode.getAttribute("xsi:nil") == "true")
								{
									v_oStartEnd.display = null;
								}
								else
								{
									v_oStartEnd.display = rsCommon.getNodeText(v_nChildNode);
								}
								break;

							case "bus:use":
								if (v_nChildNode.getAttribute("xsi:nil") != "true")
								{
									v_oStartEnd.use = rsCommon.getNodeText(v_nChildNode);
								}
								break;
						}
					};
					// set start or end in the v_oGlassParamValue
					if (v_bStart)
					{
						v_oGlassParamValue.start = v_oStartEnd;
						v_oGlassParamValue.start.type = v_nNode.getAttribute("xsi:type").substring(4);
					}
					else
					{
						v_oGlassParamValue.end = v_oStartEnd;
						v_oGlassParamValue.end.type = v_nNode.getAttribute("xsi:type").substring(4);
					}
					delete v_oGlassParamValue.use; // Remove null use when value is a range
					break;

				case "bus:inclusive":
					// Default is true so since the element is there, anything other than false is considered true
					v_oGlassParamValue.inclusive = rsCommon.getNodeText(v_nNode) != 'false';
					break;

				case "bus:display":
					if (v_nNode.getAttribute("xsi:nil") == "true")
					{
						v_oGlassParamValue.display = null;
					}
					else
					{
						v_oGlassParamValue.display = rsCommon.getNodeText(v_nNode);
					}
					break;

				case "bus:use":
					if (v_nNode.getAttribute("xsi:nil") != "true")
					{
						v_oGlassParamValue.use = rsCommon.getNodeText(v_nNode);
					}
					break;
			}
		}
		// Share is looking for "inclusive" for a range value, as per OM. If missing, just add a inclusive=true
		if ( v_oGlassParamValue.inclusive === undefined &&
			(v_oGlassParamValue.start !== undefined || v_oGlassParamValue.end !== undefined) )
		{
			v_oGlassParamValue.inclusive = true;
		}

		return v_oGlassParamValue;
	}

	return {
		/**
		 * Convert SOAP XML parameters into SOAP-JSON form
		 * [ { name: "paramName", value: [ {...}, ...] }, ... ]
		 * where the value array contains zero or more objects which are one of the following:
		 * { type: "simpleParmValueItem", use: "value", display: "dispValue" }
		 * { type: "boundRangeParmValueItem", start: {use, display}, end: {use, display} }
		 * { type: "unboundEndRangeParmValueItem", start: {use, display} }
		 * { type: "unboundStartRangeParmValueItem", end: {use, display} }
		 * The use and display may have the value null.
		 */
		convertBusParametersToJson: function( v_sXMLParameters )
		{
			const v_aJsonParameters = [];

			const v_oDoc = rsCommon.parseXML(v_sXMLParameters);

			for (let v_nChildNode = v_oDoc && v_oDoc.documentElement.firstChild; v_nChildNode; v_nChildNode = v_nChildNode.nextSibling)
			{
				// we are interested in the item nodes
				if (v_nChildNode.nodeName == "item")
				{
					var v_oGlassParamStruct = {
						name: "",
						value: []
					};
					// walk through the child nodes..looking for bus:name and bus:value
					let v_nItemChildNode = v_nChildNode.firstChild;
					while (v_nItemChildNode)
					{
						switch (v_nItemChildNode.nodeName)
						{
							// bus:name contains the parameter name
							case "bus:name":
								v_oGlassParamStruct.name = rsCommon.getNodeText(v_nItemChildNode);
								v_aJsonParameters.push(v_oGlassParamStruct);
								break;
							// bus:value contains type, inclusive, display, and use
							case "bus:value":
								for (let v_nValueNode = v_nItemChildNode.firstChild; v_nValueNode; v_nValueNode = v_nValueNode.nextSibling)
								{
									// we are interested in the item nodes
									if (v_nValueNode.nodeName == "item")
									{
										const v_oGlassParamValue = getValuesFromBusValueNode(v_nValueNode.getAttribute("xsi:type"), v_nValueNode.childNodes);
										v_oGlassParamStruct.value.push(v_oGlassParamValue);
									}
								}
								break;
						}
						v_nItemChildNode = v_nItemChildNode.nextSibling;
					}
				}
			}

			return v_aJsonParameters;
		},

		//classicviewer perspective prompt parameter builder
		cvAddPromptParameters: function(v_elForm, v_aPromptParameters, v_aPromptParametersComplex)
		{
			//console.log("rsPromptParameters.cvAddPromptParameters ...");
			addClassicViewerPrompts(v_elForm, v_aPromptParameters);
			addClassicViewerPromptsComplex(v_elForm, v_aPromptParametersComplex);
		},

		//authoring perspective prompt parameter builder
		rsBuildPromptParameters: function(v_oPromptParameters, v_oPromptParametersComplex, v_sParamsTagName)
		{
			//console.log("rsPromptParameters.rsBuildPromptParameters ...");
			if (v_oPromptParameters || v_oPromptParametersComplex)
			{
				return buildBusParameterValues(v_oPromptParameters, v_oPromptParametersComplex, v_sParamsTagName);
			}
			return "";
		},

		//prompt parameters url builder
		//Expecting v_oPromptParameters input as object only
		rsBuildParameterUrl: function(v_oUrlMap, v_oPromptParameters)
		{
			var v_aPromptParameters = Array.isArray(v_oPromptParameters) ? v_oPromptParameters : [v_oPromptParameters];
			v_aPromptParameters.forEach( function(v_oPara) {
				if (typeof v_oPara !== 'undefined')
				{
					var v_aValues = Array.isArray(v_oPara.value) ? v_oPara.value : [v_oPara.value];
					v_aValues.forEach( function(v_oValue) {
						switch (v_oValue.type)
						{
							case "boundRangeParmValueItem":
								convertValueToBoundedRangeFormat(v_oValue);
								break;

							case "unboundedStartRangeParmValueItem":
								convertValueToUnboundedStartRangeFormat(v_oValue);
								break;

							case "unboundedEndRangeParmValueItem":
								convertValueToUnboundedEndRangeFormat(v_oValue);
								break;

							default:
								break;
						}
						delete v_oValue.type;
						delete v_oValue.inclusive;
					});
				}
			});
			v_oUrlMap.promptParameters = v_oPromptParameters ? JSON.stringify(v_aPromptParameters) : null;
		},

		/**
		 * Convert the array representation of parameter values into an object representation of parameter values.
		 * @param v_aParameters
		 * @returns An object with parameters as members or empty object if there are none
		 */
		convertParameterArrayToObject: function(v_aParameters)
		{
			var v_oParameters = {};
			if (v_aParameters && v_aParameters.length > 0)
			{
				v_aParameters.forEach( function(v_oParameter)
				{
					if (v_oParameter && v_oParameter.name)
					{
						v_oParameters[v_oParameter.name] = v_oParameter.value;
					}
				});
			}
			return v_oParameters;
		},

		//search for simple prompt parameters : p_Product
		findPromptParameters: function(options)
		{
			var v_oPromptParameters;

			for (var v_sKey in options)
			{
				if (options.hasOwnProperty(v_sKey) && v_sKey.length > 2 && v_sKey.indexOf('p_') == 0 && options[v_sKey])
				{
					var v_sName = v_sKey.substring(2);
					if (!v_oPromptParameters)
					{
						v_oPromptParameters = {};
					}
					if (!v_oPromptParameters[v_sName])
					{
						v_oPromptParameters[v_sName] = [];
					}

					var v_aOptions = Array.isArray(options[v_sKey]) ? options[v_sKey] : [options[v_sKey]];
					for (var i = 0; i < v_aOptions.length; i++)
					{
						v_oPromptParameters[v_sName].push({ use: v_aOptions[i], display: v_aOptions[i] });
					}
				}
			}

			return v_oPromptParameters;
		},

		//search for complex prompt parameters
		findPromptParametersComplex: function(options)
		{
			return options["promptParameters"];
		}
	};
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: cchl
 	(C) Copyright IBM Corp. 2022
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define('bi/authoring/utils/C_Defer',[], function() {
    class C_Defer
    {
        constructor()
        {
            this.promise = new Promise( ( v_fnResolve, v_fnReject ) =>
            {
                this.m_fnResolve = v_fnResolve;
                this.m_fnReject = v_fnReject;
            } );
            this.m_bIsPending = true;

            this.promise.isPending = () => this.m_bIsPending;
        }

        resolve(v_vValue)
        {
            this.m_bIsPending = false;
            this.m_fnResolve(v_vValue);
        }

        reject(v_vValue)
        {
            this.m_bIsPending = false;
            this.m_fnReject(v_vValue);
        }
    }

    return C_Defer;
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
	(C) Copyright IBM Corp. 2018, 2022
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/
define('bi/authoring/utils/rsIFrameManager',[
	'jquery',
	'bi/authoring/utils/pat/rsCommon',
	'bi/authoring/utils/pat/rsPromptParameters',
	'bi/authoring/utils/C_Defer'
],
function($, rsCommon, rsPromptParameters, C_Defer) {
'use strict';

function isMyParentTheTopWindow(w)
{
	try
	{
		return Boolean(w.parent == w.top);
	}
	catch (e)
	{
		return false;
	}
}

function useViewer( options )
{
	let v_bIsViewer = false;
	if (options.type === 'dataSet2')
	{
		// Datasets can only be edited
		v_bIsViewer = false;
	}
	else
	{
		switch (options.action)
		{
			case 'edit':
				v_bIsViewer = false;
				break;

			case 'run':
			case 'viewOutput':
				v_bIsViewer = true;
				break;

			default:
				if (options.isViewer || (options.cmProperties && options.cmProperties.type == "output"))
				{
					v_bIsViewer = true;
				}
		}
	}

	return v_bIsViewer;
}


var rsIFrameManager = {};

rsIFrameManager.m_iNewFrameId = 1;

rsIFrameManager.F_LaunchRS = function(v_oParameters, v_oGlassContext, v_oLaunchParameters)
{
	console.info('rsperf: rsIFrameManager.F_LaunchRS ...');
	this.m_oLaunchParameters = v_oLaunchParameters ? v_oLaunchParameters : null;
	var v_bPrelaunchTest = false;

	if (v_bPrelaunchTest)
	{
		this.F_PreLaunch(v_oGlassContext);
	}

	// Do not use prelaunch version is only for viewing or editing reports, do not use if creating or editing a data set
	// Check for existence of currentContentView.  It is not defined if the only thing open is the default home page.  If this is the case then
	// the overall condition (which is testing for presence of dataset perspective) is still true.
	if (this.m_oPrelaunchRSPromise && v_oGlassContext.currentAppView && v_oGlassContext.currentAppView.currentContentView && v_oGlassContext.currentAppView.currentContentView.perspective !== 'datasets')
	{
		console.time('rsIFrameManager.F_LaunchRS->f_relaunchRSIFrameInView');

		var v_oIFramePromise = this.m_oPrelaunchRSPromise;
		this.m_oPrelaunchRSPromise = null;

		console.time("rsperf: Waiting for RS relaunch");
		return v_oIFramePromise
			.then(v_oValue => {
				return this.f_relaunchRSIFrameInView(v_oParameters, v_oLaunchParameters, v_oValue);
			})
			.catch(() => {
				return v_oIFramePromise
					.then( this.f_relaunchRSIFrameInView.bind(this, v_oParameters, v_oLaunchParameters) );
			});
	}

	console.time("rsperf: Launch RS->OnRSApplicationReadyForObservers");

	var v_oLaunchDeferred = new C_Defer();
	this.f_launchRS( v_oGlassContext, v_oParameters,
		this.f_onLaunchReadyForObservers.bind(this, v_oGlassContext, v_oLaunchDeferred),
		v_oLaunchDeferred.reject.bind(v_oLaunchDeferred, new Error("rsIFrameManager: error during f_launchRS") ) );

	return v_oLaunchDeferred.promise;
};

rsIFrameManager.f_relaunchRSIFrameInView = function(v_oParameters, v_oLaunchParameters, v_iframeAuthoring)
{
	console.timeEnd('rsIFrameManager.F_LaunchRS->f_relaunchRSIFrameInView');
	var v_oIFrameLaunchedDeferred = new C_Defer();
	console.timeEnd("rsperf: Waiting for RS relaunch");
	console.time("rsperf: Launch from prelaunch RS->OnRSApplicationReadyForObservers");
	v_iframeAuthoring.OnRSApplicationReadyForObservers = function() {
		v_oIFrameLaunchedDeferred.resolve(v_iframeAuthoring.id);
		console.timeEnd("rsperf: Launch from prelaunch RS->OnRSApplicationReadyForObservers");
	}.bind(this);
	var v_oRsParameters = JSON.parse(v_oParameters.rsParameters);
	v_iframeAuthoring.contentWindow.Application.Relaunch(v_oRsParameters, v_oLaunchParameters);

	return v_oIFrameLaunchedDeferred.promise;
};

rsIFrameManager.f_getBodyRect = function(el)
{
	// in the glass the scrollable element is the HTML element not the body as one would expect.
	var v_elScrollable = document.documentElement;
	var v_oRect = el.getBoundingClientRect();
	var v_oBodyRect = document.body.getBoundingClientRect();

	return {
		top: v_oRect.top - v_oBodyRect.top + (v_elScrollable.scrollTop ? v_elScrollable.scrollTop : 0),
		left: v_oRect.left - v_oBodyRect.left + (v_elScrollable.scrollLeft ? v_elScrollable.scrollLeft : 0),
		width: v_oRect.width,
		height: v_oRect.height
	};
};

rsIFrameManager.F_PositionAndSizeIFrame = function($elContainer, v_iframeAuthoring)
{
	function f_getZIndex( v_el )
	{
		var v_elCur = v_el;
		while (v_elCur && v_elCur.nodeName != "#document")
		{
			var v_oStyle = v_elCur.ownerDocument.defaultView.getComputedStyle( v_elCur, null );

			var v_iValue = parseInt( v_oStyle.zIndex, 10 );
			if (!isNaN(v_iValue) && v_iValue !== 0)
			{
				return v_iValue;
			}

			v_elCur = v_elCur.parentNode;
		}
		return 0;
	}

	var v_oRect = this.f_getBodyRect($elContainer.get(0));
	v_iframeAuthoring.style.top = v_oRect.top + "px";
	v_iframeAuthoring.style.left = v_oRect.left + "px";
	v_iframeAuthoring.style.width = v_oRect.width + "px";
	v_iframeAuthoring.style.height = v_oRect.height + "px";
	v_iframeAuthoring.style.zIndex = f_getZIndex($elContainer.get(0)) + 1;
	v_iframeAuthoring.style.visibility = "visible";
	//console.log("F_PositionAndSizeIFrame: " + v_iframeAuthoring.style.left + "," + v_iframeAuthoring.style.top + " " + v_iframeAuthoring.style.width + "," + v_iframeAuthoring.style.height);
};

rsIFrameManager.F_HideIFrame = function(v_iframeAuthoring)
{
	// since the iframe is still taking space in the flow, position it somewhere that doesn't cause scrollbars in glass window
	v_iframeAuthoring.style.top = "-5000px";
	v_iframeAuthoring.style.left = "-5000px";
	v_iframeAuthoring.style.zIndex = -1;
	v_iframeAuthoring.style.visibility = "hidden";
};

rsIFrameManager.F_DetachIFrame = function(v_iframeAuthoring)
{
	var v_oApplication = v_iframeAuthoring.contentWindow.Application;

	if (v_oApplication)
	{
		v_oApplication.DetachFromGlass();
	}

	this.m_divRSFrameHolder.removeChild(v_iframeAuthoring);
};

rsIFrameManager.f_createRSIFrame = function(v_oParameters)
{
	var v_aHTML = [];
	// Added the title to resolve the accessibility issue.
	v_aHTML.push('<iframe title="RSIframe" src="');

	if (isMyParentTheTopWindow(window))
	{
		// our parent is the top so
		// we can't be nested in another rasp.htm so
		// we don't need to add a unique id to our url
		//
		// if there is a window.urlArgs from the glass, append it to our url for browser cache-busting
		v_aHTML.push( window.urlArgs ? `${v_oParameters.rsUrl}?${window.urlArgs}` : v_oParameters.rsUrl );
	}
	else
	{
		// IE  does not allow nested iframes for the same URL, so adding a random version to allow the nesting
		// other browser all prevent nesting more then 2 levels deep
		v_aHTML.push(v_oParameters.rsUrl + "?v=" + Math.random());
	}

	// ensure iframe has dimensions so that panes don't get sized to their minimums
	v_aHTML.push('" style="border:none;top:-5000px;left:-5000px;width:1024px;height:768px;position:absolute;visibility:hidden" data-rsparameters="');
	v_aHTML.push(this.f_HTMLAttributeEncode(v_oParameters.rsParameters));
	v_aHTML.push('" allowfullscreen="true"/>');
	return v_aHTML.join("");
};


rsIFrameManager.f_onLaunchReadyForObservers = function(v_oGlassContext, v_oDeferred, v_iframeAuthoring)
{
	console.timeEnd("rsperf: Launch RS->OnRSApplicationReadyForObservers");
	var v_oApplication = v_iframeAuthoring.contentWindow.Application;
	// RS will need a glass context while launching
	v_oApplication.GlassContext = v_oGlassContext;
	v_oApplication.LaunchParameters = this.m_oLaunchParameters;
	v_oDeferred.resolve(v_iframeAuthoring.id);
};

rsIFrameManager.f_HTMLEncode = function(s)
{
	return s.replace( /&/g, "&amp;" ).replace( /</g, "&lt;" ).replace( />/g, "&gt;" );
};

rsIFrameManager.f_HTMLAttributeEncode = function(s)
{
	return this.f_HTMLEncode(s).replace( /'/g, "&#39;" ).replace( /"/g, "&quot;" );
};

rsIFrameManager.f_prelaunchRS = function(v_oGlassContext, v_fnOnLaunched, v_fnOnLaunchError)
{
	console.time("rsperf: prelaunch RS");
	var v_oRsParameters = rsIFrameManager.createRSParameters( {}, v_oGlassContext );

	v_oRsParameters.prelaunchRS = true;

	this.f_launchRS(v_oGlassContext, rsCommon.createTemplateParameters(v_oRsParameters), this.f_onPrelaunchRSReadyForObservers.bind(this, v_oGlassContext, v_fnOnLaunched), v_fnOnLaunchError);
};

rsIFrameManager.f_launchRS = function(v_oGlassContext, v_oParameters, v_fnOnLaunched, v_fnOnLaunchError)
{
	if (!this.m_divRSFrameHolder)
	{
		$("body").prepend('<div style="position:absolute;top:0px;left:0px;visibility:hidden"></div>');
		this.m_divRSFrameHolder = $("body").find("div").get(0);
	}

	var $divRSFrameHolder = $(this.m_divRSFrameHolder);
	$divRSFrameHolder.prepend(this.f_createRSIFrame(v_oParameters));
	var v_iframeAuthoring = $divRSFrameHolder.find("iframe").get(0);
	v_iframeAuthoring.id = "rsIFrameManager_" + this.m_iNewFrameId++;

	v_iframeAuthoring.OnRSApplicationReadyForObservers = v_fnOnLaunched.bind(null, v_iframeAuthoring);
	v_iframeAuthoring.onerror = v_fnOnLaunchError;
};

rsIFrameManager.f_onPrelaunchRSReadyForObservers = function(v_oGlassContext, v_fnOnLaunched, v_iframeAuthoring)
{
	var v_oApplication = v_iframeAuthoring.contentWindow.Application;

	v_oApplication.GlassContext = v_oGlassContext;
	v_oApplication.LaunchParameters = this.m_oLaunchParameters;

	if ( v_oApplication.SharedState.Get("isAppLoaded") )
	{
		this.f_onPrelaunchAppLoaded(v_iframeAuthoring, v_fnOnLaunched);
	}
	else
	{
		v_oApplication.SharedState.AddObserver("rsIFrameManager", "isAppLoaded", this.f_onPrelaunchAppLoaded.bind(this, v_iframeAuthoring, v_fnOnLaunched, true) );
	}
};

rsIFrameManager.f_onPrelaunchAppLoaded = function(v_iframeAuthoring, v_fnOnLaunched, v_bRemoveObserver)
{
	console.timeEnd("rsperf: prelaunch RS");
	if (v_bRemoveObserver)
	{
		var v_oApplication = v_iframeAuthoring.contentWindow.Application;
		v_oApplication.SharedState.RemoveObserver("rsIFrameManager", "isAppLoaded");
	}

	setTimeout(v_fnOnLaunched.bind(null, v_iframeAuthoring), 0);
};

rsIFrameManager.F_PreLaunch = function(v_oGlassContext)
{
	if (this.m_oPrelaunchRSPromise)
	{
		return;
	}

	this.m_oPrelaunchRSPromise = new Promise(resolve => {
		this.f_prelaunchRS(v_oGlassContext, resolve, () => resolve(null));
	});
};

rsIFrameManager.createRSParameters = function( options, glassContext )
{
	var v_sGatewayUrl = "../v1/disp";

	var v_sCafContextId = (glassContext && glassContext.cafContextId) || "";

	var v_sStoreId = options.cmProperties && options.cmProperties.id;

	var v_sReportStoreId = "";
	var v_sModuleStoreId = options.moduleId;
	var v_sModuleSearchPath = options.moduleSearchPath;
	var v_sPackageSearchPath = "";
	var v_sType = options.type || "";

	if (options.isNew)
	{
		if (rsCommon.isObjectOfType(options.cmProperties, 'package'))
		{
			v_sPackageSearchPath = options.cmProperties.searchPath + "/model[last()]";
		}
		else if (v_sStoreId)
		{
			// We have a CM object but it's not a package - assume module
			v_sModuleStoreId = v_sStoreId;
			v_sModuleSearchPath = options.cmProperties.searchPath;
		}
	}
	else
	{
		// Loading a report from the glass should only ever be done using a store id, never with a CM search path
		// failure to use a store id will result in the interactive viewer not working correctly.
		v_sReportStoreId = v_sStoreId;
	}

	var v_bIsViewer = useViewer( options );
	var v_sFormat = options.format;
	var v_bRunInAdvancedViewer = options.cmProperties && typeof options.cmProperties.runInAdvancedViewer !== 'undefined' ? !!options.cmProperties.runInAdvancedViewer : true;

	options.rsFinalRunOptions = options.rsFinalRunOptions || {};

	if (options.rsFinalRunOptions.prompt === undefined && options.prompt !== undefined)
	{
		options.rsFinalRunOptions.prompt = options.prompt;
	}

	if (!options.rsFinalRunOptions.globalParameters)
	{
		var v_oParameterValues = null;
		if (glassContext &&
			glassContext.services &&
			glassContext.services.userProfile &&
			glassContext.services.userProfile.userProfileSettings)
		{
			v_oParameterValues = glassContext.services.userProfile.userProfileSettings.parameter_values;
		}
		// Always calculate globalParameters.  This ensures that RSVP can tell the difference between
		// the fact there are no global parameters and that that presence of global parameters is unknown.
		// In the latter case, RSVP will call CM to try to get them.  If it knows there are none, we avoid the CM call.
		var v_aParameterValues = rsCommon.convertToArray( v_oParameterValues );
		options.rsFinalRunOptions.globalParameters = JSON.stringify( v_aParameterValues );
	}

	if (v_sFormat && !options.rsFinalRunOptions.format )
	{
		options.rsFinalRunOptions.format = v_sFormat;
	}

	if (options.editSpecification)
	{
		options.rsFinalRunOptions.editSpecification = options.editSpecification;
	}
	else if ( options.m_oLaunchParameters && options.m_oLaunchParameters.editSpecification )
	{
		options.rsFinalRunOptions.editSpecification = options.m_oLaunchParameters.editSpecification;
	}

	options.rsFinalRunOptions.isApplication = options.isApplication;

	var v_oRSParameters = {
		parentType: "RSFrame",
		rs_UIProfile: options.UIProfile,
		reportStoreID: v_sReportStoreId,
		gateway: v_sGatewayUrl,
		isViewer: v_bIsViewer,
		model: v_sPackageSearchPath,
		module: v_sModuleStoreId,
		moduleSearchPath: v_sModuleSearchPath,
		htmlContainerPath: document.location.pathname,
		productLocale: options.productLocale || glassContext.services.userProfile.preferences.productLocale || "en",
		contentLocale: options.contentLocale || glassContext.services.userProfile.preferences.contentLocale || "en-us",
		runInAdvancedViewer: v_bRunInAdvancedViewer,
		cafcontextid: v_sCafContextId,
		type: v_sType,
		rsFinalRunOptions: options.objRef ? {
												//Supported viewer API parameters only
												format: v_sFormat || 'HTML',
												bidi: options.bidi != undefined ? !!(options.bidi) : undefined,
												a11y: options.a11y != undefined ? !!(options.a11y) : undefined,
												prompt: options.prompt != undefined ? !!(options.prompt) : undefined,
												globalParameters: options.rsFinalRunOptions.globalParameters,
												editSpecification: options.rsFinalRunOptions.editSpecification,
												isApplication: !!options.rsFinalRunOptions.isApplication
											} : options.rsFinalRunOptions,
		parameterValuesXML: options.parameterValuesXML,
		cmProperties: options.cmProperties,
		outputSpec: options.outputSpec,
		glassSettings: rsCommon.extractGlassSettings(options)
	};
	if (options.pdfDrill)
	{
		v_oRSParameters.pdfDrill = options.pdfDrill;
		if (options.drillG2)
		{
			// drilling from classic goto page
			v_oRSParameters.drillG2 = "yes";
		}
		if (!options.id)
		{
			// generate an id so we can close this perspective later
			options.id = "pdfDrill" + Date.now();
			// Ensure glass is aware of the key for this perspective
			glassContext.updateCurrentCachedAppView();
		}
	}
	if (options.contentLocale)
	{
		v_oRSParameters.rsFinalRunOptions.contentLocale = options.contentLocale;
	}

	if (options.action == 'run' && !rsCommon.isOutputFormatAllowed( options.rsFinalRunOptions.format, glassContext ))
	{
		// The selected format is invalid, arrange to close the perspective
		v_oRSParameters.closePerspective = true;
	}

	v_oRSParameters.startingTemplate = options.startingTemplate;

	v_oRSParameters.isSlideout = options.isSlideout;

	// need promptResponse parameter to pass through. in this case, viewer will show prompt pages of response retrieved from parent RS
	v_oRSParameters.promptResponse = options.promptResponse;

	var v_oPromptParameters = rsPromptParameters.findPromptParameters(options);
	var v_oPromptParametersComplex = rsPromptParameters.findPromptParametersComplex(options);
	var v_sParameterValues = rsPromptParameters.rsBuildPromptParameters(v_oPromptParameters, v_oPromptParametersComplex);
	if (v_sParameterValues)
	{
		v_oRSParameters.parameterValuesXML = v_sParameterValues;
	}

	return v_oRSParameters;
};

return rsIFrameManager;
});


define('text!bi/authoring/res/DatasetList.xml',[],function () { return '<!--\n\tIBM Confidential \n\tOCO Source Materials\n\tIBM Cognos Products: rs\n \t(C) Copyright IBM Corp. 2021\n\tThe source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.\n-->\n<report useStyleVersion="latest" expressionLocale="en-us">\n\t<modelPath/>\n\t<drillBehavior modelBasedDrillThru="false"/>\n\t<queries>\n\t\t<query name="">\n\t\t\t<source>\n\t\t\t\t<model/>\n\t\t\t</source>\n\t\t\t<selection/>\n\t\t</query>\n\t</queries>\n\t<layouts>\n\t\t<layout>\n\t\t\t<reportPages>\n\t\t\t\t<page name="Page1">\n\t\t\t\t\t<style>\n\t\t\t\t\t\t<defaultStyles>\n\t\t\t\t\t\t\t<defaultStyle refStyle="pg"/>\n\t\t\t\t\t\t</defaultStyles>\n\t\t\t\t\t</style>\n\t\t\t\t\t<pageBody>\n\t\t\t\t\t\t<style>\n\t\t\t\t\t\t\t<defaultStyles>\n\t\t\t\t\t\t\t\t<defaultStyle refStyle="pb"/>\n\t\t\t\t\t\t\t</defaultStyles>\n\t\t\t\t\t\t</style>\n\t\t\t\t\t\t<contents>\n\t\t\t\t\t\t\t<list refQuery="" horizontalPagination="true" rowsPerPage="100">\n\t\t\t\t\t\t\t\t<style>\n\t\t\t\t\t\t\t\t\t<defaultStyles>\n\t\t\t\t\t\t\t\t\t\t<defaultStyle refStyle="ls"/>\n\t\t\t\t\t\t\t\t\t</defaultStyles>\n\t\t\t\t\t\t\t\t\t<CSS value="border-collapse:collapse;height: 100%"/>\n\t\t\t\t\t\t\t\t</style>\n\t\t\t\t\t\t\t</list>\n\t\t\t\t\t\t</contents>\n\t\t\t\t\t</pageBody>\n\t\t\t\t</page>\n\t\t\t</reportPages>\n\t\t</layout>\n\t</layouts>\n\t<XMLAttributes>\n\t\t<XMLAttribute output="no" name="RS_openInPageDesign" value="default"/>\n\t</XMLAttributes>\n</report>\n';});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
 	(C) Copyright IBM Corp. 2018, 2021
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define( 'bi/authoring/utils/pat/rsLaunchParameters',['jquery', 'text!bi/authoring/res/DatasetList.xml'], function($, datasetList) {
	var getOpenerLaunchParameters = function( v_bParent )
	{
		// This code gets the rsLaunchParameters module that was loaded by the opener window.
		// It handles the case where it was loaded either directly by the opener or by the opener's parent.
		// When RS launches a report in another window, the opener is RS but the module was loaded by the parent bi code
		// However, the bi code can also launch another window (prompting when processing the getParameters plugin in the bi code)
		// In this case, the opener is the window that loaded the module.
		var v_oOpenerLaunchParameters;
		try
		{
			v_oOpenerLaunchParameters = v_bParent ?
					window.opener.parent.require('bi/authoring/utils/pat/rsLaunchParameters')
				:
					window.opener.require('bi/authoring/utils/pat/rsLaunchParameters');
		}
		catch (e)
		{
			// Ignore
		}
		return v_oOpenerLaunchParameters;
	};

	// Create the service

	var rsLaunchParameters = {
			m_oParameterMap: {},
			m_oTemplates: { DatasetList: datasetList }
		};

	rsLaunchParameters.GetTemplate = function( v_sTemplate )
	{
		return this.m_oTemplates[v_sTemplate];
	};

	/**
	 * Store data.
	 * @param v_oData The data to be stored
	 * @param v_bJSONEncode JSON encode any objects prior to storing
	 * @param v_bParent When true, indicates that the key should be for the opener parent window.
	 * @return The key to be used to retrieve the data, undefined if something went wrong.
	 */
	rsLaunchParameters.Store = function( v_oData, v_bJSONEncode, v_bUseParent )
	{
		var v_sKey = (v_bUseParent ? '-' : '' ) + Date.now().toString();
		if (v_bJSONEncode)
		{
			var v_oAdd = new Map();
			var v_aRemove = [];
			Object.keys(v_oData).forEach( function(key) {
				if (typeof v_oData[key] == 'object' && v_oData[key] != undefined && !(typeof v_oData[key].toString == 'function' && v_oData[key].toString().indexOf('Window') >= 0))
				{
					// We are dealing with an object property that is not a window, JSON encode it
					// Use v_oAdd and v_aRemove to avoid modifying v_oData wile iterating over it's properties
					v_oAdd.set( 'JSON_' + key, JSON.stringify(v_oData[key]) );
					v_aRemove.push( key );
				}
			});

			// Remove properties that where JSON encoded
			for (var idx = 0; idx < v_aRemove.length; ++idx)
			{
				delete v_oData[v_aRemove[idx]];
			}
			// Add JSON encoded properties
			v_oAdd.forEach( function(value, key) {
				v_oData[key] = value;
			});
		}

		this.m_oParameterMap[v_sKey] = v_oData;
		return v_sKey;
	};

	/**
	 * Store data as a string in the browser local storage.
	 * @param v_oData The data to be stored
	 * @return The key to be used to retrieve the data, undefined if something went wrong.
	 */
	rsLaunchParameters.StoreString = function( v_oData )
	{
		// Use + as an indicator that the key is for browser local storage
		var v_sKey = '+rsLP' + Date.now().toString();
		window.localStorage.setItem( v_sKey, JSON.stringify(v_oData) );
		return v_sKey;
	};

	/**
	 * Create a wrapper where the Store method registers fact that when retrieving data,
	 * the parent of the opener should be used instead of the opener itself.
	 * @return An alternate version of Store that indicates parent should be used to retrieve.
	 */
	rsLaunchParameters.UseParent = function()
	{
		return {
			Store: function( v_oData, v_bJSONEncode ) {
				return this.Store( v_oData, v_bJSONEncode, true );
			}.bind(this),
			StoreString: this.StoreString.bind(this),
			GetTemplate: this.GetTemplate.bind(this)
		};
	};

	/**
	 * Retrieve data.  The data is removed from the service so calling this method a second time
	 * with the same key will return undefined.
	 * @param v_sKey The key to the data to be retrieved (see Store()).
	 * @return The data associated with v_sKey or undefined.
	 */
	rsLaunchParameters.Retrieve = function( v_sKey )
	{
		var v_oReturn;

		if (v_sKey)
		{
			if (v_sKey.indexOf('+') == 0)
			{
				var v_sData = window.localStorage.getItem( v_sKey );
				window.localStorage.removeItem( v_sKey );
				v_oReturn = JSON.parse( v_sData );
			}
			else
			{
				var v_oOpenerLaunchParameters = getOpenerLaunchParameters(v_sKey.indexOf('-') == 0);
				if (v_oOpenerLaunchParameters)
				{
					v_oReturn = v_oOpenerLaunchParameters.m_oParameterMap[v_sKey];
					if (v_oReturn)
					{
						// Temporarily remove any property that we believe is not extendable by jquery
						// We know for a fact that jquery 3.3 does not handle window objects
						var v_oNonExtendable = {};

						for (var p in v_oReturn)
						{
							if (v_oReturn.hasOwnProperty( p ))
							{
								if (v_oReturn[p] && typeof v_oReturn[p].toString == 'function' && v_oReturn[p].toString().indexOf('Window') >= 0)
								{
									v_oNonExtendable[p] = v_oReturn[p];
									delete v_oReturn[p];
								}
							}
						}

						try
						{
							v_oReturn = $.extend( true, {}, v_oReturn );
						}
						catch (e)
						{
							console.log('rsLaunchParameters.Retrieve failed to extend launch parameters');
						}

						// Restore non-extendable properties
						for (var p in v_oNonExtendable)
						{
							v_oReturn[p] = v_oNonExtendable[p];
						}

						// Parse any properties that were JSON encoded
						var v_oParsed = {};
						for (var p in v_oReturn)
						{
							if (p.indexOf('JSON_') == 0 && v_oReturn.hasOwnProperty( p ))
							{
								var v_sP = p.slice(5);
								v_oParsed[v_sP] = JSON.parse(v_oReturn[p]);
							}
						}
						// Replace JSON encoded properties with their parsed version
						for (var p in v_oParsed)
						{
							if (v_oParsed.hasOwnProperty( p ))
							{
								v_oReturn[p] = v_oParsed[p];
								delete v_oReturn['JSON_' + p];
							}
						}
					}
					delete v_oOpenerLaunchParameters.m_oParameterMap[v_sKey];
				}
			}
		}

		return v_oReturn;
	};

	return rsLaunchParameters;
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
	(C) Copyright IBM Corp. 2003, 2022
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define('bi/authoring/utils/rsOpenHelper',[
	'jquery',
	'bi/authoring/utils/rsIFrameManager',
	'bi/authoring/utils/pat/rsCommon',
	'bi/authoring/nls/StringResource',
	'bi/commons/utils/LegacyUtils',
	'bi/authoring/utils/pat/rsLaunchParameters',
	'bi/authoring/utils/pat/rsPromptParameters',
	'bi/authoring/utils/C_Defer'
	],
function($, rsIFrameManager, rsCommon, StringResource, LegacyUtils, rsLaunchParameters, rsPromptParameters, C_Defer) {
	'use strict';

	var legacyUtils = null;

	/**
	 * This method extends LegacyUtils by adding the method we need
	 * Once LegacyUtils in ba-core-client is updated we can remove this method and
	 * use LegacyUtils directly
	 */
	function getLegacyUtils()
	{
		if (!legacyUtils)
		{
			legacyUtils = LegacyUtils;
			if (!legacyUtils.getLegacyLaunchUrl)
			{
				legacyUtils.getLegacyLaunchUrl = function(glassContext, tool, object, action)
					{
						var qParms = this._getLaunchParms(glassContext, tool, object); // eslint-disable-line no-underscore-dangle
						qParms['ui.action'] = action;
						return this._getUrl(qParms); // eslint-disable-line no-underscore-dangle
					}.bind(LegacyUtils);
			}
		}
		return legacyUtils;
	}

	/**
	 * Retrieve the URL that will launch the legacy application
	 * Reject if unable to retrieve URL
	 */
	function getLegacyLaunchUrl( oOpenSpec )
	{
		const tool = oOpenSpec.cmProperties.type == 'query' ? 'QueryStudio' : 'AnalysisStudio';
		const searchPath = `storeID("${oOpenSpec.cmProperties.id}")`;
		let v_sLaunchURL = getLegacyUtils().getLegacyLaunchUrl( oOpenSpec.glassContext, tool, searchPath, 'edit' );
		if (oOpenSpec.urlMap.prompt != undefined)
		{
			v_sLaunchURL = v_sLaunchURL + '&prompt=' + (oOpenSpec.urlMap.prompt ? 'true' : 'false');
		}
		// TODO add content and product locale to URL
		let v_sParameterValuesXML = oOpenSpec.urlMap.parameterValuesXML;
		if (!v_sParameterValuesXML && oOpenSpec.urlMap.parameterValuesJSON)
		{
			v_sParameterValuesXML = rsPromptParameters.rsBuildPromptParameters(null, oOpenSpec.urlMap.parameterValuesJSON, 'parameters');
		}
		if (v_sParameterValuesXML)
		{
			v_sLaunchURL = `${v_sLaunchURL}&ui.drillThroughTargetParameterValues=${encodeURIComponent(v_sParameterValuesXML)}`;
		}
		return v_sLaunchURL;
	}

	function runActiveReportInNewWindow( urlMap )
	{
		const v_sCmPath = `storeID("${urlMap.id}")`;

		const v_sA11y = urlMap.a11y ? '&' + encodeURIComponent('system.http://developer.cognos.com/ceba/constants/systemOptionEnum#accessibilityFeatures') + '=true' : '';
		const v_sBidi = urlMap.bidi ? '&' + encodeURIComponent('biDirectional.http://developer.cognos.com/ceba/constants/biDirectionalOptionEnum#biDirectionalFeaturesEnabled') + '=true' : '';
		const v_sPrompt = urlMap.prompt != undefined ? `&run.prompt=${urlMap.prompt}` : '';
		const v_sUri = `v1/disp?b_action=cognosViewer&ui.action=run&ui.object=${v_sCmPath}${v_sPrompt}${v_sA11y}${v_sBidi}`;
		try
		{
			const v_oWin = window.open( v_sUri, '', '');
			v_oWin.focus();

			return Promise.resolve(v_oWin);
		}
		catch (e)
		{
			return rsCommon.reject( new C_Defer(), 'Failed to opend window: ' + e.toString(), 'rsOpenHelper.runActiveReportInNewWindow' );
		}
	}

	function isActiveReport( cmProperties )
	{
		return rsCommon.isObjectOfType( cmProperties, 'interactiveReport' );
	}

	function isDataSet2( cmProperties )
	{
		return rsCommon.isObjectOfType( cmProperties, 'dataSet2' );
	}

	function isReport_ish( cmProperties )
	{
		return rsCommon.isObjectOfType( cmProperties, ['report', 'reportView', 'reportTemplate', 'interactiveReport', 'dataSet2', 'query', 'analysis'] );
	}

	function loadCmProperties( v_oUrlMap, v_oCmProperties )
	{
		if (v_oCmProperties)
		{
			// The id identifies the content-view.
			// By convention we are using the store-id to uniquely identify loaded content views.
			v_oUrlMap.cmProperties = v_oCmProperties;
			v_oUrlMap.id = v_oCmProperties.id;
			v_oUrlMap.type = v_oCmProperties.type;
		}
	}

	function getType(v_sId, glassContext)
	{
		const v_sSearchPathUrl = `v1/objects/${v_sId}?fields=type`;

		return glassContext.services.fetch.get(v_sSearchPathUrl)
			.then(({ data }) => data.data[0].type);
	}

	/**
	 * Return the default action based on the action ID and the CM properties.
	 * null means no action is allowed.
	 * undefined means we can't determine the default action.
	 */
	function determineDefaultAction(v_sActionId, v_oCmProperties, glassContext, urlMap)
	{
		if (urlMap && (urlMap.m_oPromptContext || (urlMap.m_oLaunchParameters && urlMap.m_oLaunchParameters.promptContext)))
		{
			// If we have a prompt context then we are handling prompting so the action is run
			// The classic and authoring perspectives load the prompt context differently hence the || in the condition.
			return glassContext.hasCapability('canUseCognosViewer') ? 'run' : 'none';
		}

		var v_sAction; // = undefined;

		if (v_oCmProperties)
		{
			switch (v_oCmProperties.type)
			{
				case 'reportVersion':
				case 'output':
					// reportVersion and output objects can only be viewed
					v_sAction = (v_oCmProperties.permissions.indexOf('read') != -1 && glassContext.hasCapability('canUseCognosViewer')) ? 'viewOutput' : 'none';
					break;

				default:
					if (urlMap && (urlMap.ro || urlMap.rv))
					{
						// report output (ro) or reportVersion (rv) parameter specified. These parameters indicate a request to view output.
						// We got the report but we realy wanted the output so set action to view
						v_sAction = (v_oCmProperties.permissions.indexOf('read') != -1 && glassContext.hasCapability('canUseCognosViewer')) ? 'viewOutput' : 'none';
					}
					else if (v_oCmProperties.defaultPortalAction)
					{
						var v_bDefault = true;
						v_sAction = v_oCmProperties.defaultPortalAction;

						var v_sType = v_oCmProperties.type;
						switch (v_sActionId)
						{
						case 'com.ibm.bi.authoring.run':
						case 'com.ibm.bi.contentApps.action.runAs':
						case 'com.ibm.bi.authoringContrib.runBtn':
							v_sAction = 'run';
							v_bDefault = false;
							break;

						default:
							if (v_sActionId && v_sActionId.indexOf('com.ibm.bi.contentApps.defaultAction.') == -1) {
								// A non-default action id was specified that is not one of the values above
								// Assume edit.
								v_sAction = 'edit';
								v_bDefault = false;
							}
						}

						switch (v_sType)
						{
							case 'dataSet2':
								// Can only edit datasets.  Switch action to edit if allowed.
								v_sAction = (v_oCmProperties.permissions.indexOf('read') != -1 && glassContext.hasCapability( 'canUseMyDataSets' )) ? 'edit' : 'none';
								break;

							case 'reportTemplate':
								// Can only edit report templates.  Switch action to edit if allowed.
								v_sAction = (v_oCmProperties.permissions.indexOf('read') != -1 && glassContext.hasCapability( 'canUseReportStudio' )) ? 'edit' : 'none';
								break;

							case 'reportView':
								if (v_sAction == 'edit')
								{
									// Can't edit report views.  Switch action to run instead.
									v_sAction = v_bDefault ? 'run' : null;
								}
								// fall through to default case

							default:
								var v_sStudioCapability;
								var v_bIsLegacy = false;
								switch (v_sType)
								{
									case 'query':
										v_sStudioCapability = 'canUseQueryStudio';
										v_bIsLegacy = true;
										break;

									case 'analysis':
										v_sStudioCapability = 'canUseAnalysisStudio';
										v_bIsLegacy = true;
										break;

									default:
										v_sStudioCapability = 'canUseReportStudio';
							}
							if (v_bIsLegacy && v_sAction == 'edit')
							{
								var v_bTool = LegacyUtils.canUseLegacyTool( glassContext, v_sType == 'query' ? 'QueryStudio' : 'AnalysisStudio');
								// Change edit to legacy if it is supported (e.g. Chrome does not support Query Studio) else run
								v_sAction = v_bTool ? 'legacy' : 'run';
							}

							switch (v_sAction)
							{
								case 'edit':
								case 'legacy':
									if (v_oCmProperties.permissions.indexOf('read') == -1 || !glassContext.hasCapability( v_sStudioCapability ))
									{
										// Can't edit object without read access or the appropriate capability.  Switch action to run if allowed.
										v_sAction = (v_oCmProperties.permissions.indexOf('execute') != -1 && v_bDefault) ? 'run' : 'none';
									}
									break;

								case 'run':
									if (v_oCmProperties.permissions.indexOf('execute') == -1)
									{
										// Can't execute report.  Switch action to view if allowed.
										v_sAction = (v_oCmProperties.permissions.indexOf('read') != -1 && v_bDefault) ? 'viewOutput' : 'none';
									}
									break;

								case 'viewOutput':
									if (v_oCmProperties.permissions.indexOf('read') == -1)
									{
										// Can't view report.  Switch action to run if allowed.
										v_sAction = (v_oCmProperties.permissions.indexOf('execute') != -1 && v_bDefault) ? 'run' : 'none';
									}
									break;

								default:
									v_sAction = null;
							}
							if ((v_sAction == 'run' || v_sAction == 'viewOutput') && !glassContext.hasCapability('canUseCognosViewer'))
							{
								v_sAction = 'none';
							}
							break;
						}
					}
			}
		}
		else if (urlMap && urlMap.isNew)
		{
			// No object available so either creating something new or we have an inline spec
			if (urlMap.isViewer)
			{
				v_sAction = glassContext.hasCapability('canUseCognosViewer') ? 'run' : 'none';
			}
			else if (urlMap.perspective == 'authoring')
			{
				v_sAction = glassContext.hasCapability('canUseReportStudio') ? 'edit' : 'none';
			}
			else if (urlMap.perspective == 'datasets')
			{
				v_sAction = glassContext.hasCapability('canUseMyDataSets') ? 'edit' : 'none';
			}
			else
			{
				v_sAction = 'none';
			}
		}
		return v_sAction;
	}

	function determineAction(v_oOpenSpec)
	{
		var v_sAction;
		var v_bAllowLegacy = true;
		var v_sCreateType;

		switch (v_oOpenSpec.actionId)
		{
			case 'com.ibm.bi.authoring.run':
			case 'com.ibm.bi.contentApps.action.runAs':
				v_sAction = 'run';
				break;

			case 'com.ibm.bi.authoring.createReportFromModule':
			case 'com.ibm.bi.authoring.createReportFromPackage':
				v_sCreateType = 'report';
				v_sAction = 'edit';
				break;

			case 'com.ibm.bi.datasets.createDataSetFromModule':
			case 'com.ibm.bi.datasets.createDataSetFromPackage':
				v_sCreateType = 'dataSet2';
				v_sAction = 'edit';
				break;

			case 'com.ibm.bi.authoring.convertToReport':
				v_sAction = 'edit';
				v_bAllowLegacy = false; // force edit
				break;

			default:
				v_sAction = v_oOpenSpec.urlMap.action;
		}

		// v_sAction is the requested action or undefined when no action was specified.
		// The following code verifies if explicit action is allowed and adjusts accordingly.
		// Setting the action to null indicates an invalid action.
		// Setting the action to none means the suer is not allowed to perform the action.
		switch (v_sAction)
		{
			case 'default': // classic viewer sends this
			case undefined:
				// Action unspecified, determine default from object
				v_sAction = determineDefaultAction(v_oOpenSpec.actionId, v_oOpenSpec.urlMap.cmProperties, v_oOpenSpec.glassContext, v_oOpenSpec.urlMap);
				v_oOpenSpec.defaultAction = true;
				break;

			case 'edit':
			case 'run':
			case 'viewOutput':
				var sObjectType = v_oOpenSpec.urlMap.cmProperties ? v_oOpenSpec.urlMap.cmProperties.type : undefined;
				switch (sObjectType)
				{
					case 'reportVersion':
					case 'output':
						// reportVersion and output objects can only be viewed
						v_sAction = v_oOpenSpec.glassContext.hasCapability('canUseCognosViewer') ? 'viewOutput' : 'none';
						break;

					case 'reportView':
						switch (v_sAction)
						{
							case 'edit':
								// can't edit views
								v_sAction = null;
								break;

							case 'run':
							case 'viewOutput':
								if (!v_oOpenSpec.glassContext.hasCapability('canUseCognosViewer'))
								{
									v_sAction = 'none';
								}
								break;
						}
						break;

					case 'dataSet2':
						switch (v_sAction)
						{
							case 'edit':
								if (!v_oOpenSpec.glassContext.hasCapability('canUseMyDataSets'))
								{
									v_sAction = 'none';
								}
								break;

							case 'run':
							case 'viewOutput':
								// can't run or view datasets
								v_sAction = null;
								break;
						}
						break;

					default:
						if (v_oOpenSpec.urlMap.isNew || !isReport_ish( v_oOpenSpec.urlMap.cmProperties ))
						{
							v_sAction = 'edit';
						}
						if (v_sAction == 'edit' && (sObjectType == 'query' || sObjectType == 'analysis') && v_bAllowLegacy)
						{
							// edit on query and analysis means run the corresponding studio, not RS
							// But if the tool is not allowed, switch to run
							v_sAction = (LegacyUtils.canUseLegacyTool( v_oOpenSpec.glassContext, sObjectType == 'query' ? 'QueryStudio' : 'AnalysisStudio')) ? 'legacy' : 'run';
						}
						switch (v_sAction)
						{
							case 'edit':
								if (!v_oOpenSpec.glassContext.hasCapability(v_sCreateType == 'dataSet2' ? 'canUseMyDataSets' : 'canUseReportStudio'))
								{
									v_sAction = 'none';
								}
								break;

							case 'run':
							case 'viewOutput':
								if (!v_oOpenSpec.glassContext.hasCapability('canUseCognosViewer'))
								{
									v_sAction = 'none';
								}
								break;
						}
				}
				break;

			default:
				// Unexpected action, change to null
				v_sAction = null;
		}
		v_oOpenSpec.urlMap.action = v_sAction;
	}

	/**
	 * Initialize the urlMap in the given open spec
	 * @return the updated open spec
	 */
	function prepareUrlMap(v_oOpenSpec, v_oCmProperties)
	{
		const urlMap = v_oOpenSpec.urlMap || {};
		rsCommon.convertStringQSToValues(urlMap, v_oOpenSpec.glassContext, v_oOpenSpec.trimURLParameterValues);

		let dataset = false;

		switch (v_oOpenSpec.actionId)
		{
			case 'com.ibm.bi.datasets.createDataSetFromModule':
			case 'com.ibm.bi.datasets.createDataSetFromPackage':
				urlMap.startingTemplate = 'DatasetList';
				dataset = true;
				urlMap.isNew = true;
				break;

			case 'com.ibm.bi.contentApps.defaultAction.dataSet2':
			case 'com.ibm.bi.datasets.editDataset':
				dataset = true;
				break;

			case 'com.ibm.bi.authoring.createReportFromModule':
			case 'com.ibm.bi.authoring.createReportFromPackage':
				urlMap.isNew = true;
				break;

			default:
				// In case there is no CM object and somehow the perspective was specified, use it to determine if we are dealing with a dataset
				dataset = isDataSet2(v_oCmProperties) || (!v_oCmProperties && urlMap.perspective == 'datasets');
				// If object type is not one of the report-ish types, assume we are doing a new and the CM object is the metadata source object (package/module)
				urlMap.isNew = !isReport_ish( v_oCmProperties );
				break;
		}

		loadCmProperties( urlMap, v_oCmProperties );

		urlMap.isApplication = isActiveReport(v_oCmProperties);
		if (!urlMap.perspective && dataset)
		{
			// perspective not specified but we know we are dealing with a dataset
			// so only option is the dataset perspective
			urlMap.perspective = 'datasets';
		}
		urlMap.UIProfile = urlMap.perspective == 'datasets' ? 'TitanDataset' : 'Titan';

		rsCommon.decodeAndMoveRSOptions(urlMap);

		v_oOpenSpec.urlMap = urlMap;

		determineAction(v_oOpenSpec);

		return v_oOpenSpec;
	}

	// CM Options are an array like:
	// [
	//	0: {name: optionName1, value: optionValue1, type: cmOptionType }
	//	1: {name: optionName2, value: optionValue2, type: cmOptionType }
	//	2: {name: optionName1, value: optionValue3, type: cmOptionType }
	//	...
	// ]
	//
	// convert into a regular object
	// {
	//	optionName1: [optionValue1, optionValue3],
	//	optionName2: optionValue2
	//	...
	// }
	function convertToObjectFromCmOptionsArray(aCmOptions)
	{
		if (!aCmOptions || !Array.isArray(aCmOptions))
		{
			return aCmOptions;
		}
		const oReturn = {};

		aCmOptions.forEach(function(oOption) {
			if (typeof oReturn[oOption.name] === 'undefined')
			{
				oReturn[oOption.name] = oOption.value;
			}
			else if (Array.isArray(oReturn[oOption.name]))
			{
				oReturn[oOption.name].push( oOption.value);
			}
			else
			{
				// we already have value and it's not an array
				// add existing value AND the new value into an array
				// replace the whole value with the new array
				oReturn[oOption.name] = [oReturn[oOption.name], oOption.value];
			}
		});
		return oReturn;
	}

	function convertCmOptionsToSimpleArray(cmProperties)
	{
		// convert options
		cmProperties.options = convertToObjectFromCmOptionsArray(cmProperties.options);
		// convert options in base if any
		if (cmProperties.base && cmProperties.base.length > 0 && cmProperties.base[0])
		{
			cmProperties.base[0].options = convertToObjectFromCmOptionsArray( cmProperties.base[0].options );
		}
	}

	function getCMInfoForOpen( cmProperties, v_aProperties, glassContext )
	{
		let v_sReportViewUrl = `v1/objects/${cmProperties.id}`;

		const v_aFields = v_aProperties.map(v_sField => v_sField);

		const v_sReportViewPropsUrl = v_sReportViewUrl.concat('?fields=', v_aFields.join(','));

		return glassContext.services.ajax.ajax({
				url: v_sReportViewPropsUrl,
				type: 'GET',
				dataType: 'json'
			})
			.then( function(resp) {
				if (!resp || !resp.data || resp.data.length <= 0 )
				{
					return rsCommon.reject( new C_Defer(), 'unexpected response', 'rsOpenHelper.getCMInfoForOpen' );
				}

				var v_oData = resp.data[0];

				convertCmOptionsToSimpleArray(v_oData);
				convertCmOptionsToSimpleArray(cmProperties);

				// Extend new cm properties with the ones we already have
				var v_oCurrentCmProperties = cmProperties;
				for (var v_sProperty in v_oCurrentCmProperties)
				{
					if (v_oCurrentCmProperties.hasOwnProperty(v_sProperty) && v_oData[v_sProperty] == undefined) {
						v_oData[v_sProperty] = v_oCurrentCmProperties[v_sProperty];
					}
				}
				return v_oData;
			})
			.catch( function(err) {
				console.log('rsOpenHelper.getCMInfo ... FAILED');

				throw err;
			});
	}

	function f_determineMissingProperties( v_aProperties, v_oCmProperties )
	{
		const v_aMissingProperties = [];

		// Check if we are missing any of the required properties
		let len = v_aProperties.length;
		for ( let i = 0; i < len; ++i )
		{
			var v_sProperty = v_aProperties[i];
			if (typeof v_oCmProperties[v_sProperty] == 'undefined')
			{
				v_aMissingProperties.push( v_sProperty );
			}
		}

		return v_aMissingProperties;
	}

	// The list of CM properties required by rs (all scenarios including edit, viewer, share etc.)
	var m_aProperties = [
		'ancestors',
		'defaultDescription',
		'defaultName',
		'defaultPortalAction',
		'id',
		'modificationTime',
		'options',
		'owner',
		'parent',
		'permissions',
		'routingServerGroup',
		'runInAdvancedViewer',
		'searchPath',
		'format',
		'type'
	];

	var m_aOutputProperties = [
		'ancestors',
		'dataDescriptor',
		'defaultName',
		'burstKey',
		'id',
		'modificationTime',
		'owner',
		'parent',
		'permissions',
		'searchPath',
		'type',
		'format',
		'locale',
		'lastPage'
	];

	var m_aReportVersionProperties = [
		'decoratedSpecification',
		'id',
		'parent',
		'permissions'
	];

	function extractProperties( v_aPropertiesSpec, type )
	{
		let v_aProperties;
		if (v_aPropertiesSpec)
		{
			v_aProperties = [];
			for (let idx = 0; idx < v_aPropertiesSpec.length; ++idx)
			{
				if (!type || !v_aPropertiesSpec[idx].type || v_aPropertiesSpec[idx].type.includes(type))
				{
					v_aProperties.push(v_aPropertiesSpec[idx].property);
				}
			}
		}
		return v_aProperties;
	}

	/**
	 * Get the cm object with all the necessary properties.
	 * @param v_oCmProperties Current know properties.
	 * @param glassContext The glass context.
	 * @param v_aPropertiesSpec Set of properties to be retrieved.  This is optional and if unspecified,
	 * the complete set of properties needed by authoring will be retrieved.
	 * This is an array of objects { property, type } where prop is the property and type is an optional array of types
	 * to which the property applies.
	 * @return The requested cm properties.
	 */
	function retreiveCMInfo(v_oCmProperties, glassContext, v_aPropertiesSpec)
	{
		if (v_oCmProperties && v_oCmProperties.id && !v_oCmProperties.type)
		{
			// deal with situation where we were given an id but no type (URL with perspective and objRef)
			return getType(v_oCmProperties.id, glassContext)
				.then(function(v_sType) {
					v_oCmProperties.type = v_sType;
					return retreiveCMInfo(v_oCmProperties, glassContext, v_aPropertiesSpec);
				});
		}

		// Based on type of given object, retrieve all potentially required information
		switch (v_oCmProperties ? v_oCmProperties.type : 'none')
		{
			case undefined:
				return rsCommon.reject( new C_Defer(), 'Missing properties or id', 'rsOpenHelper.retreiveCMInfo' );

			case 'none':
				return Promise.resolve(undefined);

			case 'output':
				var v_aRequestProperties = f_determineMissingProperties( extractProperties(v_aPropertiesSpec, 'output') || m_aOutputProperties, v_oCmProperties );

				return getCMInfoForOpen( v_oCmProperties, v_aRequestProperties, glassContext )
					.then( function( v_oOutput ) {
						if (v_aPropertiesSpec)
						{
							return v_oOutput;
						}

						// For output, we need the reportVersion
						var v_oCmProperties = { id: v_oOutput.parent[0].id };
						return getCMInfoForOpen( v_oCmProperties, m_aReportVersionProperties, glassContext )
							.then( function( v_oVersion ) {
								v_oOutput.parent[0] = v_oVersion; // link version to output
								// We also need the reportVersion parent (report, active report, reortView, query, analysis)
								// Since we are dealing with an output, we don't need the full set of report properties
								// so only ask for the minimal set.
								var v_oCmProperties = { id: v_oVersion.parent[0].id };
								return getCMInfoForOpen( v_oCmProperties, ['id', 'defaultName', 'type', 'runInAdvancedViewer', 'base.type', 'base.runInAdvancedViewer'], glassContext )
									.then( function(v_oReport) {
										v_oVersion.parent[0] = v_oReport; // link report to reportVersion
										return v_oOutput;
									});
							});
					})
					.catch( function(err) {
						console.log('rsOpenHelper.retreiveCMInfo ... FAILED');
						throw err;
					});

			case 'reportVersion':
				var v_aRequestProperties = f_determineMissingProperties( extractProperties(v_aPropertiesSpec, 'reportVersion') || m_aReportVersionProperties, v_oCmProperties );

				return getCMInfoForOpen( v_oCmProperties, v_aRequestProperties, glassContext )
					.then( function( v_oVersion ) {
						if (v_aPropertiesSpec)
						{
							return v_oVersion;
						}

						// We also need the reportVersion parent (report, active report, reortView, query, analysis)
						// Since we are dealing with an output, we don't need the full set of report properties
						// so only ask for the minimal set.
						var v_oCmProperties = { id: v_oVersion.parent[0].id };
						return getCMInfoForOpen( v_oCmProperties, ['id', 'defaultName', 'type', 'runInAdvancedViewer', 'base.type'], glassContext )
							.then( function(v_oReport) {
								v_oVersion.parent[0] = v_oReport;
								return v_oVersion;
							});
					})
					.catch( function(err) {
						console.log('rsOpenHelper.retreiveCMInfo ... FAILED');
						throw err;
					});

			case 'report':
			case 'reportView':
			case 'reportTemplate':
			case 'interactiveReport':
			case 'dataSet2':
			case 'query':
			case 'analysis':
				var v_aRequestProperties = f_determineMissingProperties( extractProperties(v_aPropertiesSpec, 'report') || m_aProperties, v_oCmProperties );

				var v_bNeedBase = !v_aPropertiesSpec && v_oCmProperties.type == 'reportView';
				if (v_bNeedBase)
				{
					// Dealing with a report view, get base properties
					const l = v_aRequestProperties.length;
					let v_bHasId = false;
					for (var i = 0; i < l; ++i)
					{
						v_aRequestProperties.push( 'base.' + v_aRequestProperties[i] );
						if (!v_bHasId && v_aRequestProperties[i] == 'id')
						{
							v_bHasId = true;
						}
					}
					if (!v_bHasId)
					{
						v_aRequestProperties.push( 'base.id' );
					}
				}
				else if (v_oCmProperties.type == 'report' || v_oCmProperties.type == 'interactiveReport' || v_oCmProperties.type == 'reportTemplate' || v_oCmProperties.type == 'dataSet2')
				{
					if (!(v_oCmProperties.metadataModelPackage && v_oCmProperties.metadataModelPackage[0] && v_oCmProperties.metadataModelPackage[0].effectiveUserCapabilities)) {
						v_aRequestProperties.push('metadataModelPackage.effectiveUserCapabilities');
					}

					if (!(v_oCmProperties.module && v_oCmProperties.module[0] && v_oCmProperties.module[0].effectiveUserCapabilities))
					{
						v_aRequestProperties.push('module.effectiveUserCapabilities');
					}
				}

				if (v_aRequestProperties.length > 0)
				{
					return getCMInfoForOpen( v_oCmProperties, v_aRequestProperties, glassContext )
						.catch( function(err) {
							console.log('rsOpenHelper.retreiveCMInfo ... FAILED');
							throw err;
						});
				}

				// We know everything we need to
				return Promise.resolve(v_oCmProperties);

			default:
				// Non-report like object, simply return it
				var v_aRequestProperties = f_determineMissingProperties( extractProperties(v_aPropertiesSpec, null) || ['type', 'searchPath'], v_oCmProperties );

				if (v_aRequestProperties.length > 0)
				{
					return getCMInfoForOpen( v_oCmProperties, v_aRequestProperties, glassContext )
						.catch( function(err) {
							console.log('rsOpenHelper.retreiveCMInfo ... FAILED');
							throw err;
						});
				}

				// We know everything we need to
				return Promise.resolve(v_oCmProperties);
		}
	}

	// Formats supported by interactive viewer
	const g_interactiveViewerFormats = new Set(['HTML', 'PDF', 'spreadsheetML', 'xlsxData', 'CSV', 'XML', 'XHTML']);

	function getValueFromFieldIfDefined(v_o, v_sField)
	{
		if (!v_o)
		{
			return;
		}

		// v_o may have come from a JSON response
		// JSON does not support undefined as a value
		// therefore we treat null as undefined
		if (typeof v_o[v_sField] === 'undefined' || v_o[v_sField] === null)
		{
			return;
		}

		return { value: v_o[v_sField] };
	}

	function getFirstValueFromArrayFieldIfDefined(v_o, v_sField)
	{
		const o = getValueFromFieldIfDefined(v_o, v_sField);
		if (!o)
		{
			return;
		}

		const a = o.value;
		if (a.length < 1)
		{
			return;
		}

		// In certain cases 'a' is not an array but a string (powerPlay8Report for example)
		return { value: (Array.isArray(a) ? a[0] : a) };
	}

	// Run in advanced viewer if the property says so
	function determineRunInAdvancedViewer(v_oProperties)
	{
		const o = getValueFromFieldIfDefined(v_oProperties, 'runInAdvancedViewer');
		return o ? o.value : false;
	}

	function isRunInAdvancedViewer(v_oCmProperties, v_sFormat)
	{
		// Determine the consolidated runInAdvancedViewer

		// The default for v_bRunInAdvancedViewer is false.
		// Why?
		// * For 'analysis' and 'query' we want to direct people to classic viewer to preserve their previous experience.
		// * For 'report' it maybe set, in which case we use the set value, or if not set, we use the default
		// * For 'interactiveReport' we don't care because we don't "view" them in the authoring perspective
		//
		let v_bRunInAdvancedViewer = determineRunInAdvancedViewer((v_oCmProperties && v_oCmProperties.base && v_oCmProperties.base[0]) || v_oCmProperties );

		if ( v_bRunInAdvancedViewer && v_sFormat && !g_interactiveViewerFormats.has(v_sFormat))
		{
			v_bRunInAdvancedViewer = false;
		}

		return v_bRunInAdvancedViewer;
	}

	// Any run settings that have to be consolidated/reconciled from several sources,
	// i.e., the ultimate or final values
	//
	// returns
	//
	// {
	//		format : null | 'HTML' | 'PDF' | etc
	//		runInAdvancedViewer: true | false
	//		prompt: true | false
	// }
	function consolidateAndReconcileRunOptions(v_oOpenSpec)
	{
		const urlMap = v_oOpenSpec.urlMap;
		const v_oCmBaseProperties = (urlMap.cmProperties && urlMap.cmProperties.base) ? urlMap.cmProperties.base[0] : null;
		const v_oCmProperties = urlMap.cmProperties || {};
		const v_oPreferences = v_oOpenSpec.glassContext.services.userProfile.preferences;

		// Determine the consolidated output format
		if (urlMap.format == undefined)
		{
			let v_sFormat = urlMap.OutputFormat || v_oPreferences.format;
			let o = getFirstValueFromArrayFieldIfDefined(v_oCmBaseProperties && v_oCmBaseProperties.options, 'outputFormat');
			if (o)
			{
				v_sFormat = o.value || v_sFormat;
			}
			o = getFirstValueFromArrayFieldIfDefined(v_oCmProperties.options, 'outputFormat');
			if (o)
			{
				v_sFormat = o.value || v_sFormat;
			}
			if (isActiveReport(v_oCmProperties) || !rsCommon.isOutputFormatAllowed(v_sFormat, v_oOpenSpec.glassContext))
			{
				// Replace invalid system determined format with HTML if format is invalid for current user
				v_sFormat = 'HTML';
			}
			o = getValueFromFieldIfDefined(v_oOpenSpec.runOptions, 'format');
			if (o)
			{
				v_sFormat = o.value || v_sFormat;
			}

			urlMap.format = v_sFormat;
		}


		// Determine the consolidated a11y mode.
		// Note there is no run option for a11y in Titan, but there is a user preference & a report option
		if (urlMap.a11y == undefined)
		{
			let v_bA11y = v_oPreferences.accessibilityFeatures;
			let o = getValueFromFieldIfDefined(v_oCmBaseProperties && v_oCmBaseProperties.options, 'http://developer.cognos.com/ceba/constants/systemOptionEnum#accessibilityFeatures');
			if (o)
			{
				v_bA11y = o.value || v_bA11y;
			}
			o = getValueFromFieldIfDefined(v_oCmProperties.options, 'http://developer.cognos.com/ceba/constants/systemOptionEnum#accessibilityFeatures');
			if (o)
			{
				v_bA11y = o.value || v_bA11y;
			}
			urlMap.a11y = v_bA11y;
		}

		// Get bidi from user preferences - only place to set it in titan
		if (urlMap.bidi == undefined)
		{
			urlMap.bidi = v_oPreferences.biDirectionalFeaturesEnabled;
		}

		// Determine consolidated prompt value
		if (urlMap.prompt == undefined)
		{
			let v_bPrompt; // default value is undefined
			let o = getValueFromFieldIfDefined(v_oCmBaseProperties && v_oCmBaseProperties.options, 'prompt');
			if (o)
			{
				v_bPrompt = o.value;
			}
			o = getValueFromFieldIfDefined(v_oCmProperties.options, 'prompt');
			if (o)
			{
				v_bPrompt = o.value;
			}
			// urlMap uses Prompt instead of executionPrompt, this happen in run options dialog in RS
			o = (urlMap.m_oLaunchParameters && urlMap.m_oLaunchParameters.RunOptions) ? getValueFromFieldIfDefined(urlMap.m_oLaunchParameters.RunOptions, 'Prompt') : getValueFromFieldIfDefined(urlMap, 'Prompt');
			if (o)
			{
				v_bPrompt = (typeof o.value === 'string') ? (o.value === 'true') : !!o.value;
			}
			// runOptions uses prompt instead of executionPrompt
			o = getValueFromFieldIfDefined(v_oOpenSpec.runOptions, 'prompt');
			if (o)
			{
				v_bPrompt = o.value;
			}
			urlMap.prompt = v_bPrompt;
		}

		// pass IncludePerformance flas as a rsFinalRunOptions attribute
		if (v_oOpenSpec.runOptions)
		{
			const o = getValueFromFieldIfDefined(v_oOpenSpec.runOptions, 'systemOptionEnum#IPA');
			if (o && (o.value === 'true' || o.value === true))
			{
				urlMap.rsFinalRunOptions = urlMap.rsFinalRunOptions || {};
				urlMap.rsFinalRunOptions.IncludePerformance = 'true';
			}
		}
	}

	function getActiveReportOutputURL( v_oCMProperties, v_oOutputProperties )
	{
		let v_sReportId, v_sOutputId;
		if (v_oOutputProperties)
		{
			v_sReportId = v_oCMProperties.id;
			v_sOutputId = v_oOutputProperties.id;
		}
		else
		{
			if (v_oCMProperties.type == 'output')
			{
				v_sReportId = v_oCMProperties.parent[0].parent[0].id;
				v_sOutputId = v_oCMProperties.id;
			}
			else
			{
				v_sReportId = v_oCMProperties.id;
				v_sOutputId = 'default';
			}
		}
		return `v1/disp/repository/sid/cm/rid/${v_sReportId}/oid/${v_sOutputId}/content/mht/content`;
	}

	/**
	 * Launch a URL by posting a form instead of using window.open
	 * This ensures there are no issues with URL length.
	 * @param sHref The URL to be opened
	 * @param bNewWindow Specifies whether a new window (true) or current window (false) should be used.
	 */
	function openUrlViaForm(sHref, bNewWindow)
	{
		let v_nDrillForm;
		try
		{
			let v_sTarget = '_self';
			if (bNewWindow)
			{
				v_sTarget = 'rsTarget' + Date.now();
				if (!window.open('', v_sTarget))
				{
					return false;
				}
			}

			const v_aUrlParts = sHref.split('?');

			v_nDrillForm = document.body.appendChild(document.createElement('form'));
			v_nDrillForm.setAttribute('name', 'drillForm');
			v_nDrillForm.setAttribute('method', 'post');
			v_nDrillForm.setAttribute('action', decodeURIComponent(v_aUrlParts[0]));
			v_nDrillForm.setAttribute('target', v_sTarget);
			v_nDrillForm.style.display = 'none';

			if (v_aUrlParts.length == 2)
			{
				// Create an input element in the form for each parameter in the query string.
				var v_aParams = v_aUrlParts[1].split('&');
				for (var i = 0; i < v_aParams.length; i++)
				{
					var v_aPair = v_aParams[i].split('=');

					var v_nFormField = v_nDrillForm.appendChild( document.createElement('input') );
					v_nFormField.setAttribute('type', 'hidden');
					v_nFormField.setAttribute('name', decodeURIComponent(v_aPair[0]));
					v_nFormField.setAttribute('value', decodeURIComponent(v_aPair[1]));
				}
			}

			v_nDrillForm.submit();
		}
		catch (e)
		{
			// If something went wrong, remove the form if it exists and return false indicating the window was not opened.
			if (v_nDrillForm)
			{
				document.body.removeChild(v_nDrillForm);
			}
			return false;
		}

		document.body.removeChild(v_nDrillForm);

		return true;
	}

	function launchViewSavedOutputApp(v_oOpenSpec)
	{
		if (v_oOpenSpec.href)
		{
			// classic active reports open in new window
			openUrlViaForm( v_oOpenSpec.href, true );
			return Promise.resolve();
		}
		return v_oOpenSpec.glassContext.openAppView(v_oOpenSpec.urlMap.perspective, { content: v_oOpenSpec.urlMap } )
			.then(() => undefined);
	}

	/**
	 * This method either opens an object in the editor or runs's it and displays the results in a viewer.
	 */
	function launchEditOrRunApp(v_oOpenSpec)
	{
		const { urlMap } = v_oOpenSpec;

		if (urlMap.action == 'run' && urlMap.isApplication && urlMap.perspective == 'classicviewer')
		{
			// We are running an active report with the classic viewer.
			// This is done in a new window.
			return runActiveReportInNewWindow( urlMap )
				.catch( function(err) {
					console.log('launchEditOrRunApp rejected');
					throw err;
				});
		}

		if (urlMap.perspective == 'authoring')
		{
			const v_oRSParameters = rsIFrameManager.createRSParameters(urlMap, v_oOpenSpec.glassContext);
			const v_oIFrameTemplateParameters = rsCommon.createTemplateParameters(v_oRSParameters);
			urlMap.launchPromise = rsIFrameManager.F_LaunchRS(v_oIFrameTemplateParameters, v_oOpenSpec.glassContext);
			// Pass RS parameters to rsContentView
			urlMap.m_oRSParameters = v_oRSParameters;
		}

		// N.B. openAppView returns a jQuery deferred / promise
		return v_oOpenSpec.glassContext.openAppView(urlMap.perspective, { content: urlMap } )
			.catch(function(err) {
				console.log(' rsOpenHelper.launchEditOrRunApp - openingAppView ... FAILED');
				throw err;
			});
	}

	function launchApp(v_oOpenSpec)
	{
		switch (v_oOpenSpec.urlMap.action)
		{
			case 'none':
				// No action is available
				v_oOpenSpec.glassContext.showToast(StringResource.get('no_action_available'), { 'type': 'warning', 'btnLabel': StringResource.get('ok_button_label') });
				return Promise.resolve();

			case 'viewOutput':
				return launchViewSavedOutputApp(v_oOpenSpec);

			case 'run':
			case 'edit':
				return launchEditOrRunApp(v_oOpenSpec);

			case 'legacy':
				var v_sLaunchUrl = getLegacyLaunchUrl( v_oOpenSpec );
				if (!openUrlViaForm( v_sLaunchUrl, true ))
				{
					return rsCommon.reject( new C_Defer(), 'Could not launch a new tab.', 'rsOpenHelper.launchApp' );
				}
				return Promise.resolve();

			default:
				return rsCommon.reject( new C_Defer(), 'Unexpected action ' + v_oOpenSpec.urlMap.action + '.', 'rsOpenHelper.launchApp' );
		}
	}

	function getSavedOutput(v_oGlassContext, v_oCmProperties, format, contentLocale, v_oUrlMap)
	{
		if (v_oCmProperties.type == 'output')
		{
			// Already have the output which should include the required parentage from rsOpenHelper.retreiveCMInfo
			return Promise.resolve( v_oCmProperties );
		}

		let v_sID = v_oCmProperties.id; // could be ID of report or reportVersion
		let outputId;
		if (v_oUrlMap)
		{
			if (v_oUrlMap.rv)
			{
				// Actual reportVersion specified, use it.
				v_sID = v_oUrlMap.rv;
			}
			outputId = v_oUrlMap.ro; // may have an output ID
		}
		return v_oGlassContext.getSvc('.Content')
			.then(function(v_oContentSvc) {
				// Get the appropriate output
				const v_sFields = 'fields=dataDescriptor,parent,locale,format,permissions,ancestors,lastPage';
				let v_sCMQueryUrl;
				if (outputId)
				{
					// If we have an output ID, this is what we query.
					v_sCMQueryUrl = `${v_oContentSvc.getBaseObjectsURL()}/${outputId}?${v_sFields}`;
				}
				else {
					// Query for the default output of the report or reportVersion
					const v_sSearchPath = `defaultOutput(storeID("${v_sID}"),"${format || ''}","${contentLocale || ''}")`;
					v_sCMQueryUrl = `${v_oContentSvc.getSearchPathUrl( v_sSearchPath )}&${v_sFields}`;
				}
				return v_oContentSvc.get(v_sCMQueryUrl, {})
					.then(function( v_oSavedOutputResp ) {
						if (v_oSavedOutputResp && v_oSavedOutputResp.data)
						{
							if (v_oSavedOutputResp.data.length > 0)
							{
								var v_oOutput = v_oSavedOutputResp.data[0];

								if (v_oCmProperties.type == 'reportVersion')
								{
									// Already have the version and it's parent (as resolved by retreiveCMInfo)
									v_oOutput.parent[0] = v_oCmProperties; // link version in output
									return v_oOutput;
								}
								// Get the reportVersion and link to output
								const v_sCMQueryUrl = `${v_oContentSvc.getBaseObjectsURL()}/${v_oOutput.parent[0].id}?fields=decoratedSpecification,id,parent`;
								return v_oContentSvc.get(v_sCMQueryUrl, {})
									.then(function(v_oVersionResponse) {
										const v_oVersion = v_oVersionResponse.data[0];
										v_oVersion.parent[0] = v_oCmProperties; // link report (or whatever) in version
										v_oOutput.parent[0] = v_oVersion; // link version in output
										return v_oOutput;
									});
							}
							else if (outputId)
							{
								// getBaseObjectsURL returns empty array when no object is found so throw
								// to replicate behaviour of getSearchPathUrl
								throw new Error();
							}
						}
						return null;
					});
			});
	}

	function promptToUseLatestOutputVersion(glassContext) {
		return new Promise(resolve => {
			const buttons = [
				{
					defaultId: 'ok',
					text: StringResource.get('no_version_ok')
				},
				'cancel'
			];

			glassContext.showMessage(
				StringResource.get('no_version_message'),
				StringResource.get('no_version_title'),
				'info', buttons, 'default',
				({ btn }) => {
					resolve({ ok: btn === 'ok' });
				}
			).then(() => {
				$('.dialogButton.secondary').focus();
			});
		});
	}

	function resolveUrlMapForSavedOutput(v_oOpenSpec)
	{
		if (!v_oOpenSpec.urlMap.action)
		{
			return Promise.reject();
		}
		if (v_oOpenSpec.urlMap.action != 'viewOutput')
		{
			return Promise.resolve(v_oOpenSpec);
		}
		return getSavedOutput( v_oOpenSpec.glassContext, v_oOpenSpec.urlMap.cmProperties, v_oOpenSpec.urlMap.format, v_oOpenSpec.urlMap.contentLocale, v_oOpenSpec.urlMap )
			.catch(() => {
				// Handle 404 response when there is no output
				if (v_oOpenSpec.urlMap.rv || v_oOpenSpec.urlMap.ro)
				{
					// We were looking for a specific report version or output which does not exist.
					// Ask user if they want the latest version.
					return promptToUseLatestOutputVersion(v_oOpenSpec.glassContext)
						.then(({ ok }) => {
							if (ok)
							{
								// Retrieve the latest saved output version.
								return getSavedOutput(v_oOpenSpec.glassContext, v_oOpenSpec.urlMap.cmProperties, v_oOpenSpec.urlMap.format, v_oOpenSpec.urlMap.contentLocale)
									.catch(() => {
										const err = new Error();
										err.name = 'NoOutputError';

										throw err;
									});
							}

							const err = new Error();
							err.name = 'UserCancelled';

							throw err;
						});
				}
				return null;
			})
			.then(function(v_oOutput) {
				if (v_oOutput && v_oOutput.type == 'output' && v_oOutput.format != 'dataSet')
				{
					const v_bActiveReport = isActiveReport(v_oOutput);
					const v_sActiveReportOutputHref = v_bActiveReport ? getActiveReportOutputURL( v_oOutput ) : null;
					if (v_sActiveReportOutputHref && (!v_oOutput.dataDescriptor || v_oOutput.dataDescriptor.type != 'interactive'))
					{
						// Force share URL that displays saved active report output of an activeReport
						// that uses the classic viewer to simply open the interactive report without the glass
						v_oOpenSpec.href = v_sActiveReportOutputHref;
						return v_oOpenSpec;
					}

					const v_oUrlMap = v_oOpenSpec.urlMap;
					//Required by glass: If a saved output has been found, the id will be set as the report id, that is used to trying to
					//open the view, the objRef will be updated to the saved output
					return rsCommon.getAvailableOutputs(v_oOpenSpec.glassContext, v_oOutput)
						.then(function(v_oSavedOutputFormats) {
							if (!v_oSavedOutputFormats || !v_oSavedOutputFormats.data || v_oSavedOutputFormats.data.length <= 0)
							{
								throw new Error('Unexpected response for rsCommon.getAvailableOutputs');
							}
							v_oUrlMap.perspective = isRunInAdvancedViewer(v_oOutput.parent[0].parent[0], v_oOutput.format) ? 'authoring' : 'classicviewer';
							if (v_oOutput.format == 'HTML')
							{
								// HTML output has a dataDescriptor which identifies if it is interactive or not regardless of the setting on the report
								if (v_oOutput.dataDescriptor && v_oOutput.dataDescriptor.type == 'interactive')
								{
									// If output is tagged as interactive then use interactive viewer
									v_oUrlMap.perspective = 'authoring';
									v_oUrlMap.outputSpec = v_oOutput.parent[0].decoratedSpecification;
								}
								else
								{
									// Force classicviewer for output in case report object is currently interactive.
									v_oUrlMap.perspective = 'classicviewer';
								}
							}

							if ( v_oOpenSpec.glassContext.isEmbedded() )
							{
								v_oUrlMap.perspective += '_embedded';
							}

							if (!v_bActiveReport)
							{
								v_oUrlMap.format = v_oOutput.format || v_oUrlMap.format;
							}
							else
							{
								// active reports support only 1 format so no need to specify
								delete v_oUrlMap.format;
							}

							const v_oOutputLookup = {};
							for (let i = 0; i < v_oSavedOutputFormats.data.length; ++i)
							{
								const v_oAltOutput = v_oSavedOutputFormats.data[i];
								if (v_oAltOutput.locale == v_oOutput.locale)
								{
									if (!v_oAltOutput.parent[0].parent)
									{
										// Grand-parent of output is the report
										// Fill in the alternate version's grand-parent if it is not specified.
										v_oAltOutput.parent[0].parent = v_oOutput.parent[0].parent;
									}
									v_oOutputLookup[v_oAltOutput.format] = v_oAltOutput;
								}
							}
							v_oUrlMap.outputFormatLookup = v_oOutputLookup;
							v_oUrlMap.reportProperties = { // report is output grand-parent
								id: v_oOutput.parent[0].parent[0].id,
								type: v_oOutput.parent[0].parent[0].type
							};
							loadCmProperties( v_oUrlMap, v_oOutput );
							v_oUrlMap.objRef = v_oOutput.id; // use id of output object
							delete v_oUrlMap.pathRef;
							return v_oOpenSpec;
						});
				}

				// No saved output, determine alternate action
				const v_aPermissions = v_oOpenSpec.urlMap.cmProperties.permissions;
				const v_sCmType = v_oOpenSpec.urlMap.cmProperties.type;
				switch (v_sCmType)
				{
					case 'query':
					case 'analysis':
						if (v_aPermissions.indexOf('execute') != -1)
						{
							// For analysis and query, the view action becomes edit if there is no saved output (but only if user can launch studio)
							// otherwise try run
							const v_bRead = v_aPermissions.indexOf('read') != -1;
							const v_bCapability = v_oOpenSpec.glassContext.hasCapability( v_sCmType == 'query' ? 'canUseQueryStudio' : 'canUseAnalysisStudio' );
							const v_bTool = LegacyUtils.canUseLegacyTool( v_oOpenSpec.glassContext, v_sCmType == 'query' ? 'QueryStudio' : 'AnalysisStudio');
							v_oOpenSpec.urlMap.action = (v_bRead && v_bCapability && v_bTool) ? 'legacy' : 'run';
						}
						else
						{
							// use none as an indication that no action is allowed
							v_oOpenSpec.urlMap.action = 'none';
						}
						break;

					default:
						// The value none is an indication that no action is allowed
						v_oOpenSpec.urlMap.action = 'none';
						if (v_aPermissions.indexOf('execute') != -1 && v_oOpenSpec.glassContext.hasCapability('canUseCognosViewer'))
						{
							// viewOutput becomes run if there is no output
							v_oOpenSpec.urlMap.action = 'run';
						}
						// If still no action and we are dealing with a default action, use edit if allowed
						if (v_sCmType != 'reportView' && v_oOpenSpec.urlMap.action == 'none' && v_oOpenSpec.defaultAction && v_aPermissions.indexOf('read') != -1 && v_oOpenSpec.glassContext.hasCapability('canUseReportStudio'))
						{
							v_oOpenSpec.urlMap.action = 'edit';
						}
				}

				return v_oOpenSpec;
			});
	}

	function resolveUrlMapForEditRun(v_oOpenSpec)
	{
		if (v_oOpenSpec.urlMap.action !== 'viewOutput')
		{
			if (!v_oOpenSpec.urlMap.perspective)
			{
				if (isDataSet2(v_oOpenSpec.urlMap.cmProperties))
				{
					v_oOpenSpec.urlMap.perspective = 'datasets';
				}
				else
				{
					var v_bRunInAdvancedViewer = isRunInAdvancedViewer(v_oOpenSpec.urlMap.cmProperties, v_oOpenSpec.urlMap.format);
					// If using advanced viewer, perspective is authoring.  Otherwise perspective is classic
					// unless we are editing then it is authoring.
					v_oOpenSpec.urlMap.perspective = (v_bRunInAdvancedViewer || v_oOpenSpec.urlMap.action == 'edit') ? 'authoring' : 'classicviewer';
				}
			}
			if ( v_oOpenSpec.glassContext.isEmbedded() )
			{
				v_oOpenSpec.urlMap.perspective += '_embedded';
			}
			consolidateAndReconcileRunOptions(v_oOpenSpec);
		}

		return Promise.resolve(v_oOpenSpec);
	}

	function resolveUrlMap(v_oOpenSpec)
	{
		return retreiveCMInfo(v_oOpenSpec.cmProperties, v_oOpenSpec.glassContext)
			.then(prepareUrlMap.bind(null, v_oOpenSpec))
			.then(resolveUrlMapForSavedOutput)
			.then(resolveUrlMapForEditRun)
			.then(function(v_oResolvedSpec) {
				v_oResolvedSpec.urlMap.rsResolved = true;
				return v_oResolvedSpec;
			});
	}

	/**
	 * Replace the current window with the given URL and
	 * ensure glass does not complain or
	 * open URL in new window and keep glass on current perspective.
	 */
	function processHref( sHref, glassContext )
	{
		let v_oPerspective;
		const v_oCurrentContentView = (glassContext && glassContext.currentAppView) ? glassContext.currentAppView.currentContentView : null;
		if (v_oCurrentContentView)
		{
			// We have a current perspective, open url in new window and remain on current perspective
			v_oPerspective = {
					perspective: v_oCurrentContentView.perspective,
					id: v_oCurrentContentView.id
			};

			if (!openUrlViaForm(sHref, true))
			{
				return rsCommon.reject( new C_Defer(), 'Could not launch a new tab.', 'rsOpenHelper.processHref' );
			}
		}
		else
		{
			// Give something safe to glass to avoid error messages until window is replaced
			v_oPerspective = { perspective: 'home' };
			// Replace current window with given href
			openUrlViaForm(sHref, false);
		}
		return Promise.resolve( v_oPerspective );
	}

	function handleLoadPerspectiveErrors(glassContext, err) {
		if (err.name === 'UserCancelled')
		{
			return glassContext.getHomePageObject();
		}
		if (err.name === 'NoOutputError') {
			const v_oHomePage = glassContext.getHomePageObject();

			// We don't need to chain the promise as we are just displaying a toast message.
			v_oHomePage.then(() => {
				const events = glassContext.getCoreSvc('.Events');

				const handler = () => {
					glassContext.showToast(StringResource.get('no_output_available'), { type: 'error' });

					events.off('appView:loaded', handler);
				};

				events.on('appView:loaded', handler);
			});

			// Return the original promise so we don't modify the result in any way.
			return v_oHomePage;
		}

		throw err;
	}

	return {

		isReport_ish: isReport_ish,

		/**
		 * Open the appropriate view based on input.
		 * Minimum required information is
		 * openSpec {
		 *    cmProperties { id, type }
		 *    glassContext
		 * }
		 */
		openView: function( v_oOpenSpec ) {
			const { glassContext } = v_oOpenSpec;

			return resolveUrlMap( v_oOpenSpec )
				.then(launchApp)
				.catch(handleLoadPerspectiveErrors.bind(undefined, glassContext))
				.catch( function(err) {
					console.log('rsOpenHelper.openView ... FAILED');
					throw err;
				});
		},

		retrieveCmProperties: function(v_oGlassContext, v_oCmProperties, v_sStoreId)
		{
			if (v_sStoreId)
			{
				// Create an open spec compatible with retreiveCMInfo
				if (!v_oCmProperties)
				{
					v_oCmProperties = {};
				}
				if (!v_oCmProperties.id)
				{
					v_oCmProperties.id = v_sStoreId;
				}

				if (v_oCmProperties.id != v_sStoreId)
				{
					// drill through between report and output
					v_oCmProperties.id = v_sStoreId;
				}

				return retreiveCMInfo(v_oCmProperties, v_oGlassContext);
			}
			return Promise.resolve(v_oCmProperties);
		},

		/**
		 * Generate the urlMap with the appropriate entries to process the given open specification
		 * The perspective is one of the values determined by this method which is used by the glass
		 * when it needs to open a perspective for which the actual perspective is unknown
		 * (e.g. share URL)
		 */
		getPerspective: function(v_oOpenSpec)
		{
			const { glassContext } = v_oOpenSpec;
			if (v_oOpenSpec.urlMap)
			{
				return glassContext.getCoreSvc('.Config')
					.getConfigValue('RS.TrimURLParameterValues')
					.then(function(result) {
						// Indicates if parameter values in the urlMap should be trimmed of leading and trailing spaces
						v_oOpenSpec.trimURLParameterValues = result === 'true';

						return resolveUrlMap(v_oOpenSpec);
					})
					.then( function(v_oOpenSpecResolved) {
						if (!v_oOpenSpecResolved) {
							// Could not resolve, report error so that glass can try next registered handler
							return Promise.reject();
						}

						if (v_oOpenSpecResolved.urlMap && v_oOpenSpecResolved.urlMap.action == 'legacy')
						{
							if (v_oOpenSpec.urlMap.launchParametersKey)
							{
								var v_oLaunchParameters = rsLaunchParameters.Retrieve(v_oOpenSpec.urlMap.launchParametersKey);
								delete v_oOpenSpec.urlMap.launchParametersKey;
								$.extend(true, v_oOpenSpec.urlMap, v_oLaunchParameters);
							}

							// legacy means the classic query/analysis studio should be launched.
							return processHref( getLegacyLaunchUrl( v_oOpenSpec ), glassContext );
						}
						else if (v_oOpenSpecResolved.href)
						{
							return processHref( v_oOpenSpecResolved.href );
						}

						return v_oOpenSpecResolved.urlMap;
					})
					.catch(handleLoadPerspectiveErrors.bind(undefined, glassContext))
					.catch( function(err) {
						console.log('rsOpenHelper.getPerspective ... FAILED');
						throw err;
					});
			}
			return rsCommon.reject( new C_Defer(), 'urlMap is missing', 'rsOpenHelper.getPerspective' );
		},

		determineDefaultAction: determineDefaultAction,
		resolveUrlMap: resolveUrlMap,

		updateCmProperties: function(v_oView, v_sStoreId)
		{
			// Clear existing values to avoid using stale data
			delete v_oView.cmProperties;
			delete v_oView.reportProperties;

			return this.retrieveCmProperties( v_oView.glassContext, null, v_sStoreId )
				.then( function( v_oCmProperties ) {
					v_oView.cmProperties = v_oCmProperties;
					v_oView.id = v_oCmProperties.id; // whishfull thinking
					v_oView.type = v_oCmProperties.type;
					let v_oBaseReport;
					switch (v_oCmProperties.type)
					{
						case 'output':
							v_oBaseReport = v_oCmProperties.parent[0].parent[0];
							break;

						case 'reportVersion':
							v_oBaseReport = v_oCmProperties.parent[0];
							break;
					}
					if (v_oBaseReport)
					{
						v_oView.reportProperties = {
							id: v_oBaseReport.id,
							type: v_oBaseReport.type
						};
					}
				});
		},

		//Interface for protected functions, used in rsShareHelper
		retreiveCMInfo: retreiveCMInfo
	};
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: authoring
	(C) Copyright IBM Corp. 2015, 2022
	The source code for this program is not published or otherwise divested
	of its trade secrets, irrespective of what has been deposited with the
	U.S. Copyright Office.
*/
define('bi/authoring/utils/rsPerformance',[], function() {
	'use strict';


	var v_oRsPerformance = {
		M_sPerformanceLogServerHost: undefined,
		M_sKitVersion: 'no kit version',

		M_bKitVersionIsCached: false,

		summarizeInteractiveViewerRun: function( v_oView )
		{
			this.commonSummarize( v_oView,
				[
					{ start: 'rsContextMenuActions.onSelectItem', end: 'rsContentView.render' },
					{ start: 'rsContentView.render', end: 'rsContentView._onRSApplicationReady' },
					{ start: 'rsContentView._onRSApplicationReady', end: 'rsContentView.onViewBeforeDraw' },
					{ start: 'rsContentView.onViewBeforeDraw', end: 'rsContentView.onViewAfterDraw' },
					{ start: 'rsContextMenuActions.onSelectItem', end: 'rsContentView.onViewAfterDraw' },
					{ start: 'authoring-selectItemAndDraw-start', end: 'authoring-selectItemAndDraw-stop' }
				]);
		},

		summarizeClassicViewerRun: function( v_oView )
		{
			this.commonSummarize(v_oView,
				[
					{ start: 'rsContextMenuActions.onSelectItem', end: 'cvContentView.render' },
					{ start: 'cvContentView.render', end: 'cvContentView.getViewerConfiguration' },
					{ start: 'cvContentView.getViewerConfiguration', end: 'cvContentView.onReportStatusComplete' },
					{ start: 'cvContentView.onReportStatusComplete', end: 'cvContentView._onClassicViewerLoaded' },
					{ start: 'rsContextMenuActions.onSelectItem', end: 'cvContentView._onClassicViewerLoaded' },
					{ start: 'authoring-selectItemAndDraw-start', end: 'authoring-selectItemAndDraw-stop' }
				]);
		},


		commonSummarize: function( v_oView, v_aStartEndNames )
		{
			// We do the non-essential work inside a try-catch because the window.performance methods
			// can throw exceptions when markers don't exist or have been renamed.
			try
			{
				if ( this.getEntriesByName('rsContextMenuActions.onSelectItem', 'mark').length < 1 )
				{
					return;
				}

				v_aStartEndNames.forEach( function( v_o ) {
					var v_sName = v_o.start + '->' + v_o.end;
					try
					{
						this.measure( v_sName, v_o.start, v_o.end );
					}
					catch (e)
					{
						// sometimes we don't have the start or end and will get an exception
						// skip it
					}
				}, this);

				var v_aPerformanceFields = [
					"navigationStart",
					"unloadEventStart",
					"unloadEventEnd",
					"redirectStart",
					"redirectEnd",
					"fetchStart",
					"domainLookupStart",
					"domainLookupEnd",
					"connectStart",
					"connectEnd",
					"requestStart",
					"responseStart",
					"responseEnd",
					"domLoading",
					"domInteractive",
					"domContentLoadedEventStart",
					"domContentLoadedEventEnd",
					"domComplete",
					"loadEventStart",
					"loadEventEnd"];
				var v_oPerformanceOut = { timing: {} };

				var iframe = v_oView.m_iframeAuthoring || v_oView.m_iframeClassicViewer;
				var v_oPerformanceIn = iframe.contentWindow.performance;

				for (var iPField = 0; iPField < v_aPerformanceFields.length; ++iPField)
				{
					var v_sField = v_aPerformanceFields[iPField];
					if (v_oPerformanceIn.timing[v_sField] !== undefined)
					{
						v_oPerformanceOut.timing[v_sField] = v_oPerformanceIn.timing[v_sField];
					}
				}

				var v_oPerformanceSummary = {
					userAgent: window.navigator.userAgent,
					urlPath: window.location.protocol + '//' + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + window.location.pathname,
					reportName: v_oView.cmProperties.defaultName,
					date: Date.now(),
					measures: [],
					rsWindowPerformance: v_oPerformanceOut
				};

				this.getEntriesByType('measure').forEach( function( v_oEntry ) {
					console.info( "rsperf: performance.measure %s %s ms", v_oEntry.name, v_oEntry.duration);
					v_oPerformanceSummary.measures.push({ name: v_oEntry.name, duration: v_oEntry.duration } );
				});

				this.clearMeasures();
				this.clearMarks();

				if (this.M_sPerformanceLogServerHost)
				{
					Promise.all([
						this.getKitVersion(v_oView.glassContext),
						this.getPerformanceUUID(v_oView.glassContext),
						Promise.resolve(v_oPerformanceSummary),
						Promise.resolve(v_oView.glassContext)
					])
						.then( function(v_aResults) {
							this.sendPerformanceRecordToHost.apply(this, v_aResults);
						}.bind(this))
						.catch( function() {
							console.info('rsperf: failed to get kit and uuid for logging');
						})
						.then( function(v_oResult) {
							console.info('rsperf: _commonSummarized finished');
						});
				}
				else
				{
					this.getKitVersion(v_oView.glassContext)
						.catch( function(err) {
							console.info('rsperf: error while getting kit version');
						})
						.then( function(version) {
							console.info('rsperf: kit version %s (cached: %s)', version, this.M_bKitVersionIsCached.toString());
						}.bind(this));
				}
			}
			catch (err)
			{
				console.warn('_commonSummarize failed with an exception:\n%s', err && err.toString() || "unknown err");
				this.clearMeasures();
				this.clearMarks();
			}
		},


		getKitVersion: function( v_oGlassContext )
		{
			if ( this.M_sKitVersion )
			{
				this.M_bKitVersionIsCached = true;
				return Promise.resolve(this.M_sKitVersion);
			}

			return v_oGlassContext.services.ajax.ajax({
				url: window.location.pathname + 'cmplst.txt',
				type: 'GET',
				dataType: 'text'
			})
				.then( function(resp) {
					var v_aMatches = resp.match(/^kit_version=\s*((?:\d+.)+\d+)\s*$/m);
					if (v_aMatches)
					{
						this.M_sKitVersion = v_aMatches[1];
					}
					else
					{
						this.M_sKitVersion = 'could not find kit version';
					}
					return this.M_sKitVersion;
				}.bind(this))
				.catch( function(err) {
					console.warn('getKitVersion() failed ');
					this.M_sKitVersion = 'error cannot get kit version';
					throw this.M_sKitVersion;
				}.bind(this));
		},


		getPerformanceUUID: function(v_oGlassContext)
		{
			return v_oGlassContext.services.ajax.ajax({
				url: this.M_sPerformanceLogServerHost + "/_uuids",
				type: 'GET',
				dataType: 'json'
			})
				.then(function(resp) {
					return resp.uuids[0];
				})
				.catch(function(jqXHR, err) {
					return Promise.reject('uuid_failed');
				});
		},


		sendPerformanceRecordToHost: function(v_sKit, v_sUuid, v_oRecord, v_oGlassContext)
		{
			v_oRecord.kitVersion = v_sKit;
			v_oRecord.kitVersionCached = this.M_bKitVersionIsCached;

			return v_oGlassContext.services.ajax.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				url: this.M_sPerformanceLogServerHost + "/toddtest/" + v_sUuid,
				type: 'PUT',
				data: JSON.stringify(v_oRecord)
			})
				.then( function(result) {
					console.log('succeed sendPerformanceRecordToHost: %s', result);
					return result;
				})
				.catch( function(err) {
					console.log('error sendPerformanceRecordToHost: %s', err);
					throw err;
				});
		},
	};

	['mark',
	 'measure',
	 'getEntriesByName',
	 'getEntriesByType',
	 'clearMeasures',
	 'clearMarks'
	].forEach(function(fname) {
		if (window.performance[fname])
		{
			this[fname] = window.performance[fname].bind(window.performance);
		}
		else if (['getEntriesByName', 'getEntriesByType'].indexOf(fname) != -1)
		{
			this[fname] = function() { return []; };
		}
		else
		{
			this[fname] = function() {};
		}
	}, v_oRsPerformance);

	return v_oRsPerformance;
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
	(C) Copyright IBM Corp. 2017, 2022
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define('bi/authoring/common/utils/rptShareHelper',['bi/authoring/utils/pat/rsPromptParameters', 'bi/authoring/utils/rsOpenHelper', 'bi/authoring/utils/pat/rsCommon', 'jquery'], function(rsPromptParameters, OpenHelper, rsCommon, $) {
	'use strict';

	// CM properties needed to generate share URL
	var M_aShareProperties = [
		{ property: 'id', type: null },
		{ property: 'type', type: null },
		{ property: 'burstKey', type: ['output'] },
		{ property: 'parent', type: null }
	];

	function getGrandParentID(v_oCmProperties)
	{
		let v_sID;
		if (v_oCmProperties)
		{
			if (v_oCmProperties.parent && v_oCmProperties.parent[0] && v_oCmProperties.parent[0].parent && v_oCmProperties.parent[0].parent[0])
			{
				v_sID = v_oCmProperties.parent[0].parent[0].id;
			}
			else if (v_oCmProperties.ancestors && v_oCmProperties.ancestors.length > 1)
			{
				v_sID = v_oCmProperties.ancestors[v_oCmProperties.ancestors.length - 2].id;
			}
		}
		return v_sID;
	}

	function createShareUrl(v_oOpenSpec, v_oCmProperties)
	{
		let v_oUrlMap = {};

		const v_oContentView = v_oOpenSpec && v_oOpenSpec.contentView;

		if (v_oContentView)
		{
			v_oUrlMap = $.extend(v_oUrlMap, rsCommon.extractGlassSettings(v_oContentView));
		}

		var v_sObjRef = v_oCmProperties.id;

		switch (v_oCmProperties.type)
		{
			case 'dataSet2':
				v_oUrlMap.objRef = v_sObjRef;
				break;

			case 'output':
				// For burst output, use the id of the actual output object
				// otherwise use the id of output parent i.e. reportVersion
				// Using the version allows the system to select the most appropriate format/locale based on user's preferences
				// However there is no support for this if the output needs to be filtered by burst key
				// so in that case we go with the specific output object.
				v_oUrlMap.objRef = getGrandParentID(v_oCmProperties); // report ID
				v_oUrlMap.rv = v_oCmProperties.parent[0].id; // reportVersion ID
				if (v_oCmProperties.burstKey)
				{
					v_oUrlMap.ro = v_oCmProperties.id; // output ID
					v_oUrlMap.bl = v_oCmProperties.burstKey;
				}
				break;

			default:
				v_oUrlMap.objRef = v_sObjRef;
				if (v_oOpenSpec.mode === 'current')
				{
					if (v_oContentView && v_oContentView.m_behaviour)
					{
						v_oContentView.m_behaviour.populateShareUrl(v_oUrlMap);
					}
				}
				break;
		}

		return v_oUrlMap;
	}

	function retrievePromptParameters(v_oOpenSpec, v_oUrlMap)
	{
		//Only include prompt values if sharing from current view/set as home
		if (v_oOpenSpec.mode == 'current')
		{
			const v_oContentView = v_oOpenSpec && v_oOpenSpec.contentView;
			if (v_oContentView && v_oContentView.m_behaviour && v_oContentView.m_behaviour.isViewer())
			{
				// If in classic viewer or authoring viewer, then get parameters
				var v_aParameters = v_oContentView.getParameterValues(true);
				v_oUrlMap.prompt = !v_oContentView.canRun();

				if (v_aParameters && v_aParameters.length > 0)
				{
					rsPromptParameters.rsBuildParameterUrl( v_oUrlMap, v_aParameters );
				}
			}
		}
		return v_oUrlMap;
	}

	function buildShareUrl( v_oOpenSpec, v_oCmProperties )
	{
		var v_oUrlMap = createShareUrl(v_oOpenSpec, v_oCmProperties);
		return retrievePromptParameters(v_oOpenSpec, v_oUrlMap);
	}

	function prepareShareUrlMap(v_oOpenSpec)
	{
		// Only ask for minimal set of properties needed to generate share URL
		return OpenHelper.retreiveCMInfo(v_oOpenSpec.cmProperties, v_oOpenSpec.glassContext, M_aShareProperties)
			.then( buildShareUrl.bind(null, v_oOpenSpec) )
			.catch(function(err) {
				console.log('OpenHelper.prepareShareUrlMap ... FAILED');
				throw err;
			});
	}

	return {

		getShareUrlMap: function(v_oOpenSpec)
		{
			return prepareShareUrlMap(v_oOpenSpec)
				.catch( function(err) {
					console.log('rsShareHelper.getShareUrlMap ... FAILED');
					throw err;
				});
		},

		buildShareUrlMap: function(v_oContentView )
		{
			var v_oCmProperties = v_oContentView.cmProperties;
			var glassContext = v_oContentView.glassContext;

			var v_oOpenSpec = {
				mode: "current",
				glassContext: glassContext,
				contentView: v_oContentView
			};
			return buildShareUrl( v_oOpenSpec, v_oCmProperties );
		}
	};
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: authoring
	(C) Copyright IBM Corp. 2015, 2022
	The source code for this program is not published or otherwise divested
	of its trade secrets, irrespective of what has been deposited with the
	U.S. Copyright Office.
*/
/* eslint-disable no-underscore-dangle */

define( 'bi/authoring/rsContentView',[
	'bi/glass/app/ContentView',
	'jquery',
	'bi/authoring/nls/StringResource',
	'bi/commons/utils/Utils',
	'bi/authoring/utils/pat/rsCommon',
	'bi/authoring/utils/rsOpenHelper',
	'bi/authoring/utils/rsPerformance',
	'bi/authoring/utils/rsIFrameManager',
	'bi/authoring/utils/pat/rsLaunchParameters',
	'bi/authoring/utils/pat/rsPromptParameters',
	'bi/authoring/common/utils/rptShareHelper',
	'bi/admin/common/utils/parameters/ParameterValues',
	'bi/authoring/utils/C_Defer'
	],
function(ContentView, $, StringResource, Utils, rsCommon, rsOpenHelper, rsPerformance, rsIFrameManager, rsLaunchParameters,
		rsPromptParameters, rptShareHelper, ParameterValues, C_Defer)
{
	'use strict';

	const v_sObserverId = "/authoring/js/rsContentView";

	var v_aSpecModificationPluginIds = [
	];

	function handleTruthyValueAlreadySetOrAddObserver(v_oApplication, v_sPropertyName, v_fnOnChangeCallback) {
		if ( v_oApplication.SharedState.Get(v_sPropertyName) )
		{
			v_fnOnChangeCallback();
		}
		else
		{
			v_oApplication.SharedState.AddObserver(v_sObserverId, v_sPropertyName, v_fnOnChangeCallback);
		}
	}

	function handleTruthyValueAlreadySetAndAddObserver(v_oApplication, v_sPropertyName, v_fnOnChangeCallback) {
		if ( v_oApplication.SharedState.Get(v_sPropertyName) )
		{
			v_fnOnChangeCallback();
		}
		v_oApplication.SharedState.AddObserver(v_sObserverId, v_sPropertyName, v_fnOnChangeCallback);
	}

	const rsContentView = ContentView.extend({

		init: function(options, appView)
		{
			this.m_oLaunchPromise = options.launchPromise;
			delete options.launchPromise;

			rsCommon.decodeAndMoveCMProperties(options);
			rsCommon.convertStringQSToValues(options, options.glassContext);
			rsCommon.decodeAndMoveRSOptions(options);

			// After the following call, every member of options is now a member of this
			rsContentView.inherited('init', this, arguments); // eslint-disable-line prefer-rest-params

			this.m_fOnWindowResize = this.syncIFrameSizeToView.bind(this);
			window.addEventListener("resize", this.m_fOnWindowResize, false);

			this.m_oAppView = appView;

			var v_oAppViewFirstLoadedDeferred = new C_Defer();
			this.m_oRemoveAppViewLoadedHandler = this.glassContext.getCoreSvc('.Events').on(
				'appView:loaded',
				this._handleFirstAppViewOnLoaded.bind(this, v_oAppViewFirstLoadedDeferred),
				this);
			this.m_oAppViewFirstLoadedPromise = v_oAppViewFirstLoadedDeferred.promise;

			// Extract information that is passed when creating view directly without going through open helper first.
			// Some examples are tryIt, launch from RS, invoking share URL with perspective specified.
			this.m_oRSParameters = this.m_oRSParameters || {}; // Make sure m_oRSParameters is initialized
			try
			{
				// to open a report passed on the URL and pass parameters, we need access to the
				// launch parameters stored in the calling window's Application object
				var v_oLaunchParameters = rsLaunchParameters.Retrieve(this.launchParametersKey);
				if (v_oLaunchParameters)
				{
					// This is the "run spec from RS" use case
					this.m_oLaunchParameters = v_oLaunchParameters;
				}
				else if (window.parent && this.launchParametersRef)
				{
					// This is the "edit parameter values" use case (typically called from share code)
					this.m_oLaunchParameters = window.parent[options.launchParametersRef];
				}

				if (window.opener && !window.opener.closed && window.opener.RSParameters)
				{
					if (this.isNemesis)
					{
						var o = window.opener.RSParameters;
						for (var v_sAttrName in o)
						{
							if (v_sAttrName == 'reportXML')
							{
								// Passing the report spec text in an HTML encoded JSON object
								// is difficult. There are multiple levels of encoding.
								// Instead we pass a sentinel value and stash the original value
								// for later retrieval.
								this.m_oRSParameters.useGlassReportXML = true;
								this.m_sReportSpecFromOpener = o[v_sAttrName];
							}
							else
							{
								this.m_oRSParameters[v_sAttrName] = o[v_sAttrName];
							}
						}

						if (this.m_oRSParameters.useGlassReportXML)
						{
							this.m_oRSParameters.model = "";
						}

						if (o.AppOnLoad)
						{
							this.AppOnLoad = window.opener[o.AppOnLoad];
						}
					}
					//HACK, BY - The following 3 lines are for 'Try it'. 'Try it' still launch authoring with parameters passed with window.opener.RSParameters
					//We need this until 'Try it' starts passing parameters from URL. A defect will be logged to track this.
					else if (!this.m_oLaunchParameters && !this.isHomepage)
					{
						var v_oSrcParameters = window.opener.RSParameters;
						window.opener.RSParameters = undefined;

						// Copy the parameters from the opener's and then clear the
						// the opener's value
						this.startingTemplate = v_oSrcParameters.startingTemplate;
						this.moduleId = v_oSrcParameters.module;
						this.isViewer = v_oSrcParameters.isViewer; // not sure if this one is ever set

						this.m_oLaunchParameters = rsLaunchParameters.Retrieve(v_oSrcParameters.launchParametersKey);

						//Try it launches us with a module and startingTemplate but not a moduleSearchPath. Construct the moduleSearchPath
						if (this.moduleId && !this.moduleSearchPath && this.startingTemplate)
						{
							this.m_bIsTryIt = true;
							this.moduleSearchPath = "storeID(\"" + this.moduleId + "\")";
							this.action = 'run';
							console.log("rsContentView.init() - launched from try it setting module search path " + this.m_oRSParameters["moduleSearchPath"]);
						}
					}
				}
			}
			catch (e)
			{
				console.log("rsContentView.init() - Call to window.opener failed, assume it doesn't exist");
			}

			this.m_bDisableRsLockUnlock = false;

			this.m_bFullyInitialized = false;
		},

		_postInit: function()
		{
			if (this.m_bFullyInitialized)
			{
				return;
			}
			this.m_bFullyInitialized = true;

			var options = this;

			// convert parameters from JSON to SOAPy Bus Parameters
			if (options.parameterValuesJSON)
			{
				// option.parameterValuesXML get set the following ways
				// 1) by options passed (options.parameterValuesXML in SOAPy bus xml) into the perspective or
				// 2) by converting the parameterValuesJSON to a SOAPy bus xml.
				// The goal is eventual to phase out passing the parameterValuesXML
				// and solely use the parameterValuesJSON.
				// Not certain if the above goal still applies.
				// It forces the conversion of parameter values from SOAP XML to JSON only to convert them back

				// The prompt values are currently either pass one of the two ways mentioned above, but never both.
				// if you hand bomb the URL, the parameterValuesJSON will take precedence.

				options.parameterValuesXML = rsPromptParameters.rsBuildPromptParameters(undefined, options.parameterValuesJSON);
				delete options.parameterValuesJSON;
			}

			//console.log("rsContentView.init");

			// If we have a launch promise then the RS parameters were already created
			// otherwise create them now but keep existing values
			if (!this.m_oLaunchPromise)
			{
				$.extend( this.m_oRSParameters, rsIFrameManager.createRSParameters(options, this.glassContext) );
			}
			this.m_bNewlyCreatedReport = !this.m_oRSParameters.reportStoreID;

			if (options.isSlideout)
			{
				this.m_bDisableRsLockUnlock = true;
			}

			if (this.m_oLaunchParameters && this.m_oLaunchParameters['RunOptions'])
			{
				//console.log("setting format" + this.m_oLaunchParameters['RunOptions'].OutputFormat);
				if ( !this.m_oRSParameters["rsFinalRunOptions"] )
				{
					this.m_oRSParameters["rsFinalRunOptions"] = {};
				}

				if (this.m_oLaunchParameters['RunOptions'].OutputFormat)
				{
					this.m_oRSParameters["rsFinalRunOptions"].format = this.m_oLaunchParameters['RunOptions'].OutputFormat;
				}

				if (this.m_oLaunchParameters['RunOptions'].isApplication)
				{
					this.m_oRSParameters["rsFinalRunOptions"].isApplication = this.m_oLaunchParameters['RunOptions'].isApplication;
				}

				if (this.m_oLaunchParameters['RunOptions'].globalParameters)
				{
					// Make global parameters available to viewer when running from editor.
					this.m_oRSParameters["rsFinalRunOptions"].globalParameters = this.m_oLaunchParameters['RunOptions'].globalParameters;
				}
			}

			this.m_bInitialIsViewerState = this.m_oRSParameters.isViewer;

			if (this.m_oLaunchParameters && this.m_oLaunchParameters.parameterValuesJSON)
			{
				// convert parameters from JSON to SOAPy Bus Parameters
				this.m_oLaunchParameters["parameterValuesXML"] = rsPromptParameters.rsBuildPromptParameters(undefined, this.m_oLaunchParameters.parameterValuesJSON);
				delete this.m_oLaunchParameters.parameterValuesJSON;
			}
		},

		render: function()
		{
			if (this.rsResolved)
			{
				// urlMap already fully resolved so proceed with rendering
				return this._render();
			}

			// Perspective was launched directly without going through rsOpenHelper
			// Complete open resolution then proceed with render.
			if (!this.cmProperties && this.objRef)
			{
				// Create cmProperties from available information so resolution has something to work with
				this.cmProperties = {
					id: this.objRef,
					type: this.type // may or not be available but that is OK
				};
			}
			var v_oOpenSpec = {
				cmProperties: this.cmProperties,
				glassContext: this.glassContext,
				urlMap: this
			};
			return rsOpenHelper.resolveUrlMap(v_oOpenSpec).then(function(v_oResolvedOpenSpec) {
				// Merge resolved urlMap back into this instance and proceed with rendering
				$.extend(this, v_oResolvedOpenSpec.urlMap);
				return this._render();
			}.bind(this));
		},

		_render: function()
		{
			// Perform any final initialization now that urlMap is fully resolved
			this._postInit();

			// N.B. Glass expected jQuery promises
			var $renderDeferred = $.Deferred();

			if (this.m_oRSParameters.closePerspective || this.action == 'none')
			{
				// The perspective can't be opened
				var v_oState = {
						isViewer: true,
						objectType: '',
						runInAdvancedViewer: true
					};
				this._updatePlugins( v_oState );

				// Resolve without rendering anything and show toast.
				// We use toast so that this message is displayed in a consistent fashion (see rsOpenHelper)
				// We can't reject because the toast does not appear if we do.
				// Arrange to close perspective when toast is dismissed
				var v_sError = this.m_oRSParameters.closePerspective
					? StringResource.get('no_output_format_capability', { outputFormat: this.m_oRSParameters.rsFinalRunOptions.format })
					: (this.renderErrorMessage || StringResource.get('no_action_available'));
				var callback = function() { this.glassContext.closeAppView("authoring", this.id); }.bind(this);
				this.glassContext.showToast(v_sError, {
					'type': (this.m_oRSParameters.closePerspective ? 'error' : 'warning'),
					'btnLabel': StringResource.get('ok_button_label'),
					'callback': callback,
					'onHidden': callback
				});
				// Reject with message instead of using toast once glass fixes handling of render failure
				//$renderDeferred.reject({ message: v_sError });
				$renderDeferred.resolve();

				return $renderDeferred.promise();
			}

			//console.log("rsContentView.render() ...");
			rsPerformance.mark('rsContentView.render');

			console.timeEnd('rsperf: onSelectItem->render');
			console.time('rsperf: render->OnRSApplicationReadyForObservers');

			// This is the "early" rendering resolve - show the StartUp div right away
			$renderDeferred.resolve(this);

			// HACK: the Glass doesn't have an API to squish the sidebar
			this.m_oAppView.$('.navbar').addClass('narrow');

			if (!this.m_oLaunchPromise)
			{
				var v_oTemplateParameters = rsCommon.createTemplateParameters(this.m_oRSParameters);
				this.m_oLaunchPromise = rsIFrameManager.F_LaunchRS(v_oTemplateParameters, this.glassContext, this.m_oLaunchParameters);
			}
			this.m_oLaunchPromise
			.catch(function(err) {
				console.log(err);
				this.hackUnlockGlass();
				$renderDeferred.reject(err);
			}.bind(this))
			.then(this._onRSApplicationReady.bind(this, $renderDeferred));

			// Set the plugin state based on initial parameters.
			// This should reduce plugin "flickering".

			var v_oState = {
				isViewer: this.m_bInitialIsViewerState,
				objectType: '',
				runInAdvancedViewer: this.m_bNewlyCreatedReport
			};

			if (this.cmProperties)
			{
				v_oState.objectType = this.cmProperties.type;
				if ( this.cmProperties.runInAdvancedViewer )
				{
					v_oState.runInAdvancedViewer = true;
				}
			}
			this._updatePlugins( v_oState );
			this._sendInstrumentation();

			this.hackLockGlass();
			return $renderDeferred.promise();
		},

		_sendInstrumentation: function() {
			if (!this.glassContext) {
				return;
			}

			const v_oInstrumentationService = this.glassContext.getCoreSvc('.Instrumentation');
			if (!v_oInstrumentationService || !v_oInstrumentationService.enabled)
			{
				return;
			}

			// Instrumentation wants specific terms
			// Some glass actions won't be instrumented
			const v_oGlassActionToInstrumentationEventType = {
				'run': 'Ran Process',
				'viewOutput': 'Read Object',
				'edit': 'Read Object',
				'create': 'Created Object'
			};

			let v_sInstrumentationType = v_oGlassActionToInstrumentationEventType[this.action];
			if (v_sInstrumentationType)
			{
				let v_sType;
				let v_sId;
				if (this.type == 'output' && this.cmProperties)
				{
					// our opener code should fill in the parent chain
					// cmProperties.parent[0] is the reportVersion object
					// cmProperties.parent[0].parent[0] is the object that has output versions
					let v_oVersionedAncestor = this.cmProperties.parent[0].parent[0];
					v_oVersionedAncestor = (v_oVersionedAncestor.base && v_oVersionedAncestor.base[0]) || v_oVersionedAncestor;
					v_sType = v_oVersionedAncestor.type;
					v_sId = v_oVersionedAncestor.id;
				}
				else
				{
					v_sType = this.type;
					v_sId = this.id;
				}

				if (v_sInstrumentationType === v_oGlassActionToInstrumentationEventType.edit && this.isNew)
				{
					v_sInstrumentationType = v_oGlassActionToInstrumentationEventType.create;
					v_sId = 'null';
				}

				v_sType = v_sType || 'report';

				const v_oEvent = {
					type: v_sInstrumentationType,
					objectType: v_sType,
					object: v_sId,
					milestoneName: v_sInstrumentationType + '_' + v_sType
				};

				if (v_sInstrumentationType === v_oGlassActionToInstrumentationEventType.run)
				{
					v_oEvent['processType'] = 'Run a Report';
				}

				if ( [v_oGlassActionToInstrumentationEventType.run, v_oGlassActionToInstrumentationEventType.viewOutput].indexOf(v_sInstrumentationType) !== -1 )
				{
					v_oEvent['custom.viewer'] = 'interactive';
					v_oEvent['custom.outputFormat'] = this.format;
				}

				v_oInstrumentationService.track( v_oEvent );
			}
		},

		getTitle: function()
		{
			if (this.isApplicationLoaded() )
			{
				return this.getAuthoringApplication().SharedState.Get("reportName");
			}
			return StringResource.get(this.perspective == 'datasets' ? 'dataset_welcome' : 'authoring_welcome');
		},

		getIcon: function()
		{
			var v_sIcon;

			if (this.perspective == 'datasets')
			{
				v_sIcon = 'common-dataset';
			}
			else
			{
				var v_sReportType = this.getAuthoringApplication() && this.getAuthoringApplication().SharedState.Get("objectType");

				switch (v_sReportType)
				{
					case 'interactiveReport':
						v_sIcon = 'common-interactiveReport';
						break;

					case 'reportView':
						v_sIcon = 'common-report_view';
						break;

					default:
						v_sIcon = 'common-report';
						break;
				}
			}
			return v_sIcon;
		},

		getIconColor: function()
		{
			var v_sIconColor;

			if (this.perspective == 'datasets')
			{
				v_sIconColor = 'teal';
			}
			else
			{
				v_sIconColor = 'purple';
			}
			return v_sIconColor;
		},

		getIconTooltip: function()
		{
			return StringResource.get( this.perspective == 'datasets' ? 'dataset_welcome' : 'authoring_welcome');
		},

		getType: function()
		{
			var v_sObjectType;
			if (this.isApplicationLoaded())
			{
				v_sObjectType = this.getAuthoringApplication().SharedState.Get("objectType");
			}
			return v_sObjectType;
		},

		isDirty: function()
		{
			var v_oSharedState = this.getAuthoringApplication() ? this.getAuthoringApplication().SharedState : null;
			var v_sObjectType = v_oSharedState ? v_oSharedState.Get("objectType") : "";
			// reportViews can't be saved so don't mark them as dirty
			if (v_sObjectType != 'reportView' && !this.isNemesis && this.isApplicationLoaded() && !this.m_bIsTryIt)
			{
				var v_bIsModified = v_oSharedState && v_oSharedState.Get("isModified");
				var v_bIsViewer = v_oSharedState && v_oSharedState.Get("isViewer");
				if (v_bIsModified && v_bIsViewer)
				{
					var v_bRead = (!this.cmProperties || !this.cmProperties.permissions || this.cmProperties.permissions.indexOf("read") != -1);
					var v_bWrite = (!this.cmProperties || !this.cmProperties.permissions || this.cmProperties.permissions.indexOf("write") != -1);
					var v_bSaveAsCapabilities = this.glassContext.hasCapability("canUseReportStudio") && this.glassContext.hasCapability("canUseReportStudioFileManagement");

					// Can't save if no read (unable to unstub in viewer) or no write (no save) and no save as capabilities
					if (!v_bRead || (!v_bWrite && !v_bSaveAsCapabilities))
					{
						// Can't save/save as in viewer so don't mark as dirty to avoid message indicating object changed on exit.
						v_bIsModified = false;
					}
				}

				return v_bIsModified;
			}
			return false;
		},

		getAuthoringApplication: function()
		{
			return rsCommon.getAuthoringApplicationFromIFrame(this.m_iframeAuthoring);
		},

		isApplicationLoaded: function()
		{
			var v_Application = this.getAuthoringApplication();
			return !!(v_Application && v_Application.SharedState.Get("isAppLoaded"));
		},

		canRun: function()
		{
			var v_oAuthoringApp = this.getAuthoringApplication();
			return v_oAuthoringApp.SharedState.Get("canRun");
		},

		/*

		getContent 	- Called by the glass to cache the current state and set the url (eg for bookmarking)
					- By default we should return all our serializable state
					- when parameter options{mode:'bookmark'} is passed in, getContent is being called for the purposes of
					- determining the url/for bookmarking. We can discard transient state for this call.
		NOTE:

		If called too early getContent() returns undefined

		Else

		returns {
		 	.* // whatever was passed in as init(options)

			.cmProperties {
		 		// from the content team, typically includes:
		 			id
		 			type
		 			permissions ?
			}

			// maybe undefined if getContent() was called too early
			.application {
				.storeID, 		// the CM store id of the currently saved report, null if not saved
				.cmSearchPath, 	// the CM search path of the currently saved report, null if not saved
				.reportName, 	// the name of the current report
				.isModifed		// true if there is a current report AND it needs to be saved
				.type 			// the CM type of the object
			}
		 }
		*/
		getContent: function(options)
		{
			// console.log("rsContentView.getContent" );
			return rsCommon.getContent( options, this, rptShareHelper );
		},

		getApplicationContent: function( v_oContent, v_oCmProperties )
		{
			var application = {};
			if (this.isApplicationLoaded())
			{
				var v_oAuthoringApp = this.getAuthoringApplication();
				const v_sStoreID = this.m_behaviour.getReportStoreId();

				application.storeID = v_sStoreID;
				application.isModified = v_oAuthoringApp.SharedState.Get("isModified");
				application.cmSearchPath = v_oAuthoringApp.SharedState.Get("cmSearchPath");
				application.reportName = this.getTitle();

				if ( !v_oCmProperties )
				{
					console.log("rsContentView.getContent no .cmProperties");
					v_oCmProperties = { type: undefined };
				}

				// authoring only supports editing or running of
				// { report, interactiveReport, reportTemplate }
				// even if we open something else (like a query or an analysis)
				// it is converted into a report
				var v_sType = ( v_oContent.objRef && v_oContent.type) || (v_oCmProperties && v_oCmProperties.type);
				if (v_sType === 'reportTemplate' || v_sType === 'dataSet2')
				{
					// if we opened a template it must have stayed as a template
					// because we can't convert it from template to anything else
					application.type = v_sType;
				}
				else
				{
					application.type = this.m_behaviour.isActiveReport() ? 'interactiveReport' : 'report';
				}
			}

			return application;
		},

		onAppLoaded: function()
		{
			var v_Application = this.getAuthoringApplication();

			//console.time('rsperf: rsContentView.onAppLoaded_1->ContentView.onAppLoaded_2');
			this.m_oAppViewFirstLoadedPromise.then( function() {
				//console.timeEnd('rsperf: rsContentView.onAppLoaded_1->ContentView.onAppLoaded_2');

				rsIFrameManager.F_PositionAndSizeIFrame( this.$el, this.m_iframeAuthoring);
				this.hackUnlockGlass();

				handleTruthyValueAlreadySetAndAddObserver(v_Application, "reportName", this.updateTitle.bind(this));
				handleTruthyValueAlreadySetOrAddObserver(v_Application, "isReportLoaded", this._on_isReportLoaded.bind(this));

				v_Application.SharedState.AddObserver(
						v_sObserverId,
						"isViewer",
						this._on_isViewer.bind(this));

				v_Application.SharedState.AddObserver(
						v_sObserverId,
						"isActiveReport",
						this._on_isActiveReport.bind(this));

				v_Application.SharedState.AddObserver(
						v_sObserverId,
						"runInAdvancedViewer",
						this._on_runInAdvancedViewer.bind(this));

				v_Application.SharedState.AddObserver(
						v_sObserverId,
						"viewer",
						this._on_viewer.bind(this));

				v_Application.SharedState.AddObserver(
						v_sObserverId,
						"isModified",
						this._on_isModified.bind(this));

				v_Application.SharedState.AddObserver(
						v_sObserverId,
						"storeID",
						this._on_storeID.bind(this));

				if (this.onSavedCallback) {
					v_Application.SharedState.AddObserver(null, "onDatasetSaved", this.onSavedCallback);
					delete this.onSavedCallback;
				}

				if (this.onCancelCallback) {
					v_Application.SharedState.AddObserver(null, "onDatasetCancelled", this.onCancelCallback);
					delete this.onCancelCallback;
				}

				handleTruthyValueAlreadySetOrAddObserver(v_Application, "firstBeforeDraw", this.onViewBeforeFirstDraw.bind(this));
				handleTruthyValueAlreadySetOrAddObserver(v_Application, "firstAfterDraw", this.onViewAfterFirstDraw.bind(this));

				if (this.isNew && !rsOpenHelper.isReport_ish( this.cmProperties ))
				{
					// New report and cm properties are for a non-report like object
					// Remove the cm properties (which were likely the package/module we started from)
					// so we don't inadvertently use information thinking we have a report object.
					delete this.cmProperties;
				}
			}.bind(this));
		},

		onViewBeforeFirstDraw: function()
		{
			console.time('rsperf: ViewBeforeDraw->ViewAfterDraw');
			rsPerformance.mark('rsContentView.onViewBeforeDraw');
		},

		onViewAfterFirstDraw: function()
		{
			rsPerformance.mark('rsContentView.onViewAfterDraw');
			rsPerformance.mark('authoring-selectItemAndDraw-stop');
			console.timeEnd('rsperf: ViewBeforeDraw->ViewAfterDraw');
			console.timeEnd('rsperf: total_RunReport');
			if (this.glassContext && this.glassContext.isDevInstall && this.glassContext.isDevInstall())
			{
				rsPerformance.summarizeInteractiveViewerRun( this);
			}

			var v_Application = this.getAuthoringApplication();

			if (!this.isServerPrompting() && this.perspective != "datasets" && v_Application.GetUserDataSetting("PreLaunchRS"))
			{
				rsIFrameManager.F_PreLaunch(this.glassContext);
			}
		},

		isServerPrompting: function()
		{
			if (this.m_oLaunchParameters && (this.m_oLaunchParameters["promptContext"] || this.m_oLaunchParameters["serverPrompting"]))
			{
				return true;
			}
			return false;
		},

		enablePluginForApplicationState: function( v_oOption )
		{
			var v_oState = this.getAuthoringApplication().SharedState.Get(v_oOption.state);
			this._setEnableForPlugins(v_oState, [v_oOption.plugin]);
		},

		highlightPluginForApplicationState: function( v_oOption )
		{
			var v_oState = this.getAuthoringApplication().SharedState.Get(v_oOption.state);
			var v_oPlugin = this.glassContext.findPlugin(v_oOption.plugin);
			if (v_oPlugin)
			{
				console.log("rsContentView highlightPluginForApplicationState - FOUND plugin: %s", v_oOption.plugin);
				if (v_oState)
				{
					console.log('rsContentView press %s', v_oOption.plugin);
					v_oPlugin.setPressed();
				}
				else
				{
					console.log('rsContentView unpress %s', v_oOption.plugin);
					v_oPlugin.setUnpressed();
				}
			}
			else
			{
				console.log("rsContentView highlightPluginForApplicationState - could not find plugin: %s", v_oOption.plugin);
			}
		},

		showPluginForApplicationState: function( v_oOption )
		{
			var v_oPlugin = this.glassContext.findPlugin(v_oOption.plugin);
			if (v_oPlugin)
			{
				console.log("rsContentView showPluginForApplicationState - FOUND  plugin: %s", v_oOption.plugin);
				var v_oState = this.getAuthoringApplication().SharedState.Get(v_oOption.state);
				if (v_oState)
				{
					//console.log('rsContentView enable %s', v_oOption.plugin);
					v_oPlugin.show();
				}
				else
				{
					//console.log('rsContentView disable %s', v_oOption.plugin);
					v_oPlugin.hide();
				}
			}
			else
			{
				console.log("rsContentView showPluginForApplicationState - could not find plugin: %s", v_oOption.plugin);
			}
		},

		_setDisplayForPlugins: function(v_bShow, v_aPluginIds)
		{
			v_aPluginIds.forEach(
				function(v_sPluginId)
				{
					var v_oPlugin = this._hackFindPlugin(v_sPluginId);
					if ( v_oPlugin )
					{
						console.log('_setDisplayForPlugins FOUND plugin: %s', v_sPluginId);
						if (v_bShow)
						{
							v_oPlugin.show();
						}
						else
						{
							v_oPlugin.hide();
						}
					}
					else
					{
						console.log('_setDisplayForPlugins could not find plugin: %s', v_sPluginId);
					}
				},
				this);
		},

		_setEnableForPlugins: function(v_bEnable, v_aPluginIds)
		{
			v_aPluginIds.forEach(
				function(v_sPluginId) {
					var v_oPlugin = this._hackFindPlugin(v_sPluginId);
					if ( v_oPlugin )
					{
						console.log('_setEnableForPlugins FOUND plugin: %s', v_sPluginId);
						if (v_bEnable)
						{
							v_oPlugin.enable();
						}
						else
						{
							v_oPlugin.disable();
						}
					}
					else
					{
						console.log('_setEnableForPlugins could not find plugin: %s', v_sPluginId);
					}
				},
				this);
		},

		_updatePlugins: function(v_oState)
		{
			var v_aEditIds = [
				"com.ibm.bi.authoring.insertableObjectsBtn"
			];
			var v_aViewerIds = [];

			if (this.m_bIsTryIt)
			{
				this._setDisplayForPlugins(false, v_aViewerIds);
			}
			else if (v_oState.objectType == 'output')
			{
				this._setDisplayForPlugins(false, [
					"com.ibm.bi.authoring.insertableObjectsBtn"
				]);
			}
			else
			{
				this._setDisplayForPlugins(!v_oState.isViewer, v_aEditIds);
				this._setDisplayForPlugins(v_oState.isViewer, v_aViewerIds);
				this._setDisplayForPlugins(!(v_oState.isViewer && v_oState.isFromRS), ["com.ibm.bi.glass.common.operations"]);
			}

			var v_bRead = (!this.cmProperties || !this.cmProperties.permissions || this.cmProperties.permissions.indexOf("read") != -1);
			var v_bCanToggleEditView = this.glassContext.hasCapability("canUseReportStudio")
				&& v_oState.objectType == 'report' // this excludes interactiveReport and reportView
				&& v_oState.runInAdvancedViewer
				&& !this.m_bIsTryIt
				&& !(v_oState.isViewer && v_oState.isFromRS) // exclude viewers launched from RS (viewer running a spec)
				&& (!v_oState.isViewer || v_bRead); // exclude viewers without read access (can't unstub report spec)

			if (this.getAuthoringApplication())
			{
				if (!v_oState.isViewer)
				{
					this.getAuthoringApplication().SharedState.Set(null, "showFilters", false);
				}
				this.getAuthoringApplication().SharedState.Set(null, "canToggleEditView", v_bCanToggleEditView);
			}
		},

		_updatePluginsForNewState: function()
		{
			var v_oState = {
				isViewer: this.getAuthoringApplication().SharedState.Get("isViewer"),
				objectType: this.getAuthoringApplication().SharedState.Get("objectType"),
				runInAdvancedViewer: this.getAuthoringApplication().SharedState.Get("runInAdvancedViewer")
			};

			if (this.m_oLaunchParameters && this.m_oLaunchParameters['RunOptions'])
			{
				if (this.m_oLaunchParameters['RunOptions'].isFromRS == true)
				{
					v_oState.isFromRS = true;
				}
			}
			this._updatePlugins(v_oState);
		},

		_on_isViewer: function()
		{
			this._updatePluginsForNewState();
			this.syncIFrameSizeToView();
		},

		_on_isActiveReport: function()
		{
			this._updatePluginsForNewState();
		},

		_on_runInAdvancedViewer: function()
		{
			this._updatePluginsForNewState();
		},

		_on_viewer: function()
		{
			var v_Application = this.getAuthoringApplication();
			// if HTML show the spec modification buttons,
			// otherwise hide them
			this._setDisplayForPlugins( v_Application.SharedState.Get("viewer").toUpperCase() == "HTML", v_aSpecModificationPluginIds );

			this._updatePluginsForNewState();
		},

		_on_storeID: function()
		{
			const v_sStoreId = this.m_behaviour.getReportStoreId();
			// If there is no storeID then we are most likely dealing with a new report but we may have cmProperties of the module/package.
			// In this case we want to keep the cmProeprties hence we only update if we have an actual storeID.
			// Also, we only update if the storeID is different.
			if (v_sStoreId && (!this.cmProperties || v_sStoreId != this.cmProperties.id))
			{
				rsOpenHelper.updateCmProperties(this, v_sStoreId)
				.then( function() {
					this._updatePluginsForNewState();
					// Let glass know our id changed
					this.glassContext.updateCurrentCachedAppView();
				}.bind(this));
			}
		},

		_on_isReportLoaded: function()
		{
			var v_Application = this.getAuthoringApplication();

			if (v_Application.SharedState.Get("isViewer") && v_Application.SharedState.Get("viewer").toUpperCase() != "HTML")
			{
				this._setDisplayForPlugins( false, v_aSpecModificationPluginIds );
			}
			else
			{
				var v_aLeftSideStateAndPlugin = [
					{ state: "showInsertableObjects", plugin: "com.ibm.bi.authoring.insertableObjectsBtn" }
				];

				v_aLeftSideStateAndPlugin.forEach( function(v_o) {
					this.highlightPluginForApplicationState(v_o);
					v_Application.SharedState.AddObserver(v_sObserverId, v_o.state, this.highlightPluginForApplicationState.bind(this, v_o));
					},
					this);
			}

			this._updatePluginsForNewState();
			var v_oMRU;
			var v_oDummyCmProperties = { type: this.type };
			if (rsOpenHelper.isReport_ish( v_oDummyCmProperties ))
			{
				// Only process if type is a report-like type
				// It may be a package in some cases so we don't want a MRU for the package (they don't work well)
				if (this.objRef)
				{
					//TODO, BY - content api is not ready to take 'objRef' as input yet. Once they are ready
					//we will do v_oMRU = $.extend(true, {}, this.m_oSerializableInitOptions);
					v_oMRU = {};
					v_oMRU.id = this.objRef;
					v_oMRU.type = this.getAuthoringApplication().SharedState.Get("objectType");
					v_oMRU.defaultName = this.getAuthoringApplication().SharedState.Get("reportName");
				}
				else if (this.cmProperties)
				{
					v_oMRU = $.extend(true, {}, this.cmProperties);
				}
			}
			else
			{
				if (this.reportProperties)
				{
					v_oMRU = $.extend(true, {}, this.reportProperties);
				}
			}
			if (v_oMRU)
			{
				this._addToMRU(v_oMRU);
			}
			this.updateTitle();
		},

		_addToMRU: function(mruEntry)
		{
			return this.glassContext.getSvc('.Content').then(function(contentSvc) {
				return contentSvc.addToMRU(mruEntry);
			});
		},

		_on_isModified: function()
		{
			var v_oSharedState = this.getAuthoringApplication().SharedState;

			var v_bCantSaveModified = false;
			var v_bIsModified = v_oSharedState.Get("isModified");

			if (v_bIsModified && v_oSharedState.Get("isViewer"))
			{
				// If viewing and no read then can't save/save as since this requires spec unstubbing which requires read access.
				var v_bRead = (!this.cmProperties || !this.cmProperties.permissions || this.cmProperties.permissions.indexOf("read") != -1);
				var v_bWrite = (!this.cmProperties || !this.cmProperties.permissions || this.cmProperties.permissions.indexOf("write") != -1);
				var v_bSaveAsCapabilities = this.glassContext.hasCapability("canUseReportStudio") && this.glassContext.hasCapability("canUseReportStudioFileManagement");

				// Can't save if no read (unable to unstub) or no write (no save) and no save as capabilities
				v_bCantSaveModified = !v_bRead || (!v_bWrite && !v_bSaveAsCapabilities);
			}

			if (v_bCantSaveModified)
			{
				// can't save modified spec so disable save button and warn user
				this.glassContext.showToast(this.getAuthoringApplication().GetString("IDS_MSG_EDITS_LOST"), { 'type': 'info' });
			}

			this.trigger('change:dirty', { value: v_bIsModified });
		},

		updateTitle: function()
		{
			var v_sReportName = this.getAuthoringApplication().SharedState.Get("reportName");
			this.trigger('change:title', { 'value': v_sReportName });
		},

		// Add the "clsGlassUiDisplayed" class to the RS document body when the glass displays UI
		_addGlassBodyObserver: function()
		{
			if ( this.m_bIsIE === undefined )
			{
				this.m_bIsIE = ( ( navigator.userAgent.toLowerCase().search(/trident\/([0-9]+\.[0-9]+)/) != -1 ) ? parseFloat( RegExp.$1 ) : 0 ) >= 7.0;
			}
			if ( !this.m_bIsIE )
			{
				return;
			}
			this.m_oBodyObserver = new MutationObserver( function() {
				var v_aClasses = ["openedMenu", "openedSlideout", "openedAppViewSlideout", "openedDialog"];
				if ( v_aClasses.some( function( s ) { return this.contains( s ); }, document.body.classList ) )
				{
					this.m_iframeAuthoring.contentDocument.body.classList.add( "clsGlassUiDisplayed" );
				}
				else
				{
					this.m_iframeAuthoring.contentDocument.body.classList.remove( "clsGlassUiDisplayed" );
				}
			}.bind( this ) );
			this.m_oBodyObserver.observe( document.body, { attributes: true, attributeFilter: ["class"] } );
		},

		_removeGlassBodyObserver: function()
		{
			if ( this.m_oBodyObserver )
			{
				this.m_oBodyObserver.disconnect();
				this.m_oBodyObserver = null;
			}
		},

		_handleIframeMouseDown: function(evt)
		{
			this.glassContext.hideOpenMenus();
			this.glassContext.hideSlideOut( true );
		},

		_addIframeMouseDownHandler: function()
		{
			if (!this.m_fHandleIframeMouseDown)
			{
				this.m_fHandleIframeMouseDown = this._handleIframeMouseDown.bind(this);
			}

			this.m_iframeAuthoring.contentDocument.body.addEventListener("mousedown", this.m_fHandleIframeMouseDown, { capture: true } );
		},

		_removeIframeMouseDownHandler: function()
		{
			if (this.m_iframeAuthoring && this.m_fHandleIframeMouseDown)
			{
				this.m_iframeAuthoring.contentDocument.body.removeEventListener("mousedown", this.m_fHandleIframeMouseDown, { capture: true } );
			}
		},

		show: function()
		{
			rsContentView.inherited('show', this, arguments); // eslint-disable-line prefer-rest-params

			if (this.m_iframeAuthoring)
			{
				// div has not been rendered in DOM yet so has no size, need a setTimeout to let it happen
				setTimeout(rsIFrameManager.F_PositionAndSizeIFrame.bind(rsIFrameManager, this.$el, this.m_iframeAuthoring), 0);
				this.getAuthoringApplication().Activate();
				this._addIframeMouseDownHandler();
				this._addAlertHandlers();
			}
			this._addGlassBodyObserver();
		},

		deactivate: function()
		{
			this._removeGlassBodyObserver();
			if (this.m_iframeAuthoring)
			{
				this._removeIframeMouseDownHandler();
				this._removeAlertHandlers();
				this.getAuthoringApplication().Deactivate();
				rsIFrameManager.F_HideIFrame(this.m_iframeAuthoring);
			}
		},

		remove: function()
		{
			var v_oApplication = this.getAuthoringApplication();

			if ( this.m_bIsTryIt )
			{
				v_oApplication.DeleteTempModule(this.moduleId);
			}

			if (this.m_fOnWindowResize)
			{
				window.removeEventListener("resize", this.m_fOnWindowResize, false);
				this.m_fOnWindowResize = null;
			}

			if (this.m_oRemoveAppViewLoadedHandler)
			{
				this.m_oRemoveAppViewLoadedHandler.remove();
				this.m_oRemoveAppViewLoadedHandler = undefined;
			}

			if (this.m_iframeAuthoring)
			{
				this._removeIframeMouseDownHandler();
				this._removeAlertHandlers();
				// m_iframeAuthoring may not be defined if we are in an error state
				rsIFrameManager.F_DetachIFrame(this.m_iframeAuthoring);
				this.m_iframeAuthoring = null;
			}
			this.m_oLaunchPromise = null;
			this.m_oAppView = null;
			return true;
		},

		/**
		* Hide a menu item from another provider.
		*
		* returns
		* false: if there is a valid itemId present and authoring would like to hide that menu item
		* true: for all other conditions
		*/
		isMenuItemVisible: function(context)
		{
			// if the function is called very early we may not have an application yet
			if (!this.getAuthoringApplication())
			{
				return true;
			}

			var v_sMenuItem = context.target.itemId;

			if (v_sMenuItem)
			{
				switch (v_sMenuItem)
				{
					case 'com.ibm.bi.share.subscribe':
						// hide Subscribe menu item in Edit mode or when prompting
						if (!this.m_behaviour.isShareable(false))
						{
							return false;
						}
						break;
				}
			}
			return true;
		},

		addPdfCssPositionStyling: function(v_sPositionStyle)
		{
			this.$el[0].style.position = v_sPositionStyle;
		},

		removePdfCssPositionStyling: function()
		{
			this.$el[0].style.position = "";
		},

		_onRSApplicationReady: function(v_oContentViewDeferred, v_idIFrameAuthoring)
		{
			this.m_iframeAuthoring = document.getElementById(v_idIFrameAuthoring);
			console.timeEnd('rsperf: render->OnRSApplicationReadyForObservers');
			rsPerformance.mark('rsContentView._onRSApplicationReady');
			this._addIframeMouseDownHandler();
			this._addAlertHandlers();
			var v_oApplication = this.getAuthoringApplication();
			v_oApplication.SharedState.Set(null, "isTryIt", !!this.m_bIsTryIt);
			this.glassContext.getCoreSvc(".UserProfile").getCapabilities().then(function(v_aCapabilities) {
				v_oApplication.SetGlassInfo({
					"glassView": this,
					"glassContext": this.glassContext,
					"launchParameters": this.m_oLaunchParameters,
					"capabilities": v_aCapabilities
				});

				handleTruthyValueAlreadySetOrAddObserver(v_oApplication, "isAppLoaded", this.onAppLoaded.bind(this));
				v_oContentViewDeferred.resolve(this);
			}.bind(this));
		},

		_onRsLaunchError: function(v_oDeferred)
		{
			console.log("rsContentView._onRsLaunchError(). ");
			this.hackUnlockGlass();
			v_oDeferred.reject( new Error("rsContentView: error during iframe load") );
		},

		_hackFindPlugin: function(id)
		{
			return rsCommon._hackFindPlugin(this.m_oAppView, id);
		},

		hackLockGlass: function()
		{
			if (!this.m_bDisableRsLockUnlock)
			{
				rsCommon.hackLockGlass(this.m_oAppView);
			}
		},

		hackUnlockGlass: function()
		{
			if (!this.m_bDisableRsLockUnlock)
			{
				rsCommon.hackUnlockGlass(this.m_oAppView);
			}
		},

		getReportSpec: function()
		{
			return this.m_sReportSpecFromOpener;
		},

		launchInExploration: function(v_nReport, v_aSelectionIids, v_sReportSpec, v_sExploreStoreID)
		{
			return require(["bi/authoring/utils/V5ToDashboard"], function(V5ToDashboard)
			{
				var v_oAuthoringApp = this.getAuthoringApplication();
				return V5ToDashboard.LaunchInExploration(v_nReport, v_oAuthoringApp, v_aSelectionIids, v_sReportSpec, v_sExploreStoreID, this.glassContext)
				.then(function() {});
			}.bind(this));
		},

		syncIFrameSizeToView: function()
		{
			if (this.m_iframeAuthoring && this.m_iframeAuthoring.style.visibility == "visible")
			{
				rsIFrameManager.F_PositionAndSizeIFrame(this.$el, this.m_iframeAuthoring);
			}
		},

		/**
		 * This method gets the parameters from the application
		 * and optionally removes credential parameters.
		 * This method should be used to get parameters values that will be exposed in URLs
		 * because they are large but more importantly they are a security risk since
		 * due to another defect, the contain username/passwords in plain text.
		 * This is a public method used by other components and as such
		 * must be defined in both rs and cv content views.
		 */
		getParameterValues: function( bStripCredentials )
		{
			var v_oAuthoringApp = this.getAuthoringApplication();
			var v_aParameters = null;
			var v_aAppParameters = v_oAuthoringApp.GetParameterValues();
			if (v_aAppParameters)
			{
				v_aParameters = [];
				if (v_aAppParameters.length > 0)
				{
					v_aAppParameters.forEach( function(v_oParameter)
					{
						if (!bStripCredentials || !v_oParameter || !v_oParameter.name || v_oParameter.name.indexOf("credential:") != 0)
						{
							v_aParameters.push( v_oParameter );
						}
					});
				}
			}
			return v_aParameters;
		},

		/**
		 * Called by global parameter flyout to determine what parameters are used by the currently active view.
		 * @return Object with parameter names as members that currently in use by the report.
		 */
		getParameters: function()
		{
			if (this.m_behaviour.isViewer())
			{
				if (this.m_behaviour.isActiveReport())
				{
					// When viewing active reports, global parameters can't be modified.
					return {};
				}
				var v_aParameters = this.getParameterValues(true);
				return rsPromptParameters.convertParameterArrayToObject(v_aParameters);
			}
			return null;
		},

		/**
		 * Called by global parameter flyout to let content view know what global parameters have changed.
		 * The method determines if any of the modified global parameters are used by the report and if so
		 * the report is refreshed.
		 * @param v_oGlobalParameters The global parameters that have been modified.
		 * @param glassContext The glass context used to access complete global parameters.
		 */
		updateGlobalParameters: function( v_oNewGlobalParameters, v_oGlassContext )
		{
			var v_Application = this.getAuthoringApplication();
			if (v_Application && v_oNewGlobalParameters && !this.m_behaviour.isActiveReport())
			{
				// Don't apply global parameter changes to active reports.

				var v_aGlobalParameters = rsCommon.convertToArray( v_oGlassContext ? v_oGlassContext.services.userProfile.userProfileSettings.parameter_values : null );
				var v_sGlobalParameters = v_aGlobalParameters.length ? JSON.stringify( v_aGlobalParameters ) : null;

				var v_aGlobalParametersDelta = rsCommon.convertToArray( v_oNewGlobalParameters );
				var v_sGlobalParametersDelta = v_aGlobalParametersDelta.length ? JSON.stringify( v_aGlobalParametersDelta ) : null;

				var v_oParameters = {
						globalParameters: v_sGlobalParameters,
						globalParametersDelta: v_sGlobalParametersDelta
						};
				v_Application.SharedState.Call(null, "updateGlobalParameters", v_oParameters);
			}
		},

		/**
		 * Called by Collaboration to retrieve the DOM node for screen capturing and report's name.
		 * @returns {array} Array of objects containing the DOM element and the name.
		 */
		getShareableItemsForCollaboration: function()
		{
			if (this.isApplicationLoaded() && this.m_iframeAuthoring)
			{
				var v_oAuthoringApp = this.getAuthoringApplication();
				if (v_oAuthoringApp)
				{
					var doc = this.m_iframeAuthoring.contentDocument;
					var body = doc.body;
					if (this.m_behaviour.isActiveReport())
					{
						// active reports are inside an iframe, grab the body of that iframe instead.
						var iframes = doc.querySelectorAll("iframe");
						if (iframes && iframes.length === 1)
						{
							body = iframes[0].contentDocument.body;
						}
					}
					return [{
						el: body,
						label: v_oAuthoringApp.SharedState.Get("reportName")
					}];
				}
			}
			return [];
		},

		_handleFirstAppViewOnLoaded: function(v_oDeferred, v_oEvent, v_sEventName)
		{
			if (v_sEventName != 'appView:loaded')
			{
				return;
			}
			if ( !v_oEvent || !v_oEvent.appView || v_oEvent.appView != this.m_oAppView)
			{
				return;
			}
			console.info('rsContentView._handleFirstAppViewOnLoaded');
			v_oDeferred.resolve(true);
			this.m_oRemoveAppViewLoadedHandler.remove();
			this.m_oRemoveAppViewLoadedHandler = undefined;
		},

		/**
		 * setFocus will be called whenever glass want to put focus inside contentView.
		 *  here, the code will check if interactive viewer is loaded then focus inside report viewer
		 */
		setFocus: function setFocus()
		{
			if (this.isApplicationLoaded())
			{
				var v_oApplication = this.getAuthoringApplication();

				if (v_oApplication && v_oApplication.SharedState && v_oApplication.SharedState.Get( "isReportLoaded" ))
				{
					v_oApplication.SetFocusToWorkarea();
				}
			}
			else
			{
				rsContentView.inherited('setFocus', this, arguments); // eslint-disable-line prefer-rest-params
			}
		},


		_removeAlertHandlers: function()
		{
			if (this.m_oAlertAddedHandler)
			{
				this.m_oAlertAddedHandler.remove();
				this.m_oAlertAddedHandler = undefined;
			}

			if (this.m_oAlertRemovedHandler)
			{
				this.m_oAlertRemovedHandler.remove();
				this.m_oAlertRemovedHandler = undefined;
			}
		},

		_addAlertHandlers: function()
		{
			if (!this.m_oAlertAddedHandler )
			{
				this.m_oAlertAddedHandler = this.glassContext.getCoreSvc('.Events')
					.on('authoring:alert:added',
						function(payload) {
							if (payload.alerts !== 0)
							{
								this.syncIFrameSizeToView();
							}
						}.bind(this));
			}

			if ( !this.m_oAlertRemovedHandler )
			{
				this.m_oAlertRemovedHandler = this.glassContext.getCoreSvc('.Events')
				.on('authoring:alert:removed',
					function(payload) {
						if (payload.alerts === 0)
						{
							this.syncIFrameSizeToView();
						}
					}.bind(this));
			}
		},

		addGlassUIAfterModalCallback: function( fnAfterModalCallback )
		{
			this.m_bModalOpened = false;
			this.m_oGlassModalObserver = new MutationObserver( function(mutList, observer) {
				if (mutList.length !== 1)
				{
					console.warn('unexpected mutation list length ' + mutList.length );
					return;
				}

				var bodyEl = mutList[0].target;
				if (bodyEl.classList.contains('bx--body--with-modal-open'))
				{
					this.m_bModalOpened = true;
				}
				else if (this.m_bModalOpened)
				{
					observer.disconnect();
					fnAfterModalCallback();
					this.m_oGlassModalObserver = null;
				}
				else
				{
					console.log('no modal but we haven\'t opened yet');
				}
			}.bind(this));
			this.m_oGlassModalObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] } );
		},
	});


	return rsContentView;
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
	(C) Copyright IBM Corp. 2022
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define('bi/authoring/common/ReportingBehaviour',[], function() {
	'use strict';

	/**
	 * Common methods for reporting behaviour.
	 */
	class ReportingBehaviour
	{
		constructor(v_oContentView)
		{
			this.m_oContentView = v_oContentView;
		}

		isViewer()
		{
			return true;
		}

		isActiveReport()
		{
			return false;
		}

		getReportStoreId()
		{
			return undefined;
		}

		isShareable(v_bEmbed)
		{
			return this.getReportStoreId() && this.isViewer();
		}

		populateShareUrl(v_oUrlMap)
		{
		}
	}

	return ReportingBehaviour;
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
	(C) Copyright IBM Corp. 2022
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define('bi/authoring/AuthoringBehaviour',[
	'bi/authoring/common/ReportingBehaviour'
	],
function(ReportingBehaviour) {
	'use strict';

	/**
	 * Authoring implementation of ReportingBehaviour.
	 */
	class AuthoringBehaviour extends ReportingBehaviour
	{
		isViewer()
		{
			const v_oAuthoringApp = this.m_oContentView.getAuthoringApplication();
			return v_oAuthoringApp && v_oAuthoringApp.SharedState.Get("isViewer");
		}

		isActiveReport()
		{
			const v_oAuthoringApp = this.m_oContentView.getAuthoringApplication();
			return v_oAuthoringApp && v_oAuthoringApp.SharedState.Get("isActiveReport");
		}

		getReportStoreId()
		{
			const v_oAuthoringApp = this.m_oContentView.getAuthoringApplication();
			return v_oAuthoringApp ? v_oAuthoringApp.SharedState.Get("storeID") : undefined;
		}

		populateShareUrl(v_oUrlMap)
		{
			const v_oAuthoringApp = this.m_oContentView.getAuthoringApplication && this.m_oContentView.getAuthoringApplication();
			if (v_oAuthoringApp)
			{
				if (this.isViewer())
				{
					v_oUrlMap.action = 'run';

					const v_sObjectType = v_oAuthoringApp.SharedState.Get("objectType");
					if (v_sObjectType != 'interactiveReport')
					{
						// No format needed on active reports
						const v_sViewer = v_oAuthoringApp.SharedState.Get("viewer");
						switch (v_sViewer.toUpperCase())
						{
							case "HTML":
								v_oUrlMap.format = "HTML";
								break;

							case "PDF":
								v_oUrlMap.format = "PDF";
								break;
						}
					}
				}
				else
				{
					v_oUrlMap.action = 'edit';
				}
			}
			else
			{
				// Being called before application was loaded so try alternative source of information
				v_oUrlMap.action = this.m_oContentView.action || (this.isViewer() ? 'run' : 'edit');
				if (v_oUrlMap.action != 'edit')
				{
					v_oUrlMap.format = this.m_oContentView.format;
				}
			}
		}
	}

	return AuthoringBehaviour;
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: authoring
	(C) Copyright IBM Corp. 2022
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/
/* eslint-disable no-underscore-dangle */

define( 'bi/authoring/authoringContentView',[
	'bi/authoring/rsContentView',
	'bi/authoring/AuthoringBehaviour'
	],
function(rsContentView, AuthoringBehaviour) {
	'use strict';

	const authoringContentView = rsContentView.extend({

		init: function(options, appView)
		{
			this.m_behaviour = new AuthoringBehaviour(this);

			authoringContentView.inherited('init', this, arguments); // eslint-disable-line prefer-rest-params
		},

	});

	return authoringContentView;
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
	(C) Copyright IBM Corp. 2015, 2020
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define('bi/authoring/plugins/rsAppButtonActions',['bi/glass/app/plugins/ButtonActionInterface'], function(ButtonActionInterface) {
	'use strict';

	var AuthoringButtonActionInterface = ButtonActionInterface.extend({

		onPress: function(context)
		{
			var v_sObserverId = 'rsAppButtonActions';

			console.log("rsAppButtonActions pressed");
			console.log('context.target.plugin.itemSpec.id: %s', context.target.plugin.itemSpec.id);
			var v_sId = context.target.plugin.itemSpec.id;

			var v_oContentView = context.glassContext.currentAppView.currentContentView;
			var v_Application = v_oContentView.getAuthoringApplication();
			if (!v_Application)
			{
				return;
			}

			// un-push / deselect any sibling buttons (temporary workaround till Glass will fix RTC 93965)
			// this doesn't work as expected, commenting out and waiting for Glass to implement API
			//context.target.plugin.$el.siblings('[type="button"]').removeClass('pushed');

			switch (v_sId)
			{
				case "com.ibm.bi.authoring.insertableObjectsBtn":
					v_Application.SharedState.Toggle(v_sObserverId, "showInsertableObjects");
					break;

				default:
					console.log("Unhandled label: " + v_sId);
					return;
			}

			v_Application.GlassButton_onPress(v_sId);
		}

	});
	return AuthoringButtonActionInterface;
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
	(C) Copyright IBM Corp. 2017, 2022
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define('bi/authoring/utils/rsSaveReportView',[
	'bi/authoring/nls/StringResource',
], function(StringResource) {
	'use strict';

	return {

		saveReportView: function(v_oCmProperties, v_oContext) {
			return new Promise( (v_fnResolve, v_fnReject) =>
			{
				v_oContext.glassContext.getSvc('.ContentDialogFactory')
					.then(function(v_oDialogFactory) {
						var v_oDialog = v_oDialogFactory.createSaveAsDialog({
							glassContext: v_oContext.glassContext,
							defaultFileName: StringResource.get( v_oCmProperties.type === "powerPlay8Report" ? 'powerplay_view_of' : 'report_view_of', { reportName: v_oCmProperties.defaultName }),
							ancestors: v_oCmProperties.ancestors,
							service: {
								context: v_oContext,
								inheritBaseProperties: function(oData)
								{
									if (oData.type === "reportView")
									{
										var sUrl;
										if (v_oCmProperties._meta) // eslint-disable-line no-underscore-dangle
										{
											sUrl = v_oCmProperties._meta.links.self.url; // eslint-disable-line no-underscore-dangle
										}
										else
										{
											sUrl = v_oCmProperties.selfUrl;
										}
										return v_oContext.glassContext.services.ajax.ajax({
											'url': sUrl + '?fields=executionFormat,executionLocale,options,parameters',
											'dataType': 'json',
											'type': 'GET'
										})
											.then(function(response) {
												var data = response.data[0];
												oData.executionFormat = data.executionFormat;
												oData.executionLocale = data.executionLocale;
												oData.options = data.options;
												oData.parameters = data.parameters;
											});
									}
									return Promise.resolve();
								},
								save: function(v_oService, v_oSelection, v_sName, v_bOverwrite) {
									v_oDialog.hide();
									var v_oData = {
											"type": v_oCmProperties.type === "powerPlay8Report" ? "powerPlay8ReportView" : "reportView",
											"defaultName": v_sName,
											"base": [{
												"searchPath": "storeID(\"" + v_oCmProperties.id + "\")",
												"type": "baseClass"
											}]
										};
									return this.inheritBaseProperties(v_oData)
										.then(function() {
											var v_sUrl = v_oSelection.url + "?updateAction=" + (v_bOverwrite ? "replace" : "fail");
											return v_oService.context.glassContext.services.ajax.post(v_sUrl, {
												contentType: "application/json",
												processData: false,
												dataType: "text",
												data: JSON.stringify(v_oData)
											})
											.then(function(v_oResult) {
												// Refresh the content app list control
												try
												{
													v_oContext.target.plugin.activeObject.oListControl.contentView.refresh();
												}
												catch (e)
												{
													// Ignore
												}
												v_fnResolve(v_oResult);
												return v_oResult;
											})
											.catch(function(d, request) {
												var v_oResponse = request.responseJSON;
												if (!v_oResponse && request.responseText)
												{
													v_oResponse = JSON.parse(request.responseText);
												}
												if (v_oResponse.errorCode === "cmDuplicateName")
												{
													return Promise.reject({ isDuplicate: true });
												}
												else if (v_oResponse.errorCode === "cmAddWithReplaceFailed")
												{
													return Promise.reject({ isReplaceFailed: true });
												}

												v_fnReject();
												return Promise.reject();
											});
										}, function() {
											v_fnReject();

											return Promise.reject();
										});
								}
							}
						});
						v_oDialog.open();
					});
			});
		}
	};
});

// Licensed Materials  - Property of IBM
// IBM Cognos Products: rs
// (C) Copyright IBM Corp. 2016, 2022
// US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

define('bi/authoring/plugins/rsContextMenuActions',[
	'bi/glass/app/plugins/MenuActionInterface',
	'bi/authoring/utils/rsOpenHelper',
	'bi/authoring/common/utils/rptShareHelper',
	'bi/authoring/utils/rsPerformance',
	'bi/authoring/utils/rsSaveReportView'
	],
function(MenuActionInterface, OpenHelper, ShareHelper, rsPerformance, rsSaveReportView) {
	'use strict';

	var rsContextMenuActions = MenuActionInterface.extend({

	isItemVisible: function(context)
	{
		// console.log("rsContextMenuActions.isItemVisible");
		if (!context.target )
		{
			return false;
		}
		if (!context.target.activeObject && !context.target.objectInformation)
		{
			return false;
		}

		var v_oCMInfo;
		if (context.target.activeObject)
		{
			var v_aSelectedContext = context.target.activeObject.aSelectedContext;
			if (v_aSelectedContext.length !== 1)
			{
				return false;
			}
			v_oCMInfo = v_aSelectedContext[0];
		}
		else if (context.target.objectInformation)
		{
			v_oCMInfo = context.target.objectInformation;
		}

		// Search results provide the context object(s) in a for where boolean properties are strings
		// Make it consistent with context provided by content
		if (typeof v_oCMInfo.disabled == 'string')
		{
			v_oCMInfo.disabled = v_oCMInfo.disabled == 'true' ? true : (v_oCMInfo.disabled == 'false' ? false : v_oCMInfo.disabled);
		}

		// This is what we really should be doing but until we work out the 'disabled' story product wide or for reporting
		// we will reduce the impact to match what dashboard is doing which is prevent creation of new objects from a disabled package or module
		//if (!!v_oCMInfo.disabled)
		//{
		//	return false;
		//}

		var v_sCapabilityToCheck = 'canUseReportStudio';
		var v_sPermission = 'read';
		switch (context.target.itemId)
		{
			case "com.ibm.bi.authoring.convertToReport":
				if (['analysis', 'query'].indexOf( v_oCMInfo.type ) === -1)
				{
					return false;
				}
				break;

			case "com.ibm.bi.datasets.createDataSetFromModule":
				v_sCapabilityToCheck = 'canUseMyDataSets';
				// fall through to report case
			case "com.ibm.bi.authoring.createReportFromModule":
				if (v_oCMInfo.type !== "module")
				{
					return false;
				}
				// See comment above regarding disabled
				if (v_oCMInfo.disabled)
				{
					return false;
				}
				if (v_oCMInfo.effectiveUserCapabilities && v_oCMInfo.effectiveUserCapabilities.indexOf(v_sCapabilityToCheck) === -1)
				{
					return false;
				}

				break;

			case "com.ibm.bi.datasets.createDataSetFromPackage":
				v_sCapabilityToCheck = 'canUseMyDataSets';
				// Fall through to report
			case "com.ibm.bi.authoring.createReportFromPackage":
				if (v_oCMInfo.type !== "package")
				{
					return false;
				}
				// See comment above regarding disabled
				if (v_oCMInfo.disabled)
				{
					return false;
				}
				if (!v_oCMInfo.effectiveUserCapabilities || v_oCMInfo.effectiveUserCapabilities.indexOf(v_sCapabilityToCheck) === -1)
				{
					return false;
				}
				break;

			case "com.ibm.bi.authoring.editReport":
			case "com.ibm.bi.datasets.editDataset": {
				if (context.target.itemId == 'com.ibm.bi.datasets.editDataset')
				{
					if (v_oCMInfo.type !== "dataSet2")
					{
						return false;
					}
					v_sCapabilityToCheck = 'canUseMyDataSets';
				}
				else
				{
					if (['interactiveReport', 'report', 'reportTemplate'].indexOf(v_oCMInfo.type) === -1)
					{
						return false;
					}
				}

				let v_oModel = v_oCMInfo.metadataModelPackage && v_oCMInfo.metadataModelPackage[0];
				if (!v_oModel)
				{
					v_oModel = v_oCMInfo.module && v_oCMInfo.module[0];
				}

				if (v_oModel && v_oModel.effectiveUserCapabilities && v_oModel.effectiveUserCapabilities.indexOf(v_sCapabilityToCheck) === -1)
				{
					return false;
				}

				break;
			}

			case "com.ibm.bi.authoring.saveAsReportView":
				if (['interactiveReport', 'report', 'query', 'analysis'].indexOf( v_oCMInfo.type ) === -1)
				{
					return false;
				}
				v_sCapabilityToCheck = undefined;
				v_sPermission = undefined;
				break;

			case "com.ibm.bi.authoring.saveAsPowerPlayView":
				if (v_oCMInfo.type !== 'powerPlay8Report')
				{
					return false;
				}
				v_sCapabilityToCheck = undefined;
				v_sPermission = undefined;
				break;

			case "com.ibm.bi.contentApps.action.runAs":
				if ( ['interactiveReport', 'report', 'reportView', 'query', 'analysis', 'powerPlay8Report', 'powerPlay8ReportView'].indexOf( v_oCMInfo.type ) === -1)
				{
					return false;
				}
				v_sCapabilityToCheck = 'canUseCognosViewerRunWithOptions';
				v_sPermission = 'execute';
				if (v_oCMInfo.type === 'reportView')
				{
					if (v_oCMInfo.base === null)
					{
						// base report of report view no longer exists
						return false;
					}
					else if (v_oCMInfo.base[0] && v_oCMInfo.base[0].permissions && v_oCMInfo.base[0].permissions.indexOf(v_sPermission) === -1)
					{
						return false;
					}
				}
				break;

			case "com.ibm.bi.contentApps.defaultAction.interactiveReport":
			case "com.ibm.bi.contentApps.defaultAction.report":
			case "com.ibm.bi.contentApps.defaultAction.dataSet2":
			case "com.ibm.bi.contentApps.defaultAction.reportTemplate":
			case "com.ibm.bi.contentApps.defaultAction.reportView":
			case "com.ibm.bi.contentApps.defaultAction.query":
			case "com.ibm.bi.contentApps.defaultAction.analysis":
				return context.target.itemId.indexOf(v_oCMInfo.type) > 0 &&
					OpenHelper.determineDefaultAction(context.target.itemId, v_oCMInfo, context.glassContext) !== null;

			case "com.ibm.bi.datasets.datasets-divider-top":
			case "com.ibm.bi.datasets.datasets-divider-bottom":
				return true;

			default:
				return false;
		}

		if (v_sCapabilityToCheck && !context.glassContext.hasCapability( v_sCapabilityToCheck ))
		{
			return false;
		}

		var v_aPermissions = v_oCMInfo.permissions;

		if (!v_aPermissions)
		{
			return false;
		}

		if (v_sPermission && v_aPermissions.indexOf(v_sPermission) == -1)
		{
			return false;
		}
		return true;
	},

	isVisible: function(context)
	{
		var v_bShareable = false;
		// Ensure we are being called with expected info
		if (context && context.target && context.target.itemId && context.glassContext)
		{
			switch (context.target.itemId)
			{
				case "com.ibm.bi.glass.common.shareContextual":
					v_bShareable = true;
					break;
				case "com.ibm.bi.glass.common.embedContextual":
					// Don't embed datasets
					if (context.target.activeObject)
					{
						var v_oCmProperties = context.target.activeObject.aSelectedContext[0];
						if (v_oCmProperties && v_oCmProperties.type !== 'dataSet2')
						{
							v_bShareable = true;
						}
					}
					break;

				case "com.ibm.bi.glass.common.operations.shareCurrent":
				case "com.ibm.bi.glass.common.operations.embedCurrent":
					//Meaning, we are sharing from overflow menu of authoring.
					var v_oCurrentContentView = context.glassContext.currentAppView.currentContentView;
					v_bShareable = v_oCurrentContentView.m_behaviour.isShareable(context.target.itemId === "com.ibm.bi.glass.common.operations.embedCurrent");
					break;

				default:
					//Remains invisible unless action implemented otherwise.
					console.log('Unsupported isVisible menu action item : ' + context.target.itemId);
			}
		}
		return v_bShareable;
	},

	execute: function(context)
	{
		// console.log('rsContextMenuActions.execute ...');
		var v_oCmProperties;
		if (context.target && context.target.activeObject)
		{
			v_oCmProperties = context.target.activeObject.aSelectedContext[0];
		}
		else if (context.target && context.target.objectInformation)
		{
			v_oCmProperties = context.target.objectInformation;
		}
		var v_oCurrentContentView = context.glassContext && context.glassContext.currentAppView && context.glassContext.currentAppView.currentContentView;

		var v_oOpenSpec = {
			cmProperties: v_oCmProperties,
			mode: context.mode,
			glassContext: context.glassContext,
			contentView: v_oCurrentContentView
		};
		var v_fExecute;

		if (context.mode == 'defaultAction')
		{
			// This call is used to process a request that has no perspective defined
			// e.g. share link or openAppView( undefined, {...} )
			// It updates the urlMap with the perspective as well as any further information
			// needed to properly process the request.
			// If we have no cmProperties from the target, create oe using the info from the urlMap
			v_oOpenSpec.cmProperties = v_oOpenSpec.cmProperties || { id: context.urlMap.id, type: context.urlMap.type };
			v_oOpenSpec.urlMap = context.urlMap;
			v_fExecute = OpenHelper.getPerspective;
		}
		else {
			// This call generates the share link based on the current context
			// If we have no cmProperties, use the current view's cm properties.
			v_oOpenSpec.cmProperties = v_oOpenSpec.cmProperties || v_oCurrentContentView.cmProperties;
			v_fExecute = ShareHelper.getShareUrlMap;
		}

		return v_fExecute(v_oOpenSpec)
			.catch(function(err) {
				console.log("rsContextMenuActions.execte ... FAILED.");
				throw err;
			});
	},

	doAction: function(context)
	{
		// console.log('rsContextMenuActions.doAction ...');
		return this.onSelectItem(context)
			.then( function(result) {
				// console.log('rsContextMenuActions.doAction ... succeeded');
				return result;
			})
			.catch( function(err) {
				console.log('rsContextMenuActions.doAction ... FAILED');
				throw err;
			});
	},

	canExecute: function(context)
	{
		//console.log('rsContextMenuActions.canExecute');
		return this.isItemVisible(context);
	},

	onSelectItem: function(context)
	{
		rsPerformance.clearMeasures();
		rsPerformance.clearMarks();
		rsPerformance.mark('authoring-selectItemAndDraw-start');
		rsPerformance.mark('rsContextMenuActions.onSelectItem');
		//console.log('rsContextMenuActions.onSelectItem ...');
		console.time('rsperf: total_RunReport');
		console.time('rsperf: onSelectItem->render');

		var v_oCmProperties;
		if (context.target && context.target.activeObject)
		{
			v_oCmProperties = context.target.activeObject.aSelectedContext[0];
		}
		else if (context.target && context.target.objectInformation)
		{
			v_oCmProperties = context.target.objectInformation;
		}
		else
		{
			console.log('rsContextMenuActions.onSelectItem ... FAILED -- no target');
			return Promise.reject(new Error('unexpected context.target: ' + context.target ? context.target.toString() : '<null>'));
		}

		if (context.target.itemId === "com.ibm.bi.authoring.saveAsReportView" ||
			context.target.itemId === "com.ibm.bi.authoring.saveAsPowerPlayView")
		{
			return rsSaveReportView.saveReportView(v_oCmProperties, context);
		}

		return OpenHelper.openView({
			cmProperties: v_oCmProperties,
			actionId: context.target.itemId,
			glassContext: context.glassContext,
			runOptions: context.target.runOptions })
			.then(function(result) {
				//console.log('rsContextMenuActions.onSelectItem ... succeeded');
				return result;
			})
			.catch(function(err) {
				console.log('rsContextMenuActions.onSelectItem ... FAILED');

				throw err;
			});
	},

	getShareableItems: function(context)
	{
		var items = [];
		var view = context.glassContext.getCurrentContentView();
		if (view && view.getShareableItemsForCollaboration)
		{
			items = view.getShareableItemsForCollaboration();
		}
		return Promise.resolve(items);
	}

	});

	return rsContextMenuActions;
});

// Licensed Materials  - Property of IBM
// IBM Cognos Products: rs
// (C) Copyright IBM Corp. 2015, 2020
// US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

define('bi/authoring/plugins/rsCreateMenuActions',['bi/glass/app/plugins/MenuActionInterface'], function(MenuActionInterface) {
	var CreateReportMenu = MenuActionInterface.extend({

		onSelectItem: function(context) {
			var v_sMenuItem = context.target.itemId;

			console.log("CreateReportMenu, " + v_sMenuItem + ", selected");
			console.log("CREATE TEMPLATE SELECTED.");

			context.glassContext.openAppView(
					'authoring',
					{
						content:
						{
							// TODO
							// provide and id for glass to cache
							// HACK until we get we work out the proper id
							id: Date.now().toString(),
						}
					});
		},

		doAction: function(context) {
			this.onSelectItem(context);
		}
	});
	return CreateReportMenu;
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
 	(C) Copyright IBM Corp. 2018
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/
define('bi/authoring/utils/U_Object',[], function() {
	"use strict";

	var U_Object = {};

	/**
	 * Determine if the object has any keys.
	 * @param {Object} o An object.
	 * @type Boolean
	 * @returns True if the object is empty.
	 */
	U_Object.F_IsEmpty = function( o )
	{
		for ( var s in o )
		{
			return false;
		}
		return true;
	};

	/**
	 * Convert the object to an array of the values.
	 * Each value becomes an item in the array.
	 * @param {Object} o An object.
	 * @type Array
	 * @returns The array.
	 */
	U_Object.F_ToValueArray = Object.values ?
		function( o )
		{
			return Object.values( o );
		}
	:
		function( o )
		{
			var a = [];
			for ( var s in o )
			{
				a.push( o[s] );
			}
			return a;
		};

	/**
	 * Count the number of keys in the object.
	 * @param {Object} o An object.
	 * @type Integer
	 * @returns The number of keys in the object.
	 */
	U_Object.F_GetLength = function( o )
	{
		var i = 0;
		for ( var s in o ) // eslint-disable-line no-unused-vars
		{
			i++;
		}
		return i;
	};

	/**
	 * Simple copy
	 * @param {Object} o An Object to copy
	 * @type {Object}
	 * @returns The copy.
	 */
	U_Object.F_Copy = Object.assign ?
		function( o )
		{
			return Object.assign( {}, o );
		}
	:
		function( o )
		{
			var v_oCopy = {};
			for ( var s in o )
			{
				v_oCopy[s] = o[s];
			}
			return v_oCopy;
		};

	U_Object.F_TypeOf = function( v )
	{
		var s = typeof v;
		if ( s == "object" )
		{
			if ( !v )
			{
				return "null";
			}
			if ( Array.isArray(v) )
			{
				return "array";
			}
		}
		return s;
	};

	/**
	 * Simple clone
	 * @param {Object} o An Object to clone
	 * @type {Object}
	 * @returns The clone.
	 */
	U_Object.F_Clone = function( o )
	{
		switch ( this.F_TypeOf( o ) )
		{
			case "number":
			case "string":
			case "boolean":
			case "undefined":
				return o;

			case "object":
				var v_oClone = {};
				for ( var s in o )
				{
					if ( o.hasOwnProperty( s ) )
					{
						v_oClone[s] = this.F_Clone( o[s] );
					}
				}
				return v_oClone;

			case "array":
				var v_aClone = [];
				var v_iLength = o.length;
				for ( var i = 0; i < v_iLength; i++ )
				{
					v_aClone[i] = this.F_Clone( o[i] );
				}
				return v_aClone;

			case "function":
				// Not supported
		}
	};

	/**
	 * Subtract values (o1 - o2)
	 * @param {Object} o1 An Object
	 * @param {Object} o2 An Object to subtract
	 * @type {Object}
	 * @returns A new object without the subtracted values.
	 */
	U_Object.F_Subtract = function( o1, o2 )
	{
		var v_oNew = this.F_Copy( o1 );
		for ( var s in o2 )
		{
			delete v_oNew[s];
		}
		return v_oNew;
	};

	U_Object.F_Compare = function( o1, o2 )
	{
		if (this.F_GetLength(o1) != this.F_GetLength(o2))
		{
			return false;
		}

		for (var v_sPropName in o1)
		{
			if (typeof o2[v_sPropName] === "undefined")
			{
				return false;
			}

			var v_oVal1 = o1[v_sPropName];
			var v_oVal2 = o2[v_sPropName];
			var v_bEqual = false;

			switch (typeof o1[v_sPropName])
			{
				case "object":
					v_bEqual = this.F_Compare(v_oVal1, v_oVal2);
					break;

				case "function":
					v_bEqual = v_oVal1.toString() === v_oVal2.toString();
					break;

				default:
					v_bEqual = v_oVal1 === v_oVal2;
					break;
			}

			if (!v_bEqual)
			{
				return false;
			}
		}

	    return true;
	};

	return U_Object;
});

/*
	IBM Confidential
	OCO Source Materials
   	IBM Cognos Products: rs
 	(C) Copyright IBM Corp. 2018
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define( 'bi/authoring/utils/U_Blocker',[], function() {
"use strict";

var m_divEventBlocker;

var K_iKeyTab = 9;

var f_stopTabKey = function( e )
{
	if ( e.keyCode == K_iKeyTab )
	{
		e.preventDefault();
		e.stopPropagation();
	}
};


var U_Blocker = {};

/**
 * Show a blocker over the entire window to prevent user interaction
 * @param {Integer} v_iZIndex z-index that the blocker should be shown at
 * @type DIV
 * @returns The blocker.
 */
U_Blocker.F_ShowEventBlocker = function( v_iZIndex )
{
	if ( !m_divEventBlocker )
	{
		m_divEventBlocker = document.body.appendChild( document.createElement( "DIV" ) );
		m_divEventBlocker.onkeydown = f_stopTabKey;
		//m_divEventBlocker.className = "clsBlocker";

		// Following is equivalent to clsBlocker
		m_divEventBlocker.style.position = 'absolute';
		m_divEventBlocker.style.left = '0';
		m_divEventBlocker.style.top = '0';
		m_divEventBlocker.style.width = '100%';
		m_divEventBlocker.style.height = '100%';
	}
	m_divEventBlocker.style.zIndex = v_iZIndex;
	m_divEventBlocker.style.visibility = "visible";
	return m_divEventBlocker;
};

/**
 * Hides the blocker
 * @type void
 */
U_Blocker.F_HideEventBlocker = function()
{
	if ( m_divEventBlocker )
	{
		m_divEventBlocker.style.visibility = "hidden";
		["onmousedown", "onmouseup", "onmousemove", "onclick", "ondblclick", "onmouseover", "onmouseout"].forEach( function( s ) { this[s] = null; }, m_divEventBlocker );
	}
};

return U_Blocker;
});

/*
	IBM Confidential
	OCO Source Materials
   	IBM Cognos Products: rs
 	(C) Copyright IBM Corp. 2018
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define('bi/authoring/utils/U_ClearableTimeout',[], function() {
"use strict";

// In IE, there is no guarantee that calling clearTimeout will actually stop a setTimeout from firing. These wrappers provide an extra level
// of control to ensure that a setTimeout will not fire once the timer has been cleared.
// To keep things simple, we use the same implementation for all browsers since the overhead of the wrapper is minimal.

var f_timeoutHandler = function(v_fn, v_oTimeoutHandle)
{
	if (v_oTimeoutHandle.m_iTimeoutId !== null)
	{
		v_oTimeoutHandle.m_iTimeoutId = null;
		v_fn();
	}
};

var U_ClearableTimeout = {};

U_ClearableTimeout.F_Create = function(v_fn, v_iTimeout)
{
	var v_oTimeoutHandle = {};
	v_oTimeoutHandle.m_iTimeoutId = setTimeout(f_timeoutHandler.bind(this, v_fn, v_oTimeoutHandle), v_iTimeout);
	return v_oTimeoutHandle;
};

U_ClearableTimeout.F_Clear = function(v_oTimeoutHandle)
{
	if (v_oTimeoutHandle.m_iTimeoutId)
	{
		/*
			* The order of the next lines is significant. It appears that under some circumstances, calling clearTimeout will actually
			* run a previous setTimeout in the same thread. Clearing our active timeout record ensures that it will get ignored.
			*/
		var v_iTimeoutId = v_oTimeoutHandle.m_iTimeoutId;
		v_oTimeoutHandle.m_iTimeoutId = null;
		clearTimeout(v_iTimeoutId);
	}
};

return U_ClearableTimeout;
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
 	(C) Copyright IBM Corp. 2018, 2021
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define( 'bi/authoring/utils/rsPromptHandler',['bi/authoring/utils/pat/rsLaunchParameters',
         'bi/authoring/utils/U_Blocker',
         'bi/authoring/utils/U_Object',
         'bi/authoring/utils/U_ClearableTimeout'],
         function(rsLaunchParameters, U_Blocker, U_Object, U_ClearableTimeout) {
	var rsPromptHandler = {};
//
///**
// * @private
// */
	rsPromptHandler.k_iPollPromptWindow = 1000;
///**
// * @private
// */
//G_BusServer.m_aLogonListeners = [];
///**
// * @private
// */
	rsPromptHandler.m_oPromptListeners = {};
///**
// * @private
// */
	rsPromptHandler.m_oPromptWindows = {};
/**
 * @private
 */
	rsPromptHandler.m_iPromptId = 0;

//G_BusServer.M_bUseReportServiceConsumerMode = false;
//
///**
// * @private
// */
//G_BusServer.f_setParameterValues = function(v_sParameterValues)
//{
//	this.m_sParameterValues = v_sParameterValues;
//	this.m_docParameterValues = null;
//};
//
//G_BusServer.F_GetParameterValuesNode = function()
//{
//	if (!this.m_docParameterValues)
//	{
//		this.m_docParameterValues = this.f_parseParameterValues(this.m_sParameterValues);
//	}
//
//	return this.m_docParameterValues.documentElement;
//};
//
///**
// * convert parameters from xml to json
// *
// *   <bus:parameterValues>
// *  	<item xsi:type="bus:parameterValue">
// * 		<bus:name xsi:type="xs:string">Parameter1</bus:name>
// * 		<bus:value xsi:type="SOAP-ENC:Array" SOAP-ENC:arrayType="bus:parmValueItem[1]">
// * 			<item xsi:type="bus:simpleParmValueItem">
// * 				<bus:inclusive xsi:type="xs:boolean">true</bus:inclusive>
// * 				<bus:display xsi:type="xs:string">BugShield Lotion</bus:display>
// * 				<bus:use xsi:type="xs:string">BugShield Lotion</bus:use>
// * 			</item>
// * 		</bus:value>
// * 	</item>
// * </bus:parameterValues>
// *
// *    [
// *      {
// *        "name": "Parameter1",
// *        "value": [
// *            {
// *              "inclusive": true,
// *              "use": "BugShield Lotion",
// *              "display": "BugShield Lotion",
// *              "type": "simpleParmValueItem"
// *            }
// *         ]
// *       }
// *     ]
// *
// */
//G_BusServer.F_GetParameterValuesJson = function()
//{
//	var v_nParameters = G_BusServer.F_GetParameterValuesNode();
//	var v_nlParamItems = v_nParameters.selectNodes("./item"), v_nParamItem;
//	var v_nlValues, v_nValue, v_nValueItem;
//	var v_aParams = [], v_oParam, v_oValue, v_oItem, v_sDisplay;
//
//	for (var v_iIdx = 0; v_iIdx < v_nlParamItems.length; v_iIdx++)
//	{
//		v_nParamItem = v_nlParamItems.item(v_iIdx);
//
//		v_oParam = {
//			name: U_Node.F_GetText(v_nParamItem.selectSingleNode("./bus:name")),
//			value: []
//		};
//
//		v_nValue = v_nParamItem.selectSingleNode("./bus:value");
//		v_nlValues = v_nValue.selectNodes("./item");
//		var v_aItems = [];
//
//		for (var v_iValue = 0; v_iValue < v_nlValues.length; v_iValue++)
//		{
//			v_nValueItem = v_nlValues.item(v_iValue);
//
//			v_oValue = {
//				type: v_nValueItem.getAttribute("xsi:type").split(":").pop(),
//				inclusive: v_nValueItem.selectSingleNode("./bus:inclusive[text()='true']") ? true : false
//			};
//
//			switch (v_oValue.type)
//			{
//				case "simpleParmValueItem":
//					v_aItems.push({
//						xmlNode: v_nValueItem,
//						jsonObj: v_oValue
//					});
//					break;
//
//				case "boundRangeParmValueItem":
//					v_oValue.start = {};
//					v_aItems.push({
//						xmlNode: v_nValueItem.selectSingleNode("./bus:start"),
//						jsonObj: v_oValue.start
//					});
//
//					v_oValue.end = {};
//					v_aItems.push({
//						xmlNode: v_nValueItem.selectSingleNode("./bus:end"),
//						jsonObj: v_oValue.end
//					});
//					break;
//
//				case "unboundedStartRangeParmValueItem":
//					v_oValue.end = {};
//					v_aItems.push({
//						xmlNode: v_nValueItem.selectSingleNode("./bus:end"),
//						jsonObj: v_oValue.end
//					});
//					break;
//
//				case "unboundedEndRangeParmValueItem":
//					v_oValue.start = {};
//					v_aItems.push({
//						xmlNode: v_nValueItem.selectSingleNode("./bus:start"),
//						jsonObj: v_oValue.start
//					});
//					break;
//
//				case "hierarchicalParmValueItem":
//					// The spec is invalid, but we need to render it anyway
//					G_Debug.F_Print("'hierarchicalParmValueItem' type is not handled.");
//					break;
//			}
//
//			for (var v_iItem = 0; v_iItem < v_aItems.length; v_iItem++)
//			{
//				v_oItem = v_aItems[v_iItem];
//
//				v_oItem.jsonObj.type = v_oItem.xmlNode.getAttribute("xsi:type").split(":").pop();
//				v_oItem.jsonObj.inclusive = v_oItem.xmlNode.selectSingleNode("./bus:inclusive[text()='true']") ? true : false;
//				v_oItem.jsonObj.use = U_Node.F_GetText(v_oItem.xmlNode.selectSingleNode("bus:use"));
//
//				v_sDisplay = U_Node.F_GetText(v_oItem.xmlNode.selectSingleNode("./bus:display"));
//				if (v_sDisplay)
//				{
//					v_oItem.jsonObj.display = v_sDisplay;
//				}
//			}
//
//			v_oParam.value.push(v_oValue);
//		}
//
//		v_aParams.push(v_oParam);
//	}
//
//	return v_aParams;
//};
//
///**
// * @private
// */
//G_BusServer.f_setNoParameterValues = function()
//{
//	/**
//	* @private
//	*/
//	this.f_setParameterValues(
//		'<bus:parameterValues ' + C_BusRequest.k_sBIBusNamespaceDecl + ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENC:arrayType="bus:parameterValue[]" xsi:type="SOAP-ENC:Array">' +
//		'</bus:parameterValues>');
//};
//
//G_BusServer.f_setNoParameterValues();
//
//
///**
// * @private
// */
//G_BusServer.m_aParametersListeners = [];
//
///**
// * @param {I_ServerParametersListener} v_oListener
// * @type void
// */
//G_BusServer.F_AddParametersListener = function( v_oListener )
//{
//	this.m_aParametersListeners.push( v_oListener );
//};
//
///**
// * @private
// */
	rsPromptHandler.f_getPromptId = function()
	{
		return ++this.m_iPromptId;
	};

///**
// * Sets the CAF context id for the server.
// * @param {String} v_sCafContextId CAF context id
// * @type void
// */
//G_BusServer.F_SetCafContextId = function(v_sCafContextId)
//{
//	this.m_sCafContextId = v_sCafContextId;
//};
//
///**
// * @returns The CAF context id for the server.
// * @type String
// */
//G_BusServer.F_GetCafContextId = function()
//{
//	return this.m_sCafContextId;
//};
//
///**
// * @private
// */
//G_BusServer.m_sRoutingServerGroup = "";
//
///**
// * This identifies the routing server group that the requests will be sent to.
// * @param {String} v_sRoutingServerGroup Routing server group to use for the request.
// * @type void
// */
//G_BusServer.F_SetCurrentReportRoutingServerGroup = function(v_sRoutingServerGroup)
//{
//	this.m_sRoutingServerGroup = v_sRoutingServerGroup || "";
//};
//
///**
// * @returns The router server group.
// * @type String
// */
//G_BusServer.F_GetCurrentReportRoutingServerGroup = function()
//{
//	return this.m_sRoutingServerGroup;
//};
//
///**
// * @private
// */
//G_BusServer.f_onUserProfileAcountOK = function(v_oAccount)
//{
//	G_BusServer.f_onLogonComplete(true);
//};
//
///**
// * @private
// */
//G_BusServer.f_onUserProfileAcountFailed = function(v_oDfd, v_oXHRError, v_sTextStatus, v_sErrorThrown)
//{
//	G_BusServer.f_onLogonComplete(false);
//};
//
///**
// * Launches the server dialog window for logon to the bus. The application will be blocked until the window closes.
// * @param {I_ServerLogonListener} v_oListener The listener for the logon.
// * @returns False if the logon process could not be started.
// * @type Boolean
// */
//G_BusServer.F_Logon = function(v_oListener, v_docResponse)
//{
//	// Call the Glass login perspective
//	U_GlassUtils.F_UserProfileAcountRequest(this.f_onUserProfileAcountOK.bind(this), this.f_onUserProfileAcountFailed.bind(this));
//
//	// After login the failing SOAP request must be done again
//	this.m_aLogonListeners.push(v_oListener);
//
//	// Because the user session could have timed out, we need to clear the authenticity token so that it is renewed when next needed
//	this.m_sAuthenticityToken = "";
//
//	return true;
//};
//
///**
// * @private
// * Called by portal services when logon is complete
// */
//function ccModalCallBack( v_sStatus )
//{
//	G_BusServer.f_onLogonComplete( v_sStatus == "ok" );
//};
//
///**
// * @private
// */
//G_BusServer.f_onLogonComplete = function(v_bSuccess)
//{
//	//Cant send a new request on a callback from another window.
//	//Bugzilla Bug 249843
//	setTimeout(this.f_onAfterLogonComplete.bind(this, v_bSuccess), 0);
//};
//
///**
// * @private
// */
//G_BusServer.f_onAfterLogonComplete = function(v_bSuccess)
//{
//	U_Array.F_CallEach( this.m_aLogonListeners, "F_OnServerLogonComplete", v_bSuccess );
//	this.m_aLogonListeners.length = 0;
//};
//
///**
// * @type void
// */
//G_BusServer.F_Logoff = function()
//{
//	var v_oBusRequest = new C_BusRequest( null, C_BusRequest.K_sSOAPAction_contentManagerService, "<bus:logoff/>" );
//	v_oBusRequest.F_Send();
//	// need to clear out the authenticityToken on logoff so next request can generate the new and correct one.
//	this.m_sAuthenticityToken = "";
//};
//
///**
// * @param {XMLDocument} v_docSOAPResponse
// * @type Boolean
// */
//G_BusServer.F_AuthenticationRequired = function( v_docSOAPResponse )
//{
//	var v_nBIBusHeader = v_docSOAPResponse.selectSingleNode( "/SOAP-ENV:Envelope/SOAP-ENV:Header/bus:biBusHeader" );
//
//	if (v_nBIBusHeader && v_nBIBusHeader.selectSingleNode(".//*[local-name() = 'errorCodeString' and text() = 'camAuthUserRecoverable']" ) )
//	{
//		return v_nBIBusHeader.selectSingleNode( ".//bus:promptInfo | .//promptInfo" ) != null;
//	}
//	return false;
//};
//
///**
// * @param {XMLDocument} v_docSOAPResponse
// * @type Boolean
// */
//G_BusServer.F_RequiresServerPrompting = function( v_docSOAPResponse )
//{
//	return Boolean( v_docSOAPResponse && v_docSOAPResponse.selectSingleNode( "/SOAP-ENV:Envelope/SOAP-ENV:Body/*/bus:result/bus:details/item[bus:status='prompting']" ) );
//};

	rsPromptHandler.f_createSoapPromptLaunchParameters = function(v_docSOAPResponse, v_fnOkCallback)
	{
		return this.f_createPromptLaunchParameters(v_docSOAPResponse, null, v_fnOkCallback);
	};

/**
 * Launches the interactive viewer for response prompting, then passes the final response to callback function.
 * @param {XMLDocument} v_docSOAPResponse
 * @param {Function} v_fnOkCallback
 */
	rsPromptHandler.f_createPromptLaunchParameters = function(v_docSOAPResponse, v_oRequest, v_fnOkCallback)
	{
		var v_oLaunchParameters = {
			promptFnOkCallback: v_fnOkCallback,
			reportXML: null
		};
		if (v_docSOAPResponse)
		{
			v_oLaunchParameters.promptSOAPResponse = ( new XMLSerializer() ).serializeToString( v_docSOAPResponse );
		}
		if (v_oRequest)
		{
			v_oLaunchParameters.promptRequest = v_oRequest;
		}

		return v_oLaunchParameters;
	};

	rsPromptHandler.f_createRestPromptLaunchParameters = function(v_oRequest, v_fnOkCallback)
	{
		return this.f_createPromptLaunchParameters(null, v_oRequest, v_fnOkCallback);
	};

/**
* @private
See WO 2397
The pdsState object will contains these properties:
ccs_cbdata the callback client state sent to promptDataSource.xts.
clientContext the parameter sent to promptDataSource.xts. (Formerly the 4th parameter 'clientContext' of the callback function)
conversation the conversation used in promptDataSource.xts's SOAP request. (Formerly the 3rd parameter of the callback function)
parameters contains the paremeter values collected by the promptDataSource.xts. (Formerly the 1st parameter of the callback function)
state the state of response returned promptDataSource.xts's SOAP request (OK, Cancel, Error). (Formerly the 2nd parameter 'response' of the callback function)
tracking the tracking info used in prompDataSource.xts's SOAP request. (Formerly the 5th parameter of the callback function)
*/
	rsPromptHandler.f_prompting_OkCallback = function(v_sPromptId, v_oResponse, v_oAttachments, v_sParameters, v_oOpener)
	{
		var pdsState =
				{
					"v_sClientContext": v_sPromptId,
					"response": v_oResponse,
					"attachments": v_oAttachments,
					"parameters": v_sParameters,
					"opener": v_oOpener
				};

		var v_oOpener = null;
		if ( pdsState.state != "Cancel" )
		{
			if (pdsState.parameters)
			{
				// Save parameter values used to generate the response.
				//G_BusServer.F_AddParameterValues( pdsState.parameters );
			}
			if (this.m_oPromptListeners[pdsState.v_sClientContext].F_SetPromptCallbackResponse)
			{
				this.m_oPromptListeners[pdsState.v_sClientContext].F_SetPromptCallbackResponse( pdsState.response, pdsState.attachments );
			}
			v_oOpener = pdsState.opener;
		}

		var v_sClientContext = pdsState.v_sClientContext;
		if ( !v_sClientContext )
		{
			//G_Debug.F_Print("Error: Prompting returned with no client context. Will attempt to inform any listener that can be found");
			for ( var s in this.m_oPromptWindows )
			{
				v_sClientContext = s;
			}
		}
		if ( this.m_iLastPromptTimeoutId )
		{
			U_ClearableTimeout.F_Clear( this.m_iLastPromptTimeoutId );
			this.m_iLastPromptTimeoutId = null;
		}
		//Cant send a new request on a callback from another window.
		//Bugzilla Bug 249843
		setTimeout( function(v_sClientContext) {
			this.f_fireOnPromptingComplete(v_sClientContext);
			// Close opener after the call above to ensure parameters
			// are still defined while they are being processed during the callback.
			if (v_oOpener)
			{
				v_oOpener.close();
			}
		}.bind(rsPromptHandler, v_sClientContext), 0);
		delete this.m_oPromptWindows[v_sClientContext];

		if ( U_Object.F_IsEmpty(this.m_oPromptWindows) )
		{
			U_Blocker.F_HideEventBlocker();
		}
		else
		{
			//set the focus to another prompt window.
			for ( var s in this.m_oPromptWindows )
			{
				this.m_oPromptWindows[s].focus();
				break;
			}
		}
	};

//G_BusServer.F_ProcessPromptContext = function( v_oPromptContext, v_oRequest )
//{
//	// If the prompt was cancelled (using a prompt button) then v_oRequest will be null
//	var v_docSOAPResponse = v_oRequest ? v_oRequest.F_GetResponse() : null;;
//
//	var v_sParameters = null;
//	if (v_docSOAPResponse && !v_oPromptContext.requestType)
//	{
//		// Extract parameters from response so that they can be added to current parameter values.
//		var v_nParameters = v_docSOAPResponse.selectSingleNode("/SOAP-ENV:Envelope/SOAP-ENV:Body//bus:details/*[@xsi:type='bus:asynchDetailParameterValues']/bus:parameters");
//		v_sParameters = this.f_responseParametersToParameterValues( v_nParameters );
//	}
//
//	if (v_oPromptContext.promptRequest && v_docSOAPResponse)
//	{
//		var v_sOrigUrl = v_oPromptContext.promptRequest.url;
//		// Make REST call to transform SOAP response into REST JSON response
//		v_oPromptContext.promptRequest.type = "POST";
//		v_oPromptContext.promptRequest.url += "/promptResults";
//		v_oPromptContext.promptRequest.data = U_Node.F_GetXml( v_docSOAPResponse );
//		v_oPromptContext.promptRequest.contentType = "text/xml";
//		Application.GlassContext.services.ajax.ajax(v_oPromptContext.promptRequest)
//			.then(	function( v_oResponseData, v_sStatus, v_oXHR )
//					{
//						// Restore URL so we can call delete on it latter.
//						v_oPromptContext.promptRequest.url = v_sOrigUrl;
//						this.f_processPromptContextResponse( v_oPromptContext, v_oResponseData, null, v_sParameters );
//					}.bind(this)
//			)
//			//.catch(??)
//			;
//	}
//	else
//	{
//		var v_oAttachments = v_oRequest ? v_oRequest.F_GetAttachments() : null;
//		this.f_processPromptContextResponse( v_oPromptContext, v_docSOAPResponse, v_oAttachments, v_sParameters );
//	}
//};
//
//G_BusServer.f_processPromptContextResponse = function( v_oPromptContext, v_oResponse, v_oAttachments, v_sParameters )
//{
//	if (v_oPromptContext.requestType == "collectParameterValues")
//	{
//		if (v_oResponse)
//		{
//			v_oPromptContext.promptFnOkCallback(G_BusServer.F_GetParameterValuesJson());
//		}
//		Application.F_CloseCurrentPerspective(undefined, function() {
//			try
//			{
//				v_oPromptContext.promptOpener.close();
//			}
//			catch (e)
//			{
//				// do nothing
//			}
//		});
//	}
//	else
//	{
//		// Closing opener is done in callback AFTER values are processed.
//		v_oPromptContext.promptFnOkCallback(v_oResponse, v_oAttachments, v_sParameters, v_oPromptContext.promptOpener);
//	}
//};
//
//G_BusServer.F_ReleasePromptContext = function( v_oPromptContext )
//{
//	if (v_oPromptContext && v_oPromptContext.promptRequest)
//	{
//		v_oPromptContext.promptRequest.type = "DELETE";
//		if (v_oPromptContext.promptRequest.data)
//		{
//			delete v_oPromptContext.promptRequest.data;
//		}
//		Application.GlassContext.services.ajax.ajax(v_oPromptContext.promptRequest);
//
//		// Clear main report conversation so we don't release it since the delete above will handle it on the server.
//		// ensures that this conversation doesn't get released in our shutdown code that releases all shared conversations.
//		C_BusConversation.F_UnShareConversation( C_BusRequest.K_sMainReportConversation );
//	}
//};

	/**
	 * Launches the server dialog window for prompting. The application will be blocked until the window closes.
	 * @param {I_ServerPromptingListener} v_oListener The listener for the prompting.
	 * @param {XMLDocument} v_docSOAPResponse
	 * @param {Object} v_oGlassContext The Glass context instance
	 * @returns False if the prompting process could not be started.
	 * @type Boolean
	 */
	rsPromptHandler.F_DoPrompting = function(v_oListener, v_docSOAPResponse, v_oGlassContext)
	{
		var v_sPromptId = this.f_getPromptId();
		var v_frmPrompting, v_sUrl, v_oLaunchParameters;

		v_oLaunchParameters = this.f_createSoapPromptLaunchParameters(v_docSOAPResponse, this.f_prompting_OkCallback.bind(this, v_sPromptId));
		v_oLaunchParameters.promptOutputPages = v_oListener.getOutputPages(v_docSOAPResponse);

		var v_oContext = {
			urlMap: {
				perspective: "authoring_embedded",
				shareMode: "embedded",
				isViewer: true,
				UIProfile: "Titan",
				promptResponse: "promptPage",
				ui_appbar: false,
				ui_navbar: false,
				launchParametersKey: rsLaunchParameters.Store(v_oLaunchParameters)
			}
		};

		v_sUrl = v_oGlassContext.getUrl(v_oContext);

		return this.f_launchPrompt( v_oListener, v_sUrl, v_frmPrompting, v_oLaunchParameters, v_sPromptId );
	};

	rsPromptHandler.f_onPromptBlockerMouseDown = function()
	{
		for ( var s in this.m_oPromptWindows )
		{
			this.m_oPromptWindows[s].focus();
			return;
		}
		//Shouldn't get here, but just in case.
		U_Blocker.F_HideEventBlocker();
		// ? G_Debug.F_Print("f_onPromptBlockerMouseDown: blocker was up, yet no prompt window");
	};

	rsPromptHandler.f_launchPrompt = function( v_oListener, v_sUrl, v_frmPrompting, v_oLaunchParameters, v_sPromptId )
	{
		// ? this.f_setNoParameterValues();

		//show blocker above dialogs
		var v_elBlocker = U_Blocker.F_ShowEventBlocker( 1000000 );
		v_elBlocker.onmousedown = this.f_onPromptBlockerMouseDown.bind(this);

		this.m_oPromptListeners[v_sPromptId] = v_oListener;
		this.m_oPromptWindows[v_sPromptId] = window.open( v_sUrl, (v_frmPrompting ? v_frmPrompting.target : "_blank"), "directories=no,location=no,status=no,toolbar=no,resizable=yes,scrollbars=yes,top=100,left=100,height=600,width=1000" );
		if ( !this.m_oPromptWindows[v_sPromptId] )
		{
			U_Blocker.F_HideEventBlocker();
			return false;
		}
		this.m_oPromptWindows[v_sPromptId].focus();

		if (v_frmPrompting)
		{
			v_frmPrompting.submit();
		}

		if (v_oLaunchParameters)
		{
			v_oLaunchParameters.promptOpener = this.m_oPromptWindows[v_sPromptId];
		}

		// when window closes call I_ServerPromptingListener.protype.F_OnServerPromptingComplete = function()
		this.m_iLastPromptTimeoutId = U_ClearableTimeout.F_Create( this.f_checkPromptingWindowState.bind(this, v_sPromptId), this.k_iPollPromptWindow );

		return true;
	};

///**
// * @private
// */
///**
// * @private
// */
	rsPromptHandler.f_checkPromptingWindowState = function( v_sPromptId )
	{
		this.m_iLastPromptTimeoutId = null;

		if ( this.m_oPromptWindows[v_sPromptId] )
		{
			// Permission denied error occurs intermittently on IE 6 if window is closed (Bug 550790)
			var v_bWindowClosed = false;
			try
			{
				v_bWindowClosed = this.m_oPromptWindows[v_sPromptId].closed;
			}
			catch ( e )
			{
				v_bWindowClosed = true;
			}

			if ( v_bWindowClosed )
			{
				delete this.m_oPromptWindows[v_sPromptId];
				if ( U_Object.F_IsEmpty(this.m_oPromptWindows) )
				{
					U_Blocker.F_HideEventBlocker();
				}
				else
				{
					//set the focus to another prompt window.
					for ( var s in this.m_oPromptWindows )
					{
						this.m_oPromptWindows[s].focus();
						break;
					}
				}
				//Cant send a new request on a callback from another window.
				//Bugzilla Bug 249843
				setTimeout(this.f_fireOnPromptingComplete.bind(this, v_sPromptId), 0);
			}
			else
			{
				this.m_iLastPromptTimeoutId = U_ClearableTimeout.F_Create( this.f_checkPromptingWindowState.bind(this, v_sPromptId), this.k_iPollPromptWindow );
			}
		}
		//else the callback was fired
	};

	/**
	 * The window that loaded this module is closing.
	 * Close any currently open prompt windows.
	 */
	rsPromptHandler.f_OnUnLoad = function( v_fOnUnLoad )
	{
		for (var v_sPromptId in this.m_oPromptWindows)
		{
			// Permission denied error occurs intermittently on IE 6 if window is closed (Bug 550790)
			var v_bWindowClosed = false;
			try
			{
				v_bWindowClosed = this.m_oPromptWindows[v_sPromptId].closed;
			}
			catch ( e )
			{
				v_bWindowClosed = true;
			}

			if (!v_bWindowClosed)
			{
				try
				{
					this.m_oPromptWindows[v_sPromptId].close();
				}
				catch (e)
				{
					// Ignore
				}
			}
			delete this.m_oPromptWindows[v_sPromptId];
		}

		if (v_fOnUnLoad)
		{
			v_fOnUnLoad();
		}
	};

//
///**
// * @type Array
// */
//G_BusServer.F_GetScriptableParameter = function( v_sParameter )
//{
//	var v_aParameters = [];
//	var d = this.f_parseParameterValues( this.m_sParameterValues );
//	if ( d )
//	{
//		var nl = d.documentElement.selectNodes( v_sParameter ? "item[bus:name=" + U_String.F_ToXPathString( v_sParameter ) + "]" : "item" );
//		var v_iLength = nl.length;
//		for ( var i = 0; i < v_iLength; i++ )
//		{
//			var v_nParameter = nl.item( i );
//			var v_aValues = [];
//			var v_oParameter = { "parameter" : v_nParameter.selectSingleNode( "bus:name" ).text, "values" : v_aValues };
//			v_aParameters.push( v_oParameter );
//			var v_nlValues = v_nParameter.selectNodes( "bus:value/item" );
//			var v_iValuesLength = v_nlValues.length;
//			for ( var j = 0; j < v_iValuesLength; j++ )
//			{
//				var v_nValueItem = v_nlValues.item( j );
//				if ( v_nValueItem.selectSingleNode( "bus:start | bus:end" ) )
//				{
//					var v_nStarUse = v_nValueItem.selectSingleNode( "bus:start/bus:use" );
//					var v_nStartDisplay = v_nValueItem.selectSingleNode( "bus:start/bus:display" );
//					var v_nEndUse = v_nValueItem.selectSingleNode( "bus:end/bus:use" );
//					var v_nEndDisplay = v_nValueItem.selectSingleNode( "bus:end/bus:display" );
//					v_aValues.push( new C_ScriptableParameterRangeValue( v_nStarUse ? v_nStarUse.text : null, v_nStartDisplay ? v_nStartDisplay.text : null, v_nEndUse ? v_nEndUse.text : null, v_nEndDisplay ? v_nEndDisplay.text : null ) );
//				}
//				else
//				{
//					var v_nUse = v_nValueItem.selectSingleNode( "bus:use" );
//					var v_nDisplay = v_nValueItem.selectSingleNode( "bus:display" );
//					v_aValues.push( new C_ScriptableParameterValue( v_nUse ? v_nUse.text : null, v_nDisplay ? v_nDisplay.text : null ) );
//				}
//			}
//		}
//	}
//	return v_aParameters;
//};
//
///**
// * @type String
// */
//G_BusServer.F_GetParameterValues = function()
//{
//	return this.m_sParameterValues;
//};
//
///**
// * @type void
// * @param {String} v_sParameterValues XML for the parameters element
// * @returns True if the parameter values were updated, False otherwise
// * @type Boolean
// */
//G_BusServer.F_SetParameterValues = function(v_sParameterValues)
//{
//	var v_sNewParams = v_sParameterValues.replace(/bus:parameters(\W)/g, "bus:parameterValues$1");
//	var v_docNewParams = this.f_parseParameterValues( v_sNewParams );
//	var v_docOldParams = this.f_parseParameterValues( this.m_sParameterValues );
//
//	if ( v_docNewParams && v_docOldParams && U_Node.F_GetXml( v_docNewParams.documentElement ) != U_Node.F_GetXml( v_docOldParams.documentElement ) )
//	{
//		this.f_setParameterValues(v_sNewParams);
//		this.F_fireOnParametersChange();
//		return true;
//	}
//	return false;
//};
//
//G_BusServer.f_responseParametersToParameterValues = function( v_nParameters )
//{
//	var v_sParameterValues = U_Node.F_GetXml( v_nParameters );
//	// v_nParameters is the <bus:parameters> node from asynchDetailParameterValues in the SOAP response.
//	// However, m_sParameterValues is used as the SOAP representation of the parameterValues parameter in SOAP requests
//	// e.g. run( object, parameterValues, options )
//	// We must therefore rename the root element from parameters to parameterValues
//	var v_sNewParams = v_sParameterValues.replace(/bus:parameters(\W)/g, "bus:parameterValues$1");
//	return v_sNewParams;
//};
//
//G_BusServer.F_SetSOAPParameterValues = function(v_nParameters)
//{
//	if (v_nParameters)
//	{
//		this.f_setParameterValues(this.f_responseParametersToParameterValues( v_nParameters ));
//	}
//};
//
//G_BusServer.f_parseParameterValues = function( v_sParameterValues )
//{
//	var d = U_XML.F_LoadValidXML( v_sParameterValues );
//	U_XML.F_SetSelectionNamespaces( d, 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' + C_BusRequest.k_sBIBusNamespaceDecl );
//	return d;
//};
//
///**
// * @type void
// * @param {String} v_sParameterValues XML to add to the parameters element
// * @returns True if the parameter values were updated, False otherwise
// * @type Boolean
// */
//G_BusServer.F_AddParameterValues = function( v_sParameterValues )
//{
//	var v_docNewParams = this.f_parseParameterValues( v_sParameterValues );
//	var v_docCurrentParams = this.f_parseParameterValues( this.m_sParameterValues );
//
//	if ( v_docNewParams && v_docCurrentParams )
//	{
//		var v_nRoot = v_docCurrentParams.documentElement;
//		var nl = v_docNewParams.documentElement.selectNodes( "item" );
//		var v_iLength = nl.length;
//		for ( var i = 0; i < v_iLength; i++ )
//		{
//			var v_nNewParameter = nl.item( i );
//			var v_sName = v_nNewParameter.selectSingleNode( "bus:name" ).text;
//			var v_nRemovedParamter = U_XML.F_RemoveNode( v_nRoot, "item[bus:name=" + U_String.F_ToXPathString( v_sName ) + "]" );
//			// Credential parameters must be merged
//			if ( v_nRemovedParamter && ( v_sName.indexOf( "credential:" ) == 0 ) )
//			{
//				var v_nRemovedCredential = U_XML.F_LoadString( null, v_nRemovedParamter.selectSingleNode( "bus:value/item/bus:use" ).text ).documentElement;
//				var v_docNewCredential = U_XML.F_LoadString( null, v_nNewParameter.selectSingleNode( "bus:value/item/bus:use" ).text );
//				var v_nNewCredential = v_docNewCredential.documentElement;
//				var v_nlRemovedCredential = v_nRemovedCredential.selectNodes( "*" );
//				for ( var j = 0; j < v_nlRemovedCredential.length; j++ )
//				{
//					var v_nOld = v_nlRemovedCredential.item( j );
//					if ( !v_nNewCredential.selectSingleNode( v_nOld.nodeName ) )
//					{
//						v_nNewCredential.appendChild( U_XML.F_ImportNode( v_docNewCredential, v_nOld ) );
//					}
//				}
//				var v_sNewCredential = U_Node.F_GetXml( v_nNewCredential );
//				v_nNewParameter.selectSingleNode( "bus:value/item/bus:use" ).text = v_sNewCredential;
//				v_nNewParameter.selectSingleNode( "bus:value/item/bus:display" ).text = v_sNewCredential;
//			}
//			v_nRoot.appendChild( v_nNewParameter );
//		}
//		return this.F_SetParameterValues( U_Node.F_GetXml( v_docCurrentParams ) );
//	}
//	return false;
//};
//
///**
// * @type void
// * @param {String} v_sParameterValues XML for the parameters element
// * @returns True if the parameter values were updated, False otherwise
// * @type Boolean
// */
//G_BusServer.F_SetInitialParameterValues = function( v_sParameterValues )
//{
//	this.m_sInitialParameterValues = v_sParameterValues;
//	return this.F_SetParameterValues( v_sParameterValues );
//};
//
///**
// * @type void
// */
//G_BusServer.F_RestoreToInitialParameterValues = function()
//{
//	if ( this.m_sInitialParameterValues )
//	{
//		this.F_SetParameterValues( this.m_sInitialParameterValues );
//	}
//	else
//	{
//		this.F_ClearParameterValues();
//	}
//};
//
///**
// * @type Boolean
// */
//G_BusServer.F_HasParameterValues = function()
//{
//	var v_nParams = this.F_GetParameterValuesNode();
//	return ( v_nParams.childNodes.length > 0 );
//};
//
///**
// * @type void
// */
//G_BusServer.F_ClearParameterValues = function(v_bFireChange)
//{
//	this.f_setNoParameterValues();
//
//	if (v_bFireChange !== false)
//	{
//		this.F_fireOnParametersChange();
//	}
//};
//
///**
// * @private
// */
//G_BusServer.F_fireOnParametersChange = function()
//{
//	U_Array.F_CallEach( this.m_aParametersListeners, "F_OnServerParametersChange" );
//};
//
///**
// * @private
// */
	rsPromptHandler.f_fireOnPromptingComplete = function(v_sClientContext)
	{
		if ( this.m_oPromptListeners[v_sClientContext] && this.m_oPromptListeners[v_sClientContext].F_OnServerPromptingComplete )
		{
			this.m_oPromptListeners[v_sClientContext].F_OnServerPromptingComplete();
		}
		delete this.m_oPromptListeners[v_sClientContext];
	};

//
//G_BusServer.F_GetAuthenticityToken = function()
//{
//	if ( !this.m_sAuthenticityToken )
//	{
//		try
//		{
//			this.m_sAuthenticityToken = ( new CAMAuthenticityTokenSession() ).generate();
//		}
//		catch ( e )
//		{
//			alert( "Exception thrown by CAMAuthenticityTokenSession" +
//			"\n\n Make sure you've included the camcrypto javascript files:" +
//			 "\n camcrypto/base64.js" +
//			"\n camcrypto/camcryptoutil.js" +
//			"\n camcrypto/sha1.js" +
//			"\n camcrypto/authtoken1.js"
//			 );
//		}
//	}
//	return this.m_sAuthenticityToken;
//};
//
//G_BusServer.F_GetCredentialParameters = function()
//{
//	var v_nParametersNode = G_BusServer.F_GetParameterValuesNode();
//	var v_nlParamItems = v_nParametersNode.selectNodes("item[starts-with(./bus:name,'credential:')]");
//	var v_aParams = [];
//
//	for (var i = 0; i < v_nlParamItems.length; ++i)
//	{
//		var v_nItem = v_nlParamItems.item(i);
//		var v_oParam = {
//			name : U_Node.F_GetText(v_nItem.selectSingleNode("bus:name")),
//			type :	U_Node.F_GetText(v_nItem.selectSingleNode("bus:value/item/@xsi:type")),
//			inclusive : v_nItem.selectSingleNode("bus:value/item/bus:inclusive[text()='true']") ? true : false,
//			values : [{
//				use : U_Node.F_GetText(v_nItem.selectSingleNode("bus:value/item/bus:use")),
//				display : U_Node.F_GetText(v_nItem.selectSingleNode("bus:value/item/bus:display"))
//			}]
//		};
//
//		v_aParams.push(v_oParam);
//	}
//
//	return v_aParams;
//};

		/**
		 * Launches the server dialog window for prompting. The application will be blocked until the window closes.
		 * @param {Object} v_oListener The C_RestRequest object which prompted
		 * @param {Object} v_oRequest The ajax request object to retrieve prompt page
		 * @param {Object} v_oGlassContext The Glass context instance
		 * @returns False if the prompting process could not be started.
		 * @type Boolean
		 */
		rsPromptHandler.F_DoRestPrompting = function(v_oListener, v_oRequest, v_oGlassContext)
		{
			var v_iPromptId = this.f_getPromptId();
			var v_oLaunchParameters = this.f_createRestPromptLaunchParameters( v_oRequest, this.f_prompting_OkCallback.bind(this, v_iPromptId) );

			var v_oContext = {
				urlMap: {
					perspective: "authoring",
					isViewer: true,
					UIProfile: "Titan",
					promptResponse: "url",
					ui_appbar: false,
					ui_navbar: false,
					// Uncomment following to enable debugging glass code in prompting window
					//debugBundles: true,
					launchParametersKey: rsLaunchParameters.Store(v_oLaunchParameters, true)
				}
			};

			var v_sUrl = v_oGlassContext.getUrl(v_oContext);
			return this.f_launchPrompt( v_oListener, v_sUrl, null, v_oLaunchParameters, v_iPromptId );
		};

	window.onunload = rsPromptHandler.f_OnUnLoad.bind(rsPromptHandler, window.onunload);

	return rsPromptHandler;
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
 	(C) Copyright IBM Corp. 2018, 2019
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/
define('bi/authoring/utils/C_rsRestRequest',['bi/authoring/utils/U_Object', 'bi/authoring/utils/rsPromptHandler'], function(U_Object, rsPromptHandler) {
"use strict";

/*


C_RestRequest.prototype.F_GetStatusText = function()
{
// Firefox and Ie can throw an exception when accessing this property
return this.m_oXHR ? U_JsUtils.F_GetPropertyInTryCatch( this.m_oXHR, "statusText" ) : null;
};


C_RestRequest.prototype.F_GetUrl = function()
{
return this.m_sUrl;
};


C_RestRequest.prototype.f_processTracking = function()
{
G_Debug.F_Print("C_RestRequest.f_processTracking");
var v_sTracking = this.m_oXHR.getResponseHeader('busTracking');
if (v_sTracking)
{
	this.F_PushRequestTrackingForReuse(v_sTracking);
}
};

C_RestRequest.prototype.F_PushRequestTrackingForReuse = function(v_sTracking)
{
};
*/
	function C_rsRestRequest( v_oGlassContext, v_oListener, v_oRequest )
	{
		this.m_oGlassContext = v_oGlassContext;
		this.m_oListener = v_oListener;
		this.m_oRequest = v_oRequest;

		this.m_oPromptCallbackResponse = null;

		this.M_iResponseDelay = 0;
	};

	function f_fireEvent( v_sEvent )
	{
		if (this.m_oListener && this.m_oListener[v_sEvent])
		{
			// fire events in a timeout because the glass ajax service will catch and discard any errors that occur, doing in a timeout avoids their catch
			setTimeout( this.m_oListener[v_sEvent].bind( this.m_oListener, this ), 0 );
		}
	};

	function f_isSuccessStatus()
	{
		var v_iStatus = this.F_GetStatus();
		return v_iStatus >= 200 && v_iStatus < 300;
	};

	function f_onRestResponseDontCare()
	{
		// Intentionally empty since there is nothing to be done.
	};

	var f_processAsyncResponse;

	function f_doResponseProcessing()
	{
		if (this.F_GetStatus() == 202)
		{
			f_processAsyncResponse.bind(this)();
		}
		else
		{
			if (this.m_bAborted)
			{
				return;
			}

			//this.f_processTracking(); NOT SUPPORTED
			this.F_ProcessResponse();
			f_fireEvent.bind(this)("F_Request_OnComplete"); //TODO use promise?
		}
	};

	function f_initiateResponseProcessing()
	{
		if (this.M_iResponseDelay)
		{
			setTimeout(f_doResponseProcessing.bind(this), this.M_iResponseDelay);
			return;
		}

		f_doResponseProcessing.bind(this)();
	};

	function f_onRestResponseOK(v_oResponseData, v_sStatus, v_oXHR )
	{
		this.m_oResponseData = v_oResponseData;
		this.m_oXHR = v_oXHR;
		f_initiateResponseProcessing.bind(this)();
	};

	function f_onRestResponseFailed(v_sStatus, v_oXHR, v_sErrorThrown)
	{
		this.m_oXHR = v_oXHR;
		this.m_oFailed = { status: v_sStatus, error: v_sErrorThrown, response: this.F_GetResponseText() };

		this.F_OnFailed();

		f_initiateResponseProcessing.bind(this)();
	};

	function f_processAsyncResponse()
	{
		// Determine if prompting
		var v_bPrompting = this.m_oResponseData && this.m_oResponseData.status == 'prompting';
		var v_sLocation = this.m_oXHR.getResponseHeader('Location');

		var v_sAffinity = this.m_oXHR.getResponseHeader('X-CA-Affinity');
		var v_oRequestHeaders = {};
		if (v_sAffinity)
		{
			// This ensures request is routed to the right report_service instance.
			v_oRequestHeaders['X-CA-Affinity'] = v_sAffinity;
		}
		var v_oRequest =
		{
			url: v_sLocation,
			headers: v_oRequestHeaders
		};

		if (this.m_bAborted)
		{
			v_oRequest.type = 'DELETE';
			Application.GlassContext.services.ajax.ajax(v_oRequest)
				.then(f_onRestResponseDontCare.bind(this))
				.catch(f_onRestResponseDontCare.bind(this));
		}
		else
		{
			v_oRequest.type = 'GET';
			if (v_bPrompting)
			{
				// By default, jquery will convert the response based on the content-type.  In this case that means
				// parsing the SOAP response into a document (content-type: text/xml).  However, the resulting document
				// is not compatible with the documents used by RS. Therefore, we tell jquery to leave
				// the XML response as plain text and we will handle the parsing ourselves.
				v_oRequest.dataType = "text";
				if (!rsPromptHandler.F_DoRestPrompting(this, v_oRequest, this.m_oGlassContext))
				{
					this.m_oFailed = { status: 'popup blocked' }; //F_SetNewErrorRes( "IDS_CCHL_REQUEST_CANCELLED_PROMPTING" );
					this.F_ProcessResponse();
					f_fireEvent.bind(this)("F_Request_OnComplete");
				}
			}
			else
			{
				this.m_oGlassContext.services.ajax.ajax(v_oRequest)
					.then(f_onRestResponseOK.bind(this))
					.catch(f_onRestResponseFailed.bind(this));
			}
		}
	};

	function f_getPropertyInTryCatch( o, p )
	{
		try
		{
			return o[p];
		}
		catch ( e )
		{
			return null;
		}
	};

	/////////////////////////////

	C_rsRestRequest.prototype.F_GetListener = function()
	{
		//TODO use promise?
		return this.m_oListener;
	};

	C_rsRestRequest.prototype.F_SetListener = function(v_oListener)
	{
		//TODO use promise?
		this.m_oListener = v_oListener;
	};

	C_rsRestRequest.prototype.F_SetHeaders = function( v_oRequestHeaders )
	{
		// Override as required
		return v_oRequestHeaders;
	};

	C_rsRestRequest.prototype.F_Send = function()
	{
		this.m_oRequest.headers = this.F_SetHeaders( this.m_oRequest.headers );

		this.m_oGlassContext.services.ajax.ajax(this.m_oRequest)
			.then(f_onRestResponseOK.bind(this))
			.catch(f_onRestResponseFailed.bind(this));
	};

	C_rsRestRequest.prototype.F_Abort = function()
	{
		// glass ajax requests are not cancellable, so the best we can do is to stop listening
		this.m_bAborted = true;
		f_fireEvent.bind(this)("F_Request_OnAborted"); //TODO use promise?
		this.F_SetListener(null);
	};

	C_rsRestRequest.prototype.F_GetStatus = function()
	{
		// Firefox and IE can throw an exception when accessing this property
		return this.m_oXHR ? f_getPropertyInTryCatch( this.m_oXHR, "status" ) : null;
	};

	C_rsRestRequest.prototype.F_ProcessResponse = function()
	{
		// Intentionally empty since there is nothing to be done.
		// Classes extending this class are expected to override this method.
	};

	C_rsRestRequest.prototype.F_GetResponseData = function()
	{
		return this.m_oResponseData;
	};

	C_rsRestRequest.prototype.F_GetResponseText = function()
	{
		return this.m_oXHR ? this.m_oXHR.responseText : null;
	};

	C_rsRestRequest.prototype.F_OnFailed = function()
	{
		// Override as required
	};

	C_rsRestRequest.prototype.F_GetFailed = function()
	{
		return this.m_oFailed;
	};

	C_rsRestRequest.prototype.F_SetPromptCallbackResponse = function( v_oResponse, v_oAttachments )
	{
		// v_oResponse is an object created by a child window but this code is running
		// in the context of the parent window.  We need to clone v_oResponse because
		// when the child goes out of scope, v_oResponse may disappear (in IE 11 it does).
		this.m_oPromptCallbackResponse = v_oResponse ? U_Object.F_Clone(v_oResponse) : null;
	};

	C_rsRestRequest.prototype.F_OnServerPromptingComplete = function()
	{
		if (this.m_oPromptCallbackResponse)
		{
			this.m_oResponseData = this.m_oPromptCallbackResponse;
			this.m_oPromptCallbackResponse = null;
			this.m_oFailed = null; //this.F_SetError(null);
			this.F_ProcessResponse();
		}
		else
		{
			this.m_oFailed = { status: 'cancelled' }; //F_SetNewErrorRes( "IDS_CCHL_REQUEST_CANCELLED_PROMPTING" );
		}

		f_fireEvent.bind(this)("F_Request_OnComplete");
	};

	return C_rsRestRequest;
});

/**
 * Licensed Materials - Property of IBM
 * IBM Cognos Products: rs
 * (C) Copyright IBM Corp. 2018
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *
 */
define('bi/authoring/plugins/rsDrillInfoService',['baglass/core-client/js/core-client/ui/core/Class',
        'bi/authoring/utils/C_rsRestRequest'],
        function(Class, C_rsRestRequest) {
	'use strict';

	var rsDrillInfoService = Class.extend({

		init: function(attributes)
		{
			this._glassContext = attributes.glassContext; // eslint-disable-line no-underscore-dangle
			rsDrillInfoService.inherited('init', this, arguments); // eslint-disable-line prefer-rest-params
		},

		getParameters: function( storeId )
		{
			return new Promise( ( v_fnResolve, v_fnReject ) =>
			{
				const v_oRequest = {
					url: 'v1/reports/' + storeId + '/parameters?&layoutParameters=true',
					type: 'GET',
					dataType: 'json'
				};

				const v_oListener = {
					F_Request_OnComplete: function( v_oRequest ) {
						const fail = v_oRequest.F_GetFailed();
						if (fail)
						{
							v_fnReject(fail);
						}
						else
						{
							v_fnResolve(v_oRequest.F_GetResponseData());
						}
					}
				};

				const v_oRestRequest = new C_rsRestRequest( this._glassContext, v_oListener, v_oRequest ); // eslint-disable-line no-underscore-dangle
				v_oRestRequest.F_Send();
			});
		}

	});

	return rsDrillInfoService;
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
	(C) Copyright IBM Corp. 2018, 2020
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/
define('bi/authoring/utils/V5ToDashboard',['bi/authoring/nls/StringResource'], function(StringResource)
{
	var V5ToDashboard = {};

	V5ToDashboard.K_iNODE_ELEMENT = 1;

	var v_bRunInProduction = false;	// Intern is using querySelector and Launch in Explore is using Xpath (selectSingleNode)

	V5ToDashboard.LaunchInExploration = function(v_nReport, v_oAuthoringApp, v_aSelectionIids, v_sReportSpec, v_sExploreStoreID, v_oGlassContext)
	{
		var v_oDBSpec;
		v_bRunInProduction = true;
		var v_sStoreID = v_oAuthoringApp.SharedState.Get("storeID");
		var v_sExistingExploreSpec = null;

		return this.f_getExploreSpec(v_sExploreStoreID, v_oGlassContext)
		.then(function(v_oExploreData)
		{
			if (v_oExploreData && v_oExploreData.data[0] && v_oExploreData.data[0].specification)
			{
				v_sExistingExploreSpec = v_oExploreData.data[0].specification;
			}
			return this.ConvertV5toDBFrag(v_nReport, v_sStoreID, v_aSelectionIids, v_sReportSpec, v_oGlassContext);
		}.bind(this))
		.then(function(v_oDBFragSpec)
		{
			v_oDBSpec = v_oDBFragSpec;
			return v_oGlassContext.getSvc('.ConversionService');
		})
		.then(function(conversionSvc)
		{
			return conversionSvc.convert('DASHBOARD', 'EXPLORE', JSON.stringify(v_oDBSpec));
		})
		.then(function(v_sExploreSpec)
		{
			console.log("RS->DB->EX spec: " + v_sExploreSpec);
			var v_oEXSpec = JSON.parse(v_sExploreSpec);

			if (v_sExistingExploreSpec)
			{
				v_oEXSpec = this.f_mergeNewExplorationIntoExisting(v_oEXSpec, JSON.parse(v_sExistingExploreSpec));
				console.log("Merged exploration spec: " + JSON.stringify(v_oEXSpec));
			}
			var perspectiveOptions =
			{
				content: {
					// addOnSpec: v_oEXSpec,
					boardSpec: v_oEXSpec,
					// boardSpec: {
					// 	layout: {
					// 		items: [],
					// 		type: 'exploreContainer'
					// 	},
					// 	name: 'New Exploration',
					// 	version: 1008,
					// 	widgets: {},
					// 	_meta: {
					// 		bundleID: null
					// 	}
					// },
					isAuthoringMode: true,
					openAppViewCallback: function() {}
				},
				id: "Explore_" + Date.now()
			};

			return v_oGlassContext.openAppView("explore", perspectiveOptions);
		}.bind(this))
		.then(function(view)
		{
			if (view)
			{
				if (v_nReport.selectSingleNode("./layouts//dataSource/reportExpression"))
				{
					v_oGlassContext.showToast(v_oAuthoringApp.GetString("IDS_MSG_UNSUPPORTED_LAYOUT_CALC_IN_EXPLORE"), { 'type': 'warning' });
				}
				return view.currentContentView.openDatasetpane(false);
			}
		});
	};

	V5ToDashboard.f_getExploreSpec = function(v_sExploreStoreID, v_oGlassContext)
	{
		if (!v_sExploreStoreID)
		{
			return Promise.resolve(null);
		}
		return v_oGlassContext.services.ajax.ajax(
		{
			url: "v1/objects/" + v_sExploreStoreID + "?fields=specification",
			type: 'GET'
		});
	};

	V5ToDashboard.f_mergeNewExplorationIntoExisting = function(v_oNewExploreSpec, v_oExistingExploreSpec)
	{
		// add the new widgets to existing ones
		var v_aNewWidgetsKeys = Object.keys(v_oNewExploreSpec.widgets);
		for (var i = 0; i < v_aNewWidgetsKeys.length; i++)
		{
			v_oExistingExploreSpec.widgets[v_aNewWidgetsKeys[i]] = (v_oNewExploreSpec.widgets[v_aNewWidgetsKeys[i]]);
		}
		// add the new data sources to existing ones
		for (i = 0; i < v_oNewExploreSpec.dataSources.sources.length; i++)
		{
			v_oExistingExploreSpec.dataSources.sources.push(v_oNewExploreSpec.dataSources.sources[i]);
		}
		// add the new layout item(s) to existing ones
		for (i = 0; i < v_oNewExploreSpec.layout.items.length; i++)
		{
			v_oExistingExploreSpec.layout.items.push(v_oNewExploreSpec.layout.items[i]);
		}
		return v_oExistingExploreSpec;
	};

	V5ToDashboard.ConvertV5toDBFrag = function(v_nReport, v_sStoreID, v_aSelectionIids, v_sReportSpec, v_oGlassContext)
	{
		// pass to Moser's normalizedspec either the report full spec or the report storeID and stubbed spec
		var v_oData = {};
		if (v_nReport.getAttribute("stubbed") == "true")
		{
			v_oData.objectPath = 'storeID("' + v_sStoreID + '")';
		}

		v_oData.specification = v_sReportSpec;

		return v_oGlassContext.services.ajax.post("v1/metadata/reports/normalizedspec", {
			contentType: "application/json",
			processData: false,
			dataType: "json",
			data: JSON.stringify(v_oData)
		})
			.then(function(v_oReportModelInfo)
			{
				return this.f_doConvert(v_nReport, v_aSelectionIids, v_oReportModelInfo.id);
			}.bind(this));
	};

	V5ToDashboard.f_doConvert = function(v_nReport, v_aSelectionIids, v_sReportTempStoreId)
	{
		console.log(v_nReport.outerHTML);
		console.log("Report selection: " + JSON.stringify(v_aSelectionIids));
		console.log("Report temp store ID: " + v_sReportTempStoreId);

		var v_oDBSpec = {};

		this.f_setName(v_oDBSpec);
		this.f_setVersion(v_oDBSpec);
		this.f_setLayout(v_oDBSpec);
		this.f_setPalette(v_oDBSpec);
		this.f_setDBDataSource(v_oDBSpec, v_sReportTempStoreId);

		var v_aValidSelectionIids = this.f_validateReportSelections(v_nReport, v_aSelectionIids);
		this.f_convertV5SelectionToDB(v_oDBSpec, v_nReport, v_aValidSelectionIids, v_sReportTempStoreId);

		console.log("RS->DB spec: " + JSON.stringify(v_oDBSpec));

		return v_oDBSpec;
	};

	V5ToDashboard.f_validateReportSelections = function(v_nReport, v_aSelectionIids)
	{
		var v_aValidSelectionIids = v_aSelectionIids;

		// Replace page body selection with its data containers
		if (v_aSelectionIids.length === 1)
		{
			var v_nSingleNodeSelection = v_bRunInProduction ? v_nReport.selectSingleNode(".//*[@iid='" + v_aSelectionIids[0] + "']") : v_nReport.querySelector("[iid=" + v_aSelectionIids[0] + "]");
			if (v_nSingleNodeSelection.nodeName === "pageBody" || v_nSingleNodeSelection.nodeName === "table")
			{
				v_aValidSelectionIids = [];
				var nlContents = v_bRunInProduction ? v_nSingleNodeSelection.selectNodes(".//contents") : v_nSingleNodeSelection.querySelectorAll("contents");
				for (var i = 0; i < nlContents.length; i++)
				{
					var v_nlChildNodes = nlContents.item(i).childNodes;
					for (var j = 0; j < v_nlChildNodes.length; j++)
					{
						var v_nChildNode = v_nlChildNodes.item(j);
						if (v_nChildNode.nodeType != V5ToDashboard.K_iNODE_ELEMENT || !this.f_isSupportedLayoutSelection(v_nChildNode.nodeName))
						{
							continue;
						}
						v_aValidSelectionIids.push(v_nChildNode.getAttribute("iid"));
					}
				}
			}
		}

		return v_aValidSelectionIids;
	};

	V5ToDashboard.f_isSupportedLayoutSelection = function(v_sName)
	{
		switch (v_sName)
		{
			case "list":
			case "crosstab":
			case "viz":
			case "vizControl":
			case "mapChart":
				return true;
		}
		return false;
	};

	V5ToDashboard.f_setName = function(v_oDBSpec)
	{
		v_oDBSpec.name = StringResource.get('new_exploration'); // This doesn't work with Intern
		// v_oDBSpec.name = 'New exploration';	// For Intern tests
	};

	V5ToDashboard.f_setVersion = function(v_oDBSpec)
	{
		v_oDBSpec.version = 1402;
	};

	V5ToDashboard.f_setPalette = function(v_oDBSpec)
	{
		// TODO: how do you get the palette?
		//		v_oDBSpec.fredIsRed = {};
		//		v_oDBSpec.fredIsRed.id = "model0000016176037fb1_00000001";
		//		v_oDBSpec.fredIsRed.colorMap = "";
		//		v_oDBSpec.fredIsRed.saveId = 1;
	};

	V5ToDashboard.f_setLayout = function(v_oDBSpec)
	{
		v_oDBSpec.layout = [];
	};

	V5ToDashboard.f_setDBDataSource = function(v_oDBSpec, v_sReportTempStoreId)
	{
		v_oDBSpec.dataSources = {};
		v_oDBSpec.dataSources.version = "1.0";
		v_oDBSpec.dataSources.sources = [];

		v_oDBSpec.dataSources.sources.push({
			id: v_sReportTempStoreId,
			assetId: v_sReportTempStoreId,
			type: "report",
			name: "",
			shaping: {
				embeddedModuleUpToDate: true
			}
		});
	};

	V5ToDashboard.f_convertV5SelectionToDB = function(v_oDBSpec, v_nReport, v_aSelectionIids, v_sReportTempStoreId)
	{
		// The V5 objects converted to DB widgets will be placed in a vertical column, one below the other,
		// and the offest is given by v_iHeightOffset
		var v_iHeightOffset = 0;

		v_oDBSpec.widgets = [];
		for (var i = 0; i < v_aSelectionIids.length; i++)
		{
			// a single selection may have multiple queries (to be converted to multiple data views) - e.g. Vida map with 3 layers has 3 queries
			var v_aQueries = [], v_aDataViews = [];
			var v_nSelection = v_bRunInProduction ? v_nReport.selectSingleNode(".//*[@iid='" + v_aSelectionIids[i] + "']") : v_nReport.querySelector("[iid=" + v_aSelectionIids[i] + "]");
			if (!v_nSelection)
			{
				continue;
			}
			v_aQueries = this.f_getQueriesForSelection(v_nReport, v_nSelection);
			for (var j = 0; j < v_aQueries.length; j++)
			{
				var v_oDataView = this.f_createEmptyWidgetDataViewForV5Query(v_sReportTempStoreId, j);
				if (!v_oDataView)
				{
					continue;
				}
				v_aDataViews.push(v_oDataView);
			}
			var v_iIndex = i + 1;
			var v_sWidgetId = "widget" + v_iIndex;
			if (v_bRunInProduction)
			{
				// add timestamp for unique widget id in case we launch in existing exploration
				v_sWidgetId += '-' + Date.now();
			}
			var v_oWidget = this.f_createWidget(v_sWidgetId);

			switch (v_nSelection.nodeName)
			{
				case "list":
					this.f_setListWidget(v_oWidget, v_nSelection, v_aQueries[0], v_aDataViews[0]);
					break;
				case "crosstab":
					this.f_setCrosstabWidget(v_oWidget, v_nSelection, v_aQueries[0], v_aDataViews[0]);
					break;
				case "vizControl":
					var v_nlReportDataStore	= v_bRunInProduction ? v_nReport.selectNodes(".//reportDataStore") : v_nReport.querySelectorAll("reportDataStore");
					this.f_setVizControlWidget(v_oWidget, v_nSelection, v_aQueries, v_aDataViews, v_nlReportDataStore);
					break;
				default:
					// ignore selection
					continue;
			}
			v_oDBSpec.widgets.push(v_oWidget);

			var v_oWidthHeight = this.f_getV5ObjectWidthHeight(v_nSelection);
			this.f_addWidgetToLayout(v_oDBSpec, v_sWidgetId, v_oWidthHeight, v_iHeightOffset);
			v_iHeightOffset += parseInt(v_oWidthHeight.height);
		}
	};

	V5ToDashboard.f_getV5ObjectWidthHeight = function(v_nSelection)
	{
		var v_nCSS, v_sWidth, v_sHeight, i;
		var v_nlSelectionChildren = v_nSelection.childNodes;
		for (i = 0; i < v_nlSelectionChildren.length; i++)
		{
			var v_nSelectionChild = v_nlSelectionChildren.item(i);
			if (v_nSelectionChild.nodeName == 'style')
			{
				v_nCSS = v_bRunInProduction ? v_nSelectionChild.selectSingleNode(".//CSS") : v_nSelectionChild.querySelector('CSS');
				break;
			}
		}
		if (v_nCSS)
		{
			var v_aCSSValueAttr = v_nCSS.getAttribute('value').split(';');
			for (i = 0; i < v_aCSSValueAttr.length; i++)
			{
				var v_sAttr = v_aCSSValueAttr[i];
				if (v_sAttr.indexOf('width:', 0) != -1)
				{
					v_sWidth = v_sAttr.substring(v_sAttr.indexOf(':') + 1);
				}
				else if (v_sAttr.indexOf('height:', 0) != -1)
				{
					v_sHeight = v_sAttr.substring(v_sAttr.indexOf(':') + 1);
				}
			}
		}
		v_sWidth = (v_sWidth ? v_sWidth : "500px");
		v_sHeight = (v_sHeight ? v_sHeight : "500px");
		return { width: v_sWidth, height: v_sHeight };
	};

	V5ToDashboard.f_addWidgetToLayout = function(v_oDBSpec, v_sWidgetId, v_oWidthHeight, v_iHeightOffset)
	{
		v_oDBSpec.layout.push({
			id: v_sWidgetId,
			style: {
				left: '0px',
				top: v_iHeightOffset + 'px',
				height: v_oWidthHeight.height,
				width: v_oWidthHeight.width
			},
			type: "widget"
		});
	};

	V5ToDashboard.f_createWidget = function(v_sWidgetId)
	{
		return {
			type: "live",
			id: v_sWidgetId,
			visId: "",
			name: v_sWidgetId,
			data: {
				dataViews: []
			},
			visTypeLocked: true,
			slotmapping: {
				slots: []
			},
			localFilters: [],
			properties: []
		};
	};

	V5ToDashboard.f_createEmptyWidgetDataViewForV5Query = function(v_sReportTempStoreId, v_iQueryIndex)
	{
		var v_oDataView = {};
		v_oDataView.modelRef = v_sReportTempStoreId;
		v_oDataView.modelType = "report";
		v_oDataView.searchPath = "";
		v_oDataView.dataItems = [];
		v_oDataView.id = "dataView" + (v_iQueryIndex + 1);
		return v_oDataView;
	};

	V5ToDashboard.f_isDataItemUsedInSelection = function(v_nDataItem, v_nSelection, v_sRefName)
	{
		if (v_nDataItem.nodeName == '#text')
		{
			return false;
		}
		return !!(v_bRunInProduction ? v_nSelection.selectSingleNode(".//*[@" + v_sRefName + "='" + v_nDataItem.getAttribute("name") + "']") :
						v_nSelection.querySelector("[" + v_sRefName + "='" + v_nDataItem.getAttribute("name") + "']"));
	};

	V5ToDashboard.f_getRefDataItemExpression = function(v_nDataItem)
	{
		switch (v_nDataItem.nodeName)
		{
			case 'dataItemMeasure':
				var v_nMUN = v_bRunInProduction ? v_nDataItem.selectSingleNode(".//MUN") : v_nDataItem.querySelector("MUN");
				return (v_nMUN ? v_nMUN.childNodes[0].nodeValue : null);

			case 'dataItemLevelSet':
			case 'dataItemMemberSet':
				var v_nLUN = v_bRunInProduction ? v_nDataItem.selectSingleNode(".//LUN") : v_nDataItem.querySelector("LUN");
				return (v_nLUN ? v_nLUN.childNodes[0].nodeValue : null);

			case 'dataItem':
				var v_nExpression = v_bRunInProduction ? v_nDataItem.selectSingleNode(".//expression") : v_nDataItem.querySelector("expression");
				return (v_nExpression ? v_nExpression.childNodes[0].nodeValue : null);

			default:
				return null;
		}
	};

	V5ToDashboard.f_getQueriesForSelection = function(v_nReport, v_nSelection)
	{
		var v_sRefQueryName, v_aRefQueryNames = [], v_aQueries = [];

		switch (v_nSelection.nodeName)
		{
			case "list":
			case "crosstab":
				v_sRefQueryName = v_nSelection.getAttribute("refQuery");
				v_aRefQueryNames.push(v_sRefQueryName);
				break;

			case "viz":
				v_sRefQueryName = v_bRunInProduction ? v_nSelection.selectSingleNode(".//vizDataSet").getAttribute("refQuery") :
					v_nSelection.querySelector("vizDataSet").getAttribute("refQuery");
				v_aRefQueryNames.push(v_sRefQueryName);
				break;

			case "vizControl":
				var v_nlRefDataStore = v_bRunInProduction ? v_nSelection.selectNodes(".//vcDataSet") : v_nSelection.querySelectorAll("vcDataSet");
				for (var i = 0; i < v_nlRefDataStore.length; i++)
				{
					var v_sRefDataStore = v_nlRefDataStore.item(i).getAttribute("refDataStore");
					if (!v_sRefDataStore)
					{
						// empty layer
						continue;
					}
					var v_nReportDataStore = v_bRunInProduction ? v_nReport.selectSingleNode(".//reportDataStore[@name='" + v_sRefDataStore + "']") :
						v_nReport.querySelector("reportDataStore[name='" + v_sRefDataStore + "']");
					v_sRefQueryName = v_bRunInProduction ? v_nReportDataStore.selectSingleNode(".//dsV5ListQuery").getAttribute("refQuery") :
						v_nReportDataStore.querySelector("dsV5ListQuery").getAttribute("refQuery");
					v_aRefQueryNames.push(v_sRefQueryName);
				}
				break;

			case "mapChart":
				// TODO: Rave 2 map, not Vida
				break;
		}
		for (var j = 0; j < v_aRefQueryNames.length; j++)
		{
			var v_nQuery = v_bRunInProduction ? v_nReport.selectSingleNode("./queries/query[@name='" + v_aRefQueryNames[j] + "']") :
				v_nReport.querySelector("queries > query[name='" + v_aRefQueryNames[j] + "']");
			v_aQueries.push(v_nQuery);
		}
		return v_aQueries;
	};

	V5ToDashboard.f_convertV5DataItemSortToDB = function(v_nSelection, v_nDataItem, v_sDataItemName, v_sDataItemIndex)
	{
		// For old dataItem as used in non-dimensional the sort is specified in the layout: sortList/sortItem[@sortOrder="descending"]
		// For new/specialized data items as used in dimensional the sort is specified in the query data item: /setSorting[@ascending="false"]
		// First try to get the sort from layout and if not found try to get the sort from data item
		var v_aSelection = [];
		var v_nLayoutSortItem;
		var v_bIsDescending = null;
		switch (v_nSelection.nodeName)
		{
			case "list":
				v_nLayoutSortItem = v_bRunInProduction ? v_nSelection.selectSingleNode(".//sortList/sortItem[@refDataItem='" + v_sDataItemName + "']") :
										v_nSelection.querySelector("sortList > sortItem[refDataItem='" + v_sDataItemName + "']");
				break;

			case "crosstab":
			case "viz":
			case "vizControl":
			case "mapChart":
				v_nLayoutSortItem = v_bRunInProduction ? v_nSelection.selectSingleNode(".//*[@refDataItem='" + v_sDataItemName + "']//sortList/sortItem") :
										v_nSelection.querySelector("* > [refDataItem='" + v_sDataItemName + "'] > sortList > sortItem");
				break;
		}
		if (v_nLayoutSortItem)
		{
			v_bIsDescending = (v_nLayoutSortItem.getAttribute("sortOrder") == "descending");
		}
		else
		{
			// try to get the sort from query
			var v_nSetSorting = v_bRunInProduction ? v_nDataItem.selectSingleNode(".//setSorting") : v_nDataItem.querySelector("setSorting");
			if (v_nSetSorting)
			{
				v_bIsDescending = (v_nSetSorting.getAttribute("ascending") == "false");
			}
		}
		if (v_bIsDescending != null)
		{
			v_aSelection.push({
				"operation": "order",
				"sort": {
					"type": v_bIsDescending ? "desc" : "asc",
					"priority": v_sDataItemIndex,
					"by": "caption"
				}
			});
		}
		return v_aSelection;
	};

	V5ToDashboard.f_getXMLAttribute = function(v_nParent, v_sName)
	{
		if (!v_nParent || !v_sName)
		{
			return null;
		}
		var v_nXMLAttribute = v_bRunInProduction ? v_nParent.selectSingleNode(".//XMLAttributes/XMLAttribute[@name='" + v_sName + "']") :
									v_nParent.querySelector("XMLAttributes > XMLAttribute[name='" + v_sName + "']");
		var v_sXMLAttributeValue = v_nXMLAttribute ? v_nXMLAttribute.getAttribute("value") : null;
		return v_sXMLAttributeValue;
	};

	// From the usage attribute in metadata responses.
	V5ToDashboard.K_iDataUsage_Fact = 2;
	V5ToDashboard.K_sDataUsage_Fact = "fact";

	V5ToDashboard.f_getDataUsage = function(v_nDataItem)
	{
		return this.f_getXMLAttribute(v_nDataItem, "RS_dataUsage") || this.K_sDataUsage_Unknown;
	};

	V5ToDashboard.F_IsLikelyMeasure = function(v_nDataItem)
	{
		switch (v_nDataItem.nodeName)
		{
			case "dataItem":
				return (this.f_getDataUsage(v_nDataItem) == this.K_iDataUsage_Fact || this.f_getDataUsage(v_nDataItem) == this.K_sDataUsage_Fact);

			case "dataItemMeasure":
			case "dataItemCalculatedMeasure":
			case "dataItemMeasurePercentage":
				return true;
		}
		return false;
	};

	V5ToDashboard.F_IsLikelyCalculation = function(v_nDataItem)
	{
		switch (v_nDataItem.nodeName)
		{
			case "dataItemCalculatedMember":
			case "dataItemCalculatedMeasure":
			case "dataItemMeasurePercentage":
				return true;
		}
		return false;
	};

	V5ToDashboard.f_convertV5FormatToDB = function(v_nSelection, v_nDataItem, v_sDataItemName)
	{
		var v_oFormat = {};

		// DB only has measure format
		if (this.F_IsLikelyMeasure(v_nDataItem))
		{
			var v_nDataFormat;
			switch (v_nSelection.nodeName)
			{
				case "list":
					var v_nListColumnBody = this.f_getAncestorNode(
						v_bRunInProduction ? v_nSelection.selectSingleNode(".//listColumnBody//*[@refDataItem='" + v_sDataItemName + "']") :
								v_nSelection.querySelector("listColumnBody * [refDataItem='" + v_sDataItemName + "']"),
						"listColumnBody");
					v_nDataFormat = v_bRunInProduction ? v_nListColumnBody.selectSingleNode(".//style//dataFormat") : v_nListColumnBody.querySelector("style > dataFormat");
					break;

				case "crosstab":
					v_nDataFormat = v_bRunInProduction ? v_nSelection.selectSingleNode(".//crosstabFactCell//style//dataFormat") :
								 v_nSelection.querySelector("crosstabFactCell > style > dataFormat");
					break;

				case "viz":
					// TODO
					break;

				case "vizControl":
					// TODO
					break;

				case "mapChart":
					// TODO
					break;
			}

			if (v_nDataFormat && v_nDataFormat.firstElementChild)
			{
				v_oFormat.formatSpec = {};
				this.f_convertV5DataFormatToDB(v_nDataFormat.firstElementChild, v_oFormat.formatSpec);
			}
		}
		return v_oFormat;
	};

	V5ToDashboard.f_getAncestorNode = function(v_nCurrentNode, v_sAncestorName)
	{
		// recursion exit conditions
		if (!v_nCurrentNode || !v_nCurrentNode.parentNode)
		{
			return null;
		}
		if (v_nCurrentNode.parentNode.nodeName == v_sAncestorName)
		{
			return v_nCurrentNode.parentNode;
		}
		return this.f_getAncestorNode(v_nCurrentNode.parentNode, v_sAncestorName);
	};

	V5ToDashboard.f_getDataItems = function(v_nQuery)
	{
		return v_bRunInProduction ? v_nQuery.selectNodes(".//selection/*") : v_nQuery.querySelector("selection").childNodes;
	};

	V5ToDashboard.f_getDataItem = function(v_nQuery, v_sDataItemName)
	{
		return v_bRunInProduction ? v_nQuery.selectSingleNode(".//*[@name='" + v_sDataItemName + "']") : v_nQuery.querySelector("* [name='" + v_sDataItemName + "']");
	};

	V5ToDashboard.f_escapeEndBracket = function(v_sName)
	{
		return v_sName.replace(/\]/g, ']]');
	};

	V5ToDashboard.f_addV5DataItemToDBDataView = function(v_nSelection, v_sQueryName, v_nDataItem, v_sRefName, v_oDataView, v_iIndex)
	{
		if (!this.f_isDataItemUsedInSelection(v_nDataItem, v_nSelection, v_sRefName))
		{
			return false;
		}

		var v_sDataItemName = v_nDataItem.getAttribute("name");
		var v_aSelection = this.f_convertV5DataItemSortToDB(v_nSelection, v_nDataItem, v_sDataItemName, v_iIndex);
		var v_oFormat = this.f_convertV5FormatToDB(v_nSelection, v_nDataItem, v_sDataItemName);
		var v_sV5DataItemAggregate = v_nDataItem.getAttribute("aggregate");
		var v_sDBDataItemAggregate = v_sV5DataItemAggregate ? this.f_convertAggregateOpToDB(v_sV5DataItemAggregate) : "";
		var v_sDataItemNameFull = '[' + this.f_escapeEndBracket(v_sQueryName) + '].[' + this.f_escapeEndBracket(v_sDataItemName) + ']';
		var v_oDataItem = {
			id: v_sDataItemNameFull,
			itemId: v_sDataItemNameFull,
			itemLabel: v_sDataItemName
		};
		if (v_aSelection && v_aSelection.length > 0)
		{
			v_oDataItem.selection = v_aSelection;
		}
		if (v_oFormat && v_oFormat.formatSpec)
		{
			v_oDataItem.format = v_oFormat;
		}
		if (v_sDBDataItemAggregate)
		{
			v_oDataItem.aggregate = v_sDBDataItemAggregate;
		}
		v_oDataView.dataItems.push(v_oDataItem);
		return true;
	};

	V5ToDashboard.f_setListWidget = function(v_oWidget, v_nSelection, v_nQuery, v_oDataView)
	{
		var v_oSlot = {};
		v_oSlot.name = "grid_cols";
		v_oSlot.dataItems = [];
		var v_sQueryName = v_nQuery.getAttribute("name");
		// v_oSlot.dataItemSettings = [];
		// v_oSlot.caption = "Columns";
		// v_oSlot.id = "grid_cols";

		var v_nlDataItemValue = v_bRunInProduction ? v_nSelection.selectNodes(".//listColumnBody//*[@refDataItem]") : v_nSelection.querySelectorAll("* listColumnBody * [refDataItem]");
		for (var i = 0; i < v_nlDataItemValue.length; i++)
		{
			if (v_nlDataItemValue.item(i).nodeName != 'dataItemValue')
			{
				continue;
			}
			var v_sRefDataItem = v_nlDataItemValue.item(i).getAttribute("refDataItem");
			var v_nDataItem = this.f_getDataItem(v_nQuery, v_sRefDataItem);
			if (!this.f_addV5DataItemToDBDataView(v_nSelection, v_sQueryName, v_nDataItem, "refDataItem", v_oDataView, i))
			{
				continue;
			}
			v_oSlot.dataItems.push(v_sRefDataItem);
		}

		v_oWidget.data.dataViews.push(v_oDataView);
		v_oWidget.slotmapping.slots.push(v_oSlot);
		v_oWidget.visId = "JQGrid";
	};

	V5ToDashboard.f_convertV5DataFormatToDB = function(v_nV5Format, v_oDBFormat)
	{
		switch (v_nV5Format.nodeName)
		{
			case "currencyFormat":
				v_oDBFormat.type = "currency";
				var v_sCurrencyCode = v_nV5Format.getAttribute("currencyCode");
				if (v_sCurrencyCode)
				{
					v_oDBFormat.currencyCode = v_sCurrencyCode;
					v_oDBFormat.currencyDisplay = "symbol";
				}
				break;

			case "numberFormat":
				v_oDBFormat.type = "number";
				break;

			case "percentFormat":
				v_oDBFormat.type = "percent";
				break;
		}
		var v_sDecimalSize = v_nV5Format.getAttribute("decimalSize");
		if (v_sDecimalSize)
		{
			v_oDBFormat.maximumFractionDigits = v_oDBFormat.minimumFractionDigits = parseInt(v_sDecimalSize);
		}
	};

	// Note. We may have a combined filter that uses few data items, thus this method doesn't take a data item as input
	V5ToDashboard.f_addV5VidaFiltersToDBWidgetLocalFilters = function(v_nQuery, v_nSelection, v_aLocalFilters, v_nlReportDataStore)
	{
		for (var i = 0; i < v_nlReportDataStore.length; i++)
		{
			var v_nReportDataStore = v_nlReportDataStore.item(i);
			var v_nDsFilters = v_bRunInProduction ? v_nReportDataStore.selectNodes(".//dsFilters/dsFilter") : v_nReportDataStore.querySelectorAll("* > dsFilters > dsFilter");
			for (var j = 0; j < v_nDsFilters.length; j++)
			{
				var v_nDsFilter = v_nDsFilters.item(j);

				// dsFilter can have 1 filterExpression (TODO: we ignore for now) or 1 dsFilterDefinition (which we convert to DB)
				// dsFilterDefinition defines 1 filter that we call filterRoot (which may contain other filters)
				var v_nFilterRoot;
				var v_nlFilterDefinition = v_bRunInProduction ? v_nDsFilter.selectNodes(".//dsFilterDefinition") : v_nDsFilter.querySelector("dsFilterDefinition");
				if (!v_nlFilterDefinition)
				{
					continue;
				}
				var v_nlFilterDefChildren = v_bRunInProduction ? v_nDsFilter.selectNodes(".//dsFilterDefinition/*") : v_nDsFilter.querySelector("dsFilterDefinition").childNodes;
				for (var k = 0; k < v_nlFilterDefChildren.length; k++)
				{
					if (v_nlFilterDefChildren.item(k).nodeType == V5ToDashboard.K_iNODE_ELEMENT)
					{
						v_nFilterRoot = v_nlFilterDefChildren.item(k);
						break;
					}
				}
				if (!v_nFilterRoot)
				{
					continue;
				}

				var v_oDBFilter = {};
				v_oDBFilter.id = "Filter" + (i + 1);
				v_oDBFilter.values = [];

				// TODO: Is this needed? Doesn't seem to work in DB
				// v_oDBFilter.preOrPost = (v_nDsFilter.getAttribute("postAutoAggregation") == "post" ? "true" : "false");

				this.f_convertV5DetailFilterToDBFilter(v_nFilterRoot, v_oDBFilter, v_nQuery, v_nSelection);
				if (!this.f_filterIsInvalid(v_oDBFilter))
				{
					v_aLocalFilters.push(v_oDBFilter);
				}
			}
		}
	};

	V5ToDashboard.f_filterIsInvalid = function(v_oDBFilter)
	{
		// Note. v_oDBFilter.values is always an array, but only for combined filters is an array of filters
		for (var i = 0; i < v_oDBFilter.values.length; i++)
		{
			if (!v_oDBFilter.values[i].id)
			{
				// the value is not a filter - this is a basic filter element
				return false;
			}
			if (this.f_filterIsInvalid(v_oDBFilter.values[i]))
			{
				return true;
			}
		}
		return false;
	};

	V5ToDashboard.f_convertV5CombineFilterOperatorToDB = function(v_sV5CombineFilterOperator)
	{
		switch (v_sV5CombineFilterOperator)
		{
			case "filterAnd":
				return "and";

			case "filterOr":
				return "or";

			case "filterNot":
				return "not";

			default:
				alert("V5 filter not supported: " + v_sV5CombineFilterOperator);
				return null;
		}
	};

	V5ToDashboard.f_convertV5DetailFilterToDBFilter = function(v_nFilter, v_oDBFilter, v_nQuery, v_nSelection)
	{
		switch (v_nFilter.nodeName)
		{
			case "filterAnd":
			case "filterOr":
			case "filterNot":
				var v_nlFilterChildren = v_nFilter.childNodes;
				for (var i = 0; i < v_nlFilterChildren.length; i++)
				{
					if (v_nlFilterChildren.item(i).nodeType != V5ToDashboard.K_iNODE_ELEMENT)
					{
						continue;
					}
					var v_nFilterChild = v_nlFilterChildren.item(i);
					var v_oDBFilterChild = {};
					v_oDBFilterChild.id = v_oDBFilter.id + '_' + (i + 1);
					v_oDBFilterChild.values = [];
					v_oDBFilter.values.push(v_oDBFilterChild);
					// recursion to get children filters
					this.f_convertV5DetailFilterToDBFilter(v_nFilterChild, v_oDBFilterChild, v_nQuery, v_nSelection);
				}
				v_oDBFilter.operator = this.f_convertV5CombineFilterOperatorToDB(v_nFilter.nodeName);
				break;

			case "#text":
				break;

			default:
				this.f_convertV5VidaFilterElementToDB(v_nFilter, v_oDBFilter, v_nQuery);
				break;
		}
	};

	V5ToDashboard.f_convertV5VidaFilterElementToDB = function(v_nFilter, v_oDBFilter, v_nQuery)
	{
		var v_sRefDataItem = v_nFilter.getAttribute("refDsColumn");
		var v_sQueryName = v_nQuery.getAttribute("name");

		v_oDBFilter.id = v_oDBFilter.columnId = '[' + this.f_escapeEndBracket(v_sQueryName) + '].[' + this.f_escapeEndBracket(v_sRefDataItem) + ']';
		var v_nFilterValue, i;
		switch (v_nFilter.nodeName)
		{
			case "dsFilterIn":
				var v_nlFilterValues = v_bRunInProduction ? v_nFilter.selectNodes(".//dsFilterInValues/dsFilterInValue") : v_nFilter.querySelectorAll("dsFilterInValues > dsFilterInValue");
				for (i = 0; i < v_nlFilterValues.length; i++)
				{
					v_nFilterValue = v_nlFilterValues.item(i);
					if (!v_nFilterValue)
					{
						continue;
					}
					var v_sFilterValue = v_nFilterValue.childNodes[0].nodeValue;
					v_oDBFilter.values.push({
						"d": v_sFilterValue,
						"u": v_sFilterValue
					});
				}
				v_oDBFilter.operator = (v_nFilter.getAttribute("not") === "true" ? "notin" : "in");
				break;

			case "dsFilterCompare":
				v_nFilterValue = v_bRunInProduction ? v_nFilter.selectSingleNode(".//dsFilterCompareValue") : v_nFilter.querySelector("dsFilterCompareValue");
				if (!v_nFilterValue)
				{
					break;
				}
				var v_FilterValue = Number(v_nFilterValue.childNodes[0].nodeValue);
				v_oDBFilter.values.push({
					"d": v_FilterValue,
					"u": v_FilterValue
				});
				v_oDBFilter.operator = this.f_convertCompareOperatorToDB(v_nFilter);
				break;

			case "dsFilterRange":
				var v_nFilterFrom = v_bRunInProduction ? v_nFilter.selectSingleNode(".//dsFilterFromValue") : v_nFilter.querySelector("dsFilterFromValue");
				var v_nFilterTo = v_bRunInProduction ? v_nFilter.selectSingleNode(".//dsFilterToValue") : v_nFilter.querySelector("dsFilterToValue");
				if (!v_nFilterFrom && !v_nFilterTo || v_nFilterFrom.childNodes.length == 0 && v_nFilterTo.childNodes.length == 0)
				{
					break;
				}
				var v_FilterFrom, v_FilterTo;
				if (v_nFilterFrom.childNodes.length > 0 && v_nFilterTo.childNodes.length > 0)
				{
					v_FilterFrom = Number(v_nFilterFrom.childNodes[0].nodeValue);
					v_FilterTo = Number(v_nFilterTo.childNodes[0].nodeValue);
					v_oDBFilter.values.push({
							"d": v_FilterFrom,
							"u": v_FilterFrom
						}, {
							"d": v_FilterTo,
							"u": v_FilterTo
						});
					v_oDBFilter.operator = (v_nFilter.getAttribute("not") === "true" ? "notbetween" : "between");
					break;
				}
				if (v_nFilterFrom.childNodes.length > 0 && v_nFilterTo.childNodes.length == 0)
				{
					v_FilterFrom = Number(v_nFilterFrom.childNodes[0].nodeValue);
					v_oDBFilter.values.push({
							"d": v_FilterFrom,
							"u": v_FilterFrom
						});
					v_oDBFilter.operator = "gt";
					break;
				}
				if (v_nFilterFrom.childNodes.length == 0 && v_nFilterTo.childNodes.length > 0)
				{
					v_FilterTo = Number(v_nFilterTo.childNodes[0].nodeValue);
					v_oDBFilter.values.push({
							"d": v_FilterTo,
							"u": v_FilterTo
						});
					v_oDBFilter.operator = "lt";
					break;
				}
				break;
		}
	};

	V5ToDashboard.f_convertCompareOperatorToDB = function(v_nFilterCompare)
	{
		var v_bIsNot = v_nFilterCompare.getAttribute("not") === "true";

		switch (v_nFilterCompare.getAttribute("operator"))
		{
			case "greaterThan":
			case "greaterThanEqual":
				return v_bIsNot ? "lt" : "gt";

			case "lessThan":
			case "lessThanEqual":
				return v_bIsNot ? "gt" : "lt";

			case "equal":
				return "eq";
		}
		return "eq";
	};

	V5ToDashboard.f_setCrosstabWidget = function(v_oWidget, v_nSelection, v_nQuery, v_oDataView)
	{
		var v_sQueryName = v_nQuery.getAttribute("name");
		v_oWidget.slotmapping.slots = [
			{
				"name": "row_level1",
				"dataItems": [],
				"caption": "Rows",
				"id": "row_level1"
			},
			{
				"name": "column_level1",
				"dataItems": [],
				"caption": "Columns",
				"id": "column_level1"
			},
			{
				"name": "values",
				"dataItems": [],
				"caption": "Values",
				"id": "values"
			}
		];
		var v_sRefDataItem, v_nDataItem, i;
		var v_nlRowsCrosstabNodeMember = v_bRunInProduction ? v_nSelection.selectNodes(".//crosstabRows//crosstabNodeMember") :
												v_nSelection.querySelectorAll("crosstabRows * crosstabNodeMember");
		for (i = v_nlRowsCrosstabNodeMember.length - 1; i >= 0; i--)
		{
			// to preserve the nesting order must loop descending
			v_sRefDataItem = v_nlRowsCrosstabNodeMember.item(i).getAttribute("refDataItem");
			v_nDataItem = this.f_getDataItem(v_nQuery, v_sRefDataItem);
			if (!this.f_addV5DataItemToDBDataView(v_nSelection, v_sQueryName, v_nDataItem, "refDataItem", v_oDataView, i))
			{
				continue;
			}
			// slot 0 is for rows
			v_oWidget.slotmapping.slots[0].dataItems.push(v_sRefDataItem);
		}

		var v_nlColsCrosstabNodeMember = v_bRunInProduction ? v_nSelection.selectNodes(".//crosstabColumns//crosstabNodeMember") :
												v_nSelection.querySelectorAll("crosstabColumns * crosstabNodeMember");
		for (i = v_nlColsCrosstabNodeMember.length - 1; i >= 0; i--)
		{
			// to preserve the nesting order must loop descending
			v_sRefDataItem = v_nlColsCrosstabNodeMember.item(i).getAttribute("refDataItem");
			v_nDataItem = this.f_getDataItem(v_nQuery, v_sRefDataItem);
			if (!this.f_addV5DataItemToDBDataView(v_nSelection, v_sQueryName, v_nDataItem, "refDataItem", v_oDataView, i))
			{
				continue;
			}
			var v_iSlotIndex = 1;
			if (this.F_IsLikelyMeasure(v_nDataItem))
			{
				v_iSlotIndex = 2;
			}
			v_oWidget.slotmapping.slots[v_iSlotIndex].dataItems.push(v_sRefDataItem);
		}

		var v_nCrosstabCornerDataItemLabel = v_bRunInProduction ? v_nSelection.selectSingleNode(".//crosstabCorner//*[@refDataItem]") : v_nSelection.querySelector("crosstabCorner * [refDataItem]");
		if (v_nCrosstabCornerDataItemLabel)
		{
			v_sRefDataItem = v_nCrosstabCornerDataItemLabel.getAttribute("refDataItem");
			v_nDataItem = this.f_getDataItem(v_nQuery, v_sRefDataItem);
			this.f_addV5DataItemToDBDataView(v_nSelection, v_sQueryName, v_nDataItem, "refDataItem", v_oDataView, 0);
			v_oWidget.slotmapping.slots[2].dataItems.push(v_sRefDataItem);
		}

		v_oWidget.data.dataViews.push(v_oDataView);
		v_oWidget.visId = "crosstab";
	};

	V5ToDashboard.f_convertAggregateOpToDB = function(v_sV5AggregateOp)
	{
		switch (v_sV5AggregateOp)
		{
			case "average":
				return "avg";

			case "summarize":
				return "sum";

			case "minimum":
				return "min";

			case "maximum":
				return "max";

			case "count":
				return "count";

			case "countDistinct":
				return "countdistinct";

			default:
				return null;
		}
	};

	V5ToDashboard.f_setVizControlWidget = function(v_oWidget, v_nSelection, v_aQueries, v_aDataViews, v_nlReportDataStore)
	{
		v_oWidget.visId = this.f_convertV5VidaTypeToDB(v_nSelection);
		this.f_addVizControlPropertiesToWidget(v_oWidget, v_nSelection);

		var v_aLayers = [];
		if (v_oWidget.visId == "com.ibm.vis.rave2bundletiledmap")
		{
			v_oWidget.slotmapping.layers = [];
		}

		for (var i = 0; i < v_aQueries.length; i++)
		{
			var v_nQuery = v_aQueries[i];
			var v_sQueryName = v_nQuery.getAttribute("name");
			var v_oDataView = v_aDataViews[i];
			var v_nlDataItems = this.f_getDataItems(v_nQuery);
			for (var j = 0; j < v_nlDataItems.length; j++)
			{
				var v_nDataItem = v_nlDataItems.item(j);
				if (!this.f_addV5DataItemToDBDataView(v_nSelection, v_sQueryName, v_nDataItem, "refDsColumn", v_oDataView, j))
				{
					continue;
				}
				var v_oSlot = this.f_createVizControlSlot(v_nSelection, v_nDataItem, v_oWidget.visId);
				v_oWidget.slotmapping.slots.push(v_oSlot);
				if (v_oWidget.visId == "com.ibm.vis.rave2bundletiledmap" && v_aLayers.indexOf(v_oSlot.layerId) == -1)
				{
					v_aLayers.push(v_oSlot.layerId);
					v_oWidget.slotmapping.layers.push(
					{
						type: v_oSlot.layerId,
						id: v_oSlot.layerId,
						dataViewId: v_oDataView.id
					});
				}
			}
			this.f_addV5VidaFiltersToDBWidgetLocalFilters(v_nQuery, v_nSelection, v_oWidget.localFilters, v_nlReportDataStore);
			v_oWidget.data.dataViews.push(v_oDataView);
		}
	};

	V5ToDashboard.f_convertV5VidaTypeToDB = function(v_nSelection)
	{
		var v_sType = v_nSelection.getAttribute('type');
		switch (v_sType)
		{
			case "com.ibm.vis.clusteredColumn":
				return "com.ibm.vis.rave2bundlecolumn";

			case "com.ibm.vis.clusteredBar":
				return "com.ibm.vis.rave2bundlebar";

			case "com.ibm.vis.stackedColumn":
				return "com.ibm.vis.rave2bundlestackedcolumn";

			case "com.ibm.vis.stackedBar":
				return "com.ibm.vis.rave2bundlestackedbar";

			case "com.ibm.vis.area":
				return "com.ibm.vis.rave2bundlearea";

			case "com.ibm.vis.treemap":
				return "com.ibm.vis.rave2bundletreemap";

			case "com.ibm.vis.bubble":
				return "com.ibm.vis.ravebubble";

			case "com.ibm.vis.bullet":
				return "com.ibm.vis.rave2bundlebullet";

			case "com.ibm.vis.point":
				return "com.ibm.vis.rave2point";

			case "com.ibm.vis.packedBubble":
				return "com.ibm.vis.rave2bundlepackedbubble";

			case "com.ibm.vis.hierarchicalPackedBubble":
				return "com.ibm.vis.rave2bundlehierarchicalpackedbubble";

			case "com.ibm.vis.marimekko":
				return "com.ibm.vis.rave2marimekko";

			case "com.ibm.vis.heatmap":
				return "com.ibm.vis.rave2heat";

			case "com.ibm.vis.line":
				return "com.ibm.vis.rave2line";

			case "com.ibm.vis.simpleCombination":
				return "com.ibm.vis.rave2bundlecomposite";

			case "com.ibm.vis.pie":
				return "com.ibm.vis.rave2bundlepie";

			case "com.ibm.vis.dial":
				return "com.ibm.vis.rave2bundleradialbar";

			case "com.ibm.vis.radar":
				return "com.ibm.vis.rave2bundleradar";

			case "com.ibm.vis.scatter":
				return "com.ibm.vis.ravescatter";

			case "com.ibm.vis.wordcloud":
				return "com.ibm.vis.rave2bundlewordcloud";

			case "com.ibm.vis.boxplot":
				return "com.ibm.vis.rave2bundleboxplot";

			case "com.ibm.vis.smoothArea":
				return "com.ibm.vis.rave2bundlesmootharea";

			case "com.ibm.vis.waterfall":
				return "com.ibm.vis.rave2bundlewaterfall";

			case "com.ibm.vis.tiledmap":
				return "com.ibm.vis.rave2bundletiledmap";

			default:
				return v_sType;
		}
	};

	V5ToDashboard.f_addVizPropertiesToWidget = function(v_oWidget, v_nSelection)
	{
		var v_nlVizPropertyValues = v_bRunInProduction ? v_nSelection.selectNodes(".//vizPropertyValues/*") : v_nSelection.querySelectorAll("vizPropertyValues > *");
		for (var i = 0; i < v_nlVizPropertyValues.length; i++)
		{
			var v_nVizProperty = v_nlVizPropertyValues.item(i);
			if (!v_nVizProperty)
			{
				continue;
			}
			switch (v_nVizProperty.getAttribute('name'))
			{
				case "color.palette":
					this.f_setDBVizProperty(v_oWidget, v_nVizProperty, "colorPalette");
					break;

				case "legend.position":
					this.f_setDBVizProperty(v_oWidget, v_nVizProperty, "widget.legend.position");
					break;

				case "legend.display":
					this.f_setDBVizProperty(v_oWidget, v_nVizProperty, "widget.legend.display");
					break;

				default:
					break;
			}
		}
	};

	V5ToDashboard.f_addVizControlPropertiesToWidget = function(v_oWidget, v_nSelection, v_sWidgetId)
	{
		var v_nlVizPropertyValues = v_bRunInProduction ? v_nSelection.selectNodes(".//vizPropertyValues/*") : v_nSelection.querySelectorAll("vizPropertyValues > *");
		for (var i = 0; i < v_nlVizPropertyValues.length; i++)
		{
			var v_nVizProperty = v_nlVizPropertyValues.item(i);
			if (!v_nVizProperty)
			{
				continue;
			}
			var v_sDBVizPropertyName = v_nVizProperty.getAttribute('name');
			if (!v_sDBVizPropertyName)
			{
				return;
			}
			v_sDBVizPropertyName = v_sDBVizPropertyName.substring(v_sDBVizPropertyName.indexOf('_') + 1);
			this.f_setDBVizProperty(v_oWidget, v_nVizProperty, v_sDBVizPropertyName);
		}
	};

	V5ToDashboard.f_setDBVizProperty = function(v_oWidget, v_nVizProperty, v_sDBVizPropertyName)
	{
		if (!v_nVizProperty || !v_nVizProperty.childNodes || !v_nVizProperty.childNodes[0])
		{
			return;
		}
		var v_sValue = v_nVizProperty.childNodes[0].nodeValue;
		if (!v_sValue)
		{
			return;
		}

		switch (v_sDBVizPropertyName)
		{
			case "color_cat":
				v_oWidget.properties.push({
					"id": "colorPalette",
					"value": v_sValue
				});
				break;

			default:
				v_oWidget.properties.push({
					"id": v_sDBVizPropertyName,
					"value": v_sValue
				});
				break;
		}
	};

	V5ToDashboard.f_setDBVizType = function(v_oWidget, v_sVizType)
	{
		switch (v_sVizType)
		{
			case "rave-library-column,clusteredcolumn":
				v_oWidget.visId = "com.ibm.vis.rave2bundlecolumn";
				break;

			case "rave-library-column,clusteredbar":
				v_oWidget = "com.ibm.vis.rave2bundlebar";
				break;

			case "rave-library-column,stackedcolumn":
				v_oWidget.visId = "com.ibm.vis.rave2bundlestackedcolumn";
				break;

			case "rave-library-column,stackedbar":
				v_oWidget.visId = "com.ibm.vis.rave2bundlestackedbar";
				break;

			case "rave-library-area,area":
				v_oWidget.visId = "com.ibm.vis.rave2bundlearea";
				break;

			case "rave-library-line,line":
				v_oWidget.visId = "com.ibm.vis.rave2line";
				break;

			case "rave-library-bubble,point":
				v_oWidget.visId = "com.ibm.vis.rave2point";
				break;

			case "rave-library-bubble,scatter":
				v_oWidget.visId = "com.ibm.vis.ravescatter";
				break;

			case "rave-library-dial,dial":
				v_oWidget.visId = "com.ibm.vis.rave2bundleradialbar";
				break;

			case "rave-library-bubble,packedBubble":
				v_oWidget.visId = "com.ibm.vis.rave2bundlepackedbubble";
				break;

			case "rave-library-wordcloud,wordcloud":
				v_oWidget.visId = "com.ibm.vis.rave2bundlewordcloud";
				break;

			case "rave-library-pie,pie":
			v_oWidget.visId = "com.ibm.vis.rave2bundlepie";
				break;

			case "rave-library-heatmap,heatmap":
				v_oWidget.visId = "com.ibm.vis.rave2heat";
				break;

			case "rave-library-bubble,bubble":
				v_oWidget.visId = "com.ibm.vis.ravebubble";
				break;

			case "rave-library-composite,compositeOneDataSet":
				v_oWidget.visId = "com.ibm.vis.rave2bundlecomposite";
				break;
		}
	};

	V5ToDashboard.f_createVizSlot = function(v_nSelection, v_sVizType, v_nDataItem)
	{
		if (v_nSelection.nodeName !== 'viz')
		{
			return null;
		}
		var v_sDataItemName = v_nDataItem.getAttribute("name");
		var v_oSlot = {};
		v_oSlot.dataItems = [];
		v_oSlot.dataItems.push(v_sDataItemName);
		var v_bIsMeasure = this.F_IsLikelyMeasure(v_nDataItem);
		var v_nVizValue;
		switch (v_sVizType)
		{
			case "rave-library-column,clusteredcolumn":
			case "rave-library-column,clusteredbar":
			case "rave-library-column,stackedcolumn":
			case "rave-library-column,stackedbar":
			case "rave-library-area,area":
			case "rave-library-line,line":
			case "rave-library-bubble,point":
				if (v_bIsMeasure)
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "values";
				}
				else if (v_bRunInProduction ? v_nSelection.selectSingleNode(".//vizCategoryEdge[@refEdge='xEdge']//*[@refDataItem='" + v_sDataItemName + "']") :
								v_nSelection.querySelector("vizCategoryEdge[refEdge='xEdge'] > * [refDataItem='" + v_sDataItemName + "']"))
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "categories";
				}
				else
				{
					switch (v_sVizType)
					{
						case "rave-library-area,area":
						case "rave-library-line,line":
						case "rave-library-bubble,point":
							v_oSlot.name = v_oSlot.caption = v_oSlot.id = "series";
							break;

						default:
							v_oSlot.name = v_oSlot.caption = v_oSlot.id = "color";
							break;
					}
				}
				v_oSlot.dataItems = [];
				v_oSlot.dataItems.push(v_sDataItemName);
				break;

			case "rave-library-bubble,scatter":
				if (v_bIsMeasure)
				{
					v_nVizValue = v_bRunInProduction ? v_nSelection.selectSingleNode(".//vizValue[@refDataItem='" + v_sDataItemName + "']") :
											v_nSelection.querySelector("vizValue[refDataItem='" + v_sDataItemName + "']");
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = v_nVizValue.getAttribute('idField');
				}
				else if (v_bRunInProduction ? v_nSelection.selectSingleNode(".//vizCategoryEdge[@refEdge='labelEdge']//*[@refDataItem='" + v_sDataItemName + "']") :
								v_nSelection.querySelector("vizCategoryEdge[refEdge='labelEdge'] > * [refDataItem='" + v_sDataItemName + "']"))
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "categories";
				}
				else
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "color";
				}
				break;

			case "rave-library-dial,dial":
				if (v_bIsMeasure)
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "values";
				}
				else if (v_bRunInProduction ? v_nSelection.selectSingleNode(".//vizCategoryEdge[@refEdge='labelEdge']//*[@refDataItem='" + v_sDataItemName + "']") :
								v_nSelection.querySelector("vizCategoryEdge[refEdge='labelEdge'] > * [refDataItem='" + v_sDataItemName + "']"))
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "categories";
				}
				else
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "color";
				}
				break;

			case "rave-library-bubble,packedBubble":
			case "rave-library-wordcloud,wordcloud":
				if (v_bIsMeasure)
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "size";
				}
				else if (v_bRunInProduction ? v_nSelection.selectSingleNode(".//vizCategoryEdge[@refEdge='labelEdge']//*[@refDataItem='" + v_sDataItemName + "']") :
								v_nSelection.querySelector("vizCategoryEdge[refEdge='labelEdge'] > * [refDataItem='" + v_sDataItemName + "']"))
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "categories";
				}
				else
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "color";
				}
				break;

			case "rave-library-pie,pie":
				if (v_bIsMeasure)
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "values";
				}
				else
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "categories";
				}
				break;

			case "rave-library-heatmap,heatmap":
				if (v_bIsMeasure)
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "color";
				}
				else if (v_bRunInProduction ? v_nSelection.selectSingleNode(".//vizCategoryEdge[@refEdge='xEdge']//*[@refDataItem='" + v_sDataItemName + "']") :
								v_nSelection.querySelector("vizCategoryEdge[refEdge='xEdge'] > * [refDataItem='" + v_sDataItemName + "']"))
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "categories";
				}
				else
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "series";
				}
				break;

			case "rave-library-bubble,bubble":
				if (v_bIsMeasure)
				{
					v_nVizValue = v_bRunInProduction ? v_nSelection.selectSingleNode(".//vizValue[@refDataItem='" + v_sDataItemName + "']") :
											v_nSelection.querySelector("vizValue[refDataItem='" + v_sDataItemName + "']");
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = v_nVizValue.getAttribute('idField');
				}
				else
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "color";
				}
				break;

			case "rave-library-composite,compositeOneDataSet":
				if (v_bIsMeasure)
				{
					v_nVizValue = v_bRunInProduction ? v_nSelection.selectSingleNode(".//vizValue[@refDataItem='" + v_sDataItemName + "']") :
											v_nSelection.querySelector("vizValue[refDataItem='" + v_sDataItemName + "']");
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = (v_nVizValue.getAttribute('idField') == 'yLine' ? 'lineValue' : 'columnValue');
				}
				else
				{
					v_oSlot.name = v_oSlot.caption = v_oSlot.id = "categories";
				}
				break;

			default:
				return null;
		}

		return v_oSlot;
	};

	V5ToDashboard.f_createVizControlSlot = function(v_nSelection, v_nDataItem, v_sVisId)
	{
		var v_sDataItemName = v_nDataItem.getAttribute("name");
		var v_oSlot = {};
		v_oSlot.dataItems = [];
		v_oSlot.dataItems.push(v_sDataItemName);

		// TODO: support multiple data stores
		var v_nVcSlotData = this.f_getAncestorNode(
			v_bRunInProduction ? v_nSelection.selectSingleNode(".//*[@refDsColumn='" + v_sDataItemName + "']") : v_nSelection.querySelector("[refDsColumn='" + v_sDataItemName + "']"),
			"vcSlotData");

		if (v_sVisId == "com.ibm.vis.rave2bundletiledmap")
		{
			var v_nVcSlotDataSet = this.f_getAncestorNode(
				v_bRunInProduction ? v_nSelection.selectSingleNode(".//*[@refDsColumn='" + v_sDataItemName + "']") : v_nSelection.querySelector("[refDsColumn='" + v_sDataItemName + "']"),
				"vcDataSet");
			v_oSlot.layerId = v_nVcSlotDataSet.getAttribute("idDataSet");
		}
		//var v_sRefDataStore = v_bRunInProduction ? v_nSelection.selectSingleNode(".//vcDataSet").getAttribute("refDataStore") :
		//									v_nSelection.querySelector("vcDataSet").getAttribute("refDataStore");
		var v_sIdSlot = v_nVcSlotData.getAttribute("idSlot");
		v_oSlot.name = v_oSlot.caption = v_oSlot.id = v_sIdSlot;
		return v_oSlot;
	};

	return V5ToDashboard;
});

/**
 * Licensed Materials - Property of IBM
 * IBM Cognos Products: rs
 * (C) Copyright IBM Corp. 2018
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *
 */
define('bi/authoring/plugins/rsReportToDashboardService',[
	'baglass/core-client/js/core-client/ui/core/Class',
    'bi/authoring/utils/V5ToDashboard'
], function(Class, V5ToDashboard) {
    'use strict';

    var rsReportToDashboardService = Class.extend({

        init: function(attributes)
		{
            this._glassContext = attributes.glassContext; // eslint-disable-line no-underscore-dangle
            rsReportToDashboardService.inherited('init', this, arguments); // eslint-disable-line prefer-rest-params
        },

        convertReportToDashboard: function()
		{
			return this._glassContext.getCoreSvc('.Clipboard').get() // eslint-disable-line no-underscore-dangle
				.then(function(v_oExternalCopy)
				{
					if (v_oExternalCopy && v_oExternalCopy.type == "REPORT")
					{
						var v_nSourceReport = (new DOMParser()).parseFromString(v_oExternalCopy.spec, "text/xml").documentElement;
						var v_aSelectionIids = v_oExternalCopy.selectionIids;
						return V5ToDashboard.ConvertV5toDB(v_nSourceReport, v_aSelectionIids, this._glassContext) // eslint-disable-line no-underscore-dangle
							.then(function(v_oDBSpec) {
								return JSON.stringify(v_oDBSpec);
							});
					}

					return "";
				}.bind(this));
        }
    });

    return rsReportToDashboardService;
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
	(C) Copyright IBM Corp. 2022
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define('bi/authoring/DatasetsBehaviour',[
	'bi/authoring/common/ReportingBehaviour'
	],
function(ReportingBehaviour) {
	'use strict';

	/**
	 * Datasets implementation of ReportingBehaviour.
	 */
	class DatasetsBehaviour extends ReportingBehaviour {
		isViewer()
		{
			return false;
		}

		isShareable(v_bEmbed)
		{
			// Datasets don't support embed from overflow menu
			return !v_bEmbed;
		}

		populateShareUrl(v_oUrlMap)
		{
		}

		getReportStoreId()
		{
			// duplicate the functionality from AuthoringBehavior
			const v_oAuthoringApp = this.m_oContentView.getAuthoringApplication();
			return v_oAuthoringApp ? v_oAuthoringApp.SharedState.Get("storeID") : undefined;
		}
	}

	return DatasetsBehaviour;
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: authoring
	(C) Copyright IBM Corp. 2022
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/
/* eslint-disable no-underscore-dangle */

define( 'bi/authoring/datasetsContentView',[
	'bi/authoring/rsContentView',
	'bi/authoring/DatasetsBehaviour'
	],
function(rsContentView, DatasetsBehaviour) {
	'use strict';

	const datasetsContentView = rsContentView.extend({

		init: function(options, appView)
		{
			this.m_behaviour = new DatasetsBehaviour(this);

			datasetsContentView.inherited('init', this, arguments); // eslint-disable-line prefer-rest-params
		},

	});

	return datasetsContentView;
});

/*
	IBM Confidential
	OCO Source Materials
	IBM Cognos Products: rs
	(C) Copyright IBM Corp. 2020, 2022
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define('bi/authoring/common/plugins/rptSetAsHomeActionHandler',[], function() {
	'use strict';

	var SetAsHomeActionHandler = function()
	{
	};

	/**
	 * @public
	 * @param {Object} context
	 * @type boolean
	 */
	SetAsHomeActionHandler.prototype.isItemVisible = function(context)
	{
		const v_behaviour = context.glassContext.currentAppView.currentContentView.m_behaviour;

		// only allow SetAsHome menu item in Viewer, for a saved report that is not an active report
		return v_behaviour.isViewer() && !v_behaviour.isActiveReport() && !!v_behaviour.getReportStoreId();
	};

	return SetAsHomeActionHandler;
});


define("js/authoring/bundle", function(){});
