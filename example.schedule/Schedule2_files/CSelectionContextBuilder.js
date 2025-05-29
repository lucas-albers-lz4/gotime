/****************************************************************
** Licensed Materials - Property of IBM
**
** IBM Cognos Products: drill
**
** (C) Copyright IBM Corp. 2001, 2010
**
** US Government Users Restricted Rights - Use, duplication or 
** disclosure restricted by GSA ADP Schedule Contract with 
** IBM Corp.
*****************************************************************/
// Copyright (C) 2008 Cognos ULC, an IBM Company. All rights reserved.
// Cognos (R) is a trademark of Cognos ULC, (formerly Cognos Incorporated).

// JScript source code

//==========================  INTERFACE TO THE API =========================================================

//These objects represent the selection.
//CSelectedCell(), CSelectedMeasure() and soHeader() provide an interface to producing a selection context.


/*
  INTERFACE CONSTRUCTOR: CSelectionContext() represents the OUTPUT selection context.
  It handles output tables and serialization methods that adhere to the selection context schema.
  @param rModel	The model on which this selection context is based.
*/
function CSelectionContext(rModel)
{
	//Input selection structure
	this.rModel		= rModel;
	this.selections = new Array();

	//Selection context schema object tables (holding selectioncontextSchema_metadataCell, selectioncontextSchema_cell etc.)
	this.metadataCells	= new Array();
	this.cells			= new Array();
	this.stringTable	= new scStringTable();
}

/*
  INTERFACE CONSTRUCTOR: CSelectedCell() represents the selection of a particular item and value for that item.
  it optionally contains a list of defining cells that give it context.
  @param sDataItemName		The name of the item being selected (eg: product line)
  @param sMetadataModelItem	The metadata model item (for olap, this could be a level unique name or hierarchy unique name)
  @param sUseValue			The use value (for olap members, this would be a member unique name)
  @param sUseValueType		The use value type (one of string, int, date, memberUniqeName etc.)
  @param sDisplayValue		(optional) A string value that is presented to the user in place of the use value (for olap members, that would be the memberCaption)
  @param sUsage				(optional) one of: measure, nonMeasure (identifier, attribute)
  @param propertiesObject	(optional) The properties object is used to specify additional optional properties for selected cells 
  							that are not part of the interface. It can be initialized using JSON.  							
  							Currently, only the queryName property is supported.
  							sample: propertiesObject = {"queryName":"Query1"};    							 
							queryName is the name of the query that contains the data item selected  							
*/
function CSelectedCell(sDataItemName, sMetadataModelItem, sUseValue, sUseValueType, sDisplayValue, sUsage, oPropertiesObject)
{		

	this.setPropertiesObject(oPropertiesObject);
	this.dataItemName		= sDataItemName;
	this.usage				= sUsage;

	//alert('sDataItemName' + sDataItemName + '\nusage: ' + sUsage + '\nsMetadataModelItem: ' + sMetadataModelItem + '\nsUseValueType: ' + sUseValueType + '\nsUseValue' + sUseValue);
	if (sUsage == 'measure' && sUseValueType == 'memberUniqueName') {
		// @TODO: rsvp/viewer measure cell context workaround (updated)
		// For dimensional measures, (MSAS, PowerCube), rsvp is not yet passing us the metadataModelItem directly, however;
		// it is passing it indirectly as a "MUN" which is actually the metadataModelItem.
		// A change to the viewer (for bug 584459) is passing us the "Hierarchy" as the MMI (and not "null" as it was before).
		// Unfortunately, the hierarchy (which will always be "[ns].[Measures]") is still not sufficient for scoping.
		// 
		// Temporarily adjust for this case pending an rsvp fix by setting both to the use value for this case.
		// Note: A more substantial fix (rsvp/viewer/drill) will be made for the bluesea release and this condition will be removed.
		this.metadataModelItem	= sUseValue;
	} else {
		this.metadataModelItem	= sMetadataModelItem;
	}
	
	this.useValue			= sUseValue;
	this.useValueType		= sUseValueType;
	
	//_memberUniqueName is an acceptable alternative to memberUniqueName 
	//(it was in the initial version of the interface.)
	if (this.useValueType == '_memberUniqueName') {
		this.useValueType = 'memberUniqueName';
	}
	
		
	this.displayValue		= sDisplayValue;
	this.definingCells		= new Array();	//array of CSelectedCell
	this.dependentCells		= new Array();	//array of CSelectedCell
	this.nOutputCellId		= -1;
	
	//Display value passed is now to be set as a dependent cell of type "_memberCaption"...
	if (sDisplayValue != undefined) {
	    this.addDependentCell('_memberCaption', '', sDisplayValue, '_memberCaption');
	}
	//special properties (initialized with addProperty)
	//LevelUniqueName, ParentUniqueName, HierarchyUniqueName, DimensionUniqueName, ordinal
}


