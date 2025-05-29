/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| BI and PM: prmt
 *| (C) Copyright IBM Corp. 2002, 2021
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
*/


/*
	TEMPORARILY DUPLICATE CONTENT OF constants.js HERE FOR STUDIOS USING prompting.js
*/
var K_PRMT_DEBUG = 0;
var K_PRMT_DEBUG_TABLEBORDER = 0;

var K_PRMT_sAPOS = "'";
var K_PRMT_sEMPTY = "";
var K_PRMT_sBACKSLASH = "\\";
var K_PRMT_sCOLON = ":";
var K_PRMT_sDBL_BACKSLASH = K_PRMT_sBACKSLASH + K_PRMT_sBACKSLASH;
var K_PRMT_sDOT = ".";
var K_PRMT_sEQ_QU = '="';
var K_PRMT_sG = "g";
var K_PRMT_sGI = "gi";
var K_PRMT_sGT = ">";
var K_PRMT_sLT = "<";
var K_PRMT_sSL = "/";
var K_PRMT_sSP = " ";
var K_PRMT_sQU = '"';
var K_PRMT_sQU_encoded = "&quot;";
var K_PRMT_sLT_SL = K_PRMT_sLT + K_PRMT_sSL;
var K_PRMT_sIMG_ERROR_PREFIX = "PRMT_IMG_ERROR_";
var K_PRMT_sTIME_MIN = "T00:00:00.000";
var K_PRMT_sTIME_MAX = "T23:59:59.999";

var K_PRMT_sDV = "dv";
var K_PRMT_sNULLUSE = "nullUse";
var K_PRMT_sUSE = "use";
var K_PRMT_sDISPLAY = "display";

var K_PRMT_sATTR_DISABLED = "@disabled";
var K_PRMT_sATTR_DISPLAY_VALUE = "@displayValue";
var K_PRMT_sATTR_NULL = "@nullUse";
var K_PRMT_sATTR_USE_VALUE = "@useValue";

var K_PRMT_sDEFAULTSKIN = "../skins/corporate";
var K_PRMT_sBOOLEAN = "boolean";
var K_PRMT_sFUNCTION = "function";
var K_PRMT_sOBJECT = "object";
var K_PRMT_sSTRING = "string";
var K_PRMT_sUNDEFINED = "undefined";
var K_PRMT_sXML = "XML";

var K_PRMT_sCLS_DISABLED = "clsDisabled";

var K_PRMT_sINTERVAL_PREFIX = "PRMT_INTERVAL_";
var K_PRMT_sINTERVAL_NEGATIVE = "negative";
var K_PRMT_sINTERVAL_DAYS = "days";
var K_PRMT_sINTERVAL_HOURS = "hours";
var K_PRMT_sINTERVAL_MINUTES = "minutes";
var K_PRMT_sINTERVAL_SECONDS = "seconds";
var K_PRMT_sINTERVAL_MILLIS = "millis";

var K_PRMT_sLIST_BOX_SELECT_PREFIX = "PRMT_LIST_BOX_SELECT_";
var K_PRMT_sLIST_BUTTON_INSERT_PREFIX = "PRMT_LIST_BUTTON_INSERT_";
var K_PRMT_sLIST_BUTTON_REMOVE_PREFIX = "PRMT_LIST_BUTTON_REMOVE_";
var K_PRMT_sLIST_FEEDBACK_PREFIX = "PRMT_FB_";
var K_PRMT_sLIST_LINK_DESELECT_PREFIX = "PRMT_LIST_LINK_DESELECT_";
var K_PRMT_sLIST_LINK_SELECT_PREFIX = "PRMT_LIST_LINK_SELECT_";

var K_PRMT_sNO_SUBMIT = "NO_SUBMIT";

var K_PRMT_sRANGE_FROM_PREFIX = "F_";
var K_PRMT_sRANGE_ROW_DEFAULT_PREFIX = "PRMT_RANGE_DEFAULT_";
var K_PRMT_sRANGE_ROW_INPUT_PREFIX = "PRMT_RANGE_INPUT_";
var K_PRMT_sRANGE_TO_PREFIX = "T_";
var K_PRMT_RANGE_FORCE_BOUNDRANGE = "@forceBoundRange";

var K_PRMT_sSV_LINK_DESELECT_PREFIX = "PRMT_SV_LINK_DESELECT_";
var K_PRMT_sSV_LINK_SELECT_PREFIX = "PRMT_SV_LINK_SELECT_";
var K_PRMT_sSV_PREFIX = "PRMT_SV_";

var K_PRMT_sTB_PREFIX = "PRMT_TB_";
var K_PRMT_ALERT_CHOICES_SUFFIX = "choices";

var K_PRMT_reBLANK_STRING = new RegExp( "^\\s*$" );
var K_PRMT_reINTERVAL_FORMAT = new RegExp( "\\s*(-)?\\s*(\\d+\\s+)?\\s*(\\d+)?\\s*(:\\d+)?\\s*(:\\d+)?\\s*(\\.\\d+\\s*)?$" );
var K_PRMT_reINTERVAL_NODIGITS = new RegExp( "[^\\d]", K_PRMT_sG );
var K_PRMT_reQU = new RegExp( K_PRMT_sQU, K_PRMT_sG );
var K_PRMT_reXSD_FORMAT = new RegExp( "(-)?P(\\d+D)?T?(\\d+H)?(\\d+M)?(\\d+)?(\\.\\d+S)?" );
var K_PRMT_reTIMEPART = new RegExp( "(T\\d\\d:\\d\\d:\\d\\d\\.\\d\\d\\d)?$" );

var K_ACTION_BACK = "back";
var K_ACTION_CANCEL = "cancel";
var K_ACTION_FINISH = "finish";
var K_ACTION_FORWARD = "forward";
var K_ACTION_NEXT = "next";
var K_ACTION_PROMPT = "prompt";
var K_ACTION_REPROMPT = "reprompt";
var K_ACTION_SEARCH = "search";

// custom labels
// constants specific to C_Choices
var K_PRMT_LABEL_CHOICES = "@choicesText";
var K_PRMT_LABEL_INSERT = "@insertText";
var K_PRMT_LABEL_REMOVE = "@removeText";
var K_PRMT_LABEL_CHOICES_SELECT_ALL = "@choicesSelectAllText";
var K_PRMT_LABEL_CHOICES_DESELECT_ALL = "@choicesDeselectAllText";
var K_PRMT_LABEL_RESULTS_SELECT_ALL = "@resultsSelectAllText";
var K_PRMT_LABEL_RESULTS_DESELECT_ALL = "@resultsDeselectAllText";

// select value
var K_PRMT_LABEL_DESELECT = "@deselectText";

// range
var K_PRMT_LABEL_RANGE_FROM = "@fromText";
var K_PRMT_LABEL_RANGE_TO = "@toText";
var K_PRMT_LABEL_RANGE_LOWEST = "@lowestValueText";
var K_PRMT_LABEL_RANGE_HIGHEST = "@highestValueText";

