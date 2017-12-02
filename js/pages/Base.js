define(
[
	'core/const',
	'const/events',
	'core/track',
	'core/user',
	'manager/widgetManager',
	'manager/proxyManager',
	'manager/eventManager'
],
function( CONST, EVENT, track, user, widgetManager, proxyManager, eventManager ){
	
	function Base( config ){
		
		this.config = config;
		
		this.init();
		
		return this;
	}
	
	Base.prototype = {
		
		init: function(){
			
			proxyManager.set( this.config.proxy );
			
			var page = widgetManager.create( this.config );
			
			if( this.config.track ) track.init({
				
				url: this.config.track.url,
				ad: this.checkAd( page.getUrlData() )
			});

			if( this.config.user ){

			    page.user = new user();

			    page.user.action({
			        action: 'auto',
			        auto: true,
			        callback: function( data ){

			            eventManager.trigger( EVENT.USER.CHANGED_STATE, { 'data': data });
			        }
			    });
			}
		},

		checkAd: function( data ){

		    if( !data || !data[CONST.TRACK.REQ.AD] ) return;

		    if( !this.config || !this.config.track || !this.config.track.ad ) return;

		    var ad = parseInt( data[CONST.TRACK.REQ.AD] );

		    if( ad === this.config.track.ad ) return ad;

		    if( this.config.track.ad.indexOf && this.config.track.ad.indexOf( ad ) !== -1 ) return ad;
        }
	};
	return Base;
});