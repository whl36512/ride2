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
  dummy RECORD ;
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
    		, day1_ind            = coalesce(s0.day1_ind            , t.day1_ind          )
    		, day2_ind            = coalesce(s0.day2_ind            , t.day2_ind          )
    		, day3_ind            = coalesce(s0.day3_ind            , t.day3_ind          )
    		, day4_ind            = coalesce(s0.day4_ind            , t.day4_ind          )
    		, day5_ind            = coalesce(s0.day5_ind            , t.day5_ind          )
    		, day6_ind            = coalesce(s0.day6_ind            , t.day6_ind          )
    		, c_ts                = coalesce(s0.c_ts                , t.c_ts              )
    		, m_ts                = clock_timestamp()
    		, c_usr               = coalesce(s0.c_usr               , t.c_usr             )
  	where t.trip_id in ( s0.trip_id, i1.trip_id)
  	returning t.* into u1 
  	;

	select funcs.create_journey(u1.trip_id) into dummy;

  	return u1;
END
$body$
language plpgsql;

create or replace function funcs.create_journey( in_trip_id sys_id)
returns void 
as
$body$
	with dates as (
		SELECT d::date, extract(dow from d::date) dow
		FROM 	generate_series(
				(select start_date from trip where trip_id=in_trip_id::uuid) ,
				(select end_date   from trip where trip_id=in_trip_id::uuid) ,
				'1 day'
			) AS gs(d)
	)
	insert into journey (trip_id, journey_date, departure_time, seats, price)
	select 	t.trip_id
		, dates.d				
		, t.departure_time
		, t.seats
		, t.price
	from trip t , dates 
	where t.trip_id=in_trip_id::uuid
	and 	(    dates.dow=0 and t.day0_ind = true
		or   dates.dow=1 and t.day1_ind = true
		or   dates.dow=2 and t.day2_ind = true
		or   dates.dow=3 and t.day3_ind = true
		or   dates.dow=4 and t.day4_ind = true
		or   dates.dow=5 and t.day5_ind = true
		or   dates.dow=6 and t.day6_ind = true
		)
	;
$body$
language sql;

create or replace function funcs.upd_journey( in_journey text)
  returns journey
as
$body$
DECLARE
  journey0 RECORD ;
  usr0 RECORD ;
  i1 RECORD ;
  u1 RECORD ;
  journey1 RECORD ;
BEGIN
	SELECT * into journey0 FROM json_populate_record(NULL::journey , in_journey::json) ;

	update journey j
	set seats = coalesce (journey0.seats, j.seats)
	  , price = coalesce (journey0.price, j.price)
	returning * into journey1
	;

	return journey1;
END
$body$
language plpgsql;





create or replace function funcs.search( in_trip text)
  returns setof json
as
$body$
-- if input json string has fields with "" value, change their value to null in order to avoid error when converting empty string to date
	with trip0 as (
		SELECT t.*, t.distance/600.0 degree10 FROM json_populate_record(NULL::trip , regexp_replace(in_trip, '": ?""', '":null', 'g')::json) t 
	)
	, a as (
		select t.start_display_name, t.end_display_name ,t.distance 
			, t.description
			, j.*
		from trip t, trip0, journey j
		--join journey j on (t.trip_id=j.trip_id)
		where t.start_lat	between trip0.start_lat-trip0.degree10 	and trip0.start_lat+trip0.degree10
		and   t.start_lon	between trip0.start_lon-trip0.degree10	and trip0.start_lon+trip0.degree10
		and   t.end_lat		between trip0.end_lat-trip0.degree10 		and trip0.end_lat+trip0.degree10
		and   t.end_lon		between trip0.end_lon-trip0.degree10		and trip0.end_lon+trip0.degree10
		and   ( trip0.start_date is null  
			or j.journey_date   between trip0.start_date and coalesce ( trip0.end_date, trip0.start_date)
		)
		and   ( trip0.departure_time is null  
			or j.departure_time between trip0.departure_time- interval '1 hour' and trip0.departure_time + interval '1 hour'
		)
		and j.price <= trip0.price
		and j.seats >= trip0.seats
		and t.trip_id=j.trip_id
		and j.status_code='A'
	)
	select row_to_json(a) 
	from a
	order by a.journey_date, a.departure_time
	;
$body$
language sql;


select * from funcs.search('{"departure_time": null, "distance": 30.7, "end_date": null, "end_display_name": "Millennium Centre, 33, West Ontario Street, Magnificent Mile, Chicago, Cook County, Illinois, 60654, USA", "end_lat": "41.89285925", "end_loc": "33 w ontario st, chicago", "end_lon": "-87.6292175246499", "price": 0.2, "seats": 1, "start_date": null, "start_display_name": "2916, Colton Court, Lisle, DuPage County, Illinois, 60532, USA", "start_lat": "41.7944060204082", "start_loc": "2916 colton ct", "start_lon": "-88.1075615306122"}');

create or replace function funcs.book_count_of_trip ( in_trip_id text)
  returns bigint
as
$body$
	select count(1)  cnt
	from trip t 
	join journey j on ( j.trip_id=t.trip_id)
	join book b on (b.journey_id = j.journey_id)
	where t.trip_id = in_trip_id::uuid
$body$
language sql;

create or replace function funcs.book( in_book text,  in_user text)
  returns book
as
$body$
DECLARE
  	user0 RECORD ;
  	user1 RECORD ;
  	book0 RECORD ;
  	book1 RECORD ;
BEGIN
	SELECT * into user0 FROM json_populate_record(NULL::usr , in_user::json) ;
	SELECT * into book0 FROM json_populate_record(NULL::book, in_book::json) ;

	start transaction;

	insert into book ( journey_id, rider_id, seats, driver_price, rider_price, driver_cost, rider_cost   )
	select j.journey_id
		, user0.usr_id 
		, book0.seats
		, j.price
		, book0.price
		, j.price     *t.distance*book0.seats
		, book0.price *t.distance*book0.seats
	from jouney j
	join trip t on (t.trip_id=j.trip_id)
	where j.journey_id = book0.journey_id
	and book0.price > j.price * 1.20
	-- and book0.seats <= func.available_seats(book0.journey_id)
	and book0.seats <= j.seats 
	returning * into book1
	;

	update journey j
	set seats = j.seats- book1.seats
	where j.journey_id= book1.journey_id
	;

	update usr
	set balance=balance - book1.rider_cost
	where u.usr_id=book1.rider_id
	and balance >= book1.rider_cost
	returning * into user1
	;

	if user1.usr_id is not null then
		commit;
		return book1;
	else
		rollback;
		return null::book;
	end if;
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
