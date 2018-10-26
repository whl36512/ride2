\c ride


drop schema if exists funcs cascade;
create schema funcs ;
grant all on schema funcs to ride;
--grant all on all functions in schema funcs to ride;

create or replace function funcs.test1( )
  returns book
as
$body$
DECLARE
  	book0 RECORD ;
BEGIN
	select * into book0
	from book
	where 1=2
	;
	return book0;
END
$body$
language plpgsql;

create or replace function funcs.json_populate_record(base anyelement, in_text text )
  returns anyelement
as
$body$
-- if input json string has fields with "" value, change their value to null 
-- in order to avoid error when converting empty string to date
	select json_populate_record(base ,regexp_replace(in_text , '": ?""', '":null', 'g')::json) t ;
	--select json_populate_record(base ,regexp_replace(in_text , '": ?"[ \t]*"', '":null', 'g')::json) t ;
$body$
language sql;

create or replace function funcs.calc_cost(price numeric 
					, distance  numeric
					, seats integer
					, is_rider boolean)
  returns numeric
as
$body$
DECLARE
	booking_fee numeric; 
	margin_factor numeric ;
	the_cost numeric ;
BEGIN
	booking_fee:= 0.2	;
	margin_factor := 1.2	;
	
	if is_rider then
		the_cost :=  round(price * distance * seats * 1.2 + seats*booking_fee , 2) ;
	else	
		the_cost :=  round(price * distance * seats  , 2) ;
	end if;

	return the_cost;
END
$body$
language plpgsql;

create or replace function funcs.updateusr( in_user text, in_dummy text)
  returns usr
as
$body$
DECLARE
  s0 RECORD; 
  i1 RECORD ;
  s1 RECORD ;
  u1 RECORD ;
BEGIN
	SELECT * into s0 from funcs.json_populate_record(NULL::usr, in_user) ;
	
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
		  , sm_link       	=coalesce(s0.sm_link, u.sm_link)
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
  trip1 RECORD ;
  dummy RECORD ;
BEGIN
	SELECT * into s0   FROM funcs.json_populate_record(NULL::trip, in_trip) ;
	SELECT * into usr0 FROM funcs.json_populate_record(NULL::usr , in_user) ;


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
  	returning t.* into trip1 
  	;

	if trip1.recur_ind = true then
		select funcs.create_journey(trip1.trip_id) into dummy;
	else
		insert into journey (trip_id, journey_date, departure_time, seats, price)
		select 	trip1.trip_id
			, trip1.start_date
			, trip1.departure_time
			, trip1.seats
			, trip1.price
		;
	end if ;

  	return trip1;
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

create or replace function funcs.upd_journey( in_journey text, in_dummy text)
  returns journey
as
$body$
DECLARE
  journey0 RECORD ;
  journey1 RECORD ;
BEGIN
	SELECT * into journey0 FROM funcs.json_populate_record(NULL::journey , in_journey) ;

	update journey j
	set seats = least(coalesce (journey0.seats, j.seats), 6)
	  , price = coalesce (journey0.price, j.price)
	where j.journey_id=journey0.journey_id
	and (j.seats != journey0.seats or j.price!= journey0.price)
	returning * into journey1
	;

	return journey1;
END
$body$
language plpgsql;

create or replace function funcs.cancel_booking( in_book text, in_user text)
  returns book
-- cancel by rider
as
$body$
DECLARE
  user0 RECORD ;
  book0 RECORD ;
  book1 RECORD ;
  ids	RECORD ;
  journey1 RECORD ;
  rider_id1 uuid;
  jsonrow json;
