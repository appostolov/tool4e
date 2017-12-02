define(
[
    'external/jquery/jquery.module',
	'widgets/Base',
	'core/const',
	'const/events',
	'const/constSpace',
	'manager/eventManager',
	'external/underscore/underscore.min'
],
function( $, Base, CONST, EVENT, constSpace, eventManager ){

	function SpaceObject(){

		return this;
	};

	SpaceObject.prototype = new Base();
	SpaceObject.prototype.constructor = SpaceObject;

	SpaceObject.prototype.Render = function(){

	    var self = this;

        var img = new Image();
        img.src = this.object.img;

        img.onload = function(){

            self.image = img;
            eventManager.trigger( EVENT.VIEW3D.OBJECT.IMG_LOADED );
        };
        img.onerror = function(){

            img.src = constSpace.defaultObjectImg;
        };
	};

	SpaceObject.prototype.showImage = function(){

	    if( !_.isObject( this.image ) ) return;

        this.parent.canvas.drawImage(
            this.image,
            this.object.view2D.x - ( this.object.view2D.width / 2 ),
            this.object.view2D.y - ( this.object.view2D.height / 2 ),
            this.object.view2D.width, this.object.view2D.height
        );
    };

    SpaceObject.prototype.nodePosition = function(){

        this.$node.css( "position", "absolute" );
        this.$node.css( "width", this.object.view2D.width + "px" );
        this.$node.css( "height", this.object.view2D.height + "px" );
        this.$node.css( "max-width", this.object.view2D.width + "px" );
        this.$node.css( "max-height", this.object.view2D.height + "px" );
        this.$node.css( "left", ( this.object.view2D.x - ( this.object.view2D.width / 2 ) ) + "px" );
        this.$node.css( "top", ( this.object.view2D.y - ( this.object.view2D.height / 2 ) ) + "px" );
    };

	SpaceObject.prototype.checkObject = function( id ){

	    if( _.isObject( this.object ) && this.object.id === id ) return true;

	    return false;
	};

	SpaceObject.prototype.Bind = function(){

	    this.$ = $;
	    this._ = _;

        this.extendListeners(
            [
                {
                    on: EVENT.VIEW3D.OBJECT.RENDER,
                     callback: function( e, data ){

                        if( this.parent.currentSpace !== data.space ) return;
                        if( !this.checkObject( data.object.id ) ) return;

                        if( this.object.view2D.inView ) this.showView();
                        else if( this.object.view2D.dis <= constSpace.presenceRange ){

                            if( _.isObject( this.$node ) ) this.$node.hide();
                        }
                        else this.Close();
                     }
                }
            ]
        );
        Base.prototype.Bind.call( this );
    };

	return SpaceObject;
});