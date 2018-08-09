pub struct auth_msg {
    // query string
    code                : Option<String>   
    , state             : Option<String>
    , error             : Option<String>
    , error_description : Option<String>
    , state             : Option<String>

    // json payload
    , access_token      : Option<String>
    , expires_in        : Option<String>
}

pub struct {

pub struct profile {
    //{
      //"firstName": "Frodo",
      //"headline": "Jewelery Repossession in Middle Earth",
      //"id": "1R2RtA",
      //"lastName": "Baggins",
      //"siteStandardProfileRequest": {
      //"url": "https://www.linkedin.com/profile/view?id=…"
      //}
    
    firstName           : Option<String>
    , headline            : Option<String>
    , id                  : Option<String>
    , lastName            : Option<String>
    , siteStandardProfileRequest : Option<String>
}

impl auth_msg {
    pub fn linkedin_callback
    pub fn get_auth_code(code: String, ) -> auth_msg {
        // POST /oauth/v2/accessToken HTTP/1.1
        // Host: www.linkedin.com
        // Content-Type: application/x-www-form-urlencoded

        // grant_type=authorization_code&code=987654321&redirect_uri=https%3A%2F%2Fwww.myapp.com%2Fauth%2Flinkedin&client_id=123456789&client_secret=shhdonottell
        let redirect_uri    ="http://rideshare.beegrove.com:4200/linkedin/accesstoken" ;
        let client_id       =  "86xvjldqclucd9";
        let client_secret   = "G3ihVrYkqIu0FWWd" ;

        use url::form_urlencoded;
        let encoded: String = form_urlencoded::Serializer::new(String::new())
                .append_pair("grant_type", "authorization_code")
                .append_pair("code", code)
                .append_pair("redirect_uri", redirect_uri)
                .append_pair("client_id", client_id)
                .append_pair("client_secret", client_secret)
                .finish();


    }

    pub fn linkedin_auth_code_callback
}




POST /oauth/v2/accessToken HTTP/1.1
Host: www.linkedin.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&code=987654321&redirect_uri=https%3A%2F%2Fwww.myapp.com%2Fauth%2Flinkedin&client_id=123456789&client_secret=shhdonottell
