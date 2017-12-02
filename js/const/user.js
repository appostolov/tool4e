define(['core/const'], function( CONST ){

	return {

        PATH: 'c/b/user/user.php',
        REQ:{
            REGISTER: 'register',
            LOGIN: 'login',
            LOGOUT: 'logout',
            ACTIVATE: 'activate',
            GENERATE: 'generate',
            AUTO: 'auto'
        },
        KEYS: {
            register: {
                USER: 'user',
                PASS: 'pass',
                EMAIL: 'email'
             },
            login: {
                USER: 'user',
                PASS: 'pass',
                REMEMBER: 'remember'
            },
            logout: {
                LOGOUT: 'logout'
             },
            activate: {
                USER: 'user',
                PASS: 'pass',
                ACTIVATE: 'activate'
               },
            generate: {
                USER: 'user',
                PASS: 'pass',
                GENERATE: 'generate'
               },
            auto: {
                AUTO: 'auto'
             }
        },
		FILTER: {
            register: [
                 {
                     dataKey: 'user',
                     checkKey: CONST.FILTER_TYPE.REQUIRED,
                     checkVal: true
                 },
                 {
                     dataKey: 'pass',
                     checkKey: CONST.FILTER_TYPE.REQUIRED,
                     checkVal: true
                 },
                 {
                     dataKey: 'email',
                     checkKey: CONST.FILTER_TYPE.REQUIRED,
                     checkVal: true
                 }
             ],
            login: [
                {
                    dataKey: 'user',
                    checkKey: CONST.FILTER_TYPE.REQUIRED,
                    checkVal: true
                },
                {
                    dataKey: 'pass',
                    checkKey: CONST.FILTER_TYPE.REQUIRED,
                    checkVal: true
                }
            ],
            logout: [
                 {
                     dataKey: 'logout',
                     checkKey: CONST.FILTER_TYPE.REQUIRED,
                     checkVal: true
                 }
             ],
            activate: [
                   {
                       dataKey: 'user',
                       checkKey: CONST.FILTER_TYPE.REQUIRED,
                       checkVal: true
                   },
                   {
                       dataKey: 'pass',
                       checkKey: CONST.FILTER_TYPE.REQUIRED,
                       checkVal: true
                   },
                   {
                       dataKey: 'activate',
                       checkKey: CONST.FILTER_TYPE.REQUIRED,
                       checkVal: true
                   }
               ],
            generate: [
                   {
                       dataKey: 'user',
                       checkKey: CONST.FILTER_TYPE.REQUIRED,
                       checkVal: true
                   },
                   {
                       dataKey: 'pass',
                       checkKey: CONST.FILTER_TYPE.REQUIRED,
                       checkVal: true
                   },
                   {
                       dataKey: 'generate',
                       checkKey: CONST.FILTER_TYPE.REQUIRED,
                       checkVal: true
                   }
               ],
            auto: [
                 {
                     dataKey: 'auto',
                     checkKey: CONST.FILTER_TYPE.REQUIRED,
                     checkVal: true
                 }
             ]
        }
	}
});