/*
  INTERFACE METHOD addSelectedCell()
  Add a new cell to the set of selected cells
  @param sDataItemName		The name of the item being selected (eg: product line)
  @param sMetadataModelItem	The metadata model item (for olap, this could be a level unique name or hierarchy unique name)
  @param sUseValue			The use value (for olap members, this would be a member unique name)
  @param sUseValueType		The use value type (one of string, int, date, memberUniqeName etc.)
  @param sDisplayValue		(optional) A string value that is presented to the user in place of the use value (for olap members, that would be the memberCaption)
  @param sUsage				(optional) one of: measure, nonMeasure (identifier, attribute)
  @param propertiesObject	(optional) The properties object is used to specify additional optional properties for selected cells 
  							that are not part of the interface. It can be initialized using JSON.  							
  							Currently, only the queryName property is supported.
  							sample: propertiesObject = {"queryName":"Query1"};    							 
							queryName is the name of the query that contains the data item selected
*/
CSelectionContext.prototype.addSelectedCell = function(sDataItemName, sMetadataModelItem, sUseValue, sUseValueType, sDisplayValue, sUsage, oPropertiesObject)
{
	var nSelCount = this.selections.length;
	// The required items are encoded to make sure if the source values has a special character we will not encounter any xml parsing errors.
	//debugger;

	this.selections[nSelCount] = new CSelectedCell(sDataItemName, sMetadataModelItem, sUseValue, sUseValueType, sDisplayValue, sUsage, oPropertiesObject);	

	return this.selections[nSelCount];
}

/*
  INTERFACE METHOD addDefiningCell()
  Add a new defining cell for this selected cell.  A defining cell represents something that contributes to this cell's value.
  Examples: The parent cell on a nested crosstab edge or the row edge for a crosstab crosstab fact cell or chart bar (measure).  
  Defining cells also include sections/master values and possibly burst keys etc.
  @param sDataItemName		The name of the item being selected (eg: product line)
  @param sMetadataModelItem	The metadata model item (for olap, this could be a level unique name or hierarchy unique name)
  @param sUseValue			The use value (for olap members, this would be a member unique name)
  @param sUseValueType		The use value type (one of string, int, date, memberUniqeName etc.)
  @param sDisplayValue		(optional) A string value that is presented to the user in place of the use value (for olap members, that would be the memberCaption)
  @param sUsage				(optional) one of: measure, nonMeasure (identifier, attribute)
  @param propertiesObject	(optional) The properties object is used to specify additional optional properties for selected cells 
  							that are not part of the interface. It can be initialized using JSON.  							
  							Currently, only the queryName property is supported.
  							sample: propertiesObject = {"queryName":"Query1"};    							 
							queryName is the name of the query that contains the data item selected
*/
CSelectedCell.prototype.addDefiningCell = function(sDataItemName, sMetadataModelItem, sUseValue, sUseValueType, sDisplayValue, sUsage, oPropertiesObject)
{
	var nDefiningCellCount = this.definingCells.length;
	// The required items are encoded to make sure if the source values has a special character we will not encounter any xml parsing errors.
	
	this.definingCells[nDefiningCellCount] = new CSelectedCell(sDataItemName, sMetadataModelItem, sUseValue, sUseValueType, sDisplayValue, sUsage, oPropertiesObject);		
	
	/** 
	  @todo: add a guard
	**/
	return this.definingCells[nDefiningCellCount];
}

/*
  method setPropertiesObject()
  Set the properties object
  In addition set the selectedCell properties that are passed in as properties of propertiesObject 
  Currently this object only support queryName as its property and 
  sample: oPropertiesObject = {"queryName":"Query1"}; 
  queryName is the name of the query that contains the data item selected
  @param oPropertiesObject	 The object passed in that includes the required properties 
  * 
*/

CSelectedCell.prototype.setPropertiesObject = function(oPropertiesObject){	
	if (typeof oPropertiesObject != "undefined") {				
		if("queryName" in oPropertiesObject){			 		
			this.queryName 			 = oPropertiesObject.queryName;
		} 
	}	
}

