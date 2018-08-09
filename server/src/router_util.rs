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

//use url::Url;

//use linkedin::{linkedin_callback, linkedin_authcode};
//use reqres::{RideRequest};


// url::form_urlencoded::parse()

pub fn router_setup() -> iron::Chain  {
    let mut router = Router::new();
    router.get("/linkedin/callback", linkedin_callback, "callback");
    router.post("/linkedin/callback", linkedin_callback, "callback");
    router.post("/:page", post_page, "pageroute");
    router.post("/tables/get_user", get_user, "get_user");

    let mut chain = iron::Chain::new(router);
    return chain ;
}

//router function signture
//for<'r, 's, 't0> fn(&'r mut iron::Request<'s, 't0>) -> _

pub fn get_user(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((iron::status::Ok, "Got page")))
}

fn linkedin_callback (request: & mut Request ) -> IronResult<Response> 
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

pub fn post_page(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((iron::status::Ok, "Posted page")))
}

pub fn response_printer(_req: &mut Request, res: Response) -> IronResult<Response> {
    info!("Response produced: {}", res );
    Ok(res)
}

pub fn router_start(port : u32)
{
   let mut chain = router_setup() ;
   chain.link_after(response_printer);
   iron::Iron::new(chain).http(format!("0.0.0.0:{}", port)).unwrap();
}



pub fn test() {
    router_start(4201);
}