// search
var K_PRMT_LABEL_SEARCH_KEYWORDS = "@keywordsText";
var K_PRMT_LABEL_SEARCH_INSTRUCTIONS_TEXT = "@searchInstructionsText";
var K_PRMT_LABEL_SEARCH_BTN_LABEL = "@searchText";
var K_PRMT_LABEL_SEARCH_OPTIONS_TEXT = "@optionsText";
var K_PRMT_LABEL_SEARCH_RESULTS_TEXT = "@resultsText";

// interval
var K_PRMT_LABEL_INTERVAL_DAYS = "@daysText";
var K_PRMT_LABEL_INTERVAL_HOURS = "@hoursText";
var K_PRMT_LABEL_INTERVAL_MINUTES = "@minutesText";
var K_PRMT_LABEL_INTERVAL_SECONDS = "@secondsText";
var K_PRMT_LABEL_INTERVAL_MILLISECONDS = "@millisecondsText";

// tree
var K_PRMT_TREE_MOVE_UP = -1;
var K_PRMT_TREE_MOVE_DOWN = 1;
var K_PRMT_TREE_MOVE_PARENT_LEVEL = -2;
var K_PRMT_TREE_MOVE_CHILD_LEVEL = 2;
var K_PRMT_TREE_EXPAND = 1;
var K_PRMT_TREE_COLLAPSE = -1;

var K_PRMT_FOCUS_MOVE_UP = -1;
var K_PRMT_FOCUS_MOVE_DOWN = 1;

// keycodes
var K_KEY_LEFT = 0x25;
var K_KEY_UP = 0x26;
var K_KEY_RIGHT = 0x27;
var K_KEY_DOWN = 0x28;
var K_KEY_SPACE = 0x20;
var K_KEY_ENTER = 0x0d;
var K_KEY_TAB = 0x09;

// CSS classnames
var K_PRMT_CSS_CHECKBOX_CHECKED = "dijitInline dijitCheckBox dijitCheckBoxChecked";
var K_PRMT_CSS_RADIOBUTTON_CHECKED = "dijitInline dijitRadio dijitRadioChecked";
var K_PRMT_CSS_CHECKBOX = "dijitInline dijitCheckBox";
var K_PRMT_CSS_RADIOBUTTON = "dijitInline dijitRadio";
var K_PRMT_CSS_CHECKBOX_PARTIAL = "dijitInline dijitCheckBox dijitCheckBoxMixed";

var K_PRMT_TREE_TOGGLE_CLOSED = "dijitTreeExpando dijitTreeExpandoClosed";
var K_PRMT_TREE_TOGGLE_OPENED = "dijitTreeExpando dijitTreeExpandoOpened";
var K_PRMT_TREE_TOGGLE_NONE = "dijitTreeExpando dijitTreeExpandoNone";
var K_PRMT_TREE_TOGGLE_TEXT = "dijitExpandoText";

// ARIA, tree roles
var K_PRMT_ARIA_ROLE = "role";
var K_PRMT_ARIA_SELECTED = "aria-selected";
var K_PRMT_ARIA_CHECKED = "aria-checked";
var K_PRMT_ARIA_ROLE_PRESENTATION = "presentation";
var K_PRMT_TREE_ROLE_TREEITEM = "treeitem";
var K_PRMT_TREE_ROLE_TREE = "tree";
var K_PRMT_TREE_ROLE_GROUP = "group";
var K_PRMT_TREE_ROLE_CHECKBOX = "checkbox";
var K_PRMT_TREE_STATE_EXPANDED = "aria-expanded";
var K_PRMT_TREE_ROLE_BUTTON = "button";

var K_PRMT_SF_CONTAINER = "PRMT_SF_CONTAINER";
var K_PRMT_SF_INPUT_PREFIX = "PRMT_SF_INPUT_";

/*
	END OF constants.
*/

//
// This is the main JavaScript file for prompting.  It is actually required for the report as well as prompt pages because
// there is little difference between the two.
//

var gsCSS_DEFAULT_STYLE = "align,background,border,clear,direction,display,float,height,margin,overflow,padding,vertical-align,visibility,width";

// This function is used to specify whether to go back a prompt page
// or go to the next prompt page
// method='back' or 'forward'
function SetPromptMethod(setting)
{
	var frm = document.forms[0];
	if (frm["ui.action"])
	{
		frm["ui.action"].value = setting;
	}
	if (frm.method)
	{
		frm.method.value = setting;
	}
}

//return the current method (e.g. 'back' or 'forward')
//the method determines whether to move forward or
//backwards through prompt pages
function GetPromptMethod()
{
	var setting;
	var frm = document.forms[0];

	if (frm)
	{
		if (frm.method)
		{
			setting = frm.method.value;
		}
		if (frm["ui.action"])
		{
			setting = frm["ui.action"].value;
		}
	}

	return setting;
}

// This function is used to tell the server
// to Finish a prompt page and run the report
// finish now: 'false'
// continue prompting: 'true'
function SetPromptContinue(setting)
{
	var frm = document.forms[0];
	if (frm["run.prompt"])
	{
		frm["run.prompt"].value = setting;
	}
	if (frm.prompt)
	{
		frm.prompt.value = setting;
	}
}

// This function is used to control reprompting.  Call it with "prompt" and the request will be resubmitted and the query
// will be reexectued, unlike the next page request
function SetPromptControl(setting)
{
	if ( f_CSW_tryCVPromptAction(setting) || f_getPromptRequestSubmitFlag() )
	{
		return false;
	}
	f_setPromptRequestSubmitFlag(true);

	//test that all required fields are valid
	var bSubmit = true;

	var aPreProcess = getPreProcessControlArray();
	if (aPreProcess)
	{
		preProcessForm(aPreProcess);

		//don't verify if this is a reprompt or search
		if ( needPromptValidation(setting) )
		{
			bSubmit = canSubmitPrompt();
		}
	}

	//validate are required fields before submitting
	if (bSubmit === true)
	{
		var frm = document.forms[0];
		genHiddenInputHTML( frm.name, "_promptControl", setting );
		if (setting == K_ACTION_REPROMPT)
		{
			//set the proper server method
			SetPromptMethod(K_ACTION_FORWARD);
		}

		frm.submit();
		return true;
	}

	return false;
}

/**
	Call this function to know if all required prompts have valid inputs.
*/
function canSubmitPrompt(autoSubmitParameter, optionalCVObject)
{
	var bFormValid = true;

	var aPreProcess = getPreProcessControlArray(optionalCVObject);
	if (aPreProcess)
	{
		var kCount = aPreProcess.length;
		var k = 0;
		for (k=0; k<kCount; k++)
		{
			var promptElement = eval(aPreProcess[k]);
			// can autosubmit when there is a cascade
			if (autoSubmitParameter && promptElement["@cascadeOn"] && promptElement["@cascadeOn"] == autoSubmitParameter) {
				bFormValid = true;
				break;
			}
			else if ( promptElement.isValid() === false )
			{
				bFormValid = false;
			}
		}
	}

	if (bFormValid === false)
	{ 
		if (!autoSubmitParameter){
			var sPrompt_Required_Values_missing = "sPrompt_Required_Values_missing";
			if (typeof PMT_UIM_PROMPT_CONFIRMATION_VALUE_MISSING == K_PRMT_sSTRING) {
				sPrompt_Required_Values_missing = PMT_UIM_PROMPT_CONFIRMATION_VALUE_MISSING;
			}
			alert (sPrompt_Required_Values_missing);
		}
		return false;
	}

	return true;
}