BEGIN
	SELECT * into book0 FROM funcs.json_populate_record(NULL::book 	, in_book)  ;
	SELECT * into user0 FROM funcs.json_populate_record(NULL::usr 	, in_user) ; 

	select b.rider_id into rider_id1
	from book b
	where 	b.book_id = book0.book_id
	and 	b.rider_id = user0.usr_id
	;

	select b.book_id, j.journey_id, t.trip_id, t.driver_id, b.rider_id
	into ids
	from book b
	join journey j 	on ( j.journey_id = b.journey_id)
	join trip t 	on ( t.trip_id = j.trip_id )
	join usr u	on ( u.usr_id=t.driver_id )
	where 	b.book_id	= book0.book_id
	and	b.status_cd 	in ('P', 'B')  
	and	b.rider_id	= user0.usr_id
	;

	
	update book b
	set 	status_cd 		= 'R'
		, penalty_to_rider 	= case when b.status_cd = 'B' 
						then round(b.rider_cost * 0.2 ,2)
						when status_cd = 'P'
						then 0
						end
	  	, m_ts			= clock_timestamp()
	  	, rider_cancel_ts 	= clock_timestamp()
	where 	b.book_id=ids.book_id
	returning * into book1
	;

	update journey j  -- return seats to journey
	set seats = least ( seats + book1.seats, 6 ) -- make sure the max seats is 6
	where	j.journey_id = book1.journey_id
	-- and	j.status_code = 'A'       -- only when the journey is active
	returning * into journey1
	;

	-- return money to rider and apply penalty to rider
	insert into money_trnx ( 
		  usr_id
		, trnx_cd
		, actual_amount
		, actual_ts 
		, reference_no)
	select 
		 book1.rider_id
		, 'R'
		, book1.rider_cost
		, clock_timestamp()
		, book1.book_id
	;

	insert into money_trnx ( 
		  usr_id
		, trnx_cd
		, actual_amount
		, actual_ts 
		, reference_no)
	select 
		 book1.rider_id
		, 'P'
		, - book1.penalty_to_rider
		, clock_timestamp()
		, book1.book_id
	where book1.penalty_to_rider > 0
	;

	update usr u
	set balance = 	balance 
			+ book1.rider_cost 
			- book1.penalty_to_rider 
	where	u.usr_id = book1.rider_id
	;

	return book1;
END
$body$
language plpgsql;

create or replace function funcs.reject( in_book text, in_user text)
  returns book
-- reject or cancel by driver 
as
$body$
DECLARE
  user0 RECORD ;
  book0 RECORD ;
  book1 RECORD ;
  ids  	RECORD ;
  rider_id1 uuid;
  journey1 RECORD ;
  jsonrow json;
BEGIN
	SELECT * into book0 FROM funcs.json_populate_record(NULL::book , in_book) ;
	SELECT * into user0 FROM funcs.json_populate_record(NULL::usr , in_user) ;

	select b.book_id, j.journey_id, t.trip_id, t.driver_id, b.rider_id
	into ids
	from book b
	join journey j 	on ( j.journey_id = b.journey_id)
	join trip t 	on ( t.trip_id = j.trip_id and t.driver_id=user0.usr_id)
	join usr u	on ( u.usr_id=t.driver_id )
	where 	b.book_id	= book0.book_id
	and	b.status_cd 	in ('P', 'B')  
	;

	update book b
	set 	status_cd 		= case when b.status_cd='P' then 'J'
						when b.status_cd='B' then 'D'
						end
		, penalty_to_driver 	= 
			case when b.status_cd = 'B' 
				then round(b.driver_cost * 0.5 , 2)
				when b.status_cd = 'P'
				then 0
			end
	  	, m_ts			= clock_timestamp()
	  	, driver_cancel_ts 	= clock_timestamp()
	where 	b.book_id = ids.book_id
	returning * into book1
	;


	-- apply penalty to driver 
	insert into money_trnx ( 
		  usr_id
		, trnx_cd
		, actual_amount
		, actual_ts 
		, reference_no)
	select 
		 ids.driver_id
		, 'P'
		, - book1.penalty_to_driver
		, clock_timestamp()
		, book1.book_id
	where book1.penalty_to_driver >0
	;
		
	update usr u
	set 	balance = u.balance - book1.penalty_to_driver
	where  u.usr_id	= ids.driver_id
	and    book1.book_id is not null -- make sure update happened
	;
	
	update journey j  -- return seats to journey
	set seats = least ( j.seats + book1.seats, 6 ) -- make sure the max seats is 6
	where	j.journey_id = book1.journey_id
	-- and	j.status_code = 'A'       -- only when the journey is active
	returning * into journey1
	;

	-- return money to rider 
	insert into money_trnx ( 
		  usr_id
		, trnx_cd
		, actual_amount
		, actual_ts 
		, reference_no)
	select 
		 book1.rider_id
		, 'R'
		, book1.rider_cost
		, clock_timestamp()
		, book1.book_id
	;

	update usr u
	set balance = 	balance 
			+ book1.rider_cost 
			-- - book1.penalty_to_rider 
	where	u.usr_id = book1.rider_id
	;

	return book1;
