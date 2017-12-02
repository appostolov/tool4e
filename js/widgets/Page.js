define(
[
	'widgets/Base'
],
function( Base ){

	function Page(){

		this.widgetClassName = "widgetPage";
		return this;
	};

	Page.prototype = new Base();
	Page.prototype.constructor = Page;

	Page.prototype.Render = function(){

		Base.prototype.Render.call( this );
	};

	Page.prototype.Bind = function(){

		Base.prototype.Bind.call( this );
	};

	return Page;
});