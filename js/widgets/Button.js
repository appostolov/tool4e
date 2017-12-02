define(
[
	'widgets/Base'
],
function( Base ){

	function Button(){
		
		this.template = "<button class='mainBackground mainBorder backColor'></button>";
		this.css = "http://offerpre.com/c/u/css/widgets/button.css";
		this.widgetClassName = "widgetButton";

		return this;
	};

	Button.prototype = new Base();
	Button.prototype.constructor = Button;

	Button.prototype.disable = function(){

		this.disabled = true;

		this.$node.prop( 'disabled', true );

		this.$node.addClass( 'disabled' );
		
		return this;
	};

	Button.prototype.enable = function(){

		this.disabled = false;

		this.$node.prop( 'disabled', false );

		this.$node.removeClass( 'disabled' );
		
		return this;
	};

	return Button;
});