define([
'core/const',
localConstPath,
'const/events',
'const/databaseTable',
'const/constSpace',
'core/matrix',
'manager/widgetManager',
'manager/eventManager',
'manager/filterManager',
'manager/coordManager',
'objects/objectBase',
'external/underscore/underscore.min'
],function( CONST, Const, EVENT, TABLE, constSpace, matrix, widgetManager, eventManager, filterManager, coordManager, objectBase ){

    var indexPage = {

        key: "spaceIndexPage",
        type: CONST.WIDGET.TYPE.SPACE,
        className: 'spaceIndexPage backBackground',
        template: "<div><canvas class='absoluteFull'></canvas><div class='html absoluteFull'></div></div>",
        afterInit: function(){

            var self = this;

            this.resolveUrl();

            if( !this.space ) this.space = 1;

            setTimeout(function(){

                eventManager.trigger( EVENT.VIEW3D.SPACE.SELECT, { space: self.space } );
            }, 0);
        },
        changeView: function( data ){

              if( _.has( data, "space" ) ) this.space = data.space;
              if( _.has( data, "x" ) ) this.position[0][0] = data.x;
              if( _.has( data, "y" ) ) this.position[1][0] = data.y;
              if( _.has( data, "z" ) ) this.position[2][0] = data.z;

              var axRot = [];

              if( _.has( data, "rX" ) ) axRot.push( [-data.rX] );
              if( _.has( data, "rY" ) ) axRot.push( [-data.rY] );
              if( _.has( data, "rZ" ) ) axRot.push( [-data.rZ] );

              this.localSystem = constSpace.globalSystem;
              for( var a = 0; a < axRot.length; a ++ ){

                    this.localSystem = coordManager.rotateSystem(
                          matrix.transpose( [constSpace.globalSystem[a]] ),
                          -axRot[a],
                          this.localSystem
                      );
              }
        },
        resolveUrl: function(){

            var data = this.getUrlData();
            if( !data ) return;

            _.each( data, function( item, key ){

                data[key] = parseInt( item );
            });
            console.error(data);
            var isValid = filterManager.filter(

                data,
                [
                    {
                      dataKey: 'space',
                      checkKey: CONST.FILTER_TYPE.DATA_TYPE,
                      checkVal: CONST.DATA_TYPE.NUM
                    },
                    {
                      dataKey: 'x',
                      checkKey: CONST.FILTER_TYPE.DATA_TYPE,
                      checkVal: CONST.DATA_TYPE.NUM
                    },
                    {
                      dataKey: 'y',
                      checkKey: CONST.FILTER_TYPE.DATA_TYPE,
                      checkVal: CONST.DATA_TYPE.NUM
                    },
                    {
                      dataKey: 'z',
                      checkKey: CONST.FILTER_TYPE.DATA_TYPE,
                      checkVal: CONST.DATA_TYPE.NUM
                    },
                    {
                      dataKey: 'rX',
                      checkKey: CONST.FILTER_TYPE.DATA_TYPE,
                      checkVal: CONST.DATA_TYPE.NUM
                    },
                    {
                      dataKey: 'rY',
                      checkKey: CONST.FILTER_TYPE.DATA_TYPE,
                      checkVal: CONST.DATA_TYPE.NUM
                    },
                    {
                      dataKey: 'rZ',
                      checkKey: CONST.FILTER_TYPE.DATA_TYPE,
                      checkVal: CONST.DATA_TYPE.NUM
                    }
                ],
              CONST.FILTER_MODE.SIMPLE );
              if( !isValid ) return;

              this.changeView( data );

        },
        getUrlText: function(){

            var rot = coordManager.rotationMatrixToDegrees( this.localSystem );

            var text = "www.offerpre.com/?space=" + this.space;
            text += ( "&x=" + parseInt( this.position[0][0] ) );
            text += ( "&y=" + parseInt( this.position[1][0] ) );
            text += ( "&z=" + parseInt( this.position[2][0] ) );
            text += ( "&rX=" + rot[0] );
            text += ( "&rY=" + rot[1] );
            text += ( "&rZ=" + rot[2] );

            return text;
        },
        afterRenderView: function(){

            this.requestSetSpace();
        },
        requestSetSpace: function(){

            if( this.waitRequest ) return;

            var self = this;
            var result = false;

            _.each( this.center, function( c, index ){

                if( Math.abs( Math.abs( c[0] ) - Math.abs( self.position[index][0] ) ) > constSpace.spaceRange ) result = true;
            });
            if( result ) this.setSpace( this.space );
        },
        setSpace: function( id ){

              var self = this;

              this.space = id;

              this.waitRequest = true;

              this.center = [[this.position[0][0]], [this.position[1][0]], [this.position[2][0]]];

            this.ajaxRequest({
                url: TABLE.PATH.OBJECT,
                data: {
                    data: JSON.stringify( {
                        table: TABLE.TABLE.OBJECT,
                        action: TABLE.ACTION.SELECT,
                        space: this.space,
                        where: {
                            operator: "AND",
                            conditions: [
                                {
                                    column: "x",
                                    sign: ">",
                                    value: this.center[0][0] - constSpace.spaceRange
                                },
                                {
                                    column: "x",
                                    sign: "<",
                                    value: this.center[0][0] + constSpace.spaceRange
                                },
                                {
                                    column: "y",
                                    sign: ">",
                                    value: this.center[1][0] - constSpace.spaceRange
                                },
                                {
                                    column: "y",
                                    sign: "<",
                                    value: this.center[1][0] + constSpace.spaceRange
                                },
                                {
                                    column: "z",
                                    sign: ">",
                                    value: this.center[2][0] - constSpace.spaceRange
                                },
                                {
                                    column: "z",
                                    sign: "<",
                                    value: this.center[2][0] + constSpace.spaceRange
                                }
                            ]
                        }
                    })
                },
                success: function( result ){

                    console.error(result);

                    try {
                        JSON.parse( result )
                    }
                    catch(err) {
                        return console.error('SetSpace object select failed!');
                    }
                    _.each( self.getChildren(), function( child ){

                        child.Close();
                    });
                    self.renderSpace( JSON.parse( result ) );
                    self.waitRequest = false;
                }
            });
          },
        renderSpace: function( result ){

            var self = this;

            this.objects = result;

            var size = ( window.innerHeight < window.innerWidth ) ? window.innerHeight : window.innerWidth;

            _.each( this.objects, function( object, key ){

                self.objects[key].coord = [[parseInt( object.x )], [parseInt( object.y )], [parseInt( object.z )]];

                self.objects[key].size = {

                    x: size,
                    y: size
                };
            });
            this.renderView();
        },
        getWidgetByObject: function( id ){

            var widget = _.find( this.getChildren(), function( widget ){

                return widget.object.id === id;
            });
            if( !widget ) this.createWidget( id );
        },
        createWidget: function( id ){

            var object = _.findWhere( this.objects, { id: id} );

            var widgetConfig = objectBase();

            widgetConfig.parent = this;
            widgetConfig.object = object;

            return this.widgetManager.create( widgetConfig );
        },
        eventListeners: [
            {
                on: EVENT.VIEW3D.RENDER,
                callback: function( e, data ){

                    if( data.object.view2D.inView ) this.getWidgetByObject( data.object.id );

                    eventManager.trigger( EVENT.VIEW3D.OBJECT.RENDER, data );
                }
            },
            {
                on: EVENT.VIEW3D.SPACE.SELECT,
                callback: function( e, data ){

                    this.setSpace( data.space );
                }
            },
             {
                 on: EVENT.VIEW3D.CHANGE.POSITION,
                 callback: function( e, data ){
                        this.changeView( data );
                        eventManager.trigger( EVENT.VIEW3D.CHANGED.POSITION );
                 }
             }
        ]
    };
    return indexPage;
});