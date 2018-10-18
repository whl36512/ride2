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
import { Constants } from '../../models/constants';
import { StorageService } from '../../models/gui.service';
import { UserService } from '../../models/gui.service';
import { MapService } from '../../models/map.service';


@Component({
  selector	: 'app-journey'			,
  templateUrl	: './journey.component.html'	,
  styleUrls	: ['./journey.component.css']	,
  changeDetection: ChangeDetectionStrategy.OnPush ,  // prevent change detection unless @Input reference is changed
})

export class JourneyComponent implements OnInit,  OnDestroy{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided

	@Input()
    	journeys_from_db: any ;

	//@Input()
    	//seats_searched: number;

	subscription1: Subscription ;
	subscription2: Subscription ;
	subscription3: Subscription ;

	is_signed_in: boolean;

	journey_forms: any =[];

	constructor(
		  private dbService		: DBService
		, private form_builder		: FormBuilder
		, private changeDetectorRef	: ChangeDetectorRef
		, private communicationService	: CommunicationService
	//	, private zone: NgZone
	){ 
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
			this.journeys_from_db[index].markertext=Number(index)+1;
			//add_form(journey);
			this.communicationService.send_marker_pair_msg( this.journeys_from_db[index]);
		}
  	}

	ngOnDestroy() {
		// prevent memory leak when component destroyed
		//this.subscription1.unsubscribe();
		//this.subscription2.unsubscribe();
	}

	book(journey: any): void {
		let search_form_value_from_storage = StorageService.getForm(Constants.KEY_FORM_SEARCH);

		let book_to_db = { journey_id	: journey.journey_id
				,pickup_loc	: search_form_value_from_storage.start_loc
				,pickup_lat	: search_form_value_from_storage.start_lat
				,pickup_lon	: search_form_value_from_storage.start_lon
				,pickup_display_name: search_form_value_from_storage.start_display_name
				,dropoff_loc	: search_form_value_from_storage.end_loc
				,dropoff_lat	: search_form_value_from_storage.end_lat
				,dropoff_lon	: search_form_value_from_storage.end_lon
				,dropoff_display_name: search_form_value_from_storage.end_display_name
				,distance	: search_form_value_from_storage.distance
				,seats		: search_form_value_from_storage.seats
				} ;
	    	console.debug("2018102208 JourneyComponent.book() book_to_db=" +JSON.stringify(book_to_db ));
		let book_from_db_observable     = this.dbService.call_db(Constants.URL_BOOK, book_to_db);
		book_from_db_observable.subscribe(
	    		book_from_db => {
				console.debug("201808201201 JourneyComponent.book() book_from_db =" + JSON.stringify(book_from_db));
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
	
/*
	calc_cost(item :number): number {
		let cost = this.seats_searched
			* this.journeys_from_db[item].price 
			* this.journeys_from_db[item].distance;

		return Math.round(cost*100)/100;

	}
*/
}
