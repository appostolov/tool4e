define(
[
'external/jquery/jquery.module'
],
function( $ ){
	
	function eventManager(){};
	
	eventManager.prototype.trigger = function( eventName, data ){
	
		$( window ).trigger( eventName, data );
	};
	
	eventManager.prototype.on = function( eventName, cb ){
		
		var self = this;
		
		$( window ).on( eventName, function( e, data ){
							
			cb.call( self, e, data );
		});
	};
	
	eventManager.prototype.off = function( eventName ){
	
		$( window ).off( eventName );
	};
	
	return new eventManager();
});