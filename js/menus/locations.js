define([
'core/const',
'const/events',
localConstPath,
'const/databaseTable',
'menus/databaseTable',
'manager/ajaxManager',
'manager/eventManager',
'external/underscore/underscore.min'
],function( CONST, EVENT, Const, TABLE, databaseTable, ajaxManager, eventManager ){

    return databaseTable({
        table: TABLE.TABLE.LOCATION,
        url: TABLE.PATH.LOCATION,
        itemData: {
            x: 0,
            y: 0,
            z: 0,
            rX: 0,
            rY: 0,
            rZ: 0,
            img: "",
            descr: ""
        },
        entry: {
            keys: [ TABLE.ACTION.SELECT, TABLE.ACTION.UPDATE, TABLE.ACTION.DELETE ],
           update: function( key ){

               var text = "id: ID user: USER pos: [x, y, z] descr: DESCR";
               text = text.replace( "ID", this.parent.items[key].id );
               text = text.replace( "USER", this.parent.items[key].user );
               text = text.replace( "x", this.parent.items[key].x );
               text = text.replace( "y", this.parent.items[key].y );
               text = text.replace( "z", this.parent.items[key].z );
               text = text.replace( "DESCR", this.parent.items[key].descr );

               this.$node.attr( 'title', text );
               this.$node.find( '.info' ).text( text );
           },
           onClick: {
                base: function(){

                   var menu = this.parent.parent.parent.parent;

                   menu.data = {
                       action: this.key,
                       item: menu.rows[this.parent.itemId]
                   };
                   menu.ShowMenu( menu.toAbsPath( TABLE.MENU.MANAGE ) );
               },
                onClick: {

                    'select': function(){

                        var menu = this.parent.parent.parent.parent;

                       var location = menu.rows[this.parent.itemId];

                       var listInts = ["space", "x", "y", "z", "rX", "rY", "rZ"];
                       _.each( listInts, function( key ){

                            location[key] = parseInt( location[key] );
                       });
                       eventManager.trigger( EVENT.VIEW3D.CHANGE.POSITION, location );
                    },
                   'delete': function(){

                       this.parent.parent.deleteRowById.call( this );
                   }
                }
           }
       },
       afterInit: function(){

           this.getFromDatabase({
               url: TABLE.PATH.LOCATION,
               table: TABLE.TABLE.LOCATION
           });
       }
    });
});