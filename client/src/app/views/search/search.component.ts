// https://angular.io/guide/reactive-forms
// https://angular.io/guide/form-validation

import { Component} from '@angular/core';
import { OnInit } from '@angular/core';
//import { OnDestroy } from '@angular/core';
//import { NgZone  } from '@angular/core';
//import { ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';
import {AbstractControl} from '@angular/forms';
//import { Subscription }   from 'rxjs';

//import {EventEmitter, Input, Output} from '@angular/core';

import {GeoService} from '../../models/remote.service' ;
import {DBService} from '../../models/remote.service' ;
import {CommunicationService} from '../../models/communication.service' ;
import { AppComponent } from '../../app.component';
//import { Constants } from '../../models/constants';
import { C } from '../../models/constants';
import { Ridebase } from '../../models/ridebase';
import { StorageService } from '../../models/gui.service';


@Component({
  selector	: 'app-search'			,
  templateUrl	: './search.component.html'	,
  styleUrls	: ['./search.component.css']	,
//  changeDetection: ChangeDetectionStrategy.OnPush ,

})

export class SearchComponent extends Ridebase implements OnInit{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided

	trip:any;
	search_criteria	:	any;
	form: any;
	//form_journeys : any= [];
	//today : any;
	step=1;
	journeys_from_db: any = [];

	constructor(
		  private geoService		: GeoService
		, private dbService		: DBService
		, private form_builder		: FormBuilder
		, public communicationService	: CommunicationService
		//, private zone: NgZone
	){ 
		super(communicationService)
  		console.log("SearchComponent.constructor() enter")  ;
		this.page_name= C.PAGE_SEARCH;
		this.trip = { 
		  	"start_lat": null
			, "start_lon": null
			, "start_display_name":null
			, "end_lat": null
			, "end_lon": null
			, "end_display_name":null
			, "distance": null
		};

  		console.log("201809081034 TripComponent.constructor() exit")  ;
  	} 

	ngOnInit() {
		console.debug("201810212326 SearchComponent.ngOnInit() enter");
		let form_value_from_storage = StorageService.getForm(C.KEY_FORM_SEARCH);
		if ( form_value_from_storage == null) {
			this.form = this.form_builder.group({
				// initilaized as ''. Deleted value in UX becomes ''
				start_loc	: ['', [Validators.required]],
				end_loc		: ['', [Validators.required]], 
				start_date	: [C.TODAY(), [Validators.min, Validators.required]],     
				end_date	: [C.TODAY(), [Validators.min]], 
				departure_time	: ['', []], 
				seats		: [1, []], 
				price		: [this.C.MAX_PRICE, []], 
				}
			);
		}
		else {
			// pre-populate search form
			let start_date 	= C.TODAY();

			if ( form_value_from_storage.start_date > start_date)  
				start_date = form_value_from_storage.start_date;

			this.form = this.form_builder.group({
				start_loc	: [form_value_from_storage.start_loc, [Validators.required]],
				end_loc		: [form_value_from_storage.end_loc, [Validators.required]], 
				start_date	: [start_date, [Validators.min,Validators.required]], 
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

	onSubmit() {
	    	console.debug("201809231416 SearchComponent.onSubmit() this.form.value=" + C.stringify(this.form.value) );
		this.reset_msg();
		this.warning_msg = 'Searching ...';
		// combining data
		this.search_criteria = { ...this.form.value, ...this.trip};
		StorageService.storeForm(C.KEY_FORM_SEARCH, this.search_criteria); // save search parameters for later

		let journeys_from_db_observable     = this.dbService.call_db(C.URL_SEARCH, this.search_criteria);
		this.journeys_from_db =[]; // remove previous search result from screen

		journeys_from_db_observable.subscribe(
	    		journeys_from_db => {
				console.info("201808201201 SearchComponent.constructor() journeys_from_db =" 
					, C.stringify(journeys_from_db));
				this.reset_msg();
				this.journeys_from_db = journeys_from_db;
				if(this.journeys_from_db.length == 0 ) this.warning_msg = 'Nothing found';
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
					console.info("201809111347 SearchComponent.geocode()  body =\n" +  C.stringify(body));
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
					let pair = C.convert_trip_to_pair(this.trip);
					this.communicationService.send_msg(C.MSG_KEY_MARKER_CLEAR, {});
                			this.communicationService.send_msg(C.MSG_KEY_MARKER_PAIR, pair);
                			this.communicationService.send_msg(C.MSG_KEY_MARKER_FIT, pair);
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
					console.info("201808201201 SearchComponent.routing() body =" 
						, C.stringify(body));
					if( body.routes.length >0 ) {
						let distance=body.routes[0].distance ;
						this.trip.distance= Math.round(distance /160)/10;
					}
					else {
						this.trip.distance=C.ERROR_NO_ROUTE;
					}
				},
				error => {
					this.trip.distance=C.ERROR_NO_ROUTE;
				}
			);
		} else this.trip.distance=C.ERROR_NO_ROUTE;
	}

	subscription_action ( msg: any): void{
        	console.debug("201810212010 SearchComponent.subscriptio_action(). ignore msg");
	}

	// the getter is required for reactive form validation to work 
	get start_loc		() { return this.form.get('start_loc'	); }  
	get end_loc		() { return this.form.get('end_loc'	); }  
	get start_date		() { return this.form.get('start_date'	); }
	get departure_time	() { return this.form.get('departure_time'	); }
	get seats		() { return this.form.get('seats'		); }
	get price		() { return this.form.get('price'		); }
}
