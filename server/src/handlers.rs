//use reqres :: SessionKey;
use iron::status;
use reqres::RideRequest;
//use reqres::RequestComponent;
use db;
use iron::request::Request;
use iron::response::Response;
use iron::IronResult;
use iron::headers::ContentType;
use pg_middleware::PostgresReqExt;
//use rustc_serialize::json::Json;
use serde_json;
//use json;


use tables::Usr ;
use tables::Trip ;
use token::JwtToken;
use token;
use reqres::SecurityStatus;
use constants;

type Json = serde_json::Value;

pub fn request_sql(req: & mut Request, sql : &str, expected_rows: u32) -> IronResult<Response> {
    // user_from_session and user_from_cookie must match
    let request_component = req.inspect();
    let db_conn= req.db_conn() ;

    if  expected_rows == 1 {
	let row : Option<Json> 
         = db::runsql_one_row (
		&db_conn
                , sql
            	, &[&request_component.params.to_string(),  &request_component.user_from_token_string ]) ; 
    	return Ok(Response::with((status::Ok, serde_json::to_string(&row.unwrap()).unwrap()))) ;
    }
    else {
    	let rows :Vec<Json>  
        	= db::runsql_conn (&db_conn
            	, sql 
            	, &[&request_component.params.to_string(),  &request_component.user_from_token_string ], 2) ; 
    	return Ok(Response::with((status::Ok, serde_json::to_string(&rows).unwrap()))) ;
    }
}

