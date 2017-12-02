define(
[
'external/jquery/jquery.module',
'core/const',
'const/events',
'const/databaseTable',
'core/string',
'manager/eventManager',
'manager/proxyManager',
'manager/ajaxManager',
'external/underscore/underscore.min'
],
function( $, CONST, EVENT, TABLE, STRING, eventManager, proxyManager, ajaxManager ){
	
	function Base(){};

	Base.prototype.getPresence = function( presence ){

	    var self = this;

		this.ajaxRequest({
			url: TABLE.PATH.PRESENCE,
			data: {
				data: JSON.stringify({
					table: TABLE.TABLE.PRESENCE,
					action: TABLE.ACTION.SELECT,
					space: presence.space,
					where: {
						column: "id",
						sign: "=",
						value: presence.id
					}
				})
			},
			success: function( result ){

				var row;

				try{

					row = JSON.parse( result );
					if( !_.isArray( row ) || !row.length ) throw "Presence not available!";

					eval( row[0].code );
					if( !_.isObject( object ) ) throw "Presence row.code not an object!";

				}catch( err ){

					return console.error( err );
				}
				self.presence = object;
				self.presence.parent = self;

				if( _.isFunction( presence.cb ) ) presence.cb.call( self, result );
			}
		});
    };
	
	Base.prototype.setManager = function( manager ){

		this.widgetManager = manager;
		
		this.setManager = null;
	};
	
	Base.prototype.Init = function(){

		if( this.beforeInit ) this.beforeInit();
		
		this.setTemplate();
	};
	
	Base.prototype.templateReady = function(){
				
		this.Render();
		
		if( this.addHTML ) this.addInlineHTML();
		
		this.Bind();

		if( this.disabled && _.isFunction( this.disable ) ) this.disable();
		
		if( this.childList && this.childList.length ){
			
			for( var a = 0; a < this.childList.length; a ++ ){
				
				this.childList[ a ].parent = this;

				this.widgetManager.create( this.childList[ a ] )
			}
		}
		if( this.compose ) this.parseComposition();
		
		if( this.afterInit ) this.afterInit();

		eventManager.trigger( EVENT.USER.WIDGET_CREATED );
	};

	Base.prototype.parseComposition = function(){

		var childList = this.analyzeBase();

		if( !childList ) return false;

		_.each( this.compose, function(value, key ){

			if( key === 0 ) return;

			for( var a = 0; a < childList.length; a ++ ){

				if( _.has( value, childList[a].key ) ) childList[a][key] = value[childList[a].key];
			}
		});
		for( var a = 0; a < childList.length; a ++ ){

		    this.widgetManager.create( childList[a] )
		}
	};

	Base.prototype.analyzeBase = function(){

		if( !_.has( this.compose, 0 ) ) return false;

		if( !_.has( this.compose[0], 'keys' ) ) return false;

		if( !_.isArray( this.compose[0].keys ) ) return false;

		if( !this.compose[0].keys.length ) return false;

		if( !this.compose[0].base ) this.compose[0].base = {};

		var result = [];

		var obj;

		for( var a = 0; a < this.compose[0].keys.length; a ++ ){

			obj = _.clone( this.compose[0].base );
			obj.parent = this;
			obj.key = this.compose[0].keys[a];
			result.push( obj );
		}
		return result.length ? result : false;
	};
	
	Base.prototype.Render = function(){
		
		var holderElement;
		
		if( !this.parent ){
			
			holderElement = $('body')[0];
			
		}else if( this.holder ){

		    if( _.isObject( this.holder ) ) holderElement = this.holder;
		    else               holderElement = this.parent.$node.find( this.holder );

			if( !holderElement.length ) holderElement = this.parent.$node;

		}else holderElement = this.parent.$node;
		
		this.addStyle();
		
		switch( this.prepend ){
				
			case true:
				this.$node = $( this.template ).prependTo( this.addAutoHolder ( holderElement, 1 ) );
				break;
			default:
				this.$node = $( this.template ).appendTo( this.addAutoHolder ( holderElement ) );
				break;
		};
		
		this.$node.data( CONST.WIDGET.DATA, this );

		if( this.img ) this.$node.css( "background-image", "url('" + this.img + "')" );
		if( this.text ) this.$node.text( this.text );

		this.$node.addClass( CONST.WIDGET.CLASSNAME );
		this.$node.addClass( this.widgetClassName );
		this.$node.addClass( this.className );
	};

	Base.prototype.addAutoHolder = function( $holder, prepend ){

	    if( this.autoHolder ) $result = $("<div></div>");
	    else return $holder;

        if( _.isString( this.autoHolderClassName ) && this.autoHolderClassName.length ) $result.addClass( this.autoHolderClassName );

        if( prepend ) $result.prependTo( $holder );
        else $result.appendTo( $holder );

        return $result;
    };
	
	Base.prototype.addInlineHTML = function(){
		
		if( _.isArray( this.addHTML ) ){
			
			for( var a = 0; a < this.addHTML.length; a ++ ){
			
				this.nestHTML( this.addHTML[a] );
			}
			
		}else if( _.isObject( this.addHTML ) ){
			
			this.nestHTML( this.addHTML );
		}
	};
	
	Base.prototype.nestHTML = function( obj ){

	    if( !this.$node ) return;
		
		if( !STRING.isString( obj.str ) || !obj.str.length ) return false;
		
		if( !STRING.isString( obj.tag ) || !obj.tag.length ) return false;
		
		var $el = this.$node.find( obj.holder );
		
		if( !$el.length ) $el = this.$node;
		
		var result = this.addTags( $el.html(), obj );
		
		if( STRING.isString( result ) ) return $el.html( result );
	};
	
	Base.prototype.addTags = function( text, obj ){
		
		if( text.indexOf( obj.str ) === -1 ) return false;
		
		if( !_.has( obj, 'index' ) ){
			
			var parts = text.split(obj.str);
			
			if( parts && parts.length ){
				
				var resultStr = this.addTag(
				
					obj.str,
					obj.str,
					0,
					obj.tag,
					obj.className
				);

				var result = "";
			
				for( var a = 0; a < parts.length; a ++ ){
					
					result += parts[a];
					
					if( a < parts.length -1 ) result += resultStr;
				}
				return result;
			}
		}else{
			
			var indexes = STRING.allSubs( text, obj.str );
			
			if( !indexes.length || typeof 0 !== typeof obj.index || obj.index >= indexes.length ) return false;
		
			return this.addTag(
			
				text,
				obj.str,
				indexes[ obj.index ],
				obj.tag,
				obj.className
			);
		}
	};
	
	Base.prototype.addTag = function( str, subStr, index, tag, className ){
		
		var openTag = "<" + tag + ( ( className ) ? " class='" + className + "'>" : ">" );
		var closeTag = "</" + tag + ">";
		
		var start = str.substring( 0, index );
		var end = str.substring( index + subStr.length );
		
		var result = openTag + subStr + closeTag;
		
		return start + result + end;
	};
	
	
	Base.prototype.addStyle = function(){
		
		if( this.css ) this.setCss( this.css );
		if( this.cssAdd ) this.setCss( this.cssAdd );
	};
	
	Base.prototype.setCss = function( css ){
		
		if( !css ) return;
		
		if( typeof css === typeof "" ) return this.cssLink( css );
		
		for( var a = 0; a < css.length; a ++ ){
			
			this.cssLink( css[ a ] );
		}
	};
	
	Base.prototype.cssLink = function( css ){

		var add = true;
		
		$('head').find('link').each(function(){
			
			if( this.href === css ) add = false;
		});

		if( add ) $('<link>').attr('rel', 'stylesheet').attr('type', 'text/css').attr('href', css).appendTo( $('head') );
	};

	Base.prototype.extendListeners = function( extension ){

	    if( !this.eventListeners ) this.eventListeners = [];
        else if( !_.isArray( this.eventListeners ) && _.isObject( this.eventListeners ) ) this.eventListeners = [this.eventListeners];

        if( _.isArray( extension ) ) this.eventListeners = this.eventListeners.concat( extension );
        else if( _.isObject( extension ) ) this.eventListeners.push( extension );
	};

	Base.prototype.checkPermissions = function( data ){

		if( !this.features ) return true;

		if( !data.permissions ) return false;

		var features = ( _.isString( this.features ) ) ? [this.features] : this.features;

		var result = true;
		_.each( features, function( feature ){

			if(
				!_.findWhere( data.permissions, { feature: feature, space: "0" } )
				&& !_.findWhere( data.permissions, { feature: feature, space: data.space } )
			) result = false;
		});
		return result;
	};
	
	Base.prototype.Bind = function(){

	    var self = this;

		this.extendListeners({
			on: EVENT.USER.PERMISSIONS_CHECK,
			callback: function( e, data ){

				var enable = self.checkPermissions( data );

				if( enable && _.isFunction( self.enable ) ) self.enable();

				if( !enable && _.isFunction( self.disable ) ) self.disable();
			}
		});

	    if( _.isArray( this.eventListeners ) ) _.each( this.eventListeners, function( listener, key ){

	        if( _.isArray( listener.on ) || _.isObject( listener.on ) ) _.each( listener.on, function( event ){

                self.subscribe(
                    event + "." + self.id,
                    listener.callback
                );
            });
            else self.subscribe(
                 listener.on + "." + self.id,
                 listener.callback
             );
	    });
	    else if( _.isObject( this.eventListeners ) ) self.subscribe(

             this.eventListeners.on + "." + this.id,
             this.eventListeners.callback
         );

         if( !_.isObject( this.$node ) ) return;

		if( _.isFunction( this.onClick ) ){
			
			this.$node.on( 'click', function( e, data ){
				
				if( self.disabled ) return;
							
				self.onClick( e, data );
			});
		}
		if( this.design && this.design.listener ) this.responseDesign();
	};
	
	Base.prototype.unBind = function(){
		
		if( this.eventListeners ){
			
			for( var a = 0; a < this.eventListeners.length; a ++){
								
				if( this.eventListeners[ a ].on.constructor === Array ){
					
					for( var b = 0; b < this.eventListeners[ a ].on.length; b ++ ){
						
						this.unsubscibe( this.eventListeners[ a ].on[ b ] + "." + this.id );
					}
				}else this.unsubscibe( this.eventListeners[ a ].on + "." + this.id );
			}
		}
	};

	Base.prototype.responseDesign = function(){

		if( _.isArray( this.design.listener ) ){

			_.each( this.design.listener, function( element, index, list ){

				this.parseListener( element );
			});
		}else if( _.isObject( this.design.listener ) || _.isFunction( this.design.listener ) ){

			this.parseListener( this.design.listener );
		}
	};

	Base.prototype.parseListener = function( listener ){

		if( !listener ) return false;

		var self = this;

		if( _.isFunction( listener ) ){

			$(window).resize(function( e ){

				listener.call( self, e );
			});
		}
		if( _.isObject( listener ) ){

			$(window).resize(function( e ){

				if( self.checkListenerLimits( listener.min, listener.max ) ){

					if( _.isFunction( listener.sizeIn ) ) listener.sizeIn.call( self, e );

				}else if( _.isFunction( listener.sizeOut ) ) listener.sizeOut.call( self, e );
			});
		}
		eventManager.trigger( EVENT.RESIZE );
	};

	Base.prototype.checkListenerLimits = function( min, max ){

		if( !min && !max ) return true;

		if( min && !max ) return ( min < window.innerWidth );

		if( !min && max ) return ( max > window.innerWidth );

		if( min && max ) return ( min < window.innerWidth && max > window.innerWidth );

		return false;
	};
	
	Base.prototype.subscribe = function( name, cb ){
		
		var self = this;
		
		$( window ).on( name, function( e, data ){
							
			cb.call( self, e, data );
		});
	};
	
	Base.prototype.unsubscibe = function( name ){
		
		$( window ).off( name );
	};
	
	Base.prototype.Close = function(){

	    var children = this.getChildren();

	    if( this.beforeClose ) this.beforeClose();

	    this.widgetManager.remove( this );
	
		var afterClose = this.afterClose;
		
		if( _.isObject( this.$node ) ) this.$node.remove();
		
		this.unBind();

		this.Close = null;
		_.each( children, function( child ){

		    child.Close();
		});
		if( afterClose ) afterClose();
	};
	
	Base.prototype.setTemplate = function(){
		
		var self = this;
		
		if( this.extTemplate ) return proxyManager.get(
		
			this.extTemplate,
			CONST.TEMPLATE.TYPE.HTML,
			function( data, status ){

				if( status === CONST.TEMPLATE.LOAD.SUCCESS ) self.template = data;
				else self.template = CONST.TEMPLATE.BASE;

				self.templateReady();
			}
		);
		
		if( !this.template ) this.template = CONST.TEMPLATE.BASE;
					
		return this.templateReady();
	};
	
	Base.prototype.get = function( key ){
		
		var children = this.widgetManager.getChildren( this );
		
		return this.widgetManager.get( 'key', key, children );
	};
	
	Base.prototype.getChildren = function(){
		
		return this.widgetManager.getChildren( this );
	};
	
	Base.prototype.disableChilds = function(){
		
		var childs = this.getChildren();
		
		for( var a = 0; a < childs.length; a ++ ){
			
			if( childs[a].disable ) childs[a].disable();
		}
		return this;
	};
	
	Base.prototype.enableChilds = function(){
		
		var children = this.getChildren();
		
		for( var a = 0; a < children.length; a ++ ){
			
			if( children[a].enable ) children[a].enable();
		}
		return this;
	};

	Base.prototype.getUrlData = function(){

        var url = decodeURIComponent( window.location.href );

        var getData = url.split("?")[1];

        if( !getData ) return false;

        var fields = getData.split("&");

        var result = {};

        var temp;

        for( var a = 0; a < fields.length; a ++ ){

            if( !fields[a] ) continue;

            temp = fields[a].split( '=' );

            result[temp[0]] = temp[1];
        }
        return result;
    };

    Base.prototype.ajaxRequest = function( data, skipKey ){

        var self = this;

        ajaxManager.req({

             key: ( skipKey ) ? null : true,
             url: data.url,
             data: data.data,
             type: 'POST',
             success: data.success
         });
    };
	
	return Base;
});