\c ride


drop schema if exists funcs cascade;
create schema funcs ;
grant all on schema funcs to ride;
--grant all on all functions in schema funcs to ride;

create or replace function funcs.updateusr( in_user text)
  returns usr
as
$body$
DECLARE
  s0 RECORD; 
  i1 RECORD ;
  s1 RECORD ;
  u1 RECORD ;
BEGIN
	SELECT * into s0 FROM json_populate_record(NULL::usr, in_user::json) ;
	
	insert into usr ( oauth_id) 
  	select  s0.oauth_id 
  	where s0.usr_id is null
	on conflict on constraint uk_usr
	do nothing 
	returning * into i1
	;

	select * into s1 from usr u where (u.usr_id=s0.usr_id or u.oauth_id=s0.oauth_id)
	;

	update usr u
		  set first_name	=coalesce(s0.first_name, u.first_name ) 
		  , last_name		=coalesce(s0.last_name, u.last_name )
		  , headline		=coalesce(s0.headline, u.headline) 
		  , email		=coalesce(s0.email, u.email)
		  , bank_email  	=coalesce(s0.bank_email, u.bank_email)
		  , member_since 	=coalesce(s0.member_since, u.member_since)
		  , trips_posted  	=coalesce(s0.trips_posted, u.trips_posted)
		  , trips_completed  	=coalesce(s0.trips_completed, u.trips_completed)
		  , rating           	=coalesce(s0.rating, u.rating)
		  , balance          	=coalesce(s0.balance, u.balance)
		  , oauth_id         	=coalesce(s0.oauth_id, u.oauth_id)
		  , oauth_host       	=coalesce(s0.oauth_host, u.oauth_host)
		  , deposit_id       	=coalesce(s0.deposit_id, u.deposit_id)
		  , c_ts             	=coalesce(s0.c_ts, u.c_ts)
		  , m_ts             	=coalesce(s0.m_ts, clock_timestamp())
	where u.usr_id = s1.usr_id
	returning u.* into u1
	;
        
	return u1;
END
$body$
language plpgsql;


create or replace function funcs.upd_trip( in_trip text, in_user text)
  returns trip
as
$body$
DECLARE
  s0 RECORD ;
  usr0 RECORD ;
  i1 RECORD ;
  u1 RECORD ;
BEGIN
	SELECT * into s0   FROM json_populate_record(NULL::trip, in_trip::json) ;
	SELECT * into usr0 FROM json_populate_record(NULL::usr , in_user::json) ;


  	insert into trip ( driver_id, start_date) 
  	select  usr0.usr_id, s0.start_date
  	where s0.trip_id is null
  	returning * into i1 
  	;

  	update trip t
  	set 
      		  start_date          = coalesce(s0.start_date          , t.start_date        ) 
    		, end_date            = coalesce(s0.end_date            , t.end_date          )
    		, departure_time      = coalesce(s0.departure_time      , t.departure_time    )
    		, start_loc           = coalesce(s0.start_loc           , t.start_loc         )
    		, start_display_name  = coalesce(s0.start_display_name  , t.start_display_name)
    		, start_lat           = coalesce(s0.start_lat           , t.start_lat         )
    		, start_lon           = coalesce(s0.start_lon           , t.start_lon         )
    		, end_loc             = coalesce(s0.end_loc             , t.end_loc           )
    		, end_display_name    = coalesce(s0.end_display_name    , t.end_display_name  )
    		, end_lat             = coalesce(s0.end_lat             , t.end_lat           )
    		, end_lon             = coalesce(s0.end_lon             , t.end_lon           )
    		, distance            = coalesce(s0.distance            , t.distance          )
    		, price               = coalesce(s0.price               , t.price             )
    		, recur_ind           = coalesce(s0.recur_ind           , t.recur_ind         )
    		, status_code         = coalesce(s0.status_code         , t.status_code       )
    		, description         = coalesce(s0.description         , t.description       )
    		, seats               = coalesce(s0.seats               , t.seats             )
    		, day0_ind            = coalesce(s0.day0_ind            , t.day0_ind          )
    		, day1_ind            = coalesce(s0.day0_ind            , t.day1_ind          )
    		, day2_ind            = coalesce(s0.day0_ind            , t.day2_ind          )
    		, day3_ind            = coalesce(s0.day0_ind            , t.day3_ind          )
    		, day4_ind            = coalesce(s0.day0_ind            , t.day4_ind          )
    		, day5_ind            = coalesce(s0.day0_ind            , t.day5_ind          )
    		, day6_ind            = coalesce(s0.day0_ind            , t.day6_ind          )
    		, c_ts                = coalesce(s0.c_ts                , t.c_ts              )
    		, m_ts                = clock_timestamp()
    		, c_usr               = coalesce(s0.c_usr               , t.c_usr             )
  	where t.trip_id in ( s0.trip_id, i1.trip_id)
  	returning t.* into u1 
  	;
  
  	return u1;
END
$body$
language plpgsql;

create or replace function funcs.upd_money_trnx( trnx text)
  returns money_trnx
as
$body$
DECLARE
  	s0 RECORD ;
  	i1 RECORD ;
  	u1 RECORD ;
BEGIN
	SELECT * into s0 FROM json_populate_record(NULL::money_trnx, trnx::json) ;

	insert into money_trnx ( usr_id, trnx_cd) 
	select  s0.usr_id, s0.trnx_cd
	where s0.money_trnx_id is null
	returning * into i1 
	;

  	update money_trnx t
  	set 
      		  trnx_cd            = coalesce(s0.trnx_cd            , t.trnx_cd         )   
    		, requested_amount   = coalesce(s0.requested_amount   , t.requested_amount  )
    		, actual_amount      = coalesce(s0.actual_amount      , t.actual_amount     )
    		, request_ts         = case when s0.requested_amount  is null then t.request_ts        else clock_timestamp()    end
    		, actual_ts          = case when s0.actual_amount     is null then t.actual_ts         else clock_timestamp()    end
    		, bank_email         = coalesce(s0.bank_email         , t.bank_email        )
    		, reference_no       = coalesce(s0.reference_no       , t.reference_no      )
    		, cmnt               = coalesce(s0.cmnt               , t.cmnt              )
    		, c_ts               = coalesce(s0.c_ts               , t.c_ts              )
    		, m_ts               = coalesce(s0.m_ts               , t.clock_timestamp() )
  	where t.money_trnx_id in ( s0.money_trnx_id, i1.money_trnx_id)
  	returning t.* into u1 
  	;
  
  	return u1;
END
$body$
language plpgsql;
