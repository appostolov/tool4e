define(
[
	'widgets/Base'
],
function( Base ){

	function Checkbox(){

		this.template = "<div><input type='checkbox'><label class='mainColor'></label></div>";
		this.css = "http://offerpre.com/c/u/css/widgets/checkbox.css";
		this.widgetClassName = "widgetCheckbox";

		return this;
	};

	Checkbox.prototype = new Base();
	Checkbox.prototype.constructor = Checkbox;

	Checkbox.prototype.Render = function(){

		Base.prototype.Render.call( this );
		
		this.checkbox = this.$node.find('input');

		if( this.valueAttr ) this.checkbox.prop( 'value', this.valueAttr );

		if( this.value ) this.checkbox.prop( 'checked', true );

		if( this.name ) this.checkbox.attr( 'name', this.name );

		if( this.label ) this.$node.find('label').text( this.label );
	};

	Checkbox.prototype.Bind = function(){

		Base.prototype.Bind.call( this );

		if( this.value ) this.value = true;
		else this.value = false;
		
		this.Value = this.value;

		var self = this;

		this.$node.on( 'click.' + self.id, function(){

			if( self.disabled ) return;

			self.toggleValue();
		});
	};
	
	Checkbox.prototype.toggleValue = function(){

		this.value = !this.value;
		
		switch( this.value ){
			
			case true:
			
				this.checkbox.prop( 'checked', true );
				return this;
				
			case false:
				
				this.checkbox.prop( 'checked', false );
				return this;
		}
	};
	
	Checkbox.prototype.isChanged = function(){
		
		if( this.value === undefined ) return false;
		
		return !( this.Value === this.value );
	};

	Checkbox.prototype.disable = function(){

		this.disabled = true;

		this.checkbox.prop( 'disabled', true );

		this.$node.addClass( 'disabled' );
		
		return this;
	};

	Checkbox.prototype.enable = function(){

		this.disabled = false;

		this.checkbox.prop( 'disabled', false );

		this.$node.removeClass( 'disabled' );
		
		return this;
	};

	return Checkbox;
});