pub fn get_session (req : &mut Request) -> IronResult<Response> {
    //user 3party auth info comes in a json payload
    let request_component = req.inspect();
    
    let db_conn= req.db_conn() ;
    let response = match request_component.user_from_cookie {
        Some(user)  => {
            let user_json_from_db: Option<Json>  
                = db::runsql_one_row (&db_conn
                                      , constants::SQL_UPD_USER
                                      , &[&user.to_string(), &constants::EMPTY_JSON_STRING.to_string() ]) ; //user_vec is an Option
            debug!(" 201808121053 get_session() user_json_from_db=\n{:?}", user_json_from_db) ;
            let user_from_db = Usr::from_js(& user_json_from_db);
            //req.set_session(user_from_db); 
            let token = token::Token { jwt: user_from_db.unwrap().to_jwt(constants::SECRET.as_ref()) };
            debug!("201808171508 get_session() token = {}", serde_json::to_string_pretty(&token).unwrap());



            let mut response= Response::with((status::Ok, format!("{}" ,serde_json::to_string_pretty(&token).unwrap()  ) )) ;
            //response.headers.set(ContentType::plaintext());
            response.headers.set(ContentType::json());
            //response.headers.set(ContentType::html());
            //response.headers.set(ContentType::form_url_encoded());
            response
        }
        None        => {
            //req.set_session(None); //clear session
            let response= Response::with((status::NotFound, r#"{"jwt": ""}"# )) ;
            response
        }
    } ;
    Ok(response) 
}

pub fn get_user(req: &mut Request) -> IronResult<Response> {
	request_sql(req, constants::SQL_UPD_USER, 1)
}
/*
pub fn get_user(req: &mut Request) -> IronResult<Response> {
    // user_from_session and user_from_cookie must match
    let request_component = req.inspect();
    let status = request_component.security_status();
    let db_conn= req.db_conn() ;
    let response= match status {
        SecurityStatus::SignedIn => {
            let user_json_from_db: Option<Json>  
                = db::runsql_one_row (&db_conn
                                      , "select row_to_json(a) from funcs.updateusr($1) a "
                                      , &[&request_component.user_from_cookie.unwrap().to_string()]) ; 
            let user_from_db = Usr::from_js(& user_json_from_db);

            let mut response= Response::with((status::Ok, format!("{}" ,serde_json::to_string_pretty(&user_from_db).unwrap() ) )) ;
            response
        },
        _                       => {
            let mut response = Response::with((status::Unauthorized, constants::ERROR_NOT_SIGNED_IN ));
            response
        },
    } ;
    Ok(response)
}
*/

pub fn upd_trip(req: &mut Request) -> IronResult<Response> {
    // user_from_session and user_from_cookie must match
    let request_component = req.inspect();
    let status = request_component.security_status();
    let db_conn= req.db_conn() ;

    if status  != SecurityStatus::SignedIn {  return Ok(Response::with((status::Unauthorized, constants::ERROR_NOT_SIGNED_IN ))) } 

    let trip_from_param = validate_trip(&request_component.params);

    if trip_from_param == None { return Ok(Response::with((status::NotAcceptable, constants::ERROR_TRIP_VALIDATION)))}
    let trip_from_db_json: Option<Json>  
        = db::runsql_one_row (&db_conn
            , "select row_to_json(a) from funcs.upd_trip($1, $2) a "
            , &[&trip_from_param.unwrap().to_string(), &request_component.user_from_token_string]) ;  //params has trip and user info
    if trip_from_db_json == None { return Ok(Response::with((status::NotFound, constants::ERROR_ROW_NOT_FOUND)))} 
    return Ok(Response::with((status::Ok, trip_from_db_json.unwrap().to_string()))) ;
}

pub fn search(req: &mut Request) -> IronResult<Response> {
	request_sql(req, constants::SQL_SEARCH, 2)
}
pub fn activity(req: &mut Request) -> IronResult<Response> {
	request_sql(req, constants::SQL_ACTIVITY, 2)
}
pub fn myoffers(req: &mut Request) -> IronResult<Response> {
	request_sql(req, constants::SQL_MYOFFER, 2)
}
pub fn upd_journey(req: &mut Request) -> IronResult<Response> {
	request_sql(req, constants::SQL_UPD_JOURNEY, 1)
}

pub fn book(req: &mut Request) -> IronResult<Response> {
	request_sql(req, constants::SQL_BOOK, 1)
}

pub fn mybooking(req: &mut Request) -> IronResult<Response> {
	request_sql(req, constants::SQL_MYBOOKING, 2)
}

pub fn cancel_booking(req: &mut Request) -> IronResult<Response> {
	request_sql(req, constants::SQL_CANCEL_BOOKING, 1)
}
pub fn finish(req: &mut Request) -> IronResult<Response> {
	request_sql(req, constants::SQL_FINISH, 1)
}
pub fn confirm(req: &mut Request) -> IronResult<Response> {
	request_sql(req, constants::SQL_CONFIRM, 1)
}
pub fn reject(req: &mut Request) -> IronResult<Response> {
	request_sql(req, constants::SQL_REJECT, 1)
}

pub fn echo(request: &mut Request) -> IronResult<Response> {
    let request_dump  = format!("{:?}", request);
    debug!("201808101134 request_dump=\n{}", request_dump) ;
    Ok(Response::with((status::Ok, request_dump)))
}

pub fn post_page(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((status::Ok, "{'page':'not found'}")))
}

pub fn redi(_: &mut Request) -> IronResult<Response> {
    use iron::modifiers::Redirect;
    use iron::{status, Url};

    let url = Url::parse("http://rideshare.beegrove.com:4200").unwrap();
    Ok(Response::with((status::TemporaryRedirect, Redirect(url.clone()))))
}

pub fn validate_trip(params: & String) -> Option<Trip> {
    let trip_from_params : Trip = Trip::from_js_string(&Some(params.to_string())).expect(&format!("ERROR 201809091848 Unable to get Trip from params. params={}", params)) ;
    if       trip_from_params.start_loc == None {return None}
    else if  trip_from_params.start_lat == None {return None}
    else if  trip_from_params.start_lon == None {return None}
    else if  trip_from_params.start_display_name == None {return None}
    else if  trip_from_params.end_loc == None {return None} 
    else if  trip_from_params.end_lat == None {return None}
    else if  trip_from_params.end_lon == None {return None}
    else if  trip_from_params.end_display_name == None {return None}
    else if  trip_from_params.start_date == None {return None}
    else if  trip_from_params.departure_time == None {return None}
    else if  trip_from_params.distance == None {return None}
    else if  trip_from_params.price == None {return None}
    else if  trip_from_params.price.unwrap()  < 0f64   {return None}
    else if  trip_from_params.price.unwrap()  > 0.20 {return None}
    else if  trip_from_params.price == None {return None}
    else if  trip_from_params.seats == None {return None}
    else if  trip_from_params.seats.unwrap() > 6     {return None}
    else if  trip_from_params.seats.unwrap() < 1     {return None}
    else if  trip_from_params.recur_ind == None {return None}
    else if  trip_from_params.day0_ind == None {return None}
    else if  trip_from_params.day1_ind == None {return None}
    else if  trip_from_params.day2_ind == None {return None}
    else if  trip_from_params.day3_ind == None {return None}
    else if  trip_from_params.day4_ind == None {return None}
    else if  trip_from_params.day5_ind == None {return None}
    else if  trip_from_params.day6_ind == None {return None}
    else if  trip_from_params.recur_ind.unwrap() == true 
        && trip_from_params.day0_ind.unwrap() == false
        && trip_from_params.day1_ind.unwrap() == false
        && trip_from_params.day2_ind.unwrap() == false
        && trip_from_params.day3_ind.unwrap() == false
        && trip_from_params.day4_ind.unwrap() == false
        && trip_from_params.day5_ind.unwrap() == false
        && trip_from_params.day6_ind.unwrap() == false {return None}
    else if  trip_from_params.recur_ind.unwrap() == true 
        && trip_from_params.end_date == None {return None}
    //else if  trip_from_params.recur_ind.unwrap() == true
        //&& trip_from_params.end_date.unwrap() <= trip_from_params.start_date.unwrap() {return None}
    // also need to check end_date is not 92 after start_date
    // also need to check start_date is not in the past
    ;
    return Some(trip_from_params);
}
