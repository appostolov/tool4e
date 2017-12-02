define(
[
	'external/jquery/jquery.module',
	'core/const',
	'const/events',
	'const/user',
	'manager/ajaxManager',
	'manager/eventManager',
	'manager/filterManager',
	'external/underscore/underscore.min'
],
function( $, CONST, EVENT, USER, ajaxManager, eventManager, filterManager ){
	
	function user(){

		var self = this;

		eventManager.on( EVENT.USER.WIDGET_CREATED, function(){

			self.checkPermissions();
		});
		eventManager.on( EVENT.VIEW3D.SPACE.SELECT, function( e, data ){

		    self.space = data.space;

		    self.checkPermissions();
        });
	};
	
	user.prototype = {

	        checkAction: function( action ){

	            var result = false;

	            _.each( USER.REQ, function( act ){

	                if( act === action ) result = true;
	            });
	            return result;
	        },

	        filterData: function( data ){

	            var isValid = filterManager.filter( data, USER.FILTER[data.action], CONST.FILTER_MODE.SIMPLE );

	            if( isValid !== true ) return false;

	            var extractData = {};

	            _.each( USER.KEYS[data.action], function( key ){

	                extractData[key] = data[key];
	            });
	            return extractData;
            },

			checkPermissions: function(){

				var permissions = [];
				if( _.isObject( this.result ) && _.isObject( this.result.permissions ) ) permissions = this.result.permissions;

				eventManager.trigger( EVENT.USER.PERMISSIONS_CHECK, { permissions: permissions, space: this.space } );
			},

	        action: function( data ){

	            var self = this;

	            if( !this.checkAction( data.action )) return;

	            var Data = this.filterData( data );

	            if( !Data ) return false;

	            ajaxManager.req({

	                key: true,
                    url: USER.PATH,
                    type: 'POST',
                    data: Data,
                    success: function( result ){

                        try {
                            JSON.parse( result )
                        }
                        catch(err) {
                            return console.error('Bad USER data!');
                        }
                        self.result = JSON.parse( result );

                        if( _.isFunction( data.callback ) ) data.callback.call( self, data );

						self.checkPermissions();
                    }
	            });
	        }
		};
	
	return user;
});