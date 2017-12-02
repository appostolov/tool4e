define(
[
	'widgets/Base',
	'external/underscore/underscore.min'
],
function( Base ){

	function Field(){};

	Field.prototype = new Base();
	Field.prototype.constructor = Field;

	Field.prototype.Render = function(){

		Base.prototype.Render.call( this );
		
		this.field = this.$node.find(this.fieldType);

		if( this.value ) this.field.attr( 'value', this.value );

		if( this.name ) this.field.attr( 'name', this.name );

		if( this.placeholder ) this.field.attr( 'placeholder', this.placeholder );

		if( this.label ) this.$node.find('label').text( this.label );
		else this.$node.find('label').remove();
	};

	Field.prototype.Bind = function(){

		Base.prototype.Bind.call( this );

		this.Value = this.value;

		var self = this;

		this.$node.on( 'click.' + self.id, function(){

			if( self.disabled ) return;

			self.field.focus();
		});
		
		this.$node.on( 'input.' + self.id, function(){

			if( self.disabled ) return;
			
			self.value = self.field.val();

			if( _.isFunction( self.onChange ) ) self.onChange();
		});
	};
	
	Field.prototype.setValue = function( val ){
		
		this.field.val( val );
		
		this.value = this.field.val();
		
		return this;
	};
	
	Field.prototype.isChanged = function(){
		
		if( this.value === undefined ) return false;
		
		return !( this.Value === this.value );
	};

	Field.prototype.disable = function(){

		this.disabled = true;

		this.field.prop( 'disabled', true );

		this.$node.addClass( 'disabled' );
		
		return this;
	};

	Field.prototype.enable = function(){

		this.disabled = false;

		this.field.prop( 'disabled', false );

		this.$node.removeClass( 'disabled' );
		
		return this;
	};

	return Field;
});