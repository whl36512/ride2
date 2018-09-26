// https://angular.io/guide/reactive-forms
// https://angular.io/guide/form-validation

import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';
import {AbstractControl} from '@angular/forms';
import { Subscription }   from 'rxjs';

import {EventEmitter, Input, Output} from '@angular/core';

import {GeoService} from '../../models/remote.service' ;
import {DBService} from '../../models/remote.service' ;
import {CommunicationService} from '../../models/communication.service' ;
import { AppComponent } from '../../app.component';
import { Constants } from '../../models/constants';
import { StorageService } from '../../models/gui.service';


@Component({
  selector	: 'app-search'			,
  templateUrl	: './search.component.html'	,
  styleUrls	: ['./search.component.css']
})

export class SearchComponent implements OnInit,  OnDestroy{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided
	subscription1: Subscription ;
	subscription2: Subscription ;
	subscription3: Subscription ;

	MAX_SEATS=Constants.MAX_SEATS;
	MAX_PRICE=Constants.MAX_PRICE_RIDER;
	ERROR_NO_ROUTE=Constants.ERROR_NO_ROUTE;

	trip:any;
	form: any;
	form_journeys : any= null;
	today : any;
	step=1;
	journeys_from_db: any = [];

	constructor(
		  private geoService		: GeoService
		, private dbService		: DBService
		, private form_builder		: FormBuilder
		, private communicationService	: CommunicationService
	){ 

  	console.log("SearchComponent.constructor() enter")  ;
	this.trip = { 
		  "start_lat": null
		, "start_lon": null
		, "start_display_name":null
		, "end_lat": null
		, "end_lon": null
		, "end_display_name":null
		, "distance": null
		};

		this.today = new Date().toJSON().slice(0,10) ; // today is in the form of 2018-09-11
  		console.log("201809081034 TripComponent.constructor() exit")  ;
  	} 

	ngOnInit() {
		console.info("TripComponent.ngOnInit() enter");
		let form_value_from_storage = StorageService.getForm(Constants.KEY_FORM_SEARCH);
		if ( form_value_from_storage == null) {
			this.form = this.form_builder.group({
				// initilaized as ''. Deleted value in UX becomes ''
				start_loc	: ['', [Validators.required]],
				end_loc		: ['', [Validators.required]], 
				start_date	: ['', [Validators.min]],     
				end_date	: ['', [Validators.min]], 
				departure_time	: ['', []], 
				seats		: [1, []], 
				price		: [this.MAX_PRICE, []], 
				}
			);
		}
		else {
			// pre-populate search form
			this.form = this.form_builder.group({
				start_loc	: [form_value_from_storage.start_loc, [Validators.required]],
				end_loc		: [form_value_from_storage.end_loc, [Validators.required]], 
				start_date	: [form_value_from_storage.start_date, [Validators.min]], 
				end_date	: [form_value_from_storage.end_date, [Validators.min]], 
				departure_time	: [form_value_from_storage.departure_time, []], 
				seats		: [form_value_from_storage.seats, []], 
				price		: [form_value_from_storage.price, []], 
				}
			);

			this.geocode('start_loc');
			this.geocode('end_loc');
		}


		//this.subscription1 = this.form.valueChanges.subscribe(data => console.log('Form value changes', data));
		//this.subscription2 = this.form.statusChanges.subscribe(data => console.log('Form status changes', data));
		console.info("SearchComponent.ngOnInit() exit");
  	}

	add_journey_to_form(journey_id: string): void {
		
		let item= this.form_builder.group({
			journey_id	: [journey_id, []],
			seats		: [0, []], 
		})
		let journeys = this.form_journeys.get('journeys') as FormArray;				
		journeys.push(item);
	}

	ngOnDestroy() {
		// prevent memory leak when component destroyed
		//this.subscription1.unsubscribe();
		//this.subscription2.unsubscribe();
	}

	close_page() {
		this.communicationService.close_page(Constants.SEARCH_PAGE);
	}

	onSubmit() {
	    	console.warn("201809231416 SearchComponent.onSubmit() this.form.value=" + JSON.stringify(this.form.value) );
	    	console.warn("201809231416 SearchComponent.onSubmit() this.form.value.start_date=" + this.form.value.start_date );
	    	console.warn("201809231416 SearchComponent.onSubmit() this.form.value.end_date=" + this.form.value.end_date );
		StorageService.storeForm(Constants.KEY_FORM_SEARCH, this.form);
		// combining data
		let trip = { ...this.form.value, ...this.trip};
		let journeys_from_db_observable     = this.dbService.call_db(Constants.URL_SEARCH, trip);
		journeys_from_db_observable.subscribe(
	    		journeys_from_db => {
				console.info("201808201201 SearchComponent.constructor() journeys_from_db =" + JSON.stringify(journeys_from_db));
				this.journeys_from_db = journeys_from_db;
				this.form_journeys = this.form_builder.group({
					journeys: this.form_builder.array([ ]),
				});
				

				for ( var journey in this.journeys_from_db)
				{
					let journey_json = JSON.parse(journey);
					this.add_journey_to_form(journey_json.journey_id);
				}
			}
		)
	}

	geocode(element_id: string) {
		var loc: string =null;
		var lat: number =null;
		var lon: number =null;
		var display_name: string =null;
		console.info("201800111346 SearchComponent.geocode() element_id =" + element_id);

		if (element_id =="start_loc") {
			loc = this.form.value.start_loc ;
		}
		else loc= this.form.value.end_loc ;

		if (loc.length >= 3)  // must type at least 3 letters before geocoding starts
		{	
			let loc_response = this.geoService.geocode(loc) ;
			loc_response.subscribe(
				body => 	{
					console.info("201809111347 SearchComponent.geocode()  body =\n" +  JSON.stringify(body));
					if (body[0]) {
						lat=body[0].lat ;
						lon=body[0].lon ;
						display_name=body[0].display_name ;
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
					} else {
						this.trip.end_lat=lat;
						this.trip.end_lon=lon;
						this.trip.end_display_name=display_name;
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
					this.trip.distance=Constants.ERROR_NO_ROUTE;
				}
			);
		} else this.trip.distance=Constants.ERROR_NO_ROUTE;
	}
	
	calc_cost(item :number): number {
		let cost = this.form_journeys.value.journeys[item].seats 
			* this.journeys_from_db[item].price 
			* this.journeys_from_db[item].distance;

		return Math.round(cost*100)/100;

	}

	get start_loc		() { return this.form.get('start_loc'	); }  // the getter is required for reactive form validation to work 
	get end_loc		() { return this.form.get('end_loc'	); }  
	get start_date		() { return this.form.get('start_date'	); }
	get departure_time	() { return this.form.get('departure_time'	); }
	get seats		() { return this.form.get('seats'		); }
	get price		() { return this.form.get('price'		); }
}
