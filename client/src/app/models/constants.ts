export class Constants{
	static GET	 	= 'GET'		;
	static POST	 	= 'POST'	;

	static PROFILE		= "profile" 	;
	static JWT    		= "jwt"		;
	static SERVER_PORT  	= "4201"	;

	static GET_USER_URL 	= '/get_user'	;
	static SAVE_USER_URL 	= '/save_user'	;
	static UPD_TRIP_URL 	= '/upd_trip'	;

	static URL_SAVE_USER 	= '/save_user'	;
	static URL_GET_USER 	= '/get_user'	;
	static URL_UPD_TRIP 	= '/upd_trip'	;
	static URL_SEARCH 	= '/search'	;
	static URL_BOOK 	= '/book'	;
	static URL_ACTIVITY 	= '/activity'	;
	static URL_MYOFFERS 	= '/myoffers'	;
	static URL_MYBOOKING 	= '/mybooking'	;
	static URL_UPD_JOURNEY 	= '/upd_journey';
	static URL_CANCEL_BOOKING = '/cancel_booking'; // cancel by rider
	static URL_FINISH 	= '/finish'	; 
	static URL_CONFIRM 	= '/confirm'	; 
	static URL_REJECT 	= '/reject'	; // reject or cancel by driver
	static URL_MSGS 	= '/msgs'	; 
	static URL_SAVE_MSG 	= '/save_msg'	; 

	static USER_PAGE 	= 'user'	;
	static TRIP_PAGE 	= 'trip'	;
	static SEARCH_PAGE 	= 'search'	;

	static PAGE_USER	= 'user'	;
	static PAGE_TRIP	= 'trip'	;
	static PAGE_SEARCH	= 'search'	;
	static PAGE_ACTIVITY 	= 'activity'	;
	static PAGE_MYOFFERS 	= 'myoffers'	;
	static PAGE_MYBOOKING 	= 'mybooking'	;
	static PAGE_DEPOSIT	= 'deposit'	;
	static PAGE_WITHDRAW	= 'withdraw'	;
	static PAGE_CONTACT_US	= 'contact_us'	;
	static PAGE_TOU 	= 'tou'		;
	static PAGE_NAV 	= 'nav'		;
	static PAGE_MAP 	= 'map'		;

	static EMAIL_PATTERN = String.raw`^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]{1,30}\.){1,4}([a-zA-Z]{2,5})$` ;

	static MAX_PRICE 	= 0.2 	;
	static MAX_PRICE_RIDER 	= 0.24 	;
	static MAX_SEATS 	= 6	;



	static ERROR_NO_SESSION 	= {"error": "#201808181958 no session"} 	;
	static ERROR_NOT_SIGNED_IN 	= {"error": "#201808181957 not signed in"} 	;
	static ERROR_NO_ROUTE 		= 'no route' 					;

	static KEY_FORM_SEARCH	= 'form_search'		;
	static KEY_FORM_TRIP	= 'form_trip'		;
	static KEY_MYOFFERS	= 'form_myoffers'	;
	static KEY_MYBOOKING	= 'form_mybooking'	;
	static KEY_FORM_ACTIVITY= 'form_activity'	;

	static MSG_TIMER_WAIT	= 10000	;   // 10 seconds

	static ICON_ARROW_UP  	= '&#xfe3f;';
 	static ICON_ARROW_DOWN	= '&#xfe40;' ;

 	static EMAIL_DEPOSIT	= 'deposit@beegrove.com' ;

 	static ACTION_FAIL	= 'Action Failed' ;
 	static OK_UPDATE	= 'Updated' ;
 	static OK_NO_CHANGE	= 'No Change' ;

 	static COLOR_RANDOM	= 'random' ;
 	static COLOR_RANDOM_SAME= 'random_same' ;
 	static COLOR_RED	= 'red' ;
 	static COLOR_GREEN	= 'green' ;

	constructor (){} 
        static TODAY() { // TODAY is browser local time
		let utc = new Date();
		let d = new Date(utc.getTime() - utc.getTimezoneOffset() * 60000)
		let s = d.toJSON() ;
		console.debug ( '201810142022 Constants.TODAY()=', s  );

		return s.slice(0,10) ;
	} ; // today is in the form of 2018-09-11

	static to_local_time(date : string) : string {
		let since_epoch = Date.parse(date);
		let utc = new Date();
		
		let d = new Date(since_epoch - utc.getTimezoneOffset() * 60000);
		let s = d.toJSON() ;
		return s;
	}

	static up_to_minutes( date: string) : string {
		let local_time = Constants.to_local_time(date);
		return local_time.slice(0,10) + ' ' + local_time.slice(11,16);	
	}

	static elapsed_time ( date: string) : string {
		let since_epoch = Date.parse(date);
		let utc = new Date();
		let minutes = Math.floor(( utc.getTime() -since_epoch + 10000)/60000);
		
		let days = Math.floor(minutes/60/24) ;
		let hours = Math.floor(minutes % (60*24)/60);
		let minutes2 = minutes % (60);
		let elapsed_time='';
		if (days!=0) { elapsed_time = elapsed_time+ days + ' days ago' ; }
		else if (hours!=0) { elapsed_time = elapsed_time+ hours + ' hr ago'; }
		else if (minutes2!=0) { elapsed_time = elapsed_time+ minutes2 + ' min ago';}
		else { elapsed_time= 'now'; }
		return elapsed_time;
	}

	static stringify(json: any) :string {
		return JSON.stringify(json,null,2);
	}
	
	static convert_trip_to_pair(trip: any): any {
                let p1 ={
                                  lat           : trip.start_lat
                                , lon           : trip.start_lon
                                , display_name  : trip.start_display_name
                                , marker_text   : trip.start_marker_text
                                , icon_type     : trip.start_icon_type
                                , color         : trip.start_color
                        };
                let p2 ={
                                  lat           : trip.end_lat
                                , lon           : trip.end_lon
                                , display_name  : trip.end_display_name
                                , marker_text   : trip.end_marker_text
                                , icon_type     : trip.end_icon_type
                                , color         : trip.end_color
                        };
                return {p1: p1, p2:p2};
        }

	static convert_book_to_pair(book: any): any {
                let p1 ={
                                  lat           : book.pickup_lat
                                , lon           : book.pickup_lon
                                , display_name  : book.pickup_display_name
                                , marker_text   : book.pickup_marker_text
                                , icon_type     : book.pickup_icon_type
                                , color         : book.pickup_color
                        };
                let p2 ={
                                  lat           : book.dropoff_lat
                                , lon           : book.dropoff_lon
                                , display_name  : book.dropoff_display_name
                                , marker_text   : book.dropoff_marker_text
                                , icon_type     : book.dropoff_icon_type
                                , color         : book.dropoff_color
                        };
                return {p1: p1, p2:p2};
        }



}

export class C extends Constants {
	constructor (){
		super();
	}
}
