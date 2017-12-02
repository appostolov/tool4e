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
        table: TABLE.TABLE.OBJECT,
        url: TABLE.PATH.OBJECT,
        itemData: {
            presence: 0,
            x: 0,
            y: 0,
            z: 0,
            img: "",
            descr: ""
        },
        entry: {
            keys: [ TABLE.ACTION.UPDATE, TABLE.ACTION.DELETE ],
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

                       'delete': function(){

                           this.parent.parent.deleteRowById.call( this );
                       }
                  }
           }
       },
       afterInit: function(){

           this.getFromDatabase({
               url: TABLE.PATH.OBJECT,
               table: TABLE.TABLE.OBJECT
           });
       }
    });
});