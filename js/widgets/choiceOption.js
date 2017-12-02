define(
[
	'external/jquery/jquery.module',
	'widgets/Base',
	'external/underscore/underscore.min'
],
function( $, Base ){

	function choiceOption(){
		
		this.template = '<div><label></label><div class="columns"><div class="images"></div><div class="info"><div class="fields"></div><div class="buttons"></div></div></div></div>';
		this.css = "http://offerpre.com/c/u/css/widgets/choiceOption.css";
		this.widgetClassName = "widgetChoiceOption";

		return this;
	};

	choiceOption.prototype = new Base();
	choiceOption.prototype.constructor = choiceOption;
	
	choiceOption.prototype.setTitle = function( title ){
		
		this.$node.find('label').text( title );
	};
	
	choiceOption.prototype.createField = function( field ){
		
		if( !field ) return;
		
		if( _.isArray( field ) ){
			
			var self = this;
			
			_.each( field, function( element, index ){
				
				self.createField( element );
			});
		}else if( _.isObject( field ) ){
			
			var node = $('<p><span></span><b></b></p>');
			
			node.find('span').html( field.title );
			
			node.find('b').html( field.value );
			
			node.attr( 'class', field.className ).appendTo( this.$node.find('.columns').find('.info').find('.fields') );
			
		}else return false;
		
		return true;
	};
	
	choiceOption.prototype.createImages = function( images ){
		
		if( !images ) return;
		
		if( _.isArray( images ) ){
			
			var self = this;
			
			_.each( images, function( element, index ){
				
				self.createImages( element );
			});
		}else if( _.isObject( images ) ){
			
			$('<img>').attr(
			
				'src',
				images.src
				
			).attr(
				
				'alt',
				images.alt
				
			).attr(
			
				'class',
				images.className
				
			).appendTo(
			
				this.$node.find('.columns').find('.images')
			);
		}else return false;
		
		return true;
	};

	return choiceOption;
});