function needPromptValidation(sAction)
{
	if ( sAction == K_ACTION_SEARCH || sAction == K_ACTION_REPROMPT || sAction == K_ACTION_CANCEL || sAction == K_ACTION_BACK || GetPromptMethod() == K_ACTION_BACK )
	{
		return false;
	}
	return true;
}

//preprocess any registered controls
//to ensure that they submit the correct data
function preProcessForm(ar)
{
	if (ar)
	{
		var kCount = ar.length;
		var k = 0;
		for (k=0; k<kCount; k++)
		{
			eval(ar[k]).preProcess();
		}
	}
}

function debugPreprocess(ar)
{
	var sDebug="Array length: " + ar.length + "\n";
	sDebug += "Arrays: " + ar.toString() + "\n";
	var j=0;
	if (ar)
	{
		for (j=0; j<ar.length; j++)
		{
			sDebug += "Array " + j + K_PRMT_sCOLON + ar[j] + K_PRMT_sCOLON + eval(ar[j]).m_oHiddenChoices.value + "\n";
		}
		alert (sDebug);
	}
}

//this function is used to trap change events when the
//user selects the same value in a drop down list and expects it
//to autosubmit.
function catchAutoSubmit(o, sSubmitType)
{
	if (o.m_bAutoSubmitTrigger === true)
	{
		//submit the form
		SetPromptMethod(K_ACTION_FORWARD);
		SetPromptControl(sSubmitType);
	}
	else
	{
		//prime the trigger to submit
		o.m_bAutoSubmitTrigger = true;
	}
}

function sDecodeU003( sText )
{
	if ( typeof sText != K_PRMT_sSTRING )
	{
		return sText;
	}

	var v_reU003C = new RegExp( K_PRMT_sDBL_BACKSLASH + "U003C", K_PRMT_sG );
	var v_reU003E = new RegExp( K_PRMT_sDBL_BACKSLASH + "U003E", K_PRMT_sG );
	return ( sText.replace(v_reU003E, K_PRMT_sGT).replace(v_reU003C, K_PRMT_sLT) );
}

function sQuotEncode( sText )
{
	return ( sText.replace(K_PRMT_reQU, K_PRMT_sQU_encoded) );
}

//take an input string and convert it into
//xml friendly entity references
function sXmlEncode(sInputString)
{
	var sOutputString = sHtmlEncode(sInputString);

	if ((sOutputString == '0') || ((sInputString !== null) && (sInputString !== false)))
	{
		//&quot;
		sOutputString = sQuotEncode( sOutputString );
		//&apos;
		var reApos = new RegExp( K_PRMT_sAPOS, K_PRMT_sG );
		sOutputString = sOutputString.replace(reApos, "&apos;");

		// linefeeds
		sOutputString = sOutputString.replace(/\n/g, "&#10;");
		// carriage returns
		sOutputString = sOutputString.replace(/\r/g, "&#13;");
	}
	else if (!sInputString)
	{
		//return empty string if the value is null or false
		sOutputString = K_PRMT_sEMPTY;
	}

	return sOutputString;
}

function sHtmlEncode(sInputString)
{
	var sOutputString = K_PRMT_sEMPTY + sInputString;

	if ((sOutputString == '0') || ((sInputString !== null) && (sInputString !== false)))
	{
		//&amp;
		sOutputString = sOutputString.replace(/&/g, "&amp;");
		//&lt;
		sOutputString = sOutputString.replace(/</g, "&lt;");
		//&gt;
		sOutputString = sOutputString.replace(/>/g, "&gt;");
	}
	else if (!sInputString)
	{
		//return empty string if the value is null or false
		sOutputString = K_PRMT_sEMPTY;
	}

	return sOutputString;
}

//Localize Strings
//Used to perform string substitutions to localize strings
//in a placement neutral way.
//for example: replace ^1 with '10' in the string
//"values between ^1 and ^2"
function sReplaceToken(sMessage, sTokenValue, sNewValue)
{
	var newString = K_PRMT_sEMPTY;
	var startPtr = 0;
	var tempStrPtr = sMessage.indexOf(sTokenValue);
	while (tempStrPtr > -1)
	{
		newString += sMessage.substring(startPtr, tempStrPtr);
		newString += sNewValue;
		startPtr = tempStrPtr + sTokenValue.length;
		tempStrPtr = sMessage.indexOf(sTokenValue, startPtr);
	}
	newString += sMessage.substring(startPtr, sMessage.length);
	return newString;
}

