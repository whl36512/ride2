// https://angular.io/guide/reactive-forms
// https://angular.io/guide/form-validation

import { Component} from '@angular/core';
import { OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';
import { AbstractControl} from '@angular/forms';
//import { Subscription }   from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';



//import { EventEmitter, Input, Output} from '@angular/core';

import { GeoService} from '../../models/remote.service' ;
import { DBService} from '../../models/remote.service' ;
import { CommunicationService} from '../../models/communication.service' ;
import { AppComponent } from '../../app.component';
import { C} from '../../models/constants';
import { Ridebase} from '../../models/ridebase';
import { StorageService } from '../../models/gui.service';



@Component({
  selector	: 'app-trip'			,
  templateUrl	: './trip.component.html'	,
  styleUrls	: ['./trip.component.css']	,
  // prevent change detection unless @Input reference is changed
  changeDetection: ChangeDetectionStrategy.OnPush ,  

})

export class TripComponent extends Ridebase implements OnInit{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided
    	form_saved_to_db: boolean=false;

	trip:any;
	trip_form: any;
	step=1;
	today = C.TODAY();

	//show_body='show';

	constructor(
		  private geoService		: GeoService
		, private dbService		: DBService
		, private form_builder		: FormBuilder
		, private changeDetectorRef	: ChangeDetectorRef
		, public  communicationService	: CommunicationService
  		//, private zone			: NgZone
	){ 
		super(communicationService)
  		console.log("TripComponent.constructor() enter")  ;
		this.page_name= C.PAGE_TRIP;
		this.trip = { 
			  "start_lat": null
			, "start_lon": null
			, "start_display_name":null
			, "end_lat": null
			, "end_lon": null
			, "end_display_name":null
			, "distance": null
			};
  		console.debug("201809081033 TripComponent.constructor() this.trip="+ this.trip)  ;
  		console.debug("201809081034 TripComponent.constructor() exit")  ;
  	} 

	ngOnInit() {
		console.debug("201810122335 TripComponent.ngOnInit() enter");
                let form_value_from_storage = StorageService.getForm(C.KEY_FORM_TRIP);
		console.debug("201810122336 TripComponent.ngOnInit() form_value_from_storage=");
		console.debug(C.stringify(form_value_from_storage));

		if( form_value_from_storage == null ) {
			this.trip_form = this.form_builder.group(
				{
				start_loc	: ['', [Validators.required]], //sync validators must be in an array
				//start_lat	: ['', []],     
				//start_lon	: ['', []],     
				//start_display_name	: ['', []], 
				end_loc		: ['', [Validators.required]], 
				//end_lat		: ['', []], 
				//end_lon		: ['', []],
				//end_display_name	: ['', []],
				start_date	: [C.TODAY(), [Validators.required, Validators.min]], 
				departure_time	: ['10:00', [Validators.required]], 
				seats		: [3, [Validators.required]], 
				price		: [0.1, [Validators.required]], 
				recur_ind	: [false, []], 
				end_date	: [null,[Validators.min] ], 
				day0_ind	: [false, ], 
				day1_ind	: [false, ], 
				day2_ind	: [false, ], 
				day3_ind	: [false, ], 
				day4_ind	: [false, ], 
				day5_ind	: [false, ], 
				day6_ind	: [false, ], 
				description	: ['', ], 
				}, 
				{ 
					validator: this.validate_trip
				}
			);
		}
		else {
			this.trip_form = this.form_builder.group(
				{
				start_loc	: [form_value_from_storage.start_loc, [Validators.required]], //sync validators must be in an array
				//start_lat	: ['', []],     
				//start_lon	: ['', []],     
				//start_display_name	: ['', []], 
				end_loc		: [form_value_from_storage.end_loc, [Validators.required]], 
				//end_lat		: ['', []], 
				//end_lon		: ['', []],
				//end_display_name	: ['', []],
				start_date	: [C.TODAY(), [Validators.required, Validators.min]], 
				departure_time	: [form_value_from_storage.departure_time, [Validators.required]], 
				seats		: [form_value_from_storage.seats, [Validators.required]], 
				price		: [form_value_from_storage.price, [Validators.required]], 
				recur_ind	: [form_value_from_storage.recur_ind, []], 
				end_date	: [form_value_from_storage.end_date,[Validators.min] ], 
				day0_ind	: [form_value_from_storage.day0_ind, ], 
				day1_ind	: [form_value_from_storage.day1_ind, ], 
				day2_ind	: [form_value_from_storage.day2_ind, ], 
				day3_ind	: [form_value_from_storage.day3_ind, ], 
				day4_ind	: [form_value_from_storage.day4_ind, ], 
				day5_ind	: [form_value_from_storage.day5_ind, ], 
				day6_ind	: [form_value_from_storage.day6_ind, ], 
				description	: [form_value_from_storage.description, ], 
				}, 
				{ 
					validator: this.validate_trip
				}
			);
		}
		this.geocode('start_loc');
                this.geocode('end_loc');


	
		this.subscription1 = this.trip_form.valueChanges.subscribe(data=> console.log('Form value changes', data),);
		this.subscription2 = this.trip_form.statusChanges.subscribe(data=> console.log('Form status changes', data),);

		console.info("TripComponent.ngOnInit() exit");
  	}

	onSubmit() {
		this.reset_msg() ;
	    	console.warn("201808201534 TripComponent.onSubmit() this.trip_form.value=" 
			, C.stringify(this.trip_form.value) );
		// save trip to db
		// combining data
		let trip = { ...this.trip_form.value, ...this.trip};
		StorageService.storeForm(C.KEY_FORM_TRIP, trip);
		let trip_from_db_observable     = this.dbService.call_db(C.UPD_TRIP_URL, trip);
		trip_from_db_observable.subscribe(
	    		trip_from_db => {
				console.info("201808201201 TripComponent.constructor() trip_from_db =" 
					, C.stringify(trip_from_db));
				this.form_saved_to_db=true;
				this.info_msg
				='The trip is published. Other users can start to book the trip.';
				this.changeDetectorRef.detectChanges() ;
			},
			error => {
				this.error_msg=error;
				this.changeDetectorRef.detectChanges() ;
			}
		)
	}

	show_map(){
		console.debug('201810242001 TripComponent.show_map()');
		this.communicationService.send_msg(C.MSG_KEY_MAP_BODY_SHOW, {});
		let pair = C.convert_trip_to_pair(this.trip);
                this.communicationService.send_msg(C.MSG_KEY_MARKER_CLEAR, {});
                this.communicationService.send_msg(C.MSG_KEY_MARKER_PAIR, pair);
                this.communicationService.send_msg(C.MSG_KEY_MARKER_FIT, pair);
	};

	geocode(element_id: string) {
		var lat: number 	| null;
		var lon: number 	| null;
		var display_name: string| null ;
		console.info("201808212149 TripComponent.geocode() element_id =" + element_id);
		//console.info("201808212149 TripComponent.geocode()  this.geoService =" +  this.geoService);
		//console.info("201808212149 TripComponent.geocode()  this.dbService =" +  this.dbService);

		
		this.trip.distance=C.ERROR_NO_ROUTE ;
		if (element_id == "start_loc" ) {
			this.trip.start_lat=lat;
			this.trip.start_lon=lon;
			this.trip.start_display_name=display_name;
		} else {
			this.trip.end_lat=lat;
			this.trip.end_lon=lon;
			this.trip.end_display_name=display_name;
		}



		let loc = element_id =="start_loc"?this.trip_form.value.start_loc:this.trip_form.value.end_loc ;

		if (loc.length >= 3)  // must type at least 3 letters before geocoding starts
		{	
			let loc_response = this.geoService.geocode(loc) ;
			loc_response.subscribe(
				body => 	{
					console.info("201808212149 TripComponent.geocode()  body =\n" 
						,  C.stringify(body));
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
					let pair = C.convert_trip_to_pair(this.trip);
                			this.communicationService.send_msg(C.MSG_KEY_MARKER_CLEAR, {});
                			this.communicationService.send_msg(C.MSG_KEY_MARKER_PAIR, pair);
                			this.communicationService.send_msg(C.MSG_KEY_MARKER_FIT, pair);
					this.changeDetectorRef.detectChanges() ;
				}
			);
		}
		this.changeDetectorRef.detectChanges() ;
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
					console.debug("201808201201 TripComponent.routing() body =" 
						, C.stringify(body));
					if(body.routes.length>0) 
						this.trip.distance =Math.round(body.routes[0].distance/160)/10 ;
					else 
						this.trip.distance=C.ERROR_NO_ROUTE;
					this.changeDetectorRef.detectChanges() ;
				},
				error => {
					this.trip.distance=C.ERROR_NO_ROUTE;
					this.changeDetectorRef.detectChanges() ;
				}
			);
		} else this.trip.distance=C.ERROR_NO_ROUTE;
		this.changeDetectorRef.detectChanges() ;
	}

	validate_trip(fg: FormGroup): ValidationErrors | null {
		console.log("INFO 2018009080943 validate_trip fg.value=\n" ) ; 
		console.log(fg.value ) ; 
		//	console.log("INFO 2018009080943 validate_trip this.trip=" + this.trip ) ;  // this error out. this.trip is undefined. why?
		/*
		if( isNaN( this.trip.distance )   ) {
			console.log("ERROR 201807142049 validate_trip() distance unset, not routable") ; 
			return {"distance":"not routable"} ;
		}
		*/
		if (fg.value.recur_ind ===true && fg.value.end_date==null ) 
		{
			console.log("ERROR 201807142049 validate_trip() recurring but end_date unset") ; 
			return {"end_date":"is not set"} ;
		}
		else if (fg.value.recur_ind ===true && (fg.value.end_date <= fg.value.start_date)   ) 
		{
			console.log("ERROR 201807142020 validate_trip() end_date <= start_date " );
			return {"end_date":"is before start_date"} ;
		}
		/*
		else if (fg.value.recur_ind ===true && fg.value.end_date > this.next_n_days(fg.value.start_date, 92) ) 
		{
			console.log("ERROR 201807142301  end_date - start_date = " + (fg.value.end_date - fg.value.start_date) + " > 92" );
			return {"end_date":"is 92 days after start_date"} ;
		}
		*/
		else if (fg.value.recur_ind ===true && fg.value.day0_ind !== true && fg.value.day1_ind !== true 
			&& fg.value.day2_ind !== true && fg.value.day3_ind !== true && fg.value.day4_ind !== true 
			&& fg.value.day5_ind !== true && fg.value.day6_ind !== true ) {
			console.log("ERROR 201807142027  recurring but no day of week is selected" );
			return {"day of week":"is not set"} ;
		}
		return null;
	}

	next_n_days(date: string, next: number) : string{
		let one_day=1000*60*60*24;
		let since_epoch= Date.parse(date);
		let next_n_day_since_epoch= since_epoch+ next*one_day;
		let next_n_day= new Date(next_n_day_since_epoch).toJSON().slice(0,10)	
		console.log("2018009081220 next_day =" + next_n_day);
		return next_n_day;
	}

        subscription_action ( msg: any): void{
                console.debug("201810212010 TripComponent.subscriptio_action(). ignore msg");
        }

/*
  	mouseDown(event) {
    		this.element = event.target;

    		this.zone.runOutsideAngular(() => {
      		window.document.addEventListener('mousemove', this.mouseMove.bind(this));
    		});
	}

  	mouseMove(event) {
		event.preventDefault();
		//this.element.setAttribute('x', event.clientX + this.clientX + 'px');
		//this.element.setAttribute('y', event.clientX + this.clientY + 'px');
	}
*/

	// the getter is required for reactive form validation to work 
	get start_loc		() { return this.trip_form.get('start_loc'	); }  
	get end_loc		() { return this.trip_form.get('end_loc'	); }  
	get start_date		() { return this.trip_form.get('start_date'	); }
	get departure_time	() { return this.trip_form.get('departure_time'	); }
	get seats		() { return this.trip_form.get('seats'		); }
	get price		() { return this.trip_form.get('price'		); }
}
