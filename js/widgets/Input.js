define(
[
	'widgets/Field'
],
function( Field ){

	function Input(){
		
		this.fieldType = 'input';

		this.template = "<div><label></label><input type='text'></div>";
		this.css = "http://offerpre.com/c/u/css/widgets/input.css";
		this.widgetClassName = "widgetInput";

		return this;
	};

	Input.prototype = new Field();
	Input.prototype.constructor = Input;
	
	Input.prototype.Render = function(){

		Field.prototype.Render.call( this );
		
		if( this.hidden ) this.field.attr('type', 'hidden');
	};

	return Input;
});