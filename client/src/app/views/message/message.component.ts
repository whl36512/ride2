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
//import { Constants } from '../../models/constants';
import { C } from '../../models/constants';
//import { StorageService } from '../../models/gui.service';
import { UserService } from '../../models/gui.service';
import { Ridebase } from '../../models/ridebase';


@Component({
  selector	: 'app-message'			,
  templateUrl	: './message.component.html'	,
  styleUrls	: ['./message.component.css']	,
  changeDetection: ChangeDetectionStrategy.OnPush ,  // prevent change detection unless @Input reference is changed
})

export class MessageComponent extends Ridebase implements OnInit{ 
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided

	@Input()
    	book_id: string;

	@Input()
    	index: number;

	//@HostListener('keydown', ['$event']) 

	msgs_from_db: any =[];
	msg_form: any ;
	timer;
	show_messaging_panel = true;
	// close message window after fixed time 
	msg_no_activity_count_down: number = C.MSG_NO_ACTIVITY_COUNT_DOWN; 

	constructor(
		  private dbService		: DBService
		, private form_builder		: FormBuilder
		, private changeDetectorRef	: ChangeDetectorRef
		, public communicationService	: CommunicationService
	//	, private zone: NgZone
	){ 
		super(communicationService);

		this.timer = timer(200, C.MSG_TIMER_WAIT*1000);
		this.subscription1 = this.timer.subscribe(
			// val will be 0, 1,2,3,...
			val => {
				if(val >0) this.msg_no_activity_count_down -=  C.MSG_TIMER_WAIT;
				if (this.msg_no_activity_count_down <=0 ) {
					this.show_messaging_panel=false;
					communicationService.send_msg(C.MSG_KEY_MSG_PANEL
						, {index:this.index 
						, show_messaging_panel:this.show_messaging_panel }
					);
				}
				else {
					this.get_msgs_from_db();
				}

			},
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

	onSubmit(){}

	get_form(): void {
		this.msg_form = this.form_builder.group({
                                book_id	: [this.book_id, []],
                                msg	: ['', []],
                                }
                        );
	}

	action(form: any, index: number, action : string): void {
		this.reset_msg(); // remove msg and show it again, so fade would work
		this.msg_no_activity_count_down = C.MSG_NO_ACTIVITY_COUNT_DOWN ;
		this.changeDetectorRef.detectChanges();   // have to do this so fade would work

	    	console.debug("201810182231 MessageComponent.action() form=" 
			, C.stringify(form.value) );
		let msg_to_db = form.value;
		if(msg_to_db.msg.trim() === '' ) return ;
		
		//msg_to_db.book_id= this.book_id;

		let data_from_db_observable     
			= this.dbService.call_db(action, msg_to_db);

		data_from_db_observable.subscribe(
	    		msg_from_db => {
				console.debug("201810072326 MessageComponent.action() msg_from_db =" 
					, C.stringify(msg_from_db));
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
                this.reset_msg(); // remove msg and show it again, so fade would work
                this.changeDetectorRef.detectChanges();   // have to do this so fade would work
		

		var latest_c_ts = '1970-01-01';
		if ( this.msgs_from_db.length != 0) latest_c_ts = this.msgs_from_db[this.msgs_from_db.length-1].c_ts;
                let data_from_db_observable
                        = this.dbService.call_db(C.URL_MSGS
				, {book_id: this.book_id, c_ts: latest_c_ts});
                data_from_db_observable.subscribe(
                        msgs_from_db => {
                                console.debug("201810072326 BookingsComponent.action() msg_from_db ="
                                        , C.stringify(msgs_from_db));

				if (msgs_from_db.length>0 ) {
					// reset timer if getting new messages
					this.msg_no_activity_count_down 
								= C.MSG_NO_ACTIVITY_COUNT_DOWN;
                                	this.msgs_from_db = this.msgs_from_db.concat(msgs_from_db);
				}
                                this.changeDetectorRef.detectChanges();
                        },
                        error => {
                                this.reset_msg();
                                this.error_msg= error ;
                                this.changeDetectorRef.detectChanges();
                        }
                )
        }

        subscription_action(msg): void {
		console.debug("201808222332 MessageComponent.subscription_action. ignore msg");
        }

}
