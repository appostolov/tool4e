define(
[
	'core/const',
	'const/events',
	'manager/eventManager',
	'manager/filterManager',
	'widgets/Button',
	'widgets/Input',
	'widgets/Textarea',
	'widgets/Checkbox',
	'widgets/Dropdown',
	'widgets/Form',
	'widgets/Page',
	'widgets/Article',
	'widgets/Menu',
	'widgets/choiceOption',
	'widgets/Popover',
	'widgets/View3D',
	'widgets/Space',
	'widgets/List',
	'widgets/SpaceObject',
	'external/underscore/underscore.min'
],
function(
	CONST,
	EVENT,
	eventManager,
	filterManager,
	Button,
	Input,
	Textarea,
	Checkbox,
	Dropdown,
	Form,
	Page,
	Article,
	Menu,
	choiceOption,
	Popover,
	View3D,
	Space,
	List,
	SpaceObject
){
	
	var map = {};
	
	map[CONST.WIDGET.TYPE.BUTTON]                  = Button;
	map[CONST.WIDGET.TYPE.INPUT]                   = Input;
	map[CONST.WIDGET.TYPE.TEXTAREA]                = Textarea;
	map[CONST.WIDGET.TYPE.CHECKBOX]                = Checkbox;
	map[CONST.WIDGET.TYPE.DROPDOWN]                = Dropdown;
	map[CONST.WIDGET.TYPE.FORM]                    = Form;
	map[CONST.WIDGET.TYPE.PAGE]                    = Page;
	map[CONST.WIDGET.TYPE.ART]                     = Article;
	map[CONST.WIDGET.TYPE.MENU]                    = Menu;
	map[CONST.WIDGET.TYPE.CHOICE_OPTION]           = choiceOption;
	map[CONST.WIDGET.TYPE.POPOVER]           	   = Popover;
	map[CONST.WIDGET.TYPE.VIEW3D]                  = View3D;
	map[CONST.WIDGET.TYPE.SPACE]                   = Space;
	map[CONST.WIDGET.TYPE.LIST]                    = List;
	map[CONST.WIDGET.TYPE.SPACE_OBJECT]            = SpaceObject;
	
	var count = 0;
	
	var widgets = [];
	
	function widgetManager(){};
	
	widgetManager.prototype.create = function( config ){

		if( !map[ config.type ] ) return false;
		
		var instance = new map[ config.type ]();
		
		if( typeof instance !== typeof {} ) return false;
		
		count ++;
		
		instance.setManager( this );
		
		_.extend( instance, config );
		
		instance.id = CONST.WIDGET.ID + count;
		
		widgets.push( instance );

		instance.Init();
		
		return instance;
	};
	
	widgetManager.prototype.remove = function( instance ){
		
		for( var a = 0; a < widgets.length; a ++ ){
			
			if( widgets[a].id === instance.id ) widgets.splice( a, 1 );
		}
	};

	widgetManager.prototype.clear = function(){
		
		for( var a = widgets.length - 1; a >= 0; a -- ){
			
			this.remove( widgets[ a ] );
		}
		count = 0;
		
		return ( !count && !widgets.length );
	};
	
	widgetManager.prototype.get = function( key, value, list ){

		var result = [];
		
		var Widgets = widgets;
		
		if( list ){
			
			if( _.isArray( list ) ){
				
				Widgets = list;
				
			}else if( filterManager.notObject(list) ){
				
				Widgets[0] = list;
				
			}else return false;
		}
		
		for( var a = 0; a < Widgets.length; a ++ ){
			
			if( _.has( Widgets[a], key ) && Widgets[a][key] === value ) result.push( Widgets[a] );
		}
		
		if( !result.length ) return false;

		if( key === 'key' && result.length === 1 ) return result[0];
		
		return result;
	};
	
	widgetManager.prototype.getChildren = function( parent ){
		
		return this.get( 'parent', parent );
	};
	
	return new widgetManager();
});