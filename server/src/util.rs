use simplelog::*;
use std::fs::File;


// url::form_urlencoded::parse()
//
pub fn logger_init () {
        CombinedLogger::init(
            vec![
                TermLogger::new(LevelFilter::Debug, Config::default()).unwrap(),
                WriteLogger::new(LevelFilter::Info, Config::default(),
                File::create("my_rust_binary.log").unwrap()),
                ]
                ).unwrap();
    }


