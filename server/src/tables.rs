use rustc_serialize::json::Json;
use r2d2::{Pool};
use r2d2_postgres::{TlsMode, PostgresConnectionManager};
type PoolType = Pool<PostgresConnectionManager> ;


#[derive(Debug)]
#[derive(Serialize, Deserialize)]
pub struct Usr {
    pub usr_id              : Option<String>
    , pub first_name        : Option<String>
    , pub last_name         : Option<String>
    , pub headline          : Option<String>
    , pub email             : Option<String>
    , pub bank_email        : Option<String>
    , pub member_since      : Option<String>
    , pub trips_posted      : Option<i8>
    , pub trips_completed   : Option<i8>
    , pub rating            : Option<f64>
    , pub balance           : Option<f64>
    , pub oauth_id          : Option<String>
    , pub oauth_host        : Option<String>
    , pub deposit_id        : Option<String>
    , pub c_ts              : Option<String>
    , pub m_ts              : Option<String>
}

impl Usr {
    pub fn from_js_string (js: & String) -> Self
    {
        use serde_json::{ from_str}  ;
        trace!("201808051805 Usr.from_js_string js = {}", js) ;
        let obj: Usr = from_str(& js).unwrap() ;
        obj
    }

    pub fn from_js (js: & Json) -> Self
    {
        use serde_json::{ from_str}  ;

        let js_string= js.to_string() ;
        let obj: Usr= Usr::from_js_string(&js_string);
        obj
    }

    pub fn  from_js_vec <'a> (js_vec: & Vec<Json>) ->  Vec<Self>
    {
        let mut objs : Vec<Usr>  = Vec::new();
        trace!("201808051804 Usr.objs_from_js_vec js_vec.len() = {}", js_vec.len()) ;
        for js in js_vec  {
            let obj: Usr = Usr::from_js(js) ;
            trace!("201808051806 obj = {:?}", obj) ;   
            objs.push(obj) ;
        }
        return objs;
    }

    pub fn to_string(&self) -> String
    {
        //return a json string
        use serde_json::{ to_string}  ;
        to_string(&self).unwrap()
    }
}

//parse json data into struct
//let p: Person = serde_json::from_str(data)?;
//
pub fn test () ->   Vec<Usr> {
    use db::test ;
    let js_vec= test();
    let objs : Vec<Usr> = Usr::from_js_vec(&js_vec) ;
    for obj in &objs {
        info!("201808061234 test() obj = {:?}" , obj) ;
        info!("201808081230 obj.to_string= {}" , obj.to_string() ) ;
    }
    return objs;
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
