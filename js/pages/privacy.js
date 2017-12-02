var localConstPath = 'http://www.offerpre.com/c/u/js/const/pages.js';

requirejs.config({
	baseUrl: 'c/u/js',
	paths: {
		CONST: 'core/const',
		Const: localConstPath,
		proxyManager: 'manager/proxyManager',
		Base: 'pages/Base',
		underscore: 'external/underscore/underscore.min'
	}
});

requirejs(
[
	'core/const',
	localConstPath,
	'manager/proxyManager',
	'pages/Base',
	'external/underscore/underscore.min'
],
function( CONST, Const, proxyManager, Base ) {
	
	var indexPage = {
		key: Const.PAGE.PRIVACY.KEY,
		proxy: Const.PROXY,
		type: CONST.WIDGET.TYPE.PAGE,
		template: Const.PAGE.PRIVACY.TEMPLATE,
		cssAdd: Const.PAGE.PRIVACY.CSS,
		track: Const.PAGE.PRIVACY.TRACK
	};
	
	return new offerIndexPage( indexPage );
});