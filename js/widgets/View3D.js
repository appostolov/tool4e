define(
[
	'external/jquery/jquery.module',
	'const/events',
	'const/constSpace',
	'core/matrix',
	'manager/coordManager',
	'manager/eventManager',
	'widgets/Base',
	'external/underscore/underscore.min'
],
function( $, EVENT, constSpace, matrix, coordManager, eventManager, Base ){

	function View3D(){
		
		this.template = "<div><canvas></canvas><div>";
		this.css = "http://offerpre.com/c/u/css/widgets/view3D.css";
		this.widgetClassName = "widgetView3D";
		
		this.frameRate = constSpace.frameRate;
		this.rowndView = constSpace.rowndView;

        this.canvasSize = {
             width: window.innerWidth,
             height: window.innerHeight
        };
		return this;
	};

	View3D.prototype = new Base();
	View3D.prototype.constructor = View3D;

	View3D.prototype.setLocalSystem = function(){

		if( _.isEqual( matrix.size( this.localSystem ), [3, 3]) ) return;

		this.localSystem = [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		];
	};

	View3D.prototype.setPosition = function(){

		if( _.isEqual( matrix.size( this.position ), [3, 1]) ) return;

		this.position = [
			[0],
			[0],
			[0]
		];
	};

	View3D.prototype.Render = function(){

		Base.prototype.Render.call( this );

		this.canvas$node = this.$node.parent().find( 'canvas' );

		this.canvas = this.canvas$node.get(0).getContext("2d");
		
		this.setCanvasSize( this.canvasSize );
		this.setPosition( this.position );
		this.setLocalSystem( this.localSystem );
		this.renderView( this.objects );
	};
	
	View3D.prototype.Bind = function(){

		var self = this;

		this.extendListeners({
             on: EVENT.RESIZE,
              callback: function(){

                 self.setCanvasSize({
                     width: window.innerWidth,
                     height: window.innerHeight
                 });
              }
         });

        Base.prototype.Bind.call( this );
	};
	
	View3D.prototype.setCanvasSize = function( data ){

		if( data && _.isNumber( data.width ) && _.isNumber( data.height ) ){
			
			this.degLen = data.width > data.height ? (data.width/this.rowndView) : (data.height/this.rowndView);
			
			this.canvas$node.attr( "width", data.width );
			this.canvas$node.attr( "height", data.height );

			this.canvasSize = {
			    width: data.width,
			    height: data.height
			};
			return this;
		}
		this.degLen = window.innerWidth > window.innerHeight ? (window.innerWidth/this.rowndView) : (window.innerHeight/this.rowndView);
			
		this.canvas$node.attr( "width", window.innerWidth );
		this.canvas$node.attr( "height", window.innerHeight );

		this.canvasSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };
		return this;
	};
	
	View3D.prototype.renderView = function(){

	    var self = this;

	    this.canvas.clearRect(0,0,this.$node.width(),this.$node.height());

	    if( !this.areInView( this.objects ) ) return false;

	    var objects = _.sortBy( this.objects, function( element ){

            return element.view2D.dis;

        }).reverse();

	    _.each( objects, function( object ){

	        eventManager.trigger( EVENT.VIEW3D.RENDER, { space: self.currentSpace, object: object } );
	    });
	    if( _.isFunction( this.afterRenderView ) ) this.afterRenderView();
	};
	
	View3D.prototype.areInView = function( objects ){

	    if( !_.isArray( objects ) || !_.isObject( objects ) ) return false;

	    var self = this;

	    _.each( objects, function( element ){

            self.isInView( element );
        });
        return true;
	};
	
	View3D.prototype.isInView = function( object ){
		
		if( !object || !object.size ) return false;
		
		if( !_.isEqual( matrix.size( object.coord ), [3, 1]) ) return false;

		var inView = true;

		var localCoor = coordManager.switchLocal(
			this.localSystem,
			[
				[this.position[0][0]],
				[this.position[1][0]],
				[this.position[2][0]]
			],
			[
				[object.coord[0][0]],
				[object.coord[1][0]],
				[object.coord[2][0]]
			]
		);

		if( localCoor[2][0] <= 0 ) inView = false;
		
		var view2D = this.convert2D( localCoor );
		if( view2D.dis === 0 ) inView = false;
		
		var size = {
			width: object.size.x*view2D.scale,
			height: object.size.y*view2D.scale
		};
		if( !this.checkSize( size ) ) inView = false;

		if( !this.checkView( {

				x: view2D.x,
				y: view2D.y,
				screen: {
					width: this.canvasSize.width,
                    height: this.canvasSize.height
				},
				size: size

			} ) ) inView = false;

		object.view2D = {
		    inView: inView,
		    x: view2D.x,
            y: view2D.y,
            width: size.width,
            height: size.height,
            dis: coordManager.dis( localCoor )
		};
	};

	View3D.prototype.checkView = function( data ){

		if( data.x >= data.screen.width + data.size.width/2 || data.x <= -data.size.width/2 ) return false;

		if( data.y >= data.screen.height + data.size.height/2 || data.y <= -data.size.height/2 ) return false;

		return true;
	};
	
	View3D.prototype.checkSize = function( size ){
		
		if( !_.isNumber( size.width ) || size.width < 1 ) return false;
		if( !_.isNumber( size.height ) || size.height < 1 ) return false;
		
		return true;
	};
	
	View3D.prototype.convert2D = function( coord ){

		var dis = coordManager.dis( coord );
		var vanishingPointDistance = this.vanishingPointDistance();
		var scale = ( vanishingPointDistance - coord[2][0] ) / vanishingPointDistance;
		return {
			
			x: coord[0][0] * scale + ( this.canvasSize.width / 2 ),
			y: coord[1][0] * scale + ( this.canvasSize.height / 2 ),
			scale: ( vanishingPointDistance - dis ) / vanishingPointDistance
		};
	};

	View3D.prototype.vanishingPointDistance = function(){

        var screen = ( window.innerWidth > window.innerHeight ) ? window.innerWidth : window.innerHeight;

        var depth = ( screen / 2 ) / Math.tan( coordManager.degToRad( this.rowndView / 2 ) );

        return depth * ( screen - 1 );
    };

	return View3D;
});