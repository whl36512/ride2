// https://angular.io/guide/reactive-forms
// https://angular.io/guide/form-validation

import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { NgZone  } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';
import { AbstractControl} from '@angular/forms';
import { Subscription }   from 'rxjs';

import { EventEmitter, Input, Output} from '@angular/core';

import {GeoService} from '../../models/remote.service' ;
import {DBService} from '../../models/remote.service' ;
import {CommunicationService} from '../../models/communication.service' ;
import { AppComponent } from '../../app.component';
import { C } 			from '../../models/constants';
import { Ridebase } 			from '../../models/ridebase';
import { StorageService } from '../../models/gui.service';
import { UserService } from '../../models/gui.service';
import { DotIcon } from '../../models/map.service';
import { PinIcon } from '../../models/map.service';


@Component({
  selector	: 'app-journey'			,
  templateUrl	: './journey.component.html'	,
  styleUrls	: ['./journey.component.css']	,
  changeDetection: ChangeDetectionStrategy.OnPush ,  // prevent change detection unless @Input reference is changed
})

export class JourneyComponent extends Ridebase implements OnInit{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided

	@Input()
    	journeys_from_db: any ;
	@Input()
	search_criteria: any;


	journey_forms: any =[];

	constructor(
		  private dbService		: DBService
		, private form_builder		: FormBuilder
		, private changeDetectorRef	: ChangeDetectorRef
		, public communicationService	: CommunicationService
	//	, private zone: NgZone
	){ 
		super(communicationService);
  		console.debug("201809262245 JourneyComponent.constructor() enter")  ;
		this.is_signed_in= UserService.is_signed_in();
  		console.debug("201809262245 JourneyComponent.constructor() exit")  ;
  	} 

	ngOnInit() {
		console.debug("201809262246 JourneyComponent.ngOnInit() enter");
		//this.subscription1 = this.form.valueChanges.subscribe(data => console.log('Form value changes', data));
		//this.subscription2 = this.form.statusChanges.subscribe(data => console.log('Form status changes', data));
		console.debug("201809262246 JourneyComponent.ngOnInit() exit");
		for ( let index in this.journeys_from_db) {
			this.journeys_from_db[index].show_fail_msg=false;
			this.journeys_from_db[index].show_book_msg=false;
			this.journeys_from_db[index].show_balance_msg
				=!this.journeys_from_db[index].sufficient_balance;
			this.journeys_from_db[index].show_book_button
				=this.journeys_from_db[index].sufficient_balance;
			//add_form(journey);

			let pair = C.convert_trip_to_pair(this.journeys_from_db[index]);
			pair.p1.icon_type= DotIcon ;
			pair.p2.icon_type= DotIcon ;
			pair.p1.marker_text= 'D'+ (Number(index)+1);
			pair.p2.marker_text= 'D'+ (Number(index)+1);
			this.communicationService.send_msg(C.MSG_KEY_MARKER_PAIR, pair);
		}
  	}

	book(journey: any): void {
		let book_to_db = { 
				 journey_id	: journey.journey_id
				,pickup_loc	: this.search_criteria.start_loc
				,pickup_lat	: this.search_criteria.start_lat
				,pickup_lon	: this.search_criteria.start_lon
				,pickup_display_name: this.search_criteria.start_display_name
				,dropoff_loc	: this.search_criteria.end_loc
				,dropoff_lat	: this.search_criteria.end_lat
				,dropoff_lon	: this.search_criteria.end_lon
				,dropoff_display_name: this.search_criteria.end_display_name
				,distance	: this.search_criteria.distance
				,seats		: this.search_criteria.seats
				} ;
	    	console.debug("2018102208 JourneyComponent.book() book_to_db=" 
			,C.stringify(book_to_db ));
		let book_from_db_observable     = this.dbService.call_db(C.URL_BOOK, book_to_db);
		book_from_db_observable.subscribe(
	    		book_from_db => {
				console.debug("201808201201 JourneyComponent.book() book_from_db =" + C.stringify(book_from_db));
				journey.show_book_msg= book_from_db.status_cd=='P';
				journey.show_fail_msg= book_from_db.status_cd!='P';
				//journey.show_balance_msg=!journey.sufficient_balance;

				journey.show_book_button= book_from_db.status_cd!='P';
				journey.seats_booked= journey.seats_booked
							+ book_from_db.seats;
				this.changeDetectorRef.detectChanges();
				
			},
			_ => {
				journey.show_book_msg=false;
				journey.show_fail_msg=true;
				this.changeDetectorRef.detectChanges();
			}
		)
		
	}

	subscription_action ( msg: any): void{
        	console.debug("201810212243 JourneyComponent.subscriptio_action(). ignore msg");
	}

        show_map(index: number){
                this.communicationService.send_msg(C.MSG_KEY_MAP_BODY_SHOW, {});
                this.communicationService.send_msg(C.MSG_KEY_MARKER_CLEAR, {});
                let pair = C.convert_trip_to_pair(this.journeys_from_db[index]);
                this.communicationService.send_msg(C.MSG_KEY_MARKER_FIT, pair);
		pair.p1.icon_type=DotIcon;
		pair.p2.icon_type=DotIcon;
		pair.p1.marker_text=index+1;
		pair.p2.marker_text=index+1;
                this.communicationService.send_msg(C.MSG_KEY_MARKER_PAIR, pair);

                pair = C.convert_trip_to_pair(this.search_criteria);
		pair.p1.icon_type=PinIcon;
		pair.p2.icon_type=PinIcon;
                this.communicationService.send_msg(C.MSG_KEY_MARKER_PAIR, pair);
        }

}
