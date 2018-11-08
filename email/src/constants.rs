pub static	LOG_DIR	:	&str= "/tmp/email_down.log";

pub static	EMAIL_DIR	:	&str= "/tmp/email_down";
pub static	EMAIL_SEARCH:	&str= r#"UID SEARCH SUBJECT "sent you" FROM "chase" TO "deposit@beegrove.com" SMALLER 300000 SENTSINCE 01-Jan-2018"#;
pub static	DOMAIN 		:	&str= "imap.gmail.com";
pub static 	PORT		:	u16	= 993;
pub static 	USER_NAME	:	&str= "weihan.lin"	;

pub static REGEX_EMAIL_S1		: &str =r#"^ARC-Authentication-Results: i=1; mx.google.com;$"#;
pub static REGEX_EMAIL_S2		: &str 
	=r#"^       ddkim=pass header.i=@alertsp.chase.com header.s=.{5} header.b=.{8};$"#;
pub static REGEX_EMAIL_S3		: &str =r#"^       spf=pass (google.com: domain of srs0=ppno=mg=alertsp.chase.com=no-reply@bounce.secureserver.net designates [0-9.]{10,} as permitted sender) smtp.mailfrom="SRS0=pPNo=MG=alertsp.chase.com=no-reply@bounce.secureserver.net";$"#	;
pub static REGEX_EMAIL_S4		: &str =r#"^       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=alertsp.chase.com$"# ;
pub static REGEX_EMAIL_S5		: &str =r#"^Authentication-Results: mx.google.com;$"# ;
pub static REGEX_EMAIL_S6		: &str = REGEX_EMAIL_S2	;
pub static REGEX_EMAIL_S7		: &str = REGEX_EMAIL_S3	;
pub static REGEX_EMAIL_S8		: &str = REGEX_EMAIL_S4	;


pub static REGEX_EMAIL_FROM		: &str	=	r#"^From: Chase QuickPay Team <no-reply@alertsp.chase.com>"#;
pub static REGEX_EMAIL_TO		: &str	=	r#"^To: deposit@beegrove.com$"#	; 
pub static REGEX_EMAIL_SUBJECT	: &str	=	r#"^Subject: .{5,40} sent you \$([0-9]+\.[0-9]{2})$"# ;
pub static REGEX_EMAIL_MEMO		: &str	
	=	r#"RD([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})"#	;  //() is capture group

