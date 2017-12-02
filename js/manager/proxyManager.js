define(
[
	'external/jquery/jquery.module',
	'core/const',
	'external/underscore/underscore.min'
],
function( $, CONST ){
	
	var path;
	
	var result = {};
	
	var wait = [];
	
	var arrived = 0;

	function proxyManager(){};

	proxyManager.prototype.set = function( url ){

		path = url;
	};
	
	proxyManager.prototype.clearWait = function(){

		wait = [];
		
		arrived = 0;
	};
	
	proxyManager.prototype.waitCheck = function( key ){
		
		for( var a = 0; a < wait.length; a ++ ){
			
			if( wait[a].key === key ) return a;
		}
		return -1;
	};
	
	proxyManager.prototype.finalize = function(){
		
		if( !wait.length ) return this.clearWait();
		
		var temp = wait;
		
		this.clearWait();
		
		for( var a = 0; a < temp.length; a ++ ){
			
			for( var b = 0; b < temp[a].cbs.length; b ++ ){
				
				temp[a].cbs[b]( temp[a].data, temp[a].status );
			}
		}
	};
	
	proxyManager.prototype.makeRequest = function( newWait ){
		
		var self = this;

		$.post(
			path,
			{ url: newWait.key },
			function( data, status ){
				
				if( status === CONST.TEMPLATE.LOAD.SUCCESS ) result[newWait.key] = data;
				
				var waitIndex = self.waitCheck( newWait.key );
				
				wait[ waitIndex ].data = data;
				wait[ waitIndex ].status = status;
				
				arrived ++;
				
				if( arrived === wait.length ) self.finalize();
			},
			newWait.type
		);
	};

	proxyManager.prototype.get = function( key, type, cb ){
		
		if( !path ) return;
		
		if( _.has( result, key ) && !wait.length ) return cb( result[key], CONST.TEMPLATE.LOAD.SUCCESS );
		
		var waitIndex = this.waitCheck( key );
		
		if( waitIndex !== -1 ) return wait[ waitIndex ].cbs.push( cb );
		
		var newWait = {
			key: key,
			cbs: [cb],
			type: type
		};
		wait.push( newWait );
		
		this.makeRequest( newWait );
	};

	return new proxyManager();
});