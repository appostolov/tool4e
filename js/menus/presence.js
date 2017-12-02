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
        table: TABLE.TABLE.PRESENCE,
        url: TABLE.PATH.PRESENCE,
        itemData: {
            code: "",
            img: "",
            descr: ""
        },
        entry: {
            keys: [ TABLE.ACTION.UPDATE, TABLE.ACTION.DELETE ],
           update: function( key ){

               var text = "id: ID user: USER descr: DESCR";
               text = text.replace( "ID", this.parent.items[key].id );
               text = text.replace( "USER", this.parent.items[key].user );
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
               url: TABLE.PATH.PRESENCE,
               table: TABLE.TABLE.PRESENCE
           });
       }
    });
});