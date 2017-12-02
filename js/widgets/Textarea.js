define(
[
	'widgets/Field'
],
function( Field ){

	function Textarea(){
		
		this.fieldType = 'textarea';

		this.template = "<div><label></label><textarea></textarea></div>";
		this.css = "http://offerpre.com/c/u/css/widgets/textarea.css";
		this.widgetClassName = "widgetTextarea";

		return this;
	};

	Textarea.prototype = new Field();
	Textarea.prototype.constructor = Textarea;

	return Textarea;
});