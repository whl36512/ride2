#[macro_use] extern crate log;
extern crate simplelog;

#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate serde;
extern crate rustc_serialize;

extern crate r2d2;
extern crate r2d2_postgres;

extern crate iron;
extern crate router;
extern crate params;  // parse get and post to a map
extern crate url;
extern crate hyper;
extern crate hyper_native_tls;
extern crate json;
//extern crate reqwest;

pub mod db;
pub mod util;
pub mod tables;
pub mod reqres;
pub mod linkedin;
pub mod router_util;




