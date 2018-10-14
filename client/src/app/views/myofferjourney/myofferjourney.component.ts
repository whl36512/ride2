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
//import { StorageService } from '../../models/gui.service';
import { UserService } from '../../models/gui.service';


@Component({
  selector	: 'app-myofferjourney'			,
  templateUrl	: './myofferjourney.component.html'	,
  styleUrls	: ['./myofferjourney.component.css']	,
  changeDetection: ChangeDetectionStrategy.OnPush ,  // prevent change detection unless @Input reference is changed
})

export class MyofferjourneyComponent implements OnInit,  OnDestroy{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided

	@Input()
    	journeys_from_db: any;

        error_msg : string;
        warning_msg : string;
        info_msg : string;

	subscription1: Subscription ;
	subscription2: Subscription ;
	subscription3: Subscription ;

        MAX_SEATS=Constants.MAX_SEATS;
        MAX_PRICE=Constants.MAX_PRICE;

	journey_forms: any =[];

	Constants = Constants;

	constructor(
		  private dbService		: DBService
		, private form_builder		: FormBuilder
		, private changeDetectorRef	: ChangeDetectorRef
	//	, private communicationService	: CommunicationService
	//	, private zone: NgZone
	){ 
  		console.debug("201809262245 MyofferjourneyComponent.constructor() enter")  ;
  		console.debug("201809262245 MyofferjourneyComponent.constructor() exit")  ;
  	} 

	ngOnInit() {
		console.debug("201809262246 MyofferjourneyComponent.ngOnInit() enter");
		console.debug("201809262246 MyofferjourneyComponent.ngOnInit() this.journeys_from_db = "
			+ JSON.stringify(this.journeys_from_db) );
		//this.subscription1 = this.form.valueChanges.subscribe(data => console.log('Form value changes', data));
		//this.subscription2 = this.form.statusChanges.subscribe(data => console.log('Form status changes', data));

		for ( let index in this.journeys_from_db) { // for.. in.. creates index, not object
			this.add_form(this.journeys_from_db[index]);
			this.reset_msg(Number(index));

			this.journeys_from_db[index].show_confirm_button
				= this.journeys_from_db[index].status_cd == 'P' ;
			this.journeys_from_db[index].show_reject_button
				= this.journeys_from_db[index].status_cd == 'P' ;
			this.journeys_from_db[index].show_cancel_button	
				= this.journeys_from_db[index].status_cd == 'B' ;
		}
		console.debug("201809262246 MyofferjourneyComponent.ngOnInit() exit");
  	}

	ngOnDestroy() {
		// prevent memory leak when component destroyed
		//this.subscription1.unsubscribe();
		//this.subscription2.unsubscribe();
	}

	add_form (journey: any) : void {
		console.debug("201810072302 MyofferjourneyComponent.add_form() journey = "
			+ JSON.stringify(journey) );
		let journey_form = this.form_builder.group({
                                journey_id  : [journey.journey_id, []],
                                book_id     : [journey.book_id, []],
                                seats       : [journey.seats, []],
                                price       : [journey.price, []],
                                }
                        );
		console.debug("201810072247 MyofferjourneyComponent.add_form() journey_form="+ JSON.stringify(journey_form.value));

		this.journey_forms.push(journey_form);

	}

	reset_msg(index: number) : void{
		//this.journeys_from_db[index].show_update_msg=false;
		//this.journeys_from_db[index].show_confirm_msg=false;
		//this.journeys_from_db[index].show_reject_msg=false;
		//this.journeys_from_db[index].show_cancel_msg=false;
		this.journeys_from_db[index].show_fail_msg=false;
		this.error_msg=null ;
		this.warning_msg=null ;
		this.info_msg=null ;
	}

	reset_button(index: number) : void{
		this.journeys_from_db[index].show_cancel_button=false;
		this.journeys_from_db[index].show_reject_button=false;
		this.journeys_from_db[index].show_confirm_button=false;
	}

	update(journey_form: any, index: number): void {
	    	console.debug("201809261901 MyofferjourneyComponent.update() journey_form=" 
			+ JSON.stringify(journey_form.value) );
		let journey_to_db = journey_form.value;
		let journey_from_db_observable     = this.dbService.call_db(Constants.URL_UPD_JOURNEY, journey_to_db);
		journey_from_db_observable.subscribe(
	    		journey_from_db => {
				console.debug("201810072326 MyofferjourneyComponent.update() journey_from_db =" + JSON.stringify(journey_from_db));

				this.reset_msg(index);
				this.journeys_from_db[index].show_update_msg=true;
				this.changeDetectorRef.detectChanges() ;
				
			},
			error => {
				this.reset_msg(index);
				this.error_msg=error;
				this.journeys_from_db[index].show_fail_msg=true;
				this.changeDetectorRef.detectChanges() ;
			}
		)
		
	}

