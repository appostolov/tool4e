define(['core/const'], function( CONST ){

	return {

        CLICK: 'click',
        RESIZE: 'resize',
        KEYDOWN: 'keydown',
        KEYUP: 'keyup',
        MOUSEMOVE: 'mousemove',
        MOUSEDOWN: 'mousedown',
        MOUSEUP: 'mouseup',
        MOUSELEAVE: 'mouseleave',
        BEFOREUNLOAD: 'beforeunload',
        CONTEX_MENU: 'contextmenu',
        TOUCHSTART: 'touchstart',
        TOUCHEND: 'touchend',
        TOUCHMOVE: 'touchmove',
        CHANGE: 'change',
        INPUT: 'input',
        USER: {
            CHANGED_STATE: 'user_state_changed',
            WIDGET_CREATED: 'user_widget_created',
            PERMISSIONS_CHECK: 'user_permissions_check'
        },
        VIEW3D: {
            CHANGE: {
                POSITION: 'view3d_change_position'
            },
            CHANGED: {
                POSITION: 'view3d_changed_position'
            },
            RENDER: 'view3d_render',
            OBJECT: {
                RENDER: 'view3d_object_render',
                IMG_LOADED: 'view3d_object_image_loaded',
                PRESENCE_LOADED: 'view3d_object_presence_loaded'
            },
            SPACE: {
                SELECT: 'view3d_space_select'
            }
        },
         MENU: {
            MAIN: {
                OPEN: 'menu_open'
            },
             TOOL4E: {
                ACTION: {
                    CREATE: 'menu_tool4e_action_create',
                    UPDATE: 'menu_tool4e_action_update',
                    DELETE: 'menu_tool4e_action_delete'
                },
                TIME_INPUT: 'menu_tool4e_input_changed'
             }
         }
	}
});