extern crate serde_json;
extern crate server;

use server::util ;
use server::router_util ;



fn main() {
    util::logger_init();
    router_util::router_start(4201);
}

