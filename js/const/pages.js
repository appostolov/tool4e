define(function(){

	return {

		DOMAIN: 'www.pbrooms.com',

		COMPANY: 'СЛАВЕЯ 1 ЕООД',

		CONTACTS: {
			MAIL: 'airguard@pbrooms.com',
			PHONE: '0895 631 632',
			ADDRESS: 'гр.Бургас, ПК 8000, ул. Цар Иван Шишман 20',
			COMPANY: 'СЛАВЕЯ 1 ЕООД, ЕИК 147131737'
		},

		PROXY: '../proxy.php',

		PAGE: {


			INDEX: {
				KEY: 'index',
				TEMPLATE: '<div></div>',
				CSS: [
				    'c/u/css/core/main.css',
				    'c/u/css/pages/index.css'
				],
				TRACK: {
					url: 'www.tool4e.com',
					ad: 2
				}
			},

			TERMS: {
				KEY: 'terms',
				TEMPLATE: '<div><div id="upMenu"></div><div id="holder"></div><footer></footer></div>',
				CSS: 'http://www.pbrooms.com/_core-offer/css/terms.css',
				TRACK: {
					url: 'www.offerpre.com/offer_new/terms.php'
				}
			},
			PRIVACY: {
				KEY: 'policy',
				TEMPLATE: '<div><div id="upMenu"></div><div id="holder"></div><footer></footer></div>',
				CSS: 'http://www.pbrooms.com/_core-offer/css/terms.css',
				TRACK: {
					url: 'www.tool4e.com'
				}
			},


			CONTACTS: {
				KEY: 'contacts',
				TEMPLATE: '<div><div id="upMenu"></div><div id="holder"></div><footer></footer></div>',
				CSS: 'http://www.pbrooms.com/_core-offer/css/result.css',
				TRACK: {
					url: 'www.tool4e.com'
				}
			}
		},
		ART: {
			TERMS: {
				HOLDER: '#holder',
				TEMPLATE: 'template_html_terms',
				TEMPLATE_KEY: {
					DOMAIN: 'DOMAIN_NAME',
					COMPANY: 'COMPANY_NAME',
					PRODUCT: 'PRODUCT_NAME',
					MAIL: 'SUPPORT_MAIL',
					OFFER_PATH: 'OFFER_PATH'
				},
				OFFER_PATH: 'www.pbrooms.com/AirGuard'
			},
			PRIVACY: {
				HOLDER: '#holder',
				TEMPLATE: 'template_html_privacy'
			},
			CONTACTS: {
				HOLDER: '#holder',
				CSS: 'http://www.pbrooms.com/_core-offer/css/contactsArt.css',
				TITLE: 'Контакти:',
				INFO: '* Ще се радваме да отговорим на Вашите въпроси, мнения и препоръки.',
				TEXT: {
					MAIL: 'Е-майл: ',
					PHONE: 'Телефон: ',
					ADDRESS: 'Адрес: ',
					COMPANY: 'Фирма: '
				}
			}
		}
	}
});