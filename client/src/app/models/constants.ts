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

	static USER_PAGE 	= 'user';
	static TRIP_PAGE 	= 'trip';
	static SEARCH_PAGE 	= 'search';
	static MYTRIPS_PAGE 	= 'mytrips';
	static MY_BOOKINGS_PAGE = 'mybookings';
	static DEPOSIT_PAGE 	= 'deposit';
	static WITHDRAW_PAGE 	= 'withdraw';
	static CONTACT_US_PAGE 	= 'contact_us';
	static TOU_PAGE 	= 'tou';

	static EMAIL_PATTERN = String.raw`^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]{1,30}\.){1,4}([a-zA-Z]{2,5})$` ;

	static MAX_PRICE 	= 0.2 	;
	static MAX_SEATS 	= 6	;



	static ERROR_NO_SESSION 	= {"error": "#201808181958 no session"} ;
	static ERROR_NOT_SIGNED_IN 	= {"error": "#201808181957 not signed in"} ;

	constructor (){} 
}
