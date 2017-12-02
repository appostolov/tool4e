define(
function(){
	
	function storageManager(){};
	
	storageManager.prototype = {

	    isOn: function(){

	        if( typeof(Storage) !== "undefined" ) return true;
	        return false;
	    },

	    get: function( name ){

	        if( !this.isOn() ) return;

	        if( localStorage[name] ) return localStorage[name];
	    },

	    set: function( name, value ){

	        if( !this.isOn() ) return;

	        localStorage.setItem( name, value );
	    },

	    remove: function( name ){

	        if( !this.isOn() ) return;

            localStorage.removeItem( name );
        }
	};
	return new storageManager();
});