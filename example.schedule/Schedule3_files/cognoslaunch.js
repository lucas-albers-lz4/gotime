//    Licensed Materials - Property of IBM
//
//    IBM Cognos Products: ps
//
//    (C) Copyright IBM Corp. 2005, 2016
//
//    US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
//
//	cognosLaunch() utility
//
//  Copyright (C) 2008 Cognos ULC, an IBM Company. All rights reserved.
//  Cognos (R) is a trademark of Cognos ULC, (formerly Cognos Incorporated).
//
//	Usage: cognosLaunch("ui.gateway","<gateway_uri>", "ui.tool","<studio_name>" [,"<name>","value>"]*)
//	Example: cognosLaunch("gateway","http://myserver:80/series8/cgi-bin/(cognosgateway)","ui.tool","ReportStudio");
//     parameter "ui.gateway" is mandatory. If "gateway" is a null string, the function will assume a relative path.
//
//
//	Usage: cognosLaunchInWindow(winName, winProperties,
//							"ui.gateway","<gateway_uri>", "ui.tool","<studio_name>" [,"<name>","value>"]*)
//	Example: cognosLaunch( "mywindow", "height=300,width=400,scrollbars=yes,resizable=yes",
//                         "ui.gateway","http://myserver:80/series8/cgi-bin/(cognosgateway)","ui.tool","ReportStudio");
//
//    if winName is null, empty or "_blank", a new window will be created with a random name
//    if no window named winName exists, a new window with that name will be created
//    if a window named winName already exists, the studio will be loaded into that window.
//	  winProperties is a string containing a list of parameters that control the aspect/behavior of the new window
//
function cognosLaunch()
{
	var JSINFRAMEPARAM="launch.openJSStudioInFrame";
	var jsinframeSpecified = false;

	var numArgs = arguments.length;
	var argsOut = new Array();

	for(i=0;i<numArgs;i+=2)
	{
		argsOut[i] = arguments[i];
		argsOut[i+1] = arguments[i+1];
		if ((jsinframeSpecified == false) && (arguments[i]==JSINFRAMEPARAM))
		{
			jsinframeSpecified = true;
		}
	}

	//If launch.openJSStudioInFrame hasn't been specified, set it to true as when using cognosLaunch() we want the studio to open up in the existing window.
	if (jsinframeSpecified == false)
	{
		argsOut[numArgs] = JSINFRAMEPARAM;
		argsOut[numArgs + 1] = 'true';
	}
	cognosLaunchArgArray(argsOut, "_self");
}

function cognosLaunchWithTarget(target)
{
	//remove the target from the arguments array so we can pass the rest onto the usual congosLaunchArgArray
	var newArguments= new Array();
	var index;
	for (index =1;index < arguments.length ;index++)
	{
	  newArguments[index-1] = arguments[index];
	}

	if (target == '')
		cognosLaunchArgArray(newArguments, "_self");
	else
		cognosLaunchArgArray(newArguments, target);
}

var gCognosWindowCount = 0;

function cognosLaunchInWindow(winName, winProperties)
{
	var target = winName;
	var newWindow = null;

	if (winName==null || winName=="_blank" || winName=="")
	{
		target = winName= "cognos_window" + (gCognosWindowCount++) + (Math.random() + "").substring(2);
	}

	if (! (winName=="_top" || winName=="_parent" || winName=="_self"))
	{
		var webRoot = (window.psWebContentRoot !== undefined && window.psWebContentRoot !== null )? window.psWebContentRoot : "../ps/";
		newWindow = window.open(webRoot + "images/space.gif",winName,winProperties)
		newWindow.focus();
	}

	var argsOut = new Array();
	for (i = 2; i < arguments.length; i++)
    {
		argsOut[i-2] = arguments[i];
    }
	var numArgs = argsOut.length;
	argsOut[numArgs] = 'launch.launchInWindow';
	argsOut[numArgs + 1] = 'true';
	cognosLaunchArgArray(argsOut, target);
}

