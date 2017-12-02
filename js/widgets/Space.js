define(
[
	'external/jquery/jquery.module',
	'const/events',
	'core/matrix',
	'manager/coordManager',
	'widgets/View3D',
	'const/constSpace',
	'external/underscore/underscore.min'
],
function( $, EVENT, matrix, coordManager, View3D, constSpace ){

    /*
    {
        type: CONST.WIDGET.TYPE.SPACE,
        beforeInit: function(){

            this.objects = [];

            //var line = orderManager.line( [[0], [0], [0]], [[0], [0], [1]], 200, 50 );

            //var circ = orderManager.circle( [[0], [0], [0]], 500, 100 );

            //var disc = orderManager.disc( [[0], [0], [0]], 1000, null, 2000 );

            var baloon = orderManager.baloon( [[0], [0], [0]], 500, 200 );

            //var sphere = orderManager.sphere( [[0], [0], [0]], 300, null, 1000 );

            for( var a = 0; a < baloon.length; a ++ ){

                this.objects.push({
                    size: {
                      x: 100,
                      y: 100
                    },
                    coord: baloon[a],
                    showView: function(){

                     this.View3D.canvas.fillStyle = '#CCC';
                     this.View3D.canvas.strokeStyle = '#999';

                     this.View3D.canvas.fillRect(
                         (this.x + (this.View3D.$node.attr("width")/2) - (this.width/2)),
                         (this.y + (this.View3D.$node.attr("height")/2) - (this.height/2)),
                         this.width,
                         this.height
                     );
                     this.View3D.canvas.strokeRect(
                         (this.x + (this.View3D.$node.attr("width")/2) - (this.width/2)),
                         (this.y + (this.View3D.$node.attr("height")/2) - (this.height/2)),
                         this.width,
                         this.height
                     );

                     this.View3D.canvas.fillStyle = '#000';
                     this.View3D.canvas.fillText(a, this.x + (this.View3D.$node.attr("width")/2), this.y + (this.View3D.$node.attr("height")/2));
                    }
                });
            }
        }
     }
    */

	function Space(){

		return this;
	};

	Space.prototype = new View3D();
	Space.prototype.constructor = Space;

	Space.prototype = _.extend( Space.prototype, constSpace );

	Space.prototype.startAnimation = function(){

        var self = this;

         if( !this.animation ) this.animation = setInterval(function(){

             self.checkVell();

             self.checkRot();

             self.renderScene();

             self.reduceSpeed();

             if( _.isEqual( self.motion.vell, [[0], [0], [0]] ) &&
                 _.isEqual( self.rotation.vell, [[0], [0], [0]] ) &&
                 !self.mouseIsOut
             ){
                 clearInterval( self.animation );

                 self.animation = false;
             }

         }, Math.round( 1000 / this.frameRate ) );
    };

    Space.prototype.checkVell = function(){

        var self = this;

        _.each( this.motion.keyboard, function( value, key ){

            if( value.on ) self.motion.vell[ self.motion.keyboard[key].ax ][0] += self.motion.acc * self.motion.keyboard[key].dir;
        });

        _.each( this.motion.vell, function( element, index ){

            if( element[0] > self.motion.maxVell ) self.motion.vell[index][0] = self.motion.maxVell;

            if( element[0] < -self.motion.maxVell ) self.motion.vell[index][0] = -self.motion.maxVell;
        });
    };

    Space.prototype.checkRot = function(){

        if( !this.rotation || !this.rotation.mouseDiff ) return;

        if( !this.mouseIsDown ){

            this.rotation.vell = [[0], [0], [0]];

            return;
        }

        if( this.rotation.mouseDiff.x > 0 ) this.rotation.vell[1][0] -= this.rotation.acc;
        if( this.rotation.mouseDiff.x < 0 ) this.rotation.vell[1][0] += this.rotation.acc;

        if( this.rotation.mouseDiff.y > 0 ) this.rotation.vell[0][0] += this.rotation.acc;
        if( this.rotation.mouseDiff.y < 0 ) this.rotation.vell[0][0] -= this.rotation.acc;

        this.rotation.mouseDiff.x = false;
        this.rotation.mouseDiff.y = false;

        var self = this;

        _.each( this.rotation.vell, function( element, index ){

            if( element[0] > self.rotation.maxVell ) self.rotation.vell[index][0] = self.rotation.maxVell;

            if( element[0] < -self.rotation.maxVell ) self.rotation.vell[index][0] = -self.rotation.maxVell;
        });
    };

	Space.prototype.renderScene = function(){

        this.move();

        this.rotate();

        this.renderView();
    };

    Space.prototype.reduceSpeed = function(){

        var self = this;

        _.each( this.motion.vell, function( element, index ){

            if( Math.abs( self.motion.vell[index][0] ) < self.motion.envPress ){

                self.motion.vell[index][0] = 0;

            }else{

                self.motion.vell[index][0] += ( self.motion.vell[index][0] > 0 ) ? -self.motion.envPress : self.motion.envPress;
            }

            if( self.mouseIsOut === false ){

                if( Math.abs( self.rotation.vell[index][0] ) < self.rotation.envPress ){

                    self.rotation.vell[index][0] = 0;

                }else{

                    self.rotation.vell[index][0] += ( self.rotation.vell[index][0] > 0 ) ? -self.rotation.envPress : self.rotation.envPress;
                }
            }
        });
    };

    // Not used
    Space.prototype.mouseOnBorder = function(){

        return {
            top: ( this.screenY <= 0 ),
            right: ( this.screenX >= window.innerWidth - 1 ),
            bottom: ( this.screenY >= window.innerHeight - 1 ),
            left: ( this.screenX <= 0 )
        };
    };

    Space.prototype.mouseOnSomeBorder = function(){

        var onBorder = this.mouseOnBorder();

        return !_.isEqual(
            onBorder,
            {
                top: false,
                right: false,
                bottom: false,
                left: false
            }
        );
    };

    Space.prototype.move = function(){

        var self = this;

        _.each( self.motion.vell, function( element, index ){

            if( element[0] !== 0 ) self.position = coordManager.move(
                self.position,
                matrix.transpose( [self.localSystem[index]] ),
                [[element[0]]]
            );
        });
    };

    Space.prototype.rotate = function(){

        var self = this;
        _.each( self.rotation.vell, function( element, index ){

            if( element[0] !== 0 ) self.localSystem = coordManager.rotateSystem(
                matrix.transpose( [constSpace.globalSystem[index]] ),
                -element[0],
                self.localSystem
            );
        });
    };

	Space.prototype.Bind = function(){

        this.BindDesktop();
        this.BindMobile();

        this.extendListeners({
             on: [EVENT.VIEW3D.OBJECT.IMG_LOADED, EVENT.VIEW3D.OBJECT.PRESENCE_LOADED, EVENT.VIEW3D.CHANGED.POSITION],
              callback: function(){

                    if( !this.animation ) this.renderView();
              }
         });

        View3D.prototype.Bind.call( this );
    };

    Space.prototype.BindMobile = function(){

        var self = this;

        this.extendListeners(
            [
                {
                    on: EVENT.TOUCHSTART,
                    callback: function(e){

                          self.mouseIsDown = true;

                          self.setTouches(e);
                      }
                 },
                {
                    on: EVENT.TOUCHEND,
                      callback: function(e){

                            self.mouseIsDown = false;

                            self.setTouches(e);
                        }
                },
                {
                    on: EVENT.TOUCHMOVE,
                     callback: function(e){

                           if( e.touches.length === 1 && e.changedTouches.length === 1 ) self.rotateMobile(e);

                           if( e.touches.length === 2 && e.changedTouches.length === 2 ) self.moveMobile(e);

                           self.setTouches(e);
                       }
                }
            ]
        );
    };

    Space.prototype.moveMobile = function(e){

        if( !_.has( this.touches, e.changedTouches[0].identifier ) ) return;
        if( !_.has( this.touches, e.changedTouches[1].identifier ) ) return;

        var dis = Math.sqrt( Math.pow( ( e.changedTouches[0].screenX - e.changedTouches[1].screenX ), 2 ) + Math.pow( ( e.changedTouches[0].screenY - e.changedTouches[1].screenY ), 2 ) );
        var oldDis = Math.sqrt(
            Math.pow( ( this.touches[e.changedTouches[0].identifier].screenX - this.touches[e.changedTouches[1].identifier].screenX ), 2 )
            + Math.pow( ( this.touches[e.changedTouches[0].identifier].screenY - this.touches[e.changedTouches[1].identifier].screenY ), 2 )
        );
        if( dis === oldDis ) return;

        if( dis > oldDis ) this.motion.vell[2][0] += this.motion.acc;
        else this.motion.vell[2][0] -= this.motion.acc;

        this.startAnimation();
    };

    Space.prototype.rotateMobile = function(e){

        if( !_.has( this.touches, e.changedTouches[0].identifier ) ) return;

        this.rotation.mouseDiff = {
            x: -(e.changedTouches[0].screenX - this.touches[e.changedTouches[0].identifier].screenX),
            y: -(e.changedTouches[0].screenY - this.touches[e.changedTouches[0].identifier].screenY)
        };

        if( !_.isNumber( this.rotation.mouseDiff.x ) ) this.rotation.mouseDiff.x = 0;
        if( !_.isNumber( this.rotation.mouseDiff.y ) ) this.rotation.mouseDiff.y = 0;

        if( this.rotation.mouseDiff.x !== 0 || this.rotation.mouseDiff.y !== 0 ) this.startAnimation();
    };

    Space.prototype.setTouches = function(e){

        this.touches = {};

        for( var a = 0; a < e.touches.length; a ++ ){

            this.touches[e.touches[a].identifier] = e.touches[a];
        }
    };

    Space.prototype.BindDesktop = function(){

        var self = this;

        this.extendListeners(
            [
                {
                    on: EVENT.KEYDOWN,
                    callback: function(e){

                         if( !_.has( self.motion.keyboard, e.keyCode ) ) return;

                         self.motion.keyboard[e.keyCode].on = true;

                         self.startAnimation();
                     }
                },
                {
                    on: EVENT.KEYUP,
                      callback: function(e){

                            if( !_.has( self.motion.keyboard, e.keyCode ) ) return;

                            self.motion.keyboard[e.keyCode].on = false;
                        }
                },
                {
                    on: EVENT.MOUSEDOWN,
                     callback: function(e){

                           self.$node.css( "cursor", self.cursor.mousedown );

                           self.mouseIsDown = true;
                       }
                },
                {
                    on: EVENT.MOUSEUP,
                    callback: function(e){

                          self.$node.css( "cursor", self.cursor.mouseup );

                          self.mouseIsDown = false;
                      }
                },
                {
                    on: EVENT.MOUSEMOVE,
                   callback: function(e){

                         self.mouseIsOut = false;
                         if( !self.mouseIsDown ) return;

                         if(
                             !self.screenX ||
                             !self.screenY
                         ){

                             self.screenX = e.screenX;
                             self.screenY = e.screenY;

                             return;
                         }
                         self.rotation.mouseDiff = {
                             x: (e.screenX - self.screenX),
                             y: (e.screenY - self.screenY)
                         };

                         self.screenX = e.screenX;
                         self.screenY = e.screenY;

                         self.startAnimation();
                    }
                }
            ]
        );
    };

	return Space;
});