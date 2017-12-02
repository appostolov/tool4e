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
        table: TABLE.TABLE.SPACE,
        url: TABLE.PATH.SPACE,
        itemData: {
            presence: 0,
            img: "",
            descr: ""
        },
        entry: {
            keys: [ TABLE.ACTION.SELECT, TABLE.ACTION.UPDATE, TABLE.ACTION.DELETE ],
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

                   'select': function(){

                       var menu = this.parent.parent.parent.parent;

                        eventManager.trigger( EVENT.VIEW3D.SPACE.SELECT, { 'space': parseInt( menu.rows[this.parent.itemId].id ) });
                    },

                    'delete': function(){

                        this.parent.parent.deleteRowById.call( this );
                    }
               }
           }
       },
       afterInit: function(){

           this.getFromDatabase({
               url: TABLE.PATH.SPACE,
               table: TABLE.TABLE.SPACE
           });
       }
    });
});