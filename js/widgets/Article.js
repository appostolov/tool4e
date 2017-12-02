define(
[
	'external/jquery/jquery.module',
	'widgets/Base'
],
function( $, Base ){

	function Article(){
		
		this.css = "http://offerpre.com/c/u/css/widgets/article.css";
		this.widgetClassName = "widgetArticle";
		
		this.templates = {
			
			post: '<p></p>',
			img: '<img alt="" />',
			holder: '<div></div>'
		};

		return this;
	};

	Article.prototype = new Base();
	Article.prototype.constructor = Article;

	Article.prototype.Render = function(){

		Base.prototype.Render.call( this );
		
		if( this.list && this.list.length ) this.renderList();
	};
	
	Article.prototype.renderList = function(){
		
		for( var a = 0; a < this.list.length; a ++ ){
			
			this.renderItem( this.list[a] );
		}
	};
	
	Article.prototype.renderItem = function( listItem ){
		
		var itemEl;
		
		if( !listItem.text && !listItem.src ) itemEl = $( this.templates.holder );
		else itemEl = $( this.templates.post );
		
		if( listItem.className ) itemEl.addClass( listItem.className );
		
		if( listItem.text ) itemEl.html( listItem.text );
		
		if( listItem.img ) $( this.templates.img ).prependTo( itemEl ).attr( 'src', listItem.img );
		
		itemEl.appendTo( this.$node );
	};

	Article.prototype.disable = function(){

		this.disabled = true;

		this.$node.prop( 'disabled', true );

		this.$node.addClass( 'disabled' );
		
		return this;
	};

	Article.prototype.enable = function(){

		this.disabled = false;

		this.$node.prop( 'disabled', false );

		this.$node.removeClass( 'disabled' );
		
		return this;
	};

	return Article;
});