pub static EMAIL_S1  : &str ="ARC-Authentication-Results: i=1; mx.google.com;";
pub static EMAIL_S2  : &str ="       dkim=pass header.i=@alertsp.chase.com header.s=" ;
pub static EMAIL_S3  : &str =r#"       spf=pass (google.com: domain of srs0=ppno=mg=alertsp.chase.com=no-reply@bounce.secureserver.net designates"#;
pub static EMAIL_S4  : &str ="       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=alertsp.chase.com" ;
pub static EMAIL_S5  : &str ="Authentication-Results: mx.google.com;" ;
pub static EMAIL_S6  : &str = EMAIL_S2	;
pub static EMAIL_S7  : &str = EMAIL_S3	;
pub static EMAIL_S8  : &str = EMAIL_S4	;

