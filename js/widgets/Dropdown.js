define(
[
	'external/jquery/jquery.module',
	'widgets/Base'
],
function( $, Base ){

	function Dropdown(){

		this.template = "<div><label></label><select></select></div>";
		this.css = "http://offerpre.com/c/u/css/widgets/dropdown.css";
		this.widgetClassName = "widgetDropdown";

		return this;
	};

	Dropdown.prototype = new Base();
	Dropdown.prototype.constructor = Dropdown;

	Dropdown.prototype.Render = function(){

		Base.prototype.Render.call( this );
		
		this.Select = this.$node.find('select');

		if( this.values ) this.setValues();
		
		if( this.value ) this.selectOption( 'value', this.value );

		if( this.name ) this.Select.attr( 'name', this.name );

		if( this.label ) this.$node.find('label').text( this.label );
	};

	Dropdown.prototype.Bind = function(){

		Base.prototype.Bind.call( this );

		this.Value = this.value;

		var self = this;

		this.$node.on( 'click.' + self.id, function(){

			if( self.disabled ) return;

			self.Select.focus();
		});
		
		this.Select.change(function(){
			
			self.value = this.value;
		});
	};

	Dropdown.prototype.setValues = function( values ){

		if( values ) this.values = values;

		this.Select.empty();

		for( var a = 0; a < this.values.length; a ++ ){

			this.values[a].$node = this.displayOption( this.values[a] );
		}
		return this;
	};

	Dropdown.prototype.addValues = function( values ){

		this.values = this.values.concat( values );

		this.setValues();

		return this;
	};

	Dropdown.prototype.displayOption = function( option ){
		
		var Option = $('<option></option>');
		
		if( option.value !== undefined ) Option.attr('value', option.value );
		
		if( option.text ) Option.text( option.text );
		
		if( option.disabled ) Option.prop( 'disabled', true );
		
		Option.appendTo( this.Select );
		
		if( option.selected ) this.selectOption( 'value', option.value );
		
		return Option;
	};
	
	Dropdown.prototype.findOption = function( key, val, cb ){
		
		for( var a = 0; a < this.values.length; a ++ ){
			
			if( this.values[a][key] === val ) cb.call( this.values[a] );
		}
	};

	Dropdown.prototype.selectOption = function( key, val ){
		
		var self = this;
		
		this.findOption( key, val, function(){
			
			self.Select.val( this.value ).change();
		});
	};

	Dropdown.prototype.disableOption = function( key, val ){
		
		this.findOption( key, val, function(){
			
			this.$node.prop( 'disabled', true );
		});
	};

	Dropdown.prototype.isChanged = function(){

		if( this.value === undefined ) return false;

		return !( this.Value === this.value );
	};

	Dropdown.prototype.disable = function(){

		this.disabled = true;

		this.Select.prop( 'disabled', true );

		this.$node.addClass( 'disabled' );
		
		return this;
	};

	Dropdown.prototype.enable = function(){

		this.disabled = false;

		this.Select.prop( 'disabled', false );

		this.$node.removeClass( 'disabled' );
		
		return this;
	};

	return Dropdown;
});