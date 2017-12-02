define([
'core/const',
localConstPath,
'const/events',
'manager/eventManager'
],function( CONST, Const, EVENT, eventManager ){

    return {
            "": [{

                type: CONST.WIDGET.TYPE.ART,
                className: "column",
                 childList: [
                     {
                         type: 'Input',
                         key: 'user'
                     },
                     {
                         type: 'Input',
                         key: 'pass'
                     },
                     {
                         type: 'Input',
                         key: 'activate'
                     },
                     {
                         type: 'Button',
                         text: 'Activate',
                         onClick: function(){

                             var page = this.parent.parent.parent;

                              if( page.user ){

                                  page.user.action({
                                      action: 'activate',
                                      user: this.parent.get('user').value,
                                      pass: this.parent.get('pass').value,
                                      activate: this.parent.get('activate').value,
                                      callback: function( data ){

                                          eventManager.trigger( EVENT.USER.CHANGED_STATE, { 'data': data });
                                      }
                                  });
                              }
                         }
                     }
                 ]
            }]
        };
});