define(
[
	'external/jquery/jquery.module',
	'const/colors',
	'external/underscore/underscore.min'
],
function( $, COLOR ){
	
	function colorManager(){};
	
	colorManager.prototype = {

		getStyleTag: function(){

		    var style = $("style#colors");
		    if( !style.length ) style = $("<style id='colors'></style>").appendTo( $("head")[0] );

		    return style;
		},

		deployColors: function( colors ){

		    var self = this;
		    var result = "";

		    _.each( colors, function( color, key ){

		        result += self.colorCss( color, key );
		    });
		    this.getStyleTag().html( result );
		},

		colorCss: function( color, key ){

            var result = "";
		    var template = [
		        "." + key + "Background{background-color:" + color + ";}",
		        "." + key + "Color{color:" + color + ";}",
		        "." + key + "Border{border-color:" + color + ";}",
		        "." + key + "BoxShadow{box-shadow:3px 3px 5px " + color + ";}",
		        "." + key + "TextShadow{text-shadow:2px 2px 4px " + color + ";}"
		    ];
		    _.each( template, function( row ){

		        result += row;
		    });
		    return result;
		}
	};
	
	return new colorManager();
});