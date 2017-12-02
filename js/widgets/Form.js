define(
[
	'external/jquery/jquery.module',
	'core/const',
	'widgets/Base',
	'manager/filterManager',
	'manager/widgetManager',
	'manager/ajaxManager',
	'external/underscore/underscore.min'
],
function( $, CONST, Base, filterManager, widgetManager, ajaxManager ){

	function Form(){
		
		this.template = "<div><div class='top'><label></label></div><div class='middle'><form></form></div><div class='bottom'></div></div>";
		this.css = "http://offerpre.com/c/u/css/widgets/form.css";
		this.widgetClassName = "widgetForm";

		return this;
	};

	Form.prototype = new Base();
	Form.prototype.constructor = Form;

	Form.prototype.Render = function(){

	    var self = this;

	    if( _.isArray( this.childList ) ) _.each( this.childList, function( child ){

	        if( !child.holder ) child.holder = 'form';
	    });
		Base.prototype.Render.call( this );
		
		if( this.label ) this.$node.find('.top').find('label').text( this.label );
	};
	
	Form.prototype.submitForm = function( action, method, force ){
		
		var form = this.$node.find('form');
		
		if( this.secured ) this.setKey();
		
		if( this.visit ) this.setVisit();

		if( this.time ) this.setTime();
		
		this.prepareForm( action, method );
		
		if( force ) return form.submit();
		
		var filterResult = this.filterData();
		
		if( filterResult === true ) form.submit();
		
		else if( this.filterFail ) this.filterFail.call( this, filterResult );
		
		return false;
	};

	Form.prototype.setTime = function(){

	    var d = new Date();

        $('<input type="hidden" name="' + CONST.TRACK.REQ.TIME + '">').appendTo( this.$node.find('form') ).val(d.toLocaleDateString());
    }
	
	Form.prototype.setKey = function(){
		
		if( !ajaxManager.getKey() ) return false;
		
		$('<input type="hidden" name="' + CONST.TRACK.KEY.NAME + '">').appendTo( this.$node.find('form') ).val(ajaxManager.getKey());
	}
	
	Form.prototype.setVisit = function(){
		
		var visit = 0; 
		
		if( window.visit ) visit = window.visit;
		
		$('<input type="hidden" name="' + CONST.TRACK.REQ.END + '">').appendTo( this.$node.find('form') ).val(visit);
	}
	
	Form.prototype.getData = function(){

		if( !this.dataFields || !this.dataFields.length ) return false;
		
		var data = {};
		
		var widget;
		
		for( var a = 0; a < this.dataFields.length; a ++ ){
			
			widget = this.get( this.dataFields[a] );
			
			if( !widget ) continue;
			
			if( widget.value ) data[this.dataFields[a]] = widget.value;
		}
		return data;
	};
	
	Form.prototype.filterData = function( mode ){
		
		var data = this.getData();
		
		return filterManager.filter( data, this.filter, mode );
	};
	
	Form.prototype.prepareForm = function( action, method ){
		
		var form = this.$node.find('form');
		
		for( var a = 0; a < this.dataFields.length; a ++ ){
			
			this.setName( this.dataFields[a] );
		}
		if( action ) form.attr( 'action', action );
		
		if( method ) form.attr( 'method', method );
		else form.attr( 'method', 'post' );
		
		return this;
	};
	
	Form.prototype.setName = function( key ){
		
		var widget = this.get( key );
		
		if( !widget ) return;
		
		switch( widget.type ){
			
			case 'Input':
				
				widget.field.attr( 'name', key );
				return;
				
			case 'Textarea':
				
				widget.field.attr( 'name', key );
				return;
				
			case 'Dropdown':
				
				widget.Select.attr( 'name', key );
				return;
				
			case 'Checkbox':
				
				widget.checkbox.attr( 'name', key );
				return;
				
			default:
				return;
		};
	};

	Form.prototype.disable = function(){

		this.disabled = true;
		
		this.disableChilds();

		this.$node.addClass( 'disabled' );
		
		return this;
	};

	Form.prototype.enable = function(){

		this.disabled = false;

		this.enableChilds();

		this.$node.removeClass( 'disabled' );
		
		return this;
	};

	return Form;
});