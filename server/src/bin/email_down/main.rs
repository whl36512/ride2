use std::error::Error;
#[macro_use] extern crate log;
extern crate simplelog;


extern crate imap;
extern crate native_tls;
extern crate server;

use native_tls::TlsConnector;
use std::str;
use std::io::{self, BufRead};

use std::fs::File;
use std::io::{Write};
//use std::io::{BufReader};
use std::io::{Read};
use imap::client::Session	;

//use server::constants;
use server::util;


pub static	OUTPUT_DIR	:	&str= "/tmp/email_down";
pub static	EMAIL_SEARCH:	&str= r#"UID SEARCH SUBJECT "sent you" FROM "chase" TO "deposit@beegrove.com" SMALLER 300000 SENTSINCE 01-Jan-2018"#;
pub static	DOMAIN 		:	&str= "imap.gmail.com";
pub static 	PORT		:	u16	= 993;
pub static 	USER_NAME	:	&str= "weihan.lin"	;

// To connect to the gmail IMAP server with this you will need to allow unsecure apps access.
// See: https://support.google.com/accounts/answer/6010255?hl=en
// Look at the gmail_oauth2.rs example on how to connect to a gmail server securely.
fn main()  {
	match main_() {
		Ok(_)	=> {}
        Err(e) => {
            eprintln!("ERROR 201811031803 email_down::main() {}", e);
        }
	}
}


fn main_() -> Result<i32, Box<Error>> {
	util::logger_init();
	let (_user_name, pw) = read_credential();

    let socket_addr 	= (DOMAIN, PORT);
    let ssl_connector 	= try!(	TlsConnector::builder().build()		);
    let client			= imap::client::secure_connect(socket_addr, DOMAIN, &ssl_connector).unwrap(); 


    let mut imap_session= client.login(USER_NAME, &pw).unwrap() ;

    let capabilities	= try!(	imap_session.capabilities()			);
    for capability in capabilities.iter() {
            println!("{}", capability);
	}

    let mailbox			= try!(	imap_session.select("INBOX")		);
    info!("{}", mailbox);

	let search_result	= try!(	imap_session.ed_search()				);
	let uids			= search_result.split_whitespace()		;
	for uid in uids {
    	match imap_session.ed_fetch(uid) {
        	Ok(_) => { }
        	Err(e) => eprintln!("ERROR 201811031815 {}", e),
    	};
	}
    try!(	imap_session.logout()		);
	Ok(0)
}

fn read_credential() ->  (String, String) {
	println!("Enter email and password");
    let stdin		= io::stdin();
	let mut iterator= stdin.lock().lines();
    let user_name 	= iterator.next().unwrap().unwrap();
    let pw			= iterator.next().unwrap().unwrap();
	(user_name, pw)
}

pub trait EmailDown {
	fn ed_search(&mut self)					->	Result<String, Box<Error>>	;
	fn ed_fetch(&mut self, uid: &str)		->	Result<i32	,  Box<Error>> 	;
	fn ed_command(&mut self, command: &str)	->	Result<String, Box<Error>>	;
}
impl <T:Read + Write> EmailDown for Session<T> {
	fn ed_search(&mut self ) -> Result<String, Box<Error>>
	{
		let command = EMAIL_SEARCH ;
		info!("201811031952 EmailDown search command={}", command);
		let msg			= try!(	self.ed_command(&command)		);
		info!("201811031952 EmailDown search result={}", msg);
		Ok(msg)
	}
	
	fn ed_fetch(&mut self, uid: &str) -> Result<i32,  Box<Error>>
	{
		if uid == "*" || uid == "SEARCH"  {	return Ok(0)	};
		let path		= format!("{}/{}", OUTPUT_DIR, uid);
		let command		= format!("UID FETCH {} BODY[]", uid);
		info!("201811031806 email_down::fetch() uid={}", &uid	);

		let msg			= try!(	self.ed_command(&command)		);
		
		let mut output  = try!(	File::create(&path)					);
    	try!(	write!(output, "{}", msg)		);
		info!("201811031806 email_down::fetch() saved {} to {}",  &uid, &path	);
		let move_command = format!("UID MOVE {} deposit", uid) ;
		let move_response= try!(	self.ed_command(&move_command)		);
		info!("201811031806 email_down::fetch() response={}",  &move_response	);
		Ok(0)	
	}

	fn ed_command(&mut self, command: &str)	-> Result<String,  Box<Error>> {
    	let msg_utf8 	= try!( self.run_command_and_read_response(&command ) );
		let msg			= try!(	str::from_utf8(&msg_utf8)	) ;
		Ok(msg.to_string())
	}
}

