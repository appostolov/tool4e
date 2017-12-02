define([
'core/const',
localConstPath,
'const/events',
'menus/user',
'menus/data',
'manager/eventManager',
'external/underscore/underscore.min'
],function( CONST, Const, EVENT, user, data, eventManager ){

    var fastOptions = {
          key: "fastOptions",
          type: CONST.WIDGET.TYPE.ART,
          className: "fastOptions absoluteTopLeft widthAuto",
          compose: {
              0: {
                  keys: ["spaces", "locations", "url"],
                  base: {
                      type: CONST.WIDGET.TYPE.BUTTON,
                      onClick: function(){

                            eventManager.trigger( EVENT.MENU.MAIN.OPEN, { path: "data/" + this.key } );
                      },
                      beforeInit: function(){

                            this.text = this.key;
                      }
                  }
              },
              onClick: {
                    "url": function(){

                       prompt( "URL location", this.parent.parent.get( "spaceIndexPage" ).getUrlText() );
                   }
              },
              eventListeners: {
                    "spaces": [
                        {
                            on: EVENT.VIEW3D.SPACE.SELECT,
                            callback: function( e, data ){

                                this.$node.text( data.space );
                            }
                        }
                    ]
              }
          }

      };
    return fastOptions;
});