//use iron::prelude::*;
use iron;

use iron::request::Request;
//use iron::request::Body;
use iron::response::Response;
use iron::IronResult;
use router::Router;
//use params::{Params, Value, Map} ;
//use std::io::Read;
use pg_middleware::PostgresMiddleware ;
//use pg_middleware::PostgresReqExt ;
//

use std::collections::HashSet;
use iron_cors::CorsMiddleware;

use iron::headers::{ AccessControlExposeHeaders };
use iron::headers::{ AccessControlAllowCredentials };
use iron::middleware::AfterMiddleware;
use unicase::UniCase;


//use db;
//use tables;
//use reqres;
use handlers;
use constants;


//use url::Url;

//use linkedin::{linkedin_callback, linkedin_authcode};


// url::form_urlencoded::parse()
//
pub fn router_setup() -> iron::Chain  {
    //use linkedin::Auth_msg ;
    //use util ;
    let mut router = Router::new();
//    router.get("/linkedin/callback", Auth_msg::linkedin_callback, "callback");
//    router.post("/linkedin/callback", Auth_msg::linkedin_callback, "callback");
    router.post("/:page", handlers::post_page, "pageroute");
    router.post("/echo", handlers::echo, "echo");
    router.get("/echo", handlers::echo, "echo");
    router.post("/get_user", handlers::get_user, "get_user");
    router.get("/redirect", handlers::redi, "redi");
    router.post("/get_session", handlers::get_session, "get_session");
    router.post("/upd_trip", handlers::upd_trip, "upd_trip");
    router.post("/search", handlers::search, "search");
    router.post("/search_all", handlers::search_all, "search_all");
    router.post("/book", handlers::book, "book");
    router.post("/activity", handlers::activity, "activity");
    router.post("/myoffers", handlers::myoffers, "myoffers");
    router.post("/upd_journey", handlers::upd_journey, "upd_journey");
    router.post("/mybooking", handlers::mybooking, "mybooking");
    router.post("/cancel_booking", handlers::cancel_booking, "cancel_booking");
    router.post("/finish", handlers::finish, "finish");
    router.post("/reject", handlers::reject, "reject");
    router.post("/confirm", handlers::confirm, "confirm");
    router.post("/msgs", handlers::msgs, "msgs");
    router.post("/save_msg", handlers::save_msg, "save_msg");
    router.post("/withdraw", handlers::withdraw, "withdraw");
    router.post("/thist", handlers::thist, "thist");

    let chain = iron::Chain::new(router);
    return chain ;
}

pub fn response_printer(_req: &mut Request, res: Response) -> IronResult<Response> {
    debug!("Response produced: {}", res );
    Ok(res)
}

pub fn router_start(http_port : u32) 
{
    //let url="postgres://user:pass@host:port/database?arg1=val1&arg2=val2"
    let url =format!("postgres://{}:{}@{}:{}/{}", constants::PG_USER, constants::PG_PASSWD, constants::PG_HOST, constants::PG_PORT, constants::PG_DATABASE) ;
    let mut chain = router_setup() ;

    let pg_middleware = PostgresMiddleware::new(&url, 5);
    trace!("201808121031 pg_middleware result= \n{:?}", pg_middleware) ;
    let pg_middleware = pg_middleware.unwrap();
    trace!("201808121030 pg_middleware= \n{:?}", pg_middleware) ;

//    let session_middleware = reqres::session_middleware(*b"01234567012345670123456701234567");

    let allowed_hosts = constants::CORS_ALLOWED_HOSTS.iter() .map(ToString::to_string) .collect::<HashSet<_>>();
    let cors_middleware = CorsMiddleware::with_whitelist(allowed_hosts);

    let my_cors_middleware = MyCorsMiddleware ;

    chain.link_before(pg_middleware);
    chain.link_around(cors_middleware);
//    chain.link_around(session_middleware);
    chain.link_after(my_cors_middleware);
    chain.link_after(response_printer);
    iron::Iron::new(chain).http(format!("0.0.0.0:{}", http_port)).unwrap();
}

struct MyCorsMiddleware;

impl AfterMiddleware for MyCorsMiddleware {
    fn after(&self, _req: &mut Request, mut res: Response) -> IronResult<Response> {
        //res.headers.set(hyper::header::AccessControlAllowOrigin::Any);
        res.headers.set(AccessControlAllowCredentials) ;
        res.headers.set( AccessControlExposeHeaders(vec![ UniCase("Set-Cookie".to_owned()), UniCase("content-length".to_owned()) ]) );
        Ok(res)
    }
}

pub fn test() {

    router_start(4201);
}

