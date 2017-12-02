define(
[ 'core/const' ],
function( CONST ){

	return {
		
		isString: function( str ){
			
			return ( typeof "" === typeof str );
		},
		
		allSubs: function( str, subStr ){
			
			if( !this.isString( str ) || !this.isString( subStr ) ) return false;

			var parts = str.split( subStr );

			var index = 0;

			var result = [];

			for( var a = 0; a < parts.length; a ++ ){

				index += parts[a].length;

				result.push( index );

				index += subStr.length;
			}
			return result.length ? result : false;
		}
	};
});