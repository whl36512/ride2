use iron::request::Request ;

pub fn params_to_json (request: & mut Request ) -> String
{
    use params::{Params, Value};
    use iron::prelude::*;
    use json ;
    let map = request.get_ref::<Params>().unwrap();
    trace!("20180809  map = {:?}", map) ;
    let json_string = format!("{:?}", map) ;  // dumping of BtreeMap happens to be a json string
    trace!("20180809  json_string = {}", json_string) ;
    json_string
}

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