/*
  method setQueryName()  
  @param sQueryName		queryName is the name of the query that contains the data item selected
*/
CSelectedCell.prototype.setQueryName = function(sQueryName)
{	
    this.queryName		= sQueryName;    
}


/*
    method getQueryName()
    queryName is the name of the query that contains the data item selected
    Return the queryName. 
*/

CSelectedCell.prototype.getQueryName = function()
{
    return this.queryName;
}


/*
  method setDataItemName()
  Set the name of the item being selected.
  @param sDataItemName		The name of the item being selected (eg: product line)
*/
CSelectedCell.prototype.setDataItemName = function(sDataItemName)
{
    this.dataItemName		= sDataItemName;    
}

/*
    method getDataItemName()
    Return the name of the item being selected.
*/
CSelectedCell.prototype.getDataItemName = function()
{
    return this.dataItemName;
}

/*
  method setMetadataModelItem()
  Set the metadata model item.
  @param sMetadataModelItem		The metadata model item (for olap, this could be a level unique name or hierarchy unique name)
*/
CSelectedCell.prototype.setMetadataModelItem = function(sMetadataModelItem)
{
    this.metadataModelItem		= sMetadataModelItem;    
}

/*
    method getMetadataModelItem()
    Return the metadata model item.
*/
CSelectedCell.prototype.getMetadataModelItem = function()
{
    return this.metadataModelItem;
}

/*
  method setUseValue()
  Set the use value.
  @param sUseValue			The use value (for olap members, this would be a member unique name)
*/
CSelectedCell.prototype.setUseValue = function(sUseValue)
{
    this.useValue		= sUseValue;    
}

/*
    method getUseValue()
    Return the use value.
*/
CSelectedCell.prototype.getUseValue = function()
{
    return this.useValue;
}

/*
  method setUseValueType()
  Set the use value type.
  @param sUseValueType		The use value type (one of string, int, date, memberUniqeName etc.)
*/
CSelectedCell.prototype.setUseValueType = function(sUseValueType)
{
    this.useValueType		= sUseValueType;    
}

/*
    method getUseValueType()
    Return the use value type.
*/
CSelectedCell.prototype.getUseValueType = function()
{
    return this.useValueType;
}

/*
  method setDisplayValue()
  Set the display value.
  @param sDisplayValue		(optional) A string value that is presented to the user in place of the use value (for olap members, that would be the memberCaption)
*/
CSelectedCell.prototype.setDisplayValue = function(sDisplayValue)
{
    this.displayValue		= sDisplayValue;    
}

/*
    method getDisplayValue()
    Return the display value.
*/
CSelectedCell.prototype.getDisplayValue = function()
{
    return this.displayValue;
}

/*
  method setUsage()
  Set the usage.
  @param sUsage		a usage (eg: measure, nonMeasure (or subtype identifier, attribute), null)
*/
CSelectedCell.prototype.setUsage = function(sUsage)
{
    this.usage		= sUsage;    
    // @todo: exception handling: check valid types, if not, throw an exception.
}

/*
    method getUsate()
    Return the usage.
*/
CSelectedCell.prototype.getUsage = function()
{
    return this.usage;
}

/*
  INTERFACE METHOD referenceDefiningCell()
  Reference an existing defining cell for this selected cell.  A defining cell represents something that contributes to this cell's value.
  Examples: The parent cell on a nested crosstab edge or the row edge for a crosstab crosstab fact cell or chart bar (measure).  
  Defining cells also include sections/master values and possibly burst keys etc.
  @param oDefiningCell		A defining cell (already created)
*/
CSelectedCell.prototype.referenceDefiningCell = function(oDefiningCell)
{
	var nDefiningCellCount = this.definingCells.length;
	this.definingCells[nDefiningCellCount] = oDefiningCell;
	/**
	  @todo: add a guard
	**/
	return this.definingCells[nDefiningCellCount];
}

