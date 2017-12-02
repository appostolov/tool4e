define(function(){
	
	return {

	    LOGO: "http://www.offerpre.com/c/u/img/logo_tool4e.png",
	    MENU_BUTTON: "http://www.offerpre.com/c/u/img/menu_tool4e.png",

	    CUSTOM: {
	        PATH_SEP: "/"
	    },
		COORD_SYSTEM: {
			AXIS: {
				X: 'x',
				Y: 'y',
				Z: 'z',
			}
		},
		TRACK: {
			REQ:{
				URL: 'url',
				AD: 'ad',
				END: 'visit',
				TIME: 'created'
			},
			KEY:{
				NAME: 'key',
				LEN: 32
			},
			PATH: 'c/b/track/track.php'
		},
		TEMPLATE: {
			LOAD: {
				SUCCESS: 'success'
			},
			BASE: '<div></div>',
			TYPE: {
				HTML: 'html'
			}
		},
		WIDGET: {
			DATA: 'widgetUI',
			CLASSNAME: 'ui_widget',
			ID: 'widget_',
			TYPE: {
				BASE: 'Base',
				BUTTON: 'Button',
				INPUT: 'Input',
				TEXTAREA: 'Textarea',
				CHECKBOX: 'Checkbox',
				DROPDOWN: 'Dropdown',
				FORM: 'Form',
				PAGE: 'Page',
				ART: 'Article',
				MENU: 'Menu',
				CHOICE_OPTION: 'choiceOption',
				POPOVER: 'Popover',
				VIEW3D: 'View3d',
				SPACE: 'Space',
				LIST: 'List',
				SPACE_OBJECT: 'SpaceObject'
			}
		},
		FILTER_MODE: {
			SIMPLE: 0,
			STRICT: 1
		},
		FILTER_TYPE: {
			REQUIRED: 'required',
			EQUAL: 'equal',
			IDENTICAL: 'identical',
			DATA_TYPE: 'dataType',
			MAXLEN: 'maxLen',
			MINLEN: 'minLen',
			MAXNUM: 'maxNum',
			MINNUM: 'minNum',
			REGEX: 'regex',
			MAIL: 'mail',
			PHONE: 'phone'
		},
		DATA_TYPE: {
			NUM: 'number',
			STR: 'string',
			BOOL: 'boolean',
			OBJ: 'object',
			ARR: 'array',
			FUNC: 'function'
		},
		REGEX: {
			MAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
		}
	}
});