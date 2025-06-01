/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: ca-ui-common
 *| (C) Copyright IBM Corp. 2020, 2021
 *|
 *| US Government Users Restricted Rights - Use, duplication or disclosure
 *| restricted by GSA ADP Schedule Contract with IBM Corp.
 *+------------------------------------------------------------------------+
 */
// eslint-disable-next-line no-undef
requirejs.config({
	paths: {
		'ca-ui-common-components': 'js/ca-ui-common/ca-ui-common-components.min',
		'ca-ui-common-filters': 'js/ca-ui-common/ca-ui-common-filters.min',
		'ca-ui-carbon-toolkit': 'js/ca-ui-common/ca-ui-carbon-toolkit.min',
		'ca-ui-carbon-toolkit-core': 'js/ca-ui-common/ca-ui-carbon-toolkit-core.min',
		'ca-ui-carbon-toolkit-common-chunk': 'js/ca-ui-common/ca-ui-carbon-toolkit-common-chunk.min',
		'ca-ui-carbon': 'js/ca-ui-common/ca-ui-carbon.min',
		'ca-graphics': 'js/ca-graphics',
	},
	map: {
		'*': {
			'@ba/ba-ui-carbon': 'ca-ui-carbon',	
			'@ba/ba-ui-carbon-toolkit': 'ca-ui-carbon-toolkit',	
			'@ba/ba-ui-common-components': 'ca-ui-common-components',	
			'@ba/ba-ui-common-components/lib/filters': 'ca-ui-common-filters',	
			'@ba/ba-graphics/dist/icons-js/ba-graphics-icons-commons': 'ca-graphics/icons-js/ba-graphics-icons-commons',
			'@ba/ba-graphics/dist/illustrations-js/ba-graphics-icons-commons': 'ca-graphics/illustrations-js/ba-graphics-icons-commons',
			'@ba/ba-graphics/dist/icons-js/ba-graphics-icons-commons.js': 'ca-graphics/icons-js/ba-graphics-icons-commons',
			'@ba/ba-graphics/dist/illustrations-js/ba-graphics-icons-commons.js': 'ca-graphics/illustrations-js/ba-graphics-icons-commons',
			// The following added temporarily to help folk migrate to the new toolkit.
			'ba-ui-carbon-toolkit': 'ca-ui-carbon-toolkit',
			'ca-ui-toolkit-core': 'ca-ui-carbon-toolkit-common-core',
			'ba-ui-carbon': 'ca-ui-carbon',
			'ca-ui-toolkit': 'ca-ui-carbon-toolkit',
		},
	},
});
