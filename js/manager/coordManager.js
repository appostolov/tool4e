define(
[
	'core/const',
	'core/matrix',
	'external/underscore/underscore.min'
],
function( CONST, matrix ){
	
	function coordManager(){};
	
	coordManager.prototype = {
	
		radToDeg: function( rad ){
			
			return ( 180 * rad ) / ( Math.PI );
		},
		
		degToRad: function( deg ){
			
			return ( Math.PI * deg ) / ( 180 );
		},
		
		Cos: function( deg ){
			
			return Math.cos( this.degToRad( deg ) );
		},
		
		Sin: function( deg ){
			
			return Math.sin( this.degToRad( deg ) );
		},
		
		dis: function( vector ){
			
			if( !_.isEqual( matrix.size( vector ), [3, 1]) ) return false;
			
			return Math.sqrt( Math.pow( vector[0][0], 2 ) + Math.pow( vector[1][0], 2 ) + Math.pow( vector[2][0], 2 ) );
		},
		
		matrixRotation: function( ax, angle ){

			if( !_.isEqual( matrix.size( ax ), [3, 1]) ) return false;
			
			if( typeof 0 !== typeof angle ) return false;
			
			return [
				[
					this.Cos( angle ) + ax[0][0] * ax[0][0] * ( 1 - this.Cos( angle ) ),
					ax[0][0] * ax[1][0] * ( 1 - this.Cos( angle ) ) + ax[2][0] * this.Sin( angle ),
					ax[0][0] * ax[2][0] * ( 1 - this.Cos( angle ) ) - ax[1][0] * this.Sin( angle )
				],
				[
					ax[1][0] * ax[0][0] * ( 1 - this.Cos( angle ) ) - ax[2][0] * this.Sin( angle ),
					this.Cos( angle ) + ax[1][0] * ax[1][0] * ( 1 - this.Cos( angle ) ),
					ax[1][0] * ax[2][0] * ( 1 - this.Cos( angle ) ) + ax[0][0] * this.Sin( angle )
				],
				[
					ax[2][0] * ax[0][0] * ( 1 - this.Cos( angle ) ) + ax[1][0] * this.Sin( angle ),
					ax[2][0] * ax[1][0] * ( 1 - this.Cos( angle ) ) - ax[0][0] * this.Sin( angle ),
					this.Cos( angle ) + ax[2][0] * ax[2][0] * ( 1 - this.Cos( angle ) )
				]
			];
			
		},

		rotate: function( ax, angle, target ){

			var Matrix = this.matrixRotation( ax, angle );

			if( !Matrix ) return false;

			return matrix.multi( Matrix, target );
		},
		
		rotateVector: function( ax, angle, vector ){
			
			if( !_.isEqual( matrix.size( vector ), [3, 1]) ) return false;
			
			return this.rotate( ax, angle, vector );
		},
		
		rotateSystem: function( ax, angle, system ){
			
			if( !_.isEqual( matrix.size( system ), [3, 3]) ) return false;
			
			return this.rotate( ax, angle, system );
		},
		
		move: function( position, ax, distance ){
			
			return matrix.add( position, matrix.multi( ax, distance ) );
		},
		
		switchLocal: function( system, systemPosition, globalCoordinates ){
			
			return matrix.multi( system, matrix.subt( globalCoordinates, systemPosition ) );
		},

		rotationMatrixToDegrees: function( system ){

		    if( !_.isEqual( matrix.size( system ), [3, 3]) ) return false;

		    var result = [];
		    result[0] = this.radToDeg( Math.atan2( -system[2][1], system[2][2] ) );
		    result[1] = this.radToDeg( Math.atan2( system[2][0], Math.sqrt((Math.pow(system[2][1], 2) + Math.pow(system[2][2], 2))) ) );
		    result[2] = this.radToDeg( Math.atan2( -system[1][0], system[0][0] ) );

		    return result;
		}
	};
	
	return new coordManager();
});