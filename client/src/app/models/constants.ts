export class Constants{
	static GET	 	= 'GET';
	static POST	 	= 'POST';

	static PROFILE		= "profile" ;
	static JWT    		= "jwt"
	static SERVER_PORT  	= "4201"

	static GET_USER_URL 	= '/get_user';
	static SAVE_USER_URL 	= '/save_user';
	static UPD_TRIP_URL 	= '/upd_trip';

	static URL_SAVE_USER 	= '/save_user';
	static URL_GET_USER 	= '/get_user';
	static URL_UPD_TRIP 	= '/upd_trip';
	static URL_SEARCH 	= '/search';
	static URL_BOOK 	= '/book';
	static URL_MYOFFERS 	= '/myoffers';
	static URL_MYBOOKING 	= '/mybooking';
	static URL_UPD_JOURNEY 	= '/upd_journey';
	static URL_CANCEL_BOOKING = '/cancel_booking';

	static USER_PAGE 	= 'user';
	static TRIP_PAGE 	= 'trip';
	static SEARCH_PAGE 	= 'search';

	static PAGE_USER	= 'user';
	static PAGE_TRIP	= 'trip';
	static PAGE_SEARCH	= 'search';
	static PAGE_MYOFFERS 	= 'myoffers';
	static PAGE_MYBOOKING 	= 'mybooking';
	static PAGE_DEPOSIT	= 'deposit';
	static PAGE_WITHDRAW	= 'withdraw';
	static PAGE_CONTACT_US	= 'contact_us';
	static PAGE_TOU 	= 'tou';
	static PAGE_NAV 	= 'nav';
	static PAGE_MAP 	= 'map';

	static EMAIL_PATTERN = String.raw`^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]{1,30}\.){1,4}([a-zA-Z]{2,5})$` ;

	static MAX_PRICE 	= 0.2 	;
	static MAX_PRICE_RIDER 	= 0.24 	;
	static MAX_SEATS 	= 6	;



	static ERROR_NO_SESSION 	= {"error": "#201808181958 no session"} ;
	static ERROR_NOT_SIGNED_IN 	= {"error": "#201808181957 not signed in"} ;
	static ERROR_NO_ROUTE 		= 'no route' ;

	static KEY_FORM_SEARCH	= 'form_search';
	static KEY_FORM_TRIP	= 'form_trip';
	static KEY_MYOFFERS	= 'form_myoffers';
	static KEY_MYBOOKING	= 'form_mybooking';

        static TODAY() { return new Date().toJSON().slice(0,10) } ; // today is in the form of 2018-09-11


	constructor (){} 
}