function cognosLaunchArgArray(argArray, strTarget, winTarget)
{
	var ERR_NOGATEWAY="cognosLaunch() error: ui.gateway parameter is missing.";
	var ERR_UNEVEN="cognosLaunch() error: Uneven number of arguments.";
	var GATEWAYPARAM="ui.gateway";

	var numArgs = argArray.length;
	var gateway="";
	var gatewaySpecified = false;

	var docTarget = window.document;
	if (winTarget != null)
	{
		docTarget = winTarget.document;
	}

	var formElement = docTarget.createElement("form");
	formElement.setAttribute("name","xtslaunch");
	formElement.setAttribute("method","POST");
	formElement.setAttribute("target",strTarget);


	if ((numArgs%2) != 0)
	{
		alert(ERR_UNEVEN);
		return;
	}

	for(i=0;i<numArgs;i+=2)
	{
		if(argArray[i]==GATEWAYPARAM)
		{
			gateway = argArray[i+1];
			gatewaySpecified = true;
			break;
		}
	}

	if(!gatewaySpecified)
	{
		alert(ERR_NOGATEWAY);
		return;

	}

	// IE has a problem where it strips the brackets from the location.host value, so determine the host and port
	// by extracting it out of the full URI
	var startIdx = location.href.indexOf("//") + 2;
	var endIdx = location.href.indexOf("/", startIdx);
	var hostPort = location.href.substring(startIdx, endIdx);
	if(gateway == "")
	{

		//No gateway specified. Generate an absolute gateway from the current location. NOTE: An absolute gateway is needed so the that created form will properly submit in FireFox.
		gateway=location.protocol + "//" + hostPort + location.pathname.replace(/[\<\>]/g,'');
	}

	//Convert a relative gateway into an absolute gateway for the created form. NOTE: An absolute gateway is needed so the that created form will properly submit in FireFox.
	if ((gateway.indexOf("http://") != 0) && (gateway.indexOf("https://") != 0))
	{
		gateway = location.protocol + "//" + hostPort + gateway;
	}

	formElement.setAttribute("action", gateway);
	var hiddenElement = docTarget.createElement("input");
	hiddenElement.setAttribute("type","hidden");
	hiddenElement.setAttribute("name","b_action");
	hiddenElement.setAttribute("value","xts.run");
	formElement.appendChild(hiddenElement);

	hiddenElement = docTarget.createElement("input");
	hiddenElement.setAttribute("type","hidden");
	hiddenElement.setAttribute("name","m");
	hiddenElement.setAttribute("value","portal/launch.xts");
	formElement.appendChild(hiddenElement);


	for(i=0;i<numArgs;i+=2)
	{
		hiddenElement = docTarget.createElement("input");
		hiddenElement.setAttribute("type","hidden");
		hiddenElement.setAttribute("name",argArray[i]);
		hiddenElement.setAttribute("value",argArray[i+1]);
		formElement.appendChild(hiddenElement);
	}

    try
    {
        docTarget.body.appendChild(formElement);
        formElement.submit();
        docTarget.body.removeChild(formElement);
    }
    catch (exception)
    {
        // Handles an older IE
        docTarget.appendChild(formElement);
        formElement.submit();
        docTarget.removeChild(formElement);
    }

	formElement = null;
}

//function directLaunch takes the 'smarts' of what was being done in launch.xts using the spec portal\launch\DashboardConsoleLaunch.xml and applies it here
// So changes to this function need to be applied to the spec portal\launch\DashboardConsoleLaunch.xml
function directLaunch()
{

	var numArgs = arguments.length;
	var argsOut = new Array();

	for(i=0;i<numArgs;i+=2)
	{
		argsOut[i] = arguments[i];
		argsOut[i+1] = arguments[i+1];
	}

	directLaunchArgArray(argsOut, "_self");
}

