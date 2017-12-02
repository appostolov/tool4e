define(
[
	'external/jquery/jquery.module',
	'core/const',
	'const/events',
	'manager/ajaxManager',
	'manager/eventManager',
	'external/underscore/underscore.min'
],
function( $, CONST, EVENT, ajaxManager, eventManager ){
	
	var visit;
	
	function track(){};
	
	track.prototype = {
			
			init: function( request ){
				
				var self = this;
				
				this.Url = CONST.TRACK.PATH;
				
				var Data = {
				
					key: true,
					url: this.Url,
					type: 'POST',
					success: function( result ){
						
						if( self.check( result ) ) self.finalyze( result );
					}
				};
				Data.data = {};
					
				Data.data[CONST.TRACK.REQ.URL] = request[CONST.TRACK.REQ.URL];
				
				if( request[CONST.TRACK.REQ.AD] ) Data.data[CONST.TRACK.REQ.AD] = request[CONST.TRACK.REQ.AD];
		
				ajaxManager.req( Data );
				
			},
			
			check: function( result ){
				
				if( !result ) return;
				
				var Visit = parseInt( result );
				
				if( Visit > 0 ) visit = Visit;
				
				return true;
			},
			
			finalyze: function(){
				
				var Data = {
			
					key: true,
					url: this.Url,
					type: 'POST'
				};
				Data.data = {};
					
				Data.data[CONST.TRACK.REQ.END] = visit;
				
				window.visit = visit;
				
				$(window).on(EVENT.BEFOREUNLOAD, function(){
			
					ajaxManager.req( Data );
				 });
			}
		};
	
	return new track();
});