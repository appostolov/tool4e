var localConstPath = 'c/u/js/const/pages.js';

requirejs.config({
	baseUrl: 'c/u/js',
	paths: {

	    CONST: 'core/const',
	    Const: localConstPath,
	    EVENT: 'const/events',
	    COLOR: 'const/colors',
	    Base: 'pages/Base',
	    constManager: 'manager/constManager',
	    mainMenu: 'menus/mainMenu',
	    indexPage: 'spaces/indexPage',
	    fastOptions: 'articles/fastOptions'
	}
});

requirejs(
[
    'core/const',
    localConstPath,
    'const/events',
    'const/colors',
    'pages/Base',
    'manager/constManager',
    'manager/colorManager',
    'menus/mainMenu',
    'spaces/indexPage',
    'articles/fastOptions'
],
function( CONST, Const, EVENT, COLOR, Base, constManager, colorManager, mainMenu, spaceIndexPage, fastOptions ) {
	
	var indexPage = {
		key: Const.PAGE.INDEX.KEY,
        type: CONST.WIDGET.TYPE.PAGE,
        template: Const.PAGE.INDEX.TEMPLATE,
        cssAdd: Const.PAGE.INDEX.CSS,
        className: "absoluteFull textColor",
        //track: Const.PAGE.INDEX.TRACK,
        user: true,
        childList: [
            spaceIndexPage,
            fastOptions,
            mainMenu
        ],
        afterInit: function(){

            colorManager.deployColors( COLOR );
        },
        eventListeners: [
         {
             on: EVENT.USER.CHANGED_STATE,
             callback: function( ev, data ){

                 console.log( this.user );
             }
         }
        ]
	};
	
	return new Base( indexPage );
});