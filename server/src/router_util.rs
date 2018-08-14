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

//use db;
//use tables;
use reqres;
use handlers;


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
    router.post("/tables/get_user", handlers::get_user, "get_user");
    router.get("/redirect", handlers::redi, "redi");
    router.post("/get_session", handlers::get_session, "get_session");

    let chain = iron::Chain::new(router);
    return chain ;
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
    let session_middleware = reqres::session_middleware(*b"01234567012345670123456701234567");
    trace!("201808121031 pg_middleware result= \n{:?}", pg_middleware) ;
    let pg_middleware = pg_middleware.unwrap();
    trace!("201808121030 pg_middleware= \n{:?}", pg_middleware) ;
    chain.link_before(pg_middleware);
    chain.link_around(session_middleware);
    chain.link_after(response_printer);
    iron::Iron::new(chain).http(format!("0.0.0.0:{}", http_port)).unwrap();
}

pub fn test() {

    router_start(4201);
}

