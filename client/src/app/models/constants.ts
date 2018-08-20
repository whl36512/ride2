export class Constants{
	static GET	 	= 'GET';
	static POST	 	= 'POST';

	static PROFILE		= "profile" ;
	static JWT    		= "jwt"
	static SERVER_PORT  	= "4201"

	static GET_USER_URL 	= '/get_user';
	static SAVE_USER_URL 	= '/save_user';
	static GET_TRIP_URL 	= '/get_trip';

	static NO_SESSION_ERROR 	= {"error": "#201808181958 no session"} ;
	static NOT_SIGNED_IN_ERROR 	= {"error": "#201808181957 not signed in"} ;

	constructor (){} 
}
