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
use rustc_serialize::json::Json;
use serde_json;


use tables::Usr ;
use token::JwtToken;
use token;

static SECRET : &str ="an ultra secretstr" ;

pub fn get_session (req : &mut Request) -> IronResult<Response> {
    //user 3party auth info comes in a json payload
    let request_component = req.inspect();
    
    let db_conn= req.db_conn() ;
    let response = match request_component.user_from_cookie {
        Some(user)  => {
            let user_json_from_db: Option<Json>  
                = db::runsql_one_row (&db_conn
                                      , "select row_to_json(a) from funcs.updateusr($1) a "
                                      , &[&user.to_string()]) ; //user_vec is an Option
            debug!(" 201808121053 get_session() user_json_from_db=\n{:?}", user_json_from_db) ;
            let user_from_db = Usr::from_js(& user_json_from_db);
            //req.set_session(user_from_db); 
            let token = token::Token { jwt: user_from_db.unwrap().to_jwt(SECRET.as_ref()) };
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

pub fn get_user(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((status::Ok, "Got page")))
}

pub fn echo(request: &mut Request) -> IronResult<Response> {
    let request_dump  = format!("201808100834 request_dump =\n{:?}", request);
    debug!("201808101134 request_dump= {:?}", request_dump) ;
    Ok(Response::with((status::Ok, request_dump)))
}

pub fn post_page(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((status::Ok, "Posted page")))
}

pub fn redi(_: &mut Request) -> IronResult<Response> {
    use iron::modifiers::Redirect;
    use iron::{status, Url};

    let url = Url::parse("http://rideshare.beegrove.com:4200").unwrap();
    Ok(Response::with((status::TemporaryRedirect, Redirect(url.clone()))))
}