use rustc_serialize::json::Json;
use constants ;
use token::TokenOption;
use token::JwtToken;
use serde_json ;

#[derive(Debug)]
#[derive(PartialEq)]
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
//    pub fn from_js_string (js: Option<String>) -> Option<Self>
//    {
//        use serde_json::{ from_str}  ;
//        trace!("201808051805 Usr.from_js_string js = {:?}", js) ;
//        match js {
//            None => return None,
//            Some(u) => {
//                let user :Usr= from_str(&u).unwrap(); 
//                return Some(user) ;
//            },
//        };
//    }

    pub fn from_js_string (js: & Option<String>) -> Option<Self>
    {
        use serde_json::{ from_str}  ;
        trace!("201808051805 Usr.from_js_string js = {:?}", js) ;
        match js {
            None => return None,
            Some(u) => {
                let user :Usr= from_str(&u).unwrap(); 
                return Some(user) ;
            },
        };
    }

//    pub fn from_js (js: Option<Json>) -> Option<Self>
//    {
//        //use serde_json::from_str  ;
//        let js_string=js.map(|j| j.to_string())  ;
//        let user= Usr::from_js_string( js_string) ;
//        user
//    }
    pub fn from_js (js: & Option<Json>) -> Option<Self>
    {
        //use serde_json::from_str  ;
        let js_string=js.as_ref().map(|j| j.to_string())  ;
        let user= Usr::from_js_string( & js_string) ;
        user
    }

    /*
      pub fn  from_js_vec <'a> (js_vec: & Option <Vec<Json>>) ->  Option<Vec<Self>>
    {
        let objs = js_vec.and_then(|vec: Vec<Json> | Some(vec.iter().map(|js: &Json| Usr::from_js(js)).collect::<Vec<_>>())) ;
        //let mut objs : Vec<Usr>  = Vec::new();
        //trace!("201808051804 Usr.objs_from_js_vec js_vec.len() = {}", js_vec.len()) ;
        //for js in js_vec  {
            //let obj: Usr = Usr::from_js(js) ;
            //trace!("201808051806 obj = {:?}", obj) ;   
            //objs.push(obj) ;
        //}
        return objs;
    }
    */

    pub fn to_string(&self) -> String
    {
        //return a json string
        use serde_json::{ to_string}  ;
        to_string(&self).unwrap()
    }
    
    pub fn from_token(params: & String) ->  Option<Usr>
    {
        let token : TokenOption = serde_json::from_str(params).unwrap();
        let user = match token.jwt {
            Some(jwt)   => Some(Usr::from_jwt(&jwt, constants::SECRET.as_ref())),
            None        => None
        };
        user
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