/*
  INTERFACE METHOD addProperty()
  Add a property for this cell.  If the property name is one of the supported "special names", it will be added to the appropriate
  table according to the schema, otherwise; the property is considered a "dependent cell" and a metadatamodelItem is expected to be
  defined.
  @param sPropertyName	The property Name to add (eg: LevelUniqueName or Category_Code).  The list of special properties (ones that don't
						require a dependent cell to be created are generally OLAP member properties (like HierarchyUniqueName, 
						DimensionUniqueName, ParentUniqueName).
  @param sPropertyValue The property Value.
  @param sMetadataModelItem	If this is NOT a special (usu. OLAP) property, this item is required as part of the dependent cell definition.
  @param sUseValueType	(optional) The type of this property 
 TODO: Check and see if similar encoding that we added to addSelectedCell and addDefiningCell is required here 
*/
CSelectedCell.prototype.addProperty = function(sPropertyName, sPropertyValue, sMetadataModelItem, sUseValueType)
{
	if (sPropertyName == 'LevelUniqueName') {
		this.LevelUniqueName = sPropertyValue;
	} else if (sPropertyName == 'DimensionUniqueName') {
		this.DimensionUniqueName = sPropertyValue;
	} else if (sPropertyName == 'HierarchyUniqueName') {
		this.HierarchyUniqueName = sPropertyValue;
	} else if (sPropertyName == 'ordinal') {
		this.ordinal = sPropertyValue;
	} else {
		this.addDependentCell(sPropertyName, sMetadataModelItem, sPropertyValue, sUseValueType);
	}
}

/*
  Add a dependent cell for this CSelectedCell object
  A dependent cell is one that is 'owned' by another cell and represents properties of the parent cell such as level attributes
  (Note: these are attributes with independent metadata model items NOT things like role-based properties associated with a member)
  @param sPropertyName		The name of this property (eg: Population, PPDS_CODE or CategoryCode)
  @param sMetadtaModelItem	The metadata model item (eg: [outdoors].[countries].[country].[Population])
  @param sUseValue			The use value (eg: 56,352 for population)
*/												
CSelectedCell.prototype.addDependentCell = function(sPropertyName, sMetadataModelItem, sUseValue, sUseValueType)
{
	var nDependentCellCount = this.dependentCells.length;
	this.dependentCells[nDependentCellCount] = new CSelectedCell(sPropertyName, sMetadataModelItem, sUseValue, sUseValueType);
	/**
	  @todo: add a guard
	**/
	return this.dependentCells[nDependentCellCount];
}


//==========================  preparing the selection context for output.

//prepareSchemaObjects is conceptually similar to parsing.  Essentially, all of the objects that have been added to the tree structure are prepared
//into the object model representation of a selection context (for serializing).
CSelectionContext.prototype.prepareSchemaObjects = function()
{
	for (var i=0; i<this.selections.length; i++) {
		//select all the root selection objects.
		var objSelectionRoot = this.selections[i];
		//Method to recursively create selection context structures for a selection tree branch and its children
		objSelectionRoot.prepareSchemaObjects(this);
	}
}

/*
  CSelectedCell.prepareSchemaObjects
  Recursive method to Convert a CSelectedCell and its defining cells into selectioncontext schema objects
  @param oSelectionContext	The selection context where the schema objects will be created.
*/
CSelectedCell.prototype.prepareSchemaObjects = function(oSelectionContext)
{
	//Initialize the strings and metadata entries....
	var nNewCellId=oSelectionContext.cells.length;
	
	//create the selection context output objects...............................................

	//Add a name entry to the string table and keep a reference ID to that name for the metadataCell
	var nNewNameId=oSelectionContext.addString('N', this.dataItemName);
		
	//add a metdata entry for it....
	var nNewMetadataIdx=oSelectionContext.metadataCells.length;
	oSelectionContext.addMetadataCell(nNewMetadataIdx, nNewNameId, this );

	//add an entry to the string table for the value and keep a reference to that ID for the schemaCell (ie: the <s:cell rValue=)
	var nNewValueIdx=oSelectionContext.addString("V", this.useValue);
	
	//add the output cell object
	var oschemaCell = new selectioncontextSchema_Cell(nNewCellId, nNewMetadataIdx, nNewValueIdx, this.displayValue);
	oSelectionContext.cells[nNewCellId] = oschemaCell;
	
	/**
	  @INVESTIGATE: The way this is defined, the cell that has defining cells will be written BEFORE the cells it is referencing
	  (eg: If Cell C_00 is the cell that has defining cells, it might contain a reference rCell=C_01, then Cell C_01 will be written)
	  I don't THINK this is a problem .... XML is supposed to be order independent.  The function could be changed by processing
	  defining cells first but it makes the definingCellAxisList list a bit trickier
	**/
	if (this.definingCells!=undefined && this.definingCells.length > 0) {
		for (var i=0; i < this.definingCells.length; i++) {
			var odefiningSchemaCell = this.definingCells[i].prepareSchemaObjects(oSelectionContext);
			odefiningSchemaCell.rSelectedCell=false;	//If something is a defining cell, it shouldn't be in the selected cells list.
			nDefiningCellCount = oschemaCell.definingCellAxisList.length;
			
			/**
			  @TODO: when multiple child cells reference the same parent (ie: siblings under parent "Camping Equipment"), the
					 parent reference should be to the same ID not a new cell with all the same values (its still a valid S/C but less compact)
			**/
			oschemaCell.definingCellAxisList[nDefiningCellCount] = new selectioncontextSchema_Axis(odefiningSchemaCell.nXMLid, this.definingCells[i].ordinal);
		}
	}
	
	//dependent cells
	if (this.dependentCells!=undefined && this.dependentCells.length > 0) {
		for (var i=0; i < this.dependentCells.length; i++) {
			var odependentSchemaCell = this.dependentCells[i].prepareSchemaObjects(oSelectionContext);
			odependentSchemaCell.rSelectedCell=false;	//If something is a dependent cell, it shouldn't be in the selected cells list.
			oschemaCell.addDependentCell(odependentSchemaCell);
			odependentSchemaCell.bDependentCell = true;
		}
	}
	
	this.nOutputCellId = nNewCellId;
	return oschemaCell;
}

