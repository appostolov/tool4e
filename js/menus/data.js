define([
'core/const',
localConstPath,
'menus/users',
'menus/spaces',
'menus/objects',
'menus/presence',
'menus/locations'
],function( CONST, Const, users, spaces, objects, presence, locations ){
    return {
       "": [
           {
               type: CONST.WIDGET.TYPE.ART,
               className: "column",
               beforeInit: function(){

                    this.compose = {
                        0: this.parent.commonMenu( ['users', 'spaces', 'objects', 'presence', 'locations'] )
                    };
               }
           }
       ],
       'users': users,
       'spaces': spaces,
       'objects': objects,
       'presence': presence,
       'locations': locations
   };
});