//Strip leading and trailing quotes from a string
//this function is used to return the value of a
//string in single quotes
function stripSingleQuote(s)
{
	var newString = s;

	//strip the trailing quote
	var rTrailingQuote = /[']$/;
	newString = newString.replace (rTrailingQuote, K_PRMT_sEMPTY);

	//strip leading quote
	var rLeadingQuote = /^[']/;
	newString = newString.replace (rLeadingQuote, K_PRMT_sEMPTY);

	return newString;
}


//return a string for use in regular expressions
//that takes care of escape values that may be part
//of regular expression syntax
function sEscapeRegularExpression(sRegExpString)
{
	//replace .
	sRegExpString = sRegExpString.replace(/\./g, K_PRMT_sBACKSLASH + K_PRMT_sDOT);

	//replace $
	sRegExpString = sRegExpString.replace(/\$/g, K_PRMT_sBACKSLASH + "$");

	//replace (
	sRegExpString = sRegExpString.replace(/\(/g, K_PRMT_sBACKSLASH + "(");

	//replace )
	sRegExpString = sRegExpString.replace(/\)/g, K_PRMT_sBACKSLASH + ")");

	//replace +
	sRegExpString = sRegExpString.replace(/\+/g, K_PRMT_sBACKSLASH + "+");

	return sRegExpString;
}



/* button functions */

function buttonOver (obj)
{
	obj.className = "clsToolbarButton_hover";
}

function buttonOut (obj)
{
	obj.className = "clsToolbarButton";
}

function buttonDown (obj)
{
	obj.className = "clsToolbarButton_active";
}


/* Dynamic HTML positioning functions */

//walk up through a document and pass the total offset
function iOffsetFromBodyX(obj)
{
	var oChild = obj;
	var iTotalOffsetX = 0;

	do {
		if (iTotalOffsetX + oChild.offsetLeft >= 0)
		{
			iTotalOffsetX += oChild.offsetLeft;
		}
		oChild = oChild.offsetParent;
	} while (oChild !== null);

	return iTotalOffsetX;
}

//walk up through a document and pass the total offset
function iOffsetFromBodyY(obj)
{
	var oChild = obj;
	var iTotalOffsetY = 0;

	do {
		iTotalOffsetY += oChild.offsetTop;
		oChild = oChild.offsetParent;
	} while ((oChild !== null) && (oChild.id != 'RVContent'));

	return iTotalOffsetY;
}

/* Page level notification functions */
// This notifies observers of any changes on the page
function notify(iState, oNotifier)
{
	//notify any range controls to update their states
	if ((typeof rangeNotify != K_PRMT_sUNDEFINED) && (rangeNotify) )
	{
		rangeNotify();
	}

	//notify any prompt buttons to update their states
	if ((typeof promptButtonNotify != K_PRMT_sUNDEFINED) && (promptButtonNotify) )
	{
		promptButtonNotify();
	}

	//notify any multiple selection controls to update their states
	if ((typeof multipleObserverNotify != K_PRMT_sUNDEFINED) && (multipleObserverNotify) )
	{
		multipleObserverNotify();
	}

	for (var idxNotif = 0; idxNotif < gaNotifyTargets.length; idxNotif++)
	{
		var oTarget = gaNotifyTargets[idxNotif];
		if (typeof oTarget != K_PRMT_sUNDEFINED && typeof oTarget.notify == K_PRMT_sFUNCTION)
		{
			oTarget.notify(iState, oNotifier);
		}
	}
}

//send notifications to multiple choice controls
//this allows the compound multiple choice prompts to
//listen for changes in state to their child controls
function multipleObserverNotify()
{
	if ((typeof multipleObserverArray != K_PRMT_sUNDEFINED) && (multipleObserverArray))
	{
		var kCount = multipleObserverArray.length;
		var k = 0;
		for (k=0; k<kCount; k++)
		{
			var promptElement = multipleObserverArray[k];
			if ( typeof promptElement == K_PRMT_sSTRING )
			{
				promptElement = eval(promptElement);
			}
			//check the insert / remove buttons
			promptElement.checkInsertRemove();
		}
	}
}


//send notifications to controls that wish to be notified
//the Reprompt button was selected
function repromptObserverNotify(oCV)
{
	var v_aObservers = ((typeof aRepromptObservers != K_PRMT_sUNDEFINED) ? aRepromptObservers : f_getObserverArray('repromptObserverArray', oCV));
	// Set focus on reprompt button
	// Storing layoutName of button to set focus after page submit
	// example:
	// layoutName = 0: ""reprompt1_NS_""

	var sOuter = this.document.activeElement.outerHTML;
	var layoutstr = sOuter.match(/layoutname="\w+"/ );
	if (layoutstr !== null) {
		var layoutString = layoutstr[0];
		var Regexp = /".*"/;
		var layoutName = Regexp.exec(layoutString);
		oCV.setCurrentPromptControlFocus(layoutName[0]);
	}
	else {
		oCV.setCurrentPromptControlFocus(null);
	}

	if (v_aObservers)
	{
		var kCount = v_aObservers.length;
		var k = 0;
		for (k=0; k<kCount; k++)
		{
			var v_oPrompt = v_aObservers[k];
			if (typeof v_oPrompt == K_PRMT_sSTRING)
			{
				v_oPrompt = eval( v_oPrompt );
			}
			if (v_oPrompt && v_oPrompt.handleNotify)
			{
				// e.g. clear the cache for the tree
				v_oPrompt.handleNotify();
			}
		}
	}
}

//send notifications to controls that use pop up date pickers
//listen for changes in state to other date picker controls
function datePickerObserverNotify(aDatePickersObservers)
{
	var v_aObservers = ((typeof aDatePickersObservers != K_PRMT_sUNDEFINED) ? aDatePickersObservers : f_getObserverArray('datePickerObserverArray'));
	if (v_aObservers)
	{
		var kCount = v_aObservers.length;
		var k = 0;
		for (k=0; k<kCount; k++)
		{
			var v_oPrompt = v_aObservers[k];
			if (typeof v_oPrompt == K_PRMT_sSTRING)
			{
				v_oPrompt = eval( v_oPrompt );
			}
			if (v_oPrompt && v_oPrompt.handleNotify)
			{
				//check the toggle state of the popups
				v_oPrompt.handleNotify();
			}
		}
	}
}

//iterate through a list of pickers and hide any that are open
//this is used to clean up the UI
//
//pickers are typically registered to the g_pickerObservers
//observer array once they are instantiated
function hidePickers()
{
	if ((typeof g_pickerObservers != K_PRMT_sUNDEFINED) && (g_pickerObservers))
	{
		var kCount = g_pickerObservers.length;
		for (var k=0; k<kCount; k++)
		{
			var promptElement = eval(g_pickerObservers[k]);
			if (typeof promptElement != K_PRMT_sUNDEFINED)
			{
				promptElement.hide();
			}
		}
	}
}


//
// This function is called just before the main form is submitted when the user presses the Enter Key
// in a search control or text box
// Anything that needs to be done before submitting must be done here.
//
function execute()
{
	SetPromptMethod(K_ACTION_FORWARD);
	var submitSetting = K_ACTION_PROMPT;
	var currentSetting = GetSubmitSetting();
	if (currentSetting !== null)
	{
		submitSetting =  currentSetting;
	}
	SetPromptControl(submitSetting);

	return true;
}

function SetSubmitSetting(s)
{
	var frm = document.forms[0];
	if (frm._promptControl)
	{
		frm._promptControl.value = s;
	}
}

function GetSubmitSetting()
{
	var frm = document.forms[0];
	if (frm._promptControl)
	{
		return frm._promptControl.value;
	}
	return null;
}

//
// Browser Sniffing code
// These functions give an indication of what level of support a particular browser has.
// They are not meant to be the definitive way to determine the user's browser
//
function browserIsNS7()
{
	var bBrowserTest = ((!window.ie) && (document.getElementById)) ? true : false;
	return bBrowserTest;
}

// prevent a form from submitting when the user presses enter
function preventSubmitEvent(evt)
{
	var v_oEvt = (evt ? evt : (typeof event != K_PRMT_sUNDEFINED ? event : null ));
	if ( v_oEvt )
	{
		if (v_oEvt.keyCode == 13)
		{
			if (typeof v_oEvt.stopPropagation == K_PRMT_sFUNCTION) { v_oEvt.stopPropagation(); }
			if (typeof v_oEvt.preventDefault == K_PRMT_sFUNCTION) { v_oEvt.preventDefault(); }
			v_oEvt.cancelBubble = true;
			return false;
		}
	}
}

//prevent the event from bubbling to other elements
function cancelBub(evt)
{
	//get the event in a cross-browser fashion
	evt = (evt) ? evt : ((event) ? event : null);

	//prevent the click from proceeding to other nodes
	if (typeof evt.cancelBubble != K_PRMT_sUNDEFINED)
	{
		evt.cancelBubble = true;
	}

	if (typeof evt.stopPropagation != K_PRMT_sUNDEFINED)
	{
		evt.stopPropagation();
	}
}

//test to see if the string contains only numbers
function bNumbersOnly(s)
{
	var rNoIntegers = new RegExp('[^0-9]', K_PRMT_sG); //non numerals
	if (s)
	{
		var z = s.search(rNoIntegers);
		if (z == -1)
		{
			return true;
		}
	}
	return false;
}

/* Variables */
//broadcaster-observer array for picker controls
var g_pickerObservers = [];
var gaNotifyTargets = [];
var gaSelectControls = [];
var goSelectControlsTimer = null;

var gFAIL = 0;
var gPASS = 1;
var gUPDATE = 2;

////////////////////////////////////////////////////////////////////////
// Common utility functions used in rendering prompt controls with JS
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
// Insert / Remove buttons
////////////////////////////////////////////////////////////////////////
function genInsertButtonHTML(sPromptId, defaultAction, sName)
{
	if (!verifyPromptId(sPromptId))
	{
		return;
	}
	var HTMLOut = "<button type='button' title='" + PMT_UIM_INSERTTIP + "' id='" + sName + "' name='" + sName + "' onclick='" + defaultAction + "; return false;' class='clsInsertRemoveButton' onmouseover=\"this.className='clsInsertRemoveButtonOver'\" onmouseout=\"this.className='clsInsertRemoveButton'\">" + PMT_UIM_INSERT + " <img src='" + getPromptSkin() + "/prompting/images/insert.gif' alt='" + PMT_UIM_INSERTTIP + "' border='0' height='16' width='16' align='top' /></button>";
	renderPromptControlHTML("getInsertButton" + sPromptId, HTMLOut);
}

function genRemoveButtonHTML(sPromptId, defaultAction, sName)
{
	if (!verifyPromptId(sPromptId))
	{
		return;
	}
	var HTMLOut = "<button type='button' title='" + PMT_UIM_REMOVETIP + "' id='" + sName + "' name='" + sName + "' onclick='" + defaultAction + "; return false;' class='clsInsertRemoveButton' onmouseover=\"this.className='clsInsertRemoveButtonOver'\" onmouseout=\"this.className='clsInsertRemoveButton'\"><img src='" + getPromptSkin() + "/prompting/images/remove.gif' alt='" + PMT_UIM_REMOVETIP + "' border='0' height='16' width='16' align='top' /> " + PMT_UIM_REMOVE + "</button>";
	renderPromptControlHTML("getRemoveButton" + sPromptId, HTMLOut);
}

function getPromptImages()
{
	var sPromptSkin = (typeof getPromptSkin != K_PRMT_sUNDEFINED ? getPromptSkin() : K_PRMT_sDEFAULTSKIN);
	return sPromptSkin + "/prompting/images/";
}

// This function returns the path to the skin folder
// to use for prompt controls.
function getPromptSkin()
{
	if (typeof p_sSkinFolder == K_PRMT_sSTRING && p_sSkinFolder)
	{
		return p_sSkinFolder;
	}

	// return the default skin folder.
	return (getWebContentURI() + "/skins/corporate");
}

function getWebContentURI()
{
	var v_sURI =  "..";
	if (typeof p_sWebContentURI == K_PRMT_sSTRING && p_sWebContentURI)
	{
		v_sURI = p_sWebContentURI;
	}
	else
	{
		var vBase = document.getElementsByTagName("base");
		if (vBase)
		{
			v_sURI +=  "/..";
		}
	}
	return v_sURI;
}

function StringArray() {
	this.stringArray = [];
	this.append = StringArray_append;
	this.toString = StringArray_toString;
	this.reset = StringArray_reset;
}

function StringArray_append(strValue) {
	this.stringArray[this.stringArray.length]= strValue;
}

function StringArray_toString() {
	return this.stringArray.join(K_PRMT_sEMPTY);
}

function StringArray_reset() {
	this.stringArray = [];
}

function jsEncodeStr(str)
{
	if (typeof str == K_PRMT_sUNDEFINED || !str)
	{
		return K_PRMT_sEMPTY;
	}
	if (typeof str != K_PRMT_sSTRING)
	{
		return str;
	}
	var reBackSlash = new RegExp( K_PRMT_sDBL_BACKSLASH, K_PRMT_sG );
	return str.replace(reBackSlash, K_PRMT_sDBL_BACKSLASH).replace(K_PRMT_reQU, K_PRMT_sBACKSLASH + K_PRMT_sQU);
}

function jsDecodeStr(str)
{
	if (typeof str == K_PRMT_sUNDEFINED || !str)
	{
		return K_PRMT_sEMPTY;
	}
	if (typeof str != K_PRMT_sSTRING)
	{
		return str;
	}
	var reBackSlashApos = new RegExp( K_PRMT_sDBL_BACKSLASH + K_PRMT_sAPOS, K_PRMT_sG );
	var reBackSlashQuote = new RegExp( K_PRMT_sDBL_BACKSLASH + K_PRMT_sQU, K_PRMT_sG );
	var reBSBS = new RegExp( K_PRMT_sDBL_BACKSLASH + K_PRMT_sDBL_BACKSLASH, K_PRMT_sG );
	var reLT = new RegExp( K_PRMT_sDBL_BACKSLASH + K_PRMT_sLT, K_PRMT_sG );
	var reGT = new RegExp( K_PRMT_sDBL_BACKSLASH + K_PRMT_sGT, K_PRMT_sG );
	return str.replace(reBackSlashApos, K_PRMT_sAPOS).replace(reBackSlashQuote, K_PRMT_sQU).replace(reGT, K_PRMT_sGT).replace(reLT, K_PRMT_sLT).replace(reBSBS, K_PRMT_sBACKSLASH);
}

function verifyPromptId(sPromptId)
{
	if (sPromptId.indexOf( K_PRMT_sBACKSLASH + "U003C") > -1 || sPromptId.indexOf(K_PRMT_sBACKSLASH + "U003E") > -1 )
	{
		return false;
	}
	return true;
}

//creates an escape character that won't break when put in a javascript string or written to HTML
function alterDoubleQuote(str)
{
	if (typeof str == K_PRMT_sUNDEFINED || !str)
	{
		return K_PRMT_sEMPTY;
	}
	var reQ1 = new RegExp( K_PRMT_sDBL_BACKSLASH + K_PRMT_sQU, K_PRMT_sG );
	return str.replace(reQ1, '~quote~').replace(K_PRMT_reQU, '~quote~');
}


/**
	Add or update a field in a form.
	@param {string} sFormName name of the form in which to add/update the form field.
	@param {string} sInputName name of the form field to add/update
	@param {string} sValue value to use for the form field.
*/
function addHiddenInputHTML(sFormName, sInputName, sValue)
{
	var sHTML = genHiddenInputHTML(sFormName, sInputName, sValue);
	if (sHTML)
	{
		document.write(sHTML);
	}
}

/**
	Update a field in a form or generate the HTML if the <form> is not ready yet.
	@param {string} sFormName name of the form in which to add/update the form field.
	@param {string} sInputName name of the form field to add/update
	@param {string} sValue value to use for the form field.
	@type string
	@return A HTML string that represents the <input> field to add. The string is empty is the <input> or the <form> already exists.
*/
function genHiddenInputHTML(sFormName, sInputName, sValue)
{
	var sHTML = K_PRMT_sEMPTY;
	var oInput = null;
	var oForm = document.forms[sFormName];
	if (oForm)
	{
		oInput = oForm.elements[sInputName];
		// [IE] We check for the readyState because IE have issues when adding nodes (with appendChild) when the page isn't fully parsed.
		if (!oInput && (!document.readyState || document.readyState == "complete"))
		{
			oInput = document.createElement("input");
			oInput.type = "hidden";
			oInput.id = sInputName;
			oInput.name = sInputName;
			oInput.value = sValue;
			oForm.appendChild(oInput);
		}
	}
	if (oInput) {
		oInput.value = (sValue === null ? K_PRMT_sEMPTY : sValue);
	}
	else {
		sHTML = '<input type="hidden" name="' + alterDoubleQuote(sInputName) + '" value="' + (sValue === null ? K_PRMT_sEMPTY : sValue) + '"/>';
	}
	return sHTML;
}

function addSelectChoices(oSubmit, sValues)
{
	var sSubmitValues = oSubmit.value;
	if (typeof sSubmitValues != K_PRMT_sSTRING || !sSubmitValues)
	{
		sSubmitValues = "<selectChoices></selectChoices>";
	}
	if (typeof sValues == K_PRMT_sSTRING && sSubmitValues.indexOf(sValues) == -1)
	{
		// strip out <selectChoices nodes> from previous values
		sSubmitValues = sSubmitValues.replace(/^\s*<selectChoices>\s*/i,K_PRMT_sEMPTY).replace(/\s*<\/selectChoices>\s*$/i,K_PRMT_sEMPTY);
		sValues = sValues.replace(/^\s*<selectChoices>\s*/i,K_PRMT_sEMPTY).replace(/\s*<\/selectChoices>\s*$/i,K_PRMT_sEMPTY);
		// add new values
		sSubmitValues = "<selectChoices>" + sSubmitValues + sValues + "</selectChoices>";
	}
	oSubmit.value = sSubmitValues;
}

function registerForNotications(oObject)
{
	if (typeof oObject != K_PRMT_sUNDEFINED)
	{
		gaNotifyTargets[gaNotifyTargets.length] = oObject;
	}
}


function CPromptControl()
{
	this.m_sCVId = K_PRMT_sEMPTY;
}

CPromptControl.prototype.checkPass = function()
{
	if (this.m_oErrorFeedback)
	{
		this.m_oErrorFeedback.className = "clsFeedbackWidget";
	}
	this.notify(gPASS, this);
};

//render the validation error state
CPromptControl.prototype.checkFail = function()
{
	if (this.m_oErrorFeedback)
	{
		this.m_oErrorFeedback.className = (typeof this.m_sErrorFeedbackClass == K_PRMT_sSTRING ? this.m_sErrorFeedbackClass : "clsFeedbackWidgetParseError");
	}
	this.notify(gFAIL, this);
};

CPromptControl.prototype.getCV = function()
{
	var oRetVal = window;
	if (typeof this.m_oCV == K_PRMT_sOBJECT)
	{
		oRetVal = this.m_oCV;
	}
	else
	{
		try {
			oRetVal = eval("oCV" + this.getCVId());
			if (typeof oRetVal == K_PRMT_sOBJECT)
			{
				this.m_oCV = oRetVal;
			}
		}
		catch (e)
		{
			oRetVal = window;
		}
	}
	return oRetVal;
};

CPromptControl.prototype.getCVId = function()
{
	return this.m_sCVId;
};

CPromptControl.prototype.getObserverArray = function(v_sName)
{
	var v_a = null;
	var oCV = this.getCV();
	if (typeof oCV != K_PRMT_sUNDEFINED) {
		v_a = oCV[v_sName];
	}
	return v_a;

};

//get the validity without checking the data first
CPromptControl.prototype.getValid = function()
{
	return this.m_bValid;
};

CPromptControl.prototype.notify = function(iState, oNotifier)
{
	var oCV = this.getCV();
	if (oCV && typeof oCV.notify == K_PRMT_sFUNCTION)
	{
		oCV.notify(iState, oNotifier);
	}
};

CPromptControl.prototype.f_isBUX = function()
{
	var v_oCV = this.getCV();
	return (typeof v_oCV == K_PRMT_sOBJECT && v_oCV.isBux? true :false); 
};

CPromptControl.prototype.isRequired = function()
{
	return (this.m_bRequired===true);
};

CPromptControl.prototype.isValid = function()
{
	if (typeof this.checkData == K_PRMT_sFUNCTION)
	{
		this.checkData();
	}
	return (this.m_bValid===true);
};

//Trap whether the user has pressed the delete key
//in the choices box.  Note that this function is
//IE specific
CPromptControl.prototype.catchDeleteKey = function(iKeyCode)
{
	//catch the Delete key code
	if (iKeyCode == 46 && typeof this.remove == K_PRMT_sFUNCTION)
	{
		this.remove(this.m_oLstChoices);
	}
};

CPromptControl.prototype.removeSelectedChoices = function()
{
	var iFirstSelection = null;
	if (typeof this.m_oLstChoices == K_PRMT_sOBJECT)
	{
		iFirstSelection = this.m_oLstChoices.selectedIndex;
	}
	if (typeof iFirstSelection != "number")
	{
		return;
	}

	if (iFirstSelection != -1)
	{
		for (var idxSelection = this.m_oLstChoices.options.length-1; idxSelection > -1 ; idxSelection--)
		{
			if (this.m_oLstChoices.options[idxSelection].selected)
			{
				this.m_oLstChoices.options[idxSelection] = null;
			}
		}
	}
	else
	{
		var sPrompt_Select_Item_First = "sPrompt_Select_Item_First";
		if (typeof PMT_UIM_sPrompt_Select_Item_First == K_PRMT_sSTRING)
		{
			 sPrompt_Select_Item_First = PMT_UIM_sPrompt_Select_Item_First;
		}
		alert(sPrompt_Select_Item_First);
	}
	this.checkData();
};

CPromptControl.prototype.addOptions = function(aOptions)
{
	var sDisplayValue, sUseValue, bSel;
	if (aOptions instanceof Array)
	{
		for (var idxOption = 0; idxOption < aOptions.length; idxOption++)
		{
			var aOpt = aOptions[idxOption];
			if (aOpt && aOpt.length)
			{
				sDisplayValue = (aOpt.length > 0 ? aOpt[0] : K_PRMT_sEMPTY);
				sUseValue = (aOpt.length > 1 ? aOpt[1] : K_PRMT_sEMPTY);
				bSel = (aOpt.length > 2 ? aOpt[2] : false);
				sParent = (aOpt.length > 3 ? aOpt[3] : null);
				this.addNoUpdate(sDisplayValue, sUseValue, bSel, sParent);
			}
		}
		this.update();
	}
};

CPromptControl.prototype.setCVId = function(sId)
{
	if (typeof sId == K_PRMT_sSTRING && sId !== K_PRMT_sEMPTY & sId != K_PRMT_sUNDEFINED)
	{
		this.m_sCVId = sId;
	}
	// Signal viewer that a prompt control was created.
	// The assumption is all classes derived from this class invoke
	// this method in their constructor.
	var cv = this.getCV();
	if (cv && typeof cv.setHasPrompts == "function")
	{
		cv.setHasPrompts(true);
	}
};

function renderPromptControlHTML(sElementId, sHTML)
{
	var oElement = document.getElementById(sElementId);
	if (oElement !== null)
	{
		oElement.innerHTML = sHTML;
	}
}

function executePromptControlJS(sJSCode)
{
	eval(sJSCode);
}

function generatePromptProperties(oPropertiesSource, oPropertiesToAdd)
{
	var sRetval = K_PRMT_sEMPTY;
	var oProperties = oPropertiesSource;
	if (oPropertiesToAdd)
	{
		// clone oProperties first, to prevent overridding values in oPropertiesSource.
		oProperties = {};
		for (var idxProp in oPropertiesSource)
		{
			oProperties[idxProp] = oPropertiesSource[idxProp];
		}
		// add new values
		for (var idxPropToAdd in oPropertiesToAdd)
		{
			oProperties[idxPropToAdd] = oPropertiesToAdd[idxPropToAdd];
		}
	}

	for (var idxProp in oProperties)
	{
		if(sRetval)
		{
			sRetval += ",";
		}
		sRetval += idxProp + K_PRMT_sCOLON;

		switch(typeof oProperties[idxProp])
		{
			case K_PRMT_sSTRING:
				// replace \ by \\, ' by \' and </ by <'+'/'+'
				var reBackslash = new RegExp(K_PRMT_sDBL_BACKSLASH, K_PRMT_sG);
				var reApos = new RegExp(K_PRMT_sAPOS, K_PRMT_sG);
				var reEndTag = new RegExp(K_PRMT_sLT+K_PRMT_sSL, K_PRMT_sG);
				sRetval += K_PRMT_sAPOS + oProperties[idxProp].replace(reBackslash, K_PRMT_sDBL_BACKSLASH).replace(reApos, K_PRMT_sBACKSLASH + K_PRMT_sAPOS).replace(reEndTag, "<'+'/'+'") + K_PRMT_sAPOS;
				break;
			case K_PRMT_sOBJECT:
				if (oProperties[idxProp] instanceof Array)
				{
					var sArray = K_PRMT_sEMPTY;
					for (var idxArray in oProperties[idxProp])
					{
						if(sArray)
						{
							sArray += ",";
						}
						sArray += oProperties[idxProp][idxArray];
					}
					sRetval+= "[" + sArray + "]";
				}
				else if (oProperties[idxProp] === null)
				{
					sRetval += 'null';
				}
				else
				{
					sRetval += generatePromptProperties(oProperties[idxProp]);
				}
				break;
			case K_PRMT_sUNDEFINED:
				sRetval += 'null';
				break;
			default:
				sRetval += oProperties[idxProp];
		}
	}

	return "{" + sRetval + "}";
}

function getCVInstance(oProperties)
{
	var sRetVal = K_PRMT_sEMPTY;
	var sCVId = getCVId(oProperties);
	if (typeof sCVId == K_PRMT_sSTRING && eval("typeof oCV" + sCVId) != K_PRMT_sUNDEFINED)
	{
		sRetVal = "oCV" + sCVId + K_PRMT_sDOT;
	}
	return sRetVal;
}

function CPromptControl_updateSelectWidth( oSelect )
{

	if ( typeof gaSelectControls == K_PRMT_sUNDEFINED )
	{
		gaSelectControls = new Array();
	}

	if ( oSelect && !oSelect.id && oSelect.name)
	{
		oSelect.id = oSelect.name;
	}

	if ( oSelect && !gaSelectControls[ oSelect.id ] )
	{
		oSelect.m_sOriginalWidth = oSelect.style.width;
		gaSelectControls[ oSelect.id ] = oSelect;
	}

	if (document.readyState == "complete")
	{
		for (var sId in gaSelectControls)
		{
			var oTemp = gaSelectControls[ sId ];
			if (oTemp && oTemp.m_oSelectElt)
			{
				oTemp = oTemp.m_oSelectElt;
			}
			if (oTemp && oTemp.style)
			{
				// Only update if the width wasn't previously set or it's 'auto'
				if ( !CPromptControl_hasExplicitWidth( oTemp ) )
				{
					// Setting the width to "auto" will resize the box
					oTemp.style.width = "auto";
					if (oTemp.offsetWidth < 200)
					{
						// the box is too small, reset the width to its previous value.
						oTemp.style.width = "200px";
					}
				}
			}
		}
	}
	else if ( document.readyState  )
	{
		// IE is still loading the page.
		if ( typeof goSelectControlsTimer != K_PRMT_sUNDEFINED && goSelectControlsTimer )
		{
			clearTimeout( goSelectControlsTimer );
		}
		goSelectControlsTimer = setTimeout(CPromptControl_updateSelectWidth, 100);
	}
	else
	{
		// Firefox, Mozilla: remove min-width if width is explicitly set in the style.
		if ( !CPromptControl_hasExplicitWidth( oSelect ) )
		{
			oSelect.style.minWidth = "200px";
		}
	}
}

function CPromptControl_hasExplicitWidth( oHTMLElement )
{
		var sWidth = null;
		if (oHTMLElement)
		{
			sWidth = oHTMLElement.m_sOriginalWidth;
			if ( typeof sWidth == K_PRMT_sUNDEFINED )
			{
				sWidth = oHTMLElement.style.width;
			}
		}

		// Only update if the width was previously set and it's not 'auto'
		return ( sWidth && sWidth.match(/\d/g) );
}

function getCVId(oProperties)
{
	var sRetVal = K_PRMT_sEMPTY;
	if (typeof oProperties == K_PRMT_sOBJECT && typeof oProperties.CVId == K_PRMT_sSTRING && oProperties.CVId !== K_PRMT_sEMPTY)
	{
		sRetVal = oProperties.CVId;
	}
	return sRetVal;
}

function getPreProcessControlArray(optionalCVObject)
{
	var aPreProcess = null;
	if (typeof preProcessControlArray != K_PRMT_sUNDEFINED)
	{
		aPreProcess = preProcessControlArray;
	} else if (typeof optionalCVObject != K_PRMT_sUNDEFINED){
		aPreProcess = optionalCVObject.preProcessControlArray;
	}
	else if (typeof window.gCognosViewer != K_PRMT_sUNDEFINED)
	{
		aPreProcess = window.gCognosViewer.preProcessControlArray;
	}
	return aPreProcess;
}

function f_getObserverArray( v_sName, oCV )
{
	var v_a = null;
	if(typeof oCV != K_PRMT_sUNDEFINED)
	{
		v_a = oCV[v_sName];
	}
	else if (typeof window[v_sName] != K_PRMT_sUNDEFINED)
	{
		v_a = window[v_sName];
	}
	else if (window.gCognosViewer && typeof window.gCognosViewer[v_sName] != K_PRMT_sUNDEFINED)
	{
		v_a = window.gCognosViewer[v_sName];
	}
	return v_a;
}

/*
	Returns multiple styles at a time, appropriate for HTML style parsing.
*/
function cssParser( sStyle, sDesiredStyle, bValueOnly )
{
	if ( !sStyle || typeof sStyle != K_PRMT_sSTRING || !sDesiredStyle || typeof sDesiredStyle != K_PRMT_sSTRING )
	{
		return K_PRMT_sEMPTY;
	}

	var v_sStyleParsed = sStyle.replace(/\s*;\s*$/g, K_PRMT_sEMPTY);
	v_sStyleParsed = v_sStyleParsed.replace(/\s*;\s*/g,';');
	v_sStyleParsed = v_sStyleParsed.replace(/\s*:\s*/g,K_PRMT_sCOLON);

	var aStyle = v_sStyleParsed.split(";");
	var aDesiredStyle = sDesiredStyle.split(",");
	var sReturnedStyle = K_PRMT_sEMPTY;

	for ( var v_iDesiredStyle = 0; v_iDesiredStyle < aDesiredStyle.length; v_iDesiredStyle++ )
	{
		for ( var v_iStyle = 0; v_iStyle < aStyle.length; v_iStyle++ )
		{
			var aTempValue = aStyle[v_iStyle].split(K_PRMT_sCOLON);
			var regexpCSSProperty = new RegExp("^" + aDesiredStyle[v_iDesiredStyle] + "(-.*)?$"); //match the property name between the style and desired style aswell as their sub-properties ex:background and background-color

			if ( aTempValue[0].match(regexpCSSProperty) && aTempValue[1] != K_PRMT_sEMPTY )
			{
				if (!bValueOnly)
				{
					sReturnedStyle +=  aTempValue[0] + K_PRMT_sCOLON;
				}
				sReturnedStyle += aTempValue[1];
				if (!bValueOnly)
				{
					sReturnedStyle += ";";
				}
			}
		}
	}

	return sReturnedStyle;
}

function f_getPromptRequestSubmitFlag()
{
	var v_bFlag = false;
	if ( typeof window != K_PRMT_sUNDEFINED )
	{
		if ( typeof window.gCognosViewer != K_PRMT_sUNDEFINED && typeof window.gCognosViewer.gbPromptRequestSubmitted != K_PRMT_sUNDEFINED )
		{
			v_bFlag = window.gCognosViewer.gbPromptRequestSubmitted;
		}
		else if ( typeof window.gbPromptRequestSubmitted != K_PRMT_sUNDEFINED )
		{
			v_bFlag = window.gbPromptRequestSubmitted;
		}
		else
		{
			v_bFlag = window.gbPromptRequestSubmitted = false;
		}
	}
	else if ( typeof gbPromptRequestSubmitted != K_PRMT_sUNDEFINED )
	{
		v_bFlag = gbPromptRequestSubmitted;
	}
	return v_bFlag;
}

function f_setPromptRequestSubmitFlag(v_bFlag)
{
	if ( typeof window != K_PRMT_sUNDEFINED )
	{
		if ( typeof window.gCognosViewer != K_PRMT_sUNDEFINED && typeof window.gCognosViewer.gbPromptRequestSubmitted != K_PRMT_sUNDEFINED )
		{
			window.gCognosViewer.gbPromptRequestSubmitted = v_bFlag;
		}
		else
		{
			window.gbPromptRequestSubmitted = v_bFlag;
		}
	}
	else if ( typeof gbPromptRequestSubmitted != K_PRMT_sUNDEFINED )
	{
		gbPromptRequestSubmitted = v_bFlag;
	}
}

/**
	@private
	@param {string} sAction Should be one of: back, cancel, forward, next, reprompt.
	@param {string} sArg Url for 'back'
	@return {boolean} 'true' if successfully called the CognosViewer's promptAction().
	@desc Re-route old promptAction() calls to CognosViewer's promptAction().
	(Custom Scripts Workaround)
*/
function f_CSW_tryCVPromptAction(sAction, sArg)
{
	if ( needPromptValidation(sAction) )
	{
		canSubmitPrompt(); // trigger validation before submitting values.
	}
	if ( typeof window != K_PRMT_sUNDEFINED && typeof window.gCognosViewer != K_PRMT_sUNDEFINED && typeof window.gCognosViewer.promptAction == K_PRMT_sFUNCTION )
	{
		window.gCognosViewer.promptAction(sAction, sArg);
		return true;
	}
	return false;
}

/**
	@private
	@desc Maps document.formWarpRequest to document.formWarpRequest_NS_
	(Custom Scripts Workaround)
*/
function f_CSW_setFWR()
{
	if (typeof SYSTEMPROPERTY_CREATE_CUSTOM_SCRIPTS_REFS != "undefined" && SYSTEMPROPERTY_CREATE_CUSTOM_SCRIPTS_REFS === false)
	{
		return;
	}
	if ( !window.gCognosViewer )
	{
		// Browser or CognosViewer not ready, try again later.
		setTimeout( f_CSW_setFWR, 100 );
	}
	else
	{
		var v_doc = document;
		var v_sFWR = "formWarpRequest";
		var sId = (window.gCognosViewer && window.gCognosViewer.getId ? window.gCognosViewer.getId() : "");
		if (v_doc[v_sFWR + sId] && !v_doc[v_sFWR])
		{
			// map document.formWarpRequest to document.formWarpRequest_NS_
			v_doc[v_sFWR] = v_doc[v_sFWR + sId];
			if ( typeof SYSTEMPROPERTY_CUSTOM_SCRIPTS_OVERRIDE_FORM_SUBMIT != "undefined" && SYSTEMPROPERTY_CUSTOM_SCRIPTS_OVERRIDE_FORM_SUBMIT )
			{
				// Overwrite submit of form.
				v_doc[v_sFWR].submit = f_CSW_tryCVPromptAction;
			}
		}
	}
}

if ( typeof SYSTEMPROPERTY_CREATE_CUSTOM_SCRIPTS_REFS == "undefined" || SYSTEMPROPERTY_CREATE_CUSTOM_SCRIPTS_REFS )
{
	// Sets document.formWarpRequest
	// (Custom Scripts Workaround)
	f_CSW_setFWR();
}