//==========================  SELECTION CONTEXT SCHEMA OBJECTS =========================================================


//This section defines objects from the selection context schema.  They provide a staging area for serializing the XML output.

/*
  CONSTRUCTOR: selectioncontextSchema_MetadataCell represents an entry in the <s:metadataCells> table.
  @param nXMLid		the xmlId of this metadataCell
  @param nrName		the reference to the name entry in the string table for this metadata cell.
  @param nrExpression	the reference to the level unique name entry in the string table for this metadata cell.
  @param nrUsage 		a reference to the usage in the string table for this metadata cell.
  @param nrQueryName	a reference to the queryName in the string table for this metadata cell.  
*/
function selectioncontextSchema_MetadataCell(/*xml:id="M_#"*/nXMLid, /*N_#*/nrName, /*QI_#*/nrExpression, /*T_#*/nrType, /*U_#*/nrUsage, /*QN_#*/nrQueryName)
{
	this.nXMLid					= nXMLid;
	this.nrName					= nrName;
	this.nrExpression			= nrExpression;
	this.nrType					= nrType;
	this.nrUsage				= nrUsage;
	this.nrQueryName			= nrQueryName;

	//special properties that apply to the metadata cell.
	this.nrLevelUniqueName		= undefined;
	this.nrHierarchyUniqueName	= undefined;
	this.nrDimensionUniqueName	= undefined;
}

/*
  CONSTRUCTOR: selectionContextSchema_Cell
  @param nXMLid	the xmlId of this cell
  @param nrMetadtaCell	the reference ID for this cells metadataCell information.
  @param nrValue		the reference ID for this cells value.
  @param sDisplayValue	(optional) the display value for this cell - display=
*/
function selectioncontextSchema_Cell(/*xml:id="C_X"*/nXMLid, /*rMetadataCell="M_#"*/ nrMetadataCell, /*rValue="V_#"*/ nrValue, /*display=*/ sDisplayValue)
{
	this.rSelectedCell		= true;		//default this to being part of the rSelectedCells list (it will get updated)
	this.bDependentCell		= false;
	this.nXMLid				= nXMLid;
	this.nrMetadataCell		= nrMetadataCell;
	this.nrValue			= nrValue;
	this.displayValue		= sDisplayValue;	//Note: not a reference

	//an selectioncontextSchema_Cell can contain a list of dependent cells (which store dependent member properties - like ppdscode, caption for this member)
	this.dependentCells		= new Array();

	//and a list of defining cells (which define their position relative to other cells)
	this.definingCellAxisList	= new Array();
}

/*
  CONSTRUCTOR: selectionContextSchema_Axis
  @param nrCell	a reference to its parent cell object  (ie: an s:axis is a node under s:definingCells under an s:cell.  nrCell would be the xml:id of the s:cell.)
  @param ordinal (optional)	The ordinal of this defining cell's axis.
*/
function selectioncontextSchema_Axis(/*rCell="C_X"*/nrCell, /*ordinal="X"*/nOrdinal)
{
	this.nrCell = nrCell;
	this.nOrdinal=nOrdinal;
}

selectioncontextSchema_Cell.prototype.addDependentCell = function(oDependentCell)
{
	var nDependentCellCount = this.dependentCells.length;
	this.dependentCells[nDependentCellCount] = oDependentCell;
}

/**
  @TODO: probably should have a string object but its so simple, we just use the addString method and fill in the xml directly for now.
  function scString(nXMLid, sValue)
  {
  }
**/