END
$body$
language plpgsql;

create or replace function funcs.confirm( in_book text, in_user text)
  returns book
-- mark the booking is complete to the satisfaction of rider
as
$body$
DECLARE
  user0 RECORD ;
  book0 RECORD ;
  book1 RECORD ;
BEGIN
	SELECT * into book0 FROM funcs.json_populate_record(NULL::book 	, in_book) ;
	SELECT * into user0 FROM funcs.json_populate_record(NULL::usr 	, in_user) ;

	update book b
	set 	status_cd 	= 'B'
	  	, m_ts		= clock_timestamp()
	from journey j, trip t
	where 	b.book_id	= book0.book_id
	and	j.journey_id	= b.journey_id
	and	t.trip_id	= j.trip_id
	--and 	t.driver_id 	= user0.usr_id	--double sure to defeat hacking
	and	b.status_cd	= 'P'		-- make sure the booking is pending confirmation
	returning b.* into book1
	;

	return book1;
END
$body$
language plpgsql;

create or replace function funcs.finish( in_book text, in_user text)
  returns book
-- mark the booking is complete to the satisfaction of rider
as
$body$
DECLARE
  user0 RECORD ;
  book0 RECORD ;
  book1 RECORD ;
  journey1 RECORD ;
  rider_id1 uuid;
  jsonrow json;
  ids 	RECORD;
BEGIN
	SELECT * into book0 FROM funcs.json_populate_record(NULL::book , in_book) ;
	SELECT * into user0 FROM funcs.json_populate_record(NULL::usr , in_user) ;

	update book b
	set 	status_cd 	= 'F'
	  	, m_ts		= clock_timestamp()
	  	, finish_ts	= clock_timestamp()
	where 	b.book_id	=book0.book_id
	and 	b.rider_id 	= user0.usr_id	--double sure to defeat hacking
	and	b.status_cd	='B'		-- make sure the booking is active
	returning * into book1
	;

	update usr 
	set trips_completed = trips_completed+1
	where usr_id=book1.rider_id
	;

	select t.trip_id, j.journey_id	, t.driver_id
	into ids
	from journey j
	join trip t on (t.trip_id=j.trip_id)
	where j.journey_id = book1.journey_id
	;
	

	-- assign money to driver
	insert into money_trnx ( 
		  usr_id
		, trnx_cd
		, actual_amount
		, actual_ts 
		, reference_no)
	values (ids.driver_id
		, 'F'
		, book1.driver_cost
		, clock_timestamp()
		, book1.book_id
		)
	;

	update usr u
	set balance = 	balance + book1.driver_cost 
	where	u.usr_id 	= ids.driver_id
	;

	return book1;
END
$body$
language plpgsql;

create or replace function funcs.search( in_trip text, in_user text)
  returns setof json
