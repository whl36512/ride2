use iron::request::Request ;
use typemap;
use secure_session::middleware::{SessionMiddleware, SessionConfig};
use secure_session::session::ChaCha20Poly1305SessionManager;
use tables::Usr;

#[derive(Debug)]
#[derive(Serialize, Deserialize)]
pub struct Session {
        usr_id: String,
        oauth_id: String ,
        email: Option<String> ,
}

impl Session {
    pub fn to_string(&self) -> String
    {
        //return a json string
        use serde_json::{ to_string}  ;
        to_string(&self).unwrap()
    }
}

pub struct SessionKey {}

impl typemap::Key for SessionKey {
        type Value = Session;
}

pub fn session_middleware (key: [u8; 32]) -> SessionMiddleware<Session, SessionKey, ChaCha20Poly1305SessionManager<Session>> 
{

    //use iron::AroundMiddleware;
    //use iron::prelude::*;

    //let key = *b"01234567012345670123456701234567";
    let manager = ChaCha20Poly1305SessionManager::<Session>::from_key(key);
    let config = SessionConfig::default();
    let middleware = SessionMiddleware::<Session, SessionKey, ChaCha20Poly1305SessionManager<Session>>::new( manager, config);

    middleware
}

pub struct RequestComponent {
    pub params: String,             // in json
    pub user_from_session: Option<Usr> ,
    pub user_from_cookie: Option<Usr>,
}

pub trait RideRequest {
    fn get_session(&mut self) -> Option<Usr> ;
    fn set_session(&mut self, user: Option<Usr>) ;
    fn inspect(& mut self) -> RequestComponent;
    fn params_to_json (& mut self ) -> String ;
}

impl<'a, 'b> RideRequest for Request<'a, 'b> {
    fn get_session(& mut self) -> Option<Usr>
    {
        let session = self.extensions.get::<SessionKey>() ;
        debug!("201808131242 session ={:?}", session) ;
        let user= session.and_then(|s: &Session|Usr::from_js_string(& Some(s.to_string())));
        user
    }

    fn set_session(& mut self, user: Option<Usr>) 
    {
        let _ = self.extensions.remove::<SessionKey>() ;
        match user  {
            Some(user)  => {
                            let session = Session{ usr_id: user.usr_id.unwrap()
                                                , oauth_id: user.oauth_id.unwrap() 
                                                , email: user.email 
                            } ;
                            self.extensions.insert::<SessionKey>(session) ;
            }
            None        => {}
        }
    }


    fn inspect(& mut self) -> RequestComponent
    {
        debug!("201808131424 request ={:?}", self) ;
        let user_from_session = self.get_session();
        debug!("201808131424 user_from_session ={:?}", user_from_session) ;
        let params= self .params_to_json();
        debug!("201808131424 params ={:?}", params) ;
        let user_from_cookie = Usr::from_js_string( & Some(params.clone())) ;
        debug!("201808131424 user_from_cookie ={:?}", user_from_cookie) ;
        let request_c= RequestComponent { params, user_from_session, user_from_cookie} ;
        request_c.security_status();
        request_c
    }

    fn params_to_json (& mut self ) -> String
    {
        use params::Params ;
        //use params::Value;
        use iron::prelude::*;
        //use json ;
        let map = self.get_ref::<Params>().unwrap();
        trace!("20180809  map = {:?}", map) ;
        let json_string = format!("{:?}", map) ;  // dumping of BtreeMap happens to be a json string
        trace!("20180809  json_string = {}", json_string) ;
        json_string
    }
}

#[derive(Debug)]
pub enum SecurityStatus {
    NotSignedIn  ,//"NOT_SIGNED_IN"
    ClientSideSignin  ,//"CLIENT_SIDE_SIGNIN"
    ClientSideSignout ,//"CLIENT_SIDE_SIGNOUT"
    SignedIn,// "SIGNED_IN_COMPLETE_PROFILE"
    ClientSideSigninAsDiffId  ,//"CLIENT_SIDE_SIGNIN_AS_DIFF_ID"
    CaseShouldNeverHappen  ,//"CASE_SHOULD_NEVER_HAPPEN"
    SignedInIncompleteProfile,//"SIGNED_IN_INCOMPLETE_PROFILE"
}

impl RequestComponent {
    fn security_status(& self) -> SecurityStatus 
    {
        //let user_from_session = self.user_from_session.as_ref().unwrap();
        //let oauth_from_session = & user_from_session.oauth_id ;
        let oauth_from_session = self.user_from_session.as_ref().map( |u| &u.oauth_id) ;
        let email_from_session = self.user_from_session.as_ref().map( |u| &u.email   ) ;
        let oauth_from_cookie  = self.user_from_cookie .as_ref().map( |u| &u.oauth_id) ;
        let status = match ( oauth_from_session, oauth_from_cookie, email_from_session) {
            (None    , None     , _        )               => SecurityStatus::NotSignedIn ,
            (None    , Some(_c) , _        )               => SecurityStatus::ClientSideSignin ,
            (Some(_s), None     , _        )               => SecurityStatus::ClientSideSignout ,
            (Some( s), Some( c) , None     ) if (s==c)     => SecurityStatus::SignedInIncompleteProfile ,
            (Some( s), Some( c) , Some(_e) ) if (s==c)     => SecurityStatus::SignedIn,
            (Some( s), Some( c) , _        ) if (s!=c)     => SecurityStatus::ClientSideSigninAsDiffId ,
            _                                              => SecurityStatus::CaseShouldNeverHappen,
        };

        debug!("201808141302 RequestComponent.security_status() status={:?}" , status);
        status
    }
}



