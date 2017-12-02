define(
[
	'core/const',
	'external/underscore/underscore.min'
],
function( CONST ){
	
	function filterManager(){};
	
	filterManager.prototype.filter = function( data, filter, mode ){
		
		var error = [];
		
		var result;
		
		if( !_.isObject( data ) ) return null;
		
		if( filter.dataKey ){
			
			if( this.check( data[ filter.dataKey ], filter.checkKey, filter.checkVal ) ) return true;
			
			else error.push( filter.dataKey + ":" + filter.checkKey );
			
		}else if( filter[0] ){
			
			for( var a = 0; a < filter.length; a ++){
				
				result = this.check( data[ filter[a].dataKey ], filter[a].checkKey, filter[a].checkVal );
				
				if( !result ){
					
					error.push( filter[a].dataKey + ":" + filter[a].checkKey );
					 
					if( mode === CONST.FILTER_MODE.SIMPLE ) return error;
				}
			}
			
		}else return null;
		
		if( !error.length ) return true;
		
		return error;
	};
	
	filterManager.prototype.check = function( data, key, value ){
		
		switch( key ){
			
			case CONST.FILTER_TYPE.REQUIRED:
				
				if( typeof undefined !== typeof data ) return true;
				break;
				
			case CONST.FILTER_TYPE.EQUAL:
				
				if( data == value ) return true;
				break;
				
			case CONST.FILTER_TYPE.IDENTICAL:
			
				if( data === value ) return true;
				break;
				
			case CONST.FILTER_TYPE.DATA_TYPE:
				
				if( this.dataType( data, value ) ) return true;
				break;
				

			case CONST.FILTER_TYPE.MAXLEN:
			
				if( data.length && data.length <= value ) return true;
				break;
				
				
			case CONST.FILTER_TYPE.MINLEN:
				
				if( data.length && data.length >= value ) return true;
				break;
				
				
			case CONST.FILTER_TYPE.MAXNUM:
			
				if( !isNaN(data) && !isNaN(value) && data <= value ) return true;
				break;
				
				
			case CONST.FILTER_TYPE.MINNUM:
				
				if( !isNaN(data) && !isNaN(value) && data >= value ) return true;
				break;
				
				
			case CONST.FILTER_TYPE.REGEX:
				
				if( value instanceof RegExp && value.test(data) ) return true;
				break;
				
				
			case CONST.FILTER_TYPE.MAIL:
			
				return CONST.REGEX.MAIL.test( data + "" );

			default:
				// Null to alert unknown case:
				return null;
		};
		return false;
	};
	
	filterManager.prototype.dataType = function( data, type ){
		
		switch( type ){
			
			case CONST.DATA_TYPE.NUM:
				
				return !_.isNaN( data );
				
			case CONST.DATA_TYPE.STR:
				
				return _.isString( data );
				
			case CONST.DATA_TYPE.BOOL:
				
				return _.isBoolean( data );
				
			case CONST.DATA_TYPE.OBJ:
				
				return this.notObject( data );
				
			case CONST.DATA_TYPE.ARR:
				
				return _.isArray( data );
				
			case CONST.DATA_TYPE.FUNC:
				
				return _.isFunction( data );

			default:
				return null;
		};
	};
	
	filterManager.prototype.notAnObject = function( data ){
		
		return !_.isFunction( data ) && !_.isArray( data ) && _.isObject( data );
	};
	
	return new filterManager();
});