as
$body$
-- if input json string has fields with "" value, change their value to null in order to avoid error when converting empty string to date
	with trip0 as (
		SELECT t.*
			, t.distance/600.0 degree10  -- one tenth of the distance, in degree
			, start_lat	+ (start_lat	- end_lat) 	*0.05 adjusted_start_lat 
			, start_lon	+ (start_lon	- end_lon) 	*0.05 adjusted_start_lon 
			, end_lat	+ (end_lat	- start_lat) 	*0.05 adjusted_end_lat 
			, end_lon	+ (end_lon	- start_lon) 	*0.05 adjusted_end_lon 
		FROM funcs.json_populate_record(NULL::trip , in_trip) t
		where 	t.distance is not null -- make sure the distance is already found at client side
		and	t.distance > 0 -- make sure the distance is already found at client side
	)
	, user0  as ( 
		-- if usr_id is null, populated it with random uuid
		SELECT coalesce(t.usr_id, uuid_generate_v4()) usr_id  
		FROM funcs.json_populate_record(NULL::usr , in_user) t 
	)
	, a as (
		select t.start_display_name, t.end_display_name 
			, t.start_lat
			, t.start_lon
			, t.end_lat
			, t.end_lon
			--, t.distance 
			, t.description
			, t.driver_id        
			, j.journey_id        
 			, j.trip_id         
 			, j.journey_date    
 			, j.departure_time  
		--	, u.balance
			, trip0.seats
			, funcs.calc_cost(j.price, trip0.distance , trip0.seats , true) rider_cost
			, coalesce (b.seats,0) seats_booked
			, case when u.balance >=  funcs.calc_cost(j.price , trip0.distance , trip0.seats , true)
			  then true else false 
			  end sufficient_balance
			, ut.sm_link
			, ut.headline
		from trip0
		join user0 on (1=1)  -- usr0 may not ba available because of not signed in
		join trip t on  (
		 	t.start_lat	between trip0.adjusted_start_lat-trip0.degree10 	
				and 	trip0.adjusted_start_lat+trip0.degree10
			and t.start_lon	between trip0.adjusted_start_lon-trip0.degree10	
				and 	trip0.adjusted_start_lon+trip0.degree10
			and t.end_lat		between trip0.adjusted_end_lat-trip0.degree10 	
				and 	trip0.adjusted_end_lat+trip0.degree10
			and t.end_lon		between trip0.adjusted_end_lon-trip0.degree10
				and 	trip0.adjusted_end_lon+trip0.degree10
			and t.status_code 	= 	'A'
			and t.driver_id 	!= 	user0.usr_id
		)
		join usr 	ut on (ut.usr_id=t.driver_id) -- to get driver sm_link
		join journey 	j  on (
			j.trip_id=t.trip_id
			and   j.journey_date	between trip0.start_date 
						and coalesce ( trip0.end_date, '3000-01-01')
			and j.status_code='A'
			and j.price <= trip0.price/1.2
			and j.seats >= trip0.seats
		)
		--left outer join user0 on (1=1)  -- usr0 may not ba available because of not signed in
		left outer join usr u on (u.usr_id= user0.usr_id) -- to get bookings
		left outer join book b on (b.rider_id = user0.usr_id 
						and b.journey_id=j.journey_id
						and b.status_cd in ('P', 'B')
					)
		--where t.start_lat	between trip0.adjusted_start_lat-trip0.degree10 	
					--and 	trip0.adjusted_start_lat+trip0.degree10
		--and   t.start_lon	between trip0.adjusted_start_lon-trip0.degree10	
					--and 	trip0.adjusted_start_lon+trip0.degree10
		--and   t.end_lat		between trip0.adjusted_end_lat-trip0.degree10 		
					--and 	trip0.adjusted_end_lat+trip0.degree10
		--and   t.end_lon		between trip0.adjusted_end_lon-trip0.degree10		
					--and 	trip0.adjusted_end_lon+trip0.degree10
		--and   j.journey_date	between trip0.start_date and coalesce ( trip0.end_date, '3000-01-01')
		where   ( trip0.departure_time is null  
			or j.departure_time between trip0.departure_time - interval '1 hour' 
					        and trip0.departure_time + interval '1 hour'
		)
		--and j.price <= trip0.price/1.2
		--and j.seats >= trip0.seats
		--and j.status_code='A'
		--where t.driver_id != user0.usr_id
	)
	select row_to_json(a) 
	from a
	order by a.journey_date, a.departure_time
	;
