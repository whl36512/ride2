-- to run this script
-- su postgres -c psql < src/sql/create.sql
drop database if exists ride;
create database ride; 
drop user if exists ride;
create user ride with password 'ride';
-- alter database ride owner to ride;
GRANT ALL PRIVILEGES ON DATABASE ride to ride;
\c ride
grant all on all tables in schema public to ride;
CREATE EXTENSION pgcrypto;
CREATE EXTENSION  "uuid-ossp";


-- IMPORTANT:
-- All columns must be not null because play cannot handle null when converting JSON to case class

CREATE DOMAIN email AS TEXT 
CHECK(
   VALUE ~ '^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]{1,30}\.){1,4}([a-zA-Z]{2,5})$' 
);


--slick cannot handle uuid 
CREATE DOMAIN sys_id as uuid default uuid_generate_v4() ;
CREATE DOMAIN textwithdefault as text default '' ;
CREATE DOMAIN sys_ts timestamp with time zone default clock_timestamp();
CREATE DOMAIN tswithepoch timestamp with time zone default '1970-01-01 00:00:00Z' ;
CREATE DOMAIN score integer  CHECK ( value in (1,2,3,4,5));
CREATE DOMAIN ridemoney decimal(10,4) ;

--CREATE TYPE location AS
   --(
	--address	text 
	--, lat	double precision
	--, long	double precision
	--, display_name	text		-- reverse geocoded
	--, country	text		-- reverse geocoded
	--, state		text		-- reverse geocoded
	--, city		text		-- reverse geocoded
   --);

create table usr
(
	usr_id 			sys_id not null
	, first_name		text
	, last_name		text
        , headline              text
	, email 		email 
	, bank_email 		email
	, member_since 		sys_ts not null
	, trips_posted 		integer not null default 0
	, trips_completed 	integer not null default 0
	, rating		decimal (5,2) not null default 0
	, balance		ridemoney not null default 0
	, oauth_id		text not null
	, oauth_host		text not null default 'linkedin'
        , deposit_id            sys_id not null
        , c_ts 			sys_ts not null
        , m_ts 			sys_ts not null
	, constraint pk_usr PRIMARY KEY (usr_id)
	, constraint uk_usr unique  (oauth_id)
) ;

CREATE TABLE trip
(
        trip_id                 sys_id not null
        , driver_id             sys_id not null
        , start_date            date    not null
        , end_date              date    -- last date if recurring, null otherwise
        , departure_time    	time    not null default current_time
	, start_loc		textwithdefault not null
	, start_display_name	textwithdefault not null
	, start_lat		decimal(18,14) not null default 0
	, start_lon		decimal(18,14) not null default 0
	, end_loc		textwithdefault not null
	, end_display_name	textwithdefault not null
	, end_lat		decimal(18,14) not null default 0
	, end_lon		decimal(18,14) not null default 0
        , distance              decimal(8,2)    not null default 0
        , price                 ridemoney    not null default 0.1 -- price per mile
        , recur_ind             boolean not null default false
        , status_code           char(1) not null default  'A' -- Pending, Active,  Cancelled,  Expired
        , description           text
        , seats                 integer not null default 3
        , day0_ind              boolean not null default false          -- sunday
        , day1_ind              boolean not null default false
        , day2_ind              boolean not null default false
        , day3_ind              boolean not null default false
        , day4_ind              boolean not null default false
        , day5_ind              boolean not null default false
        , day6_ind              boolean not null default false
        , c_ts                  sys_ts not null
        , m_ts                  sys_ts not null
        , c_usr 		text
        , constraint pk_trip PRIMARY KEY (trip_id)
);

CREATE TABLE journey
(
	journey_id		sys_id not null
        , trip_id               sys_id not null
        , journey_date          date    not null
        , departure_time    	time    not null default current_time
        , status_code           char(1) not null default  'A' -- Pending, Active, Cancelled,  Expired
        , price                 ridemoney    not null default 0.1 -- price per mile
        , seats                 integer not null default 3 
        , c_ts                  sys_ts not null
        , m_ts                  sys_ts not null
        , c_usr 		text
        , constraint pk_journey PRIMARY KEY (journey_id)
);


create table book_status(
	status_cd 	char(1) not null
	, description	textwithdefault not null
	, constraint pk_book_status PRIMARY KEY (status_cd)
);

insert into book_status 
values 
  ('C', 'Considering')
, ('I', 'Insufficient balance')
, ('B', 'Booked')
, ('S', 'trip started')
, ('R', 'cancelled by Rider')
, ('D', 'cancelled by Driver')
, ('F', 'Finished')
;

create table book
(
	book_id			sys_id not null
	, journey_id		sys_id not null
	, rider_id		sys_id  not null
	, seats			integer not null default 1
	, driver_price		ridemoney not null default 0
	, driver_cost		ridemoney not null default 0
	, rider_price		ridemoney not null default 0
	, rider_cost		ridemoney not null default 0
	, penalty_to_driver	ridemoney not null default 0    
	, penalty_to_rider	ridemoney not null default 0
	, status_cd		char(1) not null default  'C' -- Considering, Booked, trip Started, Finished, cancelled by Rider, cancelled by Driver
	, rider_score		smallint  CHECK ( rider_score in (1,2,3,4,5))
	, driver_score		smallint  CHECK ( rider_score in (1,2,3,4,5))
	, rider_comment		text
	, driver_comment	text
	, c_ts			sys_ts not null
	, m_ts			sys_ts not null
	, book_ts		sys_ts not null
	, driver_cancel_ts	timestamp with time zone
	, rider_cancel_ts	timestamp with time zone
	, finish_ts		timestamp with time zone
	, constraint pk_book PRIMARY KEY (book_id)
);

create table money_trnx (
	money_trnx_id	        sys_id not null
	, usr_id	        sys_id not null
	, trnx_cd	        textwithdefault not null -- Deposit, Withdraw
	, requested_amount	ridemoney 
	, actual_amount	        ridemoney
	, request_ts	        timestamp with time zone
	, actual_ts	        timestamp with time zone
        , bank_email            email
	, reference_no	        text
	, cmnt 		        text
	, c_ts			sys_ts not null
	, m_ts			sys_ts not null
	, constraint pk_money_trnx PRIMARY KEY (money_trnx_id)
);

alter table trip add FOREIGN KEY (driver_id) REFERENCES usr (usr_id);
alter table journey add FOREIGN KEY (trip_id) REFERENCES trip (trip_id);
alter table book add FOREIGN KEY (rider_id) REFERENCES usr (usr_id);
alter table book add FOREIGN KEY (journey_id) REFERENCES journey (journey_id);
alter table money_trnx add FOREIGN KEY (usr_id) REFERENCES usr (usr_id);
alter table book add FOREIGN KEY (status_cd) REFERENCES book_status (status_cd);

grant all on public.usr to ride;
grant all on public.trip to ride;
grant all on public.journey to ride;
grant all on public.book to ride;
grant all on public.book_status to ride;
grant all on public.money_trnx to ride;
