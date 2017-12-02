define([
'core/const',
'const/events',
localConstPath,
'const/databaseTable',
'const/constSpace',
'manager/coordManager',
'external/underscore/underscore.min'
],function( CONST, EVENT, Const, TABLE, constSpace, coordManager ){

    function databaseTable( data ){

        var menu = {
             "": [
                    {
                        key: "databaseTable",
                        type: CONST.WIDGET.TYPE.ART,
                        template: "<div><div class='searchHold'></div></div>",
                        className: "column databaseTable",
                        cssAdd: "c/u/css/menus/databaseTable.css",
                        childList: [
                            {
                                type: CONST.WIDGET.TYPE.INPUT,
                                key: TABLE.WIDGET.SEARCH,
                                holder: ".searchHold",
                                onChange: function(){

                                    var list = this.parent.get( TABLE.WIDGET.LIST );

                                    list.filterList( this.value );
                                }
                            },
                            {
                                 type: CONST.WIDGET.TYPE.BUTTON,
                                 key: TABLE.WIDGET.INSERT,
                                 holder: ".searchHold",
                                 text: '+',
                                 onClick: function(){

                                     var menu = this.parent.parent;

                                     if( !_.isObject( menu.data ) ) menu.data = {};

                                     menu.data = _.extend( menu.data, { action: TABLE.WIDGET.INSERT } );

                                     menu.ShowMenu( menu.toAbsPath( TABLE.MENU.MANAGE ) );
                                 }
                            },
                            {
                                 type: CONST.WIDGET.TYPE.LIST,
                                 key: TABLE.WIDGET.LIST,
                                 entry: {
                                    type: CONST.WIDGET.TYPE.BUTTON,
                                    className: 'menuDatabaseListEntry',
                                    template: "<div><img><div class='entryRight column'><div class='info'></div><div class='actions'></div></div></div>",
                                    holder: '.list',
                                    update: function( key ){

                                       if( !this.parent.items[key] ) return;

                                       this.itemId = key;

                                       if( !this.parent.items[key].img ){
                                            this.$node.addClass( 'noImg' );
                                       }else{
                                            this.$node.find( 'img' ).attr( "src", this.parent.items[key].img );
                                            this.$node.removeClass( 'noImg' );
                                       }
                                       data.entry.update.call( this, key );
                                   },
                                    afterInit: function(){

                                        var self = this;

                                        this.$node.css( "min-height", this.parent.itemHeight );

                                        this.$node.find( 'img' ).on( 'error', function(ev){

                                            console.error(ev);

                                            self.$node.addClass( 'noImg' );
                                        });
                                    },
                                    beforeClose: function(){

                                        this.$node.find( 'img' ).off( 'error' );
                                    },
                                    compose: {
                                        0: {
                                            keys: data.entry.keys,//[ TABLE.ACTION.UPDATE, TABLE.ACTION.DELETE ],
                                            base: {
                                                type: CONST.WIDGET.TYPE.BUTTON,
                                                holder: '.actions',
                                                onClick: data.entry.onClick.base,
                                                beforeInit: function(){

                                                     this.text = this.key;
                                                }
                                            }
                                        },
                                        onClick: data.entry.onClick.onClick
                                    }
                                },
                                 filterList: function( search ){

                                    var menu = this.parent.parent;

                                     if( !data.sortColumn ) data.sortColumn = 'descr';

                                     if( !_.isString( search ) || !search.length ){

                                         this.items = menu.rows;

                                     }else{

                                         this.items =  _.filter( menu.rows, function( row ){

                                             return ( row[data.sortColumn].indexOf( search ) !== -1 ) ? true : false;
                                         });
                                     }
                                     this.showList();
                                 },
                                 addEntry: function(){

                                     this.entry.parent = this;

                                     return this.widgetManager.create( this.entry );
                                 },
                                 afterInit: data.afterInit,
                                 itemHeight: 98,
                                getFromDatabase: function( data ){

                                    var jsonConfig = {
                                        table: data.table,
                                        action: TABLE.ACTION.SELECT,
                                        space: this.parent.parent.space
                                    };
                                    if( data.where ) jsonConfig.where = data.where;

                                    var self = this;

                                    this.ajaxRequest({
                                        url: data.url,
                                        data: {
                                              data: JSON.stringify( jsonConfig )
                                         },
                                        success: function( result ){

                                            console.error(result);

                                            try {
                                                JSON.parse( result )
                                            }
                                            catch(err) {
                                                return console.error( data.table.toUpperCase() + ' select bad result: ' + result );
                                            }
                                            if( _.isFunction( data.cb ) ) return data.cb.call( self, result );

                                            self.parent.parent.rows = JSON.parse( result );
                                            self.filterList( self.parent.parent.get( "databaseTable" ).get( TABLE.WIDGET.SEARCH ).value );
                                        }
                                    });
                                },
                                deleteRowById: function(){

                                    var menu = this.parent.parent.parent.parent;

                                    if( !window.confirm( "Do you want to delete " + data.table.toUpperCase() + "?\nid - " + menu.rows[this.parent.itemId].id ) ) return;

                                    var self = this;

                                    this.ajaxRequest({
                                        url: data.url,
                                        data: {
                                            data: JSON.stringify({
                                                table: data.table,
                                                action: TABLE.ACTION.DELETE,
                                                space: menu.space,
                                                where: {
                                                    column: "id",
                                                    sign: "=",
                                                    value: parseInt( menu.rows[this.parent.itemId].id )
                                                }
                                            })
                                        },
                                        success: function( result ){

                                            if( result === '1' ) console.log( 'Delete ' + data.table + ' SUCCESS.');
                                            else{

                                                alert( "Delete " + data.table + " ERROR!" );
                                                console.error(result);
                                            }
                                            self.parent.parent.afterInit();
                                        }
                                    });
                                }
                            }
                        ]
                    }
             ],
             "manage": {

                  "": [
                      {
                          type: CONST.WIDGET.TYPE.ART,
                          className: 'manageMenu column',
                          childList: [
                              {
                                  type: CONST.WIDGET.TYPE.TEXTAREA,
                                  placeholder: data.table.toUpperCase() + ' json',
                                  key: TABLE.WIDGET.DATA,
                                  afterInit: function(){

                                      var menu = this.parent.parent;

                                      var jsonTemplate = {
                                          table: data.table,
                                          action: menu.data.action,
                                          space: menu.space
                                      };
                                      switch( menu.data.action ){

                                          case TABLE.ACTION.INSERT:

                                              if( data.table === TABLE.TABLE.PERMISSION ) data.itemData.user = parseInt( menu.data.user.id );

                                              if( data.table === TABLE.TABLE.LOCATION ){

                                                    var space = menu.parent.get( "spaceIndexPage" );
                                                    var rot = coordManager.rotationMatrixToDegrees( space.localSystem );

                                                    _.extend( data.itemData, {
                                                        x: parseInt( space.position[0][0] ),
                                                        y: parseInt( space.position[1][0] ),
                                                        z: parseInt( space.position[2][0] ),
                                                        rX: rot[0],
                                                        rY: rot[1],
                                                        rZ: rot[2]
                                                    } );
                                              }

                                              jsonTemplate.values = [data.itemData];
                                              break;

                                          case TABLE.ACTION.UPDATE:

                                              jsonTemplate.set = this.prepareSet();
                                              jsonTemplate.where = {
                                                  column: "id",
                                                  sign: "=",
                                                  value: parseInt( menu.data.item.id )
                                              };
                                              break;
                                      }
                                      this.setValue( JSON.stringify( jsonTemplate ) );
                                      console.error(menu.data);
                                      console.error(data);
                                  },
                                  prepareSet: function(){

                                      var menu = this.parent.parent;
                                      var result = [];
                                      var tmp;

                                      _.each( data.itemData, function( field, key ){

                                          tmp = {
                                              column: key,
                                              value: ( _.isNumber( field ) ) ? parseInt( menu.data.item[key] ) : menu.data.item[key]
                                          };
                                          result.push( tmp );
                                      });
                                      return result;
                                  }
                              },
                              {
                                  type: CONST.WIDGET.TYPE.BUTTON,
                                  key: TABLE.WIDGET.SUBMIT,
                                  text: 'SET ' + data.table.toUpperCase(),
                                  holder: '.bottom',
                                  onClick: function(){

                                      if( !window.confirm( "Interaction with " + data.table.toUpperCase() + "s database!\nDo you want to continue?" ) ) return;

                                      var self = this;

                                      this.ajaxRequest({
                                          url: data.url,
                                          data: {
                                              data: this.parent.get( "data" ).value
                                          },
                                          success: function( result ){

                                              console.error(result);

                                              if( result === '1' ) console.log( data.table.toUpperCase() + ' action SUCCESS.');
                                              else{

                                                  alert( data.table.toUpperCase() + " action ERROR!" );
                                              }
                                              self.parent.parent.showParent();
                                          }
                                      });
                                  }
                              }
                          ]
                      }
                 ]
              }
         };
        return ( data.subMenus ) ? _.extend( menu, data.subMenus ) : menu;
   };
   return databaseTable;
});