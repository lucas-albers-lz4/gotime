/****************************************************************
** Licensed Materials - Property of IBM
**
** IBM Cognos Products: mdsrv
**
** (C) Copyright IBM Corp. 2008, 2016
**
** US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*****************************************************************/
//***********************************************************************************************
// Copyright (C) 2008 Cognos ULC, an IBM Company. All rights reserved.
// Cognos (R) is a trademark of Cognos ULC, (formerly Cognos Incorporated).
//***********************************************************************************************

/** The CongnosConfiguration object, represents an object capable of holding the properties
 * contained in cognos configuartion. Currently the lineage solution only requires the URL
 * which is to be used to launch the lineage service, named "lineageURI" in cognos configuration.
 */
function MDSRV_CognosConfiguration(){
  this.m_values = new Array(0);
}

/** Adds a property to the configuration. */
MDSRV_CognosConfiguration.prototype.addProperty=function(key,value)
{
  this.m_values[key]=value;
}

/** Retrieves a property from the configuration. */
MDSRV_CognosConfiguration.prototype.getProperty=function(key)
{
  return this.m_values[key];
}

/** XML Escapes a string */
function MDSRV_EscapeXML(sInputString){
	var sOutputString = "" + sInputString;

	if ((sOutputString == '0') || ((sInputString != null) && (sInputString != false)))
	{
		//&amp;
		sOutputString = sOutputString.replace(/&/g, "&amp;");
		//&lt;
		sOutputString = sOutputString.replace(/</g, "&lt;");
		//&gt;
		sOutputString = sOutputString.replace(/>/g, "&gt;");
		//&quot;
		sOutputString = sOutputString.replace(/"/g, "&quot;");
		//&apos;
		sOutputString = sOutputString.replace(/'/g, "&apos;");
	}

	else if (sInputString == null)
	{
		//return empty string if the value is null or false
		sOutputString = "";
	}

	return sOutputString;
};



/** This is the public api for lineage. This object should be constructed
 * by the viewer or studio.
 * @param cognosConfiguration - an object from which any property in the c8
 *                               configuration can be retrieved
 * [What type of object is cognosConfiguration?, Does such an object exist?
 * [If not then we need to change this to be the value of the lineageURL
 * from Cognos Configuration]
 */
function MDSRV_LineageFragmentContext(cognosConfiguration, selectionContext)
{
	this.m_reportPath="";
	this.m_packagePath="";
	this.m_metadataItems = new Array(0);
	this.m_executionParams="";
	this.m_configuration= cognosConfiguration;
	this.m_selectionContext = selectionContext;
	this.m_querySet = "";
	this.m_reportLineage = "";
}

/** @private */
function MDSRV_LineageItem(id, query/*=null*/){
   this.m_queryItem = id;
   this.m_query = query;
}

/** @private */
MDSRV_LineageItem.prototype.toFormXML=function()
{
  var result = "<item";

  if (this.m_query){
   result += " queryRef='";
   //to do: these names should be xml escaped
   result += MDSRV_EscapeXML(this.m_query);
   result += "'"
  }
  result += ">";
  result += MDSRV_EscapeXML(this.m_queryItem);
  result += "</item>";

  return result;
}

/** Passes in the CM path of the report on which the lineage shall be executed. */
MDSRV_LineageFragmentContext.prototype.setReportPath = function(reportPath)
{
   this.m_reportPath=reportPath;
}

/** Passes in the Package path of the package on which the lineage shall be executed. */
MDSRV_LineageFragmentContext.prototype.setPackagePath = function(packagePath)
{
   this.m_packagePath= packagePath;
}

MDSRV_LineageFragmentContext.prototype.setQuerySet = function( querySet )
{
	this.m_querySet = querySet;
}

MDSRV_LineageFragmentContext.prototype.setReportLineage = function( reportLineage )
{
	this.m_reportLineage = reportLineage;
}

/** Passes in the item ID of an object whose lineage is to be retrieved. In the event
 * the item is from a report, then the query ID must also be passed in
 */
MDSRV_LineageFragmentContext.prototype.addItem = function(queryItem, query/*=null*/){
    MDSRV_item = new MDSRV_LineageItem(queryItem, query);
    this.m_metadataItems.push(MDSRV_item);
}

/** Passes in the executionParameters. */
MDSRV_LineageFragmentContext.prototype.setExecutionParameters = function(executionParams){
  this.m_executionParams = executionParams;
}

/* @private */
MDSRV_LineageFragmentContext.prototype.getLineageRequestXML = function(){
	//the XML sent now conforms to the new drill through selection context, if we were giving a
	//selection context we use that, otherwise we buld up a fake one
	/*if (this.m_selectionContext){
		return this.m_selectionContext;
	}

	var context = new CSelectionContext(this.m_reportPath != "" ? this.m_reportPath : this.m_packagePath);
	for (i = 0; i < this.m_metadataItems.length; i++){
		context.addSelectedCell(this.m_metadataItems[i], this.m_metadataItems[i], "", "", this.m_metadataItems[i], "");
	}
	var res = context.toString();

	return res;
	*/
 //add form field elements
   var xml = "<lineageInfo>";

   if (this.m_reportPath != ""){
      xml += "<reportPath>";
      xml += MDSRV_EscapeXML(this.m_reportPath);
      xml += "</reportPath>";
   }
   else if (this.m_packagePath != ""){
	 xml += "<packagePath>";
	 xml += MDSRV_EscapeXML(this.m_packagePath);
	 xml += "</packagePath>";
   }
   else{
	throw "Expected report path or package path.";
   }

   for (i = 0; i < this.m_metadataItems.length; i++){
	xml += this.m_metadataItems[i].toFormXML();
   }
   xml += "</lineageInfo>";
   return xml;
}

//----------------------------------------------------------------------------------

/** This API will submit the lineage request, and open it in a new window. */
MDSRV_LineageFragmentContext.prototype.open = function( winName, winProperties )
{
  //create a form to package all the data and then open it in the target
   var target = winName;
   var newWindow = null;

   var pid = "lineageMain";

   if (!winProperties){
   		winProperties="menubar=no, resizable=yes,scrollbars=yes";
   }

   if (winName==null || winName=="_blank" || winName=="")
   {
   	winName = "_blank";
	target = "_self";
   }
   if (! (winName=="_top" || winName=="_parent" || winName=="_self"))
   {
       newWindow = window.open("about:blank",winName,winProperties)
       newWindow.focus();
   }

   var docTarget = window.document;

   if (newWindow != null){
    docTarget = newWindow.document;
   }

   //fix for firefox, force the docTarget to be available
	docTarget.write("<HTML><HEAD></HEAD><BODY><div style='cursor:wait; width:100%; height:100%;'><div style='display:none;'>.</div></div></BODY></HTML>");
	docTarget.close();

   var formElement = docTarget.createElement("form");

   formElement.setAttribute("method","POST");
   formElement.setAttribute("target","_self");

   //get the URL for lineage from cognos configuration
   var lineageURI = this.m_configuration.getProperty("lineageURI");
   var gatewayURI = this.m_configuration.getProperty("gatewayURI");

   var targetAction = lineageURI;
   if (lineageURI.charAt(0) == '/'){
	 targetAction = gatewayURI + lineageURI;
   }

   formElement.setAttribute("action", targetAction );

   //if we have a selectionContext convert it to metadata items
   //convertSelectionContext();

	if ( this.m_selectionContext )
	{
		// 	alert ( "selectionContext = " + this.m_selectionContext );
		var lineageRequestElement = docTarget.createElement("input");
		lineageRequestElement.setAttribute("type","hidden");
		lineageRequestElement.setAttribute("name","selectioncontext");
		lineageRequestElement.setAttribute("value",this.m_selectionContext);
		formElement.appendChild(lineageRequestElement);
	}
	else
	{
		var lineageRequestElement = docTarget.createElement("input");
		lineageRequestElement.setAttribute("type","hidden");
		lineageRequestElement.setAttribute("name","lineagerequest");
		lineageRequestElement.setAttribute("value",this.getLineageRequestXML());
		formElement.appendChild(lineageRequestElement);
	}

	var hiddenElement1 = docTarget.createElement("input");
	hiddenElement1.setAttribute("type","hidden");
	hiddenElement1.setAttribute("name","pid");
	hiddenElement1.setAttribute("value","progress_pid");
	formElement.appendChild(hiddenElement1);

	var primaryPidElement = docTarget.createElement("input");
	primaryPidElement.setAttribute("type","hidden");
	primaryPidElement.setAttribute("name","primary_pid");
	primaryPidElement.setAttribute("value",pid);
	formElement.appendChild(primaryPidElement);

	var hiddenElement2 = docTarget.createElement("input");
	hiddenElement2.setAttribute("type","hidden");
	hiddenElement2.setAttribute("name","executionParams");
	hiddenElement2.setAttribute("value",this.m_executionParams);
	formElement.appendChild(hiddenElement2);

	if ( this.m_querySet.length > 0 )
	{
//		alert ( "querySet = " + this.m_querySet );
		var hiddenElement3 = docTarget.createElement("input");
		hiddenElement3.setAttribute("type","hidden");
		hiddenElement3.setAttribute("name","querySet");
		hiddenElement3.setAttribute("value",this.m_querySet);
		formElement.appendChild( hiddenElement3 );
	}

	if ( this.m_reportLineage.length > 0 )
	{
//		alert ( "reportLineage = " + this.m_reportLineage );
		var hiddenElement4 = docTarget.createElement("input");
		hiddenElement4.setAttribute("type","hidden");
		hiddenElement4.setAttribute("name","reportLineage");
		hiddenElement4.setAttribute("value",this.m_reportLineage);
		formElement.appendChild( hiddenElement4 );
	}

   var closeWindowElement = docTarget.createElement("input");
   closeWindowElement.setAttribute("type", "hidden");
   closeWindowElement.setAttribute("name", "errURL");
   closeWindowElement.setAttribute("value", "javascript:window.close()");
   formElement.appendChild(closeWindowElement);

   // Submit form

   docTarget.body.appendChild(formElement);
   formElement.submit();
   docTarget.body.removeChild(formElement);
   formElement = null;
}

//-----------------------------------------------------------------------
//Busines glossary api
//-----------------------------------------------------------------------

/**The MDSRV_BusinessGlossary object can be used to invoke lineage.
 *@param cogonsConfiguration [mandatory] - A MDSRV_CognosConfiguration object which must contain
 *                             the configured business glossary URL. Name is "glossaryURI" and must point to the glossary URI that is configured in CM as a sytem level property.
 *
 *@param selectionContext [optional] - a selection context representing the selected item
 */
function MDSRV_BusinessGlossary(cognosConfiguration, selectionContext)
{
	this.m_cognosConfiguration = cognosConfiguration;
	this.m_selectionContext = selectionContext;
	this.m_terms = new Array();
}

MDSRV_BusinessGlossary.prototype.returnValue =
{
	success: 1,
	noTermsSpecified: 2,
	noCognosConfiguration: 3,
	noGlossaryURI: 4
}

/** This method should be called when a selectionContext was not provide to the business glossary.
 * The term passed in should be the localized name of the object as it was displayed in the metadata
 * tree. This is NOT an id, it is striclty the display name of the item that was selected.
 */
MDSRV_BusinessGlossary.prototype.addTerm = function(term)
{
	this.m_terms.push(term);
}

/** Call this method to launch the business glossary. This method must be called
 * after any addTerm() calls, if no selection context has been specified.
 * Return Value: one of the values from the MDSRV_BusinessGlossary.returnValue
 */
MDSRV_BusinessGlossary.prototype.open = function( winName, winProperties )
{
	if ( this.m_cognosConfiguration == undefined )
		return this.returnValue.noCognosConfiguration;

	// Get the business glossary URI out of the configuration
	var targetAction = this.m_cognosConfiguration.getProperty("glossaryURI");

	if ( ! targetAction )
		return this.returnValue.noGlossaryURI;

	// Parse the Selection Context and prepare data for the Business Glossary

	if ( this.m_selectionContext )
	{
	    this.parseTerms( this.m_selectionContext );
	}

//	alert( "Count of TERMs: " + this.m_terms.length );

	if ( this.m_terms.length < 1 )
	{
		return this.returnValue.noTermsSpecified;
	}

	// Open the Business Glossary window and submit the formatted data

	var target = winName;
	var newWindow = null;

	if ( ! winProperties )
	{
	   	winProperties = "menubar=no, toolbar=no, location=no, resizable=yes,scrollbars=yes";
	}

	if ( winName==null || winName=="_blank" || winName=="" )
	{
		winName = "_blank";
		target = "_self";
	}

	if ( ! ( winName=="_top" || winName=="_parent" || winName=="_self" ) )
	{
	    newWindow = window.open("about:blank",winName,winProperties)
	    newWindow.focus();
	}

	var docTarget = window.document;

	if ( newWindow != null )
	{
		docTarget = newWindow.document;
	}

	//fix for firefox, force the docTarget to be available
	docTarget.write("<HTML><HEAD></HEAD><BODY><div style='cursor:wait; width:100%; height:100%;'><div style='display:none;'>.</div></div></BODY></HTML>");
	docTarget.close();

	var formElement = docTarget.createElement("form");
	formElement.setAttribute("name","MDSRV_BUSGLOSSARY");
	formElement.setAttribute("method","GET");
	formElement.setAttribute("target","_self");

	//any URL parameters that were put we need to pull out and pass along
	var questIdx = targetAction.indexOf("?");

	if ( questIdx != -1 )
	{
		if (questIdx + 1 < targetAction.length)
		{
			var params = targetAction.substring(questIdx+1);
			targetAction = targetAction.substring(0, questIdx);
			var eqIndex = params.indexOf("=");

			while (eqIndex != -1)
			{
				var nm = params.substring(0, eqIndex);
				var vl = null;
				var ampIdx = params.indexOf("&");
				
				if (ampIdx != -1)
				{
					vl = params.substring(eqIndex+1, ampIdx);
					params = params.substring(ampIdx+1);
					eqIndex = params.indexOf("&");
				}
				else
				{
					vl = params.substring(eqIndex+1);
					eqIndex = -1;
				}

				if (vl != null)
				{
					var custom = docTarget.createElement("input");
					custom.setAttribute("type", "hidden");
					custom.setAttribute("name", nm);
					custom.setAttribute("value", vl);
					formElement.appendChild(custom);
				}
			}
		}
	}

	formElement.setAttribute("action", targetAction );

	var searchBy = docTarget.createElement("input");
	searchBy.setAttribute("type", "hidden");
	searchBy.setAttribute("name", "searchBy");
	searchBy.setAttribute("value", "Terms");
	formElement.appendChild(searchBy);

	for (var i = 0; i < this.m_terms.length; i++)
	{
		var glossaryRequestElement = docTarget.createElement("input");

		glossaryRequestElement.setAttribute("type","hidden");
		glossaryRequestElement.setAttribute("name","searchText");
		glossaryRequestElement.setAttribute("value",this.m_terms[i]);

		formElement.appendChild(glossaryRequestElement);
	}

	docTarget.body.appendChild(formElement);
	formElement.submit();

	docTarget.body.removeChild(formElement);
	formElement = null;

	return this.returnValue.success;
}

/** @private
 *
 * Parses the terms out of the given selection context.
 */
MDSRV_BusinessGlossary.prototype.parseTerms = function( selectionContext )
{
//	alert ( "Selection Context = " + selectionContext );	

	var api = new MDSRV_xmlAPI(selectionContext);

	api.addNamespace('s', 'http://developer.cognos.com/schemas/selection/1/');

	var context	= api.getRootElement();
	var node	= api.selectSingleNode(context, "//s:selection");

	var selectedCells = node.getAttribute("rSelectedCells");

	var nodeCells = new Array();
	api.selectNodes(context, "/s:selection/s:cells/s:cell", nodeCells);

	//the selected cells are space seperated

	if ( selectedCells )
	{
		var cellsList = selectedCells.split(" ");

		for ( i = 0; i < cellsList.length; i++ )
		{
			//find the selected cell
			var selectedCell=null;

			for (cellIdx=0; !selectedCell && cellIdx < nodeCells.length; cellIdx++)
			{
				var atts = nodeCells[cellIdx].attributes;
				//to tell if its the cell we have to look at its xml:id
				for (attIdx = 0; attIdx < atts.length; attIdx++)
				{
					if (atts[attIdx].name == 'xml:id' && atts[attIdx].value == cellsList[i])
					{
						selectedCell=nodeCells[cellIdx];
						break;
					}
				}
			}

			if ( selectedCell )
			{
				var term = selectedCell.getAttribute("display");

				if ( term )
				{
					this.addTerm(term);
				}
			}
		}
	}
}

//XML Processing methods

/**
 * @private
 * Constructs an object used to process an arbitrary xml string.
 */
function MDSRV_xmlAPI(xmlText){
    this.m_xmlDoc="";
	this.m_isActiveX=false;
	this.m_namespaces = new Array();
	try{
		if (document.createExpression) { // for all browsers but IE
			var parser=new DOMParser();
			this.m_xmlDoc=parser.parseFromString(xmlText,"text/xml");
		}
		else{ // for IE
			this.m_xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			this.m_xmlDoc.setProperty("SelectionLanguage", "XPath");
			this.m_xmlDoc.async="false";
            //IE will yack if there is xmlns:xml declaration so we have to rip it out
            xmlText = xmlText.replace("xmlns:xml", "xmlns:blah");
			this.m_xmlDoc.loadXML(xmlText);

			if (this.m_xmlDoc.parseError.errorCode != 0) {
				var myErr = this.m_xmlDoc.parseError;
			    alert( "Error parsing the XML document: " + xmlText + ", reason: " + myErr.reason );
			}
			this.m_isActiveX=true;
		}
	}
	catch (err){
	  alert( "Could not parse the XML document: " + xmlText + ", description: " + err.description );
	}

}

/**
 * @private
 *
 * Adds the namespace of with the given prefix and uri to this object.
 */
MDSRV_xmlAPI.prototype.getRootElement = function(){
    if (this.m_xmlDoc.documentElement){
		return this.m_xmlDoc.documentElement;
	}
	return this.m_xmlDoc;
}

/**
 * @private
 *
 * Creates a namespace with the given prefix and mapped uri.
 */

MDSRV_xmlAPI.prototype.createNamespace = function( prefix )
{
	var str = "";

	if ( typeof prefix == "string" )
	{
		var uri = this.m_namespaces[ prefix ];

		if ( typeof uri == "string" )
		{
			if ( uri.indexOf( "http:" ) != -1 )
			{
				str += "xmlns:";
				str += prefix;
				str += "='";
				str += uri;
				str += "'";
			}
		}
	}

	return str;
}

/**
 * @private
 *
 * Adds the namespace of with the given prefix and uri to this object.
 */

MDSRV_xmlAPI.prototype.addNamespace = function( prefix, uri )
{
	this.m_namespaces[ prefix ] = uri;

	if ( this.m_isActiveX )
	{
		var str = "";

		for ( var ns in this.m_namespaces )
		{
			var sNamespace = this.createNamespace( ns );

			if ( sNamespace.length > 0 )
			{
				if ( str.length > 0 )
					str += " ";	// the list of namespaces must be space-separated

				str += sNamespace;
			}
		}

		this.m_xmlDoc.setProperty( "SelectionNamespaces", str );
	}
}

/**
 * @private
 *
 * Selects a single node, as specified by the given xpath.
 * @param contextNode a XMLElement on which the xpath should be executed
 * @param xpath the xpath string to be executed
 *
 * @return a single node which satisifes the xpath
 *
 *
 */
MDSRV_xmlAPI.prototype.selectSingleNode = function(contextNode, xpath){
   var node;
   var namespaces=this.m_namespaces;
   //firefox
	if (document.createExpression){
		var result = this.m_xmlDoc.evaluate(xpath, contextNode,
			function(prefix) {
			    return namespaces[prefix];
			}
			, XPathResult.ANY_TYPE, null);

		node = result.iterateNext();

	}
    else{//ie
		node = contextNode.selectSingleNode(xpath);
	}
    return node;
}

/**
 * @private
 *
 * Selects all the nodes which satisfy  the given xpath.
 * @param contextNode a XMLElement on which the xpath should be executed
 * @param xpath the xpath string to be executed
 * @param resultNodes, an array into which the results will be added
 */
MDSRV_xmlAPI.prototype.selectNodes = function(contextNode, xpath, resultNodes){

   var namespaces=this.m_namespaces;
   //firefox
	if (document.createExpression){
		var result = this.m_xmlDoc.evaluate(xpath, contextNode,
			function(prefix) {
			    return namespaces[prefix];
			}
			, XPathResult.ANY_TYPE, null);

		var node = result.iterateNext();
		while (node){
			resultNodes.push(node);
			node = result.iterateNext();
	    }
	}
    else{//ie
		var nodeList = contextNode.selectNodes(xpath);
		for (i = 0; i < nodeList.length; i++){
		  resultNodes.push(nodeList[i]);
		}
	}
}
