define([
'core/const',
localConstPath,
'const/events',
'menus/login',
'menus/register',
'menus/activate',
'menus/generate',
'manager/eventManager'
],function( CONST, Const, EVENT, login, register, activate, generate, eventManager ){
    return {
       "": [
           {
               type: CONST.WIDGET.TYPE.ART,
               className: "column",
               beforeInit: function(){

                   this.compose = {
                       0: this.parent.commonMenu( ['login', 'logout', 'register', 'activate', 'generate'] ),
                       onClick: {
                           'logout': function(){

                               var page = this.parent.parent.parent;

                               if( page.user ){

                                   page.user.action({
                                       action: 'logout',
                                       logout: true,
                                       callback: function( data ){

                                           eventManager.trigger( EVENT.USER.CHANGED_STATE, { 'data': data });
                                       }
                                   });
                               }
                           }
                      }
                   };
              }
           }
       ],
       'login': login,
        'register': register,
        'activate': activate,
        'generate': generate
   };
});