// https://angular.io/guide/reactive-forms
// https://angular.io/guide/form-validation

import { Component		} from '@angular/core';
import { OnInit 		} from '@angular/core';
//import { OnDestroy 		} from '@angular/core';
//import { NgZone  		} from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl 		} from '@angular/forms';
import { FormGroup 		} from '@angular/forms';
import { FormArray 		} from '@angular/forms';
import { FormBuilder 		} from '@angular/forms';
import { Validators 		} from '@angular/forms';
import { ValidatorFn 		} from '@angular/forms';
import { ValidationErrors 	} from '@angular/forms';
import { AbstractControl	} from '@angular/forms';

//import { Subscription 	} from 'rxjs';

//import { EventEmitter		} from '@angular/core';
//import { Output		} from '@angular/core';
//import { Input		} from '@angular/core';

import { GeoService		} from '../../models/remote.service' ;
import { DBService		} from '../../models/remote.service' ;
import { CommunicationService	} from '../../models/communication.service' ;
import { AppComponent 		} from '../../app.component';
//import { Constants 		} from '../../models/constants';
import { C 			} from '../../models/constants';
import { Ridebase 		} from '../../models/ridebase';
import { StorageService		} from '../../models/gui.service';
import { PinIcon		} from "../../models/map.service"



@Component({
  selector	: 'app-search-setting'			,
  templateUrl	: './search-setting.component.html'	,
  styleUrls	: ['./search-setting.component.css']	,
  changeDetection: ChangeDetectionStrategy.OnPush ,

})

export class SearchSettingComponent extends Ridebase implements OnInit{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided

	trip:any;
	trip_before_geocode : any;
	form: any;
	step=1;

	constructor(
		  private geoService		: GeoService
		, private dbService		: DBService
		, private form_builder		: FormBuilder
		, public communicationService	: CommunicationService
		, private changeDetectorRef : ChangeDetectorRef

		//, private zone: NgZone
	){ 
		super(communicationService)
  		console.debug("SearchSettingComponent.constructor() enter")  ;

  		console.debug("201810291813 SearchSettingComponent.constructor() exit")  ;
  	} 

	ngOnInit() {
		console.debug("201810291814 SearchSettingComponent.ngOnInit() enter");
		let today = C.TODAY();
		let trip = StorageService.getForm(C.KEY_FORM_SEARCH);
		if ( !trip ) { 
			trip = this.Util.create_rider_criteria();
		}
		console.debug("201810291814 SearchSettingComponent.ngOnInit() trip=",
			C.stringify(trip));
	
		trip.date1 =  today > trip.date1 ? today: trip.date1 ;

		trip.date2 = trip.date1 > trip.date2 ? trip.date1: trip.date2 ;

		this.trip=trip;
		StorageService.storeForm(C.KEY_FORM_SEARCH, trip);
		this.form = this.form_builder.group({
			date1			: [trip.date1, [Validators.min,Validators.required]], 
			date2			: [trip.date2, [Validators.min, Validators.required]], 
			p1_loc			: [trip.p1.loc, [Validators.required]],
			p2_loc			: [trip.p2.loc, [Validators.required]], 
			departure_time	: [trip.departure_time, []], 
			seats			: [trip.seats, [Validators.required]], 
			price			: [trip.price, [Validators.required]], 
		});
		this.show_map();
		//this.subscription1 = this.form.valueChanges
			//.subscribe( data => console.log('Form value changes', data));
		//this.subscription2 = this.form.statusChanges
			//.subscribe(data => console.log('Form status changes', data));
		console.info("SearchSettingComponent.ngOnInit() exit");
  	}

	save() {
	    	console.debug("201809231416 SearchSettingComponent.onSubmit() this.form.value=" 
				, C.stringify(this.form.value) );
		this.reset_msg();
		// combining data
		this.trip = { ...this.trip, ...this.form.value};
		this.trip.p1.loc = this.form.value.p1_loc;
		this.trip.p2.loc = this.form.value.p2_loc;
		delete this.trip.p1_loc;
		delete this.trip.p2_loc;
		StorageService.storeForm(C.KEY_FORM_SEARCH, this.trip); 
		this.info_msg = 'Saved successfully';
	}
	