$body$
language sql;


--select * from funcs.search('{"departure_time": null, "distance": 30.7, "end_date": null, "end_display_name": "Millennium Centre, 33, West Ontario Street, Magnificent Mile, Chicago, Cook County, Illinois, 60654, USA", "end_lat": "41.89285925", "end_loc": "33 w ontario st, chicago", "end_lon": "-87.6292175246499", "price": 0.2, "seats": 1, "start_date": null, "start_display_name": "2916, Colton Court, Lisle, DuPage County, Illinois, 60532, USA", "start_lat": "41.7944060204082", "start_loc": "2916 colton ct", "start_lon": "-88.1075615306122"}');

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
  	utj RECORD ;
  	user1 RECORD ;
  	book0 RECORD ;
  	book1 RECORD ;
	factor decimal;
BEGIN
	SELECT * into user0 FROM funcs.json_populate_record(NULL::usr , in_user) ;
	SELECT * into book0 FROM funcs.json_populate_record(NULL::book, in_book) ;

	factor := 1.2 ;
	
	-- make sure enough balance and seats
	select 	u.usr_id, t.trip_id, j.journey_id 
		, j.price driver_price
		, funcs.calc_cost(j.price , book0.distance , book0.seats, false) driver_cost
		, j.price * factor  rider_price
		, funcs.calc_cost(j.price , book0.distance , book0.seats , true) rider_cost
	into 	utj	
	from 	journey j, usr u , trip t
	where	j.journey_id=book0.journey_id
	and	u.usr_id=user0.usr_id
	and	t.trip_id=j.trip_id
	and	u.balance >= funcs.calc_cost(j.price , book0.distance , book0.seats , true)
	and	j.seats >= book0.seats 
	and	book0.distance > 0
	;

	if  utj.journey_id is null then
		return null::book;
	end if;

	insert into book ( 
		journey_id
		, rider_id 
		, pickup_loc          
        	, pickup_display_name
        	, pickup_lat
        	, pickup_lon
        	, dropoff_loc
        	, dropoff_display_name
        	, dropoff_lat
        	, dropoff_lon
        	, distance              
		, seats, status_cd, driver_price, rider_price, driver_cost, rider_cost )
	select 	utj.journey_id
		, utj.usr_id 
		, book0.pickup_loc
        	, book0.pickup_display_name
        	, book0.pickup_lat
        	, book0.pickup_lon
        	, book0.dropoff_loc
        	, book0.dropoff_display_name
        	, book0.dropoff_lat
        	, book0.dropoff_lon           
        	, book0.distance              
		, book0.seats
		, 'P'
		, utj.driver_price
		, utj.rider_price
		, utj.driver_cost
		, utj.rider_cost
	where utj.journey_id is not null
	returning * into book1
	;
	
	update journey j
	set seats = j.seats- book1.seats
	where j.journey_id= book1.journey_id
	;
	
	insert into money_trnx ( 
		usr_id
		, trnx_cd
		, actual_amount
		, actual_ts 
		, reference_no)
	values (book1.rider_id
		, 'B'
		, -book1.rider_cost
		, clock_timestamp()
		, book1.book_id
		)
	;

	update usr u
	set balance = balance - book1.rider_cost
	where u.usr_id=book1.rider_id
	returning * into user1
	;
	
	return book1;
END
$body$
language plpgsql;


create or replace function funcs.get_money_trnx( in_criteria text, in_user text)
  returns setof json
