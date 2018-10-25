// https://angular.io/guide/reactive-forms
// https://angular.io/guide/form-validation

import { Component} from '@angular/core';
import { OnInit } from '@angular/core';
//import { OnDestroy } from '@angular/core';
import { HostListener } from '@angular/core';
//import { NgZone  } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';
//import { AbstractControl} from '@angular/forms';
import { Subscription }   from 'rxjs';

//import { EventEmitter} from '@angular/core';
import { Input} from '@angular/core';
//import { Output} from '@angular/core';

//import {GeoService} from '../../models/remote.service' ;
import {DBService} from '../../models/remote.service' ;
import {CommunicationService} from '../../models/communication.service' ;
import { AppComponent } from '../../app.component';
//import { Constants } from '../../models/constants';
import { C } from '../../models/constants';
import { Ridebase } from '../../models/ridebase';
//import { StorageService } from '../../models/gui.service';
//import { UserService } from '../../models/gui.service';


@Component({
  selector	: 'app-bookings'		,
  templateUrl	: './bookings.component.html'	,
  styleUrls	: ['./bookings.component.css']	,
  changeDetection: ChangeDetectionStrategy.OnPush ,  // prevent change detection unless @Input reference is changed
})

export class BookingsComponent extends Ridebase implements OnInit{
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

	booking_forms: any =[];

	constructor(
		  private dbService		: DBService
		, private form_builder		: FormBuilder
		, private changeDetectorRef	: ChangeDetectorRef
		, public communicationService	: CommunicationService
	//	, private zone: NgZone
	){ 

		super(communicationService);
  		console.debug("201809262245 BookingsComponent.constructor() enter")  ;
/*
                this.subscription1 =this.communicationService.msg.subscribe(
                        msg  => {
                                console.debug("201810211343 BookingsComponent.subscription1. msg=\n"
                                        , C.stringify(msg));
				if (msg != undefined && msg != null && msg.msgKey == C.MSG_KEY_MSG_PANEL) {
					this.bookings_from_db[msg.index].show_messaging_panel
						=msg.show_messaging_panel;
					this.reset_msgs(msg.index);
					this.changeDetectorRef.detectChanges();
				}
				else {
					console.debug("201810211344 Map2Component.subscription1. ignore msg");
				}
                        }
                );
*/
  		console.debug("201809262245 BookingsComponent.constructor() exit")  ;
  	} 

	ngOnInit() {
		console.debug("201809262246 BookingsComponent.ngOnInit() enter");
		console.debug("201809262246 BookingsComponent.ngOnInit() this.bookings_from_db = "
			+ C.stringify(this.bookings_from_db) );
		//this.subscription1 = this.form.valueChanges.subscribe(data => console.log('Form value changes', data));
		//this.subscription2 = this.form.statusChanges.subscribe(data => console.log('Form status changes', data));

		for ( let index in this.bookings_from_db) { // for.. in.. creates index, not object
			this.add_form(this.bookings_from_db[index]);
			this.reset_msgs(Number(index));
			this.reset_button(Number(index));

			if (  this.bookings_from_db[index].is_driver){
				this.bookings_from_db[index].show_update_button
					= this.bookings_from_db[index].book_id == null ;
				this.bookings_from_db[index].show_confirm_button
					= this.bookings_from_db[index].status_cd == 'P' ;
				this.bookings_from_db[index].show_reject_button
					= this.bookings_from_db[index].status_cd == 'P' ;
				this.bookings_from_db[index].show_driver_cancel_button	
					= this.bookings_from_db[index].status_cd == 'B' ;
			}
			else if ( this.bookings_from_db[index].is_rider) {
				this.bookings_from_db[index].show_rider_cancel_button	
					= this.bookings_from_db[index].status_cd == 'B' 
					|| this.bookings_from_db[index].status_cd == 'P' ;

				this.bookings_from_db[index].show_finish_button	
					= this.bookings_from_db[index].status_cd == 'B' ;
			}
			this.bookings_from_db[index].show_msg_button
					= this.bookings_from_db[index].status_cd != 'P'
					 && this.bookings_from_db[index].book_id != null ;
		}

		console.debug("201809262246 BookingsComponent.ngOnInit() exit");
  	}
	
	subscription_action ( msg: any): void{
	// overides Ridebase.subscription_action
		if (msg != undefined && msg != null && msg.msgKey == C.MSG_KEY_MSG_PANEL) {
			this.bookings_from_db[msg.index].show_messaging_panel
				=msg.show_messaging_panel;
			this.reset_msgs(msg.index);
			this.changeDetectorRef.detectChanges();
		}
		else {
			console.debug("201810211344 Map2Component.subscriptio_action(). ignore msg");
		}
	}

	onSubmit(){}

	add_form (booking: any) : void {
		console.debug("201810072302 BookingsComponent.add_form() booking = "
			+ C.stringify(booking) );
		let booking_form = this.form_builder.group({
                                journey_id  : [booking.journey_id, []],
                                book_id     : [booking.book_id, []],
                                seats       : [booking.seats, []],
                                price       : [booking.price, []],
                                }
                        );
		console.debug("201810072247 BookingsComponent.add_form() booking_form="+ C.stringify(booking_form.value));

		this.booking_forms.push(booking_form);

	}

