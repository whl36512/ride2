use std::error::Error;
extern crate regex;
//extern crate email;

use std::str;
use std::io::{self, BufRead};

use std::fs::File;
//use std::io::{BufReader};
use std::io::{Read};
use regex::Regex;
//use server::constants;
use util;

usr constants::REGEX_EMAIL_S1		;
usr constants::REGEX_EMAIL_S2		;
usr constants::REGEX_EMAIL_S3		;
usr constants::REGEX_EMAIL_S4		;
usr constants::REGEX_EMAIL_S5		;
usr constants::REGEX_EMAIL_S6		;
usr constants::REGEX_EMAIL_S7		;
usr constants::REGEX_EMAIL_S8		;
usr constants::REGEX_EMAIL_FROM		;
usr constants::REGEX_EMAIL_TO		;
usr constants::REGEX_EMAIL_SUBJECT	;
usr constants::REGEX_EMAIL_MEMO		;


pub fn main_() -> Result<i32, Box<Error>> {
	util::logger_init();
	try!(	process_email(email_uid: &str ) 	);
	Ok(0)
}

fn process_email(email_uid: &str ) -> Result <<(String, f32), Box<Error>>{
	lines_pass[u16, 10];
	amount: f32;
	deposit_id: String;

	let path		=	format!("{}/{}", OUTPUT_DIR, email_uid);
	let mut input	=	try!(	File::open(&path)					);
	let lines 		=	BufReader::new(input).lines()	;

	info!("201811072941 Opened email file {} for processing ", path);

	lazy_static! {
		static ref re_s1 = Regex::new(REGEX_EMAIL_S1).unwrap();
		static ref re_s2 = Regex::new(REGEX_EMAIL_S1).unwrap();
		static ref re_s3 = Regex::new(REGEX_EMAIL_S1).unwrap();
		static ref re_s4 = Regex::new(REGEX_EMAIL_S1).unwrap();
		static ref re_s5 = Regex::new(REGEX_EMAIL_S1).unwrap();
		static ref re_s6 = Regex::new(REGEX_EMAIL_S1).unwrap();
		static ref re_s7 = Regex::new(REGEX_EMAIL_S1).unwrap();
		static ref re_s8 = Regex::new(REGEX_EMAIL_S1).unwrap();
		static ref re_from = Regex::new(REGEX_EMAIL_FROM).unwrap();
		static ref re_to = Regex::new(REGEX_EMAIL_TO).unwrap();
		static ref re_subject = Regex::new(REGEX_EMAIL_SUBJECT).unwrap();
		static ref re_memo = Regex::new(REGEX_EMAIL_MEMO).unwrap();
	}

	let mut line_no=0;
	while(let line = lines.next()) {
		line_no += 1;
		if  re_s1.is_match(line){
			lines_pass[0]	= line_no;
			let line = lines.next(); line_no += 1; if re_s2.is_match(line) { lines_pass[1] = line_no; }
			let line = lines.next(); line_no += 1; if re_s3.is_match(line) { lines_pass[2] = line_no; }
			let line = lines.next(); line_no += 1; if re_s4.is_match(line) { lines_pass[3] = line_no; }
		}
		if  res_s5.is_match(line) {
			lines_pass[4]	= line_no;
			let line = lines.next(); line_no += 1; if re_s6.is_match(line) { lines_pass[5] = line_no; }
			let line = lines.next(); line_no += 1; if re_s7.is_match(line) { lines_pass[6] = line_no; }
			let line = lines.next(); line_no += 1; if re_s8.is_match(line) { lines_pass[7] = line_no; }
		}
		if re_to.is_match(line)		lines_pass[8]=line_no;
		if re_from.is_match(line)	lines_pass[9]=line_no;

		for cap in re_subject.captures_iter(line) {
			amount = cap[1];
		}

		for cap in re_memo.captures_iter(line) {
			deposit_id= cap[1];
		}

		let all_ture = lines_pass.fold(true, |sum, x| sum  && x) ;
		if all_true {
			info!("201811070001 Security check for {} passed", &path);
			return Ok(true);
		}
		for key in lines_pass {
			if ( ! lines_pass[key] ) 
				error!("201811070006 Security check on {} failed for line {}", path, key+1);
		}
		return Ok(false);
	}
}

fn save_to_db() {
}
fn get_file() {
}
fn rename_file(){
}
fn (


