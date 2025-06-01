/**
 * Licensed Materials - Property of IBM
 * IBM Cognos Products: Collaboration
 * (C) Copyright IBM Corp. 2017
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */

// eslint-disable-next-line no-undef
requirejs.config({
	paths: {
		collaboration: 'js/collaboration',
		'collaboration-ui': 'collaboration-ui'
	},
	map: {
		'*': {
			'collaboration/lib/@waca/baglass/js/baglass': 'baglass',
			'collaboration/lib/@waca/core-client': 'baglass/core-client'
		}
	},
	bundles: {
		'collaboration/bundle': [
			'collaboration/lib/@waca/image-capture/dist/js/bundles/image-capture.min',
			'collaboration/api/sharing/GenerateImage',
			'collaboration/nls/CollaborationResources',
			'collaboration/nls/root/CollaborationResources',
			'collaboration/nls/StringResources',
			'collaboration/messaging/connectors/ConnectorBase',
			'collaboration/messaging/utils/CustomStatus',
			'collaboration/messaging/utils/PopupWindow',
			'collaboration/messaging/connectors/slack/SlackAuth',
			'collaboration/messaging/utils/ImageUtils',
			'collaboration/messaging/connectors/slack/SlackClient',
			'collaboration/messaging/connectors/slack/SlackConnector',
			'collaboration/messaging/connectors/msteams/MSTeamsAuth',
			'collaboration/messaging/connectors/msteams/MSTeamsClient',
			'collaboration/messaging/connectors/msteams/MSTeamsConnector',
			'collaboration/messaging/connectors/email/EmailClient',
			'collaboration/messaging/connectors/email/EmailConnector',
			'collaboration/messaging/connectors/index',
			'collaboration/messaging/Connectors',
			'collaboration/api/sharing/ShareableItems',
			'collaboration/utils/AssetTypeUtil',
			'collaboration/api/sharing/ShareController',
			'collaboration/canvaseditor/DefaultAttributes',
			'collaboration/canvaseditor/tools/Tool',
			'collaboration/canvaseditor/shapes/Shape',
			'collaboration/canvaseditor/shapes/ArrowShape',
			'collaboration/canvaseditor/tools/ArrowTool',
			'collaboration/canvaseditor/shapes/CropShape',
			'collaboration/canvaseditor/tools/CropTool',
			'collaboration/canvaseditor/shapes/PenShape',
			'collaboration/canvaseditor/tools/PenTool',
			'collaboration/canvaseditor/shapes/RectShape',
			'collaboration/canvaseditor/tools/RectTool',
			'collaboration/canvaseditor/shapes/TextboxShape',
			'collaboration/canvaseditor/tools/TextboxTool',
			'collaboration/canvaseditor/CanvasEditor',
			'collaboration/glass/utils/GlassUtil',
			'collaboration/glass/utils/ReactBridge',
			'collaboration/glass/controllers/ShareController',
			'collaboration/glass/controllers/ShareExtraActionHandler',
			'collaboration/glass/controllers/ShareMenuController',
			'collaboration/main',
			'collaboration/all'
		]
	}
});
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}
}();

;
