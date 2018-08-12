//use std::thread;
use r2d2::{Pool, PooledConnection};
use r2d2_postgres::{TlsMode, PostgresConnectionManager};
use r2d2_postgres::postgres::types::{ ToSql};
//use r2d2_postgres::postgres::{Error};
use rustc_serialize::json::Json ;

type PConnection = PooledConnection<PostgresConnectionManager> ;
type PPool = Pool<PostgresConnectionManager> ;

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
        if (self.connection_string == "") {
        self.connection_string           = format!("postgres://{}:{}@{}:{}/{}"         , self.user, self.passwd,   self.host, self.port, self.database) ;
        self.connection_string_no_passwd = format!("postgres://{}:password@{}:{}/{}"   , self.user,                self.host, self.port, self.database) ;
        }
    }
}

pub fn db_pool(db_url : Option<DbUrl>)  -> PPool {
    let default_db_url = DbUrl {
          port        :"5432".to_string()
        , host        :"10.0.0.111".to_string()
        , user        :"ride".to_string()
        , passwd      :"ride".to_string()
        , database    :"ride".to_string()
        , connection_string : "".to_string()
        , connection_string_no_passwd : "".to_string()
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

pub fn runsql (pool: & PPool , sql: &str, params: & [& ToSql]) ->  Vec<Json>  
{
    let conn = db_conn (pool);
    runsql_conn(&conn, sql, params) 
}

pub fn runsql_conn (conn: & PConnection , sql: &str, params: & [& ToSql]) ->  Vec<Json>  {
    //alway return json. sql must generate json
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
    return row_values;
}

pub fn test () ->  Vec<Json> {
        let pool = db_pool(None) ;
        let sql= "select row_to_json(a, true) json from usr a limit 2" ;
        runsql(&pool, &sql  , &[]) 
}