function directLaunchArgArray(argArray, strTarget)
{
	var ERR_NOGATEWAY="directLaunch() error: ui.gateway parameter is missing.";
	var ERR_UNEVEN="directLaunch() error: Uneven number of arguments.";
	var ERR_NOSUPPORT="directLaunch() error: Not supported.";

	var GATEWAYPARAM="ui.gateway";
	var UITOOL="ui.tool";
	var UIACTION = "ui.action";
	var UIID = "ui.id";

	var numArgs = argArray.length;
	var gatewayAbsolute="";
	var gateway="";
	var gatewaySpecified = false;
	var uitoolSpecified = false;
	var uitool="";
	var uiaction="";
	var uiactionSpecified = false;
	var uiid = "";
	var uiidSpecified = false;

	var docTarget = window.document;

	if ((numArgs%2) != 0)
	{
		alert(ERR_UNEVEN);
		return;
	}

	for(i=0;i<numArgs;i+=2)
	{
		if(argArray[i]==GATEWAYPARAM)
		{
			gateway = argArray[i+1];
			gatewaySpecified = true;
		}

		if(argArray[i]==UITOOL)
		{
			uitool = argArray[i+1];
			uitoolSpecified = true;
		}

		if(argArray[i]==UIACTION)
		{
			uiaction = argArray[i+1];
			uiactionSpecified = true;
		}

		if(argArray[i]==UIID)
		{
			uiid = argArray[i+1];
			uiidSpecified = true;
		}

		if(gatewaySpecified && uitoolSpecified && uiactionSpecified && uiidSpecified)
			break;
	}

	var formElement = docTarget.createElement("form");
	formElement.setAttribute("name","xtsdirect");
	formElement.setAttribute("method","GET");
	formElement.setAttribute("target",strTarget);

	if(!gatewaySpecified)
	{
		alert(ERR_NOGATEWAY);
		return;

	}

	// IE has a problem where it strips the brackets from the location.host value, so determine the host and port
	// by extracting it out of the full URI
	var startIdx = location.href.indexOf("//") + 2;
	var endIdx = location.href.indexOf("/", startIdx);
	var hostPort = location.href.substring(startIdx, endIdx);

	if(gateway == "")
	{

		//No gateway specified. Generate an absolute gateway from the current location. NOTE: An absolute gateway is needed so the that created form will properly submit in FireFox.
		var gatewayForm =location.protocol + "//" + hostPort + location.pathname.replace(/[\<\>]/g,'');
	}

	//Convert a relative gateway into an absolute gateway for the created form. NOTE: An absolute gateway is needed so the that created form will properly submit in FireFox.
	if ((gateway.indexOf("http://") != 0) && (gateway.indexOf("https://") != 0))
	{
		gatewayAbsolute = location.protocol + "//" + hostPort + gateway;
	}

	formElement.setAttribute("action", gatewayAbsolute);
	var hiddenElement = "";

	if ( uitoolSpecified && uitool === "DashboardConsole")
	{
		hiddenElement = docTarget.createElement("input");
		hiddenElement.setAttribute("type","hidden");
		hiddenElement.setAttribute("name","b_action");
		hiddenElement.setAttribute("value","icd");
		formElement.appendChild(hiddenElement);

		hiddenElement = docTarget.createElement("input");
		hiddenElement.setAttribute("type","hidden");
		hiddenElement.setAttribute("name","pathinfo");
		hiddenElement.setAttribute("value","/main");
		formElement.appendChild(hiddenElement);

		if (uiaction === 'edit' )
		{
			var srcURL = gateway + "/icd/feeds/cm/id/" + uiid + "?entry="
			hiddenElement = docTarget.createElement("input");
			hiddenElement.setAttribute("type","hidden");
			hiddenElement.setAttribute("name","src");
			hiddenElement.setAttribute("value",srcURL);
			formElement.appendChild(hiddenElement);

		}
	}
	else
		alert(ERR_NOSUPPORT);

	for(i=0;i<numArgs;i+=2)
	{
		if ( argArray[i] !== 'ui.id')
		{
			hiddenElement = docTarget.createElement("input");
			hiddenElement.setAttribute("type","hidden");
			hiddenElement.setAttribute("name",argArray[i]);
			hiddenElement.setAttribute("value",argArray[i+1]);
			formElement.appendChild(hiddenElement);
		}
	}

    try
    {
        docTarget.body.appendChild(formElement);
        formElement.submit();
        docTarget.body.removeChild(formElement);
    }
    catch (exception)
    {
        // Handles an older IE
        docTarget.appendChild(formElement);
        formElement.submit();
        docTarget.removeChild(formElement);
    }

	formElement = null;
}
