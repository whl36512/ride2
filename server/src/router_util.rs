//use iron::prelude::*;
use iron;
use iron::prelude::*;

use iron::request::Request;
use iron::request::Body;
use iron::response::Response;
use iron::IronResult;
use router::Router;
use params::{Params, Value, Map} ;
use std::io::Read;
use pg_middleware::{PostgresMiddleware, PostgresReqExt};

use db;
use tables;
use reqres;


//use url::Url;

//use linkedin::{linkedin_callback, linkedin_authcode};
//use reqres::{RideRequest};


// url::form_urlencoded::parse()
//
pub fn router_setup() -> iron::Chain  {
    use linkedin::Auth_msg ;
    use util ;
    let mut router = Router::new();
    router.get("/linkedin/callback", Auth_msg::linkedin_callback, "callback");
    router.post("/linkedin/callback", Auth_msg::linkedin_callback, "callback");
    router.post("/:page", post_page, "pageroute");
    router.post("/echo", echo, "echo");
    router.get("/echo", echo, "echo");
    router.post("/tables/get_user", get_user, "get_user");
    router.get("/redirect", redi, "redi");
    router.post("/get_session", get_session, "get_session");

    let mut chain = iron::Chain::new(router);
    return chain ;
}

//router function signture
//for<'r, 's, 't0> fn(&'r mut iron::Request<'s, 't0>) -> _

pub fn get_user(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((iron::status::Ok, "Got page")))
}

pub fn get_session (req : &mut Request) -> IronResult<Response> {
    //user 3party auth info comes in a json payload
    let params_json=reqres::params_to_json(req);
    debug!(" 201808121053 get_session() req=\n{:?}", params_json) ;
    let user = tables::Usr::from_js_string ( & params_json) ;

    let db_conn= req.db_conn() ;
    //let user_vec= db::runsql_conn (&db_conn, "select row_to_json(a) from usr a where a.oauth_id=$1", &[&user.oauth_id]) ;
    let user_vec= db::runsql_conn (&db_conn, "select row_to_json(a) from funcs.updateusr($1) a ", &[&user.to_string()]) ;
    debug!(" 201808121053 get_session() user_vec=\n{:?}", user_vec) ;

    match user_vec.len()   {
        1       => { 
            Ok(Response::with((iron::status::Ok, user_vec[0].to_string() ))) 
            }
        size    => {
            error!(" 201808111630 user select returned {} rows ", size) ;
            Ok(Response::with((iron::status::NotFound, format!("User not found. size={}",size))))
        }
    }
}


fn llinkedin_callback (request: & mut Request ) -> IronResult<Response> 
{
    debug!("linkedin_callback request= {:?}", request) ;
    //let rideRequest = RideRequest{req: request} ;
    //let map : & Map = request.get_ref::<Params>().unwrap();
    //debug!("201808081844 linkedin_callback map= {:?}", map) ;
    let mut buffer = String::new();
    request.body.read_to_string(& mut buffer);
    debug!("201808081844 linkedin_callback body= {:?}", buffer) ;

    Ok(Response::with((iron::status::Ok, "Got page")))
}

pub fn echo(request: &mut Request) -> IronResult<Response> {
    let request_dump  = format!("201808100834 request_dump =\n{:?}", request);
    debug!("201808101134 request_dump= {:?}", request_dump) ;
    Ok(Response::with((iron::status::Ok, request_dump)))
}

pub fn post_page(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((iron::status::Ok, "Posted page")))
}

pub fn redi(_: &mut Request) -> IronResult<Response> {
    use iron::modifiers::Redirect;
    use iron::{status, Url};

    let url = Url::parse("http://rideshare.beegrove.com:4200").unwrap();
    Ok(Response::with((status::TemporaryRedirect, Redirect(url.clone()))))
}

pub fn response_printer(_req: &mut Request, res: Response) -> IronResult<Response> {
    debug!("Response produced: {}", res );
    Ok(res)
}

pub fn router_start(http_port : u32) 
{
    let port        ="5432";
    let host        ="10.0.0.111" ; 
    let user        ="ride"    ;
    let passwd      ="ride" ;
    let database    ="ride" ;
    //let url="postgres://user:pass@host:port/database?arg1=val1&arg2=val2"
    let url =format!("postgres://{}:{}@{}:{}/{}", user, passwd, host, port, database) ;
    let mut chain = router_setup() ;
    let pg_middleware = PostgresMiddleware::new(&url, 5);
    trace!("201808121031 pg_middleware result= \n{:?}", pg_middleware) ;
    let pg_middleware = pg_middleware.unwrap();
    trace!("201808121030 pg_middleware= \n{:?}", pg_middleware) ;
    chain.link_before(pg_middleware);
    chain.link_after(response_printer);
    iron::Iron::new(chain).http(format!("0.0.0.0:{}", http_port)).unwrap();
}

pub fn test() {

    router_start(4201);
}

