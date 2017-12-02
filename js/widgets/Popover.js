define(
[
	'widgets/Base',
	'manager/eventManager'
],
function( Base, eventManager ){

	function Popover(){
		
		this.template = "<div><div class='arrow'></div><div class='content'></div></div>";
		this.css = "http://offerpre.com/c/u/css/widgets/popover.css";
		this.widgetClassName = "widgetPopover";

		return this;
	};

	Popover.prototype = new Base();
	Popover.prototype.constructor = Popover;
	
	Popover.prototype.Bind = function(){

		Base.prototype.Bind.call( this );
		
		var self = this;
		
		eventManager.on( 'click.' + this.id, function(){
			
			if( self.inUse ) self.Close();
			
			self.inUse = true;
		});
	};
	
	Popover.prototype.Close = function(){

		Base.prototype.Close.call( this );
		
		eventManager.off( 'click.' + this.id );
	};

	return Popover;
});