/*
  scOutput::addString()
  Adds a string to the named string table.   
  @param sTable The name of the table to add the string to
  @param sValue The value to add
  @return the index
*/
CSelectionContext.prototype.addString = function(sTable, sValue)
{
	if (sValue == undefined) {		
		return -1;
	}
	
	var nStringTableLength=this.stringTable[sTable].length;
	for (var i=0; i<nStringTableLength; i++) {		
		if (sValue == this.stringTable[sTable][i]) {
			return i;
		}
	}
	//Didn't find it...insert a new entry
	this.stringTable[sTable][nStringTableLength] = sValue;
	return nStringTableLength;
}

//class scStringTable constructor
//The string table is made up of a number of named sub-tables
function scStringTable()
{
	this.QN = new Array(); // An array of queryName
	this.N = new Array();  // An array of DataItemName
	this.T = new Array();  // An array of Type 
	this.V = new Array();  // An array of Value
	this.QI = new Array(); // An array of expression 
	this.L = new Array();  
	this.SV = new Array();
	this.D = new Array();
	this.H = new Array();
	this.U = new Array();	//An array of usages
	this.MP= new Array();	//An array of (one?) model
}



//SERIALIZER OBJECTS AND METHODS FOR SELECTION CONTEXT SCHEMA OBJECTS

/*
  produce a string of xml representing the header <s:selection> tag and its contents.
  @param objHeader	an object representing the header (contains the model reference)
  @param objCells	The list of all cells.  Only the ones that haven't been eliminated from the selected cells (because they
					are defining cells) are produced.
*/
CSelectionContext.prototype.serializeHeader = function()
{
	 /*
	  Add the model reference to the string table
	  @TODO: Normally, this should go in "prepare" but its easiest to put this here (since its a singleton)
	*/
	var nModelIdx = this.addString('MP', this.rModel);

	var sSCHeader = '<s:selection';
	sSCHeader+=this.serializeReferenceAttr('rModel', 'MP', nModelIdx);
	sSCHeader+=' xmlns:s="http://developer.cognos.com/schemas/selection/1/"';
	sSCHeader+=' xmlns:xml="http://www.w3.org/XML/1998/namespace"';
	if (this.cells.length > 0) {
		var nPrependSpace=0;
		sSCHeader+=' rSelectedCells="';
		for (var i=0; i<this.cells.length; i++) {
			if (this.cells[i].rSelectedCell == true) {
				if (nPrependSpace==0) {
					nPrependSpace=1;
				} else {
					sSCHeader+=' ';
				}
				sSCHeader+='C_';
				sSCHeader+=i;
			}
		}
		sSCHeader+='"';
	}
	sSCHeader+='>';
	return sSCHeader;
}

//produce a string of xml representing the footer </s:selection> tag and its contents.
CSelectionContext.prototype.serializeFooter = function()
{
	return '</s:selection>';
}

//SelectionContext::serializeStrings()
//Produce a string of xml for the string table of a selection context.
CSelectionContext.prototype.serializeStrings = function()
{
	var sStringTable="<s:strings>";
	var i=0;

	for (var arrayName in this.stringTable) {
		for (i=0; i<this.stringTable[arrayName].length; i++) {
			sStringTable+='<s:s xml:id="';
			sStringTable+=arrayName;
			sStringTable+='_';
			sStringTable+=i;
			sStringTable+='">';
			sStringTable+=xml_encode(this.stringTable[arrayName][i]);
			sStringTable+='</s:s>';
		}
	}
	sStringTable+="</s:strings>";
	return sStringTable;
}

/*
  This is a helper method to write a selection context "reference attribute".
  The selection context has a large number of properties that are references to items in different tables.
  The form of these is r<PROPNAME>="<TYPE>_#" (where # is >= 0)
  @param sRefAttrName	The name (eg: rName)
  @param sAttrType		The type (eg: "N")
  @param nrAttr			The # part of (TYPE_#).  Note: If # is not a valid reference (<=0 or undefined), this method returns an empty string.
  @return A string <sRefAttrName>=<sAttrType>_<nrAttr> (or "" if # is not a valid reference)
*/
CSelectionContext.prototype.serializeReferenceAttr = function(sRefAttrName, sAttrType, nrAttr)
{
	var sReturn="";
	if (nrAttr != undefined && nrAttr >= 0) {
		sReturn = ' ' + sRefAttrName + '="' + sAttrType + "_" + nrAttr + '"';
	}
	return sReturn;
}

