define([
'core/const',
localConstPath,
'const/events',
'menus/user',
'menus/data',
'external/underscore/underscore.min'
],function( CONST, Const, EVENT, user, data ){

    var mainMenu = {

        key: "mainMenu",
        type: CONST.WIDGET.TYPE.MENU,
        template: "<div><menu></menu></div>",
        className: 'mainMenu menuBackground absoluteTopRight column',
        cssAdd: 'http://offerpre.com/c/u/css/menus/mainMenu.css',
        onShowMenu: function(){

            var input = this.get('navigation').get('path');
            var back = this.get('navigation').get('back');

            input.setValue( this.path );

            if( !this.path ) back.disable();
            else back.enable();
        },
        menuTree: {
            "": [
               {
                   type: CONST.WIDGET.TYPE.ART,
                   beforeInit: function(){

                        this.className = "column";
                        this.compose = {
                            0: this.parent.commonMenu( ['user', 'data'] )
                        };
                   }
               }
           ],
            'user': user,
            'data': data,
            'terms': {},
            'privacy': {},
            'contacts': {}
        },
        afterInit: function(){

            this.ShowMenu('');
        },
        childList: [
            {
                key: 'navigation',
                type: CONST.WIDGET.TYPE.ART,
                prepend: true,
                className: 'menuNav',
                childList: [
                    {
                        key: 'path',
                        type: CONST.WIDGET.TYPE.INPUT,
                    },
                    {
                        key: 'back',
                        type: CONST.WIDGET.TYPE.BUTTON,
                        text: "<",
                        prepend: true,
                        onClick: function(){

                            this.parent.parent.showParent();
                        }
                    },
                    {

                        type: CONST.WIDGET.TYPE.BUTTON,
                        text: ">",
                        onClick: function(){

                            this.parent.parent.ShowMenu( this.parent.get( 'path' ).value );
                        }
                    }
                ]
            },
            {
                key: 'topLine',
                type: CONST.WIDGET.TYPE.ART,
                prepend: true,
                className: 'topLine',
                compose: {
                    0: {
                        keys: [ "menu", "logo" ],
                        base: {
                            type: CONST.WIDGET.TYPE.BUTTON
                        }
                    },
                    className: {
                        "menu": "menu absoluteTopLeft",
                        "logo": "logo"
                    },
                    img: {
                        "menu": CONST.MENU_BUTTON,
                        "logo": CONST.LOGO
                    },
                    onClick: {
                        "menu": function(){

                            this.parent.parent.$node.toggleClass('active');
                        }
                    }
                }
            },
            {
                type: CONST.WIDGET.TYPE.ART,
                className: 'footer',
                beforeInit: function(){

                    this.compose = {
                        0: this.parent.commonMenu( ['terms', 'privacy', 'contacts'], true )
                    };
               }
            }
        ],
        eventListeners: [
            {
                on: EVENT.VIEW3D.SPACE.SELECT,
                callback: function( e, data ){

                    this.space = data.space;
                }
            },
            {
                on: EVENT.MENU.MAIN.OPEN,
                callback: function( e, data ){

                    if( !_.isObject( data ) ) return;
                    if( !this.checkPath( data.path ) ) return;

                    if( _.isObject( data.data ) ) this.extendData( data.data );

                    this.ShowMenu( data.path );
                    this.$node.addClass( "active" )
                }
            }
        ]
    };
    return mainMenu;
});