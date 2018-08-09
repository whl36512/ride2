use rustc_serialize::json::Json;
use r2d2::{Pool};
use r2d2_postgres::{TlsMode, PostgresConnectionManager};
type PoolType = Pool<PostgresConnectionManager> ;


#[derive(Debug)]
#[derive(Serialize, Deserialize)]
pub struct Usr {
    usr_id              : Option<String>
    , first_name        : Option<String>
    , last_name         : Option<String>
    , headline          : Option<String>
    , email             : Option<String>
    , bank_email        : Option<String>
    , member_since      : Option<String>
    , trips_posted      : Option<i8>
    , trips_completed   : Option<i8>
    , rating            : Option<f64>
    , balance           : Option<f64>
    , oauth_id          : Option<String>
    , oauth_host        : Option<String>
    , deposit_id        : Option<String>
    , c_ts              : Option<String>
    , m_ts              : Option<String>
}

impl Usr {
    fn from_js (js: & Json) -> Usr
    {
        use serde_json::{ from_str}  ;
        trace!("201808051805 Usr.from_js js = {}", js) ;
        let obj: Usr = from_str(& js.to_string()).unwrap() ;
        obj
    }

    fn  from_js_vec <'a> (js_vec: & Vec<Json>) ->  Vec<Usr>
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

    fn to_string(&self) -> String
    {
        //return a json string
        use serde_json::{ to_string}  ;
        to_string(&self).unwrap()
    }

/*
    fn get_user(pool: PoolType, user: String) () {
        runsql(pool 
            , "select row_to_json(a) from usr a where usr_id=$1"
            , &[&user_id]
            )
    }
    fn save_user(pool: PoolType, user_id: String)  {

        runsql(pool, 
            , "select row_to_json(a) from funcs.updateusr( a where usr_id=$1"
            , &[&user_id]
        )
            ()
    }
    */
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
