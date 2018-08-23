// https://angular.io/guide/reactive-forms
// https://angular.io/guide/form-validation

import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Subscription }   from 'rxjs';

import {AbstractControl,  ValidatorFn} from '@angular/forms';
import {EventEmitter, Input, Output} from '@angular/core';

import {GeoService} from '../../models/remote.service' ;
import {DBService} from '../../models/remote.service' ;
import {CommunicationService} from '../../models/communication.service' ;
import { AppComponent } from '../../app.component';


@Component({
  selector	: 'app-trip'			,
  templateUrl	: './trip.component.html'	,
  styleUrls	: ['./trip.component.css']
})

export class TripComponent implements OnInit,  OnDestroy{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided
	subscription1: Subscription ;
	subscription2: Subscription ;
	subscription3: Subscription ;

    	saved=false;

	trip_form = this.form_builder.group({
		start_loc	: ['', [Validators.required]],     // sync validators must be in an array
		//start_lat	: ['', []],     
		//start_lon	: ['', []],     
		//start_display_name	: ['', []], 
		end_loc		: ['', [Validators.required]], 
		//end_lat		: ['', []], 
		//end_lon		: ['', []],
		//end_display_name	: ['', []],
		start_date	: ['', [Validators.required]], 
		departure_time	: ['', [Validators.required]], 
		seats		: [3, [Validators.required]], 
		price		: [0.1, [Validators.required]], 
		recur_ind	: [false, []], 
		end_date	: ['', ], 
		day0_ind	: [false, ], 
		day1_ind	: [false, ], 
		day2_ind	: [false, ], 
		day3_ind	: [false, ], 
		day4_ind	: [false, ], 
		day5_ind	: [false, ], 
		day6_ind	: [false, ], 
		description	: ['', ], 
	});

	trip = { 
		  "start_lat": null
		, "start_lon": null
		, "start_display_name":null
		, "end_lat": null
		, "end_lon": null
		, "end_display_name":null
		, "distance": null
		};

	constructor(
		  public parent			: AppComponent
		, private geoService		: GeoService
		, private dbService		: DBService
		, private form_builder		: FormBuilder
		, private communicationService	: CommunicationService
	){ 
  		console.log("TripComponent.constructor() enter")  ;

		this.subscription1 = this.trip_form.valueChanges.subscribe(data => console.log('Form value changes', data));
		this.subscription2 = this.trip_form.statusChanges.subscribe(data => console.log('Form status changes', data));
  	} 

	ngOnInit() {
		console.info("TripComponent.ngOnInit() enter");
  	}

	ngOnDestroy() {
		// prevent memory leak when component destroyed
		this.subscription1.unsubscribe();
		this.subscription2.unsubscribe();
		this.subscription3.unsubscribe();
	}

	onSubmit() {
	  	// TODO: Use EventEmitter with form value
	    	console.warn("201808201534 TripComponent.onSubmit() this.trip_form.value=" + this.trip_form.value );
		/*
		if (this.saved) 
		{
			this.parent.trip = false;
		}
		else {
		// save trip to db
			let trip_from_db_observable     = this.dbService.upd_trip(this.trip_form.value);
			trip_from_db_observable.subscribe(
	    			trip_from_db => {
					console.info("201808201201 TripComponent.constructor() trip_from_db =" + JSON.stringify(trip_from_db));
					this.saved=true;
				}
			)
		}
		*/
	}

	geocode(element_id: string) {
		var loc: string =null;
		var lat: number =null;
		var lon: number =null;
		var display_name: string =null;
		console.info("201808212149 TripComponent.geocode() element_id =" + element_id);
		console.info("201808212149 TripComponent.geocode()  this.geoService =" +  this.geoService);
		console.info("201808212149 TripComponent.geocode()  this.dbService =" +  this.dbService);



		if (element_id =="start_loc") {
			loc = this.trip_form.value.start_loc ;
		}
		else loc= this.trip_form.value.end_loc ;

		if (loc.length >= 3) 
		{	
			let loc_response = this.geoService.geocode(loc) ;
			loc_response.subscribe(
				body => 	{
					console.info("201808212149 TripComponent.geocode()  body =\n" +  JSON.stringify(body));
					if (body[0]) {
						lat=body[0].lat ;
						lon=body[0].lon ;
						display_name=body[0].display_name ;
						console.info("201808212149 TripComponent.geocode()  lat=" +  lat);
						console.info("201808212149 TripComponent.geocode()  lon=" +  lon);
						console.info("201808212149 TripComponent.geocode()  display_name=" +  display_name);
					}
					else
					{
						lat=null;
						lon=null;
						display_name= null;
					}
					if (element_id == "start_loc" ) {
						this.trip.start_lat=lat;
						this.trip.start_lon=lon;
						this.trip.start_display_name=display_name;
						console.info("201808212149 TripComponent.geocode()  this.trip.start_lat=" +  this.trip.start_lat);
						console.info("201808212149 TripComponent.geocode()  this.trip.start_lon=" +  this.trip.start_lon);
						console.info("201808212149 TripComponent.geocode()  this.trip.start_display_name=" +  this.trip.start_display_name);
					} else {
						this.trip.end_lat=lat;
						this.trip.end_lon=lon;
						this.trip.end_display_name=display_name;
						console.info("201808212149 TripComponent.geocode()  this.trip.end_lat=" +  this.trip.end_lat);
						console.info("201808212149 TripComponent.geocode()  this.trip.end_lon=" +  this.trip.end_lon);
						console.info("201808212149 TripComponent.geocode()  this.trip.end_display_name=" +  this.trip.end_display_name);
					}
					this.routing();
					this.communicationService.send_trip_msg( this.trip) ; // send lat/lon info to map commponent
				}
			);
		}


	}

	routing() 
	{
		if ( this.trip.start_display_name && this.trip.end_display_name)
		{
			//both start and end are geocoded. So we can calc routes
			let route_response = this.geoService.routing(
				  this.trip.start_lat
				, this.trip.start_lon
				, this.trip.end_lat
				, this.trip.end_lon
			);
			route_response.subscribe(
				body => {
					console.info("201808201201 TripComponent.routing() body =" + JSON.stringify(body));
					let distance=body.routes[0].distance ;
					this.trip.distance= Math.round(distance /160)/10;
				},
				error => {
					this.trip.distance="no route";
				}
			);
		} else this.trip.distance="no route";
	}

	get start_loc		() { return this.trip_form.get('start_loc'	); }  // the getter is required for reactive form validation to work 
	get end_loc		() { return this.trip_form.get('end_loc'	); }  
	get start_date		() { return this.trip_form.get('start_date'	); }
	get departure_time	() { return this.trip_form.get('departure_time'	); }
	get seats		() { return this.trip_form.get('seats'		); }
	get price		() { return this.trip_form.get('price'		); }
}