/*
  Produce a string of xml for the metadata table: (<s:metadataCells> and the list of its <s:metadataCell> objects)
  sample:
	<s:metadataCell xml:id="M_0" rQueryName="QN_0" rName="N_0" rExpression="QI_0" rType="T_0"/>
	</s:metadataCells>
    @param objMetadataTable	The metadata table object representation from which the string will be generated.
*/
CSelectionContext.prototype.serializeMetadataCells = function(objMetadataTable)
{
	var sMetadataTable="<s:metadataCells>";
	
	//serialize each selectioncontextSchema_MetadataCell in the table....
	for (x=0; x<objMetadataTable.length; x++) {
		oMetadataCell = objMetadataTable[x];
		var sMetadataCellXML = '<s:metadataCell';
		sMetadataCellXML+=this.serializeReferenceAttr('xml:id',		'M',  oMetadataCell.nXMLid);
		sMetadataCellXML+=this.serializeReferenceAttr('rQueryName',		'QN',  oMetadataCell.nrQueryName);
		sMetadataCellXML+=this.serializeReferenceAttr('rName',		'N',  oMetadataCell.nrName);
		sMetadataCellXML+=this.serializeReferenceAttr('rExpression','QI', oMetadataCell.nrExpression);
		sMetadataCellXML+=this.serializeReferenceAttr('rType',		'T',  oMetadataCell.nrType);
		sMetadataCellXML+=this.serializeReferenceAttr('rUsage',		'U',  oMetadataCell.nrUsage);
		
		//special properties for metadataCells....
		sMetadataCellXML+=this.serializeReferenceAttr('rDimensionUniqueName', 'D', oMetadataCell.nrDimensionUniqueName);
		sMetadataCellXML+=this.serializeReferenceAttr('rHierarchyUniqueName', 'H', oMetadataCell.nrHierarchyUniqueName);
		sMetadataCellXML+=this.serializeReferenceAttr('rLevelUniqueName', 'L', oMetadataCell.nrLevelUniqueName);
		
		sMetadataCellXML+="/>";
		sMetadataTable+=sMetadataCellXML;
	}
	sMetadataTable+="</s:metadataCells>";
	return sMetadataTable;
}
/*
  Serialize the contents of one schema cell, references to cells it is defined by and recursively serialize its dependents
  @param oSelectionContext	The selection context to which provides helpers for writing reference attributes
  @return a string representing the xml for this cell including refernces mentioned above.
*/
selectioncontextSchema_Cell.prototype.serialize = function(oSelectionContext)
{

	var sCellXML ='<s:cell';
	sCellXML+= oSelectionContext.serializeReferenceAttr('xml:id',		 'C',	this.nXMLid);
	sCellXML+= oSelectionContext.serializeReferenceAttr('rMetadataCell', 'M',	this.nrMetadataCell);
	sCellXML+= oSelectionContext.serializeReferenceAttr('rValue',		 'V',	this.nrValue);
	
	/**
	  @TODO: Special properties for cells should be serialized here....
	**/
	if (this.displayValue != undefined) {
		sCellXML += ' display="';
		sCellXML += xml_encode(this.displayValue);
		sCellXML += '"';
	}

    //If either dependent or defining cells are defined, we need to close of the opening cell tag to append contents to it.
	if (this.definingCellAxisList.length > 0 || this.dependentCells.length > 0) {
		sCellXML += '>';
	}

	//If this cell has dependent cells serialize them...
	if (this.dependentCells.length > 0) {
		sCellXML += '<s:dependentCells>';
		for (var xx=0; xx < this.dependentCells.length; xx++) {
			sCellXML+=this.dependentCells[xx].serialize(oSelectionContext);
		}
		sCellXML += '</s:dependentCells>';
	}
	
	//If this cell has defining cells, serialize REFERENCES to them....
	if (this.definingCellAxisList.length > 0) {
		sCellXML += '<s:definingCells>';
		for (var xx=0; xx<this.definingCellAxisList.length; xx++) {
			sCellXML+='<s:axis';
			sCellXML+= oSelectionContext.serializeReferenceAttr('rCell', 'C', this.definingCellAxisList[xx].nrCell);
			if (this.definingCellAxisList[xx].nOrdinal != undefined) {
				sCellXML+= (' ordinal="' + this.definingCellAxisList[xx].nOrdinal + '"');
			}
			sCellXML += '/>';
		}
		sCellXML += '</s:definingCells>';
	}

	if (this.definingCellAxisList.length == 0 && this.dependentCells.length == 0) {
		sCellXML += "/>";
	} else {
		sCellXML += "</s:cell>";
	}
	
	return sCellXML;
}