	reject(journey_form: any, index: number): void {
	    	console.debug("201809261901 MyofferjourneyComponent.update() journey_form=" 
			+ JSON.stringify(journey_form.value) );
		let journey_to_db = journey_form.value;
		let journey_from_db_observable     = this.dbService.call_db(Constants.URL_REJECT, journey_to_db);
		journey_from_db_observable.subscribe(
	    		journey_from_db => {
				console.debug("201810072326 MyofferjourneyComponent.update() journey_from_db =" + JSON.stringify(journey_from_db));
				
				this.reset_msg(index);
				
				// failure if status_cd doesn't change
				if ( journey_from_db.status_cd==this.journeys_from_db[index].status_cd){
					this.reset_msg(index);
					this.journeys_from_db[index].show_fail_msg =true;
				}
				else if (journey_from_db.status_cd=='J') {
					this.reset_msg(index);
					this.reset_button(index);

					this.journeys_from_db[index].status_cd= journey_from_db.status_cd;
					this.journeys_from_db[index].show_reject_msg=true;
					this.journeys_from_db[index].book_status_description=null;
				}
				else if ( journey_from_db.status_cd == 'D') {
					this.reset_msg(index);
					this.reset_button(index);
					this.journeys_from_db[index].status_cd= journey_from_db.status_cd;
					this.journeys_from_db[index].show_cancel_msg=true;

					this.journeys_from_db[index].book_status_description=null;
				}
						

				this.changeDetectorRef.detectChanges();
				
			},
			error => {
				this.error_msg=error;
				this.reset_msg(index);
				this.journeys_from_db[index].show_fail_msg=true;
				this.changeDetectorRef.detectChanges()
			}
		)
		
	}

	confirm(journey_form: any, index: number): void {
	    	console.debug("201809261901 MyofferjourneyComponent.update() journey_form=" 
			+ JSON.stringify(journey_form.value) );
		let journey_to_db = journey_form.value;
		let journey_from_db_observable     = this.dbService.call_db(Constants.URL_CONFIRM, journey_to_db);
		journey_from_db_observable.subscribe(
	    		journey_from_db => {
				console.debug("201810072326 MyofferjourneyComponent.update() journey_from_db =" + JSON.stringify(journey_from_db));
				
				this.reset_msg(index);
				
				if ( journey_from_db.status_cd==this.journeys_from_db[index].status_cd){
					this.journeys_from_db[index].show_faile_msg=true;
				}
				else if ( journey_from_db.status_cd == 'B') {
					this.journeys_from_db[index].status_cd= journey_from_db.status_cd;
					this.reset_button(index);
					this.journeys_from_db[index].show_confirm_msg=true ;
					this.journeys_from_db[index].show_cancel_button=true ;
					this.journeys_from_db[index].book_status_description=null;
				}
				this.changeDetectorRef.detectChanges();
				
			},
			error => {
				this.reset_msg(index);
				this.error_msg=error;
				this.journeys_from_db[index].show_fail_msg=true;
				this.changeDetectorRef.detectChanges();
			}
		)
		
	}

	action(journey_form: any, index: number, action : string): void {
	    	console.debug("201809261901 MyofferjourneyComponent.action() journey_form=" 
			+ JSON.stringify(journey_form.value) );
		let journey_to_db = journey_form.value;
		let journey_from_db_observable     
			= this.dbService.call_db(action, journey_to_db);
		journey_from_db_observable.subscribe(
	    		journey_from_db => {
				console.debug("201810072326 MyofferjourneyComponent.action() journey_from_db =" + JSON.stringify(journey_from_db));
				
				this.reset_msg(index);
				
				if ( journey_from_db.status_cd==this.journeys_from_db[index].status_cd){
					// no status_cd change
					this.journeys_from_db[index].show_faile_msg=true;
				}
				else if ( journey_from_db.status_cd == 'B') {
					this.journeys_from_db[index].status_cd= journey_from_db.status_cd;
					this.reset_button(index);
					this.journeys_from_db[index].show_cancel_button=true;
					this.journeys_from_db[index].book_status_description='Confirmed';
				}
				else if ( journey_from_db.status_cd == 'J') {
					this.journeys_from_db[index].status_cd= journey_from_db.status_cd;
					this.reset_button(index);
					this.journeys_from_db[index].book_status_description='Rejected';
				}
				else if ( journey_from_db.status_cd == 'D') {
					this.journeys_from_db[index].status_cd= journey_from_db.status_cd;
					this.reset_button(index);
					this.journeys_from_db[index].book_status_description='Cancelled'
				}
				
				this.changeDetectorRef.detectChanges();
				
			},
			error => {
				this.reset_msg(index);
				//this.error_msg=error;
				this.journeys_from_db[index].show_fail_msg=true;
				this.changeDetectorRef.detectChanges();
			}
		)
		
	}
}
