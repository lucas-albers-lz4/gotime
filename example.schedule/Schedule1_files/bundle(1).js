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
	(C) Copyright IBM Corp. 2022
	The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/

define('bi/classicviewer/ClassicBehaviour',[
	'bi/authoring/common/ReportingBehaviour',
	'bi/authoring/utils/pat/rsCommon'
	],
function(ReportingBehaviour, rsCommon) {
	'use strict';

	/**
	 * Classic implementation of ReportingBehaviour.
	 */
	class ClassicBehaviour extends ReportingBehaviour
	{
		getReportStoreId()
		{
			if (rsCommon.isObjectOfType(this.m_oContentView.cmProperties, 'output')) {
				return this.m_oContentView.cmProperties.parent[0].parent[0].id;
			}
			return this.m_oContentView.cmProperties && this.m_oContentView.cmProperties.id;
		}

		populateShareUrl(v_oUrlMap)
		{
			// If requesting share link in classic viewer for non-output object, then action is
			// always run.  No need to check for active report when setting format since
			// classic active reports are displayed stand alone (no glass) so there is no way
			// to request a share URL.
			v_oUrlMap.action = 'run';

			let v_sOutputFormat;
			if (this.m_oContentView.m_oRVFormParameters && this.m_oContentView.m_oRVFormParameters['run.outputFormat'] )
			{
				v_sOutputFormat = this.m_oContentView.m_oRVFormParameters['run.outputFormat'];
			}
			else
			{
				v_sOutputFormat = this.m_oContentView.format;
			}

			v_oUrlMap.format = v_sOutputFormat || 'HTML';
		}
	}

	return ClassicBehaviour;
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
	IBM Cognos Products: authoring
	(C) Copyright IBM Corp. 2015, 2023
	The source code for this program is not published or otherwise divested
	of its trade secrets, irrespective of what has been deposited with the
	U.S. Copyright Office.
*/
/* eslint-disable no-underscore-dangle */

define( 'bi/classicviewer/cvContentView',[
	'bi/glass/app/ContentView',
	'jquery',
	'bi/classicviewer/ClassicBehaviour',
	'bi/classicviewer/nls/StringResource',
	'bi/commons/utils/Utils',
	'bi/authoring/utils/pat/rsLaunchParameters',
	'bi/authoring/utils/pat/rsPromptParameters',
	'bi/authoring/utils/rsPerformance',
	'bi/authoring/utils/pat/rsCommon',
	'bi/authoring/utils/rsOpenHelper',
	'bi/authoring/common/utils/rptShareHelper',
	'bi/authoring/utils/rsPromptHandler',
	'bi/admin/common/utils/parameters/ParameterValues'],
function(ContentView, $, ClassicBehaviour, StringResource, Utils, rsLaunchParameters, rsPromptParameters, rsPerformance, rsCommon, rsOpenHelper, rptShareHelper, rsPromptHandler, ParameterValues)
{
	'use strict';

	const classicViewerGatewaySuffix = "v1/disp";
	const promptPageEndpoint = "/rds/promptPage/report/";
	const cvFormFields = [
		"cv.navlinks",
		"cv.header",
		"cv.toolbar",
		"cv.selection",
		"cv.drill",
		"cv.contextInfo",
		"cv.contextmenu",
		"cv.id",
		"cv.responseFormat",
		"cv.rsProfile",
		"cv.showFaultPage",
		"cv.useAjax",
		"cv.reuseConversation",
		"cv.promptForDownload",
		"cv.gateway",
		"cv.webcontent",
		"cv.keepWindowOpen",
		"ui.action",
		"ui.cafcontextid",
		"ui.conversation",
		"ui.spec",
		"ui.errURL",
		"ui.routingServerGroup",
		"ui.name",
		"ui.object",
		"run.outputFormat",
		"run.outputLocale",
		"run.outputPageDefinition",
		"run.outputPageOrientation",
		"run.verticalElements",
		"run.horizontalElements",
		"run.prompt",
		"run.xslURL",
		"run.data",
		"specification.editSpecification",
		"modelPath",
		"m&#x005F;tracking",
		"parameterValues",
		"reuseResults",
		"keepIterators",
		"rs_aliases",
		"authenticitytoken",
		"specificationType",
		"system.http://developer.cognos.com/ceba/constants/systemOptionEnum#accessibilityFeatures",
		"biDirectional.http://developer.cognos.com/ceba/constants/biDirectionalOptionEnum#biDirectionalFeaturesEnabled",
		"generic.anyURI.runOptionEnum#globalParameters",
		"isTitan",
		"IncludePerformance"
	];

	// Pattern to extract search path from defaultOutput method
	const g_reDefaultOutput = /^defaultOutput\((.*),\s*'[^']*'\s*,\s*'[^']*'\s*\)/;

	let g_bIsOnReportPage = false;

	// Set of valid formats based on the list of format message IDs in ClassicViewerMessages.js i.e. formatXXXX
	const g_ValidFormats = new Set(['HTML', 'XHTML', 'HTMLFragment', 'XHTMLFragment', 'PDF', 'spreadsheetML', 'xlsxData', 'CSV', 'XML']);

	const cvContentView = ContentView.extend({

		init: function(options, appView) {
			this.m_behaviour = new ClassicBehaviour(this);

			rsCommon.decodeAndMoveCMProperties(options);
			rsCommon.convertStringQSToValues(options, options.glassContext);
			rsCommon.decodeAndMoveRSOptions(options);

			// After the following call, every member of options is now a member of this
			cvContentView.inherited('init', this, arguments); // eslint-disable-line prefer-rest-params

			this.m_sTitle = StringResource.get('classicviewer_welcome');

			this.m_oAppView = appView;

			try
			{
				// to open a report passed on the URL and pass parameters, we need access to the
				// launch parameters stored in the calling window's Application object
				var v_oLaunchParameters = rsLaunchParameters.Retrieve(this.launchParametersKey);
				if (!v_oLaunchParameters && window.opener && !window.opener.closed && window.opener.RSParameters)
				{
					var v_sLaunchParametersKey = window.opener.RSParameters.launchParametersKey;
					var v_oLaunchParameters = rsLaunchParameters.Retrieve(v_sLaunchParametersKey);
				}
				else if (window.parent && options.launchParametersRef && window.parent[options.launchParametersRef])
				{
					this.m_oPromptContext = window.parent[options.launchParametersRef].promptContext;
				}
				if (v_oLaunchParameters)
				{
					// merge options with the values pointed to by the key
					// the options from the object pointed to by the key take precedence
					$.extend(true, this, v_oLaunchParameters);
				}
			}
			catch (e)
			{
				console.log("cvContentView.init() - Call to window.opener failed, assume it doesn't exist");
			}

			// console.log("end: cvContentView.init" );
			this.m_bFullyInitialized = false;

			// Name of the classic viewer creation callback method
			this.m_sCreateCallback = "cvCreateCallback" + Date.now();
		},

		_postInit: function()
		{
			if (this.m_bFullyInitialized)
			{
				return;
			}
			this.m_bFullyInitialized = true;

			var options = this;

			if (options.type == 'output' && options.cmProperties && options.cmProperties.ancestors && options.cmProperties.ancestors.length > 1)
			{
				// If processing an output object and we have ancestor information, generate the saved output name.
				this.m_sTitle = rsCommon.generateSavedOutputName(options.cmProperties);
			}
			else if (options.cmProperties && options.cmProperties.defaultName)
			{
				this.m_sTitle = options.cmProperties.defaultName;
			}
			else if (options.defaultName)
			{
				this.m_sTitle = options.defaultName;
			}

			if (options.rsFinalRunOptions)
			{
				if (typeof options.rsFinalRunOptions.format != 'undefined')
				{
					options.format = options.rsFinalRunOptions.format;
				}
				if (typeof options.rsFinalRunOptions.locale != 'undefined')
				{
					// test how used
					options.locale = options.rsFinalRunOptions.locale;
				}
				if ( typeof options.rsFinalRunOptions.prompt !== 'undefined')
				{
					options.prompt = options.rsFinalRunOptions.prompt;
				}
				if (typeof options.rsFinalRunOptions.a11y != 'undefined')
				{
					options.a11y = options.rsFinalRunOptions.a11y;
				}
				if (typeof options.rsFinalRunOptions.bidi != 'undefined')
				{
					options.bidi = options.rsFinalRunOptions.bidi;
				}
				if (typeof options.rsFinalRunOptions.editSpecification != 'undefined')
				{
					options.editSpecification = options.rsFinalRunOptions.editSpecification;
				}
				if (typeof options.rsFinalRunOptions.IncludePerformance != 'undefined')
				{
					options.IncludePerformance = options.rsFinalRunOptions.IncludePerformance;
				}
				delete options.rsFinalRunOptions;
			}


			// let create a form to submit to the classicviewer
			// TODO....change m_oRVFormParamters to something more meaningful like m_oClassicViewerForm?
			this.m_oRVFormParameters = {};

			// Transfer all options.xxx fields where xxx is a recognised form field name to m_oRVFormParameters
			cvFormFields.forEach(function(v_sFormField) {
				if (typeof options[v_sFormField] != 'undefined')
				{
					this.m_oRVFormParameters[v_sFormField] = options[v_sFormField];
				}
			}, this);
			if (options.format && !this.m_oRVFormParameters['run.outputFormat'])
			{
				this.m_oRVFormParameters['run.outputFormat'] = options.format;
			}
			if (options.contentLocale)
			{
				this.m_oRVFormParameters['run.outputLocale'] = options.contentLocale;
			}
			if (typeof options.prompt != 'undefined')
			{
				this.m_oRVFormParameters['run.prompt'] = (typeof options.prompt === "string") ? (options.prompt == "true") : !!options.prompt;
			}
			else
			{	// for classical report running from RS, we treated undefined as true
				this.m_oRVFormParameters['run.prompt'] = true;
			}
			if (typeof options.a11y != 'undefined')
			{
				this.m_oRVFormParameters["system.http://developer.cognos.com/ceba/constants/systemOptionEnum#accessibilityFeatures"] = !!options.a11y;
			}
			if (typeof options.bidi != 'undefined')
			{
				this.m_oRVFormParameters["biDirectional.http://developer.cognos.com/ceba/constants/biDirectionalOptionEnum#biDirectionalFeaturesEnabled"] = !!options.bidi;
			}
			if (typeof options.editSpecification != 'undefined')
			{
				// This option is an XML string so only set it if we actually have something
				this.m_oRVFormParameters["specification.editSpecification"] = options.editSpecification;
			}

			this.m_oRVFormParameters["cv.createCallback"] = this.m_sCreateCallback;

			if (options.parameterValuesJSON)
			{
				this.m_oRVFormParameters["parameterValues"] = rsPromptParameters.rsBuildPromptParameters(null, options.parameterValuesJSON);
			}
			else if (options.parameterValuesXML)
			{
				this.m_oRVFormParameters["parameterValues"] = options.parameterValuesXML;
			}

			//Prompt parameters simple format
			this.m_aPromptParameters = [];
			for (var v_sKey in options)
			{
				if (options.hasOwnProperty(v_sKey) && v_sKey.indexOf('p_') == 0 && options[v_sKey])
				{
					this.m_aPromptParameters.push({ name: v_sKey, value: options[v_sKey] });
				}
			}

			//Prompt parameters defined in json
			this.m_aPromptParametersComplex = [];
			if (options["promptParameters"])
			{
				this.m_aPromptParametersComplex = Array.isArray(options["promptParameters"]) ? options["promptParameters"] : [options["promptParameters"]];
			}

			var v_sSearchPath = this.getSearchPath();
			var v_sStoreId = this.cmProperties && this.cmProperties.id;
			// Prefer search path over store ID since external lineage expects a standard search path
			var v_sReportSearchPath = v_sSearchPath || (v_sStoreId ? 'storeID("' + v_sStoreId + '")' : "");

			this.m_oRVFormParameters['ui.object'] = v_sReportSearchPath;

			if (this.type == 'output')
			{
				this.m_oRVFormParameters['ui.action'] = 'view';
				// Remove "run." parameters since we are viewing
				// Some of these override the ui.action=view and cause a run instead which is not what we want.
				for (var v_sProp in this.m_oRVFormParameters)
				{
					if (v_sProp.substring(0, 4) == "run.")
					{
						delete this.m_oRVFormParameters[v_sProp];
					}
				}
			}
			else
			{
				// deletions are to ensure empty form fields are
				// not passed to viewer to avoid CAF rejecting them.
				if (this.m_oRVFormParameters['ui.object'])
				{
					this.m_oRVFormParameters['ui.action'] = 'run';
					delete this.m_oRVFormParameters['ui.spec'];
				}
				else if (this.m_oRVFormParameters['ui.spec'])
				{
					this.m_oRVFormParameters['ui.action'] = 'runSpecification';
					delete this.m_oRVFormParameters['ui.object'];
				}
				else
				{
					delete this.m_oRVFormParameters['ui.action'];
					delete this.m_oRVFormParameters['ui.spec'];
					delete this.m_oRVFormParameters['ui.object'];
					this.glassContext.showToast(StringResource.get('invalid_refresh'), { type: 'error' });
				}
			}


			// We want to explicitly turn off the header (which says Cognos Viewer) as well as the toolbars
			this.m_oRVFormParameters["cv.header"] 		= false;
			this.m_oRVFormParameters["cv.toolbar"] 		= false;
			this.m_oRVFormParameters["cv.keepWindowOpen"] = true;
			this.m_oRVFormParameters["isTitan"] 		= true;
			// Enable raw classic viewer js
			//this.m_oRVFormParameters["cv.debugjs"] 		= true;

			if (this.glassContext &&
				this.glassContext.services &&
				this.glassContext.services.userProfile &&
				this.glassContext.services.userProfile.userProfileSettings &&
				this.glassContext.services.userProfile.userProfileSettings.parameter_values)
			{
				this.m_oRVFormParameters["generic.anyURI.runOptionEnum#globalParameters"] = ParameterValues.toXML(this.glassContext.services.userProfile.userProfileSettings.parameter_values);
			}
		},
		showWaitIndicator: function()
		{
			this.m_elDivViewerContainer.style.visibility = "hidden";
			this.m_elDivStartUp.style.visibility = "visible";
		},

		hideWaitIndicator: function()
		{
			this.m_elDivStartUp.style.visibility = "hidden";
			this.m_elDivViewerContainer.style.visibility = "visible";
		},

		_getNameFromViewer: function()
		{
			var v_oViewer = this.getCognosViewer();
			return v_oViewer && v_oViewer.envParams && v_oViewer.envParams['ui.name'];
		},

		getTitle: function()
		{
			// console.log("In cvContentView.getTitle\n");
			return this.m_sTitle;
		},

		getIcon: function()
		{
			//console.log("In cvContentView.getIcon\n");
			return 'common-report';
		},

		getIconColor: function()
		{
			return 'purple';
		},

		getIconTooltip: function()
		{
			//console.log("In cvContentView.getIconTooltip\n");
			return StringResource.get('classicviewer_welcome');
		},

		/**
		 * Get the search path of the underlying report object
		 */
		getSearchPath: function()
		{
			return this.cmProperties && this.cmProperties.searchPath;
		},

		getType: function()
		{
			var v_sType = this.cmProperties && this.cmProperties.type;
			if (!v_sType)
			{
				//When a classic report is launched from shared URL, we will not have cmPromperties, nor the type, we need to get the type from the viewer itself.
				var v_oCV = this.getCognosViewer();
				v_sType = v_oCV && v_oCV.envParams["ui.objectClass"];
			}
			return v_sType;
		},

		getTimeStamp: function()
		{
			//console.log("In cvContentView.getTimeStamp\n");
			return new Date().toUTCString();
		},

		updateButtons: function()
		{
			this._setDisplayForPlugins(true, ["com.ibm.bi.classicviewer.formatMenu"]);
			this.setFormatMenuTitle(this.format);

			if (this.type == "output" || (this.cmProperties && this.cmProperties.type == "output"))
			{
				// Viewing saved output
				var v_bRun = this.cmProperties.permissions.indexOf("execute") != -1;
				this._setDisplayForPlugins(v_bRun, [
					"com.ibm.bi.classicviewer.run"
				]);
				this._setDisplayForPlugins(false, [
					"com.ibm.bi.classicviewer.editBtn",
					"com.ibm.bi.classicviewer.saveBtn",
					"com.ibm.bi.classicviewer.refresh"
				]);
			}
			else
			{
				// Running live
				// Determine if readable.  Assume readable if permissions not provided.
				let v_bRead = true;
				if (this.cmProperties && this.cmProperties.permissions && this.cmProperties.permissions.indexOf("read") == -1)
				{
					v_bRead = false;
				}

				let v_bShowEdit = false;
				//StoreId will be null if Authoring has launched classic viewer (because we are doing a runspec)
				if (this.glassContext.hasCapability("canUseReportStudio") && this.m_behaviour.getReportStoreId() && v_bRead)
				{
					v_bShowEdit = true;
				}
				if (this.cmProperties && this.cmProperties.type == 'reportView')
				{
					// Don't allow edit on report views
					v_bShowEdit = false;
				}
				else if (this.cmProperties && this.cmProperties.type == 'report')
				{
					let v_oModel = this.cmProperties.metadataModelPackage && this.cmProperties.metadataModelPackage[0];
					if (!v_oModel)
					{
						v_oModel = this.cmProperties.module && this.cmProperties.module[0];
					}

					if (v_oModel && v_oModel.effectiveUserCapabilities && v_oModel.effectiveUserCapabilities.indexOf('canUseReportStudio') === -1)
					{
						v_bShowEdit = false;
					}
				}

				const v_bHasStoreId = !!this.m_behaviour.getReportStoreId();
				this._setDisplayForPlugins(v_bShowEdit, ["com.ibm.bi.classicviewer.editBtn"]);
				this._setDisplayForPlugins(v_bHasStoreId, ["com.ibm.bi.classicviewer.saveBtn"]);
				this._setDisplayForPlugins(v_bHasStoreId, [
					"com.ibm.bi.classicviewer.run",
					"com.ibm.bi.classicviewer.refresh"
				]);
			}

			const v_bAppBar = this.ui_appbar == undefined || this.ui_appbar === true;
			// toolbar defaults to appbar. Otherwise anything other than 'true' is considered false as per glass behaviour
			const v_bToolBar = this.ui_toolbar == undefined ? v_bAppBar : this.ui_toolbar === true;
			if (!v_bToolBar)
			{
				// David Doran said the following should work.
				const x = $('#com\\.ibm\\.bi\\.classicviewer\\.toolbars\\.maintb');
				if (x)
				{
					x.hide();
				}
				else
				{
					console.error("Unable to locate classic viewer toolbar");
				}
			}
		},

		/**
		 * Make the viewer iframe visible and hide the 'wait' indicator.
		 */
		_showViewer: function()
		{
			this.hideWaitIndicator();
			this.updateButtons();
			delete window.OnErrorPage;

			//console.log("end: cvContentView._showViewer\n");
		},

		show: function()
		{
			this.m_bDeactivated = undefined;
			cvContentView.inherited('show', this, arguments); // eslint-disable-line prefer-rest-params

			if (this.m_aFnCallbacks)
			{	// show saved plugings status
				var fnCallback;

				while (this.m_aFnCallbacks.length > 0)
				{
					fnCallback = this.m_aFnCallbacks.shift();
					fnCallback();
				}
			}
		},

		_setEnabledForPlugins: function(v_bEnabled, v_aPluginIds)
		{
			v_aPluginIds.forEach(function(v_sPluginId)
			{
				var v_oPlugin = this.findPlugin(v_sPluginId);

				if (v_oPlugin)
				{
					if (v_bEnabled)
					{
						//	console.log('%s show', v_sPluginId);
						v_oPlugin.enable();
					}
					else
					{
						//	console.log('%s hide', v_sPluginId);
						v_oPlugin.disable();
					}
				}
				else
				{
					console.log('could not find plugin: %s', v_sPluginId);
				}
			}, this.glassContext);
		},


		setFormatMenuTitle(v_sFormat)
		{
			if (!g_ValidFormats.has(v_sFormat))
			{
				// For unknown formats, use HTML for the title.  The viewer will be displaying an error page anyway.
				v_sFormat = 'HTML';
			}
			this._setTitleForPlugin( StringResource.get("format" + v_sFormat), "com.ibm.bi.classicviewer.formatMenu");
		},

		_setTitleForPlugin: function(v_sLabel, v_sPluginId)
		{
			var v_oPlugin = this.glassContext.findPlugin(v_sPluginId);
			if ( v_oPlugin )
			{
				v_oPlugin.changeLabel(v_sLabel);
			}
		},

		_setDisplayForPlugins: function(v_bShow, v_aPluginIds)
		{
			//console.group("cvContentView._setDisplayForPlugins");
			//console.log("v_bShow:%s", v_bShow);

			v_aPluginIds.forEach(
				function(v_sPluginId) {
					var v_oPlugin = this.findPlugin(v_sPluginId);
					if ( v_oPlugin )
					{
						if (v_bShow)
						{
						//	console.log('%s show', v_sPluginId);
							v_oPlugin.show();
						}
						else
						{
						//	console.log('%s hide', v_sPluginId);
							v_oPlugin.hide();
						}
					}
					else
					{
						console.log('could not find plugin: %s', v_sPluginId);
					}
				},
				this.glassContext );
			//console.groupEnd();
		},

		_isInternetExplorer: function()
		{
			var v_sAgent = navigator.userAgent.toLowerCase();
			var v_fIEVersion = ( v_sAgent.search(/trident\/([0-9]+\.[0-9]+)/) != -1 ) ? parseFloat( RegExp.$1 ) : 0;
			return (v_fIEVersion >= 7.0);
		},

		removePdfClass: function()
		{
			if (this._isInternetExplorer())
			{
				this.m_elDivViewerContainer.classList.remove('PdfViewer');
			}
		},

		addPdfClass: function()
		{
			if (this._isInternetExplorer())
			{
				//console.log("Setting PdfViewer class for IE");
				this.m_elDivViewerContainer.classList.add('PdfViewer');
			}
		},

		onReportStatusComplete: function()
		{
			rsPerformance.mark('cvContentView.onReportStatusComplete');
			console.timeEnd('rsperf: render->reportStatusComplete');

			g_bIsOnReportPage = true;

			if (this.m_behaviour.getReportStoreId())
			{
				this._setEnabledForPluginsLazily(true, [
					"com.ibm.bi.classicviewer.saveBtn",
					"com.ibm.bi.classicviewer.run",
					"com.ibm.bi.classicviewer.refresh",
					"com.ibm.bi.classicviewer.formatMenu"
				]);
			}

			// did we do something that changed the title?
			//if (this.m_sTitle)
			//{
			//	var v_sViewerName = this._getNameFromViewer();
			//	if (v_sViewerName && this.m_sTitle != v_sViewerName)
			//	{
			//		this.m_sTitle = v_sViewerName;
			//		this.trigger('change:title', {'value': this.m_sTitle});
			//	}
			//}
			var v_oCognosViewer = this.getCognosViewer();

			if (v_oCognosViewer && v_oCognosViewer.outputFormat == "PDF")
			{
				this.addPdfClass();
				// Get PDF iframe
				this.m_iFramePDF = this.m_iframeClassicViewer.contentDocument.querySelector("iframe");
			}
			else
			{
				this.removePdfClass();
				delete this.m_iFramePDF;
			}
		},

		onReportStatusPrompting: function()
		{
			g_bIsOnReportPage = false;

			if (this.m_behaviour.getReportStoreId())
			{
				this._setEnabledForPluginsLazily(false, [
					"com.ibm.bi.classicviewer.saveBtn",
					"com.ibm.bi.classicviewer.run",
					"com.ibm.bi.classicviewer.refresh",
					"com.ibm.bi.classicviewer.formatMenu"
				]);

				// NOTE : Setting focus on the window did not work, but setting focus to the control did.
				//        Not sure why.  If you can think of a better way...great.
				//        Change at your own risk.


				// get a node list of all the prompting control widgets
				var v_sCSSSelectors = ".clsPromptComponent";
				var v_nlPromptingControl = this.m_iframeClassicViewer.contentDocument.querySelectorAll(v_sCSSSelectors);
				// classnames of all the prompting control widgets including the prompt buttons
				var v_sCSSAllSelectors = v_sCSSSelectors + ", .bp";
				if (v_nlPromptingControl.length > 0)
				{
					var v_aSelectors = v_sCSSAllSelectors.split(", ");
					// Check the active element matches one of the desired classname
					var bFound = v_aSelectors.includes("." + this.m_iframeClassicViewer.contentDocument.activeElement.className);
					// if none of them has a focus, set focus to the first non-button one.
					if (bFound == false)
					{
						v_nlPromptingControl[0].focus();
					}
				}
			}
		},

		_setEnabledForPluginsLazily: function(v_bEnabled, v_aPluginIds)
		{
			if (this.m_bDeactivated)
			{
				/**
				 * this is for a long run report. when the running report's appView is hided behind and the report finish running,
				 *  this.findPlugin() function could find any plugin correctly, because glass always try to find plugin from current appView
				 *  which is not the long run report belong's to. so here, keep those status and do them when user switch the long run report's appView back to active
				 */
				if (!this.m_aFnCallbacks)
				{
					this.m_aFnCallbacks = [];
				}

				this.m_aFnCallbacks.push(function() {
					this._setEnabledForPlugins(v_bEnabled, v_aPluginIds);
				}.bind(this));
			}
			else
			{
				this._setEnabledForPlugins(v_bEnabled, v_aPluginIds);
			}
		},

		getViewerConfiguration: function()
		{
			console.timeEnd('rsperf: render->getViewerConfiguration');
			rsPerformance.mark('cvContentView.getViewerConfiguration');
			return {
				httpRequestCallbacks: {
					reportStatus: {
						complete: this.onReportStatusComplete.bind(this),
						prompting: this.onReportStatusPrompting.bind(this)
					}
				}
			};
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

		_cleanPromptContext: function()
		{
			delete window.OnReportOutput;
			delete window.OnErrorPage;
			delete window.FinishCollectPrompts;
			this.m_oPromptContext.promptOpener.close();
		},

		_render: function()
		{
			// Perform any final initialization now that urlMap is fully resolved
			this._postInit();

			// Update the buttons before we display the view in order to prevent flicker (REPORT-11732)
			this.updateButtons();

			// This method returns a promise whose resolution signals the glass that our content view is done drawing.
			// Our view adds an iframe to the document and we use the onload event to trigger further processing to avoid race conditions.
			// The problem is the onload is called when the iframe is added to the document but also when the glass processes the promise resolution.
			// We need to defer our onload processing to the second call because any work done on the first load will get erased by the second load
			// (iframe src is about:blank).
			// One wrinkle in this is that under Edge, the iframe is not loaded when the glass promise is resolved so it must process things slightly differently.
			var deferred = $.Deferred();

			console.timeEnd('rsperf: onSelectItem->render');
			console.time('rsperf: render->loadIframe');
			rsPerformance.mark('cvContentView.render');

			this.$el.empty();

			// Create wait indicator
			var v_aWaiting = document.getElementsByClassName("loadingIndicatorContainer");
			var v_oWaiting = (v_aWaiting && v_aWaiting.length > 0) ? v_aWaiting.item(0) : null;

			this.m_elDivStartUp = document.createElement('div');
			this.m_elDivStartUp.innerHTML = v_oWaiting ? v_oWaiting.outerHTML : "";
			this.$el.append(this.m_elDivStartUp);

			// Create viewer div
			this.m_elDivViewerContainer = document.createElement('div');
			this.m_elDivViewerContainer.style.width = "100%";
			this.m_elDivViewerContainer.style.height = "100%";
			this.m_elDivViewerContainer.style.position = "absolute";
			this.m_elDivViewerContainer.style.visibility = "hidden";
			this.$el.append(this.m_elDivViewerContainer);

			// Create viewer iframe
			this.m_iframeClassicViewer = document.createElement('iframe');
			this.m_iframeClassicViewer.name = this.m_iframeClassicViewer.title = this.id || '_classicViewer';
			this.m_iframeClassicViewer.src = "about:blank";
			this.m_iframeClassicViewer.style.border = "none";
			this.m_iframeClassicViewer.style.width = "100%";
			this.m_iframeClassicViewer.style.height = "100%";
			this.m_iframeClassicViewer.style.position = "absolute";

			// HACK: the Glass doesn't have an API to squish the sidebar
			this.m_oAppView.$('.navbar').addClass('narrow');

			console.time('rsperf: render->getViewerConfiguration');
			window.getViewerConfiguration = this.getViewerConfiguration.bind(this);
			console.time('rsperf: render->reportStatusComplete');

			// prompting for collectParameterValues in classical viewer
			if (this.m_oPromptContext && this.m_oPromptContext.promptOpener && this.m_behaviour.getReportStoreId())
			{
				// The following callback is invoked from prompt pages.
				// If a report has no parameters then no prompt page is rendered so we never
				// show the window - this is what we want.  If we do show the window when there a no prompt pages, then
				// when we close the window in FinishCollectPrompts (see above), this terminates the java script which prevents
				// the caller from displaying the correct toasts.
				window.OnReportOutput = function() {
					// show prompting window if we have not already done so
					if (!this.m_oPromptContext.promptOpenerShown)
					{
						this._showViewer();
						this.m_oPromptContext.promptOpener.show();
						this.m_oPromptContext.promptOpenerShown = true;
					}
				}.bind(this);

				// Callback from classic error page
				window.OnErrorPage = function( code, message, details )
				{
					if (this.m_oPromptContext.promptFnErrorCallback)
					{
						var error = {
							"code": code,
							"message": message,
							"details": details
						};
						this.m_oPromptContext.promptFnErrorCallback( error );
					}
					else if (this.m_oPromptContext.promptFnCancelCallback)
					{
						this.m_oPromptContext.promptFnCancelCallback();
					}
					this._cleanPromptContext();
				}.bind(this);

				// classical API function, this is called when finishing prompting
				window.FinishCollectPrompts = function(success)
				{
					if (success)
					{
						if (this.m_oPromptContext.promptFnOkCallback1)
						{
							console.log("promptContext.promptFnOkCallback1");
							// This version of the OK callback will invoke the prompting service to retrieve the results.
							// This resolves a strange behavior in IE (see APAR 14584 which applies to reports as well as QS)
							this.m_oPromptContext.promptFnOkCallback1();
							this._cleanPromptContext();
						}
						else
						{
							console.log("promptContext.promptFnOkCallback");
							this.glassContext.getSvc('.Prompting').then(function(promptingSvc) {
								promptingSvc.getPromptAnswers(this.m_oPromptContext.promptRDSId).then( function(values) {
									this.m_oPromptContext.promptFnOkCallback(values);
									this._cleanPromptContext();
								}.bind(this));
							}.bind(this));
						}
					}
					else
					{
						if (this.m_oPromptContext.promptFnCancelCallback)
						{
							this.m_oPromptContext.promptFnCancelCallback();
						}
						this._cleanPromptContext();
					}
				}.bind(this);

				// RDS request for prompt ID
				this.glassContext.services.ajax.ajax({
					url: classicViewerGatewaySuffix + promptPageEndpoint + this.m_behaviour.getReportStoreId(),
					type: 'GET',
					dataType: 'xml'
				}).then(function(xmlDoc, status, jqXHR) {
					this.m_oPromptContext.promptRDSId = xmlDoc.getElementsByTagNameNS('http://developer.cognos.com/schemas/rds/types/2', 'promptID').item(0).textContent;
					this.m_oPromptContext.promptOpener.id = this.m_oPromptContext.promptRDSId;

					// Store any parameter values provided by the caller in the runTimeState object which is created by the
					// call to the promptPageEndpoint above.
					// The promting XTS pages look for initial parameter values in this runTimeState object.
					var v_sParameterValues = rsPromptParameters.rsBuildPromptParameters( null, this.m_oPromptContext.parameters );
					this.glassContext.services.ajax.ajax({
						type: 'PUT',
						url: 'v1/objects/' + this.m_oPromptContext.promptRDSId,
						data: JSON.stringify(
							{
								type: 'runTimeState',
								state: v_sParameterValues
							}),
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					}).then(function() {
						// submit collectParameterValues request based on report id and prompt id
						this._createAndSubmitCollectParameterValuesForm(this.m_behaviour.getReportStoreId(), xmlDoc.getElementsByTagNameNS('http://developer.cognos.com/schemas/rds/types/2', 'url').item(0).textContent);

						deferred.resolve(this.$el);
					}.bind(this));
				}.bind(this));
			}
			else
			{
				// onload must be specified before iframe is attached to the document because Chrome will trigger the load immediately
				this.m_iframeClassicViewer.onload = this._onLoad.bind(this);

				this.loadClassicViewer();

				// This is the "early" resolve - show the StartUp div right away
				deferred.resolve(this.$el);
			}

			// On Chrome, adding the iframe to the document triggers the onload event immediately whereas other browsers load the iframe
			// when the current js call stack finishes.  We must delay adding the iframe until all work is done in this method to ensure
			// all callbacks are properly configured before the ifrmae loads so this is the last thing we do.
			this.m_elDivViewerContainer.appendChild(this.m_iframeClassicViewer);

			return deferred.promise();
		},

		/**
		 * This method is called by the classic viewer right after the classic viewer object is created but before the page finishes loading.
		 * The timing is important because it lets us know about the classic viewer before any iframes are processed which may trigger a download.
		 * The div containing the classic viewer is hidden until we are notified the classic viewer exists so this must happen before download is initiated.
		 * @param v_sCV Name of the classic viewer object
		 */
		_onClassicViewerCreated: function( v_sCV )
		{
			//console.log("CV create callback");
			// Get the classic viewer object
			if (this.m_iframeClassicViewer && this.m_iframeClassicViewer.contentWindow) {
				// Ensure getClassicViewer returns the the classic viewer without having to look for it
				this.m_oCognosViewer = this.m_iframeClassicViewer.contentWindow[v_sCV];
			}
			this._onClassicViewerLoaded();
		},

		/**
		 * Hook up the classic viewer to the cvContentView
		 * and display the viewer iframe
		 */
		_onClassicViewerLoaded: function()
		{
			console.timeEnd('rsperf: render->loadIframe');
			console.timeEnd('rsperf: total_RunReport');
			rsPerformance.mark('cvContentView._onClassicViewerLoaded');
			rsPerformance.mark('authoring-selectItemAndDraw-stop');

			//console.log("cvContentView._onClassicViewerLoaded(). ");


			if (this.isViewerLoaded())
			{
				// Either classic viewer or RDS prompt page is loaded
				var v_oCognosViewer = this.getCognosViewer();
				if (v_oCognosViewer)
				{
					this.m_iframeClassicViewer.contentWindow.TerminateDrillFromPdf = this.TerminateDrillFromPdf.bind(this);

					this.m_iframeClassicViewer.contentWindow.onunload = this._release.bind(this);

					// get a reference to the original executeBackURL method...just in case we need to call it
					this.original_executeBackURL = this.m_iframeClassicViewer.contentWindow.executeBackURL;
					// point the existing method to our method
					this.m_iframeClassicViewer.contentWindow.executeBackURL = this.executeBackURL.bind(this);

					// get a reference to the original doSingleDrill method...we need to call it later
					this.original_doSingleDrill = this.m_iframeClassicViewer.contentWindow.doSingleDrill;
					// point the existing method to our method
					this.m_iframeClassicViewer.contentWindow.doSingleDrill = this.doSingleDrill.bind(this);

					// Define goto page handler
					this.m_iframeClassicViewer.contentWindow.rsGoToHandler = this.gotoHandler.bind(this);

					// Prevent old PDF drill logic from trying to restore PDF using browser history (see viewer drill-from-pdf.xts)
					this.m_iframeClassicViewer.contentWindow.f_restorePDF = this.f_restorePDF.bind(this);

					this.m_iframeClassicViewer.contentWindow.f_registerPDFIFrame = this.f_registerPDFIFrame.bind(this);

					// get a reference to the original addDrillEnvironmentFormFields method...we need to call it later
					this.original_addDrillEnvironmentFormFields = this.m_iframeClassicViewer.contentWindow.addDrillEnvironmentFormFields;
					// point the existing method to our method
					this.m_iframeClassicViewer.contentWindow.addDrillEnvironmentFormFields = this.addDrillEnvironmentFormFields.bind(this);

					if (this.glassContext && this.glassContext.isDevInstall && this.glassContext.isDevInstall())
					{
						rsPerformance.summarizeClassicViewerRun( this );
					}

					// Replace viewer's version of updateNewBrowserWindow
					if (v_oCognosViewer.updateNewBrowserWindow)
					{
						this.original_updateNewBrowserWindow = v_oCognosViewer.updateNewBrowserWindow;
						v_oCognosViewer.updateNewBrowserWindow = this.updateNewBrowserWindow.bind(this);
					}

					/**
					 * inject a function to classical viewer, when keyboard combination ctrl-shift-1 is hit,
					 *  this function will be called to focus to Appbar
					 */
					v_oCognosViewer.focusBackToContent = function(evt) {
						this.glassContext.accessibilityController.setFocusToAppbar();
					}.bind(this);

					/**
					 * inject a function to classical viewer, when keyboard conbination ctrl-shift-2 is hit,
					 *  this function will be called to fucus to MainContent
					 */
					v_oCognosViewer.focusBackToMainContent = function(evt) {
						this.setFocus();
					}.bind(this);
				}
				this._showViewer();
			}
			// Stop processing load event
			this.m_iframeClassicViewer.onload = null;
		},

		createLaunchSpec: function(v_oCmObject, format, method, locale, sPrompt)
		{
			// Convert HTML-like formats to HTML to ensure perspective resolution works
			// Viewer will handle specifying the actual format that it really wants.
			format = format.indexOf('HTML') != -1 ? 'HTML' : format;

			var v_oLaunchSpec = {
				// string of output format
				// one of HTML, PDF, xlsxData, CSV, spreadsheetML, layoutDataXML, rawXML, singleXLS, HTMLFragment
				format: format,
				objRef: v_oCmObject.id,
				type: v_oCmObject.type,
				contentLocale: locale,
			};
			switch (method)
			{
				case "execute":
				case "run":
					v_oLaunchSpec.action = "run";
					break;

				case "view":
				case "viewOutput":
					v_oLaunchSpec.action = "viewOutput";
					break;

				case "edit":
					v_oLaunchSpec.action = "edit";
					break;
			}
			switch (sPrompt)
			{
				case "yes":
				case "true":
					v_oLaunchSpec.prompt = true;
					break;

				case "no":
				case "false":
					v_oLaunchSpec.prompt = false;
					break;
			}

			return v_oLaunchSpec;
		},

		// we are hijacking the viewer's copy of this method so that we can
		// add a form field to the form before being submitted
		addDrillEnvironmentFormFields: function(drillForm, oCV)
		{
			// call the original viewer method
			this.original_addDrillEnvironmentFormFields(drillForm, oCV);
			// append the cv.keepWindowOpen field to the form

			// we probably do not need to check to see if the "createFormField" method exists, but
			// I would rather make sure before I called it.
			if (this.m_iframeClassicViewer && this.m_iframeClassicViewer.contentWindow && this.m_iframeClassicViewer.contentWindow.createFormField)
			{
				drillForm.appendChild(this.m_iframeClassicViewer.contentWindow.createFormField("cv.keepWindowOpen", "true"));
			}
		},

		/**
		 * Handler called from goto page for authored drill.
		 * @param drillType Indicates what kind of drill is being performed
		 * @param drill drill information specific to drill type
		 */
		gotoHandler: function(drillType, drill)
		{
			if (drillType == 'authoredDrillthru')
			{
				this._authoredDrillHandler(drill);
			}
			else
			{
				this._packageDrillHandler(drill);
			}
		},

		/**
		 * Submit form described by drill as AJAX request after adding option
		 * to make request return results of calling drill service on package drill object.
		 */
		_packageDrillHandler: function(drillForm)
		{
			this._sendDrillThroughRequest( { packageDrill: true }, drillForm );
		},

		/**
		 * Perform authored drill.  Converts the drill information into the parameters expected by the doSingleDrill method
		 * and then calls said method.  As a result, authored drill from goto page behaves the same
		 * as single authored drill.
		 */
		_authoredDrillHandler: function(drill)
		{
			var target, args, method, format, locale, bookmark, sourceContext, objectPaths, cvId, sPrompt, dynamicDrill;

			var v_aObj = [];
			var v_aParams = [];
			var v_oDrillDoc = rsCommon.parseXML(drill);
			var v_nDrillNode = v_oDrillDoc && v_oDrillDoc.documentElement.firstChild;
			while (v_nDrillNode)
			{
				switch (v_nDrillNode.nodeName)
				{
					case 'param':
						switch (v_nDrillNode.getAttribute('name'))
						{
							case 'action':
								method = rsCommon.getNodeText(v_nDrillNode);
								if (method == 'editAnalysis' || method == 'editQuery')
								{
									// Map classic actions to current value
									method = 'edit';
								}
								break;

							case 'format':
								format = rsCommon.getNodeText(v_nDrillNode);
								break;

							case 'locale':
								locale = rsCommon.getNodeText(v_nDrillNode);
								break;

							case 'target':
								var v_sTarget = rsCommon.getNodeText(v_nDrillNode);
								// When action on drill is view, the target search path provided from the goto page
								// is based on the defaultOutput( path, format, locale ) CM search path function.
								// Use a pattern to extract the path parameter.
								var v_aMatch = v_sTarget.match(g_reDefaultOutput);
								if (v_aMatch && v_aMatch.length > 1)
								{
									v_sTarget = v_aMatch[1];
								}
								v_aObj.push('obj');
								v_aObj.push(v_sTarget);
								break;

							case 'prompt':
								sPrompt = rsCommon.getNodeText(v_nDrillNode);
								break;

							case 'dynamicDrill':
								dynamicDrill = rsCommon.getNodeText(v_nDrillNode);
								break;

							case 'showInNewWindow':
								target = (rsCommon.getNodeText(v_nDrillNode) == 'false') ? '' : '_blank';
								break;

							case 'executionParameters':
								break;

							case 'metadataModel':
								break;

							case 'sourceContext':
								sourceContext = rsCommon.getNodeText(v_nDrillNode);
								break;

							case 'bookmark':
								bookmark = rsCommon.getNodeText(v_nDrillNode);
								break;

							case 'objectPaths':
								objectPaths = rsCommon.getNodeText(v_nDrillNode);
								break;
						}
						break;

					case 'drillParameters':
						var v_nParamNode = v_nDrillNode.firstChild;
						while (v_nParamNode)
						{
							if (v_nParamNode.nodeName == 'param')
							{
								var v_sName = v_nParamNode.getAttribute('name');
								var v_sValue = rsCommon.getNodeText(v_nParamNode);
								v_aParams.push([v_sName, v_sValue]);
							}
							v_nParamNode = v_nParamNode.nextSibling;
						}
						break;
				}
				v_nDrillNode = v_nDrillNode.nextSibling;
			}
			args = [v_aObj];
			cvId = this.getCognosViewer().getId();

			this.doSingleDrill(target, args.concat(v_aParams), method, format, locale, bookmark, sourceContext, objectPaths, cvId, sPrompt, dynamicDrill );
		},

		doSingleDrill: function(target, args, method, format, locale, bookmark, sourceContext, objectPaths, cvId, sPrompt, dynamicDrill)
		{
			// This method is called by the classic viewer when doing a single drill.  The viewer first determines whether or
			// not a drill to self should be done.  If not, then it calls this method.  We need to take over processing
			// so that we can determine which perspective should be used on the target.
			// But first, we use the classic viewer to call the drill service.

			var v_oArguments = {
				target: target,
				args: args,
				method: method,
				format: format,
				locale: locale,
				bookmark: bookmark,
				sourceContext: sourceContext,
				objectPaths: objectPaths,
				cvId: cvId,
				sPrompt: sPrompt,
				dynamicDrill: dynamicDrill
			};

			this.showWaitIndicator();

			// Override how classic viewer issues it's drill request and call original drill method
			this.getCognosViewer().sendDrillThroughRequest = this._sendDrillThroughRequest.bind(this, v_oArguments);
			this.original_doSingleDrill(target, args, method, format, locale, bookmark, sourceContext, objectPaths, cvId, sPrompt, dynamicDrill);
		},

		_htmlDecode: function(v_sText) {
			var v_oDoc = new DOMParser().parseFromString('<div>' + v_sText + '</div>', "text/html");
			return v_oDoc.documentElement.textContent;
		},

		_sendDrillThroughRequest: function(v_oDrillArguments, v_elViewerDrillForm)
		{
			// Convert classic viewer drill form into an AJAX request
			var v_sAction = v_elViewerDrillForm.action;
			var v_iIdx = v_sAction.indexOf("?");
			var v_sURL = v_iIdx > 0 ? v_sAction.substring(0, v_iIdx) : v_sAction;
			var v_aData = [];
			var v_nlInputs = v_elViewerDrillForm.elements;
			for (var i = 0; i < v_nlInputs.length; ++i)
			{
				var v_nInput = v_nlInputs[i];
				if (v_nInput.nodeName === 'INPUT')
				{
					v_aData.push(v_nInput.name + '=' + encodeURIComponent(v_nInput.value) );
				}
			}
			// Force viewer to only perform drill service call
			v_aData.push('cv.drillServiceOnly=true');

			var v_oRequest =
			{
				type: 'POST',
				url: v_sAction,
				dataType: 'xml',
				data: v_aData.join('&')
			};
			this.glassContext.services.ajax.ajax(v_oRequest)
			.catch(function(x, http, z) {
				var v_sMsg = null;
				if (http && typeof http.getResponseHeader == 'function' && http.getResponseHeader('Content-Type').indexOf('text/html') == 0)
				{
					// We appear to have an error page since we were expecting a SOAP response but we got html
					var v_aMatch = http.responseText.match(/<ERROR_CODE>(.*)<\/ERROR_CODE><ERROR_MSG>(.*)<\/ERROR_MSG>/);
					if (v_aMatch && v_aMatch.length >= 3)
					{
						v_sMsg = this._htmlDecode(v_aMatch[2]);
						console.error("cvContentView._sendDrillThroughRequest " + v_aMatch[1] + ":" + v_sMsg);
					}
				}
				this.hideWaitIndicator();
				this.glassContext.showToast(v_sMsg || "Unexpected error on drill request", { type: 'error' });
			}.bind(this))
			.then(this._drillServiceResponse.bind(this, v_oDrillArguments, v_sURL));
		},

		getOutputPages: function(v_nDrillServiceResponse)
		{
			var v_nDetails = v_nDrillServiceResponse.querySelector('Envelope>Body result>details');
			var v_aElements = this._getChildElementsByXsiType( v_nDetails, 'bus:asynchDetailReportOutput' );
			var v_nOutputPages = v_aElements.length > 0 ? v_aElements[0] : null; // should only be 0 or 1

			var v_nPage = v_nOutputPages.querySelector('item');
			return v_nPage ? v_nPage.textContent : '';
		},

		F_SetPromptCallbackResponse: function(v_sResponse, v_oAttachments)
		{
			if (v_sResponse)
			{
				var v_nResponse = rsCommon.parseXML(v_sResponse);
				if (this._promptDeferred)
				{
					this._promptDeferred.resolve(v_nResponse);
				}
			}
			else
			{
				this._promptDeferred.reject({ "state": "Cancel" });
			}
		},

		_drillServiceResponse: function(v_oDrillArguments, v_sUrl, v_oResponseData, v_sStatus, v_oXHR)
		{
			// Handle drill service response which might require
			// - issuing a wait request if status=working
			// - display prompt page is status=prompting

			var v_nDrillServiceResponse = v_oResponseData;

			var v_nStatus = v_nDrillServiceResponse.querySelector('Envelope > Body result > status');
			var v_sStatus = v_nStatus && v_nStatus.textContent;
			if (v_sStatus == 'working' || v_sStatus == 'stillWorking')
			{
				this._wait( v_nDrillServiceResponse, v_sUrl )
				.catch(function() {
					console.error("cvContentView._drillServiceResponse wait failed");
					this.hideWaitIndicator();
					this.glassContext.showToast("Unexpected error on drill request", { type: 'error' });
				}.bind(this))
				.then(this._drillServiceResponse.bind(this, v_oDrillArguments, v_sUrl));
				return;
			}

			var v_nDetails = v_nDrillServiceResponse.querySelector('Envelope > Body result>details');
			var v_aElements = this._getChildElementsByXsiType( v_nDetails, 'bus:asynchDetailReportStatus' );
			var v_nReportStatus = v_aElements.length > 0 ? v_aElements[0] : null; // should only be 0 or 1

			v_nStatus = v_nReportStatus ? v_nReportStatus.querySelector('status') : null;
			v_sStatus = v_nStatus && v_nStatus.textContent;
			if (v_sStatus == 'prompting')
			{
				this._prompt( v_nDrillServiceResponse )
				.catch(function(err) {
					this.hideWaitIndicator();
					if (!err || err.state != "Cancel")
					{
						console.error("cvContentView._drillServiceResponse prompt failed");
						this.glassContext.showToast(err.message, { type: 'error' });
					}
				}.bind(this))
				.then(
					// Process the drill response now that prompts have been satisfied
					this._drillServiceResponse.bind(this, v_oDrillArguments, v_sUrl)
				);
				return;
			}

			// Invoke target
			this._doDrill(v_oDrillArguments, v_nDrillServiceResponse);
		},

		_wait: function( v_nDrillServiceResponse, v_sUrl )
		{
			var v_nBody = v_nDrillServiceResponse.querySelector('Envelope > Body');
			var v_nResponse = v_nBody.querySelector('runSpecificationResponse,runResponse,waitResponse');
			if (v_nResponse)
			{
				v_nBody.removeChild(v_nResponse);
			}
			var v_nWait = v_nDrillServiceResponse.createElementNS("http://developer.cognos.com/schemas/reportService/1", "rs:wait");
			v_nBody.appendChild(v_nWait);
			this._addCafContextID(v_nDrillServiceResponse);

			var v_nDocElem = v_nDrillServiceResponse.documentElement;
			// IE doesn't have outerHTML
			var v_sWait = v_nDocElem.outerHTML || ( new XMLSerializer() ).serializeToString(v_nDocElem);
			var v_oRequest =
			{
				type: 'POST',
				url: v_sUrl,
				dataType: 'xml',
				contentType: 'text/xml; charset=UTF-8',
				headers: { SOAPAction: 'http://www.ibm.com/xmlns/prod/cognos/reportService/201712/.absolute' },
				data: v_sWait
			};
			return this.glassContext.services.ajax.ajax(v_oRequest);
		},

		_addCafContextID: function( v_nSoapRequest )
		{
			var v_oCognosViewer = this.getCognosViewer();
			if (v_oCognosViewer)
			{
				var v_sCAF = v_oCognosViewer.getCAFContext();
				if (v_sCAF)
				{
					var v_nBiBusHeader = v_nSoapRequest.querySelector('Envelope > Header > biBusHeader');
					if (v_nBiBusHeader)
					{
						var v_nCAF = v_nBiBusHeader.querySelector('CAF');
						if (!v_nCAF)
						{
							// no CAF node, create it
							v_nCAF = v_nSoapRequest.createElement('bus:CAF');
							v_nCAF.setAttributeNS('http://www.w3.org/2001/XMLSchema-instance', 'xsi:type', 'bus:CAF');
							v_nBiBusHeader.appendChild(v_nCAF);
						}
						var v_nContextID = v_nCAF.querySelector('contextID');
						if (!v_nContextID)
						{
							// no contextID node, create it
							v_nContextID = v_nSoapRequest.createElement('bus:contextID');
							v_nContextID.setAttributeNS('http://www.w3.org/2001/XMLSchema-instance', 'xsi:type', 'xs:string');
							v_nCAF.appendChild(v_nContextID);
						}
						// set contextID
						v_nContextID.textContent = v_sCAF;
					}
				}
			}
		},

		_prompt: function( v_nDrillServiceResponse )
		{
			// This method should display the prompt page and when the prompting sequence is complete
			// return the resulting SOAP response as the promise resolution so that the drill through can proceed.
			// Until this logic is implemented, we force a failure instead.
			this._promptDeferred = $.Deferred();
			rsPromptHandler.F_DoPrompting(this, v_nDrillServiceResponse, this.glassContext);

			return this._promptDeferred.promise();
		},

		_extractOption: function( v_nDrillThroughDetails, v_sType, v_sName )
		{
			var v_oValue;
			var v_nOptions = v_nDrillThroughDetails && v_nDrillThroughDetails.querySelector('options');
			var v_aXMLOptions = this._getChildElementsByXsiType( v_nOptions, v_sType );
			for (var idx = 0; idx < v_aXMLOptions.length; ++idx)
			{
				var v_nOption = v_aXMLOptions[idx];
				var v_nName = v_nOption.querySelector('name');
				if (v_nName && v_nName.textContent == v_sName)
				{
					var v_nValue = v_nOption.querySelector('value');
					if (v_nValue)
					{
						if (v_nValue.getAttributeNS('http://www.w3.org/2001/XMLSchema-instance', 'type') == 'SOAP-ENC:Array')
						{
							v_oValue = [];
							var v_nChildren = v_nValue.childNodes;
							for (var idx = 0; idx < v_nChildren.length; ++idx)
							{
								var v_nChild = v_nChildren.item(idx);
								if (v_nChild.nodeType == Node.ELEMENT_NODE)
								{
									v_oValue.push( v_nChild.textContent );
								}
							}
						}
						else
						{
							v_oValue = v_nValue.textContent;
						}
					}
					break;
				}
			}
			return v_oValue;
		},

		/**
		 * Extract information from SOAP asynchDetailDrillThroughRequest response of a run package drill object request.
		 * Convert information into a form as an authored drill was being processed.
		 * @param v_oDrillArguments Extracted drill information
		 * @param v_nDrillThroughDetails The asynchDetailDrillThroughRequest from the SOAP response
		 */
		_extractPackageDrillArguments: function(v_oDrillArguments, v_nDrillThroughDetails)
		{
			/* bookmark not provided in drill response */

			v_oDrillArguments.args = [];

			// Extract target report search path
			var v_nNode = v_nDrillThroughDetails.querySelector('target');
			var v_sNode = v_nNode ? v_nNode.textContent : "";
			v_oDrillArguments.args.push(['obj', v_sNode]);

			// Extract drill in new window
			v_oDrillArguments.target = ''; // no way to specify open in new window on package drill

			// Extract drill format
			var v_aFormat = this._extractOption( v_nDrillThroughDetails, 'bus:runOptionStringArray', 'outputFormat' );
			v_oDrillArguments.format = v_aFormat && v_aFormat.length > 0 ? v_aFormat[0] : '';

			// Extract drill action
			v_nNode = v_nDrillThroughDetails.querySelector('action');
			var v_sNode = v_nNode ? v_nNode.textContent : "";
			v_oDrillArguments.method = v_sNode;

			// Package drill does not provide content locale so use this instance's value
			// If viewing saved output, use output locale else use current locale
			v_oDrillArguments.locale = this.cmProperties && this.cmProperties.type == 'output' ? this.cmProperties.locale : (this.contentLocale || '');

			// Extract drill prompt
			v_oDrillArguments.sPrompt = this._extractOption( v_nDrillThroughDetails, 'bus:runOptionBoolean', 'prompt' );
		},

		_doDrill: function(v_oDrillArguments, v_nDrillServiceResponse)
		{
			// Get the asynchDetailDrillThroughRequest element from the drill service SOAP response
			var v_nDetails = v_nDrillServiceResponse.querySelector('Envelope>Body result>details');
			// IE does not appear to support query selectors on attribute values with namespace qualified attributes i.e. xsi:type
			// so we do it the 'hard' way
			var v_aElements = this._getChildElementsByXsiType( v_nDetails, 'bus:asynchDetailDrillThroughRequest' );
			var v_nDrillThroughDetails = v_aElements.length > 0 ? v_aElements[0] : null; // should only be 0 or 1

			if (v_oDrillArguments.packageDrill && v_nDrillThroughDetails)
			{
				this._extractPackageDrillArguments(v_oDrillArguments, v_nDrillThroughDetails);
			}

			/*bookmark,*/
			var v_bDrillThoughNewWindow = v_oDrillArguments.target == "_blank";

			var v_sSearchPath = v_oDrillArguments.args[0][1];
			var v_oCurrentThisContext = this;
			this._getCMInfo(v_sSearchPath).then(function(v_oCmObject)
			{
				var v_sDrillTargetId = v_oCmObject.id;

				var v_oLaunchSpec = this.createLaunchSpec(v_oCmObject, v_oDrillArguments.format, v_oDrillArguments.method, v_oDrillArguments.locale, v_oDrillArguments.sPrompt);

				var v_oDrillContext = {};

				// Extract edit specification option value and add to 'large' options
				var v_sEditSpecification = this._extractOption( v_nDrillThroughDetails, 'bus:specificationOptionXMLEncodedXML', 'editSpecification' );
				if (v_sEditSpecification && v_sEditSpecification.length > 0)
				{
					v_oDrillContext.editSpecification = v_sEditSpecification;
				}
				// Extract parameter values and add to 'large' options
				var v_nParameters = v_nDrillThroughDetails && v_nDrillThroughDetails.querySelector('parameters');
				if (v_nParameters)
				{
					var v_sParameterXML = ( new XMLSerializer() ).serializeToString( v_nParameters );
					if (v_sParameterXML && v_sParameterXML.length > 0)
					{
						v_oDrillContext.parameterValuesXML = v_sParameterXML;
					}
				}

				var v_oGlass = this.glassContext;
				var v_oGlassSettings = rsCommon.extractGlassSettings( this );

				if (v_bDrillThoughNewWindow)
				{
					v_oLaunchSpec.launchParametersKey = rsLaunchParameters.Store(v_oDrillContext);

					// Encode options as a JSON string to avoid unexpected changes to parameters
				    var v_oUrlMap =
					{
						objRef: v_sDrillTargetId,
						rsEncodedOptions: JSON.stringify(v_oLaunchSpec)
				    };

					// Transfer any glass settings that we are aware of
				    v_oUrlMap = $.extend( v_oUrlMap, v_oGlassSettings );

					v_oUrlMap.closeWindowOnLastView = true;
					v_oUrlMap.prefetchsvc = "disabled"; // this an optimization for the new window - it tells the glass to load less stuff


				    var v_sUrl = this.glassContext.getUrl( { urlMap: v_oUrlMap } );
				    var newWindow = window.open(v_sUrl, "_blank");
				    if (newWindow)
					{
				        newWindow.focus();
				    }
					this.f_restorePDF();
					this.hideWaitIndicator();
				}
				else
				{
					v_oLaunchSpec = $.extend(v_oLaunchSpec, v_oDrillContext);

					// Transfer any glass settings that we are aware of
					v_oLaunchSpec = $.extend( v_oLaunchSpec, v_oGlassSettings );

					// close the authoring perspective with the drill target id (if exists)
					v_oGlass.closeAppView("authoring", v_sDrillTargetId)
					// close the classicviewer perspective with the drill target id (if exists)
					.then(v_oGlass.closeAppView.bind(v_oGlass, "classicviewer", v_sDrillTargetId))
					// open a classicviewer perspective with the drill target id
					.then(v_oGlass.openAppView.bind(v_oGlass, undefined, { content: v_oLaunchSpec }))
					.then(function(targetAppView) {
						// wait for the appView to be created
						return targetAppView.onViewRendered();
					})
					.then(function() {
						this.f_restorePDF();
						this.hideWaitIndicator();
					}.bind(this));
				}
			}.bind(this))
			.catch(function(err) {
				var v_sSearchPath = err.message;
				var v_sMessage = "Content Manager did not return information for '" + v_sSearchPath + "'";
				v_oCurrentThisContext.glassContext.showToast(v_sMessage, { type: 'error' });
				console.warn('cvContentView.sendDrillThroughRequest could NOT load: %s', err);
			}).bind(this);
		},

		_getChildElementsByXsiType: function( v_nNode, v_sXsiType )
		{
			var v_aResult = [];
			if (v_nNode)
			{
				var v_nChildren = v_nNode.childNodes;
				for (var idx = 0; idx < v_nChildren.length; ++idx)
				{
					var v_nChild = v_nChildren.item(idx);
					if (v_nChild.nodeType == Node.ELEMENT_NODE && v_nChild.getAttributeNS('http://www.w3.org/2001/XMLSchema-instance', 'type') == v_sXsiType)
					{
						v_aResult.push( v_nChild );
					}
				}
			}
			return v_aResult;
		},

		// This function's existence is checked in Viewer's drill-from-pdf.xts
		f_restorePDF: function()
		{
			if (this.m_iFramePDF)
			{
				// refresh the PDF iframe
				var src = this.m_iFramePDF.src;
				this.m_iFramePDF.src = src;
			}
		},

		f_registerPDFIFrame: function(v_iFramePDF)
		{
			if (!this.m_iFramePDF)
			{
				// Set the PDF iframe if it is not set.  THis will happen when viewing saved PDF because the callback mechanism
				// to set it only works when running live reports.
				// This method should only be called by the pdfdrill perspective which is loaded in the PDF iframe on a drill through.
				// Therefore the window.parent is the classic viewer iframe so the query selector call returns the pdf iframe.
				this.m_iFramePDF = v_iFramePDF;
			}
		},

		/**
		 * This method is called from the page returned from the bi/v1/reports/drill/...
		 * or from the goto page cancel button
		 * Do not rename it.
		 * @param v_sMessage Optional error message.
		 */
		TerminateDrillFromPdf: function( v_sMessage )
		{
			if (v_sMessage)
			{
				this.glassContext.showToast( v_sMessage, { type: 'error' } );
			}
			this.f_restorePDF();
		},

		f_convertParametersfromXmlToJsonStr: function(v_nParameters)
		{
			// the node comes in as
			// <drillParameters>
			//    <param name="p_ProdLine">&lt;selectChoices&gt;&lt;selectOption useValue=&quot;Outdoor Protection&quot; displayValue=&quot;Outdoor Protection&quot;/&gt;&lt;/selectChoices&gt;</param>
			// </drillParameters>

			var v_aParameters = [];
			// walk through all the child nodes
			var v_nChildNode = v_nParameters.firstChild;
			while (v_nChildNode)
			{
				var v_oParameter = {};
				if (v_nChildNode.nodeName === "param")
				{
					// populate the name field with the v_nChildNode's name attribute and
					// strip off the p_
					v_oParameter.name = v_nChildNode.getAttribute("name");
					v_oParameter.name = v_oParameter.name.slice(2);

					v_oParameter.value = [];


					//
					// the textContent of the param node needs to be converted from string
					// 		&lt;selectChoices&gt;&lt;selectOption useValue=&quot;Outdoor Protection&quot; displayValue=&quot;Outdoor Protection&quot;/&gt;&lt;/selectChoices&gt;
					// 	to an XML doc
					// 	<selectChoices>
					//		<selectOption useValue="Outdoor Protection" displayValue="Outdoor Protection">
					//	</selectChoices>
					// so that is can be parsed
					var v_nSelectDoc = rsCommon.parseXML(v_nChildNode.textContent);

					// create a v_oParameter.value entry for each selectOption node
					var v_aSelectOptionNodes = v_nSelectDoc.getElementsByTagName("selectOption");
					for (var i = 0; i < v_aSelectOptionNodes.length; i++)
					{
						var v_oValue = {};

						if (v_aSelectOptionNodes[i].hasAttribute("displayValue"))
						{
							v_oValue.display = v_aSelectOptionNodes[i].getAttribute("displayValue");
						}
						v_oValue.use = v_aSelectOptionNodes[i].getAttribute("useValue");

						v_oParameter.value.push(v_oValue);
					}
				v_nChildNode = v_nChildNode.nextSibling;
				v_aParameters.push(v_oParameter);
				}
			}
			return JSON.stringify(v_aParameters);
		},


		_getCMInfo: function(v_sSearchPath)
		{
			var v_sSearchPathUrl = "v1/search_path?searchPath=" +
				encodeURIComponent(v_sSearchPath) +
				"&fields=id,type";

			return this.glassContext.services.fetch.get(v_sSearchPathUrl)
			.then( function(v_oCmInfoResponse) {
				return v_oCmInfoResponse.data.data[0];
			})
			.catch(function(v_oErr) {
				console.log('cvContentView.getCMInfo FAILED for "%s"', v_sSearchPathUrl);
				throw new Error(v_sSearchPath);
			});
		},

		_extractCmPathTermFromCmPathUrl: function(v_sCmPathUrl)
		{
			// Extract the "path" query-value from the path url
			// /bi/v1/path?path=.public_folders%2Fbugs%2Fcv-apar120836_pi88512-rtc200676-drillparams
			var v_sQuery = v_sCmPathUrl.split("?", 2)[1];
			var v_aFields = v_sQuery.split("&");
			for (var i = 0; i < v_aFields.length; ++i)
			{
				var v_aNameValue = v_aFields[i].split("=", 2);
				var v_sName = v_aNameValue[0], v_sValue = v_aNameValue[1];
				if (v_sName == "path")
				{
					return decodeURIComponent(v_sValue);
				}
			}
		},

		/**
		 * The classic viewer's updateNewBrowserWindow will invoke the backURL.
		 * In the case where a classic active report is being executed the
		 * viewer will open a new window to display the active report which then
		 * calls the opener window's viewer updateNewBrowserWindow method. The
		 * backRUL in this case actually closes the opener window (classic
		 * viewer). If the classic viewer is a child of this class (i.e. running
		 * in the glass) then closing the window does not work since the classic
		 * viewer is in an iframe. Instead, this method will try to close the
		 * current window and fall back to closing the perspective just in case
		 * the window close does not work.
		 */
		updateNewBrowserWindow: function()
		{
			if (this.m_iframeClassicViewer.contentWindow.getFormWarpRequest)
			{
				var v_oCognosViewer = this.getCognosViewer();
				var form = this.m_iframeClassicViewer.contentWindow.getFormWarpRequest();
				var v_sBackURL = v_oCognosViewer.m_bIgnoreCloseWindow ? "" : (form ? form["ui.backURL"].value : "");

				if (v_sBackURL == "javascript:window.close();") // eslint-disable-line no-script-url
				{
					// If we are in this code then we are in a classic viewer perspective so we
					// should close this window which is the classic viewer's parent since the cv is in an iframe.
					// We only close if there is only 1 perspective i.e. us.
					// Otherwise we close this perspective leaving all other perspectives open.
					// The logic to determine the perspective count makes use of glass internals and is not a public API.
					// This has to be revisited once glass provides an appropriate API.
					var doClose = this.glassContext.perspectiveSwitcherRegistry && this.glassContext.perspectiveSwitcherRegistry.registry && this.glassContext.perspectiveSwitcherRegistry.registry.length < 2;
					if (doClose)
					{
						try
						{
							window.close();
						}
						catch (e)
						{
							// In case the close failed, fall through to the close perspective code
						}
					}
					this.glassContext.closeAppView("classicviewer", this.id);
					return;
				}
			}
			this.original_updateNewBrowserWindow();
		},

		executeBackURL: function(s_CVId)
		{
			// get the cognos viewer
			var v_oCognosViewer = this.getCognosViewer();
			var form = this.m_iframeClassicViewer.contentDocument.getElementById("formWarpRequest" + (s_CVId ? s_CVId : ""));

			var v_sBackURL = v_oCognosViewer.m_bIgnoreCloseWindow ? "" : form["ui.backURL"].value;


			// see if there is a "CMODAL_FRAME" in the authoring document
			var v_nClassicViewerDialogFrame = this.m_iframeClassicViewer.contentDocument.getElementById("CMODAL_FRAME");
			// if there is a modal shown and the CModal class is available, hide the dialog box
			if (v_oCognosViewer.modalShown && v_nClassicViewerDialogFrame && v_nClassicViewerDialogFrame.CModal)
			{
				// hide the dialog
				v_nClassicViewerDialogFrame.CModal.hide();
				// reset the flag
				v_oCognosViewer.modalShown = false;
			}

			// the perspective is in an iframe, so we can not use window.close.
			// instead, we will call the class to close the current app view (which is us)
			if (v_sBackURL == "javascript:window.close();") // eslint-disable-line no-script-url
			{
				this.glassContext.closeAppView("classicviewer", this.id);
			}
			// otherwise call the original execBackURL method
			else
			{
				this.original_executeBackURL(s_CVId);
			}
			v_oCognosViewer.m_bIgnoreCloseWindow = undefined;
		},

		_createAndSubmitCollectParameterValuesForm: function(v_sStoreId, v_sUrl)
		{
			v_sUrl = decodeURIComponent(v_sUrl);
			var v_sParameters = v_sUrl.slice(v_sUrl.indexOf("?"));

			var v_elForm = document.createElement("form");
			v_elForm.target = this.m_iframeClassicViewer.name;
			v_elForm.method = "post";
			v_elForm.action = classicViewerGatewaySuffix + v_sParameters;
			v_elForm.style.display = "none";

			document.body.appendChild(v_elForm);
			v_elForm.submit();
			document.body.removeChild(v_elForm);
		},

		/**
		 * onload handler for classic viewer iframe
		 */
		_onLoad: function()
		{
			//console.log( "_onLoad");
			if (this.isViewerLoaded())
			{
				//console.log( "_onLoad viewer loaded");
				// Classic viewer exists so the viewer form post result was loaded
				this._onClassicViewerLoaded();
			}
			else if (this.m_fOnLoadHandler)
			{
				//console.log( "_onLoad launch viewer");
				// Call the classic viewer now that the iframe has been loaded by the glass
				this.m_fOnLoadHandler();
				// Ensure form is posted only once in case things go bad
				this.m_fOnLoadHandler = null;
			}
			else
			{
				//console.log( "_onLoad show viewer");
				// If we get here, something unexpected occurred.  Most likely, the viewer returned something
				// (error page) that does not signal cvContentView that it is there via window.OnErrorPage or
				// the classic viewer creation callback.
				// Show the viewer div in case there is something there.
				this._showViewer();
			}
		},

		_createAndSubmitNewForm: function()
		{
			//console.log( "_createAndSubmitNewForm");

			// APAR 120836 REPORT FAILS TO RUN IN IE11 IF THE DRILL-THROUGH PROMPTPARAMETER VALUES ARE LARGER THAN 2,083 CHAR LIMIT
			// Use a POST with form instead of GET request
			var v_elForm = document.createElement("form");
			v_elForm.target = this.m_iframeClassicViewer.name;
			v_elForm.method = "post";
			v_elForm.action = classicViewerGatewaySuffix;
			v_elForm.style.display = "none";

			var v_elInput = v_elForm.appendChild( document.createElement("input") );
			v_elInput.type = "hidden";
			v_elInput.name = "b_action";
			v_elInput.value = "cognosViewer";

			Object.keys(this.m_oRVFormParameters).forEach( function(key) {
					var v_elInput = v_elForm.appendChild( document.createElement("input") );
					v_elInput.type = "hidden";
					v_elInput.name = key;
					v_elInput.value = this.m_oRVFormParameters[key];
				},
				this);

			rsPromptParameters.cvAddPromptParameters(v_elForm, this.m_aPromptParameters, this.m_aPromptParametersComplex);

			document.body.appendChild(v_elForm);

			// if include performance details is selected, create an xml http request
			// and manually pass the X-CA-IPA header.
			if (this.m_oRVFormParameters.IncludePerformance == "true")
			{
				// concatenate the name and values into an array of name=values
				var v_saFormData = [];
				for (var i = 0; i < v_elForm.elements.length; i++)
				{
					var v_sElementName = v_elForm.elements[i].name;
					var v_sElementValue = v_elForm.elements[i].value;
					v_saFormData.push(encodeURIComponent(v_sElementName) + '=' + encodeURIComponent(v_sElementValue));
				}
				// encode formData elements into one string
				var v_sPostData = v_saFormData.join('&').replace(/%20/g, '+');

				var v_http = new XMLHttpRequest();

				var v_sBaseURI = v_elForm.action;
				var v_sName = this.id || "_classicViewer";
				v_http.onreadystatechange = function() {
					// insert server response into the classic viewer iFrame
					if (this.readyState == 4 && this.status == 200) {
						var v_nClassicViewerIframe = document.getElementsByName(v_sName)[0];
						var v_nIframeDocument = v_nClassicViewerIframe.contentDocument;
						var v_sHeadWithBase = '<head><base href="' + v_sBaseURI + '">';
						var v_sHtmlText = v_http.responseText.replace(/<head>/, v_sHeadWithBase);
						v_nIframeDocument.open();
						v_nIframeDocument.write(v_sHtmlText);
						v_nIframeDocument.close();
					}
				};

				v_http.open(v_elForm.method, v_elForm.action);
				v_http.setRequestHeader('Cache-Control', 'max-age=0');
				v_http.setRequestHeader('Upgrade-Insecure-Requests', '1');
				v_http.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
				v_http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				v_http.setRequestHeader('X-CA-IPA', '1');
				v_http.send(v_sPostData);
			}
			else
			{
				v_elForm.submit();
			}
			document.body.removeChild(v_elForm);
		},

		_setLocalSessionData: function(key, data)
		{
			if (typeof Storage !== "undefined")
			{
				localStorage.setItem(key, data);
			}
			else
			{
				console.log("Sorry! No Web Storage support...");
			}
		},

		loadClassicViewer: function()
		{
			//console.log("begin: cvContentView.loadClassicViewer" );
			this.m_fOnLoadHandler = this._createAndSubmitNewForm.bind(this);

			// If the viewer responds with an error page then the _onLoad will not find the viewer object
			// so the div visibility won't be adjusted.
			// Use the error page OnErrorPage callback to detect this and ensure the error page is displayed.
			window.OnErrorPage = function() {
				this._showViewer();
			}.bind(this);

			window[this.m_sCreateCallback] = this._onClassicViewerCreated.bind(this);

			var v_oMRU;
			if (this.getType() == "output")
			{
				if (this.reportProperties)
				{
					v_oMRU = $.extend(true, {}, this.reportProperties);
				}
			}
			else
			{
				if (this.cmProperties)
				{
					v_oMRU = $.extend(true, {}, this.cmProperties);
				}
			}
			if (v_oMRU)
			{
				console.log('add to MRU');
				this.glassContext.getSvc('.Content').then(function(contentSvc) {
					contentSvc.addToMRU(v_oMRU);
				});
			}

			// Instrumentation wants specific terms
			// Some glass actions won't be instrumented
			var v_oGlassActionToInstrumentationEventType = {
				'run': 'Ran Process',
				'viewOutput': 'Read Object',
			};
			var v_sInstrumentationType = v_oGlassActionToInstrumentationEventType[this.action];
			if (v_sInstrumentationType && this.glassContext)
			{
				var v_oInstrumentationService = this.glassContext.getCoreSvc('.Instrumentation');

				if (v_oInstrumentationService && v_oInstrumentationService.enabled)
				{
					var v_sType;
					var v_sId;
					if (this.type == 'output' && this.cmProperties)
					{
						// our opener code should fill in the parent chain
						// cmProperties.parent[0] is the reportVersion object
						// cmProperties.parent[0].parent[0] is the object that has output versions
						var v_oVersionedAncestor = this.cmProperties.parent[0].parent[0];
						v_oVersionedAncestor = (v_oVersionedAncestor.base && v_oVersionedAncestor.base[0]) || v_oVersionedAncestor;
						v_sType = v_oVersionedAncestor.type;
						v_sId = v_oVersionedAncestor.id;
					}
					else
					{
						v_sType = this.type;
						v_sId = this.id;
					}
					var v_oEvent = {
						type: v_sInstrumentationType,
						objectType: v_sType,
						object: v_sId,
						'custom.viewer': 'classic',
						'custom.outputFormat': this.format,
						milestoneName: v_sInstrumentationType + '_' + v_sType
					};

					if (v_sInstrumentationType === v_oGlassActionToInstrumentationEventType.run)
					{
						v_oEvent['processType'] = 'Run a Report';
					}

					v_oInstrumentationService.track( v_oEvent );
				}
			}
			//console.log("end: cvContentView.loadClassicViewer" );
		},

		getCognosViewer: function()
		{
			if (this.m_oCognosViewer)
			{
				return this.m_oCognosViewer;
			}
			var v_oViewer = null;
			if (this.m_iframeClassicViewer && this.m_iframeClassicViewer.contentWindow)
			{
				v_oViewer = this.m_iframeClassicViewer.contentWindow.oCV_NS_ || this.m_iframeClassicViewer.contentWindow.oCVRS || this.m_iframeClassicViewer.contentWindow.oCV_THIS_;
				if (v_oViewer)
				{
					this.m_oCognosViewer = v_oViewer;
				}
			}
			return v_oViewer;
		},

		/**
		 * Return whether or not a classic viewer or an RDS prompt page is loaded.
		 * This method is needed because the RDS prompt page used by collect parameter values does not have a real classic viewer so
		 * getCognosViewer returns null in this scenario but we still need to know if a prompt page was loaded.
		 */
		isViewerLoaded: function()
		{
			return this.getCognosViewer() || (this.m_iframeClassicViewer && this.m_iframeClassicViewer.contentWindow && this.m_iframeClassicViewer.contentWindow.oCV);
		},

		/*
			Get content is called by the SHARE team.  See RTC #82310

			they expect:
				.application {
					.storeID,			// Store ID in the CM, null if report not saved
					.cmSearthPath,		// Search Path in the CM of the report, null if report not saved
					.reportName,		// report name
					.isModified			// whether the report has beeen modified.  Set to false.

				}
				.promptParameters{
						.name,
						.value {
    	     				inclusive,		// true | false,
    	      				use,			// true | false,
    	      				display,		// "Run report with data",
    		      			type			// "simpleParmValueItem"
						}
					}
As per RTC #82310, the json format depends on the type of parameter:

// range (bound and unbound)
parameters: [
	{
		name: "string",
		value: [
			{
				inclusive: boolean,
				type,
				start: {
					inclusive: boolean,
					use: "string",
					display: "string",
				},
				end: {
					inclusive: boolean,
					use: "string",
					display: "string",
				}
			}
		]
	}
]
*/

	/*
		Story 86638
		Note: You will know glass is making this type of getContent(options) request when the passed in options contains
		{mode:'bookmark'}. If the options argument is missing or does not contain "mode":"bookmark", you can interpret it as a "Full state" request.
		It's ok for both calls to return the same state. It's completely up to you and your implementation.
	*/
		getContent: function(options)
		{
			//console.log("cvContentView.getContent" );
			return rsCommon.getContent( options, this, rptShareHelper );
		},

		getApplicationContent: function( v_oContent, v_oCmProperties )
		{
			var application = {};
			application.storeID = this.cmProperties && this.cmProperties.id;
			application.cmSearchPath = !rsCommon.isObjectOfType(this.cmProperties, 'output') && this.getSearchPath();
			application.reportName = this.getTitle();
			application.isModified = false;
			application.type = (this.cmProperties && this.cmProperties.type) || undefined;

			return application;
		},

		getParametersFromViewer: function()
		{
			let v_aGlassParameters = [];

			try
			{
				const v_oCV = this.getCognosViewer();
				if (v_oCV)
				{
					v_aGlassParameters = rsPromptParameters.convertBusParametersToJson( v_oCV.getExecutionParameters() );
				}
			}
			catch (err)
			{
				console.log("cvContentView.getParametersFromViewer failed (%s) ", err.message);
			}

			//console.log("GlassParameters = ", v_aGlassParameters);

			return v_aGlassParameters;
		},

		/**
		 * This method gets the parameters from the application
		 * This is a public method used by other components and as such
		 * must be defined in both rs and cv content views.
		 */
		getParameterValues: function( bStripCredentials )
		{
			var v_aParameterValues = this.getParametersFromViewer();
			if (bStripCredentials && v_aParameterValues)
			{
				var v_aParameters = [];
				if (v_aParameterValues.length > 0)
				{
					v_aParameterValues.forEach( function(v_oParameter)
					{
						if (!bStripCredentials || !v_oParameter || !v_oParameter.name || v_oParameter.name.indexOf("credential:") != 0)
						{
							v_aParameters.push( v_oParameter );
						}
					});
					v_aParameterValues = v_aParameters;
				}
			}
			return v_aParameterValues;
		},

		deactivate: function()
		{
			this.m_bDeactivated = true;
			this.glassContext.unlockGlass();
			//console.log("cvContentView.deactivate()");
		},

		/**
		 * This method is called from the iframe onunload event.
		 * The problem is that the viewer release method results in a synchronous XMLHttpRequest which browsers complain about.
		 * Ideally we should be using the glass remove() method instead.  But when glass calls remove, they have already
		 * removed the content view div which means our iframe has already been unloaded so there is no longer a viewer
		 * on which we can call release().
		 */
		_release: function()
		{
			var v_oViewer = this.getCognosViewer();
			if (v_oViewer)
			{
				// Once viewer releases it's conversation, it is no longer functional
				// so ensure we can no longer talk to it.
				this.m_oCognosViewer = null;
				try
				{
					// only call release if the viewer isn't keeping the session alive
					if ( !v_oViewer.getKeepSessionAlive() )
					{
						v_oViewer.release();
						delete window[this.m_sCreateCallback];
					}
				}
				catch (e)
				{
					// Ignore
				}
			}
			this.m_oAppView = null;
		},

		canRun: function()
		{
			// this perspective is only used when a report is run
			return g_bIsOnReportPage;
		},

		/**
		 * Called by global parameter flyout to determine what parameters are used by the currently active view.
		 * @return Array of parameter names currently in use by the report.
		 */
		getParameters: function()
		{
			var v_aParameters = this.getParametersFromViewer();
			return rsPromptParameters.convertParameterArrayToObject(v_aParameters);
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
			var v_oCognosViewer = this.getCognosViewer();

			if (v_oCognosViewer && v_oCognosViewer.updateGlobalParameters && v_oNewGlobalParameters)
			{
				var v_aGlobalParametersDelta = rsCommon.convertToArray( v_oNewGlobalParameters );
				v_oCognosViewer.updateGlobalParameters( JSON.stringify( v_aGlobalParametersDelta ) );
			}
		},

		/**
		 * Called by Collaboration to retrieve the DOM node for screen capturing and report's name.
		 * @returns {array} Array of objects containing the DOM element and the name.
		 */
		getShareableItemsForCollaboration: function()
		{
			// console.log('cvContentView.getShareableItemsForCollaboration');
			if (this.m_bFullyInitialized && this.m_iframeClassicViewer)
			{
					var doc = this.m_iframeClassicViewer.contentDocument;
					var body = doc.body;
					return [{
						el: body,
						label: this.m_sTitle
					}];
			}
			return [];
		},

		/**
		 * setFocus will be called whenever glass want to put focus inside contentView.
		 *  here, the code will check if clasical viewer is loaded then focus inside report viewer
		 */
		setFocus: function setFocus()
		{
			if (this.isViewerLoaded())
			{
				var doc = this.m_iframeClassicViewer.contentWindow.document;
				var rvContent = doc.getElementById("RVContent" + this.getCognosViewer().getId());

				if (rvContent)
				{
					var el = this.getFirstFocus(rvContent);
					if (el)
					{
						el.focus();
					}
				}
			}
			else
			{
				cvContentView.inherited('setFocus', this, arguments); // eslint-disable-line prefer-rest-params
			}
		},

		getFirstFocus: function(v_elTop, v_elParent)
		{
				var v_elParent = v_elParent || v_elTop;

				var v_elFocus;
				var v_iLength = v_elParent.childNodes.length;
				for ( var i = 0; i < v_iLength && !v_elFocus; i++ )
				{
					var v_elChild = v_elParent.childNodes[i];
					var v_bDisabled = ( v_elChild.disabled ||
										( v_elChild.getAttribute && ( v_elChild.getAttribute( "disabled" ) == "true" || v_elChild.getAttribute( "aria-disabled" ) == "true" ) )
									);
					if ( ( !v_bDisabled || this.isToolbarButton( v_elChild ) ) && v_elChild.style && v_elChild.style.visibility != "hidden" && v_elChild.style.display != "none" )
					{
						if ( v_elChild.nodeName == "INPUT" && v_elChild.type == "radio" )
						{
							v_elFocus = this.getCheckedOrFirstRadioButtonInGroup( v_elTop, v_elChild.getAttribute( "name" ) );
						}
						else if ( this.isOKToFocus( v_elChild ) )
						{
							v_elFocus = v_elChild;
						}
						else
						{
							v_elFocus = this.getFirstFocus( v_elTop, v_elChild );
						}
					}
				}
				return v_elFocus;
		},

		isToolbarButton: function( el )
		{
			if ( el.getAttribute )
			{
				var v_sRole = el.getAttribute( "role" );
				if ( v_sRole == "button" || v_sRole == "combobox" )
				{
					for ( ; el; el = el.parentNode )
					{
						if ( el.getAttribute && el.getAttribute( "role" ) == "toolbar" )
						{
							return true;
						}
					}
				}
			}
			return false;
		},

		getCheckedOrFirstRadioButtonInGroup: function( v_elContainer, v_sRadioGroupName )
		{
			var v_elRadioChecked;
			var v_elFirstRadio;
			var nl = v_elContainer.getElementsByTagName( "INPUT" );
			var v_iLength = nl.length;
			for ( var i = 0; i < v_iLength; i++ )
			{
				var v_el = nl.item( i );
				if ( v_el.type == "radio" && v_el.name == v_sRadioGroupName )
				{
					if ( !v_elFirstRadio )
					{
						v_elFirstRadio = v_el;
					}
					if ( v_el.checked == true )
					{
						v_elRadioChecked = v_el;
						break;
					}
				}
			}
			return v_elRadioChecked || v_elFirstRadio;
		},

		isOKToFocus: function( v_el )
		{
			var v_iTabindex = parseInt( v_el.getAttribute( "tabIndex" ) );
			return ( v_iTabindex >= 0 ||
						( ( v_el.nodeName == "INPUT" || v_el.nodeName == "BUTTON" || v_el.nodeName == "TEXTAREA" ) && v_iTabindex != -1 ) );
		}
	});

	return cvContentView;
});

// Licensed Materials  - Property of IBM
// IBM Cognos Products: rs
// (C) Copyright IBM Corp. 2015, 2022
// US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

define('bi/classicviewer/plugins/cvAppEditButtonAction',['bi/glass/app/plugins/ButtonActionInterface'], function(ButtonActionInterface) {
	'use strict';

	const ClassicViewerEditButtonActionInterface = ButtonActionInterface.extend({

		onPress: function(context)
		{
			console.log("cvAppEditButtonAction pressed");
			console.log('context.target.plugin.itemSpec.id: %s', context.target.plugin.itemSpec.id);

			this.runAuthoring(context);
		},

		runAuthoring: function(context)
		{
			const v_oContentView = context.glassContext.currentAppView.currentContentView;
			const v_sStoreId = v_oContentView.m_behaviour.getReportStoreId();

			const v_oOpenAppViewContent = {
				action: 'edit',
				cmProperties: { id: v_sStoreId }
			};
			const v_aParameters = v_oContentView.getParameterValues();
			if (v_aParameters && v_aParameters.length > 0)
			{
				v_oOpenAppViewContent.promptParameters = JSON.stringify( v_aParameters );
			}

			// When drilling, target is opened with closeWindowOnLastView=true
			// As a result, if the perspective is closed, the glass actually closes the window.
			// Therefore, open the authoring perspective for edit first.
			context.glassContext
				.openAppView("authoring", { content: v_oOpenAppViewContent } )
				.then(function() {
					context.glassContext.closeAppView("classicviewer", v_sStoreId);
				});
		}
	});
	return ClassicViewerEditButtonActionInterface;
});

// Licensed Materials  - Property of IBM
// IBM Cognos Products: rs
// (C) Copyright IBM Corp. 2015, 2022
// US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

define('bi/classicviewer/plugins/cvAppFormatMenuActions',['bi/glass/app/plugins/MenuActionInterface', 'bi/authoring/utils/rsOpenHelper', 'bi/authoring/utils/pat/rsCommon'], function(MenuActionInterface, OpenHelper, rsCommon) {
	'use strict';

	function resolveHtmlFormat(v_sMenuItem)
	{
		switch (v_sMenuItem)
		{
			case "com.ibm.bi.classicviewer.formatXHtml":
				return 'XHTML';
			case "com.ibm.bi.classicviewer.formatHtmlFragment":
				return 'HTMLFragment';
			case "com.ibm.bi.classicviewer.formatXHtmlFragment":
				return 'XHTMLFragment';
			case "com.ibm.bi.classicviewer.formatHtml":
			default:
				return 'HTML';
		}
	}

	var OutputMenu = MenuActionInterface.extend({

		onSelectItem: function(context)
		{
			const v_sMenuItem = context.target.itemId;
			const v_oCvContentView = context.glassContext.currentAppView.currentContentView;
			if (v_oCvContentView)
			{
				if (v_oCvContentView.type == "output")
				{
					// Formats for saved output
					const v_oOutputLookup = v_oCvContentView.outputFormatLookup;
					let v_sPerspective = "classicviewer";
					let v_oOutput;
					switch ( v_sMenuItem )
					{
						case "com.ibm.bi.classicviewer.formatHtml":
						case "com.ibm.bi.classicviewer.formatXHtml":
						case "com.ibm.bi.classicviewer.formatHtmlFragment":
						case "com.ibm.bi.classicviewer.formatXHtmlFragment":
							v_oOutput = v_oOutputLookup[resolveHtmlFormat(v_sMenuItem)];
							if (v_oOutput.dataDescriptor && v_oOutput.dataDescriptor.type == "interactive")
							{
								v_sPerspective = "authoring";
							}
							break;

						case "com.ibm.bi.classicviewer.formatPdf":
							v_oOutput = v_oOutputLookup["PDF"];
							break;

						case "com.ibm.bi.classicviewer.formatExcel2007":
							v_oOutput = v_oOutputLookup["spreadsheetML"];
							break;

						case "com.ibm.bi.classicviewer.formatExcel2007data":
							v_oOutput = v_oOutputLookup["xlsxData"];
							break;

						case "com.ibm.bi.classicviewer.formatCsv":
							v_oOutput = v_oOutputLookup["CSV"];
							break;

						case "com.ibm.bi.classicviewer.formatXml":
							v_oOutput = v_oOutputLookup["XML"];
							break;

						default:
							console.error("cvAppFormatMenuActions - unexpected ID " + v_sMenuItem);
					}

					if (rsCommon.isOutputForDownload(v_oOutput.format))
					{
						// &download is required to force content-disposition to attachment.
						// Otherwise it returns content disposition inline
						// ... which replaces the page in some browsers
						var v_sURL = "v1/disp/repository/sid/cm/oid/" + v_oOutput.id + "/content?download=true";
						var v_sFileName = rsCommon.generateSavedOutputName( v_oOutput, false) + rsCommon.outputTypeToFileExtension(v_oOutput.format);

						rsCommon.download(v_sURL, v_sFileName);
					}
					else
					{
						const v_oContent = {
								reportProperties: v_oCvContentView.reportProperties,
								type: 'output',
								cmProperties: v_oOutput,
								outputFormatLookup: v_oOutputLookup,
								id: v_oOutput.id
							};
						context.glassContext.openAppView(v_sPerspective, { content: v_oContent } );
					}
				}
				else
				{
					// Formats for live output
					var v_oCognosViewer = v_oCvContentView.getCognosViewer();
					if (!v_oCognosViewer)
					{
						return;
					}
					switch ( v_sMenuItem )
					{
						case "com.ibm.bi.classicviewer.formatHtml":
							v_oCognosViewer.getRV().viewReport("HTML");
							v_oCvContentView.setFormatMenuTitle("HTML");
							break;

						case "com.ibm.bi.classicviewer.formatXHtml":
						case "com.ibm.bi.classicviewer.formatHtmlFragment":
						case "com.ibm.bi.classicviewer.formatXHtmlFragment":
							// Do nothing - the isItemVisible should have removed these.
							break;

						case "com.ibm.bi.classicviewer.formatPdf":
							// Prevent launching viewer in new window when accessibility is on
							v_oCognosViewer.getRV().viewReport("PDF", true);
							v_oCvContentView.setFormatMenuTitle("PDF");
							break;

						case "com.ibm.bi.classicviewer.formatExcel2007":
							v_oCognosViewer.getRV().viewReport("spreadsheetML");
							v_oCvContentView.setFormatMenuTitle("spreadsheetML");
							break;

						case "com.ibm.bi.classicviewer.formatExcel2007data":
							v_oCognosViewer.getRV().viewReport("xlsxData");
							v_oCvContentView.setFormatMenuTitle("xlsxData");
							break;

						case "com.ibm.bi.classicviewer.formatCsv":
							v_oCognosViewer.getRV().viewReport("CSV");
							v_oCvContentView.setFormatMenuTitle("CSV");
							break;

						case "com.ibm.bi.classicviewer.formatXml":
							v_oCognosViewer.getRV().viewReport("XML");
							v_oCvContentView.setFormatMenuTitle("XML");
							break;

						default:
							console.error("cvAppFormatMenuActions - unexpected ID " + v_sMenuItem);
					}
				}
			}
		},

		isItemVisible: function(context)
		{
			const v_sMenuItem = context.target.itemId;
			const v_oCvContentView = context.glassContext.currentAppView.currentContentView;
			if (v_oCvContentView)
			{
				if (v_oCvContentView.type == "output")
				{
					// Formats for saved output
					const v_oOutputLookup = v_oCvContentView.outputFormatLookup;
					switch (v_sMenuItem)
					{
						case "com.ibm.bi.classicviewer.formatHtml":
						case "com.ibm.bi.classicviewer.formatXHtml":
						case "com.ibm.bi.classicviewer.formatHtmlFragment":
						case "com.ibm.bi.classicviewer.formatXHtmlFragment":
							return v_oOutputLookup[resolveHtmlFormat(v_sMenuItem)] != undefined;

						case "com.ibm.bi.classicviewer.formatPdf":
							return v_oOutputLookup["PDF"] != undefined;

						case "com.ibm.bi.classicviewer.formatExcel2007":
							return v_oOutputLookup["spreadsheetML"] != undefined;

						case "com.ibm.bi.classicviewer.formatExcel2007data":
							return v_oOutputLookup["xlsxData"] != undefined;

						case "com.ibm.bi.classicviewer.formatCsv":
							return v_oOutputLookup["CSV"] != undefined;

						case "com.ibm.bi.classicviewer.formatXml":
							return v_oOutputLookup["XML"] != undefined;

						default:
							console.error("cvAppFormatMenuActions - unexpected ID " + v_sMenuItem);
					}
				}
				else
				{
					// Formats for live output
					switch (v_sMenuItem)
					{
						case "com.ibm.bi.classicviewer.formatHtml":
							return true;

						case "com.ibm.bi.classicviewer.formatXHtml":
						case "com.ibm.bi.classicviewer.formatHtmlFragment":
						case "com.ibm.bi.classicviewer.formatXHtmlFragment":
							// These formats can only be produced using the classic run as UI
							return false;

						case "com.ibm.bi.classicviewer.formatPdf":
							return context.glassContext.hasCapability("canGeneratePDFOutput");

						case "com.ibm.bi.classicviewer.formatExcel2007":
						case "com.ibm.bi.classicviewer.formatExcel2007data":
							return context.glassContext.hasCapability("canGenerateXLSOutput");

						case "com.ibm.bi.classicviewer.formatCsv":
							return context.glassContext.hasCapability("canGenerateCSVOutput");

						case "com.ibm.bi.classicviewer.formatXml":
							return context.glassContext.hasCapability("canGenerateXMLOutput");

						default:
							console.error("cvAppFormatMenuActions - unexpected ID " + v_sMenuItem);
					}
				}
			}
			return false;
		}
	});
	return OutputMenu;
});

// Licensed Materials  - Property of IBM
// IBM Cognos Products: rs
// (C) Copyright IBM Corp. 2022
// US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

define('bi/classicviewer/plugins/cvAppRunButtonAction',['bi/glass/app/plugins/MenuActionInterface', 'bi/authoring/utils/rsOpenHelper'], function(MenuActionInterface, rsOpenHelper) {
	'use strict';

	const ClassicViewerRunButtonAction = MenuActionInterface.extend({

		onPress: function(context) {
			const v_oCvContentView = context.glassContext.currentAppView.currentContentView;
			if (v_oCvContentView)
			{
				if (v_oCvContentView.type == "output")
				{
					const v_oReportProperties = v_oCvContentView.reportProperties;

					rsOpenHelper
						.openView({
							cmProperties: v_oReportProperties,
							actionId: "com.ibm.bi.authoring.run",
							glassContext: context.glassContext,
							runOptions: { format: (v_oCvContentView.cmProperties.format || v_oCvContentView.format), prompt: true }
						})
						.catch( function(err) {
							console.error('cvAppRunButtonAction.onPress ... FAILED');
						});
				}
				else
				{
					const v_oCognosViewer = v_oCvContentView.getCognosViewer();
					if (v_oCognosViewer)
					{
						v_oCognosViewer.getRV().RunReport([
							{ "name": "run.prompt", "value": "true" },
							{ "name": "cv.reuseConversation", "value": "true" }
						]);
					}
				}
			}
		}

	});
	return ClassicViewerRunButtonAction;
});

// Licensed Materials  - Property of IBM
// IBM Cognos Products: rs
// (C) Copyright IBM Corp. 2022
// US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

define('bi/classicviewer/plugins/cvAppRefreshButtonAction',['bi/glass/app/plugins/MenuActionInterface', 'bi/authoring/utils/rsOpenHelper'], function(MenuActionInterface, rsOpenHelper) {
	'use strict';

	const ClassicViewerRefreshButtonAction = MenuActionInterface.extend({

		onPress: function(context) {
			const v_oCvContentView = context.glassContext.currentAppView.currentContentView;
			if (v_oCvContentView)
			{
				const v_oCognosViewer = v_oCvContentView.getCognosViewer();
				if (v_oCognosViewer)
				{
					v_oCognosViewer.getRV().RunReport([
						{ "name": "run.prompt", "value": "false" },
						{ "name": "cv.reuseConversation", "value": "false" }
					]);
				}
			}
		}

	});
	return ClassicViewerRefreshButtonAction;
});

// Licensed Materials  - Property of IBM
// IBM Cognos Products: rs
// (C) Copyright IBM Corp. 2015, 2022
// US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

define('bi/classicviewer/plugins/cvAppSaveMenuActions',[
    'bi/glass/app/plugins/MenuActionInterface',
    'bi/classicviewer/nls/StringResource'],
function(MenuActionInterface, StringResource) {
	'use strict';

	var ClassicViewerSaveMenu = MenuActionInterface.extend({

		onSelectItem: function(context)
		{
			const v_sMenuItem = context.target.itemId;
			const v_oContentView = context.glassContext.getCurrentContentView();
			const v_oCognosViewer = v_oContentView.getCognosViewer();

			if (!v_oCognosViewer)
			{
				return;
			}

			v_oCognosViewer.m_bIgnoreCloseWindow = undefined;

			console.log("cvAppSaveMenuActions.onSelectItem selected item %s", v_sMenuItem);

			switch ( v_sMenuItem )
			{
				case "com.ibm.bi.classicviewer.keepVersion_Save":
					var m_oCmProperties = v_oContentView.cmProperties;
					if (m_oCmProperties && m_oCmProperties.permissions.indexOf("write") != -1)
					{
						v_oCognosViewer.m_bIgnoreCloseWindow = true;
						v_oCognosViewer.getRV().SaveReport(true);
					}
					else
					{
						context.glassContext.showToast(StringResource.get('no_write_permission'), { type: 'error' });
					}
					break;

				case "com.ibm.bi.classicviewer.keepVersion_ReportView":
					v_oCognosViewer.m_bIgnoreCloseWindow = true;
					v_oCognosViewer.getRV().SaveAsReportView(true);
					break;

				default:
					console.log('unhandled menu item');
			}
		},

		isItemVisible: function(context)
		{
			const v_sMenuItem = context.target.itemId;
			const v_oContentView = context.glassContext.getCurrentContentView();

			if (!v_oContentView) {
				return true;
			}

			const v_oCognosViewer = v_oContentView.getCognosViewer();

			if (!v_oCognosViewer)
			{
				return false;
			}

			let v_bResult;
			switch (v_sMenuItem)
			{
				case "com.ibm.bi.classicviewer.keepVersion_Save":
					v_bResult = false;
					break;

				case "com.ibm.bi.classicviewer.keepVersion_ReportView":
					// Need an actual object to save as report view.  Use presence of cmProperties to determine this requirement.
					v_bResult = !!v_oContentView.cmProperties;
					break;

				default:
					v_bResult = true;
					break;
			}

			return v_bResult;
		}

	});
	return ClassicViewerSaveMenu;
});

// Licensed Materials  - Property of IBM
// IBM Cognos Products: rs
// (C) Copyright IBM Corp. 2015, 2020
// US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

define('bi/classicviewer/plugins/cvContextMenuActions',['bi/glass/app/plugins/MenuActionInterface', 'jquery'], function(MenuActionInterface, $) {
'use strict';
var cvContextMenuActions = MenuActionInterface.extend({

	onSelectItem: function(context)
	{
		console.log("cvContextMenuActions.onSelectItem");
		var v_oFirstSelectedContext = context.target.activeObject.aSelectedContext[0];

		var v_oContent = {
			id: v_oFirstSelectedContext.id,
			selectedContext: $.extend(true, {}, v_oFirstSelectedContext)
		};

		context.glassContext.openAppView("classicviewer", { content: v_oContent } );
	},

	isItemVisible: function(context)
	{
		console.log("cvContextMenuActions.isItemVisible");
		var v_aSelectedContext = context.target.activeObject.aSelectedContext;
		if (v_aSelectedContext.length !== 1)
		{
			console.log("aSelectedContext.length: %d", context.target.activeObject.aSelectedContext.length);
			return false;
		}

		var v_oFirstSelectedContext = v_aSelectedContext[0];

		var v_aReportTypes = ['report', 'interactiveReport', 'query', 'reportTemplate'];
		var v_bReportType = v_aReportTypes.indexOf( v_oFirstSelectedContext.type ) !== -1;

		var v_aPermissions = v_oFirstSelectedContext.permissions;
		if (v_bReportType)
		{
			if ( context.target.itemId == "com.ibm.bi.classicviewer.viewerDefaultRunAction" )
			{
				return (v_aPermissions.indexOf("execute") != -1);
			}
		}
		return false;
	}

});

return cvContextMenuActions;
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


define("js/classicviewer/bundle", function(){});
