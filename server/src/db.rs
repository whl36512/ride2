//use std::thread;
use r2d2::{Pool, PooledConnection};
use r2d2_postgres::{TlsMode, PostgresConnectionManager};
use r2d2_postgres::postgres::types::{ ToSql};
//use r2d2_postgres::postgres::{Error};
//use rustc_serialize::json::Json ;
//use serde_json::{ to_string}  ;
use serde_json  ;
use constants;


type PConnection = PooledConnection<PostgresConnectionManager> ;
type PPool = Pool<PostgresConnectionManager> ;
type Json = serde_json::Value;

pub struct DbUrl {
    port        :String,
    host        :String,
    user        :String,
    passwd      :String,
    database    :String,
    connection_string :String,
    connection_string_no_passwd :String,
}

impl DbUrl {
    pub fn make_connection_string(& mut self)
    {
    //let url="postgres://user:pass@host:port/database?arg1=val1&arg2=val2"
        if self.connection_string == "" {
        self.connection_string           = format!("postgres://{}:{}@{}:{}/{}"         , self.user, self.passwd,   self.host, self.port, self.database) ;
        self.connection_string_no_passwd = format!("postgres://{}:password@{}:{}/{}"   , self.user,                self.host, self.port, self.database) ;
        }
    }
}

pub fn db_pool(db_url : Option<DbUrl>)  -> PPool {
    let default_db_url = DbUrl {
          port        : constants::PG_PORT.to_string()
        , host        : constants::PG_HOST.to_string()
        , user        : constants::PG_USER.to_string()
        , passwd      : constants::PG_PASSWD.to_string()
        , database    : constants::PG_DATABASE.to_string()
        , connection_string : constants::EMPTY_STRING.to_string()
        , connection_string_no_passwd : constants::EMPTY_STRING.to_string()
    };

    let mut db_url=db_url.unwrap_or(default_db_url);
    db_url.make_connection_string() ;
    info!("201808061048 db_pool() Connecting to database {}", db_url.connection_string_no_passwd);
    let manager = PostgresConnectionManager::new(db_url.connection_string, TlsMode::None).unwrap() ;
    let pool  = Pool::builder()
        .max_size(5)
        .build(manager)
        .unwrap()
        ;
    pool 
}

pub fn db_conn(pool: & PPool) -> PConnection
{
    let pool = pool.clone() ;
    let conn = pool.get().unwrap();
    conn 
}

pub fn runsql (pool: & PPool , sql: &str, params: & [& ToSql], expected_count: u32) ->  Option<Vec<Json>>
{
    let conn = db_conn (pool);
    runsql_conn(&conn, sql, params, expected_count) 
}
pub fn runsql_one_row (conn: & PConnection , sql: &str, params: & [& ToSql]) ->  Option<Json>  {
    let rows=runsql_conn(conn, sql, params, 1);
    rows.map(|mut v|v.remove(0))
}
pub fn runsql_conn (conn: & PConnection , sql: &str, params: & [& ToSql], expected_count: u32) ->  Option<Vec<Json> > {
    //alway return json. sql must generate json
    fn print_error_then_none  (row_values: & Vec<Json>, expected_count:u32) -> Option<Vec<Json>>{
        error!("ERROR 201808131155 find more rows than expected "      ) ;
        error!("ERROR 201808131155 expect {} rows ", expected_count      ) ;
        error!("ERROR 201808131155 returned {} rows ", row_values.len()) ;
        error!("ERROR 201808131155 row_values=\n{:?} ", row_values     ) ;
        None
    }
    debug!("201808051817 sql={}", &sql) ;
    let mut row_values : Vec<Json> = Vec::new ();
    //let mut row_value : Option<Json> = None;
    let result=  conn.query(&sql, &params);
    match result {
        Ok(rows) => {
            for row in &rows  {
                if row.len() >0  {
                    //let json= row.get("json") ;
                    let json= row.get(0) ;
                    trace!("runsql 201808052222 json={}", &json) ;
                    row_values.push(json) ;
                }
            }
        }
        Err(e) =>  { error!("ERROR 201808051746 {}", e); }
    }

    let row_values_option = match (expected_count, row_values.len())   {
        (1, 1) => Some(row_values),
        (0, 0) => Some(row_values),
        (0, _) =>   print_error_then_none (&row_values, expected_count) ,
        (1, _) =>   print_error_then_none (&row_values, expected_count) ,
        _       =>  Some(row_values),
    } ;
    return row_values_option;
}

pub fn test () ->  Option<Vec<Json>> {
        let pool = db_pool(None) ;
        let sql= "select row_to_json(a, true) json from usr a limit 2" ;
        runsql(&pool, &sql  , &[], 2) 
}
