define(
[
	'core/const',
	'external/underscore/underscore.min'
],
function(
	CONST
){
	function constManager(){};
	
	constManager.prototype.get = function( obj, path, sep ){

	    if( path === "" ) return [obj];

	    if( !_.isArray( obj ) && !_.isObject( obj ) ) return;

	    var steps = this.path( path, sep );

        if( !steps ) return;

        var temp = obj;
        var success = true;

        _.each( steps, function( step, index ){

            if( !_.has( temp, step ) ){

                success = false;

                return;
            }
            temp = temp[step];
        });
        if( !success ) return;

        return [temp];
	};

	constManager.prototype.exist = function( obj, path, sep ){

	    if( !_.isArray( this.get( obj, path, sep ) ) ) return false;

	    return true;
    };

	constManager.prototype.set = function( obj, path, value, sep ){

	    if( path === "" ){

	        obj = value;

	        return obj;
	    }
	    if( !_.isArray( obj ) && !_.isObject( obj ) ) obj = {};

	    var steps = this.path( path, sep );

	    if( !steps ) return;

	    var parts = [obj];
	    var temp = obj;

        _.each( steps, function( step, index ){

            if( index === steps.length - 1 ){

                parts.push( value );

                return;
            }

            if( _.has( temp, step ) ){

                temp = temp[step];

                parts.push( temp );

            }else parts.push( {} );
        });

        for( var a = steps.length - 1; a >= 0; a -- ){

            parts[a][steps[a]] = parts[a + 1];
        }
        return parts[0];
    };

    constManager.prototype.path = function( str, sep ){

        if( !_.isString( str ) || !str.length ) return false;

        if( !sep ) sep = CONST.CUSTOM.PATH_SEP;

        if( !_.isString( sep ) || !sep.length ) return false;

        var path = str.split( sep );

        if( !_.isArray( path ) || !path.length ) return false;

        _.each( path, function( element, index ){

            if( !_.isString( element ) || !element.length ) path.splice( index, 1 );
        });
        if( !path.length ) return false;

        return path;
    };
	
	return new constManager();
});