as
$body$
	with u0  as ( 
		SELECT * FROM funcs.json_populate_record(NULL::usr , in_user) 
	)
	, c0 as ( 
		SELECT * FROM funcs.json_populate_record(NULL::criteria , in_criteria)
	)
	, s1 as (select  
			coalesce(t.actual_ts, t.request_ts) date
			, cd.description
			, t.*
		from u0
		join money_trnx t on ( t.usr_id= u0.usr_id)
		join  c0 on (1=1)  
		left outer join money_trnx_trnx_cd cd on (  cd.cd = t.trnx_cd)
		where (
			t.actual_ts between coalesce(c0.start_date, '1970-01-01') 
			and coalesce(c0.end_date, '3000-01-01')
			or 
			t.request_ts between coalesce(c0.start_date, '1970-01-01') 
			and coalesce(c0.end_date, '3000-01-01')
		)
	)
	select row_to_json (s1)  from s1
	order by date desc
	;
$body$
language sql;

create or replace function funcs.withdraw( in_trnx text, in_user text)
  returns money_trnx
as
$body$
DECLARE
  	t0 RECORD ;
  	u0 RECORD ;
  	t1 RECORD ;
BEGIN

        SELECT * into t0 FROM funcs.json_populate_record(NULL::money_trnx, in_trnx) ;
        SELECT * into u0 FROM funcs.json_populate_record(NULL::usr, in_trnx) ;

        insert into money_trnx ( 
		  usr_id
		, trnx_cd
		, requested_amount
		, request_ts
		, bank_email
		, reference_no  
		)
        values (
		  u0.usr_id
		, 'W'
		, -t0.requested_amount
		, clock_timestamp()
		, t0.bank_email
		, uuid_generate_v4()
		)
        returning * into t1
        ;

  	return t1;
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
	SELECT * into s0 FROM funcs.json_populate_record(NULL::money_trnx, trnx) ;

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


create or replace function funcs.activity(in_trip text, in_user text)
  returns setof json
