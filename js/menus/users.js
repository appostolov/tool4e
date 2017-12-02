define([
'core/const',
'const/events',
localConstPath,
'const/databaseTable',
'menus/databaseTable',
'manager/ajaxManager',
'external/underscore/underscore.min'
],function( CONST, EVENT, Const, TABLE, databaseTable, ajaxManager ){

    return databaseTable({
        table: TABLE.TABLE.USER,
        url: TABLE.PATH.USER,
        sortColumn: 'name',
        entry: {
            keys: [ TABLE.ACTION.UPDATE, TABLE.ACTION.DELETE ],
           update: function( key ){

               var text = "id: ID name: NAME";
               text = text.replace( "ID", this.parent.items[key].id );
               text = text.replace( "NAME", this.parent.items[key].name );
               if( this.parent.items[key].email ) text += " email: " + this.parent.items[key].email;

               this.$node.attr( 'title', text );
               this.$node.find( '.info' ).text( text );
           },
           onClick: {
                base: function(){

                     var menu = this.parent.parent.parent.parent;

                     menu.data = {
                         action: this.key,
                         item: menu.rows[this.parent.itemId],
                         user: menu.rows[this.parent.itemId]
                     };
                     menu.ShowMenu( menu.toAbsPath( 'permission' ) );
                 },
                onClick: {
                     'delete': function(){

                         this.parent.parent.deleteRowById.call( this );
                     }
                }
           }
       },
       afterInit: function(){

            var menu = this.parent.parent;

            menu.get( "databaseTable" ).get( TABLE.WIDGET.INSERT ).$node.hide();

           this.getFromDatabase({
               url: TABLE.PATH.USER,
               table: TABLE.TABLE.USER,
               cb: function( result ){

                    menu.rows = JSON.parse( result );
                    menu.rows.unshift( { id: 0, name: "*" } );
                    this.filterList( menu.get( "databaseTable" ).get( TABLE.WIDGET.SEARCH ).value );
               }
           });
       },
       subMenus: {
            'permission': databaseTable({
                  table: TABLE.TABLE.PERMISSION,
                  url: TABLE.PATH.PERMISSION,
                  sortColumn: 'name',
                    itemData: {
                        user: 0,
                        space: 0,
                        user_all: 0,
                        space_all: 0,
                        feature: ""
                    },

                  entry: {
                    keys: [ TABLE.ACTION.UPDATE, TABLE.ACTION.DELETE ],
                     update: function( key ){

                           var text = "SPACE - FEATURE";
                           var text = "id: ID user: USER space: SPACE feature: FEATURE";

                          text = text.replace( "ID", this.parent.items[key].id );
                          text = text.replace( "USER", ( parseInt( this.parent.items[key].user_all ) > 0 ) ? "*" : this.parent.items[key].user );
                          text = text.replace( "SPACE", ( parseInt( this.parent.items[key].space_all ) > 0 ) ? "*" : this.parent.items[key].space );
                          text = text.replace( "FEATURE", this.parent.items[key].feature );

                           this.$node.attr( 'title', text );
                           this.$node.find( '.info' ).text( text );
                     },
                     onClick: {
                          base: function(){

                             var menu = this.parent.parent.parent.parent;

                             menu.data = {
                                 action: this.key,
                                 item: menu.rows[this.parent.itemId],
                                 user: menu.data.user
                             };
                             menu.ShowMenu( menu.toAbsPath( TABLE.MENU.MANAGE ) );
                         },
                          onClick: {
                                 'delete': function(){

                                     this.parent.parent.deleteRowById.call( this );
                                  }
                            }
                     }
                 },
                 afterInit: function(){

                    var menu = this.parent.parent;

                      var defaultUser = ( menu.data.user.id === 0 ) ? true : false;

                     this.getFromDatabase({
                         url: TABLE.PATH.PERMISSION,
                         table: TABLE.TABLE.PERMISSION,
                         where: {
                             column: defaultUser ? "user_all" : "user",
                             sign: defaultUser ? ">" : "=",
                             value: defaultUser ? 0 : parseInt( menu.data.user.id )
                         }
                     });
                 }
            })
       }
    });
});