	reset_msgs(index: number) : void{
		this.bookings_from_db[index].fail_msg=null;
		this.bookings_from_db[index].update_msg=null;
		super.reset_msg();
	}

	reset_button(index: number) : void{
		this.bookings_from_db[index].show_driver_cancel_button=false;
		this.bookings_from_db[index].show_rider_cancel_button=false;
		this.bookings_from_db[index].show_reject_button=false;
		this.bookings_from_db[index].show_confirm_button=false;
		this.bookings_from_db[index].show_finish_button=false;
		this.bookings_from_db[index].show_msg_button=false;
	}

	update(booking_form: any, index: number): void {
	    	console.debug("201809261901 BookingsComponent.update() booking_form=" 
			, C.stringify(booking_form.value) );
		this.reset_msgs(index); // remove msg and show it again, so fade would work
		this.changeDetectorRef.detectChanges() ;
		let booking_to_db = booking_form.value;
		if ( booking_to_db.price== this.bookings_from_db[index].price
			&& booking_to_db.seats == this.bookings_from_db[index].seats)
		{
			this.bookings_from_db[index].update_msg=C.OK_NO_CHANGE ;
			this.changeDetectorRef.detectChanges() ;
			return;
		}
		let data_from_db_observable     = this.dbService.call_db(C.URL_UPD_JOURNEY, booking_to_db);
		data_from_db_observable.subscribe(
	    		journey_from_db => {
				console.debug("201810072326 BookingsComponent.update() journey_from_db =" 
					, C.stringify(journey_from_db));

				this.bookings_from_db[index].update_msg=C.OK_UPDATE;
				this.bookings_from_db[index].seats=journey_from_db.seats;
				this.bookings_from_db[index].price=journey_from_db.price;
				this.changeDetectorRef.detectChanges() ;
				
			},
			error => {
				this.error_msg=error;
				this.bookings_from_db[index].fail_msg='Action Failed';
				this.changeDetectorRef.detectChanges() ;
			}
		) ;
	}

	action(booking_form: any, index: number, action : string): void {
		this.reset_msgs(index); // remove msg and show it again, so fade would work
		this.changeDetectorRef.detectChanges();   // have to do this so fade would work
	    	console.debug("201809261901 BookingsComponent.action() booking_form=" 
			+ C.stringify(booking_form.value) );
		let booking_to_db = booking_form.value;
		let booking_from_db_observable     
			= this.dbService.call_db(action, booking_to_db);
		booking_from_db_observable.subscribe(
	    		booking_from_db => {
				console.debug("201810072326 BookingsComponent.action() booking_from_db =" 
			, C.stringify(booking_from_db));
				
				
				if ( booking_from_db.status_cd==this.bookings_from_db[index].status_cd){
					// no status_cd change
					this.bookings_from_db[index].faile_msg='Action Failed';
				}
				else if ( booking_from_db.status_cd == 'B') {
					this.bookings_from_db[index].status_cd= booking_from_db.status_cd;
					this.reset_button(index);
					this.bookings_from_db[index].book_status_description='Confirmed';
					this.bookings_from_db[index].show_msg_button=true;
					this.bookings_from_db[index].show_rider_cancel_button
						=this.bookings_from_db[index].is_rider;
					this.bookings_from_db[index].show_driver_cancel_button
						= this.bookings_from_db[index].is_driver ;
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
				else if ( booking_from_db.status_cd == 'R') {
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
				//this.error_msg=error;
				this.bookings_from_db[index].fail_msg=C.ACTION_FAIL;
				this.changeDetectorRef.detectChanges();
			}
		)
		
	}

	message(booking_form: any, index: number, action : string): void {
		this.reset_msgs(index); // remove msg and show it again, so fade would work
		this.bookings_from_db[index].show_messaging_panel 
			= !this.bookings_from_db[index].show_messaging_panel;
		this.changeDetectorRef.detectChanges();   
	}
	
	geo_mark(index: number) : void {
                this.communicationService.send_msg(C.MSG_KEY_MAP_BODY_SHOW, {});

		this.communicationService.send_msg(C.MSG_KEY_MARKER_CLEAR, {});	

		let pair = C.convert_trip_to_pair(this.bookings_from_db[index]);
		pair.p1.marker_text = 'D'+(index+1);
		pair.p2.marker_text = 'D'+(index+1);
		this.communicationService.send_msg(C.MSG_KEY_MARKER_PAIR, pair);	
		this.communicationService.send_msg(C.MSG_KEY_MARKER_FIT, pair);	

		pair =  C.convert_book_to_pair(this.bookings_from_db[index]);
		pair.p1.marker_text = 'P'+(index+1);
		pair.p2.marker_text = 'P'+(index+1);
		this.communicationService.send_msg(C.MSG_KEY_MARKER_PAIR, pair);	
		//this.communicationService.send_msg(C.MSG_KEY_SHOW_ACTIVITY_BODY,{show_body: C.BODY_NOSHOW});
	}
}
