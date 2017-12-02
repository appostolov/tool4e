define(
[ 'external/underscore/underscore.min' ],
function(){
	
	function matrix(){};

	matrix.prototype = {

		checkAllNum: function( arr ){

			if( !arr.length ) return false;

			for(  var a = 0; a < arr.length; a ++  ){

				if( typeof arr[a] !== typeof 0 ) return false;
			}
			return true;
		},

		check: function( A ){

			if( typeof A !== typeof [] ){

				return false;

			}else if( typeof A[0] !== typeof [] ){

				return false;

			}else{

				for( var a = 0; a < A.length; a ++ ){

					if( A[a].length !== A[0].length || !this.checkAllNum( A[a] ) ) return false;
				}
			}
			return true;
		},

		size: function( A ){

			if( !this.check( A ) ) return false;

			return [ A.length, A[0].length ];
		},

		showText: function( A ){

			if( !this.check( A ) ) return false;

			var txt = "";

			for( var a = 0; a < A.length; a ++ ){

				if( a !== 0 ) txt += "\n";

				for( var b = 0; b < A[0].length; b ++ ){

					txt += A[a][b];

					if( b < A[0].length - 1 ) txt += ", ";
				}
			}
			return txt;
		},
		
		add: function( A, B ){
			
			var sizeA = this.size( A );
			var sizeB = this.size( B );
			
			if( !sizeA || !sizeB || !_.isEqual( sizeA, sizeB ) ) return false;
			
			for( var a = 0; a < A.length; a ++ ){
				
				for( var b = 0; b < A[0].length; b ++ ){

					A[a][b] += B[a][b];
				}
			}
			return A;
		},
		
		subt: function( A, B ){
			
			return this.add( A, this.multiS( B, -1 ) );
		},

		multi: function( A, B ){

			if( !this.check( A ) || !this.check( B ) ) return false;

			if( A[0].length !== B.length ) return false;

			var result = [];

			for( var aV = 0; aV < A.length; aV ++ ){

				result[aV] = [];

				for( var bH = 0; bH < B[0].length; bH ++ ){

					result[aV][bH] = 0;

					for( var bV = 0; bV < B.length; bV ++ ){

						result[aV][bH] += A[aV][bV] * B[bV][bH];
					}
				}
			}
			return result;
		},
		
		multiS: function( A, s ){
			
			if( !this.check( A ) ) return false;
			
			if( typeof s !== typeof 0 ) return false;
			
			for( var a = 0; a < A.length; a ++ ){

				for( var b = 0; b < A[a].length; b ++ ){
					
					A[a][b] = A[a][b]*s;
				}
			}
			return A;
		},

		transpose: function( A ){

			if( !this.check( A ) ) return false;

			var result = [];

			for( var a = 0; a < A.length; a ++ ){

				for( var b = 0; b < A[a].length; b ++ ){

					if( a === 0 ) result[b] = [];

					result[b][a] = A[a][b];
				}
			}
			return result;
		}
	};

	return new matrix();
});