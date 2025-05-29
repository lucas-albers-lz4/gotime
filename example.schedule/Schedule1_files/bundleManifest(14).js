/**
 * IBM Confidential OCO Source Materials IBM Business Platform: CA Modeller
 * (C) Copyright IBM Corp. 2018
 *
 * The source code for this program is not published or otherwise divested of
 * its trade secrets, irrespective of what has been deposited with the U.S.
 * Copyright Office
 */
requirejs.config({
	paths: {
		modellingBridgeBundle: 'ca-modeller/bridge/modellingBridgeBundle'
	},
	bundles: {
		'ca-modeller/create': [

		],
		'ca-modeller/modelling': [

		],
		'ca-modeller/common': [

		],
		'ca-modeller/upload': [

		],
		modellingBridgeBundle: [
			'ca-modeller/bridge/nls/ModellerResources',
			'ca-modeller/bridge/nls/root/ModellerResources',
			'ca-modeller/bridge/StringResourcesBridge',
			'ca-modeller/bridge/FileUploadBridge',
			'ca-modeller/bridge/perspectivesActionHandler/UploadActionHandler',
			'ca-modeller/bridge/InternalBridge',
			'ca-modeller/bridge/perspectivesActionHandler/CreateNewModuleHandler'
		]
	}
});
