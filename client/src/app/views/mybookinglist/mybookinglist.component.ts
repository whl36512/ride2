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
  selector	: 'app-mybookinglist'			,
  templateUrl	: './mybookinglist.component.html'	,
  styleUrls	: ['./mybookinglist.component.css']	,
  changeDetection: ChangeDetectionStrategy.OnPush ,  // prevent change detection unless @Input reference is changed
})

export class MybookinglistComponent implements OnInit,  OnDestroy{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided

	@Input()
    	bookings_from_db: any;

        msg_error 	: string;
        msg_warning 	: string;
        msg_info 	: string;

	subscription1: Subscription ;
	subscription2: Subscription ;
	subscription3: Subscription ;

        MAX_SEATS=Constants.MAX_SEATS;
        MAX_PRICE=Constants.MAX_PRICE;

	booking_forms: any =[];

	constructor(
		  private dbService		: DBService
		, private form_builder		: FormBuilder
		, private changeDetectorRef	: ChangeDetectorRef
	//	, private communicationService	: CommunicationService
	//	, private zone: NgZone
	){ 
  		console.debug("201810091832 MybookinglistComponent.constructor() enter")  ;
  		console.debug("201810091832 MybookinglistComponent.constructor() exit")  ;
  	} 

	ngOnInit() {
		console.debug("201810091833 MybookinglistComponent.ngOnInit() enter");
		console.debug("201810091833 MybookinglistComponent.ngOnInit() this.bookings_from_db = "
			+ JSON.stringify(this.bookings_from_db) );
		//this.subscription1 = this.form.valueChanges.subscribe(data => console.log('Form value changes', data));
		//this.subscription2 = this.form.statusChanges.subscribe(data => console.log('Form status changes', data));

		for ( let index in this.bookings_from_db) { // for.. in.. creates index, not object
			this.add_form(this.bookings_from_db[index]);

			this.bookings_from_db[index].show_cancel_button
				=this.bookings_from_db[index].status_cd=='B';
			this.bookings_from_db[index].show_finish_button
				=this.bookings_from_db[index].status_cd=='B';
		}
		console.debug("201810091835 MybookinglistComponent.ngOnInit() exit");
  	}

	ngOnDestroy() {
		// prevent memory leak when component destroyed
		//this.subscription1.unsubscribe();
		//this.subscription2.unsubscribe();
	}

	add_form (booking: any) : void {
		console.debug("201810091834 MybookinglistComponent.add_form() booking = "
			+ JSON.stringify(booking) );
		let booking_form = this.form_builder.group({
                                book_id  : [booking.book_id, []],
                                //seats       : [booking.seats, []],
                                //price       : [journey.price, []],
                                }
                        );
		console.debug("201810091837 MybookinglistComponent.add_form() booking_form="+ JSON.stringify(booking_form.value));

		this.booking_forms.push(booking_form);

	}

	update(booking_form: any, index: number): void {
	    	console.debug("201810091838 MybookinglistComponent.update() booking_form=" 
			+ JSON.stringify(booking_form.value) );
		let booking_to_db = booking_form.value;
		let booking_from_db_observable 
			= this.dbService.call_db(Constants.URL_CANCEL_BOOKING, booking_to_db);
		booking_from_db_observable.subscribe(
	    		booking_from_db => {
				console.debug("201810091839 MybookinglistComponent.update() booking_from_db =" + JSON.stringify(booking_from_db));
				if ( booking_from_db.status_cd == "R" ){ //cancel by rider
					this.bookings_from_db[index].show_cancel_button=false;
					this.bookings_from_db[index].show_finish_button=false;
					this.bookings_from_db[index].show_finish_msg=false;
					this.bookings_from_db[index].show_cancel_msg=true;
					this.bookings_from_db[index].show_fail_msg=false; 
					this.bookings_from_db[index].book_status_description=null;
					
				}
				else { 
					this.bookings_from_db[index].show_fail_msg=true; 
				}
				this.changeDetectorRef.detectChanges();
				
			},
			error => {
				this.msg_error=error;
				this.bookings_from_db[index].show_fail_msg=true; 
				this.changeDetectorRef.detectChanges();
			}
		)
	}

	finish(booking_form: any, index: number): void {
	    	console.debug("201810091838 MybookinglistComponent.finish() booking_form=" 
			+ JSON.stringify(booking_form.value) );
		let booking_to_db = booking_form.value;
		let booking_from_db_observable 
			= this.dbService.call_db(Constants.URL_FINISH, booking_to_db);
		booking_from_db_observable.subscribe(
	    		booking_from_db => {
				console.debug("201810091839 MybookinglistComponent.finsh() booking_from_db =" + JSON.stringify(booking_from_db));
				if ( booking_from_db.status_cd == "F" ){ 
					//booking is finished. only rider can finish a booking
					this.bookings_from_db[index].show_cancel_button=false;
					this.bookings_from_db[index].show_finish_button=false;
					this.bookings_from_db[index].show_finish_msg=true;
					this.bookings_from_db[index].show_cancel_msg=false;
					this.bookings_from_db[index].show_fail_msg=false; 
					this.bookings_from_db[index].book_status_description=null;
					
				}
				else { 
					this.bookings_from_db[index].show_fail_msg=true; 
				}
				this.changeDetectorRef.detectChanges();
				
			},
			error => {
				this.msg_error=error;
				this.bookings_from_db[index].show_fail_msg=true; 
				this.changeDetectorRef.detectChanges();
			}
		)
	}
}
