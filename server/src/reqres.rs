use iron::prelude::*;
use iron::request::Request ;
//use iron::status;
use std::collections::HashMap;
use params::{Params, Value, Map} ;

/*
pub struct RideRequest < 's, 'l : 's >  {
    // let rideRquest = RideRequest { req: req} ;
    req:  &'s mut Request <'s, 'l> 
}


impl < 's, 'l: 's > RideRequest < 's, 'l> {
    /*
    pub fn new (req: &'r mut Request<'b, 'c>) -> RideRequest<'b, 'c>
    {
        let r = RideRequest { req} ; // using field init shorthand
        r
    }
    */

    pub fn get_params(& mut self)   -> & Map {

        //let mut stringMap : HashMap<String, String> = HashMap::new();
        let map: &Map  =  self.req.get_ref::<Params>().unwrap();
        /*
           for (k,v) in map.iter() {
            match (k,v) {
            (k, Value::String( v)) => stringMap.insert( *k , * v) ,
            _   => error!("201808062156 What type {:?}", v) ,
            }
        }
        */
        info!("201808062156 get_params map={:?}", map)  ;
        map
    }
}
*/


/*
 fn set_greeting(request: &mut Request) -> IronResult<Response> {
             let mut payload = String::new();
                     request.body.read_to_string(&mut payload).unwrap();
                             let request: Greeting = json::decode(&payload).unwrap();
                                     let greeting = Greeting { msg: request.msg };
                                             let payload = json::encode(&greeting).unwrap();
                                                     Ok(Response::with((status::Ok, payload)))
                                                             }

                                                             */
