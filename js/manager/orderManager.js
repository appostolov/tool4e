define(
[
	'external/jquery/jquery.module',
	'core/matrix',
	'manager/coordManager',
	'external/underscore/underscore.min'
],
function( $, matrix, coordManager ){
	
	function orderManager(){};
	
	orderManager.prototype = {
		
		point: function( x, y, z ){

		    return [[x], [y], [z]];
		},

		checkPoint: function( point ){

		    return _.isEqual( matrix.size( point ), [3, 1]);
        },

        checkStep: function( step, radius ){

            if( !_.isNumber( step ) || step <= 0 ) return;

            if( !_.isNumber( radius ) || radius <= 0 ) return;

            var length = 2 * Math.PI * radius;

            if( step > length ) return;

            if( length / step < 2 ) return length;

            return length / Math.floor( length / step );
        },

		line: function( start, dir, step, count ){

			if( !this.checkPoint( start ) || !this.checkPoint( dir ) ) return;

		    if( !_.isNumber( step ) || step < 0 ) return;

		    if( !_.isNumber( count ) || count <= 0 ) return;

		    var temp = start;

		    var result = [];

		    for( var a = 0; a < count; a ++ ){

		        result.push( [[temp[0][0]], [temp[1][0]], [temp[2][0]]] );

		        temp = coordManager.move( temp, dir, [[step]] );
		    }
		    return result;
		},

		circle: function( center, radius, step ){

			if( !this.checkPoint( center ) ) return;

			if( !_.isNumber( radius ) || radius < 0 ) return;

			if( !_.isNumber( step ) || step < 0 ) return;

			step = this.checkStep( step, radius );

			if( !step ) return;

			var stepAng = ( 360 * step ) / ( 2 * Math.PI * radius );

			var start = [[0], [0], [radius]];

			var count = Math.floor( 360 / stepAng );

			var result = [];

			var temp;

			for( var a = 0; a < count; a ++ ){

				temp = coordManager.rotateVector( [[0], [1], [0]], a * stepAng, start );

				temp = coordManager.move( temp, center, [[1]] );

				result.push( [[temp[0][0]], [temp[1][0]], [temp[2][0]]] );
			}
			return result;
		},

		baloon: function( center, radius, step ){

            if( !this.checkPoint( center ) ) return;

            if( !_.isNumber( radius ) || radius < 0 ) return;

            if( !_.isNumber( step ) || step < 0 ) return;

            step = this.checkStep( step, radius );

            if( !step ) return;

            var stepAng = ( 360 * step ) / ( 2 * Math.PI * radius );

            var start = [[0], [0], [radius]];

            var count = Math.floor( 90 / stepAng );

            if( count < 2 )  return;

            var result = [];

            var temp;

            for( var a = 0; a < count; a ++ ){

                if( a === 0 ){

                    result.concat( this.circle( center, radius, step ) );

                }else if( a < count - 1 ){

                    temp = coordManager.rotateVector( [[1], [0], [0]], a * stepAng, start );

                    temp = coordManager.move( temp, center, [[1]] );

                    result = result.concat( this.circle( [[0], [temp[1][0]], [0]], temp[2][0], step ) );

                    result = result.concat( this.circle( [[0], [-temp[1][0]], [0]], temp[2][0], step ) );

                }else{

                    result.push( [[center[0][0]], [center[1][0] + radius], [center[2][0]]] );
                    result.push( [[center[0][0]], [center[1][0] - radius], [center[2][0]]] );
                }
            }
            return result;
        },

        roundShape: function( center, step, count, radius, method ){

            if( !this.checkPoint( center ) ) return;

            if( !_.isNumber( step ) || step < 0 ) return;

            if( ( !_.isNumber( count ) || count < 0 ) && ( !_.isNumber( radius ) || radius < 0 ) ) return;

            if( _.isNumber( radius ) && radius > 0 ){

                step = this.checkStep( step, radius );

                if( !step ) return;
            }

            var result = [center];

            var tempRadius = 0;

            var ready = false;

            do{
                tempRadius += step;

                result = result.concat( this[method]( center, tempRadius, step ) );

                if( count && result.length >= count ) ready = true;
                if( radius && tempRadius >= radius ) ready = true;

            }while( !ready );

            if( count && result.length > count ) result.splice( count, result.length - count );

            return result;
        },

        disc: function( center, step, count, radius ){

            return this.roundShape( center, step, count, radius, 'circle' );
        },

        sphere: function( center, step, count, radius ){

            return this.roundShape( center, step, count, radius, 'baloon' );
        }
	};
	
	return new orderManager();
});