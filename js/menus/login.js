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
                     type: 'Checkbox',
                     valueAttr: 'remember',
                     key: 'remember',
                     label: 'remember'
                 },
                 {
                     type: 'Button',
                     text: 'Login',
                     onClick: function(){

                        var page = this.parent.parent.parent;

                        if( page.user ){

                            page.user.action({
                                action: 'login',
                                user: this.parent.get('user').value,
                                pass: this.parent.get('pass').value,
                                remember: this.parent.get('remember').value,
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