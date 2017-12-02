define(
[
	'widgets/Base',
	'core/const',
	'const/events',
	'manager/eventManager',
	'external/underscore/underscore.min'
],
function( Base, CONST, EVENT, eventManager ){

	function List(){
		
		this.template = "<div><div class='scroll'><div class='scrollHeight'></div></div><div class='list column'></div></div>";
		this.css = "http://offerpre.com/c/u/css/widgets/list.css";
		this.widgetClassName = "widgetList";

		return this;
	};

	List.prototype = new Base();
	List.prototype.constructor = List;

	List.prototype.Render = function(){

		Base.prototype.Render.call( this );

		if( this.label ) this.$node.find('label').text( this.label );

		this.$list = this.$node.find('.list');

		this.$scroll = this.$node.find('.scroll');

		this.$scrollHeight = this.$node.find('.scrollHeight');
	};

	List.prototype.Bind = function(){

	    var self = this;

	    if( !_.isArray( this.eventListeners ) ) this.eventListeners = [];

	    this.eventListeners.push({
	        on: EVENT.RESIZE,
	        callback: function(){

	            self.showList();
	        }
	    });
        Base.prototype.Bind.call( this );

        this.$scroll.scroll(function(){

            self.showList();
        });

        this.$list.on( 'mousewheel', function( e ){

           var scroll = self.$scroll.scrollTop();
           var height = self.$scroll.prop( 'scrollHeight' );
           var dir = ( e.originalEvent.wheelDelta > 0 ) ? -1 : 1;
           var vell = 50;

           scroll += dir * vell;

           if( scroll > height ) scroll = height;
           if( scroll < 0 )      scroll = 0;

           self.$scroll.scrollTop( scroll );
        });
    };

	List.prototype.initList = function(){

	    if( !_.isArray( this.items ) && !_.isObject( this.items ) ) return console.error('initList: No items list');

	    if( !_.isNumber( this.itemHeight ) || this.itemHeight <= 0 ) return console.error('initList: No item height');

	    this.showList();
	};

	List.prototype.showList = function(){

	    var self = this;

	    this.$scrollHeight.height( this.items.length * this.itemHeight );

	    var position = this.$scroll.scrollTop();

	    var listTop = ( Math.floor( position / this.itemHeight ) * this.itemHeight ) - position;

	    this.$list.css( 'top', listTop );

	    var range = {
	        start: ( position > 0 ) ? Math.ceil( position / this.itemHeight ) - 1 : 0,
	        end: Math.ceil( ( position + this.$node.height() ) / this.itemHeight ) - 1,
	        length: function(){

	            return this.end - this.start + 1;
	        },
	        index: function( index ){

	            if( index > this.length() - 1 ) return false;

	            return this.start + index;
	        }
	    };

	    if( range.length() > this.items.length ) range.end = this.items.length - 1;

	    if( !this.entries ) this.entries = [];

	    if( this.entries.length > range.length() ){

	        for( var a = this.entries.length - 1; a >= range.length(); a -- ){

	            this.entries[a].Close();

	            this.entries.splice( a, 1 );
	        }
	    }else if( this.entries.length < range.length() ){

	        for( var a = this.entries.length; a < range.length(); a ++ ){

	            this.entries[a] = this.addEntry( a );
            }
	    }

	    _.each( this.entries, function( entry, key ){

	        entry.update( range.index( key ) );
	    });
    };

	return List;
});