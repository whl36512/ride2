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
import { timer } from 'rxjs' ;

import {GeoService} from '../../models/remote.service' ;
import {DBService} from '../../models/remote.service' ;
import {CommunicationService} from '../../models/communication.service' ;
import { AppComponent } from '../../app.component';
import { Constants } from '../../models/constants';
//import { StorageService } from '../../models/gui.service';
import { UserService } from '../../models/gui.service';


@Component({
  selector	: 'app-message'			,
  templateUrl	: './message.component.html'	,
  styleUrls	: ['./message.component.css']	,
  changeDetection: ChangeDetectionStrategy.OnPush ,  // prevent change detection unless @Input reference is changed
})

export class MessageComponent implements OnInit,  OnDestroy{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided

	@Input()
    	book_id: string;

	//@Input()
    	msgs_from_db: any= [];

	//@HostListener('keydown', ['$event']) 

        error_msg : string;
        warning_msg : string;
        info_msg : string;
	change_detect_count: number =0;

	subscription1: Subscription ;
	subscription2: Subscription ;
	subscription3: Subscription ;

        Constants = Constants;

	msg_form: any ;
	timer;
	timer_sub;

	constructor(
		  private dbService		: DBService
		, private form_builder		: FormBuilder
		, private changeDetectorRef	: ChangeDetectorRef
	//	, private communicationService	: CommunicationService
	//	, private zone: NgZone
	){ 

		this.timer = timer(200, Constants.MSG_TIMER_WAIT);
		this.subscription1 = this.timer.subscribe(
			// val will be 0, 1,2,3,...
			val => {this.get_msgs_from_db()},
			);
  		console.debug("201809262245 MessageComponent.constructor() enter")  ;
  		console.debug("201809262245 MessageComponent.constructor() exit")  ;
  	} 

	ngOnInit() {
		console.debug("201809262246 MessageComponent.ngOnInit() enter");
		//this.subscription1 = this.form.valueChanges.subscribe(data => console.log('Form value changes', data));
		//this.subscription2 = this.form.statusChanges.subscribe(data => console.log('Form status changes', data));
		this.warning_msg=' Loading ...' ;
		this.get_form();
		console.debug("201809262246 MessageComponent.ngOnInit() exit");
  	}

	ngOnDestroy() {
		// prevent memory leak when component destroyed
		this.subscription1.unsubscribe();
		//this.subscription2.unsubscribe();
	}

	onSubmit(){}

	get_form(): void {
		this.msg_form = this.form_builder.group({
                                book_id	: [this.book_id, []],
                                msg	: ['', []],
                                }
                        );
	}

/*
	add_form (booking: any) : void {
		console.debug("201810072302 MessageComponent.add_form() booking = "
			+ JSON.stringify(booking) );
		let booking_form = this.form_builder.group({
                                journey_id  : [booking.journey_id, []],
                                book_id     : [booking.book_id, []],
                                seats       : [booking.seats, []],
                                price       : [booking.price, []],
                                }
                        );
		console.debug("201810072247 MessageComponent.add_form() booking_form="+ JSON.stringify(booking_form.value));

		this.msg_form.push(booking_form);

	}
*/

	reset_msg(index: number) : void{
		//this.msgs_from_db[index].show_fail_msg=false;
		//this.msgs_from_db[index].show_update_msg=false;
		this.error_msg=null ;
		this.warning_msg=null ;
		this.info_msg=null ;
	}

/*
	reset_button(index: number) : void{
		this.msgs_from_db[index].show_driver_cancel_button=false;
		this.msgs_from_db[index].show_rider_cancel_button=false;
		this.msgs_from_db[index].show_reject_button=false;
		this.msgs_from_db[index].show_confirm_button=false;
		this.msgs_from_db[index].show_finish_button=false;
		this.msgs_from_db[index].show_msg_button=false;
	}

*/
	action(form: any, index: number, action : string): void {
		this.reset_msg(0); // remove msg and show it again, so fade would work
		this.changeDetectorRef.detectChanges();   // have to do this so fade would work

	    	console.debug("201810182231 MessageComponent.action() form=" 
			, JSON.stringify(form.value, null,2) );
		let msg_to_db = form.value;
		msg_to_db.book_id= this.book_id;

		let data_from_db_observable     
			= this.dbService.call_db(action, msg_to_db);

		data_from_db_observable.subscribe(
	    		msg_from_db => {
				console.debug("201810072326 MessageComponent.action() msg_from_db =" 
					, JSON.stringify(msg_from_db, null, 2));
				this.get_form();
				msg_from_db.user_is='Me'; 
				this.msgs_from_db.push(msg_from_db);
				this.changeDetectorRef.detectChanges();
			},
			error => {
				//this.error_msg=error;
				this.error_msg=error;
				this.changeDetectorRef.detectChanges();
			}
		)
	}

	get_msgs_from_db(): void {
                this.reset_msg(0); // remove msg and show it again, so fade would work
                this.changeDetectorRef.detectChanges();   // have to do this so fade would work
		

		var latest_c_ts = '1970-01-01';
		if ( this.msgs_from_db.length != 0) latest_c_ts = this.msgs_from_db[this.msgs_from_db.length-1].c_ts;
                let data_from_db_observable
                        = this.dbService.call_db(Constants.URL_MSGS
				, {book_id: this.book_id, c_ts: latest_c_ts});
                data_from_db_observable.subscribe(
                        msgs_from_db => {
                                console.debug("201810072326 BookingsComponent.action() msg_from_db ="
                                        , JSON.stringify(msgs_from_db, null,2));

                                this.msgs_from_db = this.msgs_from_db.concat(msgs_from_db);
                                this.changeDetectorRef.detectChanges();
                        },
                        error => {
                                //this.error_msg=error;
                                this.reset_msg(0);
                                this.error_msg= error ;
                                this.changeDetectorRef.detectChanges();
                        }
                )
        }


	change_detect_counter(e): number
	{
  		console.debug("201810131845 MessageComponent.change_detect_counter() event=", e)  ;
		return this.change_detect_count ++;	
	}
}
