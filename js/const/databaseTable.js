define(function(){

	return {

        ACTION: {
            SELECT: 'select',
            INSERT: 'insert',
            UPDATE: 'update',
            DELETE: 'delete'
        },

        TABLE: {
            USER: 'user',
            SPACE: 'space',
            OBJECT: 'object',
            PRESENCE: 'presence',
            LOCATION: 'location',
            PERMISSION: 'permission'
        },

        PATH: {
            USER: 'c/b/feature/User.php',
            SPACE: 'c/b/feature/Space.php',
            OBJECT: 'c/b/feature/Object.php',
            PRESENCE: 'c/b/feature/Presence.php',
            LOCATION: 'c/b/feature/Location.php',
            PERMISSION: 'c/b/feature/Permission.php'
        },

	    WIDGET: {
	        SEARCH: 'search',
	        INSERT: 'insert',
	        LIST: 'list',
            DATA: 'data',
            SUBMIT: 'submit'
	    },

	    MENU: {
	        MANAGE: 'manage'
	    }
	}
});