/*
  CSelectionContext::serializeCells()
  Produce selection context XML representing all of the selectioncontextSchema_Cells in the cell table.
  Note: only non-dependent cells are written directly by this method.   Dependents are written by their parent cells. (see serialize of the schema_Cell)
  @param objCells	The full array of schema cells.
*/
CSelectionContext.prototype.serializeCells = function(objCells)
{
	var sCells="<s:cells>";
	
	for (var x=0; x<objCells.length; x++) {
		//serialize the main part of the cell
		var oscCell = objCells[x];

		if (oscCell.bDependentCell == true) {
			//dependent cells are serialized as part of the cell that they depend on.
			continue;
		}
		sCells += oscCell.serialize(this);
	}
	sCells+="</s:cells>";
	return sCells;
}

/*
  CSelectionContext::serializeSelectionContext
  @param objSelectionTree	The input selection tree
  @return a string of XML that is the selection context corresponding to this tree.
*/
CSelectionContext.prototype.toString = function(objSelectionTree)
{
	//"select" the objects (by building an object set suitable for serialization as a selection context)
	this.prepareSchemaObjects();

	var sOutputSelectionContextXML= this.serializeHeader();
	sOutputSelectionContextXML+=	this.serializeMetadataCells(this.metadataCells);
	sOutputSelectionContextXML+=	this.serializeCells(this.cells);
	sOutputSelectionContextXML+=	this.serializeStrings();
	sOutputSelectionContextXML+=	this.serializeFooter();
	return sOutputSelectionContextXML;
}

/*
  method: oSelectionContext::addMetadataCell()
  Add a metadatacell object to the selection context output structure as well as any related strings to the string table.
  @param nNewMetadataIdx		The index for this reference  (xml:id=M_#)
  @param nNewNameIdx			The index in the string table where the name for this cell is stored  (rName="N_#")
  @param sMetadataModelItem		The level unique name (for OLAP)
*/
CSelectionContext.prototype.addMetadataCell = function(nNewMetadataIdx, nNewNameIdx, oCell)
{	
	var nNewTypeIdx=this.addString("T", oCell.useValueType);
	
	if (oCell.metadataModelItem != '') {
		//Add a new lun entry to the sting table and a reference to that lun in the metadataCell
		var nNewQueryNameIdx	=this.addString("QN",oCell.queryName);
		var nNewQIIdx			=this.addString("QI", oCell.metadataModelItem);
		var nNewTypeIdx 		=this.addString("T", oCell.useValueType);
		var nNewUsageIdx		=this.addString("U", oCell.usage);
		this.metadataCells[nNewMetadataIdx]= new selectioncontextSchema_MetadataCell(nNewMetadataIdx, nNewNameIdx, nNewQIIdx, nNewTypeIdx, nNewUsageIdx, nNewQueryNameIdx);
		
		//Add special properties to the metadata cell (if any)
		if (oCell.LevelUniqueName != undefined && oCell.LevelUniqueName != null) {
			var nNewLunIdx = this.addString("L", oCell.LevelUniqueName);
			this.metadataCells[nNewMetadataIdx].nrLevelUniqueName = nNewLunIdx;
		}	
		if (oCell.HierarchyUniqueName != undefined && oCell.HierarchyUniqueName != null ) {
			var nNewHunIdx = this.addString("H", oCell.HierarchyUniqueName);
			this.metadataCells[nNewMetadataIdx].nrHierarchyUniqueName = nNewHunIdx;
		}
		if (oCell.DimensionUniqueName != undefined && oCell.DimensionUniqueName != null ) {
			var nNewDunIdx = this.addString("D", oCell.DimensionUniqueName);
			this.metadataCells[nNewMetadataIdx].nrDimensionUniqueName = nNewDunIdx;
		}
	} else {
		this.metadataCells[nNewMetadataIdx]= new selectioncontextSchema_MetadataCell(nNewMetadataIdx, nNewNameIdx, -1, nNewTypeIdx);
	}
}

/*
xml encodes the string that is passed to it
@param str	The string to be xml encoded (all non-string values will be returned unaltered.)
@return 	encoded string 
*/
function xml_encode(str) {
	//Since we call this function for the optional parameters in the interface as wellwe need to have this guard	
	if (str!=null && typeof str == 'string'){
		return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
	}
	return str;
}
