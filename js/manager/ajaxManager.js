define(
[
	'external/jquery/jquery.module',
	'core/const',
	'external/underscore/underscore.min'
],
function( $, CONST ){
	
	function ajaxManager(){};
	
	ajaxManager.prototype = {
		
		req: function( data ){
			
			if( data.key ){
				
				var key = this.getKey();
				
				if( !key ) return false;
				
				data.data[ CONST.TRACK.KEY.NAME ] = key;
			}
			$.ajax( data );
		},
		
		getKey: function(){
			
			var key;
				
			$('head').find('meta').each( function( index, element ){
				
				if( $( element ).attr( 'name' ) === CONST.TRACK.KEY.NAME ) key = $( element ).attr( 'content' );
			});
			return key;
		},
		
		setKey: function( key ){
			
			var meta;
			
			$('head').find('meta').each( function( index, element ){
				
				if( element.attr('name') === CONST.TEMPLATE.KEY.NAME ) meta =  element;
			});
			
			if( meta ) meta.attr( 'content', key );
			else this.addMeta( key );
		},
		
		addMeta: function( key ){
			
			var html = '<meta name="' + CONST.TEMPLATE.KEY.NAME + '" content="' + key + '">';
			
			$( 'head' ).append( html );
		}
		
	};
	
	return new ajaxManager();
});