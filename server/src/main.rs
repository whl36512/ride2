extern crate iron;
extern crate router;
extern crate url;

#[macro_use] extern crate log;
extern crate simplelog;

use iron::prelude::*;
use router::Router;
use url::Url;

use simplelog::*;
use std::fs::File;


// url::form_urlencoded::parse()

fn logger_init () {
  CombinedLogger::init(
    vec![
      TermLogger::new(LevelFilter::Debug, Config::default()).unwrap(),
      WriteLogger::new(LevelFilter::Info, Config::default(), File::create("my_rust_binary.log").unwrap()),
    ]
  ).unwrap();
}

fn router_setup() -> iron::Chain  {
    let mut router = Router::new();
    router.get("/linkedin/callback", linkedin_callback, "callback");
    router.get("/linkedin/authcode", linkedin_authcode, "authcode");
    router.post("/:page", post_page, "pageroute");

    let mut chain = Chain::new(router);
    return chain ;
}

fn linkedin_callback(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((iron::status::Ok, "Got page")))
}

fn linkedin_authcode(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((iron::status::Ok, "Got page")))
}

fn post_page(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((iron::status::Ok, "Posted page")))
}

fn request_printer(_req: &mut Request, res: Response) -> IronResult<Response> {
//    println!("Request receided: {}", _req);
    Ok(res)
}
fn response_printer(_req: &mut Request, res: Response) -> IronResult<Response> {
    info!("Response produced: {}", res );
    Ok(res)
}

fn main() {

    logger_init();
    let mut chain = router_setup() ;
//    chain.link_before(request_printer);
    chain.link_after(response_printer);
    let port= 4201;
    Iron::new(chain).http(format!("localhost:{}", port)).unwrap();
}
