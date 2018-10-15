// https://angular.io/guide/reactive-forms
// https://angular.io/guide/form-validation

import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { HostListener } from '@angular/core';
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
  selector	: 'app-bookings'			,
  templateUrl	: './bookings.component.html'	,
  styleUrls	: ['./bookings.component.css']	,
  changeDetection: ChangeDetectionStrategy.OnPush ,  // prevent change detection unless @Input reference is changed
})

export class BookingsComponent implements OnInit,  OnDestroy{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided

	@Input()
    	bookings_from_db: any;

	@Input()
    	filter: any;

	@HostListener('keydown', ['$event']) 
	onAnyEvent(e) {
       		 console.debug('201810131753 BookingsComponent.onAnyEvent() event=', e);
    	}


        error_msg : string;
        warning_msg : string;
        info_msg : string;
	change_detect_count: number =0;

	subscription1: Subscription ;
	subscription2: Subscription ;
	subscription3: Subscription ;

        MAX_SEATS=Constants.MAX_SEATS;
        MAX_PRICE=Constants.MAX_PRICE;

	booking_forms: any =[];

	Constants = Constants;

	constructor(
		  private dbService		: DBService
		, private form_builder		: FormBuilder
		, private changeDetectorRef	: ChangeDetectorRef
	//	, private communicationService	: CommunicationService
	//	, private zone: NgZone
	){ 
  		console.debug("201809262245 BookingsComponent.constructor() enter")  ;
  		console.debug("201809262245 BookingsComponent.constructor() exit")  ;
  	} 

	ngOnInit() {
		console.debug("201809262246 BookingsComponent.ngOnInit() enter");
		console.debug("201809262246 BookingsComponent.ngOnInit() this.bookings_from_db = "
			+ JSON.stringify(this.bookings_from_db) );
		//this.subscription1 = this.form.valueChanges.subscribe(data => console.log('Form value changes', data));
		//this.subscription2 = this.form.statusChanges.subscribe(data => console.log('Form status changes', data));

		for ( let index in this.bookings_from_db) { // for.. in.. creates index, not object
			this.add_form(this.bookings_from_db[index]);
			this.reset_msg(Number(index));

			this.bookings_from_db[index].show_update_button
				= this.bookings_from_db[index].book_id == null ;
			this.bookings_from_db[index].show_confirm_button
				= this.bookings_from_db[index].status_cd == 'P' ;
			this.bookings_from_db[index].show_reject_button
				= this.bookings_from_db[index].status_cd == 'P' ;
			this.bookings_from_db[index].show_cancel_button	
				= this.bookings_from_db[index].status_cd == 'B' ;
		}
		console.debug("201809262246 BookingsComponent.ngOnInit() exit");
  	}

	ngOnDestroy() {
		// prevent memory leak when component destroyed
		//this.subscription1.unsubscribe();
		//this.subscription2.unsubscribe();
	}

	add_form (booking: any) : void {
		console.debug("201810072302 BookingsComponent.add_form() booking = "
			+ JSON.stringify(booking) );
		let booking_form = this.form_builder.group({
                                journey_id  : [booking.journey_id, []],
                                book_id     : [booking.book_id, []],
                                seats       : [booking.seats, []],
                                price       : [booking.price, []],
                                }
                        );
		console.debug("201810072247 BookingsComponent.add_form() booking_form="+ JSON.stringify(booking_form.value));

		this.booking_forms.push(booking_form);

	}

	reset_msg(index: number) : void{
		this.bookings_from_db[index].show_fail_msg=false;
		this.error_msg=null ;
		this.warning_msg=null ;
		this.info_msg=null ;
	}

	reset_button(index: number) : void{
		this.bookings_from_db[index].show_cancel_button=false;
		this.bookings_from_db[index].show_reject_button=false;
		this.bookings_from_db[index].show_confirm_button=false;
	}

	update(booking_form: any, index: number): void {
	    	console.debug("201809261901 BookingsComponent.update() booking_form=" 
			+ JSON.stringify(booking_form.value) );
		let booking_to_db = booking_form.value;
		let booking_from_db_observable     = this.dbService.call_db(Constants.URL_UPD_JOURNEY, booking_to_db);
		booking_from_db_observable.subscribe(
	    		booking_from_db => {
				console.debug("201810072326 BookingsComponent.update() booking_from_db =" + JSON.stringify(booking_from_db));

				this.reset_msg(index);
				this.bookings_from_db[index].show_update_msg=true;
				this.changeDetectorRef.detectChanges() ;
				
			},
			error => {
				this.reset_msg(index);
				this.error_msg=error;
				this.bookings_from_db[index].show_fail_msg=true;
				this.changeDetectorRef.detectChanges() ;
			}
		)
		
	}

	action(booking_form: any, index: number, action : string): void {
	    	console.debug("201809261901 BookingsComponent.action() booking_form=" 
			+ JSON.stringify(booking_form.value) );
		let booking_to_db = booking_form.value;
		let booking_from_db_observable     
			= this.dbService.call_db(action, booking_to_db);
		booking_from_db_observable.subscribe(
	    		booking_from_db => {
				console.debug("201810072326 BookingsComponent.action() booking_from_db =" + JSON.stringify(booking_from_db));
				
				this.reset_msg(index);
				
				if ( booking_from_db.status_cd==this.bookings_from_db[index].status_cd){
					// no status_cd change
					this.bookings_from_db[index].show_faile_msg=true;
				}
				else if ( booking_from_db.status_cd == 'B') {
					this.bookings_from_db[index].status_cd= booking_from_db.status_cd;
					this.reset_button(index);
					this.bookings_from_db[index].show_cancel_button=true;
					this.bookings_from_db[index].book_status_description='Confirmed';
				}
				else if ( booking_from_db.status_cd == 'J') {
					this.bookings_from_db[index].status_cd= booking_from_db.status_cd;
					this.reset_button(index);
					this.bookings_from_db[index].book_status_description='Rejected';
				}
				else if ( booking_from_db.status_cd == 'D') {
					this.bookings_from_db[index].status_cd= booking_from_db.status_cd;
					this.reset_button(index);
					this.bookings_from_db[index].book_status_description='Cancelled'
				}
				else if ( booking_from_db.status_cd == 'F') {
					this.bookings_from_db[index].status_cd= booking_from_db.status_cd;
					this.reset_button(index);
					this.bookings_from_db[index].book_status_description='Finished'
				}
				
				this.changeDetectorRef.detectChanges();
				
			},
			error => {
				this.reset_msg(index);
				//this.error_msg=error;
				this.bookings_from_db[index].show_fail_msg=true;
				this.changeDetectorRef.detectChanges();
			}
		)
		
	}

	change_detect_counter(e): number
	{
  		console.debug("201810131845 BookingsComponent.change_detect_counter() event=", e)  ;
		return this.change_detect_count ++;	
	}

}
