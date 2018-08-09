extern crate serde_json;
extern crate server;

use server::util ;
use server::db ;
use server::tables ;
use server::router_util ;

fn main() {
    util::logger_init();

    let _json_results = db::test() ;
    let _users = tables::test() ;
    router_util::test()

}

