define(
[
	'external/jquery/jquery.module',
	'core/const',
	'widgets/Base',
	'manager/constManager',
	'external/underscore/underscore.min'
],
function( $, CONST, Base, constManager ){

	function Menu(){
		
		this.template = "<div><button><img/><span></span></button><menu></menu></div>";
		this.css = "http://offerpre.com/c/u/css/widgets/menu.css";
		this.widgetClassName = "widgetMenu";

		return this;
	};

	Menu.prototype = new Base();
	Menu.prototype.constructor = Menu;

	Menu.prototype.Render = function(){

        Base.prototype.Render.call( this );

        this.$menu = this.$node.find('menu');
    };

    Menu.prototype.toAbsPath = function( local ){

        if( !_.isString( local ) || !local.length ) return false;

        return ( this.path === "" ) ? local : this.path + '/' + local;
    };

    Menu.prototype.extendData = function( data ){

        if( !_.isObject( this.data ) ) this.data = {};

        this.data = _.extend( this.data, data );
    };

    Menu.prototype.checkPath = function( path ){

        return constManager.exist( this.menuTree, path );
    };

    Menu.prototype.ShowMenu = function( path ){

        var self = this;

        if( !this.checkPath( path ) ) return false;

        this.ClearMenu();

        var menu = constManager.get( this.menuTree, path );

        if( !menu ) return false;

        var tmp;

        _.each( menu[0][""], function( element, index ){

            tmp = element;

            tmp.parent = self;

            if( !tmp.holder ) tmp.holder = self.$menu;

            tmp = self.widgetManager.create( tmp );

            if( _.isObject( tmp ) ) self.menuItems.push( tmp );
        });
        this.path = path;

        if( _.isFunction( this.onShowMenu ) ) this.onShowMenu();

        return this;
    };

    Menu.prototype.showParent = function(){

        var path = constManager.path( this.path );

        if( !path || !path.length ) return false;

        path.splice( path.length - 1, 1 );

        var pathTxt = "";

        _.each( path, function( step, index ){

            pathTxt += step;

            if( index < path.length - 1 ) pathTxt += CONST.CUSTOM.PATH_SEP;
        });
        return this.ShowMenu( pathTxt );
    };

    Menu.prototype.ClearMenu = function(){

        _.each( this.menuItems, function( item ){

            item.Close();
        });
        this.menuItems = [];

        return this;
    };

    Menu.prototype.commonMenu = function( keys, isAbsPath ){

        var self = this;

        if( !_.isObject( keys ) ) keys = [];

        return {
              keys: keys,
              base: {
                  type: CONST.WIDGET.TYPE.BUTTON,
                  onClick: function(){

                      if( isAbsPath ) self.ShowMenu( this.key );
                      else self.ShowMenu( self.toAbsPath( this.key ) );
                  },
                  beforeInit: function(){

                      this.text = this.key;
                 }
              }
          };
    };

	return Menu;
});