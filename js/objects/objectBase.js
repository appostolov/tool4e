define([
'core/const',
localConstPath,
'const/events',
'const/constSpace',
'manager/eventManager',
'external/underscore/underscore.min'
],function( CONST, Const, EVENT, constSpace, eventManager ){

    function objectBase(){

        return {

           type: CONST.WIDGET.TYPE.SPACE_OBJECT,
           showView: function(){

                if( this.object.view2D.dis >= constSpace.presenceRange )  return this.outPresence();

                this.inPresence();
           },
           outPresence: function(){

                if( _.isObject( this.$node ) ) this.$node.hide();

                this.showImage();
           },
           inPresence: function(){

                if( !this.presence ) this.showImage();
                else if( _.isFunction( this.presence.showView ) ) this.presence.showView.call( this );

                if( !this.waitPresence ) this.handlePresence();
           },
           handlePresence: function(){

                this.waitPresence = true;

                this.getPresence({
                    id: this.object.presence,
                    space: this.parent.space,
                    cb: function(){

                        if( _.isObject( this.presence ) ){

                            var first = true;

                            if( !this.$node ) this.$node = $( "<div class='htmlNode'></div>" );

                            this.presence.showView = function(){

                                if( this.presence.ready ){
                                    this.presence.ready = false;
                                    this.presence.init.call( this );
                                }

                                var self = this;

                                this.$node.detach();
                                this.$node.appendTo( this.parent.$node.find( ".html" ) );

                                if( first ){
                                    setTimeout(function(){
                                        self.nodePosition();
                                        self.$node.show();
                                    }, 0);
                                }else{
                                    this.nodePosition();
                                    this.$node.show();
                                }
                            };
                            eventManager.trigger( EVENT.VIEW3D.OBJECT.PRESENCE_LOADED );
                            this.presence.init.call( this );
                            console.log( "Object " + this.object.id + " presence applied successfully!" );

                            first = false;
                        }
                    }
                });
           },
           speak: function( text, node ){

                if( !_.isArray( text ) ) return;
                if( !_.isString( text[0].text ) ) return;

                var self = this;

                node.fadeOut("slow", "swing", function(){

                    node.text( text[0].text );

                    node.fadeIn("slow", "swing", function(){

                         if( _.isFunction( text[0].cb ) ) text[0].cb.call( self );

                         var timeout = text[0].time;
                         text.splice( 0, 1) ;
                         if( !text.length ) return;

                         setTimeout( self.speak.bind( self, text, node ), timeout );
                     });
                });
           },
           cbChain: function( cbs ){

                if( !_.isArray( cbs ) || !cbs.length ) return;
                if( !_.isFunction( cbs[0].cb ) ) return;

                cbs[0].cb.call( self );

                var timeout = cbs[0].time;
                 cbs.splice( 0, 1) ;
                 if( !cbs.length ) return;

                setTimeout( this.cbChain.bind( this, cbs ), timeout );
           }
       };
    };
    return objectBase;
});