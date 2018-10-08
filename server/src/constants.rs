pub static EMPTY_STRING : &str ="" ;
pub static EMPTY_JSON_STRING : &str ="{}" ;

pub static SECRET	: &str ="an ultra secretstr" ;

pub static ERROR_ROW_NOT_FOUND: &str = r##"{"error":"row not found"}"## ;
pub static ERROR_NOT_SIGNED_IN: &str = r##"{"error":"not signed in"}"## ;
pub static ERROR_TRIP_VALIDATION: &str = r##"{"error":"trip validation failed"}"## ;

pub static PG_PORT 	: &str ="5432";
pub static PG_HOST 	: &str ="10.1.0.110" ;
pub static PG_USER 	: &str ="ride"    ;
pub static PG_PASSWD 	: &str ="ride" ;
pub static PG_DATABASE 	: &str ="ride" ;


pub static SQL_MYOFFER 	: &str =  "select a from funcs.myoffers($1, $2) a " ;
pub static SQL_SEARCH 	: &str =  "select a from funcs.search($1, $2) a " ;

pub static CORS_ALLOWED_HOSTS : [&str; 9] 
	= [
		"http://rideshare.beegrove.com:4200", "rideshare.beegrove.com:4200", "rideshare.beegrove.com"
		, "http://10.1.0.110:4200", "10.1.0.110:4200", "10.1.0.110"
		, "http://10.0.0.110:4200", "10.0.0.110:4200", "10.0.0.110"
	] ;




