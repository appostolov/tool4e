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
		key: Const.PAGE.TERMS.KEY,
		proxy: Const.PROXY,
		type: CONST.WIDGET.TYPE.PAGE,
		template: Const.PAGE.TERMS.TEMPLATE,
		cssAdd: Const.PAGE.TERMS.CSS,
		track: Const.PAGE.TERMS.TRACK,
		childList: [
            {
                type: CONST.WIDGET.TYPE.BUTTON,
                text: 'index',
                onClick: function(){

                    location.replace('index.php');
                }
            }
        ]
	};
	
	return new Base( indexPage );
});