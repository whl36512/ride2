//use std::thread;
use r2d2::{Pool};
use r2d2_postgres::{TlsMode, PostgresConnectionManager};
use r2d2_postgres::postgres::types::{ ToSql};
//use r2d2_postgres::postgres::{Error};
use rustc_serialize::json::Json ;

pub fn db_pool()  -> Pool<PostgresConnectionManager> {
    let port        ="5432";
    let host        ="rideshare.beegrove.com" ; 
    let user        = "ride"    ;
    let passwd      ="ride" ;
    let database    ="ride" ;

    //let url="postgres://user:pass@host:port/database?arg1=val1&arg2=val2"
    let url =format!("postgres://{}:password@{}:{}/{}", user, host, port, database) ;
    info!("201808061048 db_pool() Connecting to database at {}", url);
    let url =format!("postgres://{}:{}@{}:{}/{}", user, passwd, host, port, database) ;
    let manager = PostgresConnectionManager::new(url, TlsMode::None).unwrap() ;
    let pool  = Pool::builder()
        .max_size(5)
        .build(manager)
        .unwrap()
        ;
    return pool;
}

pub fn runsql (pool: & Pool<PostgresConnectionManager> , sql: &str, params: & [& ToSql]) ->  Vec<Json>  {
    //alway return json. sql must generate json
    debug!("201808051817 sql={}", &sql) ;
    let mut row_values : Vec<Json> = Vec::new ();
    //let mut row_value : Option<Json> = None;
    let pool = pool.clone() ;
    let conn = pool.get().unwrap();
    let result=  conn.query(&sql, &params);
    match result {
        Ok(rows) => {
            for row in &rows  {
                if row.len() >0  {
                    let json= row.get("json") ;
                    trace!("runsql 201808052222 json={}", &json) ;
                    row_values.push(json) ;
                }
            }
        }
        Err(e) =>  { error!("ERROR 201808051746 {}", e); }
    }
    return row_values;
}

pub fn test () ->  Vec<Json> {
        let pool = db_pool() ;
        let sql= "select row_to_json(a, true) json from usr a limit 2" ;
        let json_results = runsql(&pool, &sql  , &[]) ;
        json_results
}
