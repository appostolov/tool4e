define([
'core/const',
localConstPath,
'const/constSpace',
'const/events',
'const/databaseTable',
'external/underscore/underscore.min'
],function( CONST, Const, constSpace, EVENT, TABLE ){

    function timeStamp( data ){

        return {

           type: CONST.WIDGET.TYPE.BUTTON,
           percentage: data.percentage,
           className: 'timeStamp',
           afterInit: function(){

                this.placeStamp();
           },
           placeStamp: function(){

                var maxLeft = this.parent.$node.width() - this.parent.get( "moment" ).$node.width();
                var maxSec = this.parent.parent.get( "timeScale" ).value;

                this.$node.css( "left", ( maxLeft * this.percentage ) / 100 );
                this.$node.text( parseInt( ( maxSec * this.percentage ) / 100 ) );
           },
           onClick: function(){

                var selfPos = parseInt( this.$node.css( "left" ) );

                var moment = this.parent.get( "moment" );
                moment.$node.css( "left", selfPos + "px" );
                moment.percentage = ( selfPos / ( this.parent.$node.width() - moment.$node.width() ) ) * 100;
                moment.updatePosition();

                var textareas = this.parent.parent.parent.get( "textareas" );
                textareas.get( "html" ).setValue( this.stampData.html );
                textareas.get( "css" ).setValue( this.stampData.css );
                textareas.get( "js" ).setValue( this.stampData.js );
           },
           eventListeners: [

               {
                     on: EVENT.MENU.TOOL4E.TIME_INPUT,
                     callback: function(){

                        this.placeStamp();
                     }
               },
               {
                    on: EVENT.MENU.TOOL4E.ACTION.UPDATE,
                    callback: function( e, data ){

                        if( this.$node.text() !== this.parent.get( "moment" ).get( "momentText" ).$node.text() ) return;

                        this.html = data.html;
                        this.css = data.css;
                        this.js = data.js;
                    }
               },
               {
                    on: EVENT.MENU.TOOL4E.ACTION.DELETE,
                    callback: function( e, data ){

                       if( this.$node.text() !== this.parent.get( "moment" ).get( "momentText" ).$node.text() ) return;

                       this.Close();
                    }
               }
          ]
       };
    };
    return timeStamp;
});