as
$body$
-- in_trip has start_date and end_date
-- if input json string has fields with "" value, change their value to null in order to avoid error when converting empty string to date
	with trip0 as (
		SELECT * FROM funcs.json_populate_record(NULL::trip , in_trip)
	)
	, user0  as ( 
		SELECT * FROM funcs.json_populate_record(NULL::usr , in_user)
	)
	, ids as (
		select  t.trip_id, j.journey_id, b.book_id, t.driver_id, b.rider_id, u0.usr_id
		from user0 	u0
		join trip0 	t0 	on (1=1)
		join trip 	t 	on ( t.driver_id=u0.usr_id )
		join journey 	j	on (t.trip_id=j.trip_id
			and  j.journey_date between coalesce(t0.start_date	, '1970-01-01') 
						and coalesce(t0.end_date	, '3000-01-01')
			)
		join book 	b	on (b.journey_id=j.journey_id )
		-- join book_status s on (s.status_cd= b.status_cd)
		union
		select  t.trip_id, j.journey_id, b.book_id, t.driver_id, b.rider_id, u0.usr_id
		from user0 	u0
		join trip0 	t0 	on (1=1)
		join book 	b 	on ( b.rider_id= u0.usr_id)
		join journey 	j 	on ( j.journey_id = b.journey_id
			and  j.journey_date between coalesce(t0.start_date	, '1970-01-01') 
						and coalesce(t0.end_date	, '3000-01-01')
			)
		join trip 	t 	on ( t.trip_id = j.trip_id)
		union 
		-- get bookable journeys to allow its driver to change seats and price
		select  t.trip_id, j.journey_id, null book_id, t.driver_id, null rider_id, u0.usr_id
		from user0	u0
		join trip0	t0 	on ( 1=1)
		join trip 	t 	on ( t.driver_id=u0.usr_id )
		join journey	j	on (t.trip_id=j.trip_id
			and  j.journey_date between coalesce(t0.start_date	, '1970-01-01') 
						and coalesce(t0.end_date	, '3000-01-01')
			and j.status_code = 'A'
			)
	)
	, a as (
		select 
			ids.trip_id
			, ids.driver_id
			, ids.rider_id
			, ids.journey_id
			, ids.book_id 
			, t.start_display_name
			, t.start_lat
			, t.start_lon
			, t.end_display_name
			, t.end_lat
			, t.end_lon
			, t.description
			-- , t.distance
			, j.journey_date
			, j.departure_time
			, j.status_code
			, case 
				when ids.usr_id = t.driver_id	then coalesce(b.driver_price, j.price)
				when ids.usr_id	= b.rider_id 	then b.rider_price  
				else null
			  end price
			, case 
				when ids.usr_id = t.driver_id	then b.driver_cost 
				when ids.usr_id = b.rider_id	then b.rider_cost  
				else null
			  end unified_cost -- either driver's cost or rider's cost
			, coalesce(b.seats , j.seats) seats  -- either seats available or seats booked
			--, case when ids.usr_id = t.driver_id then b.driver_cost else null end driver_cost
			--, case when ids.usr_id = b.rider_id then b.rider_cost else null end rider_cost
			, b.status_cd 
			, case when s.description is null then 'Seats Available'
				else s.description
			  end book_status_description
			--, case when ids.usr_id = ids.driver_id then true else false end is_driver
			--, case when ids.usr_id = ids.rider_id then true else false end is_rider
			, case when ids.usr_id = t.driver_id then true else false end is_driver
			, case when ids.usr_id = b.rider_id  then true else false end is_rider
			, b.pickup_display_name
			, b.pickup_lat
			, b.pickup_lon
			, b.dropoff_display_name
			, b.dropoff_lat
			, b.dropoff_lon
			, case when ids.usr_id = t.driver_id then ud.headline else ur.headline end headline
			, case when ids.usr_id = t.driver_id then ud.sm_link  else ur.sm_link  end sm_link
		from ids 
		join trip 		t 	on ( t.trip_id=ids.trip_id )
		join journey 		j 	on (j.journey_id= ids.journey_id) 
		join usr		ud 	on ( ud.usr_id=ids.driver_id)
		left outer join usr	ur 	on ( ur.usr_id=ids.rider_id)
		left outer join book 	b 	on (b.book_id= ids.book_id )
		left outer join book_status s 	on (s.status_cd= b.status_cd)
	)
	select row_to_json(a) 
	from a
	order by a.journey_date , a.departure_time
	;
$body$
language sql;

create or replace function funcs.msgs(in_book text, in_user text)
  returns setof json
as
$body$
	with b0 as (
		SELECT * FROM funcs.json_populate_record(NULL::book , in_book)
	)
	, u0  as ( 
		SELECT * FROM funcs.json_populate_record(NULL::usr , in_user)
	)
	, a as (
		select m.*
			,  case when u0.usr_id = m.usr_id then 'Me'
			   	when u0.usr_id != m.usr_id and m.usr_id = b.rider_id then 'Rider'
			   	else 'Driver'
			   end user_is
		from u0
		join b0 on (1=1)
		join book b 	on ( b.book_id= b0.book_id ) 
		join msg m 	on ( m.book_id= b.book_id and m.c_ts > b0.c_ts )
	)
	select row_to_json(a) 
	from a
	order by a.c_ts 
	;
$body$
language sql;

create or replace function funcs.save_msg( in_msg text, in_user text)
  returns msg
as
$body$
DECLARE
  m0 RECORD; 
  u0 RECORD ;
  m1 msg ;
  m2 RECORD ;
BEGIN
	SELECT * into m0 from funcs.json_populate_record(NULL::msg, in_msg) ;
	SELECT * into u0 from funcs.json_populate_record(NULL::usr, in_user) ;
	
	insert into msg ( book_id, usr_id, msg) 
  	values  ( m0.book_id, u0.usr_id, m0.msg)
	returning * into m1
	;

        
	return m1;
END
$body$
language plpgsql;