	geocode(element_id: string) {
		console.info("201800111346 SearchSettingComponent.geocode() element_id =" + element_id);

		this.trip_before_geocode = this.Util.deep_copy(this.trip) ; 
		var p :any ;
		let loc_old  ='';

		if (element_id == "p1_loc" ) {
			p= this.trip.p1 ;
			loc_old = p.loc
			p.loc = this.form.value.p1_loc;
		} else {
			p= this.trip.p2;
			loc_old= p.loc
			p.loc = this.form.value.p2_loc;
		}

		if(loc_old.trim() === p.loc.trim()) return; // no change
		if (p.loc.length < 3) {
			p.lat = null;
			p.lon = null;
			p.display_name= null;
			this.changeDetectorRef.detectChanges();
			this.routing();
			return; // must type at least 3 letters before geocoding starts
		} 

		else {
			let loc_response = this.geoService.geocode(p.loc) ;
			loc_response.subscribe(
				body => 	{
					console.debug("201809111347 SearchSettingComponent.geocode()  body=" );
					console.debug( C.stringify(body) );
					if (body[0]) {
						p.lat			=body[0].lat ;
						p.lon			=body[0].lon ;
						p.display_name=body[0].display_name ;
					}
					else {
						p.lat = null;
						p.lon = null;
						p.display_name= null;
					}
					this.changeDetectorRef.detectChanges();
					this.routing();
				//	this.show_map()
				}
			);
		}
	}

	routing() 
	{
		if ( !this.trip.p1.display_name || ! this.trip.p2.display_name) {
			this.trip.distance=C.ERROR_NO_ROUTE ;
			this.changeDetectorRef.detectChanges();
			return;
		}
		if ( 	this.trip.p1.lat == this.trip_before_geocode.p1.lat
				&&	this.trip.p1.lon == this.trip_before_geocode.p1.lon
				&&	this.trip.p2.lat == this.trip_before_geocode.p2.lat
				&&	this.trip.p2.lon == this.trip_before_geocode.p2.lon) { 
				// no change of latlon. Skip routing
				this.trip.distance= this.trip_before_geocode.distance;
				this.changeDetectorRef.detectChanges();
				return;
		}
	
		//both start and end are geocoded. So we can calc routes
		let route_response = this.geoService.routing(
				  this.trip.p1.lat
				, this.trip.p1.lon
				, this.trip.p2.lat
				, this.trip.p2.lon
			);
		route_response.subscribe(
			body => {
				console.info("201808201201 SearchSettingComponent.routing() body =" , C.stringify(body));
				if( body.routes.length >0 ) {
					let distance=body.routes[0].distance ;
					this.trip.distance= Math.round(distance /160)/10;
					this.changeDetectorRef.detectChanges();
				}
				else {
					this.trip.distance=C.ERROR_NO_ROUTE ;
					this.changeDetectorRef.detectChanges();
				}
			},
			error => {
				this.trip.distance=C.ERROR_NO_ROUTE ;
				this.changeDetectorRef.detectChanges();
			}
		);
	}

	subscription_action ( msg: any): void{
		console.debug("201810212010 SearchSettingComponent.subscriptio_action(). ignore msg");
	}

	show_map(){
		//this.communicationService.send_msg(C.MSG_KEY_MAP_BODY_SHOW, {});
		let pair = JSON.parse(C.stringify(this.trip));
		this.communicationService.send_msg(C.MSG_KEY_MARKER_CLEAR, {});
		pair.p1.icon_type=PinIcon;
		pair.p2.icon_type=PinIcon;
		this.communicationService.send_msg(C.MSG_KEY_MARKER_PAIR, pair);
		this.communicationService.send_msg(C.MSG_KEY_MARKER_FIT,  pair);
	}


	// the getter is required for reactive form validation to work 
	get p1_loc		() { return this.form.get('p1_loc'	); }  
	get p2_loc		() { return this.form.get('p2_loc'	); }  
	get date1		() { return this.form.get('date1'	); }
	get departure_time	() { return this.form.get('departure_time'	); }
	get seats		() { return this.form.get('seats'		); }
	get price		() { return this.form.get('price'		); }
}
