/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2014
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */
 function CViewerHelper(){
this.m_oCV=null;
};
CViewerHelper.prototype.getCVObjectRef=function(){
return this.getCV().getObjectId();
};
CViewerHelper.prototype.getCV=function(){
if(this.m_oCV){
return this.m_oCV;
}
return window;
};
CViewerHelper.prototype.getCVId=function(){
var _1="";
if(this.m_oCV){
_1=this.m_oCV.getId();
}
return _1;
};
CViewerHelper.prototype.setCV=function(_2){
this.m_oCV=_2;
};
function CObserver(_3){
this.m_subject=_3;
this.m_observers=[];
};
function CObserver_attach(_4,_5,_6){
if(_4==null||typeof _4.update!="function"){
alert("Notification Frame Work Error : attach failed");
return false;
}
var _7=new CState(this.m_subject,_4,_5?_5:null,_6?_6:null);
this.m_observers[this.m_observers.length]=_7;
return true;
};
function CObserver_detach(_8){
};
function CObserver_hasObserver(_9){
var _a=false;
for(var _b=0;_b<this.m_observers.length;_b++){
if(this.m_observers[_b].getObserver()==_9){
_a=true;
break;
}
}
return _a;
};
function CObserver_notify(_c){
var i=0;
if(typeof _c!="undefined"&&_c!=null){
for(i=0;i<this.m_observers.length;++i){
if(this.m_observers[i].getEvt()==_c){
var _e=this.m_observers[i].getObserver();
var _f=this.m_observers[i].getCallback();
var _10=_e.update;
_e.update=_f;
_e.update(this.m_observers[i]);
_e.update=_10;
}
}
}else{
for(i=0;i<this.m_observers.length;++i){
this.m_observers[i].getObserver().update(this.m_observers[i].getSubject());
}
}
};
CObserver.prototype.attach=CObserver_attach;
CObserver.prototype.detach=CObserver_detach;
CObserver.prototype.notify=CObserver_notify;
CObserver.prototype.hasObserver=CObserver_hasObserver;
function CState(_11,_12,_13,evt){
this.m_subject=_11;
this.m_observer=_12;
this.m_callback=_13;
this.m_evt=evt;
};
function CState_getObserver(){
return this.m_observer;
};
function CState_getCallback(){
return this.m_callback;
};
function CState_getSubject(){
return this.m_subject;
};
function CState_getEvt(){
return this.m_evt;
};
CState.prototype.getObserver=CState_getObserver;
CState.prototype.getCallback=CState_getCallback;
CState.prototype.getSubject=CState_getSubject;
CState.prototype.getEvt=CState_getEvt;
function CParameterValueStringOperators(_15,_16,_17,_18){
this.m_sBetween=_15;
this.m_sNotBetween=_16;
this.m_sLessThan=_17;
this.m_sGreaterThan=_18;
};
function CParameterValues(){
this.m_parameterValues=new CDictionary();
};
CParameterValues.prototype.length=function(){
var _19=this.m_parameterValues.keys();
if(typeof _19=="undefined"||_19==null){
return 0;
}
return _19.length;
};
CParameterValues.prototype.getParameterValue=function(_1a){
if(typeof _1a!="string"||_1a==""){
return null;
}
if(this.m_parameterValues.exists(_1a)){
return this.m_parameterValues.get(_1a);
}
return null;
};
CParameterValues.prototype.getAt=function(_1b){
if(_1b<this.length()){
var _1c=this.m_parameterValues.keys();
if(this.m_parameterValues.exists(_1c[_1b])){
return this.m_parameterValues.get(_1c[_1b]);
}
}
return null;
};
CParameterValues.prototype.addParameterValue=function(_1d,_1e){
var _1f=this.getParameterValue(_1d);
if(_1f==null){
_1f=new CParameterValue();
_1f.setName(_1d);
}
_1f.addParmValueItem(_1e);
this.m_parameterValues.add(_1d,_1f);
};
CParameterValues.prototype.removeParameterValue=function(_20){
return (this.m_parameterValues.remove(_20)!=null);
};
CParameterValues.prototype.removeSimpleParmValueItem=function(_21,_22){
var _23=this.getParameterValue(_21);
if(_23==null){
return false;
}
return _23.removeSimpleParmValueItem(_22);
};
CParameterValues.prototype.addSimpleParmValueItem=function(_24,_25,_26,_27){
if(typeof _24!="string"||_24==""){
return null;
}
if(typeof _25!="string"||_25==""){
return null;
}
if(typeof _26!="string"){
return null;
}
if(typeof _27!="string"||(_27!="false"&&_27!="true")){
return null;
}
var _28=null;
if(this.m_parameterValues.exists(_24)==false){
_28=new CParameterValue(_24);
this.m_parameterValues.add(_24,_28);
}
_28=this.m_parameterValues.get(_24);
if(typeof _28=="undefined"||_28==null){
return null;
}
var _29=_28.getParmValueItems();
for(var _2a=0;_2a<_29.length;++_2a){
var _2b=_29[_2a];
if(_2b.getDisplayValue()==_26&&_2b.getUseValue()==_25){
return;
}
}
return _28.addSimpleParmValueItem(_25,_26,_27);
};
CParameterValues.prototype.getSimpleParmValueItem=function(_2c,_2d){
var _2e=this.getParameterValue(_2c);
if(_2e!=null){
return _2e.getSimpleParmValueItem(_2d);
}
return null;
};
CParameterValues.prototype.load=function(_2f){
return this.loadWithOptions(_2f,true);
};
CParameterValues.prototype.loadWithOptions=function(_30,_31){
try{
var _32=_30.childNodes;
for(var _33=0;_33<_32.length;++_33){
var _34=_32[_33];
if(_34.nodeType==3){
continue;
}
var _35=new CParameterValue();
if(_35.load(_34)){
var _36=_35.name();
if(_36!=""){
if(_31==true||_36.indexOf("credential:")!=0){
this.m_parameterValues.add(_36,_35);
}
}
}else{
delete _35;
}
}
}
catch(e){
return false;
}
return true;
};
CParameterValues.prototype.buildXML=function(_37,_38,_39){
var _3a=_38.createElement(_39);
_37.XMLBuilderSetAttributeNodeNS(_3a,"xmlns:xs","http://www.w3.org/2001/XMLSchema");
_37.XMLBuilderSetAttributeNodeNS(_3a,"xmlns:bus","http://developer.cognos.com/schemas/bibus/3/");
_37.XMLBuilderSetAttributeNodeNS(_3a,"xmlns:xsd","http://www.w3.org/2001/XMLSchema");
_37.XMLBuilderSetAttributeNodeNS(_3a,"xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance");
_37.XMLBuilderSetAttributeNodeNS(_3a,"SOAP-ENC:arrayType","bus:parameterValue[]","http://schemas.xmlsoap.org/soap/encoding/");
_37.XMLBuilderSetAttributeNodeNS(_3a,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_38.documentElement.appendChild(_3a);
var _3b=this.m_parameterValues.keys();
for(var _3c=0;_3c<_3b.length;++_3c){
if(this.m_parameterValues.exists(_3b[_3c])){
var _3d=this.m_parameterValues.get(_3b[_3c]);
_3d.generateXML(_37,_3a);
}
}
return _3a;
};
CParameterValues.prototype.generateXML=function(_3e,_3f,_40){
var _41="parameterValues";
if(typeof _40!="undefined"&&_40!=null){
_41=_40;
}
XMLBuilderSerializeNode(this.buildXML(_3e,_3f,_41));
return XMLBuilderSerializeNode(_3f);
};
function CParameterValue(_42){
this.m_name=_42;
this.m_parmValueItems=[];
};
CParameterValue.prototype.name=function(){
return this.m_name;
};
CParameterValue.prototype.setName=function(_43){
this.m_name=_43;
};
CParameterValue.prototype.getParmValueItems=function(){
return this.m_parmValueItems;
};
CParameterValue.prototype.length=function(){
return this.m_parmValueItems.length;
};
CParameterValue.prototype.addParmValueItem=function(_44){
this.m_parmValueItems.push(_44);
};
CParameterValue.prototype.addSimpleParmValueItem=function(_45,_46,_47){
if(typeof _45!="string"||_45==""){
return null;
}
if(typeof _46!="string"){
return null;
}
if(typeof _47!="string"||(_47!="false"&&_47!="true")){
return null;
}
var _48=new CSimpleParmValueItem(_45,_46,_47);
this.m_parmValueItems.push(_48);
return _48;
};
CParameterValue.prototype.removeSimpleParmValueItem=function(_49){
if(typeof _49!="string"||_49==""){
return false;
}
var _4a=[];
var _4b=false;
for(var _4c=0;_4c<this.length();++_4c){
var _4d=this.m_parmValueItems[_4c];
if(_4d instanceof CSimpleParmValueItem){
if(_4d.getUseValue()==_49){
_4b=true;
continue;
}
}
_4a.push(_4d);
}
this.m_parmValueItems=_4a;
return _4b;
};
CParameterValue.prototype.getSimpleParmValueItem=function(_4e){
if(typeof _4e!="string"||_4e==""){
return null;
}
for(var _4f=0;_4f<this.length();++_4f){
var _50=this.m_parmValueItems[_4f];
if(_50 instanceof CSimpleParmValueItem){
if(_50.getUseValue()==_4e){
return _50;
}
}
}
return null;
};
CParameterValue.prototype.load=function(_51){
var _52=_51.getAttributeNode("xsi:type");
if(_52==null||_52.nodeValue!="bus:parameterValue"){
return false;
}
var _53=XMLHelper_FindChildByTagName(_51,"name",false);
if(_53==null){
return false;
}
this.m_name=XMLHelper_GetText(_53);
if(this.m_name==""){
return false;
}
var _54=XMLHelper_FindChildByTagName(_51,"value",false);
if(_54==null){
return false;
}
var _55=_54.getAttributeNode("xsi:type");
if(_55==null||_55.nodeValue!="SOAP-ENC:Array"){
return false;
}
var _56=_54.getAttributeNode("SOAP-ENC:arrayType");
if(_56==null||_56.nodeValue.indexOf("bus:parmValueItem[")==-1){
return false;
}
var _57=_54.childNodes;
for(var _58=0;_58<_57.length;++_58){
var _59=_57[_58];
if(_59.nodeType==3){
continue;
}
var _5a=_59.getAttributeNode("xsi:type");
if(_5a!=null){
var _5b;
var _5c;
switch(_5a.nodeValue){
case "bus:simpleParmValueItem":
_5b=new CSimpleParmValueItem("","","");
break;
case "bus:boundRangeParmValueItem":
_5b=new CBoundRangeParmValueItem();
break;
case "bus:unboundedEndRangeParmValueItem":
_5b=new CUnboundedEndRangeParmValueItem();
break;
case "bus:unboundedStartRangeParmValueItem":
_5b=new CUnboundedStartRangeParmValueItem();
break;
case "bus:hierarchicalParmValueItem":
_5b=new CHierarchicalParmValueItem();
break;
default:
return false;
}
_5c=_5b.load(_59);
if(_5c){
this.m_parmValueItems.push(_5b);
}else{
delete _5b;
}
}
}
return true;
};
CParameterValue.prototype.generateXML=function(_5d,_5e){
var _5f=_5e.ownerDocument;
var _60=_5f.createElement("item");
_5d.XMLBuilderSetAttributeNodeNS(_60,"xsi:type","bus:parameterValue","http://www.w3.org/2001/XMLSchema-instance");
_5e.appendChild(_60);
var _61=_5d.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:name",_5f);
_5d.XMLBuilderSetAttributeNodeNS(_61,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_61.appendChild(_5f.createTextNode(this.m_name));
_60.appendChild(_61);
var _62=_5d.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:value",_5f);
_5d.XMLBuilderSetAttributeNodeNS(_62,"SOAP-ENC:arrayType","bus:parmValueItem[]","http://schemas.xmlsoap.org/soap/encoding/");
_5d.XMLBuilderSetAttributeNodeNS(_62,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_60.appendChild(_62);
for(var _63=0;_63<this.m_parmValueItems.length;++_63){
if(typeof this.m_parmValueItems[_63].generateXML!="undefined"){
this.m_parmValueItems[_63].generateXML(_5d,_62);
}
}
};
CParameterValue.prototype.toString=function(_64){
var _65="";
for(var _66=0;_66<this.m_parmValueItems.length;++_66){
if(_65!=""){
_65+=", ";
}
if(typeof this.m_parmValueItems[_66].toString!="undefined"){
_65+=this.m_parmValueItems[_66].toString(_64);
}
}
return _65;
};
function CParmValueItem(){
this.initialize("true");
};
CParmValueItem.prototype.getInclusiveValue=function(){
return this.m_inclusiveValue;
};
CParmValueItem.prototype.setInclusiveValue=function(_67){
this.m_inclusiveValue=_67;
};
CParmValueItem.prototype.initialize=function(_68){
this.m_inclusiveValue=_68;
};
CParmValueItem.prototype.load=function(_69){
this.m_inclusiveValue="true";
var _6a=XMLHelper_FindChildByTagName(_69,"inclusive",false);
if(_6a!=null){
var _6b=XMLHelper_GetText(_6a);
if(_6b=="true"||_6b=="false"){
this.m_inclusiveValue=_6b;
}
}
};
CParmValueItem.prototype.generateXML=function(_6c,_6d){
var _6e=_6d.ownerDocument;
var _6f=_6c.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:inclusive",_6e);
_6c.XMLBuilderSetAttributeNodeNS(_6f,"xsi:type","xs:boolean","http://www.w3.org/2001/XMLSchema-instance");
_6f.appendChild(_6e.createTextNode(this.m_inclusiveValue));
_6d.appendChild(_6f);
};
function CSimpleParmValueItem(_70,_71,_72){
CSimpleParmValueItem.baseclass.initialize.call(this,_72);
this.m_useValue=_70;
this.m_displayValue=_71;
};
CSimpleParmValueItem.prototype=new CParmValueItem();
CSimpleParmValueItem.prototype.constructor=CSimpleParmValueItem;
CSimpleParmValueItem.baseclass=CParmValueItem.prototype;
CSimpleParmValueItem.prototype.getUseValue=function(){
return this.m_useValue;
};
CSimpleParmValueItem.prototype.getDisplayValue=function(){
return this.m_displayValue;
};
CSimpleParmValueItem.prototype.getParmValueItem=function(){
return this.m_parmValueItem;
};
CSimpleParmValueItem.prototype.setDisplayValue=function(_73){
this.m_displayValue=_73;
};
CSimpleParmValueItem.prototype.setUseValue=function(_74){
this.m_useValue=_74;
};
CSimpleParmValueItem.prototype.toString=function(_75){
return this.getDisplayValue();
};
CSimpleParmValueItem.prototype.load=function(_76){
CSimpleParmValueItem.baseclass.load.call(this,_76);
var _77=XMLHelper_FindChildByTagName(_76,"use",false);
if(_77==null){
return false;
}
var _78=XMLHelper_GetText(_77);
if(_78==""){
return false;
}
this.m_useValue=_78;
var _79=XMLHelper_FindChildByTagName(_76,"display",false);
if(_79!=null){
this.m_displayValue=XMLHelper_GetText(_79);
}
return true;
};
CSimpleParmValueItem.prototype.generateXML=function(_7a,_7b){
var _7c=_7b.ownerDocument;
var _7d=_7c.createElement("item");
_7a.XMLBuilderSetAttributeNodeNS(_7d,"xsi:type","bus:simpleParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
_7b.appendChild(_7d);
CSimpleParmValueItem.baseclass.generateXML.call(this,_7a,_7d);
var _7e=_7a.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:use",_7c);
_7a.XMLBuilderSetAttributeNodeNS(_7e,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_7e.appendChild(_7c.createTextNode(this.m_useValue));
_7d.appendChild(_7e);
var _7f=_7a.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:display",_7c);
_7a.XMLBuilderSetAttributeNodeNS(_7f,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_7f.appendChild(_7c.createTextNode(this.m_displayValue));
_7d.appendChild(_7f);
};
function CBoundRangeParmValueItem(){
CBoundRangeParmValueItem.baseclass.initialize.call(this,"true");
this.m_start=null;
this.m_end=null;
};
CBoundRangeParmValueItem.prototype=new CParmValueItem();
CBoundRangeParmValueItem.prototype.constructor=CBoundRangeParmValueItem;
CBoundRangeParmValueItem.baseclass=CParmValueItem.prototype;
CBoundRangeParmValueItem.prototype.setStart=function(_80){
this.m_start=_80;
};
CBoundRangeParmValueItem.prototype.getStart=function(){
return this.m_start;
};
CBoundRangeParmValueItem.prototype.setEnd=function(end){
this.m_end=end;
};
CBoundRangeParmValueItem.prototype.getEnd=function(){
return this.m_end;
};
CBoundRangeParmValueItem.prototype.toString=function(_82){
return CViewerCommon.getMessage(_82.m_sBetween,[this.m_start.getDisplayValue(),this.m_end.getDisplayValue()]);
};
CBoundRangeParmValueItem.prototype.load=function(_83){
CBoundRangeParmValueItem.baseclass.load.call(this,_83);
this.m_start=new CSimpleParmValueItem("","","");
this.m_start.load(XMLHelper_FindChildByTagName(_83,"start",false));
this.m_end=new CSimpleParmValueItem("","","");
this.m_end.load(XMLHelper_FindChildByTagName(_83,"end",false));
return true;
};
CBoundRangeParmValueItem.prototype.generateXML=function(_84,_85){
var _86=_85.ownerDocument;
var _87=_86.createElement("item");
_84.XMLBuilderSetAttributeNodeNS(_87,"xsi:type","bus:boundRangeParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
_85.appendChild(_87);
CBoundRangeParmValueItem.baseclass.generateXML.call(this,_84,_87);
var _88=_84.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:start",_86);
_87.appendChild(_88);
this.m_start.generateXML(_84,_88);
var _89=_84.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:end",_86);
_87.appendChild(_89);
this.m_end.generateXML(_84,_89);
};
function CUnboundedStartRangeParmValueItem(){
CUnboundedStartRangeParmValueItem.baseclass.initialize.call(this,"true");
this.m_end=null;
};
CUnboundedStartRangeParmValueItem.prototype=new CParmValueItem();
CUnboundedStartRangeParmValueItem.prototype.constructor=CUnboundedStartRangeParmValueItem;
CUnboundedStartRangeParmValueItem.baseclass=CParmValueItem.prototype;
CUnboundedStartRangeParmValueItem.prototype.setEnd=function(end){
this.m_end=end;
};
CUnboundedStartRangeParmValueItem.prototype.getEnd=function(){
return this.m_end;
};
CUnboundedStartRangeParmValueItem.prototype.load=function(_8b){
CUnboundedStartRangeParmValueItem.baseclass.load.call(this,_8b);
this.m_end=new CSimpleParmValueItem("","","");
this.m_end.load(XMLHelper_FindChildByTagName(_8b,"end",false));
return true;
};
CUnboundedStartRangeParmValueItem.prototype.generateXML=function(_8c,_8d){
var _8e=_8d.ownerDocument;
var _8f=_8e.createElement("item");
_8c.XMLBuilderSetAttributeNodeNS(_8f,"xsi:type","bus:unboundedStartRangeParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
_8d.appendChild(_8f);
CUnboundedStartRangeParmValueItem.baseclass.generateXML.call(this,_8c,_8f);
var _90=_8c.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:end",_8e);
_8f.appendChild(_90);
this.m_end.generateXML(_8c,_90);
};
CUnboundedStartRangeParmValueItem.prototype.toString=function(_91){
return _91.m_sLessThan+" "+this.m_end.getDisplayValue();
};
function CUnboundedEndRangeParmValueItem(){
CUnboundedEndRangeParmValueItem.baseclass.initialize.call(this,"true");
this.m_start=null;
};
CUnboundedEndRangeParmValueItem.prototype=new CParmValueItem();
CUnboundedEndRangeParmValueItem.prototype.constructor=CUnboundedEndRangeParmValueItem;
CUnboundedEndRangeParmValueItem.baseclass=CParmValueItem.prototype;
CUnboundedEndRangeParmValueItem.prototype.setStart=function(_92){
this.m_start=_92;
};
CUnboundedEndRangeParmValueItem.prototype.getStart=function(){
return this.m_start;
};
CUnboundedEndRangeParmValueItem.prototype.load=function(_93){
CUnboundedEndRangeParmValueItem.baseclass.load.call(this,_93);
this.m_start=new CSimpleParmValueItem("","","");
this.m_start.load(XMLHelper_FindChildByTagName(_93,"start",false));
return true;
};
CUnboundedEndRangeParmValueItem.prototype.generateXML=function(_94,_95){
var _96=_95.ownerDocument;
var _97=_96.createElement("item");
_94.XMLBuilderSetAttributeNodeNS(_97,"xsi:type","bus:unboundedEndRangeParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
_95.appendChild(_97);
CUnboundedEndRangeParmValueItem.baseclass.generateXML.call(this,_94,_97);
var _98=_94.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:start",_96);
_97.appendChild(_98);
this.m_start.generateXML(_94,_98);
};
CUnboundedEndRangeParmValueItem.prototype.toString=function(_99){
return _99.m_sGreaterThan+" "+this.m_start.getDisplayValue();
};
function CHierarchicalParmValueItem(){
CHierarchicalParmValueItem.baseclass.initialize.call(this,"true");
this.m_value=null;
this.m_subNodes=[];
};
CHierarchicalParmValueItem.prototype=new CParmValueItem();
CHierarchicalParmValueItem.prototype.constructor=CHierarchicalParmValueItem;
CHierarchicalParmValueItem.baseclass=CParmValueItem.prototype;
CHierarchicalParmValueItem.prototype.getValue=function(){
return this.m_value;
};
CHierarchicalParmValueItem.prototype.getSubNodes=function(){
return this.m_subNodes;
};
CHierarchicalParmValueItem.prototype.setValue=function(_9a){
this.m_value=_9a;
};
CHierarchicalParmValueItem.prototype.setSubNodes=function(_9b){
this.m_subNodes=_9b;
};
CHierarchicalParmValueItem.prototype.load=function(_9c){
CHierarchicalParmValueItem.baseclass.load.call(this,_9c);
this.m_value=new CSimpleParmValueItem("","","");
this.m_value.load(XMLHelper_FindChildByTagName(_9c,"value",false));
var _9d=XMLHelper_FindChildByTagName(_9c,"subNodes",false);
if(_9d==null){
return false;
}
var _9e=_9d.getAttributeNode("xsi:type");
if(_9e==null||_9e.nodeValue!="SOAP-ENC:Array"){
return false;
}
var _9f=_9d.getAttributeNode("SOAP-ENC:arrayType");
if(_9f==null||_9f.nodeValue!="bus:hierarchicalParmValueItem[]"){
return false;
}
var _a0=_9d.childNodes;
for(var _a1=0;_a1<_a0.length;++_a1){
var _a2=new CHierarchicalParmValueItem();
_a2.load(_a0[_a1]);
this.m_subNodes.push(_a2);
}
return true;
};
CHierarchicalParmValueItem.prototype.generateXML=function(_a3,_a4){
var _a5=_a4.ownerDocument;
var _a6=_a5.createElement("item");
_a3.XMLBuilderSetAttributeNodeNS(_a6,"xsi:type","bus:hierarchicalParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
_a4.appendChild(_a6);
CHierarchicalParmValueItem.baseclass.generateXML.call(this,_a3,_a6);
var _a7=_a3.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:value",_a5);
_a6.appendChild(_a7);
this.m_value.generateXML(_a3,_a7);
var _a8=_a3.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:subNodes",_a5);
_a3.XMLBuilderSetAttributeNodeNS(_a8,"SOAP-ENC:arrayType","bus:hierarchicalParmValueItem[]","http://schemas.xmlsoap.org/soap/encoding/");
_a3.XMLBuilderSetAttributeNodeNS(_a8,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_a6.appendChild(_a8);
for(var _a9=0;_a9<this.m_subNodes.length;++_a9){
this.m_subNodes[_a9].generateXML(_a3,_a8);
}
};
CHierarchicalParmValueItem.prototype.toString=function(){
return "";
};
function XMLParser(s,_ab){
if(s==null){
return null;
}
if(/^\s*</.test(s)){
s=s.replace(/^\s*/,"");
if(s.charAt(1)=="/"){
var _ac=new RegExp("^</"+_ab.getName()+"\\s*>","gi");
if(!_ac.test(s)){
alert("invalid XML "+_ab.getName()+"\n"+s);
return null;
}
return XMLParser(s.replace(RegExp.lastMatch,""),_ab.parentNode);
}else{
var _ad=/^\s*<([\w:\-_\.]+)/;
if(_ad.test(s)){
var _ae=RegExp.$1;
var e=new XMLElement(_ae,_ab);
var _b0=new RegExp("^<"+_ae+"[^>]*>");
s=s.replace(_b0,"");
var _b1=RegExp.lastMatch;
var _b2=/([\w:\-_\.]+)="([^"]*)"/gi;
var _b3=_b1.match(_b2);
if(_b3!=null){
for(var i=0;i<_b3.length;i++){
var _b5=_b3[i];
(/([\w:\-_\.]+)\s*=\s*"(.*)"/).test(_b5);
e.setAttribute(RegExp.$1,RegExp.$2);
}
}
if(!(/\/>$/).test(_b1)){
XMLParser(s,e);
return e;
}else{
XMLParser(s,_ab);
return e;
}
}
}
}else{
if(s&&_ab){
var _b6=new RegExp("([^<]*)</"+_ab.getName()+"\\s*[^>]*>","gi");
_b6.test(s);
var _b7=RegExp.$1;
_ab.setValue(_b7);
return (XMLParser(s.replace(_b7,""),_ab));
}
}
return null;
};
function XMLElement(s,_b9){
this.nodeName=s;
this.nodeValue="";
this.attributes=[];
this.childNodes=[];
this.parentNode=_b9;
if(this.parentNode){
this.parentNode.appendChild(this);
}
};
XMLElement.prototype.appendChild=function(e){
this.childNodes[this.childNodes.length]=e;
};
XMLElement.prototype.hasChildNodes=function(){
if(this.childNodes.length>0){
return true;
}else{
return false;
}
};
XMLElement.prototype.findChildByName=function(n,_bc){
if(this.getName()==n){
return (this);
}
for(var i=0;i<this.childNodes.length;i++){
if(this.childNodes[i].getName()==n){
return this.childNodes[i];
}
}
if(_bc!=false){
for(i=0;i<this.childNodes.length;i++){
var _be=this.childNodes[i].findChildByName(n,_bc);
if(_be){
return _be;
}
}
}
return null;
};
XMLElement.prototype.findChildWithAttribute=function(_bf,val){
for(var i=0;i<this.childNodes.length;i++){
if(this.childNodes[i].getAttribute(_bf)==val){
return this.childNodes[i];
}
}
return null;
};
XMLElement.prototype.getElementsByTagName=function(s,_c3){
var a=[];
for(var i=0;i<this.childNodes.length;i++){
if(this.childNodes[i].getName()==s){
a[a.length]=this.childNodes[i];
}
}
if(_c3!=false){
for(i=0;i<this.childNodes.length;i++){
var _c6=this.childNodes[i].getElementsByTagName(s);
for(var j=0;j<_c6.length;j++){
a[a.length]=_c6[j];
}
}
}
return a;
};
XMLElement.prototype.getName=function(){
return this.nodeName;
};
XMLElement.prototype.getValue=function(){
return this.nodeValue;
};
XMLElement.prototype.setAttribute=function(a,v){
this.attributes["_"+a]=v;
};
XMLElement.prototype.setValue=function(v){
this.nodeValue=v;
};
XMLElement.prototype.getAttribute=function(a){
var _cc="";
if(typeof sXmlDecode=="function"){
_cc=sXmlDecode(this.attributes["_"+a]);
}else{
_cc=this.attributes["_"+a];
}
return (_cc==null?"":_cc);
};
XMLElement.prototype.toString=function(){
var s="<"+this.getName();
for(var i in this.attributes){
s+=" "+i.substring(1)+"=\""+this.attributes[i]+"\"";
}
s+=">"+this.getValue();
for(var j=0;j<this.childNodes.length;j++){
s+=this.childNodes[j].toString();
}
s+="</"+this.getName()+">";
return s;
};
function XMLBuilderLoadXMLFromString(_d0,_d1){
var _d2=null;
if(typeof DOMParser!="undefined"){
_d2=new DOMParser().parseFromString(_d0,"application/xml");
}else{
if(typeof ActiveXObject!="undefined"){
try{
_d2=new ActiveXObject("Microsoft.XMLDOM");
_d2.loadXML(_d0);
}
catch(e){
}
}
}
return _d2;
};
function XMLBuilderCreateXMLDocument(_d3,_d4,_d5){
var _d6=null;
_d4=_d4||"";
_d5=_d5||null;
if(document.implementation&&document.implementation.createDocument){
if(typeof _d4=="undefined"){
_d4="http://www.w3.org/2000/xmlns/";
}
_d6=document.implementation.createDocument(_d4,_d3,_d5);
}else{
if(typeof ActiveXObject!="undefined"){
try{
_d6=new ActiveXObject("Microsoft.XMLDOM");
var _d7=_d6.createNode(1,_d3,_d4);
_d6.appendChild(_d7);
}
catch(e){
}
}
}
return _d6;
};
function XMLBuilderCreateElementNS(_d8,_d9,_da){
var _db=null;
if(typeof _da.createElementNS!="undefined"){
if(typeof _d8=="undefined"){
_d8="http://www.w3.org/2000/xmlns/";
}
_db=_da.createElementNS(_d8,_d9);
}else{
if(typeof _da.createNode!="undefined"){
_db=_da.createNode(1,_d9,_d8);
}
}
return _db;
};
function XMLBuilderSetAttributeNodeNS(_dc,_dd,_de,_df){
if(typeof _dc.setAttributeNS!="undefined"){
if(typeof _df=="undefined"){
_df="http://www.w3.org/2000/xmlns/";
}
_dc.setAttributeNS(_df,_dd,_de);
}else{
if(typeof _dc.ownerDocument!="undefined"&&typeof _dc.ownerDocument.createNode!="undefined"){
var _e0=_dc.ownerDocument.createNode(2,_dd,_df);
_e0.nodeValue=_de;
_dc.setAttributeNode(_e0);
}
}
};
function XMLBuilderSerializeNode(_e1){
var _e2="";
if(typeof XMLSerializer!="undefined"){
try{
_e2=new XMLSerializer().serializeToString(_e1);
}
catch(e){
}
}else{
if(typeof _e1=="object"&&typeof _e1.xml!="undefined"){
_e2=_e1.xml;
}
}
return _e2.replace(/^\s+/g,"").replace(/\s+$/g,"");
};
function XMLHelper_GetText(_e3,_e4){
var _e5="";
var _e6=_e3.childNodes;
for(var i=0;i<_e6.length;++i){
if(_e6[i].nodeType==3){
_e5+=_e6[i].nodeValue;
}else{
if(_e6[i].nodeName=="Value"){
_e5+=_e6[i].getAttribute("display");
}else{
if(_e4){
_e5+=XMLHelper_GetText(_e6[i],true);
}
}
}
}
return _e5;
};
function XMLHelper_GetLocalName(_e8){
if(typeof _e8.baseName!="undefined"){
return _e8.baseName;
}
return _e8.localName;
};
function XMLHelper_FindChildByTagName(_e9,_ea,_eb){
if(typeof _eb=="undefined"||(_eb!=true&&_eb!=false)){
_eb=true;
}
if(XMLHelper_GetLocalName(_e9)==_ea){
return (_e9);
}
var i;
for(i=0;i<_e9.childNodes.length;i++){
if(XMLHelper_GetLocalName(_e9.childNodes[i])==_ea){
return _e9.childNodes[i];
}
}
if(_eb!=false){
for(i=0;i<_e9.childNodes.length;i++){
var _ed=XMLHelper_FindChildByTagName(_e9.childNodes[i],_ea,_eb);
if(_ed){
return _ed;
}
}
}
return null;
};
function XMLHelper_FindChildrenByTagName(_ee,_ef,_f0){
if(typeof _f0=="undefined"||(_f0!=true&&_f0!=false)){
_f0=true;
}
var _f1=[];
var _f2=_ee.childNodes;
for(var _f3=0;_f3<_f2.length;_f3++){
if(XMLHelper_GetLocalName(_f2[_f3])==_ef){
_f1[_f1.length]=_f2[_f3];
}
if(_f0===true){
var _f4=XMLHelper_FindChildrenByTagName(_f2[_f3],_ef,_f0);
if(_f4.length>0){
_f1=_f1.concat(_f4);
}
}
}
return _f1;
};
function XMLHelper_GetFirstChildElement(oEl){
var _f6=null;
if(oEl&&oEl.childNodes&&oEl.childNodes.length){
for(var i=0;i<oEl.childNodes.length;i++){
if(oEl.childNodes[i].nodeType==1){
_f6=oEl.childNodes[i];
break;
}
}
}
return _f6;
};
function XMLHelper_FindChildrenByAttribute(_f8,_f9,_fa,_fb,_fc){
if(typeof _fb=="undefined"||(_fb!=true&&_fb!=false)){
_fb=true;
}
if(typeof _fa!="string"&&typeof _fa!="number"){
_fa=null;
}else{
_fa=_fa.toString();
}
var _fd=[];
var _fe=_f8.childNodes;
for(var _ff=0;_ff<_fe.length;_ff++){
var _100=_fe[_ff];
if(_100.nodeType==1){
var _101=_100.getAttribute(_f9);
if(_101!==null){
if(_fa===null||_101==_fa){
if(_fc){
return [_100];
}else{
_fd[_fd.length]=_100;
}
}
}
if(_fb===true){
var _102=XMLHelper_FindChildrenByAttribute(_100,_f9,_fa,_fb,_fc);
if(_102.length>0){
if(_fc){
if(_102.length==1){
return _102;
}else{
return [_102[0]];
}
}else{
_fd=_fd.concat(_102);
}
}
}
}
}
return _fd;
};
var DICTIONARY_INVALID_KEY=-1;
var DICTIONARY_SUCCESS=1;
function CDictionary(){
this.m_aValues={};
};
function CDictionary_add(sKey,_104){
if(typeof sKey!="string"&&typeof sKey!="number"){
return DICTIONARY_INVALID_KEY;
}
this.m_aValues[sKey]=_104;
return DICTIONARY_SUCCESS;
};
function CDictionary_exists(sKey){
if(typeof sKey!="string"&&typeof sKey!="number"){
return false;
}
return (typeof this.m_aValues[sKey]!="undefined");
};
function CDictionary_get(sKey){
if(typeof sKey!="string"&&typeof sKey!="number"){
return null;
}
if(this.exists(sKey)===true){
return this.m_aValues[sKey];
}else{
return null;
}
};
function CDictionary_keys(){
var _107=[];
for(var _108 in this.m_aValues){
_107.push(_108);
}
return _107.sort();
};
function CDictionary_remove(sKey){
if(typeof sKey!="string"&&typeof sKey!="number"){
return DICTIONARY_INVALID_KEY;
}
var _10a=this.get(sKey);
delete this.m_aValues[sKey];
return _10a;
};
function CDictionary_removeAll(){
this.m_aValues=[];
return DICTIONARY_SUCCESS;
};
function CDictionary_append(_10b){
if(_10b instanceof CDictionary&&_10b.keys().length>0){
var _10c=_10b.keys();
for(var _10d=0;_10d<_10c.length;_10d++){
this.add(_10c[_10d],_10b.get(_10c[_10d]));
}
}
};
CDictionary.prototype.add=CDictionary_add;
CDictionary.prototype.exists=CDictionary_exists;
CDictionary.prototype.get=CDictionary_get;
CDictionary.prototype.keys=CDictionary_keys;
CDictionary.prototype.remove=CDictionary_remove;
CDictionary.prototype.removeAll=CDictionary_removeAll;
CDictionary.prototype.append=CDictionary_append;
function CognosTabControl(_10e,_10f){
this._init();
this._outsideContainer=_10e;
this._callback=_10f;
};
CognosTabControl.prototype._init=function(){
this._tabs=null;
this._tabControlNode=null;
this._scrollButtonsVisible=false;
this._scrollLeftButton=null;
this._scrollRightButton=null;
this._selectedTab=null;
this._wrapperDiv=null;
this._topContainer=null;
this._seperator=null;
this._isSavedOutput=false;
this._isHighContrast=false;
};
CognosTabControl.prototype.destroy=function(){
if(this._wrapperDiv){
this._wrapperDiv.parentNode.removeChild(this._wrapperDiv);
delete this._wrapperDiv;
this._wrapperDiv=null;
}
};
CognosTabControl.prototype.setHighContrast=function(_110){
this._isHighContrast=_110;
};
CognosTabControl.prototype.isHighContrast=function(){
return this._isHighContrast;
};
CognosTabControl.prototype.setSpaceSaverContainer=function(node){
this._spaceSaverContainer=node;
};
CognosTabControl.prototype.useAbsolutePosition=function(_112){
this._useAbsolutePosition=_112;
};
CognosTabControl.prototype.setScrollAttachNode=function(node){
this._scrollAttachNode=node;
};
CognosTabControl.prototype.setIsSavedOutput=function(_114){
this._isSavedOutput=_114;
};
CognosTabControl.prototype.isSavedOutput=function(){
return this._isSavedOutput;
};
CognosTabControl.prototype.getSelectedTabId=function(){
if(this._selectedTab){
return this._selectedTab.getId();
}
return null;
};
CognosTabControl.prototype.getSelectedTab=function(){
return this._selectedTab?this._selectedTab:null;
};
CognosTabControl.prototype.isTopAligned=function(){
return this._isTopAligned;
};
CognosTabControl.prototype.getWrapperDiv=function(){
return this._wrapperDiv;
};
CognosTabControl.prototype.getVisibleWidth=function(){
var _115=this._scrollRightButton?this._scrollRightButton.getWidth()+11:0;
return this._wrapperDiv.clientWidth-_115;
};
CognosTabControl.prototype.getMaxRightScroll=function(){
var _116=this._scrollRightButton?this._scrollRightButton.getWidth()+11:0;
return this._totalWrapperWidth+_116+8-this._wrapperDiv.clientWidth;
};
CognosTabControl.prototype.hide=function(){
this._topContainer.style.display="none";
};
CognosTabControl.prototype.resetPosition=function(){
if(this._useAbsolutePosition===true){
this._outsideContainer.srollLeft="0px";
this._outsideContainer.scrollTop="0px";
this._topContainer.style.top="";
this._topContainer.style.bottom="";
this._topContainer.style.left="0px";
if(this._isTopAligned){
this._topContainer.style.top="0px";
}else{
this._topContainer.style.bottom="0px";
}
}
};
CognosTabControl.prototype.render=function(_117){
this._updateTabInfo(_117);
if(!this._tabControlNode){
var _118=this;
var _119=this._scrollAttachNode?this._scrollAttachNode:this._outsideContainer;
if(window.attachEvent){
window.attachEvent("onresize",function(){
_118.onResize();
});
if(this._useAbsolutePosition===true){
_119.attachEvent("onscroll",function(){
_118.onContainerScroll();
});
}
}else{
window.addEventListener("resize",function(){
_118.onResize();
},false);
if(this._useAbsolutePosition===true){
_119.addEventListener("scroll",function(){
_118.onContainerScroll();
},false);
}
}
this._outsideContainer.originalClassName=this._outsideContainer.className;
this._outsideContainer.className=this._outsideContainer.className+(this._isTopAligned?" ct_controlTop":" ct_controlBottom");
this._topContainer=document.createElement("div");
this._topContainer.className="ct_wrapperDiv";
if(this._useAbsolutePosition===true){
this._topContainer.style.width="100%";
this._topContainer.style.position="absolute";
this._topContainer.style.left="0px";
if(this._isTopAligned){
this._topContainer.style.top="0px";
}else{
this._topContainer.style.bottom="0px";
}
}
if(this._isTopAligned&&this._outsideContainer.firstChild){
this._outsideContainer.insertBefore(this._topContainer,this._outsideContainer.firstChild);
}else{
this._outsideContainer.appendChild(this._topContainer);
}
this._wrapperDiv=document.createElement("div");
this._wrapperDiv.setAttribute("role","presentation");
this._wrapperDiv.className="ct_wrapperDiv";
this._topContainer.appendChild(this._wrapperDiv);
this._tabControlNode=document.createElement("div");
this._tabControlNode.setAttribute("role","tablist");
this._tabControlNode.className="ct_control";
this._wrapperDiv.appendChild(this._tabControlNode);
this._totalWrapperWidth=0;
for(var i=0;i<this._tabs.length;i++){
var tab=this._tabs[i];
tab.render(this._tabControlNode);
this._totalWrapperWidth+=this._tabs[i].getWidth();
}
var _11c=0;
if(this._tabs[0]){
_11c=this._tabs[0].getHeight();
}
this._wrapperDiv.style.height=_11c+5+"px";
if(this._spaceSaverContainer){
this.spaceSaverDiv=document.createElement("div");
this.spaceSaverDiv.style.height=_11c+5+"px";
this.spaceSaverDiv.style.position="relative";
this.spaceSaverDiv.style.display="block";
this._spaceSaverContainer.appendChild(this.spaceSaverDiv);
}
this._createSeperator();
}else{
this.resetPosition();
}
this._topContainer.style.display="";
this.onResize();
this.selectTab(_117.currentTabId,false);
if(this._selectedTab){
this._selectedTab.scrollIntoView();
this.updateScrollButtons();
}
};
CognosTabControl.prototype.onContainerScroll=function(){
var _11d=this._scrollAttachNode?this._scrollAttachNode:this._topContainer;
this._topContainer.style.left=_11d.scrollLeft+"px";
if(this._isTopAligned){
this._topContainer.style.top=_11d.scrollTop+"px";
}else{
this._topContainer.style.bottom=(-_11d.scrollTop)+"px";
}
};
CognosTabControl.prototype._resetTabControl=function(){
if(this._outsideContainer.originalClassName){
this._outsideContainer.className=this._outsideContainer.originalClassName;
}else{
this._outsideContainer.className="";
}
if(this._topContainer){
var node=this._outsideContainer.removeChild(this._topContainer);
node=null;
}
this._init();
};
CognosTabControl.prototype._updateTabInfo=function(_11f){
this._isTopAligned=_11f.position=="topLeft"?true:false;
var tabs=_11f.tabs;
if(this._tabs){
if(this._tabs.length!=tabs.length){
this._resetTabControl();
}else{
for(var i=0;i<this._tabs.length;i++){
if(tabs[i].id!=this._tabs[i].getId()){
this._resetTabControl();
break;
}
}
}
}
if(!this._tabs){
this._tabs=[];
if(!tabs){
return;
}
for(var ii=0;ii<tabs.length;ii++){
var tab=new CognosTab(tabs[ii],this,ii);
this._tabs.push(tab);
}
}
};
CognosTabControl.prototype.getScrollPos=function(){
return this._wrapperDiv.scrollLeft;
};
CognosTabControl.prototype.scrollTo=function(_124){
this._wrapperDiv.scrollLeft=_124;
this.updateScrollButtons();
};
CognosTabControl.prototype.onResize=function(evt){
if(this._wrapperDiv.offsetWidth<this._totalWrapperWidth){
this._showScrollButtons();
this.updateScrollButtons();
if(this._selectedTab){
this._selectedTab.scrollIntoView();
}
if(this._scrollRightButton.isDisabled()){
this.scrollTo(this.getMaxRightScroll());
}
}else{
this._hideScrollButtons();
this.scrollTo(0);
}
};
CognosTabControl.prototype._showScrollButtons=function(){
if(this._scrollButtonsVisible){
return;
}
if(!this._scrollLeftButton){
var _126=0;
if(this._tabs[0]){
_126=this._tabs[0].getHeight();
}
this._scrollLeftButton=new CognosScrollButton("left",_126,this);
this._scrollLeftButton.render(this._topContainer);
this._scrollRightButton=new CognosScrollButton("right",_126,this);
this._scrollRightButton.render(this._topContainer);
}
this._scrollButtonsVisible=true;
this._scrollLeftButton.show();
this._scrollRightButton.show();
this._tabControlNode.style.left=this._scrollLeftButton.getWidth()-2+"px";
};
CognosTabControl.prototype.updateScrollButtons=function(){
if(this._scrollLeftButton){
this._scrollLeftButton.update();
}
if(this._scrollRightButton){
this._scrollRightButton.update();
}
};
CognosTabControl.prototype._hideScrollButtons=function(){
if(!this._scrollButtonsVisible){
return;
}
this._scrollButtonsVisible=false;
this._tabControlNode.style.left="0px";
this._scrollLeftButton.hide();
this._scrollRightButton.hide();
};
CognosTabControl.prototype._createSeperator=function(){
this._seperator=document.createElement("div");
this._seperator.setAttribute("role","presendation");
this._seperator.setAttribute("style","");
this._seperator.className="ct_verticalLine";
this._seperator.setAttribute("role","presentation");
this._tabControlNode.appendChild(this._seperator);
};
CognosTabControl.prototype.selectTab=function(_127,_128,evt){
if(!evt){
evt=window.event;
}
for(var i=0;i<this._tabs.length;i++){
var tab=this._tabs[i];
var _12c=tab.getId()==_127;
tab.select(_12c);
if(_12c){
this._selectedTab=tab;
if(_128&&this._callback){
this._callback(_127);
}
}
if(_128){
tab.focus(_12c);
}
}
if(evt&&window.stopEventBubble){
window.stopEventBubble(evt);
}
return false;
};
CognosTabControl.prototype.handleKeyDown=function(evt,_12e){
if(!evt){
evt=window.event;
}
if(!evt){
return;
}
if(evt.keyCode=="39"||evt.keyCode=="37"){
if(evt.keyCode=="39"){
_12e++;
if(_12e>=this._tabs.length){
_12e=0;
}
}else{
_12e--;
if(_12e<0){
_12e=this._tabs.length-1;
}
}
this._tabs[_12e].focus();
this._tabs[_12e].scrollIntoView();
}else{
if(evt.keyCode=="32"||evt.keyCode=="13"){
var _12f=this._tabs[_12e].getId();
this.selectTab(_12f,true);
}
}
};
function CognosTab(_130,_131,_132){
if(!_130){
return;
}
this._id=_130.id;
this._label=_130.label;
this._position=_132;
this._contentClassName=_130.className;
this._imgURL=_130.img;
this._selected=false;
this._tabControl=_131;
this._outerTabDiv=null;
this._focusDiv=null;
};
CognosTab.prototype.getWidth=function(){
return this._outerTabDiv.offsetWidth+1;
};
CognosTab.prototype.getHeight=function(){
return this._outerTabDiv.clientHeight;
};
CognosTab.prototype.getId=function(){
return this._id;
};
CognosTab.prototype.select=function(_133){
if(_133!=this._selected){
this._selected=_133;
if(_133){
this.scrollIntoView();
}
if(this._outerTabDiv){
this._updateSelectedClass();
this._updateAriaSelected();
}
}
};
CognosTab.prototype.scrollIntoView=function(){
var _134=this._outerTabDiv.offsetLeft+this._outerTabDiv.clientWidth;
var _135=this._tabControl.getVisibleWidth();
var _136=this._tabControl.getScrollPos();
var _137=this._outerTabDiv.offsetLeft;
if(_137===0){
this._tabControl.scrollTo(0);
}else{
if((_137>=_136)&&(_134<=(_136+_135))){
}else{
if(_137<_136){
var _138=_137<3?0:_137-3;
this._tabControl.scrollTo(_138);
}else{
if(_134-_135>0||_134<_136){
this._tabControl.scrollTo(_134-_135+10);
}
}
}
}
};
CognosTab.prototype.render=function(_139){
if(!this._outerTabDiv){
var _13a=this._id;
var _13b=this._tabControl;
var tab=this;
this._outerTabDiv=document.createElement("div");
this._outerTabDiv.onmousedown=function(_13d){
_13b.selectTab(_13a,true,_13d);
};
this._outerTabDiv.onmouseover=function(){
this.className=this.className+" ct_highlight";
};
this._outerTabDiv.onmouseout=function(){
tab._updateSelectedClass();
};
this._outerTabDiv.setAttribute("style","");
this._outerTabDiv.setAttribute("role","presentation");
this._updateSelectedClass();
_139.appendChild(this._outerTabDiv);
var _13e=document.createElement("div");
_13e.className="ct_content";
_13e.setAttribute("role","presentation");
this._outerTabDiv.appendChild(_13e);
this._focusDiv=document.createElement("span");
this._focusDiv.innerHTML=this._label?this._label:"&nbsp;";
this._focusDiv.className="ct_text";
this._focusDiv.setAttribute("tabIndex",this._position===0?"0":"-1");
this._focusDiv.setAttribute("role","tab");
this._focusDiv.onkeydown=function(_13f){
_13b.handleKeyDown(_13f,tab._position);
};
this._updateAriaSelected();
_13e.appendChild(this._focusDiv);
if(this.isIE()&&this.getWidth()<75){
this._outerTabDiv.style.width="75px";
}
}else{
this._updateSelectedClass();
this._updateAriaSelected();
}
};
CognosTab.prototype.isIE=function(){
return (navigator.userAgent.indexOf("MSIE")!=-1||navigator.userAgent.indexOf("Trident")!=-1);
};
CognosTab.prototype.getFocusableDiv=function(){
return this._focusDiv;
};
CognosTab.prototype.focus=function(_140){
if(typeof _140==="undefined"){
_140=true;
}
this._focusDiv.setAttribute("tabIndex",_140?"0":"-1");
if(_140&&this._focusDiv.focus){
this._focusDiv.focus();
}
};
CognosTab.prototype._updateSelectedClass=function(){
this._outerTabDiv.className=this._selected?"ct_outerDiv ct_highlight ct_selected":"ct_outerDiv";
};
CognosTab.prototype._updateAriaSelected=function(){
this._focusDiv.setAttribute("aria-selected",this._selected?"true":"false");
};
function CognosScrollButton(_141,_142,_143){
this._direction=_141;
this._height=_142;
this._tabControl=_143;
this._disabled=true;
this._scrolling=false;
};
CognosScrollButton.prototype.getWidth=function(){
return this._scrollButtonDiv.offsetWidth+1;
};
CognosScrollButton.prototype.show=function(){
this._wrapperDiv.style.display="block";
};
CognosScrollButton.prototype.hide=function(){
this._wrapperDiv.style.display="none";
};
CognosScrollButton.prototype.update=function(){
var _144=this._tabControl.getWrapperDiv();
var _145=false;
if(this._direction=="left"){
if(_144.scrollLeft===0){
_145=true;
}
}else{
if(_144.scrollLeft>=(this._tabControl.getMaxRightScroll()-2)){
_145=true;
}
}
if(_145){
this._disable();
}else{
this._enable();
}
};
CognosScrollButton.prototype.isDisabled=function(){
return this._disabled;
};
CognosScrollButton.prototype._disable=function(){
this._disabled=true;
this._outerDiv.className="ct_outerDiv ct_scrollDisabled";
};
CognosScrollButton.prototype._enable=function(){
this._disabled=false;
this._outerDiv.className="ct_outerDiv ct_scrollEnabled";
};
CognosScrollButton.prototype.scroll=function(){
if(!this._scrolling){
this._scrolling=true;
var _146=this._tabControl.getWrapperDiv().clientWidth;
this._doAnimateScroll(_146,this._tabControl.getMaxRightScroll());
}
};
CognosScrollButton.prototype._doAnimateScroll=function(_147,_148){
if(_147>0){
var _149=10;
var _14a=this._tabControl.getWrapperDiv();
if(this._direction=="left"){
if(_14a.scrollLeft>_149){
this._tabControl.scrollTo(_14a.scrollLeft-_149);
}else{
this._tabControl.scrollTo(0);
this._scrolling=false;
return;
}
}else{
if(_14a.scrollLeft+_149<_148){
this._tabControl.scrollTo(_14a.scrollLeft+_149);
}else{
this._scrolling=false;
this._tabControl.scrollTo(_148);
this._tabControl.updateScrollButtons();
return;
}
}
_147-=_149;
var _14b=this;
setTimeout(function(){
_14b._doAnimateScroll(_147,_148);
},3);
}else{
this._scrolling=false;
this._tabControl.updateScrollButtons();
}
};
CognosScrollButton.prototype.isIE=function(){
return (navigator.userAgent.indexOf("MSIE")!=-1||navigator.userAgent.indexOf("Trident")!=-1);
};
CognosScrollButton.prototype.render=function(_14c){
this._scrollButtonDiv=document.createElement("div");
this._scrollButtonDiv.className="ct_scrollButton";
var _14d=-1;
if(this.isIE()&&document.compatMode!="CSS1Compat"){
_14d=1;
}
this._scrollButtonDiv.style.height=this._height+_14d+"px";
if(this._tabControl.isHighContrast()){
this._scrollButtonDiv.innerHTML=this._direction=="left"?"&laquo;":"&raquo;";
}
this._outerDiv=document.createElement("div");
this._outerDiv.className="ct_scrollDisabled";
this._outerDiv.appendChild(this._scrollButtonDiv);
this._outerDiv.style.height=this._height+"px";
var _14e=this;
this._outerDiv.onclick=function(){
_14e.scroll();
};
this._wrapperDiv=document.createElement("div");
this._wrapperDiv.style.height=this._height+"px";
this._wrapperDiv.className="ct_scroll "+(this._direction=="left"?"ct_left":"ct_right")+(this._tabControl.isHighContrast()?" a11y":"");
this._wrapperDiv.appendChild(this._outerDiv);
if(this._direction=="left"){
_14c.insertBefore(this._wrapperDiv,_14c.firstChild);
this._wrapperDiv.style.left="0px";
}else{
_14c.appendChild(this._wrapperDiv);
this._wrapperDiv.style.right="0px";
}
};
function ActionFactory(_14f){
this.m_cognosViewer=_14f;
};
ActionFactory.prototype.load=function(_150){
this.m_cognosViewer.loadExtra();
var _151=null;
try{
var _152=_150+"Action";
_151=eval("(typeof "+_152+"=='function'? new "+_152+"():null);");
if(_151){
_151.setCognosViewer(this.m_cognosViewer);
}
}
catch(exception){
_151=null;
}
return _151;
};
function ActionFactory_loadActionHandler(evt,_154){
var _155=getCtxNodeFromEvent(evt);
var _156=_154.getSelectionController();
var _157=null;
if(_155!==null){
var _158=_155.getAttribute("ctx");
_158=_158.split("::")[0].split(":")[0];
var _159=_155.getAttribute("type")!=null?_155:_155.parentNode;
var type=_159.getAttribute("type");
switch(type){
case "columnTitle":
var _15b=(_155.getAttribute("dttargets")!=null);
var _15c=(_159.getAttribute("CTNM")!=null&&_156.getMun(_158)!=""&&_156.getUsageInfo(_158)!="2");
if(_15b||_15c){
_157=_154.getAction("DrillUpDownOrThrough");
_157.init(_15b,_15c);
_157.updateDrillabilityInfo(_154,_155);
}else{
_157=_154.getAction("RenameDataItem");
}
break;
case "datavalue":
case "chartElement":
case "ordinalAxisLabel":
case "legendLabel":
case "legendTitle":
case "ordinalAxisTitle":
var _15b=(_155.getAttribute("dttargets")!=null);
var _15c=(_156.getHun(_158)!="");
if(_15b||_15c){
_157=_154.getAction("DrillUpDownOrThrough");
_157.init(_15b,_15c);
_157.updateDrillabilityInfo(_154,_155);
}
break;
}
}
if(_157===null){
_157=_154.getAction("Selection");
}
_157.setCognosViewer(_154);
return _157;
};
ActionFactory.prototype.destroy=function(){
delete this.m_cognosViewer;
};
function CUIStyle(_15d,_15e,_15f,_160,_161){
this.m_active=_15d;
this.m_normal=_15d;
this.m_rollover=_15e;
this.m_activeRollover=_15e;
this.m_depressed=_15f;
this.m_depressed_rollover=_160;
this.m_disabled=_161;
};
function CUIStyle_getActiveState(){
return this.m_active;
};
function CUIStyle_setActiveState(_162){
switch(_162){
case "normal":
this.m_active=this.m_normal;
break;
case "depressed":
this.m_active=this.m_depressed;
break;
case "disabled":
this.m_active=this.m_disabled;
break;
default:
this.m_active=this.m_normal;
}
};
function CUIStyle_getActiveRolloverState(){
return this.m_activeRollover;
};
function CUIStyle_setActiveRolloverState(_163){
switch(_163){
case "normal":
this.m_activeRollover=this.m_rollover;
break;
case "depressed":
this.m_activeRollover=this.m_depressed_rollover;
break;
case "disabled":
this.m_activeRollover=this.m_disabled;
break;
default:
this.m_activeRollover=this.m_rollover;
}
};
function CUIStyle_getNormalState(){
return this.m_normal;
};
function CUIStyle_getRolloverState(){
return this.m_rollover;
};
function CUIStyle_getDepressedState(){
return this.m_depressed;
};
function CUIStyle_getDepressedRolloverState(){
return this.m_depressed_rollover;
};
function CUIStyle_getDisabledState(){
return this.m_disabled;
};
function CUIStyle_setNormalState(_164){
this.m_normal=_164;
};
function CUIStyle_setRolloverState(_165){
this.m_rollover=_165;
};
function CUIStyle_setDepressedState(_166){
this.m_depressed=_166;
};
function CUIStyle_setDepressedRolloverState(_167){
this.m_depressed_rollover=_167;
};
function CUIStyle_setDisabledState(_168){
this.m_disabled=_168;
};
CUIStyle.prototype.getNormalState=CUIStyle_getNormalState;
CUIStyle.prototype.getRolloverState=CUIStyle_getRolloverState;
CUIStyle.prototype.getDepressedState=CUIStyle_getDepressedState;
CUIStyle.prototype.getDepressedRolloverState=CUIStyle_getDepressedRolloverState;
CUIStyle.prototype.getDisabledState=CUIStyle_getDisabledState;
CUIStyle.prototype.setNormalState=CUIStyle_setNormalState;
CUIStyle.prototype.setRolloverState=CUIStyle_setRolloverState;
CUIStyle.prototype.setDepressedState=CUIStyle_setDepressedState;
CUIStyle.prototype.setDepressedRolloverState=CUIStyle_setDepressedRolloverState;
CUIStyle.prototype.setDisabledState=CUIStyle_setDisabledState;
CUIStyle.prototype.setActiveState=CUIStyle_setActiveState;
CUIStyle.prototype.getActiveState=CUIStyle_getActiveState;
CUIStyle.prototype.getActiveRolloverState=CUIStyle_getActiveRolloverState;
CUIStyle.prototype.setActiveRolloverState=CUIStyle_setActiveRolloverState;
function CToolbarSelect(_169,name,_16b,_16c,_16d){
this.m_parent=_169;
this.m_name=name;
this.m_command=_16b;
this.m_label=_16c;
this.m_toolTip=_16d;
this.m_items=[];
if(typeof this.m_parent=="object"&&typeof this.m_parent.add=="function"){
this.m_parent.add(this);
}
if(_16c){
this.add("",_16c);
}
};
function CToolbarSelect_draw(){
var html="<select id=\""+this.m_name+"\" name=\""+this.m_name+"\" onchange=\""+this.m_command+"\"";
if(this.m_toolTip!=""){
html+=" title=\""+this.m_toolTip+"\"";
}
html+=">";
html+=this.drawItems();
html+="</select>";
return html;
};
function CToolbarSelect_drawItems(){
var html="";
for(var i=0;i<this.m_items.length;i++){
html+="<option value=\""+this.m_items[i].getUse()+"\">"+this.m_items[i].getDisplay()+"</option>";
}
return html;
};
function CToolbarSelect_add(sUse,_172){
var _173=new CSelectItem(sUse,_172);
this.m_items=this.m_items.concat(_173);
};
function CToolbarSelect_isVisible(){
return true;
};
CToolbarSelect.prototype.draw=CToolbarSelect_draw;
CToolbarSelect.prototype.drawItems=CToolbarSelect_drawItems;
CToolbarSelect.prototype.isVisible=CToolbarSelect_isVisible;
CToolbarSelect.prototype.add=CToolbarSelect_add;
function CSelectItem(sUse,_175){
this.m_sUse=sUse;
this.m_sDisplay=_175;
};
function CSelectItem_getUse(){
return this.m_sUse;
};
function CSelectItem_getDisplay(){
return this.m_sDisplay;
};
CSelectItem.prototype.getUse=CSelectItem_getUse;
CSelectItem.prototype.getDisplay=CSelectItem_getDisplay;
function CToolbarPicker(_176,_177,_178,sRef,_17a){
this.m_parent=_176;
this.m_command=_177;
this.m_oPicker=null;
this.m_sPromptId=_178;
this.m_sRef=sRef;
this.m_sType=_17a;
if(typeof this.m_parent=="object"&&typeof this.m_parent.add=="function"){
this.m_parent.add(this);
}
};
function CToolbarPicker_draw(){
var html="<div id=\""+this.m_sType+this.m_sPromptId+"\" onclick=\""+this.m_sRef+".preventBubbling(event);\"></div>";
return html;
};
function CToolbarPicker_init(){
this.m_oPicker=eval(this.m_command);
g_pickerObservers=g_pickerObservers.concat(this.m_sRef);
};
function CToolbarPicker_isVisible(){
return true;
};
function CToolbarPicker_togglePicker(){
this.m_oPicker.togglePicker();
};
function CToolbarPicker_setActiveColor(s){
this.m_oPicker.setActiveColor(s);
};
function CToolbarPicker_setColor(s){
this.m_oPicker.setColor(s);
};
function CToolbarPicker_setAlignment(s){
this.m_oPicker.setAlignment(s);
};
function CToolbarPicker_setActiveAlignment(s){
this.m_oPicker.setActiveAlignment(s);
};
function CToolbarPicker_setPalette(s){
this.m_oPicker.setPalette(s);
};
function CToolbarPicker_applyCustomStyle(){
this.m_oPicker.applyCustomStyle();
};
function CToolbarPicker_updateCustomStyle(){
this.m_oPicker.updateCustomStyle();
};
function CToolbarPicker_hide(){
this.m_oPicker.hide();
};
function CToolbarPicker_preventBubbling(e){
this.m_oPicker.preventBubbling(e);
};
function CToolbarPicker_buttonMouseHandler(_182,_183){
this.m_oPicker.buttonMouseHandler(_182,_183);
};
CToolbarPicker.prototype.draw=CToolbarPicker_draw;
CToolbarPicker.prototype.isVisible=CToolbarPicker_isVisible;
CToolbarPicker.prototype.init=CToolbarPicker_init;
CToolbarPicker.prototype.togglePicker=CToolbarPicker_togglePicker;
CToolbarPicker.prototype.setColor=CToolbarPicker_setColor;
CToolbarPicker.prototype.setAlignment=CToolbarPicker_setAlignment;
CToolbarPicker.prototype.setActiveAlignment=CToolbarPicker_setActiveAlignment;
CToolbarPicker.prototype.setActiveColor=CToolbarPicker_setActiveColor;
CToolbarPicker.prototype.setPalette=CToolbarPicker_setPalette;
CToolbarPicker.prototype.applyCustomStyle=CToolbarPicker_applyCustomStyle;
CToolbarPicker.prototype.updateCustomStyle=CToolbarPicker_updateCustomStyle;
CToolbarPicker.prototype.hide=CToolbarPicker_hide;
CToolbarPicker.prototype.preventBubbling=CToolbarPicker_preventBubbling;
CToolbarPicker.prototype.buttonMouseHandler=CToolbarPicker_buttonMouseHandler;
var tbUniqueId=0;
function makeId(){
return tbUniqueId++;
};
gDropDownButtonStyle=new CUIStyle("dropDownArrow","dropDownArrowOver","","","");
gHeaderDropDownButtonStyle=new CUIStyle("bannerDropDownArrow","bannerDropDownArrowOver","","","");
function CToolbarButton(_184,_185,_186,_187,_188,_189,_18a,_18b,_18c){
this.m_id="tbbutton"+makeId();
this.m_bVisible=true;
this.m_action=_185;
this.m_toolTip=_187;
if(typeof _18c!="undefined"&&_18c!=""){
this.m_webContentRoot=_18c;
}else{
this.m_webContentRoot="..";
}
this.m_icon=(_186)?new CIcon(_186,_187,this.webContentRoot):null;
this.m_parent=_184;
this.m_menu=null;
if(typeof _189=="boolean"){
this.m_bHideDropDown=_189;
}else{
this.m_bHideDropDown=false;
}
this.m_style=new CUIStyle(_188.getNormalState(),_188.getRolloverState(),_188.getDepressedState(),_188.getDepressedRolloverState(),_188.getDisabledState());
this.m_observers=new CObserver(this);
if(typeof this.m_parent=="object"&&typeof this.m_parent.add=="function"){
this.m_parent.add(this);
}
this.m_label=(_18a)?_18a:null;
this.m_dropDownToolTip=(_18b)?_18b:this.m_toolTip;
this.m_dropDownStyle=gDropDownButtonStyle;
};
function CToolbarButton_getId(){
return this.m_id;
};
function CToolbarButton_draw(){
var html="";
html+="<div style=\"margin-right:3px;\"><button type=\"button\" id=\"";
html+=this.m_id;
html+="\"";
if(typeof this.getStyle()=="object"){
html+=" class=\""+this.getStyle().getActiveState()+"\"";
if(this.getStyle().getActiveState()!=this.getStyle().getDisabledState()){
if(this.isEnabled()){
html+=" tabIndex=\"1\"";
}
html+=" hideFocus=\"true\"";
}
}
if(this.m_toolTip!=""){
html+=" title=\""+this.m_toolTip+"\"";
}
html+=">";
if(this.m_icon!=null){
html+=this.m_icon.draw();
}
if(this.m_label!=null){
html+=this.m_label;
}
html+="</button>";
if(this.m_menu!=null&&!this.m_bHideDropDown){
html+="<button type=\"button\" id=\"";
html+=("menu"+this.getId());
html+="\"";
if(typeof this.getStyle()=="object"){
html+=" class=\""+this.getDropDownStyle().getActiveState()+"\"";
if(this.getStyle().getActiveState()!=this.getStyle().getDisabledState()){
if(this.isEnabled()){
html+=" tabIndex=\"1\"";
}
html+=" hideFocus=\"true\"";
}
}
if(this.m_dropDownToolTip!=""){
html+=" title=\""+this.m_dropDownToolTip+"\"";
}
html+="><img style=\"vertical-align:middle;\" border=\"0\" src=\""+this.m_webContentRoot+"/common/images/toolbar_drop_arrow.gif\"";
if(this.m_dropDownToolTip!=""){
html+=" alt=\""+this.m_dropDownToolTip+"\"";
html+=" title=\""+this.m_dropDownToolTip+"\"";
}else{
html+=" alt=\"\"";
}
html+=" width=\"7\" height=\"16\"/></button>";
}
html+="</div>";
return html;
};
function CToolbarButton_attachEvents(){
if(typeof this.getParent().getHTMLContainer!="function"){
return;
}
var _18e=this.getParent().getHTMLContainer();
if(_18e==null){
return;
}
var _18f=eval(_18e.document?_18e.document.getElementById(this.m_id):_18e.ownerDocument.getElementById(this.m_id));
if(_18f==null){
return;
}
_18f.onmouseover=this.onmouseover;
_18f.onmouseout=this.onmouseout;
_18f.onclick=this.onclick;
_18f.onkeypress=this.onkeypress;
_18f.onfocus=this.onfocus;
_18f.onblur=this.onblur;
_18f.tbItem=eval(this);
if(this.m_menu!=null&&!this.m_bHideDropDown){
var _190=eval(_18e.document?_18e.document.getElementById("menu"+this.getId()):_18e.ownerDocument.getElementById("menu"+this.getId()));
_190.onmouseover=this.onmouseover;
_190.onmouseout=this.onmouseout;
_190.onclick=this.onclick;
_190.onkeypress=this.onkeypress;
_190.onfocus=this.onfocus;
_190.onblur=this.onblur;
_190.tbItem=eval(this);
}
};
function CToolbarButton_createDropDownMenu(_191,_192){
this.m_dropDownToolTip=(_192)?_192:this.m_toolTip;
this.m_menu=new CMenu("dropDown"+this.getId(),_191,this.m_webContentRoot);
this.m_menu.setParent(this);
return this.m_menu;
};
function CToolbarButton_addOwnerDrawControl(_193){
this.m_menu=_193;
if(typeof _193.setParent!="undefined"){
this.m_menu.setParent(this);
}
};
function CToolbarButton_getParent(){
return this.m_parent;
};
function CToolbarButton_setParent(_194){
this.m_parent=_194;
};
function CToolbarButton_getAction(){
return this.m_action;
};
function CToolbarButton_setAction(_195){
this.m_action=_195;
};
function CToolbarButton_getToolTip(){
return this.m_toolTip;
};
function CToolbarButton_setToolTip(_196){
this.m_toolTip=_196;
};
function CToolbarButton_getDropDownToolTip(){
return this.m_dropDownToolTip;
};
function CToolbarButton_setDropDownToolTip(_197){
this.m_dropDownToolTip=_197;
};
function CToolbarButton_getIcon(){
return this.m_icon;
};
function CToolbarButton_setIcon(_198){
this.m_icon.setPath(_198);
};
function CToolbarButton_onmouseover(evt){
var _19a=this.tbItem;
if(typeof _19a=="object"){
if(!_19a.isEnabled()){
return;
}
if(_19a.getMenu()!=null&&!_19a.m_bHideDropDown&&("menu"+_19a.getId())==this.id){
this.className=_19a.getDropDownStyle().getActiveRolloverState();
}else{
if(typeof _19a.getStyle()=="object"){
this.className=_19a.getStyle().getActiveRolloverState();
}
if(_19a.getMenu()!=null&&!_19a.m_bHideDropDown){
var _19b=this.document?this.document.getElementById("menu"+_19a.getId()):this.ownerDocument.getElementById("menu"+_19a.getId());
if(typeof _19b=="object"){
_19b.className=_19a.getDropDownStyle().getActiveRolloverState();
}
}
}
if(_19a.getParent()!=null&&typeof _19a.getParent().onmouseover=="function"){
_19a.getParent().onmouseover(evt);
}
_19a.getObservers().notify(CToolbarButton_onmouseover);
}
};
function CToolbarButton_onmouseout(evt){
var _19d=this.tbItem;
if(typeof _19d=="object"){
if(!_19d.isEnabled()){
return;
}
if(_19d.getMenu()!=null&&!_19d.m_bHideDropDown&&("menu"+_19d.getId())==this.id){
this.className=_19d.getDropDownStyle().getActiveState();
}else{
if(typeof _19d.getStyle()=="object"){
this.className=_19d.getStyle().getActiveState();
}
if(_19d.getMenu()!=null&&!_19d.m_bHideDropDown){
var _19e=this.document?this.document.getElementById("menu"+_19d.getId()):this.ownerDocument.getElementById("menu"+_19d.getId());
if(typeof _19e=="object"){
_19e.className=_19d.getDropDownStyle().getActiveState();
}
}
}
if(_19d.getParent()!=null&&typeof _19d.getParent().onmouseout=="function"){
_19d.getParent().onmouseout(evt);
}
_19d.getObservers().notify(CToolbarButton_onmouseout);
}
};
function CToolbarButton_onclick(evt){
evt=(evt)?evt:((event)?event:null);
var _1a0=this.tbItem;
if(_1a0!=null){
if(!_1a0.isEnabled()){
return;
}
var menu=_1a0.getMenu();
if(menu!=null&&((this.id==("menu"+_1a0.getId()))||(_1a0.m_bHideDropDown&&this.id==_1a0.getId()))){
if(menu.isVisible()){
menu.remove();
}else{
if(typeof menu.setHTMLContainer!="undefined"){
menu.setHTMLContainer(this.document?this.document.body:this.ownerDocument.body);
}
if(typeof _1a0.m_parent.closeMenus=="function"){
_1a0.m_parent.closeMenus();
}
menu.draw();
menu.show();
}
}else{
eval(this.tbItem.m_action);
}
if(_1a0.getParent()!=null&&typeof _1a0.getParent().onclick=="function"){
_1a0.getParent().onclick(evt);
}
_1a0.getObservers().notify(CToolbarButton_onclick);
}
if(this.blur){
this.blur();
}
evt.cancelBubble=true;
return false;
};
function CToolbarButton_onkeypress(evt){
evt=(evt)?evt:((event)?event:null);
if(evt.keyCode==13||evt.keyCode==0){
var _1a3=this.tbItem;
if(_1a3!=null){
if(!_1a3.isEnabled()){
return;
}
var menu=_1a3.getMenu();
if(menu!=null&&((this.id==("menu"+_1a3.getId()))||(_1a3.m_bHideDropDown&&this.id==_1a3.getId()))){
if(menu.isVisible()){
menu.remove();
}else{
if(typeof menu.setHTMLContainer!="undefined"){
menu.setHTMLContainer(this.document?this.document.body:this.ownerDocument.body);
}
menu.draw();
menu.show();
}
}else{
eval(this.tbItem.m_action);
}
if(_1a3.getParent()!=null&&typeof _1a3.getParent().onkeypress=="function"){
_1a3.getParent().onkeypress(evt);
}
_1a3.getObservers().notify(CToolbarButton_onkeypress);
}
return false;
}
evt.cancelBubble=true;
return true;
};
function CToolbarButton_getMenu(){
return this.m_menu;
};
function CToolbarButton_getMenuType(){
return "dropDown";
};
function CToolbarButton_setStyle(_1a5){
this.m_style=_1a5;
};
function CToolbarButton_getStyle(){
return this.m_style;
};
function CToolbarButton_getDropDownStyle(){
return this.m_dropDownStyle;
};
function CToolbarButton_setDropDownStyle(_1a6){
this.m_dropDownStyle=_1a6;
};
function CToolbarButton_isVisible(){
return this.m_bVisible;
};
function CToolbarButton_hide(){
this.m_bVisible=false;
};
function CToolbarButton_show(){
this.m_bVisible=true;
};
function CToolbarButton_enable(){
this.getStyle().setActiveState("normal");
this.getStyle().setActiveRolloverState("normal");
if(this.getIcon()){
this.getIcon().enable();
}
this.updateHTML();
};
function CToolbarButton_disable(){
this.getStyle().setActiveState("disabled");
this.getStyle().setActiveRolloverState("disabled");
if(this.getIcon()){
this.getIcon().disable();
}
this.updateHTML();
};
function CToolbarButton_isEnabled(){
if(this.getIcon()){
return this.getIcon().isEnabled();
}else{
return true;
}
};
function CToolbarButton_pressed(){
this.getStyle().setActiveState("depressed");
this.getStyle().setActiveRolloverState("depressed");
this.updateHTML();
};
function CToolbarButton_reset(){
this.getStyle().setActiveState("normal");
this.getStyle().setActiveRolloverState("normal");
this.updateHTML();
};
function CToolbarButton_updateHTML(){
if(typeof this.getStyle()=="object"){
if(typeof this.getParent().getHTMLContainer=="function"){
var _1a7=this.getParent().getHTMLContainer();
if(_1a7!=null){
var _1a8=_1a7.document?_1a7.document.getElementById(this.getId()):_1a7.ownerDocument.getElementById(this.getId());
if(_1a8!=null){
var _1a9=_1a8.getElementsByTagName("img");
if(typeof _1a9!="undefined"&&_1a9 instanceof Array&&_1a9.length>0){
if(this.getIcon()){
if(this.getIcon().isEnabled()){
_1a9[0].src=this.getIcon().getPath();
}else{
_1a9[0].src=this.getIcon().getDisabledImagePath();
}
}
if(this.getToolTip()){
_1a8.title=this.getToolTip();
_1a9[0].title=this.getToolTip();
}
}
var _1aa;
if(this.getStyle().getActiveState()!=this.getStyle().getDisabledState()){
_1a8.tabIndex=1;
if(this.getMenu()!=null&&!this.m_bHideDropDown){
_1a8.nextSibling.tabIndex=1;
_1a8.nextSibling.title=this.getToolTip();
_1aa=_1a8.nextSibling.getElementsByTagName("img");
if(_1aa!=null){
_1aa[0].title=this.getToolTip();
}
}
}else{
if(_1a8.tabIndex!="undefined"){
_1a8.removeAttribute("tabIndex");
if(this.getMenu()!=null){
_1a8.nextSibling.removeAttribute("tabIndex");
_1a8.nextSibling.title=this.getToolTip();
_1aa=_1a8.nextSibling.getElementsByTagName("img");
if(_1aa!=null){
_1aa[0].title=this.getToolTip();
}
}
}
}
_1a8.className=this.getStyle().getActiveState();
}
}
}
}
};
function CToolbarButton_getObservers(){
return this.m_observers;
};
function CToolbarButton_setFocus(){
if(this.m_menu!=null&&!this.m_bHideDropDown){
document.getElementById(this.m_id).nextSibling.focus();
}else{
document.getElementById(this.m_id).focus();
}
};
CToolbarButton.prototype.draw=CToolbarButton_draw;
CToolbarButton.prototype.attachEvents=CToolbarButton_attachEvents;
CToolbarButton.prototype.onblur=CToolbarButton_onmouseout;
CToolbarButton.prototype.onfocus=CToolbarButton_onmouseover;
CToolbarButton.prototype.onkeypress=CToolbarButton_onkeypress;
CToolbarButton.prototype.onmouseover=CToolbarButton_onmouseover;
CToolbarButton.prototype.onmouseout=CToolbarButton_onmouseout;
CToolbarButton.prototype.onclick=CToolbarButton_onclick;
CToolbarButton.prototype.setParent=CToolbarButton_setParent;
CToolbarButton.prototype.getParent=CToolbarButton_getParent;
CToolbarButton.prototype.getAction=CToolbarButton_getAction;
CToolbarButton.prototype.setAction=CToolbarButton_setAction;
CToolbarButton.prototype.getToolTip=CToolbarButton_getToolTip;
CToolbarButton.prototype.setToolTip=CToolbarButton_setToolTip;
CToolbarButton.prototype.getDropDownToolTip=CToolbarButton_getDropDownToolTip;
CToolbarButton.prototype.setDropDownToolTip=CToolbarButton_setDropDownToolTip;
CToolbarButton.prototype.getIcon=CToolbarButton_getIcon;
CToolbarButton.prototype.setIcon=CToolbarButton_setIcon;
CToolbarButton.prototype.getMenu=CToolbarButton_getMenu;
CToolbarButton.prototype.getMenuType=CToolbarButton_getMenuType;
CToolbarButton.prototype.getId=CToolbarButton_getId;
CToolbarButton.prototype.setStyle=CToolbarButton_setStyle;
CToolbarButton.prototype.getStyle=CToolbarButton_getStyle;
CToolbarButton.prototype.getDropDownStyle=CToolbarButton_getDropDownStyle;
CToolbarButton.prototype.setDropDownStyle=CToolbarButton_setDropDownStyle;
CToolbarButton.prototype.createDropDownMenu=CToolbarButton_createDropDownMenu;
CToolbarButton.prototype.addOwnerDrawControl=CToolbarButton_addOwnerDrawControl;
CToolbarButton.prototype.getObservers=CToolbarButton_getObservers;
CToolbarButton.prototype.update=new Function("return true");
CToolbarButton.prototype.isVisible=CToolbarButton_isVisible;
CToolbarButton.prototype.hide=CToolbarButton_hide;
CToolbarButton.prototype.show=CToolbarButton_show;
CToolbarButton.prototype.isEnabled=CToolbarButton_isEnabled;
CToolbarButton.prototype.enable=CToolbarButton_enable;
CToolbarButton.prototype.disable=CToolbarButton_disable;
CToolbarButton.prototype.pressed=CToolbarButton_pressed;
CToolbarButton.prototype.reset=CToolbarButton_reset;
CToolbarButton.prototype.setFocus=CToolbarButton_setFocus;
CToolbarButton.prototype.updateHTML=CToolbarButton_updateHTML;
var CMODAL_ID="CMODAL_FRAME";
var CMODAL_BLUR="CMODAL_BLUR";
var CMODAL_CONTENT_ID="CMODAL_CONTENT";
var CMODAL_HEADER="CMODAL_HEADER";
var CMODAL_BACKGROUND_LAYER_ID="CMODAL_BK";
var CMODAL_BACK_IFRAME_ID="CMODAL_BK_IFRAME";
var CMODAL_ZINDEX=111;
var CMODAL_dragEnabled=false;
var CMODAL_resizeDirection=null;
var CMODAL_startLeft=null;
var CMODAL_startTop=null;
var CMODAL_startWidth=null;
var CMODAL_startHeight=null;
var CMODAL_deltaX=null;
var CMODAL_deltaY=null;
function CModal(_1ab,_1ac,_1ad,t,l,h,w,_1b2,_1b3,_1b4,_1b5,_1b6){
this.m_hideButtonBar=false;
if(typeof _1b2!="undefined"){
this.m_hideButtonBar=_1b2;
}
this.m_hideHeader=false;
if(typeof _1b3!="undefined"){
this.m_hideHeader=_1b3;
}
this.m_title=_1ab;
this.m_sCloseToolTip=_1ac;
if(_1ad){
this.m_parent=_1ad;
}else{
this.m_parent=(document.body?document.body:document.documentElement);
}
var oBL=document.getElementById(CMODAL_BACKGROUND_LAYER_ID);
if(oBL){
oBL.parentNode.removeChild(oBL);
}
if(typeof _1b6!="undefined"&&_1b6!=""){
this.m_webContentRoot=_1b6;
}else{
this.m_webContentRoot="..";
}
oBL=document.createElement("div");
oBL.id=CMODAL_BACKGROUND_LAYER_ID;
oBL.style.display="none";
oBL.style.position="absolute";
oBL.style.top="0px";
oBL.style.left="0px";
oBL.style.zIndex=(CMODAL_ZINDEX-2);
oBL.style.width="100%";
oBL.style.height="100%";
if(typeof _1b5!="undefined"&&_1b5){
oBL.style.backgroundColor="rgb(238, 238, 238)";
oBL.style.opacity="0.6";
oBL.style.filter="alpha(opacity:60)";
}
oBL.innerHTML="<table width=\"100%\" height=\"100%\" role=\"presentation\"><tr><td role=\"presentation\" onmousemove=\"CModalEvent_mousemoving(event)\" onmouseup=\"CModalEvent_disableDrag(event)\"></td></tr></table>";
this.m_parent.appendChild(oBL);
this.m_backLayer=oBL;
this.m_top=(t==null?0:t);
this.m_left=(l==null?0:l);
this.m_height=(h==null?0:h);
this.m_width=(w==null?0:w);
if(typeof _1b4!="undefined"&&_1b4==true){
this.m_height=CModal_dynamicHeight();
this.m_width=CModal_dynamicWidth();
}
if(window.attachEvent){
window.attachEvent("onresize",CModalEvent_onWindowResize);
window.attachEvent("onscroll",CModalEvent_onWindowResize);
}else{
window.addEventListener("resize",CModalEvent_onWindowResize,false);
window.addEventListener("scroll",CModalEvent_onWindowResize,false);
}
var f=document.getElementById(CMODAL_ID);
if(f){
f.parentNode.removeChild(f);
}
f=document.createElement("span");
f.id=CMODAL_ID;
f.CModal=this;
f.className="CModal_frame";
f.style.zIndex=CMODAL_ZINDEX;
f.style.border="#99aacc 1px solid";
var div=this.createHiddenDiv("CMODAL_TAB_LOOP_BEFORE",0);
div.onfocus=function(){
document.getElementById("CMODAL_AFTER_PLACEHOLDER").focus();
};
this.m_parent.appendChild(f);
div=this.createHiddenDiv("CMODAL_AFTER_PLACEHOLDER",-1);
div=this.createHiddenDiv("CMODAL_TAB_LOOP_AFTER",0);
div.onfocus=function(){
document.getElementById(CMODAL_CONTENT_ID).contentWindow.focus();
};
this.m_back_iframe=document.getElementById(CMODAL_BACK_IFRAME_ID);
if(this.m_back_iframe){
this.m_back_iframe.parentNode.removeChild(this.m_back_iframe);
}
this.m_back_iframe=document.createElement("iframe");
this.m_back_iframe.id=CMODAL_BACK_IFRAME_ID;
this.m_back_iframe.frameBorder=0;
this.m_back_iframe.src=this.m_webContentRoot+"/common/blank.html";
this.m_back_iframe.style.position="absolute";
this.m_back_iframe.style.zIndex=CMODAL_ZINDEX-1;
this.m_back_iframe.onfocus=function(){
document.getElementById(CMODAL_BACKGROUND_LAYER_ID).focus();
};
this.m_back_iframe.tabIndex=1;
this.m_back_iframe.title="Empty frame";
this.m_back_iframe.role="presentation";
this.m_parent.appendChild(this.m_back_iframe);
f.innerHTML=this.renderDialogFrame();
this.m_frame=f;
};
function CModal_createHiddenDiv(_1ba,_1bb){
var div=document.getElementById(_1ba);
if(div){
div.parentNode.removeChild(div);
}
div=document.createElement("div");
div.id=_1ba;
div.tabIndex=_1bb;
div.style.position="absolute";
div.style.overflow="hidden";
div.style.width="0px";
div.style.height="0px";
this.m_parent.appendChild(div);
return div;
};
function CModal_hide(){
this.m_top=parseInt(this.m_frame.offsetTop,10);
this.m_left=parseInt(this.m_frame.offsetLeft,10);
this.m_height=parseInt(this.m_frame.offsetHeight,10);
this.m_width=parseInt(this.m_frame.offsetWidth,10);
this.m_backLayer.style.display="none";
this.m_frame.style.display="none";
if(this.m_back_iframe){
this.m_back_iframe.style.display="none";
}
};
function CModal_reCenter(){
this.m_left=(document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientWidth-this.m_width)/2;
this.m_top=(document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientHeight-this.m_height)/2;
};
function CModal_renderDialogFrame(){
var _1bd="summary=\"\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" role=\"presentation\"";
var out="<table role=\"presentation\" style=\"width:100%; height:99%; padding-top:2px;\" "+_1bd+" onmouseup=\"CModalEvent_disableDrag(event)\" onmousemove=\"CModalEvent_mousemoving(event)\">";
if(!this.m_hideHeader){
out+=""+"<tr>"+"<td role=\"presentation\" onmousedown=\"CModalEvent_enableDrag(event);\">"+"<table class=\"dialogHeader\" width=\"100%\" "+_1bd+">"+"<tr>"+"<td id=\""+CMODAL_HEADER+"\" valign=\"top\" class=\"dialogHeaderTitle\" width=\"100%\" nowrap=\"nowrap\">"+getConfigFrame().htmlencode(this.m_title)+"</td><td align=\"right\" valign=\"middle\">"+"<a onclick=\"hideCModal()\" style=\"cursor:pointer;\">"+"<img height=\"16\" width=\"16\" vspace=\"2\" border=\"0\" class=\"dialogClose\" onmouseover=\"this.className = 'dialogCloseOver'\" onmouseout=\"this.className = 'dialogClose'\" onmouseup=\"this.className = 'dialogClose'\" src=\""+p_sSkinFolder+"/portal/images/close.gif\" alt=\""+getConfigFrame().htmlencode(this.m_sCloseToolTip)+"\" title=\""+getConfigFrame().htmlencode(this.m_sCloseToolTip)+"\">"+"</a>"+"</td>"+"</tr>"+"</table>"+"</td>"+"</tr>";
}
out+="<tr><td role=\"presentation\" width=\"100%\" height=\"100%\" class=\"body_dialog_modal\" onmousemove=\"CModalEvent_mousemoving(event)\" onmouseup=\"CModalEvent_disableDrag(event)\">"+"<iframe title=\"modal dialog\" id=\""+CMODAL_CONTENT_ID+"\" name=\""+CMODAL_CONTENT_ID+"\" class=\"body_dialog_modal\" src=\""+this.m_webContentRoot+"/"+"qs"+"/blankNewWin.html\" style=\"padding:0px;margin:0px;width:100%;height:100%;\" frameborder=\"0\">no iframe support?</iframe>"+"</td></tr>";
if(!this.m_hideButtonBar){
out+="<tr><td>"+"<table "+_1bd+" class=\"dialogButtonBar\" style=\"padding:0px\">"+"<tr>"+"<td width=\"2\" valign=\"middle\"><img width=\"2\" alt=\"\" src=\""+this.m_webContentRoot+"/ps/images/space.gif\"></td>"+"<td valign=\"middle\"><table border=\"0\" cellpadding=\"1\" cellspacing=\"0\" role=\"presentation\">"+"<tr>"+"<td><img height=\"1\" width=\"8\" alt=\"\" src=\""+this.m_webContentRoot+"/ps/images/space.gif\"></td>"+"<td>"+CModal_renderButton(msgQS["OK"],"okCModal()")+"</td>"+"<td><img height=\"1\" width=\"8\" alt=\"\" src=\""+this.m_webContentRoot+"/ps/images/space.gif\"></td>"+"<td>"+CModal_renderButton(msgQS["CANCEL"],"cancelCModal()")+"</td>"+"<td><img height=\"1\" width=\"8\" alt=\"\" src=\""+this.m_webContentRoot+"/ps/images/space.gif\"></td>"+"</tr></table>"+"</td><td width=\"100%\">&nbsp;</td>"+"<td style=\"padding:3px;\" valign=\"bottom\" class=\"CModal_sideSE\" onmousedown=\"CModalEvent_enableResize(event)\">"+"<img role=\"presentation\" class=\"CModal_sideSE\" style=\"cursor:se-resize;\" alt=\"\" height=\"12\" width=\"12\" border=\"0\" src=\""+this.m_webContentRoot+"/common/images/dialog_resize.gif\" onmousedown=\"CModalEvent_enableResize(event);return false;\" onmouseup=\"CModalEvent_disableDrag(event);return false;\" onmousemove=\"CModalEvent_mousemoving(event);return false;\">"+"</td>"+"</tr></table></td></tr>";
}
out+="</table>";
return out;
};
function CModal_renderButton(_1bf,_1c0){
var out="<table cellpadding=\"0\" cellspacing=\"0\" style=\"padding: 2px 10px 3px;\" class=\"commandButton\" onmouseover=\"this.className='commandButtonOver'\""+" onmouseout=\"this.className = 'commandButton'\" onmousedown=\"this.className='commandButtonDown'\">"+"<tr>"+"<td style=\"cursor:pointer;\" valign=\"middle\" align=\"center\" nowrap id=\"btnAnchor\" onclick=\""+_1c0+"\">"+" <img height=\"1\" width=\"60\" alt=\"\" src=\""+this.m_webContentRoot+"/ps/images/space.gif\"><br>"+_1bf+"</td></tr></table>";
return out;
};
function CModal_show(){
this.m_backLayer.style.display="";
this.reCenter();
var _1c2=CMenu_getScrollingPosition();
this.m_frame.style.top=(_1c2.y+this.m_top)+"px";
this.m_frame.style.left=(_1c2.x+this.m_left)+"px";
this.m_frame.style.height=this.m_height+"px";
this.m_frame.style.width=this.m_width+"px";
this.m_frame.style.display="inline";
this.m_frame.focus();
if(this.m_back_iframe){
this.m_back_iframe.style.top=this.m_frame.offsetTop+"px";
this.m_back_iframe.style.left=this.m_frame.offsetLeft+"px";
this.m_back_iframe.style.height=this.m_frame.offsetHeight+"px";
this.m_back_iframe.style.width=this.m_frame.offsetWidth+"px";
this.m_back_iframe.style.display="block";
}
};
CModal.prototype.hide=CModal_hide;
CModal.prototype.createHiddenDiv=CModal_createHiddenDiv;
CModal.prototype.reCenter=CModal_reCenter;
CModal.prototype.renderDialogFrame=CModal_renderDialogFrame;
CModal.prototype.show=CModal_show;
function hideCModal(){
var cdlg=document.getElementById(CMODAL_ID);
if(cdlg&&cdlg.CModal){
cdlg.CModal.hide();
}
};
function destroyCModal(){
var oBL=document.getElementById(CMODAL_BACKGROUND_LAYER_ID);
if(oBL){
oBL.style.display="none";
}
var _1c5=document.getElementById(CMODAL_ID);
if(_1c5){
_1c5.style.display="none";
}
var _1c6=document.getElementById(CMODAL_BACK_IFRAME_ID);
if(_1c6){
_1c6.style.display="none";
}
if(window.detachEvent){
window.detachEvent("onresize",CModalEvent_onWindowResize);
window.detachEvent("onscroll",CModalEvent_onWindowResize);
}else{
window.removeEventListener("resize",CModalEvent_onWindowResize,false);
window.removeEventListener("scroll",CModalEvent_onWindowResize,false);
}
};
function cancelCModal(){
var _1c7=document.getElementById(CMODAL_CONTENT_ID);
if(_1c7&&_1c7.contentWindow&&typeof _1c7.contentWindow.cancelDialog=="function"){
_1c7.contentWindow.cancelDialog();
}else{
hideCModal();
}
};
function okCModal(){
var _1c8=document.getElementById(CMODAL_CONTENT_ID);
if(_1c8&&_1c8.contentWindow&&typeof _1c8.contentWindow.execute=="function"){
_1c8.contentWindow.execute();
}else{
hideCModal();
}
};
function CModal_dynamicWidth(){
return (window.innerWidth!=null?window.innerWidth:document.documentElement&&document.documentElement.clientWidth?document.documentElement.clientWidth:document.body!=null?document.body.clientWidth:null)-150;
};
function CModal_dynamicHeight(){
return (window.innerHeight!=null?window.innerHeight:document.documentElement&&document.documentElement.clientHeight?document.documentElement.clientHeight:document.body!=null?document.body.clientHeight:null)-150;
};
function CModal_setModalHeight(_1c9){
var _1ca=_1c9.getAttribute("storedHeight");
if(_1c9.offsetHeight>document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientHeight){
if(_1ca==null){
_1c9.setAttribute("storedHeight",_1c9.offsetHeight);
}
_1c9.style.height=document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientHeight+"px";
}else{
if(_1ca!=null){
if(_1ca<document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientHeight){
_1c9.style.height=_1ca+"px";
}else{
_1c9.style.height=document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientHeight+"px";
}
}
}
};
function CModal_setModalWidth(_1cb){
var _1cc=_1cb.getAttribute("storedWidth");
if(_1cb.offsetWidth>document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientWidth){
if(_1cc==null){
_1cb.setAttribute("storedWidth",_1cb.offsetWidth);
}
_1cb.style.width=document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientWidth+"px";
}else{
if(_1cc!=null){
if(_1cc<document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientWidth){
_1cb.removeAttribute("storedWidth");
_1cb.style.width=_1cc+"px";
}else{
_1cb.style.width=document.getElementById(CMODAL_BACKGROUND_LAYER_ID).clientWidth+"px";
}
}
}
};
function CModalEvent_onWindowResize(e){
var _1ce=document.getElementById(CMODAL_ID);
var _1cf=document.getElementById(CMODAL_BACKGROUND_LAYER_ID);
var _1d0=document.getElementById(CMODAL_BACK_IFRAME_ID);
if(_1ce&&_1cf&&_1d0){
CModal_setModalWidth(_1ce);
CModal_setModalHeight(_1ce);
var _1d1=CMenu_getScrollingPosition();
var _1d2=(_1d1.y+((_1cf.clientHeight-_1ce.offsetHeight)/2));
var _1d3=(_1d1.x+((_1cf.clientWidth-_1ce.offsetWidth)/2));
_1ce.style.top=_1d2+"px";
_1ce.style.left=_1d3+"px";
_1d0.style.top=_1d2+"px";
_1d0.style.width=_1ce.style.width;
_1d0.style.height=_1ce.style.height;
_1d0.style.left=_1d3+"px";
}
};
function CModalEvent_mousemoving(e){
var oDlg=null;
var _1d6=null;
if(CMODAL_dragEnabled){
if(e==null&&(typeof event=="object")&&event.clientX!=null){
e=event;
}
oDlg=document.getElementById(CMODAL_ID);
if(CMODAL_startLeft==null){
CMODAL_startLeft=parseInt(oDlg.style.left,10)-e.clientX;
CMODAL_startTop=parseInt(oDlg.style.top,10)-e.clientY;
}
oDlg.style.left=CMODAL_startLeft+e.clientX;
oDlg.style.top=CMODAL_startTop+e.clientY;
_1d6=document.getElementById(CMODAL_BACK_IFRAME_ID);
if(_1d6){
_1d6.style.left=oDlg.style.left;
_1d6.style.top=oDlg.style.top;
}
}
if(CMODAL_resizeDirection){
if(e==null&&(typeof event=="object")&&event.clientX!=null){
e=event;
}
oDlg=document.getElementById(CMODAL_ID);
if(CMODAL_startLeft==null){
CMODAL_startLeft=parseInt(oDlg.style.left,10);
CMODAL_startTop=parseInt(oDlg.style.top,10);
CMODAL_startHeight=parseInt(oDlg.style.height,10);
CMODAL_startWidth=parseInt(oDlg.style.width,10);
}
var h=0,w=0;
switch(CMODAL_resizeDirection){
case "NE":
case "E":
case "SE":
w=(e.clientX-CMODAL_startLeft+CMODAL_deltaX);
if(w<100){
w=100;
}
oDlg.style.width=w+"px";
}
switch(CMODAL_resizeDirection){
case "SW":
case "S":
case "SE":
h=(e.clientY-CMODAL_startTop+CMODAL_deltaY);
if(h<100){
h=100;
}
oDlg.style.height=h+"px";
}
switch(CMODAL_resizeDirection){
case "NW":
case "N":
case "NE":
oDlg.style.top=e.clientY;
h=(CMODAL_startHeight+(CMODAL_startTop-e.clientY)+CMODAL_deltaY);
if(h<100){
h=100;
}
oDlg.style.height=h+"px";
}
switch(CMODAL_resizeDirection){
case "NW":
case "W":
case "SW":
oDlg.style.left=e.clientX;
w=(CMODAL_startWidth+(CMODAL_startLeft-e.clientX)+CMODAL_deltaX);
if(w<100){
w=100;
}
oDlg.style.width=w+"px";
}
_1d6=document.getElementById(CMODAL_BACK_IFRAME_ID);
if(_1d6){
_1d6.style.left=oDlg.offsetLeft;
_1d6.style.top=oDlg.offsetTop;
_1d6.style.height=oDlg.offsetHeight;
_1d6.style.width=oDlg.offsetWidth;
}
}
if(e.returnValue){
e.returnValue=false;
}else{
if(e.preventDefault){
e.preventDefault();
}else{
return false;
}
}
};
function CModalEvent_disableDrag(e){
CMODAL_dragEnabled=false;
CMODAL_resizeDirection=null;
CMODAL_startLeft=null;
CMODAL_startTop=null;
CMODAL_deltaX=0;
CMODAL_deltaY=0;
var cn=document.getElementById(CMODAL_ID).className;
var _1db=document.getElementById(CMODAL_HEADER);
if(_1db!=null){
_1db.style.cursor="default";
}
document.getElementById(CMODAL_ID).className=cn.replace(/\s*\bCModal_dragging\b/g,"");
document.getElementById(CMODAL_CONTENT_ID).style.visibility="visible";
if(typeof document.getElementById(CMODAL_CONTENT_ID).contentWindow.refreshContent=="function"){
document.getElementById(CMODAL_CONTENT_ID).contentWindow.refreshContent();
}
if(e.returnValue){
e.returnValue=false;
}else{
if(e.preventDefault){
e.preventDefault();
}else{
return false;
}
}
};
function CModalEvent_enableDrag(e){
CMODAL_dragEnabled=true;
CMODAL_startLeft=null;
CMODAL_startTop=null;
if(e==null&&(typeof event=="object")&&event.clientX!=null){
e=event;
}
document.getElementById(CMODAL_ID).className+=" CModal_dragging";
document.getElementById(CMODAL_HEADER).style.cursor="move";
document.getElementById(CMODAL_CONTENT_ID).style.visibility="hidden";
if(e.returnValue){
e.returnValue=false;
}else{
if(e.preventDefault){
e.preventDefault();
}else{
return false;
}
}
};
function CModalEvent_enableResize(e){
CMODAL_startLeft=null;
CMODAL_startTop=null;
CMODAL_startWidth=null;
CMODAL_startHeight=null;
CMODAL_deltaX=0;
CMODAL_deltaY=0;
if(e==null&&(typeof event=="object")&&event.clientX!=null){
e=event;
}
var oDlg=document.getElementById(CMODAL_ID);
CMODAL_startLeft=parseInt(oDlg.style.left,10);
CMODAL_startTop=parseInt(oDlg.style.top,10);
CMODAL_startHeight=parseInt(oDlg.style.height,10);
CMODAL_startWidth=parseInt(oDlg.style.width,10);
CMODAL_deltaX=(CMODAL_startLeft+CMODAL_startWidth-e.clientX);
CMODAL_deltaY=(CMODAL_startTop+CMODAL_startHeight-e.clientY);
var src=(e.srcElement?e.srcElement:e.target);
if((/\bCModal_side(\w+)\b/).test(src.className)){
CMODAL_resizeDirection=RegExp.$1;
document.getElementById(CMODAL_ID).className+=" CModal_dragging";
document.getElementById(CMODAL_CONTENT_ID).style.visibility="hidden";
}
if(e.returnValue){
e.returnValue=false;
}else{
if(e.preventDefault){
e.preventDefault();
}else{
return false;
}
}
};
function CMenuEntry(){
this.m_menu=null;
this.m_menuType="";
this.m_action=null;
this.m_bEnabled=true;
};
function CMenuEntry_setParent(_1e0){
this.m_parent=_1e0;
};
function CMenuEntry_getParent(){
return this.m_parent;
};
function CMenuEntry_setWebContentRoot(_1e1){
this.m_webContentRoot=_1e1;
};
function CMenuEntry_setId(id){
this.m_id=id;
};
function CMenuEntry_getId(){
return this.m_id;
};
function CMenuEntry_getObservers(){
return this.m_observers;
};
function CMenuEntry_onkeydown(evt){
evt=(evt)?evt:((event)?event:null);
if(typeof evt!="object"||evt==null){
return;
}
var i=0,ii,_1e6,_1e7,_1e8;
var _1e9=true;
var _1ea=evt.currentTarget||evt.srcElement;
if(evt.keyCode==9&&evt.shiftKey){
_1e8=this.getParent();
for(i=0;i<_1e8.getNumItems();i++){
if(_1e8.get(i)==this){
_1e8.hide();
this.getObservers().notify("CMenuItem_closeMenuTabEvent");
var _1eb=_1e8.getMenuType?_1e8.getMenuType():null;
if(_1eb!==cHorizonalBar&&_1eb!==cVerticalBar){
if(isIE()){
evt.preventDefault();
}else{
evt.returnValue=false;
}
}
break;
}else{
if(this.getParent().get(i).m_bEnabled==true){
break;
}
}
}
}else{
if(evt.keyCode==9||evt.keyCode==27){
if(this.isInMenu()){
for(i=(this.getParent().getNumItems()-1);i>=0;i--){
if(this.getParent().get(i)==this||evt.keyCode==27){
if(this.getMenu()){
this.getMenu().hide();
}
this.getParent().hide();
this.getObservers().notify("CMenuItem_closeMenuTabEvent");
if(isIE()){
evt.preventDefault();
}else{
evt.returnValue=false;
}
break;
}else{
if(this.getParent().get(i).m_bEnabled==true){
break;
}
}
}
}else{
if(typeof this.getParent().closeAllMenus=="function"){
this.getParent().closeAllMenus();
}else{
if(typeof this.getParent().closeMenus=="function"){
this.getParent().closeMenus();
}
}
}
}else{
if(evt.keyCode==40){
if(this.isInMenu()){
_1e6=this.getParent().getNumItems();
for(i=0;i<_1e6;i++){
if(this===this.getParent().get(i)){
var _1ec=0;
var _1ed=true;
if(i!=(_1e6-1)){
_1ec=i+1;
_1ed=false;
}
for(ii=_1ec;ii<_1e6;ii++){
_1e7=this.getParent().get(ii);
if(typeof _1e7.isVisible=="function"&&_1e7.isVisible()&&typeof _1e7.setFocus=="function"){
_1e7.setFocus();
break;
}
if(ii==(_1e6-1)&&!_1ed){
ii=0;
_1ed=true;
}
}
break;
}
}
}else{
if(this.isEnabled()){
_1e9=false;
var menu=this.getMenu();
if(this.getMenuType()=="dropDown"){
if(menu.isVisible()==false){
menu.setHTMLContainer(_1ea.document?_1ea.document.body:_1ea.ownerDocument.body);
menu.draw();
menu.show();
}else{
menu.remove();
}
}
}
}
}else{
if(evt.keyCode==38&&this.isInMenu()){
_1e6=this.getParent().getNumItems();
for(i=0;i<_1e6;i++){
if(this===this.getParent().get(i)){
var _1ec=i-1;
var _1ef=false;
if(i<=0){
_1ec=_1e6-1;
_1ef=true;
}
for(ii=_1ec;ii>=0;ii--){
_1e7=this.getParent().get(ii);
if(typeof _1e7.isVisible=="function"&&_1e7.isVisible()&&typeof _1e7.setFocus=="function"){
_1e7.setFocus();
break;
}
if(ii==0&&!_1ef){
_1ef=true;
ii=_1e6;
}
}
break;
}
}
}else{
if(evt.keyCode==37||evt.keyCode==39){
if(this.isEnabled()&&this.getMenu()!=null){
var menu=this.getMenu();
if(this.getMenuType()=="cascaded"){
_1e9=false;
if(menu.isVisible()==false){
menu.setHTMLContainer(_1ea.document?_1ea.document.body:_1ea.ownerDocument.body);
menu.draw();
menu.show();
}
}
}else{
_1e9=false;
_1e8=this.getParent();
if(_1e8&&_1e8.getParent()&&_1e8.getParent().getMenuType()=="cascaded"){
_1e8.hide();
}
}
}
}
}
}
}
if(_1e9&&this.getParent()!=null&&typeof this.getParent().onkeydown=="function"){
this.getParent().onkeydown(evt);
}
this.getObservers().notify(CMenuItem_onkeydown);
};
function CMenuEntry_onkeypress(evt){
evt=(evt)?evt:((event)?event:null);
var _1f1=evt.keyCode;
if(_1f1==0&&typeof evt.charCode!="undefined"){
_1f1=evt.charCode;
}
if(typeof evt=="object"&&evt!=null){
var _1f2=evt.currentTarget||evt.srcElement;
var _1f3=true;
if(_1f1==9||_1f1==37||_1f1==38||_1f1==39||_1f1==40){
_1f3=false;
}else{
if(_1f1==13||_1f1==32){
if(!this.isEnabled()){
return;
}
if(this.getMenu()!=null){
var menu=this.getMenu();
if(this.getMenuType()=="cascaded"){
_1f3=false;
if(menu.isVisible()==false){
menu.setHTMLContainer(_1f2.document?_1f2.document.body:_1f2.ownerDocument.body);
menu.draw();
menu.show();
}else{
menu.remove();
}
}else{
if(this.getMenuType()=="dropDown"){
if(menu.isVisible()==false){
menu.setHTMLContainer(_1f2.document?_1f2.document.body:_1f2.ownerDocument.body);
menu.draw();
menu.show();
}else{
menu.remove();
}
}
}
}else{
eval(this.getAction());
}
}else{
if(_1f1==27){
this.getParent().hide();
return;
}
}
}
if(_1f3){
if(this.getParent()!=null&&typeof this.getParent().onkeypress=="function"){
this.getParent().onkeypress(evt);
}
this.getObservers().notify(CMenuItem_onkeypress);
}
}
if(_1f1==13||_1f1==0||_1f1==40||_1f1==38){
if(evt!=null){
evt.cancelBubble=true;
}
return false;
}
return true;
};
function CMenuEntry_getMenu(){
return this.m_menu;
};
function CMenuEntry_getMenuType(){
return this.m_menuType;
};
function CMenuEntry_isEnabled(){
return this.m_bEnabled;
};
function CMenuEntry_isInMenu(){
return this.getParent() instanceof CMenu;
};
function CMenuEntry_getAction(){
return this.m_action;
};
function CMenuEntry_setAction(_1f5){
this.m_action=_1f5;
};
CMenuEntry.prototype.getObservers=CMenuEntry_getObservers;
CMenuEntry.prototype.setId=CMenuEntry_setId;
CMenuEntry.prototype.getId=CMenuEntry_getId;
CMenuEntry.prototype.onkeypress=CMenuEntry_onkeypress;
CMenuEntry.prototype.onkeydown=CMenuEntry_onkeydown;
CMenuEntry.prototype.getMenu=CMenuEntry_getMenu;
CMenuEntry.prototype.getMenuType=CMenuEntry_getMenuType;
CMenuEntry.prototype.setParent=CMenuEntry_setParent;
CMenuEntry.prototype.getParent=CMenuEntry_getParent;
CMenuEntry.prototype.setWebContentRoot=CMenuEntry_setWebContentRoot;
CMenuEntry.prototype.isEnabled=CMenuEntry_isEnabled;
CMenuEntry.prototype.isInMenu=CMenuEntry_isInMenu;
CMenuEntry.prototype.getAction=CMenuEntry_getAction;
CMenuEntry.prototype.setAction=CMenuEntry_setAction;
var theMenuCnt=1;
function CMenuItem(_1f6,_1f7,_1f8,_1f9,_1fa,_1fb,skin){
this.m_label=_1f7;
if(this.m_label){
this.m_label=this.m_label.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
this.setId(escape(_1f7)+theMenuCnt++);
this.m_bVisible=true;
this.setAction(_1f8);
this.setWebContentRoot(_1fb);
var _1fd=_1f9;
if((typeof gCognosViewer!="undefined")&&(gCognosViewer.envParams["isTitan"])&&(gCognosViewer.envParams["isTitan"]==true)){
_1fd="blankIcon";
}
this.m_icon=new CIcon(_1fd,"",this.m_webContentRoot);
this.setParent(_1f6);
this.m_style=_1fa;
this.m_observers=new CObserver(this);
if(typeof skin!="undefined"&&skin!=""){
this.m_sSkin=skin;
}else{
this.m_sSkin=(typeof getPromptSkin!="undefined"?getPromptSkin():this.m_webContentRoot+"/skins/corporate");
}
if(typeof this.m_parent=="object"&&typeof this.m_parent.add=="function"){
this.m_parent.add(this);
}
this.m_sDropDownArrow="dropdown_arrow_banner.gif";
};
CMenuItem.prototype=new CMenuEntry();
CMenuItem.prototype.setDropDownArrow=function(_1fe){
this.m_sDropDownArrow=_1fe;
};
CMenuItem.prototype.getDropDownArrow=function(){
return this.m_sDropDownArrow;
};
function CMenuItem_setId(id){
this.m_id=id;
};
function CMenuItem_setIcon(_200){
this.m_icon.setPath(_200);
};
function CMenuItem_setToolTip(_201){
this.m_icon.m_toolTip=_201;
};
function CMenuItem_getToolTip(){
return this.m_icon.m_toolTip;
};
function CMenuItem_setAltText(_202){
this.m_sAltText=_202;
};
function CMenuItem_getAltText(){
if(this.m_sAltText){
return this.m_sAltText;
}else{
return "";
}
};
function CMenuItem_genARIATags(){
var html="";
if(this.isInMenu()){
html+=" role=\"menuitem\" ";
}else{
html+=" role=\"button\" ";
}
if(this.m_menuType=="dropDown"||this.m_menuType=="cascaded"){
html+=" aria-haspopup=\"true\" ";
}
if(this.getAltText().length==0){
this.setAltText(this.m_label);
}
if((this.getAltText()&&this.getAltText().length>0)||(this.m_icon&&this.m_icon.getToolTip())){
html+=" aria-labelledby=\""+this.m_id+"label\" ";
}
if(!this.isEnabled()){
html+=" aria-disabled=\"true\" ";
}
return html;
};
function CMenuItem_genMenuItemAltText(){
var html="";
if((this.getAltText()&&this.getAltText().length>0)||(this.m_icon&&this.m_icon.getToolTip())){
html+="<div style=\"position: absolute; overflow: hidden; width: 0; height: 0;\" id=\""+this.m_id+"label\">";
if(this.getAltText()&&this.getAltText().length>0){
html+=this.getAltText();
}else{
html+=this.m_icon.getToolTip();
}
html+="</div>";
}
return html;
};
function CMenuItem_draw(){
var html="<div>";
var _206=false,_207=null,_208=null,_209=0;
if(this.m_menu==null||this.m_menuType=="dropDown"){
html+="<table ";
html+=this.genARIATags();
if(this.isInMenu()){
if(this.isEnabled()){
html+=" hideFocus=\"true\" ";
}
html+=" tabIndex=\"0\" ";
}else{
if(this.isEnabled()){
html+=" tabIndex=\"0\"";
}
}
html+=" width=\"100%\" ";
html+="class=\"";
if(typeof this.getStyle()=="object"){
if(this.isEnabled()){
html+=this.getStyle().getNormalState();
}else{
html+=this.getStyle().getDisabledState();
}
}
html+="\" id=\"";
html+=this.getId();
html+="\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:1px;\"><tr>";
_206=false;
if(this.m_icon.getPath()==""&&this.m_parent instanceof CMenu){
_207=this.m_parent.getNumItems();
for(_209=0;_209<_207;++_209){
_208=this.m_parent.get(_209);
if(typeof _208.getIcon=="function"&&_208.getIcon().getPath()){
_206=true;
break;
}
}
}
if(_206||this.m_icon.getPath()!=""){
var f="";
if(getViewerDirection()=="rtl"){
f=" float: right;";
}
html+="<td width=\"16\" style=\"padding-right: 2px; padding-left: 2px;"+f+"\">";
if(this.m_icon.getPath()!=""){
html+=this.m_icon.draw();
}else{
html+="<img alt=\"\" src=\""+this.m_webContentRoot+"/common/images/spacer.gif\" width=\"16\"/>";
}
html+="</td>";
}
if(getViewerDirection()=="rtl"){
html+="<td nowrap=\"nowrap\" align=\"right\">";
}else{
html+="<td nowrap=\"nowrap\" align=\"left\">";
}
html+=this.m_label;
html+=this.genMenuItemAltText();
html+="</td>";
if(this.m_menuType=="dropDown"){
html+="<td width=\"10%\" align=\"right\" style=\"padding-right: 3px;padding-left: 3px\">";
html+="<img alt=\"\" src=\""+this.m_sSkin;
if(this.getDropDownArrow()=="dropdown_arrow_banner.gif"){
html+="/shared/images/";
}else{
html+="/portal/images/";
}
html+=this.getDropDownArrow()+"\" WIDTH=\"7\" HEIGHT=\"16\" style=\"vertical-align:middle;\"/>";
html+="</td>";
}
html+="</tr></table></div>";
}else{
html+="<table";
html+=this.genARIATags();
if(this.isEnabled()||this.isInMenu()){
html+=" tabIndex=\"0\" hideFocus=\"true\"";
}
html+=" width=\"100%\" class=\"";
if(typeof this.getStyle()=="object"){
if(this.isEnabled()){
html+=this.getStyle().getNormalState();
}else{
html+=this.getStyle().getDisabledState();
}
}
html+="\" id=\"";
html+=this.getId();
html+="\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:1px;\"><tr>";
html+="<td";
_206=false;
if(this.m_icon.getPath()==""){
_207=this.m_parent.getNumItems();
for(_209=0;_209<_207;++_209){
_208=this.m_parent.get(_209);
if(typeof _208.getIcon=="function"&&_208.getIcon().getPath()){
_206=true;
break;
}
}
}
if(_206||this.m_icon.getPath()!=""){
html+=" width=\"16\" style=\"padding-right: 2px; padding-left: 2px;\">";
}else{
html+=" width=\"1\">";
}
html+=this.m_icon.draw();
html+="</td>";
if(getViewerDirection()=="rtl"){
html+="<td nowrap=\"nowrap\" align=\"right\">";
}else{
html+="<td nowrap=\"nowrap\" align=\"left\">";
}
html+=this.m_label;
html+=this.genMenuItemAltText();
html+="</td>";
if(getViewerDirection()=="rtl"){
html+="<td width=\"10%\" align=\"left\">";
html+="<img style=\"vertical-align:middle;\" alt=\"\" src=\""+this.m_sSkin+"/viewer/images/menu_expand_rtl.gif\" WIDTH=\"13\" HEIGHT=\"13\"/>";
}else{
html+="<td width=\"10%\" align=\"right\">";
html+="<img style=\"vertical-align:middle;\" alt=\"\" src=\""+this.m_sSkin+"/viewer/images/menu_expand.gif\" WIDTH=\"13\" HEIGHT=\"13\"/>";
}
html+="</td>";
html+="</tr></table>";
html+="</div>";
}
return html;
};
function CMenuItem_onmouseover(evt){
evt=(evt)?evt:((event)?event:null);
var _20c=null;
if(typeof this.menuItem!="undefined"){
_20c=this.menuItem;
}else{
if(this instanceof CMenuItem){
_20c=this;
}
}
if(_20c==null||!(_20c instanceof CMenuItem)||!_20c.isEnabled()){
return;
}
var menu=_20c.getMenu();
if(typeof _20c.getStyle()=="object"&&(menu!=null||typeof _20c.getIcon().getPath()!="undefined")){
this.className=_20c.getStyle().getRolloverState();
}
if(menu!=null){
var _20e=0;
var _20f=0;
if(typeof window.innerWidth!="undefined"){
_20e=window.innerWidth;
}else{
_20e=document.body.clientWidth;
}
if(typeof window.innerHeight!="undefined"){
_20f=window.innerHeight;
}else{
_20f=document.body.clientHeight;
}
if(_20c.getMenuType()=="cascaded"){
if(menu.isVisible()==false){
menu.setHTMLContainer(this.document?this.document.body:this.ownerDocument.body);
menu.draw();
menu.show();
}
}else{
if(_20c.getMenuType()=="dropDown"){
var _210=_20c.getParent();
var _211=_210.getNumItems();
for(var i=0;i<_211;++i){
var _213=_210.get(i);
if(_213!=_20c&&typeof _213.getMenu=="function"&&_213.getMenu()&&_213.getMenu().isVisible()){
menu.setHTMLContainer(this.document?this.document.body:this.ownerDocument.body);
menu.draw();
menu.show();
break;
}
}
}
}
}
if(_20c.getParent()!=null&&typeof _20c.getParent().onmouseover=="function"){
_20c.getParent().onmouseover(evt);
}
_20c.getObservers().notify(CMenuItem_onmouseover);
};
function CMenuItem_onfocus(evt){
evt=(evt)?evt:((event)?event:null);
var _215=null;
if(typeof this.menuItem!="undefined"){
_215=this.menuItem;
}else{
if(this instanceof CMenuItem){
_215=this;
}
}
if(_215==null||!(_215 instanceof CMenuItem)||!_215.isEnabled()){
return;
}
if(typeof _215.getStyle()=="object"){
this.className=_215.getStyle().getRolloverState();
}
if(_215.getParent()!=null&&typeof _215.getParent().onmouseover=="function"){
_215.getParent().onmouseover(evt);
}
_215.getObservers().notify(CMenuItem_onfocus);
};
function CMenuItem_onmouseout(evt){
evt=(evt)?evt:((event)?event:null);
var _217=null;
if(typeof this.menuItem!="undefined"){
_217=this.menuItem;
}else{
if(this instanceof CMenuItem){
_217=this;
}
}
if(_217==null||!(_217 instanceof CMenuItem)||!_217.isEnabled()){
return;
}
if(typeof _217.getStyle()=="object"){
this.className=_217.getStyle().getNormalState();
}
if(_217.getParent()!=null&&typeof _217.getParent().onmouseout=="function"){
_217.getParent().onmouseout(evt);
}
_217.getObservers().notify(CMenuItem_onmouseout);
};
function CMenuItem_onclick(evt){
evt=(evt)?evt:((event)?event:null);
if(evt!=null){
evt.cancelBubble=true;
}
return false;
};
function CMenuItem_onmouseup(evt){
evt=(evt)?evt:((event)?event:null);
var _21a=null;
if(typeof this.menuItem!="undefined"){
_21a=this.menuItem;
}else{
if(this instanceof CMenuItem){
_21a=this;
}
}
if(_21a!=null&&_21a instanceof CMenuItem){
if(!_21a.isEnabled()){
return;
}
if(_21a.getMenu()!=null){
if(_21a.getMenuType()=="cascaded"){
}else{
if(_21a.getMenuType()=="dropDown"){
var menu=_21a.getMenu();
if(menu.isVisible()==false){
if(!this.document&&!this.ownerDocument){
return;
}
menu.setHTMLContainer(this.document?this.document.body:this.ownerDocument.body);
menu.draw();
menu.show();
}else{
menu.remove();
}
}
}
}else{
eval(_21a.getAction());
}
if(typeof getReportFrame!="undefined"&&typeof getReportFrame().clearTextSelection!="undefined"){
getReportFrame().clearTextSelection();
}else{
if(typeof clearTextSelection!="undefined"){
clearTextSelection();
}
}
if(_21a.getMenuType()!="cascaded"){
if(_21a.getParent()!=null&&typeof _21a.getParent().onmouseup=="function"){
_21a.getParent().onmouseup(evt);
}
_21a.getObservers().notify(CMenuItem_onmouseup);
}
if(typeof this.menuItem!="undefined"&&_21a.getMenu()!=null&&_21a.getMenuType()=="cascaded"&&_21a.getAction()!=""){
eval(_21a.getAction());
}
}
if(evt!=null){
evt.cancelBubble=true;
}
return false;
};
function CMenuItem_onkeydown(evt){
var _21d=null;
if(typeof this.menuItem!="undefined"){
_21d=this.menuItem;
}else{
if(this instanceof CMenuItem){
_21d=this;
}
}
if(_21d==null||!(_21d instanceof CMenuItem)){
return;
}
return CMenuEntry_onkeydown.call(_21d,evt);
};
function CMenuItem_onkeypress(evt){
evt=(evt)?evt:((event)?event:null);
var _21f=null;
if(typeof this.menuItem!="undefined"){
_21f=this.menuItem;
}else{
if(this instanceof CMenuItem){
_21f=this;
}
}
if(_21f!=null&&_21f instanceof CMenuItem){
return CMenuEntry_onkeypress.call(_21f,evt);
}
};
function CMenuItem_createDropDownMenu(_220){
this.m_menu=new CMenu("dropDownMenu_"+this.getId(),_220,this.m_webContentRoot);
this.m_menu.setParent(this);
this.m_menuType="dropDown";
return this.m_menu;
};
function CMenuItem_createCascadedMenu(_221){
this.m_menu=new CMenu("cascadedMenu_"+this.getId(),_221,this.m_webContentRoot);
this.m_menu.setParent(this);
this.m_originalMenuType=this.m_menuType;
this.m_menuType="cascaded";
return this.m_menu;
};
function CMenuItem_clearCascadedMenu(){
if(this.m_menu){
this.m_menu.remove();
this.m_menu=null;
}
if(this.m_originalMenuType){
this.m_menuType=this.m_originalMenuType;
}
};
function CMenuItem_addOwnerDrawControl(_222,type){
this.m_menu=_222;
this.m_menuType=type;
if(typeof _222.setParent!="undefined"){
this.m_menu.setParent(this);
}
};
function CMenuItem_attachEvents(){
if(typeof this.getParent().getHTMLContainer!="function"){
return;
}
var _224=this.getParent().getHTMLContainer();
if(_224==null){
return;
}
var _225=eval(_224.document?_224.document.getElementById(this.getId()):_224.ownerDocument.getElementById(this.getId()));
if(_225==null){
return;
}
_225.onmouseover=this.onmouseover;
_225.onmouseout=this.onmouseout;
_225.onmouseup=this.onmouseup;
_225.onkeypress=this.onkeypress;
_225.onfocus=this.onfocus;
_225.onblur=this.onblur;
_225.onkeydown=this.onkeydown;
_225.onclick=this.onclick;
_225.menuItem=eval(this);
};
function CMenuItem_remove(){
};
function CMenuItem_getStyle(){
return this.m_style;
};
function CMenuItem_setStyle(_226){
this.m_style=_226;
};
function CMenuItem_hide(){
this.m_bVisible=false;
};
function CMenuItem_show(){
this.m_bVisible=true;
};
function CMenuItem_enable(){
if(typeof this.getStyle()=="object"){
if(typeof this.getParent().getHTMLContainer=="function"){
var _227=this.getParent().getHTMLContainer();
if(_227!=null){
var _228=_227.document?_227.document.getElementById(this.getId()):_227.ownerDocument.getElementById(this.getId());
if(_228!=null){
_228.className=this.getStyle().getNormalState();
}
}
}
this.m_bEnabled=true;
this.getIcon().enable();
this.updateHTML();
}
};
function CMenuItem_updateHTML(){
if(typeof this.getStyle()=="object"){
if(typeof this.getParent().getHTMLContainer=="function"){
var _229=this.getParent().getHTMLContainer();
if(_229!=null){
var _22a=_229.document?_229.document.getElementById(this.getId()):_229.ownerDocument.getElementById(this.getId());
if(_22a!=null){
var _22b=_22a.getElementsByTagName("img");
if(typeof _22b!="undefined"){
if(this.getIcon()){
if(this.getIcon().isEnabled()){
_22b[0].src=this.getIcon().getPath();
}else{
_22b[0].src=this.getIcon().getDisabledImagePath();
}
}
if(this.getToolTip()){
_22a.title=this.getToolTip();
_22b[0].title=this.getToolTip();
}
}
if(this.isEnabled()){
if(_22a.getAttribute("aria-disabled")){
_22a.removeAttribute("aria-disabled");
}
}else{
_22a.setAttribute("aria-disabled","true");
}
var _22c;
if(this.getStyle().getActiveState()!=this.getStyle().getDisabledState()){
_22a.tabIndex=0;
if(this.getMenu()!=null&&!this.m_bHideDropDown&&_22a.nextSibling){
_22a.nextSibling.tabIndex=0;
_22a.nextSibling.title=this.getToolTip();
_22c=_22a.nextSibling.getElementsByTagName("img");
if(_22c!=null){
_22c[0].title=this.getToolTip();
}
}
}else{
if(_22a.tabIndex!="undefined"){
_22a.removeAttribute("tabIndex");
if(this.getMenu()!=null){
_22a.nextSibling.removeAttribute("tabIndex");
_22a.nextSibling.title=this.getToolTip();
_22c=_22a.nextSibling.getElementsByTagName("img");
if(_22c!=null){
_22c[0].title=this.getToolTip();
}
}
}
}
_22a.className=this.getStyle().getActiveState();
}
}
}
}
};
function CMenuItem_disable(){
if(typeof this.getStyle()=="object"){
if(typeof this.getParent().getHTMLContainer=="function"){
var _22d=this.getParent().getHTMLContainer();
if(_22d!=null){
var _22e=_22d.document?_22d.document.getElementById(this.getId()):_22d.ownerDocument.getElementById(this.getId());
if(_22e!=null){
_22e.className=this.getStyle().getDisabledState();
}
}
}
this.m_bEnabled=false;
this.getIcon().disable();
this.updateHTML();
}
};
function CMenuItem_isVisible(){
return this.m_bVisible;
};
function CMenuItem_getIcon(){
return this.m_icon;
};
function CMenuItem_getLabel(){
return this.m_label;
};
function CMenuItem_setFocus(){
var e=document.getElementById(this.m_id);
if(e){
e.focus();
return true;
}
return false;
};
CMenuItem.prototype.draw=CMenuItem_draw;
CMenuItem.prototype.onmouseover=CMenuItem_onmouseover;
CMenuItem.prototype.onmouseout=CMenuItem_onmouseout;
CMenuItem.prototype.onmouseup=CMenuItem_onmouseup;
CMenuItem.prototype.onkeypress=CMenuItem_onkeypress;
CMenuItem.prototype.onkeydown=CMenuItem_onkeydown;
CMenuItem.prototype.onfocus=CMenuItem_onfocus;
CMenuItem.prototype.onblur=CMenuItem_onmouseout;
CMenuItem.prototype.onclick=CMenuItem_onclick;
CMenuItem.prototype.attachEvents=CMenuItem_attachEvents;
CMenuItem.prototype.remove=CMenuItem_remove;
CMenuItem.prototype.setStyle=CMenuItem_setStyle;
CMenuItem.prototype.getStyle=CMenuItem_getStyle;
CMenuItem.prototype.createDropDownMenu=CMenuItem_createDropDownMenu;
CMenuItem.prototype.createCascadedMenu=CMenuItem_createCascadedMenu;
CMenuItem.prototype.clearCascadedMenu=CMenuItem_clearCascadedMenu;
CMenuItem.prototype.addOwnerDrawControl=CMenuItem_addOwnerDrawControl;
CMenuItem.prototype.isVisible=CMenuItem_isVisible;
CMenuItem.prototype.hide=CMenuItem_hide;
CMenuItem.prototype.show=CMenuItem_show;
CMenuItem.prototype.enable=CMenuItem_enable;
CMenuItem.prototype.disable=CMenuItem_disable;
CMenuItem.prototype.getIcon=CMenuItem_getIcon;
CMenuItem.prototype.setIcon=CMenuItem_setIcon;
CMenuItem.prototype.getLabel=CMenuItem_getLabel;
CMenuItem.prototype.setFocus=CMenuItem_setFocus;
CMenuItem.prototype.setToolTip=CMenuItem_setToolTip;
CMenuItem.prototype.getToolTip=CMenuItem_getToolTip;
CMenuItem.prototype.updateHTML=CMenuItem_updateHTML;
CMenuItem.prototype.update=new Function("return true");
CMenuItem.prototype.genARIATags=CMenuItem_genARIATags;
CMenuItem.prototype.setAltText=CMenuItem_setAltText;
CMenuItem.prototype.getAltText=CMenuItem_getAltText;
CMenuItem.prototype.genMenuItemAltText=CMenuItem_genMenuItemAltText;
function CSeperator(type,size,_232,_233){
this.m_type=type;
this.m_size=size;
this.m_bVisible=true;
if(_232!==null&&typeof _232=="object"){
this.m_style=new CUIStyle(_232.getNormalState(),_232.getRolloverState(),_232.getDepressedState(),_232.getDepressedRolloverState(),_232.getDisabledState());
}else{
this.m_style=new CUIStyle("","","","","");
}
if(typeof _233!="undefined"&&_233!=""){
this.m_webContentRoot=_233;
}else{
this.m_webContentRoot="..";
}
this.m_toolbarSeperatorClass="bannerDivider";
};
CSeperator.prototype.setToolbarSeperatorClass=function(_234){
this.m_toolbarSeperatorClass=_234;
};
CSeperator.prototype.getToolbarSeperatorClass=function(){
return this.m_toolbarSeperatorClass;
};
CSeperator.prototype.setWebContentRoot=function(_235){
this.m_webContentRoot=_235;
};
function CSeperator_draw(){
if(this.m_style==""){
return;
}
var html="";
switch(this.m_type){
case "horizonal_blank":
html+="<td style=\"padding:0px;\"><img border=\"0\" alt=\"\" src=\""+this.m_webContentRoot+"/common/images/spacer.gif\" height=\"1\" width=\"";
html+=this.m_size;
html+="\"/></td>";
break;
case "horizontal_line":
html+="<div class=\""+this.getStyle().getActiveState()+"\"></div>";
break;
case "vertical_blank":
html+="<tr>";
html+="<td style=\"padding:0px;\"><img border=\"0\" alt=\"\" src=\""+this.m_webContentRoot+"/common/images/spacer.gif\" width=\"1\" height=\"";
html+=this.m_size;
html+="\"/></td></tr>";
break;
case "vertical_line":
html+="<td class=\"toolbarVerticalSeperator\"><div class=\""+this.getToolbarSeperatorClass()+"\"/></td>";
break;
}
return html;
};
function CSeperator_getSize(){
return this.m_size;
};
function CSeperator_setSize(size){
this.m_size=size;
};
function CSeperator_setStyle(_238){
this.m_style=_238;
};
function CSeperator_getStyle(){
return this.m_style;
};
function CSeperator_setType(type){
this.m_type=type;
};
function CSeperator_getType(){
return this.m_type;
};
function CSeperator_hide(){
this.m_bVisible=false;
};
function CSeperator_show(){
this.m_bVisible=true;
};
function CSeperator_isVisible(){
return this.m_bVisible;
};
CSeperator.prototype.draw=CSeperator_draw;
CSeperator.prototype.setSize=CSeperator_setSize;
CSeperator.prototype.getSize=CSeperator_getSize;
CSeperator.prototype.setStyle=CSeperator_setStyle;
CSeperator.prototype.getStyle=CSeperator_getStyle;
CSeperator.prototype.getType=CSeperator_getType;
CSeperator.prototype.setType=CSeperator_setType;
CSeperator.prototype.isVisible=CSeperator_isVisible;
CSeperator.prototype.show=CSeperator_show;
CSeperator.prototype.hide=CSeperator_hide;
function CInfoPanel(size,_23b,id){
this.m_size=size;
this.m_bVisible=true;
this.m_properties=[];
this.setId(id);
this.m_observers=new CObserver(this);
this.setWebContentRoot(_23b);
};
CInfoPanel.prototype=new CMenuEntry();
CInfoPanel.prototype.setWebContentRoot=function(_23d){
this.m_webContentRoot=_23d;
};
function CInfoPanel_addCheckedProperty(name,_23f){
var o={"name":name,"value":_23f,"type":"checkBox","spacer":false};
this.m_properties[this.m_properties.length]=o;
};
function CInfoPanel_addProperty(name,_242){
var o={"name":name,"value":_242,"spacer":false};
this.m_properties[this.m_properties.length]=o;
};
function CInfoPanel_addSpacer(_244){
var o={"spacer":true,"height":_244};
this.m_properties[this.m_properties.length]=o;
};
function CInfoPanel_draw(){
var i=0;
var html="<table CELLPADDING=\"0\" CELLSPACING=\"0\" role=\"presentation\">";
if(this.m_properties.length>0){
var _248="<tr><td>";
var _249="";
for(i=0;i<this.m_properties.length;i++){
if(this.m_properties[i].spacer){
}else{
if(this.m_properties[i].type!=null&&this.m_properties[i].type=="checkBox"){
_248+="<tr><td><span><span class=\"formText\">";
if(this.m_properties[i].value=="true"){
_248+="<input type=\"checkbox\" disabled=\"true\" checked>";
}else{
_248+="<input type=\"checkbox\" disabled=\"true\">";
}
_248+=this.m_properties[i].name;
_248+="</span>&nbsp;</input>";
_248+="<span></td></tr>";
}else{
_248+="<tr><td><span><span class=\"menuItem_normal\" style=\"font-weight:bold\">";
_248+=this.m_properties[i].name;
_248+="</span>&nbsp;<span class=\"menuItem_normal\">";
_248+=this.m_properties[i].value;
_248+="</span></span></td></tr>";
}
_249+=this.m_properties[i].name+" "+this.m_properties[i].value+", ";
}
}
var id=this.getId()?"id=\""+this.getId()+"\" ":"";
var _24b="<table summary=\""+_249+"\" role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" "+id+" tabindex=\"0\" style=\"margin-bottom:1px;";
if(typeof this.m_size!="undefined"&&this.m_size!=""){
_24b+="width:"+this.m_size;
}
_24b+="\"\t>";
html+=_24b+_248+"</table></td></tr>";
}
html+="</table>";
return html;
};
function CInfoPanel_getSize(){
return this.m_size;
};
function CInfoPanel_setSize(size){
this.m_size=size;
};
function CInfoPanel_hide(){
this.m_bVisible=false;
};
function CInfoPanel_show(){
this.m_bVisible=true;
};
function CInfoPanel_isVisible(){
return this.m_bVisible;
};
function CInfoPanel_isEnabled(){
return true;
};
function CInfoPanel_onkeydown(evt){
var _24e=null;
if(typeof this.infoPanel!="undefined"){
_24e=this.infoPanel;
}else{
if(this instanceof CInfoPanel){
_24e=this;
}
}
if(_24e==null||!(_24e instanceof CInfoPanel)){
return;
}
return CMenuEntry_onkeydown.call(_24e,evt);
};
function CInfoPanel_onkeypress(evt){
evt=(evt)?evt:((event)?event:null);
var _250=null;
if(typeof this.infoPanel!="undefined"){
_250=this.infoPanel;
}else{
if(this instanceof CInfoPanel){
_250=this;
}
}
if(_250!=null&&_250 instanceof CInfoPanel){
return CMenuEntry_onkeypress.call(_250,evt);
}
};
function CInfoPanel_setFocus(){
if(this.getId()){
document.getElementById(this.getId()).focus();
}
};
function CInfoPanel_attachEvents(){
if(typeof this.getParent().getHTMLContainer!="function"){
return;
}
var _251=this.getParent().getHTMLContainer();
if(_251==null){
return;
}
var _252=eval(_251.document?_251.document.getElementById(this.getId()):_251.ownerDocument.getElementById(this.getId()));
if(_252==null){
return;
}
_252.onkeypress=this.onkeypress;
_252.onkeydown=this.onkeydown;
_252.infoPanel=eval(this);
};
CInfoPanel.prototype.draw=CInfoPanel_draw;
CInfoPanel.prototype.onkeypress=CInfoPanel_onkeypress;
CInfoPanel.prototype.onkeydown=CInfoPanel_onkeydown;
CInfoPanel.prototype.addProperty=CInfoPanel_addProperty;
CInfoPanel.prototype.addCheckedProperty=CInfoPanel_addCheckedProperty;
CInfoPanel.prototype.addSpacer=CInfoPanel_addSpacer;
CInfoPanel.prototype.setSize=CInfoPanel_setSize;
CInfoPanel.prototype.getSize=CInfoPanel_getSize;
CInfoPanel.prototype.isVisible=CInfoPanel_isVisible;
CInfoPanel.prototype.show=CInfoPanel_show;
CInfoPanel.prototype.hide=CInfoPanel_hide;
CInfoPanel.prototype.isEnabled=CInfoPanel_isEnabled;
CInfoPanel.prototype.setFocus=CInfoPanel_setFocus;
CInfoPanel.prototype.attachEvents=CInfoPanel_attachEvents;
var g_ownerDocument=null;
function CMenu(id,_254,_255){
this.m_htmlContainer=document.body;
this.m_bVisible=false;
this.m_id=id;
this.m_htmlDivElement=null;
this.m_parent=null;
this.m_menuItems=[];
this.m_style=_254;
this.m_callback=null;
this.m_observers=new CObserver(this);
this.m_bForceCallback=false;
this.m_loadingMenuItem=false;
this.m_oCV=null;
if(typeof _255!="undefined"&&_255!=""){
this.m_webContentRoot=_255;
}else{
this.m_webContentRoot="..";
}
};
function CMenu_setHTMLContainer(_256){
this.m_htmlContainer=_256;
g_ownerDocument=this.m_htmlContainer.document?this.m_htmlContainer.document:this.m_htmlContainer.ownerDocument;
};
function CMenu_getHTMLContainer(){
return this.m_htmlContainer;
};
function CMenu_setParent(_257){
this.m_parent=_257;
};
function CMenu_getParent(){
return this.m_parent;
};
function CMenu_getId(){
return this.m_id;
};
function CMenu_getHTMLDiv(){
return this.m_htmlDivElement;
};
function CMenu_create(){
var _258=this.m_htmlContainer.document?this.m_htmlContainer.document.createElement("div"):this.m_htmlContainer.ownerDocument.createElement("div");
if(typeof this.getStyle()=="object"){
_258.className=this.getStyle().getNormalState();
}
_258.style.display="none";
_258.style.visibility="hidden";
_258.style.position="absolute";
_258.style.left="0px";
_258.style.top="0px";
_258.id=this.m_id;
_258.setAttribute("role","region");
if(window.RV_RES){
_258.setAttribute("aria-label",RV_RES.IDS_JS_A11Y_DYNAMIC_MENU);
}
this.m_htmlContainer.appendChild(_258);
this.m_htmlDivElement=_258;
};
function CMenu_setAltText(_259){
this.m_altText=_259;
};
function CMenu_getAltText(){
if(this.m_altText){
return this.m_altText;
}else{
return "";
}
};
function CMenu_genARIATags(){
var html=" role=\"menu\"";
if(this.getAltText()&&this.getAltText().length>0){
html+=" aria-labelledby=\""+this.m_id+"label\" ";
}else{
if(window.RV_RES){
html+=" aria-label=\""+RV_RES.IDS_JS_A11Y_DYNAMIC_MENU+"\" ";
}
}
return html;
};
function CMenu_genMenuAltText(){
var html="";
if(this.getAltText()&&this.getAltText().length>0){
html+="<tr><td><div style=\"position: absolute; overflow: hidden; width: 0; height: 0;\" id=\""+this.m_id+"label\">"+this.getAltText()+"</div></td></tr>";
}
return html;
};
function CMenu_draw(){
if(this.m_htmlContainer==null){
return;
}
if(this.m_htmlDivElement==null){
this.create();
}
var html="";
if(this.m_menuItems.length==0||this.m_bForceCallback==true){
this.setForceCallback(false);
if(this.m_callback!=null){
this.setLoadingMenuItem(true);
var menu=this;
var _25e=function(){
if(menu&&menu.executeCallback){
menu.executeCallback();
}
};
setTimeout(_25e,1000);
html="<table class=\"menuItem_normal\" CELLPADDING=\"0\" CELLSPACING=\"0\" tabindex=\"0\" hidefocus=\"true\"";
html+=this.genARIATags();
html+=">";
html+=this.genMenuAltText();
html+="<tr>";
var _25f="";
if(this.m_oCV&&RV_RES.GOTO_LOADING){
_25f=RV_RES.GOTO_LOADING;
}else{
if(typeof gUIFrameWorkMenuLoadingMessage!="undefined"){
_25f=gUIFrameWorkMenuLoadingMessage;
}else{
_25f="...";
}
}
html+="<td>";
html+="<img style=\"vertical-align:middle;\" alt=\""+_25f+"\" width=\"16\" height=\"16\" src=\""+this.m_webContentRoot+"/common/images/tv_loading.gif\"/>";
html+="</td>";
html+="<td nowrap=\"nowrap\" align=\"left\">";
html+=_25f;
html+="</td>";
html+="</tr>";
html+="</table>";
}
}else{
this.setLoadingMenuItem(false);
var i=0;
html="<table CELLPADDING=\"0\" CELLSPACING=\"0\" tabindex=\"0\" style=\"outline: none;\" hidefocus=\"true\"";
html+=this.genARIATags();
html+=">";
html+=this.genMenuAltText();
var _261=false;
for(i=0;i<this.m_menuItems.length;i++){
if(this.m_menuItems[i].isVisible()){
_261=true;
html+="<tr><td>";
html+=this.m_menuItems[i].draw();
html+="</td></tr>";
}
}
if(!_261){
this.remove();
return;
}
html+="</table>";
}
try{
this.m_htmlDivElement.innerHTML=html;
this.attachEvents();
}
catch(e){
}
this.updateCoords();
var _262="uiFrameworkHiddenIframe"+this.m_id;
var _263=((!isIE())&&(document.getElementById))?true:false;
setTimeout("updateIframeCoords(\""+_262+"\", \""+this.m_htmlDivElement.id+"\", "+_263+")",50);
if((typeof gCognosViewer!="undefined")&&(gCognosViewer.envParams["cv.responseFormat"])&&(gCognosViewer.envParams["cv.responseFormat"]=="fragment")){
AdjustPortalFont(this.m_htmlDivElement);
}
};
function CMenu_setLoadingMenuItem(_264){
this.m_loadingMenuItem=_264;
};
function CMenu_getLoadingMenuItem(){
return this.m_loadingMenuItem;
};
function CMenu_getScrollingPosition(){
var _265={"x":0,"y":0};
if(typeof window.pageYOffset!="undefined"){
_265={"x":window.pageXOffset,"y":window.pageYOffset};
}else{
if((typeof document.documentElement.scrollTop!="undefined")&&(document.documentElement.scrollTop>0||typeof document.body.scrollTop=="undefined"||document.body.scrollTop==document.documentElement.scrollTop)){
_265={"x":document.documentElement.scrollLeft,"y":document.documentElement.scrollTop};
}else{
if(typeof document.body.scrollTop!="undefined"){
_265={"x":document.body.scrollLeft,"y":document.body.scrollTop};
}
}
}
return _265;
};
function AdjustPortalFont(div){
var _267=fragments;
if(_267){
div.className+=" PortalFontFix";
var _268=null;
for(var frag in _267){
if(frag.indexOf("rvCanvas")>-1){
_268=$(_267[frag].div);
if(_268!=null){
break;
}
}
}
if(_268!=null){
div.style.fontSize=xGetComputedStyle(_268,"font-size");
}
}
};
function CMenu_updateCoords(){
var _26a=this.getParent();
var mnu=this.m_htmlDivElement;
if(mnu!=null){
var _26c=this.m_htmlContainer.document?this.m_htmlContainer.document:this.m_htmlContainer.ownerDocument;
var _26d=mnu.style.visibility;
var _26e=mnu.style.display;
mnu.style.visibility="hidden";
mnu.style.display="block";
if(mnu.firstChild!=null){
mnu.style.width=mnu.firstChild.offsetWidth;
}
var x=0,y=0;
var db=mnu.parentNode;
var _272=db.clientWidth;
var _273=db.clientHeight;
var _274=CMenu_getScrollingPosition();
var _275=_274.x;
var _276=_274.y;
if(_26a==null){
x=mnu.style.left;
y=mnu.style.top;
if(x.substr(x.length-2,2)=="px"){
x=parseInt(x.substring(0,x.length-2),10);
y=parseInt(y.substring(0,y.length-2),10);
}
if(y+mnu.offsetHeight>=(_273)){
if(y-mnu.offsetHeight>0){
y=y+_276-mnu.offsetHeight;
}else{
y=Math.max(_273-mnu.offsetHeight,0);
}
}else{
y=y+_276;
}
if(x+mnu.offsetWidth>=(_272)){
if(x-mnu.offsetWidth>0){
x=x+_275-mnu.offsetWidth;
}else{
x=Math.max(_272-mnu.offsetWidth,0);
}
}else{
x=x+_275;
}
}else{
if(!(_26a instanceof CToolbarButton)&&!(_26a instanceof CMenuItem)){
return;
}
if(typeof _26a.getMenuType!="function"){
return;
}
var _277=_26c.getElementById(this.getParent().getId());
var _278=_26c.getElementById("menu"+this.getParent().getId());
if(_277==null){
return;
}
var _279=_277;
if(_26a.getMenuType()=="dropDown"){
x=0;
y=_277.offsetHeight;
while(_279!=null){
x+=_279.offsetLeft;
y+=_279.offsetTop;
_279=_279.offsetParent;
}
if(getViewerDirection()=="rtl"){
var _27a=x-(mnu.offsetWidth-_277.offsetWidth);
if(_27a>_275){
x=_27a;
}
}
if((typeof gCognosViewer!="undefined")&&(gCognosViewer.envParams["cv.responseFormat"])&&(gCognosViewer.envParams["cv.responseFormat"]=="fragment")){
var _27b=_277;
while((_27b!=document.body)&&(_27b=_27b.parentNode)){
x-=_27b.scrollLeft||0;
y-=_27b.scrolltop||0;
}
}
if((x+mnu.offsetWidth)>(_272+_275)){
x=x+_277.offsetWidth-mnu.offsetWidth;
if(_278!=null){
x=x+_278.offsetWidth;
}
}
if(((y+mnu.offsetHeight)>(_273+_276))&&(y-(mnu.offsetHeight+_277.clientHeight)>=0)){
y-=(mnu.offsetHeight+_277.clientHeight);
}
}else{
if(_26a.getMenuType()=="cascaded"){
x=_277.offsetWidth;
while(_279!=null){
x+=_279.offsetLeft;
y+=_279.offsetTop;
_279=_279.offsetParent;
}
if(getViewerDirection()=="rtl"){
var _27a=x-(mnu.offsetWidth+_277.offsetWidth);
if(_27a>_275){
x=_27a;
}
}
if((x+mnu.offsetWidth)>(_272+_275)){
x-=(_277.offsetWidth+mnu.offsetWidth);
}
if((y+mnu.offsetHeight)>(_273+_276)){
y-=(mnu.offsetHeight-_277.clientHeight);
}
}
}
}
mnu.style.visibility=_26d;
mnu.style.display=_26e;
this.setXCoord(x);
this.setYCoord(y);
this.setZIndex(500);
}
};
function CMenu_add(_27c){
if(typeof _27c.getObservers=="function"&&typeof _27c.getObservers()=="object"){
_27c.getObservers().attach(this,this.closeSubMenus,_27c.onmouseover);
_27c.getObservers().attach(this,this.closeAllMenus,_27c.onmouseup);
_27c.getObservers().attach(this,this.closeSubMenus,_27c.onfocus);
_27c.getObservers().attach(this,this.closeAllMenus,_27c.onkeypress);
}
this.m_menuItems[this.m_menuItems.length]=_27c;
};
function CMenu_get(_27d){
if(_27d>=0&&_27d<this.getNumItems()){
return this.m_menuItems[_27d];
}
return null;
};
CMenu.prototype.getItem=function(_27e){
var sId=_27e;
if(this.m_oCV){
sId=this.m_oCV.getId()+_27e;
}
for(var _280=0;_280<this.getNumItems();_280++){
var _281=this.get(_280);
if(typeof _281.getId=="function"&&_281.getId()==sId){
return _281;
}
}
};
function CMenu_getNumItems(){
return this.m_menuItems.length;
};
function CMenu_hide(){
this.hideHiddenIframe();
if(this.m_htmlDivElement!=null){
this.m_htmlDivElement.style.visibility="hidden";
}
this.m_bVisible=false;
var _282=this.getParent();
if(_282!=null&&typeof _282.setFocus=="function"){
_282.setFocus();
}else{
if(_282!=null&&typeof _282.focus=="function"){
_282.focus();
}else{
if(typeof this.m_focusCell=="object"&&typeof this.m_focusCell.focus=="function"){
this.m_focusCell.focus();
}
}
}
};
function CMenu_setFocus(){
try{
var _283=null;
for(var _284=0;_284<this.getNumItems()&&!_283;_284++){
var _285=this.get(_284);
if(_285.isVisible&&_285.isVisible()){
_283=_285;
}
}
if(!_283||!_283.setFocus()){
this.m_htmlDivElement.childNodes[0].focus();
}
}
catch(e){
}
};
function CMenu_show(){
if(this.m_htmlDivElement!=null){
this.m_bVisible=true;
this.updateCoords();
var _286=((!isIE())&&(document.getElementById))?true:false;
var _287="uiFrameworkHiddenIframe"+this.m_id;
var _288=this.m_htmlContainer.document?this.m_htmlContainer.document.getElementById(_287):this.m_htmlContainer.ownerDocument.getElementById(_287);
if(_288==null){
_288=this.createHiddenIFrame(_287);
}
if(_288){
_288.style.display="block";
_288.style.left="0px";
_288.style.top="0px";
updateIframeCoords(_287,this.m_htmlDivElement.id,_286);
setTimeout("updateIframeCoords(\""+_287+"\", \""+this.m_htmlDivElement.id+"\", "+_286+")",50);
}
this.m_htmlDivElement.style.display="block";
this.m_htmlDivElement.style.visibility="visible";
this.setFocus();
if(!window.isIOS()){
var _289=this;
if(window.attachEvent){
window.attachEvent("onresize",function(){
_289.remove();
});
window.attachEvent("onscroll",function(){
_289.remove();
});
}else{
window.addEventListener("resize",function(){
_289.remove();
},false);
window.addEventListener("scroll",function(){
_289.remove();
},false);
}
var _28a=null;
if(this.m_oCV!=null){
_28a=document.getElementById(this.m_oCV.getId()+"content");
}
if(_28a){
if(_28a.parentNode.parentNode.attachEvent){
_28a.parentNode.parentNode.attachEvent("onscroll",function(){
_289.remove();
});
}else{
_28a.parentNode.parentNode.addEventListener("scroll",function(){
_289.remove();
},false);
}
}
}
}
};
function CMenu_createHiddenIFrame(_28b){
var _28c=this.getHTMLContainer();
var _28d=_28c.document?_28c.document.createElement("iframe"):_28c.ownerDocument.createElement("iframe");
_28d.setAttribute("id",_28b);
_28d.setAttribute("src",this.m_webContentRoot+"/common/images/spacer.gif");
_28d.setAttribute("scrolling","no");
_28d.setAttribute("frameborder","0");
_28d.style.position="absolute";
_28d.style.minWidth="0px";
_28d.style.minHeight="0px";
_28d.style.left="0px";
_28d.style.top="0px";
_28d.style.zIndex=499;
_28d.style.display="none";
_28d.setAttribute("title","Empty frame");
_28d.setAttribute("role","presentation");
_28c.appendChild(_28d);
return _28d;
};
function CMenu_isVisible(){
return this.m_bVisible;
};
function CMenu_remove(){
this.removeHiddenIframe();
for(var i=0;i<this.getNumItems();++i){
var _28f=this.get(i);
if(typeof _28f.getMenu=="function"&&_28f.getMenu()!=null){
_28f.getMenu().remove();
}
}
if(this.m_htmlContainer!=null&&this.m_htmlDivElement!=null){
this.m_htmlContainer.removeChild(this.m_htmlDivElement);
}
this.m_htmlDivElement=null;
this.m_bVisible=false;
};
function CMenu_removeHiddenIframe(){
try{
if(g_ownerDocument){
var _290=g_ownerDocument.getElementById("uiFrameworkHiddenIframe"+this.m_id);
if(_290!=null){
_290.style.display="none";
if(_290.parentNode&&_290.parentNode.removeChild){
_290.parentNode.removeChild(_290);
}
}
}
}
catch(e){
}
};
function CMenu_hideHiddenIframe(){
try{
if(g_ownerDocument){
var _291=g_ownerDocument.getElementById("uiFrameworkHiddenIframe"+this.m_id);
if(_291){
_291.style.display="none";
}
}
}
catch(e){
}
};
function CMenu_enable(){
};
function CMenu_disable(){
};
function CMenu_getState(){
};
function CMenu_clear(){
if(this.m_htmlDivElement!=null){
this.m_htmlDivElement.innerHTML="";
}
this.m_menuItems.splice(0,this.m_menuItems.length);
};
function CMenu_attachEvents(){
for(var i=0;i<this.m_menuItems.length;i++){
if(typeof this.m_menuItems[i].attachEvents=="function"){
this.m_menuItems[i].attachEvents();
}
}
this.m_htmlDivElement.onkeypress=this.onkeypress;
this.m_htmlDivElement.tbMenu=eval(this);
};
function CMenu_closeSubMenus(_293){
for(var i=0;i<this.m_menuItems.length;i++){
var _295=this.m_menuItems[i];
var _296=_293.getSubject();
if(_295!=_296&&typeof _295.getMenu=="function"&&_295.getMenu()!=null&&_295.getMenu().isVisible()){
_295.getMenu().remove();
}
}
};
function CMenu_closeAllMenus(_297){
var _298=this;
var _299=null;
while(_298){
if(_298 instanceof CMenu){
_299=_298;
}
_298=_298.getParent();
}
if(_299!=null){
_299.remove();
}
};
function CMenu_setStyle(_29a){
this.m_style=_29a;
};
function CMenu_getStyle(){
return this.m_style;
};
function CMenu_setXCoord(x){
var _29c=this.getHTMLDiv();
if(_29c!=null){
_29c.style.left=x+"px";
}
};
function CMenu_setYCoord(y){
var _29e=this.getHTMLDiv();
if(_29e!=null){
_29e.style.top=y+"px";
}
};
function CMenu_setZIndex(_29f){
var _2a0=this.getHTMLDiv();
if(_2a0!=null){
_2a0.style.zIndex=_29f;
}
};
function CMenu_registerCallback(_2a1){
this.m_callback=_2a1;
};
function CMenu_executeCallback(){
if(typeof this.m_callback=="function"){
this.m_callback();
}else{
if(typeof this.m_callback=="string"){
eval(this.m_callback);
}
}
};
function CMenu_getObservers(){
return this.m_observers;
};
function CMenu_onmouseover(evt){
evt=(evt)?evt:((event)?event:null);
if(this.getParent()!=null&&typeof this.getParent().onmouseover=="function"){
this.getParent().onmouseover(evt);
}
this.getObservers().notify(CMenu_onmouseover);
};
function CMenu_onmouseout(evt){
evt=(evt)?evt:((event)?event:null);
if(this.getParent()!=null&&typeof this.getParent().onmouseout=="function"){
this.getParent().onmouseout(evt);
}
this.getObservers().notify(CMenu_onmouseout);
};
function CMenu_onmouseup(evt){
evt=(evt)?evt:((event)?event:null);
if(this.getParent()!=null&&typeof this.getParent().onmouseup=="function"){
this.getParent().onmouseup(evt);
}
this.getObservers().notify(CMenu_onmouseup);
};
function CMenu_onkeypress(evt){
evt=(evt)?evt:((event)?event:null);
var menu=this.tbMenu;
if(typeof menu=="object"){
if(evt.keyCode==40){
var _2a7=false;
for(var i=0;i<menu.m_menuItems.length;i++){
var _2a9=menu.m_menuItems[i];
if(typeof _2a9.isVisible=="function"&&_2a9.isVisible()&&typeof _2a9.setFocus=="function"){
_2a9.setFocus();
_2a7=true;
break;
}
}
if(!_2a7){
menu.hide();
}
}
if(evt.keyCode==38){
menu.hide();
}
}
if(typeof this.getParent=="function"&&this.getParent()!=null&&typeof this.getParent().onkeypress=="function"){
this.getParent().onkeypress(evt);
}
if(typeof this.getObservers=="function"){
this.getObservers().notify(CMenu_onkeypress);
}
};
function CMenu_getForceCallback(){
return this.m_bForceCallback;
};
function CMenu_setForceCallback(_2aa){
this.m_bForceCallback=_2aa;
};
CMenu.prototype.draw=CMenu_draw;
CMenu.prototype.updateCoords=CMenu_updateCoords;
CMenu.prototype.add=CMenu_add;
CMenu.prototype.get=CMenu_get;
CMenu.prototype.getNumItems=CMenu_getNumItems;
CMenu.prototype.hide=CMenu_hide;
CMenu.prototype.hideHiddenIframe=CMenu_hideHiddenIframe;
CMenu.prototype.removeHiddenIframe=CMenu_removeHiddenIframe;
CMenu.prototype.show=CMenu_show;
CMenu.prototype.enable=CMenu_enable;
CMenu.prototype.disable=CMenu_disable;
CMenu.prototype.getState=CMenu_getState;
CMenu.prototype.clear=CMenu_clear;
CMenu.prototype.attachEvents=CMenu_attachEvents;
CMenu.prototype.setParent=CMenu_setParent;
CMenu.prototype.getParent=CMenu_getParent;
CMenu.prototype.getHTMLContainer=CMenu_getHTMLContainer;
CMenu.prototype.setHTMLContainer=CMenu_setHTMLContainer;
CMenu.prototype.getHTMLDiv=CMenu_getHTMLDiv;
CMenu.prototype.create=CMenu_create;
CMenu.prototype.remove=CMenu_remove;
CMenu.prototype.getId=CMenu_getId;
CMenu.prototype.isVisible=CMenu_isVisible;
CMenu.prototype.setStyle=CMenu_setStyle;
CMenu.prototype.getStyle=CMenu_getStyle;
CMenu.prototype.closeSubMenus=CMenu_closeSubMenus;
CMenu.prototype.closeAllMenus=CMenu_closeAllMenus;
CMenu.prototype.setXCoord=CMenu_setXCoord;
CMenu.prototype.setYCoord=CMenu_setYCoord;
CMenu.prototype.setZIndex=CMenu_setZIndex;
CMenu.prototype.update=new Function("return true");
CMenu.prototype.registerCallback=CMenu_registerCallback;
CMenu.prototype.executeCallback=CMenu_executeCallback;
CMenu.prototype.getObservers=CMenu_getObservers;
CMenu.prototype.onmouseover=CMenu_onmouseover;
CMenu.prototype.onmouseout=CMenu_onmouseout;
CMenu.prototype.onmouseup=CMenu_onmouseup;
CMenu.prototype.onkeypress=CMenu_onkeypress;
CMenu.prototype.createHiddenIFrame=CMenu_createHiddenIFrame;
CMenu.prototype.setForceCallback=CMenu_setForceCallback;
CMenu.prototype.getForceCallback=CMenu_getForceCallback;
CMenu.prototype.setFocus=CMenu_setFocus;
CMenu.prototype.genARIATags=CMenu_genARIATags;
CMenu.prototype.setAltText=CMenu_setAltText;
CMenu.prototype.getAltText=CMenu_getAltText;
CMenu.prototype.genMenuAltText=CMenu_genMenuAltText;
CMenu.prototype.setLoadingMenuItem=CMenu_setLoadingMenuItem;
CMenu.prototype.getLoadingMenuItem=CMenu_getLoadingMenuItem;
function updateIframeCoords(id,_2ac,_2ad){
if(g_ownerDocument==null){
return;
}
var _2ae=g_ownerDocument.getElementById(_2ac);
var _2af=g_ownerDocument.getElementById(id);
if(_2af&&_2ae){
if(_2ad==true){
_2af.style.left=_2ae.offsetLeft+"px";
_2af.style.top=_2ae.offsetTop+"px";
_2af.style.width=_2ae.offsetWidth+"px";
_2af.style.height=_2ae.offsetHeight+"px";
}else{
_2af.style.pixelLeft=_2ae.offsetLeft;
_2af.style.pixelTop=_2ae.offsetTop;
_2af.style.pixelWidth=_2ae.offsetWidth;
_2af.style.pixelHeight=_2ae.offsetHeight;
}
}
};
function CIcon(_2b0,_2b1,_2b2){
this.m_iconPath=_2b0;
this.m_toolTip=_2b1;
this.m_enabled=true;
this.m_height=16;
this.m_width=16;
if(typeof _2b2!="undefined"&&_2b2!=""){
this.m_webContentRoot=_2b2;
}else{
this.m_webContentRoot="..";
}
};
function CIcon_draw(){
var html="";
html+="<img style=\"vertical-align:middle;\" src=\"";
if(typeof this.m_iconPath!="undefined"&&this.m_iconPath!==""&&this.m_iconPath!="blankIcon"){
if(this.m_enabled==true){
html+=this.m_iconPath;
}else{
html+=this.getDisabledImagePath();
}
html+="\" title=\"";
if(typeof this.m_toolTip=="string"&&this.m_toolTip.length>0){
html+=this.m_toolTip;
}
html+="\" alt=\"";
if(typeof this.m_toolTip=="string"&&this.m_toolTip.length>0){
html+=this.m_toolTip;
}
html+="\" width=\"";
html+=this.m_width;
html+="\" height=\"";
html+=this.m_height;
html+="\"/>";
}else{
html+=this.m_webContentRoot+"/common/images/spacer.gif";
html+="\" alt=\"\"";
if(this.m_iconPath=="blankIcon"){
html+=" width=\"";
html+=this.m_width;
html+="\" height=\"";
html+=this.m_height;
html+="\"/>";
}else{
html+=" width=\"1\" height=\"1\"/>";
}
}
return html;
};
function CIcon_getDisabledImagePath(){
var _2b4=this.m_iconPath.split("/");
var _2b5="";
for(var i=0;i<(_2b4.length-1);++i){
_2b5+=_2b4[i]+"/";
}
_2b5+="dis_"+_2b4[_2b4.length-1];
return _2b5;
};
function CIcon_getPath(){
return this.m_iconPath;
};
function CIcon_setPath(path){
this.m_iconPath=path;
};
function CIcon_getToolTip(){
return this.m_toolTip;
};
function CIcon_setToolTip(_2b8){
this.m_toolTip=_2b8;
};
function CIcon_enable(){
this.m_enabled=true;
};
function CIcon_disable(){
this.m_enabled=false;
};
function CIcon_isEnabled(){
return this.m_enabled;
};
function CIcon_setHeight(_2b9){
this.m_height=_2b9;
};
function CIcon_getHeight(){
return this.m_height;
};
function CIcon_setWidth(_2ba){
this.m_width=_2ba;
};
function CIcon_getWidth(){
return this.m_width;
};
CIcon.prototype.draw=CIcon_draw;
CIcon.prototype.enable=CIcon_enable;
CIcon.prototype.disable=CIcon_disable;
CIcon.prototype.isEnabled=CIcon_isEnabled;
CIcon.prototype.getDisabledImagePath=CIcon_getDisabledImagePath;
CIcon.prototype.getPath=CIcon_getPath;
CIcon.prototype.setPath=CIcon_setPath;
CIcon.prototype.setHeight=CIcon_setHeight;
CIcon.prototype.getHeight=CIcon_getHeight;
CIcon.prototype.setWidth=CIcon_setWidth;
CIcon.prototype.getWidth=CIcon_getWidth;
CIcon.prototype.getToolTip=CIcon_getToolTip;
CIcon.prototype.setToolTip=CIcon_setToolTip;
var cHorizonalBar=0;
var cVerticalBar=1;
function CBar(_2bb,_2bc,sId,_2be,_2bf,_2c0,_2c1,_2c2){
this.m_align="left";
this.m_items=[];
this.m_htmlContainerId=_2bb;
this.m_htmlContainer=null;
this.m_id="cbar"+_2bb;
this.m_menuType=cVerticalBar;
this.m_style=_2bc;
this.m_parent=null;
this.m_observers=new CObserver(this);
this.m_cookieVar=_2c1;
this.m_cookieName=_2c2;
this.m_sId=(sId)?sId:null;
this.m_display=DISPLAY_INLINE;
this.m_imagePath=(_2be)?_2be:"../common/images/toolbar/";
this.m_imgCollapseSrc=this.m_imagePath+"toolbar_collapse.gif";
this.m_imgExpandSrc=this.m_imagePath+"toolbar_expand.gif";
this.m_showTooltip=_2bf?_2bf:null;
this.m_hideTooltip=_2c0?_2c0:null;
};
function CBar_hideBar(){
var bar=document.getElementById("bar"+this.m_id);
var _2c4=document.getElementById("barIcon"+this.m_id);
if(_2c4){
_2c4.src=this.m_imgExpandSrc;
if(this.m_showTooltip!=null){
_2c4.alt=this.m_showTooltip;
_2c4.title=this.m_showTooltip;
}
}
if(bar){
bar.style.display=DISPLAY_NONE;
if(typeof setQSCookie=="function"){
setQSCookie(this.m_cookieVar,this.m_cookieName,0);
}
}
};
function CBar_showBar(){
var bar=document.getElementById("bar"+this.m_id);
var _2c6=document.getElementById("barIcon"+this.m_id);
if(_2c6){
_2c6.src=this.m_imgCollapseSrc;
if(this.m_hideTooltip!=null){
_2c6.alt=this.m_hideTooltip;
_2c6.title=this.m_hideTooltip;
}
}
if(bar){
bar.style.display=this.m_display;
if(typeof setQSCookie=="function"){
setQSCookie(this.m_cookieVar,this.m_cookieName,1);
}
}
};
function CBar_toggleBar(){
var bar=document.getElementById("bar"+this.m_id);
var _2c8=bar.style.display;
if((_2c8==this.m_display)||(_2c8=="")){
this.hideBar();
}else{
this.showBar();
}
};
function CBar_getParent(){
return this.m_parent;
};
function CBar_setParent(_2c9){
this.m_parent=_2c9;
};
function CBar_draw(){
if(this.m_htmlContainer==null){
this.m_htmlContainer=document.getElementById(this.m_htmlContainerId);
if(this.m_htmlContainer==null){
return;
}
}
var html="";
html+="<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" role=\"presentation\"";
if(this.m_sId!=null){
html+="style=\"display: inline;\"><tr>";
html+="<td"+(isFF()?" style=\"vertical-align:bottom\"":"")+" style=\"height:26px\"><img id=\"barIcon"+this.m_id+"\" border=\"0\" src=\""+this.m_imgCollapseSrc+"\"";
if(this.m_hideTooltip!=null){
html+=" alt=\""+this.m_hideTooltip+"\" title=\""+this.m_hideTooltip+"\"";
}
html+=" onclick=\""+this.m_sId+".toggleBar();\" style=\"cursor:pointer;cursor:hand;\"></td>";
}else{
var _2cb="";
if(this.m_htmlContainer.style.textAlign=="right"){
_2cb="margin-left:auto; margin-right: 0;";
}else{
if(this.m_htmlContainer.style.textAlign=="left"){
_2cb="margin-left:0; margin-right: auto;";
}else{
if(this.m_htmlContainer.style.textAlign=="center"){
_2cb="margin-left:auto; margin-right: auto;";
}
}
}
if(_2cb!=""){
html+=" style=\""+_2cb+"\"";
}
html+="><tr>";
}
html+="<td id=\"bar"+this.m_id+"\">";
html+="<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" role=\"presentation\" class=\"";
if(this.getStyle()!=null){
html+=this.getStyle().getNormalState();
}
html+="\" id=\"";
html+=this.m_id;
html+="\" style=\""+this.m_style+"\"><tr>";
html+=this.drawItems();
html+="</tr></table></td>";
html+="</tr></table>";
this.m_htmlContainer.innerHTML=html;
this.m_htmlContainer.style.textAlign=this.m_align;
for(var i=0;i<this.m_items.length;++i){
if(typeof this.m_items[i].init=="function"){
this.m_items[i].init();
}
}
this.attachEvents();
};
function CBar_drawItems(){
var html="";
for(var i=0;i<this.m_items.length;++i){
if(typeof this.m_items[i].draw=="function"){
if(this.m_menuType==cHorizonalBar&&!(this.m_items[i] instanceof CSeperator)){
html+="<td style=\"white-space:nowrap;";
if(this.m_items[i] instanceof CMenuItem){
html+=";padding-left:1px; padding-right: 1px;";
}
html+="\">";
}
if(this.m_items[i].isVisible()){
html+=this.m_items[i].draw();
}
if(this.m_menuType==cHorizonalBar&&!(this.m_items[i] instanceof CSeperator)){
html+="</td>";
}
}
}
return html;
};
function CBar_attachEvents(){
for(var i=0;i<this.m_items.length;++i){
if(typeof this.m_items[i].attachEvents=="function"&&this.m_items[i].isVisible()){
this.m_items[i].attachEvents();
}
}
};
function CBar_add(item){
if(typeof item.getObservers=="function"&&typeof item.getObservers()=="object"&&typeof item.onmouseover=="function"&&item instanceof CMenuItem){
item.getObservers().attach(this,this.closeMenus,item.onmouseover);
}
this.m_items[this.m_items.length]=item;
};
function CBar_getNumItems(){
return this.m_items.length;
};
function CBar_getId(){
return this.m_id;
};
function CBar_get(_2d1){
if(_2d1>=0&&_2d1<this.getNumItems()){
return this.m_items[_2d1];
}
return null;
};
function CBar_hide(_2d2){
if(_2d2>0&&_2d2<this.getNumItems()){
if(typeof this.m_items[i].hide=="function"){
this.m_items[i].hide();
}
}
};
function CBar_show(_2d3){
if(_2d3>0&&_2d3<this.getNumItems()){
if(typeof this.m_items[i].show=="function"){
this.m_items[i].show();
}
}
};
function CBar_enable(_2d4){
if(_2d4>0&&_2d4<this.getNumItems()){
if(typeof this.m_items[i].enable=="function"){
this.m_items[i].enable();
}
}
};
function CBar_disable(_2d5){
if(_2d5>0&&_2d5<this.getNumItems()){
if(typeof this.m_items[i].disable=="function"){
this.m_items[i].disable();
}
}
};
function CBar_getState(_2d6){
if(_2d6>0&&_2d6<this.getNumItems()){
if(typeof this.m_items[i].getState=="function"){
this.m_items[i].getState();
}
}
};
function CBar_setMenuType(_2d7){
this.m_menuType=_2d7;
};
function CBar_getMenuType(){
return this.m_menuType;
};
function CBar_setStyle(_2d8){
this.m_style=_2d8;
};
function CBar_setAlign(_2d9){
this.m_align=_2d9;
};
function CBar_getStyle(){
return this.m_style;
};
function CBar_closeMenus(_2da){
for(var i=0;i<this.getNumItems();i++){
var _2dc=this.get(i);
if(typeof _2da=="object"){
if(_2da.getSubject()==_2dc){
continue;
}
}
if(typeof _2dc.getMenu=="function"&&_2dc.getMenu()!=null&&_2dc.getMenu().isVisible()){
_2dc.getMenu().remove();
}
}
};
function CBar_getHTMLContainer(){
return this.m_htmlContainer;
};
function CBar_getObservers(){
return this.m_observers;
};
function CBar_onmouseover(evt){
evt=(evt)?evt:((event)?event:null);
if(this.getParent()!=null&&typeof this.getParent().onmouseover=="function"){
this.getParent().onmouseover(evt);
}
this.getObservers().notify(CBar_onmouseover);
};
function CBar_onmouseout(evt){
evt=(evt)?evt:((event)?event:null);
if(this.getParent()!=null&&typeof this.getParent().onmouseout=="function"){
this.getParent().onmouseout(evt);
}
this.getObservers().notify(CBar_onmouseout);
};
function CBar_onmouseup(evt){
evt=(evt)?evt:((event)?event:null);
if(this.getParent()!=null&&typeof this.getParent().onmouseup=="function"){
this.getParent().onmouseup(evt);
}
this.getObservers().notify(CBar_onmouseup);
};
function CBar_onkeypress(evt){
evt=(evt)?evt:((event)?event:null);
if(this.getParent()!=null&&typeof this.getParent().onkeypress=="function"){
this.getParent().onkeypress(evt);
}
this.getObservers().notify(CBar_onkeypress);
};
CBar.prototype.draw=CBar_draw;
CBar.prototype.add=CBar_add;
CBar.prototype.get=CBar_get;
CBar.prototype.hide=CBar_hide;
CBar.prototype.show=CBar_show;
CBar.prototype.enable=CBar_enable;
CBar.prototype.disable=CBar_disable;
CBar.prototype.getState=CBar_getState;
CBar.prototype.attachEvents=CBar_attachEvents;
CBar.prototype.drawItems=CBar_drawItems;
CBar.prototype.getId=CBar_getId;
CBar.prototype.setMenuType=CBar_setMenuType;
CBar.prototype.getMenuType=CBar_getMenuType;
CBar.prototype.getNumItems=CBar_getNumItems;
CBar.prototype.setStyle=CBar_setStyle;
CBar.prototype.getStyle=CBar_getStyle;
CBar.prototype.setAlign=CBar_setAlign;
CBar.prototype.closeMenus=CBar_closeMenus;
CBar.prototype.setParent=CBar_setParent;
CBar.prototype.getParent=CBar_getParent;
CBar.prototype.getHTMLContainer=CBar_getHTMLContainer;
CBar.prototype.getObservers=CBar_getObservers;
CBar.prototype.update=new Function("return true");
CBar.prototype.getObservers=CBar_getObservers;
CBar.prototype.onmouseover=CBar_onmouseover;
CBar.prototype.onmouseout=CBar_onmouseout;
CBar.prototype.onmouseup=CBar_onmouseup;
CBar.prototype.onkeypress=CBar_onkeypress;
CBar.prototype.hideBar=CBar_hideBar;
CBar.prototype.showBar=CBar_showBar;
CBar.prototype.toggleBar=CBar_toggleBar;
function CStaticText(text,_2e2){
this.m_text=text;
this.m_style=_2e2;
this.m_bVisible=true;
this.m_sId="";
};
CStaticText.prototype.setId=function(sId){
this.m_sId=sId;
};
CStaticText.prototype.getId=function(){
return this.m_sId;
};
CStaticText.prototype.setText=function(text){
this.m_text=text;
};
CStaticText.prototype.setLabelledBy=function(text){
this.m_labelledBy=text;
};
CStaticText.prototype.draw=function(){
var html="";
html+="<td style=\"white-space: nowrap;\" class=\"";
html+=this.m_style.getNormalState()+"\"";
if(this.getId()!=""){
html+=" id=\""+this.getId()+"\"";
}
html+=">";
var _2e7=this.m_labelledBy?"aria-labelledby=\""+this.getId()+"label\"":"";
html+="<div role=\"presentation\" tabIndex=\"0\" "+_2e7+">";
html+=this.m_text;
html+="</div>";
if(this.m_labelledBy){
html+="<div style=\"position: absolute; overflow: hidden; width: 0; height: 0;\" id=\""+this.getId()+"label\">";
html+=this.m_labelledBy;
html+="</div>";
}
html+="</td>";
return html;
};
CStaticText.prototype.isVisible=function(){
return this.m_bVisible;
};
CStaticText.prototype.hide=function(){
this.m_bVisible=false;
};
CStaticText.prototype.hide.show=function(){
this.m_bVisible=true;
};
var DISPLAY_INLINE="inline";
var DISPLAY_NONE="none";
var DISPLAY_BLOCK="block";
var __excel_win=null;
var __pdf_win=null;
if(window.attachEvent){
window.attachEvent("onkeydown",viewerMainKeyPress);
window.attachEvent("onresize",onResizeViewerEvent);
}else{
if(window.addEventListener){
window.addEventListener("keydown",viewerMainKeyPress,false);
window.addEventListener("resize",onResizeViewerEvent,false);
}
}
function attachLeavingRV(){
if(window.attachEvent){
window.attachEvent("onbeforeunload",leavingRV);
}else{
if(window.addEventListener){
window.addEventListener("beforeunload",leavingRV,false);
}else{
try{
var _2e8=window.onunload;
if(!(""+_2e8).match(/leavingRV/gi)){
window.oLeavingRV_onunload=window.onunload;
window.onunload=function(){
window.oLeavingRV_onunload();
leavingRV();
};
}
}
catch(e){
}
}
}
};
function detachLeavingRV(){
if(window.detachEvent){
window.detachEvent("onbeforeunload",leavingRV);
}else{
window.removeEventListener("beforeunload",leavingRV,false);
}
};
window.attachLeavingRV();
function CContextMenu(_2e9){
if(_2e9==null){
return;
}
this.m_mainWnd=_2e9;
this.setCV(this.m_mainWnd.getCV());
var _2ea=this.m_mainWnd.getCV().getWebContentRoot();
var _2eb=this.m_mainWnd.getCV().getSkin();
var _2ec=this.m_mainWnd.getUIHide();
this.m_contextMenu=new CMenu("rvContextMenu"+this.getCVId(),gMenuStyle,_2ea);
this.m_contextMenu.m_oCV=this.getCV();
this.m_downloadChart=new CMenuItem(this.m_contextMenu,RV_RES.RV_DOWNLOAD_CHART,"if(typeof "+getCognosViewerSCObjectRefAsString(this.getCVId())+" != 'undefined') "+getCognosViewerSCObjectRefAsString(this.getCVId())+".downloadSelectedChartImage('"+this.getCVId()+"');",_2ea+"/rv/images/action_chart.gif",gMenuItemStyle,_2ea,_2eb);
this.m_downloadChart.hide();
this.m_downloadChartSeperator=new CSeperator("horizontal_line"+this.getCVId(),"1",gMenuSeperatorStyle,_2ea);
this.m_downloadChartSeperator.hide();
this.m_contextMenu.add(this.m_downloadChartSeperator);
var _2ed=this.getCV().getDrillMgr();
if(_2ed){
if(typeof RV_RES.RV_DRILL_DOWN!="undefined"){
this.m_drillDown=new CMenuItem(this.m_contextMenu,RV_RES.RV_DRILL_DOWN,this.getCVObjectRef()+".getDrillMgr().rvDrillDown();",_2ea+"/rv/images/action_drill_down.gif",gMenuItemStyle,_2ea,_2eb);
this.m_drillDown.disable();
}
if(typeof RV_RES.RV_DRILL_UP!="undefined"){
this.m_drillUp=new CMenuItem(this.m_contextMenu,RV_RES.RV_DRILL_UP,this.getCVObjectRef()+".getDrillMgr().rvDrillUp();",_2ea+"/rv/images/action_drill_up.gif",gMenuItemStyle,_2ea,_2eb);
this.m_drillUp.disable();
}
if(this.getCV().isInteractiveViewer()&&this.getCV().getAdvancedServerProperty("VIEWER_JS_ENABLE_EXPAND_COLLAPSE")=="true"){
this.m_contextMenu.add(gMenuSeperator);
if(typeof RV_RES.IDS_JS_EXPAND_MEMBER!="undefined"){
this.m_expand=new CMenuItem(this.m_contextMenu,RV_RES.IDS_JS_EXPAND_MEMBER,this.getCVObjectRef()+".expand();","",gMenuItemStyle,_2ea,_2eb);
this.m_expand.disable();
}
if(typeof RV_RES.IDS_JS_COLLAPSE_MEMBER!="undefined"){
this.m_collapse=new CMenuItem(this.m_contextMenu,RV_RES.IDS_JS_COLLAPSE_MEMBER,this.getCVObjectRef()+".collapse();","",gMenuItemStyle,_2ea,_2eb);
this.m_collapse.disable();
}
}
if((!this.getCV().m_viewerFragment||this.getCV().envParams["ui.action"]!="view")&&typeof RV_RES.IDS_JS_FREEZECOLUMNHEADINGS!=="undefined"&&typeof RV_RES.IDS_JS_FREEZEROWHEADINGS!=="undefined"){
this.m_freezeRowHeadings=new CMenuItem(this.m_contextMenu,RV_RES.IDS_JS_FREEZEROWHEADINGS,this.getCVObjectRef()+".getPinFreezeManager().freezeSelectedRowHeadings();",_2ea+"/rv/images/action_freeze_row_heading.gif",gMenuItemStyle,_2ea,_2eb);
this.m_unfreezeRowHeadings=new CMenuItem(this.m_contextMenu,RV_RES.IDS_JS_UNFREEZEROWHEADINGS,this.getCVObjectRef()+".getPinFreezeManager().unfreezeSelectedRowHeadings();",_2ea+"/rv/images/action_freeze_row_heading.gif",gMenuItemStyle,_2ea,_2eb);
this.m_freezeColumnHeadings=new CMenuItem(this.m_contextMenu,RV_RES.IDS_JS_FREEZECOLUMNHEADINGS,this.getCVObjectRef()+".getPinFreezeManager().freezeSelectedColumnHeadings();",_2ea+"/rv/images/action_freeze_column_heading.gif",gMenuItemStyle,_2ea,_2eb);
this.m_unfreezeColumnHeadings=new CMenuItem(this.m_contextMenu,RV_RES.IDS_JS_UNFREEZECOLUMNHEADINGS,this.getCVObjectRef()+".getPinFreezeManager().unfreezeSelectedColumnHeadings();",_2ea+"/rv/images/action_freeze_column_heading.gif",gMenuItemStyle,_2ea,_2eb);
this.m_freezeColumnHeadings.hide();
this.m_unfreezeColumnHeadings.hide();
this.m_freezeRowHeadings.hide();
this.m_unfreezeRowHeadings.hide();
}
if(typeof RV_RES.RV_GO_TO!="undefined"){
if(_2ec.indexOf(" RV_CONTEXT_MENU_GOTO ")==-1){
if(_2ec.indexOf(" RV_CONTEXT_MENU_DRILL_UP ")==-1||!_2ec.indexOf(" RV_CONTEXT_MENU_DRILL_DOWN ")==-1){
this.m_contextMenu.add(gMenuSeperator);
}
}
this.m_goto=new CMenuItem(this.m_contextMenu,RV_RES.RV_GO_TO,this.getCVObjectRef()+".getDrillMgr().launchGoToPage(null,true);",_2ea+"/rv/images/action_go_to.gif",gMenuItemStyle,_2ea,_2eb);
var _2ee=this.m_goto.createCascadedMenu(gMenuStyle);
_2ee.m_oCV=this.getCV();
if(this.getCV().envParams["cv.containerApp"]=="AA"){
_2ee.registerCallback(this.getCVObjectRef()+".m_viewerFragment.raiseGotoContextMenuEvent()");
}else{
_2ee.registerCallback(this.getCVObjectRef()+".getDrillMgr().getDrillThroughParameters()");
}
}
}
var _2ef=this.getCV().getSubscriptionManager();
if(_2ef&&this.getCV().bCanUseCognosViewerConditionalSubscriptions){
this.m_subscriptionSeperator=new CSeperator("horizontal_line","1",gMenuSeperatorStyle,_2ea);
this.m_subscriptionSeperator.hide();
this.m_contextMenu.add(this.m_subscriptionSeperator);
if(RV_RES.RV_NEW_WATCH_RULE){
this.m_subscription=new CMenuItem(this.m_contextMenu,RV_RES.RV_NEW_WATCH_RULE,this.getCVObjectRef()+".getSubscriptionManager().NewSubscription();",_2ea+"/rv/images/action_new_subscription.gif",gMenuItemStyle,_2ea,_2eb);
this.m_subscription.disable();
}
}
var _2f0=false;
if(this.getCV().bCanUseGlossary&&RV_RES.RV_GLOSSARY&&_2ec.indexOf(" RV_CONTEXT_MENU_GLOSSARY ")==-1){
_2f0=true;
this.m_contextMenu.add(gMenuSeperator);
this.m_glossaryItem=new CMenuItem(this.m_contextMenu,RV_RES.RV_GLOSSARY,this.getCVObjectRef()+".executeAction('Glossary');",_2ea+"/rv/images/action_glossary.gif",gMenuItemStyle,_2ea,_2eb);
this.m_glossaryItem.disable();
}
if(this.isLinegaeVisisble(_2ec)){
if(!_2f0){
this.m_contextMenu.add(gMenuSeperator);
}
this.m_lineageItem=new CMenuItem(this.m_contextMenu,RV_RES.RV_LINEAGE,this.getCVObjectRef()+".executeAction('Lineage');",_2ea+"/rv/images/action_lineage.gif",gMenuItemStyle,_2ea,_2eb);
this.m_lineageItem.disable();
}
};
CContextMenu.prototype=new CViewerHelper();
CContextMenu.prototype.isLinegaeVisisble=function(_2f1){
if(!isSafari()&&this.getCV().bCanUseLineage&&RV_RES.RV_LINEAGE&&_2f1.indexOf(" RV_CONTEXT_MENU_LINEAGE ")==-1){
if(this.getCV().envParams["ui.object"]||(this.getCV().envParams["metadataInformationURI"]&&this.getCV().envParams["metadataInformationURI"].indexOf("iis=")==-1)){
return true;
}
}
return false;
};
CContextMenu.prototype.hideFirstSeperators=function(){
var _2f2=this.m_contextMenu.m_menuItems.length;
for(var _2f3=0;_2f3<_2f2;_2f3++){
var _2f4=this.m_contextMenu.m_menuItems[_2f3];
if(_2f4.isVisible()&&typeof _2f4.m_toolbarSeperatorClass!="string"){
break;
}else{
if(typeof _2f4.m_toolbarSeperatorClass=="string"){
_2f4.hide();
}
}
}
};
CContextMenu.prototype.updateFreezeHeadings=function(){
if(this.getCV().m_viewerFragment||this.getCV().envParams["ui.action"]=="view"){
return;
}
if(this.getCV().getPinFreezeManager()){
var _2f5=this.getCV().getPinFreezeManager();
if(this.m_freezeRowHeadings){
if(_2f5.canFreezeSelectedRowHeadings()){
this.m_freezeRowHeadings.show();
}else{
this.m_freezeRowHeadings.hide();
}
}
if(this.m_unfreezeRowHeadings){
if(_2f5.canUnfreezeSelectedRowHeadings()){
this.m_unfreezeRowHeadings.show();
}else{
this.m_unfreezeRowHeadings.hide();
}
}
if(this.m_freezeColumnHeadings){
if(_2f5.canFreezeSelectedColumnHeadings()){
this.m_freezeColumnHeadings.show();
}else{
this.m_freezeColumnHeadings.hide();
}
}
if(this.m_unfreezeColumnHeadings){
if(_2f5.canUnfreezeSelectedColumnHeadings()){
this.m_unfreezeColumnHeadings.show();
}else{
this.m_unfreezeColumnHeadings.hide();
}
}
}
};
function CContextMenu_draw(evt){
this.updateSubscriptionContextMenuItem();
if(this.m_bFaultModalShown){
this.update(this.subject);
this.m_bFaultModalShown=false;
}
this.hideFirstSeperators();
this.m_contextMenu.remove();
this.m_contextMenu.setHTMLContainer(document.body);
this.m_contextMenu.draw();
if(isIE()&&evt.keyCode&&evt.keyCode!=0){
var node=getCrossBrowserNode(evt);
var _2f8=clientToScreenCoords(node,document.body);
this.m_contextMenu.setXCoord(_2f8.leftCoord+node.scrollWidth);
this.m_contextMenu.setYCoord(_2f8.topCoord);
}else{
this.m_contextMenu.setXCoord(evt.clientX);
this.m_contextMenu.setYCoord(evt.clientY);
}
if(getCVWaitingOnFault()==null){
this.m_contextMenu.show();
this.m_bFaultModalShown=false;
}else{
this.m_bFaultModalShown=true;
}
var _2f9=this.m_contextMenu.get(this.m_contextMenu.getNumItems()-1);
if(_2f9&&typeof _2f9.getObservers=="function"&&typeof _2f9.getObservers()=="object"){
_2f9.getObservers().attach(this,this.closeMenuTabEvent,"CMenuItem_closeMenuTabEvent");
}
};
function CContextMenu_getDrillUpMenuItem(){
return this.m_drillUp;
};
function CContextMenu_getDrillDownMenuItem(){
return this.m_drillDown;
};
function CContextMenu_getGoToMenuItem(){
return this.m_goto;
};
function CContextMenu_closeMenuTabEvent(){
var oCV=this.m_mainWnd.getCV();
var _2fb=oCV.getSelectionController();
var _2fc=_2fb.getAllSelectedObjects().length;
if(_2fc>0){
var _2fd=_2fb.getAllSelectedObjects()[_2fc-1];
var _2fe=_2fd.getCellRef().getElementsByTagName("span");
if(_2fe.length>0){
for(var i=0;i<_2fe.length;i++){
var span=_2fe[i];
if(span.getAttribute("tabindex")!=null&&span.style.visibility!="hidden"){
span.focus();
}
}
}
}
};
function CContextMenu_hide(){
this.m_contextMenu.remove();
};
function CContextMenu_hideDownloadChartMenuItem(){
this.m_downloadChart.hide();
this.m_downloadChartSeperator.hide();
};
function CContextMenu_showDownloadChartMenuItem(){
this.m_downloadChart.show();
this.m_downloadChartSeperator.show();
};
function CContextMenu_update(_301){
if(_301 instanceof CSelectionController){
this.subject=_301;
var _302=this.m_mainWnd.getUIHide();
var _303=this.getCV().getDrillMgr();
if(_303){
var _304=this.getGoToMenuItem();
var _305=_304.getMenu();
if(_305){
_305.clear();
}
if(!_301.getSelectionBasedFeaturesEnabled()||_302.indexOf(" RV_CONTEXT_MENU_GOTO ")!=-1){
_304.hide();
}
var _306=this.getDrillDownMenuItem();
if(_302.indexOf(" RV_CONTEXT_MENU_DRILL_DOWN ")!=-1){
_306.hide();
}else{
if(_303.canDrillDown()){
this.updateDrillMenu(_306,"DrillDown");
_306.enable();
}else{
if(!_301.getSelectionBasedFeaturesEnabled()){
_306.hide();
}else{
_306.disable();
}
}
}
var _307=this.getDrillUpMenuItem();
if(_302.indexOf(" RV_CONTEXT_MENU_DRILL_UP ")!=-1){
_307.hide();
}
if(_303.canDrillUp()){
this.updateDrillMenu(_307,"DrillUp");
_307.enable();
}else{
if(!_301.getSelectionBasedFeaturesEnabled()){
_307.hide();
gMenuSeperator.hide();
}else{
_307.disable();
}
}
if(this.m_expand){
this.getCV().canExpand()?this.m_expand.enable():this.m_expand.disable();
}
if(this.m_collapse){
this.getCV().canCollapse()?this.m_collapse.enable():this.m_collapse.disable();
}
if(_302.indexOf(" RV_CONTEXT_MENU_DOWNLOAD_CHART ")!=-1){
this.hideDownloadChartMenuItem();
}else{
if(!_301.hasSelectedChartNodes()){
if(!_301.getSelectionBasedFeaturesEnabled()){
this.hide();
}else{
this.hideDownloadChartMenuItem();
}
}else{
this.showDownloadChartMenuItem();
}
}
}
var _308=false;
if(this.m_lineageItem||this.m_glossaryItem){
var _309=_301.getAllSelectedObjects();
if(_309!=null&&_309.length>0){
for(var i=0;i<_309.length;i++){
if(_309[i].hasContextInformation()){
_308=true;
break;
}
}
}
}
this.updateFreezeHeadings();
if(this.m_glossaryItem&&_308&&this.getCV().envParams["glossaryURI"]!=null&&this.getCV().envParams["glossaryURI"]!=""){
this.m_glossaryItem.enable();
}else{
if(this.m_glossaryItem){
this.m_glossaryItem.disable();
}
}
if(this.m_lineageItem&&_308){
this.m_lineageItem.enable();
}else{
if(this.m_lineageItem){
this.m_lineageItem.disable();
}
}
}
};
CContextMenu.prototype.updateDrillMenu=function(_30b,_30c){
_30b.clearCascadedMenu();
var _30d={};
DrillContextMenuHelper.updateDrillMenuItems(_30d,this.getCV(),_30c);
if(_30d.items){
var _30e=_30d.items;
var _30f=_30b.createCascadedMenu(gMenuStyle);
var _310=this.getCV().getWebContentRoot();
var _311=this.m_mainWnd.getCV().getSkin();
for(var i=0;i<_30e.length;i++){
var _313=_30e[i];
if(_313.separator){
if(i<(_30e.length-1)){
_30f.add(gMenuSeperator);
}
}else{
var _314=_313.action&&_313.action.payload&&_313.action.payload.userSelectedDrillItem?_313.action.payload.userSelectedDrillItem:"";
var _315=_314?"{\"userSelectedDrillItem\" : \""+_314+"\"}":"{}";
if(_30c=="DrillDown"){
new CMenuItem(_30f,_313.label,this.getCVObjectRef()+".getDrillMgr().rvDrillDown("+_315+");","",gMenuItemStyle,_310,_311);
}else{
new CMenuItem(_30f,_313.label,this.getCVObjectRef()+".getDrillMgr().rvDrillUp("+_315+");","",gMenuItemStyle,_310,_311);
}
}
}
}
};
function CContextMenu_updateSubscriptionContextMenuItem(){
var _316=this.m_mainWnd.getUIHide();
var _317=this.getCV().getSubscriptionManager();
if(_316.indexOf(" RV_CONTEXT_MENU_ALERT_USING_NEW_WATCH_RULE ")!=-1&&this.m_subscription){
this.m_subscription.hide();
}else{
if(_317&&this.m_subscription&&_317.CanCreateNewWatchRule()){
this.m_subscriptionSeperator.show();
this.m_subscription.show();
if(_317.IsValidSelectionForNewRule()){
this.m_subscription.enable();
}else{
this.m_subscription.disable();
}
}else{
if(this.m_subscription){
this.m_subscriptionSeperator.hide();
this.m_subscription.hide();
}
}
}
};
CContextMenu.prototype.draw=CContextMenu_draw;
CContextMenu.prototype.hide=CContextMenu_hide;
CContextMenu.prototype.closeMenuTabEvent=CContextMenu_closeMenuTabEvent;
CContextMenu.prototype.getDrillUpMenuItem=CContextMenu_getDrillUpMenuItem;
CContextMenu.prototype.getDrillDownMenuItem=CContextMenu_getDrillDownMenuItem;
CContextMenu.prototype.getGoToMenuItem=CContextMenu_getGoToMenuItem;
CContextMenu.prototype.hideDownloadChartMenuItem=CContextMenu_hideDownloadChartMenuItem;
CContextMenu.prototype.showDownloadChartMenuItem=CContextMenu_showDownloadChartMenuItem;
CContextMenu.prototype.update=CContextMenu_update;
CContextMenu.prototype.updateSubscriptionContextMenuItem=CContextMenu_updateSubscriptionContextMenuItem;
function CReportHistory(_318,_319,_31a,_31b){
this.m_mainWnd=_318;
this.m_stack_idx=_319;
this.m_reportName="";
if(typeof _31a=="undefined"||_31a==null||_31a.length==0){
if(typeof _318!="undefined"&&_318!=null){
var _31c=RV_RES.RV_PREVIOUS_REPORT;
this.m_reportName=_31c;
}
}else{
this.m_reportName=_31a;
}
this.m_params=_31b;
};
CReportHistory.prototype.getDropDownMenuIcon=function(){
var _31d="/ps/portal/images/";
if(this.m_params["ui.action"]=="view"){
_31d+="icon_result_";
if(this.m_params["ui.format"]=="PDF"){
_31d+="pdf.gif";
}else{
_31d+="html.gif";
}
}else{
_31d+="action_run.gif";
}
return _31d;
};
CReportHistory.prototype.addParamNode=function(_31e,_31f,_320){
var _321=_31e.ownerDocument.createElement("param");
_31e.appendChild(_321);
_321.setAttribute("name",_31f);
_321.appendChild(_31e.ownerDocument.createTextNode(_320));
};
CReportHistory.prototype.saveAsXML=function(_322){
var _323=_322.ownerDocument.createElement("previousReport");
_322.appendChild(_323);
for(var _324 in this.m_params){
this.addParamNode(_323,_324,this.m_params[_324]);
}
this.addParamNode(_323,"ui.name",this.getReportName());
};
CReportHistory.prototype.getIdx=function(){
return this.m_stack_idx;
};
CReportHistory.prototype.getReportName=function(){
return this.m_reportName;
};
CReportHistory.prototype.getParameters=function(){
return this.m_params;
};
CReportHistory.prototype.createRequestForm=function(){
var oCV=this.m_mainWnd.getCV();
var _326=document.getElementById("formWarpRequest"+oCV.getId());
var form=document.createElement("form");
form.setAttribute("id","previousReport");
form.setAttribute("name","previousReport");
form.setAttribute("target",_326.getAttribute("target")?_326.getAttribute("target"):"");
form.setAttribute("method","post");
form.setAttribute("action",_326.getAttribute("action"));
form.style.display="none";
document.body.appendChild(form);
for(var _328 in this.m_params){
if(_328!="m_tracking"){
form.appendChild(createHiddenFormField(_328,this.m_params[_328]));
}
}
for(var _329 in oCV.envParams){
if(_329.indexOf("cv.")==0&&_329!="cv.previousReports"&&_329!="m_tracking"&&_329!="cv.actionState"){
form.appendChild(createHiddenFormField(_329,oCV.envParams[_329]));
}
}
if(this.getIdx()>0){
this.m_mainWnd.m_reportHistoryList=this.m_mainWnd.m_reportHistoryList.slice(0,this.getIdx());
form.appendChild(createHiddenFormField("cv.previousReports",this.m_mainWnd.saveReportHistoryAsXML()));
}
form.appendChild(createHiddenFormField("ui.name",this.getReportName()));
form.appendChild(createHiddenFormField("b_action","cognosViewer"));
var _32a=_326.getElementsByTagName("INPUT");
for(var _32b=0;_32b<_32a.length;++_32b){
if(typeof form[_32a[_32b].name]=="undefined"&&_32a[_32b].name!="cv.previousReports"&&_32a[_32b].name.length>0){
form.appendChild(createHiddenFormField(_32a[_32b].name,_32a[_32b].value));
}
}
return form;
};
CReportHistory.prototype.execute=function(){
var oCV=this.m_mainWnd.getCV();
if(typeof oCV.m_viewerFragment!="undefined"){
var _32d=new ViewerDispatcherEntry(oCV);
_32d.addFormField("ui.action",this.m_params["ui.action"]);
for(var _32e in this.m_params){
if(_32e!="ui.action"&&_32e!="m_tracking"&&_32e!="cv.actionState"){
_32d.addFormField(_32e,this.m_params[_32e]);
}
}
if(this.getIdx()>0){
this.m_mainWnd.m_reportHistoryList=this.m_mainWnd.m_reportHistoryList.slice(0,this.getIdx());
_32d.addFormField("cv.previousReports",this.m_mainWnd.saveReportHistoryAsXML());
}else{
_32d.removeFormField("cv.previousReports");
}
if(this.m_reportName&&this.m_reportName.length>0){
_32d.addFormField("ui.name",this.m_reportName);
}
_32d.addFormField("cv.responseFormat","fragment");
_32d.addFormField("cv.ignoreState","true");
_32d.addFormField("cv.id","_THIS_");
_32d.addFormField("m_tracking","");
oCV.dispatchRequest(_32d);
}else{
var form=this.createRequestForm();
form.submit();
}
};
function CViewerManager(oCV){
this.setCV(oCV);
};
CViewerManager.prototype=new CViewerHelper();
CViewerManager.prototype.Print=function(){
var _331=document.getElementById("CVIFrame"+this.getCVId());
if(_331){
if(isIE()){
_331.contentWindow.document.execCommand("print",true,null);
}else{
_331.focus();
_331.contentWindow.print();
}
}
var cv=this.getCV();
var _333=cv.rvMainWnd;
var _334=_333.getToolbarControl();
if(typeof _334!="undefined"&&_334!=null){
var _335=_334.getItem("print");
if(_335){
_335.setFocus();
}
}
};
CViewerManager.prototype.DownloadReport=function(){
var _336="";
var f=document.forms["formWarpRequest"+this.getCVId()];
_336+="b_action=xts.run&m=portal/download.xts&m_obj=";
_336+=f["ui.object"].value;
_336+="&m_name=";
_336+=f["ui.name"].value;
if(f["ui.format"]&&f["ui.format"].value){
_336+="&format=";
_336+=f["ui.format"].value;
}
_336=constructGETRequestParamsString(_336);
_336=f.action+"?"+_336;
location.href=_336;
};
CViewerManager.prototype.SaveReport=function(_338){
var oCV=this.getCV();
var oReq=new ViewerDispatcherEntry(oCV);
oReq.setWorkingDialog(null);
oReq.addFormField("ui.action","save");
if(!_338){
oReq.addFormField("run.continueConversation","true");
}else{
this.getCV().closeActiveHTTPConnection();
if(oCV.getWorkingDialog()){
oCV.getWorkingDialog().hide();
}
this.getCV().setKeepSessionAlive(true);
oReq.addFormField("run.continueConversation","false");
var _33b=GUtil.generateCallback(executeBackURL,[this.getCV().getId()],null);
oReq.setCallbacks({"complete":{"method":_33b}});
}
oReq.addFormField("run.saveOutput","true");
this.getCV().dispatchRequest(oReq);
};
CViewerManager.prototype.SaveAsReportView=function(_33c){
var _33d=document.getElementById("formWarpRequest"+this.getCVId());
if(_33d){
var _33e=!_33c;
var _33f={"m":"portal/viewer-saveAs.xts"};
_33f["run.continueConversation"]=_33e;
_33f["initializeSave"]="true";
_33f["ui.object"]=_33d["ui.object"].value;
_33f["ui.backURL"]=_33d["ui.backURL"].value;
_33f["ui.routingServerGroup"]=this.getRoutingServerGroup();
cvLoadDialog(this.getCV(),_33f,600,425,RV_RES.IDS_JS_SAVE_AS_REPORT_VIEW_IFRAME_TITLE);
}
};
CViewerManager.prototype.init=function(_340){
if(_340&&typeof _340=="object"){
for(var _341 in _340){
this[_341]=_340[_341];
}
}
};
CViewerManager.prototype.SendReport=function(_342){
var _343=!_342;
var _344={"m":"portal/viewer-email.xts"};
_344["run.continueConversation"]=_343;
_344["ui.routingServerGroup"]=this.getRoutingServerGroup();
cvLoadDialog(this.getCV(),_344,800,550,RV_RES.IDS_JS_EMAIL_REPORT_IFRAME_TITLE);
};
CViewerManager.prototype.validatePromptControls=function(){
if(typeof this.getCV().preProcessControlArray!="undefined"&&typeof preProcessForm!="undefined"){
preProcessForm(this.getCV().preProcessControlArray);
}
};
CViewerManager.prototype.RunReport=function(_345){
this.validatePromptControls();
var oReq=null;
var _347=this.getCV().envParams["ui.object"];
var _348=this.getCV().envParams["ui.spec"];
var _349=this.getCV().envParams["ui.action"];
var _34a=document.forms["formWarpRequest"+this.getCVId()];
if(_348!=null&&_348!=""){
oReq=new ViewerDispatcherEntry(this.getCV());
oReq.addFormField("ui.action","runSpecification");
oReq.addFormField("ui.spec",_348);
var _34b=this.getCV().envParams["specificationType"];
if(_34b!=null){
oReq.addFormField("specificationType",_34b);
}
}else{
if(_347!=null&&_347!=""){
if(this.getCV().isBux){
oReq=new ViewerDispatcherEntry(this.getCV());
oReq.addFormField("ui.action","bux");
}else{
oReq=new ViewerDispatcherEntry(this.getCV());
oReq.addFormField("ui.action","run");
}
if(_349=="view"){
if(this.getCV().envParams["ui.reRunObj"]){
_347=this.getCV().envParams["ui.reRunObj"];
}else{
if(typeof _34a["reRunObj"]!="undefined"&&_34a["reRunObj"]!=null){
_347=_34a["reRunObj"].value;
}
}
}
oReq.addFormField("ui.object",_347);
}
}
oReq.addFormField("run.outputFormat",this.getCV().rvMainWnd.getCurrentFormat());
oReq.addFormField("ui.primaryAction","");
var _34c=this.getCV().envParams["promptOnRerun"];
if(_34c!=null){
oReq.addFormField("run.prompt",_34c);
}else{
oReq.addFormField("run.prompt","true");
}
if(_345){
for(idx=0;idx<_345.length;++idx){
var _34d=_345[idx];
oReq.addFormField(_34d.name,_34d.value);
}
}
this.getCV().preparePromptValues(oReq);
this.getCV().dispatchRequest(oReq);
};
CViewerManager.prototype.viewReport=function(_34e,_34f){
if(this.getCV().rvMainWnd.getCurrentFormat()==_34e){
return;
}
var f=document.forms["formWarpRequest"+this.getCVId()];
if(f["ui.action"].value=="view"){
this.viewOutput(_34e,_34f);
}else{
var oReq=new ViewerDispatcherEntry(this.getCV());
oReq.addFormField("ui.action","render");
oReq.addFormField("run.outputFormat",_34e);
if(this.getCV().isAccessibleMode()&&!_34f&&_34e=="PDF"){
this.viewPDFInNewWindow(oReq);
}else{
if(isSafari()&&_34e=="PDF"){
this.viewPDFInNewWindow(oReq);
}else{
this.getCV().deleteTabs();
this.getCV().dispatchRequest(oReq);
}
}
}
};
CViewerManager.prototype.isExcelFormat=function(_352){
if(_352=="xlsxData"||_352=="XLS"||_352=="CSV"||_352=="XLWA"||_352=="singleXLS"||_352=="spreadsheetML"){
return true;
}
return false;
};
CViewerManager.prototype.viewOutput=function(_353,_354){
var oFWR=document.forms["formWarpRequest"+this.getCVId()];
var oReq=new ViewerDispatcherEntry(this.getCV());
oReq.addFormField("ui.action","view");
oReq.addFormField("cv.responseFormat","view");
oReq.addFormField("ui.format",_353);
var _357="";
switch(_353){
case "HTML":
_357=this.getCV().oOutputFormatPath.HTML;
break;
case "PDF":
_357=this.getCV().oOutputFormatPath.PDF;
break;
case "singleXLS":
_357=this.getCV().oOutputFormatPath.singleXLS;
break;
case "XLS":
_357=this.getCV().oOutputFormatPath.XLS;
break;
case "XLWA":
_357=this.getCV().oOutputFormatPath.XLWA;
break;
case "CSV":
_357=this.getCV().oOutputFormatPath.CSV;
break;
case "XML":
_357=this.getCV().oOutputFormatPath.XML;
break;
case "spreadsheetML":
_357=this.getCV().oOutputFormatPath.spreadsheetML;
break;
case "xlsxData":
_357=this.getCV().oOutputFormatPath.xlsxData;
break;
}
if(_357){
oReq.addFormField("ui.object",_357);
}
oReq.addFormField("reRunObj",oFWR.reRunObj.value);
oReq.addFormField("ui.format",_353);
oReq.addFormField("ui.name",oFWR["ui.name"].value);
if(this.isExcelFormat(_353)){
this.viewInExcel(oReq);
}else{
if(this.getCV().isAccessibleMode()&&!_354&&_353=="PDF"){
this.viewPDFInNewWindow(oReq);
}else{
if(isSafari()&&_353=="PDF"){
this.viewPDFInNewWindow(oReq);
}else{
this.getCV().dispatchRequest(oReq);
}
}
}
};
CViewerManager.prototype.viewPDFInNewWindow=function(oReq){
this.viewInNewWindow(oReq,__pdf_win);
};
CViewerManager.prototype.viewInExcel=function(oReq){
this.viewInNewWindow(oReq,__excel_win);
};
CViewerManager.prototype.viewInNewWindow=function(oReq,_35b){
var _35c=window.onbeforeunload;
window.onbeforeunload=null;
if(_35b!=null){
_35b.close();
}
var _35d="winNAT_"+(new Date()).getTime();
var _35e=this.getCV().getWebContentRoot()+"/"+"rv/blankNewWin.html?cv.id="+this.getCVId();
var _35f="viewForm"+this.getCVId();
var _360=document.getElementById(_35f);
if(_360){
_360.parentNode.removeChild(_360);
}
_360=document.createElement("form");
_360.setAttribute("method","post");
_360.setAttribute("id",_35f);
_360.setAttribute("action",this.getCV().getGateway());
_360.style.display="inline";
var oFWR=document["formWarpRequest"+this.getCVId()];
if(oFWR&&oFWR["run.outputFormat"]){
oReq.addFormField("previousFormat",oFWR["run.outputFormat"].value);
}
var _362=oReq.getFormFields().keys();
for(var _363=0;_363<_362.length;_363++){
var name=_362[_363];
if(name!="cv.responseFormat"&&name!="b_action"&&name!="m_tracking"){
_360.appendChild(createHiddenFormField(name,oReq.getFormField(name)));
}
}
_360.appendChild(createHiddenFormField("cv.responseFormat","page"));
_360.appendChild(createHiddenFormField("b_action","cognosViewer"));
_360.appendChild(createHiddenFormField("BIline1",RV_RES.RV_RUNNING));
_360.appendChild(createHiddenFormField("BIline2",RV_RES.RV_PLEASE_WAIT));
if(this.getCV().envParams["ui.name"]){
_360.appendChild(createHiddenFormField("ui.name",this.getCV().envParams["ui.name"]));
}
document.body.appendChild(_360);
_360.target=_35d;
_35b=window.open(_35e,_35d,"rv");
window.onbeforeunload=_35c;
};
CViewerManager.prototype.cancel=function(){
var oCV=this.getCV();
oCV.cancel();
};
CViewerManager.prototype.sXmlEncode=function(_366){
var _367=""+_366;
if((_367=="0")||((_366!=null)&&(_366!=false))){
_367=_367.replace(/&/g,"&amp;");
_367=_367.replace(/</g,"&lt;");
_367=_367.replace(/>/g,"&gt;");
_367=_367.replace(/"/g,"&quot;");
_367=_367.replace(/'/g,"&apos;");
}else{
if(_366==null){
_367="";
}
}
return _367;
};
CViewerManager.prototype.exit=function(_368){
var form=document.getElementById("formWarpRequest"+this.getCVId());
var oCV=this.getCV();
if(form&&form["ui.action"]&&form["ui.action"].value=="view"&&_368){
executeBackURL(this.getCVId());
}else{
if(oCV.getKeepSessionAlive()==false){
oCV.exit(_368);
}
}
};
function executeBackURL(_36b){
var _36c="";
if(_36b){
_36c=_36b;
}
if(window["oCV"+_36c]&&window["oCV"+_36c].isBux){
return false;
}
var form=document.getElementById("formWarpRequest"+_36c);
if(form["ui.backURL"].value.length<2048){
document.location.href=form["ui.backURL"].value;
return;
}
var _36e=decodeURIComponent(form["ui.backURL"].value);
var _36f=_36e.split("?");
var _370=document.createElement("form");
_370.style.display="none";
_370.setAttribute("method","post");
_370.setAttribute("action",_36f[0]);
_370.setAttribute("target","_self");
var _371=_36f[1].split("&");
for(var _372=0;_372<_371.length;_372++){
var _373=_371[_372].indexOf("=");
var _374=_371[_372].substr(0,_373);
var _375=_371[_372].substr(_373+1);
var _376=document.createElement("input");
_376.setAttribute("type","hidden");
_376.setAttribute("name",decodeURIComponent(_374));
_376.setAttribute("value",decodeURIComponent(_375));
_370.appendChild(_376);
}
document.body.appendChild(_370);
_370.submit();
};
CViewerManager.prototype.getRoutingServerGroup=function(){
var oCV=this.getCV();
if(oCV.envParams["ui.routingServerGroup"]){
return oCV.envParams["ui.routingServerGroup"];
}
return "";
};
CViewerManager.prototype.launchQS=function(){
var _378=document.forms["formWarpRequest"+this.getCVId()];
var oCV=this.getCV();
if(typeof oCV.m_viewerFragment!="undefined"){
cognosLaunchInWindow("","menubar=no,toolbar=no,status=yes,location=no,resizable=yes,width=650,height=480","ui.gateway",_378.action,"ui.tool","QueryStudio","ui.action","edit","ui.object",_378["ui.object"].value,"ui.routingServerGroup",this.getRoutingServerGroup());
}else{
cognosLaunch("ui.gateway",_378.action,"ui.tool","QueryStudio","ui.action","edit","ui.object",_378["ui.object"].value,"ui.backURL",_378["ui.backURL"].value,"ui.routingServerGroup",this.getRoutingServerGroup());
}
};
CViewerManager.prototype.launchAS=function(){
var _37a=document.forms["formWarpRequest"+this.getCVId()];
cognosLaunchInWindow("","menubar=no,toolbar=no,status=yes,location=no,resizable=yes,width=650,height=480","ui.gateway",_37a.action,"ui.tool","AnalysisStudio","ui.action","edit","ui.object",_37a["ui.object"].value,"ui.routingServerGroup",this.getRoutingServerGroup());
};
CViewerManager.prototype.launchRS=function(){
var _37b=document.forms["formWarpRequest"+this.getCVId()];
cognosLaunchInWindow("_blank","menubar=no,toolbar=no,status=yes,location=no,resizable=yes,width=650,height=480","ui.gateway",_37b.action,"ui.tool","ReportStudio","ui.action","edit","ui.profile","Professional","ui.object",_37b["ui.object"].value,"ui.routingServerGroup",this.getRoutingServerGroup());
};
CViewerManager.prototype.returnHome=function(url){
var _37d=document.forms["formWarpRequest"+this.getCVId()];
_37d["ui.backURL"].value=url;
executeBackURL(this.getCVId());
};
CViewerManager.prototype.doPostBack=function(){
var f=document.forms["formWarpRequest"+this.getCVId()];
f.appendChild(createHiddenFormField("b_action","xts.run"));
f.appendChild(createHiddenFormField("m",f["ui.postBack"].value));
f.submit();
};
CViewerManager.prototype.hideAbout=function(){
this.getCV().removeTransparentBackgroundLayer();
var cvId=this.getCV().getId();
if(document.getElementById("viewerAboutDiv"+cvId)){
document.getElementById("viewerAboutDiv"+cvId).parentNode.removeChild(document.getElementById("viewerAboutDiv"+cvId));
}
if(document.getElementById("viewerAboutIframe"+cvId)){
document.getElementById("viewerAboutIframe"+cvId).parentNode.removeChild(document.getElementById("viewerAboutIframe"+cvId));
}
};
function viewerAboutOnKeyDown(evt){
evt=(evt)?evt:((event)?event:null);
var _381=getCrossBrowserNode(evt);
if(evt.keyCode=="13"||evt.keyCode=="27"||evt.keyCode=="32"){
var oCV=window["oCV"+_381.getAttribute("viewerId")];
oCV.m_oCVMgr.hideAbout();
return stopEventBubble(evt);
}
};
CViewerManager.prototype.fileExist=function(_383){
var http=null;
if(window.XMLHttpRequest){
http=new XMLHttpRequest();
}else{
http=new ActiveXObject("Msxml2.XMLHTTP");
}
http.open("HEAD",_383,false);
http.send();
return (http.status==200);
};
CViewerManager.prototype.getAboutBoxImageURL=function(){
var _385="about_"+this.getCV().getProductLocale()+".jpg";
var _386=this.getCV().getWebContentRoot()+"/rv/images/";
var _387=_386+_385;
if(!this.fileExist(_387)){
_387=_386+"about_en.jpg";
}
return _387;
};
CViewerManager.prototype.about=function(){
if(document.getElementById("viewerAbout"+this.getCV().getId())){
this.hideAbout();
}
this.getCV().createTransparentBackgroundLayer();
var _388=650;
var _389=522;
var _38a=document.createElement("iframe");
_38a.id="viewerAboutIframe"+this.getCV().getId();
_38a.style.position="absolute";
_38a.style.zIndex=99;
_38a.style.width=_388+"px";
_38a.style.height=_389+"px";
_38a.setAttribute("src",this.getCV().getWebContentRoot()+"/common/blank.html");
_38a.setAttribute("scrolling","no");
_38a.setAttribute("frameborder","0");
_38a.setAttribute("title",RV_RES.IDS_JS_MODAL_BACK_IFRAME);
_38a.setAttribute("role","presentation");
document.body.appendChild(_38a);
var id=this.getCV().getId();
var _38c=document.createElement("div");
_38c.tabIndex=0;
_38c.onfocus=function(){
document.getElementById("viewerAboutOK"+id).focus();
};
document.body.appendChild(_38c);
var div=document.createElement("div");
div.id="viewerAboutDiv"+this.getCV().getId();
div.style.position="absolute";
div.onkeydown=viewerAboutOnKeyDown;
div.style.zIndex=100;
div.style.width=_388+"px";
div.style.height=_389+"px";
div.style.outline="none";
div.setAttribute("role","dialog");
div.setAttribute("aria-label",RV_RES.RV_ABOUT_DESCRIPTION);
var _38e=this.getAboutBoxImageURL();
var _38f=RV_RES.RV_ABOUT_DESCRIPTION.replace(/"/g,"&quot;")+RV_RES.IDS_PROP_LEGAL.replace(/"/g,"&quot;");
div.innerHTML="<img role=\"img\" id=\"viewerAbout"+this.getCV().getId()+"\" tabIndex=\"0\" alt=\""+_38f+"\" title=\""+_38f+"\" src=\""+_38e+"\" onclick=\""+getCognosViewerObjectString(this.getCV().getId())+".m_oCVMgr.hideAbout()\"></img>";
div.setAttribute("viewerId",this.getCV().getId());
document.body.appendChild(div);
this.createOKButton(div);
var _390=document.createElement("div");
_390.tabIndex=0;
_390.onfocus=function(){
document.getElementById("viewerAbout"+id).focus();
};
document.body.appendChild(_390);
var _391=0;
var _392=0;
if(typeof window.innerHeight!="undefined"){
_391=Math.round((window.innerHeight/2)-(_389/2));
_392=Math.round((window.innerWidth/2)-(_388/2));
}else{
_391=Math.round((document.body.clientHeight/2)-(_389/2));
_392=Math.round((document.body.clientWidth/2)-(_388/2));
}
div.style.bottom=_38a.style.bottom=_391+"px";
div.style.left=_38a.style.left=_392+"px";
setTimeout("document.getElementById('viewerAbout"+id+"').focus();",1);
};
CViewerManager.prototype.createOKButton=function(_393){
var _394=document.createElement("div");
_394.style.backgroundcolor="#FFFFFF";
_394.id="viewerAboutOK"+this.getCV().getId();
_394.setAttribute("role","button");
_394.setAttribute("viewerId",this.getCV().getId());
_394.setAttribute("tabIndex","0");
var _395=this;
_394.onclick=function(){
_395.hideAbout();
};
_394.onkeydown=viewerAboutOnKeyDown;
_394.className="aboutOkButton";
_393.appendChild(_394);
var span=document.createElement("span");
span.style.padding="7px 30px 7px 30px";
span.appendChild(document.createTextNode(RV_RES.IDS_JS_OK));
_394.appendChild(span);
};
CViewerManager.prototype.updateUserName=function(){
var _397=new DataDispatcherEntry(this.getCV());
_397.addFormField("ui.action","CMRequest");
_397.addFormField("CMRequest","<CMRequest><searchPath>~</searchPath><properties><property>defaultName</property></properties></CMRequest>");
_397.addFormField("cv.responseFormat","CMRequest");
_397.addFormField("cv.catchLogOnFault","true");
_397.addFormField("cv.id",this.getCVId());
_397.setCallbacks({"complete":{"object":this,"method":this.updateUserNameCallback}});
_397.setCanBeQueued(true);
this.getCV().dispatchRequest(_397);
};
CViewerManager.prototype.updateUserNameCallback=function(_398){
var _399=this.getUserNameFromResponse(_398);
if(_399!=null){
var _39a="userNameTD"+this.getCVId();
var _39b=document.getElementById(_39a);
if(_39b!=null){
_39b.innerHTML=html_encode(_399);
}
var _39c=this.getCV().rvMainWnd.getBannerToolbar();
if(_39c){
for(var _39d=0;_39d<_39c.getNumItems();_39d++){
if(typeof _39c.get(_39d).getId=="function"&&_39c.get(_39d).getId()==_39a){
_39c.get(_39d).setText(html_encode(_399));
break;
}
}
}
}
};
CViewerManager.prototype.getUserNameFromResponse=function(_39e){
if(_39e){
var _39f=XMLBuilderLoadXMLFromString(_39e.getResult());
var _3a0=XMLHelper_FindChildByTagName(_39f,"defaultName",true);
if(_3a0!=null){
var _3a1=XMLHelper_FindChildByTagName(_3a0,"value",false);
if(_3a1!=null){
return XMLHelper_GetText(_3a1);
}
}
}
return null;
};
CViewerManager.prototype.getAvailableOutput=function(){
var oCV=this.getCV();
var _3a3=document.getElementById("formWarpRequest"+this.getCVId());
var _3a4=new JSONDispatcherEntry(this.getCV());
_3a4.addFormField("ui.action","getAvailableOutputs");
_3a4.addFormField("cv.responseFormat","getAvailableOutputs");
_3a4.addFormField("ui.object",_3a3["ui.object"].value);
_3a4.addFormField("ui.reportVersion",_3a3["ui.reportVersion"].value);
_3a4.addFormField("reRunObj",_3a3["reRunObj"].value);
_3a4.addFormField("ui.outputLocale",_3a3["ui.outputLocale"].value);
_3a4.addFormField("ui.burstKey",_3a3["ui.burstKey"].value);
_3a4.addFormField("cv.id",this.getCVId());
_3a4.setCallbacks({"complete":{"object":this,"method":this.getAvailableOutputResponseCallback}});
oCV.dispatchRequest(_3a4);
};
CViewerManager.prototype.getAvailableOutputResponseCallback=function(_3a5){
var oCV=this.getCV();
oCV.init(_3a5.getJSONResponseObject());
oCV.rvMainWnd.renderAvailableOutputs();
};
CViewerManager.prototype.authenticate=function(_3a7,url){
this.exit();
this.getCV().setKeepSessionAlive(true);
if(window.delCookie){
delCookie("cc_state");
}
if(_3a7=="logon"||_3a7=="relogon"){
location.href=url+"&h_CAM_action=logon&m_reload=";
}
if(_3a7=="logoff"){
location.href=url+"&h_CAM_action=logoff";
}
};
CViewerManager.prototype.launchNewGeneral=function(_3a9,_3aa){
var _3ab=document.getElementById("formWarpRequest"+this.getCVId());
if(_3ab){
var _3ac="";
if(_3ab["reRunObj"]){
_3ac=_3ab["reRunObj"].value;
}else{
_3ac=_3ab["ui.object"].value;
}
var _3ad=this.getCV().getGateway()+"?"+constructGETRequestParamsString("b_action=xts.run&m=portal/viewer-closeIframe.xts&cv.id="+this.getCVId());
var _3ae={"m":"portal/new_general.xts","m_new_class":_3a9,"so.searchPath":_3aa,"m_name":this.getCV().envParams["ui.name"],"m_obj_searchPath":_3ac,"m_obj":_3ac};
_3ae["ui.backURL"]=_3ad;
cvLoadDialog(this.getCV(),_3ae,500,425,RV_RES.IDS_JS_ADD_TO_MY_FOLDERS_IFRAME_TITLE);
}
};
CViewerManager.prototype.addToBookmarks=function(){
var _3af=document.getElementById("formWarpRequest"+this.getCVId());
var _3b0=this.getCV().envParams;
var _3b1="b_action=cognosViewer";
for(var _3b2 in _3b0){
if(_3b2.indexOf("ui.")==0&&_3b2!="ui.primaryAction"&&_3b2!="ui.backURL"&&_3b0!="ui.spec"&&_3b2!="ui.conversation"&&_3b2!="ui.cafcontextid"){
_3b1+="&"+_3b2+"=";
if(_3b2=="ui.action"&&_3b0["ui.primaryAction"]!=""){
_3b1+=encodeURIComponent(_3b0["ui.primaryAction"]);
}else{
_3b1+=encodeURIComponent(_3b0[_3b2]);
}
}
if(_3b2.indexOf("run.")==0){
_3b1+="&"+_3b2+"="+encodeURIComponent(_3b0[_3b2]);
}
}
var sURL=this.getCV().sGateway+"?"+constructGETRequestParamsString(_3b1);
var _3b4="";
if(_3af["ui.action"].value=="view"){
if(typeof _3b0["versionName"]!="undefined"&&_3b0["versionName"]!=""){
_3b4=RV_RES.RV_VIEW_REPORT;
}else{
_3b4=RV_RES.RV_VIEW_RECENT_REPORT;
}
}
if(_3af["ui.action"].value=="run"){
_3b4=RV_RES.RV_RUN_REPORT;
}
if(_3b4!=""){
_3b4+=" - ";
}
_3b4+=_3b0["ui.name"];
window.external.AddFavorite(sURL,_3b4);
};
function leavingRV(){
if(window.gaRV_INSTANCES&&window.gaRV_INSTANCES.length){
for(var _3b5=0;_3b5<window.gaRV_INSTANCES.length;_3b5++){
try{
var oCV=window.gaRV_INSTANCES[_3b5];
if(oCV){
var oRV=oCV.getRV();
if(oRV){
oRV.exit();
}
}
}
catch(e){
}
}
}
};
function viewerMainKeyPress(evt){
evt=(evt)?evt:((event)?event:null);
if(window.gaRV_INSTANCES&&window.gaRV_INSTANCES.length){
for(var _3b9=0;_3b9<window.gaRV_INSTANCES.length;_3b9++){
try{
var oCV=window.gaRV_INSTANCES[_3b9];
if(oCV&&oCV.getId()=="_NS_"){
var _3bb=evt.keyCode;
if(_3bb==0&&typeof evt.charCode!="undefined"){
_3bb=evt.charCode;
}
if(!oCV.getViewerWidget()&&(_3bb=="64"||_3bb=="50")&&evt.shiftKey==true&&evt.ctrlKey==true){
if(oCV.focusBackToMainContent){
oCV.focusBackToMainContent(evt);
return stopEventBubble(evt);
}
}else{
if(!oCV.getViewerWidget()&&(_3bb=="51"||_3bb=="110")&&evt.shiftKey==true&&evt.ctrlKey==true){
var _3bc=document.getElementById("CVNavLinks"+oCV.getId());
if(_3bc){
_3bc.setAttribute("tabIndex","-1");
_3bc.focus();
return stopEventBubble(evt);
}
}else{
if(!oCV.getViewerWidget()&&_3bb=="49"&&evt.shiftKey==true&&evt.ctrlKey==true){
if(oCV.focusBackToContent){
oCV.focusBackToContent(evt);
return stopEventBubble(evt);
}
}
}
}
}
}
catch(e){
}
}
}
};
var g_ViewerResizeTimer=0;
function onResizeViewerEvent(evt){
clearTimeout(g_ViewerResizeTimer);
g_ViewerResizeTimer=setTimeout(resizePinnedContainers,200);
};
function constructGETRequestParamsString(_3be){
if(typeof CAFXSSEncode=="function"){
if(_3be.indexOf("?")>=0){
var _3bf=_3be.split("?");
return _3bf[0]+"?"+CAFXSSEncode(_3bf[_3bf.length-1]);
}
return CAFXSSEncode(_3be);
}else{
return _3be;
}
};
function sortReportHistoryStackDescending(a,b){
return (b.getIdx()-a.getIdx());
};
function sortReportHistoryStackAscending(a,b){
return (b.getIdx()-a.getIdx());
};
gToolbarButtonStyle=new CUIStyle("toolbarButton","toolbarButtonOver","toolbarButtonPressed","toolbarButtonOverPressed","toolbarButton");
gToolbarStyle=new CUIStyle("mainViewerHeader3","","","","");
gBannerButtonStyle=new CUIStyle("bannerToolbarButton","bannerToolbarButtonOver","","","");
gBannerToolbarStyle=new CUIStyle("bannerButtonContainer","","","","");
gMenuItemStyle=new CUIStyle("menuItem_normal","menuItem_hover","","","menuItem_disabled");
gMenuStyle=new CUIStyle("clsMenu","","","","");
gMenuSeperatorStyle=new CUIStyle("menuHorizontalSeperator","","","","");
gBannerItemStyle=new CUIStyle("bannerMenuItem","bannerMenuItemOver","","","");
gBannerStaticText=new CUIStyle("bannerText","","","","");
gBannerLink=new CUIStyle("bannerLink","bannerLink","","","");
gMenuSeperator=new CSeperator("horizontal_line","1",gMenuSeperatorStyle);
gToolbarSeperator=new CSeperator("horizonal_blank","5");
function CMainWnd(oCV){
this.setCV(oCV);
this.m_contextMenu=null;
this.m_reportHistoryList=[];
this.m_currentFormat="";
this.m_toolbar=null;
this.m_bannerToolbar=null;
this.m_browserHistoryIndex=history.length;
this.m_showContextMenuOnClick=false;
if(oCV.getConfig&&oCV.getConfig()){
var _3c5=oCV.getConfig().getEventsConfig();
this.m_showContextMenuOnClick=_3c5?_3c5.getShowContextMenuOnClick():false;
}
};
CMainWnd.prototype=new CViewerHelper();
CMainWnd.prototype.setBannerToolbar=function(_3c6){
this.m_bannerToolbar=new CViewerToolbar();
this.m_bannerToolbar.init(_3c6);
};
CMainWnd.prototype.getBannerToolbar=function(){
if(this.m_bannerToolbar){
return this.m_bannerToolbar.getCBar();
}
return null;
};
CMainWnd.prototype.closeContextMenuAndToolbarMenus=function(){
var _3c7=this.getToolbar();
if(_3c7){
_3c7.closeMenus();
}
var cm=this.getContextMenu();
if(cm){
cm.m_contextMenu.remove();
}
};
CMainWnd.prototype.setToolbar=function(_3c9){
this.m_toolbar=new CViewerToolbar();
this.m_toolbar.init(_3c9);
};
CMainWnd.prototype.getToolbar=function(){
if(this.m_toolbar){
return this.m_toolbar.getCBar();
}
return null;
};
CMainWnd.prototype.getToolbarControl=function(){
return this.m_toolbar;
};
CMainWnd.prototype.setCurrentFormat=function(_3ca){
this.m_currentFormat=_3ca;
};
CMainWnd.prototype.updateToolbar=function(_3cb){
this.updateCurrentFormat(_3cb,this.getCV().getWebContentRoot());
this.updateKeepThisVersion();
};
CMainWnd.prototype.updateKeepThisVersion=function(){
if(this.getCV().getStatus()=="complete"){
var _3cc=this.getCV().getSecondaryRequests();
var _3cd=false;
var _3ce=false;
var _3cf=false;
if(_3cc){
for(var _3d0=0;_3d0<_3cc.length;_3d0++){
switch(_3cc[_3d0]){
case "save":
_3cd=true;
break;
case "saveAs":
_3ce=true;
break;
case "email":
_3cf=true;
break;
}
}
}
var _3d1=this.getToolbarControl();
if(_3d1){
var _3d2=_3d1.getItem("keepThisVersion");
if(_3d2){
if(!_3cd&&!_3ce&&!_3cf){
_3d2.hide();
}else{
_3d2.show();
}
var _3d3=_3d2.getMenu();
if(_3cd||_3ce||_3cf){
if(_3d3){
var _3d4=_3d3.getItem("saveReport");
if(_3d4){
if(_3cd){
_3d4.show();
}else{
_3d4.hide();
}
}
var _3d5=_3d3.getItem("saveAsReportView");
if(_3d5){
if(_3ce){
_3d5.show();
}else{
_3d5.hide();
}
}
var _3d6=_3d3.getItem("emailReport");
if(_3d6){
if(_3cf){
_3d6.show();
}else{
_3d6.hide();
}
}
}
}
}
}
}
};
function CMainWnd_updateCurrentFormat(_3d7,_3d8){
var _3d9="";
var _3da="";
switch(_3d7){
case "HTML":
case "HTMLFragment":
case "XHTMLFRGMT":
_3d9=_3d8+"/rv/images/action_view_html.gif";
_3da=RV_RES.RV_VIEW_HTML;
break;
case "PDF":
_3d9=_3d8+"/rv/images/action_view_pdf.gif";
_3da=RV_RES.RV_VIEW_PDF;
break;
case "XML":
_3d9=_3d8+"/rv/images/action_view_xml.gif";
_3da=RV_RES.RV_VIEW_XML;
break;
}
if(_3d9!=""&&_3da!=""){
var _3db=this.getToolbarControl();
if(_3db){
var _3dc=this.getCV().envParams["ui.action"]=="view";
var _3dd=null;
if(_3dc){
_3dd=_3db.getItem("viewIn");
}else{
_3dd=_3db.getItem("runIn");
}
if(_3dd){
_3dd.setIcon(_3d9);
_3dd.setToolTip(_3da);
var sRV=this.getCVObjectRef()+".getRV().";
_3dd.setAction("javascript:"+sRV+"viewReport('"+_3d7+"');");
}
}
}
this.setCurrentFormat(_3d7);
};
CMainWnd.prototype.getCurrentFormat=function(){
return this.m_currentFormat;
};
function CMainWnd_getSelectionController(){
var _3df;
try{
_3df=getCognosViewerSCObjectRef(this.getCV().getId());
}
catch(e){
_3df=null;
}
return _3df;
};
var g_oPressTimer=null;
var g_bLongPressDetected=false;
var g_oPreviousValues={};
if(window.attachEvent){
window.attachEvent("onmouseout",f_cancelLongTouch);
window.attachEvent("ontouchstart",onTouchStart);
window.attachEvent("ontouchend",f_cancelLongTouch);
window.attachEvent("ontouchleave",f_cancelLongTouch);
window.attachEvent("ontouchcancel",f_cancelLongTouch);
}else{
if(window.addEventListener){
window.addEventListener("mouseout",f_cancelLongTouch);
window.addEventListener("touchstart",onTouchStart);
window.addEventListener("touchend",f_cancelLongTouch);
window.addEventListener("touchleave",f_cancelLongTouch);
window.addEventListener("touchcancel",f_cancelLongTouch);
}
}
function f_cancelLongTouch(evt){
if(isIOS()){
if(g_oPressTimer!==null){
clearTimeout(g_oPressTimer);
g_oPressTimer=null;
}
}
};
function onTouchStart(evt){
if(isIOS()){
g_bLongPressDetected=false;
g_oPressTimer=setTimeout(function(){
var node=getNodeFromEvent(evt);
g_oPreviousValues.webkitTouchCallout=node.style.getPropertyValue("webkitTouchCallout");
g_oPreviousValues.webkitUserSelect=node.style.getPropertyValue("webkitUserSelect");
node.style.webkitTouchCallout="None";
node.style.webkitUserSelect="None";
g_bLongPressDetected=true;
},1500);
}
return false;
};
function CMainWnd_pageClicked(evt){
var oCV=this.getCV();
f_cancelLongTouch(evt);
if(this.m_showContextMenuOnClick||(isIOS()&&g_bLongPressDetected)){
var node=getNodeFromEvent(evt);
if(node&&typeof node.onclick!="function"&&(node.nodeName.toLowerCase()!="span"||typeof node.parentNode.onclick!="function")){
oCV.dcm(evt,true);
if(isIOS()&&g_bLongPressDetected){
node.style.webkitTouchCallout=g_oPreviousValues.webkitTouchCallout;
node.style.webkitUserSelect=g_oPreviousValues.webkitUserSelect;
}
return stopEventBubble(evt);
}
}
this.hideOpenMenus();
if(oCV!=null){
if(typeof oCV.sortColumn=="undefined"||!oCV.sortColumn(evt)){
var _3e6=oCV.getDrillMgr();
if(_3e6){
var _3e7=_3e6.singleClickDrillEvent(evt,"RV");
}
}
}
if(oCV.getViewerWidget()){
oCV.getViewerWidget().updateToolbar();
}
setNodeFocus(evt);
if(_3e7){
return stopEventBubble(evt);
}
};
function CMainWnd_hideOpenMenus(){
var cm=this.getContextMenu();
if(typeof cm!="undefined"&&cm!=null){
cm.hide();
}
var tb=this.getToolbar();
if(typeof tb!="undefined"&&tb!=null){
tb.closeMenus();
}
var _3ea=this.getBannerToolbar();
if(_3ea!="undefined"&&_3ea!=null){
_3ea.closeMenus();
}
};
function CMainWnd_draw(){
var _3eb=this.getToolbar();
if(_3eb&&this.m_uiBlackList.indexOf(" RV_TOOLBAR_BUTTONS ")){
var _3ec="";
var f=document.forms["formWarpRequest"+this.getCVId()];
if(f["run.outputFormat"]&&f["run.outputFormat"].value){
_3ec=f["run.outputFormat"].value;
}else{
if(f["ui.format"]&&f["ui.format"].value){
_3ec=f["ui.format"].value;
}
}
if(_3ec!=""){
this.updateCurrentFormat(_3ec,this.getCV().getWebContentRoot());
}
_3eb.draw();
}
var _3ee=this.getBannerToolbar();
if(_3ee){
_3ee.draw();
}
};
function CMainWnd_addToReportHistory(_3ef){
this.m_reportHistoryList[this.m_reportHistoryList.length]=_3ef;
};
function CMainWnd_getReportHistory(){
return this.m_reportHistoryList;
};
function CMainWnd_getContextMenu(){
return this.m_contextMenu;
};
function CMainWnd_displayContextMenu(evt,_3f1){
if(!this.getCV().bEnableContextMenu){
return false;
}
evt=(evt)?evt:((event)?event:null);
var _3f2=this.getSelectionController();
if(_3f2!=null){
var cm=this.getContextMenu();
if(_3f1&&this.getCV().bCanUseCognosViewerSelection==true){
if(!_3f2.pageContextClicked(evt)){
if(typeof cm!="undefined"&&cm!=null){
cm.m_contextMenu.remove();
}
return false;
}
}
cm=this.getContextMenu();
if(typeof cm!="undefined"&&cm!=null){
cm.draw(evt);
if(!isIE()){
cm.m_contextMenu.m_focusCell=getNodeFromEvent(evt);
}
}
var tb=this.getToolbar();
if(typeof tb!="undefined"&&tb!=null){
tb.closeMenus();
}
var _3f5=this.getBannerToolbar();
if(_3f5!="undefined"&&_3f5!=null){
_3f5.closeMenus();
}
}
};
function CMainWnd_getReportHistoryLength(){
return this.m_reportHistoryList.length;
};
function CMainWnd_executePreviousReport(_3f6){
if(_3f6==-1){
_3f6=this.getReportHistoryLength()-1;
}
for(var i=0;i<this.getReportHistoryLength();++i){
var _3f8=this.m_reportHistoryList[i];
if(_3f8.getIdx()==_3f6){
_3f8.execute();
return;
}
}
};
function CMainWnd_getReportHistoryConversations(){
var _3f9=[];
var _3fa=this.getReportHistory();
for(var _3fb=0;_3fb<_3fa.length;++_3fb){
var _3fc=_3fa[_3fb];
var _3fd=_3fc.getTrackingInfo();
if(_3fd!=""){
_3f9.push(_3fd);
}
}
return _3f9;
};
function CMainWnd_getUIHide(){
return this.m_uiBlackList;
};
CMainWnd.prototype.loadPreviousReports=function(){
var _3fe=this.getCV().envParams["cv.previousReports"];
if(typeof _3fe!="undefined"&&_3fe!=null){
var _3ff=XMLBuilderLoadXMLFromString(_3fe);
var _400=XMLHelper_GetFirstChildElement(_3ff);
if(XMLHelper_GetLocalName(_400)=="previousReports"){
var _401=_400.childNodes;
for(var _402=0;_402<_401.length;++_402){
var _403=_401[_402];
var _404=_403.childNodes;
var _405="";
var _406={};
for(var _407=0;_407<_404.length;++_407){
var _408=_404[_407].getAttribute("name");
switch(_408){
case "ui.name":
_405=XMLHelper_GetText(_404[_407]);
break;
default:
_406[_408]=XMLHelper_GetText(_404[_407]);
break;
}
}
this.addToReportHistory(new CReportHistory(this,_402,_405,_406));
}
}
}
};
CMainWnd.prototype.init=function(){
this.m_uiBlackList="";
if(typeof this.getCV().UIBlacklist=="string"){
this.m_uiBlackList=this.getCV().UIBlacklist;
}
if((typeof gCognosViewer!="undefined")&&(gCognosViewer.envParams["isTitan"])&&(gCognosViewer.envParams["isTitan"]==true)){
gMenuItemStyle=new CUIStyle("titanui menuItem_normal","titanui menuItem_hover","","","titanui menuItem_disabled");
}
this.m_contextMenu=null;
if(this.getCV().bEnableContextMenu&&typeof CContextMenu!="undefined"&&this.m_uiBlackList.indexOf(" RV_CONTEXT_MENU ")==-1){
this.m_contextMenu=new CContextMenu(this);
}
this.loadPreviousReports();
gMenuSeperator.setWebContentRoot(this.getCV().getWebContentRoot());
gToolbarSeperator.setWebContentRoot(this.getCV().getWebContentRoot());
};
CMainWnd.prototype.renderPreviousReports=function(){
var _409=this.getToolbarControl();
var _40a=_409.getItem("previousReport");
var _40b=this.getCV().getWebContentRoot();
var _40c=this.getCV().getSkin();
if(_40a){
var _40d=_40a.getMenu();
var _40e=this.getReportHistory();
for(var _40f=0;_40f<_40e.length;++_40f){
var _410=_40e[_40f];
new CMenuItem(_40d,_410.getReportName(),"javascript:"+this.getCV().getObjectId()+".rvMainWnd.executePreviousReport("+_40f+");",_40b+_410.getDropDownMenuIcon(),gMenuItemStyle,_40b,_40c);
}
_40d.draw();
}
};
function CMainWnd_update(_411){
if(typeof _411=="undefined"||_411===null){
return;
}
if(_411 instanceof CSelectionController){
var _412=this.getToolbarControl();
if(typeof _412!="undefined"&&_412!=null){
var _413=this.getCV().getDrillMgr();
if(_413){
var _414=_412.getItem("goto");
if(_414){
var menu=_414.getMenu();
if(menu){
menu.clear();
}
}
var _416=_412.getItem("drillDown");
if(_416){
if(_413.canDrillDown()){
_416.enable();
}else{
_416.disable();
}
}
var _417=_412.getItem("drillUp");
if(_417){
if(_413.canDrillUp()){
_417.enable();
}else{
_417.disable();
}
}
}
var _418=_412.getItem("lineage");
if(_418){
var _419=_411.getAllSelectedObjects();
if(_419!=null&&_419.length>0){
_418.enable();
}else{
_418.disable();
}
}
}
var _41a=this.getContextMenu();
if(typeof _41a!="undefined"&&_41a!=null){
_41a.update(_411);
}
}
};
function CMainWnd_addDrillTargets(_41b){
this.m_oCV.addDrillTargets(_41b);
};
function CMainWnd_getDrillTargets(){
return this.m_oCV.getDrillTargets();
};
function CMainWnd_getDrillTarget(idx){
return this.m_oCV.getDrillTarget(idx);
};
function CMainWnd_getNumberOfDrillTargets(){
return this.m_oCV.getNumberOfDrillTargets();
};
CMainWnd.prototype.renderAvailableOutputs=function(){
var _41d=this.getCVObjectRef()+".getRV().";
var oCV=this.getCV();
var _41f=this.getToolbarControl();
var _420=this.getUIHide();
var _421=oCV.getWebContentRoot();
var _422=oCV.getSkin();
var _423=null;
var _424=null;
if(typeof _41f!="undefined"&&_41f!=null){
_423=_41f.getItem("viewIn");
if(_423){
_424=_423.getMenu();
}
}
if(_424.getNumItems()==0){
if(_420.indexOf(" RV_TOOLBAR_BUTTONS_HTML ")==-1){
this.m_viewInHtmlButton=new CMenuItem(_424,RV_RES.RV_VIEW_HTML,"javascript:"+_41d+"viewReport('HTML');",_421+"/rv/images/action_view_html.gif",gMenuItemStyle,_421,_422);
if(oCV.oOutputFormatPath.HTML==""){
this.m_viewInHtmlButton.disable();
}
}
if(_420.indexOf(" RV_TOOLBAR_BUTTONS_PDF ")==-1){
this.m_viewInPDFButton=new CMenuItem(_424,RV_RES.RV_VIEW_PDF,"javascript:"+_41d+"viewReport('PDF');",_421+"/rv/images/action_view_pdf.gif",gMenuItemStyle,_421,_422);
if(oCV.oOutputFormatPath.PDF==""){
this.m_viewInPDFButton.disable();
}
}
if(_420.indexOf(" RV_TOOLBAR_BUTTONS_XML ")==-1){
this.m_viewInXMLButton=new CMenuItem(_424,RV_RES.RV_VIEW_XML,"javascript:"+_41d+"viewReport('XML');",_421+"/rv/images/action_view_xml.gif",gMenuItemStyle,_421,_422);
if(oCV.oOutputFormatPath.XML==""){
this.m_viewInXMLButton.disable();
}
}
if(_420.indexOf(" RV_TOOLBAR_BUTTONS_XLS ")==-1){
this.m_viewInXLSButton=new CMenuItem(_424,RV_RES.RV_VIEW_OPTIONS,"",_421+"/rv/images/action_view_excel_options.gif",gMenuItemStyle,_421,_422);
this.excelFormatCascadedMenu=this.m_viewInXLSButton.createCascadedMenu(gMenuStyle,RV_RES.RV_VIEW_OPTIONS);
if(_420.indexOf(" RV_TOOLBAR_BUTTONS_XLS_SPREADSHEETML_DATA ")==-1){
this.viewInSpreadsheetMLDataMenuItem=new CMenuItem(this.excelFormatCascadedMenu,RV_RES.RV_VIEW_SPREADSHEETML_DATA,"javascript:"+_41d+"viewReport('xlsxData');",_421+"/rv/images/action_view_excel_2007.gif",gMenuItemStyle,_421,_422);
if(oCV.oOutputFormatPath.xlsxData==""){
this.viewInSpreadsheetMLDataMenuItem.disable();
}
}
if(_420.indexOf(" RV_TOOLBAR_BUTTONS_XLS_SPREADSHEETML ")==-1){
this.viewInSpreadsheetMLMenuItem=new CMenuItem(this.excelFormatCascadedMenu,RV_RES.RV_VIEW_SPREADSHEETML,"javascript:"+_41d+"viewReport('spreadsheetML');",_421+"/rv/images/action_view_excel_2007.gif",gMenuItemStyle,_421,_422);
if(oCV.oOutputFormatPath.spreadsheetML==""){
this.viewInSpreadsheetMLMenuItem.disable();
}
}
if(_420.indexOf(" RV_TOOLBAR_BUTTONS_XLS_XLWA ")==-1){
this.viewInXLSWebArchiveMenuItem=new CMenuItem(this.excelFormatCascadedMenu,RV_RES.RV_VIEW_XLWA,"javascript:"+_41d+"viewReport('XLWA');",_421+"/rv/images/action_view_excel_2002.gif",gMenuItemStyle,_421,_422);
if(oCV.oOutputFormatPath.XLWA==""){
this.viewInXLSWebArchiveMenuItem.disable();
}
}
if(_420.indexOf(" RV_TOOLBAR_BUTTONS_XLS_SINGLEXLS ")==-1){
this.viewInSingleXLSMenuItem=new CMenuItem(this.excelFormatCascadedMenu,RV_RES.RV_VIEW_SINGLE_EXCEL,"javascript:"+_41d+"viewReport('singleXLS');",_421+"/rv/images/action_view_excel_options.gif",gMenuItemStyle,_421,_422);
if(oCV.oOutputFormatPath.singleXLS==""){
this.viewInSingleXLSMenuItem.disable();
}
}
if(_420.indexOf(" RV_TOOLBAR_BUTTONS_XLS_XLS ")==-1){
this.viewInSingleXLSMenuItem=new CMenuItem(this.excelFormatCascadedMenu,RV_RES.RV_VIEW_EXCEL,"javascript:"+_41d+"viewReport('XLS');",_421+"/rv/images/action_view_excel_2000.gif",gMenuItemStyle,_421,_422);
if(oCV.oOutputFormatPath.XLS==""){
this.viewInSingleXLSMenuItem.disable();
}
}
if(_420.indexOf(" RV_TOOLBAR_BUTTONS_XLS_CSV ")==-1){
var _425="";
if(getViewerDirection()=="rtl"){
_425="/rv/images/action_view_csv_rtl.gif";
}else{
_425="/rv/images/action_view_csv.gif";
}
this.viewInCSVMenuItem=new CMenuItem(this.excelFormatCascadedMenu,RV_RES.RV_VIEW_CSV,"javascript:"+_41d+"viewReport('CSV');",_421+_425,gMenuItemStyle,_421,_422);
if(oCV.oOutputFormatPath.CSV==""){
this.viewInCSVMenuItem.disable();
}
}
}
}
_424.draw();
if(_424.isVisible()){
_424.show();
}
};
CMainWnd.prototype.saveReportHistoryAsXML=function(){
var _426="";
var _427=this.getReportHistory();
if(_427.length>0){
var _428=self.XMLBuilderCreateXMLDocument("previousReports");
var _429=0;
if(_427.length>20){
_429=_427.length-20;
}
for(var _42a=_429;_42a<_427.length;++_42a){
_427[_42a].saveAsXML(_428.documentElement);
}
_426=XMLBuilderSerializeNode(_428);
}
return _426;
};
CMainWnd.prototype.addCurrentReportToReportHistory=function(){
var oCV=this.getCV();
var _42c={};
var _42d=oCV.envParams["ui.name"];
var _42e=oCV.envParams["ui.action"];
if(_42e=="view"){
_42c["ui.action"]="view";
_42c["ui.format"]=oCV.envParams["ui.format"];
}else{
_42c["ui.action"]="currentPage";
_42c["ui.conversation"]=oCV.getConversation();
_42c["m_tracking"]=oCV.getTracking();
_42c["run.outputFormat"]=oCV.envParams["run.outputFormat"];
if(oCV.envParams["rapReportInfo"]){
_42c["rapReportInfo"]=oCV.envParams["rapReportInfo"];
}
if(oCV.envParams.limitedInteractiveMode){
_42c.limitedInteractiveMode=oCV.envParams.limitedInteractiveMode;
}
if(oCV.envParams["ui.spec"]){
_42c["ui.spec"]=oCV.envParams["ui.spec"];
}
if(oCV.envParams.uiSpecAddedFromRun){
_42c.uiSpecAddedFromRun=oCV.envParams.uiSpecAddedFromRun;
}
}
if(typeof oCV.envParams["ui.object"]!="undefined"){
_42c["ui.object"]=oCV.envParams["ui.object"];
}else{
_42c["ui.spec"]=oCV.envParams["ui.spec"];
_42c["ui.object"]="";
}
_42c["ui.primaryAction"]=oCV.envParams["ui.primaryAction"];
if(oCV.envParams["ui.routingServerGroup"]){
_42c["ui.routingServerGroup"]=oCV.envParams["ui.routingServerGroup"];
}
this.addToReportHistory(new CReportHistory(this,this.m_reportHistoryList.length,_42d,_42c));
};
CMainWnd.prototype.draw=CMainWnd_draw;
CMainWnd.prototype.addDrillTargets=CMainWnd_addDrillTargets;
CMainWnd.prototype.getDrillTarget=CMainWnd_getDrillTarget;
CMainWnd.prototype.getDrillTargets=CMainWnd_getDrillTargets;
CMainWnd.prototype.getNumberOfDrillTargets=CMainWnd_getNumberOfDrillTargets;
CMainWnd.prototype.addToReportHistory=CMainWnd_addToReportHistory;
CMainWnd.prototype.getReportHistoryLength=CMainWnd_getReportHistoryLength;
CMainWnd.prototype.getReportHistory=CMainWnd_getReportHistory;
CMainWnd.prototype.executePreviousReport=CMainWnd_executePreviousReport;
CMainWnd.prototype.getContextMenu=CMainWnd_getContextMenu;
CMainWnd.prototype.displayContextMenu=CMainWnd_displayContextMenu;
CMainWnd.prototype.hideOpenMenus=CMainWnd_hideOpenMenus;
CMainWnd.prototype.pageClicked=CMainWnd_pageClicked;
CMainWnd.prototype.getUIHide=CMainWnd_getUIHide;
CMainWnd.prototype.update=CMainWnd_update;
CMainWnd.prototype.getSelectionController=CMainWnd_getSelectionController;
CMainWnd.prototype.getReportHistoryConversations=CMainWnd_getReportHistoryConversations;
CMainWnd.prototype.updateCurrentFormat=CMainWnd_updateCurrentFormat;
function resizeIFrame(evt){
var oCV=window.gaRV_INSTANCES[0];
var _431=document.getElementById("CVReport"+oCV.getId());
var _432=document.getElementById("CVIFrame"+oCV.getId());
if(typeof _431!="undefined"&&_431!=null&&typeof _432!="undefined"&&_432!=null){
oCV.attachedOnResize=true;
oCV.setMaxContentSize();
_432.style.height="99%";
}
};
function CognosViewerAction(){
this.m_oCV=null;
};
CognosViewerAction.prototype.setRequestParms=function(_433){
};
CognosViewerAction.prototype.onMouseOver=function(evt){
return false;
};
CognosViewerAction.prototype.onMouseOut=function(evt){
return false;
};
CognosViewerAction.prototype.onMouseDown=function(evt){
return false;
};
CognosViewerAction.prototype.onClick=function(evt){
return false;
};
CognosViewerAction.prototype.onDoubleClick=function(evt){
return false;
};
CognosViewerAction.prototype.updateMenu=function(_439){
return _439;
};
CognosViewerAction.prototype.addAdditionalOptions=function(_43a){
};
CognosViewerAction.prototype.genSelectionContextWithUniqueCTXIDs=function(){
return false;
};
CognosViewerAction.prototype.doUndo=function(){
if(typeof console!="undefined"){
console.log("Required method doUndo not implemented.");
}
};
CognosViewerAction.prototype.doRedo=function(){
if(typeof console!="undefined"){
console.log("Required method doRedo not implemented.");
}
};
CognosViewerAction.prototype.forceRunSpecRequest=function(){
return false;
};
CognosViewerAction.prototype.preProcess=function(){
};
CognosViewerAction.prototype.setCognosViewer=function(oCV){
this.m_oCV=oCV;
};
CognosViewerAction.prototype.getCognosViewer=function(){
return this.m_oCV;
};
CognosViewerAction.prototype.getUndoRedoQueue=function(){
if(this.getCognosViewer().getViewerWidget()){
return this.getCognosViewer().getViewerWidget().getUndoRedoQueue();
}
return null;
};
CognosViewerAction.prototype.getViewerWidget=function(){
return this.m_oCV.getViewerWidget();
};
CognosViewerAction.prototype.getObjectDisplayName=function(){
var _43c="";
if(this.m_oCV!=null){
if(typeof this.m_oCV.envParams["reportpart_id"]!="undefined"){
_43c=this.m_oCV.envParams["reportpart_id"];
}else{
if(typeof this.m_oCV.envParams["ui.name"]!="undefined"){
_43c=this.m_oCV.envParams["ui.name"];
}
}
}
return _43c;
};
CognosViewerAction.prototype.getContainerId=function(_43d){
var _43e="";
if(_43d&&_43d.getAllSelectedObjects){
var _43f=_43d.getAllSelectedObjects();
if(_43f){
var _440=_43f[0];
if(_440&&_440.getLayoutElementId){
_43e=this.removeNamespace(_440.getLayoutElementId());
}
}
}
return _43e;
};
CognosViewerAction.prototype.removeNamespace=function(_441){
var _442=_441;
try{
if(_441!=""){
var _443=_441.indexOf(this.m_oCV.getId());
if(_443!=-1){
_441=_441.replace(this.m_oCV.getId(),"");
}
}
return _441;
}
catch(e){
return _442;
}
};
CognosViewerAction.prototype.doAddActionContext=function(){
return true;
};
CognosViewerAction.prototype.getSelectionContext=function(){
return getViewerSelectionContext(this.m_oCV.getSelectionController(),new CSelectionContext(this.m_oCV.envParams["ui.object"]),this.genSelectionContextWithUniqueCTXIDs());
};
CognosViewerAction.prototype.getNumberOfSelections=function(){
var _444=-1;
if(this.m_oCV!=null&&this.m_oCV.getSelectionController()!=null){
_444=this.m_oCV.getSelectionController().getSelections().length;
}
return _444;
};
CognosViewerAction.prototype.buildDynamicMenuItem=function(_445,_446){
_445.action={name:"LoadMenu",payload:{action:_446}};
_445.items=[{"name":"loading","label":RV_RES.GOTO_LOADING,iconClass:"loading"}];
return _445;
};
CognosViewerAction.prototype.createCognosViewerDispatcherEntry=function(_447){
var oReq=new ViewerDispatcherEntry(this.getCognosViewer());
oReq.addFormField("ui.action",_447);
this.preProcess();
if(this.doAddActionContext()===true){
var _449=this.addActionContext();
oReq.addFormField("cv.actionContext",_449);
if(window.gViewerLogger){
window.gViewerLogger.log("Action context",_449,"xml");
}
}
oReq.addFormField("ui.object",this.m_oCV.envParams["ui.object"]);
if(typeof this.m_oCV.envParams["ui.spec"]!="undefined"){
oReq.addFormField("ui.spec",this.m_oCV.envParams["ui.spec"]);
}
if(this.m_oCV.getModelPath()!==""){
oReq.addFormField("modelPath",this.m_oCV.getModelPath());
}
if(typeof this.m_oCV.envParams["packageBase"]!="undefined"){
oReq.addFormField("packageBase",this.m_oCV.envParams["packageBase"]);
}
if(typeof this.m_oCV.envParams["rap.state"]!="undefined"){
oReq.addFormField("rap.state",this.m_oCV.envParams["rap.state"]);
}
if(typeof this.m_oCV.envParams["rapReportInfo"]!="undefined"){
oReq.addFormField("rap.reportInfo",this.m_oCV.envParams["rapReportInfo"]);
}
this.addAdditionalOptions(oReq);
return oReq;
};
CognosViewerAction.prototype.fireModifiedReportEvent=function(){
try{
var _44a=this.getCognosViewer().getViewerWidget();
if(_44a){
var _44b={"modified":true};
_44a.fireEvent("com.ibm.bux.widget.modified",null,_44b);
}
}
catch(e){
}
};
CognosViewerAction.prototype.showCustomCursor=function(evt,id,_44e){
var _44f=document.getElementById(id);
if(_44f==null){
_44f=document.createElement("span");
_44f.className="customCursor";
_44f.setAttribute("id",id);
document.body.appendChild(_44f);
}
var _450="<img src=\""+this.getCognosViewer().getWebContentRoot()+_44e+"\"/>";
_44f.innerHTML=_450;
_44f.style.position="absolute";
_44f.style.left=(evt.clientX+15)+"px";
_44f.style.top=(evt.clientY+15)+"px";
_44f.style.display="inline";
};
CognosViewerAction.prototype.hideCustomCursor=function(id){
var _452=document.getElementById(id);
if(_452!=null){
_452.style.display="none";
}
};
CognosViewerAction.prototype.selectionHasContext=function(){
var _453=this.getCognosViewer().getSelectionController().getAllSelectedObjects();
var _454=false;
if(_453!=null&&_453.length>0){
for(var i=0;i<_453.length;i++){
if(_453[i].hasContextInformation()){
_454=true;
break;
}
}
}
return _454;
};
CognosViewerAction.prototype.isInteractiveDataContainer=function(_456){
var _457=false;
if(typeof _456!="undefined"&&_456!=null){
var id=_456.toLowerCase();
_457=id=="crosstab"||id=="list"||this.getCognosViewer().getRAPReportInfo().isChart(id);
}
return _457;
};
CognosViewerAction.prototype.getSelectedContainerId=function(){
var _459=this.getCognosViewer();
var _45a=_459.getSelectionController();
var _45b=null;
if(_45a!=null&&typeof _45a!="undefined"){
_45b=this.getContainerId(_45a);
}
return _45b;
};
CognosViewerAction.prototype.getSelectedReportInfo=function(){
var _45c=this.getCognosViewer();
var _45d=this.getSelectedContainerId();
var _45e=this.getReportInfo(_45d);
if(_45e==null){
var _45f=_45c.getRAPReportInfo();
if(_45f.getContainerCount()==1){
_45e=_45f.getContainerFromPos(0);
}
}
return _45e;
};
CognosViewerAction.prototype.getReportInfo=function(_460){
var _461=null;
if(_460!=null&&_460.length>0){
var _462=this.getCognosViewer();
var _463=_462.getRAPReportInfo();
_461=_463.getContainer(_460);
}
return _461;
};
CognosViewerAction.prototype.isSelectionOnChart=function(){
var _464=this.getCognosViewer();
if(_464.getSelectionController().hasSelectedChartNodes()){
return true;
}
var _465=this.getContainerId(_464.getSelectionController());
if(typeof _465!="undefined"){
var _466=this.getReportInfo(_465);
if(_466!=null&&_466.displayTypeId){
var _467=_466.displayTypeId.toLowerCase();
return _464.getRAPReportInfo().isChart(_467);
}
}
return false;
};
CognosViewerAction.prototype.ifContainsInteractiveDataContainer=function(){
var _468=this.getCognosViewer().getRAPReportInfo();
if(_468){
return _468.containsInteractiveDataContainer();
}
return false;
};
CognosViewerAction.prototype.isPromptWidget=function(){
var oCV=this.getCognosViewer();
if(oCV.getRAPReportInfo()&&oCV.getRAPReportInfo().isPromptPart()){
return true;
}
return false;
};
CognosViewerAction.prototype.getLayoutComponents=function(){
var _46a=[];
var _46b=document.getElementById("rt"+this.m_oCV.getId());
if(_46b!=null){
_46a=getElementsByAttribute(_46b,"*","lid");
}
return _46a;
};
CognosViewerAction.prototype.addClientContextData=function(_46c){
var _46d=this.m_oCV.getSelectionController();
if(typeof _46d!="undefined"&&_46d!=null&&typeof _46d.getCCDManager!="undefined"&&_46d.getCCDManager()!=null){
var _46e=_46d.getCCDManager();
return ("<md>"+xml_encode(_46e.MetadataToJSON())+"</md>"+"<cd>"+xml_encode(_46e.ContextDataSubsetToJSON(_46c))+"</cd>");
}
return "";
};
CognosViewerAction.prototype.getDataItemInfoMap=function(){
var _46f=this.m_oCV.getSelectionController();
if(typeof _46f!="undefined"&&_46f!=null&&typeof _46f.getCCDManager!="undefined"&&_46f.getCCDManager()!=null){
var _470=_46f.getCCDManager();
return ("<di>"+xml_encode(_470.DataItemInfoToJSON())+"</di>");
}
return "";
};
CognosViewerAction.prototype.getRAPLayoutTag=function(_471){
var _472=null;
if(typeof _471=="object"&&_471!=null){
_472=_471.getAttribute("rap_layout_tag");
}
return _472;
};
CognosViewerAction.prototype.addMenuItemChecked=function(_473,_474,_475){
if(_473){
if(this.getCognosViewer().isHighContrast()){
_474["class"]="menuItemSelected";
}
_474.iconClass="menuItemChecked";
}else{
if(_475&&_475.length>0){
_474.iconClass=_475;
}
}
};
CognosViewerAction.prototype.gatherFilterInfoBeforeAction=function(_476){
var _477=this.getCognosViewer().getViewerWidget();
_477.filterRequiredAction=_476;
_477.clearRAPCache();
_477.fireEvent("com.ibm.bux.widget.action",null,{action:"canvas.filters"});
};
CognosViewerAction.prototype.addClientSideUndo=function(_478,_479){
var _47a=GUtil.generateCallback(_478.doUndo,_479,_478);
var _47b=GUtil.generateCallback(_478.doRedo,_479,_478);
this.getUndoRedoQueue().addClientSideUndo({"tooltip":_478.getUndoHint(),"undoCallback":_47a,"redoCallback":_47b});
this.getCognosViewer().getViewerWidget().updateToolbar();
};
CognosViewerAction.prototype.isValidMenuItem=function(){
var _47c=this.getCognosViewer();
var _47d=_47c.getViewerWidget();
if(this.isPromptWidget()){
return false;
}
return true;
};
CognosViewerAction.prototype.isPositiveInt=function(_47e){
if(typeof _47e==="undefined"||_47e===null){
return false;
}
var _47f=parseInt(_47e,10);
return _47e&&_47f===+_47e&&_47f>0&&_47e.indexOf(".")==-1;
};
CognosViewerAction.prototype.buildActionResponseObject=function(_480,code,msg){
return {"status":_480,"message":msg?msg:null,"code":code?code:null,getStatus:function(){
return this.status;
},getMessage:function(){
return this.message;
},getCode:function(){
return this.code;
}};
};
function LineageAction(){
};
LineageAction.prototype=new CognosViewerAction();
LineageAction.prototype.getCommonOptions=function(_483){
_483.addFormField("cv.responseFormat","asynchDetailMIMEAttachment");
_483.addFormField("bux",this.m_oCV.getViewerWidget()?"true":"false");
_483.addFormField("cv.id",this.m_oCV.envParams["cv.id"]);
};
LineageAction.prototype.getSelectionOptions=function(_484){
var _485=this.m_oCV.getSelectionController();
var _486=getSelectionContextIds(_485);
_484.addFormField("context.format","initializer");
_484.addFormField("context.type","reportService");
_484.addFormField("context.selection","metadata,"+_486.toString());
};
LineageAction.prototype.getPrimaryRequestOptions=function(_487){
_487.addFormField("specificationType","metadataServiceLineageSpecification");
_487.addFormField("ui.action","runLineageSpecification");
_487.addFormField("ui.object",this.m_oCV.envParams["ui.object"]);
};
LineageAction.prototype.getSecondaryRequestOptions=function(_488){
_488.addFormField("ui.conversation",this.m_oCV.getConversation());
_488.addFormField("m_tracking",this.m_oCV.getTracking());
_488.addFormField("ui.action","lineage");
};
LineageAction.prototype.updateMenu=function(_489){
if(!this.getCognosViewer().bCanUseLineage){
return "";
}
_489.disabled=!this.selectionHasContext();
return _489;
};
LineageAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var _48b=new AsynchDataDispatcherEntry(oCV);
this.getCommonOptions(_48b);
this.getSelectionOptions(_48b);
if(oCV.getConversation()==""){
this.getPrimaryRequestOptions(_48b);
}else{
this.getSecondaryRequestOptions(_48b);
}
_48b.setCallbacks({"complete":{"object":this,"method":this.handleLineageResponse}});
if(!oCV.m_viewerFragment){
_48b.setRequestIndicator(oCV.getRequestIndicator());
var _48c=new WorkingDialog(oCV);
_48c.setSimpleWorkingDialogFlag(true);
_48b.setWorkingDialog(_48c);
}
oCV.dispatchRequest(_48b);
};
LineageAction.prototype.handleLineageResponse=function(_48d){
var oCV=this.getCognosViewer();
oCV.loadExtra();
oCV.setStatus(_48d.getAsynchStatus());
oCV.setConversation(_48d.getConversation());
oCV.setTracking(_48d.getTracking());
var _48f=null;
if(typeof MDSRV_CognosConfiguration!="undefined"){
_48f=new MDSRV_CognosConfiguration();
var _490="";
if(this.m_oCV.envParams["metadataInformationURI"]){
_490=this.m_oCV.envParams["metadataInformationURI"];
}
_48f.addProperty("lineageURI",_490);
_48f.addProperty("gatewayURI",this.m_oCV.getGateway());
}
var _491=this.m_oCV.envParams["ui.object"];
var _492=getViewerSelectionContext(this.m_oCV.getSelectionController(),new CSelectionContext(_491));
var _493=new MDSRV_LineageFragmentContext(_48f,_492);
_493.setExecutionParameters(this.m_oCV.getExecutionParameters());
if(typeof _491=="string"){
_493.setReportPath(_491);
}
_493.setReportLineage(_48d.getResult());
_493.open();
};
function CSelectionDefaultStyles(_494){
this.m_primarySelectionColor=null;
this.m_highContrastBorderStyle="solid";
this.m_secondarySelectionIsDisabled=false;
if(_494){
this.m_selectionController=_494;
this.m_oCognosViewer=_494.m_oCognosViewer;
if(this.m_oCognosViewer){
var _495=this.m_oCognosViewer.getUIConfig();
if(_495){
if(_495.getPrimarySelectionColor()){
this.m_primarySelectionColor=_495.getPrimarySelectionColor();
}
if(!_495.getShowSecondarySelection()){
this.m_secondarySelectionIsDisabledConfig=true;
}else{
if(_495.getSeondarySelectionColor()){
this.m_secondarySelectionColor=_495.getSeondarySelectionColor();
}
}
}
}
}
};
CSelectionDefaultStyles.prototype.getPrimarySelectionColor=function(_496){
return this.m_primarySelectionColor;
};
CSelectionDefaultStyles.prototype.getSecondarySelectionColor=function(){
return this.m_secondarySelectionColor;
};
CSelectionDefaultStyles.prototype.getHighContrastBorderStyle=function(){
return this.m_highContrastBorderStyle;
};
CSelectionDefaultStyles.prototype.canApplyToSelection=function(_497){
return true;
};
CSelectionDefaultStyles.prototype.secondarySelectionIsDisabled=function(){
return this.m_secondarySelectionIsDisabled;
};
CSelectionDefaultStyles.prototype.setStyleForSelection=function(){
};
function CSelectionFilterStyles(_498){
this.m_selectionController=_498;
this.m_primarySelectionColor=this.m_primarySelectionFilterColor="#44BFDD";
this.m_primarySelectionFilterColorForMeasure=null;
this.m_secondarySelectionColor=null;
this.m_highContrastBorderStyle="dotted";
this.m_secondarySelectionIsDisabled=true;
};
CSelectionFilterStyles.prototype=new CSelectionDefaultStyles();
CSelectionFilterStyles.prototype.getPrimarySelectionColor=function(_499){
return this.m_primarySelectionColor;
};
CSelectionFilterStyles.prototype.getSecondarySelectionColor=function(){
return this.m_secondarySelectionColor;
};
CSelectionFilterStyles.prototype.getHighContrastBorderStyle=function(){
return this.m_highContrastBorderStyle;
};
CSelectionFilterStyles.prototype.secondarySelectionIsDisabled=function(){
return this.m_secondarySelectionIsDisabled;
};
CSelectionFilterStyles.prototype.canApplyToSelection=function(_49a){
return !this.selectionHasOnlyMeasure(_49a);
};
CSelectionFilterStyles.prototype.selectionHasOnlyMeasure=function(_49b){
return (_49b.length===1&&_49b[0].length===1&&this.m_selectionController.isMeasure(_49b[0][0]));
};
CSelectionFilterStyles.prototype.setStyleForSelection=function(_49c){
this.m_primarySelectionColor=(this.selectionHasOnlyMeasure(_49c))?null:this.m_primarySelectionFilterColor;
};
function CSelectionFilterContextMenuStyles(_49d){
CSelectionDefaultStyles.call(this,_49d);
this.m_secondarySelectionIsDisabled=true;
};
CSelectionFilterContextMenuStyles.prototype=new CSelectionDefaultStyles();
function CSelectionObject(){
this.initialize();
};
CSelectionObject.prototype.initialize=function(){
this.m_oCellRef={};
this.m_sColumnRef="";
this.m_sColumnName="";
this.m_aDataItems=[];
this.m_aUseValues=[];
this.m_aDisplayValues=[];
this.m_sCellTypeId="";
this.m_sLayoutType="";
this.m_sTag="";
this.m_aMuns=[];
this.m_aRefQueries=[];
this.m_aMetadataItems=[];
this.m_aDrillOptions=[];
this.m_selectionController={};
this.m_contextIds=[];
this.m_ctxAttributeString="";
this.m_fetchedContextIds=false;
this.m_selectedClass=[];
this.m_cutClass=[];
this.m_dataContainerType="";
this.m_oJsonContext=null;
};
CSelectionObject.prototype.isSelectionOnVizChart=function(){
return false;
};
CSelectionObject.prototype.getCellRef=function(){
return this.m_oCellRef;
};
CSelectionObject.prototype.getColumnRP_Name=function(){
if(this.m_oCellRef!=null){
return this.m_oCellRef.getAttribute("rp_name");
}
};
CSelectionObject.prototype.getColumnRef=function(){
return this.m_sColumnRef;
};
CSelectionObject.prototype.getColumnName=function(){
if(this.m_sColumnName==""){
if(this.m_selectionController.hasContextData()&&this.m_contextIds.length){
this.m_sColumnName=this.m_selectionController.getRefDataItem(this.m_contextIds[0][0]);
}
}
return this.m_sColumnName;
};
CSelectionObject.prototype.getDataItemDisplayValue=function(_49e){
var _49f=this.getDataItems();
var item="";
if(_49f&&_49f[0]&&_49f[0][0]){
item=this.getDataItems()[0][0];
if(_49e&&_49e.itemInfo&&_49e.itemInfo.length){
var _4a1=_49e.itemInfo;
for(var i=0;i<_4a1.length;i++){
if(_4a1[i].item===item&&_4a1[i].itemLabel){
return _4a1[i].itemLabel;
}
}
}
}
return item;
};
CSelectionObject.prototype.getDataItems=function(){
if(!this.m_aDataItems.length){
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
this.m_aDataItems[this.m_aDataItems.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _4a5=this.m_contextIds[i][j];
this.m_aDataItems[this.m_aDataItems.length-1].push(this.m_selectionController.isContextId(_4a5)?this.m_selectionController.getRefDataItem(_4a5):"");
}
}
}
return this.m_aDataItems;
};
CSelectionObject.prototype.getUseValues=function(){
if(!this.m_aUseValues.length){
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
this.m_aUseValues[this.m_aUseValues.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _4a8=this.m_contextIds[i][j];
this.m_aUseValues[this.m_aUseValues.length-1].push(this.m_selectionController.isContextId(_4a8)?this.m_selectionController.getUseValue(_4a8):"");
}
}
}
return this.m_aUseValues;
};
CSelectionObject.prototype.getCellTypeId=function(){
return this.m_sCellTypeId;
};
CSelectionObject.prototype.getDisplayValues=function(){
return this.m_aDisplayValues;
};
CSelectionObject.prototype.getLayoutType=function(){
return this.m_sLayoutType;
};
CSelectionObject.prototype.getTag=function(){
return this.m_sTag;
};
CSelectionObject.prototype.getMuns=function(){
if(!this.m_aMuns.length){
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
this.m_aMuns[this.m_aMuns.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _4ab=this.m_contextIds[i][j];
this.m_aMuns[this.m_aMuns.length-1].push(this.m_selectionController.isContextId(_4ab)?this.m_selectionController.getMun(_4ab):"");
}
}
}
return this.m_aMuns;
};
CSelectionObject.prototype.getRefQueries=function(){
if(!this.m_aRefQueries.length){
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
this.m_aRefQueries[this.m_aRefQueries.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _4ae=this.m_contextIds[i][j];
this.m_aRefQueries[this.m_aRefQueries.length-1].push(this.m_selectionController.isContextId(_4ae)?this.m_selectionController.getRefQuery(_4ae):"");
}
}
}
return this.m_aRefQueries;
};
CSelectionObject.prototype.getDimensionalItems=function(_4af){
var _4b0=[];
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
_4b0[_4b0.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _4b3=this.m_contextIds[i][j];
var _4b4="";
if(this.m_selectionController.isContextId(_4b3)){
switch(_4af){
case "hun":
_4b4=this.m_selectionController.getHun(_4b3);
break;
case "lun":
_4b4=this.m_selectionController.getLun(_4b3);
break;
case "dun":
_4b4=this.m_selectionController.getDun(_4b3);
break;
}
}
_4b0[_4b0.length-1].push(_4b4);
}
}
return _4b0;
};
CSelectionObject.prototype.getMetadataItems=function(){
if(!this.m_aMetadataItems.length){
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
this.m_aMetadataItems[this.m_aMetadataItems.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _4b7=this.m_contextIds[i][j];
var _4b8="";
if(this.m_selectionController.isContextId(_4b7)){
var sLun=this.m_selectionController.getLun(_4b7);
var sHun=this.m_selectionController.getHun(_4b7);
if(sLun&&sLun!=""){
_4b8=sLun;
}else{
if(sHun&&sHun!=""){
_4b8=sHun;
}else{
_4b8=this.m_selectionController.getQueryModelId(_4b7);
}
}
}
this.m_aMetadataItems[this.m_aMetadataItems.length-1].push(_4b8);
}
}
}
return this.m_aMetadataItems;
};
CSelectionObject.prototype.getDrillOptions=function(){
if(!this.m_aDrillOptions.length){
this.fetchContextIds();
for(var i=0;i<this.m_contextIds.length;++i){
this.m_aDrillOptions[this.m_aDrillOptions.length]=[];
for(var j=0;j<this.m_contextIds[i].length;++j){
var _4bd=this.m_contextIds[i][j];
this.m_aDrillOptions[this.m_aDrillOptions.length-1].push(this.m_selectionController.isContextId(_4bd)?this.m_selectionController.getDrillFlag(_4bd):0);
}
}
}
return this.m_aDrillOptions;
};
CSelectionObject.prototype.getSelectedContextIds=function(){
return this.m_contextIds;
};
CSelectionObject.prototype.fetchContextIds=function(){
if(!this.m_fetchedContextIds&&this.m_contextIds.length&&this.m_selectionController.hasContextData()){
var _4be=[];
for(var i=0;i<this.m_contextIds.length;i++){
for(var j=0;j<this.m_contextIds[i].length;j++){
_4be.push(this.m_contextIds[i][j]);
}
}
this.m_selectionController.fetchContextData(_4be);
this.m_fetchedContextIds=true;
}
};
CSelectionObject.prototype.setSelectionController=function(sc){
if(sc){
this.m_selectionController=sc;
}
};
CSelectionObject.prototype.getLayoutElementId=function(){
return this.m_layoutElementId;
};
CSelectionObject.prototype.hasContextInformation=function(){
for(var i=0;i<this.m_contextIds.length;i++){
for(var j=0;j<this.m_contextIds[i].length;j++){
if(this.m_contextIds[i][j].length>0){
return true;
}
}
}
return false;
};
CSelectionObject.prototype.isHomeCell=function(){
var _4c4=this.getCellRef().className;
if(_4c4&&(_4c4=="xm"||_4c4.indexOf("xm ")!=-1||_4c4.indexOf(" xm")!=-1)){
return true;
}
return false;
};
CSelectionObject.prototype.getDataContainerType=function(){
return this.m_dataContainerType;
};
CSelectionObject.prototype.getContextJsonObject=function(_4c5,_4c6){
if(this.m_oJsonContext===null){
var _4c7={};
var _4c8=[];
var _4c9=null;
this.getDataItems();
this.getUseValues();
if(this.m_contextIds.length==0){
return null;
}
var i=0,j=0;
var _4cc=this._getBestPossibleItemName(this.m_aDataItems[i][j],this.m_contextIds[i][j],_4c5);
_4c9=_4cc;
this._populateJsonContextObj(_4cc,this.m_aUseValues[i][j],_4c5.getDisplayValue(this.m_contextIds[i][j]),_4c5.getMun(this.m_contextIds[i][j]),_4c7,_4c8);
j++;
for(;i<this.m_aDataItems.length;i++,j=0){
for(;j<this.m_aDataItems[i].length;j++){
_4cc=this._getBestPossibleItemName(this.m_aDataItems[i][j],this.m_contextIds[i][j],_4c5);
if(!_4c9){
_4c9=_4cc;
}
this._populateJsonContextObj(_4cc,this.m_aUseValues[i][j],_4c5.getDisplayValue(this.m_contextIds[i][j]),_4c5.getMun(this.m_contextIds[i][j]),_4c7,_4c8);
}
}
this.m_oJsonContext=this._createGenericPayloadStructureJson(_4c9,_4c7,_4c8,_4c6);
}
return this.m_oJsonContext;
};
CSelectionObject.prototype._getBestPossibleItemName=function(_4cd,_4ce,_4cf){
var _4d0=null;
if(_4cf.isMeasure(_4ce)){
if(!_4cf.isValidColumnTitle(this.m_oCellRef)){
if(!_4cf.isRelational([_4ce])){
_4d0=_4cf.getCCDManager().GetBestPossibleDimensionMeasureName(_4ce);
}
return (_4d0)?_4d0:_4cd;
}
}
_4d0=_4cf.getCCDManager().GetBestPossibleItemName(_4ce);
return (_4d0)?_4d0:_4cd;
};
CSelectionObject.prototype._isTypeColumnTitle=function(){
if(this.m_oCellRef&&typeof this.m_oCellRef.getAttribute=="function"){
return (this.m_oCellRef.getAttribute("type")==="columnTitle");
}
return false;
};
CSelectionObject.prototype._populateJsonContextObj=function(_4d1,_4d2,_4d3,mun,_4d5,_4d6){
if(_4d5&&_4d6&&_4d1&&typeof _4d5[_4d1]=="undefined"){
var _4d7=_4d3?_4d3:_4d2;
_4d5[_4d1]=[_4d7];
var _4d8={};
if(_4d3){
_4d8["caption"]=_4d3;
}
if(mun){
_4d8["mun"]=mun;
}
if(_4d2){
_4d8["use"]=_4d2;
}
_4d6.push(_4d8);
}
};
CSelectionObject.prototype._createGenericPayloadStructureJson=function(_4d9,_4da,_4db,_4dc){
if(_4d9&&_4da&&_4db){
var _4dd=(_4dc)?_4dc:".";
var _4de={};
_4de[_4dd]={"values":_4db};
var obj={"com.ibm.widget.context":{"values":_4da},"com.ibm.widget.context.report.select":{"select":{"selectedItem":_4d9,"itemSpecification":_4de}}};
return obj;
}
return null;
};
CSelectionObject.prototype.populateSelectionPayload=function(_4e0,_4e1,_4e2){
this.getDataItems();
this.getUseValues();
if(this.m_contextIds.length==0){
return false;
}
_4e2=((_4e2===undefined)?false:_4e2);
var _4e3=this.m_selectionController;
for(var i=0,j=0;i<this.m_aDataItems.length;i++,j=0){
var _4e6=(_4e2?1:this.m_aDataItems[i].length);
for(;j<_4e6;j++){
if(!_4e3.isMeasure(this.m_contextIds[i][j])){
var _4e7=this.m_aDataItems[i][j];
this._populateItemInSelectionPayload(_4e7,this.m_aUseValues[i][j],_4e3.getDisplayValue(this.m_contextIds[i][j]),_4e3.getMun(this.m_contextIds[i][j]),_4e0,_4e1);
}
}
}
return true;
};
CSelectionObject.prototype._populateItemInSelectionPayload=function(_4e8,_4e9,_4ea,mun,_4ec,_4ed){
if(_4ec&&_4e8){
var _4ee=_4e9?_4e9:_4ea;
if(_4ec[_4e8]){
_4ec[_4e8].push(_4ee);
}else{
_4ec[_4e8]=[_4ee];
}
var _4ef={};
_4ef["caption"]=_4ee;
if(mun){
_4ef["mun"]=mun;
}
var _4f0=_4ed[_4e8];
if(!_4f0){
_4f0={"values":[]};
_4ed[_4e8]=_4f0;
}
_4f0.values.push(_4ef);
}
};
CSelectionObject.prototype.getCtxAttributeString=function(){
return this.m_ctxAttributeString;
};
CSelectionObject.prototype.isDataValueOrChartElement=function(){
return (this.m_sLayoutType==="datavalue"||this.m_sLayoutType==="chartElement");
};
CSelectionObject.prototype.marshal=function(_4f1,_4f2){
if(!this.m_oJsonForMarshal){
var _4f3={};
var _4f4=[];
var _4f5=null;
this.getDataItems();
this.getUseValues();
if(this.m_contextIds.length==0){
return null;
}
var i=0,j=0;
if(this.m_contextIds[i][j].length==0){
var _4f8=false;
do{
for(;j<this.m_contextIds[i].length;j++){
if(this.m_contextIds[i][j].length>0){
_4f8=true;
break;
}
}
if(!_4f8){
j=0;
i++;
}
}while(!_4f8);
}
var _4f9=this._getBestPossibleItemName(this.m_aDataItems[i][j],this.m_contextIds[i][j],_4f1);
var _4fa=_4f1.isMeasure(this.m_contextIds[i][j]);
var _4fb=this._getBestPossibleItemReference(this.m_contextIds[i][j],_4fa,_4f1.getCCDManager());
var _4fc=_4f1.getCCDManager().GetQuery(this.m_contextIds[i][j]);
var _4fd=this.isDataValueOrChartElement();
var _4fe=this._populateJsonForMarshal(_4f9,_4fb,_4fa,this.m_aUseValues[i][j],_4f1.getDisplayValue(this.m_contextIds[i][j]),_4f1.getMun(this.m_contextIds[i][j]),_4fd);
j++;
var _4ff=[];
for(;i<this.m_aDataItems.length;i++,j=0){
for(;j<this.m_aDataItems[i].length;j++){
_4f9=this._getBestPossibleItemName(this.m_aDataItems[i][j],this.m_contextIds[i][j],_4f1);
_4fa=_4f1.isMeasure(this.m_contextIds[i][j]);
_4fb=this._getBestPossibleItemReference(this.m_contextIds[i][j],_4fa,_4f1.getCCDManager());
var _500=this._populateJsonForMarshal(_4f9,_4fb,_4fa,this.m_aUseValues[i][j],_4f1.getDisplayValue(this.m_contextIds[i][j]),_4f1.getMun(this.m_contextIds[i][j]));
if(_500){
_4ff.push(_500);
}
}
}
var lid=(typeof this.getArea=="function")?getImmediateLayoutContainerId(this.getArea()):getImmediateLayoutContainerId(this.getCellRef());
if(lid&&lid.indexOf(_4f2)>0){
lid=lid.substring(0,lid.indexOf(_4f2)-1);
}
this.m_oJsonForMarshal={"lid":lid,"query":_4fc,"selectedItem":_4fe,"context":_4ff};
}
return this.m_oJsonForMarshal;
};
CSelectionObject.prototype._populateJsonForMarshal=function(_502,_503,_504,_505,_506,mun,_508){
if(_502){
var _509={};
_509["itemName"]=_502;
_509["isMeasure"]=_504?"true":"false";
_509["mdProperty"]=_503.mdProperty;
_509["mdValue"]=_503.mdValue;
_509["isDataValueOrChartElement"]=_508?"true":"false";
if(mun){
_509["mun"]=mun;
}
if(_505){
_509["use"]=_505;
}
return _509;
}
return null;
};
CSelectionObject.prototype._getBestPossibleItemReference=function(_50a,_50b,_50c){
var _50d=null;
var _50e=null;
if(_50b){
_50e="i";
_50d=_50c.GetQMID(_50a);
if(_50d==null){
_50e="m";
_50d=_50c.GetMUN(_50a);
}
if(_50d==null){
_50e="r";
_50d=_50c.GetRDIValue(_50a);
}
}else{
_50e="l";
_50d=_50c.GetLUN(_50a);
if(_50d==null){
_50e="h";
_50d=_50c.GetHUN(_50a);
}
if(_50d==null){
_50e="i";
_50d=_50c.GetQMID(_50a);
}
if(_50d==null){
_50e="r";
_50d=_50c.GetRDIValue(_50a);
}
}
return {"mdProperty":_50e,"mdValue":_50d};
};
CSelectionChartObject.prototype=new CSelectionObject();
CSelectionChartObject.prototype.constructor=CSelectionChartObject;
CSelectionChartObject.baseclass=CSelectionObject.prototype;
function CSelectionChartObject(){
CSelectionChartObject.baseclass.initialize.call(this);
this.m_chartArea=null;
this.m_context="";
this.m_chartCtxAreas=[];
this.m_selectedVizChart=false;
};
CSelectionChartObject.prototype.isSelectionOnVizChart=function(){
return this.m_selectedVizChart;
};
CSelectionChartObject.prototype.setSelectionOnVizChart=function(_50f){
var _510=this.m_selectionController.getSelectedChartImageFromChartArea(_50f);
if(_510){
this.m_selectedVizChart=_510.parentNode.getAttribute("vizchart")=="true"?true:false;
}
};
CSelectionChartObject.prototype.getArea=function(){
return this.m_chartArea;
};
CSelectionChartObject.prototype.getContext=function(){
return this.m_context;
};
CSelectionChartObject.prototype.getCtxAreas=function(){
return this.m_chartCtxAreas;
};
CSelectionChartObject.prototype.setCtxAreas=function(_511){
this.m_chartCtxAreas=_511;
};
CSelectionChartObject.prototype.getCtxAttributeString=function(){
return this.m_context;
};
function CChartHelper(_512,_513,_514){
var _515=_512.parentNode;
this.m_selectionObjectFactory=_513;
this.m_map=_515;
_514.loadExtra();
this.imageMapHighlighter=new CImageMapHighlight(_515,_514.sWebContentRoot);
this.initialize();
};
CChartHelper.prototype.initialize=function(){
this.buildMapCtxAreas();
this.m_chartCtxNodes={};
};
CChartHelper.prototype.buildMapCtxAreas=function(){
var _516={};
var _517=this.m_map.childNodes;
var _518=_517.length;
var _519=null;
for(var i=0;i<_518;i++){
var a=_517[i];
_519=a.getAttribute("ctx");
if(_519){
if(_516[_519]){
_516[_519].push(a);
}else{
_516[_519]=[a];
}
}
}
this.m_ctxAreas=_516;
};
CChartHelper.prototype.getChartNode=function(_51c){
if(!this.isAreaInitialized(_51c)){
var _51d=_51c.parentNode;
this.m_map=_51d;
this.initialize();
this.imageMapHighlighter.initialize(_51d);
}
var _51e=_51c.getAttribute("ctx");
if(!this.m_chartCtxNodes[_51e]){
this.m_chartCtxNodes[_51e]=this.m_selectionObjectFactory.getSelectionChartObject(_51c);
this.m_chartCtxNodes[_51e].setCtxAreas(this.m_ctxAreas[_51e]);
}
return this.m_chartCtxNodes[_51e];
};
CChartHelper.prototype.isAreaInitialized=function(_51f){
return this.imageMapHighlighter.isAreaInitialized(_51f);
};
CChartHelper.prototype.getImageMapHighlighter=function(){
return this.imageMapHighlighter;
};
function CSelectionObjectFactory(_520){
this.m_selectionController=_520;
};
CSelectionObjectFactory.prototype.getSelectionController=function(){
return this.m_selectionController;
};
CSelectionObjectFactory.prototype.getChildSpans=function(_521){
var _522=[];
for(var i=0;i<_521.childNodes.length;i++){
var _524=_521.childNodes[i];
if(!_524.getAttribute||_524.getAttribute("skipSelection")!="true"){
_522.push(_521.childNodes[i]);
}
}
var _525=_521;
var _526="";
while(!_526&&_525){
_526=_525.attributes?_525.attributes["LID"]:"";
_525=_525.parentNode;
}
_526=_526?_526.value:"";
var _527=[];
while(_522.length>0){
var _524=_522.pop();
var lid=_524.attributes?_524.attributes["LID"]:"";
lid=lid?lid.value:"";
if(!lid||lid==_526){
if(_524.nodeName.toLowerCase()=="span"){
_527.push(_524);
}else{
for(i=0;i<_524.childNodes.length;i++){
_522.push(_524.childNodes[i]);
}
}
}
}
return _527;
};
CSelectionObjectFactory.prototype.getSelectionObject=function(_529,_52a){
var _52b=new CSelectionObject();
try{
_52b.setSelectionController(this.getSelectionController());
_52b.m_oCellRef=_529;
_52b.m_sColumnRef=_529.getAttribute("cid");
_52b.m_sCellTypeId=_529.getAttribute("uid");
_52b.m_sLayoutType=_529.getAttribute("type");
_52b.m_sTag=_529.getAttribute("tag");
_52b.m_layoutElementId=this.getLayoutElementId(_529);
_52b.m_dataContainerType=this.getContainerType(_529);
if(typeof cf!="undefined"){
var _52c=cf.cfgGet("MiniQueryObj");
if(_52c){
var _52d=_52c.findChildWithAttribute("tag",_52b.m_sTag);
if(_52d&&_52d.getAttribute("id")!=null){
_52b.m_sColumnName=_52d.getAttribute("id");
}
}
}
var _52e=this.getChildSpans(_529);
if(_52e.length>0){
for(var i=0;i<_52e.length;i++){
var _530=_52e[i];
if(_530.nodeType==1&&_530.nodeName.toLowerCase()=="span"&&_530.style.visibility!="hidden"){
var _531=null;
if(_529.getAttribute("ctx")!=null&&_529.getAttribute("ctx")!=""){
_531=_529;
}else{
if(_530.getAttribute("ctx")!=null&&_530.getAttribute("ctx")!=""){
_531=_530;
}else{
if(_530.getAttribute("dtTargets")&&_530.childNodes&&_530.childNodes.length){
for(var _532=0;_532<_530.childNodes.length;_532++){
if(_530.childNodes[_532].nodeType==1&&_530.childNodes[_532].style.visibility!="hidden"){
_531=_530.childNodes[_532];
}
}
}else{
for(var _533=0;_533<_530.childNodes.length;_533++){
var _534=_530.childNodes[_533];
if(typeof _534.getAttribute!="undefined"&&_534.getAttribute("ctx")!=null&&_534.getAttribute("ctx")!=""){
_531=_534;
break;
}
}
}
}
}
var _535="";
if(_531&&_531.getAttribute("ctx")){
_535=_531.getAttribute("ctx");
}
_52b.m_aDisplayValues[_52b.m_aDisplayValues.length]=this.getSelectionController().getDisplayValue(_535,_529.parentNode);
if(typeof _52a!="undefined"&&_52a!=_535){
continue;
}
_52b=this.processCTX(_52b,_535);
}
}
}else{
if(_529.getAttribute("ctx")!=null&&_529.getAttribute("ctx")!=""&&_52b.m_sLayoutType=="datavalue"){
_52b=this.processCTX(_52b,_529.getAttribute("ctx"));
}
}
this.getSelectionController().processColumnTitleNode(_52b);
}
catch(ex){
}
return _52b;
};
CSelectionObjectFactory.prototype.processCTX=function(_536,_537){
if(typeof _537!="string"||_537.length==0){
return _536;
}
var ctx;
if(typeof _536.m_contextIds=="object"&&_536.m_contextIds!==null&&_536.m_contextIds.length>0){
var _539=_537.split("::");
for(ctx=0;ctx<_536.m_contextIds.length;++ctx){
try{
if(_539[ctx]){
_536.m_contextIds[ctx]=_536.m_contextIds[ctx].concat(_539[ctx].split(":"));
}
}
catch(e){
}
}
}else{
_536.m_contextIds=this.m_selectionController.m_oCognosViewer.getReportContextHelper().processCtx(_537);
}
_536.m_ctxAttributeString=_537;
return _536;
};
CSelectionObjectFactory.prototype.getSecondarySelectionObject=function(tag,_53b,_53c){
if(!_53c){
_53c=document;
}
var _53d=new CSelectionObject();
_53d.setSelectionController(this.getSelectionController());
_53d.m_oCellRef=null;
_53d.m_sColumnRef=null;
_53d.m_sCellTypeId=null;
_53d.refQuery="";
var _53e=_53c.getElementsByTagName("td");
for(var i=0;i<_53e.length;i++){
var _540=_53e[i].getAttribute("tag");
if(_540!=null&&_540!=""){
if(tag==_540){
var _541=_53e[i].className;
if(_541!=null&&_540!=""){
if((_53b=="columnTitle"&&_541=="lt")||(_53b=="datavalue"&&_541=="lc")){
_53d.m_sColumnRef=_53e[i].getAttribute("cid");
_53d.m_sCellTypeId=_53e[i].getAttribute("uid");
break;
}
}
}
}
}
if(_53d.m_sCellTypeId==null){
return null;
}
return _53d;
};
CSelectionObjectFactory.prototype.getSelectionChartObject=function(_542){
var _543="";
if(_542.getAttribute("flashChart")!=null){
if(typeof _542.getCtx!="undefined"){
try{
_543=_542.getCtx();
}
catch(e){
_543="";
}
}
}else{
_543=_542.getAttribute("ctx");
}
var _544=new CSelectionChartObject();
_544.setSelectionController(this.getSelectionController());
if(_543!=null){
_544.m_contextIds=_543.split("::");
for(var ctx=0;ctx<_544.m_contextIds.length;++ctx){
_544.m_contextIds[ctx]=_544.m_contextIds[ctx].split(":");
}
}
_544.m_layoutElementId=this.getLayoutElementId(_542);
_544.m_sLayoutType=_542.getAttribute("type");
_544.m_chartArea=_542;
_544.m_context=_543;
_544.setSelectionOnVizChart(_542);
return _544;
};
CSelectionObjectFactory.prototype.getContainerTypeFromClass=function(_546){
var _547="";
switch(_546){
case "ls":
_547="list";
break;
case "xt":
_547="crosstab";
break;
case "rt":
_547="repeaterTable";
break;
}
return _547;
};
CSelectionObjectFactory.prototype.getContainerType=function(el){
var type="";
if(el){
if(el.className){
type=this.getContainerTypeFromClass(el.className);
}
if(!type){
var _54a=el.parentNode;
if(_54a){
type=this.getContainerType(_54a);
}
}
}
return type;
};
CSelectionObjectFactory.prototype.getLayoutElementId=function(el){
var id="";
var _54d=this.getSelectionController().getNamespace();
if(el){
if(el.getAttribute&&el.getAttribute("chartcontainer")=="true"){
for(var _54e=0;_54e<el.childNodes.length;_54e++){
var _54f=el.childNodes[_54e];
if(_54f.nodeName.toLowerCase()=="img"&&_54f.getAttribute("lid")!=null){
return _54f.getAttribute("lid");
}
}
}
id=(el.getAttribute&&el.getAttribute("LID"))||"";
if(!id){
var _550=el.parentNode;
if(_550){
id=this.getLayoutElementId(_550);
}
}else{
if(el.tagName.toUpperCase()=="MAP"){
id=id.replace(_54d,"");
id=_54d+id;
var _551="#"+id;
var _552=getElementsByAttribute(el.parentNode,"IMG","usemap",_551);
if(_552.length>0){
id=_552[0].getAttribute("LID");
}
}
}
}
return id;
};
function CSelectionController(_553,_554){
this.m_bSelectionBasedFeaturesEnabled=false;
this.m_bDrillUpDownEnabled=false;
this.m_bModelDrillThroughEnabled=false;
this.m_oCognosViewer=null;
this.m_bSavedSelections=false;
if(_554){
this.m_oCognosViewer=_554;
}
this.initialize(_553);
this.FILTER_SELECTION_STYLE=0;
this.FILTER_SELECTION_CONTEXT_MENU_STYLE=1;
};
CSelectionController.prototype.initialize=function(_555){
this.m_sNamespace=_555;
this.m_aCutColumns=[];
this.m_aSelectedObjects=[];
this.m_selectedClass=[];
this.m_cutClass=[];
this.m_oObserver=new CObserver(this);
this.m_bSelectionArraysSetup=false;
this.m_aSelectionHoverNodes=[];
this.m_bUsingCCDManager=false;
this.m_aReportMetadataArray=[];
this.m_aReportContextDataArray=[];
this.m_oCDManager=new CCDManager();
this.m_oSelectionObjectFactory=new CSelectionObjectFactory(this);
this.m_selectedChartArea=null;
this.m_selectedChartNodes=[];
this.m_selectionContainerMap=null;
this.m_chartHelpers={};
if(this.m_oCognosViewer!=null){
this.m_oCDManager.SetCognosViewer(this.m_oCognosViewer);
}
this.m_maxSecondarySelection=-1;
this.c_usageMeasure="2";
this.m_ccl_dateTypes={59:"dateTime",60:"interval"};
this.m_selectionStyles=new CSelectionDefaultStyles(this);
this.m_originalSelectionStyles=this.m_selectionStyles;
this.m_bAllowHorizontalDataValueSelection=false;
};
CSelectionController.prototype.secondarySelectionIsDisabled=function(){
return this.m_selectionStyles.secondarySelectionIsDisabled();
};
CSelectionController.prototype.getPrimarySelectionColor=function(){
return this.m_selectionStyles.getPrimarySelectionColor();
};
CSelectionController.prototype.getHighContrastBorderStyle=function(){
return this.m_selectionStyles.getHighContrastBorderStyle();
};
CSelectionController.prototype.getSecondarySelectionColor=function(){
return this.m_selectionStyles.getSecondarySelectionColor();
};
CSelectionController.prototype.resetSelectionStyles=function(){
this.setSelectionStyles();
};
CSelectionController.prototype.setSelectionStyles=function(_556){
switch(_556){
case this.FILTER_SELECTION_STYLE:
if(!this.m_selectionFilterStyles){
this.m_selectionFilterStyles=new CSelectionFilterStyles(this);
}
this.m_selectionStyles=this.m_selectionFilterStyles;
break;
case this.FILTER_SELECTION_CONTEXT_MENU_STYLE:
if(!this.m_selectionFilterContextMenuStyles){
this.m_selectionFilterContextMenuStyles=new CSelectionFilterContextMenuStyles(this);
}
this.m_selectionStyles=this.m_selectionFilterContextMenuStyles;
break;
default:
this.m_selectionStyles=this.m_originalSelectionStyles;
}
};
CSelectionController.prototype.resetAllowHorizontalDataValueSelection=function(){
this.m_bAllowHorizontalDataValueSelection=false;
};
CSelectionController.prototype.setAllowHorizontalDataValueSelection=function(_557){
this.m_bAllowHorizontalDataValueSelection=_557;
};
CSelectionController.prototype.allowHorizontalDataValueSelection=function(){
return this.m_bAllowHorizontalDataValueSelection;
};
CSelectionController.prototype.clearSelectionData=function(){
this.m_aSelectedObjects=[];
this.m_selectedChartNodes=[];
this.m_oSelectedDrillThroughImage=null;
this.m_oSelectedDrillThroughSingleton=null;
};
CSelectionController.prototype.getCCDManager=function(){
return this.m_oCDManager;
};
CSelectionController.prototype.getCtxIdFromDisplayValue=function(_558){
if(!this.m_bUsingCCDManager){
var _559=this.getReportContextDataArray();
var _55a=1;
for(var _55b in _559){
var _55c=_559[_55b];
if(_55c[_55a]==_558){
return _55b;
}
}
return "";
}else{
var sId=this.m_oCDManager.GetContextIdForDisplayValue(_558);
return (sId==null)?"":sId;
}
};
CSelectionController.prototype.getCtxIdFromMetaData=function(sLun,sHun,_560){
return this.m_oCDManager.getContextIdForMetaData(sLun,sHun,_560);
};
CSelectionController.prototype.replaceNamespaceForSharedTM1DimensionOnly=function(lun,hun,mun){
var sLun=lun;
var sHun=hun;
if(mun&&mun.indexOf("->:[TM].")>0){
sLun=this.m_oCDManager._replaceNamespaceForSharedTM1DimensionOnly(lun);
sHun=this.m_oCDManager._replaceNamespaceForSharedTM1DimensionOnly(hun);
}
return {"lun":sLun,"hun":sHun};
};
CSelectionController.prototype.getCtxIdFromMun=function(sMun){
if(!this.m_bUsingCCDManager){
var _567=this.getReportMetadataArray();
var _568=0;
for(var sKey in _567){
var _56a=_567[sKey];
if(_56a[_568]==sMun){
var _56b=2;
var _56c=this.getReportContextDataArray();
for(var _56d in _56c){
var _56e=_56c[_56d];
if(_56e[_56b]==sKey){
return _56d;
}
}
}
}
return "";
}else{
var sId=this.m_oCDManager.GetContextIdForMUN(sMun);
return (sId==null)?"":sId;
}
};
CSelectionController.prototype.canDrillDown=function(_570){
var _571=this.getDrillFlagForMember(_570);
return (_571==3||_571==2);
};
CSelectionController.prototype.canDrillUp=function(_572){
var _573=this.getDrillFlagForMember(_572);
return (_573==3||_573==1);
};
CSelectionController.prototype.getQueryModelId=function(_574){
var qmid="";
if(!this.m_bUsingCCDManager){
var _576=this.m_aReportContextDataArray[_574];
if(_576&&typeof _576[3]!="undefined"){
var _577=_576[3];
var _578=this.m_aReportMetadataArray[_577];
if(typeof _578!="undefined"&&typeof _578[1]!="undefined"&&_578[1]=="I"){
qmid=_578[0];
}
}
}else{
qmid=this.m_oCDManager.GetQMID(_574);
}
return qmid;
};
CSelectionController.prototype.getRefQuery=function(_579){
if(!this.m_bUsingCCDManager){
return this.getMetaDataItemUseValue(4,_579);
}else{
var _57a=this.m_oCDManager.GetQuery(_579);
return (_57a==null)?"":_57a;
}
};
CSelectionController.prototype.getRefDataItem=function(_57b){
return this.m_oCognosViewer.getReportContextHelper().getRefDataItem(_57b);
};
CSelectionController.prototype.getMun=function(_57c){
return this.m_oCognosViewer.getReportContextHelper().getMun(_57c);
};
CSelectionController.prototype.getHun=function(_57d){
if(!this.m_bUsingCCDManager){
var sHun=null;
var _57f=this.getRDI(_57d);
if(_57f&&_57f.length>4&&_57f[1]=="R"){
var _580=_57f[4];
var _581=this.getReportMetadataArray();
_57f=_581[_580];
}
if(_57f&&_57f.length>1&&_57f[1]=="H"){
sHun=_57f[0];
}
return sHun;
}else{
return this.m_oCDManager.GetHUN(_57d);
}
};
CSelectionController.prototype.fetchContextData=function(_582,_583){
var _584=0;
if(this.m_bUsingCCDManager){
_584=this.m_oCDManager.FetchContextData(_582,_583);
}
return _584;
};
CSelectionController.prototype.getMetaDataItem=function(sKey){
var _586=this.getReportMetadataArray();
if(typeof _586[sKey]!="undefined"){
return _586[sKey];
}
return null;
};
CSelectionController.prototype.getContextDataItem=function(_587){
var _588=this.getReportContextDataArray();
if(typeof _588[_587]!="undefined"){
return _588[_587];
}
return null;
};
CSelectionController.prototype.getMetaDataItemUseValue=function(_589,_58a){
var _58b=this.getContextDataItem(_58a);
if(_58b!=null){
var _58c=_58b[_589];
if(_58c!=""){
var _58d=this.getMetaDataItem(_58c);
if(_58d!=null){
return _58d[0];
}
}
}
return "";
};
CSelectionController.prototype.getRDI=function(_58e){
var _58f=this.getContextDataItem(_58e);
if(_58f!=null){
var _590=_58f[0];
if(_590!=""){
var _591=this.getMetaDataItem(_590);
if(_591!=null){
return _591;
}
}
}
};
CSelectionController.prototype.getNamespace=function(){
return this.m_sNamespace;
};
CSelectionController.prototype.setSelectionBasedFeaturesEnabled=function(_592){
this.m_bSelectionBasedFeaturesEnabled=_592;
};
CSelectionController.prototype.getSelectionBasedFeaturesEnabled=function(){
return this.m_bSelectionBasedFeaturesEnabled;
};
CSelectionController.prototype.setDrillUpDownEnabled=function(_593){
this.m_bDrillUpDownEnabled=_593;
};
CSelectionController.prototype.getDrillUpDownEnabled=function(){
return this.m_bDrillUpDownEnabled;
};
CSelectionController.prototype.setModelDrillThroughEnabled=function(_594){
this.m_bModelDrillThroughEnabled=_594;
};
CSelectionController.prototype.getBookletItemForCurrentSelection=function(){
var _595=this.getAllSelectedObjects();
if(_595&&_595.length>0){
var _596=_595[0];
if(_596.hasContextInformation()){
var _597=this.m_oCDManager.GetBIValue(_596.m_contextIds[0][0]);
if(!_597){
return null;
}
return _597;
}
}
return null;
};
CSelectionController.prototype.getModelPathForCurrentSelection=function(){
var _598=null;
var _599=this.getBookletItemForCurrentSelection();
if(_599){
var _598=this.m_oCDManager.getModelPathFromBookletItem(_599);
}
return _598;
};
CSelectionController.prototype.getModelDrillThroughEnabled=function(){
var _59a=this.getBookletItemForCurrentSelection();
if(_59a){
var _59b=this.m_oCDManager.GetBookletModelBasedDrillThru(_59a);
return _59b==1?true:false;
}else{
return this.m_bModelDrillThroughEnabled;
}
};
CSelectionController.prototype.clearSelectedObjects=function(_59c){
try{
if(!_59c){
_59c=document;
}
this.updateUI(_59c,this.getSelections(),true,false);
this.m_aSelectedObjects=[];
if(typeof this.onSelectionChange=="function"){
this.onSelectionChange();
}
return true;
}
catch(e){
return false;
}
};
CSelectionController.prototype.resetSelections=function(_59d){
try{
if(!_59d){
_59d=document;
}
if(this.hasSelectedChartNodes()){
this.resetChartSelections(_59d);
}
this.m_oSelectedDrillThroughImage=null;
this.m_oSelectedDrillThroughSingleton=null;
if(this.getSelections()){
this.updateUI(_59d,this.getSelections(),true,false);
this.updateUI(_59d,this.getCutColumns(),true,false);
this.m_aCutColumns=[];
this.m_aSelectedObjects=[];
this.m_selectedClass=[];
this.m_cutClass=[];
if(typeof this.onSelectionChange=="function"){
this.onSelectionChange();
}
}
return true;
}
catch(e){
return false;
}
};
CSelectionController.prototype.resetChartSelections=function(_59e){
var _59f=this.m_chartHelpers;
for(var _5a0 in _59f){
if(_59f[_5a0]){
var _5a1=_59f[_5a0].getImageMapHighlighter();
if(_5a1.hideAllAreas){
_5a1.hideAllAreas();
}
}
}
this.m_selectedChartNodes=[];
this.m_selectionContainerMap=null;
};
CSelectionController.prototype.addSelectionObject=function(_5a2,_5a3){
try{
if(!_5a3){
_5a3=document;
}
var _5a4=_5a2.getCellRef();
if(this.isCellSelected(_5a4)!==true||(typeof _5a4!="object"||_5a4===null)){
if(this.isColumnCut(_5a2.getTag())!==true){
this.m_aSelectedObjects[this.m_aSelectedObjects.length]=_5a2;
if(typeof this.onSelectionChange=="function"){
this.onSelectionChange();
}
this.updateUI(_5a3,this.getSelections(),false,false);
}
}
return true;
}
catch(e){
return false;
}
};
CSelectionController.prototype.removeSelectionObject=function(_5a5,_5a6){
try{
if(!_5a6){
_5a6=document;
}
var _5a7=[];
var _5a8;
for(_5a8=0;_5a8<this.m_aSelectedObjects.length;_5a8++){
var _5a9=this.m_aSelectedObjects[_5a8].getCellRef();
var _5aa=_5a5.getCellRef();
if(typeof _5a9=="object"&&typeof _5aa=="object"&&_5a9!==null&&_5aa!==null){
if(_5a9==_5aa){
_5a7[_5a7.length]=_5a8;
}
}
}
if(_5a7.length>0){
this.updateUI(_5a6,this.getSelections(),true,false);
var _5ab=[];
for(_5a8=0;_5a8<this.m_aSelectedObjects.length;_5a8++){
var _5ac=true;
for(var j=0;j<_5a7.length;j++){
if(_5a8==_5a7[j]){
_5ac=false;
}
}
if(_5ac){
_5ab[_5ab.length]=this.m_aSelectedObjects[_5a8];
}
}
this.m_aSelectedObjects=_5ab;
this.updateUI(_5a6,this.getSelections(),false,false);
}
if(typeof this.onSelectionChange=="function"){
this.onSelectionChange();
}
return true;
}
catch(e){
return false;
}
};
CSelectionController.prototype.isSavedCellSelected=function(_5ae){
return this.isCellSelectedHelper(_5ae,this.getSavedSelectedObjects());
};
CSelectionController.prototype.isCellSelected=function(_5af){
return this.isCellSelectedHelper(_5af,this.getSelections());
};
CSelectionController.prototype.isCellSelectedHelper=function(_5b0,_5b1){
try{
for(var i=0;i<_5b1.length;i++){
var _5b3=_5b1[i].getCellRef();
if(typeof _5b3=="object"&&_5b3!==null){
if(_5b3==_5b0){
return true;
}
}
}
}
catch(e){
}
return false;
};
CSelectionController.prototype.isColumnSelected=function(_5b4){
try{
for(var i=0;i<this.m_aSelectedObjects.length;i++){
if(this.m_aSelectedObjects[i].getTag()==_5b4){
return true;
}
}
}
catch(e){
}
return false;
};
CSelectionController.prototype.isColumnCut=function(_5b6){
try{
for(var i=0;i<this.m_aCutColumns.length;i++){
if(this.m_aCutColumns[i].getTag()==_5b6){
return true;
}
}
}
catch(e){
}
return false;
};
CSelectionController.prototype.getSelections=function(){
return this.m_aSelectedObjects;
};
CSelectionController.prototype.selectSingleDomNode=function(_5b8){
this.clearSelectedObjects();
var _5b9=this.getSelectionObjectFactory().getSelectionObject(_5b8);
var _5ba=null;
if(isIE()){
_5ba=_5b8.document;
}else{
_5ba=_5b8.ownerDocument;
}
this.addSelectionObject(_5b9,_5ba);
};
CSelectionController.prototype.hasCutColumns=function(){
if(this.m_aCutColumns.length===0){
return false;
}else{
return true;
}
};
CSelectionController.prototype.setCutColumns=function(_5bb,_5bc){
try{
if(!_5bc){
_5bc=document;
}
this.updateUI(_5bc,this.getSelections(),true,false);
this.updateUI(_5bc,this.getCutColumns(),true,1);
this.m_aCutColumns=[];
if(_5bb===true){
for(var i=0;i<this.m_aSelectedObjects.length;i++){
this.m_aCutColumns[i]=this.m_aSelectedObjects[i];
}
this.m_aSelectedObjects=[];
}
this.updateUI(_5bc,this.getCutColumns(),false,2);
return true;
}
catch(e){
return false;
}
};
CSelectionController.prototype.getCutColumns=function(){
return this.m_aCutColumns;
};
CSelectionController.prototype.getObservers=function(){
return this.m_oObserver;
};
CSelectionController.prototype.attachObserver=function(_5be){
this.m_oObserver.attach(_5be);
};
CSelectionController.prototype.onSelectionChange=function(){
this.getObservers().notify();
};
CSelectionController.prototype.getSelectedColumns=function(_5bf){
var _5c0=[];
if(typeof _5bf=="undefined"){
_5bf=this.getSelections();
}
var _5c1=_5bf.length;
for(var i=0;i<_5c1;i++){
var _5c3=_5bf[i];
var _5c4=true;
for(var j=0;j<_5c0.length;j++){
if(_5c0[j][0]==_5c3.getColumnRef()&&_5c0[j][1]==_5c3.getCellTypeId()){
_5c4=false;
break;
}
}
if(_5c4){
_5c0[_5c0.length]=[_5c3.getColumnRef(),_5c3.getCellTypeId(),_5c3.getLayoutType(),_5c3.getTag(),_5c3.getColumnName()];
}
}
return _5c0;
};
CSelectionController.prototype.getAllSelectedObjectsWithUniqueCTXIDs=function(){
var _5c6=[];
var _5c7=this.getAllSelectedObjects();
for(var i=0;i<_5c7.length;i++){
var _5c9=false;
var _5ca=_5c7[i];
for(var ii=0;ii<_5c6.length;ii++){
if(_5ca.m_contextIds[0][0]==_5c6[ii].m_contextIds[0][0]){
_5c9=true;
break;
}
}
if(!_5c9){
_5c6.push(_5ca);
}
}
return _5c6;
};
CSelectionController.prototype.getAllSelectedObjects=function(){
var _5cc=this.getSelections();
if(this.hasSelectedChartNodes()){
_5cc=_5cc.concat(this.getSelectedChartNodes());
}
return _5cc;
};
CSelectionController.prototype.getSelectedColumnIds=function(_5cd){
var _5ce=[];
if(typeof _5cd=="undefined"){
_5cd=this.getSelections();
}
var _5cf=this.getSelectedColumns(_5cd);
for(var _5d0=0;_5d0<_5cf.length;_5d0++){
var _5d1=true;
for(var _5d2=0;_5d2<_5ce.length;_5d2++){
if(_5ce[_5d2]==_5cf[_5d0][4]){
_5d1=false;
break;
}
}
if(_5d1){
_5ce[_5ce.length]=_5cf[_5d0][4];
}
}
return _5ce;
};
var STYLE_SELECTION={};
CSelectionController.prototype.selecting=function(c,_5d4){
var _5d5="."+c+_5d4;
var doc=document;
var _5d7=document.getElementById("CVIFrame"+this.m_sNamespace);
if(_5d7){
doc=_5d7.contentWindow.document;
}
var _5d8=doc.createElement("style");
_5d8.setAttribute("type","text/css");
if(_5d8.styleSheet){
_5d8.styleSheet.cssText=_5d5;
}else{
_5d8.appendChild(doc.createTextNode(_5d5));
}
doc.getElementsByTagName("head").item(0).appendChild(_5d8);
STYLE_SELECTION[c]=_5d8;
};
CSelectionController.prototype.deselecting=function(_5d9){
for(var i=0;i<_5d9.length;++i){
if(STYLE_SELECTION[_5d9[i]]){
var node=STYLE_SELECTION[_5d9[i]];
node.parentNode.removeChild(node);
STYLE_SELECTION[_5d9[i]]=null;
}
}
if(isIE()&&typeof this.m_oCognosViewer.m_viewerFragment!="undefined"){
var _5dc=document.getElementById("CVReport"+this.m_oCognosViewer.getId());
if(_5dc!=null){
var _5dd=_5dc.style.display;
_5dc.style.display="none";
_5dc.style.display=_5dd;
}
}
};
CSelectionController.prototype.showViewerContextMenu=function(){
if(this.hasSelectedChartNodes()){
return true;
}
if(this.m_aSelectedObjects&&this.m_aSelectedObjects.length>0){
return true;
}
return false;
};
function getStyleFromClass(c){
for(var i=0;i<document.styleSheets.length;i++){
var ss=document.styleSheets[i];
var _5e1=(ss.cssRules?ss.cssRules:ss.rules);
for(var j=0;j<_5e1.length;j++){
var cr=_5e1[j];
var _5e4=new RegExp("\\b"+c+"\\b","g");
if(cr.selectorText&&cr.selectorText.match(_5e4)){
return cr;
}
}
}
return 0;
};
CSelectionController.prototype.canUpdateSelection=function(_5e5){
return this.m_selectionStyles.canApplyToSelection(_5e5);
};
CSelectionController.prototype.setStyleForSelection=function(_5e6){
return this.m_selectionStyles.setStyleForSelection(_5e6);
};
CSelectionController.prototype.updateUI=function(_5e7,_5e8,_5e9,_5ea){
if(!_5e7){
_5e7=document;
}
try{
if(_5e8&&_5e8.length>0){
var _5eb,_5ec,_5ed;
if(_5ea==1||_5ea==2){
if(_5e9){
this.deselecting(this.m_cutClass);
}else{
var _5ee=getStyleFromClass("cutSelection").style.color;
var _5ef=getStyleFromClass("cutSelection").style.backgroundColor;
_5eb=_5e8.length;
for(_5ec=0;_5ec<_5eb;_5ec++){
_5ed=_5e8[_5ec].getCellRef();
var _5f0="cutQS"+_5ed.getAttribute("cid");
this.selecting(_5f0,"\n{ background-color: "+_5ef+"; color: "+_5ee+";}\n");
this.m_cutClass.push(_5f0);
}
}
}else{
if(this.m_oCognosViewer){
this.findSelectionURLs();
_5ed="";
_5eb=_5e8.length;
for(_5ec=0;_5ec<_5eb;_5ec++){
_5ed=_5e8[_5ec].getCellRef();
if(_5ed.getAttribute("oldClassName")!=null){
_5ed.className=_5ed.getAttribute("oldClassName");
_5ed.removeAttribute("oldClassName");
}
this.setStyleForSelection(_5e8[_5ec].m_contextIds);
if(!this.secondarySelectionIsDisabled()||_5e9){
var _5f1=document.getElementById("CVReport"+this.getNamespace());
var _5f2=getElementsByAttribute(_5f1,["td","th"],"name",_5ed.getAttribute("name"),this.m_maxSecondarySelection);
for(var _5f3=0;_5f3<_5f2.length;_5f3++){
var cell=_5f2[_5f3];
if(_5e9){
this.restoreOldBackgroundImage(cell);
}else{
if(cell.getAttribute("oldBackgroundImageStyle")==null){
this.saveOldCellStyles(cell);
this.setSecondarySelectionStyles(cell);
}
}
}
}
this.saveOldCellStyles(_5ed);
if(_5e9){
this.restoreOldBackgroundImage(_5ed);
if(this.m_oCognosViewer.isHighContrast()){
this.restoreOldBorder(_5ed);
this.restoreOldPadding(_5ed);
}
}else{
this.setPrimarySelectionStyles(_5ed);
if(this.m_oCognosViewer.isHighContrast()){
var size=getBoxInfo(_5ed,true);
this.saveOldBorder(_5ed);
this.saveOldPadding(_5ed,size);
var _5f6=3;
var _5f7=size.borderTopWidth+size.paddingTop-_5f6;
var _5f8=size.borderBottomWidth+size.paddingBottom-_5f6;
var _5f9=size.borderLeftWidth+size.paddingLeft-_5f6;
var _5fa=size.borderRightWidth+size.paddingRight-_5f6;
_5ed.style.border=_5f6+"px "+this.getHighContrastBorderStyle()+" black";
_5ed.style.padding=_5f7+"px "+_5fa+"px "+_5f8+"px "+_5f9+"px";
}
}
}
}
}
}
return true;
}
catch(e){
return false;
}
};
CSelectionController.prototype.findSelectionURLs=function(){
if(!(this.sS_backgroundImageURL&&this.pS_backgroundImageURL)){
if(this.m_oCognosViewer.isBux||isSafari()||this.m_oCognosViewer.isMobile()){
this.pS_backgroundImageURL="url(../common/images/selection_primary.png)";
this.sS_backgroundImageURL="url(../common/images/selection_secondary.png)";
}else{
this.pS_backgroundImageURL=this.getBackgroundImage(getStyleFromClass("primarySelection"));
this.sS_backgroundImageURL=this.getBackgroundImage(getStyleFromClass("secondarySelection"));
}
}
};
CSelectionController.prototype.setSelectedChartImgArea=function(_5fb){
var _5fc=true;
var _5fd=_5fb.getAttribute("rsvpChart");
var _5fe=_5fb.parentNode.getAttribute("chartContainer");
if(_5fd!="true"&&_5fe!="true"){
this.m_selectedChartNodes=[];
_5fc=false;
}else{
var _5ff=this.getSelectionObjectFactory().getSelectionChartObject(_5fb);
this.m_selectedChartNodes=[_5ff];
}
return _5fc;
};
CSelectionController.prototype.setSelectedChartArea=function(_600,e){
var _602=typeof this.m_oCognosViewer.isBux!=="undefined";
var _603=false;
if(_600!==null){
if(_600.tagName=="IMG"){
_603=this.setSelectedChartImgArea(_600);
}else{
if(_600.nodeName=="AREA"&&_600.attributes["ctx"]){
_603=true;
if(_602){
this.setBuxSelectedChartArea(_600,e);
}else{
this.m_selectedChartNodes=[this.getSelectionObjectFactory().getSelectionChartObject(_600)];
}
}
}
if(_603){
this.getObservers().notify();
}
}
return _603;
};
CSelectionController.prototype.setBuxSelectedChartArea=function(_604,e){
var _606=this.getChartHelper(_604);
var _607=_606.getChartNode(_604);
this.setStyleForSelection(_607.m_contextIds);
var _608=_606.getImageMapHighlighter();
_608.setFillColour(this.getPrimarySelectionColor());
_608.setStrokeColour(this.getPrimarySelectionColor());
if(typeof e=="undefined"){
e={};
}
if(this.ctrlKeyPressed(e)||this.shiftKeyPressed(e)){
if(_608.isAreaHighlighted(_604)){
_608.hideAreas(_607.getCtxAreas());
var _609=_604.getAttribute("ctx");
var _60a=this.m_selectedChartNodes.length;
for(var i=0;i<_60a;i++){
var _60c=this.m_selectedChartNodes[i];
if(_609==_60c.getContext()){
this.m_selectedChartNodes.splice(i,1);
break;
}
}
}else{
this.updateSelectionContainer(_604);
_608.highlightAreas(_607.getCtxAreas(),true);
this.m_selectedChartNodes.push(_607);
}
}else{
if(this.hasSavedSelectedChartNodes()){
var _60d=this.m_savedSelectedChartNodes.length;
var _60e=this.m_savedSelectedChartNodes;
for(var i=0;i<_60d;i++){
var area=_60e[i].getArea();
var _610=this.getSavedChartHelper(area);
var _611=_610.getImageMapHighlighter();
var _612=_611.getAreaId(area);
if(_608.getAreaId(_604)===_612){
_611.hideAreaById(_612+this.m_savedPrimarySelectionColor);
break;
}
}
}
this.updateSelectionContainer(_604);
_608.highlightAreas(_607.getCtxAreas());
this.m_selectedChartNodes=[_607];
}
};
CSelectionController.prototype.updateSelectionContainer=function(_613){
var _614=_613.parentNode;
if(this.m_selectionContainerMap&&this.m_selectionContainerMap.name!=_614.name){
var _615=this.getChartHelper(_613).getImageMapHighlighter();
_615.hideAllAreas();
}
this.m_selectionContainerMap=_614;
};
CSelectionController.prototype.getChartHelper=function(_616){
var _617=_616.parentNode;
var _618=_617.name;
if(!this.m_chartHelpers[_618]){
this.m_chartHelpers[_618]=new CChartHelper(_616,this.getSelectionObjectFactory(),this.m_oCognosViewer);
}
return this.m_chartHelpers[_618];
};
CSelectionController.prototype.getSavedChartHelper=function(_619){
var _61a=_619.parentNode;
var _61b=_61a.name;
return this.m_savedChartHelpers[_61b];
};
CSelectionController.prototype.getSelectedChartArea=function(){
return this.m_selectedChartArea;
};
CSelectionController.prototype.getSelectedChartNodes=function(){
return this.m_selectedChartNodes;
};
CSelectionController.prototype.hasSelectedChartNodes=function(){
return this.m_selectedChartNodes&&this.m_selectedChartNodes.length&&this.m_selectedChartNodes.length>0;
};
CSelectionController.prototype.getSelectedChartImage=function(){
var _61c=null;
if(this.hasSelectedChartNodes()){
var _61d=this.m_selectedChartNodes[0];
_61c=_61d.getArea();
}
if(_61c===null){
return null;
}
if(_61c.tagName=="IMG"){
return _61c;
}
return this.getSelectedChartImageFromChartArea(_61c);
};
CSelectionController.prototype.getSelectedChartImageFromChartArea=function(_61e){
var _61f=_61e.parentNode;
var _620="#"+_61f.getAttribute("name");
return this.checkChildrenForChart(_61f.parentNode,_620);
};
CSelectionController.prototype.checkChildrenForChart=function(_621,_622){
var _623=_621.firstChild;
while(_623!==null){
if(!_623.tagName){
return null;
}else{
if(_623.tagName=="IMG"&&_623.getAttribute("usemap")==_622){
return _623;
}else{
if(_623.tagName==="DIV"||_623.tagName==="SPAN"){
var _624=this.checkChildrenForChart(_623,_622);
if(_624){
return _624;
}
}
}
}
_623=_623.nextSibling;
}
return null;
};
CSelectionController.prototype.downloadSelectedChartImage=function(_625){
var _626=this.getSelectedChartImage();
if(_626!==null){
var _627=this.getDocumentFromImage(_626);
var _628=_626.name.replace(".","_");
var _629=_628.substr(5);
var _62a="?m_name=";
_62a+=_629;
_62a+="&format=png&b_action=xts.run&m=portal/download.xts&m_obj=";
if(isIE()){
_628=_627.parentWindow.eval("graphicSrc"+_629);
}else{
_628=_627.defaultView.eval("graphicSrc"+_629);
}
var _62b="";
if(typeof _628!="undefined"&&_628!==null){
var _62c=_628.split("&");
if(_62c.length===0){
return;
}
if(_628.indexOf("/repository/")<0){
for(var i=0;i<_62c.length;++i){
var _62e=_62c[i];
var _62f=_62e.indexOf("=");
if(_62f!=-1){
var _630=_62e.substr(0,_62f);
var _631=_62e.slice(_62f+1);
if(_630=="search"){
_62b+=_631;
break;
}
}
}
}
if(_62b==""){
_62a=_626.getAttribute("src");
if(_62a.indexOf("?")!=-1){
_62a+="&download=true";
}else{
_62a+="?download=true";
}
}
if(typeof getConfigFrame=="function"){
_62a+=_62b;
_62a=getConfigFrame().constructGETRequestParamsString(_62a);
window.open(_62a,"_blank","width=0,height=0");
}else{
_62a=constructGETRequestParamsString(_62a);
_62a+=_62b;
var _632=this.m_oCognosViewer.getGateway();
var _633=document.getElementById("CVIFrame"+this.m_sNamespace);
if(_633){
var _634=_633.src;
if(_634.indexOf("repository")>=0&&_62a.indexOf("repository")<0){
var _635=_634.indexOf("content");
_62a=_634.substring(0,_635)+_62a;
}
}
if(_62a.indexOf(_632)==-1){
var _636=document.forms["formWarpRequest"+_625];
_62a=_636.action+_62a;
}
if(typeof window.detachLeavingRV=="function"){
window.detachLeavingRV();
}
location.href=_62a;
if(typeof window.attachLeavingRV=="function"){
setTimeout(window.attachLeavingRV,100);
}
}
}
}
};
CSelectionController.prototype.getDocumentFromImage=function(_637){
var _638=null;
if(_637.ownerDocument){
_638=_637.ownerDocument;
}else{
_638=_637.document;
}
return _638;
};
CSelectionController.prototype.shouldExecutePageClickedOnMouseDown=function(e){
var _63a=this.getSelections();
if(_63a.length>1){
if(this.m_oCognosViewer.envParams["ui.action"]!=="view"){
var node=getNodeFromEvent(e);
try{
while(node&&(node.nodeType==3||(node.getAttribute&&node.getAttribute("uid")===null))){
node=node.parentNode;
}
}
catch(ex){
}
var _63c=this.getSelectionObjectFactory().getContainerType(node);
if(_63c==="list"){
for(var i=0;i<_63a.length;i++){
if(_63a[i].m_oCellRef==node){
return false;
}
}
}
}
}
return true;
};
CSelectionController.prototype.getContainerType=function(){
var _63e="";
if(this.hasSelectedChartNodes()){
_63e="chart";
}else{
if(this.getDataContainerType()==="list"){
_63e="list";
}else{
_63e="crosstab";
}
}
return _63e;
};
CSelectionController.prototype.getDisplayValues=function(){
var _63f={};
var _640=this.getAllSelectedObjects()[0];
if(_640){
var _641=_640.getSelectedContextIds();
if(_641){
for(var axis=0;axis<_641.length;axis++){
var _643=[];
var _644=_641[axis];
for(var _645=0;_645<_644.length;_645++){
var _646=_644[_645];
var _647=this.getDisplayValue(_646);
_643.push(_647);
if(axis===0){
break;
}
}
var _648="";
switch(axis){
case 0:
_648="selected";
break;
case 1:
_648="rows";
break;
default:
_648="columns";
}
_63f[_648]=_643;
}
}
}
return _63f;
};
CSelectionController.prototype.getChartTooltip=function(){
var _649=this.getAllSelectedObjects()[0];
if(_649){
var area=_649.getArea();
if(area){
var _64b=area.getAttribute("title");
if(_64b&&_64b.length>0){
return area.getAttribute("title");
}
}
}
return "";
};
CSelectionController.prototype.pageClickedForMobile=function(e){
this.pageClicked(e);
var _64d=this.getAllSelectedObjects().length;
if(_64d==0){
var node=getNodeFromEvent(e,true);
if(!node){
return false;
}
if(node.nodeName.toLowerCase()=="img"&&node.getAttribute("dttargets")){
this.selectDrillThroughImage(node);
return true;
}else{
if(node.getAttribute("dttargets")){
this.selectDrillThroughSingleton(node);
return true;
}else{
if(node.parentNode&&node.parentNode.getAttribute("dttargets")){
this.selectDrillThroughSingleton(node.parentNode);
return true;
}
}
}
return false;
}
return true;
};
CSelectionController.prototype.clearSavedSelections=function(){
this.m_bSavedSelections=false;
if(this.hasSavedSelectedObjects()){
this.updateUI(null,this.getSavedSelectedObjects(),true,false);
delete (this.m_aSavedSelectedObjects);
}
if(this.hasSavedSelectedChartNodes()){
var _64f=this.m_savedChartHelpers;
for(var _650 in _64f){
if(_64f[_650]){
var _651=_64f[_650].getImageMapHighlighter();
if(_651.hideAllAreas){
_651.hideAllAreas();
}
}
}
delete this.m_savedChartHelpers;
delete this.m_savedSelectedChartNodes;
}
};
CSelectionController.prototype.hasSavedSelectedChartNodes=function(){
return (this.m_savedSelectedChartNodes&&this.m_savedSelectedChartNodes.length>0);
};
CSelectionController.prototype.getSavedSelectedChartNodes=function(){
return this.m_savedSelectedChartNodes;
};
CSelectionController.prototype.saveSelections=function(){
this.m_savedSelectionStyles=this.m_selectionStyles;
if(this.m_aSelectedObjects.length>0){
this.m_aSavedSelectedObjects=[];
var _652=this.m_aSelectedObjects.length;
var temp=[];
for(var i=0;i<_652;i++){
if(this.isMeasure(this.m_aSelectedObjects[i].m_contextIds[0][0])){
temp.push(this.m_aSelectedObjects[i]);
}else{
this.m_aSavedSelectedObjects.push(this.m_aSelectedObjects[i]);
}
}
this.m_aSelectedObjects=temp;
}
if(this.hasSelectedChartNodes()){
this.m_savedChartHelpers=this.m_chartHelpers;
this.m_chartHelpers={};
this.m_savedSelectedChartNodes=[];
var _655=this.m_selectedChartNodes.length;
var temp=[];
for(var i=0;i<_655;i++){
if(this.isMeasure(this.m_selectedChartNodes[i].m_contextIds[0][0])){
var _656=this.m_selectedChartNodes[i].getArea();
var _657=this.getImageMapName(_656);
this.m_chartHelpers[_657]=this.m_savedChartHelpers[_657];
delete this.m_savedChartHelpers[_657];
temp.push(this.m_selectedChartNodes[i]);
}else{
this.m_savedSelectedChartNodes.push(this.m_selectedChartNodes[i]);
}
}
this.m_selectedChartNodes=temp;
}
this.m_bSavedSelections=true;
};
CSelectionController.prototype.hasSavedSelections=function(){
return this.m_bSavedSelections;
};
CSelectionController.prototype.hasSavedSelectedObjects=function(){
return (this.m_aSavedSelectedObjects&&this.m_aSavedSelectedObjects.length>0)||this.hasSavedSelectedChartNodes();
};
CSelectionController.prototype.getSavedSelectedObjects=function(){
return this.m_aSavedSelectedObjects;
};
CSelectionController.prototype.getImageMapName=function(_658){
var _659=_658.parentNode;
return _659.name;
};
CSelectionController.prototype.repaintBUXSelectedChartArea=function(_65a,_65b,_65c){
var _65d={};
var _65e=_65a.length;
for(var i=0;i<_65e;i++){
var _660=_65a[i].getArea();
var _661=this.getImageMapName(_660);
var _662;
if(!_65d[_661]){
_662=(_65b)?this.getSavedChartHelper(_660):this.getChartHelper(_660);
_65d[_661]=_662;
var _663=_662.getImageMapHighlighter();
_663.hideAllAreas();
_663.setFillColour(this.getPrimarySelectionColor());
_663.setStrokeColour(this.getPrimarySelectionColor());
}else{
_662=_65d[_661];
}
var _664=_65a[i].m_contextIds;
if(_65c&&_664.length===1&&_664[0].length===1&&this.isMeasure(_664[0][0])){
continue;
}
_663.highlightAreas(_65a[i].getCtxAreas(),1);
}
};
CSelectionController.prototype.repaintSavedSelections=function(){
var _665=this.m_selectionStyles;
this.m_selectionStyles=this.m_savedSelectionStyles;
var _666=this.getSavedSelectedChartNodes();
var _667=false;
if(_666&&_666.length>0){
bIsChart=true;
}else{
_666=this.getSavedSelectedObjects();
}
this.repaintSelectionsHelper(_666,true,_667);
this.resetSelectionStyles();
this.m_selectionStyles=_665;
};
CSelectionController.prototype.repaintSelections=function(){
var _668=this.getSelectedChartNodes();
var _669=false;
if(_668&&_668.length>0){
_669=true;
}else{
_668=this.getSelections();
}
this.repaintSelectionsHelper(_668,false,_669);
};
CSelectionController.prototype.repaintSelectionsHelper=function(_66a,_66b,_66c){
try{
if(_66c){
this.repaintBUXSelectedChartArea(_66a,_66b);
}else{
this.updateUI(document,_66a,true,false);
this.updateUI(document,_66a,false,false);
}
}
catch(e){
return false;
}
};
CSelectionController.prototype.resetAll=function(){
this.resetSelectionStyles();
this.clearSavedSelections();
this.resetSelections();
this.resetAllowHorizontalDataValueSelection();
};
CSelectionController.prototype.pageClicked=function(e){
try{
var node=getNodeFromEvent(e);
if(this.m_aSelectedObjects.length>0&&!this.shiftKeyPressed(e)&&!this.ctrlKeyPressed(e)){
var _66f=node;
if(!_66f.getAttribute("uid")){
var _670=_66f.parentNode;
if(_670&&_670.nodeType==1&&typeof _670.getAttribute!="undefined"&&_670.getAttribute("uid")!=null){
_66f=_670;
}
}
if(this.isCellSelected(_66f)){
if(typeof this.m_oCognosViewer.isBux!=="undefined"){
this.repaintSelections();
}
if(e.button!==0){
return false;
}
}
}
if(node.tagName&&node.tagName.toUpperCase()=="INPUT"){
return true;
}
if((e.keyCode!=null)&&(e.keyCode!=13)&&(e.keyCode!=32)&&(e.keyCode!=27)&&(e.keyCode!=0)&&(e.keyCode!=121)&&(e.keyCode!=93)){
return false;
}
var _671=getDocumentFromEvent(e);
if(!this.hasContextData()||!this.hasMetadata()){
if(node.nodeName=="AREA"||node.nodeName=="IMG"||(typeof node.getAttribute=="function"&&node.getAttribute("flashChart")!=null)){
this.setSelectedChartArea(node,e);
}
this.getObservers().notify();
return false;
}
if(typeof node.selectedCell!="undefined"){
var _672=node;
node=node.selectedCell;
_672.removeAttribute("selectedCell");
}
if(typeof cf!="undefined"&&typeof cf.hidePickers=="function"){
cf.hidePickers();
}
if(e.keyCode==27){
if(typeof g_reportSelectionController!="undefined"){
g_reportSelectionController.clearSelections();
}
this.resetSelections(_671);
}else{
if(node.nodeName=="AREA"||node.nodeName=="IMG"||(typeof node.getAttribute!="undefined"&&node.getAttribute("flashChart")!=null)){
if(e.button!==2||this.getAllSelectedObjects().length<=1||typeof this.m_oCognosViewer.isBux==="undefined"){
this.selectNode(node,e);
this.setSelectedChartArea(node,e);
}
}else{
if(!(node.firstChild==null&&node.cellIndex==0&&node.parentNode.rowIndex==0&&node.getAttribute("cid")==null)){
var _673=this.m_oCognosViewer.getViewerWidget();
this.selectNode(node,e);
}
}
}
if(window.gViewerLogger){
window.gViewerLogger.addContextInfo(this);
}
}
catch(e){
}
};
CSelectionController.prototype.getSelectionObjectFactory=function(){
return this.m_oSelectionObjectFactory;
};
CSelectionController.prototype.isDrillLinkOnCrosstabCell=function(node){
return (node.getAttribute("ctx")==null&&node.parentNode.getAttribute("dtTargets")!=null);
};
CSelectionController.prototype.selectObject=function(sMun,sLun,sHun,_678){
var _679=this.getCtxIdFromMun(sMun);
if(_679==""){
_679=this.getCtxIdFromMetaData(sLun,sHun,_678);
}
if(_679!=null&&this.m_oCDManager.GetUsage(_679)!="2"){
var _67a=document.getElementById("rt"+this.getNamespace());
if(_67a!=null){
var _67b=getElementsByAttribute(_67a,"*","ctx",_679);
if(_67b&&_67b.length===0){
var _67c=new RegExp("(^|:)"+_679+"(:|$)","i");
_67b=getElementsByAttribute(_67a,"*","ctx",_679,-1,_67c);
}
var _67d=null;
if(_67b!=null&&_67b.length>0){
_67d=new CSelectionObject();
_67d.setSelectionController(this);
_67d.m_sColumnRef=_67b[0].getAttribute("cid");
_67d.m_sCellTypeId=_67b[0].getAttribute("uid");
_67d.m_sLayoutType=_67b[0].getAttribute("type");
_67d.m_sTag=_67b[0].getAttribute("tag");
_67d.m_layoutElementId=this.m_oSelectionObjectFactory.getLayoutElementId(_67b[0]);
_67d.m_dataContainerType=this.m_oSelectionObjectFactory.getContainerType(_67b[0]);
_67d.m_contextIds=[[_679]];
this.m_aSelectedObjects[this.m_aSelectedObjects.length]=_67d;
}else{
var _67e=getElementsByAttribute(_67a,"*","flashChart","true");
if(_67e!=null){
for(var _67f=0;_67f<_67e.length;++_67f){
var ldx=_67e[_67f].getLDX();
if(ldx.indexOf("<ctx>"+_679+"</ctx>")!=-1){
_67d=new CSelectionObject();
_67d.setSelectionController(this);
var lid=_67e[_67f].getAttribute("lid");
_67d.m_layoutElementId=lid.replace(this.m_oCognosViewer.getId(),"");
_67d.m_dataContainerType="chart";
_67d.m_contextIds=[[_679]];
this.m_aSelectedObjects[this.m_aSelectedObjects.length]=_67d;
}
}
}
}
}
}
};
CSelectionController.prototype.buildSelectionObject=function(node,e){
var _684=null;
try{
while(node.nodeType==3){
node=node.parentNode;
}
if(this.isDrillLinkOnCrosstabCell(node)){
node=node.parentNode;
}
var ctx=node.getAttribute("ctx");
var uid=node.getAttribute("uid");
if((uid==null)&&((ctx!=null)||(node.parentNode&&node.parentNode.nodeType==1&&typeof node.parentNode.getAttribute!="undefined"&&node.parentNode.getAttribute("uid")!=null))){
if(node.nodeName=="IMG"&&(node.src.indexOf("SM=")>-1||(isIE()>-1&&node.src.indexOf("space.gif")>-1))){
return null;
}
node=node.parentNode;
if((node.className.toUpperCase()=="BLOCK"&&node.nodeName.toUpperCase()=="DIV")||(node.getAttribute("dtTargets")!=null)){
node=node.parentNode;
}
uid=node.getAttribute("uid");
}
if(uid!=null){
var _687=node.childNodes;
for(var i=0;i<_687.length;i++){
if(_687[i].nodeName.toUpperCase()=="TABLE"&&(_687[i].className=="ls"||_687[i].className=="xt")){
var trs=_687[i].rows;
for(var j=0;j<trs.length;j++){
var tds=trs[j].cells;
for(var k=0;k<tds.length;k++){
if(tds[k].getAttribute("uid")!=null){
return null;
}
}
}
}
}
if(node.className.toUpperCase()=="REPEATERTABLECELL"&&ctx!=null){
_684=this.getSelectionObjectFactory().getSelectionObject(node,ctx);
}else{
_684=this.getSelectionObjectFactory().getSelectionObject(node);
}
}
}
catch(e){
}
return _684;
};
CSelectionController.prototype.shiftKeyPressed=function(e){
if(e.keyCode=="121"){
return false;
}
if(isSafari()){
if(e.button!=2){
return e.shiftKey?e.shiftKey:false;
}else{
return false;
}
}
return e.shiftKey?e.shiftKey:false;
};
CSelectionController.prototype.ctrlKeyPressed=function(e){
if(isSafari()){
if(e.button!=2){
return e.ctrlKey?e.ctrlKey:false;
}else{
return false;
}
}
return e.ctrlKey?e.ctrlKey:false;
};
CSelectionController.prototype.isSelectionsPreviouslySaved=function(_68f){
var _690=false;
if(!this.m_aSavedSelectedObjects||!this.m_aSavedSelectedObjects.length||!_68f||!_68f.length){
return false;
}
for(var i=0;i<_68f.length;i++){
if(this.isSavedCellSelected(_68f[i].getCellRef())){
return true;
}
}
return false;
};
CSelectionController.prototype.selectNode=function(node,e){
try{
while(node.nodeType==3){
node=node.parentNode;
}
if(this.isDrillLinkOnCrosstabCell(node)){
node=node.parentNode;
}
var _694=null;
if(isIE()){
_694=node.document;
}else{
_694=node.ownerDocument;
}
var ctx=node.getAttribute("ctx");
var uid=node.getAttribute("uid");
var _697=false;
if(typeof e=="undefined"){
e={};
}
var _698=false;
if(typeof g_reportSelectionController!="undefined"){
_698=this.checkForReportElementNode(node);
}
if((ctx==null&&uid==null&&node.parentNode.nodeType==1&&node.parentNode.getAttribute("uid")==null&&_698==false)||(!this.ctrlKeyPressed(e)&&!this.shiftKeyPressed(e))){
if(this.getSelections().length>0){
_697=true;
}
if(this.hasCutColumns()==true){
this.clearSelectedObjects(_694);
}else{
this.resetSelections(_694);
this.repaintSavedSelections();
if(typeof cf!="undefined"&&typeof cf.removeAllSelectionsFromCfgVariables=="function"){
cf.removeAllSelectionsFromCfgVariables();
}
this.m_oCognosViewer.setCurrentNodeFocus(null);
}
if(this.ctrlKeyPressed(e)||this.shiftKeyPressed(e)){
clearTextSelection(_694);
}
if(typeof g_reportSelectionController!="undefined"&&_698==false){
if(g_reportSelectionController.getSelections().length>0){
_697=true;
}
g_reportSelectionController.clearSelections();
}
}
var _699=node.getAttribute("dtTargets")?node:null;
var _69a=(node.nodeName.toLowerCase()==="area");
if((uid==null)&&((ctx!=null)||(node.parentNode&&node.parentNode.nodeType==1&&typeof node.parentNode.getAttribute!="undefined"))){
if(node.nodeName=="IMG"&&(node.src.indexOf("SM=")>-1||(isIE()>-1&&node.src.indexOf("space.gif")>-1))){
return false;
}
var _69b;
var _69c=3;
do{
node=node.parentNode;
if(node){
_699=(!_699&&typeof node.getAttribute!="undefined"&&node.getAttribute("dtTargets"))?node:_699;
uid=(typeof node.getAttribute!="undefined")?node.getAttribute("uid"):null;
_69b=node.nodeName.toLowerCase();
}
}while((uid==null)&&node&&(--_69c>0)&&(_69b=="span"||_69b=="div"));
}
if(uid!=null){
var _69d=node.childNodes;
for(var i=0;i<_69d.length;i++){
if(_69d[i].nodeName.toUpperCase()=="TABLE"&&(_69d[i].className=="ls"||_69d[i].className=="xt")){
var trs=_69d[i].rows;
for(var j=0;j<trs.length;j++){
var tds=trs[j].cells;
for(var k=0;k<tds.length;k++){
if(tds[k].getAttribute("uid")!=null){
return false;
}
}
}
}
}
var _6a3;
if(node.className.toUpperCase()=="REPEATERTABLECELL"&&ctx!=null){
_6a3=this.getSelectionObjectFactory().getSelectionObject(node,ctx);
}else{
_6a3=this.getSelectionObjectFactory().getSelectionObject(node);
}
if(this.isCellSelected(node)==false){
if(this.shiftKeyPressed(e)){
var _6a4=this.getSelections();
if(_6a4.length>0){
var _6a5=_6a4[_6a4.length-1];
if(_6a5.getLayoutType()==_6a3.getLayoutType()&&(_6a5.getCellRef().parentNode.parentNode==_6a3.getCellRef().parentNode.parentNode)){
if(this.cellsAreInSameColumn(_6a5.getCellRef(),_6a3.getCellRef())){
this.selectVertical(_6a5,_6a3,_694);
}else{
if(_6a5.getCellRef().parentNode.rowIndex==_6a3.getCellRef().parentNode.rowIndex){
this.selectHorizontal(_6a5,_6a3,_694);
}
}
}
}
clearTextSelection(_694);
}else{
if(this.ctrlKeyPressed(e)){
clearTextSelection(_694);
}
}
this.addSelectionObject(_6a3,_694);
if(typeof cf!="undefined"&&typeof cf.addSelectionToCfgVariables=="function"){
cf.addSelectionToCfgVariables(_6a3.getColumnName());
}
this.m_oCognosViewer.setCurrentNodeFocus(node);
}else{
if(this.ctrlKeyPressed(e)){
this.removeSelectionObject(_6a3,_694);
if(typeof cf!="undefined"&&typeof cf.removeSelectionFromCfgVariables=="function"){
if(!this.isColumnSelected(_6a3.getTag())){
cf.removeSelectionFromCfgVariables(_6a3.getTag());
}
}
clearTextSelection(_694);
}else{
if(this.shiftKeyPressed(e)){
clearTextSelection(_694);
}
}
}
_697=true;
}else{
if(_698){
var _6a6=null;
while((typeof node.id=="undefined"||node.id==null||node.id=="")&&node.parentNode!=null){
node=node.parentNode;
}
if(node.id=="reportTitle"){
_6a6="TitleStyle";
}else{
if(node.id=="reportSubtitle"){
_6a6="SubtitleStyle";
}else{
if(node.id.indexOf("reportFilter")==0){
_6a6="FilterStyle";
}
}
}
if(_6a6!=null){
selectReportElement(e,node.id,_6a6);
_697=true;
}
}else{
if(_699!=null&&this.m_oCognosViewer&&this.m_oCognosViewer.isMobile()&&!_69a){
var _6a3=this.getSelectionObjectFactory().getSelectionObject(_699);
this.addSelectionObject(_6a3,_694);
}
}
}
if(_697==true&&(typeof cf!="undefined"&&typeof cf.refreshDialog=="function")){
cf.refreshDialog();
}
}
catch(ex){
}
};
CSelectionController.prototype.selectDrillThroughImage=function(node){
this.m_oSelectedDrillThroughImage=node;
};
CSelectionController.prototype.getSelectedDrillThroughImage=function(){
return this.m_oSelectedDrillThroughImage?this.m_oSelectedDrillThroughImage:null;
};
CSelectionController.prototype.selectDrillThroughSingleton=function(node){
this.m_oSelectedDrillThroughSingleton=node;
};
CSelectionController.prototype.getSelectDrillThroughSingleton=function(){
return this.m_oSelectedDrillThroughSingleton?this.m_oSelectedDrillThroughSingleton:null;
};
CSelectionController.prototype.getReportContextDataArray=function(){
return this.m_aReportContextDataArray;
};
CSelectionController.prototype.getReportMetadataArray=function(){
return this.m_aReportMetadataArray;
};
CSelectionController.prototype.setupContextDataArray=function(_6a9){
this.m_aReportContextDataArray=_6a9;
};
CSelectionController.prototype.setupMetaDataArray=function(_6aa){
this.m_aReportMetadataArray=_6aa;
};
CSelectionController.prototype.addContextData=function(_6ab){
this.m_aSelectedObjects=[];
this.m_oCDManager.SetContextData(_6ab);
if(!this.m_bUsingCCDManager){
this.m_bUsingCCDManager=true;
}
for(var i=0;i<this.m_selectedClass.length;++i){
this.deselecting(this.m_selectedClass);
}
};
CSelectionController.prototype.addMetaData=function(_6ad){
this.m_aSelectedObjects=[];
this.m_oCDManager.SetMetadata(_6ad);
if(!this.m_bUsingCCDManager){
this.m_bUsingCCDManager=true;
}
};
CSelectionController.prototype.getDrillFlag=function(_6ae){
var _6af="";
if(!this.m_bUsingCCDManager){
var _6b0=this.m_aReportContextDataArray[_6ae];
var _6b1=_6b0[0];
var _6b2=this.m_aReportMetadataArray[_6b1];
if(typeof _6b2!="undefined"&&typeof _6b2[3]!="undefined"){
_6af=_6b2[3];
}
}else{
_6af=this.m_oCDManager.GetDrillFlag(_6ae);
}
return _6af;
};
CSelectionController.prototype.getDrillFlagForMember=function(_6b3){
var _6b4="0";
if(!this.m_bUsingCCDManager){
var _6b5=this.getContextDataItem(_6b3);
if(_6b5!=null){
var _6b6=_6b5[2];
if(_6b6!=""){
var _6b7=_6b5[0];
var _6b8=this.getMetaDataItem(_6b7);
if(_6b8!=null){
_6b4=_6b8[3];
}
}
}
}else{
_6b4=this.m_oCDManager.GetDrillFlagForMember(_6b3);
}
return (_6b4==null)?0:_6b4;
};
CSelectionController.prototype.getDataType=function(_6b9){
var _6ba=null;
if(!this.m_bUsingCCDManager){
var _6bb=this.getRDI(_6b9);
if(_6bb&&_6bb.length>2){
_6ba=parseInt(_6bb[2],10);
}
}else{
_6ba=parseInt(this.m_oCDManager.GetDataType(_6b9),10);
}
return _6ba;
};
CSelectionController.prototype.getUsageInfo=function(_6bc){
if(this.m_bUsingCCDManager){
return this.m_oCDManager.GetUsage(_6bc);
}
};
CSelectionController.prototype.isMeasure=function(_6bd){
return (this.getUsageInfo(_6bd)==this.c_usageMeasure);
};
CSelectionController.prototype.getDepth=function(_6be){
var _6bf=null;
if(!this.m_bUsingCCDManager){
var _6c0=this.getRDI(_6be);
if(_6c0&&_6c0.length>5&&_6c0[1]=="R"){
_6bf=_6c0[5];
}
}else{
_6bf=this.m_oCDManager.GetDepth(_6be);
}
return _6bf;
};
CSelectionController.prototype.getUseValue=function(_6c1){
var _6c2="";
if(!this.m_bUsingCCDManager){
var _6c3=this.m_aReportContextDataArray[_6c1];
if(typeof _6c3[1]!="undefined"){
_6c2=_6c3[1];
}
}else{
_6c2=this.m_oCDManager.GetDisplayValue(_6c1);
}
return _6c2;
};
CSelectionController.prototype.getTextValue=function(_6c4){
var _6c5=null;
for(var _6c6=0;_6c6<_6c4.length;_6c6++){
if(_6c4[_6c6].style.visisbility!="hidden"){
if(isIE()){
_6c5=_6c4[_6c6].innerText;
}else{
_6c5=_6c4[_6c6].textContent;
}
var _6c7=_6c4[_6c6].nextSibling;
while(_6c7!=null){
if(_6c7.nodeName.toUpperCase()=="SPAN"&&_6c7.style.visibility!="hidden"){
if(isIE()){
_6c5+=_6c7.innerText;
}else{
_6c5+=_6c7.textContent;
}
}
_6c7=_6c7.nextSibling;
}
break;
}
}
return _6c5;
};
CSelectionController.prototype.getDisplayValueFromDOM=function(_6c8,_6c9){
var _6ca=null;
var _6cb;
var _6cc=new RegExp("(^|\\s)"+_6c8+"(\\s|$|:)","i");
if(typeof _6c9!="undefined"){
_6cb=getElementsByAttribute(_6c9,["span","td","th"],"ctx",_6c8,1,_6cc);
}else{
var _6cd=document.getElementById("CVIFrame"+this.m_sNamespace);
if(typeof _6cd=="undefined"||_6cd==null){
var _6ce=document.getElementById("RVContent"+this.m_sNamespace);
if(typeof _6ce=="undefined"||_6ce==null){
_6cb=getElementsByAttribute(document.body,["span","td","th"],"ctx",_6c8,1,_6cc);
}else{
_6cb=getElementsByAttribute(_6ce,["span","td","th"],"ctx",_6c8,1,_6cc);
}
}else{
_6cb=getElementsByAttribute(_6cd.contentWindow.document.body,["span","td","th"],"ctx",_6c8,1,_6cc);
}
}
var _6cf;
if(_6cb.length>0&&(_6cb[0].nodeName.toUpperCase()=="TD"||_6cb[0].nodeName.toUpperCase()=="TH")){
_6cf=_6cb[0].childNodes;
}else{
_6cf=_6cb;
}
if(_6cf.length==0||(_6cf[0].className.indexOf("chart_area")==-1&&_6cf[0].className.indexOf("bux-comment")==-1)){
_6ca=this.getTextValue(_6cf);
}
return _6ca;
};
CSelectionController.prototype.getDisplayValue=function(_6d0,_6d1){
var _6d2=this.getDisplayValueFromDOM(_6d0,_6d1);
if(_6d2==null){
_6d2=this.getUseValue(_6d0);
}
return _6d2;
};
CSelectionController.prototype.getDun=function(_6d3){
if(this.m_bUsingCCDManager){
return this.m_oCDManager.GetDUN(_6d3);
}else{
var _6d4=this.m_aReportContextDataArray[_6d3];
if(_6d4&&typeof _6d4[5]!="undefined"){
var _6d5=_6d4[5];
var _6d6=this.m_aReportMetadataArray[_6d5];
if(typeof _6d6!="undefined"&&typeof _6d6[1]!="undefined"&&_6d6[1]=="D"){
return _6d6[0];
}
}
}
};
CSelectionController.prototype.getPun=function(_6d7){
if(this.m_bUsingCCDManager){
return this.m_oCDManager.GetPUN(_6d7);
}
};
CSelectionController.prototype.getLun=function(_6d8){
var lun="";
if(!this.m_bUsingCCDManager){
var _6da=this.m_aReportContextDataArray[_6d8];
if(_6da&&typeof _6da[3]!="undefined"){
var _6db=_6da[3];
var _6dc=this.m_aReportMetadataArray[_6db];
if(typeof _6dc!="undefined"&&typeof _6dc[1]!="undefined"&&_6dc[1]=="L"){
lun=_6dc[0];
}
}
}else{
lun=this.m_oCDManager.GetLUN(_6d8);
}
return lun;
};
CSelectionController.prototype.isContextId=function(_6dd){
var _6de=false;
if(!this.m_bUsingCCDManager){
var _6df=this.m_aReportContextDataArray[_6dd];
_6de=(typeof _6df=="object");
}else{
this.m_oCDManager.FetchContextData([_6dd]);
_6de=this.m_oCDManager.ContextIdExists(_6dd);
}
return _6de;
};
CSelectionController.prototype.hasContextData=function(){
var _6e0=false;
if(!this.m_bUsingCCDManager){
if(this.m_aReportContextDataArray&&this.m_aReportContextDataArray.length&&this.m_aReportContextDataArray.length()>0){
return true;
}
}else{
_6e0=this.m_oCDManager.HasContextData();
}
return _6e0;
};
CSelectionController.prototype.hasMetadata=function(){
var _6e1=false;
if(!this.m_bUsingCCDManager){
if(this.m_aReportMetadataArray&&this.m_aReportMetadataArray.length&&this.m_aReportMetadataArray.length()>0){
return true;
}
}else{
_6e1=this.m_oCDManager.HasMetadata();
}
return _6e1;
};
CSelectionController.prototype.getDifferentCellIndex=function(_6e2,_6e3,_6e4){
for(var i=0;i<_6e2.cells.length;i++){
if(this.getSelectionObjectFactory().getSelectionObject(_6e2.cells[i]).getLayoutType()=="datavalue"){
break;
}
}
if(_6e4=="relative"){
return (_6e3-i);
}else{
if(_6e4=="actual"){
return (_6e3+i);
}
}
};
CSelectionController.prototype.cellsAreInSameColumn=function(_6e6,_6e7){
if(_6e6.parentNode.rowIndex==_6e7.parentNode.rowIndex){
return false;
}
if(_6e6.getAttribute("cid")===null){
if(_6e6.getAttribute("uid")===_6e7.getAttribute("uid")){
if(_6e6.getAttribute("type")!="datavalue"){
return true;
}else{
if(this.getDifferentCellIndex(_6e6.parentNode,_6e6.cellIndex,"relative")==this.getDifferentCellIndex(_6e7.parentNode,_6e7.cellIndex,"relative")){
return true;
}
}
}else{
return false;
}
}else{
if(_6e6.getAttribute("cid")===_6e7.getAttribute("cid")){
return true;
}else{
return false;
}
}
};
CSelectionController.prototype.selectVertical=function(_6e8,_6e9,_6ea){
if(!_6ea){
_6ea=document;
}
var _6eb=_6e8.getCellRef().parentNode;
var _6ec,i;
var _6ee=(_6e8.getCellRef().parentNode.rowIndex<_6e9.getCellRef().parentNode.rowIndex);
var _6ef=(_6e8.getCellRef().parentNode.cells.length-_6e8.getCellRef().cellIndex);
while(_6eb.rowIndex!=_6e9.getCellRef().parentNode.rowIndex){
if(_6ee){
_6eb=_6eb.nextSibling;
}else{
_6eb=_6eb.previousSibling;
}
if(_6eb==null){
break;
}
if(_6eb.cells.length>=_6ef){
for(i=0;i<_6eb.cells.length;i++){
if((_6eb.cells[i].getAttribute("type")==_6e8.getLayoutType())&&this.cellsAreInSameColumn(_6e8.getCellRef(),_6eb.cells[i])){
_6ec=this.getSelectionObjectFactory().getSelectionObject(_6eb.cells[i]);
if(this.addSelectionObject(_6ec,_6ea)){
if(typeof cf!="undefined"&&typeof cf.addSelectionToCfgVariables=="function"){
cf.addSelectionToCfgVariables(_6ec.getColumnName());
}
}
break;
}
}
}
}
};
CSelectionController.prototype.selectHorizontal=function(_6f0,_6f1,_6f2){
var _6f3="";
if(_6f0.getColumnRef()==null){
if(_6f0.getCellRef().getAttribute("uid")==_6f1.getCellRef().getAttribute("uid")){
_6f3=_6f0.getCellRef().getAttribute("uid");
}else{
return;
}
}
var _6f4,_6f5;
var _6f6=_6f1.getCellRef().parentNode;
var _6f7;
if(_6f1.getCellRef().cellIndex<_6f0.getCellRef().cellIndex){
_6f4=_6f1.getCellRef().cellIndex;
_6f5=_6f0.getCellRef().cellIndex;
}else{
_6f5=_6f1.getCellRef().cellIndex;
_6f4=_6f0.getCellRef().cellIndex;
}
for(var i=_6f4+1;i<_6f5;i++){
if(((_6f0.getColumnRef()!=null)&&(_6f0.getLayoutType()==_6f1.getLayoutType())&&(_6f0.getLayoutType()!="datavalue")||this.allowHorizontalDataValueSelection())||((_6f0.getColumnRef()==null)&&(_6f6.cells[i].getAttribute("uid")==_6f3))){
_6f7=this.getSelectionObjectFactory().getSelectionObject(_6f6.cells[i]);
if(this.addSelectionObject(_6f7,_6f2)){
if(typeof cf!="undefined"&&typeof cf.addSelectionToCfgVariables=="function"){
cf.addSelectionToCfgVariables(_6f7.getColumnName());
}
}
}
}
};
CSelectionController.prototype.pageDoubleClicked=function(e){
try{
var node=getNodeFromEvent(e);
if(typeof node.selectedCell!="undefined"){
var _6fb=node;
node=node.selectedCell;
_6fb.removeAttribute("selectedCell");
}
while(node.nodeType==3){
node=node.parentNode;
}
var ctx=node.getAttribute("ctx");
var uid=node.getAttribute("uid");
if((ctx!=null)||(node.parentNode.nodeType==1&&node.parentNode.getAttribute("uid")!=null)){
node=node.parentNode;
if(node.className.toUpperCase()=="BLOCK"&&node.nodeName.toUpperCase()=="DIV"){
node=node.parentNode;
}
uid=node.getAttribute("uid");
}
if(uid!=null&&node.firstChild!=null&&(node.getAttribute("type")=="columnTitle"||node.getAttribute("type")=="section")){
if(typeof goWindowManager!="undefined"&&goWindowManager&&typeof goWindowManager.getApplicationFrame=="function"){
goWindowManager.getFeatureManager().launchFeature("Rename");
}
}
if(typeof g_reportSelectionController!="undefined"){
g_reportSelectionController.clearSelections();
}
}
catch(ex){
}
};
CSelectionController.prototype.getSelectionHoverNodes=function(){
return this.m_aSelectionHoverNodes;
};
CSelectionController.prototype.setSelectionHoverNodes=function(_6fe){
this.m_aSelectionHoverNodes=_6fe;
};
CSelectionController.prototype.addSelectionHoverNode=function(node){
this.m_aSelectionHoverNodes[this.m_aSelectionHoverNodes.length]=node;
};
CSelectionController.prototype.pageHover=function(e){
try{
var node=getNodeFromEvent(e);
while(node.nodeType==3){
node=node.parentNode;
}
if((node.getAttribute("ctx")!=null)||(node.parentNode.nodeType==1&&node.parentNode.getAttribute("uid")!=null)){
if(node.parentNode.nodeName.toLowerCase()!="tr"){
node=node.parentNode;
}
}
var _702=this.getSelectionHoverNodes();
var _703=this.getAllSelectedObjects().length;
if(!(_702.length==1&&_702[0]==node)){
for(var i=0;i<_702.length;i++){
this.sortIconHover(_702[i],true);
if(_703==0){
this.pageChangeHover(_702[i],true);
}
}
this.setSelectionHoverNodes([]);
if(_703==0){
this.sortIconHover(node,false);
if(this.pageChangeHover(node,false)){
this.addSelectionHoverNode(node);
}
}else{
if(this.sortIconHover(node,false)){
this.addSelectionHoverNode(node);
}
}
}
}
catch(ex){
}
};
CSelectionController.prototype.sortIconHover=function(node,_706){
if(!this.isValidColumnTitle(node)){
return false;
}
var _707=this.getSortImgNode(node);
if(_707!=null&&_707!="undefined"){
if(_707.getAttribute("sortOrder")==="nosort"){
if(_706){
_707.style.visibility="hidden";
}else{
_707.style.visibility="visible";
}
}
return true;
}
return false;
};
CSelectionController.prototype.isValidColumnTitle=function(node){
if(node&&node.parentNode){
var uid=node.getAttribute("uid");
if(uid!=null&&(!(node.firstChild==null&&node.cellIndex==0&&node.parentNode.rowIndex==0&&node.getAttribute("cid")==null))&&(node.getAttribute("type")=="columnTitle"||node.getAttribute("type")=="section")){
return true;
}
}
return false;
};
CSelectionController.prototype.pageChangeHover=function(node,_70b){
try{
if((node.getAttribute("ctx")!=null)||(node.parentNode&&node.parentNode.nodeType==1&&node.parentNode.getAttribute("uid")!=null)){
if(node.parentNode.nodeName.toLowerCase()!="tr"){
node=node.parentNode;
}
}
if(this.isValidColumnTitle(node)){
var _70c=this.isColumnSelected(node.getAttribute("tag"));
if(!_70c){
_70c=this.isColumnCut(node.getAttribute("tag"));
}
if(!_70c){
if(_70b){
if(node.getAttribute("oldClassName")!=null){
node.className=node.getAttribute("oldClassName");
node.removeAttribute("oldClassName");
}
this.restoreOldBackgroundImage(node);
}else{
if(node.getAttribute("oldClassName")!=null){
node.className=node.getAttribute("oldClassName");
}else{
node.setAttribute("oldClassName",node.className);
}
if(node.getAttribute("oldBackgroundImageStyle")!=null){
node.style.backgroundImage=node.getAttribute("oldBackgroundImageStyle");
}else{
this.saveOldCellStyles(node);
}
node.className+=" hoverSelection";
return true;
}
}
}
}
catch(ex){
}
return false;
};
CSelectionController.prototype.getSortImgNode=function(node){
var _70e=node.getElementsByTagName("img");
for(var i=0;i<_70e.length;i++){
var sId=_70e[i].id.toString();
if(sId!=null&&sId.length>0&&sId.indexOf("sortimg")>=0){
node=_70e[i];
return node;
}
}
return null;
};
CSelectionController.prototype.restoreOldPadding=function(node){
if(node&&node.style&&node.getAttribute("oldPaddingStyle")!=null){
if(node.getAttribute("oldPaddingStyle").length>0){
node.style.padding=node.getAttribute("oldPaddingStyle");
}
node.removeAttribute("oldPaddingStyle");
}
};
CSelectionController.prototype.saveOldPadding=function(node,size){
if(node&&node.getAttribute("oldPaddingStyle")==null){
node.setAttribute("oldPaddingStyle",size.paddingTop+"px "+size.paddingRight+"px "+size.paddingBottom+"px "+size.paddingLeft+"px");
}
};
CSelectionController.prototype.saveOldBorder=function(node){
if(node&&node.getAttribute("oldBorderStyle")==null){
node.setAttribute("oldBorderStyle",node.style.border);
}
};
CSelectionController.prototype.restoreOldBorder=function(node){
if(node&&node.style&&node.getAttribute("oldBorderStyle")!=null){
if(node.getAttribute("oldBorderStyle").length>0){
node.style.border=node.getAttribute("oldBorderStyle");
}else{
node.style.borderColor=node.style.borderWidth=node.style.borderStyle="";
}
node.removeAttribute("oldBorderStyle");
}
};
CSelectionController.prototype.setPrimarySelectionStyles=function(cell){
if(this.getPrimarySelectionColor()){
cell.style.backgroundColor=this.getPrimarySelectionColor();
}else{
cell.style.backgroundImage=this.pS_backgroundImageURL;
cell.style.backgroundRepeat="repeat";
}
};
CSelectionController.prototype.setSecondarySelectionStyles=function(cell){
if(this.getSecondarySelectionColor()){
cell.style.backgroundColor=this.getSecondarySelectionColor();
}else{
cell.style.backgroundImage=this.sS_backgroundImageURL;
cell.style.backgroundRepeat="repeat";
}
};
CSelectionController.prototype.saveOldCellStyles=function(node){
if(node&&node.getAttribute("oldBackgroundImageStyle")==null){
node.setAttribute("oldBackgroundColor",this.getStyleProperty(node,"backgroundColor"));
node.setAttribute("oldBackgroundImageStyle",this.getBackgroundImage(node));
node.setAttribute("oldBackgroundRepeat",this.getStyleProperty(node,"backgroundRepeat"));
node.style.backgroundImage="";
node.style.backgroundRepeat="";
}
};
CSelectionController.prototype.restoreOldBackgroundImage=function(node){
if(node&&node.style&&node.getAttribute("oldBackgroundImageStyle")!=null){
node.style.backgroundImage=node.getAttribute("oldBackgroundImageStyle");
node.removeAttribute("oldBackgroundImageStyle");
node.style.backgroundRepeat=node.getAttribute("oldBackgroundRepeat");
node.removeAttribute("oldBackgroundRepeat");
node.style.backgroundColor=node.getAttribute("oldBackgroundColor");
node.removeAttribute("oldBackgroundColor");
}
};
CSelectionController.prototype.getStyleProperty=function(node,_71b){
if(node&&node.style&&node.style[_71b]){
return node.style[_71b];
}
return "";
};
CSelectionController.prototype.getBackgroundImage=function(node){
if(node&&node.style){
return node.style.backgroundImage;
}
return "";
};
CSelectionController.prototype.pageContextClicked=function(e){
var node=getNodeFromEvent(e);
if(typeof node.selectedCell!="undefined"){
var _71f=node;
node=node.selectedCell;
_71f.removeAttribute("selectedCell");
}
while(node!=null&&node.tagName!="TD"){
node=node.parentNode;
}
if(node!=null){
var _720=this.getBackgroundImage(node);
this.findSelectionURLs();
if(this.getSelections().length==0||_720!=this.pS_backgroundImageURL){
this.pageClicked(e);
}
}
if(typeof populateContextMenu!="undefined"){
populateContextMenu();
moveContextMenu(e);
}
var _721=false;
if(this.showViewerContextMenu()){
if(typeof e.preventDefault=="function"){
e.preventDefault();
}
_721=true;
}
return _721;
};
CSelectionController.prototype.chartContextMenu=function(e){
if(!this.hasSelectedChartNodes()){
return;
}
if(typeof populateContextMenu!="undefined"){
populateContextMenu();
moveContextMenu(e);
}
if(typeof e.preventDefault=="function"){
e.preventDefault();
}
return false;
};
CSelectionController.prototype.titleAreaContextMenu=function(e,_724,sId){
if(typeof populateContextMenu!="undefined"){
goWindowManager.getApplicationFrame().cfgSet("contextMenuType",_724);
goWindowManager.getApplicationFrame().cfgSet("contextMenuId",sId);
populateContextMenu(_724.toUpperCase());
moveContextMenu(e,_724.toUpperCase());
}
if(typeof e.preventDefault=="function"){
e.preventDefault();
}
return false;
};
CSelectionController.prototype.selectionsAreAllSameType=function(){
var _726=this.getSelections();
if(_726.length>0){
var _727=_726[0].getLayoutType();
for(var i=1;i<_726.length;i++){
if(_727!=_726[i].getLayoutType()){
return 0;
}
}
return 1;
}
return -1;
};
CSelectionController.prototype.selectionsAreAllOnSameColumn=function(){
var _729=this.getSelections();
var i=0;
if(_729.length>0){
var _72b=_729[0].getColumnRef();
if(_72b!=null&&_72b!=""){
for(i=1;i<_729.length;i++){
if(_72b!=_729[i].getColumnRef()){
return false;
}
}
}else{
var _72c=_729[0].getCellTypeId();
for(i=1;i<_729.length;i++){
if(_72c!=_729[i].getCellTypeId()){
return false;
}
}
}
return true;
}
return false;
};
CSelectionController.prototype.checkForReportElementNode=function(node){
if(typeof node!="undefined"&&node!=null&&typeof node.className!="undefined"&&node.className!=null){
if(node.className=="tt"){
if(typeof node.parentNode!="undefined"&&node.parentNode!=null&&typeof node.parentNode.parentNode!="undefined"&&node.parentNode.parentNode!=null&&(node.parentNode.className=="reportSubtitleStyle"||node.parentNode.id=="reportTitleLink")){
node=node.parentNode.parentNode;
}else{
return false;
}
}else{
if(typeof node.parentNode!="undefined"&&node.parentNode!=null){
var _72e=node.parentNode;
while(typeof _72e!="undefined"&&_72e!=null){
if(typeof _72e.className!="undefined"&&_72e.className!=null&&_72e.className.substr(0,2)=="ft"){
node=_72e;
break;
}else{
_72e=_72e.parentNode;
}
}
}else{
return false;
}
}
var _72f=node.className.substr(0,2);
if(_72f=="ta"||_72f=="ts"||_72f=="ft"){
return true;
}
}
return false;
};
CSelectionController.prototype.chartClicked=function(_730){
this.setSelectedChartArea(_730);
};
CSelectionController.prototype.processColumnTitleNode=function(_731){
if(!_731||!this.m_oCognosViewer.isBux){
return;
}
var _732=_731.getCellRef();
if(_732.getAttribute("contextAugmented")=="true"||"list"!=_731.getDataContainerType()||"columnTitle"!=_731.getLayoutType()){
return;
}
var _733=_731.getSelectedContextIds();
var _734=false;
if(typeof _733=="object"&&_733!=null&&_733.length>0){
if(this.isRelational(_733)&&this.getQueryModelId(_733[0][0])==null){
_734=true;
}else{
return;
}
}
var lid=_732.parentNode.parentNode.parentNode.getAttribute("lid");
var _736=_732.parentNode.nextSibling;
var _737=getChildElementsByAttribute(_736,"td","cid",_732.getAttribute("cid"));
var _738=null;
var _739=true;
var _73a;
if(_737.length>0){
var _73b=_737[0];
var _73c=_73b.childNodes.length;
for(var _73d=0;_73d<_73c;_73d++){
var _73e=_73b.childNodes[_73d];
if(_73e.getAttribute&&((_73e.nodeName.toLowerCase()=="table"&&typeof _73e.getAttribute("lid")=="string")||_73e.nodeName.toLowerCase()=="map"||_73e.nodeName.toLowerCase()=="img"||_73e.getAttribute("chartcontainer")=="true")){
if(_73d==0){
_739=false;
}
}else{
_73a=[];
if(_73e.nodeName.toLowerCase()=="span"){
_73a.push(_73e);
}
var _73f=_73e.getElementsByTagName?_73e.getElementsByTagName("span"):[];
for(var _740=0;_740<_73f.length;++_740){
if(lid==getImmediateLayoutContainerId(_73f[_740])){
_73a.push(_73f[_740]);
}
}
for(var _741=0;_741<_73a.length;++_741){
var _742=_73a[_741];
if(_742.nodeType==1&&_742.nodeName.toLowerCase()=="span"&&_742.style.visibility!="hidden"){
if(_742.getAttribute("ctx")!=null&&_742.getAttribute("ctx")!=""){
_738=_742.getAttribute("ctx");
break;
}
}
}
}
}
}
if(_738!=null){
var _743=_738.split("::")[0].split(":")[0];
if(!_734){
_73a=_732.getElementsByTagName("span");
if(_73a.length!=0){
var _744=this.m_oCDManager.m_cd[_743];
var _745=this.getTextValue(_73a);
var _746={"u":_745===null?"":_745};
if(typeof _744!="undefined"){
if(typeof _744["r"]!="undefined"){
_746.r=_744["r"];
}
if(typeof _744["q"]!="undefined"){
_746.q=_744["q"];
}
if(typeof _744["i"]!="undefined"){
_746.i=_744["i"];
}
}
var _747="cloned"+_743;
this.m_oCDManager.m_cd[_747]=_746;
_73a[0].setAttribute("ctx",_747);
_731=this.getSelectionObjectFactory().processCTX(_731,_747);
}
}else{
var qmid=this.getQueryModelId(_743);
if(qmid==null){
}
if(qmid!=null){
var _749=_733[0][0];
this.m_oCDManager.m_cd[_749].i=this.m_oCDManager.m_cd[_743].i;
return false;
}
}
}else{
_739=false;
}
if(!_739){
_732.setAttribute("canSort","false");
}
_732.setAttribute("contextAugmented","true");
};
CSelectionController.prototype.selectionsInSameDataContainer=function(){
try{
var _74a=this.getAllSelectedObjects();
var _74b=_74a[0].getLayoutElementId();
for(var _74c=1;_74c<_74a.length;_74c++){
if(_74b!=_74a[_74c].getLayoutElementId()){
return false;
}
}
}
catch(e){
return false;
}
return true;
};
CSelectionController.prototype.selectionsFromSameDataItem=function(){
try{
var _74d=this.getAllSelectedObjects();
var _74e=_74d[0].getDataItems()[0][0];
for(var _74f=1;_74f<_74d.length;_74f++){
if(_74e!=_74d[_74f].getDataItems()[0][0]){
return false;
}
}
}
catch(e){
return false;
}
return true;
};
CSelectionController.prototype.isRelational=function(_750){
try{
if(!_750){
var _751=this.getAllSelectedObjects()[0];
_750=_751.getSelectedContextIds();
}
for(var _752=0;_752<_750.length;_752++){
for(var _753=0;_753<_750[_752].length;_753++){
var ctx=_750[_752][_753];
var mun=this.getMun(ctx);
var lun=this.getLun(ctx);
var hun=this.getHun(ctx);
if(mun!=null&&typeof mun!="undefined"&&mun.length>0){
return false;
}
if(lun!=null&&typeof lun!="undefined"&&lun.length>0){
return false;
}
if(hun!=null&&typeof hun!="undefined"&&hun.length>0){
return false;
}
}
}
return true;
}
catch(e){
return true;
}
return true;
};
CSelectionController.prototype.getDataContainerType=function(){
try{
if(!this.getAllSelectedObjects()[0]){
return "";
}
return this.getAllSelectedObjects()[0].m_dataContainerType;
}
catch(e){
return "";
}
};
CSelectionController.prototype.areSelectionsColumnRowTitles=function(){
try{
var _758=this.getAllSelectedObjects();
for(var _759=0;_759<_758.length;_759++){
var _75a=_758[_759];
if(_75a.getLayoutType()!="columnTitle"||_75a.isHomeCell()){
return false;
}
}
}
catch(e){
return false;
}
return true;
};
CSelectionController.prototype.selectionsAreMeasures=function(){
try{
var _75b=this.getAllSelectedObjects();
for(var _75c=0;_75c<_75b.length;_75c++){
var _75d=_75b[_75c];
if(this.getUsageInfo(_75d.getSelectedContextIds()[0][0])!=this.c_usageMeasure){
return false;
}
}
}
catch(e){
return false;
}
return true;
};
CSelectionController.prototype.selectionsNonMeasureWithMUN=function(){
var _75e=this.getAllSelectedObjects();
if(_75e.length==0){
return false;
}
for(var _75f=0;_75f<_75e.length;_75f++){
var _760=_75e[0];
if(_760.getSelectedContextIds().length==0){
return false;
}
var _761=_760.getSelectedContextIds()[0][0];
var mun=this.getMun(_761);
var _763=this.getUsageInfo(_761);
if(mun==null||typeof mun=="undefined"||mun.length==0||_763==this.c_usageMeasure){
return false;
}
}
return true;
};
CSelectionController.prototype.areSelectionsMeasureOrCalculation=function(){
var _764=this.getAllSelectedObjects();
if(_764.length==0){
return false;
}
var _765=this.selectionsHaveCalculationMetadata();
for(var _766=0;_766<_764.length;_766++){
var _767=_764[_766];
var _768=_767.getSelectedContextIds()[0][0];
if(!this.isCalculationOrMeasure(_768,_765)){
return false;
}
}
return true;
};
CSelectionController.prototype.selectionsHaveCalculationMetadata=function(){
try{
var _769=this.getDataContainerType();
var _76a=this.getAllSelectedObjects();
for(var _76b=0;_76b<_76a.length;_76b++){
var _76c=_76a[_76b];
var _76d=_76c.getSelectedContextIds();
var _76e=_76d[0][0];
var sHun=this.getHun(_76e);
if(!this.hasCalculationMetadata(_76e,_76d,_769)){
return false;
}
}
}
catch(e){
return false;
}
return true;
};
CSelectionController.prototype.isCalculationOrMeasure=function(_770,_771){
var mun=this.getMun(_770);
var _773=this.getUsageInfo(_770);
if(!(((mun==null||typeof mun=="undefined"||mun.length==0)&&_771)||_773==this.c_usageMeasure)){
return false;
}
return true;
};
CSelectionController.prototype.hasCalculationMetadata=function(_774,_775,_776){
var sHun=this.getHun(_774);
if(this.getUsageInfo(_774)!=this.c_usageMeasure){
if((this.isRelational(_775)&&this.getQueryModelId(_774)!=null)||(!this.isRelational(_775)&&_776=="list"&&(sHun&&sHun!=""))){
return false;
}
}
return true;
};
CSelectionController.prototype.selectionsAreDateTime=function(){
try{
var _778=this.getAllSelectedObjects();
for(var _779=0;_779<_778.length;_779++){
var _77a=_778[_779];
var _77b=_77a.getSelectedContextIds();
var _77c=_77b[0][0];
var _77d=this.getDataType(_77c);
if(_77d&&typeof this.m_ccl_dateTypes[_77d]!=="undefined"){
return true;
}
}
}
catch(e){
return false;
}
return false;
};
CSelectionController.prototype.getSelectedObjectsJsonContext=function(){
try{
var _77e=this.getAllSelectedObjects();
if(_77e===null||_77e.length<=0){
return null;
}
var _77f=this.m_oCognosViewer.getModelPath();
var _780=[];
for(var i=0;i<_77e.length;i++){
var obj=_77e[i].getContextJsonObject(this,_77f);
_780.push(obj);
}
return _780;
}
catch(e){
}
};
CSelectionController.prototype.destroy=function(){
delete this.m_oCognosViewer;
delete this.m_aCutColumns;
delete this.m_aSelectedObjects;
delete this.m_selectedClass;
delete this.m_cutClass;
if(this.m_oObserver&&this.m_oObserver.destroy){
this.m_oObserver.destroy();
}
delete this.m_oObserver;
delete this.m_aReportMetadataArray;
delete this.m_aReportContextDataArray;
if(this.m_oCDManager&&this.m_oCDManager.destroy){
this.m_oCDManager.destroy();
}
delete this.m_oCDManager;
if(this.m_oSelectionObjectFactory&&this.m_oSelectionObjectFactory.destroy){
this.m_oSelectionObjectFactory.destroy();
}
delete this.m_oSelectionObjectFactory;
delete this.m_selectedChartArea;
delete this.m_selectedChartNodes;
delete this.m_selectionContainerMap;
delete this.m_chartHelpers;
delete this.m_oJsonForMarshal;
if(this.hasSavedSelections()){
this.clearSavedSelections();
}
};
function clearTextSelection(_783){
if(!_783){
_783=document;
}
try{
if(typeof _783.selection=="object"&&_783.selection!==null){
_783.selection.empty();
}else{
if(typeof window.getSelection=="function"&&typeof window.getSelection()=="object"&&window.getSelection()!==null){
window.getSelection().removeAllRanges();
}
}
}
catch(e){
}
};
function CtxArrayPlaceHolder(){
};
var self=window;
function CDrillManager(oCV){
this.m_drawDrillTargets=false;
this.setCV(oCV);
};
CDrillManager.prototype=new CViewerHelper();
CDrillManager.prototype.getSelectionController=function(){
var _785;
try{
_785=getCognosViewerSCObjectRef(this.getCV().getId());
}
catch(e){
_785=null;
}
return _785;
};
CDrillManager.prototype.getSelectedObject=function(){
var _786=this.getSelectionController();
if(_786==null){
return null;
}
var _787=null;
var _788=null;
if(_786.hasSelectedChartNodes()){
_788=_786.getSelectedChartNodes();
}else{
_788=_786.getSelections();
}
if(_788&&_788.length==1){
_787=_788[0];
}
return _787;
};
CDrillManager.prototype.canDrillUp=function(){
if(this.getDrillOption("drillUp")==true&&this.hasMuns()){
return true;
}
return false;
};
CDrillManager.prototype.canDrillDown=function(){
if(this.getDrillOption("drillDown")==true){
return true;
}
return false;
};
CDrillManager.prototype.hasMuns=function(_789){
if(typeof _789=="undefined"){
_789=this.getSelectedObject();
}
if(_789==null){
return false;
}
var _78a=_789.getMuns();
var muns="";
for(var _78c=0;_78c<_78a.length&&muns=="";++_78c){
if(typeof _78a[_78c][0]!="undefined"){
muns+=_78a[_78c][0];
}
}
return (muns!="");
};
CDrillManager.prototype.getRefQuery=function(){
var _78d="";
var _78e=this.getSelectedObject();
if(_78e==null){
return "";
}
var _78f=_78e.getRefQueries();
for(var i=0;i<_78f.length;i++){
if(_78f[i]!=null){
for(var j=0;j<_78f[i].length;j++){
if(_78f[i][j]!=null&&_78f[i][j]!=""){
return _78f[i][j];
}
}
}
}
return _78d;
};
CDrillManager.prototype.isIsolated=function(){
var _792=this.getSelectionController();
if(_792==null||_792.getDrillUpDownEnabled()==false){
return false;
}
var _793=this.getSelectedObject();
if(_793==null){
return false;
}
if(_793 instanceof CSelectionChartObject&&_792!=null){
var _794=_793.getArea();
if(_794!=null){
var _795=_794.getAttribute("isolated");
if(typeof _795!="undefined"&&_795!=null&&_795=="true"){
return true;
}
}
}else{
var _796=_793.getCellRef();
if(typeof _796=="object"&&_796!=null){
var _797=_796.getElementsByTagName("span");
if(_797!=null&&typeof _797!="undefined"&&_797.length>0){
var _798=_797[0].getAttribute("isolated");
if(_798!=null&&_798!="undefined"&&_798=="true"){
return true;
}
}
}
}
return false;
};
CDrillManager.prototype.getDrillOption=function(_799){
var _79a=this.getSelectionController();
if(_79a==null||_79a.getDrillUpDownEnabled()==false||typeof _799=="undefined"){
return false;
}
var _79b=this.getSelectedObject();
if(_79b==null){
return false;
}
if(this.isIsolated()){
if(_799=="drillDown"){
return false;
}else{
if(_799=="drillUp"){
return true;
}
}
}
if(_799=="drillDown"){
if(_79b instanceof CSelectionChartObject&&_79a!=null){
var _79c=_79b.getArea();
if(_79c!=null){
var _79d=_79c.getAttribute("isChartTitle");
if(typeof _79d!="undefined"&&_79d!=null&&_79d=="true"){
return false;
}
}
}
}
var _79e=_79b.getDrillOptions();
var _79f=(typeof DrillContextMenuHelper!=="undefined"&&DrillContextMenuHelper.needsDrillSubMenu(this.m_oCV));
for(var idx=0;idx<_79e.length;++idx){
var _7a1=(_79f)?_79e[idx].length:1;
for(var _7a2=0;_7a2<_7a1;++_7a2){
var _7a3=_79e[idx][_7a2];
if(_7a3=="3"){
return true;
}else{
if(_799=="drillUp"&&_7a3=="1"){
return true;
}else{
if(_799=="drillDown"&&_7a3=="2"){
return true;
}
}
}
}
}
return false;
};
CDrillManager.prototype.canDrillThrough=function(){
var _7a4=this.getSelectionController();
if(_7a4==null||_7a4.getModelDrillThroughEnabled()==false){
return false;
}
return true;
};
CDrillManager.prototype.singleClickDrillEvent=function(evt,app){
var _7a7=this.getSelectionController();
if(_7a7!=null){
if(this.getCV().bCanUseCognosViewerSelection==true){
_7a7.pageClicked(evt);
}
}
var node=getCrossBrowserNode(evt);
try{
if(node.className&&node.className.indexOf("dl")==0){
if(this.canDrillDown()){
this.singleClickDrillDown(evt,app);
return true;
}else{
if(this.canDrillUp()){
this.singleClickDrillUp(evt,app);
return true;
}
}
}
}
catch(e){
}
if(app=="RV"){
return this.getDrillThroughParameters("execute",evt);
}
return false;
};
CDrillManager.prototype.singleClickDrillDown=function(evt,app){
if(app=="QS"){
this.qsDrillDown();
}else{
this.rvDrillDown();
}
};
CDrillManager.prototype.singleClickDrillUp=function(evt,app){
if(app=="QS"){
this.qsDrillUp();
}else{
this.rvDrillUp();
}
};
CDrillManager.prototype.getDrillParameters=function(_7ad,_7ae,_7af,_7b0){
var _7b1=[];
var _7b2=this.getSelectedObject();
if(_7b2==null){
return _7b1;
}
if(typeof _7ae=="undefined"){
_7ae=true;
}
var _7b3=_7b2.getDataItems();
var _7b4=_7b2.getMuns();
var _7b5=_7b2.getDimensionalItems("lun");
var _7b6=_7b2.getDimensionalItems("hun");
var _7b7=_7b2.getDrillOptions();
if(typeof _7b3=="undefined"||typeof _7b4=="undefined"||typeof _7b7=="undefined"||_7b4==null||_7b3==null||_7b7==null){
return _7b1;
}
if(_7b4.length!=_7b3.length){
return _7b1;
}
var _7b8=_7b4.length;
for(var _7b9=0;_7b9<_7b8;++_7b9){
if(_7b3[_7b9].length!=0){
var _7ba=(_7b0)?this.findUserSelectedDrillItem(_7b0,_7b3[_7b9]):0;
if(_7ba<0){
continue;
}
if((_7af===true)||this.getDrillOption(_7ad)){
if(_7b4[_7b9][_7ba]==""||_7b1.toString().indexOf(_7b4[_7b9][_7ba],0)==-1){
_7b1[_7b1.length]=_7b3[_7b9][_7ba];
_7b1[_7b1.length]=_7b4[_7b9][_7ba];
if(_7ae===true){
_7b1[_7b1.length]=_7b5[_7b9][_7ba];
_7b1[_7b1.length]=_7b6[_7b9][_7ba];
}
}
}
}
}
return _7b1;
};
CDrillManager.prototype.findUserSelectedDrillItem=function(_7bb,_7bc){
for(var _7bd=0;_7bd<_7bc.length;++_7bd){
if(_7bb==_7bc[_7bd]){
return _7bd;
}
}
return -1;
};
CDrillManager.prototype.getModelDrillThroughContext=function(_7be){
var _7bf="";
if(this.canDrillThrough()===true){
if(typeof gUseNewSelectionContext=="undefined"){
var _7c0="";
if(typeof getConfigFrame!="undefined"){
_7c0=decodeURIComponent(getConfigFrame().cfgGet("PackageBase"));
}else{
if(this.getCV().getModelPath()!==""){
_7c0=this.getCV().getModelPath();
}
}
_7bf=getViewerSelectionContext(this.getSelectionController(),new CSelectionContext(_7c0));
}else{
var _7c1=new CParameterValues();
var _7c2=this.getSelectionController();
if(_7c2){
var _7c3=_7c2.getAllSelectedObjects();
for(var _7c4=0;_7c4<_7c3.length;++_7c4){
var _7c5=_7c3[_7c4];
var _7c6=_7c5.getMuns();
var _7c7=_7c5.getMetadataItems();
var _7c8=_7c5.getUseValues();
for(var _7c9=0;_7c9<_7c7.length;++_7c9){
for(var idx=0;idx<_7c7[_7c9].length;++idx){
if(_7c7[_7c9][idx]==null||_7c7[_7c9][idx]==""){
continue;
}
var name=_7c7[_7c9][idx];
var _7cc;
if(_7c6[_7c9][idx]!=null&&_7c6[_7c9][idx]!=""){
_7cc=_7c6[_7c9][idx];
}else{
_7cc=_7c8[_7c9][idx];
}
var _7cd=_7c8[_7c9][idx];
_7c1.addSimpleParmValueItem(name,_7cc,_7cd,"true");
}
}
}
}
var _7ce=_7be.XMLBuilderCreateXMLDocument("context");
_7bf=_7c1.generateXML(_7be,_7ce);
}
}
return _7bf;
};
CDrillManager.prototype.rvDrillUp=function(_7cf){
this.getCV().executeAction("DrillUp",_7cf);
};
CDrillManager.prototype.rvDrillDown=function(_7d0){
this.getCV().executeAction("DrillDown",_7d0);
};
CDrillManager.prototype.rvBuildXMLDrillParameters=function(_7d1,_7d2){
var _7d3=this.getDrillParameters(_7d1,true,false,_7d2);
if(_7d3.length==0){
return drillParams;
}
return this.buildDrillParametersSpecification(_7d3);
};
CDrillManager.prototype.buildDrillParametersSpecification=function(_7d4){
var _7d5="<DrillParameters>";
var idx=0;
while(idx<_7d4.length){
_7d5+="<DrillGroup>";
_7d5+="<DataItem>";
_7d5+=sXmlEncode(_7d4[idx++]);
_7d5+="</DataItem>";
_7d5+="<MUN>";
_7d5+=sXmlEncode(_7d4[idx++]);
_7d5+="</MUN>";
_7d5+="<LUN>";
_7d5+=sXmlEncode(_7d4[idx++]);
_7d5+="</LUN>";
_7d5+="<HUN>";
_7d5+=sXmlEncode(_7d4[idx++]);
_7d5+="</HUN>";
_7d5+="</DrillGroup>";
}
_7d5+="</DrillParameters>";
return _7d5;
};
CDrillManager.prototype.getAuthoredDrillsForCurrentSelection=function(){
var _7d7=null;
var _7d8=this.getAuthoredDrillThroughTargets();
if(_7d8.length>0){
var _7d9="<AuthoredDrillTargets>";
for(var _7da=0;_7da<_7d8.length;++_7da){
_7d9+=eval("\""+_7d8[_7da]+"\"");
}
_7d9+="</AuthoredDrillTargets>";
var cv=this.getCV();
var _7dc=cv.getAction("AuthoredDrill");
var _7dd=cv.getDrillTargets();
if(_7dd.length>0){
_7d7=_7dc.getAuthoredDrillThroughContext(_7d9,_7dd);
}
}
return _7d7;
};
CDrillManager.prototype.getAuthoredDrillsForGotoPage=function(){
var _7de="";
var _7df=this.getAuthoredDrillsForCurrentSelection();
if(_7df){
_7de=XMLBuilderSerializeNode(_7df);
}
return _7de;
};
CDrillManager.prototype.launchGoToPage=function(_7e0,_7e1){
var _7e2=this.getSelectionController();
if((_7e2!=null&&_7e2.getModelDrillThroughEnabled()==true)||(typeof _7e0!="undefined"&&_7e0!=null&&_7e0!="")){
var _7e3=this.getAuthoredDrillsForGotoPage();
var _7e4=this.getModelDrillThroughContext(self);
var form=document.getElementById("drillForm");
if(form!=null){
document.body.removeChild(form);
}
form=document.createElement("form");
var cvid=this.getCVId();
var _7e7=document.forms["formWarpRequest"+cvid];
form.setAttribute("id","drillForm");
form.setAttribute("name","drillForm");
form.setAttribute("target",_7e7.getAttribute("target"));
form.setAttribute("method","post");
form.setAttribute("action",_7e7.getAttribute("action"));
form.style.display="none";
document.body.appendChild(form);
if(this.getCV().getModelPath()!==""){
form.appendChild(createHiddenFormField("modelPath",this.getCV().getModelPath()));
}
if(typeof _7e7["ui.object"]!="undefined"&&_7e7["ui.object"].value!=""){
form.appendChild(createFormField("drillSource",_7e7["ui.object"].value));
}else{
if(typeof this.getCV().envParams["ui.spec"]!="undefined"){
form.appendChild(createFormField("sourceSpecification",this.getCV().envParams["ui.spec"]));
}
}
if(_7e3!=""){
form.appendChild(createHiddenFormField("m","portal/drillthrough.xts"));
form.appendChild(createFormField("invokeGotoPage","true"));
form.appendChild(createFormField("m","portal/drillthrough.xts"));
form.appendChild(createFormField("modelDrillEnabled",_7e2.getModelDrillThroughEnabled()));
if(typeof gUseNewSelectionContext=="undefined"){
form.appendChild(createFormField("newSelectionContext","true"));
}
}else{
if(typeof gUseNewSelectionContext=="undefined"){
form.appendChild(createHiddenFormField("m","portal/goto2.xts"));
}else{
form.appendChild(createHiddenFormField("m","portal/goto.xts"));
}
}
form.appendChild(createHiddenFormField("b_action","xts.run"));
form.appendChild(createHiddenFormField("drillTargets",_7e3));
if(typeof gUseNewSelectionContext=="undefined"){
form.appendChild(createHiddenFormField("drillContext",_7e4));
}else{
form.appendChild(createHiddenFormField("modeledDrillthru",_7e4));
}
form.appendChild(createHiddenFormField("errURL","javascript:window.close();"));
if(typeof _7e1!="undefined"&&_7e1==true){
form.appendChild(this.createFormField("directLaunch","true"));
}
var _7e8="";
if(this.getCV().envParams["ui.routingServerGroup"]){
_7e8=this.getCV().envParams["ui.routingServerGroup"];
}
form.appendChild(createHiddenFormField("ui.routingServerGroup",_7e8));
if(this.getCV().getExecutionParameters()!=""){
form.appendChild(createHiddenFormField("encExecutionParameters",this.getCV().getExecutionParameters()));
}
if(_7e7.lang&&_7e7.lang.value!=""){
form.appendChild(createHiddenFormField("lang",_7e7.lang.value));
}
if(!this.getCV()||!this.getCV().launchGotoPageForIWidgetMobile(drillForm)){
if(typeof this.getCV().launchGotoPage==="function"){
this.getCV().launchGotoPage(form);
}else{
var _7e9="winNAT_"+(new Date()).getTime();
var _7ea=this.getCV().getWebContentRoot()+"/rv/blankDrillWin.html?cv.id="+cvid;
window.open(_7ea,_7e9,"toolbar,location,status,menubar,resizable,scrollbars=1");
form.target=_7e9;
}
}
}
};
CDrillManager.prototype.buildSearchPageXML=function(_7eb,pkg,_7ed,_7ee,_7ef,_7f0,_7f1){
var _7f2=null;
if(typeof _7eb.XMLElement=="function"){
_7f2=_7eb.XMLBuilderCreateXMLDocument("cognosSearch");
_7eb.XMLBuilderSetAttributeNodeNS(_7f2.documentElement,"xmlns:cs","http://developer.cognos.com/schemas/cs/1/");
var _7f3=_7f2.createElement("package");
if(typeof pkg=="string"&&pkg!==""){
_7f3.appendChild(_7f2.createTextNode(pkg));
}
_7f2.documentElement.appendChild(_7f3);
var _7f4=_7f2.createElement("model");
if(typeof _7ed=="string"&&_7ed!==""){
_7f4.appendChild(_7f2.createTextNode(_7ed));
}
_7f2.documentElement.appendChild(_7f4);
var _7f5=_7f2.createElement("selectedContext");
_7eb.XMLBuilderSetAttributeNodeNS(_7f5,"xmlns:xs","http://www.w3.org/2001/XMLSchema");
_7eb.XMLBuilderSetAttributeNodeNS(_7f5,"xmlns:bus","http://developer.cognos.com/schemas/bibus/3/");
_7eb.XMLBuilderSetAttributeNodeNS(_7f5,"SOAP-ENC:arrayType","bus:parameterValue[]","http://schemas.xmlsoap.org/soap/encoding/");
_7eb.XMLBuilderSetAttributeNodeNS(_7f5,"xmlns:xsd","http://www.w3.org/2001/XMLSchema");
_7eb.XMLBuilderSetAttributeNodeNS(_7f5,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_7f2.documentElement.appendChild(_7f5);
for(var _7f6 in _7ee){
var _7f7=_7f2.createElement("item");
_7eb.XMLBuilderSetAttributeNodeNS(_7f7,"xsi:type","bus:parameterValue","http://www.w3.org/2001/XMLSchema-instance");
var _7f8=_7eb.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:name",_7f2);
_7eb.XMLBuilderSetAttributeNodeNS(_7f8,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_7f8.appendChild(_7f2.createTextNode(_7ee[_7f6].name));
var _7f9=_7eb.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:value",_7f2);
_7eb.XMLBuilderSetAttributeNodeNS(_7f9,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_7eb.XMLBuilderSetAttributeNodeNS(_7f9,"SOAP-ENC:arrayType","bus:parmValueItem[]","http://schemas.xmlsoap.org/soap/encoding/");
for(var j=0;j<_7ee[_7f6].values.length;j++){
var _7fb=_7f2.createElement("item");
_7eb.XMLBuilderSetAttributeNodeNS(_7fb,"xsi:type","bus:simpleParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
var _7fc=_7eb.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:use",_7f2);
_7eb.XMLBuilderSetAttributeNodeNS(_7fc,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_7fc.appendChild(_7f2.createTextNode(_7ee[_7f6].values[j][0]));
var _7fd=_7eb.XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:display",_7f2);
_7eb.XMLBuilderSetAttributeNodeNS(_7fd,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
var _7fe=_7ee[_7f6].values[j][1]==null?"":_7ee[_7f6].values[j][1];
_7fd.appendChild(_7f2.createTextNode(_7fe));
_7fb.appendChild(_7fc);
_7fb.appendChild(_7fd);
_7f9.appendChild(_7fb);
}
_7f7.appendChild(_7f8);
_7f7.appendChild(_7f9);
_7f5.appendChild(_7f7);
}
var _7ff=_7f2.createElement("defaultMeasure");
_7f2.documentElement.appendChild(_7ff);
_7f0.buildXML(_7eb,_7f2,"data");
var _800=_7f2.createElement("filter");
_7f2.documentElement.appendChild(_800);
}
return _7f2;
};
CDrillManager.prototype.openSearchPage=function(_801,_802){
this.getModelDrillThroughContext(self);
var _803=document.getElementById("searchPage");
if(_803!=null){
document.body.removeChild(_803);
}
_803=document.createElement("form");
_803.setAttribute("id","searchPage");
_803.setAttribute("name","searchPage");
_803.setAttribute("method","post");
_803.setAttribute("target",_803.name);
_803.setAttribute("action",this.getCV().getGateway()+"/gosearch");
_803.style.display="none";
document.body.appendChild(_803);
_803.appendChild(createHiddenFormField("csn.action","search"));
_803.appendChild(createHiddenFormField("csn.drill",_802));
var _804=window.open("",_803.name,"directories=no,location=no,status=no,toolbar=no,resizable=yes,scrollbars=yes,top=100,left=100,height=480,width=640");
_804.focus();
_803.submit();
};
CDrillManager.prototype.launchSearchPage=function(){
var _805=this.getSelectionController();
var _806=document.forms["formWarpRequest"+this.getCVId()];
var _807=this.determineSelectionsForSearchPage(_805);
var _808=this.getSearchContextDataSpecfication(_805);
var _809=this.buildSearchPageXML(self,_806.packageBase.value,this.getCV().getModelPath(),_807,[],_808,[]);
this.openSearchPage(_806.packageBase.value,XMLBuilderSerializeNode(_809));
};
CDrillManager.prototype.qsDrillDown=function(){
if(!this.canDrillDown()){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
var _80a="DD:";
this.qsSendDrillCommand(_80a);
};
CDrillManager.prototype.qsDrillUp=function(){
if(!this.canDrillUp()){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
var _80b="DU:";
this.qsSendDrillCommand(_80b);
};
CDrillManager.prototype.qsSendDrillCommand=function(_80c){
var _80d;
if(_80c=="DU:"){
_80d="drillUp";
}else{
_80d="drillDown";
}
var _80e=this.getDrillParameters(_80d,false,false);
if(_80e.length==0){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
for(var idx=0;idx<_80e.length;++idx){
_80c+=getConfigFrame().escapeParam(_80e[idx]);
if(idx+1<_80e.length){
_80c+=",";
}
}
getConfigFrame().sendCmd(_80c,"",true);
};
CDrillManager.prototype.qsLaunchGoToPage=function(_810){
var _811=this.getSelectionController();
if(_811!=null&&_811.getModelDrillThroughEnabled()==true){
var _812=this.getModelDrillThroughContext(cf);
if(_812==""){
getConfigFrame().dlgGenericSelectionMessage(false);
return;
}
var _813=document.getElementById("gotoPage");
if(_813!=null){
document.body.removeChild(_813);
}
_813=document.createElement("form");
_813.setAttribute("id","gotoPage");
_813.setAttribute("name","gotoPage");
_813.setAttribute("method","post");
_813.style.display="none";
document.body.appendChild(_813);
var _814=getConfigFrame();
_813.appendChild(this.createFormField("objpath",decodeURIComponent(_814.cfgGet("PackageBase"))));
if(typeof gUseNewSelectionContext=="undefined"){
_813.appendChild(this.createFormField("m","portal/goto2.xts"));
}else{
_813.appendChild(this.createFormField("m","portal/goto.xts"));
}
_813.appendChild(this.createFormField("b_action","xts.run"));
if(typeof gUseNewSelectionContext=="undefined"){
_813.appendChild(this.createFormField("drillContext",_812));
}else{
_813.appendChild(this.createFormField("modeledDrillthru",_812));
}
if(typeof getConfigFrame().routingServerGroup!="undefined"){
_813.appendChild(this.createFormField("ui.routingServerGroup",getConfigFrame().routingServerGroup));
}
if(typeof _810!="undefined"&&_810==true){
_813.appendChild(this.createFormField("directLaunch","true"));
}
var _815=_814.goApplicationManager.getReportManager().getParameterManager().getExecutionParameters();
if(_815){
_813.appendChild(this.createFormField("encExecutionParameters",_815));
}
var _816="winNAT_"+(new Date()).getTime();
var _817=this.getCV().getWebContentRoot()+"/rv/blankDrillWin.html?cv.id="+this.getCVId();
window.open(_817,_816,"toolbar,location,status,menubar,resizable,scrollbars=1");
_813.target=_816;
}
};
CDrillManager.prototype.qsLaunchSearchPage=function(){
var cf=getConfigFrame();
var _819=goWindowManager.getSelectionController();
var _81a=this.determineSelectionsForSearchPage(_819);
var _81b=this.getSearchContextDataSpecfication(_819);
var _81c=decodeURIComponent(cf.cfgGet("PackageBase"));
var _81d=this.buildSearchPageXML(cf,_81c,decodeURIComponent(cf.cfgGet("cmLastModel")),_81a,[],_81b,[]);
this.openSearchPage(_81c,cf.XMLBuilderSerializeNode(_81d));
};
CDrillManager.prototype.determineSelectionsForSearchPage=function(_81e){
var _81f=new CtxArrayPlaceHolder();
var _820=_81e.getAllSelectedObjects();
for(var i=0;i<_820.length;i++){
var _822=_820[i].getColumnName();
if(!this.containsByIndiceInArray(_81f,_822)){
_81f[_822]={};
_81f[_822].name=_822;
_81f[_822].values=[];
}
var idx0="";
var muns=_820[i].getMuns();
if(muns!=null&&muns.length>0){
idx0=muns[0][0];
}
var idx1=_820[i].getDisplayValues()[0];
if(!(this.containsInArray(_81f[_822].values,0,idx0)&&this.containsInArray(_81f[_822].values,1,idx1))){
_81f[_822].values[_81f[_822].values.length]=[idx0,idx1];
}
}
return _81f;
};
CDrillManager.prototype.getSearchContextDataSpecfication=function(_826){
var _827=new CParameterValues();
var _828=_826.getCCDManager();
var _829=_828.m_cd;
for(var _82a in _829){
var _82b=_828.GetUsage(_82a);
if(_82b!="2"){
var _82c=_828.GetRDIValue(_82a);
var _82d=_828.GetDisplayValue(_82a);
_827.addSimpleParmValueItem(_82c,_82c,_82d,"true");
}
}
return _827;
};
CDrillManager.prototype.containsByIndiceInArray=function(a,v){
for(var i in a){
if(i==v){
return true;
}
}
return false;
};
CDrillManager.prototype.containsInArray=function(a,idx,v){
for(var i in a){
if(a[i][idx]==v){
return true;
}
}
return false;
};
CDrillManager.prototype.createFormField=function(name,_836){
var _837=document.createElement("input");
_837.setAttribute("type","hidden");
_837.setAttribute("name",name);
_837.setAttribute("value",_836);
return (_837);
};
CDrillManager.prototype.getAuthoredDrillThroughTargets=function(){
var _838=[];
var _839=this.getSelectionController();
var _83a=null;
if(_839!=null){
if(_839.getSelectedColumnIds().length==1){
var _83b=_839.getSelections();
for(var _83c=0;_83c<_83b.length;++_83c){
var _83d=_83b[_83c];
_83a=_83d.getCellRef();
while(_83a){
if(_83a.getAttribute("dtTargets")!=null){
_838.push("<rvDrillTargets>"+_83a.getAttribute("dtTargets")+"</rvDrillTargets>");
break;
}else{
if(_83a.getAttribute("onclick")!=null){
var _83e=_83a.getAttribute("onclick");
var _83f=null;
if(_83e.indexOf("doSingleDrillThrough")!=-1){
_83f=_83e.replace("doSingleDrillThrough","this.buildRvTargetsForSingleDrillThrough");
}else{
if(_83e.indexOf("doMultipleDrillThrough")!=-1){
_83f=_83e.replace("doMultipleDrillThrough","this.buildRvTargetsForMultipleDrillThrough");
}
}
if(_83f!=null){
var _840=eval(_83f);
if(_840!=null){
_838.push(_840);
break;
}
}
}
}
_83a=XMLHelper_GetFirstChildElement(_83a);
}
}
}else{
if(_839.hasSelectedChartNodes()){
var _841=_839.getSelectedChartNodes();
var _842=_841[0];
_83a=_842.getArea();
if(_83a.getAttribute("dtTargets")!=null){
_838.push("<rvDrillTargets>"+_83a.getAttribute("dtTargets")+"</rvDrillTargets>");
}
}else{
if(_839.getSelectedDrillThroughImage()!=null){
var _843=_839.getSelectedDrillThroughImage();
if(_843&&_843.getAttribute("dtTargets")!=null){
_838.push("<rvDrillTargets>"+_843.getAttribute("dtTargets")+"</rvDrillTargets>");
}
}else{
if(_839.getSelectDrillThroughSingleton()!=null){
var _844=_839.getSelectDrillThroughSingleton();
if(_844&&_844.getAttribute("dtTargets")!=null){
_838.push("<rvDrillTargets>"+_844.getAttribute("dtTargets")+"</rvDrillTargets>");
}
}
}
}
}
}
return _838;
};
CDrillManager.prototype.getDrillThroughParameters=function(_845,evt){
if(typeof _845=="undefined"){
_845="query";
}
var _847=[];
if(typeof evt!="undefined"){
var _848=getCrossBrowserNode(evt,true);
try{
while(_848){
if(typeof _848.getAttribute!="undefined"&&_848.getAttribute("dtTargets")){
_847.push("<rvDrillTargets>"+_848.getAttribute("dtTargets")+"</rvDrillTargets>");
break;
}
_848=_848.parentNode;
}
}
catch(e){
return false;
}
}else{
var oCV=this.getCV();
var _84a=oCV.getDrillMgr();
var _84b=_84a.getSelectionController();
if(_84b!=null){
var _84c=null;
if(_84b.hasSelectedChartNodes()){
var _84d=_84b.getSelectedChartNodes();
var _84e=_84d[0];
_84c=_84e.getArea();
}
if(_84c!=null){
_847.push("<rvDrillTargets>"+_84c.getAttribute("dtTargets")+"</rvDrillTargets>");
}else{
_847=this.getAuthoredDrillThroughTargets();
}
}
}
if(_847.length>0){
var _84f="<AuthoredDrillTargets>";
for(var _850=0;_850<_847.length;++_850){
_84f+=eval("\""+_847[_850]+"\"");
}
_84f+="</AuthoredDrillTargets>";
var _851=this.getCV().getAction("AuthoredDrill");
if(_845=="query"){
_851.populateContextMenu(_84f);
this.showOtherMenuItems();
}else{
if(this.getCV().envParams["cv.id"]=="AA"){
this.getCV().m_viewerFragment.raiseAuthoredDrillClickEvent();
}else{
_851.execute(_84f);
}
}
return true;
}else{
if(_845=="query"){
this.showOtherMenuItems();
return true;
}else{
return false;
}
}
};
CDrillManager.prototype.executeAuthoredDrill=function(_852){
var _853=decodeURIComponent(_852);
var _854=this.getCV().getAction("AuthoredDrill");
_854.executeDrillTarget(_853);
};
CDrillManager.prototype.doesMoreExist=function(_855){
for(var i=0;i<_855.getNumItems();i++){
var _857=_855.get(i);
if(_857!=null){
if((_857 instanceof CMenuItem)&&(_857.getLabel()==RV_RES.RV_MORE)&&(_857.getAction()==this.getCVObjectRef()+".getDrillMgr().launchGoToPage();")){
return true;
}
}
}
return false;
};
CDrillManager.prototype.showOtherMenuItems=function(){
var cv=this.getCV();
var _859=cv.rvMainWnd;
var _85a=_859.getToolbarControl();
var _85b=null;
var _85c=null;
if(typeof _85a!="undefined"&&_85a!=null){
_85b=_85a.getItem("goto");
if(_85b){
_85c=_85b.getMenu();
}
}
var _85d=_859.getContextMenu();
var _85e=_859.getUIHide();
var _85f=null;
if(typeof _85d!="undefined"&&_85d!=null&&_85d.getGoToMenuItem()){
_85f=_85d.getGoToMenuItem().getMenu();
}
var _860=null;
var _861=this.getSelectionController();
if(_85c!=null){
if(this.doesMoreExist(_85c)==false){
if(typeof gMenuSeperator!="undefined"&&_85c.getNumItems()>0&&(cv.bCanUseCognosViewerIndexSearch||_85e.indexOf(" RV_TOOLBAR_BUTTONS_GOTO_RELATED_LINKS ")==-1)){
_85c.add(gMenuSeperator);
}
var _862=new CMenuItem(_85c,RV_RES.RV_MORE,this.getCVObjectRef()+".getDrillMgr().launchGoToPage();","",gMenuItemStyle,cv.getWebContentRoot(),cv.getSkin());
if(_85e.indexOf(" RV_TOOLBAR_BUTTONS_GOTO_RELATED_LINKS ")!=-1){
_862.hide();
}else{
if(_861==null||_861.getModelDrillThroughEnabled()==false){
_862.disable();
}
}
}
}
if(_85f!=null){
if(typeof gMenuSeperator!="undefined"&&_85f.getNumItems()>0&&(cv.bCanUseCognosViewerIndexSearch||_85e.indexOf(" RV_CONTEXT_MENU_GOTO_RELATED_LINKS ")==-1)){
_85f.add(gMenuSeperator);
}
var _863=new CMenuItem(_85f,RV_RES.RV_MORE,this.getCVObjectRef()+".getDrillMgr().launchGoToPage();","",gMenuItemStyle,cv.getWebContentRoot(),cv.getSkin());
if(_85e.indexOf(" RV_CONTEXT_MENU_GOTO_RELATED_LINKS ")!=-1){
_863.hide();
}else{
if(_861==null||_861.getModelDrillThroughEnabled()==false){
_863.disable();
}
}
}
if(_860!=null&&_861!=null){
var _864=_861.getAllSelectedObjects();
if(_864==null||_864.length===0){
_860.disable();
}
}
if(_85c!=null){
_85c.draw();
if(_85c.isVisible()){
_85c.show();
}
}
if(_85f!=null){
_85f.draw();
if(_85f.isVisible()){
_85f.show();
}
}
};
CDrillManager.prototype.ddc=function(evt){
var node=getNodeFromEvent(evt);
if(node!=null&&node.getAttribute("ddc")!=="1"){
node.setAttribute("ddc","1");
if(node.getAttribute("dtTargets")){
node.className="dl "+node.className;
node.setAttribute("href","#");
return;
}
var _867=this.getSelectionController();
if(_867!=null){
var _868=_867.getSelectionObjectFactory().getSelectionChartObject(node);
if(_868!=null){
var _869=_868.getDrillOptions();
for(var idx=0;idx<_869.length;++idx){
var _86b=_869[idx][0];
if((node.getAttribute("isChartTitle")==="true"&&_86b=="1")||_86b=="3"||_86b=="2"){
node.className="dl "+node.className;
node.setAttribute("href","#");
break;
}
}
}
}
}
};
CDrillManager.prototype.buildRvTargetsForSingleDrillThrough=function(_86c){
if(typeof _86c=="undefined"||_86c==null){
return null;
}
var _86d=this.getCV().getDrillTargets();
if(!_86d||_86d.length==0){
return null;
}
var _86e=_86c[0][0];
if(typeof _86e=="undefined"||_86e==null){
return null;
}
var _86f=_86d[_86e];
if(typeof _86f=="undefined"||_86f==null){
return null;
}
var _870="<drillTarget drillIdx=\\\""+_86e+"\\\" label=\\\""+_86f.getLabel()+"\\\"/>";
return "<rvDrillTargets>"+_870+"</rvDrillTargets>";
};
CDrillManager.prototype.buildRvTargetsForMultipleDrillThrough=function(_871){
if(typeof _871=="undefined"||_871==null){
return null;
}
var _872=this.getCV().getDrillTargets();
if(!_872||_872.length==0){
return null;
}
var _873="";
for(var _874=0;_874<_871.length;++_874){
var _875=_871[_874];
if(_875.length<2){
continue;
}
var _876=_875[0];
if(typeof _876=="undefined"||_876==null){
continue;
}
var _877=_875[1];
if(typeof _877=="undefined"||_877==null){
continue;
}
var _878=_872[_876];
if(typeof _878=="undefined"||_878==null){
continue;
}
if(_877===null||_877===""){
_877=_878.getLabel();
}
_873+="<drillTarget drillIdx=\\\""+_876+"\\\" label=\\\""+_877+"\\\"/>";
}
if(_873.length>0){
return "<rvDrillTargets>"+_873+"</rvDrillTargets>";
}
return null;
};
function CDrillThroughTarget(_879,_87a,_87b,_87c,_87d,path,_87f,_880,_881,_882,_883,_884){
this.m_label=_879;
this.m_outputFormat=_87a;
this.m_outputLocale=_87b;
this.m_showInNewWindow=_87c;
this.m_method=_87d;
this.m_path=path;
this.m_bookmark=_87f;
this.m_parameters=_880;
this.m_objectPaths=_881;
this.m_prompt="false";
this.m_dynamicDrillThrough=false;
this.m_parameterProperties=_884;
if(typeof _882!="undefined"&&_882!=null){
if(_882=="yes"){
this.m_prompt="true";
}else{
if(_882=="target"){
this.m_prompt="";
}
}
}
if(typeof _883!="undefined"&&_883!=null){
if(typeof _883=="string"){
_883=_883=="true"?true:false;
}
this.m_dynamicDrillThrough=_883;
}
};
function CDrillThroughTarget_getParameterProperties(){
return this.m_parameterProperties;
};
function CDrillThroughTarget_getLabel(){
return this.m_label;
};
function CDrillThroughTarget_getOutputFormat(){
return this.m_outputFormat;
};
function CDrillThroughTarget_getOutputLocale(){
return this.m_outputLocale;
};
function CDrillThroughTarget_getShowInNewWindow(){
return this.m_showInNewWindow;
};
function CDrillThroughTarget_getMethod(){
return this.m_method;
};
function CDrillThroughTarget_getPath(){
return this.m_path;
};
function CDrillThroughTarget_getBookmark(){
return this.m_bookmark;
};
function CDrillThroughTarget_getParameters(){
return this.m_parameters;
};
function CDrillThroughTarget_getObjectPaths(){
return this.m_objectPaths;
};
function CDrillThroughTarget_getPrompt(){
return this.m_prompt;
};
function CDrillThroughTarget_isDynamicDrillThrough(){
return this.m_dynamicDrillThrough;
};
CDrillThroughTarget.prototype.getLabel=CDrillThroughTarget_getLabel;
CDrillThroughTarget.prototype.getOutputFormat=CDrillThroughTarget_getOutputFormat;
CDrillThroughTarget.prototype.getOutputLocale=CDrillThroughTarget_getOutputLocale;
CDrillThroughTarget.prototype.getShowInNewWindow=CDrillThroughTarget_getShowInNewWindow;
CDrillThroughTarget.prototype.getMethod=CDrillThroughTarget_getMethod;
CDrillThroughTarget.prototype.getPath=CDrillThroughTarget_getPath;
CDrillThroughTarget.prototype.getBookmark=CDrillThroughTarget_getBookmark;
CDrillThroughTarget.prototype.getParameters=CDrillThroughTarget_getParameters;
CDrillThroughTarget.prototype.getObjectPaths=CDrillThroughTarget_getObjectPaths;
CDrillThroughTarget.prototype.getPrompt=CDrillThroughTarget_getPrompt;
CDrillThroughTarget.prototype.isDynamicDrillThrough=CDrillThroughTarget_isDynamicDrillThrough;
CDrillThroughTarget.prototype.getParameterProperties=CDrillThroughTarget_getParameterProperties;
function sXmlEncode(_885){
var _886=""+_885;
if((_886=="0")||((_885!=null)&&(_885!=false))){
_886=_886.replace(/&/g,"&amp;");
_886=_886.replace(/</g,"&lt;");
_886=_886.replace(/>/g,"&gt;");
_886=_886.replace(/"/g,"&quot;");
_886=_886.replace(/'/g,"&apos;");
}else{
if(_885==null){
_886="";
}
}
return _886;
};
function createFormField(name,_888){
var _889=document.createElement("input");
_889.setAttribute("type","hidden");
_889.setAttribute("name",name);
_889.setAttribute("value",_888);
return (_889);
};
function setBackURLToCloseWindow(_88a){
var _88b=_88a.childNodes;
if(_88b){
for(var _88c=0;_88c<_88b.length;++_88c){
var _88d=_88b[_88c];
var _88e=_88d.getAttribute("name");
if(_88e&&_88e=="ui.backURL"){
_88a.removeChild(_88d);
}
}
}
_88a.appendChild(createFormField("ui.backURL","javascript:window.close();"));
};
function doMultipleDrills(_88f,cvId){
if(parent!=this&&parent.doMultipleDrills){
if(getCVId()!=""&&getCVId()!=cvId){
cvId=getCVId();
}
return parent.doMultipleDrills(_88f,cvId);
}else{
if(window.gViewerLogger){
window.gViewerLogger.log("Drill Targets",_88f,"text");
}
var oCV=null;
try{
oCV=getCognosViewerObjectRef(cvId);
}
catch(exception){
}
var _892=buildDrillForm(oCV);
addDrillEnvironmentFormFields(_892,oCV);
if(typeof oCV!="undefined"&&oCV!=null){
var _893=oCV.getModelPath();
_892.appendChild(createFormField("modelPath",_893));
var _894=oCV.getSelectionController();
var _895="";
if(typeof getViewerSelectionContext!="undefined"&&typeof CSelectionContext!="undefined"){
_895=getViewerSelectionContext(_894,new CSelectionContext(_893));
}
_892.appendChild(createFormField("drillContext",_895));
_892.appendChild(createFormField("modelDrillEnabled",_894.getModelDrillThroughEnabled()));
if(typeof document.forms["formWarpRequest"+oCV.getId()]["ui.object"]!="undefined"&&document.forms["formWarpRequest"+oCV.getId()]["ui.object"].value!=""){
_892.appendChild(createFormField("drillSource",document.forms["formWarpRequest"+oCV.getId()]["ui.object"].value));
}else{
if(typeof oCV.envParams["ui.spec"]!="undefined"){
_892.appendChild(createFormField("sourceSpecification",oCV.envParams["ui.spec"]));
}
}
}
_892.setAttribute("launchGotoPage","true");
_892.appendChild(createFormField("drillTargets",_88f));
_892.appendChild(createFormField("invokeGotoPage","true"));
_892.appendChild(createFormField("m","portal/drillthrough.xts"));
_892.appendChild(createFormField("b_action","xts.run"));
var _896="winNAT_"+(new Date()).getTime();
var _897="..";
if(oCV!=null){
_897=oCV.getWebContentRoot();
var _898=oCV.getExecutionParameters();
if(_898!=""){
_892.appendChild(createFormField("encExecutionParameters",_898));
}
}
if(!oCV||!oCV.launchGotoPageForIWidgetMobile(_892)){
if(oCV&&typeof oCV.launchGotoPage==="function"){
oCV.launchGotoPage(_892);
}else{
var _899=_897+"/rv/blankDrillWin.html";
_892.target=_896;
window.open(_899,_896);
}
}
}
};
function buildDrillForm(oCV){
var _89b=document.getElementById("drillForm");
if(_89b){
document.body.removeChild(_89b);
}
_89b=document.createElement("form");
if(typeof oCV!="undefined"&&oCV!=null){
var _89c=document.getElementById("formWarpRequest"+oCV.getId());
_89b.setAttribute("target",_89c.getAttribute("target"));
_89b.setAttribute("action",_89c.getAttribute("action"));
}else{
_89b.setAttribute("action",location.pathname);
}
_89b.setAttribute("id","drillForm");
_89b.setAttribute("name","drillForm");
_89b.setAttribute("method","post");
_89b.style.display="none";
document.body.appendChild(_89b);
return _89b;
};
function addDrillEnvironmentFormFields(_89d,oCV){
if(window.g_dfEmail){
_89d.appendChild(createFormField("dfemail",window.g_dfEmail));
}
if(oCV!=null){
_89d.appendChild(createFormField("cv.id",oCV.getId()));
if(typeof oCV.envParams["ui.sh"]!="undefined"){
_89d.appendChild(createFormField("ui.sh",oCV.envParams["ui.sh"]));
}
if(oCV.getViewerWidget()==null){
if(typeof oCV.envParams["cv.header"]!="undefined"){
_89d.appendChild(createFormField("cv.header",oCV.envParams["cv.header"]));
}
if(typeof oCV.envParams["cv.toolbar"]!="undefined"){
_89d.appendChild(createFormField("cv.toolbar",oCV.envParams["cv.toolbar"]));
}else{
var _89f=oCV.getAdvancedServerProperty("VIEWER_PASS_PORTLET_TOOLBAR_STATE_ON_DRILLTHROUGH");
if(oCV.m_viewerFragment&&_89f!=null&&_89f===true){
var _8a0=oCV.m_viewerFragment.canShowToolbar()?"true":"false";
_89d.appendChild(createFormField("cv.toolbar",_8a0));
}
}
}
if(typeof oCV.envParams["ui.backURL"]!="undefined"){
_89d.appendChild(createFormField("ui.backURL",oCV.envParams["ui.backURL"]));
}
if(typeof oCV.envParams["ui.postBack"]!="undefined"){
_89d.appendChild(createFormField("ui.postBack",oCV.envParams["ui.postBack"]));
}
if(typeof oCV.envParams["savedEnv"]!="undefined"){
_89d.appendChild(createFormField("savedEnv",oCV.envParams["savedEnv"]));
}
if(typeof oCV.envParams["ui.navlinks"]!="undefined"){
_89d.appendChild(createFormField("ui.navlinks",oCV.envParams["ui.navlinks"]));
}
if(typeof oCV.envParams["lang"]!="undefined"){
_89d.appendChild(createFormField("lang",oCV.envParams["lang"]));
}
if(typeof oCV.envParams["ui.errURL"]!="undefined"){
_89d.appendChild(createFormField("ui.errURL",oCV.envParams["ui.errURL"]));
}
var _8a1="";
if(oCV.envParams["ui.routingServerGroup"]){
_8a1=oCV.envParams["ui.routingServerGroup"];
}
_89d.appendChild(createHiddenFormField("ui.routingServerGroup",_8a1));
}else{
_89d.appendChild(createFormField("cv.header","false"));
_89d.appendChild(createFormField("cv.toolbar","false"));
}
};
function appendReportHistoryObjects(oCV,_8a3){
if(oCV!=null&&typeof oCV.rvMainWnd!="undefined"&&_8a3!=null){
oCV.rvMainWnd.addCurrentReportToReportHistory();
var _8a4=oCV.rvMainWnd.saveReportHistoryAsXML();
_8a3.appendChild(createFormField("cv.previousReports",_8a4));
}
};
function doSingleDrill(_8a5,args,_8a7,_8a8,_8a9,_8aa,_8ab,_8ac,cvId,_8ae,_8af){
var _8b0="";
if(typeof cvId=="string"){
_8b0=cvId;
}
var oCV=null;
try{
oCV=getCognosViewerObjectRef(cvId);
}
catch(exception){
}
if(!oCV&&parent!=this&&parent.doSingleDrill){
if(getCVId()!=""&&getCVId()!=cvId){
cvId=getCVId();
}
return parent.doSingleDrill(_8a5,args,_8a7,_8a8,_8a9,_8aa,_8ab,_8ac,cvId,_8ae,_8af);
}else{
if(typeof _8a7=="undefined"){
_8a7="default";
}else{
if(_8a7=="execute"){
_8a7="run";
}
}
if(_8a7=="edit"&&oCV!=null&&typeof oCV.m_viewerFragment){
_8a5="_blank";
}
var _8b2=buildDrillForm(oCV);
var _8b3="<authoredDrillRequest>";
_8b3+="<param name=\"action\">"+sXmlEncode(_8a7)+"</param>";
_8b3+="<param name=\"target\">"+sXmlEncode(args[0][1])+"</param>";
_8b3+="<param name=\"format\">"+sXmlEncode(_8a8)+"</param>";
_8b3+="<param name=\"locale\">"+sXmlEncode(_8a9)+"</param>";
_8b3+="<param name=\"prompt\">"+sXmlEncode(_8ae)+"</param>";
_8b3+="<param name=\"dynamicDrill\">"+sXmlEncode(_8af)+"</param>";
if(typeof oCV!="undefined"&&oCV!=null){
_8b3+="<param name=\"sourceTracking\">"+oCV.getTracking()+"</param>";
if(typeof document.forms["formWarpRequest"+oCV.getId()]["ui.object"]!="undefined"){
_8b3+="<param name=\"source\">"+sXmlEncode(document.forms["formWarpRequest"+oCV.getId()]["ui.object"].value)+"</param>";
}
var _8b4=oCV.getModelPath();
_8b3+="<param name=\"metadataModel\">"+sXmlEncode(_8b4)+"</param>";
_8b3+="<param name=\"selectionContext\">"+sXmlEncode(getViewerSelectionContext(oCV.getSelectionController(),new CSelectionContext(_8b4)))+"</param>";
if(typeof document.forms["formWarpRequest"+oCV.getId()]["ui.object"]!="undefined"&&document.forms["formWarpRequest"+oCV.getId()]["ui.object"].value!=""){
_8b3+="<param name=\"source\">"+sXmlEncode(document.forms["formWarpRequest"+oCV.getId()]["ui.object"].value)+"</param>";
}else{
if(typeof oCV.envParams["ui.spec"]!="undefined"){
_8b3+="<param name=\"sourceSpecification\">"+sXmlEncode(oCV.envParams["ui.spec"])+"</param>";
}
}
}
if(_8aa!=""){
_8b3+="<param name=\"bookmark\">"+_8aa+"</param>";
}
if(_8a7!="view"){
if(typeof _8ab!="undefined"){
_8b3+="<param name=\"sourceContext\">"+sXmlEncode(_8ab)+"</param>";
}
if(typeof _8ac!="undefined"){
_8b3+="<param name=\"objectPaths\">"+sXmlEncode(_8ac)+"</param>";
}
}
var _8b5=0;
_8b3+="<drillParameters>";
var _8b6=[];
for(_8b5=1;_8b5<args.length;_8b5++){
var sSel=args[_8b5][1];
if(_8a8=="HTML"&&(sSel.indexOf("<selectChoices")==0)){
var _8b8=XMLHelper_GetFirstChildElement(XMLHelper_GetFirstChildElement(XMLBuilderLoadXMLFromString(args[_8b5][1])));
if(_8b8){
var sMun=_8b8.getAttribute("mun");
if(sMun!=null&&sMun!=""){
_8b8.setAttribute("useValue",sMun);
sSel="<selectChoices>"+XMLBuilderSerializeNode(_8b8)+"</selectChoices>";
}
}
}
var _8ba=args[_8b5][0];
var _8bb=false;
for(var i=0;i<_8b6.length;i++){
var _8bd=_8b6[i];
if(_8bd.name===_8ba&&_8bd.value===sSel){
_8bb=true;
break;
}
}
if(!_8bb){
_8b6.push({"name":_8ba,"value":sSel});
_8b3+="<param name=\""+sXmlEncode(_8ba)+"\">"+sXmlEncode(sSel)+"</param>";
}
}
_8b3+="</drillParameters>";
_8b3+=getExecutionParamNode(oCV);
_8b3+="</authoredDrillRequest>";
_8b2.appendChild(createFormField("authoredDrill.request",_8b3));
_8b2.appendChild(createFormField("ui.action","authoredDrillThrough2"));
_8b2.appendChild(createFormField("b_action","cognosViewer"));
addDrillEnvironmentFormFields(_8b2,oCV);
if(!oCV||!oCV.executeDrillThroughForIWidgetMobile(_8b2)){
if(oCV&&typeof oCV.sendDrillThroughRequest==="function"){
oCV.sendDrillThroughRequest(_8b2);
}else{
if(_8a5==""&&oCV!=null&&typeof oCV.m_viewerFragment!="undefined"){
oCV.m_viewerFragment.raiseAuthoredDrillEvent(_8b3);
}else{
if((oCV!=null&&oCV.getViewerWidget()!=null)||_8a5!=""){
setBackURLToCloseWindow(_8b2);
var _8be="winNAT_"+(new Date()).getTime();
var _8bf="..";
if(oCV!=null){
_8bf=oCV.getWebContentRoot();
}
var _8c0=_8bf+"/rv/blankDrillWin.html";
if(_8b0){
_8c0+="?cv.id="+_8b0;
}
if(oCV==null){
_8c0=window.location.href.substring(0,window.location.href.indexOf("/v1"));
_8c0+="/?perspective=classicviewer";
_8c0+="&altDrillFlag=true";
_8c0+="&format="+sXmlEncode(_8a8);
var _8c1=_8b2.getAttribute("name")+Date.now().toString();
_8b2.setAttribute("name",_8c1);
if(typeof (Storage)!=="undefined"){
localStorage.setItem(_8c1,_8b2.outerHTML);
_8c0+="&drillFormLabel="+_8c1;
}else{
console.log("Sorry! No Web Storage support...");
}
}
if(window.gViewerLogger){
window.gViewerLogger.log("Drill Specification",_8b3,"xml");
}
_8b2.target=_8be;
newWindow=window.open(_8c0,_8be);
}else{
appendReportHistoryObjects(oCV,_8b2);
if(window.gViewerLogger){
window.gViewerLogger.log("Drill Specification",_8b3,"xml");
}
var _8c2=document.createElement("form");
_8c2.setAttribute("action",location.pathname+"/../..");
_8c2.setAttribute("id","launchGlass");
_8c2.setAttribute("name","launchGlass");
_8c2.setAttribute("method","post");
_8c2.style.display="none";
document.body.appendChild(_8c2);
_8c2.appendChild(createFormField("perspective","authoring"));
_8c2.appendChild(createFormField("drillG2","no"));
_8c2.appendChild(createFormField("pdfDrill",_8b3));
_8c2.target="_self";
_8c2.submit();
}
}
}
}
}
};
function getExecutionParamNode(oCV){
var _8c4="";
if(typeof oCV!="undefined"&&oCV!=null){
var _8c5=oCV.getExecutionParameters();
if(_8c5!=""){
_8c4+="<param name=\"executionParameters\">";
_8c4+=sXmlEncode(_8c5);
_8c4+="</param>";
}
}
return _8c4;
};
function doSingleDrillThrough(_8c6,_8c7,cvId){
var _8c9=_8c6[0][0];
if(typeof _8c9=="undefined"||_8c9==null){
return;
}
var _8ca=cvId&&window[cvId+"drillTargets"]?window[cvId+"drillTargets"][_8c9]:drillTargets[_8c9];
if(typeof _8ca=="undefined"){
return;
}
if(_8c7!=""&&_8ca.getPath()==""){
document.location="#"+_8c7;
}else{
var args=[];
args[args.length]=["ui.object",_8ca.getPath()];
for(var _8cc=1;_8cc<_8c6.length;++_8cc){
args[args.length]=_8c6[_8cc];
}
var _8cd="";
if(_8ca.getShowInNewWindow()=="true"){
_8cd="_blank";
}
var _8ce=_8ca.getParameters();
var _8cf=_8ca.getObjectPaths();
var _8d0=cvId;
if(!cvId){
_8d0=getCVId();
}
doSingleDrill(_8cd,args,_8ca.getMethod(),_8ca.getOutputFormat(),_8ca.getOutputLocale(),_8c7,_8ce,_8cf,_8d0,_8ca.getPrompt(),false);
}
};
function getCVId(){
var _8d1="";
try{
_8d1=this.frameElement.id.substring("CVIFrame".length);
}
catch(exception){
}
return _8d1;
};
function doMultipleDrillThrough(_8d2,cvId){
var _8d4="<rvDrillTargets>";
for(var _8d5=0;_8d5<_8d2.length;++_8d5){
var _8d6=_8d2[_8d5];
if(_8d6.length<3){
continue;
}
var _8d7=_8d6[0];
if(typeof _8d7=="undefined"||_8d7==null){
continue;
}
var _8d8=_8d6[1];
if(typeof _8d8=="undefined"||_8d8==null){
continue;
}
var _8d9=cvId&&window[cvId+"drillTargets"]?window[cvId+"drillTargets"][_8d7]:drillTargets[_8d7];
if(typeof _8d9=="undefined"||_8d9==null){
continue;
}
if(_8d8===null||_8d8===""){
_8d8=_8d9.getLabel();
}
_8d4+="<drillTarget ";
_8d4+="outputFormat=\"";
_8d4+=_8d9.getOutputFormat();
_8d4+="\" ";
_8d4+="outputLocale=\"";
_8d4+=_8d9.getOutputLocale();
_8d4+="\" ";
_8d4+="label=\"";
_8d4+=sXmlEncode(_8d8);
_8d4+="\" ";
_8d4+="path=\"";
_8d4+=sXmlEncode(_8d9.getPath());
_8d4+="\" ";
_8d4+="showInNewWindow=\"";
_8d4+=_8d9.getShowInNewWindow();
_8d4+="\" ";
_8d4+="method=\"";
_8d4+=_8d9.getMethod();
_8d4+="\" ";
_8d4+="prompt=\"";
_8d4+=_8d9.getPrompt();
_8d4+="\" ";
_8d4+="dynamicDrill=\"";
_8d4+=_8d9.isDynamicDrillThrough();
_8d4+="\">";
for(var _8da=2;_8da<_8d6.length;++_8da){
_8d4+=_8d6[_8da];
}
_8d4+=_8d9.getParameters();
_8d4+=_8d9.getObjectPaths();
_8d4+="</drillTarget>";
}
_8d4+="</rvDrillTargets>";
if(!cvId){
cvId=getCVId();
}
doMultipleDrills(_8d4,cvId);
};
function CScriptLoader(_8db){
this.m_oFiles={};
this.m_aScripts=[];
this.m_aDocumentWriters=[];
this.m_ajaxWarnings=[];
this.m_bIgnoreAjaxWarnings=false;
this.m_bHandleStylesheetLimit=false;
this.m_iInterval=20;
this.m_reFindCssPath=new RegExp("<link[^>]*href=\"([^\"]*)\"","i");
this.m_reFindInlineStyle=/<style\b(\s|.)*?<\/style>/gi;
this.m_reHasCss=/<link .*?>/gi;
this.m_reIsCss=/\.css(\?.*)?$/i;
this.m_reIsJavascript=/\.js(\?.*)?$/i;
this.m_reIsPromptingLocaleJavascript=/prompting.res.[promptingStrings|promptLocale].*\.js(\?.*)?$/i;
this.m_reScriptTagClose=/\s*<\/script>.*?$/i;
this.m_reScriptTagOpen=/^.*?<script[^>]*>\s*/i;
this.m_reStyleTagClose=/(-|>|\s)*<\/style>\s*$/gi;
this.m_reStyleTagOpen=/^\s*<style[^>]*>(\s|<|!|-)*/gi;
this.m_reEscapedCharacters=/\\[\\"']/g;
this.m_reStringLiterals=/("|')[\s\S]*?\1/g;
this.m_sWebContentRoot=_8db;
this.m_bHasCompletedExecution=false;
this.m_aScriptLoadQueue=[];
this.m_bBlockScriptLoading=false;
this.m_bUseScriptBlocking=false;
this.m_bBlockPromptingLocaleScripts=false;
this.m_aBlockedPromptingLocaleFileQueue=[];
};
CScriptLoader.prototype.hasCompletedExecution=function(){
return this.m_bHasCompletedExecution;
};
CScriptLoader.prototype.setHandlerStylesheetLimit=function(_8dc){
this.m_bHandleStylesheetLimit=_8dc;
};
CScriptLoader.prototype.executeScripts=function(_8dd,_8de){
if(this.isReadyToExecute()){
for(var _8df=0;_8df<this.m_aScripts.length;_8df++){
if(this.m_aScripts[_8df]){
var _8e0=document.createElement("script");
_8e0.setAttribute("language","javascript");
_8e0.setAttribute("type","text/javascript");
this.addNamespaceAttribute(_8e0,_8de);
_8e0.text=this.m_aScripts[_8df];
document.getElementsByTagName("head").item(0).appendChild(_8e0);
}
}
this.m_aScripts=[];
for(var idx=0;idx<this.m_aDocumentWriters.length;++idx){
var _8e2=this.m_aDocumentWriters[idx];
_8e2.execute();
}
this.m_aDocumentWriters=[];
if(!this.m_aScripts.length&&!this.m_aDocumentWriters.length){
if(typeof _8dd=="function"){
_8dd();
}
this.m_bHasCompletedExecution=true;
}else{
setTimeout(function(){
window.gScriptLoader.executeScripts(_8dd,_8de);
},this.m_iInterval);
}
}else{
setTimeout(function(){
window.gScriptLoader.executeScripts(_8dd,_8de);
},this.m_iInterval);
}
};
CScriptLoader.prototype.isReadyToExecute=function(){
for(var _8e3 in this.m_oFiles){
if(this.m_oFiles[_8e3]!="complete"){
return false;
}
}
if(this.m_aScriptLoadQueue.length>0){
return false;
}
return true;
};
CScriptLoader.prototype.loadCSS=function(_8e4,_8e5,_8e6,_8e7){
var aM=_8e4.match(this.m_reHasCss);
if(aM){
for(var i=0;i<aM.length;i++){
if(aM[i].match(this.m_reFindCssPath)){
var _8ea=RegExp.$1;
if(_8ea.indexOf("GlobalReportStyles")!=-1){
this.validateGlobalReportStyles(_8ea);
if(_8e6){
if(_8ea.indexOf("GlobalReportStyles.css")!=-1){
_8ea=_8ea.replace("GlobalReportStyles.css","GlobalReportStyles_10.css");
}
var _8eb=this.getGlobalReportStylesClassPrefix(_8ea);
_8ea=_8ea.replace(".css","_NS.css");
if(_8e5){
_8e5.className="buxReport "+_8eb;
}
}
}
this.loadObject(_8ea,_8e7);
}
_8e4=_8e4.replace(aM[i],"");
}
}
return _8e4;
};
CScriptLoader.prototype.getGlobalReportStylesClassPrefix=function(_8ec){
var _8ed=null;
if(_8ec.indexOf("GlobalReportStyles_11.4.css")!=-1){
_8ed="v114";
}
if(_8ec.indexOf("GlobalReportStyles_11.css")!=-1){
_8ed="v11";
}
if(_8ec.indexOf("GlobalReportStyles_10.css")!=-1){
_8ed="v10";
}else{
if(_8ec.indexOf("GlobalReportStyles_1.css")!=-1){
_8ed="v1";
}else{
if(_8ec.indexOf("GlobalReportStyles_none.css")!=-1){
_8ed="vnone";
}else{
if(_8ec.indexOf("GlobalReportStyles.css")!=-1){
_8ed="v8";
}
}
}
}
return _8ed;
};
CScriptLoader.prototype.validateGlobalReportStyles=function(_8ee){
var _8ef=document.getElementsByTagName("link");
for(var i=0;i<_8ef.length;++i){
var _8f1=_8ef[i];
if(_8f1.getAttribute("href").indexOf("GlobalReportStyles")!=-1){
if(_8f1.getAttribute("href").toLowerCase()!=_8ee.toLowerCase()){
var _8f2=_8ee.split("/");
var _8f3=_8f1.getAttribute("href").split("/");
if(_8f2[_8f2.length-1]!=_8f3[_8f3.length-1]){
this.m_ajaxWarnings.push("Ajax response contains different versions of the GlobalReportStyles.css.");
}
}
break;
}
}
};
CScriptLoader.prototype.loadFile=function(_8f4,_8f5,_8f6){
var sURL="";
if(_8f4){
sURL=_8f4;
}
var _8f8=null;
if(typeof _8f5=="string"){
_8f8=_8f5;
}
var _8f9="POST";
if(_8f6=="GET"){
_8f9="GET";
}
var _8fa=null;
if(typeof ActiveXObject!="undefined"){
_8fa=new ActiveXObject("Msxml2.XMLHTTP");
}else{
_8fa=new XMLHttpRequest();
}
_8fa.open(_8f9,sURL,false);
_8fa.send(_8f8);
return _8fa.responseText;
};
function CScriptLoader_onReadyStateChange(){
if(typeof this.readyState=="undefined"){
this.readyState="complete";
}
if(this.readyState=="loaded"||this.readyState=="complete"){
var path=this.sFilePath;
if(!path&&this.getAttribute){
path=this.getAttribute("href");
}
window.gScriptLoader.setFileState(path,"complete");
window.gScriptLoader.m_bBlockScriptLoading=false;
if(this.sFilePath&&window.gScriptLoader.m_bBlockPromptingLocaleScripts&&this.sFilePath.match(window.gScriptLoader.m_reIsPromptingLocaleJavascript)){
window.gScriptLoader.m_bBlockPromptingLocaleScripts=false;
if(window.gScriptLoader.m_aBlockedPromptingLocaleFileQueue.length>0){
var _8fc=window.gScriptLoader.m_aBlockedPromptingLocaleFileQueue.shift();
window.gScriptLoader.loadObject(_8fc.sName,_8fc.sNamespaceId);
}
}
if(window.gScriptLoader.m_aScriptLoadQueue.length>0){
window.gScriptLoader.loadObject();
}
}
};
CScriptLoader.prototype.moveLinks=function(node){
if(!node){
return;
}
var _8fe=node.getAttribute("href");
if(!_8fe||this.m_oFiles[_8fe]){
return;
}
this.m_oFiles[_8fe]="complete";
document.getElementsByTagName("head").item(0).appendChild(node);
};
CScriptLoader.prototype.loadObject=function(_8ff,_900){
var _901=null;
if(typeof _8ff==="undefined"){
if(this.m_aScriptLoadQueue.length>0){
var _902=this.m_aScriptLoadQueue.shift();
_8ff=_902.name;
_900=_902.namespaceId;
}else{
return;
}
}
if(this.m_oFiles[_8ff]){
return;
}
if(this.m_bBlockScriptLoading){
this.m_aScriptLoadQueue.push({"name":_8ff,"namespaceId":_900});
}else{
if(_8ff.match(this.m_reIsCss)){
_901=document.createElement("link");
_901.setAttribute("rel","stylesheet");
_901.setAttribute("type","text/css");
_901.setAttribute("href",_8ff);
if(window.isIE&&window.isIE()){
_901.onreadystatechange=CScriptLoader_onReadyStateChange;
_901.onload=CScriptLoader_onReadyStateChange;
_901.onerror=CScriptLoader_onReadyStateChange;
this.m_oFiles[_8ff]="new";
}else{
this.m_oFiles[_8ff]="complete";
}
}else{
if(_8ff.match(this.m_reIsJavascript)){
if(_8ff.match(this.m_reIsPromptingLocaleJavascript)){
if(this.m_bBlockPromptingLocaleScripts){
this.m_aBlockedPromptingLocaleFileQueue.push({"sName":_8ff,"sNamespaceId":_900});
return;
}
this.m_bBlockPromptingLocaleScripts=true;
}
this.m_bBlockScriptLoading=this.m_bUseScriptBlocking;
_901=document.createElement("script");
_901.setAttribute("language","javascript");
_901.setAttribute("type","text/javascript");
_901.setAttribute("src",_8ff);
_901.sFilePath=_8ff;
_901.onreadystatechange=CScriptLoader_onReadyStateChange;
_901.onload=CScriptLoader_onReadyStateChange;
_901.onerror=CScriptLoader_onReadyStateChange;
this.addNamespaceAttribute(_901,_900);
this.m_oFiles[_8ff]="new";
}
}
if(_901){
document.getElementsByTagName("head").item(0).appendChild(_901);
}
}
};
CScriptLoader.prototype.loadScriptsFromDOM=function(_903,_904,_905){
if(!_903){
return;
}
var _906=_903.getElementsByTagName("script");
while(_906.length>0){
var _907=_906[0];
if(_907.getAttribute("src")!=null&&_907.getAttribute("src").length>0){
this.loadObject(_907.getAttribute("src"),_904);
}else{
var _908=_907.innerHTML;
var _909=false;
if(_908.indexOf("document.write")!=-1){
var _90a=_908.replace(this.m_reEscapedCharacters,"").replace(this.m_reStringLiterals,"");
_909=(_90a.indexOf("document.write")!=-1);
}
if(_909){
if(_905){
var sId="CVScriptFromDOMPlaceHolder"+_906.length+_904;
var _90c=_907.ownerDocument.createElement("span");
_90c.setAttribute("id",sId);
_907.parentNode.insertBefore(_90c,_907);
this.m_aDocumentWriters.push(new CDocumentWriter(sId,_908));
}
}else{
if(_908.length>0){
this.m_aScripts.push(_908);
}
}
}
_907.parentNode.removeChild(_907);
}
};
CScriptLoader.prototype.loadStyles=function(_90d,_90e){
if(!_90d||!_90d.parentNode){
return;
}
var _90f=_90d.parentNode.getElementsByTagName("style");
while(_90f.length>0){
var _910=_90f[0];
if(_90e){
this.addNamespaceAttribute(_910,_90e);
}
if(window.isIE&&window.isIE()&&window.getNavVer()<10){
if((document.getElementsByTagName("style").length+document.getElementsByTagName("link").length)>=30){
if(this.m_bHandleStylesheetLimit){
if(typeof window.gaRV_INSTANCES!="undefined"){
for(var i=0;i<window.gaRV_INSTANCES.length;i++){
window.gaRV_INSTANCES[i].cleanupStyles();
}
}
}
if((document.getElementsByTagName("style").length+document.getElementsByTagName("link").length)>=30){
if(typeof console!="undefined"&&console&&console.log){
console.log("Stylesheet limit reached.");
}
this.m_ajaxWarnings.push("Stylesheet limit reached.");
return;
}
}
}
document.getElementsByTagName("head").item(0).appendChild(_910);
}
};
CScriptLoader.prototype.loadAll=function(_912,_913,_914,_915){
this.m_bScriptLoaderCalled=true;
this.m_bHasCompletedExecution=false;
this.loadScriptsFromDOM(_912,_914,_915);
if(this.containsAjaxWarnings()){
return false;
}
this.loadStyles(_912,_914);
if(this.containsAjaxWarnings()){
return false;
}
this.executeScripts(_913,_914);
return true;
};
CScriptLoader.prototype.setFileState=function(_916,_917){
this.m_oFiles[_916]=_917;
};
CScriptLoader.prototype.containsAjaxWarnings=function(){
if(this.m_bIgnoreAjaxWarnings){
return false;
}else{
return (this.m_ajaxWarnings.length>0);
}
};
CScriptLoader.prototype.addNamespaceAttribute=function(_918,_919){
if(typeof _919==="string"){
_918.setAttribute("namespaceId",_919);
}
};
if(typeof window.gScriptLoader=="undefined"){
window.gScriptLoader=new CScriptLoader();
}
function ViewerA11YHelper(oCV){
this.m_oCV=oCV;
};
ViewerA11YHelper.prototype.onFocus=function(evt){
var _91c=getCrossBrowserNode(evt);
_91c=ViewerA11YHelper.findChildOfTableCell(_91c);
this.updateCellAccessibility(_91c,false);
};
ViewerA11YHelper.prototype.onKeyDown=function(evt){
evt=(evt)?evt:((event)?event:null);
var _91e=getCrossBrowserNode(evt);
if(ViewerA11YHelper.isTableCell(_91e)){
for(var i=0;i<_91e.childNodes.length;i++){
if(_91e.childNodes[i].nodeName.toLowerCase()=="span"){
_91e=_91e.childNodes[i];
break;
}
}
}
if(!this.isValidNodeToSelect(_91e)){
return true;
}
_91e=ViewerA11YHelper.findChildOfTableCell(_91e);
if(_91e){
if(evt.keyCode=="39"){
if(this.m_oCV.getState()&&this.m_oCV.getState().getFindState()&&evt.ctrlKey&&evt.shiftKey){
this.m_oCV.executeAction("FindNext");
}else{
this.moveRight(_91e);
}
return stopEventBubble(evt);
}else{
if(evt.keyCode=="37"){
this.moveLeft(_91e);
return stopEventBubble(evt);
}else{
if(evt.keyCode=="38"){
this.moveUp(_91e);
return stopEventBubble(evt);
}else{
if(evt.keyCode=="40"){
this.moveDown(_91e);
return stopEventBubble(evt);
}else{
if(evt.keyCode=="13"){
if(this.m_oCV.isBux){
if(this.m_oCV.getViewerWidget().isSelectionFilterEnabled()){
this.m_oCV.getViewerWidget().preprocessPageClicked(false,evt);
if(this.m_oCV.getSelectionController().pageClicked(evt)!==false){
this.m_oCV.JAWSTalk(RV_RES.IDS_JS_SELECTION_FILTER_INFO_JAWS);
this.m_oCV.getViewerWidget().updateToolbar();
}
}else{
this.m_oCV.getSelectionController().pageClicked(evt);
var _920=this.m_oCV.getActionFactory().load("Selection");
_920.onKeyDown(evt);
}
this.m_oCV.getViewerWidget().onSelectionChange();
}else{
this.m_oCV.de(evt);
}
}else{
if(evt.keyCode=="32"){
if(this.m_oCV.isBux){
this.m_oCV.getViewerWidget().preprocessPageClicked(false);
if(this.m_oCV.getSelectionController().pageClicked(evt)!==false&&this.m_oCV.getViewerWidget().isSelectionFilterEnabled()){
this.m_oCV.JAWSTalk(RV_RES.IDS_JS_SELECTION_FILTER_INFO_JAWS);
}
this.m_oCV.getViewerWidget().updateToolbar();
this.m_oCV.getViewerWidget().onSelectionChange();
}else{
this.m_oCV.getSelectionController().pageClicked(evt);
}
return stopEventBubble(evt);
}else{
if(evt.keyCode=="46"&&this.m_oCV.isBux){
if(typeof this.m_oCV.envParams!="undefined"&&typeof this.m_oCV.envParams["ui.action"]!="undefined"&&this.m_oCV.envParams["ui.action"]!="view"&&!this.m_oCV.isLimitedInteractiveMode()){
var _921=this.m_oCV.getActionFactory().load("Delete");
if(!this.m_oCV.isBlacklisted("Delete")&&_921.canDelete()){
_921.execute();
return stopEventBubble(evt);
}
}
}else{
if(this.m_oCV.isBux&&evt.ctrlKey==true&&evt.shiftKey==true&&evt.keyCode=="49"){
var lid=this.m_oCV.getSelectionController().getSelectionObjectFactory().getLayoutElementId(_91e);
if(lid!=""){
lid=lid.split(this.m_oCV.getId())[0];
var _923=-1;
var _924=this.m_oCV.getRAPReportInfo();
if(_924){
var _925=_924.getContainer(lid);
if(typeof _925.layoutIndex!="undefined"){
_923=_925.layoutIndex;
}
}
var _926=document.getElementById("infoBarHeaderButton"+_923+this.m_oCV.getId());
if(_926!==null){
this.m_oCV.setCurrentNodeFocus(getCrossBrowserNode(evt));
_926.focus();
}
}
return stopEventBubble(evt);
}else{
if(!this.m_oCV.isBux&&evt.shiftKey==true&&evt.keyCode=="121"){
var ocv=this.m_oCV;
var _928=function(){
if(typeof evt.clientX=="undefined"||typeof evt.clientY=="undefined"){
var _929=clientToScreenCoords(evt.target,document.body);
evt.clientX=_929.leftCoord;
evt.clientY=_929.topCoord;
}
ocv.dcm(evt,true);
};
if(isFF()){
setTimeout(_928,0);
}else{
_928.call();
}
return stopEventBubble(evt);
}else{
if(this.m_oCV.isBux&&(evt.keyCode=="93"||(evt.shiftKey==true&&evt.keyCode=="121"))){
var _92a=this.m_oCV.getViewerWidget();
var _92b=this.m_oCV.getSelectionController();
_92a.preprocessPageClicked(true);
_92b.pageClicked(evt);
_92a.updateToolbar();
_92a.onContextMenu(evt);
}
}
}
}
}
}
}
}
}
}
}
};
ViewerA11YHelper.prototype.isValidNodeToSelect=function(node){
return this.getValidNodeToSelect(node)?true:false;
};
ViewerA11YHelper.prototype.getValidNodeToSelect=function(node){
if(node&&node.style&&node.style.visibility!="hidden"&&node.style.display!="none"){
var _92e=node.nodeName.toLowerCase();
if((_92e=="span"&&(!node.getAttribute("class")||node.getAttribute("class").indexOf("expandButton")===-1))||(_92e=="div"&&node.getAttribute("flashchartcontainer")=="true")||(_92e=="div"&&node.getAttribute("chartcontainer")=="true")||(_92e=="img"&&(!node.id||node.id.indexOf("sortimg")!==0))){
return node;
}
if(ViewerA11YHelper.isSemanticNode(node)){
var _92f=node.childNodes&&node.childNodes.length?node.childNodes[0]:null;
if(_92f){
return this.getValidNodeToSelect(_92f);
}
}
}
return null;
};
ViewerA11YHelper.isSemanticNode=function(node){
if(!ViewerA11YHelper.isSemanticNode._semanticNodeNames){
ViewerA11YHelper.isSemanticNode._semanticNodeNames=["strong","em","h1","h2","h3","h4","h5","h6"];
}
var _931=node.nodeName.toLowerCase();
for(var i=0;i<ViewerA11YHelper.isSemanticNode._semanticNodeNames.length;i++){
if(_931===ViewerA11YHelper.isSemanticNode._semanticNodeNames[i]){
return true;
}
}
return false;
};
ViewerA11YHelper.isTableCell=function(node){
var _934=node.nodeName.toLowerCase();
return _934==="td"||_934==="th";
};
ViewerA11YHelper.findChildOfTableCell=function(_935){
var _936=_935;
while(_936&&_936.parentNode){
if(ViewerA11YHelper.getTableCell(_936)){
break;
}
_936=_936.parentNode;
}
return _936;
};
ViewerA11YHelper.getTableCell=function(node){
var _938=node.parentNode;
if(ViewerA11YHelper.isTableCell(_938)){
return _938;
}
if(ViewerA11YHelper.isSemanticNode(_938)&&ViewerA11YHelper.isTableCell(_938.parentNode)){
return _938.parentNode;
}
return null;
};
ViewerA11YHelper.prototype.moveRight=function(_939){
var _93a=this.getNextNonTextSibling(_939);
_93a=this.getValidNodeToSelect(_93a);
if(_93a){
this.setFocusToNode(_93a);
return true;
}
var _93b=ViewerA11YHelper.getTableCell(_939);
_93b=this.getPfMainOutputCell(_93b);
while(_93b.nextSibling){
if(this.moveToTD(_93b.nextSibling)){
return true;
}
_93b=_93b.nextSibling;
}
var _93c=_93b.parentNode;
while(_93c.nextSibling){
var _93d=_93c.nextSibling;
if(this.moveToTD(_93d.childNodes[0])){
return true;
}
_93c=_93c.nextSibling;
}
return false;
};
ViewerA11YHelper.prototype.moveLeft=function(_93e){
var _93f=this.getPreviousNonTextSibling(_93e);
_93f=this.getValidNodeToSelect(_93f);
if(_93f){
this.setFocusToNode(_93f);
return true;
}
var _940=ViewerA11YHelper.getTableCell(_93e);
_940=this.getPfMainOutputCell(_940);
while(_940.previousSibling){
if(this.moveToTDFromTheRight(_940.previousSibling)){
return true;
}
_940=_940.previousSibling;
}
var _941=_940.parentNode;
while(_941.previousSibling){
var _942=_941.previousSibling;
if(this.moveToTDFromTheRight(_942.lastChild)){
return true;
}
_941=_941.previousSibling;
}
return false;
};
ViewerA11YHelper.prototype.moveDown=function(_943){
var _944=ViewerA11YHelper.getTableCell(_943);
_944=this.getPfMainOutputCell(_944);
var _945=this.getColumnIndex(_944);
_945+=this.getColSpanFromRowSpans(_944);
var _946=_944.parentNode;
if(_944.rowSpan&&_944.rowSpan>1){
var _947=_944.rowSpan;
for(var _948=1;_948<_947;_948++){
_946=_946.nextSibling;
}
}
var _949=false;
while(_946){
if(_946.nextSibling){
_946=_946.nextSibling;
}else{
if(_944.nextSibling&&!_949){
_946=_946.parentNode.firstChild;
_949=true;
_945++;
}else{
return false;
}
}
if(this.doMoveUpDown(_946,_945)){
return true;
}
}
return false;
};
ViewerA11YHelper.prototype.moveUp=function(_94a){
var _94b=ViewerA11YHelper.getTableCell(_94a);
_94b=this.getPfMainOutputCell(_94b);
var _94c=_94b.parentNode;
var _94d=this.getColumnIndex(_94b);
_94d+=this.getColSpanFromRowSpans(_94b);
var _94e=false;
while(_94c){
if(_94c.previousSibling){
_94c=_94c.previousSibling;
}else{
if(_94b.previousSibling&&!_94e){
_94c=_94c.parentNode.lastChild;
_94e=true;
_94d--;
}else{
return false;
}
}
if(this.doMoveUpDown(_94c,_94d)){
return true;
}
}
return false;
};
ViewerA11YHelper.prototype.getNextNonTextSibling=function(node){
while(node.nextSibling){
node=node.nextSibling;
if(node.nodeName.toLowerCase()!="#text"){
return node;
}
}
if(ViewerA11YHelper.isSemanticNode(node.parentNode)){
return this.getNextNonTextSibling(node.parentNode);
}
return null;
};
ViewerA11YHelper.prototype.doMoveUpDown=function(_950,_951){
if(_950!=null){
var _952=_950.firstChild;
var pos=this.getColSpanFromRowSpans(_952);
while(_952){
if(pos==_951){
return this.moveToTDFromTheRight(_952);
}else{
if(pos>_951){
break;
}
}
var _954=0;
if(_952.colSpan){
_954=_952.colSpan;
}else{
_954++;
}
pos+=_954;
_952=_952.nextSibling;
}
}
};
ViewerA11YHelper.prototype.moveToTDFromTheRight=function(td){
td=this.getPfVisibleCell(td);
var _956=td.childNodes;
for(var _957=_956.length-1;_957>=0;_957--){
var node=this.getValidNodeToSelect(_956[_957]);
if(node){
if(node.childNodes&&node.childNodes[0]&&node.childNodes[0].nodeName.toLowerCase()=="span"){
node=node.childNodes[0];
}
if(node.tabIndex!=-1&&node.tabIndex!=0){
node.tabIndex=-1;
}
this.setFocusToNode(node);
return true;
}
}
return false;
};
ViewerA11YHelper.prototype.moveToTD=function(td){
td=this.getPfVisibleCell(td);
var _95a=td.childNodes;
for(var _95b=0;_95b<_95a.length;_95b++){
var node=this.getValidNodeToSelect(_95a[_95b]);
if(node){
if(node.childNodes&&node.childNodes[0]&&node.childNodes[0].nodeName.toLowerCase()=="span"){
node=node.childNodes[0];
}
if(node.tabIndex!=-1&&node.tabIndex!=0){
node.tabIndex=-1;
}
this.setFocusToNode(node);
return true;
}
}
return false;
};
ViewerA11YHelper.prototype.setFocusToNode=function(node){
this.m_oCV.setCurrentNodeFocus(node);
this.updateCellAccessibility(node,false);
node.focus();
if(this.m_oCV.m_pinFreezeManager){
var _95e=this.m_oCV.m_pinFreezeManager.nodeToContainer(node);
if(_95e){
_95e.updateScroll(node);
}
}
};
ViewerA11YHelper.prototype.getPfMainOutputCell=function(_95f){
var main=null;
var slid=_95f.getAttribute("pfslid");
if(slid){
var lid=PinFreezeContainer.getLidFromSlid(slid);
if(lid&&this.m_oCV.m_pinFreezeManager){
lid=this.m_oCV.m_pinFreezeManager.removeNamespace(lid);
var _963=this.m_oCV.m_pinFreezeManager.getContainer(lid);
if(_963){
main=_963.getMain(_95f);
}
}
}
return main?main:_95f;
};
ViewerA11YHelper.prototype.getPreviousNonTextSibling=function(node){
while(node.previousSibling){
node=node.previousSibling;
if(node.nodeName.toLowerCase()!="#text"){
return node;
}
}
if(ViewerA11YHelper.isSemanticNode(node.parentNode)){
return this.getPreviousNonTextSibling(node.parentNode);
}
return null;
};
ViewerA11YHelper.prototype.getColumnIndex=function(node){
var _966=0;
while(node.previousSibling){
node=node.previousSibling;
if(node.rowSpan==1){
if(node.colSpan){
_966+=node.colSpan;
}else{
_966++;
}
}
}
return _966;
};
ViewerA11YHelper.prototype.getPfVisibleCell=function(_967){
var copy=null;
var slid=_967.getAttribute("pfslid");
if(slid){
var lid=PinFreezeContainer.getLidFromSlid(slid);
if(lid&&this.m_oCV.m_pinFreezeManager){
lid=this.m_oCV.m_pinFreezeManager.removeNamespace(lid);
var _96b=this.m_oCV.m_pinFreezeManager.getContainer(lid);
if(_96b){
copy=_96b.getCopy(_967);
}
}
}
return copy?copy:_967;
};
ViewerA11YHelper.prototype.updateCellAccessibility=function(_96c,_96d){
if(!_96c){
return false;
}
var _96e=false;
var _96f=false;
var _970=false;
var _971=_96c.getAttribute("ctx")!=null?_96c:_96c.parentNode;
if(_96c.getAttribute("flashChartContainer")!="true"){
if(_971.getAttribute("ctx")!=null){
if(this.m_oCV.isBux){
var _972=this.m_oCV.getAction("DrillUpDown");
_972.updateDrillability(this.m_oCV,_971);
_96e=_972.canDrillDown();
_96f=_972.canDrillUp();
}else{
var _973=_971.getAttribute("ctx");
var _974=_973.indexOf(":")==-1?_973:_973.substring(0,_973.indexOf(":"));
var _975=this.m_oCV.getSelectionController();
_96e=_975.canDrillDown(_974);
_96f=_975.canDrillUp(_974);
}
}
_970=_96c.parentNode.getAttribute("dtTargets")?true:false;
}
var _976=_96c.nodeName.toLowerCase()=="img";
var _977=_96c.parentNode.getAttribute("type")=="columnTitle";
if(!_976&&(_96d||((_96c.getAttribute("aria-labelledby")!=null||_977||this.m_oCV.isAccessibleMode())))){
var _978="";
if(_96c.parentNode.getAttribute("cc")=="true"){
_978+=" "+RV_RES.IDS_JS_CROSSTAB_CORNER;
}
if(_96c.innerHTML.length===0){
_96c.innerHTML="&nbsp;";
_978+=" "+RV_RES.IDS_JS_EMPTY_CELL;
}
if(_96e&&_96f){
_978+=" "+RV_RES.IDS_JS_DRILL_DOWN_UP_JAWS;
}else{
if(_96e){
_978+=" "+RV_RES.IDS_JS_DRILL_DOWN_JAWS;
}else{
if(_96f){
_978+=" "+RV_RES.IDS_JS_DRILL_UP_JAWS;
}
}
}
if(_970){
_978+=" "+RV_RES.IDS_JS_DRILL_THROUGH_JAWS;
}
if(_96c.altText&&_96c.altText.length>0){
_978=_96c.altText;
}else{
if(_96c.getAttribute("flashChartContainer")=="true"){
_978=RV_RES.IDS_JS_CHART_IMAGE;
}
}
if(this.m_oCV.isBux){
var _979=_96c.previousSibling;
if(_979){
var wid=_979.getAttribute("widgetid");
if(wid&&wid.indexOf("comment")){
_978+=" "+RV_RES.IDS_JS_ANNOTATION_JAWS;
}
}
if(_96c.getAttribute("rp_name")||_96c.parentNode.getAttribute("rp_name")){
_978+=" "+RV_RES.IDS_JS_LABEL_HAS_BEEN_RENAMED;
}
if(_96c.nextSibling&&_96c.nextSibling.getAttribute("class")=="sortIconVisible"){
_978+=" "+_96c.nextSibling.getAttribute("alt");
}
}
if(_978.length>0){
this.addAriaLabelledByOnCell(_96c,_978);
}
}
if(_96f||_96e||_970){
this.addDrillAccessibilityAttributes(_96c,_970);
}
if(_96c.attachEvent){
_96c.attachEvent("onblur",this.onBlur);
}else{
_96c.addEventListener("blur",this.onBlur,false);
}
if((isIE()&&_96c.getAttribute("tabIndex")!=0)||_976){
_96c.setAttribute("modifiedTabIndex","true");
_96c.setAttribute("oldTabIndex",_96c.getAttribute("tabIndex"));
_96c.setAttribute("tabIndex",0);
}
};
ViewerA11YHelper.prototype.addAriaLabelledByOnCell=function(_97b,_97c){
var _97d=0;
var _97e=_97b;
while(_97e.previousSibling){
_97d++;
_97e=_97e.previousSibling;
}
var _97f=_97b.getAttribute("ariaHiddenSpanId");
if(_97f&&document.getElementById(_97f)){
document.getElementById(_97f).innerHTML=_97c;
}else{
if(!_97b.parentNode.id&&!_97b.id){
_97b.parentNode.id=Math.random();
}
var _980=document.createElement("span");
_980.style.visibility="hidden";
_980.style.display="none";
_980.id=(_97b.id==""?_97b.parentNode.id:_97b.id)+"_"+_97d;
_980.innerHTML=_97c;
_97b.parentNode.appendChild(_980);
var _981="";
if(_97b.getAttribute("aria-labelledby")!=null){
_981+=_97b.getAttribute("aria-labelledby");
}else{
if(_97b.id==""){
_97b.id=_97b.parentNode.id+"_main_"+_97d;
}
_981+=_97b.id;
}
_981+=" "+_980.id;
_97b.setAttribute("aria-labelledby",_981);
_97b.setAttribute("ariaHiddenSpanId",_980.id);
}
};
ViewerA11YHelper.prototype.addDrillAccessibilityAttributes=function(_982,_983){
if(!_982.getAttribute("oldClassName")){
if(!_983){
_982.setAttribute("oldClassName",_982.className);
_982.className="dl "+_982.className;
}
if(!_982.getAttribute("role")){
_982.setAttribute("role","link");
}
}
};
ViewerA11YHelper.prototype.onBlur=function(evt){
var _985=null;
if(isIE()){
_985=getNodeFromEvent(evt,true);
}else{
_985=this;
}
_985=ViewerA11YHelper.findChildOfTableCell(_985);
if(_985){
if(_985.getAttribute("oldClassName")){
_985.className=_985.getAttribute("oldClassName");
_985.removeAttribute("oldClassName");
}
if(_985.getAttribute("modifiedTabIndex")=="true"){
_985.removeAttribute("modifiedTabIndex");
_985.removeAttribute("tabIndex");
if(_985.getAttribute("oldTabIndex")){
_985.setAttribute("tabIndex",_985.getAttribute("oldTabIndex"));
}
_985.removeAttribute("oldTabIndex");
}
var _986=_985.getAttribute("ariaHiddenSpanId");
if(_986){
var _987=document.getElementById(_986);
if(_987){
_987.innerHTML="";
}
}
}
};
ViewerA11YHelper.prototype.getColSpanFromRowSpans=function(_988){
var _989=0;
var _98a=_988.parentNode;
var _98b=0;
while(_98a){
var _98c=_98a.firstChild;
var _98d=this.getColumnCount(_98a)-_98b;
while(_98c&&_98c.rowSpan>1&&_98d>0&&_98c!=_988){
_989+=_98c.colSpan;
_98c=_98c.nextSibling;
_98d--;
}
if(_98a.childNodes.length>_98b){
_98b=this.getColumnCount(_98a);
}
_98a=_98a.previousSibling;
}
return _989;
};
ViewerA11YHelper.prototype.getColumnCount=function(_98e){
var _98f=0;
var node=_98e.firstChild;
while(node){
_98f+=node.colSpan;
node=node.nextSibling;
}
return _98f;
};
ViewerA11YHelper.prototype.addLabelledByForItemsOutsideOfContainers=function(){
if(!this.m_oCV.isAccessibleMode()){
return;
}
var _991=document.getElementById("RVContent"+this.m_oCV.getId());
if(!_991){
return;
}
var _992=getElementsByAttribute(_991,"span","tabindex","0");
if(!_992){
return;
}
for(var i=0;i<_992.length;i++){
var span=_992[i];
this.updateCellAccessibility(span,false);
}
};
var CV_BACKGROUND_LAYER_ID="CV_BACK";
if(typeof window.gaRV_INSTANCES=="undefined"){
window.gaRV_INSTANCES=[];
}
if(!window.gViewerLogger){
window.gViewerLogger={log:function(hint,_996,type){
},addContextInfo:function(_998){
}};
}
function CognosViewerSession(oCV){
this.m_sConversation=oCV.getConversation();
this.m_sParameters=oCV.getExecutionParameters();
this.m_envParams={};
applyJSONProperties(this.m_envParams,oCV.envParams);
this.m_bRefreshPage=false;
};
function CCognosViewer(sId,_99b){
if(typeof window.gCognosViewer=="undefined"){
window.gCognosViewer=this;
}
if(typeof ViewerConfig=="function"){
this.m_viewerConfig=new ViewerConfig();
try{
if(typeof window.getViewerConfiguration=="function"){
this.m_viewerConfig.configure(window.getViewerConfiguration());
}else{
if(window.parent&&typeof window.parent.getViewerConfiguration=="function"){
this.m_viewerConfig.configure(window.parent.getViewerConfiguration());
}
}
}
catch(e){
}
this.m_viewerUIConfig=this.m_viewerConfig.getUIConfig();
}
this.m_sActionState="";
this.m_bKeepSessionAlive=false;
this.m_undoStack=[];
this.m_aSecRequests=[];
this.m_bDebug=false;
this.m_sCAFContext="";
this.m_sContextInfoXML="";
this.m_sConversation="";
this.m_sStatus="";
this.m_sGateway=_99b;
this.m_sId=sId;
this.m_sMetadataInfoXML="";
this.m_sParameters="";
this.m_sReportState="";
this.envParams={};
this.m_sTracking="";
this.m_sSoapFault="";
this.m_sWaitHTML="";
this.m_oDrillMgr=null;
this.goDrillManager=null;
this.m_oWorkingDialog=null;
this.m_oRequestExecutedIndicator=null;
this.m_bUseWorkingDialog=true;
this.m_oSubscriptionManager=null;
this.m_oCVMgr=null;
this.m_bUseSafeMode=true;
if(typeof CViewerManager=="function"){
this.m_oCVMgr=new CViewerManager(this);
}
if(window.gaRV_INSTANCES){
var _99c=false;
for(var _99d=0;_99d<window.gaRV_INSTANCES.length;_99d++){
if(window.gaRV_INSTANCES[_99d].m_sId==sId){
window.gaRV_INSTANCES[_99d]=this;
_99c=true;
break;
}
}
if(!_99c){
window.gaRV_INSTANCES=window.gaRV_INSTANCES.concat(this);
}
}
this.m_bReportHasPrompts=false;
this.m_viewerWidget=null;
this.m_flashChartsObjectIds=[];
this.m_raiseSharePromptEvent=true;
this.m_actionFactory=null;
this.m_calculationCache={};
this.m_drillTargets=[];
this.m_reportRenderingDone=false;
if(typeof PinFreezeManager!=="undefined"){
this.m_pinFreezeManager=new PinFreezeManager(this);
}
if(typeof ViewerDispatcher!=="undefined"){
this.m_viewerDispatcher=new ViewerDispatcher();
}
this.m_retryDispatcherEntry=null;
this.m_RAPReportInfo=null;
if(typeof ViewerState=="function"){
this.m_viewerState=new ViewerState();
}
this.m_aInfoBar=null;
};
CCognosViewer.prototype.setScheduledMobileOutput=function(_99e){
this.m_mobileScheduledOutput=_99e;
if(_99e){
this.m_sStatus="complete";
}
};
CCognosViewer.prototype.setTabInfo=function(_99f){
this.m_tabsPayload=_99f;
if(this.m_tabsPayload&&this.m_tabsPayload.tabs&&this._keepTabSelected){
var _9a0=false;
for(var i=0;i<this.m_tabsPayload.tabs.length;i++){
var tab=this.m_tabsPayload.tabs[i];
if(tab.id==this._keepTabSelected){
this.m_tabsPayload.currentTabId=this._keepTabSelected;
break;
}
}
this._keepTabSelected=null;
}
};
CCognosViewer.prototype.setKeepTabSelected=function(_9a3){
this._keepTabSelected=_9a3;
};
CCognosViewer.prototype.getTabController=function(){
return this.m_tabControl;
};
CCognosViewer.prototype.getCurrentlySelectedTab=function(){
return this.m_currentlySelectedTab?this.m_currentlySelectedTab:null;
};
CCognosViewer.prototype.deleteTabs=function(){
if(this.m_tabControl){
this.m_tabControl.destroy();
delete this.m_tabControl;
this.m_tabControl=null;
}
this.m_tabsPayload=null;
};
CCognosViewer.prototype.renderTabs=function(){
if(!this.m_tabsPayload){
return;
}
var _9a4=this.isSavedOutput()&&!this.m_mobileScheduledOutput;
var _9a5=document.getElementById("CVNavLinks"+this.getId());
if(_9a5||!this.shouldWriteNavLinks()||_9a4){
var _9a6=this.getReportDiv();
this.m_bHasTabs=true;
if(this.m_tabControl&&this.m_tabControl.isSavedOutput()!=_9a4){
this.deleteTabs();
}
if(!this.m_tabControl){
if(this.getStatus()!="complete"&&!_9a4){
return;
}
var tr=document.createElement("tr");
var _9a8=document.createElement("td");
tr.appendChild(_9a8);
var _9a9=document.getElementById("mainViewerTR"+this.getId());
if(!_9a9){
return;
}
if(this.m_tabsPayload.position=="topLeft"){
_9a9.parentNode.insertBefore(tr,_9a9);
}else{
_9a9.parentNode.appendChild(tr);
}
var _9aa=null;
if(this.m_viewerWidget){
_9aa=this.m_viewerWidget.findContainerDiv().firstChild;
}else{
_9aa=_9a8;
}
var oCV=this;
if(_9a4){
this.m_tabControl=new CognosTabControl(_9aa,function(_9ac){
oCV.switchSavedOutputTab(_9ac,true);
});
this.switchSavedOutputTab(this.m_tabsPayload.currentTabId,false);
}else{
this.m_tabControl=new CognosTabControl(_9aa,function(_9ad){
oCV.switchTabs(_9ad);
});
}
if(this.m_viewerWidget){
this.m_tabControl.setSpaceSaverContainer(_9a8);
this.m_tabControl.setScrollAttachNode(this.m_viewerWidget.findContainerDiv());
this.m_tabControl.useAbsolutePosition(true);
}
this.m_tabControl.setIsSavedOutput(_9a4);
if(!window.gScriptLoader.m_bScriptLoaderCalled){
var _9ae=document.getElementById("RVContent"+this.getId());
var _9af=this._getNodesWithViewerId(_9ae,"link",null);
for(var i=0;i<_9af.length;i++){
window.gScriptLoader.moveLinks(_9af[i]);
}
window.gScriptLoader.loadStyles(_9ae,this.getId());
this.repaintDiv(_9ae);
}
}
if(this.getStatus()=="prompting"){
this.previouslySelectedTab=null;
this.m_tabControl.hide();
}else{
if(this.isHighContrast()){
this.m_tabControl.setHighContrast(true);
}
this.m_tabControl.render(this.m_tabsPayload);
this.m_currentlySelectedTab=this.m_tabControl.getSelectedTabId();
if(this.m_switchingToTabId&&this.m_currentlySelectedTab!=this.m_switchingToTabId){
this._removeTabContent(_9a6.parentNode,this.m_switchingToTabId);
this._removeTabContent(_9a6.parentNode,this.m_currentlySelectedTab);
if(_9a5){
this._removeTabContent(_9a5.parentNode,this.m_switchingToTabId);
this._removeTabContent(_9a5.parentNode,this.m_currentlySelectedTab);
}
this.m_tabInfo={};
}
this.m_switchingToTabId=null;
_9a6.setAttribute("tabId",this.m_currentlySelectedTab);
if(_9a5){
_9a5.setAttribute("tabId",this.m_currentlySelectedTab);
}
if(isIE()&&_9a4&&window.resizeIFrame&&!this.m_viewerFragment&&!this.m_viewerWidget){
window.resizeIFrame();
}
}
this.setMaxContentSize();
}else{
var obj=this;
setTimeout(function(){
obj.renderTabs();
},100);
}
};
CCognosViewer.prototype.cancelTabSwitch=function(){
var _9b2=this.getReportDiv();
var _9b3=this.m_switchingToTabId;
this.m_currentlySelectedTab=_9b3;
this.m_tabControl.selectTab(this.previouslySelectedTab,false);
this.switchTabs(this.previouslySelectedTab);
if(_9b2){
_9b2.parentNode.removeChild(_9b2);
}
if(this.m_tabInfo[this.m_currentlySelectedTab]&&this.m_tabInfo[this.m_currentlySelectedTab].styles){
this._addTabStylesToHead(this.m_tabInfo[this.m_currentlySelectedTab].styles);
}
this.previouslySelectedTab=null;
this.m_tabInfo[_9b3]=null;
};
CCognosViewer.prototype.switchSavedOutputTab=function(_9b4,_9b5){
var _9b6=this.getSelectionController();
if(_9b6){
_9b6.clearSelectedObjects();
}
this.m_currentlySelectedTab=this.m_tabControl.getSelectedTabId();
if(_9b5){
this.notifyTabChange(_9b4);
}
if(this.m_viewerWidget){
this.m_viewerWidget.getSavedOutput().switchSavedOutputTab(_9b4,_9b5);
this.getTabController().resetPosition();
}else{
if(!this.savedOutputTabNodes){
var _9b7=document.getElementById("CVIFrame"+this.getId());
this.savedOutputTabNodes=getElementsByAttribute(_9b7.contentWindow.document.body,"*","tabid");
}
if(!this.savedOutputTabNodes){
return;
}
for(var i=0;i<this.savedOutputTabNodes.length;i++){
var _9b9=this.savedOutputTabNodes[i];
_9b9.style.display=_9b9.getAttribute("tabid")==_9b4?"":"none";
}
this.setMaxContentSize();
}
};
CCognosViewer.prototype.notifyTabChange=function(_9ba){
};
CCognosViewer.prototype._getNodesWithViewerId=function(_9bb,_9bc,id){
var _9be=[];
var _9bf=_9bb.getElementsByTagName(_9bc);
for(var i=0;i<_9bf.length;i++){
var node=_9bf[i];
if(!id||(node.getAttribute&&node.getAttribute("namespaceId")==id)){
node.parentNode.removeChild(node);
_9be.push(node);
i--;
}
}
return _9be;
};
CCognosViewer.prototype._removeTabStylesFromHead=function(){
var id=this.getId();
return this._getNodesWithViewerId(document.getElementsByTagName("head").item(0),"style",id);
};
CCognosViewer.prototype._addTabStylesToHead=function(_9c3){
if(!_9c3){
return;
}
for(var i=0;i<_9c3.length;i++){
document.getElementsByTagName("head").item(0).appendChild(_9c3[i]);
}
};
CCognosViewer.prototype.switchTabs=function(_9c5){
if(this.m_currentlySelectedTab==_9c5){
return;
}
var _9c6=this.getSelectionController();
if(_9c6){
_9c6.clearSelectedObjects();
}
var _9c7=this.getReportDiv();
this.m_nReportDiv=null;
var _9c8=_9c7.clientHeight;
_9c7.removeAttribute("id");
_9c7.style.display="none";
if(!this.m_tabInfo){
this.m_tabInfo={};
}
var _9c9=this._removeTabStylesFromHead();
var _9ca=this.getSelectionController().getCCDManager();
this.m_tabInfo[this.m_currentlySelectedTab]={"conversation":this.getConversation(),"metadata":_9ca.getClonedMetadataArray(),"contextdata":_9ca.getClonedContextdataArray(),"secondaryRequests":this.getSecondaryRequests(),"styles":_9c9,"hasPromptControl":this.getHasPrompts()};
var _9cb=this._findChildWithTabId(_9c7.parentNode,_9c5);
this.previouslySelectedTab=this.m_currentlySelectedTab;
if(_9cb&&this.m_tabInfo[_9c5]&&this.m_tabInfo[_9c5].hasPromptControl){
if(_9cb){
_9cb.parentNode.removeChild(_9cb);
_9cb=null;
}
delete this.m_tabInfo[_9c5];
this.m_tabInfo[_9c5]=null;
}
if(_9cb){
this.m_currentlySelectedTab=_9c5;
_9cb.style.display="block";
_9cb.setAttribute("id","CVReport"+this.getId());
if(this.m_tabInfo&&this.m_tabInfo[_9c5]){
var _9cc=this.m_tabInfo[_9c5];
if(_9cc.conversation){
this.setConversation(_9cc.conversation);
}
if(_9cc.metadata){
_9ca.SetMetadata(_9cc.metadata);
}
if(_9cc.contextdata){
_9ca.SetContextData(_9cc.contextdata);
}
if(_9cc.secondaryRequests){
this.setSecondaryRequests(_9cc.secondaryRequests);
}
if(_9cc.styles){
this._addTabStylesToHead(_9cc.styles);
}
this.setHasPrompts(_9cc.hasPromptControl);
}
if(this.shouldWriteNavLinks()){
this.writeNavLinks(this.getSecondaryRequests().join(" "));
}
if(this.getPinFreezeManager()&&this.getPinFreezeManager().hasFrozenContainers()){
this.getPinFreezeManager().rePaint();
if(isIE()){
var _9cd=document.getElementById("RVContent"+this.getId());
this.repaintDiv(_9cd);
}
}
if(this.m_viewerWidget){
this.m_viewerWidget.placeTabControlInView();
}
this._keepFocus=null;
this.doneLoadingUpdateA11Y("complete");
this.getTabController().resetPosition();
this.setMaxContentSize();
}else{
this.m_switchingToTabId=_9c5;
var _9ce=_9c7.cloneNode(false);
_9ce.style.display="block";
_9ce.setAttribute("id","CVReport"+this.getId());
_9ce.removeAttribute("tabId");
_9c7.parentNode.appendChild(_9ce);
_9ce.innerHTML="<table height='"+_9c8+"px'><tr><td height='100%'></td></tr></table>";
var _9cf=new ViewerDispatcherEntry(this);
_9cf.addFormField("ui.action","reportAction");
_9cf.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup",_9c5);
if(this.m_viewerWidget){
this.m_viewerWidget.placeTabControlInView();
}
this.dispatchRequest(_9cf);
}
};
CCognosViewer.prototype._removeTabContent=function(_9d0,_9d1){
var _9d2=this._findChildWithTabId(_9d0,_9d1);
while(_9d2){
_9d2.parentNode.removeChild(_9d2);
_9d2=this._findChildWithTabId(_9d0,_9d1);
}
};
CCognosViewer.prototype._findChildWithTabId=function(_9d3,_9d4){
var _9d5=null;
for(var i=0;i<_9d3.childNodes.length;i++){
var _9d7=_9d3.childNodes[i];
if(_9d7.getAttribute("tabId")==_9d4){
_9d5=_9d7;
break;
}
}
return _9d5;
};
CCognosViewer.prototype.clearTabs=function(){
if(!this.m_bHasTabs){
return;
}
this.m_tabInfo={};
var _9d8=this.getReportDiv();
var _9d9=_9d8.parentNode;
for(var i=0;i<_9d9.childNodes.length;i++){
var node=_9d9.childNodes[i];
if(node.getAttribute("id")!="CVReport"+this.m_sId){
_9d9.removeChild(node);
i--;
}
}
};
CCognosViewer.prototype.isSavedOutput=function(){
var _9dc=this.envParams["ui.action"];
return _9dc==="view"||_9dc==="buxView";
};
CCognosViewer.prototype.renderSavedOutputIFrame=function(url,_9de,_9df){
var _9e0=document.getElementById("CVReport"+this.getId());
var _9e1=document.createElement("iframe");
_9e1.style.width="100%";
_9e1.style.height="99%";
_9e1.id="CVIFrame"+this.getId();
_9e1.title=_9de;
_9e1.setAttribute("frameBorder","0");
_9e0.appendChild(_9e1);
var obj=this;
var func=function(){
obj.renderTabs();
};
setTimeout(function(){
if(_9df){
if(_9e1.attachEvent){
_9e1.attachEvent("onload",func);
}else{
_9e1.addEventListener("load",func,true);
}
}
_9e1.src=url;
},1);
};
CCognosViewer.prototype.updatePageState=function(_9e4){
if(_9e4&&this.getState()){
this.getState().setPageState(_9e4);
}
};
CCognosViewer.prototype.getPageInfo=function(){
if(this.m_viewerState&&this.m_viewerState.getPageState()){
var _9e5=this.m_viewerState.getPageState();
return {"currentPage":_9e5.getCurrentPage(),"pageCount":_9e5.getPageCount()};
}
return {};
};
CCognosViewer.prototype.isIWidgetMobile=function(){
return this.m_viewerWidget&&this.m_viewerWidget.isMobile();
};
CCognosViewer.prototype.isInteractiveViewer=function(){
return false;
};
CCognosViewer.prototype.launchGotoPageForIWidgetMobile=function(form){
if(this.isIWidgetMobile()){
this.m_viewerWidget.launchGotoPageForIWidgetMobile(form);
return true;
}
return false;
};
CCognosViewer.prototype.executeDrillThroughForIWidgetMobile=function(form){
if(this.isIWidgetMobile()){
this.m_viewerWidget.executeDrillThroughForIWidgetMobile(form);
return true;
}
return false;
};
CCognosViewer.prototype.getState=function(){
return this.m_viewerState;
};
CCognosViewer.prototype.getConfig=function(){
return this.m_viewerConfig;
};
CCognosViewer.prototype.getUIConfig=function(){
return this.m_viewerUIConfig;
};
CCognosViewer.prototype.setCurrentNodeFocus=function(node){
this.m_currentNodeFocus=node;
};
CCognosViewer.prototype.getCurrentNodeFocus=function(node){
return this.m_currentNodeFocus;
};
CCognosViewer.prototype.setCurrentPromptControlFocus=function(node){
this.m_CurrentPromptControlFocus=node;
};
CCognosViewer.prototype.getCurrentPromptControlFocus=function(node){
return this.m_CurrentPromptControlFocus;
};
CCognosViewer.prototype.loadExtra=function(){
};
CCognosViewer.prototype.setRetryDispatcherEntry=function(_9ec){
this.m_retryDispatcherEntry=_9ec;
};
CCognosViewer.prototype.getRetryDispatcherEntry=function(){
return this.m_retryDispatcherEntry;
};
CCognosViewer.prototype.resetViewerDispatcher=function(){
if(this.m_viewerDispatcher!==null){
delete this.m_viewerDispatcher;
this.m_viewerDispatcher=new ViewerDispatcher();
}
};
CCognosViewer.prototype.getViewerDispatcher=function(){
return this.m_viewerDispatcher;
};
CCognosViewer.prototype.setFaultDispatcherEntry=function(_9ed){
this.m_faultDispatcherEntry=_9ed;
};
CCognosViewer.prototype.getFaultDispatcherEntry=function(){
return this.m_faultDispatcherEntry;
};
CCognosViewer.prototype.dispatchRequest=function(_9ee){
this.setFaultDispatcherEntry(null);
this.getViewerDispatcher().dispatchRequest(_9ee);
};
CCognosViewer.prototype.getActiveRequest=function(){
return this.getViewerDispatcher().getActiveRequest();
};
CCognosViewer.prototype.getProductLocale=function(){
if(this.sProductLocale){
return this.sProductLocale;
}
return "en";
};
CCognosViewer.prototype.getDirection=function(){
if(this.sDirection){
return this.sDirection;
}
return "ltr";
};
CCognosViewer.prototype.isBidiEnabled=function(){
if(this.bIsBidiEnabled){
return true;
}
return false;
};
CCognosViewer.prototype.getBaseTextDirection=function(){
if(this.isBidiEnabled()){
if(this.sBaseTextDirection){
return this.sBaseTextDirection;
}
}
return "";
};
CCognosViewer.prototype.getActionFactory=function(){
if(!this.m_actionFactory){
this.m_actionFactory=new ActionFactory(this);
}
return this.m_actionFactory;
};
CCognosViewer.prototype.getAction=function(_9ef){
var _9ef=this.getActionFactory().load(_9ef);
_9ef.setCognosViewer(this);
return _9ef;
};
CCognosViewer.prototype.getCalculationCache=function(){
return this.m_calculationCache;
};
CCognosViewer.prototype.updateOutputForA11ySupport=function(){
this.updateBorderCollapse();
if(this.getA11YHelper()){
this.getA11YHelper().addLabelledByForItemsOutsideOfContainers();
}
var _9f0=navigator.userAgent.toLowerCase();
var _9f1=_9f0.indexOf("iphone")!=-1;
var _9f2=_9f0.indexOf("ipod")!=-1;
var _9f3=_9f0.indexOf("ipad")!=-1;
var _9f4=_9f1||_9f2||_9f3;
var _9f5=_9f0.indexOf("android")!=-1;
if(_9f4||_9f5){
document.body.classList.add("clsViewerMobile");
}
};
CCognosViewer.prototype.checkForHighContrast=function(){
if(this.isBux){
this.m_bHighContrast=dojo.hasClass(document.body,"dijit_a11y")?true:false;
}else{
var _9f6=document.createElement("div");
_9f6.id=this.m_sId+"hc";
_9f6.style.border="1px solid";
_9f6.style.borderColor="red green";
_9f6.style.height="10px";
_9f6.style.top="-999px";
_9f6.style.position="absolute";
document.body.appendChild(_9f6);
var _9f7=null;
if(isIE()){
_9f7=_9f6.currentStyle;
}else{
_9f7=_9f6.ownerDocument.defaultView.getComputedStyle(_9f6,null);
}
if(!_9f7){
return;
}
this.m_bHighContrast=_9f7.borderTopColor==_9f7.borderRightColor;
document.body.removeChild(_9f6);
}
};
CCognosViewer.prototype.isHighContrast=function(){
if(typeof this.m_bHighContrast==="undefined"){
this.checkForHighContrast();
}
return this.m_bHighContrast;
};
CCognosViewer.prototype.isLimitedInteractiveMode=function(){
return this.envParams&&this.envParams.limitedInteractiveMode&&this.envParams.limitedInteractiveMode==="true";
};
CCognosViewer.prototype.updateBorderCollapse=function(){
if(this.isHighContrast()==true){
var _9f8=null;
if(this.envParams["ui.action"]=="view"&&!this.isBux){
var _9f9=document.getElementById("CVIFrame"+this.getId());
_9f8=_9f9.contentWindow.document;
}else{
_9f8=document.getElementById("CVReport"+this.getId());
}
var _9fa=_9f8.getElementsByTagName("table");
for(var i=0;i<_9fa.length;i++){
if(_9fa[i].style.borderCollapse=="collapse"){
_9fa[i].style.borderCollapse="separate";
}
}
}
};
CCognosViewer.prototype.isAccessibleMode=function(){
if(this.m_bAccessibleMode==true){
return true;
}
return false;
};
CCognosViewer.prototype.isSinglePageReport=function(){
for(var _9fc in this.m_aSecRequests){
if(this.m_aSecRequests[_9fc]=="nextPage"||this.m_aSecRequests[_9fc]=="previousPage"){
return false;
}
}
return true;
};
CCognosViewer.prototype.hasNextPage=function(){
for(var _9fd in this.m_aSecRequests){
if(this.m_aSecRequests[_9fd]=="nextPage"){
return true;
}
}
return false;
};
CCognosViewer.prototype.hasPrevPage=function(){
for(var _9fe in this.m_aSecRequests){
if(this.m_aSecRequests[_9fe]=="previousPage"){
return true;
}
}
return false;
};
CCognosViewer.prototype.captureHotkeyPageNavigation=function(evt){
evt=(evt)?evt:((event)?event:null);
if(evt){
var node=getNodeFromEvent(evt);
var _a01=(node&&node.nodeName)?node.nodeName.toLowerCase():null;
if((evt.keyCode==8&&_a01!="input"&&_a01!="textarea")||(evt.altKey==true&&(evt.keyCode==37||evt.keyCode==39))){
evt.returnValue=false;
evt.cancelBubble=true;
if(typeof evt.stopPropagation!="undefined"){
evt.stopPropagation();
}
if(typeof evt.preventDefault!="undefined"){
evt.preventDefault();
}
return false;
}
}
return true;
};
CCognosViewer.prototype.setUseWorkingDialog=function(_a02){
this.m_bUseWorkingDialog=_a02;
};
CCognosViewer.prototype.getWorkingDialog=function(){
if(!this.m_oWorkingDialog&&this.m_bUseWorkingDialog&&typeof WorkingDialog!=="undefined"){
if(this.getConfig()&&this.getConfig().getHttpRequestConfig()&&this.getConfig().getHttpRequestConfig().getWorkingDialog()){
this.m_oWorkingDialog=this.getConfig().getHttpRequestConfig().getWorkingDialog();
}else{
this.m_oWorkingDialog=new WorkingDialog(this);
}
}
return this.m_oWorkingDialog;
};
CCognosViewer.prototype.getRequestIndicator=function(){
if(this.m_bUseWorkingDialog&&!this.m_oRequestExecutedIndicator&&typeof RequestExecutedIndicator!=="undefined"){
if(this.getConfig()&&this.getConfig().getHttpRequestConfig()&&this.getConfig().getHttpRequestConfig().getRequestIndicator()){
this.m_oRequestExecutedIndicator=this.getConfig().getHttpRequestConfig().getRequestIndicator();
}else{
this.m_oRequestExecutedIndicator=new RequestExecutedIndicator(this);
}
}
return this.m_oRequestExecutedIndicator;
};
CCognosViewer.prototype.disableBrowserHotkeyPageNavigation=function(){
if(document.attachEvent){
document.attachEvent("onkeydown",this.captureHotkeyPageNavigation);
}else{
if(document.addEventListener){
document.addEventListener("keydown",this.captureHotkeyPageNavigation,false);
}
}
};
CCognosViewer.prototype.setHasPrompts=function(_a03){
if(!_a03){
this.preProcessControlArray=[];
}
this.m_bReportHasPrompts=_a03;
};
CCognosViewer.prototype.getHasPrompts=function(){
return this.m_bReportHasPrompts;
};
CCognosViewer.prototype.setUsePageRequest=function(_a04){
this.m_viewerDispatcher.setUsePageRequest(_a04);
};
CCognosViewer.prototype.getUsePageRequest=function(){
return this.m_viewerDispatcher.getUsePageRequest();
};
CCognosViewer.prototype.setKeepSessionAlive=function(_a05){
this.m_bKeepSessionAlive=_a05;
};
CCognosViewer.prototype.getKeepSessionAlive=function(){
return this.m_bKeepSessionAlive;
};
CCognosViewer.prototype.getWebContentRoot=function(){
if(typeof this.sWebContentRoot!="undefined"){
return this.sWebContentRoot;
}else{
return "..";
}
};
CCognosViewer.prototype.getSkin=function(){
if(typeof this.sSkin!="undefined"){
return this.sSkin;
}else{
return this.getWebContentRoot()+"/skins/corporate";
}
};
CCognosViewer.prototype.getSelectionController=function(){
var _a06;
try{
_a06=getCognosViewerSCObjectRef(this.m_sId);
}
catch(e){
_a06=null;
}
return _a06;
};
CCognosViewer.prototype.addCallback=function(_a07,oFct,_a09){
if(!this.m_aCallback){
this.m_aCallback=[];
}
this.m_aCallback=this.m_aCallback.concat({m_sEvent:_a07,m_oCallback:oFct,m_bCaptureEvent:(_a09===true)});
};
CCognosViewer.prototype.canDrillDown=function(sId){
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a0c=this.getSelectionController();
if(_a0c){
return (_a0c.canDrillDown(sCtx));
}
}
return false;
};
CCognosViewer.prototype.canDrillUp=function(sId){
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a0f=this.getSelectionController();
if(_a0f){
return (_a0f.canDrillUp(sCtx));
}
}
return false;
};
CCognosViewer.prototype.canSubmitPrompt=function(){
var _a10=null;
if(this.preProcessControlArray&&this.preProcessControlArray instanceof Array){
var _a11=this.preProcessControlArray.length;
for(var k=0;k<_a11;k++){
_a10=eval(this.preProcessControlArray[k]);
if(_a10.isValid()===false){
if(!this.m_reportRenderingDone||!_a10.getCascadeOnParameter||!_a10.getCascadeOnParameter()){
return false;
}
}
}
}
return true;
};
CCognosViewer.prototype.closeContextMenuAndToolbarMenus=function(){
if(this.rvMainWnd){
this.rvMainWnd.closeContextMenuAndToolbarMenus();
}
};
CCognosViewer.prototype.dcm=function(_a13,_a14){
if(this.canDisplayContextMenu()){
if(this.preSelectNode==true){
_a14=false;
this.preSelectNode=false;
}
if(this.rvMainWnd.displayContextMenu(_a13,_a14)!=false){
return stopEventBubble(_a13);
}
}
};
CCognosViewer.prototype.canDisplayContextMenu=function(){
if(!this.getUIConfig()||this.getUIConfig().getShowContextMenu()){
return (!this.isWorkingOrPrompting()&&this.rvMainWnd!=null&&typeof this.bCanUseCognosViewerContextMenu!="undefined"&&this.bCanUseCognosViewerContextMenu);
}
return false;
};
CCognosViewer.prototype.de=function(_a15){
var _a16=this.getDrillMgr();
if(_a16){
_a16.singleClickDrillEvent(_a15,"RV");
}
};
CCognosViewer.prototype.debug=function(sMsg){
if(this.m_bDebug){
var _a18="";
var _a19=this.debug.caller;
if(typeof _a19=="object"&&_a19!==null){
_a18=_a19.toString().match(/function (\w*)/)[1];
}
if(!_a18){
_a18="?";
}
alert(_a18+": "+sMsg);
}
};
CCognosViewer.prototype.callbackExists=function(_a1a){
var _a1b=false;
if(this.m_aCallback&&this.m_aCallback.length){
for(var _a1c=0;_a1c<this.m_aCallback.length;++_a1c){
var oCB=this.m_aCallback[_a1c];
if(oCB.m_sEvent==_a1a){
return true;
}
}
}
return false;
};
CCognosViewer.prototype.executeCallback=function(_a1e){
var _a1f=false;
if(this.m_aCallback&&this.m_aCallback.length){
for(var _a20=0;_a20<this.m_aCallback.length;++_a20){
var oCB=this.m_aCallback[_a20];
if(oCB.m_sEvent==_a1e){
if(typeof oCB.m_oCallback=="function"){
oCB.m_oCallback();
}
if(oCB.m_bCaptureEvent){
_a1f=true;
}
}
}
}
return _a1f;
};
CCognosViewer.prototype.getCAFContext=function(){
return this.m_sCAFContext;
};
CCognosViewer.prototype.getSoapFault=function(){
return this.m_sSoapFault;
};
CCognosViewer.prototype.getColumnContextIds=function(sId){
return this.getContextIds(sId,2);
};
CCognosViewer.prototype.getConversation=function(){
return this.m_sConversation;
};
CCognosViewer.prototype.getStatus=function(){
return (this.m_sStatus?this.m_sStatus:"");
};
CCognosViewer.prototype.isWorking=function(_a23){
if(typeof _a23!="string"){
_a23=this.getStatus();
}
return ((""+_a23).match(/^(working|stillWorking)$/)?true:false);
};
CCognosViewer.prototype.isWorkingOrPrompting=function(){
return (this.getStatus().match(/^(working|stillWorking|prompting)$/)?true:false);
};
CCognosViewer.prototype.getActionState=function(){
return this.m_sActionState;
};
CCognosViewer.prototype.getDataItemName=function(sId){
var _a25=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a27=this.getSelectionController();
if(_a27){
var _a28=_a27.getRefDataItem(sCtx);
if(_a28){
_a25=_a28;
}
}
}
return _a25;
};
CCognosViewer.prototype.getDataType=function(sId){
var _a2a=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a2c=this.getSelectionController();
if(_a2c){
var _a2d=_a2c.getDataType(sCtx);
if(_a2d){
_a2a=_a2d;
}
}
}
return _a2a;
};
CCognosViewer.prototype.getDepth=function(sId){
var _a2f=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a31=this.getSelectionController();
if(_a31){
var _a32=_a31.getDepth(sCtx);
if(_a32){
_a2f=_a32;
}
}
}
return _a2f;
};
CCognosViewer.prototype.getDrillMgr=function(){
if(!this.m_oDrillMgr){
this.loadExtra();
if(typeof CDrillManager=="function"){
this.m_oDrillMgr=new CDrillManager(this);
this.goDrillManager=this.m_oDrillMgr;
}
}
return this.m_oDrillMgr;
};
CCognosViewer.prototype.getSubscriptionManager=function(){
if(!this.m_oSubscriptionManager){
this.loadExtra();
if(typeof CSubscriptionManager=="function"){
this.m_oSubscriptionManager=new CSubscriptionManager(this);
}
}
return this.m_oSubscriptionManager;
};
CCognosViewer.prototype.updateGlobalParameters=function(_a33){
var oReq=new ViewerDispatcherEntry(this);
oReq.addFormField("ui.action","forward");
oReq.addFormField("generic.anyURI.runOptionEnum#globalParameters",_a33);
oReq.addFormField("run.prompt",true);
oReq.addFormField("_promptControl","reprompt");
this.submitPromptValues(oReq);
};
CCognosViewer.prototype.getExecutionParameters=function(){
return this.m_sParameters;
};
CCognosViewer.prototype.getGateway=function(){
return this.m_sGateway;
};
CCognosViewer.prototype.getSpecification=function(){
return this.envParams["ui.spec"];
};
CCognosViewer.prototype.getHierarchyUniqueName=function(sId){
var sHun=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a38=this.getSelectionController();
if(_a38){
var aHUN=_a38.getHun(sCtx);
if(aHUN){
sHun=aHUN;
}
}
}
return sHun;
};
CCognosViewer.prototype.getDimensionUniqueName=function(sId){
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a3c=this.getSelectionController();
if(_a3c){
var aDUN=_a3c.getDun(sCtx);
if(aDUN){
return aDUN;
}
}
}
return null;
};
CCognosViewer.prototype.getId=function(){
return this.m_sId;
};
CCognosViewer.prototype.getLevelId=function(sId){
var _a3f=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a41=this.getSelectionController();
if(_a41){
var aLUN=_a41.getLun(sCtx);
if(aLUN){
_a3f=aLUN;
}
}
}
return _a3f;
};
CCognosViewer.prototype.getMemberUniqueName=function(sId){
var sMUN=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a46=this.getSelectionController();
if(_a46){
var aMUN=_a46.getMun(sCtx);
if(aMUN){
sMUN=aMUN;
}
}
}
return sMUN;
};
CCognosViewer.prototype.getObjectId=function(){
var _a48="window";
if(typeof this.getId()=="string"){
_a48=getCognosViewerObjectRefAsString(this.getId());
}
return _a48;
};
CCognosViewer.prototype.getQueryModelId=function(sId){
var _a4a=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a4c=this.getSelectionController();
if(_a4c){
var _a4d=_a4c.getQueryModelId(sCtx);
if(_a4d){
_a4a=_a4d;
}
}
}
return _a4a;
};
CCognosViewer.prototype.getQueryName=function(sId){
var _a4f=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a51=this.getSelectionController();
if(_a51){
var _a52=_a51.getRefQuery(sCtx);
if(_a52){
_a4f=_a52;
}
}
}
return _a4f;
};
CCognosViewer.prototype.getContextIds=function(sId,_a54){
var aIds=[];
var sCtx=this.findCtx(sId);
if(sCtx){
var _a57=sCtx.split("::");
if(_a57&&_a57.length>1&&_a54<_a57.length){
aIds=_a57[_a54].split(":");
}
}
return aIds;
};
CCognosViewer.prototype.getRowContextIds=function(sId){
return this.getContextIds(sId,1);
};
CCognosViewer.prototype.getPageContextIds=function(sId){
return this.getContextIds(sId,3);
};
CCognosViewer.prototype.getString=function(sKey){
if(RV_RES&&RV_RES[sKey]){
return RV_RES[sKey];
}
return sKey;
};
CCognosViewer.prototype.getRV=function(){
if(typeof this.m_oCVMgr=="object"){
return this.m_oCVMgr;
}
return window;
};
CCognosViewer.prototype.getSecondaryRequests=function(){
return this.m_aSecRequests;
};
CCognosViewer.prototype.getTracking=function(){
return this.m_sTracking;
};
CCognosViewer.prototype.findCtx=function(sId){
var sCtx="";
if(typeof sId=="string"){
var aCtx=this.getReportContextHelper().processCtx(sId);
var _a5e=aCtx[0][0];
var _a5f=this.getSelectionController();
if(_a5f){
if(_a5f.isContextId(_a5e)){
sCtx=sId;
}
}
}
if(!sCtx){
var _a60=this.findElementWithCtx(sId);
if(_a60){
sCtx=_a60.getAttribute("ctx");
}
}
return sCtx;
};
CCognosViewer.prototype.findElementWithCtx=function(sId){
var _a62=sId;
if(typeof sId=="string"){
_a62=this.findElementWithCtx(document.getElementById(sId));
}
if(_a62){
if(_a62.getAttribute&&_a62.getAttribute("ctx")){
return _a62;
}
for(var _a63=0;_a63<_a62.childNodes.length;_a63++){
var _a64=this.findElementWithCtx(_a62.childNodes[_a63]);
if(_a64){
return _a64;
}
}
}
return null;
};
CCognosViewer.prototype.getUseValue=function(sId){
var sVal=null;
var sCtx=this.findCtx(sId).split("::")[0];
if(sCtx){
var _a68=this.getSelectionController();
if(_a68){
sVal=_a68.getUseValue(sCtx);
}
}
return sVal;
};
CCognosViewer.prototype.init=function(_a69){
if(_a69&&typeof _a69=="object"){
for(var _a6a in _a69){
this[_a6a]=_a69[_a6a];
}
}
};
CCognosViewer.prototype.initViewer=function(_a6b){
var _a6c=new RequestHandler(this);
var _a6d=document.getElementById("formBackJax"+this.getId());
if(_a6d&&typeof _a6d.state!="undefined"&&_a6d.state.value.length>0){
_a6c.loadReportHTML(_a6d.result.value);
var _a6e=eval("("+_a6d.state.value+")");
_a6c.updateViewerState(_a6e);
_a6c.postComplete();
}else{
if(this.getUsePageRequest()){
var _a6f=_a6b?_a6b.m_sStatus:null;
if(isIE()){
if(window.location.hash=="#working"){
window.history.go(-2);
return;
}else{
if(_a6f==="working"||_a6f==="stillWorking"){
window.location.hash="#working";
}
}
}else{
if(_a6d&&_a6d.working){
if(_a6d.working.value=="true"){
window.history.go(-1);
return;
}else{
if(_a6f==="working"||_a6f==="stillWorking"){
_a6d.working.value="true";
}
}
}
}
}
_a6c.processInitialResponse(_a6b);
}
};
CCognosViewer.prototype.saveBackJaxInformation=function(_a70){
var _a71=document.getElementById("formBackJax"+this.getId());
if(_a71){
if(typeof _a71.state!="undefined"){
_a71.state.value=_a70.getResponseStateText();
}
if(typeof _a71.result!="undefined"){
_a71.result.value=_a70.getResult();
}
}
};
CCognosViewer.prototype.pcc=function(evt){
if(evt&&typeof evt.button!="undefined"&&evt.button!="1"){
this.preSelectNode=true;
var _a73=this.getSelectionController();
if(_a73){
_a73.pageContextClicked(evt);
}
}
};
CCognosViewer.prototype.isValidAjaxResponse=function(_a74){
return (_a74&&_a74.childNodes&&_a74.childNodes.length>0&&_a74.childNodes[0].nodeName!="parsererror"?true:false);
};
CCognosViewer.prototype.resubmitInSafeMode=function(_a75){
if(this.m_bUseSafeMode){
this.resetViewerDispatcher();
this.setUsePageRequest(true);
this.envParams["cv.useAjax"]="false";
if(_a75){
_a75.retryRequest();
}
}
};
CCognosViewer.prototype.showLoadedContent=function(_a76){
this.updateOutputForA11ySupport();
if(_a76!==null&&typeof _a76!="undefined"){
_a76.style.display="block";
}
this.m_resizeReady=true;
this.doneLoading();
var obj=this;
setTimeout(function(){
obj.renderTabs();
},1);
};
CCognosViewer.prototype.doneLoading=function(){
var _a78=this.getViewerWidget();
if(_a78){
if(window.IBM&&window.IBM.perf){
window.IBM.perf.log("viewer_doneLoading",this);
}
var _a79=this.getStatus();
if(!this.m_reportRenderingDone&&this.m_resizeReady&&this.m_stateSet){
var _a7a=_a79=="working"||_a79=="stillWorking"||_a79=="fault";
_a78.fireEvent("com.ibm.bux.widget.render.done",null,{noAutoResize:_a7a});
if(_a79=="complete"){
if(window.IBM&&window.IBM.perf){
window.IBM.perf.log("viewer_doneLoading",this);
}
if(typeof _a78.postLoadContent=="function"){
_a78.postLoadContent();
}
this.m_reportRenderingDone=true;
if(!_a7a){
var _a7b=this;
setTimeout(function(){
_a7b.m_readyToRespondToResizeEvent=true;
},20);
}
}
}
if(_a79!="fault"){
_a78.clearErrorDlg();
}
this.doneLoadingUpdateA11Y(_a79);
}else{
var _a79=this.getStatus();
if(_a79=="complete"){
this.m_reportRenderingDone=true;
this.JAWSTalk(RV_RES.IDS_JS_READY);
}else{
if(_a79=="working"){
this.JAWSTalk(RV_RES.IDS_JS_WAIT_PAGE_LOADING);
}
}
}
};
CCognosViewer.prototype.doneLoadingUpdateA11Y=function(_a7c){
if(this.getKeepFocus()!==false&&this.getKeepFocus()!=null){
var _a7d=this.getKeepFocus();
if(_a7c=="complete"){
this.setKeepFocus(false);
}
var _a7e=null;
if(this.getVisibleDialog()!==null){
_a7e=this.getVisibleDialog().getDialogDiv();
}else{
if(_a7d===true){
_a7e=document.getElementById("CVReport"+this.getId());
}else{
if(typeof _a7d=="string"){
_a7e=document.getElementById(_a7d);
}else{
if(_a7d!==null){
_a7e=_a7d;
if(this.isBux){
dojo.window.scrollIntoView(_a7e);
}
}
}
}
}
if(_a7e){
setFocusToFirstTabItem(_a7e);
}
if(_a7c=="complete"){
this.JAWSTalk(RV_RES.IDS_JS_READY);
}else{
if(_a7c=="working"||_a7c=="stillWorking"){
this.JAWSTalk(RV_RES.IDS_JS_WAIT_PAGE_LOADING);
}
}
}
};
CCognosViewer.prototype.JAWSTalk=function(_a7f){
if(this.isMobile()||this.isIWidgetMobile()){
return;
}
var id=this.getId();
var div=document.getElementById("JAWS_Alert_"+id);
if(div){
div.parentNode.removeChild(div);
}
div=document.createElement("div");
div.id="JAWS_Alert_"+id;
div.style.position="absolute";
div.style.top="-9000px";
div.style.display="none";
div.setAttribute("role","alert");
div.appendChild(document.createTextNode(_a7f));
var _a82=document.getElementById("RVContent"+id);
if(_a82){
_a82.appendChild(div);
}else{
if(typeof console!="undefined"&&console&&console.log){
console.log("CCognosViewer: Could not find the Viewer div to append the JAWS alert.");
}
}
};
CCognosViewer.prototype.canInsertExpandIconsForAllCrosstabs=function(){
if(this.isLimitedInteractiveMode()||this.isBlacklisted("ExpandMember")||this.isIWidgetMobile()){
return false;
}
var _a83=this.getAdvancedServerProperty("VIEWER_JS_EXPAND_COLLAPSE_CONTROLS_DEFAULT");
if(_a83===null){
return false;
}
var _a84=this.getViewerWidget().getProperties().getShowExpandCollapseIconFlag();
return (_a83.toLowerCase()==="on"&&_a84!==false)||(_a83.toLowerCase()==="off"&&_a84===true);
};
CCognosViewer.prototype.setMaxContentSize=function(){
if("10"!=window.getIEVersion()){
return;
}
if(document.body.className==="viewer"){
var _a85=document.body.offsetHeight;
var _a86=this.getNonReportHeight(document.getElementById("CVReport"+this.getId()));
var _a87=document.getElementById("mainViewerTable"+this.getId());
_a87.style.maxHeight=_a85-_a86-2+"px";
var _a88=GUtil.generateCallback(this.setMaxContentSize,[true],this);
if(!this.attachedOnResize){
this.attachedOnResize=true;
if(window.attachEvent){
window.attachEvent("onresize",_a88);
}else{
if(window.addEventListener){
window.addEventListener("resize",_a88,false);
}
}
}
}
};
CCognosViewer.prototype.getNonReportHeight=function(node){
var _a8a=0;
var _a8b=node.parentNode;
if(!_a8b){
return _a8a;
}
if(_a8b.childNodes.length>1){
for(var i=0;i<_a8b.childNodes.length;i++){
var _a8d=_a8b.childNodes[i];
if(_a8d!=node&&!isNaN(_a8d.clientHeight)&&_a8d.style.display!="none"){
_a8a+=_a8d.clientHeight;
}
}
}
if(node.getAttribute("id")!=("mainViewerTable"+this.m_viewerId)){
_a8a+=this.getNonReportHeight(_a8b);
}
return _a8a;
};
CCognosViewer.prototype.addPageAdornments=function(){
this.m_layoutElements=null;
this.m_lidToElement=null;
this.initFlashCharts();
this.insertSortIconsForAllLists();
var _a8e=this.getViewerWidget().getProperties();
if(this.canInsertExpandIconsForAllCrosstabs()){
this.insertExpandIconsForAllCrosstabs();
}
var _a8f=document.getElementById("CVReport"+this.getId());
if(_a8f){
var oCV=this;
setTimeout(function(){
if(oCV.getPinFreezeManager()&&oCV.getPinFreezeManager().hasFrozenContainers()){
oCV.getPinFreezeManager().renderReportWithFrozenContainers(_a8f);
}
oCV.addInfoBar();
},1);
}
this.getViewerWidget().reselectSelectionFilterObjects();
this.getViewerWidget().addChromeWhitespaceHandler(this.getId());
};
CCognosViewer.prototype.addFlashChart=function(_a91){
this.m_flashChartsObjectIds.push(_a91);
};
CCognosViewer.prototype.flashChartError=function(_a92){
var _a93=this.getViewerWidget();
var _a94=_a93.getProperties();
_a94.setProperty("flashCharts",false);
var _a95=this.getAction("Redraw");
_a95.isUndoable=function(){
return false;
};
_a95.execute();
};
CCognosViewer.prototype.initFlashCharts=function(){
var _a96=this.getViewerWidget();
if(this.m_flashChartsObjectIds.length>0){
var _a97=document.getElementById("rt"+this.getId());
if(window.addEventListener){
_a97.addEventListener("mousedown",onFlashChartRightClick,true);
}else{
var _a98={};
var _a99=function(){
this.releaseCapture();
};
var _a9a=function(){
onFlashChartRightClick(event);
this.setCapture();
};
for(var i=0;i<this.m_flashChartsObjectIds.length;++i){
var _a9c=this.m_flashChartsObjectIds[i];
var _a9d=document.getElementById(_a9c);
_a98[_a9c]=1;
_a9d.parentNode.onmouseup=_a99;
_a9d.parentNode.onmousedown=_a9a;
}
if(this.m_flashChartsObjectIds.length>0){
_a97.attachEvent("oncontextmenu",function(){
if(_a98[window.event.srcElement.id]){
return false;
}
});
}
}
if(_a96){
_a96.fireEvent("com.ibm.bux.widget.setShowBordersWhenInnactive",null,true);
}
}else{
if(_a96){
_a96.fireEvent("com.ibm.bux.widget.setShowBordersWhenInnactive",null,false);
}
}
};
CCognosViewer.prototype.initializeLayoutElements=function(){
var _a9e=document.getElementById("rt"+this.getId());
var _a9f=getElementsByAttribute(_a9e,"*","lid");
this.m_lidToElement={};
this.m_layoutElements=[];
var _aa0=0;
var _aa1=this.getPinFreezeManager();
for(var i=0;i<_a9f.length;i++){
var e=_a9f[i];
if(!_aa1||!_aa1.getContainerElement(e)||_aa1.isElementInMainOutput(e)){
this.m_layoutElements[_aa0]=e;
this.m_lidToElement[e.getAttribute("lid")]=e;
_aa0++;
}
}
};
CCognosViewer.prototype.getLayoutElement=function(_aa4){
if(!this.m_layoutElements){
this.initializeLayoutElements();
}
if(this.m_layoutElements){
return this.m_layoutElements[_aa4];
}
return null;
};
CCognosViewer.prototype.getLayoutElementFromLid=function(lid){
if(!this.m_lidToElement){
this.initializeLayoutElements();
}
return this.m_lidToElement[lid];
};
CCognosViewer.prototype.getInfoBars=function(){
return this.m_aInfoBar?this.m_aInfoBar:null;
};
CCognosViewer.prototype.addInfoBar=function(){
if(this.getAdvancedServerProperty("VIEWER_JS_HIDE_INFO_BAR")==="true"){
return;
}
var _aa6=this.getRAPReportInfo();
if(_aa6){
var _aa7=document.getElementById("rt"+this.getId());
this.initializeLayoutElements();
var _aa8=[];
this.m_aInfoBar=[];
for(var _aa9=0;_aa9<this.m_layoutElements.length;++_aa9){
var _aaa=this.m_layoutElements[_aa9];
var lid=_aaa.getAttribute("lid");
if(lid){
if(lid.indexOf("RAP_NDH_")>-1){
lid=lid.substring(8);
}
lid=lid.substring(0,lid.indexOf(this.getId()));
}
var _aac=_aa6.getContainer(lid);
if(_aac&&typeof _aac.parentContainer=="undefined"){
var _aad=this.collectChildContainers(_aac.container);
if(this.getPinFreezeManager()){
oPinFreezeContainerElement=this.getPinFreezeManager().getContainerElement(_aaa);
_aaa=(oPinFreezeContainerElement)?oPinFreezeContainerElement:_aaa;
}
var _aae=new InfoBar(this,_aaa,_aac,_aad,_aa9);
_aae.setTimingDetails(_aa6._getEventTimings());
_aae.render();
if(_aae.hasSomethingRendered()){
_aa8.push(_aae.getId());
}
this.m_aInfoBar.push(_aae);
}
}
var _aaf=this.getViewerWidget();
if(_aaf){
_aaf.refreshInfoBarRenderedState(_aa8);
}
}
};
CCognosViewer.prototype.collectChildContainers=function(_ab0){
var _ab1=[];
var _ab2=this.getRAPReportInfo();
if(_ab2){
var _ab3=_ab2.getContainerCount();
for(var cidx=0;cidx<_ab3;++cidx){
var _ab5=_ab2.getContainerFromPos(cidx);
if(typeof _ab5.parentContainer!="undefined"&&_ab5.parentContainer==_ab0){
_ab1.push(_ab5);
}
}
}
return _ab1;
};
CCognosViewer.prototype.addReportInfo=function(){
var _ab6=this.getViewerWidget();
if(typeof _ab6==="undefined"||_ab6===null){
return;
}
if(!_ab6.getAttributeValue("originalReport")||this.isIWidgetMobile()){
return;
}
var _ab7=this.envParams["baseReportModificationTime"];
var _ab8=_ab6.getAttributeValue("baseReportModificationTime");
if(typeof _ab7!=="undefined"&&typeof _ab8!=="undefined"&&_ab8&&_ab8!="<empty>"&&_ab7!==_ab8){
var cvid=this.getId();
var _aba=document.getElementById("CVReport"+cvid);
var _abb=_aba.parentNode;
var id="ReportInfo"+cvid;
var _abd=document.createElement("div");
_abd.setAttribute("id",id+"_container");
_abd.setAttribute("cvid",cvid);
_abd.className="new-info-indicator BUXNoPrint";
var _abe=document.createElement("img");
var img=null;
if(this.getDirection()==="rtl"){
img="/rv/images/action_show_info_rtl.png";
}else{
img="/rv/images/action_show_info.png";
}
_abe.src=this.getWebContentRoot()+img;
_abe.className="reportInfoIcon";
_abe.setAttribute("tabIndex","0");
_abe.setAttribute("alt","");
_abe.setAttribute("title","");
_abe.setAttribute("role","presentation");
var _ac0=RV_RES.IDS_JS_REPORT_INFO_TITLE;
var _ac1=RV_RES.IDS_JS_REPORT_INFO_TEXT;
var _ac2=RV_RES.IDS_JS_REPORT_INFO_LINK_TEXT;
_abd.appendChild(_abe);
_abb.insertBefore(_abd,_aba);
this.m_reportInfoTooltip=new bux.reportViewer.ReportInfo({connectId:[id+"_container"],focusElement:_abe,position:["above","below"],title:_ac0,text:_ac1,linkText:_ac2,linkScript:getCognosViewerObjectRefAsString(cvid)+".reportInfoResetReport();",allowMouseOverToolTip:true});
}
};
CCognosViewer.prototype.reportInfoResetReport=function(){
this.executeAction("ResetToOriginal");
};
CCognosViewer.prototype.hideReportInfo=function(){
var _ac3=document.getElementById("ReportInfo"+this.getId()+"_container");
if(typeof _ac3!=="undefined"&&_ac3!==null){
_ac3.style.visibility="hidden";
}
};
CCognosViewer.prototype.insertSortIcons=function(){
var _ac4=this.envParams?this.envParams.limitedInteractiveMode:true;
if(typeof _ac4==="undefined"||_ac4===true){
return;
}
if(this.envParams["ui.action"]==="run"||this.envParams["ui.primaryAction"]==="run"){
this.insertSortIconsForAllLists();
}
};
CCognosViewer.prototype._getContainers=function(_ac5){
var _ac6=[];
var _ac7="",_ac8="";
if(_ac5==="list"){
_ac7="list";
_ac8="ls";
}else{
if(_ac5==="crosstab"){
_ac7="crosstab";
_ac8="xt";
}
}
var _ac9=document.getElementById("CVReport"+this.getId());
if(this.getRAPReportInfo()){
var _aca=this.getRAPReportInfo().getContainerIds(_ac7);
for(var i=0;i<_aca.length;++i){
var _acc=getElementsByAttribute(_ac9,"table","lid",_aca[i]+this.getId(),1);
if(_acc&&_acc.length>0){
_ac6.push(_acc[0]);
}
}
}else{
_ac6=getElementsByClassName(_ac9,"table",_ac8);
}
return _ac6;
};
CCognosViewer.prototype.insertSortIconsForAllLists=function(){
var _acd=this._getContainers("list");
for(var i=0;i<_acd.length;++i){
this.insertSortIconsToList(_acd[i]);
}
};
CCognosViewer.prototype.insertSortIconsToList=function(_acf){
var _ad0=getElementsByAttribute(_acf,"*","type","columnTitle");
for(var i=0;i<_ad0.length;++i){
var _ad2=_ad0[i];
this.getSelectionController().getSelectionObjectFactory().getSelectionObject(_ad2);
if(_ad2.getAttribute("canSort")!="false"&&_ad2.getAttribute("CTNM")===null&&_ad2.getAttribute("CC")===null){
var _ad3=false;
for(var _ad4=0;_ad4<_ad2.childNodes.length;_ad4++){
var _ad5=_ad2.childNodes[_ad4];
if(_ad5.nodeName.toLowerCase()=="img"){
if(_ad5.id&&_ad5.id.indexOf("sortimg")===0){
_ad3=true;
break;
}
var sLid=_ad5.getAttribute("lid");
if(sLid&&sLid.indexOf("SortIcon")!==-1){
_ad2.removeChild(_ad5);
break;
}
}
}
if(!_ad3&&this.canInsertSortIcon(_ad2)){
this.insertSortIconToColumnHeader(_ad2);
}
}
}
};
CCognosViewer.prototype.isDrillBlackListed=function(){
if(typeof this.m_bDrillBlacklisted=="undefined"){
this.m_bDrillBlacklisted=this.isBlacklisted("DrillDown")||this.isBlacklisted("DrillUp");
}
return this.m_bDrillBlacklisted;
};
CCognosViewer.prototype.isBlacklisted=function(item){
return this.UIBlacklist&&this.UIBlacklist.indexOf(" "+item+" ")>0;
};
CCognosViewer.prototype.canInsertSortIcon=function(_ad8){
var _ad9=_ad8.getAttribute("rp_sort");
return ((!this.isLimitedInteractiveMode()&&!this.isBlacklisted("Sort"))||(_ad9!==undefined&&_ad9!==null&&_ad9.length>0));
};
CCognosViewer.prototype.insertSortIconToColumnHeader=function(_ada){
if(!_ada.style.whiteSpace){
_ada.style.whiteSpace="nowrap";
}
var _adb=document.createElement("img");
_adb.setAttribute("id","sortimg"+Math.random());
if((!this.isLimitedInteractiveMode()&&!this.isBlacklisted("Sort"))){
_adb.onmouseover=function(){
this.setAttribute("oldClassName",this.className);
this.className+=" sortIconOver";
};
_adb.onmouseout=function(){
this.className=this.getAttribute("oldClassName");
this.removeAttribute("oldClassName");
};
}
_adb.src=this.getImgSrc(_ada);
var _adc=this.getSortInfo(_ada);
var _add=this.getSortOrder(_adc);
_adb.setAttribute("alt",this.getSortAltText(_add));
_adb.setAttribute("title",this.getSortAltText(_add));
_adb.className=this.getSortClass(_adc);
_adb.setAttribute("sortOrder",_add);
_ada.appendChild(_adb);
};
CCognosViewer.prototype.canInsertShowExpandCollapseIconForNode=function(_ade,_adf){
var _ae0=this.getSelectionController();
var _ae1=_ae0.hasCalculationMetadata(_adf,[_adf],"crosstab");
return ((_ae0.canDrillDown(_adf)||_ade.alwaysCanExpandCollapse)&&!_ae0.isCalculationOrMeasure(_adf,_ae1));
};
CCognosViewer.prototype.insertExpandIconsForAllCrosstabs=function(){
var _ae2=this._getContainers("crosstab");
var _ae3=this;
var _ae4=this.getRAPReportInfo();
var _ae5=this.getReportContextHelper();
for(var i=0;i<_ae2.length;i++){
var _ae7=_ae2[i];
var _ae8=_ae7.getAttribute("lid");
_ae8=_ae8.substring(0,_ae8.length-this.getId().length);
var _ae9=getElementsByAttribute(_ae7,["td","th"],"ctnm","true");
for(var j=0;j<_ae9.length;j++){
var _aeb=_ae9[j];
var sCtx=this.findCtx(_aeb);
var _aed=_ae5.getDataItemName(sCtx);
if(_aed){
var _aee=_ae4.getItemInfo(_ae8,_aed);
var _aef=_ae5.processCtx(sCtx);
if(this.canInsertShowExpandCollapseIconForNode(_aee,_aef[0][0])){
var sMun=_ae5.getMun(sCtx);
var _af1=sMun&&_aee.expandedMembers&&_aee.expandedMembers[sMun]===true;
var _af2=document.createElement("div");
_af2.setAttribute("skipSelection","true");
_af2.className="expandButton "+(_af1?"collapse":"expand");
_aeb.insertBefore(_af2,_aeb.firstChild);
var _af3=document.createElement("span");
_af3.className="expandButtonCaption";
_af3.innerHTML=(_af1?"[-]":"[+]");
_af2.appendChild(_af3);
}
}
}
}
};
CCognosViewer.prototype.removeExpandIconsForAllCrosstabs=function(){
var _af4=this._getContainers("crosstab");
for(var i=0;i<_af4.length;i++){
var _af6=_af4[i];
var _af7=_af6.getAttribute("lid");
_af7=_af7.substring(0,_af7.length-this.getId().length);
var _af8=getElementsByAttribute(_af6,"td","ctnm","true");
for(var j=0;j<_af8.length;j++){
var _afa=_af8[j];
if(_afa.firstChild.className==="expandButton collapse"||_afa.firstChild.className==="expandButton expand"){
_afa.removeChild(_afa.firstChild);
}
}
}
};
CCognosViewer.prototype.fillInContextData=function(){
if(!this.isLimitedInteractiveMode()){
var _afb=document.getElementById("CVReport"+this.getId());
var _afc=getElementsByClassName(_afb,"table","ls");
for(var i=0;i<_afc.length;++i){
var _afe=getElementsByAttribute(_afc[i],"*","type","columnTitle");
for(var j=0;j<_afe.length;++j){
this.getSelectionController().getSelectionObjectFactory().getSelectionObject(_afe[j]);
}
}
}
};
CCognosViewer.prototype.getSortAltText=function(_b00){
if(_b00==="ascending"){
return RV_RES.IDS_JS_SORT_ASCENDING;
}else{
if(_b00==="descending"){
return RV_RES.IDS_JS_SORT_DESCENDING;
}else{
if(_b00==="nosort"){
return RV_RES.IDS_JS_NOT_SORTED;
}
}
}
};
CCognosViewer.prototype.getSortInfo=function(_b01){
var _b02=_b01.getAttribute("rp_sort");
if(_b02){
_b02=_b02.split(".");
}
return _b02;
};
CCognosViewer.prototype.getSortClass=function(_b03){
var _b04="sortIconHidden";
if(_b03){
if(_b03[0]==="d"||_b03[0]==="a"){
_b04="sortIconVisible";
}
}
return _b04;
};
CCognosViewer.prototype.getSortOrder=function(_b05){
var _b06="nosort";
if(_b05){
if(_b05[0]==="d"){
_b06="descending";
}else{
if(_b05[0]==="a"){
_b06="ascending";
}
}
}
return _b06;
};
CCognosViewer.prototype.getImgSrc=function(_b07){
var _b08=_b07.getAttribute("rp_sort");
var src=this.getWebContentRoot()+"/rv/images/"+this.getSortIconName(_b08);
return src;
};
CCognosViewer.prototype.getSortIconName=function(_b0a){
var _b0b="sort_no.gif";
if(_b0a){
_b0a=_b0a.split(".");
if(_b0a[0]==="d"){
_b0b="sort_descending.gif";
}else{
if(_b0a[0]==="a"){
_b0b="sort_ascending.gif";
}
}
}
return _b0b;
};
CCognosViewer.prototype.shouldWriteNavLinks=function(){
if(this.envParams["cv.navlinks"]=="false"){
return false;
}else{
if(!this.getUIConfig()||this.getUIConfig().getShowPageNavigation()){
if(this.rvMainWnd||(this.isBux&&!this.isActiveReport())){
return true;
}
}
}
return false;
};
CCognosViewer.prototype.isActiveReport=function(){
if(this.envParams["cv.responseFormat"]==="activeReport"){
return true;
}
return false;
};
CCognosViewer.prototype.resetRaiseSharePromptEventFlag=function(){
this.m_raiseSharePromptEvent=true;
};
CCognosViewer.prototype.resetbHasPromptFlag=function(){
this.m_bHasPrompt=null;
};
CCognosViewer.prototype.disableRaiseSharePromptEvent=function(){
this.m_raiseSharePromptEvent=false;
};
CCognosViewer.prototype.widgetHasPromptParameters=function(){
var _b0c=this.getViewerWidget();
return (_b0c&&_b0c.promptParametersRetrieved==true&&this.envParams&&typeof this.envParams["reportPrompts"]!="undefined"&&this.envParams["reportPrompts"]!=null&&this.envParams["reportPrompts"].length>0);
};
CCognosViewer.prototype.getPromptParametersInfo=function(){
var _b0d=null;
if(this.widgetHasPromptParameters()){
_b0d="<widget><parameterValues>"+sXmlEncode(this.getExecutionParameters())+"</parameterValues>"+this.envParams["reportPrompts"]+"</widget>";
}
return _b0d;
};
CCognosViewer.prototype.raisePromptEvent=function(_b0e,_b0f,_b10){
try{
var _b11=this.getViewerWidget();
_b11.getWidgetContextManager().raisePromptEvent(_b0e,_b0f,_b0f.get("ui.action"),this.getModelPath(),_b10);
}
catch(e){
}
};
CCognosViewer.prototype.getModelPath=function(){
var _b12=this.getSelectionController().getModelPathForCurrentSelection();
if(_b12){
return _b12;
}else{
if(this.envParams.modelPath){
return this.envParams.modelPath;
}else{
if(typeof document.forms["formWarpRequest"+this.getId()].modelPath!=="undefined"){
return document.forms["formWarpRequest"+this.getId()].modelPath.value;
}
}
}
return "";
};
CCognosViewer.prototype.setKeepFocus=function(_b13){
this._keepFocus=_b13;
};
CCognosViewer.prototype.getKeepFocus=function(){
if(typeof this._keepFocus!="undefined"){
return this._keepFocus;
}
return false;
};
CCognosViewer.prototype.onFocus=function(evt){
var _b15=this.getA11YHelper();
if(_b15){
_b15.onFocus(evt);
}
};
CCognosViewer.prototype.getA11YHelper=function(){
if(!this.a11yHelper){
this.loadExtra();
if(typeof ViewerA11YHelper=="function"){
this.a11yHelper=new ViewerA11YHelper(this);
}else{
if(typeof console!=="undefined"&&console.log){
console.log("CCognosViewer: Could not create ViewerA11YHelper object.");
}
return null;
}
}
return this.a11yHelper;
};
CCognosViewer.prototype.onKeyDown=function(evt){
if(this.getA11YHelper()){
this.getA11YHelper().onKeyDown(evt);
}
};
CCognosViewer.prototype.updateSkipToReportLink=function(){
var _b17=this.getStatus();
var _b18=document.getElementById("cvSkipToReport"+this.getId());
if(_b18){
_b18.style.display=_b17=="prompting"?"none":"";
}
};
CCognosViewer.prototype.updateSkipToNavigationLink=function(_b19){
var _b1a=document.getElementById("cvSkipToNavigation"+this.getId());
if(_b1a){
_b1a.style.display=_b19?"none":"";
}
};
CCognosViewer.prototype.pageAction=function(_b1b){
this.setKeepFocus("CVNavLinks"+this.getId());
var _b1c=new ViewerDispatcherEntry(this);
_b1c.addFormField("ui.action",_b1b);
if(this.getCurrentlySelectedTab()){
_b1c.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup",this.getCurrentlySelectedTab());
}
this.dispatchRequest(_b1c);
};
CCognosViewer.prototype.writeNavLink=function(_b1d,_b1e,_b1f,_b20){
var _b21="";
if(_b1f){
_b21="<td nowrap=\"nowrap\">"+"<img src=\"LINK_IMG\" width=\"15\" height=\"15\" alt=\"\" style=\"vertical-align:middle;\">"+"</td>"+"<td nowrap=\"nowrap\">";
if(_b20){
_b21+="<a href=\"#\" tabindex=\"0\" onclick=\""+getCognosViewerObjectRefAsString(this.getId())+".getViewerWidget().getSavedOutput().pageAction('LINK_REQUEST');return false;\"";
}else{
_b21+="<a href=\"#\" tabindex=\"0\" onclick=\""+getCognosViewerObjectRefAsString(this.getId())+".pageAction('LINK_REQUEST');return false;\"";
}
_b21+=">LINK_TEXT</a>&#160;"+"</td>";
}else{
_b21="<td nowrap=\"nowrap\">"+"<img src=\"LINK_IMG\" width=\"15\" height=\"15\" alt=\"\" style=\"vertical-align:middle;\">"+"</td>"+"<td nowrap=\"nowrap\">LINK_TEXT&#160;</td>";
}
var sImg=this.sSkin+(!_b1f&&_b1d.sImgDisabled?_b1d.sImgDisabled:_b1d.sImg);
return _b21.replace(/LINK_REQUEST/g,_b1e).replace(/LINK_TEXT/g,_b1d.sText).replace(/LINK_IMG/g,sImg);
};
CCognosViewer.prototype.loadNavLinks=function(){
var _b23=window.gScriptLoader.loadFile(this.getGateway(),"b_action=xts.run&m=portal/report-viewer-navlinks.xts");
if(_b23){
this.init(eval("("+_b23+")"));
}
};
CCognosViewer.prototype.writeNavLinks=function(sSR,_b25){
var _b26=document.getElementById("CVNavLinks"+this.getId());
if(_b26){
var _b27=document.getElementById("CVNavLinks_Container"+this.getId());
if(typeof this.oNavLinks!="object"||typeof sSR!="string"||!sSR.match(/\bfirstPage\b|\bpreviousPage\b|\bnextPage\b|\blastPage\b|\bplayback\b/i)){
_b26.style.display="none";
if(_b27){
_b27.style.display="none";
}
this.updateSkipToNavigationLink(true);
return;
}
this.updateSkipToNavigationLink(false);
if(_b27){
_b27.style.display="";
}
_b26.style.display=(isIE()?"block":"table-cell");
var _b28="";
_b28+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"pageControls BUXNoPrint\" role=\"presentation\"><tbody><tr>";
_b28+=this.writeNavLink(this.oNavLinks.oFirst,"firstPage",sSR.match(/\bfirstPage\b/gi),_b25);
_b28+=this.writeNavLink(this.oNavLinks.oPrevious,"previousPage",sSR.match(/\bpreviousPage\b/gi),_b25);
_b28+=this.writeNavLink(this.oNavLinks.oNext,"nextPage",sSR.match(/\bnextPage\b/gi),_b25);
_b28+=this.writeNavLink(this.oNavLinks.oLast,"lastPage",sSR.match(/\blastPage\b/gi),_b25);
_b28+="</tr></tbody></table>";
var _b29=document.getElementById("CVNavLinks_label"+this.getId());
var _b2a="";
if(_b29){
_b2a+="<span id=\"CVNavLinks_label"+this.getId()+"\" style=\"visibilty:hidden; display:none;\">"+_b29.innerHTML+"</span>";
}
_b26.innerHTML=_b2a+_b28;
}else{
if(this.shouldWriteNavLinks()){
setTimeout(getCognosViewerObjectRefAsString(this.getId())+".writeNavLinks(\""+sSR+"\",\""+_b25+"\");",100);
}
}
};
function CVBackgroundLayer_ignoreMouseClick(e){
if(e.returnValue){
e.returnValue=false;
}else{
if(e.preventDefault){
e.preventDefault();
}else{
return false;
}
}
};
CCognosViewer.prototype.createTransparentBackgroundLayer=function(){
this.removeTransparentBackgroundLayer();
var oBL=document.createElement("div");
oBL.id=CV_BACKGROUND_LAYER_ID;
oBL.style.display="none";
oBL.style.position="absolute";
oBL.setAttribute("role","region");
oBL.setAttribute("aria-label",RV_RES.IDS_JS_A11Y_BACKGROUND_TINT);
oBL.style.top="0px";
oBL.style.left="0px";
oBL.style.zIndex=98;
oBL.style.width="100%";
oBL.style.height="100%";
oBL.style.backgroundColor="rgb(238, 238, 238)";
oBL.style.opacity="0";
oBL.style.filter="alpha(opacity:0)";
oBL.innerHTML="<table tabindex=\"1\" width=\"100%\" height=\"100%\"><tr><td role=\"presentation\" onclick=\"CVBackgroundLayer_ignoreMouseClick(event)\"></td></tr></table>";
oBL.style.display="inline";
document.body.appendChild(oBL);
};
CCognosViewer.prototype.removeTransparentBackgroundLayer=function(){
var oBL=document.getElementById(CV_BACKGROUND_LAYER_ID);
if(oBL){
oBL.parentNode.removeChild(oBL);
}
};
CCognosViewer.prototype.closeActiveHTTPConnection=function(){
var _b2e=this.getActiveRequest();
if(_b2e){
_b2e.abortHttpRequest();
}
};
CCognosViewer.prototype.canCancel=function(){
var _b2f=this.getTracking();
var _b30=this.getStatus();
return _b2f!=""&&_b30!="complete";
};
CCognosViewer.prototype.cancel=function(_b31){
if(this.getWorkingDialog()&&this.getWorkingDialog().disableCancelButton){
this.getWorkingDialog().disableCancelButton(_b31);
}
this.removeTransparentBackgroundLayer();
this.clearPrompts();
if(this.m_viewerFragment&&this.envParams["fragment.fireEventWhenComplete"]){
this.envParams["fragment.fireEventWhenComplete"]="";
}
var _b32=null;
if(this.m_undoStack.length>0){
_b32=this.m_undoStack.pop();
}
var _b33=this.getActiveRequest();
if(this.canCancel()===true||_b33){
if(_b33){
_b33.cancelRequest(true);
}else{
var _b34=null;
var _b35=_b32!=null&&_b32.m_bRefreshPage;
if(typeof this.getCancelDispatcherEntry=="function"){
_b34=this.getCancelDispatcherEntry();
}else{
if(_b35||this.m_viewerFragment){
_b34=new ViewerDispatcherEntry(this);
}else{
if(this.getId()=="RS"){
_b34=new ViewerDispatcherEntry(this);
_b34.addFormField("cv.responseFormat","rs");
}else{
_b34=new DispatcherEntry(this);
_b34.addFormField("cv.responseFormat","successfulRequest");
}
}
}
_b34.forceSynchronous();
_b34.addFormField("ui.action","cancel");
_b34.addFormField("m_tracking",this.getTracking());
this.setTracking("");
if(_b35){
var _b36="<CognosViewerUndo><conversation>";
_b36+=_b32.m_sConversation;
_b36+="</conversation></CognosViewerUndo>";
_b34.addFormField("cv.previousSession",_b36);
}
this.dispatchRequest(_b34);
if(!this.isBux&&!this.m_viewerFragment&&(this.getUsePageRequest()||!this.isReportRenderingDone())){
this.executeCallback("cancel");
}
}
this.setStatus("complete");
var _b37=this.envParams["ui.action"];
var _b38=this.getUsePageRequest();
var _b39=this.m_undoStack.length;
if(_b32!=null){
this.m_sConversation=_b32.m_sConversation;
this.m_sParameters=_b32.m_sParameters;
this.envParams={};
applyJSONProperties(this.envParams,_b32.m_envParams);
this.m_undoStack.push(_b32);
}
this.setTracking("");
if(this.previouslySelectedTab){
this.cancelTabSwitch();
}else{
if(_b37!="view"&&_b39<=0&&this.rvMainWnd){
this.rvMainWnd.executePreviousReport(-1);
}
}
return true;
}else{
if(this.rvMainWnd&&typeof this.envParams!="undefined"&&(this.envParams["ui.primaryAction"]=="authoredDrillThrough"||this.envParams["ui.primaryAction"]=="authoredDrillThrough2")){
this.rvMainWnd.executePreviousReport(-1);
return true;
}else{
if(!this.isBux){
executeBackURL(this.getId());
}
return true;
}
}
return false;
};
CCognosViewer.prototype.clearPrompts=function(){
if(this.preProcessControlArray){
var _b3a=this.preProcessControlArray.length;
var k=0;
for(k=0;k<_b3a;k++){
var _b3c=eval(this.preProcessControlArray[k]);
if(_b3c){
if(_b3c.clearSubmit){
_b3c.clearSubmit();
}
}
}
}
};
CCognosViewer.prototype.wait=function(){
if(this.isWorking()){
this.JAWSTalk(RV_RES.IDS_JS_WAIT_PAGE_LOADING);
var _b3d=new ViewerDispatcherEntry(this);
_b3d.addFormField("ui.action","wait");
_b3d.addFormField("ui.primaryAction",this.envParams["ui.primaryAction"]);
_b3d.addFormField("cv.actionState",this.envParams["cv.actionState"]);
_b3d.addNonEmptyStringFormField("bux",this.envParams["bux"]);
_b3d.addNonEmptyStringFormField("ui.preserveRapTags",this.envParams["ui.preserveRapTags"]);
this.dispatchRequest(_b3d);
return true;
}
return false;
};
CCognosViewer.prototype.setCAFContext=function(_b3e){
this.m_sCAFContext=_b3e;
};
CCognosViewer.prototype.setContextInfo=function(sXML){
this.m_sContextInfoXML=sXML;
};
CCognosViewer.prototype.setConversation=function(_b40){
this.m_sConversation=_b40;
};
CCognosViewer.prototype.setActionState=function(_b41){
this.m_sActionState=_b41;
};
CCognosViewer.prototype.setStatus=function(_b42){
this.m_sStatus=_b42;
};
CCognosViewer.prototype.setDebug=function(_b43){
this.m_bDebug=_b43;
};
CCognosViewer.prototype.setExecutionParameters=function(_b44){
this.m_sParameters=_b44;
};
CCognosViewer.prototype.setMetadataInfo=function(sXML){
this.m_sMetadataInfoXML=sXML;
};
CCognosViewer.prototype.setSecondaryRequests=function(_b46){
if(_b46){
this.m_aSecRequests=_b46;
}else{
this.m_aSecRequests=[];
}
};
CCognosViewer.prototype.setTracking=function(_b47){
this.m_sTracking=_b47;
};
CCognosViewer.prototype.setSoapFault=function(_b48){
this.m_sSoapFault=_b48;
};
CCognosViewer.prototype.showOutputInNewWindow=function(sURL){
var _b4a=document.getElementById("formWarpRequest"+this.getId());
var _b4b=_b4a.elements["ui.postBack"];
var _b4c=_b4a.elements["ui.backURL"];
if(this.isAccessibleMode()&&this.envParams["run.outputFormat"]=="PDF"&&window.detachLeavingRV){
window.detachLeavingRV();
}
if(window.opener||_b4b||(_b4c&&_b4c.value!=="javascript:window.close();")){
window.open(sURL,"","");
this.updateNewBrowserWindow();
}else{
window.location=sURL;
}
};
CCognosViewer.prototype.hideToolbar=function(_b4d){
this.m_bHideToolbar=_b4d;
};
CCognosViewer.prototype.showExcel=function(sURL){
var _b4f=true;
var _b50=document.getElementById("formWarpRequest"+this.getId());
var _b51=_b50.elements["ui.backURL"];
if(_b51&&_b51.value.indexOf("javascript:window.close()")!==0&&_b51.value.indexOf("close.html")===-1){
_b4f=false;
}
if(window.detachLeavingRV){
window.detachLeavingRV();
}
var _b52=window;
if(window.opener&&(isIE()||isFF())&&_b4f){
_b52=window.opener?window.opener:window;
}else{
if(!window.opener&&_b4f){
window.location=sURL;
return;
}
}
var _b53=null;
var _b54="";
try{
if(this.envParams["cv.excelWindowOpenProperties"]){
_b54=this.envParams["cv.excelWindowOpenProperties"];
}
_b53=_b52.open(sURL,"",_b54);
}
catch(e){
_b52=window;
_b53=_b52.open(sURL,"",_b54);
}
if(!_b53||_b53.closed||typeof _b53.closed=="undefined"){
alert(RV_RES.RV_BROWSER_POPUP_IS_ENABLED);
}
this.updateNewBrowserWindow();
};
CCognosViewer.prototype.updateNewBrowserWindow=function(){
var id=this.getId();
var _b56=document.forms["formWarpRequest"+id].elements["ui.postBack"];
var _b57=document.forms["formWarpRequest"+id].elements["ui.backURL"];
if(_b56&&_b56.value){
setTimeout(getCognosViewerObjectRefAsString(id)+".getRV().doPostBack();",100);
}else{
if(_b57&&_b57.value){
if(_b57.value.length<2048){
setTimeout("location.replace(\""+_b57.value+"\");",100);
}else{
_b57=decodeURIComponent(_b57.value);
var _b58=_b57.split("?");
var _b59=document.createElement("form");
_b59.style.display="none";
_b59.setAttribute("target","_self");
_b59.setAttribute("method","post");
_b59.setAttribute("action",_b58[0]);
var _b5a=_b58[1].split("&");
for(var _b5b=0;_b5b<_b5a.length;_b5b++){
var _b5c=_b5a[_b5b].indexOf("=");
var _b5d=_b5a[_b5b].substr(0,_b5c);
var _b5e=_b5a[_b5b].substr(_b5c+1);
var _b5f=document.createElement("img");
_b5f.setAttribute("type","hidden");
_b5f.setAttribute("name",decodeURIComponent(_b5d));
_b5f.setAttribute("value",decodeURIComponent(_b5e));
_b59.appendChild(_b5f);
}
document.body.appendChild(_b59);
_b59.submit();
}
}else{
window.close();
}
}
};
CCognosViewer.prototype.showWaitPage=function(){
};
CCognosViewer.prototype.sendRequest=function(_b60){
var _b61=new ViewerDispatcherEntry(this);
_b61.addFormField("ui.action",_b60.getAction());
if(_b60.getCallback()!=null){
_b61.setCallbacks({"complete":{"object":null,"method":_b60.getCallback()}});
}
var _b62=_b60.getFormFields().keys();
for(var _b63=0;_b63<_b62.length;_b63++){
_b61.addFormField(_b62[_b63],_b60.getFormFields().get(_b62[_b63]));
}
var _b64=_b60.m_oOptions.keys();
for(var _b65=0;_b65<_b64.length;_b65++){
_b61.addFormField(_b64[_b65],_b60.getOption(_b64[_b65]));
}
var _b66=_b60.m_oParams.keys();
for(var _b67=0;_b67<_b66.length;_b67++){
_b61.addFormField(_b66[_b67],_b60.getParameter(_b66[_b67]));
}
this.dispatchRequest(_b61);
};
CCognosViewer.prototype.promptAction=function(_b68,sUrl){
this.setKeepFocus(true);
if(typeof datePickerObserverNotify=="function"){
datePickerObserverNotify();
}
var _b6a=this.getViewerWidget();
if(_b68=="cancel"){
this.cancelPrompt(sUrl);
if(_b6a){
if(!this.isReportRenderingDone()){
var _b6b={action:"deleteWidget"};
_b6a.fireEvent("com.ibm.bux.widget.action",null,_b6b);
}
}
}else{
var oReq=new ViewerDispatcherEntry(this);
oReq.addFormField("ui.action",_b68=="back"?"back":"forward");
if(_b68=="finish"){
oReq.addFormField("run.prompt",false);
}else{
if(_b68=="back"||_b68=="next"){
oReq.addFormField("run.prompt",true);
}
}
if(_b68=="reprompt"){
if(typeof repromptObserverNotify=="function"){
repromptObserverNotify(this);
}
oReq.addFormField("_promptControl",_b68);
}else{
oReq.addFormField("_promptControl","prompt");
}
if(_b6a){
_b6a.fireEvent("com.ibm.bux.widget.modified",null,{"modified":true});
if(_b6a.isSelectionFilterEnabled){
_b6a.clearSelectionFilter();
}
}
this.submitPromptValues(oReq);
}
};
CCognosViewer.prototype.cancelPrompt=function(sUrl){
this.cancel();
};
CCognosViewer.prototype.notify=function(_b6e,_b6f){
var _b70=0,k=0;
var _b72=null;
if(this.rangeObserverArray&&this.rangeObserverArray instanceof Array){
_b70=this.rangeObserverArray.length;
for(k=0;k<_b70;k++){
_b72=eval(this.rangeObserverArray[k]);
if(_b72&&typeof _b72=="object"&&typeof _b72.update=="function"){
_b72.update();
}
}
}
var _b73=true;
if(this.preProcessControlArray&&this.preProcessControlArray instanceof Array){
_b70=this.preProcessControlArray.length;
for(k=0;k<_b70;k++){
_b72=eval(this.preProcessControlArray[k]);
if((typeof _b72.getValid=="function")&&!_b72.getValid()){
_b73=false;
break;
}
}
}
this.notifyPageNavEnabled(_b73);
if(this.multipleObserverArray&&this.multipleObserverArray instanceof Array){
_b70=this.multipleObserverArray.length;
for(k=0;k<_b70;k++){
_b72=eval(this.multipleObserverArray[k]);
if(_b72&&typeof _b72=="object"&&typeof _b72.checkInsertRemove=="function"){
_b72.checkInsertRemove();
}
}
}
for(var _b74=0;_b74<gaNotifyTargets.length;_b74++){
var _b75=gaNotifyTargets[_b74];
if(typeof _b75!="undefined"&&typeof _b75.notify=="function"){
_b75.notify(_b6e,_b6f);
}
}
};
CCognosViewer.prototype.notifyPageNavEnabled=function(_b76){
if(this.pageNavigationObserverArray&&this.pageNavigationObserverArray instanceof Array){
var _b77=this.pageNavigationObserverArray.length;
var _b78=false;
var _b79=null;
var _b7a=null;
var k=0;
for(k=0;k<_b77;k++){
try{
_b79=eval(this.pageNavigationObserverArray[k]);
_b7a=_b79.getType();
if(_b7a==PROMPTBUTTON_FINISH){
_b78=true;
break;
}
}
catch(e){
}
}
for(k=0;k<_b77;k++){
try{
_b79=eval(this.pageNavigationObserverArray[k]);
_b7a=_b79.getType();
if(!_b76){
if((_b7a==PROMPTBUTTON_NEXT)||(_b7a==PROMPTBUTTON_OK)||(_b7a==PROMPTBUTTON_FINISH)){
_b79.setEnabled(false);
}
}else{
if(_b7a==PROMPTBUTTON_FINISH){
_b79.setEnabled(this.bCanFinish);
}else{
if(_b7a==PROMPTBUTTON_NEXT){
_b79.setEnabled(this.bNextPage||!_b78);
}else{
if(_b7a==PROMPTBUTTON_OK){
_b79.setEnabled(true);
}
}
}
}
}
catch(e2){
}
}
}
};
CCognosViewer.prototype.getDrillResetHUNs=function(_b7c){
var _b7d=null;
if(this.getRAPReportInfo()){
_b7d=this.getRAPReportInfo().getDrilledOnHUNs();
}
if(!_b7d){
return null;
}
var _b7e=this.getExecutionParameters();
if(!_b7e){
return null;
}
var _b7f=this._getListOfChangedPromptParameters(_b7c);
if(!_b7f||_b7f.length===0){
return null;
}
var _b80=[];
for(var i=0;i<_b7d.length;i++){
for(var j=0;j<_b7f.length;j++){
if(_b7f[j].indexOf(_b7d[i])!==-1){
_b80.push(_b7d[i]);
}
}
}
return _b80;
};
CCognosViewer.prototype.getOldParameters=function(){
var _b83=new CParameterValues();
var _b84=XMLBuilderLoadXMLFromString(this.getExecutionParameters());
if(_b84.childNodes.length==1){
_b83.loadWithOptions(_b84.childNodes[0],false);
}
if(!_b83||!_b83.m_parameterValues||!_b83.m_parameterValues.m_aValues){
return null;
}
return _b83.m_parameterValues.m_aValues;
};
CCognosViewer.prototype._createDummyRequest=function(){
var _b85=new ViewerDispatcherEntry(this);
return this.preparePromptValues(_b85);
};
CCognosViewer.prototype._getChangedPromptParametersValues=function(_b86,_b87,_b88){
var _b89=XMLBuilderLoadXMLFromString(_b87);
if(!_b89){
for(var j=0;j<_b86.length;j++){
var _b8b=_b86[j].m_useValue;
if(_b87.indexOf(sXmlEncode(_b8b))<0){
_b88.push(_b8b);
}
}
return;
}
var _b8c=_b89.getElementsByTagName("selectOption");
if(!_b8c){
return;
}
var _b8d=_b86.length;
var _b8e=_b8c.length;
for(var i=0;i<_b8e;i++){
var _b87=_b8c[i].attributes.getNamedItem("useValue").nodeValue;
bMatchOldParam=false;
for(var j=0;j<_b8d;j++){
var _b8b=_b86[j].m_useValue;
if(_b87.indexOf(_b8b)===0){
bMatchOldParam=true;
break;
}
}
if(!bMatchOldParam){
_b88.push(_b87);
}
}
};
CCognosViewer.prototype._getListOfChangedPromptParameters=function(_b90){
var _b91=this.getOldParameters();
if(!_b91){
return null;
}
var _b92=[];
if(!_b90){
var _b93=this._createDummyRequest();
for(var _b94 in _b91){
var _b95=_b91[_b94].m_parmValueItems;
var _b96=_b93.getRequest().getFormFields().get("p_"+_b94);
if(!_b96){
continue;
}
this._getChangedPromptParametersValues(_b95,_b96,_b92);
}
}else{
if(!_b90.parameters){
return null;
}
var _b97=_b90.parameters;
for(var i=0;i<_b97.length;i++){
var _b99=_b97[i].parmName;
if(!_b99||!_b91[_b99]){
continue;
}
var _b95=_b91[_b99].m_parmValueItems;
if(!_b95||_b95.length==0){
continue;
}
this._getChangedPromptParametersValues(_b95,_b97[i].parmValue,_b92);
}
}
return _b92;
};
CCognosViewer.prototype.submitPromptValues=function(oReq){
if(this.gbPromptRequestSubmitted===true){
return false;
}
this.gbPromptRequestSubmitted=true;
if(this.isBux){
var _b9b=this.getDrillResetHUNs(null);
if(_b9b&&_b9b.length!==0){
var _b9c={"drilledResetHUNs":_b9b};
this.executeAction("DrillReset",_b9c);
return;
}
}
oReq=this.preparePromptValues(oReq);
if(window.portletSharePrompt){
var _b9d=this.portletPromptParams(oReq);
if(_b9d.length>0){
portletSharePrompt(_b9d);
}
}
this.dispatchRequest(oReq);
};
CCognosViewer.prototype.portletPromptParams=function(oReq){
var _b9f=[];
var _ba0=null;
var _ba1=true;
var _ba2=oReq.getFormFields().keys();
for(var _ba3=0;_ba3<_ba2.length;_ba3++){
_ba0=_ba2[_ba3];
if(_ba0=="_promptControl"&&oReq.getFormField(_ba0)=="search"){
_ba1=false;
break;
}else{
if(_ba0.indexOf("p_")===0){
if(_ba0.indexOf("p_credential")===0){
_ba1=false;
break;
}else{
_b9f.push([_ba0,oReq.getFormField(_ba0)]);
}
}
}
}
if(_b9f&&!_ba1){
_b9f=[];
}
return _b9f;
};
CCognosViewer.prototype.preparePromptValues=function(oReq){
var _ba5=[];
if(this.preProcessControlArray){
var _ba6=this.preProcessControlArray.length;
var k=0;
for(k=0;k<_ba6;k++){
var _ba8=eval(this.preProcessControlArray[k]);
var _ba9=(typeof _ba8.isEnabled=="function"?_ba8.isEnabled():true);
if(_ba8&&typeof _ba8.preProcess=="function"&&_ba9){
_ba8.preProcess();
if(_ba8.m_oSubmit){
if(oReq.addParameter){
oReq.addParameter(_ba8.m_oSubmit.name,_ba8.m_oSubmit.value);
}else{
oReq.addFormField(_ba8.m_oSubmit.name,_ba8.m_oSubmit.value);
}
_ba5.push(_ba8.m_oSubmit);
if(_ba8.m_sPromptId&&_ba8.m_oForm&&_ba8.m_oForm.elements&&typeof _ba8.m_oForm.elements["p_"+_ba8.m_sRef]=="object"){
if(oReq.addParameter){
oReq.addParameter("p_"+_ba8.m_sPromptId,_ba8.m_oForm.elements["p_"+_ba8.m_sRef].value);
}else{
oReq.addFormField("p_"+_ba8.m_sPromptId,_ba8.m_oForm.elements["p_"+_ba8.m_sRef].value);
}
}
}
}
}
}
var _baa=document.getElementById("formWarpRequest"+this.getId());
if(_baa){
var _bab=_baa.elements;
for(var _bac=0;_bac<_bab.length;_bac++){
var _bad=_bab[_bac];
if(!_bad.name||!_bad.name.match(/^p_/)){
continue;
}
var _bae=true;
for(var _baf=0;_baf<_ba5.length;_baf++){
if(_ba5[_baf]==_bad){
_bae=false;
break;
}
}
if(_bae){
oReq.addFormField(_bad.name,_bad.value);
_ba5.push(_bad);
}
}
}
var oRM=this["CognosReport"];
if(oRM){
var _bb1=oRM.prompt.getParameters();
for(var i=0;i<_bb1.length;i++){
var _bb3="p_"+_bb1[i].getName();
if(!oReq.getFormField(_bb3)){
oReq.addFormField(_bb3,_bb1[i].getXML());
}
}
}
return oReq;
};
CCognosViewer.prototype.setViewerWidget=function(_bb4){
this.m_viewerWidget=_bb4;
};
CCognosViewer.prototype.getViewerWidget=function(){
return this.m_viewerWidget;
};
CCognosViewer.prototype.getFlashChartOption=function(){
var _bb5=this.getViewerWidget();
var _bb6=null;
if(_bb5){
var _bb7=_bb5.getProperties();
if(_bb7){
_bb6=_bb7.getFlashCharts();
}
}
return _bb6;
};
CCognosViewer.prototype.fireWidgetEvent=function(evt,_bb9){
var _bba=this.getViewerWidget();
if(_bba!=null){
_bba.fireEvent(evt,null,_bb9);
}
};
CCognosViewer.prototype.isMobile=function(){
return false;
};
CCognosViewer.prototype.setVisibleDialog=function(_bbb){
this.m_visibleDialog=_bbb;
};
CCognosViewer.prototype.getVisibleDialog=function(){
if(typeof this.m_visibleDialog!="undefined"){
return this.m_visibleDialog;
}
return null;
};
CCognosViewer.prototype.getContentLocale=function(){
var _bbc=document.getElementById("formWarpRequest"+this.getId());
if(_bbc&&_bbc["ui.contentLocale"]&&_bbc["reRunObj"]&&_bbc["reRunObj"].value.length>0){
return _bbc["ui.contentLocale"].value;
}
return null;
};
CCognosViewer.prototype.updateLayout=function(_bbd){
var cvid=this.getId();
var _bbf=document.getElementById("CVHeader"+cvid);
var _bc0=document.getElementById("CVToolbar"+cvid);
if(!_bbf&&!_bc0){
setTimeout(getCognosViewerObjectRefAsString(cvid)+".updateLayout(\""+_bbd+"\");",100);
return;
}
if(_bbf){
var _bc1=this.getUIConfig()&&!this.getUIConfig().getShowBanner();
if((_bbd=="prompting"&&!this.bShowHeaderWithPrompts)||_bc1){
_bbf.parentNode.style.display="none";
}else{
_bbf.parentNode.style.display="";
}
}
if(_bc0){
if(_bbd=="prompting"||this.m_bHideToolbar==true){
_bc0.parentNode.style.display="none";
}else{
_bc0.parentNode.style.display="";
}
}
};
CCognosViewer.prototype.updateResponseSpecification=function(_bc2){
this.sResponseSpecification=_bc2;
};
CCognosViewer.prototype.getResponseSpecification=function(){
return this.sResponseSpecification;
};
CCognosViewer.prototype.release=function(_bc3){
if(this.getStatus()!="fault"){
this._release(_bc3);
}
};
CCognosViewer.prototype._release=function(_bc4){
var form=document.getElementById("formWarpRequest"+this.getId());
var _bc6=this.getTracking();
if(!_bc6&&form&&form["m_tracking"]&&form["m_tracking"].value){
_bc6=form["m_tracking"].value;
form["m_tracking"].value="";
}
this.setTracking("");
if(_bc6){
var _bc7=new DispatcherEntry(this);
if(this.isWorkingOrPrompting()){
_bc7.addFormField("ui.action","cancel");
}else{
_bc7.addFormField("ui.action","release");
}
_bc7.addFormField("cv.responseFormat","successfulRequest");
_bc7.addNonEmptyStringFormField("ui.primaryAction",this.envParams["ui.primaryAction"]);
_bc7.addNonEmptyStringFormField("ui.objectClass",this.envParams["ui.objectClass"]);
_bc7.addFormField("m_tracking",_bc6);
if(_bc4!=true){
_bc7.forceSynchronous();
}
var _bc8=this.getActiveRequest()?this.getActiveRequest():this.getFaultDispatcherEntry();
if(_bc8&&_bc8.getFormField("cv.outputKey")){
_bc7.addFormField("b_action","cvx.high");
_bc7.addFormField("cv.outputKey",_bc8.getFormField("cv.outputKey"));
_bc7.addFormField("cv.waitForResponse","false");
_bc7.setHeaders(_bc8.getHeaders());
}
var _bc9=_bc7.getRequest().getFormFields();
var _bca=_bc9.keys();
var data=new URLSearchParams();
for(var _bcc=0;_bcc<_bca.length;_bcc++){
data.append(_bca[_bcc],_bc9.get(_bca[_bcc]));
}
if(!navigator.sendBeacon(this.getGateway(),data)){
if(typeof console!=="undefined"&&console.log){
console.log("CCognosViewer: release sendBeacon failed.");
}
}
return true;
}
return false;
};
CCognosViewer.prototype.cleanupStyles=function(){
if(this.getViewerWidget()){
this.getViewerWidget().cleanupStyles();
}
};
CCognosViewer.prototype.destroy=function(_bcd){
this.release(_bcd);
if(!this.m_destroyed){
if(typeof window.gaRV_INSTANCES!="undefined"){
for(var _bce=0;_bce<window.gaRV_INSTANCES.length;_bce++){
if(window.gaRV_INSTANCES[_bce].m_sId==this.getId()){
window.gaRV_INSTANCES.splice(_bce,1);
this.m_destroyed=true;
break;
}
}
}
if(this.m_layoutElements){
for(var i=0;i<this.m_layoutElements.length;i++){
var e=this.m_layoutElements[i];
var j=e.getAttribute("lid");
this.m_layoutElements.splice(i,1);
delete this.m_lidToElement[j];
var _bd2=e.parentNode;
if(_bd2){
_bd2.removeChild(e);
}
}
delete this.m_layoutElements;
delete this.m_lidToElement;
}
if(this.m_oDrillMgr){
this.m_oDrillMgr.setCV(null);
}
var _bd3=this.getSelectionController();
if(_bd3){
GUtil.destroyProperties(_bd3);
}
var cvId=this.getId();
this.m_viewerDispatcher=null;
GUtil.destroyProperties(this,true);
cleanupGlobalObjects(cvId);
}
};
CCognosViewer.prototype.exit=function(){
this.release();
};
CCognosViewer.prototype.executeAction=function(_bd5,_bd6){
var _bd7=this.getAction(_bd5);
_bd7.setRequestParms(_bd6);
return _bd7.execute();
};
CCognosViewer.prototype.getCalculation=function(_bd8){
var calc=null;
var _bda=this.getCalculationCache();
if(_bda[_bd8]){
calc=_bda[_bd8];
}else{
if(window[_bd8]&&typeof window[_bd8]=="function"){
calc=new window[_bd8]();
calc.setCognosViewer(this);
}
_bda[_bd8]=calc;
}
return calc;
};
CCognosViewer.prototype.findBlueDotMenu=function(_bdb){
var root=null;
var _bdd=(_bdb)?_bdb:this.getToolbar();
for(var idx=0;idx<_bdd.length;++idx){
if(typeof _bdd[idx]._root!="undefined"){
root=_bdd[idx]._root;
break;
}
}
return root;
};
CCognosViewer.prototype.findToolbarItem=function(_bdf,_be0){
var spec=typeof _be0=="undefined"||_be0==null?this.getToolbar():_be0;
var _be2=null;
for(var _be3=0;_be3<spec.length;++_be3){
var name=spec[_be3]["name"];
if(typeof name!="undefined"&&name==_bdf){
_be2=spec[_be3];
break;
}
}
return _be2;
};
CCognosViewer.prototype.findToolbarItemIndex=function(_be5,_be6){
var spec=typeof _be6=="undefined"||_be6==null?this.getToolbar():_be6;
var _be8=null;
for(var _be9=0;_be9<spec.length;++_be9){
var name=spec[_be9]["name"];
if(typeof name!="undefined"&&name==_be5){
_be8=_be9;
break;
}
}
return _be8;
};
CCognosViewer.prototype.addedButtonToToolbar=function(_beb,_bec,_bed,_bee){
if(typeof _bec!="undefined"&&_bec!=null){
if(this.findToolbarItem(_bec.name,_beb)==null){
_bed=this.findToolbarItemIndex(_bed,_beb);
if(typeof _bed!="undefined"&&_bed!=null){
_beb.splice(++_bed,0,_bec);
return true;
}else{
if(typeof _bee!="undefined"&&_bee!=null){
_beb.splice(_bee,0,_bec);
return true;
}
}
}
}
return false;
};
CCognosViewer.prototype.addDrillTargets=function(_bef){
this.m_drillTargets=_bef;
};
CCognosViewer.prototype.getDrillTargets=function(){
if(this.m_drillTargets.length==0&&this.envParams["ui.action"]=="view"){
var _bf0=document.getElementById("CVIFrame"+this.getId());
if(typeof _bf0!="undefined"&&_bf0!=null){
if(_bf0.contentWindow.drillTargets){
return _bf0.contentWindow.drillTargets;
}
}
}
return this.m_drillTargets;
};
CCognosViewer.prototype.getDrillTarget=function(idx){
if(idx>=this.m_drillTargets.length){
return null;
}
return this.m_drillTargets[idx];
};
CCognosViewer.prototype.getNumberOfDrillTargets=function(){
return this.m_drillTargets.length;
};
CCognosViewer.prototype.isReportRenderingDone=function(){
return this.m_reportRenderingDone;
};
CCognosViewer.prototype.setReportRenderingDone=function(flag){
this.m_reportRenderingDone=flag;
};
CCognosViewer.prototype.hasAVSChart=function(){
var _bf3=this.getRAPReportInfo();
if(_bf3){
var _bf4=_bf3.getDisplayTypes();
return _bf4.match("_v2")!=null||_bf4.match("v2_")!=null;
}
return false;
};
CCognosViewer.prototype.getPinFreezeManager=function(){
return this.m_pinFreezeManager;
};
CCognosViewer.prototype.getReportContextHelper=function(){
if(!this.m_reportContextHelper){
this.m_reportContextHelper=new ReportContextHelper(this.getSelectionController().getCCDManager());
}
return this.m_reportContextHelper;
};
CCognosViewer.prototype.getRAPReportInfo=function(){
return this.m_RAPReportInfo;
};
CCognosViewer.prototype.setRAPReportInfo=function(_bf5){
this.m_RAPReportInfo=_bf5;
};
CCognosViewer.prototype.isNodeVisible=function(node){
if(this.m_pinFreezeManager){
return this.m_pinFreezeManager.isNodeVisible(node);
}
return true;
};
CCognosViewer.prototype.getWarpRequestForm=function(){
return document.getElementById("formWarpRequest"+this.getId());
};
CCognosViewer.prototype.getBrowser=function(){
return this.sBrowser;
};
CCognosViewer.prototype.repaintDiv=function(oDiv){
var _bf8=oDiv.style.display;
oDiv.style.display="none";
oDiv.style.display=_bf8;
};
CCognosViewer.prototype.isMetadataEmpty=function(){
var oSC=this.getSelectionController();
if(oSC){
var _bfa=oSC.getCCDManager();
if(_bfa){
return _bfa.isMetadataEmpty();
}
}
return true;
};
CCognosViewer.prototype.setContextMenu=function(_bfb){
this.m_contextMenu=_bfb;
};
CCognosViewer.prototype.getContextMenu=function(){
return this.m_contextMenu;
};
CCognosViewer.prototype.setToolbar=function(_bfc){
this.m_toolbar=_bfc;
};
CCognosViewer.prototype.getToolbar=function(){
return this.m_toolbar;
};
CCognosViewer.prototype.getAdvancedServerProperty=function(_bfd){
if(this.m_advancedProperties&&this.m_advancedProperties[_bfd]!==undefined&&this.m_advancedProperties[_bfd]!==null){
return this.m_advancedProperties[_bfd];
}else{
return null;
}
};
CCognosViewer.prototype.hasPrompt=function(){
if(typeof this.m_bHasPrompt==="undefined"||this.m_bHasPrompt===null){
var _bfe=false;
if(this.getAdvancedServerProperty("VIEWER_JS_PROMPT_AGAIN_SHOW_ALWAYS")==="true"||(this.envParams.reportPrompts&&this.envParams.reportPrompts.length>0)){
_bfe=true;
}else{
var _bff=new CParameterValues();
var _c00=XMLBuilderLoadXMLFromString(this.getExecutionParameters());
if(_c00.childNodes.length==1){
_bff.loadWithOptions(_c00.childNodes[0],true);
var _c01=_bff.length();
for(var _c02=0;_c02<_c01;++_c02){
var _c03=_bff.getAt(_c02);
if(_c03!==null&&_c03.length()>0&&_c03.name().indexOf("credential:")!=-1){
_bfe=true;
break;
}
}
}
}
this.m_bHasPrompt=_bfe;
}
return this.m_bHasPrompt;
};
CCognosViewer.prototype.getDrillState=function(){
return this.m_sStateData?this.m_sStateData:"";
};
CCognosViewer.prototype.isSelectionFilterEnabled=function(){
if(typeof this.m_bSelectionFilterSwitch=="undefined"){
this.m_bSelectionFilterSwitch=false;
}
return this.m_bSelectionFilterSwitch;
};
CCognosViewer.prototype.broadcastContextChange=function(evt,_c05){
if(this.getViewerWidget()){
this.getViewerWidget().broadcastContextChange(_c05);
}
stopEventBubble(evt);
};
CCognosViewer.prototype.broadcastParameterChange=function(evt,_c07){
if(this.getViewerWidget()){
this.getViewerWidget().broadcastParameterChange(_c07);
}
stopEventBubble(evt);
};
CCognosViewer.prototype.getReportDiv=function(){
if(!this.m_nReportDiv){
this.m_nReportDiv=document.getElementById("CVReport"+this.m_sId);
}
return this.m_nReportDiv;
};
function CDocumentWriter(sId,_c09){
this.m_sId=sId;
this.m_sText="";
this.m_sScript=_c09;
};
CDocumentWriter.prototype.isValid=function(){
if(typeof this.m_sScript!="undefined"&&this.m_sScript&&window.gScriptLoader){
return true;
}
return false;
};
CDocumentWriter.prototype.execute=function(){
if(this.isValid()&&window.gScriptLoader){
var _c0a=/document\.write(ln)?\s*\(/gi;
var _c0b=this.m_sScript.replace(_c0a,"this.write(").replace(window.gScriptLoader.m_reScriptTagOpen,"").replace(window.gScriptLoader.m_reScriptTagClose,"");
try{
eval(_c0b);
var _c0c=document.getElementById(this.m_sId);
if(_c0c){
_c0c.innerHTML=this.m_sText;
return true;
}
}
catch(e){
}
}
return false;
};
CDocumentWriter.prototype.write=function(_c0d){
var _c0e="";
if(typeof _c0d=="function"){
_c0e=eval(_c0d);
}else{
if(typeof _c0d=="string"){
_c0e=_c0d;
}
}
this.m_sText+=_c0e;
};
function setFocusToFirstTabItem(_c0f){
if(!window.dojo){
return;
}
var _c10=dojo.query("*",_c0f);
var _c11=_c10.length;
for(var i=0;i<_c11;i++){
var node=_c10[i];
if(!node.style||(node.style.display!="none"&&node.style.visibility!="hidden")){
if(node.getAttribute("tabIndex")==0){
try{
node.focus();
}
catch(e){
}
break;
}
}
}
};
function ReportContextHelper(_c14){
this.m_oCDManager=_c14;
};
ReportContextHelper.prototype.destroy=function(){
if(this.m_oCDManager&&this.m_oCDManager.destroy){
this.m_oCDManager.destroy();
}
delete this.m_oCDManager;
};
ReportContextHelper.prototype.processCtx=function(sCtx){
var _c16=sCtx.split("::");
var _c17=[];
for(var i=0;i<_c16.length;++i){
_c17[i]=_c16[i].split(":");
}
if(_c17&&_c17.length&&_c17[0].length){
return _c17;
}else{
return null;
}
};
ReportContextHelper.prototype.getDataItemName=function(sCtx){
var _c1a=this.processCtx(sCtx);
if(_c1a){
return this.getRefDataItem(_c1a[0][0]);
}
return null;
};
ReportContextHelper.prototype.getRefDataItem=function(_c1b){
var _c1c=this.m_oCDManager.GetRDIValue(_c1b);
return (_c1c==null)?"":_c1c;
};
ReportContextHelper.prototype.getMun=function(_c1d){
var aCtx=null;
if(typeof _c1d==="string"){
aCtx=this.processCtx(_c1d);
}else{
if(typeof _c1d==="number"){
aCtx=this.processCtx(_c1d.toString());
}else{
aCtx=_c1d;
}
}
if(aCtx){
var sMun=this.m_oCDManager.GetMUN(aCtx[0][0]);
return (sMun==null)?"":sMun;
}
return "";
};
function ViewerConfig(){
this.uiConfig=new ViewerUIConfig();
this.findConfig=typeof ViewerFindActionConfig=="function"?new ViewerFindActionConfig():null;
this.httpRequestConfig=typeof ViewerHttpRequestConfig=="function"?new ViewerHttpRequestConfig():null;
this.eventsConfig=typeof ViewerEventsConfig=="function"?new ViewerEventsConfig():null;
};
ViewerConfig.prototype.configure=function(_c20){
if(!_c20){
return;
}
if(_c20.findAction&&this.findConfig){
this.findConfig.configure(_c20.findAction);
}
if(_c20.UI){
this.uiConfig.configure(_c20.UI);
}
if(_c20.httpRequestCallbacks&&this.httpRequestConfig){
this.httpRequestConfig.configure(_c20.httpRequestCallbacks);
}
if(_c20.events&&this.eventsConfig){
this.eventsConfig.configure(_c20.events);
}
};
ViewerConfig.prototype.getUIConfig=function(){
return this.uiConfig;
};
ViewerConfig.prototype.getFindActionConfig=function(){
return this.findConfig;
};
ViewerConfig.prototype.getHttpRequestConfig=function(){
return this.httpRequestConfig;
};
ViewerConfig.prototype.getEventsConfig=function(){
return this.eventsConfig;
};
function ViewerUIConfig(){
this.showBanner=true;
this.showToolbar=true;
this.showContextMenu=true;
this.showPageNavigation=true;
this.primarySelectionColor=null;
this.secondarySelectionColor=null;
this.showSecondarySelection=true;
};
ViewerUIConfig.prototype.configure=function(_c21){
applyJSONProperties(this,_c21);
};
ViewerUIConfig.prototype.getShowBanner=function(){
return this.showBanner;
};
ViewerUIConfig.prototype.getShowToolbar=function(){
return this.showToolbar;
};
ViewerUIConfig.prototype.getShowContextMenu=function(){
return this.showContextMenu;
};
ViewerUIConfig.prototype.getShowPageNavigation=function(){
return this.showPageNavigation;
};
ViewerUIConfig.prototype.getPrimarySelectionColor=function(){
return this.primarySelectionColor;
};
ViewerUIConfig.prototype.getSeondarySelectionColor=function(){
return this.secondarySelectionColor;
};
ViewerUIConfig.prototype.getShowSecondarySelection=function(){
return this.showSecondarySelection;
};
function ViewerHttpRequestConfig(){
this.reportStatus={};
this.UI={};
};
ViewerHttpRequestConfig.prototype.configure=function(_c22){
applyJSONProperties(this,_c22);
};
ViewerHttpRequestConfig.prototype.getRequestIndicator=function(){
if(this.UI){
return this.UI.requestIndicator?this.UI.requestIndicator:null;
}
};
ViewerHttpRequestConfig.prototype.getWorkingDialog=function(){
if(this.UI){
return this.UI.workingDialog?this.UI.workingDialog:null;
}
};
ViewerHttpRequestConfig.prototype.getReportStatusCallback=function(_c23){
if(this.reportStatus){
var _c24=this.reportStatus[_c23];
if(_c24){
return _c24;
}
if(_c23=="complete"&&this.reportStatus["initialComplete"]){
var _c25=this.reportStatus["initialComplete"];
this.reportStatus["initialComplete"]=null;
return _c25;
}
}
return null;
};
function ViewerEventsConfig(){
this.showContextMenuOnClick=false;
};
ViewerEventsConfig.prototype.configure=function(_c26){
applyJSONProperties(this,_c26);
};
ViewerEventsConfig.prototype.getShowContextMenuOnClick=function(){
return this.showContextMenuOnClick;
};
function ViewerState(){
this.findState=null;
this.pageState=null;
};
ViewerState.prototype.setFindState=function(_c27){
if(typeof ViewerFindState!="function"){
return;
}
if(!this.findState){
this.findState=new ViewerFindState();
}
this.findState.setState(_c27);
};
ViewerState.prototype.clearFindState=function(){
this.findState=null;
};
ViewerState.prototype.getFindState=function(){
return this.findState;
};
ViewerState.prototype.setPageState=function(_c28){
if(typeof ViewerPageState!="function"){
return;
}
if(!this.pageState){
this.pageState=new ViewerPageState();
}
this.pageState.setState(_c28);
};
ViewerState.prototype.clearPageState=function(){
this.pageState=null;
};
ViewerState.prototype.getPageState=function(){
return this.pageState;
};
function CCDManager(cv){
this.m_cd=null;
this.m_md=null;
this.m_oCV=null;
this.m_dataItemInfo=null;
};
CCDManager.prototype.SetContextData=function(CD){
if(this.m_cd){
this.m_cd=null;
}
this.m_cd=CD;
};
CCDManager.prototype.SetMetadata=function(MD){
if(this.m_md){
this.m_md=null;
}
this.m_md=MD;
};
CCDManager.prototype.AddContextData=function(CD){
if(!this.m_cd){
this.m_cd=CD;
}else{
for(var i in CD){
this.m_cd[i]=CD[i];
}
}
};
CCDManager.prototype.AddMetadata=function(MD){
if(!this.m_md){
this.m_md=MD;
}else{
for(var j in MD){
this.m_md[j]=MD[j];
}
}
};
CCDManager.prototype.getClonedMetadataArray=function(){
var _c30={};
applyJSONProperties(_c30,this.m_md);
return _c30;
};
CCDManager.prototype.getClonedContextdataArray=function(){
var _c31={};
applyJSONProperties(_c31,this.m_cd);
return _c31;
};
CCDManager.prototype.SetCognosViewer=function(_c32){
if(_c32){
this.m_oCV=_c32;
}
};
CCDManager.prototype.onComplete_GetCDRequest=function(_c33,_c34){
if(_c33){
var _c35=_c33.getResult();
var _c36=XMLBuilderLoadXMLFromString(_c35);
if(_c36){
var _c37=_c36.getElementsByTagName("Block");
for(var i=0;i<_c37.length;i++){
var _c39="";
var _c3a=_c37[i].firstChild;
while(_c3a){
_c39+=_c3a.nodeValue;
_c3a=_c3a.nextSibling;
}
var cd=eval("("+_c39+")");
this.AddContextData(cd);
}
}
}
if(_c34&&typeof _c34=="function"){
_c34();
}
};
CCDManager.prototype.FetchContextData=function(_c3c,_c3d){
var _c3e=[];
var c=null,_c40=_c3c.length;
for(var i=0;i<_c40;++i){
c=_c3c[i];
if(c!=""&&!this.ContextIdExists(c)){
_c3e.push(c);
}
}
if(_c3e.length){
if(this.m_oCV){
this.getContextData(_c3e,_c3d);
}
}
return _c3e.length;
};
CCDManager.prototype.getContextData=function(_c42,_c43){
var oCV=this.m_oCV;
var _c45=new AsynchDataDispatcherEntry(oCV);
_c45.setCanBeQueued(false);
if(!oCV.isBux){
_c45.forceSynchronous();
}
var form=document["formWarpRequest"+oCV.getId()];
var _c47=oCV.getConversation();
var _c48=oCV.getTracking();
if(!_c48&&form&&form["m_tracking"]&&form["m_tracking"].value){
_c48=form["m_tracking"].value;
}
if(oCV.m_viewerFragment){
var _c49=oCV.getActiveRequest();
if(_c49&&_c49.getFormField("m_tracking")==_c48){
return;
}
}
var _c4a={customArguments:[_c43],"complete":{"object":this,"method":this.onComplete_GetCDRequest}};
if(oCV.getStatus()=="prompting"){
_c4a["prompting"]={"object":this,"method":this.onComplete_GetCDRequest};
}
_c45.setCallbacks(_c4a);
if(_c47&&oCV.envParams["ui.action"]!="view"){
_c45.addFormField("ui.action","getContext");
_c45.addFormField("ui.conversation",_c47);
}else{
var _c4b=form["ui.object"];
if(typeof _c4b.length!="undefined"&&_c4b.length>1){
_c45.addFormField("ui.object",form["ui.object"][0].value);
}else{
_c45.addFormField("ui.object",form["ui.object"].value);
}
_c45.addFormField("ui.action","getObjectContext");
}
_c45.addFormField("cv.responseFormat","asynchDetailContext");
_c45.addFormField("context.format","initializer");
_c45.addFormField("context.type","reportService");
_c45.addFormField("context.selection",_c42.join(","));
_c45.addNonEmptyStringFormField("m_tracking",_c48);
oCV.dispatchRequest(_c45);
};
CCDManager.prototype.ContextIdExists=function(_c4c){
return (this.m_cd&&this.m_cd[_c4c]?true:false);
};
CCDManager.prototype.HasContextData=function(){
return (this.m_cd?true:false);
};
CCDManager.prototype.HasMetadata=function(){
return (this.m_md?true:false);
};
CCDManager.prototype._getMDPropertyFromCD=function(_c4d,_c4e,_c4f){
var p=null;
this.FetchContextData([_c4d]);
var cd=this.m_cd&&this.m_cd[_c4d];
if(cd){
var md=this.m_md[cd[_c4e]];
if(md){
p=md[_c4f];
}
}
return p;
};
CCDManager.prototype.GetDrillFlag=function(_c53){
return this._getMDPropertyFromCD(_c53,"r","drill");
};
CCDManager.prototype.getModelPathFromBookletItem=function(_c54){
var mp=null;
var md=this.m_md[_c54];
if(md){
mp=md.mp;
if(mp&&this.m_md[mp]){
mp=this.m_md[mp].mp;
}
}
return mp?mp:null;
};
CCDManager.prototype.GetBookletModelBasedDrillThru=function(_c57){
var p=null;
var md=this.m_md[_c57];
if(md){
p=md.modelBasedDrillThru;
}
return p?p:0;
};
CCDManager.prototype.GetDrillFlagForMember=function(_c5a){
var _c5b=null;
var d=this._getMDPropertyFromCD(_c5a,"r","drill");
if(d!==null&&this.m_cd[_c5a].m){
_c5b=d;
}
return _c5b;
};
CCDManager.prototype.GetDataType=function(_c5d){
return this._getMDPropertyFromCD(_c5d,"r","dtype");
};
CCDManager.prototype.GetUsage=function(_c5e){
return this._getMDPropertyFromCD(_c5e,"r","usage");
};
CCDManager.prototype.GetHUN=function(_c5f){
var hun=this._getMDPropertyFromCD(_c5f,"h","h");
if(!hun){
var h=this._getMDPropertyFromCD(_c5f,"r","h");
if(h){
hun=this.m_md[h].h;
}
}
if(hun!=null&&hun.indexOf("[__ns_")==0){
hun=null;
}
return hun;
};
CCDManager.prototype.GetQuery=function(_c62){
var qry=null;
var q=this._getMDPropertyFromCD(_c62,"r","q");
if(q){
qry=this.m_md[q].q;
}
return qry;
};
CCDManager.prototype.GetDepth=function(_c65){
return this._getMDPropertyFromCD(_c65,"r","level");
};
CCDManager.prototype.GetDisplayValue=function(_c66){
var _c67=null;
this.FetchContextData([_c66]);
if(this.ContextIdExists(_c66)&&this.m_cd[_c66]){
_c67=this.m_cd[_c66].u;
}
return _c67;
};
CCDManager.prototype.GetPUN=function(_c68){
return this._getMDPropertyFromCD(_c68,"p","p");
};
CCDManager.prototype.GetLUN=function(_c69){
return this._getMDPropertyFromCD(_c69,"l","l");
};
CCDManager.prototype.GetMUN=function(_c6a){
return this._getMDPropertyFromCD(_c6a,"m","m");
};
CCDManager.prototype.GetDUN=function(_c6b){
return this._getMDPropertyFromCD(_c6b,"d","d");
};
CCDManager.prototype.GetQMID=function(_c6c){
return this._getMDPropertyFromCD(_c6c,"i","i");
};
CCDManager.prototype.GetRDIValue=function(_c6d){
return this._getMDPropertyFromCD(_c6d,"r","r");
};
CCDManager.prototype.GetBIValue=function(_c6e){
return this._getMDPropertyFromCD(_c6e,"r","bi");
};
CCDManager.prototype.getContextIdForMetaData=function(lun,hun,_c71){
var _c72=[{"expression":lun,"type":"l"},{"expression":hun,"type":"h"}];
for(var _c73=0;_c73<_c72.length;++_c73){
var _c74=_c72[_c73].expression;
var _c75=_c72[_c73].type;
if(_c74==""){
continue;
}
for(var _c76 in this.m_md){
if(this.m_md[_c76][_c75]==_c74){
for(var _c77 in this.m_md){
if(this.m_md[_c77].r&&this.m_md[_c77][_c75]==_c76){
if(this.m_md[_c77].drill!=0||_c71==true){
for(var ctx in this.m_cd){
if(this.m_cd[ctx].r==_c77&&this.m_cd[ctx].m){
return ctx;
}
}
}
}
}
}
}
}
return "";
};
CCDManager.prototype.GetContextIdForMUN=function(mun){
var _c7a=null;
var _c7b=null;
for(var i in this.m_md){
if(this.m_md[i].m==mun){
_c7a=i;
break;
}
}
if(_c7a!=null){
for(var j in this.m_cd){
if(this.m_cd[j].m==_c7a){
_c7b=j;
break;
}
}
}
return _c7b;
};
CCDManager.prototype.GetContextIdsForRDI=function(rdi){
var _c7f=[];
for(var i in this.m_md){
if(this.m_md[i].r==rdi){
_c7f.push(i);
}
}
return _c7f;
};
CCDManager.prototype.getMUNForRDIAndUseValue=function(rdi,_c82){
var _c83=this.GetContextIdsForRDI(rdi);
for(var i in this.m_cd){
for(var j in _c83){
if(this.m_cd[i].r==_c83[j]&&this.m_cd[i].u==_c82){
var _c86=this.m_cd[i].m;
if(_c86){
return this.m_md[_c86].m;
}
}
}
}
return null;
};
CCDManager.prototype.GetPageMinMaxForRDI=function(rdi){
var _c88=null;
var _c89=null;
var _c8a=this.GetContextIdsForRDI(rdi);
this.FetchContextData([0]);
for(var i in this.m_cd){
for(var j in _c8a){
if(this.m_cd[i].r==_c8a[j]){
var _c8d=parseFloat(this.m_cd[i].u);
if(_c8d==this.m_cd[i].u){
if(_c88==null||_c8d<_c88){
_c88=_c8d;
}
if(_c89==null||_c8d>_c89){
_c89=_c8d;
}
}
}
}
}
if(_c88!=null&&_c89!=null){
return eval("({ pageMin: "+_c88+", pageMax: "+_c89+"})");
}
};
CCDManager.prototype.GetContextIdForDisplayValue=function(_c8e){
var _c8f=null;
for(var i in this.m_cd){
if(this.m_cd[i].u==_c8e){
_c8f=i;
break;
}
}
return _c8f;
};
CCDManager.prototype.GetContextIdForUseValue=function(_c91){
var _c92=null;
var _c93=null;
var _c94=null;
for(var i in this.m_md){
var md=this.m_md[i];
for(var j in md){
if(md[j]==_c91){
_c92=i;
_c93=j;
break;
}
}
}
if(_c92!=null){
for(var k in this.m_cd){
if(this.m_cd[k][_c93]==_c92){
_c94=k;
break;
}
}
}
return _c94;
};
CCDManager.prototype.getDataItemInfo=function(){
if(this.m_cd){
var _c99={};
this.m_dataItemInfo={};
for(var i in this.m_cd){
var _c9b=this.m_cd[i].r;
if(typeof _c9b!="undefined"){
var _c9c=this.m_md[_c9b].r;
if(this.m_dataItemInfo[_c9c]==null){
this.m_dataItemInfo[_c9c]=1;
}else{
this.m_dataItemInfo[_c9c]++;
}
}
}
return CViewerCommon.toJSON(this.m_dataItemInfo);
}
return "";
};
CCDManager.prototype.DataItemInfoToJSON=function(){
return this.getDataItemInfo();
};
CCDManager.prototype.MetadataToJSON=function(){
if(this.m_md){
return CViewerCommon.toJSON(this.m_md);
}
return "";
};
CCDManager.prototype.ContextDataToJSON=function(){
if(this.m_cd){
return CViewerCommon.toJSON(this.m_cd);
}
return "";
};
CCDManager.prototype.ContextDataSubsetToJSON=function(_c9d){
if(_c9d<=0){
return this.ContextDataToJSON();
}
if(this.m_cd){
var _c9e={};
var _c9f={};
for(var i in this.m_cd){
var _ca1=this.m_cd[i].r;
if(typeof _ca1!="undefined"){
if(_c9e[_ca1]==null){
_c9e[_ca1]=0;
}else{
_c9e[_ca1]++;
}
if(_c9e[_ca1]<_c9d){
_c9f[i]=this.m_cd[i];
}
}
}
return CViewerCommon.toJSON(_c9f);
}
return "";
};
CCDManager.prototype.GetHUNForRDI=function(rdi,_ca3){
for(var i in this.m_md){
if(this.m_md[i].r==rdi&&this.m_md[i].q==_ca3){
var _ca5=this.m_md[i].h;
if(_ca5){
return this.m_md[_ca5].h;
}
}
}
return null;
};
CCDManager.prototype.GetMetadataIdForQueryName=function(_ca6){
for(var i in this.m_md){
if(this.m_md[i].q===_ca6){
return i;
}
}
return null;
};
CCDManager.prototype._isEmptyObject=function(obj){
for(var _ca9 in obj){
return false;
}
return true;
};
CCDManager.prototype.isMetadataEmpty=function(){
if(this.m_md){
return this._isEmptyObject(this.m_md);
}
return true;
};
CCDManager.prototype.GetBestPossibleItemName=function(_caa){
var item=this.m_cd[_caa];
if(!item){
return null;
}
if(item.l&&this.m_md[item.l].l){
return this._getStringInLastBracket(this.m_md[item.l].l);
}
if(item.r&&this.m_md[item.r].r){
return this._getStringInLastBracket(this.m_md[item.r].r);
}
if(item.h&&this.m_md[item.h].h){
return this._getStringInLastBracket(this.m_md[item.h].h);
}
if(item.i&&this.m_md[item.i].i){
return this._getStringInLastBracket(this.m_md[item.i].i);
}
return null;
};
CCDManager.prototype.GetBestPossibleDimensionMeasureName=function(_cac){
var item=this.m_cd[_cac];
if(item&&item.m&&this.m_md[item.m]&&this.m_md[item.m].m){
return this._getStringInLastBracket(this.m_md[item.m].m);
}
return null;
};
CCDManager.prototype._getStringInLastBracket=function(str){
if(str&&str.indexOf("].[")>0){
var _caf=str.split("].[");
var _cb0=_caf[_caf.length-1];
return _cb0.substring(0,_cb0.length-1);
}
return str;
};
CCDManager.prototype._replaceNamespaceForSharedTM1DimensionOnly=function(_cb1){
var _cb2=this._getNamespaceAndDimensionFromUniqueName(_cb1);
if(_cb2&&this.m_md){
for(var _cb3 in this.m_md){
var sMun=this.m_md[_cb3].m;
if(sMun&&sMun.length>0){
if(sMun.indexOf("->:[TM].")>0){
var oObj=this._getNamespaceAndDimensionFromUniqueName(sMun);
if(oObj.dimension&&oObj.dimension===_cb2.dimension&&oObj.namespace!==_cb2.namespace){
var _cb6=_cb1.indexOf(".");
return oObj.namespace+_cb1.substr(_cb6,_cb1.length);
}
}else{
var _cb7=sMun.indexOf("->:[");
if(_cb7>0){
if(sMun.substr(_cb7+4,4)!=="TM]."){
return _cb1;
}
}
}
}
}
}
return _cb1;
};
CCDManager.prototype._getNamespaceAndDimensionFromUniqueName=function(_cb8){
if(_cb8&&_cb8.length>0&&_cb8.indexOf("].[")>0){
var _cb9=_cb8.split("].[");
if(_cb9.length>1){
return {"namespace":_cb9[0]+"]","dimension":"["+_cb9[1]+"]"};
}
}
return null;
};
CCDManager.prototype.destroy=function(){
delete this.m_cd;
delete this.m_md;
delete this.m_oCV;
delete this.m_dataItemInfo;
};
function CSelectionXml(_cba,_cbb,_cbc){
this.queries={};
this.burstContext=_cba||"";
this.expressionLocale=_cbb||"";
this.contentLocale=_cbc||"";
};
function SC_SingleSelection(){
this.rows=[];
this.cols=[];
this.sections=[];
this.measures=[];
this.layoutElementId="";
};
function SC_SingleQuery(){
this.selections=[];
this.slicers=[];
this.filters=[];
};
function SC_SingleSlicer(){
};
function SC_SingleDetailFilter(){
};
function SC_SingleSummaryFilter(){
};
CSelectionXml.prototype.BuildSelectionFromController=function(sc){
if(sc){
var _cbe=sc.getAllSelectedObjects();
for(var s=0;s<_cbe.length;++s){
var _cc0=_cbe[s];
var _cc1=_cc0.getSelectedContextIds();
var muns=_cc0.getMuns();
var _cc3=muns.length;
var _cc4=new SC_SingleSelection();
_cc4.layoutElementId=_cc0.getLayoutElementId();
var _cc5=null;
for(var i=0;i<_cc3;++i){
var j,_cc8,_cc9;
if(i===0&&_cc3===1){
for(j=0;j<muns[i].length;++j){
_cc8=_cc1[i][j];
if(_cc8!=0){
if(j===0){
_cc5=sc.getRefQuery(_cc8);
_cc9=_cc0.getDisplayValues()[j];
this._buildMeasureSelection(sc,_cc8,_cc4.measures,_cc9,j,_cc0.getLayoutType());
}else{
if(sc.getUsageInfo(_cc8)!=2){
this._buildEdgeSelection(sc,_cc8,_cc4.cols,j);
}
}
}
}
}else{
for(j=0;j<muns[i].length;++j){
_cc8=_cc1[i][j];
if(_cc8!=0){
if(i===0){
_cc9=_cc0.getDisplayValues()[j];
_cc5=sc.getRefQuery(_cc8);
this._buildMeasureSelection(sc,_cc8,_cc4.measures,_cc9,j,_cc0.getLayoutType());
}else{
if(i===1){
this._buildEdgeSelection(sc,_cc8,_cc4.rows,j);
}else{
if(i===2){
this._buildEdgeSelection(sc,_cc8,_cc4.cols,j);
}else{
this._buildSectionSelection(sc,_cc8,_cc4.sections,j);
}
}
}
}
}
}
}
this.AddSelection(_cc5,_cc4);
}
}
};
CSelectionXml.prototype.AddSelection=function(_cca,_ccb){
if(!this.queries[_cca]){
this.queries[_cca]=new SC_SingleQuery();
}
this.queries[_cca].selections.push(_ccb);
};
CSelectionXml.prototype._buildMeasureSelection=function(sc,_ccd,_cce,_ccf,idx,_cd1){
if(_cd1==""||_cd1==null){
_cd1="datavalue";
}
if(_ccd){
_cce.push({name:sc.getRefDataItem(_ccd),values:[{use:sc.getUseValue(_ccd),display:_ccf}],order:idx,hun:sc.getHun(_ccd),dataType:_cd1,usage:sc.getUsageInfo(_ccd),dtype:sc.getDataType(_ccd),selection:"true"});
}
};
CSelectionXml.prototype._buildEdgeSelection=function(sc,_cd3,_cd4,idx){
if(_cd3){
_cd4.push({name:sc.getRefDataItem(_cd3),values:[{use:this.getUseValue(sc,_cd3),display:sc.getDisplayValue(_cd3)}],order:idx,lun:sc.getLun(_cd3),hun:sc.getHun(_cd3),dataType:"columnTitle",usage:sc.getUsageInfo(_cd3),dtype:sc.getDataType(_cd3)});
}
};
CSelectionXml.prototype._buildSectionSelection=function(sc,_cd7,_cd8,idx){
if(_cd7){
_cd8.push({name:sc.getRefDataItem(_cd7),values:[{use:this.getUseValue(sc,_cd7),display:sc.getDisplayValue(_cd7)}],order:idx,lun:sc.getLun(_cd7),hun:sc.getHun(_cd7),dataType:"section",usage:sc.getUsageInfo(_cd7),dtype:sc.getDataType(_cd7),queryRef:sc.getRefQuery(_cd7)});
}
};
CSelectionXml.prototype.getUseValue=function(sc,_cdb){
var _cdc=sc.getMun(_cdb);
if(_cdc==""){
_cdc=sc.getUseValue(_cdb);
}
return _cdc;
};
CSelectionXml.prototype.toXml=function(){
var _cdd=XMLBuilderCreateXMLDocument("selections");
var _cde=_cdd.documentElement;
XMLBuilderSetAttributeNodeNS(_cde,"xmlns:xs","http://www.w3.org/2001/XMLSchema");
XMLBuilderSetAttributeNodeNS(_cde,"xmlns:bus","http://developer.cognos.com/schemas/bibus/3/");
XMLBuilderSetAttributeNodeNS(_cde,"SOAP-ENC:arrayType","bus:parameterValue[]","http://schemas.xmlsoap.org/soap/encoding/");
XMLBuilderSetAttributeNodeNS(_cde,"xmlns:xsd","http://www.w3.org/2001/XMLSchema");
XMLBuilderSetAttributeNodeNS(_cde,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
_cde.setAttribute("contentLocale",this.contentLocale);
_cde.setAttribute("expressionLocale",this.expressionLocale);
for(var q in this.queries){
this._queryToXml(_cde,q,this.queries[q]);
}
this._burstToXml(_cde);
return XMLBuilderSerializeNode(_cdd);
};
CSelectionXml.prototype._queryToXml=function(_ce0,name,obj){
var _ce3=_ce0.ownerDocument.createElement("query");
_ce3.setAttribute("name",name);
for(var _ce4=0;_ce4<obj.selections.length;++_ce4){
this._selectionToXml(_ce3,obj.selections[_ce4]);
}
for(var _ce5=0;_ce5<obj.slicers.length;++_ce5){
this._slicersToXml(_ce3,obj.slicers[_ce5]);
}
for(var _ce6=0;_ce6<obj.selections.length;++_ce6){
this._filtersToXml(_ce3,obj.selections[_ce6]);
}
_ce0.appendChild(_ce3);
};
CSelectionXml.prototype._selectionToXml=function(_ce7,_ce8){
var doc=_ce7.ownerDocument;
var _cea=doc.createElement("selection");
_ce7.appendChild(_cea);
this._edgeToXml(_cea,"row",_ce8.rows);
this._edgeToXml(_cea,"column",_ce8.cols);
this._edgeToXml(_cea,"measure",_ce8.measures);
this._edgeToXml(_cea,"section",_ce8.sections);
var _ceb=doc.createElement("layoutElementId");
_ceb.appendChild(doc.createTextNode(_ce8.layoutElementId));
_cea.appendChild(_ceb);
};
CSelectionXml.prototype._edgeToXml=function(_cec,_ced,_cee){
var doc=_cec.ownerDocument;
var _cf0=doc.createElement(_ced+"s");
_cec.appendChild(_cf0);
for(var i=0;i<_cee.length;++i){
var _cf2=doc.createElement(_ced);
_cf0.appendChild(_cf2);
var edge=_cee[i];
for(var j in edge){
if(j!=="name"&&j!=="values"){
_cf2.setAttribute(j,edge[j]!==null?edge[j]:"");
}
}
this._itemToXml(_cf2,edge.name,edge.values);
}
};
CSelectionXml.prototype._itemToXml=function(_cf5,name,_cf7){
var doc=_cf5.ownerDocument;
var _cf9=doc.createElement("item");
XMLBuilderSetAttributeNodeNS(_cf9,"xsi:type","bus:parameterValue","http://www.w3.org/2001/XMLSchema-instance");
var _cfa=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:name",doc);
XMLBuilderSetAttributeNodeNS(_cfa,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
_cfa.appendChild(doc.createTextNode(name));
_cf9.appendChild(_cfa);
var _cfb=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:value",doc);
XMLBuilderSetAttributeNodeNS(_cfb,"xsi:type","SOAP-ENC:Array","http://www.w3.org/2001/XMLSchema-instance");
XMLBuilderSetAttributeNodeNS(_cfb,"SOAP-ENC:arrayType","bus:parmValueItem[]","http://schemas.xmlsoap.org/soap/encoding/");
_cf9.appendChild(_cfb);
for(var j=0;j<_cf7.length;j++){
var _cfd=doc.createElement("item");
XMLBuilderSetAttributeNodeNS(_cfd,"xsi:type","bus:simpleParmValueItem","http://www.w3.org/2001/XMLSchema-instance");
var _cfe=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:use",doc);
XMLBuilderSetAttributeNodeNS(_cfe,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
if(_cf7[j].use){
_cfe.appendChild(doc.createTextNode(_cf7[j].use));
}else{
if(_cf7[j].display){
_cfe.appendChild(doc.createTextNode(_cf7[j].display));
}else{
_cfe.appendChild(doc.createTextNode(""));
}
}
var _cff=XMLBuilderCreateElementNS("http://developer.cognos.com/schemas/bibus/3/","bus:display",doc);
XMLBuilderSetAttributeNodeNS(_cff,"xsi:type","xs:string","http://www.w3.org/2001/XMLSchema-instance");
if(_cf7[j].display){
_cff.appendChild(doc.createTextNode(_cf7[j].display));
}else{
_cff.appendChild(doc.createTextNode(""));
}
_cfd.appendChild(_cfe);
_cfd.appendChild(_cff);
_cfb.appendChild(_cfd);
}
_cf5.appendChild(_cf9);
};
CSelectionXml.prototype._burstToXml=function(_d00){
var doc=_d00.ownerDocument;
var _d02=doc.createElement("burst-context");
_d02.appendChild(doc.createTextNode(this.burstContext));
_d00.appendChild(_d02);
};
CSelectionXml.prototype._slicersToXml=function(_d03,_d04){
};
CSelectionXml.prototype._filtersToXml=function(_d05,_d06){
};
CSubscriptionManager.k_SubscriptionWizardName="subscriptionWizard";
function CSubscriptionManager(cv){
this.m_cv=cv;
this.m_bInitialized=false;
this.m_aWatchRules=null;
this.m_sEmail="";
this.m_sAlertNewVersionConfirm="";
this.m_sQueryNotificationResponse="";
this.m_bAllowNotification=false;
this.m_bAllowSubscription=false;
this.m_bCanCreateNewWatchRule=false;
this.m_bCanGetNotified=false;
this.m_bAllowAnnotations=false;
this.m_bCanCreateAnnotations=false;
this.m_windowOptions="width=450,height=350,toolbar=0,location=0,status=0,menubar=0,resizable,scrollbars=1";
};
CSubscriptionManager.prototype.getViewer=function(){
return this.m_cv;
};
CSubscriptionManager.prototype.Initialize=function(_d08){
try{
var _d09=_d08.getJSONResponseObject();
var _d0a=document.forms["formWarpRequest"+this.m_cv.getId()];
if(_d09["annotationInfo"]){
var _d0b=_d09["annotationInfo"];
this.m_AnnotationsCount=_d0b.annotations.length;
this.m_annotations=_d0b.annotations;
this.m_bAllowAnnotations=_d0b.allowAnnotations;
this.m_bCanCreateAnnotations=_d0b.traverse=="true";
return true;
}
if(_d09["subscriptionInfo"]){
var _d0c=_d09["subscriptionInfo"];
if(!this.m_bInitialized){
this.m_sEmail=_d0c.sEmail;
this.m_bAllowNotification=_d0c.bAllowNotification;
this.m_bAllowSubscription=_d0c.bAllowSubscription;
this.m_sAlertNewVersionConfirm=_d0c.sAlertNewVersionConfirm;
if(_d0a["ui.action"]&&_d0a["ui.action"].value=="view"){
if(_d0a["ui.format"]){
this.m_bCanCreateNewWatchRule=(_d0a["ui.format"].value=="HTML")&&this.m_cv.bCanUseCognosViewerConditionalSubscriptions&&this.m_bAllowSubscription;
}
this.m_bCanGetNotified=(!_d0a["ui.burstKey"]||(_d0a["ui.burstKey"]&&_d0a["ui.burstKey"].value==""))&&this.m_bAllowNotification;
}
}
if(_d0c.sQueryNotificationResponse){
this.m_sQueryNotificationResponse=_d0c.sQueryNotificationResponse;
}
if(_d0c.aWatchRules){
var _d0d=_d0c.aWatchRules;
this.m_aWatchRules=[];
for(var i=0;i<_d0d.length;i++){
this.m_aWatchRules.push(_d0d[i]);
}
}
this.m_bInitialized=true;
return true;
}
}
catch(exception){
return false;
}
return false;
};
CSubscriptionManager.prototype.IsValidSelectionForNewRule=function(){
var _d0f=this.m_cv.getSelectionController();
if(_d0f&&!_d0f.hasSelectedChartNodes()){
var _d10=_d0f.getAllSelectedObjects();
if(_d10.length===1){
if(_d10[0]!=null&&_d10[0].getLayoutType()!="columnTitle"){
return true;
}
}
}
return false;
};
CSubscriptionManager.prototype.CanCreateNewWatchRule=function(){
if(typeof this.m_cv.UIBlacklist!="undefined"&&this.m_cv.UIBlacklist.indexOf(" RV_TOOLBAR_BUTTONS_ALERT_USING_NEW_WATCH_RULE ")!=-1){
return false;
}
if(!this.m_bInitialized&&this.getViewer().envParams["ui.action"]=="view"){
var oCV=this.getViewer();
var _d12=new JSONDispatcherEntry(oCV);
_d12.setKey("subscriptionManager");
_d12.forceSynchronous();
_d12.addFormField("ui.action","getSubscriptionInfo");
_d12.addFormField("cv.responseFormat","subscriptionManager");
_d12.addFormField("contextMenu","true");
this.addCommonFormFields(_d12);
_d12.setCallbacks({"complete":{"object":this,"method":this.Initialize}});
oCV.dispatchRequest(_d12);
}
return this.m_bCanCreateNewWatchRule;
};
CSubscriptionManager.prototype.CanModifyWatchRule=function(){
return this.m_cv.bCanUseCognosViewerConditionalSubscriptions&&this.m_bAllowSubscription;
};
CSubscriptionManager.prototype.CanGetNotified=function(){
if(typeof this.m_cv.UIBlacklist!="undefined"&&this.m_cv.UIBlacklist.indexOf(" RV_TOOLBAR_BUTTONS_ALERT_ABOUT_NEW_VERSIONS ")!=-1){
return false;
}
return this.m_bCanGetNotified;
};
CSubscriptionManager.prototype.UpdateSubscribeMenu=function(){
var _d13=this.getStandaloneViewerToolbarControl();
var _d14=_d13?_d13.getItem("watchNewVersions"):null;
var _d15=this.m_cv.getWebContentRoot();
var _d16=this.m_cv.getSkin();
if(_d14){
var _d17=_d14.getMenu();
this.ClearSubscriptionMenu();
var _d18=false;
if(this.CanGetNotified()){
if(this.m_sQueryNotificationResponse=="on"){
new CMenuItem(_d17,RV_RES.RV_DO_NOT_ALERT_NEW_VERSION,"javascript:"+this.m_cv.getObjectId()+".getSubscriptionManager().DeleteNotification();",_d15+"/rv/images/action_remove_from_list.gif",gMenuItemStyle,_d15,_d16);
_d18=true;
}else{
if(this.m_sQueryNotificationResponse=="off"&&this.m_sEmail!=""){
new CMenuItem(_d17,RV_RES.RV_ALERT_NEW_VERSION,"javascript:"+this.m_cv.getObjectId()+".getSubscriptionManager().AddNotification();",_d15+"/rv/images/action_add_to_list.gif",gMenuItemStyle,_d15,_d16);
_d18=true;
}
}
}
if(this.CanCreateNewWatchRule()){
if(_d18){
_d17.add(gMenuSeperator);
}
var _d19=new CMenuItem(_d17,RV_RES.RV_NEW_WATCH_RULE,"javascript:"+this.m_cv.getObjectId()+".getSubscriptionManager().NewSubscription();",_d15+"/rv/images/action_new_subscription.gif",gMenuItemStyle,_d15,_d16);
if(!this.IsValidSelectionForNewRule()){
_d19.disable();
}
_d18=true;
}
var _d1a="";
if(typeof this.m_cv.UIBlacklist!="undefined"){
_d1a=this.m_cv.UIBlacklist;
}
var _d1b;
if(_d1a.indexOf(" RV_TOOLBAR_BUTTONS_RULES ")==-1){
if(_d18){
_d17.add(gMenuSeperator);
}
if(this.m_aWatchRules&&this.m_aWatchRules.length>0){
var _d1c=this.CanModifyWatchRule();
for(var sub=0;sub<this.m_aWatchRules.length;++sub){
var menu=new CMenuItem(_d17,this.m_aWatchRules[sub].name,"",_d15+"/rv/images/icon_subscription.gif",gMenuItemStyle,_d15,_d16);
var _d1f=menu.createCascadedMenu(gMenuStyle);
_d1f.m_oCV=this.m_cv;
if(_d1c&&_d1a.indexOf(" RV_TOOLBAR_BUTTONS_RULES_MODIFY ")==-1){
new CMenuItem(_d1f,RV_RES.RV_MODIFY_WATCH_RULE,this.m_cv.getObjectId()+".getSubscriptionManager().ModifySubscription("+sub+");",_d15+"/rv/images/action_edit.gif",gMenuItemStyle,_d15,_d16);
}
if(_d1a.indexOf(" RV_TOOLBAR_BUTTONS_RULES_DELETE ")==-1){
new CMenuItem(_d1f,RV_RES.RV_DELETE_WATCH_RULE,this.m_cv.getObjectId()+".getSubscriptionManager().DeleteSubscription("+sub+");",_d15+"/rv/images/action_delete.gif",gMenuItemStyle,_d15,_d16);
}
}
}else{
_d1b=new CMenuItem(_d17,RV_RES.RV_NO_WATCH_RULES,"","",gMenuItemStyle,_d15,_d16);
_d1b.disable();
}
}
if(_d17.getNumItems()==0){
_d1b=new CMenuItem(_d17,RV_RES.RV_NO_WATCH_RULES,"","",gMenuItemStyle,_d15,_d16);
_d1b.disable();
}
_d17.setForceCallback(false);
_d17.draw();
if(_d17.isVisible()){
_d17.show();
}
_d17.setForceCallback(true);
}
};
CSubscriptionManager.prototype.UpdateAnnotationMenu=function(){
var _d20=this.getStandaloneViewerToolbarControl();
var _d21=_d20?_d20.getItem("addAnnotations"):null;
var _d22=this.m_cv.getWebContentRoot();
var _d23=this.m_cv.getSkin();
var _d24=_d21.getMenu();
this.ClearAnnotationMenu();
var menu=new CMenuItem(_d24,RV_RES.RV_NEW_COMMENT,"javascript:"+this.m_cv.getObjectId()+".getSubscriptionManager().NewAnnotation();",_d22+"/rv/images/action_comment_add.gif",gMenuItemStyle,_d22,_d23);
var _d26=this.m_annotations.length;
if(_d26>0){
_d24.add(gMenuSeperator);
}
if(!this.m_bAllowAnnotations||!this.m_bCanCreateAnnotations){
menu.disable();
}
var _d27;
var bidi=isViewerBidiEnabled()?BidiUtils.getInstance():null;
for(var i=0;i<_d26;i++){
var _d2a=this.m_annotations[i].defaultName;
_d27=_d2a.length>60?_d2a.substring(0,60)+"...":_d2a;
if(isViewerBidiEnabled()){
_d27=bidi.btdInjectUCCIntoStr(_d27,getViewerBaseTextDirection());
}
var _d2b=Boolean(this.m_annotations[i].permissions.read);
var _d2c=Boolean(this.m_annotations[i].permissions.write);
var _d2d=Boolean(this.m_annotations[i].permissions.traverse)&&Boolean(this.m_annotations[i].permissions.write);
var _d2e="javascript:"+this.m_cv.getObjectId()+".getSubscriptionManager().ViewAnnotation("+i+");";
var _d2f="javascript:alert('Permission denied')";
_d2e=_d2b?_d2e:_d2f;
if(i>0&&this.m_annotations[i].layoutElementId!=this.m_annotations[i-1].layoutElementId){
_d24.add(gMenuSeperator);
}
var _d30="/rv/images/action_comment.gif";
if(this.m_annotations[i].layoutElementId!=""){
_d30="/rv/images/action_subscribe.gif";
}
menu=new CMenuItem(_d24,_d27,_d2e,_d22+_d30,gMenuItemStyle,_d22,_d23);
var _d31=menu.createCascadedMenu(gMenuStyle);
var _d32=new CInfoPanel("300px",_d22,_d31.getId()+"_comments");
_d32.setParent(_d31);
_d2a=this.m_annotations[i].defaultName;
var _d33=_d2a.length>60?_d2a.substring(0,60)+"...":_d2a;
if(isViewerBidiEnabled()){
_d33=bidi.btdInjectUCCIntoStr(_d33,getViewerBaseTextDirection());
}
_d32.addProperty(RV_RES.RV_VIEW_COMMENT_NAME,html_encode(_d33));
_d32.addSpacer(4);
var cmnt=this.m_annotations[i].description;
var _d35=cmnt.length>590?cmnt.substring(0,590)+"...":cmnt;
if(isViewerBidiEnabled()){
_d35=bidi.btdInjectUCCIntoStr(_d35,getViewerBaseTextDirection());
}
_d32.addProperty(RV_RES.RV_VIEW_COMMENT_CONTENTS,replaceNewLine(html_encode(_d35)));
_d32.addSpacer(4);
var _d36=this.m_annotations[i].modificationTime;
if(isViewerBidiEnabled()){
_d36=bidi.btdInjectUCCIntoStr(_d36,getViewerBaseTextDirection());
}
_d32.addProperty(RV_RES.RV_VIEW_COMMENT_MODTIME,_d36);
var _d37=this.m_annotations[i].owner.defaultName;
if(isViewerBidiEnabled()){
_d37=bidi.btdInjectUCCIntoStr(_d37,getViewerBaseTextDirection());
}
_d32.addProperty(RV_RES.RV_VIEW_COMMENT_OWNER,_d37);
_d31.add(_d32);
if(_d2c||_d2d){
_d31.add(gMenuSeperator);
}
new CMenuItem(_d31,RV_RES.RV_VIEW_COMMENT,this.m_cv.getObjectId()+".getSubscriptionManager().ViewAnnotation("+i+");",_d22+"/rv/images/action_comment_view.gif",gMenuItemStyle,_d22,_d23);
if(_d2c){
new CMenuItem(_d31,RV_RES.RV_MODIFY_WATCH_RULE,this.m_cv.getObjectId()+".getSubscriptionManager().ModifyAnnotation("+i+");",_d22+"/rv/images/action_comment_modify.gif",gMenuItemStyle,_d22,_d23);
}
if(_d2d){
new CMenuItem(_d31,RV_RES.RV_DELETE_WATCH_RULE,this.m_cv.getObjectId()+".getSubscriptionManager().DeleteAnnotation("+i+");",_d22+"/rv/images/action_comment_delete.gif",gMenuItemStyle,_d22,_d23);
}
}
_d24.setForceCallback(false);
_d24.draw();
if(_d24.isVisible()){
_d24.show();
}
_d24.setForceCallback(true);
};
CSubscriptionManager.prototype.AddNotification=function(){
alert(this.m_sAlertNewVersionConfirm);
var oCV=this.getViewer();
var _d39=new DataDispatcherEntry(oCV);
_d39.setKey("subscriptionManager");
_d39.addFormField("ui.action","addNotification");
_d39.addFormField("cv.responseFormat","data");
this.addCommonFormFields(_d39);
oCV.dispatchRequest(_d39);
};
CSubscriptionManager.prototype.DeleteNotification=function(){
alert(RV_RES.RV_DO_NOT_ALERT_NEW_VERSION_CONFIRM);
var oCV=this.getViewer();
var _d3b=new DataDispatcherEntry(oCV);
_d3b.setKey("subscriptionManager");
_d3b.addFormField("ui.action","deleteNotification");
_d3b.addFormField("cv.responseFormat","data");
this.addCommonFormFields(_d3b);
oCV.dispatchRequest(_d3b);
};
CSubscriptionManager.prototype.NewAnnotation=function(){
var oFWR=document.forms["formWarpRequest"+this.m_cv.getId()];
var _d3d=oFWR["ui.object"].value;
var form=GUtil.createHiddenForm("subscriptionForm","post",this.m_cv.getId(),CSubscriptionManager.k_SubscriptionWizardName);
GUtil.createFormField(form,"ui.object",_d3d);
GUtil.createFormField(form,"b_action","xts.run");
GUtil.createFormField(form,"m","rv/annotation1.xts");
GUtil.createFormField(form,"backURL","javascript:window.close();");
GUtil.createFormField(form,"action_hint","create");
var _d3f=this.m_cv.getWebContentRoot()+"/rv/blankSubscriptionWin.html?cv.id="+this.m_cv.getId();
window.open(_d3f,form.target,this.m_windowOptions);
};
CSubscriptionManager.prototype.ViewAnnotation=function(idx){
var sub=this.m_annotations[idx];
var _d42=sub.searchPath;
var form=GUtil.createHiddenForm("subscriptionForm","post",this.m_cv.getId(),CSubscriptionManager.k_SubscriptionWizardName);
GUtil.createFormField(form,"ui.object",_d42);
GUtil.createFormField(form,"b_action","xts.run");
GUtil.createFormField(form,"m","rv/annotation1.xts");
GUtil.createFormField(form,"backURL","javascript:window.close();");
var _d44=this.m_cv.getWebContentRoot()+"/rv/blankSubscriptionWin.html?cv.id="+this.m_cv.getId();
window.open(_d44,form.target,this.m_windowOptions);
};
CSubscriptionManager.prototype.ModifyAnnotation=function(idx){
var sub=this.m_annotations[idx];
var _d47=this.m_annotations[idx].searchPath;
if(sub&&_d47){
var form=GUtil.createHiddenForm("subscriptionForm","post",this.m_cv.getId(),CSubscriptionManager.k_SubscriptionWizardName);
GUtil.createFormField(form,"ui.object",_d47);
GUtil.createFormField(form,"b_action","xts.run");
GUtil.createFormField(form,"m","rv/annotation1.xts");
GUtil.createFormField(form,"backURL","javascript:window.close();");
GUtil.createFormField(form,"action_hint","save");
var _d49=this.m_cv.getWebContentRoot()+"/rv/blankSubscriptionWin.html?cv.id="+this.m_cv.getId();
window.open(_d49,form.target,this.m_windowOptions);
}
};
CSubscriptionManager.prototype.DeleteAnnotation=function(idx){
var sub=this.m_annotations[idx];
if(sub&&sub.searchPath&&confirm(RV_RES.RV_CONFIRM_DELETE_WATCH_RULE)){
var oCV=this.getViewer();
var _d4d=new DataDispatcherEntry(oCV);
_d4d.setKey("subscriptionManager");
_d4d.addFormField("ui.action","deleteAnnotation");
_d4d.addFormField("cv.responseFormat","data");
this.addCommonFormFields(_d4d,sub.searchPath);
oCV.dispatchRequest(_d4d);
}
};
CSubscriptionManager.prototype.NewSubscription=function(){
var sc=this.m_cv.getSelectionController();
var oFWR=document.forms["formWarpRequest"+this.m_cv.getId()];
var _d50=oFWR.reRunObj.value;
if(_d50&&sc&&sc.getAllSelectedObjects().length===1){
var form=GUtil.createHiddenForm("subscriptionForm","post",this.m_cv.getId(),CSubscriptionManager.k_SubscriptionWizardName);
var fWR=document.getElementById("formWarpRequest"+this.m_cv.getId());
var _d53=new CSelectionXml(fWR["ui.burstID"].value,fWR["ui.contentLocale"].value,fWR["ui.outputLocale"].value);
_d53.BuildSelectionFromController(sc);
GUtil.createFormField(form,"rv.selectionSpecXML",_d53.toXml());
GUtil.createFormField(form,"rv.periodicalProducer",_d50);
GUtil.createFormField(form,"b_action","xts.run");
GUtil.createFormField(form,"m","subscribe/conditional_subscribe1.xts");
GUtil.createFormField(form,"backURL","javascript:window.close();");
var _d54=this.m_cv.getWebContentRoot()+"/rv/blankSubscriptionWin.html?cv.id="+this.m_cv.getId();
window.open(_d54,form.target,"toolbar,location,status,menubar,resizable,scrollbars=1");
}else{
}
};
CSubscriptionManager.prototype.DeleteSubscription=function(idx){
var sub=this.m_aWatchRules[idx];
if(sub&&sub.searchPath&&confirm(RV_RES.RV_CONFIRM_DELETE_WATCH_RULE)){
var oCV=this.getViewer();
var _d58=new DataDispatcherEntry(oCV);
_d58.setKey("subscriptionManager");
_d58.addFormField("ui.action","deleteSubscription");
_d58.addFormField("cv.responseFormat","data");
this.addCommonFormFields(_d58,sub.searchPath);
oCV.dispatchRequest(_d58);
}
};
CSubscriptionManager.prototype.ModifySubscription=function(idx){
var sub=this.m_aWatchRules[idx];
if(sub&&sub.searchPath){
var form=GUtil.createHiddenForm("subscriptionForm","post",this.m_cv.getId(),CSubscriptionManager.k_SubscriptionWizardName);
GUtil.createFormField(form,"m_obj",sub.searchPath);
GUtil.createFormField(form,"m_name",sub.name);
GUtil.createFormField(form,"b_action","xts.run");
GUtil.createFormField(form,"m_class","reportDataServiceAgentDefinition");
GUtil.createFormField(form,"m","portal/properties_subscription.xts");
GUtil.createFormField(form,"backURL","javascript:window.close();");
var _d5c=this.m_cv.getWebContentRoot()+"/rv/blankSubscriptionWin.html?cv.id="+this.m_cv.getId();
window.open(_d5c,form.target,"toolbar,location,status,menubar,resizable,scrollbars=1");
}
};
CSubscriptionManager.prototype.OpenSubscriptionMenu=function(){
var oCV=this.getViewer();
var _d5e=new JSONDispatcherEntry(oCV);
_d5e.setKey("subscriptionManager");
_d5e.addFormField("ui.action","getSubscriptionInfo");
_d5e.addFormField("cv.responseFormat","subscriptionManager");
this.addCommonFormFields(_d5e);
_d5e.setCallbacks({"complete":{"object":this,"method":this.OpenSubscriptionMenuResponse}});
oCV.dispatchRequest(_d5e);
};
CSubscriptionManager.prototype.OpenAnnotationMenu=function(){
var oCV=this.getViewer();
var _d60=new JSONDispatcherEntry(oCV);
_d60.setKey("subscriptionManager");
_d60.addFormField("ui.action","getAnnotationInfo");
_d60.addFormField("cv.responseFormat","getAnnotations");
var _d61=oCV.envParams["ui.object"];
this.addCommonFormFields(_d60,_d61?_d61:"");
_d60.setCallbacks({"complete":{"object":this,"method":this.OpenAnnotationMenuResponse}});
oCV.dispatchRequest(_d60);
};
CSubscriptionManager.prototype.OpenAnnotationMenuResponse=function(_d62){
if(this.Initialize(_d62)){
this.UpdateAnnotationMenu();
}else{
this.ClearAnnotationMenu();
}
};
CSubscriptionManager.prototype.OpenSubscriptionMenuResponse=function(_d63){
if(this.Initialize(_d63)){
this.UpdateSubscribeMenu();
}else{
this.AddEmptySubscriptionMenuItem();
}
};
CSubscriptionManager.prototype.addCommonFormFields=function(_d64,_d65){
if(_d65&&_d65!=""){
_d64.addFormField("ui.object",_d65);
}else{
var _d66=document["formWarpRequest"+this.getViewer().getId()];
if(_d66&&_d66["reRunObj"]){
_d64.addFormField("ui.object",_d66["reRunObj"].value);
}
}
if(_d64.getFormField("ui.action")=="getSubscriptionInfo"){
_d64.addFormField("initialized",this.m_bInitialized?"true":"false");
}
_d64.addFormField("cv.id",this.getViewer().getId());
};
CSubscriptionManager.prototype.AddEmptySubscriptionMenuItem=function(){
var _d67=this.getStandaloneViewerToolbarControl();
if(_d67){
var _d68=_d67.getItem("watchNewVersions");
if(_d68){
_d68.getMenu().clear();
}
var _d69=this.m_cv.getWebContentRoot();
var _d6a=this.m_cv.getSkin();
var _d6b=_d68.getMenu();
var _d6c=new CMenuItem(_d6b,RV_RES.RV_NO_WATCH_RULES,"","",gMenuItemStyle,_d69,_d6a);
_d6c.disable();
_d6b.setForceCallback(false);
_d6b.draw();
if(_d6b.isVisible()){
_d6b.show();
}
_d6b.setForceCallback(true);
}
};
CSubscriptionManager.prototype.ClearSubscriptionMenu=function(){
var _d6d=this.getStandaloneViewerToolbarControl();
if(_d6d){
var _d6e=_d6d.getItem("watchNewVersions");
if(_d6e){
_d6e.getMenu().clear();
}
}
};
CSubscriptionManager.prototype.ClearAnnotationMenu=function(){
var _d6f=this.getStandaloneViewerToolbarControl();
if(_d6f){
var _d70=_d6f.getItem("addAnnotations");
if(_d70){
_d70.getMenu().clear();
}
}
};
CSubscriptionManager.prototype.ClearContextAnnotationMenu=function(){
var _d71=this.getStandaloneViewerContextMenu();
if(_d71){
var _d72=_d71.getFindCommentMenuItem();
if(_d72){
_d72.getMenu().clear();
}
}
};
CSubscriptionManager.prototype.getStandaloneViewerToolbarControl=function(){
if(typeof this.m_cv.rvMainWnd!="undefined"&&this.m_cv.rvMainWnd!=null&&typeof this.m_cv.rvMainWnd.getToolbarControl=="function"){
return this.m_cv.rvMainWnd.getToolbarControl();
}else{
return null;
}
};
CSubscriptionManager.prototype.getStandaloneViewerContextMenu=function(){
if(typeof this.m_cv.rvMainWnd!="undefined"&&this.m_cv.rvMainWnd!=null&&typeof this.m_cv.rvMainWnd.getContextMenu=="function"){
return this.m_cv.rvMainWnd.getContextMenu();
}else{
return null;
}
};
var GUtil={};
GUtil.createHiddenForm=function(name,_d74,_d75,_d76){
var form=document.getElementById(name);
if(form){
document.body.removeChild(form);
}
form=document.createElement("form");
form.id=name;
form.name=name;
form.method=_d74;
form.style.display="none";
form.action=document.forms["formWarpRequest"+_d75].action;
form.target=_d76+(new Date()).getTime();
document.body.appendChild(form);
return form;
};
GUtil.createFormField=function(el,name,_d7a){
var _d7b=document.createElement("input");
_d7b.type="hidden";
_d7b.name=name;
_d7b.value=_d7a;
el.appendChild(_d7b);
};
GUtil.generateCallback=function(func,_d7d,_d7e){
if(func){
var _d7f=_d7e||this;
_d7d=(_d7d instanceof Array)?_d7d:[];
return (function(_d80){
if(typeof _d80!="undefined"&&_d7d.length==0){
_d7d.push(_d80);
}
return func.apply(_d7f,_d7d);
});
}else{
return (function(){
});
}
};
GUtil.destroyProperties=function(_d81,_d82){
var _d83;
if(_d81 instanceof Array){
for(var i=0;i<_d81.length;i++){
_d83=_d81[i];
if(_d83 instanceof String){
_d83=null;
}else{
if(_d83&&_d83.destroy&&!_d83._beingDestroyed){
_d83.destroy();
}
GUtil.destroyProperties(_d83);
}
}
}else{
if(_d81 instanceof Object){
if(_d81._beingDestroyed){
return;
}
var obj=_d81;
obj._beingDestroyed=true;
for(var _d86 in obj){
_d83=obj[_d86];
if(_d86==="_beingDestroyed"||_d86==="m_destroyed"||_d86==="_destroyed"||typeof _d83=="function"){
continue;
}
if(_d83 instanceof Array){
GUtil.destroyProperties(_d83);
}else{
if(_d83 instanceof Object){
if(typeof _d83.destroy=="function"&&!_d83._destroyed&&(_d83!==CCognosViewer||_d82)){
_d83.destroy();
}
}
}
delete obj[_d86];
}
}
}
};
cvLoadDialog=function(_d87,_d88,_d89,_d8a,_d8b,_d8c){
_d8c=((_d8c===undefined)?true:_d8c);
var _d8d=document.getElementById("formWarpRequest"+_d87.getId());
if(_d8d&&_d87){
_d87.getWorkingDialog().hide();
var _d8e="";
var _d8f="";
var _d90=null;
if(_d87.isAccessibleMode()){
_d8e="winNAT_"+(new Date()).getTime();
_d8f=_d87.getWebContentRoot()+"/"+"rv/blankNewWin.html?cv.id="+this.getCVId();
}else{
var _d91=document.body;
_d90=new CModal("","",_d91,null,null,_d8a,_d89,true,true,false,true,_d87.getWebContentRoot());
if(typeof _d8b=="string"){
document.getElementById(CMODAL_CONTENT_ID).setAttribute("title",_d8b);
}
document.getElementById(CMODAL_BACK_IFRAME_ID).setAttribute("title",RV_RES.IDS_JS_MODAL_BACK_IFRAME);
_d8e=CMODAL_CONTENT_ID;
}
var _d92=document.createElement("FORM");
_d92.method="POST";
_d92.action=_d87.getGateway();
_d92.target=_d8e;
_d92.style.margin="0px";
document.body.appendChild(_d92);
for(var _d93 in _d88){
_d92.appendChild(createHiddenFormField(_d93,_d88[_d93]));
}
if(_d8c){
_d92.appendChild(createHiddenFormField("cv.id",_d87.getId()));
_d92.appendChild(createHiddenFormField("b_action","xts.run"));
_d92.appendChild(createHiddenFormField("ui.action",_d8d["ui.action"].value));
_d92.appendChild(createHiddenFormField("ui.object",_d8d["ui.object"].value));
if(typeof _d87.rvMainWnd!="undefined"){
_d92.appendChild(createHiddenFormField("run.outputFormat",_d87.rvMainWnd.getCurrentFormat()));
}
if(typeof _d8d["run.outputLocale"]!="undefined"){
_d92.appendChild(createHiddenFormField("run.outputLocale",_d8d["run.outputLocale"].value));
}
if(typeof _d92["backURL"]=="undefined"&&typeof _d92["ui.backURL"]=="undefined"&&typeof _d8d["ui.backURL"]!="undefined"){
_d92.appendChild(createHiddenFormField("ui.backURL",_d8d["ui.backURL"].value));
}
if(typeof _d87!="undefined"&&typeof _d87.getConversation!="undefined"&&typeof _d87.getTracking!="undefined"){
_d92.appendChild(createHiddenFormField("ui.conversation",_d87.getConversation()));
_d92.appendChild(createHiddenFormField("m_tracking",_d87.getTracking()));
if(_d87.envParams["ui.name"]!="undefined"){
_d92.appendChild(createHiddenFormField("ui.name",_d87.envParams["ui.name"]));
}
}
}
var _d94=window.onbeforeunload;
window.onbeforeunload=null;
if(_d87.isAccessibleMode()){
window.open(_d8f,_d8e,"rv");
_d92.submit();
}else{
_d92.submit();
_d90.show();
}
window.onbeforeunload=_d94;
document.body.removeChild(_d92);
_d87.modalShown=true;
}
};
function createHiddenFormField(name,_d96){
var _d97=document.createElement("input");
_d97.setAttribute("type","hidden");
_d97.setAttribute("name",name);
_d97.setAttribute("id",name);
_d97.setAttribute("value",_d96);
return (_d97);
};
function isAuthenticationFault(_d98){
if(_d98!=null){
var _d99=XMLHelper_FindChildByTagName(_d98,"CAM",true);
return (_d99!=null&&XMLHelper_FindChildByTagName(_d99,"promptInfo",true)!=null);
}
};
function processAuthenticationFault(_d9a,_d9b){
if(isAuthenticationFault(_d9a)){
launchLogOnDialog(_d9b,_d9a);
return true;
}
return false;
};
function isObjectEmpty(_d9c){
for(var _d9d in _d9c){
if(_d9c.hasOwnProperty(_d9d)){
return false;
}
}
return true;
};
function launchLogOnDialog(cvID,_d9f){
try{
var oCV=getCognosViewerObjectRef(cvID);
var _da1={"b_action":"xts.run","m":"portal/close.xts","h_CAM_action":"logonAs"};
if(_d9f!=null){
var _da2=XMLHelper_FindChildrenByTagName(_d9f,"namespace",true);
if(_da2!=null){
for(var _da3=0;_da3<_da2.length;++_da3){
var _da4=_da2[_da3];
if(_da4!=null){
var _da5=XMLHelper_FindChildByTagName(_da4,"name",false);
var _da6=XMLHelper_FindChildByTagName(_da4,"value",false);
if(_da5!=null&&_da6!=null){
var _da7=XMLHelper_GetText(_da5);
var _da8=XMLHelper_GetText(_da6);
if(_da7!=null&&_da7.length>0){
_da1[_da7]=_da8;
}
}
}
}
}
}
cvLoadDialog(oCV,_da1,540,460,null,false);
}
catch(exception){
}
};
function getCVWaitingOnFault(){
var oCV=null;
for(var _daa=0;_daa<window.gaRV_INSTANCES.length;_daa++){
if(window.gaRV_INSTANCES[_daa].getRetryDispatcherEntry()!=null){
oCV=window.gaRV_INSTANCES[_daa];
break;
}
}
return oCV;
};
function ccModalCallBack(_dab,data){
var oCV=getCVWaitingOnFault();
destroyCModal();
if(typeof HiddenIframeDispatcherEntry=="function"&&HiddenIframeDispatcherEntry.hideIframe){
var oCV=window.gaRV_INSTANCES[0];
if(oCV){
HiddenIframeDispatcherEntry.hideIframe(oCV.getId());
}
}
if(oCV!=null){
if(typeof _dab!="undefined"&&_dab=="ok"){
var _dae=oCV.getRetryDispatcherEntry();
if(_dae){
_dae.retryRequest();
}
if(oCV.getRV()!=null){
oCV.getRV().updateUserName();
}
}else{
oCV.rvMainWnd.hideOpenMenus();
}
}
};
function closeErrorPage(){
var oCV=getCVWaitingOnFault();
destroyCModal();
if(oCV!=null){
oCV.setRetryDispatcherEntry(null);
oCV.rvMainWnd.hideOpenMenus();
}
};
function getCrossBrowserNode(evt,_db1){
var node=null;
if(_db1&&evt.explicitOriginalTarget){
node=evt.explicitOriginalTarget;
}else{
if(evt.originalTarget){
node=evt.originalTarget;
}else{
if(evt.target){
node=evt.target;
}else{
if(evt.srcElement){
node=evt.srcElement;
}
}
}
}
try{
if(node&&node.nodeType==3){
node=node.parentNode;
}
}
catch(ex){
}
return node;
};
function getNodeFromEvent(evt,_db4){
var node=getCrossBrowserNode(evt,true);
if(node&&node.getAttribute&&node.getAttribute("name")=="primarySelectionDiv"){
node=node.parentNode.firstChild;
}
if(node&&node.getAttribute&&node.getAttribute("flashChartContainer")=="true"){
node=node.firstChild;
}
if(node&&node.getAttribute&&node.getAttribute("chartContainer")=="true"&&node.childNodes){
for(var i=0;i<node.childNodes.length;i++){
if(node.childNodes[i].nodeName.toLowerCase()=="img"){
node=node.childNodes[i];
break;
}
}
}else{
if(!_db4&&node&&node.nodeName&&node.nodeName.toLowerCase()=="img"&&node.getAttribute("rsvpChart")!="true"){
node=node.parentNode;
}
}
return node;
};
function getCtxNodeFromEvent(evt){
try{
var node=getCrossBrowserNode(evt);
var _db9=node.nodeName.toUpperCase();
if((_db9=="SPAN"||_db9=="AREA"||_db9=="IMG")&&node.getAttribute("ctx")!=null){
return node;
}else{
if(_db9=="SPAN"&&(node.parentNode.getAttribute("ctx")!=null)){
return node.parentNode;
}
}
}
catch(exception){
}
return null;
};
function getDocumentFromEvent(evt){
var node=getCrossBrowserNode(evt,true);
var _dbc=node.document?node.document:node.ownerDocument;
return _dbc;
};
function stopEventBubble(evt){
evt.returnValue=false;
evt.cancelBubble=true;
if(typeof evt.stopPropagation!="undefined"){
evt.stopPropagation();
}
if(typeof evt.preventDefault!="undefined"){
evt.preventDefault();
}
return false;
};
function setNodeFocus(evt){
evt=(evt)?evt:((event)?event:null);
var _dbf=getNodeFromEvent(evt);
if(_dbf&&_dbf.nodeName){
var _dc0=_dbf.nodeName.toLowerCase();
if((_dc0=="td"||_dc0=="span")&&_dbf.childNodes&&_dbf.childNodes.length>0&&_dbf.childNodes[0].className=="textItem"){
try{
_dbf.childNodes[0].focus();
}
catch(e){
if(typeof console!=="undefined"&&console.log){
console.log("CCognosViewer: Could not set focus to node. setNodeFocus method common.js");
}
}
}
}
};
function html_encode(str){
return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
};
function replaceNewLine(_dc2){
var regX=/\r\n|\r|\n/g;
var _dc4="<br/>";
return _dc2.replace(regX,_dc4);
};
function xml_encode(_dc5){
var _dc6=""+_dc5;
if((_dc6=="0")||((_dc5!=null)&&(_dc5!=false))){
_dc6=_dc6.replace(/&/g,"&amp;");
_dc6=_dc6.replace(/</g,"&lt;");
_dc6=_dc6.replace(/>/g,"&gt;");
_dc6=_dc6.replace(/"/g,"&quot;");
_dc6=_dc6.replace(/'/g,"&apos;");
}else{
if(_dc5==null){
_dc6="";
}
}
return _dc6;
};
function xml_decodeParser(sAll,_dc8){
var _dc9=sAll;
switch(_dc8){
case "amp":
_dc9="&";
break;
case "lt":
_dc9="<";
break;
case "gt":
_dc9=">";
break;
case "quot":
_dc9="\"";
break;
case "apos":
_dc9="'";
break;
}
return _dc9;
};
function xml_decode(_dca){
var _dcb=""+_dca;
if((_dcb=="0")||((_dca!=null)&&(_dca!=false))){
_dcb=_dcb.replace(/&(amp|lt|gt|quot|apos);/g,xml_decodeParser);
}else{
if(_dca==null){
_dcb="";
}
}
return _dcb;
};
function xpath_attr_encode(_dcc){
var _dcd=null;
if(_dcc.indexOf("'")>=0&&_dcc.indexOf("\"")>=0){
var _dce=_dcc.split("\"");
_dcd="concat(";
for(var i=0;i<_dce.length;++i){
if(i>0){
_dcd+=",";
}
if(_dce[i].length>0){
_dcd+=("\""+_dce[i]+"\"");
}else{
_dcd+="'\"'";
}
}
_dcd+=")";
}else{
if(_dcc.indexOf("'")>=0){
_dcd="\""+_dcc+"\"";
}else{
_dcd="'"+_dcc+"'";
}
}
return _dcd;
};
function getCognosViewerObjectString(sId){
return "oCV"+sId;
};
function getCognosViewerObjectRefAsString(sId){
return "window."+getCognosViewerObjectString(sId);
};
function getCognosViewerObjectRef(sId){
return window[getCognosViewerObjectString(sId)];
};
function getCognosViewerSCObjectString(sId){
return "oCVSC"+sId;
};
function getCognosViewerSCObjectRefAsString(sId){
return "window."+getCognosViewerSCObjectString(sId);
};
function getCognosViewerSCObjectRef(sId){
return window[getCognosViewerSCObjectString(sId)];
};
function cleanupGlobalObjects(sId){
cleanupVariable(getCognosViewerObjectString(sId));
cleanupVariable(getCognosViewerSCObjectString(sId));
};
function cleanupVariable(_dd7){
if(typeof window[_dd7]!="undefined"&&window[_dd7]){
if(isIE()){
eval("delete "+_dd7);
}else{
delete window[_dd7];
}
}
};
function loadClass(_dd8){
try{
var _dd9=eval("new "+_dd8+"();");
return _dd9;
}
catch(e){
return null;
}
};
function getElementsByClassName(oElm,_ddb,_ddc){
var _ddd=(_ddb=="*"&&oElm.all)?oElm.all:oElm.getElementsByTagName(_ddb);
var _dde=[];
var _ddf=new RegExp("(^|\\s)"+_ddc+"(\\s|$)");
var _de0=_ddd.length;
for(var i=0;i<_de0;i++){
var _de2=_ddd[i];
if(_ddf.test(_de2.className)){
_dde.push(_de2);
}
}
return _dde;
};
function getImmediateLayoutContainerId(node){
var _de4=node;
while(_de4!=null){
if(_de4.getAttribute&&_de4.getAttribute("lid")!=null){
return _de4.getAttribute("lid");
}
_de4=_de4.parentNode;
}
return null;
};
function getChildElementsByAttribute(oElm,_de6,_de7,_de8){
return getDescendantElementsByAttribute(oElm,_de6,_de7,_de8,true);
};
function getElementsByAttribute(oElm,_dea,_deb,_dec,_ded,_dee){
return getDescendantElementsByAttribute(oElm,_dea,_deb,_dec,false,_ded,_dee);
};
function getDescendantElementsByAttribute(oElm,_df0,_df1,_df2,_df3,_df4,_df5){
var _df6=[];
var _df7=null;
if(typeof _df5==="undefined"){
_df7=(typeof _df2!="undefined")?new RegExp("(^|\\s)"+_df2+"(\\s|$)","i"):null;
}else{
_df7=_df5;
}
if(typeof _df0=="string"){
_df0=[_df0];
}
var _df8=(oElm?_df0.length:0);
for(var _df9=0;_df9<_df8;_df9++){
var _dfa=null;
if(_df3){
if(_df0[_df9]=="*"&&oElm.all){
_dfa=oElm.childNodes;
}else{
_dfa=[];
var _dfb=oElm.childNodes;
for(var i=0;i<_dfb.length;++i){
if(_dfb[i].nodeName.toLowerCase()==_df0[_df9].toLowerCase()){
_dfa.push(_dfb[i]);
}
}
}
}else{
_dfa=(_df0[_df9]=="*"&&oElm.all)?oElm.all:oElm.getElementsByTagName(_df0[_df9]);
}
var _dfd=_dfa.length;
for(var idx=0;idx<_dfd;idx++){
var _dff=_dfa[idx];
var _e00=_dff.getAttribute&&_dff.getAttribute(_df1);
if(_e00!==null){
var _e01=null;
if(typeof _e00==="number"){
_e01=String(_e00);
}else{
if(typeof _e00==="string"&&_e00.length>0){
_e01=_e00;
}
}
if(_e01!==null){
if(typeof _df2=="undefined"||(_df7&&_df7.test(_e01))){
_df6.push(_dff);
if(_df4!=-1&&_df6.length>_df4){
return [];
}else{
if(_df4==1&&_df6.length==1){
return _df6;
}
}
}
}
}
}
}
return _df6;
};
function savedOutputDoneLoading(cvId,_e03){
var oCV=window["oCV"+cvId];
var _e05=(oCV&&oCV.getViewerWidget?oCV.getViewerWidget():null);
var _e06=(_e05?_e05.getSavedOutput():null);
if(_e06){
_e06.outputDoneLoading();
}else{
if(_e03<5){
_e03++;
var _e07=function(){
savedOutputDoneLoading(cvId,_e03);
};
setTimeout(_e07,100);
}
}
};
function getNavVer(){
var temp;
if(isIE()){
return getIEVersion();
}else{
temp=navigator.userAgent.split("/");
return parseFloat(temp[temp.length-1]);
}
};
function isSafari(){
return (navigator.userAgent.toLowerCase().indexOf("safari")!=-1&&navigator.userAgent.toLowerCase().indexOf("chrome")==-1);
};
function isIE(){
return (navigator.userAgent.indexOf("MSIE")!=-1||navigator.userAgent.indexOf("Trident")!=-1);
};
function getIEVersion(){
var _e09=navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
return _e09?parseFloat(_e09[1]):null;
};
function isFF(){
return (navigator.userAgent.indexOf("Firefox")!=-1);
};
function isIOS(){
return navigator.userAgent.indexOf("iPad")!=-1||navigator.userAgent.indexOf("iPhone")!=-1;
};
function displayChart(_e0a,_e0b,_e0c,_e0d){
if(_e0b.length>1){
document.images[_e0a].src=_e0b;
}
};
function isFlashChartNode(evt){
var node=getNodeFromEvent(evt);
if(node!=null&&typeof node.getAttribute=="function"){
return node.getAttribute("flashChart")!=null;
}
return false;
};
function onFlashChartRightClick(evt){
if(evt&&evt.button&&evt.button!=0&&isFlashChartNode(evt)){
return onViewerChartFocus(evt);
}
};
function onViewerChartFocus(evt){
if(evt.stopPropagation){
evt.stopPropagation();
}
if(evt.preventDefault){
evt.preventDefault();
}
if(evt.preventCapture){
evt.preventCapture();
}
if(evt.preventBubble){
evt.preventBubble();
}
var node=getNodeFromEvent(evt);
var _e13=node.getAttribute("viewerId");
if(!_e13){
_e13=node.parentNode.getAttribute("viewerId");
}
if(!_e13){
return;
}
var oCV=window["oCV"+_e13];
var _e15=oCV.getAction("Selection");
_e15.pageClicked(evt);
return stopEventBubble(evt);
};
function clientToScreenCoords(_e16,_e17){
var _e18=_e16;
var _e19={topCoord:0,leftCoord:0};
while(_e18!=null&&_e18!=_e17){
_e19.topCoord+=_e18.offsetTop;
_e19.leftCoord+=_e18.offsetLeft;
_e18=_e18.offsetParent;
}
return _e19;
};
function getCurrentPosistionString(oCV,_e1b,_e1c){
var _e1d=RV_RES.IDS_JS_INFOBAR_ITEM_COUNT;
var _e1e=/\{0\}/;
var _e1f=/\{1\}/;
_e1d=_e1d.replace(_e1e,_e1b);
_e1d=" "+_e1d.replace(_e1f,_e1c)+" ";
return _e1d;
};
function applyJSONProperties(obj,_e21){
for(property in _e21){
if(typeof _e21[property]=="object"&&!(_e21[property] instanceof Array)){
if(typeof obj[property]=="undefined"){
obj[property]={};
}
applyJSONProperties(obj[property],_e21[property]);
}else{
obj[property]=_e21[property];
}
}
};
function CViewerCommon(){
};
CViewerCommon.openNewWindowOrTab=function(sURL,_e23){
return window.open(sURL,_e23);
};
CViewerCommon.toJSON=function(obj){
var type=typeof (obj);
if(type!="object"||type===null){
if(type==="string"){
obj="\""+obj+"\"";
}
return String(obj);
}else{
var _e26;
var prop;
var json=[];
var _e29=(obj&&obj.constructor==Array);
for(_e26 in obj){
prop=obj[_e26];
type=typeof (prop);
if(type==="string"){
prop="\""+prop+"\"";
}else{
if(type=="object"&&prop!==null){
prop=CViewerCommon.toJSON(prop);
}
}
json.push((_e29?"":"\""+_e26+"\":")+String(prop));
}
return (_e29?"[":"{")+String(json)+(_e29?"]":"}");
}
};
function resizePinnedContainers(){
var oCV=window.gaRV_INSTANCES[0];
if(oCV&&!oCV.m_viewerFragment){
var _e2b=oCV.getPinFreezeManager();
if(_e2b&&_e2b.hasFrozenContainers()){
var _e2c=document.getElementById("RVContent"+oCV.getId());
var _e2d=document.getElementById("mainViewerTable"+oCV.getId());
var _e2e=_e2c.clientWidth;
var _e2f=_e2d.clientHeight;
_e2b.resize(_e2e,_e2f);
if(isIE()){
oCV.repaintDiv(_e2c);
}
}
}
};
function setWindowHref(url){
var _e31=window.onbeforeunload;
window.onbeforeunload=null;
window.location.href=url;
window.onbeforeunload=_e31;
};
CViewerCommon.getMessage=function(msg,args){
if(typeof args=="undefined"){
return msg;
}else{
if(typeof args=="string"){
msg=msg.replace("{0}",args);
}else{
if(args.length){
for(var i=0;i<args.length;++i){
msg=msg.replace("{"+i+"}",args[i]);
}
}else{
msg=msg.replace("{0}",args);
}
}
}
return msg;
};
function getViewerDirection(){
if(window.gaRV_INSTANCES&&window.gaRV_INSTANCES.length){
return gaRV_INSTANCES[0].getDirection();
}
return "ltr";
};
function isViewerBidiEnabled(){
if(window.gaRV_INSTANCES&&window.gaRV_INSTANCES.length){
var _e35=gaRV_INSTANCES[0].isBidiEnabled();
if(_e35){
return true;
}
}
return false;
};
function getViewerBaseTextDirection(){
if(window.gaRV_INSTANCES&&window.gaRV_INSTANCES.length){
return gaRV_INSTANCES[0].getBaseTextDirection();
}
return "";
};
function enforceTextDir(_e36){
if(isViewerBidiEnabled()&&_e36){
var sDir=getViewerBaseTextDirection();
var _e38=BidiUtils.getInstance();
if(sDir=="auto"){
sDir=_e38.resolveStrBtd(_e36);
}
var _e39=(!dojo._isBodyLtr())?_e38.RLM:_e38.LRM;
return _e39+((sDir==="rtl")?_e38.RLE:_e38.LRE)+_e36+_e38.PDF+_e39;
}
return _e36;
};
function getElementDirection(_e3a){
var dir=null;
if(_e3a.currentStyle){
dir=_e3a.currentStyle.direction;
}else{
if(window.getComputedStyle){
var _e3c=window.getComputedStyle(_e3a,null);
if(_e3c){
dir=_e3c.getPropertyValue("direction");
}
}
}
if(dir){
dir=dir.toLowerCase();
}
return dir;
};
function getScrollLeft(_e3d){
if(getElementDirection(_e3d)==="rtl"&&isFF()){
return _e3d.scrollWidth-_e3d.offsetWidth+_e3d.scrollLeft;
}
return _e3d.scrollLeft;
};
function setScrollLeft(_e3e,_e3f){
if(getElementDirection(_e3e)==="rtl"&&isFF()){
_e3e.scrollLeft=_e3e.offsetWidth+_e3f-_e3e.scrollWidth;
}else{
_e3e.scrollLeft=_e3f;
}
};
function setScrollRight(_e40,_e41){
if(getElementDirection(_e40)==="rtl"&&isFF()){
_e40.scrollLeft=-_e41;
}else{
_e40.scrollLeft=_e40.scrollWidth-_e40.offsetWidth-_e41;
}
};
function getBoxInfo(el,_e43){
if(!getBoxInfo.aStyles){
getBoxInfo.aStyles=[{name:"marginLeft",ie:"marginLeft",ff:"margin-left"},{name:"marginRight",ie:"marginRight",ff:"margin-right"},{name:"marginTop",ie:"marginTop",ff:"margin-top"},{name:"marginBottom",ie:"marginBottom",ff:"margin-bottom"},{name:"borderLeftWidth",ie:"borderLeftWidth",ff:"border-left-width"},{name:"borderRightWidth",ie:"borderRightWidth",ff:"border-right-width"},{name:"borderTopWidth",ie:"borderTopWidth",ff:"border-top-width"},{name:"borderBottomWidth",ie:"borderBottomWidth",ff:"border-bottom-width"},{name:"paddingLeft",ie:"paddingLeft",ff:"padding-left"},{name:"paddingRight",ie:"paddingRight",ff:"padding-right"},{name:"paddingTop",ie:"paddingTop",ff:"padding-top"},{name:"paddingBottom",ie:"paddingBottom",ff:"padding-bottom"}];
}
var _e44={};
var _e45=null;
if(el.currentStyle){
_e45=el.currentStyle;
}else{
if(window.getComputedStyle){
_e45=window.getComputedStyle(el,null);
}
}
if(!_e45){
return null;
}
for(i in getBoxInfo.aStyles){
var _e46=getBoxInfo.aStyles[i];
var size=null;
if(_e45.getPropertyValue){
size=_e45.getPropertyValue(_e46.ff);
}else{
size=_e45[_e46.ie];
}
if(size&&_e43){
size=Number(size.replace("px",""));
}
_e44[_e46.name]=size;
}
return _e44;
};
function CSelectionMetadata(){
this.m_sContextId="";
this.m_sDataItem="";
this.m_sMetadataModelItem="";
this.m_sUseValue="";
this.m_sUseValueType="";
this.m_sType=null;
this.m_sDisplayValue="";
this.m_sUsage=null;
this.m_refQuery=null;
this.m_sHun=null;
this.m_sDun=null;
};
CSelectionMetadata.prototype.setContextId=function(_e48){
this.m_sContextId=_e48;
};
CSelectionMetadata.prototype.getContextId=function(){
return this.m_sContextId;
};
CSelectionMetadata.prototype.setRefQuery=function(_e49){
this.m_refQuery=_e49;
};
CSelectionMetadata.prototype.getRefQuery=function(){
return this.m_refQuery;
};
CSelectionMetadata.prototype.setDataItem=function(_e4a){
this.m_sDataItem=_e4a;
};
CSelectionMetadata.prototype.getDataItem=function(){
return this.m_sDataItem;
};
CSelectionMetadata.prototype.setMetadataModelItem=function(_e4b){
this.m_sMetadataModelItem=_e4b;
};
CSelectionMetadata.prototype.getMetadataModelItem=function(){
return this.m_sMetadataModelItem;
};
CSelectionMetadata.prototype.setUseValue=function(_e4c){
this.m_sUseValue=_e4c;
};
CSelectionMetadata.prototype.getUseValue=function(){
return this.m_sUseValue;
};
CSelectionMetadata.prototype.setUseValueType=function(_e4d){
this.m_sUseValueType=_e4d;
};
CSelectionMetadata.prototype.setType=function(_e4e){
this.m_sType=_e4e;
};
CSelectionMetadata.prototype.getType=function(){
var _e4f=null;
switch(this.m_sUseValueType){
case 25:
case 27:
case 30:
case 32:
_e4f="memberUniqueName";
break;
case 26:
_e4f="memberCaption";
break;
case 1:
case 55:
case 56:
_e4f="string";
break;
case 2:
case 3:
case 4:
case 5:
case 6:
case 7:
case 8:
case 9:
case 10:
case 11:
case 12:
case 16:
case 17:
case 18:
case 19:
case 20:
case 22:
case 21:
case 23:
case 24:
case 54:
_e4f=parseInt(this.m_sUseValueType,10);
break;
}
return _e4f;
};
CSelectionMetadata.prototype.getUseValueType=function(){
if(this.m_sType==null){
this.m_sType=this.getType();
}
return this.m_sType;
};
CSelectionMetadata.prototype.setDisplayValue=function(_e50){
this.m_sDisplayValue=_e50;
};
CSelectionMetadata.prototype.getDisplayValue=function(){
return this.m_sDisplayValue;
};
CSelectionMetadata.prototype.setUsage=function(_e51){
this.m_sUsage=_e51;
};
CSelectionMetadata.prototype.getUsage=function(){
if(this.m_sUsage=="2"){
return "measure";
}else{
return "nonMeasure";
}
};
CSelectionMetadata.prototype.setHun=function(sHun){
this.m_sHun=sHun;
};
CSelectionMetadata.prototype.getHun=function(){
return this.m_sHun;
};
CSelectionMetadata.prototype.setDun=function(sDun){
this.m_sDun=sDun;
};
CSelectionMetadata.prototype.getDun=function(){
return this.m_sDun;
};
function CSelectionMetadataIterator(_e54,_e55){
this.m_axisIndex=_e55;
this.m_index=0;
this.m_selectionObject=_e54;
};
CSelectionMetadataIterator.prototype.getSelectionAxis=function(){
var _e56=null;
if(typeof this.m_selectionObject=="object"&&this.m_axisIndex<this.m_selectionObject.getSelectedContextIds().length){
_e56=this.m_selectionObject.getSelectedContextIds()[this.m_axisIndex];
}
return _e56;
};
CSelectionMetadataIterator.prototype.hasNext=function(){
var _e57=this.getSelectionAxis();
if(_e57!=null){
return (this.m_index<_e57.length);
}else{
return false;
}
};
CSelectionMetadataIterator.prototype.next=function(){
var _e58=null;
if(this.hasNext()){
_e58=new CSelectionMetadata();
_e58.setContextId(this.m_selectionObject.m_contextIds[this.m_axisIndex][this.m_index]);
_e58.setDataItem(this.m_selectionObject.getDataItems()[this.m_axisIndex][this.m_index]);
_e58.setMetadataModelItem(this.m_selectionObject.getMetadataItems()[this.m_axisIndex][this.m_index]);
if(this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index]!=null&&this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index]!=""){
_e58.setUseValue(this.m_selectionObject.getMuns()[this.m_axisIndex][this.m_index]);
_e58.setType("memberUniqueName");
}else{
_e58.setUseValue(this.m_selectionObject.getUseValues()[this.m_axisIndex][this.m_index]);
}
if(typeof this.m_selectionObject.m_selectionController=="object"){
var _e59=this.m_selectionObject.getSelectedContextIds()[this.m_axisIndex][this.m_index];
if(this.m_selectionObject.useDisplayValueFromObject){
_e58.setDisplayValue(this.m_selectionObject.getDisplayValues()[this.m_axisIndex]);
}else{
var _e5a=null;
var _e5b=null;
if(this.m_axisIndex===0){
var _e5c=this.m_selectionObject.getCellRef();
if(_e5c&&_e5c.nodeName&&_e5c.nodeName.toLowerCase()==="td"){
_e5b=this.m_selectionObject.m_selectionController.getDisplayValueFromDOM(_e59,_e5c.parentNode);
}
}
if(_e5b==null){
_e5b=this.m_selectionObject.m_selectionController.getDisplayValue(_e59);
}
if(_e5b===""){
_e5b=this.m_selectionObject.m_selectionController.getUseValue(_e59);
}
_e58.setDisplayValue(_e5b);
}
_e58.setUseValueType(this.m_selectionObject.m_selectionController.getDataType(_e59));
_e58.setUsage(this.m_selectionObject.m_selectionController.getUsageInfo(_e59));
_e58.setRefQuery(this.m_selectionObject.m_selectionController.getRefQuery(_e59));
_e58.setHun(this.m_selectionObject.m_selectionController.getHun(_e59));
_e58.setDun(this.m_selectionObject.m_selectionController.getDun(_e59));
}
++this.m_index;
}
return _e58;
};
function CAxisSelectionIterator(_e5d){
this.m_index=0;
this.m_selectionObject=_e5d;
};
CAxisSelectionIterator.prototype.hasNext=function(){
return ((typeof this.m_selectionObject=="object")&&(this.m_index<this.m_selectionObject.getSelectedContextIds().length));
};
CAxisSelectionIterator.prototype.next=function(){
var _e5e=null;
if(this.hasNext()){
_e5e=new CSelectionMetadataIterator(this.m_selectionObject,this.m_index);
++this.m_index;
}
return _e5e;
};
function getSelectionContextIds(_e5f){
var _e60=[];
var _e61=_e5f.getAllSelectedObjects();
if(_e61!=null&&_e61.length>0){
for(var _e62=0;_e62<_e61.length;++_e62){
var _e63=_e61[_e62];
var _e64=_e63.getSelectedContextIds();
var _e65=[];
for(var item=0;item<_e64.length;++item){
var _e67=_e64[item].join(":");
_e65.push(_e67);
}
_e60.push(_e65.join("::"));
}
}
return _e60;
};
function getViewerSelectionContext(_e68,_e69,_e6a){
var _e6b=_e6a==true?_e68.getAllSelectedObjectsWithUniqueCTXIDs():_e68.getAllSelectedObjects();
if(_e6b!=null&&_e6b.length>0){
for(var _e6c=0;_e6c<_e6b.length;++_e6c){
var _e6d={};
var _e6e=new CAxisSelectionIterator(_e6b[_e6c]);
if(_e6e.hasNext()){
var _e6f=_e6e.next();
if(_e6f.hasNext()){
var _e70=_e6f.next();
var _e71=_e70.getContextId();
_e6d[_e71]=true;
var _e72=_e69.addSelectedCell(_e70.getDataItem(),_e70.getMetadataModelItem(),_e70.getUseValue(),_e70.getUseValueType(),_e70.getDisplayValue(),_e70.getUsage(),{"queryName":_e70.getRefQuery()});
if(_e70.getHun()!=null){
_e72.addProperty("HierarchyUniqueName",_e70.getHun());
}
if(_e70.getDun()!=null){
_e72.addProperty("DimensionUniqueName",_e70.getDun());
}
while(_e6f.hasNext()){
_e70=_e6f.next();
_e71=_e70.getContextId();
if(typeof _e6d[_e71]=="undefined"||_e71===""){
_e6d[_e71]=true;
var _e73=_e72.addDefiningCell(_e70.getDataItem(),_e70.getMetadataModelItem(),_e70.getUseValue(),_e70.getUseValueType(),_e70.getDisplayValue(),_e70.getUsage(),{"queryName":_e70.getRefQuery()});
if(_e70.getHun()!=null){
_e73.addProperty("HierarchyUniqueName",_e70.getHun());
}
if(_e70.getDun()!=null){
_e73.addProperty("DimensionUniqueName",_e70.getDun());
}
}
}
while(_e6e.hasNext()){
_e6f=_e6e.next();
var _e74=_e72;
while(_e6f.hasNext()){
_e70=_e6f.next();
_e71=_e70.getContextId();
if(typeof _e6d[_e71]=="undefined"||_e71===""){
_e6d[_e71]=true;
_e74=_e74.addDefiningCell(_e70.getDataItem(),_e70.getMetadataModelItem(),_e70.getUseValue(),_e70.getUseValueType(),_e70.getDisplayValue(),_e70.getUsage(),{"queryName":_e70.getRefQuery()});
if(_e70.getHun()!=null){
_e74.addProperty("HierarchyUniqueName",_e70.getHun());
}
if(_e70.getDun()!=null){
_e74.addProperty("DimensionUniqueName",_e70.getDun());
}
}
}
}
}
}
}
}
var _e75=_e69.toString();
if(window.gViewerLogger){
window.gViewerLogger.log("Selection context",_e75,"xml");
}
return _e75;
};
function PinFreezeContainer(_e76,lid,_e78,_e79,_e7a,_e7b,_e7c){
this.m_pinFreezeManager=_e76;
this.m_lid=lid;
this.m_lidNS=lid+_e78+_e7c;
this.m_viewerId=_e78;
this.m_freezeTop=_e79;
this.m_freezeSide=_e7a;
this.m_cachedReportDiv=null;
this.m_cachedPFContainer=null;
this.m_cachedBaseContainer=_e7b;
this.m_containerMargin={"top":0,"left":0};
if(this.m_cachedBaseContainer&&this.m_cachedBaseContainer.style){
if(this.m_cachedBaseContainer.style.marginTop){
this.m_containerMargin.top=Number(this.m_cachedBaseContainer.style.marginTop.replace("px",""));
}
if(this.m_cachedBaseContainer.style.marginLeft){
this.m_containerMargin.left=Number(this.m_cachedBaseContainer.style.marginLeft.replace("px",""));
}
}
this.m_cachedContainerIndex=_e7c;
this.m_sectionCache=null;
this.m_homeCellNodes={};
this.m_fixedWidth=null;
this.m_clientWidth=700;
this.m_scrollableClientWidth=700;
this.m_fixedHeight=null;
this.m_clientHeight=300;
this.m_scrollableClientHeight=300;
this.m_wrapFlag=false;
this.c_pageMargin=(this.m_freezeTop&&this.m_freezeSide)?50:20;
this.touchScrollSections=false;
this.touchPreviousX=-1;
this.touchPreviousY=-1;
};
PinFreezeContainer.prototype.toJSONString=function(){
var _e7d="{";
_e7d+="\"m_clientWidth\":"+this.m_clientWidth+"";
_e7d+=",\"m_scrollableClientWidth\":"+this.m_scrollableClientWidth+"";
_e7d+=",\"m_clientHeight\":"+this.m_clientHeight+"";
_e7d+=",\"m_scrollableClientHeight\":"+this.m_scrollableClientHeight+"";
_e7d+="}";
return _e7d;
};
PinFreezeContainer.prototype.copyProperties=function(_e7e){
this.m_clientWidth=_e7e.m_clientWidth;
this.m_scrollableClientWidth=_e7e.m_scrollableClientWidth;
this.m_clientHeight=_e7e.m_clientHeight;
this.m_scrollableClientHeight=_e7e.m_scrollableClientHeight;
};
PinFreezeContainer.prototype.setViewerId=function(id){
this.m_viewerId=id;
};
PinFreezeContainer.prototype.getLid=function(){
return this.m_lid;
};
PinFreezeContainer.prototype.createPFContainer=function(_e80,_e81){
var _e82=document.createElement("temp");
if(this.m_cachedBaseContainer){
this.applyAuthoredFixedSizes(this.m_cachedBaseContainer);
this.m_cachedReportDiv=_e80;
var _e83=this.m_cachedBaseContainer.parentNode;
var _e84=this.loadTemplateHTML();
if(_e84){
_e82.innerHTML=_e84;
var _e85=this.getContainerByLID(_e82);
var _e86=this.getSectionByLID(_e82.firstChild,"pfMainOutput");
if(_e86){
var i=this.getChildPosition(_e83,this.m_cachedBaseContainer);
if(i!=-1){
var _e88=this.m_pinFreezeManager.m_oCV;
if(_e88&&_e88.envParams["freezeDefaultWrap"]){
if(this.m_cachedBaseContainer.style.whiteSpace===""&&_e88.envParams["freezeDefaultWrap"].toLowerCase()==="true"){
var _e89=this.m_cachedBaseContainer.getElementsByTagName("span");
if(_e89){
for(var k=0;k<_e89.length;k++){
_e89[k].style.whiteSpace="nowrap";
}
}
this.m_wrapFlag=true;
}
}
if(!_e81){
if(!this._getFixedWidth()){
this.m_cachedBaseContainer.setAttribute("authoredFixedWidth","false");
this.m_addedFixedWidth=this.m_cachedBaseContainer.clientWidth+1;
this.m_cachedBaseContainer.style.width=this.m_addedFixedWidth+"px";
}
if(!this._getFixedHeight()){
this.m_cachedBaseContainer.setAttribute("authoredFixedHeight","false");
this.m_addedFixedHeight=this.m_cachedBaseContainer.clientHeight;
this.m_cachedBaseContainer.style.height=this.m_addedFixedHeight+"px";
}
_e86.style.width=this.m_cachedBaseContainer.clientWidth+2+"px";
_e86.style.height=this.m_cachedBaseContainer.clientHeight+2+"px";
}
_e86.appendChild(this.m_cachedBaseContainer);
this.insertAt(_e83,_e85,i);
}
if(this.m_cachedBaseContainer.style.border!==""){
_e85.style.border=this.m_cachedBaseContainer.style.border;
this.m_cachedBaseContainer.style.border="";
}
}
}
}
};
PinFreezeContainer.prototype._getFixedWidth=function(_e8b){
if(_e8b&&_e8b.style.width&&!_e8b.getAttribute("authoredFixedWidth")){
var _e8c=Number(_e8b.style.width.split("px")[0]);
return isNaN(_e8c)?null:_e8c;
}
return null;
};
PinFreezeContainer.prototype._getFixedHeight=function(_e8d){
if(_e8d&&_e8d.style.height&&!_e8d.getAttribute("authoredFixedHeight")){
var _e8e=Number(_e8d.style.height.split("px")[0]);
return isNaN(_e8e)?null:_e8e;
}
return null;
};
PinFreezeContainer.prototype.applyAuthoredFixedSizes=function(_e8f){
var _e90=this._getFixedWidth(_e8f);
if(_e90){
this.m_fixedWidth=_e90;
this.m_clientWidth=this.m_fixedWidth;
this.m_scrollableClientWidth=this.m_fixedWidth;
}
var _e91=this._getFixedHeight(_e8f);
if(_e91){
this.m_fixedHeight=_e91;
this.m_clientHeight=this.m_fixedHeight;
this.m_scrollableClientHeight=this.m_fixedHeight;
}
};
PinFreezeContainer.prototype.loadFreezeBothTemplateHTML=function(){
var _e92="<table pflid=\""+this.m_lidNS+"\" pfclid=\"pfContainer_"+this.m_lidNS+"\" cellpadding=\"0\" style=\"white-space:nowrap; width:0px; height:0px;\" cellspacing=\"0\">"+"<tr class=\"BUXNoPrint\" templatePart=\"freezeTop\"><td align=\"center\" templatePart=\"freezeSide\"><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfHomeCell_"+this.m_lidNS+"\" style=\"overflow-x:hidden; overflow-y:hidden; width:100%; height:100%\"/></td>"+"<td valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfTopHeadings_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\"/></td><td templatePart=\"freezeTop\"></td></tr>"+"<tr><td class=\"BUXNoPrint\" valign=top templatePart=\"freezeSide\"><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfSideHeadings_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\"/></td>"+"<td valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfMainOutput_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\">"+"</div></td>"+"<td class=\"BUXNoPrint\" templatePart=\"freezeTop\">"+"<div style=\"padding-right:1px;overflow-x:hidden; overflow-y:scroll;\" pflid=\""+this.m_lidNS+"\" pfslid=\"pfVerticalScrollBar_"+this.m_lidNS+"\" tabIndex=\"-1\" onmouseup=\"stopEventBubble(event);\" onmousedown=\"stopEventBubble(event);\" onscroll=\""+getCognosViewerObjectRefAsString(this.m_viewerId)+".m_pinFreezeManager.getContainer('"+this.m_lid+"', "+this.m_cachedContainerIndex+").synchVScroll()\">"+"<div style=\"padding-right:1px;\"/>"+"</div>"+"</td>"+"</tr>"+"<tr class=\"BUXNoPrint\" templatePart=\"freezeSide\"><td></td><td>"+"<div style=\"overflow-x:scroll; overflow-y:hidden;\" pflid=\""+this.m_lidNS+"\" pfslid=\"pfHorizontalScrollBar_"+this.m_lidNS+"\" tabIndex=\"-1\" onmouseup=\"stopEventBubble(event);\" onmousedown=\"stopEventBubble(event);\" onscroll=\""+getCognosViewerObjectRefAsString(this.m_viewerId)+".m_pinFreezeManager.getContainer('"+this.m_lid+"', "+this.m_cachedContainerIndex+").synchScroll()\">"+"<div style=\"height:2px;\">&nbsp;</div>"+"</div>"+"</td><td></td></tr></table>";
return _e92;
};
PinFreezeContainer.prototype.loadFreezeSideTemplateHTML=function(){
var _e93="<table pflid=\""+this.m_lidNS+"\" pfclid=\"pfContainer_"+this.m_lidNS+"\" cellpadding=\"0\" style=\"white-space:nowrap; width:0px; height:0px;\" cellspacing=\"0\"><tr>"+"<td class=\"BUXNoPrint\" valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfSideHeadings_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\"/></td>"+"<td valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfMainOutput_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\">"+"</div></td>"+"</tr>"+"<tr class=\"BUXNoPrint\"><td></td><td>"+"<div style=\"overflow-x:scroll; overflow-y:hidden;\" pflid=\""+this.m_lidNS+"\" pfslid=\"pfHorizontalScrollBar_"+this.m_lidNS+"\" tabIndex=\"-1\" onmouseup=\"stopEventBubble(event);\" onmousedown=\"stopEventBubble(event);\" onscroll=\""+getCognosViewerObjectRefAsString(this.m_viewerId)+".m_pinFreezeManager.getContainer('"+this.m_lid+"', "+this.m_cachedContainerIndex+").synchScroll()\">"+"<div style=\"height:2px;\">&nbsp;</div>"+"</div>"+"</td></tr></table>";
return _e93;
};
PinFreezeContainer.prototype.loadFreezeTopTemplateHTML=function(){
var _e94="<table pflid=\""+this.m_lidNS+"\" pfclid=\"pfContainer_"+this.m_lidNS+"\" cellpadding=\"0\" style=\"white-space:nowrap; width:0px; height:0px;\" cellspacing=\"0\">"+"<tr class=\"BUXNoPrint\"><td valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfTopHeadings_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\"/></td><td></td></tr>"+"<tr><td valign=top><div pflid=\""+this.m_lidNS+"\" pfslid=\"pfMainOutput_"+this.m_lidNS+"\" style=\"width:0px; height:0px; overflow-x:hidden; overflow-y:hidden; position:relative;\"></div></td>"+"<td class=\"BUXNoPrint\">"+"<div style=\"padding-right:1px;overflow-x:hidden; overflow-y:scroll;\" pflid=\""+this.m_lidNS+"\" pfslid=\"pfVerticalScrollBar_"+this.m_lidNS+"\" tabIndex=\"-1\" onmouseup=\"stopEventBubble(event);\" onmousedown=\"stopEventBubble(event);\" onscroll=\""+getCognosViewerObjectRefAsString(this.m_viewerId)+".m_pinFreezeManager.getContainer('"+this.m_lid+"', "+this.m_cachedContainerIndex+").synchVScroll()\">"+"<div style=\"padding-right:1px;\"/>"+"</div>"+"</td>"+"</tr></table>";
return _e94;
};
PinFreezeContainer.prototype.loadTemplateHTML=function(){
if(this.m_freezeSide&&this.m_freezeTop){
return this.loadFreezeBothTemplateHTML();
}else{
if(this.m_freezeSide){
return this.loadFreezeSideTemplateHTML();
}else{
if(this.m_freezeTop){
return this.loadFreezeTopTemplateHTML();
}
}
}
return null;
};
PinFreezeContainer.prototype.createSideHeadings=function(_e95){
var _e96=this.getSection("pfMainOutput");
var _e97=_e96.getAttribute("pfslid");
var _e98=this.getSection("pfSideHeadings");
var _e99=_e98.getAttribute("pfslid");
var _e9a=this.getMainOutputHomeCell();
if(!_e9a){
return;
}
var _e9b=_e95;
var _e9c=_e98;
var _e9d=this.isA11yEnabled(_e9b);
var _e9e=this.m_pinFreezeManager.deepCloneNode(_e9b);
_e9c.appendChild(_e9e);
var _e9f=this.getSectionHomeCell(_e98);
if(!_e9f){
return;
}
var _ea0=_e9b.getElementsByTagName("tbody");
var _ea1=_e9e.getElementsByTagName("tbody");
if(_ea0.length>0&&_ea1.length>0){
var _ea2=_ea0[0];
var _ea3=_ea1[0];
var _ea4=_ea2.firstChild;
var _ea5=_ea3.firstChild;
var _ea6=_e9a.rowSpan;
this.markAsCopy(_e9a,_e9f,_e97,_e99);
for(var r=0;r<_ea6;++r){
var _ea8=_ea3.rows[r];
this.removeCTX(_ea8);
}
for(var r=_ea6;r<_ea3.rows.length;++r){
var _ea9=_ea2.rows[r];
var _ea8=_ea3.rows[r];
_ea8.style.visibility="hidden";
for(var c=0;c<_ea8.cells.length;++c){
var _eab=_ea8.cells[c];
if(_e9d){
_eab=this.m_pinFreezeManager.removeIdAttribute(_eab);
}
if(_eab.getAttribute("type")=="datavalue"){
_eab.removeAttribute("ctx");
_eab.removeAttribute("uid");
_eab.removeAttribute("name");
}else{
var _eac=_ea9.cells[c];
this.markAsCopy(_eac,_eab,_e97,_e99);
}
}
_ea8.style.visibility="visible";
}
}
};
PinFreezeContainer.prototype.applyNeighbouringBorderStylesToHomeCell=function(_ead,_eae){
if(isFF()||isIE()){
if(_ead&&_ead.length&&_ead[0].cells&&_ead[0].cells.length>1){
if(this.m_freezeSide){
var _eaf=this.getBorderInfo(_ead[0].cells[1],"right");
if(_eaf){
_eae.style.borderRightWidth=_eaf.borderRightWidth;
_eae.style.borderRightStyle=_eaf.borderRightStyle;
_eae.style.borderRightColor=_eaf.borderRightColor;
}
}
if(this.m_freezeTop){
var _eaf=this.getBorderInfo(_ead[0].cells[1],"bottom");
if(_eaf){
_eae.style.borderBottomWidth=_eaf.borderBottomWidth;
_eae.style.borderBottomStyle=_eaf.borderBottomStyle;
_eae.style.borderBottomColor=_eaf.borderBottomColor;
}
}
}
}
};
PinFreezeContainer.prototype.createTopHeadings=function(_eb0){
var _eb1=this.getSection("pfMainOutput");
var _eb2=_eb1.getAttribute("pfslid");
var _eb3=this.getSection("pfTopHeadings");
var _eb4=_eb3.getAttribute("pfslid");
var _eb5=this.getMainOutputHomeCell();
if(!_eb5){
return;
}
var _eb6=_eb0;
var _eb7=_eb3;
var _eb8=this.isA11yEnabled(_eb6);
var _eb9=this.m_pinFreezeManager.deepCloneNode(_eb6);
_eb9.setAttribute("clonednode","true");
_eb7.appendChild(_eb9);
var _eba=_eb6.getElementsByTagName("tbody");
var _ebb=_eb9.getElementsByTagName("tbody");
if(_eba.length>0&&_ebb.length>0){
var _ebc=_eba[0];
var _ebd=_ebb[0];
var _ebe=_eb5.rowSpan;
for(var r=0;r<_ebd.rows.length;++r){
var _ec0=_ebc.rows[r];
var _ec1=_ebd.rows[r];
if(_eb8){
_ec1=this.m_pinFreezeManager.removeIdAttribute(_ec1);
}
_ec1.style.visibility="hidden";
for(var c=0;c<_ec1.cells.length;++c){
var _ec3=_ec1.cells[c];
if(r>_ebe||_ec3.getAttribute("type")=="datavalue"){
_ec3.removeAttribute("ctx");
_ec3.removeAttribute("uid");
_ec3.removeAttribute("name");
}else{
var _ec4=_ec0.cells[c];
this.markAsCopy(_ec4,_ec3,_eb2,_eb4);
if(_ec4===_eb5){
this.initializeHomeCellTabIndex(_ec3);
this.applyNeighbouringBorderStylesToHomeCell(_ebc.rows,_ec3);
}
}
}
_ec1.style.visibility="visible";
}
}
};
PinFreezeContainer.prototype.createHomeCellHeading=function(){
var _ec5=this.getSection("pfMainOutput");
var _ec6=_ec5.getAttribute("pfslid");
var _ec7=this.getSection("pfHomeCell");
var _ec8=_ec7.parentNode;
var _ec9=_ec7.getAttribute("pfslid");
var _eca=this.getMainOutputHomeCell();
if(!_eca){
return;
}
_ec8.style.height="100%";
var _ecb=this.getTopHeadingSectionHeight(_eca);
_ec7.style.height=_ecb-this.m_containerMargin.top+"px";
_ec7.style.width=this.getSideHeadingSectionWidth(_eca)-this.m_containerMargin.left+"px";
_ec7.style.marginTop=this.m_containerMargin.top+"px";
_ec7.style.marginLeft=this.m_containerMargin.left+"px";
var _ecc=_eca.parentNode;
var _ecd=_ecc.cloneNode(false);
var _ece=this._findBestGuessHomeCell(_eca);
var _ecf=document.createElement("div");
_ecf.style.width="100%";
_ecf.style.height="100%";
while(_eca.offsetLeft<=_ece.offsetLeft){
oTargetHomeCell=this.m_pinFreezeManager.deepCloneNode(_eca);
_eca.appendChild(_ecf);
oTargetHomeCell.style.width=_eca.offsetWidth+"px";
_eca.removeChild(_ecf);
oTargetHomeCell.style.borderBottomWidth="0px";
_ecd.appendChild(oTargetHomeCell);
this.markAsCopy(_eca,oTargetHomeCell,_ec6,_ec9);
if(_eca.nextSibling){
_eca=_eca.nextSibling;
}else{
break;
}
}
if(oTargetHomeCell){
oTargetHomeCell.style.borderRightWidth="0px";
}
var _ed0=_ecc.parentNode;
var _ed1=_ed0.cloneNode(false);
_ed1.appendChild(_ecd);
var _ed2=_ed0.parentNode;
var _ed3=_ed2.cloneNode(false);
_ed3.appendChild(_ed1);
_ed3.style.width="100%";
_ed3.style.height="100%";
_ed3.style.marginLeft="";
_ed3.style.marginTop="";
_ec7.appendChild(_ed3);
this.initializeHomeCellTabIndex(oTargetHomeCell);
this.applyNeighbouringBorderStylesToHomeCell(_ec5.firstChild.rows,_ec7);
};
PinFreezeContainer.prototype.markAsCopy=function(main,copy,_ed6,_ed7){
if(!main.pfCopy){
main.setAttribute("pfslid",_ed6);
main.pfCopy=[];
}
main.pfCopy.push(copy);
copy.pfMain=main;
copy.setAttribute("pfslid",_ed7);
};
PinFreezeContainer.prototype.getCopy=function(_ed8){
if(_ed8.pfCopy){
var _ed9={};
for(var i in _ed8.pfCopy){
var copy=_ed8.pfCopy[i];
if(copy.getAttribute){
var _edc=copy.getAttribute("pfslid");
if(_edc){
var _edd=PinFreezeContainer.getSectionNameFromSlid(_edc);
var _ede=this.getSection(_edd);
if(_ede&&PinFreezeContainer.isSectionVisible(_ede)){
_ed9[_edd]=copy;
}
}
}
}
if(_ed9["pfHomeCell"]){
return _ed9["pfHomeCell"];
}
for(i in _ed9){
return _ed9[i];
}
}
return null;
};
PinFreezeContainer.prototype.getMain=function(_edf){
if(_edf.pfMain){
return _edf.pfMain;
}
return null;
};
PinFreezeContainer.isSectionVisible=function(_ee0){
var node=_ee0;
if(!node){
return false;
}
while(node.parentNode&&!node.getAttribute("pfclid")){
if(node.style&&node.style.display==="none"){
return false;
}
node=node.parentNode;
}
return (!node.style||node.style.display!=="none");
};
PinFreezeContainer.prototype.getSectionStructure=function(){
var _ee2={isSideFrozen:false,isTopFrozen:false};
if(this.m_freezeSide){
var side=this.getSection("pfSideHeadings");
if(side){
_ee2.isSideFrozen=PinFreezeContainer.isSectionVisible(side);
}
}
if(this.m_freezeTop){
var top=this.getSection("pfTopHeadings");
if(top){
_ee2.isTopFrozen=PinFreezeContainer.isSectionVisible(top);
}
}
return _ee2;
};
PinFreezeContainer.prototype.checkSectionStructureChange=function(_ee5,_ee6){
if(_ee5.isSideFrozen!==_ee6.isSideFrozen||_ee5.isTopFrozen!==_ee6.isTopFrozen){
this.m_pinFreezeManager.sectionStructureChange();
}
};
PinFreezeContainer.prototype.freezeContainerInReport=function(_ee7){
this.cacheContainerAndSections(this.getContainerByLID(_ee7));
this.m_homeCellNodes={};
this.updateContainer();
};
PinFreezeContainer.prototype.frozenSectionsRequired=function(){
return (this.frozenSideHeadingsRequired()||this.frozenTopHeadingsRequired());
};
PinFreezeContainer.prototype.frozenSideHeadingsRequired=function(){
var _ee8=this.getSection("pfMainOutput");
if(_ee8){
if(this.m_freezeSide){
var _ee9=_ee8.scrollWidth;
return ((this.m_clientWidth<_ee9)||_ee9==0);
}
}
return false;
};
PinFreezeContainer.prototype.frozenTopHeadingsRequired=function(){
var _eea=this.getSection("pfMainOutput");
if(_eea){
if(this.m_freezeTop){
var _eeb=_eea.scrollHeight;
return ((this.m_clientHeight<_eeb)||_eeb==0);
}
}
return false;
};
PinFreezeContainer.prototype.showTemplatePart=function(_eec,_eed){
var _eee=this.getContainer().rows;
for(var r=0;r<_eee.length;++r){
if(_eee[r].getAttribute("templatePart")===_eec){
_eee[r].style.display=((_eed)?"":"none");
}else{
var _ef0=_eee[r].cells;
for(var c=0;c<_ef0.length;++c){
if(_ef0[c].getAttribute("templatePart")===_eec){
_ef0[c].style.display=((_eed)?"":"none");
}
}
}
}
};
PinFreezeContainer.prototype.showFreezeTopOnly=function(_ef2){
if(!(this.m_freezeTop&&this.m_freezeSide)){
return;
}
var _ef3=(_ef2.scrollWidth==0)?_ef2.clientWidth:_ef2.scrollWidth;
this.updateMainOutputWidth(_ef3);
this.setScrollX(_ef2,0);
if(this.getSection("pfTopHeadings")){
this.getSection("pfTopHeadings").style.width=_ef3+"px";
this.setScrollX(this.getSection("pfTopHeadings"),0);
}
this.showTemplatePart("freezeSide",false);
};
PinFreezeContainer.prototype.showFreezeSideOnly=function(_ef4){
if(!(this.m_freezeTop&&this.m_freezeSide)){
return;
}
var _ef5=(_ef4.scrollHeight==0)?_ef4.clientHeight:_ef4.scrollHeight;
this.updateMainOutputHeight(_ef5);
this.setScrollY(_ef4,0);
if(this.getSection("pfSideHeadings")){
this.getSection("pfSideHeadings").style.height=_ef5+"px";
this.setScrollY(this.getSection("pfSideHeadings"),0);
}
this.showTemplatePart("freezeTop",false);
};
PinFreezeContainer.prototype.showAll=function(){
if(!(this.m_freezeTop&&this.m_freezeSide)){
return;
}
this.showTemplatePart("freezeTop",true);
this.showTemplatePart("freezeSide",true);
};
PinFreezeContainer.prototype.showMainOutputOnly=function(_ef6){
this.updateMainOutputWidth((_ef6.scrollWidth==0)?_ef6.clientWidth:_ef6.scrollWidth);
this.updateMainOutputHeight((_ef6.scrollHeight==0)?_ef6.clientHeight:_ef6.scrollHeight);
this.setInitialScrollPosition(_ef6,0,0);
if(this.m_freezeSide&&this.m_freezeTop){
this.getSection("pfHomeCell").style.display="none";
}
if(this.m_freezeSide){
this.getSection("pfSideHeadings").style.display="none";
this.getSection("pfHorizontalScrollBar").style.display="none";
}
if(this.m_freezeTop){
this.getSection("pfTopHeadings").style.display="none";
this.getSection("pfVerticalScrollBar").style.display="none";
}
};
PinFreezeContainer.prototype.getWrap=function(el){
if(el.currentStyle){
return el.currentStyle.whiteSpace;
}else{
if(window.getComputedStyle){
return window.getComputedStyle(el,null).getPropertyValue("white-space");
}else{
return el.style.whiteSpace;
}
}
};
PinFreezeContainer.prototype.getStyleDisplay=function(el){
if(el.currentStyle){
return el.currentStyle.display;
}else{
if(window.getComputedStyle){
return window.getComputedStyle(el,null).getPropertyValue("display");
}else{
return el.style.display;
}
}
};
PinFreezeContainer.prototype.headingsCreated=function(_ef9){
return _ef9.firstChild?true:false;
};
PinFreezeContainer.prototype.updateContainer=function(){
var _efa=this.getSection("pfMainOutput");
var _efb=this.getMainOutputHomeCell();
if(_efb){
if(this.m_scrollableClientHeight===this.m_clientHeight||!this.m_scrollableClientHeight){
this.m_scrollableClientHeight-=_efb.offsetHeight;
var _efc=this.calculateMinCrossTabScrollableClientHeight();
if(_efc>this.m_scrollableClientHeight){
this.m_scrollableClientHeight=_efc;
}
}
if(this.m_scrollableClientWidth===this.m_clientWidth||!this.m_scrollableClientWidth){
this.m_scrollableClientWidth-=this.getHomeCellOffsetWidth(_efb);
}
}
if(_efa&&_efb){
this.showAll();
if(this.frozenSectionsRequired()){
this.updateMainOutputSize();
this.initializeHomeCellTabIndex(_efb);
if(this.m_freezeSide){
var _efd=this.getSection("pfSideHeadings");
if(!this.headingsCreated(_efd)){
this.createSideHeadings(this.m_cachedBaseContainer);
if(this.m_freezeTop){
this.initializeTouchScrolling(_efd);
}
}
var _efe=this.getSection("pfHorizontalScrollBar");
_efe.scrollLeft="0px";
}
if(this.m_freezeTop){
var _eff=this.getSection("pfTopHeadings");
if(!this.headingsCreated(_eff)){
this.createTopHeadings(this.m_cachedBaseContainer);
if(this.m_freezeSide){
this.initializeTouchScrolling(_eff);
}
}
var _f00=this.getSection("pfVerticalScrollBar");
_f00.scrollTop="0px";
}
if(this.m_freezeSide&&this.m_freezeTop){
var _f01=this.getSection("pfHomeCell");
if(!this.headingsCreated(_f01)){
this.createHomeCellHeading();
}
_f01.style.display="";
}
var _f02=this.updateSideHeadingSize(_efb);
var _f03=this.updateTopHeadingSize(_efb);
if(!this.frozenSectionsRequired()){
this.showMainOutputOnly(_efa);
}
this.setInitialScrollPosition(_efa,_f02,_f03);
if(this.m_freezeTop&&this.m_freezeSide){
this.setInitialScrollPosition(this.getSection("pfSideHeadings"),0,_f03);
this.setInitialScrollPosition(this.getSection("pfTopHeadings"),_f02,0);
}
this.initializeTouchScrolling(_efa);
}else{
this.showMainOutputOnly(_efa);
this.removeTouchScrolling();
}
this.updateTabIndexValues();
}
};
PinFreezeContainer.prototype.calculateMinCrossTabScrollableClientHeight=function(){
var _f04=0;
if(this.m_cachedPFContainer){
var _f05=this.getElementByLID(this.m_cachedPFContainer,"table",this.m_lid+this.m_viewerId);
if(_f05){
var _f06=0;
for(var r=0;r<_f05.rows.length;r++){
var row=_f05.rows[r];
for(var c=0;c<row.cells.length;c++){
var cell=row.cells[c];
if(cell.getAttribute("type")=="datavalue"){
_f06++;
if(cell.childNodes.length===1&&cell.childNodes[0].getAttribute&&cell.childNodes[0].getAttribute("class")==="textItem"){
_f04=_f04+cell.offsetHeight;
}else{
_f06++;
var _f0b=this.getSection("pfVerticalScrollBar");
if(_f0b){
_f04=_f0b.offsetWidth*2;
}
}
break;
}
}
if(_f06>=2){
break;
}
}
}
}
return _f04;
};
PinFreezeContainer.prototype.updateSideHeadingSize=function(_f0c){
var _f0d=0;
if(this.m_freezeSide){
var _f0e=this.getSection("pfMainOutput");
if(!_f0e){
return 0;
}
if(!this.frozenSideHeadingsRequired()){
this.showFreezeTopOnly(_f0e);
return 0;
}
var _f0f=this.getSection("pfSideHeadings");
_f0d=this.getSideHeadingSectionWidth(_f0c);
var _f10=this.getSection("pfHorizontalScrollBar");
var _f11=this.getSectionHomeCell(_f0f);
if(_f0f.style.display=="none"){
_f0f.style.display="";
_f10.style.display="";
}
_f0f.style.width=_f0d+"px";
_f0f.style.height=_f0e.clientHeight+"px";
}
return _f0d;
};
PinFreezeContainer.prototype.updateTopHeadingSize=function(_f12){
var _f13=0;
if(this.m_freezeTop){
var _f14=this.getSection("pfMainOutput");
if(!_f14){
return 0;
}
if(!this.frozenTopHeadingsRequired()){
this.showFreezeSideOnly(_f14);
return 0;
}
var _f15=this.getSection("pfTopHeadings");
_f13=this.getTopHeadingSectionHeight(_f12);
var _f16=this.getSection("pfVerticalScrollBar");
var _f17=this.getSectionHomeCell(_f15);
if(_f15.style.display=="none"){
_f15.style.display="";
_f16.style.display="";
}
_f15.style.height=_f13+"px";
_f15.style.width=_f14.clientWidth+"px";
}
return _f13;
};
PinFreezeContainer.prototype.setScrollX=function(_f18,_f19){
if(getElementDirection(_f18)==="rtl"){
setScrollRight(_f18,_f19);
}else{
setScrollLeft(_f18,_f19);
}
};
PinFreezeContainer.prototype.setScrollY=function(_f1a,_f1b){
_f1a.scrollTop=_f1b;
};
PinFreezeContainer.prototype.setInitialScrollPosition=function(_f1c,_f1d,_f1e){
if(getElementDirection(_f1c)==="rtl"){
setScrollRight(_f1c,_f1d);
}else{
setScrollLeft(_f1c,_f1d);
}
_f1c.scrollTop=_f1e;
};
PinFreezeContainer.prototype.getScrollableClientWidth=function(){
return this.m_scrollableClientWidth;
};
PinFreezeContainer.prototype.setScrollableClientWidth=function(_f1f){
this.m_scrollableClientWidth=_f1f;
};
PinFreezeContainer.prototype.getContainerWidth=function(){
return this.m_addedFixedWidth?this.m_addedFixedWidth:this.m_clientWidth;
};
PinFreezeContainer.prototype.getClientWidth=function(){
return this.m_clientWidth;
};
PinFreezeContainer.prototype.getScrollableClientHeight=function(){
return this.m_scrollableClientHeight;
};
PinFreezeContainer.prototype.setScrollableClientHeight=function(_f20){
this.m_scrollableClientHeight=_f20;
};
PinFreezeContainer.prototype.getClientHeight=function(){
return this.m_clientHeight;
};
PinFreezeContainer.prototype.clientHeight=function(_f21){
return _f21.clientHeight;
};
PinFreezeContainer.prototype.findBestContainerHeight=function(_f22){
if(this.m_freezeTop&&this.m_cachedReportDiv){
var _f23=this.m_cachedReportDiv.parentNode;
if(_f23){
var _f24=this._findRestOfPageHeight(this.getContainer());
return _f22-_f24-(this.c_pageMargin/2)-this.m_containerMargin.top;
}
}
return _f22-this.c_pageMargin;
};
PinFreezeContainer.prototype.findBestContainerWidth=function(_f25){
var node=this.getContainer();
while(node&&node.nodeName.toLowerCase()!="td"&&node.getAttribute("id")!=("mainViewerTable"+this.m_viewerId)){
node=node.parentNode;
}
if(!node){
return -1;
}
if(node.nodeName.toLowerCase()=="td"){
var _f27=0;
var _f28=node.parentNode.childNodes;
for(var i=0;i<_f28.length;i++){
if(_f28[i]!==node){
_f27+=_f28[i].clientWidth;
}
}
return _f25-_f27-(this.c_pageMargin/2);
}
return _f25;
};
PinFreezeContainer.prototype._findRestOfPageHeight=function(node){
var _f2b=0;
var _f2c=node.parentNode;
if(!_f2c){
return _f2b;
}
if(_f2c.childNodes.length>1){
for(var i=0;i<_f2c.childNodes.length;i++){
var _f2e=_f2c.childNodes[i];
if(_f2e.nodeType==1){
var _f2f=this.getStyleDisplay(_f2e);
if(_f2e!=node&&!isNaN(_f2e.clientHeight)&&_f2f!="none"&&_f2f!="table-cell"){
_f2b+=this.clientHeight(_f2e);
}
}
}
}
if(node.getAttribute("id")!=("mainViewerTable"+this.m_viewerId)){
_f2b+=this._findRestOfPageHeight(_f2c);
}
return _f2b;
};
PinFreezeContainer.prototype.resize=function(_f30,_f31,_f32,_f33){
if(this.m_fixedWidth&&this.m_fixedHeight){
return;
}
_f30=(this.m_fixedWidth)?this.m_fixedWidth:_f30;
_f31=(this.m_fixedHeight)?this.m_fixedHeight:_f31;
var _f34=this.getSectionStructure();
if(this.m_sectionCache&&this.m_cachedPFContainer){
var _f35=0;
if(_f31!==0){
_f35=this.findBestContainerHeight(_f31);
if(_f32&&_f35<300){
_f35=300;
}else{
if(_f35<100){
_f35=100;
}
}
}
this.m_clientHeight=_f35>0?_f35:this.m_clientHeight;
var _f36=0;
if(_f30!==0){
_f36=this.findBestContainerWidth(_f30);
}
this.m_clientWidth=(_f36>0)?_f36-5-(this.c_pageMargin/2):this.m_clientWidth;
var _f37=this.getSection("pfMainOutput");
var _f38=this.getSectionHomeCell(_f37);
if(_f38){
this.m_scrollableClientWidth=this.m_clientWidth-this.getSideHeadingSectionWidth(_f38);
this.m_scrollableClientHeight=this.m_clientHeight-_f38.offsetHeight;
}
if(_f33){
var _f39=getElementsByAttribute(this.m_cachedPFContainer,"div","pflid",_f33.lid);
if(_f39){
var node=_f39[0];
while(node.nodeName.toLowerCase()!="table"){
node=node.parentNode;
}
node.style.width=_f33.width+"px";
}
}
this.updateContainer();
}else{
this.m_clientWidth=_f30-this.c_pageMargin;
this.m_clientHeight=_f31-this.c_pageMargin;
}
var _f3b=this.getSectionStructure();
this.checkSectionStructureChange(_f34,_f3b);
};
PinFreezeContainer.prototype.updateMainOutputSize=function(){
if(this.m_freezeSide&&this.m_freezeTop){
if(this.frozenSideHeadingsRequired()){
this.updateMainOutputWidth(this.getScrollableClientWidth());
}
if(this.frozenTopHeadingsRequired()){
this.updateMainOutputHeight(this.getScrollableClientHeight());
}
}else{
if(this.m_freezeSide){
this.updateMainOutputWidth(this.getScrollableClientWidth());
}else{
if(this.m_freezeTop){
this.updateMainOutputHeight(this.getScrollableClientHeight());
}
}
}
};
PinFreezeContainer.prototype.updateMainOutputWidth=function(_f3c){
var _f3d=this.getSection("pfMainOutput");
if(!_f3d){
return;
}
if(this.m_freezeSide==true){
_f3d.style.width=(_f3c+"px");
if(this.m_freezeTop==false||!this.frozenTopHeadingsRequired()){
_f3d.style.height=_f3d.firstChild.clientHeight+"px";
}
var _f3e=this.getSection("pfHorizontalScrollBar");
if(_f3e){
_f3e.style.width=(_f3c+"px");
var _f3f=_f3e.firstChild;
if(_f3f){
var _f40=this.getSectionHomeCell(_f3d);
var _f41=_f3d.scrollWidth-this.getHomeCellOffsetWidth(_f40);
_f3f.style.width=_f41+"px";
}
}
}
};
PinFreezeContainer.prototype.updateMainOutputHeight=function(_f42){
var _f43=this.getSection("pfMainOutput");
if(!_f43){
return;
}
_f43.style.height=(_f42+"px");
if(!this.m_freezeSide||!this.frozenSideHeadingsRequired()){
_f43.style.width=_f43.firstChild.clientWidth+2+"px";
}
var _f44=this.getSection("pfVerticalScrollBar");
if(_f44){
_f44.style.height=(_f42+"px");
var _f45=_f44.firstChild;
if(_f45){
var _f46=this.getSectionHomeCell(_f43);
var _f47=_f43.scrollHeight-_f46.offsetHeight;
_f45.style.height=_f47+"px";
}
}
};
PinFreezeContainer.prototype.getElementByLID=function(_f48,tag,lid){
var _f4b=getElementsByAttribute(_f48,tag,"lid",lid);
if(_f4b.length>0){
return _f4b[0];
}
return null;
};
PinFreezeContainer.prototype.getContainerByLID=function(_f4c){
var _f4d=getElementsByAttribute(_f4c,"table","pfclid","pfContainer_"+this.m_lidNS);
if(_f4d.length>0){
return _f4d[0];
}
return null;
};
PinFreezeContainer.prototype.getSectionByLID=function(_f4e,_f4f){
var _f50=getElementsByAttribute(_f4e,"div","pfslid",_f4f+"_"+this.m_lidNS);
if(_f50.length>0){
return _f50[0];
}
return null;
};
PinFreezeContainer.getSectionNameFromSlid=function(slid){
return slid?slid.split("_")[0]:null;
};
PinFreezeContainer.getLidFromSlid=function(slid){
return slid.split("_")[1];
};
PinFreezeContainer.nodeToSlid=function(_f53){
while(_f53.parentNode&&!_f53.getAttribute("pfslid")){
_f53=_f53.parentNode;
}
if(_f53.getAttribute){
return _f53.getAttribute("pfslid");
}
return null;
};
PinFreezeContainer.prototype.cacheContainerAndSections=function(_f54){
if(!_f54){
return _f54;
}
this.m_cachedPFContainer=_f54;
var _f55=getElementsByAttribute(this.m_cachedPFContainer,"div","pflid",this.m_lidNS);
this.m_sectionCache={};
for(var i=0;i<_f55.length;++i){
var key=_f55[i].getAttribute("pfslid");
key=key.split("_",1);
this.m_sectionCache[key]=_f55[i];
}
return _f54;
};
PinFreezeContainer.prototype.getContainer=function(){
return this.m_cachedPFContainer;
};
PinFreezeContainer.prototype.getSection=function(key){
if(!this.m_sectionCache){
return null;
}
if(!this.m_sectionCache[key]){
this.m_sectionCache[key]=this.getSectionByLID(this.m_cachedPFContainer,key);
}
return this.m_sectionCache[key];
};
PinFreezeContainer.prototype.initializeHomeCellTabIndex=function(_f59){
var slid=PinFreezeContainer.nodeToSlid(_f59);
if(!this.m_homeCellNodes[slid]){
var _f5b=getElementsByAttribute(_f59,"*","tabIndex","*");
for(var i in _f5b){
if(!_f5b[i].getAttribute("widgetid")){
this.m_homeCellNodes[slid]=_f5b[i];
break;
}
}
}
};
PinFreezeContainer.prototype.updateTabIndexValues=function(){
if(this.isContainerFrozen()){
for(var slid in this.m_homeCellNodes){
var _f5e=this.m_pinFreezeManager.isNodeVisible(this.m_homeCellNodes[slid])?"0":"-1";
this.m_homeCellNodes[slid].setAttribute("tabIndex",_f5e);
}
}else{
for(var slid in this.m_homeCellNodes){
var _f5e=(PinFreezeContainer.getSectionNameFromSlid(slid)==="pfMainOutput")?"0":"-1";
this.m_homeCellNodes[slid].setAttribute("tabIndex",_f5e);
}
}
};
PinFreezeContainer.prototype.getSectionHomeCell=function(_f5f){
if(_f5f){
var _f60=this.getElementByLID(_f5f,"table",this.m_lid+this.m_viewerId);
if(_f60&&_f60.rows.length&&_f60.rows[0].cells.length){
return _f60.rows[0].cells[0];
}
}
return null;
};
PinFreezeContainer.prototype.getMainOutputHomeCell=function(){
var _f61=this.getSection("pfMainOutput");
if(!_f61){
_f61=this.getSectionByLID(this.m_cachedPFContainer,"pfMainOutput");
}
return this.getSectionHomeCell(_f61);
};
PinFreezeContainer.prototype.getChildPosition=function(_f62,_f63){
for(var i=0;i<_f62.childNodes.length;++i){
if(_f62.childNodes[i]==_f63){
return i;
}
}
return -1;
};
PinFreezeContainer.prototype.insertAt=function(_f65,_f66,_f67){
if(_f67==_f65.childNodes.length){
_f65.appendChild(_f66);
}else{
_f65.insertBefore(_f66,_f65.childNodes[_f67]);
}
};
PinFreezeContainer.prototype.synchScroll=function(){
if(!this.m_cachedPFContainer){
return;
}
var _f68=this.getMainOutputHomeCell();
var _f69=this.getSection("pfMainOutput");
var _f6a=this.getSection("pfSideHeadings");
if(_f6a!=null){
var _f6b=this.getSection("pfHorizontalScrollBar");
if(_f6b){
var _f6c=this.getSideHeadingSectionWidth(_f68);
if(getElementDirection(_f69)==="rtl"){
_f6c=0;
}
setScrollLeft(_f69,getScrollLeft(_f6b)+_f6c);
if(this.m_freezeTop){
setScrollLeft(this.getSection("pfTopHeadings"),getScrollLeft(_f6b)+_f6c);
}
}
}
};
PinFreezeContainer.prototype.updateScroll=function(_f6d){
var slid=PinFreezeContainer.nodeToSlid(_f6d);
if(!slid){
return;
}
var _f6f=PinFreezeContainer.getSectionNameFromSlid(slid);
if(!_f6f){
return;
}
var _f70=document.getElementById("CVReport"+this.m_viewerId);
if(!_f70){
return;
}
if(!this.m_cachedPFContainer){
return;
}
var _f71=_f6d.parentNode;
if(_f71){
var _f72=_f71.tagName.toLowerCase();
if(_f72==="td"||_f72==="th"){
var _f73=this.getMainOutputHomeCell();
var _f74=this.getSection("pfMainOutput");
if(_f6f==="pfMainOutput"||_f6f==="pfTopHeadings"){
var _f75=this.getSection("pfHorizontalScrollBar");
if(_f75){
var _f76=PinFreezeContainer.calculateNewPosition(_f71.offsetLeft,_f71.offsetWidth,getScrollLeft(_f74),_f74.offsetWidth);
var _f77=this.getHomeCellOffsetWidth(_f73);
if(getElementDirection(_f74)==="rtl"){
_f77=0;
}
setScrollLeft(_f75,_f76-_f77);
setScrollLeft(_f74,_f76);
}
}
if(_f6f==="pfMainOutput"||_f6f==="pfSideHeadings"){
var _f78=this.getSection("pfVerticalScrollBar");
if(_f78){
var _f79=PinFreezeContainer.calculateNewPosition(_f71.offsetTop,_f71.offsetHeight,_f74.scrollTop,_f74.offsetHeight);
_f78.scrollTop=_f79-_f73.offsetHeight;
_f74.scrollTop=_f79;
}
}
}
}
};
PinFreezeContainer.calculateNewPosition=function(_f7a,_f7b,_f7c,_f7d){
var _f7e=_f7a+_f7b;
var _f7f=_f7c+_f7d;
if(_f7c>_f7a){
return _f7a;
}else{
if(_f7f<_f7e){
if(_f7b>_f7d){
return _f7a;
}
return _f7e-_f7d;
}
}
return _f7c;
};
PinFreezeContainer.prototype.synchVScroll=function(){
if(!this.m_cachedPFContainer){
return;
}
var _f80=this.getMainOutputHomeCell();
var _f81=this.getSection("pfMainOutput");
var _f82=this.getSection("pfTopHeadings");
if(_f82!=null){
var _f83=this.getSection("pfVerticalScrollBar");
if(_f83){
_f81.scrollTop=_f83.scrollTop+this.getTopHeadingSectionHeight(_f80);
if(this.m_freezeSide){
this.getSection("pfSideHeadings").scrollTop=_f83.scrollTop+this.getTopHeadingSectionHeight(_f80);
}
}
}
};
PinFreezeContainer.prototype.getTopHeadingSectionHeight=function(_f84){
return _f84.offsetHeight+_f84.offsetTop+this.m_containerMargin.top;
};
PinFreezeContainer.prototype._findBestGuessHomeCell=function(_f85){
if(this.m_bestGuessHomeCell){
return this.m_bestGuessHomeCell;
}
if(_f85){
var _f86=_f85.parentNode.parentNode;
var _f87=_f85.rowSpan?(_f85.rowSpan):1;
var tr=_f86.childNodes[_f87];
if(tr){
var _f89=tr.childNodes.length;
var _f8a=null;
var td=null;
for(var i=0;i<_f89;i++){
td=tr.childNodes[i];
if(td.getAttribute("type")=="datavalue"){
break;
}
_f8a=td;
}
if(_f8a){
this.m_bestGuessHomeCell=_f8a;
return this.m_bestGuessHomeCell;
}
}else{
return _f85;
}
}
return null;
};
PinFreezeContainer.prototype.getHomeCellOffsetWidth=function(_f8d){
var _f8e=this._findBestGuessHomeCell(_f8d);
return _f8e?_f8e.offsetWidth:0;
};
PinFreezeContainer.prototype.getSideHeadingSectionWidth=function(_f8f){
var _f90=this._findBestGuessHomeCell(_f8f);
if(_f90){
return _f90.offsetWidth+_f90.offsetLeft+this.m_containerMargin.left;
}else{
return _f8f.offsetWidth+_f8f.offsetLeft;
}
};
PinFreezeContainer.prototype.isContainerFrozen=function(){
return (this.m_freezeTop||this.m_freezeSide);
};
PinFreezeContainer.prototype.unfreeze=function(_f91){
var _f92=this.getContainerByLID(_f91);
this.m_freezeTop=false;
this.m_freezeSide=false;
if(_f92){
var _f93=_f92.parentNode;
pfMainOutput=this.getSectionByLID(_f92,"pfMainOutput");
if(pfMainOutput&&_f93){
if(_f92.style.border!==""){
pfMainOutput.firstChild.style.border=_f92.style.border;
_f92.style.border="";
}
if(this.m_wrapFlag){
var _f94=pfMainOutput.firstChild.getElementsByTagName("span");
if(_f94){
for(var k=0;k<_f94.length;k++){
_f94[k].style.whiteSpace="";
}
}
this.m_wrapFlag=false;
}
this.updateTabIndexValues();
if(this.m_cachedBaseContainer.getAttribute("authoredFixedWidth")){
this.m_cachedBaseContainer.removeAttribute("authoredFixedWidth");
this.m_cachedBaseContainer.style.width="auto";
this.m_addedFixedWidth=null;
}
if(this.m_cachedBaseContainer.getAttribute("authoredFixedHeight")){
this.m_cachedBaseContainer.removeAttribute("authoredFixedHeight");
this.m_cachedBaseContainer.style.height="auto";
this.m_addedFixedHeight=null;
}
_f93.replaceChild(this.m_pinFreezeManager.deepCloneNode(pfMainOutput.firstChild),_f92);
}
}
};
PinFreezeContainer.prototype.getBorderInfo=function(el,_f97){
var _f98={};
var _f99="border-"+_f97+"-";
var _f9a="border"+_f97.charAt(0).toUpperCase()+_f97.substring(1);
if(el.currentStyle){
_f98[_f9a+"Width"]=el.currentStyle[_f9a+"Width"];
_f98[_f9a+"Style"]=el.currentStyle[_f9a+"Style"];
_f98[_f9a+"Color"]=el.currentStyle[_f9a+"Color"];
}else{
if(window.getComputedStyle){
_f98[_f9a+"Width"]=window.getComputedStyle(el,null).getPropertyValue(_f99+"width");
_f98[_f9a+"Style"]=window.getComputedStyle(el,null).getPropertyValue(_f99+"style");
_f98[_f9a+"Color"]=window.getComputedStyle(el,null).getPropertyValue(_f99+"color");
}else{
return null;
}
}
return _f98;
};
PinFreezeContainer.prototype.isA11yEnabled=function(_f9b){
return (_f9b.getAttribute("role")==="grid");
};
PinFreezeContainer.isElementInMainOutput=function(_f9c){
var _f9d=PinFreezeContainer.nodeToSlid(_f9c);
if(_f9d){
return (_f9d.indexOf("pfMainOutput_")===0);
}
return false;
};
PinFreezeContainer.prototype.removeCTX=function(_f9e){
_f9e.removeAttribute("ctx");
var _f9f=getElementsByAttribute(_f9e,"*","ctx","*");
if(_f9f&&_f9f.length){
for(var i=0;i<_f9f.length;i++){
_f9f[i].removeAttribute("ctx");
}
}
};
PinFreezeContainer.prototype.initializeTouchScrolling=function(_fa1){
if(!this.m_pinFreezeManager.isIWidgetMobile()){
return;
}
if(_fa1){
_fa1.m_pinFreezeContainer=this;
if(document.attachEvent){
_fa1.attachEvent("touchstart",this.touchStart);
_fa1.attachEvent("touchmove",this.touchMove);
_fa1.attachEvent("touchend",this.touchEnd);
}else{
_fa1.addEventListener("touchstart",this.touchStart,false);
_fa1.addEventListener("touchmove",this.touchMove,false);
_fa1.addEventListener("touchend",this.touchEnd,false);
}
}
};
PinFreezeContainer.prototype.removeTouchScrolling=function(){
if(!this.m_pinFreezeManager.isIWidgetMobile()){
return;
}
this.removeTouchScrollingEvents(this.getSection("pfMainOutput"));
this.removeTouchScrollingEvents(this.getSection("pfSideHeadings"));
this.removeTouchScrollingEvents(this.getSection("pfTopHeadings"));
};
PinFreezeContainer.prototype.removeTouchScrollingEvents=function(_fa2){
if(!this.m_pinFreezeManager.isIWidgetMobile()){
return;
}
if(_fa2){
if(document.detachEvent){
_fa2.detachEvent("touchstart",this.touchStart);
_fa2.detachEvent("touchmove",this.touchMove);
_fa2.detachEvent("touchend",this.touchEnd);
}else{
_fa2.removeEventListener("touchstart",this.touchStart,false);
_fa2.removeEventListener("touchmove",this.touchMove,false);
_fa2.removeEventListener("touchend",this.touchEnd,false);
}
}
};
PinFreezeContainer.prototype.touchMove=function(e){
if(this.m_pinFreezeContainer&&e&&e.changedTouches&&e.touches&&e.touches.length==1){
var _fa4=e.changedTouches[0];
if(_fa4&&_fa4.clientX&&_fa4.clientY){
var _fa5=parseInt(_fa4.clientX);
var _fa6=parseInt(_fa4.clientY);
if(this.m_pinFreezeContainer.touchMoveHandler(_fa5,_fa6)){
return stopEventBubble(e);
}
}
}
};
PinFreezeContainer.prototype.touchStart=function(e){
if(this.m_pinFreezeContainer&&e&&e.changedTouches&&e.touches&&e.touches.length==1){
var _fa8=e.changedTouches[0];
if(_fa8&&_fa8.clientX&&_fa8.clientY){
var _fa9=parseInt(_fa8.clientX);
var _faa=parseInt(_fa8.clientY);
this.m_pinFreezeContainer.touchStartHandler(_fa9,_faa);
}
}
};
PinFreezeContainer.prototype.touchStartHandler=function(_fab,_fac){
this.touchScrollSections=false;
this.touchPreviousX=_fab;
this.touchPreviousY=_fac;
};
PinFreezeContainer.prototype.touchEnd=function(e){
if(this.m_pinFreezeContainer&&this.m_pinFreezeContainer.touchEndHandler()){
stopEventBubble(e);
}
};
PinFreezeContainer.prototype.touchEndHandler=function(){
var _fae=this.touchScrollSections;
this.touchScrollSections=false;
this.touchPreviousX=-1;
this.touchPreviousY=-1;
return _fae;
};
PinFreezeContainer.prototype.touchMoveHandler=function(_faf,_fb0){
var _fb1=this.getSection("pfMainOutput");
if(!_fb1){
return;
}
var _fb2=this.getSectionHomeCell(_fb1);
var _fb3=this.getTopHeadingSectionHeight(_fb2);
var _fb4=this.getSideHeadingSectionWidth(_fb2);
var _fb5=_fb0-this.touchPreviousY;
var _fb6=_faf-this.touchPreviousX;
if(this.touchScrollSections){
if(_fb5!=0){
var _fb7=_fb1.scrollTop-_fb5;
_fb7=(_fb7>_fb3)?_fb7:_fb3;
_fb1.scrollTop=_fb7;
var _fb8=this.getSection("pfSideHeadings");
if(_fb8){
_fb8.scrollTop=_fb7;
}
}
if(_fb6!=0){
var _fb9=_fb1.scrollLeft-_fb6;
_fb9=(_fb9>_fb4)?_fb9:_fb4;
_fb1.scrollLeft=_fb9;
var _fba=this.getSection("pfTopHeadings");
if(_fba){
_fba.scrollLeft=_fb9;
}
}
}else{
this.firstTouchMove(_fb1,_fb6,_fb5,_fb4,_fb3);
}
this.touchPreviousX=_faf;
this.touchPreviousY=_fb0;
return this.touchScrollSections;
};
PinFreezeContainer.prototype.firstTouchMove=function(_fbb,_fbc,_fbd,_fbe,_fbf){
var _fc0=this.mostlyVerticalTouchMove(_fbc,_fbd);
var _fc1=PinFreezeContainer.isSectionVisible(this.getSection("pfTopHeadings"));
var _fc2=PinFreezeContainer.isSectionVisible(this.getSection("pfSideHeadings"));
if(_fc0&&(!_fc1||(_fbd>0&&_fbb.scrollTop<=_fbf)||(_fbd<0&&_fbb.scrollTop+_fbb.clientHeight>=_fbb.scrollHeight))){
this.touchScrollSections=false;
}else{
if(!_fc0&&(!_fc2||(_fbc>0&&_fbb.scrollLeft<=_fbe)||(_fbc<0&&_fbb.scrollLeft+_fbb.clientWidth>=_fbb.scrollWidth))){
this.touchScrollSections=false;
}else{
this.touchScrollSections=true;
}
}
};
PinFreezeContainer.prototype.mostlyVerticalTouchMove=function(_fc3,_fc4){
var _fc5=(_fc3>0)?_fc3:0-_fc3;
var _fc6=(_fc4>0)?_fc4:0-_fc4;
return (_fc6>_fc5);
};
PinFreezeContainer.prototype.destroy=function(){
this.removeTouchScrolling();
GUtil.destroyProperties(this);
};
function PinFreezeManager(oCV){
this.m_oCV=oCV;
this.m_viewerId=oCV.getId();
this.m_frozenInfo=null;
this.m_lastWidthProcessed=0;
this.m_lastHeightProcessed=0;
this.c_resizeTweekLimit=5;
this.m_repaintOnVisible=false;
};
PinFreezeManager.prototype.addContainerObject=function(lid,_fc9,_fca,_fcb,_fcc){
if(_fc9||_fca){
if(!this.m_frozenInfo){
this.m_frozenInfo={};
}
if(!this.m_frozenInfo[lid]){
this._createDefaultFrozenInfo(lid);
}
this.m_frozenInfo[lid].freezeTop=_fc9;
this.m_frozenInfo[lid].freezeSide=_fca;
var _fcd=this.newContainer(lid,_fc9,_fca,_fcb,_fcc);
this.m_frozenInfo[lid].pinFreezeContainers.push(_fcd);
return _fcd;
}
return null;
};
PinFreezeManager.prototype.newContainer=function(lid,_fcf,_fd0,_fd1,_fd2){
return new PinFreezeContainer(this,lid,this.m_viewerId,_fcf,_fd0,_fd1,_fd2);
};
PinFreezeManager.prototype.clearPinInfo=function(lid){
if(!this.m_frozenInfo){
return;
}
if(lid){
if(this.m_frozenInfo[lid]){
delete this.m_frozenInfo[lid];
}
}else{
delete this.m_frozenInfo;
this.m_frozenInfo=null;
}
};
PinFreezeManager.prototype._createDefaultFrozenInfo=function(lid){
this.m_frozenInfo[lid]={"lid":lid,"freezeTop":false,"freezeSide":false,"pinFreezeContainers":[],"childContainers":{}};
};
PinFreezeManager.prototype._resetFrozenInfo=function(lid){
var _fd6=this.m_frozenInfo[lid];
if(_fd6){
delete _fd6.pinFreezeContainers;
_fd6.pinFreezeContainers=[];
_fd6.freezeTop=false;
_fd6.freezeSide=false;
}
};
PinFreezeManager.prototype.prepopulateFrozenInfo=function(_fd7){
var _fd8=getDescendantElementsByAttribute(_fd7,"table","lid","",false,-1,new RegExp("[\\s\\S]*"));
if(_fd8){
if(!this.m_frozenInfo){
this.m_frozenInfo={};
}
for(var i=0;i<_fd8.length;i++){
var _fda=_fd8[i];
if(_fda.getAttribute("id")=="rt"+this.m_viewerId){
continue;
}
var lid=this.removeNamespace(_fda.getAttribute("lid"));
if(this.m_frozenInfo[lid]&&this.m_frozenInfo[lid].childContainers){
continue;
}
if(!this.m_frozenInfo[lid]){
this._createDefaultFrozenInfo(lid);
}
if(!this.m_frozenInfo[lid].childContainers){
this.m_frozenInfo[lid].childContainers={};
}
var _fdc=getDescendantElementsByAttribute(_fda,"table","lid","",false,-1,new RegExp("[\\s\\S]*"));
if(_fdc){
for(var _fdd=0;_fdd<_fdc.length;_fdd++){
var _fde=_fdc[_fdd];
var _fdf=this.removeNamespace(_fde.getAttribute("lid"));
if(!this.m_frozenInfo[lid].childContainers[_fdf]){
var _fe0=_fde.parentNode;
while(_fe0&&!_fe0.getAttribute("lid")){
_fe0=_fe0.parentNode;
}
if(_fe0&&this.removeNamespace(_fe0.getAttribute("lid"))==lid){
this.m_frozenInfo[lid].childContainers[_fdf]=true;
}
}
}
}
}
this._updateParentContainerInfo();
}
};
PinFreezeManager.prototype._updateParentContainerInfo=function(){
for(var _fe1 in this.m_frozenInfo){
var _fe2=this.m_frozenInfo[_fe1].childContainers;
if(_fe2){
for(var _fe3 in _fe2){
if(this.m_frozenInfo[_fe3]){
this.m_frozenInfo[_fe3].parentContainer=_fe1;
break;
}
}
}
}
};
PinFreezeManager.prototype.getTopLevelContainerLID=function(lid){
if(this.m_frozenInfo[lid]){
while(this.m_frozenInfo[lid].parentContainer){
lid=this.m_frozenInfo[lid].parentContainer;
}
}
return lid;
};
PinFreezeManager.prototype.freezeContainer=function(lid,_fe6,_fe7){
var _fe8=document.getElementById("CVReport"+this.m_viewerId);
this.prepopulateFrozenInfo(_fe8);
var _fe9=this.getTopLevelContainerLID(lid);
this.unfreezeAllNestedContainers(_fe9,_fe8);
this.m_frozenInfo[lid].freezeTop=_fe6;
this.m_frozenInfo[lid].freezeSide=_fe7;
var _fea=this._createPinAndFreezeObject(_fe8,_fe9);
this.m_lastWidthProcessed=0;
this.m_lastHeightProcessed=0;
this._resizePinFreezeObjects(_fea);
this.sectionStructureChange();
if(isIE()){
var obj=this;
setTimeout(function(){
obj.refresh();
},1);
var _fec=document.getElementById("RVContent"+this.m_viewerId);
this.m_oCV.repaintDiv(_fec);
}
return _fea;
};
PinFreezeManager.prototype.getInitialWidthThreshold=function(){
return document.body.clientWidth*3/4;
};
PinFreezeManager.prototype.getInitialHeightThreshold=function(){
return document.body.clientWidth*9/10;
};
PinFreezeManager.prototype.hasFrozenContainers=function(){
return ((this.m_frozenInfo)?true:false);
};
PinFreezeManager.prototype.hasFrozenRowHeadings=function(lid){
if(this.m_frozenInfo&&this.m_frozenInfo[lid]){
return this.m_frozenInfo[lid].freezeSide?this.m_frozenInfo[lid].freezeSide:false;
}
return false;
};
PinFreezeManager.prototype.hasFrozenColumnHeadings=function(lid){
if(this.m_frozenInfo&&this.m_frozenInfo[lid]){
return this.m_frozenInfo[lid].freezeTop?this.m_frozenInfo[lid].freezeTop:false;
}
return false;
};
PinFreezeManager.prototype.removeNamespace=function(idNS){
if(idNS.length>this.m_viewerId.length){
if(idNS.indexOf(this.m_viewerId)>0){
return idNS.substring(0,idNS.indexOf(this.m_viewerId));
}
}
return idNS;
};
PinFreezeManager.prototype.getContainer=function(lid,_ff1){
if(this.m_frozenInfo&&this.m_frozenInfo[lid]&&this.m_frozenInfo[lid].pinFreezeContainers[0]){
_ff1=_ff1?_ff1:0;
return this.m_frozenInfo[lid].pinFreezeContainers[_ff1];
}
return null;
};
PinFreezeManager.prototype.nodeToContainer=function(node){
var slid=PinFreezeContainer.nodeToSlid(node);
var _ff4=null;
if(slid){
var lid=this.removeNamespace(PinFreezeContainer.getLidFromSlid(slid));
_ff4=this.getContainer(lid);
}
return _ff4;
};
PinFreezeManager.prototype.getContainerElement=function(_ff6){
var lid=this.removeNamespace(_ff6.getAttribute("lid"));
if(lid){
var _ff8=this.getContainer(lid);
if(_ff8){
return _ff8.getContainer();
}
}
return null;
};
PinFreezeManager.prototype._createPinAndFreezeObject=function(_ff9,lid){
var _ffb=null;
if(this.m_frozenInfo){
var _ffc=this.m_frozenInfo[lid];
var _ffd=_ffc.initialLoad;
if(_ffd){
delete _ffc.initialLoad;
}
var _ffe=_ffc.freezeTop;
var _fff=_ffc.freezeSide;
var _1000=null;
if(_ffd&&_ffc.pinFreezeContainers&&(_ffe||_fff)){
_1000=_ffc.pinFreezeContainers.slice(0);
}
var _1001=_ff9;
if(_ffc&&_ffc.parentContainer){
var _1002=getElementsByAttribute(_ff9,"table","lid",_ffc.parentContainer+this.m_viewerId);
if(_1002){
for(parentIndex=0;parentIndex<_1002.length;parentIndex++){
if(!_1002[parentIndex].getAttribute("clonednode")){
_1001=_1002[parentIndex];
break;
}
}
}
}
if(_ffc.childContainers){
for(var _1003 in _ffc.childContainers){
var _1004=this._createPinAndFreezeObject(_1001,_1003);
_ffb=_ffb?_ffb:_1004;
}
}
var _1005=getElementsByAttribute(_1001,"table","lid",lid+this.m_viewerId);
if(_1005&&_1005.length>0){
delete _ffc.pinFreezeContainers;
_ffc.pinFreezeContainers=[];
}else{
return null;
}
if(_1005&&(_ffe||_fff)){
var _1006=(_ffb!==null);
for(var i=0;i<_1005.length;i++){
var _1008=_1005[i];
if(_1008.getAttribute("clonednode")=="true"){
continue;
}
_ffb=this.addContainerObject(lid,_ffe,_fff,_1008,i);
if(_ffb){
_ffb.createPFContainer(_1001,_1006);
if(_ffd){
_ffb.copyProperties(_1000[0]);
}
_ffb.freezeContainerInReport(_ff9);
}
}
}
}
return _ffb;
};
PinFreezeManager.prototype.renderReportWithFrozenContainers=function(_1009){
if(this.m_frozenInfo){
var _100a=false;
var _100b=null;
for(var _100c in this.m_frozenInfo){
var _100d=this.m_frozenInfo[_100c];
if(!_100a){
_100a=_100d.initialLoad;
}
if(!_100d.parentContainer){
var temp=this._createPinAndFreezeObject(_1009,_100d.lid);
_100b=_100b?_100b:temp;
}
}
if(!_100a&&_100b){
this._resizePinFreezeObjects(_100b);
}
this.refresh();
}
};
PinFreezeManager.prototype._resizePinFreezeObjects=function(_100f){
var _1010,width;
var _1012=this.m_oCV.getViewerWidget();
if(_1012){
var size=_1012.getWidgetSize();
width=(size&&size.w&&(size.w<this.getInitialWidthThreshold()))?size.w:_100f.getClientWidth();
_1010=(size&&size.h&&(size.h<this.getInitialHeightThreshold()))?size.h:_100f.getClientHeight();
}else{
var _1014=document.getElementById("RVContent"+this.m_viewerId);
var _1015=document.getElementById("mainViewerTable"+this.m_viewerId);
width=_1014.clientWidth;
_1010=_1015.clientHeight;
}
this.m_lastWidthProcessed=0;
this.m_lastHeightProcessed=0;
this.resize(width,_1010);
};
PinFreezeManager.prototype.resize=function(width,_1017){
var _1018=(Math.abs(width-this.m_lastWidthProcessed)<this.c_resizeTweekLimit);
var _1019=(Math.abs(_1017-this.m_lastHeightProcessed)<this.c_resizeTweekLimit);
if(_1018&&_1019){
return;
}
var _101a=(Math.abs(width-this.m_lastWidthProcessed)>2)?width:0;
var _101b=(Math.abs(_1017-this.m_lastHeightProcessed)>2)?_1017:0;
for(var lid in this.m_frozenInfo){
if(!this.m_frozenInfo[lid].parentContainer){
this.resizeContainer(lid,_101a,_101b);
}
}
this.m_lastWidthProcessed=width;
this.m_lastHeightProcessed=_1017;
};
PinFreezeManager.prototype.resizeContainer=function(lid,width,_101f){
var _1020=this.m_frozenInfo[lid];
if(_1020){
var _1021=null;
if(_1020.childContainers){
var _1022=width>10?width-10:width;
var _1023=_101f>10?_101f-10:_101f;
for(var _1024 in _1020.childContainers){
_1021=this.resizeContainer(_1024,_1022,_1023);
}
}
var _1025=_1020.pinFreezeContainers;
var _1026=null;
var _1027=null;
if(_1025){
for(var i=0;i<_1025.length;i++){
_1026=_1025[i];
_1026.resize(width,_101f,_1020.parentContainer,_1021);
var _1029=_1026.getContainer();
if(_1029&&(!_1027||(_1027.width<_1029.clientWidth))){
_1027={"width":_1029.clientWidth,"lid":_1026.m_lidNS};
}
}
}
return _1027;
}
};
PinFreezeManager.prototype.processAutoResize=function(width,_102b){
this.m_lastWidthProcessed=width;
this.m_lastHeightProcessed=_102b;
};
PinFreezeManager.prototype.onSetVisible=function(){
this.refresh();
if(this.m_repaintOnVisible){
this.rePaint();
this.m_repaintOnVisible=false;
}
};
PinFreezeManager.prototype.onResizeCanvas=function(_102c){
if(_102c){
this.rePaint();
}else{
this.m_repaintOnVisible=true;
}
};
PinFreezeManager.prototype.rePaint=function(){
for(var lid in this.m_frozenInfo){
if(!this.m_frozenInfo[lid].parentContainer){
this.resizeContainer(lid,this.m_lastWidthProcessed,this.m_lastHeightProcessed);
}
}
};
PinFreezeManager.prototype.refresh=function(){
for(var _102e in this.m_frozenInfo){
var _102f=this.m_frozenInfo[_102e].pinFreezeContainers;
if(_102f){
for(var i=0;i<_102f.length;i++){
var _1031=_102f[i];
_1031.synchScroll();
_1031.synchVScroll();
}
}
}
};
PinFreezeManager.prototype.freezeContainerRowHeadings=function(lid){
return this.freezeContainer(lid,this.hasFrozenColumnHeadings(lid),true);
};
PinFreezeManager.prototype.freezeSelectedRowHeadings=function(){
var lid=this.getValidSelectedContainerId(false);
if(lid){
this.m_oCV.getSelectionController().resetSelections();
return this.freezeContainerRowHeadings(lid);
}
return null;
};
PinFreezeManager.prototype.canFreezeSelectedRowHeadings=function(){
var lid=this.getValidSelectedContainerId(false);
if(lid){
return (!this.hasFrozenRowHeadings(lid));
}
return false;
};
PinFreezeManager.prototype.unfreezeContainerRowHeadings=function(lid){
this.freezeContainer(lid,this.hasFrozenColumnHeadings(lid),false);
};
PinFreezeManager.prototype.unfreezeSelectedRowHeadings=function(){
var lid=this.getValidSelectedContainerId(false);
if(lid){
this.m_oCV.getSelectionController().resetSelections();
this.unfreezeContainerRowHeadings(lid);
}
};
PinFreezeManager.prototype.canUnfreezeSelectedRowHeadings=function(){
var lid=this.getValidSelectedContainerId(false);
if(lid){
return (this.hasFrozenRowHeadings(lid));
}
return false;
};
PinFreezeManager.prototype.freezeContainerColumnHeadings=function(lid){
return this.freezeContainer(lid,true,this.hasFrozenRowHeadings(lid));
};
PinFreezeManager.prototype.freezeSelectedColumnHeadings=function(){
var lid=this.getValidSelectedContainerId(true);
if(lid){
this.m_oCV.getSelectionController().resetSelections();
return this.freezeContainerColumnHeadings(lid);
}
return null;
};
PinFreezeManager.prototype.canFreezeSelectedColumnHeadings=function(){
var lid=this.getValidSelectedContainerId(true);
if(lid){
return (!this.hasFrozenColumnHeadings(lid));
}
return false;
};
PinFreezeManager.prototype.unfreezeContainerColumnHeadings=function(lid){
this.freezeContainer(lid,false,this.hasFrozenRowHeadings(lid));
};
PinFreezeManager.prototype.unfreezeSelectedColumnHeadings=function(){
var lid=this.getValidSelectedContainerId(true);
if(lid){
this.m_oCV.getSelectionController().resetSelections();
this.unfreezeContainerColumnHeadings(lid);
}
};
PinFreezeManager.prototype.canUnfreezeSelectedColumnHeadings=function(){
var lid=this.getValidSelectedContainerId(true);
if(lid){
return (this.hasFrozenColumnHeadings(lid));
}
return false;
};
PinFreezeManager.prototype.getValidSelectedContainerId=function(_103e){
var _103f=this.m_oCV.getSelectionController().getAllSelectedObjects();
if(_103f&&_103f.length&&(_103f[0].getDataContainerType()==="crosstab"||(_103e&&_103f[0].getDataContainerType()==="list"))){
var lid=(_103f[0].getLayoutElementId());
if(lid){
if(!this.hasPromptControlsInFreezableCells(lid)){
return this.removeNamespace(lid);
}
}
}
return null;
};
PinFreezeManager.prototype.hasPromptControlsInFreezableCells=function(lid){
var _1042=this.m_oCV.getLayoutElementFromLid(lid);
var _1043=getElementsByAttribute(_1042,["td","th"],"type","columnTitle");
var _1044=new RegExp("(^|[W])clsPromptComponent($|[W])");
var _1045=isIE()?"className":"class";
for(var j in _1043){
if(_1043.hasOwnProperty(j)){
var _1047=getElementsByAttribute(_1043[j],"*",_1045,null,1,_1044);
if(_1047.length>0){
return true;
}
}
}
return false;
};
PinFreezeManager.prototype.unfreeze=function(lid,_1049,reset){
if(this.m_frozenInfo&&this.m_frozenInfo[lid]){
var _104b=this.m_frozenInfo[lid].pinFreezeContainers;
if(_104b){
for(var i=0;i<_104b.length;i++){
var _104d=_104b[i];
_104d.unfreeze(_1049);
}
if(reset){
this._resetFrozenInfo(lid);
}
}
}
};
PinFreezeManager.prototype.unfreezeAllNestedContainers=function(lid,_104f){
var _1050=this.m_frozenInfo[lid];
if(_1050){
if(_1050.freezeTop||_1050.freezeSide){
this.unfreeze(lid,_104f,false);
}
if(_1050.childContainers){
for(var _1051 in _1050.childContainers){
this.unfreezeAllNestedContainers(_1051,_104f);
}
}
}
};
PinFreezeManager.prototype.isNodeVisible=function(node){
var slid=PinFreezeContainer.nodeToSlid(node);
if(!slid){
return true;
}
var lid=this.removeNamespace(PinFreezeContainer.getLidFromSlid(slid));
var _1055=this.getContainer(lid);
if(!_1055){
return true;
}
var _1056=PinFreezeContainer.getSectionNameFromSlid(slid);
var _1057=_1055.getSection(_1056);
var _1058=null,_1059=null;
var nodeI=node;
var _105b=null;
while(nodeI&&nodeI!==_1057&&!_1058&&!_1059){
_1058=_1055.getMain(nodeI);
_1059=_1055.getCopy(nodeI);
_105b=nodeI;
nodeI=nodeI.parentNode;
}
var _105c=_1058?true:false;
var _105d=_1059?true:false;
if(_105c){
return _1055.getCopy(_1058)===_105b;
}else{
if(_105d){
return _1055.getCopy(_105b)?false:true;
}else{
return true;
}
}
};
PinFreezeManager.prototype.sectionStructureChange=function(){
var _105e=this.m_oCV.getViewerWidget();
if(_105e&&_105e.getAnnotationHelper()){
_105e.getAnnotationHelper().repositionCommentIndicators();
}
};
PinFreezeManager.prototype.deepCloneNode=function(_105f){
var copy=_105f.cloneNode(true);
var _1061=this.m_oCV.getViewerWidget();
if(_1061){
if(_1061.reportContainsDijits()){
var _1062=getElementsByAttribute(copy,"*","widgetid","*");
if(_1062&&_1062.length){
for(var i=0;i<_1062.length;i++){
_1062[i].parentNode.removeChild(_1062[i]);
}
}
}
}
return copy;
};
PinFreezeManager.prototype.toJSONString=function(){
var _1064="";
var _1065="";
for(var _1066 in this.m_frozenInfo){
if(_1064.length>0){
_1064+=",";
}
var _1067=this.m_frozenInfo[_1066];
_1064+="{";
_1064+="\"lid\":\""+_1067.lid.replace("\"","\\\"")+"\",";
_1064+="\"freezeTop\":"+_1067.freezeTop+",";
_1064+="\"freezeSide\":"+_1067.freezeSide+",";
if(_1067.parentContainer){
_1064+="\"parentContainer\":\""+_1067.parentContainer+"\",";
}
if(_1067.pinFreezeContainers&&_1067.pinFreezeContainers.length>0){
_1064+="\"properties\":"+_1067.pinFreezeContainers[0].toJSONString()+",";
}
_1064+="\"childContainers\": {";
if(_1067.childContainers){
var first=true;
for(var _1069 in _1067.childContainers){
if(!first){
_1064+=",";
}
_1064+="\""+_1069+"\":true";
first=false;
}
}
_1064+="}}";
}
if(_1064.length>0){
_1065="{\"version\":1, \"containers\":["+_1064+"]}";
}
return _1065;
};
PinFreezeManager.prototype.fromJSONString=function(sJSON){
if(!sJSON||sJSON.length===0){
return;
}
var oJSON=null;
try{
oJSON=eval("("+sJSON+")");
}
catch(e){
if(typeof console!="undefined"){
console.log("PinFreezeManager.prototype.fromJSON could not parse JSON - "+sJSON);
console.log(e);
}
}
if(!oJSON){
return;
}
var _106c=oJSON.containers;
var _106d=oJSON.version;
if(_106c.length>0){
this.m_frozenInfo={};
}
for(var _106e=0;_106e<_106c.length;_106e++){
var _106f=_106c[_106e];
var lid=_106f.lid;
var _1071=_106f.freezeTop;
var _1072=_106f.freezeSide;
var _1073=document.getElementById("CVReport"+this.m_viewerId);
var _1074=getElementsByAttribute(_1073,"table","lid",lid+this.m_viewerId);
var _1075=[];
if(_1074&&(_1071||_1072)){
for(var i=0;i<_1074.length;i++){
var _1077=_1074[i];
var _1078=new PinFreezeContainer(this,lid,this.m_viewerId,_106f.freezeTop,_106f.freezeSide,_1077,i);
if(_106f.properties){
applyJSONProperties(_1078,_106f.properties);
}
_1075.push(_1078);
}
}
this.m_frozenInfo[lid]={"lid":lid,"freezeTop":_1071,"freezeSide":_1072,"pinFreezeContainers":_1075,"initialLoad":true};
if(_106d>=1){
if(_106f.childContainers){
this.m_frozenInfo[lid].childContainers=_106f.childContainers;
}
if(_106f.parentContainer){
this.m_frozenInfo[lid].parentContainer=_106f.parentContainer;
}
}
}
};
PinFreezeManager.prototype.removeIdAttribute=function(_1079){
var _107a=_1079.getAttribute("id");
if(_107a!==null&&_107a!==""){
_1079.removeAttribute("id");
}
var _107b=getElementsByAttribute(_1079,"*","id","*");
if(_107b&&_107b.length){
for(var i=0;i<_107b.length;i++){
_107b[i].removeAttribute("id");
}
}
return _1079;
};
PinFreezeManager.prototype.isElementInMainOutput=function(_107d){
return PinFreezeContainer.isElementInMainOutput(_107d);
};
PinFreezeManager.prototype.isIWidgetMobile=function(){
return (this.m_oCV&&this.m_oCV.isIWidgetMobile());
};
PinFreezeManager.prototype.destroy=function(){
GUtil.destroyProperties(this);
};
function CViewerToolbar(){
this.m_specification=null;
this.m_oCBar=null;
this.m_sWebContentRoot=null;
this.m_sSkin=null;
};
CViewerToolbar.prototype.getNamespace=function(){
if(this.m_specification&&typeof this.m_specification.namespace!="undefined"){
return this.m_specification.namespace;
}
return "";
};
CViewerToolbar.prototype.getSkin=function(){
if(this.m_sSkin==null){
var oCV=null;
try{
oCV=getCognosViewerObjectRef(this.getNamespace());
}
catch(exception){
}
if(oCV){
this.m_sSkin=oCV.getSkin();
}else{
this.m_sSkin=this.getWebContentRoot()+"/skins/corporate";
}
}
return this.m_sSkin;
};
CViewerToolbar.prototype.getWebContentRoot=function(){
if(this.m_sWebContentRoot==null){
var oCV=null;
try{
oCV=getCognosViewerObjectRef(this.getNamespace());
}
catch(exception){
}
if(oCV){
this.m_sWebContentRoot=oCV.getWebContentRoot();
}else{
this.m_sWebContentRoot="..";
}
}
return this.m_sWebContentRoot;
};
CViewerToolbar.prototype.getDivId=function(){
if(this.m_specification&&typeof this.m_specification.divId!="undefined"){
return this.m_specification.divId;
}
return "";
};
CViewerToolbar.prototype.getStyle=function(){
if(this.m_specification&&typeof this.m_specification.style!="undefined"){
return this.m_specification.style;
}
return "";
};
CViewerToolbar.prototype.getToolbarSpecification=function(){
if(this.m_specification&&typeof this.m_specification.S!="undefined"){
return new CViewerToolbarSpecification(this,this.m_specification.S);
}
return null;
};
CViewerToolbar.prototype.getItem=function(sId){
if(this.m_oCBar){
var _1081=this.m_oCBar.getNumItems();
sId=this.getNamespace()+sId;
for(var index=0;index<_1081;++index){
var _1083=this.m_oCBar.get(index);
if(typeof _1083.getId=="function"&&_1083.getId()==sId){
return _1083;
}
}
}
return null;
};
CViewerToolbar.prototype.init=function(_1084){
if(typeof _1084!="undefined"&&typeof _1084=="object"&&_1084!=null){
this.m_specification=_1084;
}
};
CViewerToolbar.prototype.getCBar=function(){
if(!this.m_oCBar&&this.m_specification){
this.load();
}
return this.m_oCBar;
};
CViewerToolbar.prototype.load=function(){
var _1085=null;
if(this.m_specification!=null){
var divId=this.getDivId();
var _1087=document.getElementById(divId);
var _1088=this.getToolbarSpecification();
if(_1087&&_1088){
_1085=_1088.draw();
}
}
this.m_oCBar=_1085;
return _1085;
};
CViewerToolbar.prototype.draw=function(){
if(this.m_oCBar){
this.m_oCBar.draw();
}
};
function CViewerToolbarSpecification(_1089,_108a){
this.m_viewerToolbar=_1089;
this.m_toolbarSpecification=_108a;
};
CViewerToolbarSpecification.prototype.draw=function(){
if(this.m_toolbarSpecification){
var _108b=gToolbarStyle;
if(this.m_viewerToolbar.getStyle()==="banner"){
_108b=gBannerToolbarStyle;
}
var _108c=new CBar(this.m_viewerToolbar.getDivId(),_108b,null,this.m_viewerToolbar.getWebContentRoot());
_108c.setMenuType(cHorizonalBar);
_108c.style=this.m_viewerToolbar.getStyle();
_108c.setAlign("right");
var _108d=false;
var _108e=null;
var _108f=null;
for(var _1090=0;_1090<this.m_toolbarSpecification.length;_1090++){
for(var _1091 in this.m_toolbarSpecification[_1090]){
try{
var _1092=eval("new "+_1091+"();");
if(_1091=="P"){
if(_108d&&_108f==null){
_108e=_1092;
_108f=this.m_toolbarSpecification[_1090][_1091];
}
}else{
var _1093=this.m_toolbarSpecification[_1090][_1091];
if(_1093.N!=="openWith"||!window.isIOS()){
_108d=true;
if(_108f!=null&&_108e!=null){
_108e.load(_108c,_108f,this.m_viewerToolbar);
_108e=null;
_108f=null;
}
_1092.load(_108c,_1093,this.m_viewerToolbar);
}
}
}
catch(exception){
}
}
}
return _108c;
}
return null;
};
function B(){
};
B.prototype.isValid=function(_1094){
if(_1094!=null){
return true;
}
return false;
};
B.prototype.load=function(_1095,_1096,_1097){
if(this.isValid(_1096)){
var _1098="";
var _1099="";
var _109a="";
var sName=_1096.N;
var _109c=null;
if(typeof _1096.M!="undefined"&&_1096.M.IS!="undefined"){
_109c=_1096.M.IS;
}
if(typeof _1096.C=="undefined"){
if(_109c){
var _109d=_109c[0]["I"];
if(_109d!=null&&this.isValid(_109d)){
_1098=_109d.O;
if(typeof _1098=="undefined"||_1098==""){
_1098=_109d.E;
}
_1099=_109d.C;
_109a=_109d.A;
}
}
}else{
_1098=_1096.O;
_1099=_1096.C;
_109a=_1096.A;
}
var _109e=null;
if(_1097.getStyle()==="banner"){
_109e=new CMenuItem(_1095,"",_109a,_1099,gBannerButtonStyle,_1097.getWebContentRoot(),_1097.getSkin());
_109e.setDropDownArrow("dropdown_arrow_banner.gif");
}else{
_109e=new CMenuItem(_1095,"",_109a,_1099,gMenuItemStyle,_1097.getWebContentRoot(),_1097.getSkin());
_109e.setDropDownArrow("dropdown_arrow_narrow.gif");
}
_109e.setId(_1097.getNamespace()+sName);
_109e.setToolTip(_1098);
if(typeof _1096.ALT!="undefined"){
_109e.setAltText(_1096.ALT);
}
if(typeof _1096.D!="undefined"&&_1096.D=="true"){
_109e.disable();
}
if(typeof _1096.M!="undefined"){
var _109f=_1096.M;
if(typeof _109f.Y!="undefined"&&(typeof _109f.A!="undefined"||(_109c&&_109c.length>1)||(typeof _109f.H=="undefined"||_109f.H=="false"))){
var menu=new M();
_109e.m_menu=menu.load(_1095,_109f,_1097);
_109e.m_menu.setParent(_109e);
_109e.m_menuType=_109f.Y;
}
}
return _109e;
}
return null;
};
function I(){
};
I.prototype.isValid=function(_10a1){
if(typeof _10a1!="undefined"&&_10a1!=null){
return true;
}
return false;
};
I.prototype.load=function(_10a2,_10a3,_10a4){
if(this.isValid(_10a3)){
var sText=_10a3.E;
var _10a6=_10a3.C;
var _10a7=_10a3.A;
var sName=_10a3.N;
var _10a9=null;
if(typeof _10a3.M!="undefined"&&_10a3.M.IS!="undefined"){
_10a9=_10a3.M.IS;
}
if(typeof _10a3.E=="undefined"){
if(_10a9&&_10a9[0]){
var _10aa=_10a9[0]["I"];
if(_10aa!=null&&this.isValid(_10aa)){
sText=_10aa.E;
if(typeof sText=="undefined"||sText==""){
sText=_10aa.O;
}
_10a7=_10aa.A;
}
}else{
return null;
}
}else{
sText=_10a3.E;
_10a6=_10a3.C;
_10a7=_10a3.A;
}
var _10ab=null;
if(_10a2.style&&_10a2.style==="banner"){
_10ab=gBannerItemStyle;
}else{
_10ab=gMenuItemStyle;
}
var _10ac=new CMenuItem(_10a2,sText,_10a7,_10a6,_10ab,_10a4.getWebContentRoot(),_10a4.getSkin());
if(typeof _10a3.ALT!="undefined"){
_10ac.setAltText(_10a3.ALT);
}
if(_10a2.style&&_10a2.style==="banner"){
_10ac.setDropDownArrow("dropdown_arrow_banner.gif");
}else{
_10ac.setDropDownArrow("dropdown_arrow_narrow.gif");
}
_10ac.setId(_10a4.getNamespace()+sName);
if(typeof _10a3.D!="undefined"&&_10a3.D=="true"){
_10ac.disable();
}
if(typeof _10a3.M!="undefined"){
var _10ad=_10a3.M;
if(typeof _10ad.Y!="undefined"&&(typeof _10ad.A!="undefined"||(_10a9&&_10a9.length>1)||(typeof _10ad.H=="undefined"||_10ad.H=="false"))){
var menu=new M();
_10ac.m_menu=menu.load(_10a2,_10ad,_10a4);
_10ac.m_menu.setParent(_10ac);
_10ac.m_menuType=_10a3.M.Y;
}
}
return _10ac;
}
return null;
};
function M(){
};
M.prototype.isValid=function(_10af){
return (typeof _10af!="undefined"&&_10af!=null&&typeof _10af.id!="undefined");
};
M.prototype.load=function(_10b0,_10b1,_10b2){
if(this.isValid(_10b1)){
var menu=new CMenu(_10b1.id,gMenuStyle,_10b2.getWebContentRoot());
menu.setParent(_10b0);
if(typeof _10b1.ALT!="undefined"){
menu.setAltText(_10b1.ALT);
}
try{
menu.m_oCV=getCognosViewerObjectRef(_10b2.getNamespace());
}
catch(e){
}
if(typeof _10b1.A!="undefined"){
menu.registerCallback(_10b1.A);
}
var _10b4=_10b1.IS;
if(_10b4){
for(var _10b5=0;_10b5<_10b4.length;_10b5++){
for(var _10b6 in _10b4[_10b5]){
try{
var _10b7=new I();
_10b7.load(menu,_10b4[_10b5][_10b6],_10b2);
}
catch(exception){
}
}
}
}
return menu;
}
return null;
};
function T(){
};
T.prototype.isValid=function(_10b8){
return (typeof _10b8!="undefined"&&_10b8!=null&&typeof _10b8.E!="undefined");
};
T.prototype.load=function(_10b9,_10ba,_10bb){
if(this.isValid(_10ba)){
var _10bc=null;
if(_10bb.getStyle()==="banner"){
_10bc=gBannerStaticText;
}else{
}
if(_10ba.E&&_10ba.E.length>0){
var _10bd=new CStaticText(_10ba.E,_10bc);
if(_10ba.N=="userName"){
_10bd.setId("userNameTD"+_10bb.getNamespace());
}
if(_10ba.ALT){
_10bd.setLabelledBy(_10ba.ALT+" "+_10ba.E);
}
_10b9.add(_10bd);
}
}
return null;
};
function L(){
};
L.prototype.isValid=function(_10be){
return (typeof _10be!="undefined"&&_10be!=null&&typeof _10be.E!="undefined");
};
L.prototype.load=function(_10bf,_10c0,_10c1){
if(this.isValid(_10c0)){
var _10c2=null;
if(_10c1.getStyle()==="banner"){
_10c2=gBannerLink;
}else{
}
var _10c3=_10c0.A;
var _10c4=new CMenuItem(_10bf,_10c0.E,_10c3,"",_10c2,_10c1.getWebContentRoot(),_10c1.getSkin());
_10c4.iconPlaceholder=false;
if(_10c0.ALT!="undefined"){
_10c4.setAltText(_10c0.ALT);
}
return _10c4;
}
return null;
};
function P(){
};
P.prototype.isValid=function(_10c5){
return (typeof _10c5!="undefined"&&_10c5!=null&&typeof _10c5.Y!="undefined");
};
P.prototype.load=function(_10c6,_10c7,_10c8){
if(this.isValid(_10c7)){
var _10c9=new CSeperator(_10c7.Y,"","",_10c8.getWebContentRoot());
if(_10c8.getStyle()==="banner"){
_10c9.setToolbarSeperatorClass("bannerDivider");
}else{
_10c9.setToolbarSeperatorClass("toolbarDivider");
}
_10c6.add(_10c9);
return _10c9;
}
return null;
};
function GlossaryAction(){
};
GlossaryAction.prototype=new CognosViewerAction();
GlossaryAction.prototype.execute=function(){
var _10ca=this.getCognosViewer();
_10ca.loadExtra();
var _10cb=_10ca.getSelectionController();
var _10cc=_10cb.getAllSelectedObjects();
if(_10cc.length>0){
var _10cd=null;
if(typeof MDSRV_CognosConfiguration!="undefined"){
_10cd=new MDSRV_CognosConfiguration();
var _10ce="";
if(_10ca.envParams["glossaryURI"]){
_10ce=_10ca.envParams["glossaryURI"];
}
_10cd.addProperty("glossaryURI",_10ce);
_10cd.addProperty("gatewayURI",_10ca.getGateway());
}
var _10cf=_10ca.envParams["ui.object"];
var _10d0=getViewerSelectionContext(_10cb,new CSelectionContext(_10cf));
var _10d1=new MDSRV_BusinessGlossary(_10cd,_10d0);
_10d1.open();
}
};
GlossaryAction.prototype.updateMenu=function(_10d2){
if(!this.getCognosViewer().bCanUseGlossary){
return "";
}
var _10d3=this.selectionHasContext();
if(!_10d3||this.getCognosViewer().envParams["glossaryURI"]==null||this.getCognosViewer().envParams["glossaryURI"]==""){
_10d2.disabled=true;
}else{
_10d2.disabled=false;
}
return _10d2;
};
function AuthoredDrillAction(){
this.m_drillTargetSpecification="";
};
AuthoredDrillAction.prototype=new CognosViewerAction();
AuthoredDrillAction.prototype.setRequestParms=function(_10d4){
this.m_drillTargetSpecification=_10d4;
};
AuthoredDrillAction.prototype.executeDrillTarget=function(_10d5){
var _10d6=XMLHelper_GetFirstChildElement(XMLBuilderLoadXMLFromString(_10d5));
var _10d7=encodeURIComponent(_10d6.getAttribute("bookmarkRef"));
var _10d8=_10d6.getAttribute("path");
var _10d9=this._shouldShowInNewWindow(_10d6);
var oCV=this.getCognosViewer();
if((_10d7!==null&&_10d7!=="")&&(_10d8===null||_10d8==="")){
var _10db=_10d6.getAttribute("bookmarkPage");
if(_10db&&_10db!==""){
oCV.executeAction("GotoPage",{"pageNumber":_10db,"anchorName":_10d7});
}else{
document.location="#"+_10d7;
}
}else{
var _10dc="";
if(_10d9){
_10dc="_blank";
}
var _10dd=[];
var _10de=[];
_10de.push("obj");
_10de.push(_10d8);
_10dd[_10dd.length]=_10de;
var _10df=false;
var _10e0,_10e1,_10e2,sName,sNil;
var _10e5=XMLHelper_FindChildrenByTagName(_10d6,"drillParameter",false);
for(var index=0;index<_10e5.length;++index){
_10e0=[];
_10e1=_10e5[index];
_10e2=_10e1.getAttribute("value");
sName=_10e1.getAttribute("name");
if(_10e2!==null&&_10e2!==""){
_10e0.push("p_"+sName);
_10e0.push(this.buildSelectionChoicesSpecification(_10e1));
}
sNil=_10e1.getAttribute("nil");
if(sNil!==null&&sNil!==""){
_10e0.push("p_"+sName);
_10e0.push(this.buildSelectionChoicesNilSpecification());
}
if(_10e0.length>0){
_10dd[_10dd.length]=_10e0;
}
if(!_10df){
var _10e7=_10e1.getAttribute("propertyToPass");
_10df=(_10e7&&_10e7.length>0)?true:false;
}
}
var _10e8=_10d6.getAttribute("method");
var _10e9=_10d6.getAttribute("outputFormat");
var _10ea=_10d6.getAttribute("outputLocale");
var _10eb=_10d6.getAttribute("prompt");
var _10ec=_10d6.getAttribute("dynamicDrill");
var _10ed=this.getXMLNodeAsString(_10d6,"parameters");
var _10ee=this.getXMLNodeAsString(_10d6,"objectPaths");
var oCVId=oCV.getId();
var _10f0=document.forms["formWarpRequest"+oCVId];
var _10f1=oCV.getAdvancedServerProperty("VIEWER_JS_CALL_FORWARD_DRILLTHROUGH_TO_SELF");
if((!_10f1||_10f1.toLowerCase()!=="false")&&_10eb!="true"&&this.isSameReport(_10f0,_10d8)&&this.isSameReportFormat(_10e9)&&!_10d9&&!_10df){
var _10f2=new ViewerDispatcherEntry(oCV);
_10f2.addFormField("ui.action","forward");
if(oCV!==null&&typeof oCV.rvMainWnd!="undefined"){
oCV.rvMainWnd.addCurrentReportToReportHistory();
var _10f3=oCV.rvMainWnd.saveReportHistoryAsXML();
_10f2.addFormField("cv.previousReports",_10f3);
}
for(index=0;index<_10e5.length;++index){
_10e0=[];
_10e1=_10e5[index];
_10e2=_10e1.getAttribute("value");
sName=_10e1.getAttribute("name");
sNil=_10e1.getAttribute("nil");
if((sNil===null||sNil==="")&&(_10e2===null||_10e2==="")){
_10e0.push("p_"+sName);
_10e0.push(this.buildSelectionChoicesNilSpecification());
}
if(_10e0.length>0){
_10dd[_10dd.length]=_10e0;
}
}
for(index=1;index<_10dd.length;index++){
_10f2.addFormField(_10dd[index][0],_10dd[index][1]);
}
_10f2.addFormField("_drillThroughToSelf","true");
if(oCV.m_tabsPayload&&oCV.m_tabsPayload.tabs){
_10f2.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup",oCV.m_tabsPayload.tabs[0].id);
}
oCV.setUsePageRequest(true);
oCV.dispatchRequest(_10f2);
if(typeof oCV.m_viewerFragment=="undefined"){
var _10f4=getCognosViewerObjectRefAsString(oCVId);
setTimeout(_10f4+".getRequestIndicator().show()",10);
}
}else{
doSingleDrill(_10dc,_10dd,_10e8,_10e9,_10ea,_10d7,_10ed,_10ee,this.getCognosViewer().getId(),_10eb,_10ec);
}
}
};
AuthoredDrillAction.prototype._shouldShowInNewWindow=function(_10f5){
return _10f5.getAttribute("showInNewWindow")=="true";
};
AuthoredDrillAction.prototype.isSameReport=function(_10f6,_10f7){
if(_10f6["ui.object"]&&_10f7==_10f6["ui.object"].value){
return true;
}
return false;
};
AuthoredDrillAction.prototype.isSameReportFormat=function(_10f8){
var _10f9=this.getCognosViewer().envParams["run.outputFormat"];
if(_10f9){
if(_10f8==_10f9){
return true;
}else{
if(_10f9=="HTML"&&_10f8=="HTMLFragment"){
return true;
}
}
}
return false;
};
AuthoredDrillAction.prototype.getXMLNodeAsString=function(_10fa,_10fb){
var sXML="";
if(_10fa!=null){
var node=XMLHelper_FindChildByTagName(_10fa,_10fb,false);
if(node!=null){
sXML=XMLBuilderSerializeNode(node);
}
}
return sXML;
};
AuthoredDrillAction.prototype.execute=function(_10fe){
if(this.m_drillTargetSpecification!=""){
this.executeDrillTarget(this.m_drillTargetSpecification);
}else{
if(typeof _10fe!="undefined"){
var _10ff=this.getCognosViewer().getDrillTargets();
var _1100=this.getAuthoredDrillThroughContext(_10fe,_10ff);
var _1101=_1100.childNodes;
if(_1101.length==1){
this.executeDrillTarget(XMLBuilderSerializeNode(_1101[0]));
}else{
doMultipleDrills(XMLBuilderSerializeNode(_1100),this.getCognosViewer().getId());
}
}
}
};
AuthoredDrillAction.prototype.showDrillTargets=function(_1102){
var _1103="<context>";
for(var index=0;index<_1102.length;++index){
var _1105=_1102[index];
_1103+="<member>";
var sName=_1105.getAttribute("label");
_1103+="<name>";
_1103+=sXmlEncode(sName);
_1103+="</name>";
var _1107=_1105.getAttribute("path");
_1103+="<drillThroughSearchPath>";
_1103+=sXmlEncode(_1107);
_1103+="</drillThroughSearchPath>";
var _1108=_1105.getAttribute("method");
_1103+="<drillThroughAction>";
_1103+=sXmlEncode(_1108);
_1103+="</drillThroughAction>";
var _1109=_1105.getAttribute("outputFormat");
_1103+="<drillThroughFormat>";
_1103+=sXmlEncode(_1109);
_1103+="</drillThroughFormat>";
var sData="parent."+this.getTargetReportRequestString(_1105);
_1103+="<data>";
_1103+=sXmlEncode(sData);
_1103+="</data>";
_1103+="</member>";
}
_1103+="</context>";
};
AuthoredDrillAction.prototype.populateContextMenu=function(_110b){
var _110c=this.getCognosViewer();
var _110d=_110c.rvMainWnd.getToolbarControl();
var _110e=null;
if(typeof _110d!="undefined"&&_110d!=null){
var _110f=_110d.getItem("goto");
if(_110f){
_110e=_110f.getMenu();
}
}
var _1110=_110c.rvMainWnd.getContextMenu();
var _1111=null;
if(typeof _1110!="undefined"&&_1110!=null){
_1111=_1110.getGoToMenuItem().getMenu();
}
if(_110e!=null||_1111!=null){
var _1112=this.getCognosViewer().getDrillTargets();
var _1113=this.getAuthoredDrillThroughContext(_110b,_1112);
var _1114=_1113.childNodes;
if(_1114.length>0){
for(var index=0;index<_1114.length;++index){
var _1116=_1114[index];
var _1117=getCognosViewerObjectRefAsString(this.getCognosViewer().getId())+".m_oDrillMgr.executeAuthoredDrill(\""+encodeURIComponent(XMLBuilderSerializeNode(_1116))+"\");";
var _1118=this.getTargetReportIconPath(_1116);
var _1119=_1116.getAttribute("label");
if(isViewerBidiEnabled()){
var bidi=BidiUtils.getInstance();
_1119=bidi.btdInjectUCCIntoStr(_1119,getViewerBaseTextDirection());
}
if(_110e!=null){
new CMenuItem(_110e,_1119,_1117,_1118,gMenuItemStyle,_110c.getWebContentRoot(),_110c.getSkin());
}
if(_1111!=null){
new CMenuItem(_1111,_1119,_1117,_1118,gMenuItemStyle,_110c.getWebContentRoot(),_110c.getSkin());
}
}
}
}
};
AuthoredDrillAction.prototype.buildSelectionChoicesNilSpecification=function(){
return "<selectChoices/>";
};
AuthoredDrillAction.prototype.buildSelectionChoicesSpecification=function(_111b){
var _111c="";
var _111d=_111b.getAttribute("value");
if(_111d!=null){
var _111e=_111b.getAttribute("propertyToPass");
_111c+="<selectChoices";
if(_111e!=null&&_111e!=""){
_111c+=" propertyToPass=\"";
_111c+=sXmlEncode(_111e);
_111c+="\"";
}
_111c+=">";
if(_111d.indexOf("<selectChoices>")!=-1){
_111c+=_111d.substring(_111d.indexOf("<selectChoices>")+15);
}else{
if(_111d!=""){
_111c+="<selectOption ";
var sMun=_111b.getAttribute("mun");
if(sMun!=null&&sMun!=""){
var _1120=sXmlEncode(sMun);
_111c+="useValue=\"";
_111c+=_1120;
_111c+="\" ";
_111c+="mun=\"";
_111c+=_1120;
_111c+="\" ";
_111c+="displayValue=\"";
_111c+=sXmlEncode(_111d);
_111c+="\"";
}else{
_111c+="useValue=\"";
_111c+=sXmlEncode(_111d);
_111c+="\" ";
var _1121=_111b.getAttribute("displayValue");
if(_1121==null||_1121==""){
_1121=_111d;
}
_111c+="displayValue=\"";
_111c+=sXmlEncode(_1121);
_111c+="\"";
}
_111c+="/>";
_111c+="</selectChoices>";
}
}
}
return _111c;
};
AuthoredDrillAction.prototype.getPropertyToPass=function(_1122,_1123){
if(_1122!=null&&_1122!=""&&_1123!=null){
var _1124=_1123.childNodes;
if(_1124!=null){
for(var index=0;index<_1124.length;++index){
var _1126=_1124[index];
var sName="";
if(_1126.getAttribute("name")!=null){
sName=_1126.getAttribute("name");
}
if(sName==_1122){
return _1126.getAttribute("propertyToPass");
}
}
}
}
return "";
};
AuthoredDrillAction.prototype.getTargetReportRequestString=function(_1128){
var _1129="";
var _112a=_1128.getAttribute("bookmarkRef");
var _112b=_1128.getAttribute("path");
var _112c=_1128.getAttribute("showInNewWindow");
if((_112a!=null&&_112a!="")&&(_112b==null||_112b=="")){
_1129+="document.location=\"#";
_1129+=_112a;
_1129+="\";";
}else{
_1129+="doSingleDrill(";
if(_112c=="true"){
_1129+="\"_blank\",";
}else{
_1129+="\"\",";
}
_1129+="[[\"obj\",\"";
_1129+=encodeURIComponent(_112b);
_1129+="\"]";
var _112d=XMLHelper_FindChildrenByTagName(_1128,"drillParameter",false);
for(var index=0;index<_112d.length;++index){
var _112f=_112d[index];
var _1130=_112f.getAttribute("value");
var sName=_112f.getAttribute("name");
if(_1130!=null&&_1130!=""){
_1129+=", [\"p_"+sName+"\",\""+encodeURIComponent(this.buildSelectionChoicesSpecification(_112f))+"\"]";
}
var sNil=_112f.getAttribute("nil");
if(sNil!=null&&sNil!=""){
_1129+="\", [\"p_"+sName+"\",\""+encodeURIComponent(this.buildSelectionChoicesNilSpecification())+"\"]";
}
}
_1129+="],";
var _1133=_1128.getAttribute("method");
_1129+="\""+encodeURIComponent(_1133)+"\",";
var _1134=_1128.getAttribute("outputFormat");
_1129+="\""+encodeURIComponent(_1134)+"\",";
var _1135=_1128.getAttribute("outputLocale");
_1129+="\""+encodeURIComponent(_1135)+"\",";
_1129+="\""+encodeURIComponent(_112a)+"\",";
var _1136=XMLBuilderSerializeNode(XMLHelper_FindChildByTagName(_1128,"parameters",false));
_1129+="\""+encodeURIComponent(_1136)+"\",";
var _1137=XMLBuilderSerializeNode(XMLHelper_FindChildByTagName(_1128,"objectPaths",false));
_1129+="\""+encodeURIComponent(_1137)+"\",";
_1129+="\""+encodeURIComponent(this.getCognosViewer().getId())+"\",";
var _1138=_1128.getAttribute("prompt");
_1129+="\""+encodeURIComponent(_1138)+"\",";
var _1139=_1128.getAttribute("dynamicDrill");
_1129+=" "+encodeURIComponent(_1139);
_1129+=");";
}
return _1129;
};
AuthoredDrillAction.prototype.getTargetReportIconPath=function(_113a){
var _113b="";
var _113c=_113a.getAttribute("bookmarkRef");
var _113d=XMLHelper_FindChildByTagName(_113a,"drillParameter",false);
if((_113c!=null&&_113c!="")&&_113d==null){
_113b="/common/images/spacer.gif";
}else{
var _113e=_113a.getAttribute("method");
switch(_113e){
case "editAnalysis":
_113b="/ps/portal/images/icon_ps_analysis.gif";
break;
case "editQuery":
_113b="/ps/portal/images/icon_qs_query.gif";
break;
case "execute":
_113b="/ps/portal/images/action_run.gif";
break;
case "view":
var _113f=_113a.getAttribute("outputFormat");
switch(_113f){
case "HTML":
case "XHTML":
case "HTMLFragment":
_113b="/ps/portal/images/icon_result_html.gif";
break;
case "PDF":
_113b="/ps/portal/images/icon_result_pdf.gif";
break;
case "XML":
_113b="/ps/portal/images/icon_result_xml.gif";
break;
case "CSV":
_113b="/ps/portal/images/icon_result_csv.gif";
break;
case "XLS":
_113b="/ps/portal/images/icon_result_excel.gif";
break;
case "SingleXLS":
_113b="/ps/portal/images/icon_result_excel_single.gif";
break;
case "XLWA":
_113b="/ps/portal/images/icon_result_excel_web_arch.gif";
break;
default:
_113b="/common/images/spacer.gif";
}
break;
default:
_113b="/common/images/spacer.gif";
}
}
return this.getCognosViewer().getWebContentRoot()+_113b;
};
AuthoredDrillAction.prototype.getAuthoredDrillThroughContext=function(_1140,_1141){
if(typeof _1140!="string"||typeof _1141!="object"){
return null;
}
var _1142=XMLBuilderLoadXMLFromString(_1140);
if(_1142==null||_1142.firstChild==null){
return null;
}
var _1143=XMLHelper_GetFirstChildElement(_1142);
if(XMLHelper_GetLocalName(_1143)!="AuthoredDrillTargets"){
return null;
}
var _1144=XMLHelper_GetFirstChildElement(_1143);
if(XMLHelper_GetLocalName(_1144)!="rvDrillTargets"){
return null;
}
var _1145=_1144.childNodes;
if(_1145===null||_1145.length===0){
return null;
}
var _1146=self.XMLBuilderCreateXMLDocument("rvDrillTargets");
for(var _1147=0;_1147<_1145.length;++_1147){
if(typeof _1145[_1147].getAttribute=="undefined"){
continue;
}
var _1148=_1146.createElement("drillTarget");
_1146.documentElement.appendChild(_1148);
var _1149=_1145[_1147].getAttribute("bookmarkRef");
if(_1149===null){
_1148.setAttribute("bookmarkRef","");
}else{
_1148.setAttribute("bookmarkRef",_1149);
}
var _114a=_1145[_1147].getAttribute("bookmarkPage");
if(_114a===null){
_1148.setAttribute("bookmarkPage","");
}else{
_1148.setAttribute("bookmarkPage",_114a);
}
var _114b=_1145[_1147].getAttribute("drillIdx");
if(_114b==null){
continue;
}
if(_114b>=_1141.length){
continue;
}
var _114c=_1141[_114b];
if(typeof _114c!="object"){
continue;
}
_1148.setAttribute("outputFormat",_114c.getOutputFormat());
_1148.setAttribute("outputLocale",_114c.getOutputLocale());
_1148.setAttribute("prompt",_114c.getPrompt());
_1148.setAttribute("dynamicDrill",_114c.isDynamicDrillThrough()?"true":"false");
var _114d=_1145[_1147].getAttribute("label");
if(_114d===null||_114d===""){
_114d=_114c.getLabel();
}
_1148.setAttribute("label",_114d);
_1148.setAttribute("path",_114c.getPath());
_1148.setAttribute("showInNewWindow",_114c.getShowInNewWindow());
_1148.setAttribute("method",_114c.getMethod());
var _114e=_1144;
var _114f="";
var _1150=_114c.getParameterProperties();
if(typeof _1150!="undefined"&&_1150!=null&&_1150!=""){
_114f=XMLHelper_GetFirstChildElement(XMLBuilderLoadXMLFromString(_114c.getParameterProperties()));
}
while(_114e){
var _1151=_114e.childNodes[_1147].childNodes;
for(var _1152=0;_1152<_1151.length;++_1152){
var _1153=_1151[_1152].cloneNode(true);
if(_114f){
var _1154=this.getPropertyToPass(_1153.getAttribute("name"),_114f);
if(_1154!=null&&_1154!=""){
_1153.setAttribute("propertyToPass",_1154);
}
}
_1148.appendChild(_1153);
}
_114e=_114e.nextSibling;
}
var _1155="<root xmlns:bus=\"http://developer.cognos.com/schemas/bibus/3/\" xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">";
var _1156="</root>";
var _1157=_1155+_114c.getParameters()+_1156;
var _1158=XMLBuilderLoadXMLFromString(_1157);
var _1159=XMLHelper_GetFirstChildElement(XMLHelper_GetFirstChildElement(_1158));
if(_1159){
_1148.appendChild(_1159.cloneNode(true));
}
var _115a=_1155+_114c.getObjectPaths()+_1156;
var _115b=XMLBuilderLoadXMLFromString(_115a);
_1159=XMLHelper_GetFirstChildElement(XMLHelper_GetFirstChildElement(_115b));
if(_1159){
_1148.appendChild(_1159.cloneNode(true));
}
}
return XMLHelper_GetFirstChildElement(_1146);
};
function DrillContextMenuHelper(){
};
DrillContextMenuHelper.updateDrillMenuItems=function(_115c,oCV,_115e){
var _115f=[];
if(DrillContextMenuHelper.needsDrillSubMenu(oCV)){
var _1160=oCV.getSelectionController();
var _1161=_1160.getAllSelectedObjects();
var _1162=_1161[0];
if(_1162.getUseValues().length>1&&typeof RV_RES!="undefined"){
var _1163={name:_115e,label:RV_RES.RV_DRILL_DEFAULT,action:{name:_115e,payload:{}}};
_115f.push(_1163);
}
var _1164=(_1162.getUseValues().length>1)?1:0;
var _1165=_1162.getUseValues().length-1;
_1165=(_1165>2)?2:_1165;
for(var iDim=_1164;iDim<=_1165;++iDim){
DrillContextMenuHelper.addSubMenuItem(_115e,_115f,_1162,iDim,0);
}
var _1167=false;
for(var iDim=_1164;iDim<=_1165;++iDim){
for(var _1168=1;_1168<_1162.getUseValues()[iDim].length;++_1168){
if(_1167==false){
_115f.push({separator:true});
_1167=true;
}
DrillContextMenuHelper.addSubMenuItem(_115e,_115f,_1162,iDim,_1168);
}
}
}
DrillContextMenuHelper.completeDrillMenu(_115e,_115f,_115c);
};
DrillContextMenuHelper.needsDrillSubMenu=function(oCV){
var _116a=(oCV&&oCV.getSelectionController());
if(_116a){
var _116b=_116a.getAllSelectedObjects();
if(_116b.length==1&&_116b[0].isHomeCell&&_116b[0].isHomeCell()==false){
var _116c=_116b[0].isSelectionOnVizChart();
if(!_116c){
var _116d=oCV.getAdvancedServerProperty("VIEWER_JS_ENABLE_DRILL_SUBMENU");
_116c=(_116d=="charts"&&_116a.hasSelectedChartNodes());
}
if(_116c){
var _116e=_116b[0];
return (_116c&&_116e.getUseValues()&&(_116e.getUseValues().length>1||_116e.getUseValues()[0].length>1));
}
}
}
return false;
};
DrillContextMenuHelper.addSubMenuItem=function(_116f,_1170,_1171,iDim,_1173){
var _1174=_1171.getDrillOptions()[iDim][_1173];
if(DrillContextMenuHelper.isOptionDrillable(_116f,_1174)){
var _1175=DrillContextMenuHelper.getItemValue(_1171,iDim,_1173);
if(_1175){
var _1176=_1171.getDataItems()[iDim][_1173];
var _1177={name:_116f,label:_1175,action:{name:_116f,payload:{userSelectedDrillItem:_1176}}};
_1170.push(_1177);
}
}
};
DrillContextMenuHelper.completeDrillMenu=function(_1178,_1179,_117a){
if(_1179.length>0){
_117a.items=_1179;
}else{
_117a.items=null;
if(_117a.action==null){
_117a.action={name:_1178,action:{name:_1178}};
}
}
};
DrillContextMenuHelper.isOptionDrillable=function(_117b,_117c){
return (_117c>=3||(_117b=="DrillDown"&&_117c==2)||(_117b=="DrillUp"&&_117c==1));
};
DrillContextMenuHelper.getItemValue=function(_117d,iDim,_117f){
var _1180=(_117f==0)?_117d.getDisplayValues()[iDim]:null;
return ((_1180)?_1180:_117d.getUseValues()[iDim][_117f]);
};
function DrillAction(){
};
DrillAction.prototype=new CognosViewerAction();
DrillAction.prototype.setRequestParms=function(parms){
if(parms&&parms.userSelectedDrillItem){
this.m_userSelectedDrillItem=parms.userSelectedDrillItem;
}
};
DrillAction.prototype.submitDrillRequest=function(_1182,_1183,_1184){
var oCV=this.getCognosViewer();
var oReq=new ViewerDispatcherEntry(oCV);
oReq.addFormField("ui.action","drill");
oReq.addFormField("rv_drillOption",_1183);
oReq.addFormField("rv_drillparams",_1182);
oReq.addFormField("rv_drillRefQuery",_1184);
oCV.dispatchRequest(oReq);
};
function DrillDownAction(){
this.m_sAction="DrillDown";
};
DrillDownAction.prototype=new DrillAction();
DrillDownAction.prototype.updateMenu=function(_1187){
return _1187;
};
DrillDownAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var _1189=oCV.getDrillMgr();
if(_1189.canDrillDown()==false){
return;
}
var _118a=_1189.rvBuildXMLDrillParameters("drillDown",this.m_userSelectedDrillItem);
var _118b=_1189.getRefQuery();
if(oCV.envParams["cv.id"]=="AA"){
oCV.m_viewerFragment.raiseAADrillDownEvent();
}
this.submitDrillRequest(_118a,"down",_118b);
};
function DrillUpAction(){
this.m_sAction="DrillUp";
};
DrillUpAction.prototype=new DrillAction();
DrillUpAction.prototype.updateMenu=function(_118c){
return _118c;
};
DrillUpAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var _118e=oCV.getDrillMgr();
if(_118e.canDrillUp()==false){
return;
}
var _118f=_118e.rvBuildXMLDrillParameters("drillUp",this.m_userSelectedDrillItem);
var _1190=_118e.getRefQuery();
if(oCV.envParams["cv.containerApp"]=="AA"){
oCV.m_viewerFragment.raiseAADrillUpEvent();
}
this.submitDrillRequest(_118f,"up",_1190);
};
function ResizeChartAction(){
this.m_width=0;
this.m_height=0;
this.m_actionContext=null;
};
ResizeChartAction.prototype=new CognosViewerAction();
ResizeChartAction.prototype.setRequestParms=function(_1191){
if(_1191&&_1191.resize){
this.m_width=_1191.resize.w;
this.m_height=_1191.resize.h;
this.m_actionContext=_1191.resize.actionContext;
}
};
ResizeChartAction.prototype.execute=function(){
var oCV=this.getCognosViewer();
var oReq=new ViewerDispatcherEntry(oCV);
oReq.addFormField("ui.action","modifyReport");
if(!this.m_actionContext){
this.m_actionContext="<reportActions><ChangeDataContainerSize><idSelectAll/><height>"+this.m_height+"</height><width>"+this.m_width+"</width></ChangeDataContainerSize></reportActions>";
}
oReq.addFormField("cv.actionContext",this.m_actionContext);
oReq.addFormField("keepIterators","true");
oReq.addFormField("cv.reuseConversation","true");
oReq.addFormField("reuseResults","true");
oReq.addDefinedFormField("ui.spec",oCV.envParams["ui.spec"]);
oReq.addDefinedFormField("modelPath",oCV.getModelPath());
oReq.addDefinedFormField("packageBase",oCV.envParams["packageBase"]);
oReq.setCanBeQueued(true);
oCV.dispatchRequest(oReq);
};
function CCognosViewerSaveReport(_1194,_1195){
this.m_cognosViewer=_1194;
this.m_params=null;
this.dashboardToSaveIn=_1195.cm$storeID;
this.m_doSaveAsOnFault=false;
};
CCognosViewerSaveReport.prototype.canSave=function(_1196){
return (this.doSaveAs()||_1196&&_1196.indexOf("write")!==-1);
};
CCognosViewerSaveReport.prototype.isSavedOutput=function(){
var _1197=this.m_cognosViewer.envParams["ui.action"];
return (typeof _1197!=="undefined"&&_1197==="view");
};
CCognosViewerSaveReport.prototype.doSaveAs=function(){
var _1198=(this.m_doSaveAsOnFault||!this.m_cognosViewer.envParams["savedReportName"]||!this.isSameDashboard());
return _1198;
};
CCognosViewerSaveReport.prototype.isSameDashboard=function(){
var _1199=(this.m_cognosViewer.envParams["ui.object"].indexOf(this.dashboardToSaveIn)!==-1);
return _1199;
};
CCognosViewerSaveReport.prototype.getUIAction=function(){
return (this.doSaveAs()?"saveInDashboard":"updateSavedReport");
};
CCognosViewerSaveReport.prototype.populateRequestParams=function(_119a){
_119a.addFormField("ui.action",this.getUIAction());
_119a.addFormField("cv.ignoreState","true");
_119a.addFormField("dashboard-id",this.dashboardToSaveIn);
_119a.addNonEmptyStringFormField("executionParameters",this.m_cognosViewer.m_sParameters);
for(var param in this.m_cognosViewer.envParams){
if(param.indexOf("frag-")==0||param=="cv.actionState"||param=="ui.primaryAction"||param=="dashboard"||param=="ui.action"||param=="cv.responseFormat"||param=="b_action"){
continue;
}
_119a.addFormField(param,this.m_cognosViewer.envParams[param]);
}
};
CCognosViewerSaveReport.prototype.getCognosViewer=function(){
return this.m_cognosViewer;
};
CCognosViewerSaveReport.prototype.getViewerWidget=function(){
return this.getCognosViewer().getViewerWidget();
};
CCognosViewerSaveReport.prototype.dispatchRequest=function(){
var _119c=this.m_cognosViewer;
var _119d=this.getViewerWidget();
var _119e={"complete":{"object":_119d,"method":_119d.handleWidgetSaveDone},"fault":{"object":this,"method":this.onFault}};
var _119f=new AsynchJSONDispatcherEntry(_119c);
_119f.setCallbacks(_119e);
this.populateRequestParams(_119f);
_119c.dispatchRequest(_119f);
};
CCognosViewerSaveReport.prototype.onFault=function(_11a0,arg1){
var _11a2=this.m_cognosViewer;
var _11a3=this.getViewerWidget();
var _11a4=_11a0.getSoapFault();
var _11a5=XMLHelper_FindChildByTagName(_11a4,"Fault",true);
if(this.ifIsEmptySelectionFault(_11a5)){
this.handleEmptySelectionFault();
return;
}
var _11a6=_11a4.createElement("allowRetry");
_11a6.appendChild(_11a4.createTextNode("false"));
_11a5.appendChild(_11a6);
var _11a7=XMLBuilderSerializeNode(_11a5);
_11a2.setSoapFault(_11a7);
_11a3.handleFault();
var _11a8={"status":false};
_11a3.iContext.iEvents.fireEvent("com.ibm.bux.widget.save.done",null,_11a8);
};
CCognosViewerSaveReport.prototype.ifIsEmptySelectionFault=function(_11a9){
if(_11a9){
var _11aa=XMLHelper_FindChildByTagName(_11a9,"errorCode",true);
if(_11aa){
var _11ab=XMLHelper_GetText(_11aa,false);
return (_11ab==="cmEmptySelection");
}
}
return false;
};
CCognosViewerSaveReport.prototype.handleEmptySelectionFault=function(){
delete (this.m_cognosViewer.envParams["savedReportName"]);
this.m_doSaveAsOnFault=true;
this.dispatchRequest();
};
function XmlHttpObject(){
this.m_formFields=new CDictionary();
this.xmlHttp=XmlHttpObject.createRequestObject();
this.m_requestIndicator=null;
this.m_httpCallbacks={};
this.m_asynch=true;
this.m_headers=null;
};
XmlHttpObject.prototype.setHeaders=function(_11ac){
this.m_headers=_11ac;
};
XmlHttpObject.prototype.getHeaders=function(){
return this.m_headers;
};
XmlHttpObject.prototype.newRequest=function(){
var _11ad=new XmlHttpObject();
_11ad.init(this.m_action,this.m_gateway,this.m_url,this.m_asynch);
this.executeHttpCallback("newRequest");
return _11ad;
};
XmlHttpObject.prototype.abortHttpRequest=function(){
if(this.xmlHttp!=null){
this.xmlHttp.abort();
this.xmlHttp=null;
this.executeHttpCallback("cancel");
this.m_httpCallbacks={};
}
};
XmlHttpObject.prototype.cancel=function(){
this.abortHttpRequest();
};
XmlHttpObject.prototype.executeHttpCallback=function(_11ae){
if(this.m_httpCallbacks&&this.m_httpCallbacks[_11ae]){
var _11af=this.concatResponseArguments(this.m_httpCallbacks.customArguments);
var _11b0=GUtil.generateCallback(this.m_httpCallbacks[_11ae].method,_11af,this.m_httpCallbacks[_11ae].object);
_11b0();
return true;
}
return false;
};
XmlHttpObject.prototype.setCallbacks=function(_11b1){
if(!this.m_httpCallbacks){
this.m_httpCallbacks={};
}
for(callback in _11b1){
this.m_httpCallbacks[callback]=_11b1[callback];
}
};
XmlHttpObject.prototype.getCallbacks=function(){
return this.m_httpCallbacks;
};
XmlHttpObject.createRequestObject=function(){
var _11b2=null;
if(window.XMLHttpRequest){
_11b2=new XMLHttpRequest();
}else{
if(window.ActiveXObject){
_11b2=new ActiveXObject("Msxml2.XMLHTTP");
}else{
}
}
return _11b2;
};
XmlHttpObject.prototype.waitForXmlHttpResponse=function(){
var _11b3=this.xmlHttp;
if(_11b3&&_11b3.readyState===4){
if(_11b3.status===200){
this.httpSuccess();
}else{
this.httpError();
}
}else{
}
};
XmlHttpObject.prototype.init=function(_11b4,_11b5,url,_11b7){
this.m_action=_11b4;
this.m_gateway=_11b5;
this.m_url=url;
this.m_asynch=_11b7;
};
XmlHttpObject.prototype.httpSuccess=function(){
this.executeHttpCallback("postHttpRequest");
this.executeHttpCallback("entryComplete");
this.executeHttpCallback("complete");
this.m_httpCallbacks=null;
};
XmlHttpObject.prototype.httpError=function(){
this.executeHttpCallback("entryFault");
this.executeHttpCallback("fault");
this.m_httpCallbacks=null;
};
XmlHttpObject.prototype.forceSynchronous=function(){
this.m_asynch=false;
};
XmlHttpObject.prototype.sendRequest=function(){
this.sendHtmlRequest(this.m_action,this.m_gateway,this.m_url,this.m_asynch);
};
XmlHttpObject.prototype.sendHtmlRequest=function(_11b8,_11b9,url,async){
var _11bc=this.xmlHttp;
if(_11bc){
_11bc.open(_11b8,_11b9,async);
if(async){
_11bc.onreadystatechange=GUtil.generateCallback(this.waitForXmlHttpResponse,[],this);
}else{
_11bc.onreadystatechange=GUtil.generateCallback(this.waitForXmlHttpResponse,[],this);
if(!isIE()){
_11bc.onload=GUtil.generateCallback(this.httpSuccess,[],this);
_11bc.onerror=GUtil.generateCallback(this.httpError,[],this);
}
}
_11bc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
if(this.m_headers){
for(header in this.m_headers){
_11bc.setRequestHeader(header,this.m_headers[header]);
}
}
this.executeHttpCallback("preHttpRequest");
var _11bd=this.convertFormFieldsToUrl();
if(url){
_11bd+=url;
}
_11bc.send(_11bd);
}
};
XmlHttpObject.prototype.getResponseXml=function(){
return (this.xmlHttp)?this.xmlHttp.responseXML:null;
};
XmlHttpObject.prototype.getResponseText=function(){
return (this.xmlHttp)?this.xmlHttp.responseText:"";
};
XmlHttpObject.prototype.getResponseHeader=function(item){
return (this.xmlHttp)?this.xmlHttp.getResponseHeader(item):null;
};
XmlHttpObject.prototype.getStatus=function(){
return this.xmlHttp.status;
};
XmlHttpObject.prototype.addFormField=function(name,value){
this.m_formFields.add(name,value);
};
XmlHttpObject.prototype.getFormFields=function(){
return this.m_formFields;
};
XmlHttpObject.prototype.getFormField=function(_11c1){
return this.m_formFields.get(_11c1);
};
XmlHttpObject.prototype.clearFormFields=function(){
this.m_formFields=new CDictionary();
};
XmlHttpObject.prototype.convertFormFieldsToUrl=function(){
var url="";
var _11c3=this.m_formFields.keys();
for(var index=0;index<_11c3.length;index++){
if(index>0){
url+="&";
}
url+=encodeURIComponent(_11c3[index])+"="+encodeURIComponent(this.m_formFields.get(_11c3[index]));
}
return url;
};
XmlHttpObject.prototype.concatResponseArguments=function(_11c5){
var _11c6=[this];
if(_11c5){
_11c6=_11c6.concat(_11c5);
}
return _11c6;
};
function AsynchRequest(_11c7,_11c8){
AsynchRequest.baseConstructor.call(this);
this.m_gateway=_11c7;
this.m_webContentRoot=_11c8;
this.m_callbacks={};
this.m_soapFault=null;
this.m_faultDialog=null;
this.m_promptDialog=null;
this.m_logonDialog=null;
};
AsynchRequest.prototype=new XmlHttpObject();
AsynchRequest.baseConstructor=XmlHttpObject;
AsynchRequest.prototype.parent=XmlHttpObject.prototype;
AsynchRequest.prototype.getTracking=function(){
return "";
};
AsynchRequest.prototype.getConversation=function(){
return "";
};
AsynchRequest.prototype.getPrimaryAction=function(){
return "";
};
AsynchRequest.prototype.getActionState=function(){
return "";
};
AsynchRequest.prototype.getAsynchStatus=function(){
return "";
};
AsynchRequest.prototype.getResult=function(){
return null;
};
AsynchRequest.prototype.getSoapFault=function(){
return this.m_soapFault;
};
AsynchRequest.prototype.constructFaultEnvelope=function(){
return null;
};
AsynchRequest.prototype.getPromptHTMLFragment=function(){
return "";
};
AsynchRequest.prototype.isRAPWaitTrue=function(){
return false;
};
AsynchRequest.prototype.getRAPRequestCache=function(){
return null;
};
AsynchRequest.prototype.getMainConversation=function(){
return null;
};
AsynchRequest.prototype.getMainTracking=function(){
return null;
};
AsynchRequest.prototype.construct=function(){
};
AsynchRequest.prototype.executeCallback=function(_11c9){
if(this.m_callbacks[_11c9]){
var _11ca=this.concatResponseArguments(this.m_callbacks.customArguments);
var _11cb=GUtil.generateCallback(this.m_callbacks[_11c9].method,_11ca,this.m_callbacks[_11c9].object);
_11cb();
return true;
}
return false;
};
AsynchRequest.prototype.setCallbacks=function(_11cc){
if(!this.m_callbacks){
this.m_callbacks={};
}
for(callback in _11cc){
this.m_callbacks[callback]=_11cc[callback];
}
};
AsynchRequest.prototype.getCallbacks=function(){
return this.m_callbacks;
};
AsynchRequest.prototype.newRequest=function(){
var _11cd=this.construct();
_11cd.setHeaders(this.getHeaders());
if(this.getFormFields().exists("b_action")){
_11cd.addFormField("b_action",this.getFormField("b_action"));
}
if(this.getFormFields().exists("cv.catchLogOnFault")){
_11cd.addFormField("cv.catchLogOnFault",this.getFormField("cv.catchLogOnFault"));
}
_11cd.setPromptDialog(this.m_promptDialog);
_11cd.setFaultDialog(this.m_faultDialog);
_11cd.setLogonDialog(this.m_logonDialog);
_11cd.m_asynch=this.m_asynch;
if(this.m_callbacks.newRequest){
var _11ce=GUtil.generateCallback(this.m_callbacks.newRequest.method,[_11cd],this.m_callbacks.newRequest.object);
_11ce();
}
return _11cd;
};
AsynchRequest.prototype.success=function(){
var _11cf=this.getAsynchStatus();
switch(_11cf){
case "stillWorking":
case "working":
this.working();
break;
case "prompting":
this.prompting();
break;
case "fault":
case "complete":
case "conversationComplete":
this.complete();
break;
default:
this.complete();
break;
}
};
AsynchRequest.prototype.setFaultDialog=function(_11d0){
if(_11d0 instanceof IFaultDialog){
if(typeof console!="undefined"){
console.log("AsynchRequest.prototype.setFaultDialog is deprecated");
}
this.m_faultDialog=_11d0;
}else{
if(_11d0&&typeof console!="undefined"){
console.log("The parameter faultDialog must be an instance of IFaultDialog");
}
}
};
AsynchRequest.prototype.setPromptDialog=function(_11d1){
if(_11d1 instanceof IPromptDialog){
if(typeof console!="undefined"){
console.log("AsynchRequest.prototype.setPromptDialog is deprecated");
}
this.m_promptDialog=_11d1;
}else{
if(_11d1&&typeof console!="undefined"){
console.log("The parameter promptDialog must be an instance of IPromptDialog");
}
}
};
AsynchRequest.prototype.setLogonDialog=function(_11d2){
if(_11d2 instanceof ILogOnDialog){
if(typeof console!="undefined"){
console.log("AsynchRequest.prototype.setLogonDialog is deprecated");
}
this.m_logonDialog=_11d2;
}else{
if(_11d2&&typeof console!="undefined"){
console.log("The parameter logOnDialog must be an instance of ILogOnDialog");
}
}
};
AsynchRequest.prototype.resubmitRequest=function(){
var _11d3=this.newRequest();
_11d3.m_formFields=this.m_formFields;
_11d3.sendRequest();
return _11d3;
};
AsynchRequest.prototype.sendRequest=function(){
var _11d4=this;
var _11d5={"complete":{"object":_11d4,"method":_11d4.successHandler},"fault":{"object":_11d4,"method":_11d4.errorHandler}};
this.init("POST",this.m_gateway,"",this.m_asynch);
this.executeCallback("preHttpRequest");
this.parent.setCallbacks.call(this,_11d5);
this.parent.sendRequest.call(this);
};
AsynchRequest.prototype.errorHandler=function(){
this.executeCallback("postHttpRequest");
this.executeCallback("entryFault");
this.executeCallback("error");
};
AsynchRequest.prototype.successHandler=function(){
this.executeCallback("postHttpRequest");
if(typeof window["AsynchRequestPromptDialog"]!="undefined"&&window["AsynchRequestPromptDialog"]!=null){
window["AsynchRequestPromptDialog"].hide();
window["AsynchRequestPromptDialog"]=null;
}
if(this.getResponseHeader("Content-type").indexOf("text/html")!=-1){
var _11d6=this.getResponseText();
if(_11d6.indexOf("<ERROR_CODE>CAM_PASSPORT_ERROR</ERROR_CODE>")!=-1){
this.passportTimeout();
}else{
if((_11d6.indexOf("http-equiv=\"refresh\"")!=-1)||(_11d6.indexOf("http-equiv='refresh'")!=-1)){
this.passportTimeout();
}else{
this.executeCallback("entryFault");
if(!this.executeCallback("fault")){
var _11d7=window.open("","","height=400,width=500");
if(_11d7!=null){
_11d7.document.write(_11d6);
}
}
}
}
}else{
this.m_soapFault=this.constructFaultEnvelope();
if(this.m_soapFault!=null){
var _11d8=XMLHelper_FindChildByTagName(this.m_soapFault,"CAM",true);
if(_11d8!=null&&XMLHelper_FindChildByTagName(_11d8,"promptInfo",true)){
this.passportTimeout();
}else{
this.fault();
}
}else{
this.success();
}
}
};
AsynchRequest.prototype.cancel=function(){
this.parent.cancel.call(this);
var _11d9=this.getFormField("m_tracking");
if(_11d9){
var _11da=new XmlHttpObject();
_11da.init("POST",this.m_gateway,"",false);
if(this.getFormField("cv.outputKey")){
_11da.addFormField("b_action","cvx.high");
_11da.addFormField("cv.outputKey",this.getFormField("cv.outputKey"));
_11da.setHeaders(this.getHeaders());
}else{
_11da.addFormField("b_action","cognosViewer");
}
_11da.addFormField("cv.responseFormat","successfulRequest");
_11da.addFormField("ui.action","cancel");
_11da.addFormField("m_tracking",_11d9);
if(this.getFormField("cv.debugDirectory")){
_11da.addFormField("cv.debugDirectory",this.getFormField("cv.debugDirectory"));
}
_11da.sendRequest();
this.executeCallback("cancel");
}
};
AsynchRequest.prototype.working=function(){
this.executeCallback("working");
var _11db=this.newRequest();
_11db.addFormField("m_tracking",this.getTracking());
if(this.getFormField("cv.outputKey")){
_11db.addFormField("cv.outputKey",this.getFormField("cv.outputKey"));
_11db.addFormField("b_action","cvx.high");
}
if(this.isRAPWaitTrue()){
_11db.m_formFields=this.m_formFields;
_11db.addFormField("m_tracking",this.getTracking());
_11db.addFormField("rapWait","true");
var _11dc=this.getRAPRequestCache();
if(_11dc!==null&&typeof _11dc!="undefined"){
_11db.addFormField("rapRequestCache",_11dc);
}
var _11dd=this.getMainConversation();
if(_11dd){
_11db.addFormField("mainConversation",_11dd);
}
var _11de=this.getMainTracking();
if(_11de){
_11db.addFormField("mainTracking",_11de);
}
}else{
_11db.addFormField("ui.action","wait");
_11db.addFormField("ui.primaryAction",this.getPrimaryAction());
_11db.addFormField("cv.actionState",this.getActionState());
if(this.getFormField("ui.preserveRapTags")){
_11db.addFormField("ui.preserveRapTags",this.getFormField("ui.preserveRapTags"));
}
if(this.getFormField("ui.backURL")){
_11db.addFormField("ui.backURL",this.getFormField("ui.backURL"));
}
if(this.getFormField("errURL")){
_11db.addFormField("errURL",this.getFormField("errURL"));
}
if(this.getFormField("cv.showFaultPage")){
_11db.addFormField("cv.showFaultPage",this.getFormField("cv.showFaultPage"));
}
if(this.getFormField("cv.catchLogOnFault")){
_11db.addFormField("cv.catchLogOnFault",this.getFormField("cv.catchLogOnFault"));
}
}
if(this.getFormField("bux")){
_11db.addFormField("bux",this.getFormField("bux"));
}
if(this.getFormField("cv.debugDirectory")){
_11db.addFormField("cv.debugDirectory",this.getFormField("cv.debugDirectory"));
}
_11db.sendRequest();
};
AsynchRequest.prototype.prompting=function(){
this.executeCallback("entryComplete");
if(!this.executeCallback("prompting")){
if(this.m_promptDialog!=null){
this.showPromptPage();
}else{
if(typeof console!="undefined"){
console.log("An unhandled prompt response was returned: %o",this.xmlHttp);
}
}
}
this.executeCallback("postEntryComplete");
};
AsynchRequest.prototype.promptPageOkCallback=function(_11df){
var _11e0=this.newRequest();
_11e0.addFormField("ui.action","forward");
_11e0.addFormField("m_tracking",this.getTracking());
_11e0.addFormField("ui.conversation",this.getConversation());
_11e0.addFormField("ui.primaryAction",this.getPrimaryAction());
_11e0.addFormField("cv.actionState",this.getActionState());
for(var _11e1 in _11df){
_11e0.addFormField(_11e1,_11df[_11e1]);
}
_11e0.sendRequest();
window["AsynchRequestObject"]=null;
};
AsynchRequest.prototype.promptPageCancelCallback=function(){
window["AsynchRequestPromptDialog"].hide();
this.complete();
};
AsynchRequest.prototype.showPromptPage=function(){
window["AsynchRequestObject"]=this;
window["AsynchRequestPromptDialog"]=this.m_promptDialog;
var _11e2=this.m_promptDialog.getViewerId()==null?"":"?cv.id="+this.m_promptDialog.getViewerId();
window["AsynchRequestPromptDialog"].initialize(this.m_webContentRoot+"/rv/showStandalonePrompts.html"+_11e2,400,400);
window["AsynchRequestPromptDialog"].show();
};
AsynchRequest.prototype.passportTimeout=function(){
this.executeCallback("entryFault");
if(!this.executeCallback("passportTimeout")){
if(this.m_logonDialog!=null){
this.m_logonDialog.show(response.getSoapFault());
}else{
if(typeof console!="undefined"){
console.log("An unhandled passport timeout fault was returned: %o",this.getSoapFault());
}
}
}
};
AsynchRequest.prototype.fault=function(){
this.executeCallback("entryFault");
if(!this.executeCallback("fault")){
if(this.m_faultDialog!=null){
this.m_faultDialog.show(this.getSoapFault());
}else{
if(typeof console!="undefined"){
console.log("An unhandled soap fault was returned: %o",this.getSoapFault());
}
}
}
};
AsynchRequest.prototype.complete=function(){
this.executeCallback("entryComplete");
this.executeCallback("complete");
this.executeCallback("postEntryComplete");
};
AsynchRequest.prototype.getSoapFaultCode=function(){
var _11e3=this.constructFaultEnvelope();
if(_11e3){
var _11e4=XMLHelper_FindChildByTagName(_11e3,"faultcode",true);
if(_11e4!=null){
return XMLHelper_GetText(_11e4);
}
}
return null;
};
AsynchRequest.prototype.getSoapFaultDetailMessageString=function(){
var _11e5=this.constructFaultEnvelope();
if(_11e5){
var entry=XMLHelper_FindChildByTagName(_11e5,"messageString",true);
if(entry!=null){
return XMLHelper_GetText(entry);
}
}
return null;
};
function AsynchDATARequest(_11e7,_11e8){
AsynchDATARequest.baseConstructor.call(this,_11e7,_11e8);
this.m_oResponseState=null;
this.m_sResponseState=null;
this.m_endOfStateIdx=-1;
this.cStatePrefix="<xml><state>";
this.cStateSuffix="</state></xml>";
};
AsynchDATARequest.prototype=new AsynchRequest();
AsynchDATARequest.baseConstructor=AsynchRequest;
AsynchDATARequest.prototype.getEndOfStateIdx=function(){
if(this.m_endOfStateIdx==-1){
var _11e9=this.getResponseText().substring(0,12);
if(_11e9==this.cStatePrefix){
this.m_endOfStateIdx=this.getResponseText().indexOf(this.cStateSuffix);
if(this.m_endOfStateIdx!=-1){
this.m_endOfStateIdx+=this.cStateSuffix.length;
}
}
}
return this.m_endOfStateIdx;
};
AsynchDATARequest.prototype.getResponseStateText=function(){
if(!this.m_sResponseState){
this.getResponseState();
}
return this.m_sResponseState;
};
AsynchDATARequest.prototype.getResponseState=function(){
if(this.m_oResponseState==null&&this.getEndOfStateIdx()!=-1){
this.m_sResponseState=this.getResponseText().substring(this.cStatePrefix.length,this.getEndOfStateIdx()-this.cStateSuffix.length);
if(this.m_sResponseState!=null){
this.m_sResponseState=xml_decode(this.m_sResponseState);
this.m_oResponseState=eval("("+this.m_sResponseState+")");
}
}
return this.m_oResponseState;
};
AsynchDATARequest.prototype.getAsynchStatus=function(){
if(this.getResponseState()!=null&&typeof this.getResponseState().m_sStatus!="undefined"){
return this.getResponseState().m_sStatus;
}
return "unknown";
};
AsynchDATARequest.prototype.getTracking=function(){
if(this.getResponseState()!=null&&typeof this.getResponseState().m_sTracking!="undefined"){
return this.getResponseState().m_sTracking;
}
return "";
};
AsynchDATARequest.prototype.getConversation=function(){
if(this.getResponseState()!=null&&typeof this.getResponseState().m_sConversation!="undefined"){
return this.getResponseState().m_sConversation;
}
return "";
};
AsynchDATARequest.prototype.getPrimaryAction=function(){
if(this.getResponseState()!=null&&typeof this.getResponseState().envParams!="undefined"&&this.getResponseState().envParams["ui.primaryAction"]!="undefined"){
return this.getResponseState().envParams["ui.primaryAction"];
}
return "";
};
AsynchDATARequest.prototype.getActionState=function(){
if(this.getResponseState()!=null&&typeof this.getResponseState().m_sActionState!="undefined"){
return this.getResponseState().m_sActionState;
}
return "";
};
AsynchDATARequest.prototype.getResult=function(){
if(this.getEndOfStateIdx()!=-1){
return this.getResponseText().substring(this.getEndOfStateIdx(),this.getResponseText().length);
}
return "";
};
AsynchDATARequest.prototype.getDebugLogs=function(){
if(this.getResponseState()!=null&&typeof this.getResponseState().debugLogs!="undefined"){
return this.getResponseState().debugLogs;
}
return "";
};
AsynchDATARequest.prototype.getPromptHTMLFragment=function(){
return this.getResult();
};
AsynchDATARequest.prototype.constructFaultEnvelope=function(){
if(this.m_soapFault==null){
var state=this.getResponseState();
if(state!=null){
if(state.m_sSoapFault){
var _11eb=state.m_sSoapFault;
this.m_soapFault=XMLBuilderLoadXMLFromString(_11eb);
}
}
}
return this.m_soapFault;
};
AsynchDATARequest.prototype.construct=function(){
var _11ec=new AsynchDATARequest(this.m_gateway,this.m_webContentRoot);
_11ec.setCallbacks(this.m_callbacks);
if(this.getFormFields().exists("cv.responseFormat")){
_11ec.addFormField("cv.responseFormat",this.getFormField("cv.responseFormat"));
}else{
_11ec.addFormField("cv.responseFormat","data");
}
return _11ec;
};
AsynchDATARequest.prototype.getEnvParam=function(param){
var _11ee=this.getResponseState();
if(_11ee&&typeof _11ee.envParams!="undefined"&&typeof _11ee.envParams[param]!="undefined"){
return _11ee.envParams[param];
}
return null;
};
AsynchDATARequest.prototype.isRAPWaitTrue=function(){
var _11ef=this.getEnvParam("rapWait");
if(_11ef!=null){
return _11ef=="true"?true:false;
}
return false;
};
AsynchDATARequest.prototype.getRAPRequestCache=function(){
return this.getEnvParam("rapRequestCache");
};
AsynchDATARequest.prototype.getMainConversation=function(){
return this.getEnvParam("mainConversation");
};
AsynchDATARequest.prototype.getMainTracking=function(){
return this.getEnvParam("mainTracking");
};
function AsynchJSONRequest(_11f0,_11f1){
AsynchJSONRequest.baseConstructor.call(this,_11f0,_11f1);
this.m_jsonResponse=null;
};
AsynchJSONRequest.prototype=new AsynchRequest();
AsynchJSONRequest.baseConstructor=AsynchRequest;
AsynchJSONRequest.prototype.getJSONResponseObject=function(){
if(this.m_jsonResponse==null){
if(this.getResponseHeader("Content-type").indexOf("application/json")!=-1){
var text=this.getResponseText();
if(text!=null){
var _11f3=this.removeInvalidCharacters(text);
this.m_jsonResponse=eval("("+_11f3+")");
}
}
}
return this.m_jsonResponse;
};
AsynchJSONRequest.prototype.getTracking=function(){
var _11f4=this.getJSONResponseObject();
if(_11f4){
return _11f4.tracking;
}
return "";
};
AsynchJSONRequest.prototype.getConversation=function(){
var _11f5=this.getJSONResponseObject();
if(_11f5){
return _11f5.conversation;
}
return "";
};
AsynchJSONRequest.prototype.getAsynchStatus=function(){
var _11f6=this.getJSONResponseObject();
if(_11f6){
return _11f6.status;
}
return "unknown";
};
AsynchJSONRequest.prototype.getPrimaryAction=function(){
var _11f7=this.getJSONResponseObject();
if(_11f7){
return _11f7.primaryAction;
}
return "";
};
AsynchJSONRequest.prototype.getActionState=function(){
var _11f8=this.getJSONResponseObject();
if(_11f8){
return _11f8.actionState;
}
return "";
};
AsynchJSONRequest.prototype.getDebugLogs=function(){
var _11f9=this.getJSONResponseObject();
if(_11f9){
return _11f9.debugLogs;
}
return "";
};
AsynchJSONRequest.prototype.isRAPWaitTrue=function(){
var _11fa=this.getJSONResponseObject();
if(_11fa){
return (_11fa.rapWait==="true");
}
return false;
};
AsynchJSONRequest.prototype.getRAPRequestCache=function(){
var _11fb=this.getJSONResponseObject();
if(_11fb){
var _11fc=_11fb.rapRequestCache;
if(_11fc!==null&&typeof _11fc!="undefined"){
return _11fc;
}
}
return null;
};
AsynchJSONRequest.prototype.getMainConversation=function(){
var _11fd=this.getJSONResponseObject();
if(_11fd){
return _11fd.mainConversation;
}
return null;
};
AsynchJSONRequest.prototype.getMainTracking=function(){
var _11fe=this.getJSONResponseObject();
if(_11fe){
return _11fe.mainTracking;
}
return null;
};
AsynchJSONRequest.prototype.getResult=function(){
var _11ff=this.getJSONResponseObject();
if(_11ff&&_11ff.json){
var _1200=this.removeInvalidCharacters(_11ff.json);
return eval("("+_1200+")");
}
return null;
};
AsynchJSONRequest.prototype.removeInvalidCharacters=function(text){
if(text){
text=text.replace(/(\n|\r|\t)+/g,"");
}
return text;
};
AsynchJSONRequest.prototype.getPromptHTMLFragment=function(){
var _1202=this.getJSONResponseObject();
if(_1202&&_1202.promptHTMLFragment){
return _1202.promptHTMLFragment;
}
return "";
};
AsynchJSONRequest.prototype.constructFaultEnvelope=function(){
if(this.m_soapFault==null){
var _1203=this.getJSONResponseObject();
if(_1203.status=="fault"){
this.m_soapFault=XMLBuilderLoadXMLFromString(_1203.fault);
}
}
return this.m_soapFault;
};
AsynchJSONRequest.prototype.construct=function(){
var _1204=new AsynchJSONRequest(this.m_gateway,this.m_webContentRoot);
_1204.setCallbacks(this.m_callbacks);
if(this.getFormFields().exists("cv.responseFormat")){
_1204.addFormField("cv.responseFormat",this.getFormField("cv.responseFormat"));
}else{
_1204.addFormField("cv.responseFormat","asynchJSON");
}
return _1204;
};
function IFaultDialog(){
};
IFaultDialog.prototype.show=function(){
if(typeof console!="undefined"){
console.log("Required method IFaultDialog:show not implemented.");
}
};
IFaultDialog.prototype.handleUnknownHTMLResponse=function(){
if(typeof console!="undefined"){
console.log("Required method IFaultDialog:handlerUnknownHTMLResponse not implemented.");
}
};
function ILogOnDialog(){
};
ILogOnDialog.prototype.show=function(_1205){
if(typeof console!="undefined"){
console.log("Required method ILogOnDialog:show not implemented.");
}
};
ILogOnDialog.prototype.handleUnknownHTMLResponse=function(_1206){
if(typeof console!="undefined"){
console.log("Required method ILogOnDialog:handleUnknownHTMLResponse not implemented.");
}
};
function IPromptDialog(){
};
IPromptDialog.prototype.initialize=function(url,width,_1209){
if(typeof console!="undefined"){
console.log("Required method IModalDialog:initialize not implemented.");
}
};
IPromptDialog.prototype.show=function(){
if(typeof console!="undefined"){
console.log("Required method IModalDialog:show not implemented.");
}
};
IPromptDialog.prototype.hide=function(){
if(typeof console!="undefined"){
console.log("Required method IModalDialog:hide not implemented.");
}
};
function IRequestHandler(){
};
IRequestHandler.prototype.preHttpRequest=function(_120a){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:preHttpRequest not implemented.");
}
};
IRequestHandler.prototype.postHttpRequest=function(_120b){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:postHttpRequest not implemented.");
}
};
IRequestHandler.prototype.postComplete=function(_120c){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:postComplete not implemented.");
}
};
IRequestHandler.prototype.onComplete=function(_120d){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onComplete not implemented.");
}
};
IRequestHandler.prototype.onPostEntryComplete=function(_120e){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onPostEntryComplete not implemented.");
}
};
IRequestHandler.prototype.onFault=function(_120f){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onFault not implemented.");
}
};
IRequestHandler.prototype.onPrompting=function(_1210){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onPrompting not implemented.");
}
};
IRequestHandler.prototype.onWorking=function(_1211){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:onWorking not implemented.");
}
};
IRequestHandler.prototype.setWorkingDialog=function(_1212){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:setWorkingDialog not implemented.");
}
};
IRequestHandler.prototype.setRequestIndicator=function(_1213){
if(typeof console!="undefined"){
console.log("Required method IRequestHandler:setExecutionCursor not implemented.");
}
};
function IRequestIndicator(){
};
IRequestIndicator.prototype.show=function(){
if(typeof console!="undefined"){
console.log("Required method IRequestIndicator:show not implemented.");
}
};
IRequestIndicator.prototype.hide=function(){
if(typeof console!="undefined"){
console.log("Required method IRequestIndicator:hide not implemented.");
}
};
function BaseRequestHandler(oCV){
if(oCV){
this.m_oCV=oCV;
this.m_workingDialog=null;
this.m_requestIndicator=null;
this.m_faultDialog=null;
this.m_logOnDialog=null;
this.m_promptDialog=null;
this.m_httpRequestConfig=this.m_oCV.getConfig()&&this.m_oCV.getConfig().getHttpRequestConfig()?this.m_oCV.getConfig().getHttpRequestConfig():null;
}
};
BaseRequestHandler.prototype=new IRequestHandler();
BaseRequestHandler.prototype.onError=function(_1215){
};
BaseRequestHandler.prototype.onComplete=function(){
};
BaseRequestHandler.prototype.onPrompting=function(){
};
BaseRequestHandler.prototype.resubmitInSafeMode=function(){
};
BaseRequestHandler.prototype.massageHtmlBeforeDisplayed=function(){
};
BaseRequestHandler.prototype.onPostEntryComplete=function(){
this._processDelayedLoadingQueue();
};
BaseRequestHandler.prototype.getViewer=function(){
return this.m_oCV;
};
BaseRequestHandler.prototype.setDispatcherEntry=function(_1216){
this.m_oDispatcherEntry=_1216;
};
BaseRequestHandler.prototype.getDispatcherEntry=function(){
return this.m_oDispatcherEntry;
};
BaseRequestHandler.prototype.processInitialResponse=function(_1217){
this.updateViewerState(_1217);
};
BaseRequestHandler.prototype.setLogOnDialog=function(_1218){
if(_1218==null){
this.m_logOnDialog=null;
}else{
if(_1218 instanceof ILogOnDialog){
this.m_logOnDialog=_1218;
}else{
if(_1218&&typeof console!="undefined"){
console.log("The parameter logOnDialog must be an instance of ILogOnDialog");
}
}
}
};
BaseRequestHandler.prototype.setWorkingDialog=function(_1219){
if(_1219==null){
this.m_workingDialog=null;
}else{
if(this.m_httpRequestConfig&&this.m_httpRequestConfig.getWorkingDialog()){
this.m_workingDialog=this.m_httpRequestConfig.getWorkingDialog();
}else{
if(_1219 instanceof IRequestIndicator){
this.m_workingDialog=_1219;
}else{
if(_1219&&typeof console!="undefined"){
console.log("The parameter workingDialog must be an instance of IRequestIndicator");
}
}
}
}
};
BaseRequestHandler.prototype.getWorkingDialog=function(){
return this.m_workingDialog;
};
BaseRequestHandler.prototype.setRequestIndicator=function(_121a){
if(_121a==null){
this.m_requestIndicator=null;
}else{
if(this.m_httpRequestConfig&&this.m_httpRequestConfig.getRequestIndicator()){
this.m_requestIndicator=this.m_httpRequestConfig.getRequestIndicator();
}else{
if(_121a instanceof IRequestIndicator){
this.m_requestIndicator=_121a;
}else{
if(_121a&&typeof console!="undefined"){
console.log("The parameter requestIndicator must be an instance of IRequestIndicator");
}
}
}
}
};
BaseRequestHandler.prototype.getRequestIndicator=function(){
return this.m_requestIndicator;
};
BaseRequestHandler.prototype.setFaultDialog=function(_121b){
if(_121b==null){
this.m_faultDialog=null;
}else{
if(_121b instanceof IFaultDialog){
this.m_faultDialog=_121b;
}else{
if(_121b&&typeof console!="undefined"){
console.log("The parameter faultDialog must be an instance of IFaultDialog");
}
}
}
};
BaseRequestHandler.prototype.setPromptDialog=function(_121c){
if(_121c==null){
this.m_promptDialog=null;
}else{
if(_121c instanceof IPromptDialog){
this.m_promptDialog=_121c;
}else{
if(_121c&&typeof console!="undefined"){
console.log("The parameter promptDialog must be an instance of IPromptDialog");
}
}
}
};
BaseRequestHandler.prototype.preHttpRequest=function(_121d){
if(_121d&&typeof _121d.getFormField=="function"){
if(_121d.getFormField("ui.action")!="wait"&&_121d.getFormField("rapWait")!="true"){
if(this.m_requestIndicator){
this.m_requestIndicator.show();
}
}
}
};
BaseRequestHandler.prototype.postHttpRequest=function(_121e){
if(_121e&&typeof _121e.getAsynchStatus=="function"){
var _121f=_121e.getAsynchStatus();
if(_121f!="working"&&_121f!="stillWorking"){
if(this.m_workingDialog){
this.m_workingDialog.hide();
}
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
}
}else{
if(this.m_workingDialog){
this.m_workingDialog.hide();
}
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
}
};
BaseRequestHandler.prototype.onFault=function(_1220){
var oCV=this.getViewer();
if(this.m_workingDialog){
this.m_workingDialog.hide();
}
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
if(typeof FaultDialog=="undefined"){
if(typeof console!="undefined"){
console.log("An unhandled fault was returned: %o",_1220);
}
return;
}
if(!this.m_faultDialog){
this.m_faultDialog=new FaultDialog(this.getViewer());
}
if(_1220&&_1220.getResponseHeader&&_1220.getResponseHeader("Content-type").indexOf("text/html")!=-1){
this.m_faultDialog.handleUnknownHTMLResponse(_1220.getResponseText());
}else{
if(_1220&&_1220.getSoapFault){
this.m_faultDialog.show(_1220.getSoapFault());
}else{
if(oCV.getSoapFault()){
var _1222=XMLBuilderLoadXMLFromString(oCV.getSoapFault());
this.m_faultDialog.show(_1222);
oCV.setSoapFault("");
}else{
if(typeof console!="undefined"){
console.log("An unhandled fault was returned: %o",_1220);
}
}
}
}
};
BaseRequestHandler.prototype.isAuthenticationFault=function(_1223){
var oCV=this.getViewer();
var _1225=null;
if(_1223&&_1223.getSoapFault){
_1225=_1223.getSoapFault();
}else{
if(oCV.getSoapFault()){
_1225=XMLBuilderLoadXMLFromString(oCV.getSoapFault());
}
}
if(_1225!=null){
var _1226=XMLHelper_FindChildByTagName(_1225,"CAM",true);
return (_1226!=null&&XMLHelper_FindChildByTagName(_1226,"promptInfo",true)!=null);
}
return false;
};
BaseRequestHandler.prototype.onPassportTimeout=function(_1227){
var oCV=this.getViewer();
if(this.m_workingDialog){
this.m_workingDialog.hide();
}
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
if(!this.m_logOnDialog){
this.m_logOnDialog=new LogOnDialog(this.getViewer());
}
if(_1227&&_1227.getResponseHeader&&_1227.getResponseHeader("Content-type").indexOf("text/html")!=-1){
var _1229="";
if(_1227.getResponseText){
_1229=_1227.getResponseText();
}
if((_1229.indexOf("http-equiv=\"refresh\"")!=-1)||(_1229.indexOf("http-equiv='refresh'")!=-1)){
this.m_logOnDialog.show(null);
}else{
this.m_logOnDialog.handleUnknownHTMLResponse(_1229);
}
}else{
if(_1227&&_1227.getSoapFault){
this.m_logOnDialog.show(_1227.getSoapFault());
}else{
if(oCV.getSoapFault()){
var _122a=XMLBuilderLoadXMLFromString(oCV.getSoapFault());
this.m_logOnDialog.show(_122a);
oCV.setSoapFault("");
}else{
if(typeof console!="undefined"){
console.log("BaseRequestHandler.prototype.onPassportTimeout: An unhandled authentication fault was returned: %o",_1227);
}
}
}
}
};
BaseRequestHandler.prototype.onWorking=function(_122b){
if(this.m_workingDialog){
var _122c=_122b&&typeof _122b.getAsynchStatus=="function"&&_122b.getAsynchStatus()=="stillWorking"?true:false;
if(!_122c){
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
this.m_workingDialog.show();
}
}
};
BaseRequestHandler.prototype.onCancel=function(){
if(this.m_workingDialog){
this.m_workingDialog.hide();
}
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
var oCV=this.getViewer();
oCV.gbPromptRequestSubmitted=false;
this._processDelayedLoadingQueue();
};
BaseRequestHandler.prototype._processDelayedLoadingQueue=function(){
var oCV=this.getViewer();
if(oCV&&oCV.getViewerWidget()){
var _122f=oCV.getViewerWidget();
if(_122f.getLoadManager()){
_122f.getLoadManager().processQueue();
}
}
};
BaseRequestHandler.prototype.onPrompting=function(_1230){
var oCV=this.getViewer();
if(this.m_workingDialog){
this.m_workingDialog.hide();
}
if(this.m_requestIndicator){
this.m_requestIndicator.hide();
}
if(!this.m_promptDialog){
this.m_promptDialog=new PromptDialog(this.getViewer());
}
window["AsynchRequestObject"]=_1230;
window["AsynchRequestPromptDialog"]=this.m_promptDialog;
var _1232="?cv.id="+oCV.getId();
window["AsynchRequestPromptDialog"].initialize(oCV.getWebContentRoot()+"/rv/showStandalonePrompts.html"+_1232,400,400);
window["AsynchRequestPromptDialog"].show();
};
BaseRequestHandler.prototype.processDATAReportResponse=function(_1233){
var oCV=this.getViewer();
if(!oCV||oCV.m_destroyed){
if(console){
console.warn("Tried to process a data response on an invalid CCognosViewer",oCV);
}
return;
}
var _1235=_1233.getResponseState();
if(!_1235){
this.resubmitInSafeMode();
}
if(this.loadReportHTML(_1233.getResult())===false){
this.resubmitInSafeMode();
}
this.updateViewerState(_1235);
};
BaseRequestHandler.prototype.updateViewerState=function(_1236){
var oCV=this.getViewer();
applyJSONProperties(oCV,_1236);
var _1238=oCV.getStatus();
if(typeof oCV.envParams["ui.spec"]!="undefined"&&oCV.envParams["ui.spec"].indexOf("&lt;")===0){
oCV.envParams["ui.spec"]=xml_decode(oCV.envParams["ui.spec"]);
}
if(_1238!="fault"){
if(oCV.envParams["rapReportInfo"]){
this._processRapReportInfo(oCV);
}
if(typeof _1236.clientunencodedexecutionparameters!="undefined"){
var _1239=document.getElementById("formWarpRequest"+oCV.getId());
if(_1239!=null&&typeof _1239["clientunencodedexecutionparameters"]!="undefined"){
_1239["clientunencodedexecutionparameters"].value=_1236.clientunencodedexecutionparameters;
}
if(typeof document.forms["formWarpRequest"]!="undefined"&&typeof document.forms["formWarpRequest"]["clientunencodedexecutionparameters"]!="undefined"){
document.forms["formWarpRequest"]["clientunencodedexecutionparameters"].value=_1236.clientunencodedexecutionparameters;
}
}
}else{
oCV.setTracking("");
}
};
BaseRequestHandler.prototype._processRapReportInfo=function(oCV){
if(oCV.envParams["rapReportInfo"]){
var _123b=eval("("+oCV.envParams["rapReportInfo"]+")");
if(typeof RAPReportInfo!="undefined"){
var _123c=new RAPReportInfo(_123b,oCV);
oCV.setRAPReportInfo(_123c);
}
}
};
BaseRequestHandler.prototype.loadReportHTML=function(_123d){
if(!_123d){
return true;
}
var oCV=this.getViewer();
if(window.IBM&&window.IBM.perf){
window.IBM.perf.log("viewer_gotHtml",oCV);
}
if(oCV.m_undoStack.length>0){
oCV.m_undoStack[oCV.m_undoStack.length-1].m_bRefreshPage=true;
}
oCV.pageNavigationObserverArray=[];
oCV.m_flashChartsObjectIds=[];
var sHTML=_123d.replace(/<form[^>]*>/gi,"").replace(/<\/form[^>]*>/gi,"");
oCV.m_sHTML=sHTML;
oCV.setHasPrompts(false);
var id=oCV.getId();
var _1241=document.getElementById("RVContent"+id);
var _1242=document.getElementById("CVReport"+id);
if(window.gScriptLoader){
var _1243=oCV.getViewerWidget()?true:false;
var _1244=oCV.getViewerWidget()?document.getElementById("_"+oCV.getViewerWidget().iContext.widgetId+"_cv"):_1242;
sHTML=window.gScriptLoader.loadCSS(sHTML,_1244,_1243,id);
}
if(oCV.sBrowser=="ie"){
sHTML="<span style='display:none'>&nbsp;</span>"+sHTML;
}
_1242.innerHTML=sHTML;
this.massageHtmlBeforeDisplayed();
if(window.gScriptLoader){
var _1245=GUtil.generateCallback(oCV.showLoadedContent,[_1241],oCV);
oCV.m_resizeReady=false;
if(!window.gScriptLoader.loadAll(_1242,_1245,id,true)){
if(window.gScriptLoader.containsAjaxWarnings()){
return false;
}
}
}else{
_1241.style.display="block";
}
var _1246=document.querySelectorAll("button");
var _1247=_1246.length;
for(var k=0;k<_1247;k++){
var _1249=_1246[k];
var id=_1249.id;
var _124a=id.match(/reprompt/);
if(_124a){
var _124b=_1249.outerHTML;
var _124c=_124b.match(/layoutname="\w+"/);
if(_124c!==null){
var _124d=_124c[0];
var _124e=/".*"/;
var _124f=_124e.exec(_124d);
if(oCV.getCurrentPromptControlFocus()==_124f){
_1249.focus();
oCV.setCurrentPromptControlFocus(null);
_1249=null;
}
}else{
oCV.setCurrentPromptControlFocus(null);
_1249=null;
}
}
}
this._clearFindState();
return true;
};
BaseRequestHandler.prototype._clearFindState=function(){
var oCV=this.getViewer();
var _1251=oCV.getState()&&oCV.getState().getFindState()?oCV.getState().getFindState():null;
if(_1251&&!_1251.findOnServerInProgress()){
oCV.getState().clearFindState();
}
};
BaseRequestHandler.prototype.showReport=function(){
var oCV=this.getViewer();
var _1253=document.getElementById("CVReport"+oCV.getId());
if(_1253){
_1253.style.display="";
}
};
BaseRequestHandler.prototype.postComplete=function(){
var oCV=this.getViewer();
if(oCV.shouldWriteNavLinks()){
oCV.writeNavLinks(oCV.getSecondaryRequests().join(" "));
}
if(oCV.getStatus()==="complete"){
oCV.m_undoStack=[new CognosViewerSession(oCV)];
}
};
BaseRequestHandler.prototype.onAsynchStatusUpdate=function(_1255){
if(this.m_httpRequestConfig){
var _1256=this.m_httpRequestConfig.getReportStatusCallback(_1255);
if(_1256){
_1256();
}
}
};
BaseRequestHandler.prototype.addCallbackHooks=function(){
if(!this.m_httpRequestConfig){
return;
}
this._addCallback("complete","onComplete");
this._addCallback("working","onWorking");
this._addCallback("prompting","onPrompting");
};
BaseRequestHandler.prototype._addCallback=function(_1257,_1258){
var _1259=_1257;
var _125a=this[_1258];
this[_1258]=function(_125b){
_125a.apply(this,arguments);
var _125c=null;
if(_125b&&typeof _125b.getAsynchStatus=="function"){
_125c=_125b.getAsynchStatus();
}else{
_125c=_1259=="complete"?this.getViewer().getStatus():_1259;
}
if(_125c=="stillWorking"){
return;
}
var _125d=this.m_httpRequestConfig.getReportStatusCallback(_125c);
if(typeof _125d=="function"){
setTimeout(_125d,10);
}
};
};
function ViewerBaseWorkingDialog(_125e){
if(!_125e){
return;
}
this.setCognosViewer(_125e);
this.m_oCV=_125e;
this.m_sNamespace=_125e.getId();
this.m_sGateway=_125e.getGateway();
this.m_UIBlacklist=null;
this.m_bUse=true;
this.m_bCancelSubmitted=false;
};
ViewerBaseWorkingDialog.prototype=new IRequestIndicator();
ViewerBaseWorkingDialog.prototype.setCognosViewer=function(oCV){
this.m_oCV=oCV;
};
ViewerBaseWorkingDialog.prototype.getCognosViewer=function(){
return this.m_oCV;
};
ViewerBaseWorkingDialog.prototype.getGateway=function(){
return this.m_sGateway;
};
ViewerBaseWorkingDialog.prototype.getNamespace=function(){
return this.m_sNamespace;
};
ViewerBaseWorkingDialog.prototype.cancelSubmitted=function(){
return this.m_bCancelSubmitted;
};
ViewerBaseWorkingDialog.prototype.setCancelSubmitted=function(_1260){
this.m_bCancelSubmitted=_1260;
};
ViewerBaseWorkingDialog.prototype.show=function(){
var _1261=document.getElementById(this.getContainerId());
if(_1261){
_1261.style.display="block";
this.enableCancelButton();
}else{
this.create();
}
var _1262=document.getElementById("reportBlocker"+this.m_oCV.getId());
if(_1262){
_1262.style.display="block";
}
};
ViewerBaseWorkingDialog.prototype.create=function(){
if(typeof document.body!="undefined"){
if(this.isModal()){
this.createModalWaitDialog();
}else{
this.createInlineWaitDialog();
}
}
};
ViewerBaseWorkingDialog.prototype.createContainer=function(_1263){
var _1264=document.createElement("div");
_1264.setAttribute("id",this.getContainerId());
_1264.className=_1263?"modalWaitPage":"inlineWaitPage";
return _1264;
};
ViewerBaseWorkingDialog.prototype.createModalWaitDialog=function(){
this._createBlocker();
var _1265=this.createContainer(true);
_1265.innerHTML=this.renderHTML();
_1265.style.zIndex="7002";
_1265.setAttribute("role","region");
_1265.setAttribute("aria-label",RV_RES.GOTO_WORKING);
document.body.appendChild(_1265);
var _1266=this.createModalIframeBackground();
document.body.appendChild(_1266);
var _1267=0;
var iLeft=0;
if(typeof window.innerHeight!="undefined"){
_1267=Math.round((window.innerHeight/2)-(_1265.offsetHeight/2));
iLeft=Math.round((window.innerWidth/2)-(_1265.offsetWidth/2));
}else{
_1267=Math.round((document.body.clientHeight/2)-(_1265.offsetHeight/2));
iLeft=Math.round((document.body.clientWidth/2)-(_1265.offsetWidth/2));
}
_1265.style.bottom=_1267+"px";
_1265.style.left=iLeft+"px";
_1266.style.left=iLeft-1+"px";
_1266.style.bottom=_1267-1+"px";
_1266.style.width=_1265.offsetWidth+2+"px";
_1266.style.height=_1265.offsetHeight+2+"px";
};
ViewerBaseWorkingDialog.prototype._createBlocker=function(){
var _1269=document.getElementById("reportBlocker"+this.m_oCV.getId());
if(_1269){
return;
}
var _126a=document.getElementById("mainViewerTable"+this.m_oCV.getId());
if(_126a){
_1269=document.createElement("div");
_126a.parentNode.appendChild(_1269);
_1269.id="reportBlocker"+this.m_oCV.getId();
_1269.style.zIndex="6001";
_1269.style.position="absolute";
_1269.style.top="0px";
_1269.style.left="0px";
_1269.style.width="100%";
_1269.style.height="100%";
_1269.style.display="none";
_1269.style.opacity="0";
_1269.style.backgroundColor="#FFFFFF";
_1269.style.filter="alpha(opacity:0)";
}
};
ViewerBaseWorkingDialog.prototype.createInlineWaitDialog=function(){
var _126b=this.m_oCV.getId();
var _126c=document.getElementById("CVReport"+_126b);
if(_126c){
var _126d=this.createContainer(false);
_126d.innerHTML="<table width=\"100%\" height=\"100%\"><tr><td valign=\"middle\" align=\"center\" role=\"presentation\">"+this.renderHTML()+"</td></tr></table>";
_126c.appendChild(_126d);
}
};
ViewerBaseWorkingDialog.prototype.createModalIframeBackground=function(){
var _126e=document.createElement("iframe");
var _126f="..";
var oCV=this.getCognosViewer();
if(oCV!==null){
_126f=oCV.getWebContentRoot();
}
_126e.setAttribute("id",this.getContainerId()+"Iframe");
_126e.setAttribute("title","Empty iframe");
_126e.setAttribute("src",_126f+"/common/images/spacer.gif");
_126e.setAttribute("scrolling","no");
_126e.setAttribute("frameborder","0");
_126e.style.position="absolute";
_126e.style.zIndex="6002";
_126e.style.display="block";
return _126e;
};
ViewerBaseWorkingDialog.prototype.updateCoords=function(_1271,_1272){
if(this.m_container!==null&&m_iframeBackground!==null){
var _1273=0;
var iLeft=0;
if(typeof window.innerHeight!="undefined"){
_1273=Math.round((window.innerHeight/2)-(_1271.offsetHeight/2));
iLeft=Math.round((window.innerWidth/2)-(_1271.offsetWidth/2));
}else{
_1273=Math.round((document.body.clientHeight/2)-(_1271.offsetHeight/2));
iLeft=Math.round((document.body.clientWidth/2)-(_1271.offsetWidth/2));
}
_1271.style.bottom=_1273+"px";
_1271.style.left=iLeft+"px";
_1272.style.left=_1271.style.left;
_1272.style.bottom=_1271.style.bottom;
_1272.style.width=_1271.offsetWidth+"px";
_1272.style.height=_1271.offsetHeight+"px";
}
};
ViewerBaseWorkingDialog.prototype.hide=function(){
var _1275=document.getElementById(this.getContainerId());
if(_1275){
_1275.parentNode.removeChild(_1275);
}
var _1276=document.getElementById(this.getContainerId()+"Iframe");
if(_1276){
_1276.parentNode.removeChild(_1276);
}
var _1277=document.getElementById("reportBlocker"+this.m_oCV.getId());
if(_1277){
_1277.parentNode.removeChild(_1277);
}
};
ViewerBaseWorkingDialog.prototype.isModal=function(){
var _1278=this.m_oCV.getId();
var _1279=document.getElementById("CVReport"+_1278);
var _127a=true;
if(_1279&&_1279.innerHTML===""){
_127a=false;
}
return _127a;
};
ViewerBaseWorkingDialog.prototype.disableCancelButton=function(_127b){
};
ViewerBaseWorkingDialog.prototype.enableCancelButton=function(){
};
function FaultDialog(oCV){
this.m_oCV=oCV;
};
FaultDialog.prototype=new IFaultDialog();
FaultDialog.prototype.show=function(_127d){
if(typeof console!="undefined"){
console.log("FaultDialog - an unhandled soap fault was returned: %o",_127d);
}
};
FaultDialog.prototype.handleUnknownHTMLResponse=function(_127e){
this.m_oCV.setTracking("");
this.m_oCV.setConversation("");
if(_127e){
if(this.m_oCV.envParams["useAlternateErrorCodeRendering"]){
var _127f=document.getElementsByTagName("head")[0];
var _1280=_127e.match(/<body[^>]*>([\s\S]*)<\/body>/im)[1];
var _1281=/<script[^>]*>([\s\S]*?)<\/script>/igm;
var _1282=_1281.exec(_127e);
while(_1282!=null){
var _1283=document.createElement("script");
_1283.type="text/javascript";
var _1284=_1282[0].match(/src="([\s\S]*?)"/i);
if(_1284==null){
_1283.text=_1282[1];
}else{
_1283.src=_1284[1];
}
_127f.appendChild(_1283);
_1282=_1281.exec(_127e);
}
document.body.innerHTML=_1280;
}else{
document.write(_127e);
}
}
};
function LogOnDialog(oCV){
this.m_oCV=oCV;
};
LogOnDialog.prototype=new ILogOnDialog();
LogOnDialog.prototype.handleUnknownHTMLResponse=function(_1286){
if(_1286){
document.write(_1286);
}
};
LogOnDialog.prototype.show=function(_1287){
launchLogOnDialog(this.m_oCV.getId(),_1287);
};
LogOnDialog.prototype.hide=function(){
};
function PromptDialog(oCV){
this.m_oCV=oCV;
this.m_dialogImpl=null;
};
PromptDialog.prototype=new IPromptDialog();
PromptDialog.prototype.initialize=function(url,width,_128b){
this.m_dialogImpl=new CModal("","",document.body,null,null,width,_128b,true,true,false,true,this.m_oCV.getWebContentRoot());
var _128c=document.getElementById(CMODAL_CONTENT_ID);
_128c.src=url;
};
PromptDialog.prototype.show=function(){
this.m_dialogImpl.show();
};
PromptDialog.prototype.hide=function(){
this.m_dialogImpl.hide();
destroyCModal();
};
function WorkingDialog(_128d){
if(_128d){
this.m_bSimpleWorkingDialog=false;
this.m_bShowCancelButton=(_128d.getAdvancedServerProperty("VIEWER_JS_HIDE_CANCEL_BUTTON")=="true")?false:true;
WorkingDialog.baseConstructor.call(this,_128d);
this.m_secondaryRequests=_128d.getSecondaryRequests();
}
};
WorkingDialog.prototype=new ViewerBaseWorkingDialog();
WorkingDialog.baseConstructor=ViewerBaseWorkingDialog;
WorkingDialog.prototype.setSecondaryRequests=function(_128e){
this.m_secondaryRequests=_128e;
};
WorkingDialog.prototype._getSecondaryRequests=function(){
return this.m_secondaryRequests;
};
WorkingDialog.prototype.getIsSavedReport=function(){
return this.getCognosViewer().bIsSavedReport;
};
WorkingDialog.prototype.setSimpleWorkingDialogFlag=function(flag){
this.m_bSimpleWorkingDialog=flag;
};
WorkingDialog.prototype.getSimpleWorkingDialogFlag=function(){
return this.m_bSimpleWorkingDialog;
};
WorkingDialog.prototype.showDeliveryOptions=function(bShow){
var _1291=this.getNamespace();
var _1292=document.getElementById("DeliveryOptionsVisible"+_1291);
if(_1292){
_1292.style.display=(bShow===false?"none":"block");
if(bShow){
var links=_1292.getElementsByTagName("a");
for(var i=links.length;i>0;i--){
if(links[i]&&links[i].getAttribute("tabIndex")=="0"){
links[i].focus();
}
}
}
}
_1292=document.getElementById("OptionsLinkSelected"+_1291);
if(_1292){
_1292.style.display=(bShow===false?"none":"block");
}
_1292=document.getElementById("OptionsLinkUnselected"+_1291);
if(_1292){
_1292.style.display=(bShow===false?"block":"none");
}
};
WorkingDialog.prototype.renderHTML=function(){
var _1295=this.getNamespace();
var _1296=_1295+"_workingMsg "+_1295+"_workingMsg2";
var html="<table class=\"viewerWorkingDialog\" id=\"CVWaitTable"+_1295+"\""+" role=\"presentation\">";
html+=("<tr>"+"<td align=\"center\">"+"<div tabIndex=\"0\" role=\"presentation\" aria-labelledby=\""+_1296+"\""+" class=\"body_dialog_modal workingDialogDiv\">");
html+=this.renderFirstInnerTable();
html+=this.renderSecondInnerTable();
html+=("</div>"+"</td>"+"</tr>"+"</table>");
return html;
};
WorkingDialog.prototype.renderFirstInnerTable=function(){
var _1298=this.getSimpleWorkingDialogFlag();
var _1299=_1298?RV_RES.GOTO_WORKING:RV_RES.RV_RUNNING;
var _129a=this.m_sNamespace;
var _129b="<table class=\"workingDialogInnerTable\" role=\"presentation\">"+"<tr>"+"<td valign=\"middle\">";
var _129c=this.getCognosViewer().getSkin()+"/branding/";
_129b+="<img src=\""+_129c+"progress.gif\"";
if(isIE()){
_129b+=" width=\"48\" height=\"48\" border=\"0\"";
}
_129b+=" name=\"progress\"";
if(isIE()){
_129b+=" align=\"top\"";
}
_129b+=" alt=\"";
_129b+=_1299;
_129b+="\"/></td>";
_129b+="<td width=\"20\">&nbsp;</td>";
_129b+="<td style=\"padding-top: 5px;\" class=\"tableText\">";
_129b+="<span id=\""+_129a+"_workingMsg\">";
_129b+=_1299;
_129b+="</span>";
_129b+="<br/><br/>";
var _129d=this.getCognosViewer().envParams["cv.responseFormat"];
if(_1298||this.isUIBlacklisted("RV_TOOLBAR_BUTTONS")||!this.deliverySectionIsNeeded()||(_129d&&("qs"===_129d||"fragment"===_129d))){
_129b+=RV_RES.RV_PLEASE_WAIT;
}else{
var _129e=this.canShowDeliveryOptions();
if(_129e){
_129b+=this.optionLinkSelectedDiv();
_129b+=this.optionLinkUnselectedDiv();
}else{
_129b+=RV_RES.RV_PLEASE_WAIT;
}
}
_129b+="</td></tr><tr><td colspan=\"3\">&nbsp;</td></tr></table>";
return _129b;
};
WorkingDialog.prototype.optionLinkSelectedDiv=function(){
var _129f="";
_129f+="<div id=\"OptionsLinkSelected"+this.getNamespace()+"\" style=\"display: none\">";
_129f+=RV_RES.RV_BUSY_OPTIONS_SELECTED;
_129f+="</div>";
return _129f;
};
WorkingDialog.prototype.optionLinkUnselectedDiv=function(){
var _12a0="";
var _12a1=this.getNamespace();
var _12a2="window.oCV"+_12a1+".getWorkingDialog()";
_12a0+="<div id=\"OptionsLinkUnselected"+_12a1+"\">";
_12a0+="<span id=\""+_12a1+"_workingMsg2\">";
_12a0+=RV_RES.RV_BUSY_OPTIONS_UNSELECTED;
_12a0+="</span><br/>";
_12a0+="<a href=\"#\" class=\"deliveryOptionLink\" onclick=\"javascript:"+_12a2+".showDeliveryOptions(true)\">";
_12a0+=RV_RES.RV_BUSY_OPTIONS_LINK;
_12a0+="</a></div>";
return _12a0;
};
WorkingDialog.prototype.canShowDeliveryOptions=function(){
var _12a3=this.getCognosViewer().envParams["ui.primaryAction"];
if("saveAs"!==_12a3&&"email"!==_12a3&&this.getIsSavedReport()){
return true;
}
return false;
};
WorkingDialog.prototype.isUIBlacklisted=function(item){
var _12a5=this.getUIBlacklist();
for(var index in _12a5){
if(_12a5[index]===item){
return true;
}
}
return false;
};
WorkingDialog.prototype.getUIBlacklist=function(){
if(!this.m_UIBlacklist&&this.getCognosViewer().UIBlacklist){
this.m_UIBlacklist=this.getCognosViewer().UIBlacklist.split(" ");
}
return this.m_UIBlacklist;
};
WorkingDialog.prototype.deliverySectionIsNeeded=function(){
return !this._isSaveBlackListed()||!this._isSaveAsBlackListed()||!this._isEmailBlackListed();
};
WorkingDialog.prototype._isSaveBlackListed=function(){
return this.isUIBlacklisted("RV_TOOLBAR_BUTTONS_SAVE")||this.isUIBlacklisted("RV_WORKING_DIALOG_SAVE")||!this._hasSecondaryRequest("save");
};
WorkingDialog.prototype._isSaveAsBlackListed=function(){
return this.isUIBlacklisted("RV_TOOLBAR_BUTTONS_SAVEAS")||this.isUIBlacklisted("RV_WORKING_DIALOG_SAVEAS")||!this._hasSecondaryRequest("saveAs");
};
WorkingDialog.prototype._isEmailBlackListed=function(){
return this.isUIBlacklisted("RV_TOOLBAR_BUTTONS_SEND")||this.isUIBlacklisted("RV_WORKING_DIALOG_SEND")||!this._hasSecondaryRequest("email");
};
WorkingDialog.prototype.showCancelButton=function(){
return this.m_bShowCancelButton;
};
WorkingDialog.prototype._hasSecondaryRequest=function(_12a7){
var _12a8=this._getSecondaryRequests();
if(_12a8){
var _12a9=_12a8.length;
for(var i=0;i<_12a9;i++){
if(_12a8[i]==_12a7){
return true;
}
}
}
return false;
};
WorkingDialog.prototype.renderSecondInnerTable=function(){
var _12ab="";
var _12ac=this.getCognosViewer().getWebContentRoot();
_12ab+="<table width=\"300\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\">";
_12ab+="<tr id=\"DeliveryOptionsVisible"+this.getNamespace()+"\" class=\"workingDialogOptions\">";
_12ab+="<td align=\"left\">";
_12ab+="<table class=\"workingDialogInnerTable workingDialogLinks\" role=\"presentation\">";
var _12ad=this.canShowDeliveryOptions();
if(_12ad&&this.deliverySectionIsNeeded()){
if(!this._isSaveBlackListed()){
_12ab+=this.addDeliverOption("/rv/images/action_save_report_output.gif",RV_RES.RV_SAVE_REPORT,"SaveReport(true);");
}
if("reportView"!==this.getCognosViewer().envParams["ui.objectClass"]&&!this._isSaveAsBlackListed()){
_12ab+=this.addDeliverOption("/rv/images/action_save_report_view.gif",RV_RES.RV_SAVE_AS_REPORT_VIEW,"SaveAsReportView(true);");
}
if(!this.isUIBlacklisted("CC_RUN_OPTIONS_EMAIL_ATTACHMENT")&&!this._isEmailBlackListed()){
_12ab+=this.addDeliverOption("/rv/images/action_send_report.gif",RV_RES.RV_EMAIL_REPORT,"SendReport(true);");
}
}
_12ab+="</table></td></tr> ";
_12ab+="<tr style=\"padding-top: 5px\"> ";
_12ab+="<td align=\"left\" colspan=\"3\" id=\"cancelButtonContainer"+this.getNamespace()+"\"> ";
if(this.showCancelButton()){
_12ab+=this.addCancelButton();
}
_12ab+="</td></tr> ";
_12ab+="</table> ";
return _12ab;
};
WorkingDialog.prototype.addDeliverOption=function(_12ae,sText,_12b0){
var _12b1="";
var _12b2=this.getCognosViewer().getWebContentRoot();
var _12b3="javascript: window.oCV"+this.getNamespace()+".getRV().";
var _12b4=_12b3+_12b0;
_12b1+="<tr><td> ";
_12b1+="<a tabIndex=\"-1\" href=\""+_12b0+"\"> ";
_12b1+="<img border=\"0\" src=\""+_12b2+_12ae+"\" alt=\" "+html_encode(sText)+"\"/></a> ";
_12b1+="</td><td width=\"100%\" valign=\"middle\" class=\"tableText\"> ";
_12b1+="<a tabIndex=\"0\" role=\"link\" href=\"#\" onclick=\""+_12b4+"\" style=\"padding-left: 5px\" class=\"deliveryOptionLink\"> ";
_12b1+=(sText+"</a></td></tr>");
return _12b1;
};
WorkingDialog.prototype.addCancelButton=function(){
var _12b5="";
var _12b6=this.getCognosViewer().getWebContentRoot();
_12b5+="<table role=\"presentation\"><tr><td> ";
_12b5+="<table id=\"cvWorkingDialog"+this.getNamespace()+"\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" onmouseover=\"this.className = 'commandButtonOver'\" onmouseout=\"this.className = 'commandButton'\" onmousedown=\"this.className = 'commandButtonDown'\" class=\"commandButton\"> ";
_12b5+="<tr> ";
_12b5+="<td valign=\"middle\" align=\"center\" nowrap=\"nowrap\" class=\"workingDialogCancelButton\" ";
if(isIE()){
_12b5+="id=\"btnAnchorIE\" ";
}else{
_12b5+="id=\"btnAnchor\" ";
}
_12b5+="> ";
var _12b7="window.oCV"+this.m_sNamespace+".cancel(this)";
_12b5+="<a href=\"#\" onclick=\""+_12b7+"\"> ";
_12b5+=RV_RES.CANCEL;
_12b5+="</a> ";
_12b5+="</td></tr></table></td> ";
_12b5+="<td><img alt=\"\" height=\"1\"  ";
if(isIE()){
_12b5+="width=\"10\"  ";
}
_12b5+="src=\""+_12b6+"/ps/images/space.gif\"/></td> ";
_12b5+="</tr></table> ";
return _12b5;
};
WorkingDialog.prototype.disableCancelButton=function(_12b8){
this.cancelButtonDisabled=true;
var _12b9=document.getElementById("cvWorkingDialog"+this.getNamespace());
if(_12b9){
_12b9.style.cursor="default";
_12b9.className="commandButtonOver";
_12b9.removeAttribute("onmouseover");
_12b9.removeAttribute("onmouseout");
}
if(_12b8){
_12b8.removeAttribute("href");
_12b8.removeAttribute("onclick");
_12b8.style.cursor="default";
}
};
WorkingDialog.prototype.enableCancelButton=function(){
if(this.cancelButtonDisabled){
var _12ba=document.getElementById("cancelButtonContainer"+this.getNamespace());
if(_12ba){
_12ba.innerHTML=this.addCancelButton();
}
this.cancelButtonDisabled=false;
}
};
WorkingDialog.prototype.getContainerId=function(){
return "CVWait"+this.getNamespace();
};
function RequestExecutedIndicator(_12bb){
if(_12bb){
RequestExecutedIndicator.baseConstructor.call(this,_12bb);
}
};
RequestExecutedIndicator.baseConstructor=WorkingDialog;
RequestExecutedIndicator.prototype=new WorkingDialog();
RequestExecutedIndicator.prototype.renderHTML=function(){
var _12bc="<table id=\"CVWaitTable"+this.getNamespace()+"\" requestExecutionIndicator=\"true\" class=\"viewerWorkingDialog\" role=\"presentation\">";
_12bc+="<tr><td align=\"center\">";
_12bc+="<div class=\"body_dialog_modal\">";
_12bc+="<table align=\"center\" cellspacing=\"0\" cellpadding=\"0\" style=\"vertical-align:middle; text-align: left;\" role=\"presentation\">";
_12bc+="<tr><td rowspan=\"2\">";
_12bc+="<img alt=\""+RV_RES.GOTO_WORKING+"\" src=\""+this.getCognosViewer().getSkin()+"/branding/progress.gif\" style=\"margin:5px;\" width=\"48\" height=\"48\" name=\"progress\"/>";
_12bc+="</td><td nowrap=\"nowrap\"><span class=\"busyUpdatingStr\">";
_12bc+=RV_RES.GOTO_WORKING;
_12bc+="</span></td></tr><tr><td nowrap=\"nowrap\"><span class=\"busyUpdatingStr\">";
_12bc+=RV_RES.RV_PLEASE_WAIT;
_12bc+="</span></td></tr><tr><td style=\"height:7px;\" colspan=\"2\"></td></tr></table></div></td></tr></table>";
return _12bc;
};
RequestExecutedIndicator.prototype.getContainerId=function(){
return "CVWaitindicator"+this.getNamespace();
};
function RequestHandler(oCV){
if(oCV){
RequestHandler.baseConstructor.call(this,oCV);
}
};
RequestHandler.prototype=new BaseRequestHandler();
RequestHandler.baseConstructor=BaseRequestHandler;
RequestHandler.prototype.parent=BaseRequestHandler.prototype;
RequestHandler.prototype.resubmitInSafeMode=function(){
this.getViewer().resubmitInSafeMode(this.getDispatcherEntry());
};
RequestHandler.prototype.onComplete=function(_12be){
this.parent.onComplete.call(this,_12be);
this.processDATAReportResponse(_12be);
this.postComplete();
};
RequestHandler.prototype.processInitialResponse=function(_12bf){
this.parent.processInitialResponse.call(this,_12bf);
var oCV=this.getViewer();
var _12c1=oCV.getStatus();
oCV.setMaxContentSize();
var _12c2=(oCV.isWorking(_12c1)||_12c1=="default");
if(_12c2){
if(oCV.getWorkingDialog()){
oCV.getWorkingDialog().show();
}
setTimeout(getCognosViewerObjectRefAsString(oCV.getId())+".executeCallback(\"wait\");",10);
}else{
if(_12c1=="fault"){
oCV.setSoapFault(_12bf.m_sSoapFault);
oCV.executeCallback("fault");
}else{
if(_12bf.status=="cancel"){
oCV.executeCallback("cancel");
}else{
oCV.updateSkipToReportLink();
if(oCV.envParams&&oCV.envParams["pinFreezeInfo"]){
var _12c3=oCV.getPinFreezeManager();
_12c3.fromJSONString(oCV.envParams["pinFreezeInfo"]);
delete oCV.envParams["pinFreezeInfo"];
}
if(_12c1!="prompting"||!oCV.executeCallback("prompt")){
this.postComplete();
}else{
oCV.updateSkipToNavigationLink(true);
}
}
}
}
this.showReport();
this.getViewer().renderTabs();
this.onAsynchStatusUpdate(_12c1);
};
RequestHandler.prototype.postComplete=function(){
this.parent.postComplete.call(this);
var oCV=this.getViewer();
var _12c5=document.getElementById("RVContent"+oCV.getId());
if(_12c5){
_12c5.scrollTop=0;
}
oCV.updateSkipToReportLink();
if(oCV.rvMainWnd){
oCV.updateLayout(oCV.getStatus());
if(!oCV.getUIConfig()||oCV.getUIConfig().getShowToolbar()){
var _12c6=oCV.rvMainWnd.getToolbar();
if(_12c6){
oCV.rvMainWnd.updateToolbar(oCV.outputFormat);
_12c6.draw();
}
}
if(!oCV.getUIConfig()||oCV.getUIConfig().getShowBanner()){
var _12c7=oCV.rvMainWnd.getBannerToolbar();
if(_12c7){
_12c7.draw();
}
}
}
if(oCV.getBrowser()=="moz"){
if(_12c5){
if(oCV.outputFormat=="XML"&&oCV.getStatus()!="prompting"){
_12c5.style.overflow="hidden";
}else{
_12c5.style.overflow="auto";
}
}
}
oCV.gbPromptRequestSubmitted=false;
this.showReport();
if(oCV.getPinFreezeManager()&&oCV.getPinFreezeManager().hasFrozenContainers()){
var _12c8=document.getElementById("CVReport"+oCV.getId());
if(_12c8){
setTimeout(function(){
oCV.getPinFreezeManager().renderReportWithFrozenContainers(_12c8);
if(isIE()){
oCV.repaintDiv(_12c5);
}
},1);
}
}
oCV.setMaxContentSize();
oCV.executeCallback("done");
oCV.doneLoading();
};
function ActionFormFields(_12c9){
this.m_dispatcherEntry=_12c9;
this.m_oCV=_12c9.getViewer();
};
ActionFormFields.prototype.addFormFields=function(){
var _12ca=this.m_dispatcherEntry;
var _12cb=_12ca.getAction();
_12cb.preProcess();
_12ca.addFormField("ui.action","modifyReport");
if(this.m_oCV.getModelPath()!==""){
_12ca.addFormField("modelPath",this.m_oCV.getModelPath());
if(typeof this.m_oCV.envParams["metaDataModelModificationTime"]!="undefined"){
_12ca.addFormField("metaDataModelModificationTime",this.m_oCV.envParams["metaDataModelModificationTime"]);
}
}
if(_12cb.doAddActionContext()===true){
var _12cc=_12cb.addActionContext();
_12ca.addFormField("cv.actionContext",_12cc);
if(window.gViewerLogger){
window.gViewerLogger.log("Action context",_12cc,"xml");
}
}
var isBux=this.m_oCV.envParams["bux"]=="true";
if(isBux){
_12ca.addFormField("cv.showFaultPage","false");
}else{
_12ca.addFormField("cv.showFaultPage","true");
}
_12ca.addFormField("ui.object",this.m_oCV.envParams["ui.object"]);
_12ca.addDefinedFormField("ui.spec",this.m_oCV.envParams["ui.spec"]);
_12ca.addDefinedFormField("modelPath",this.m_oCV.envParams["modelPath"]);
_12ca.addDefinedFormField("packageBase",this.m_oCV.envParams["packageBase"]);
_12ca.addDefinedFormField("rap.state",this.m_oCV.envParams["rap.state"]);
_12ca.addDefinedFormField("rap.reportInfo",this.m_oCV.envParams["rapReportInfo"]);
_12ca.addDefinedFormField("ui.primaryAction",this.m_oCV.envParams["ui.primaryAction"]);
_12ca.addNonNullFormField("cv.debugDirectory",this.m_oCV.envParams["cv.debugDirectory"]);
_12ca.addNonNullFormField("ui.objectClass",this.m_oCV.envParams["ui.objectClass"]);
_12ca.addNonNullFormField("bux",this.m_oCV.envParams["bux"]);
_12ca.addNonNullFormField("baseReportModificationTime",this.m_oCV.envParams["baseReportModificationTime"]);
_12ca.addNonNullFormField("originalReport",this.m_oCV.envParams["originalReport"]);
var _12ce=this.m_oCV.getFlashChartOption();
if(_12ce!=null){
_12ca.addFormField("savedFlashChartOption",_12ce);
if(_12ce&&_12cb!=null&&typeof (_12cb.m_requestParams)!="undefined"&&typeof (_12cb.m_requestParams.targetType)!="undefined"){
var _12cf=false;
var _12d0=null;
if(typeof (_12cb.m_requestParams.targetType.targetType)!="undefined"){
_12d0=_12cb.m_requestParams.targetType.targetType;
}else{
_12d0=_12cb.m_requestParams.targetType;
}
if(_12d0.match("v2_")!=null||_12d0.match("_v2")!=null){
_12cf=true;
}else{
var _12d1=this.m_oCV.getRAPReportInfo();
var _12d2=_12cb.getSelectedReportInfo();
if(_12d1&&_12d2){
var _12d3=_12d1.getDisplayTypes(_12d2.container);
if(_12d3.match("v2_")!=null||_12d3.match("_v2")!=null){
_12cf=true;
}
}
}
_12ca.addFormField("hasAVSChart",_12cf);
}else{
_12ca.addFormField("hasAVSChart",this.m_oCV.hasAVSChart());
}
}
var sEP=this.m_oCV.getExecutionParameters();
if(sEP){
_12ca.addFormField("executionParameters",encodeURIComponent(sEP));
}
_12ca.addFormField("ui.conversation",encodeURIComponent(this.m_oCV.getConversation()));
_12ca.addFormField("m_tracking",encodeURIComponent(this.m_oCV.getTracking()));
var sCAF=this.m_oCV.getCAFContext();
if(sCAF){
_12ca.addFormField("ui.cafcontextid",sCAF);
}
if(_12cb.forceRunSpecRequest()){
_12ca.addFormField("widget.forceRunSpec","true");
}
};
function ViewerDispatcher(){
this.m_activeRequest=null;
this.m_requestQueue=[];
this.m_bUsePageRequest=false;
};
ViewerDispatcher.prototype.getActiveRequest=function(){
return this.m_activeRequest;
};
ViewerDispatcher.prototype.setUsePageRequest=function(_12d6){
this.m_bUsePageRequest=_12d6;
};
ViewerDispatcher.prototype.getUsePageRequest=function(){
return this.m_bUsePageRequest;
};
ViewerDispatcher.prototype.dispatchRequest=function(_12d7){
if(this.m_activeRequest==null){
this.startRequest(_12d7);
}else{
if(_12d7.canBeQueued()==true){
this.m_requestQueue.push(_12d7);
}else{
if(window.cognosViewerDebug&&console&&console.warn){
console.warn("Warning! Dropped a dispatcher entry!");
}
}
}
};
ViewerDispatcher.prototype.startRequest=function(_12d8){
this.m_activeRequest=_12d8;
if(_12d8!=null){
_12d8.setUsePageRequest(this.m_bUsePageRequest);
_12d8.sendRequest();
}
};
ViewerDispatcher.prototype.cancelRequest=function(key){
for(var i=0;i<this.m_requestQueue.length;i++){
var _12db=this.m_requestQueue[i];
if(_12db.getKey()===key){
_12db.setCallbacks({"onEntryComplete":null});
_12db.cancelRequest(false);
this.m_requestQueue.splice(i,1);
i--;
}
}
if(this.m_activeRequest&&this.m_activeRequest.getKey()===key){
this.m_activeRequest.setCallbacks({"onEntryComplete":null});
this.m_activeRequest.cancelRequest(false);
this.requestComplete();
}
};
ViewerDispatcher.prototype.possibleUnloadEvent=function(){
if(this.m_activeRequest){
this.m_activeRequest.possibleUnloadEvent();
}
};
ViewerDispatcher.prototype.requestComplete=function(_12dc){
this.startRequest(this.nextRequest());
};
ViewerDispatcher.prototype.nextRequest=function(){
var _12dd=null;
if(this.m_requestQueue.length>0){
_12dd=this.m_requestQueue.shift();
if(_12dd.getKey()!=null){
while(this.m_requestQueue.length>0&&this.m_requestQueue[0].getKey()==_12dd.getKey()){
_12dd=this.m_requestQueue.shift();
}
}
}
return _12dd;
};
ViewerDispatcher.prototype.queueIsEmpty=function(){
return (this.m_requestQueue.length==0);
};
function DispatcherEntry(oCV){
this.m_oCV=oCV;
this.m_requestKey=null;
this.m_canBeQueued=false;
this.m_originalFormFields=null;
this.m_bUsePageRequest=false;
if(oCV){
if(!this.m_request){
this.m_request=new XmlHttpObject();
this.m_request.init("POST",this.m_oCV.getGateway(),"",true);
}
if(!this.m_requestHandler){
this.setRequestHandler(new BaseRequestHandler(oCV));
}
DispatcherEntry.prototype.setDefaultFormFields.call(this);
this.setCallbacks({"entryComplete":{"object":this,"method":this.onEntryComplete},"entryFault":{"object":this,"method":this.onEntryFault},"newRequest":{"object":this,"method":this.onNewRequest},"fault":{"object":this,"method":this.onFault},"error":{"object":this,"method":this.onError},"passportTimeout":{"object":this,"method":this.onPassportTimeout},"working":{"object":this,"method":this.onWorking},"prompting":{"object":this,"method":this.onPrompting},"preHttpRequest":{"object":this,"method":this.onPreHttpRequest},"postHttpRequest":{"object":this,"method":this.onPostHttpRequest},"postEntryComplete":{"object":this,"method":this.onPostEntryComplete}});
}
};
DispatcherEntry.prototype.setHeaders=function(_12df){
this.m_request.setHeaders(_12df);
};
DispatcherEntry.prototype.getHeaders=function(){
return this.m_request.getHeaders();
};
DispatcherEntry.prototype.setOriginalFormFields=function(_12e0){
this.m_originalFormFields=_12e0;
};
DispatcherEntry.prototype.getOriginalFormFields=function(){
return this.m_originalFormFields;
};
DispatcherEntry.prototype.setRequestHandler=function(_12e1){
_12e1.addCallbackHooks();
this.m_requestHandler=_12e1;
};
DispatcherEntry.prototype.getRequestHandler=function(){
return this.m_requestHandler;
};
DispatcherEntry.prototype.setWorkingDialog=function(_12e2){
if(this.getRequestHandler()){
this.m_requestHandler.setWorkingDialog(_12e2);
}
};
DispatcherEntry.prototype.setRequestIndicator=function(_12e3){
if(this.getRequestHandler()){
this.getRequestHandler().setRequestIndicator(_12e3);
}
};
DispatcherEntry.prototype.forceSynchronous=function(){
this.getRequest().forceSynchronous();
};
DispatcherEntry.prototype.setUsePageRequest=function(_12e4){
this.m_bUsePageRequest=_12e4;
};
DispatcherEntry.prototype.getUsePageRequest=function(){
return this.m_bUsePageRequest;
};
DispatcherEntry.prototype.setDefaultFormFields=function(){
var _12e5=this.getViewer().envParams;
this.addFormField("b_action","cognosViewer");
this.addFormField("cv.catchLogOnFault","true");
this.addDefinedNonNullFormField("protectParameters",_12e5["protectParameters"]);
this.addDefinedNonNullFormField("ui.routingServerGroup",_12e5["ui.routingServerGroup"]);
this.addDefinedNonNullFormField("cv.debugDirectory",_12e5["cv.debugDirectory"]);
this.addDefinedNonNullFormField("cv.showFaultPage",_12e5["cv.showFaultPage"]);
this.addDefinedNonNullFormField("cv.useRAPDrill",_12e5["cv.useRAPDrill"]);
this.addDefinedNonNullFormField("container",_12e5["container"]);
this.addNonEmptyStringFormField("cv.objectPermissions",_12e5["cv.objectPermissions"]);
};
DispatcherEntry.prototype.getViewer=function(){
return this.m_oCV;
};
DispatcherEntry.prototype.prepareRequest=function(){
};
DispatcherEntry.addWidgetInfoToFormFields=function(_12e6,_12e7){
if(_12e6){
var _12e8=_12e6.getBUXRTStateInfoMap();
if(_12e8){
_12e7.addFormField("cv.buxRTStateInfo",_12e8);
}
var _12e9=_12e6.getDisplayName();
if(_12e9&&_12e9.length>0){
_12e7.addFormField("displayTitle",_12e9);
}
}
};
DispatcherEntry.prototype.canBeQueued=function(){
return this.m_canBeQueued;
};
DispatcherEntry.prototype.setCanBeQueued=function(_12ea){
this.m_canBeQueued=_12ea;
};
DispatcherEntry.prototype.getKey=function(){
return this.m_requestKey;
};
DispatcherEntry.prototype.setKey=function(key){
this.m_requestKey=key;
};
DispatcherEntry.prototype.setRequest=function(_12ec){
this.m_request=_12ec;
};
DispatcherEntry.prototype.getRequest=function(){
return this.m_request;
};
DispatcherEntry.prototype.setCallbacks=function(_12ed){
this.getRequest().setCallbacks(_12ed);
};
DispatcherEntry.prototype.getCallbacks=function(){
return this.getRequest().getCallbacks();
};
DispatcherEntry.prototype.sendRequest=function(){
this.prepareRequest();
var _12ee=this.getRequest().getFormFields();
var _12ef=_12ee.keys();
if(!this.m_originalFormFields){
this.m_originalFormFields=new CDictionary();
for(var index=0;index<_12ef.length;index++){
this.m_originalFormFields.add(_12ef[index],_12ee.get(_12ef[index]));
}
}
this.getRequest().sendRequest();
};
DispatcherEntry.prototype.onNewRequest=function(_12f1){
this.setRequest(_12f1);
};
DispatcherEntry.prototype.retryRequest=function(){
var oCV=this.getViewer();
oCV.setRetryDispatcherEntry(null);
var _12f3=this.getRequest().newRequest();
_12f3.setHeaders(null);
this.setRequest(_12f3);
var _12f4=this.m_originalFormFields.keys();
for(var index=0;index<_12f4.length;index++){
var _12f6=_12f4[index];
var _12f7=this.m_originalFormFields.get(_12f6);
if(_12f6=="cv.responseFormat"&&_12f7=="iWidget"){
this.addFormField("cv.responseFormat","data");
}else{
if(_12f6=="ui.action"&&_12f7=="wait"){
this.addFormField("ui.action",this.m_originalFormFields.get("ui.primaryAction"));
}else{
if(_12f6!="m_tracking"&&_12f6!="cv.outputKey"){
this.addFormField(_12f6,_12f7);
}
}
}
}
this.addFormField("widget.reloadToolbar","true");
if(this.m_oCV.getViewerWidget()){
this.addFormField("cv.buxCurrentUserRole",this.m_oCV.getViewerWidget().getUserRole());
}
this.addNonEmptyStringFormField("cv.objectPermissions",oCV.envParams["cv.objectPermissions"]);
this.addNonEmptyStringFormField("limitedInteractiveMode",oCV.envParams["limitedInteractiveMode"]);
this.m_oCV.getViewerDispatcher().dispatchRequest(this);
};
DispatcherEntry.prototype.abortHttpRequest=function(){
if(!this.m_bCancelCalled){
if(this.getRequestHandler()){
this.getRequestHandler().onCancel();
}
this.m_bCancelCalled=true;
this.getRequest().abortHttpRequest();
this.onEntryComplete();
}
};
DispatcherEntry.prototype.cancelRequest=function(_12f8){
if(!this.m_bCancelCalled){
this.m_bCancelCalled=true;
if(this.getRequestHandler()){
this.getRequestHandler().onCancel();
}
if(_12f8){
this.getRequest().forceSynchronous();
}
this.getRequest().cancel();
this.onEntryComplete();
}
};
DispatcherEntry.prototype.getFormFields=function(){
return this.m_request.getFormFields();
};
DispatcherEntry.prototype.getFormField=function(name){
if(this.m_request){
return this.m_request.getFormField(name);
}else{
return "";
}
};
DispatcherEntry.prototype.clearFormFields=function(){
this.m_request.clearFormFields();
};
DispatcherEntry.prototype.formFieldExists=function(name){
if(this.m_request){
return this.m_request.getFormFields().exists(name);
}
return false;
};
DispatcherEntry.prototype.removeFormField=function(name){
if(this.formFieldExists(name)){
this.m_request.getFormFields().remove(name);
}
};
DispatcherEntry.prototype.addFormField=function(name,value){
this.m_request.addFormField(name,value);
};
DispatcherEntry.prototype.addDefinedNonNullFormField=function(name,value){
if(typeof value!="undefined"&&value!=null){
this.addFormField(name,value);
}
};
DispatcherEntry.prototype.addDefinedFormField=function(name,value){
if(typeof value!="undefined"){
this.addFormField(name,value);
}
};
DispatcherEntry.prototype.addNonNullFormField=function(name,value){
if(value!=null){
this.addFormField(name,value);
}
};
DispatcherEntry.prototype.addNonEmptyStringFormField=function(name,value){
if(typeof value!="undefined"&&value!=null&&value!=""){
this.addFormField(name,value);
}
};
DispatcherEntry.prototype.onWorking=function(_1306,arg1){
if(this.getRequestHandler()){
this.getRequestHandler().onWorking(_1306);
}
};
DispatcherEntry.prototype.onFault=function(_1308){
if(this.getRequestHandler()){
this.getRequestHandler().onFault(_1308);
}
};
DispatcherEntry.prototype.onError=function(_1309){
if(this.m_bCancelCalled){
return;
}
if(this.getRequestHandler()){
this.getRequestHandler().onError(_1309);
}
};
DispatcherEntry.prototype.possibleUnloadEvent=function(){
this.setCallbacks({"error":{}});
};
DispatcherEntry.prototype.onPreHttpRequest=function(_130a){
if(this.getRequestHandler()){
this.getRequestHandler().preHttpRequest(_130a);
}
};
DispatcherEntry.prototype.onPostHttpRequest=function(_130b){
if(this.getRequestHandler()){
this.getRequestHandler().postHttpRequest(_130b);
}
};
DispatcherEntry.prototype.onPassportTimeout=function(_130c){
if(this.getRequestHandler()){
this.getRequestHandler().onPassportTimeout(_130c);
}
};
DispatcherEntry.prototype.onPrompting=function(_130d){
if(this.getRequestHandler()){
this.getRequestHandler().onPrompting(_130d);
}
};
DispatcherEntry.prototype.onEntryComplete=function(_130e){
if(!this.m_oCV._beingDestroyed){
this.m_oCV.getViewerDispatcher().requestComplete(this);
}
};
DispatcherEntry.prototype.onEntryFault=function(_130f){
this.m_oCV.setFaultDispatcherEntry(this);
this.m_oCV.resetViewerDispatcher();
if(!this.m_bCancelCalled){
this.m_oCV.setRetryDispatcherEntry(this);
}
};
DispatcherEntry.prototype.onCloseErrorDlg=function(){
var _1310=this.getCallbacks();
if(_1310["closeErrorDlg"]){
var _1311=GUtil.generateCallback(_1310["closeErrorDlg"].method,[],_1310["closeErrorDlg"].object);
_1311();
}
};
DispatcherEntry.prototype.onPostEntryComplete=function(){
if(this.getRequestHandler()){
this.getRequestHandler().onPostEntryComplete();
}
this.executeCallback("postComplete");
};
DispatcherEntry.prototype.executeCallback=function(_1312){
var _1313=this.getCallbacks();
if(_1313[_1312]){
var _1314=(_1313.customArguments)?[this,_1313.customArguments]:[this];
var _1315=GUtil.generateCallback(_1313[_1312].method,_1314,_1313[_1312].object);
_1315();
return true;
}
return false;
};
function DataDispatcherEntry(oCV){
if(oCV){
this.setRequest(new AsynchDATARequest(oCV.getGateway(),oCV.getWebContentRoot()));
}
DataDispatcherEntry.baseConstructor.call(this,oCV);
};
DataDispatcherEntry.prototype=new DispatcherEntry();
DataDispatcherEntry.baseConstructor=DispatcherEntry;
function JSONDispatcherEntry(oCV){
if(oCV){
this.setRequest(new AsynchJSONRequest(oCV.getGateway(),oCV.getWebContentRoot()));
}
JSONDispatcherEntry.prototype.setDefaultFormFields.call(this);
JSONDispatcherEntry.baseConstructor.call(this,oCV);
};
JSONDispatcherEntry.prototype=new DispatcherEntry();
JSONDispatcherEntry.baseConstructor=DispatcherEntry;
JSONDispatcherEntry.prototype.setDefaultFormFields=function(){
this.addFormField("cv.responseFormat","JSON");
};
function AsynchDataDispatcherEntry(oCV){
if(oCV){
var _1319=new AsynchDATARequest(oCV.getGateway(),oCV.getWebContentRoot());
this.setRequest(_1319);
AsynchDataDispatcherEntry.baseConstructor.call(this,oCV);
AsynchDataDispatcherEntry.prototype.setDefaultFormFields.call(this);
}
};
AsynchDataDispatcherEntry.prototype=new DispatcherEntry();
AsynchDataDispatcherEntry.baseConstructor=DispatcherEntry;
AsynchDataDispatcherEntry.prototype.setDefaultFormFields=function(){
this.addFormField("cv.responseFormat","data");
};
function AsynchJSONDispatcherEntry(oCV){
if(oCV){
var _131b=new AsynchJSONRequest(oCV.getGateway(),oCV.getWebContentRoot());
this.setRequest(_131b);
AsynchJSONDispatcherEntry.baseConstructor.call(this,oCV);
AsynchJSONDispatcherEntry.prototype.setDefaultFormFields.call(this);
}
};
AsynchJSONDispatcherEntry.prototype=new DispatcherEntry();
AsynchJSONDispatcherEntry.baseConstructor=DispatcherEntry;
AsynchJSONDispatcherEntry.prototype.setDefaultFormFields=function(){
this.addFormField("cv.responseFormat","asynchJSON");
};
function ReportDispatcherEntry(oCV){
ReportDispatcherEntry.baseConstructor.call(this,oCV);
if(oCV){
ReportDispatcherEntry.prototype.setDefaultFormFields.call(this);
this.setRequestHandler(new RequestHandler(oCV));
this.setWorkingDialog(oCV.getWorkingDialog());
this.setRequestIndicator(oCV.getRequestIndicator());
this.setCallbacks({"complete":{"object":this,"method":this.onComplete},"prompting":{"object":this,"method":this.onComplete}});
}
};
ReportDispatcherEntry.prototype=new AsynchDataDispatcherEntry();
ReportDispatcherEntry.baseConstructor=AsynchDataDispatcherEntry;
ReportDispatcherEntry.prototype.parent=AsynchDataDispatcherEntry.prototype;
ReportDispatcherEntry.prototype.prepareRequest=function(){
var _131d=this.getFormField("ui.action");
var _131e=this.getViewer().getActionState();
if(_131e!==""&&(_131d=="wait"||_131d=="forward"||_131d=="back")){
this.addFormField("cv.actionState",_131e);
}
var _131f=["nextPage","previousPage","firstPage","lastPage","reportAction","cancel","wait"];
var _1320=true;
for(var i=0;i<_131f.length;i++){
if(_131f[i]==_131d){
_1320=false;
break;
}
}
if(_1320){
this.getViewer().clearTabs();
}
if(this.getViewer().getCurrentlySelectedTab()&&!this.formFieldExists("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup")&&this.getViewer().getStatus()!="prompting"){
this.addFormField("generic.anyURI.http://developer.cognos.com/ceba/constants/runOptionEnum#pageGroup",this.getViewer().getCurrentlySelectedTab());
}
};
ReportDispatcherEntry.prototype.setDefaultFormFields=function(){
var oCV=this.getViewer();
var _1323=oCV.envParams;
this.addFormField("cv.id",oCV.getId());
if(_1323["cv.showFaultPage"]){
this.addFormField("cv.showFaultPage",_1323["cv.showFaultPage"]);
}else{
this.addFormField("cv.showFaultPage","false");
}
this.addDefinedNonNullFormField("ui.object",_1323["ui.object"]);
this.addDefinedNonNullFormField("ui.primaryAction",_1323["ui.primaryAction"]);
this.addDefinedNonNullFormField("ui.objectClass",_1323["ui.objectClass"]);
this.addNonEmptyStringFormField("specificationType",_1323["specificationType"]);
this.addNonEmptyStringFormField("cv.promptForDownload",_1323["cv.promptForDownload"]);
this.addNonEmptyStringFormField("ui.conversation",oCV.getConversation());
this.addNonEmptyStringFormField("m_tracking",oCV.getTracking());
var _1324=oCV.getExecutionParameters();
this.addNonEmptyStringFormField("executionParameters",_1324);
var sCAF=oCV.getCAFContext();
this.addDefinedNonNullFormField("ui.cafcontextid",sCAF);
};
ReportDispatcherEntry.prototype.onWorking=function(_1326,arg1){
var _1328=_1326.getResponseState();
var _1329=this.getRequestHandler();
if(_1329){
var _132a=_1329.getWorkingDialog();
if(_132a&&_132a.setSecondaryRequests&&_1328.m_aSecRequests){
_132a.setSecondaryRequests(_1328.m_aSecRequests);
}
}
DispatcherEntry.prototype.onWorking.call(this,_1326,arg1);
if(_1329){
this.getRequestHandler().updateViewerState(_1328);
}
};
ReportDispatcherEntry.prototype.onComplete=function(_132b,arg1){
if(this.getRequestHandler()){
this.getRequestHandler().onComplete(_132b);
}
};
function ViewerDispatcherEntry(oCV){
ViewerDispatcherEntry.baseConstructor.call(this,oCV);
if(oCV){
ViewerDispatcherEntry.prototype.setDefaultFormFields.call(this);
this.setCallbacks({"complete":{"object":this,"method":this.onComplete},"prompting":{"object":this,"method":this.onPrompting},"cancel":{"object":this,"method":this.onCancel}});
}
};
ViewerDispatcherEntry.prototype=new ReportDispatcherEntry();
ViewerDispatcherEntry.baseConstructor=ReportDispatcherEntry;
ViewerDispatcherEntry.prototype.parent=ReportDispatcherEntry.prototype;
ViewerDispatcherEntry.prototype.setDefaultFormFields=function(){
var oCV=this.getViewer();
var _132f=oCV.envParams;
this.addFormField("cv.showFaultPage","true");
this.addDefinedNonNullFormField("cv.header",_132f["cv.header"]);
this.addDefinedNonNullFormField("cv.toolbar",_132f["cv.toolbar"]);
this.addDefinedNonNullFormField("ui.backURL",_132f["ui.backURL"]);
this.addDefinedNonNullFormField("errURL",_132f["ui.backURL"]);
this.addDefinedNonNullFormField("errURL",_132f["ui.errURL"]);
this.addDefinedNonNullFormField("cv.catchLogOnFault","true");
this.addDefinedNonNullFormField("m_sessionConv",_132f["m_sessionConv"]);
if(_132f["m_session"]){
this.addFormField("m_session",_132f["m_session"]);
this.addFormField("cv.ignoreState","true");
}
};
ViewerDispatcherEntry.prototype.prepareRequest=function(){
this.parent.prepareRequest.call(this);
if(this.getUsePageRequest()){
this.m_oCV.setKeepSessionAlive(true);
if(typeof this.m_oCV.envParams["cv.responseFormat"]!="undefined"&&this.m_oCV.envParams["cv.responseFormat"]!=null&&this.m_oCV.envParams["cv.responseFormat"]!=""){
this.addFormField("cv.responseFormat",this.m_oCV.envParams["cv.responseFormat"]);
}else{
if(this.getFormField("cv.responseFormat")!="view"){
this.addFormField("cv.responseFormat","page");
}
}
var _1330=this.m_oCV.getPinFreezeManager();
if(_1330&&_1330.hasFrozenContainers()){
this.addFormField("pinFreezeInfo",_1330.toJSONString());
}
if(this.m_oCV.envParams["cv.createCallback"]){
this.addFormField("cv.createCallback",this.m_oCV.envParams["cv.createCallback"]);
}
}
};
ViewerDispatcherEntry.prototype.sendRequest=function(){
if(this.getUsePageRequest()){
this.prepareRequest();
var _1331=this.buildRequestForm();
if(typeof document.progress!="undefined"){
setTimeout("document.progress.src=\""+this.m_oCV.getSkin()+"/branding/progress.gif"+"\";",1);
}
_1331.submit();
}else{
this.getViewer().closeContextMenuAndToolbarMenus();
this.parent.sendRequest.call(this);
}
};
ViewerDispatcherEntry.prototype.buildRequestForm=function(){
var oCV=this.getViewer();
var _1333=document.createElement("form");
_1333.setAttribute("id","requestForm");
_1333.setAttribute("name","requestForm");
_1333.setAttribute("method","post");
_1333.setAttribute("target","_self");
_1333.setAttribute("action",oCV.getGateway());
_1333.style.display="none";
document.body.appendChild(_1333);
var _1334=this.getRequest().getFormFields();
var _1335=_1334.keys();
for(var index=0;index<_1335.length;index++){
_1333.appendChild(this.createHiddenFormField(_1335[index],_1334.get(_1335[index])));
}
for(param in oCV.envParams){
if(!_1334.exists(param)&&param!="cv.actionState"){
_1333.appendChild(this.createHiddenFormField(param,oCV.envParams[param]));
}
}
return _1333;
};
ViewerDispatcherEntry.prototype.createHiddenFormField=function(name,value){
var _1339=document.createElement("input");
_1339.setAttribute("type","hidden");
_1339.setAttribute("name",name);
_1339.setAttribute("id",name);
_1339.setAttribute("value",value);
return (_1339);
};
ViewerDispatcherEntry.prototype.onCancel=function(){
var oCV=this.getViewer();
oCV.setStatus("complete");
if(this.getUsePageRequest()||!oCV.isReportRenderingDone()){
oCV.executeCallback("cancel");
}
};
ViewerDispatcherEntry.prototype.onFault=function(_133b){
if(this.getViewer().callbackExists("fault")){
this.getViewer().setSoapFault(_133b.getSoapFault());
this.getViewer().executeCallback("fault");
}else{
this.parent.onFault.call(this,_133b);
}
};
ViewerDispatcherEntry.prototype.onComplete=function(_133c){
var oCV=this.getViewer();
oCV.saveBackJaxInformation(_133c);
if(oCV.isReportRenderingDone()){
this.getViewer().getSelectionController().resetSelections();
}
this.parent.onComplete.call(this,_133c);
};
ViewerDispatcherEntry.prototype.onPrompting=function(_133e){
var oCV=this.getViewer();
oCV.updateSkipToNavigationLink(true);
if(!oCV.executeCallback("prompt")){
this.onComplete(_133e);
}
};
ViewerDispatcherEntry.prototype.onEntryComplete=function(_1340){
if(this.getRequestHandler()){
this.getRequestHandler().setDispatcherEntry(this);
}
this.parent.onEntryComplete.call(this,_1340);
};

