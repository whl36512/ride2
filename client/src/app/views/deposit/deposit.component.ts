import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
//import { HostListener } from '@angular/core';
//import { NgZone  } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
//import { FormControl } from '@angular/forms';
//import { FormGroup } from '@angular/forms';
//import { FormArray } from '@angular/forms';
//import { FormBuilder } from '@angular/forms';
//import { Validators } from '@angular/forms';
//import { ValidatorFn } from '@angular/forms';
//import { ValidationErrors } from '@angular/forms';
//import { AbstractControl} from '@angular/forms';
import { Subscription }   from 'rxjs';

import { EventEmitter, Input, Output} from '@angular/core';

//import {GeoService} from '../../models/remote.service' ;
import {DBService} from '../../models/remote.service' ;
import {CommunicationService} from '../../models/communication.service' ;
import { AppComponent } from '../../app.component';
import { Constants } from '../../models/constants';
//import { StorageService } from '../../models/gui.service';
import { UserService } from '../../models/gui.service';


@Component({
  selector	: 'app-deposit'			,
  templateUrl	: './deposit.component.html'	,
  styleUrls	: ['./deposit.component.css']	,
  changeDetection: ChangeDetectionStrategy.OnPush ,  // prevent change detection unless @Input reference is changed
})

export class DepositComponent implements OnInit,  OnDestroy{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided

        error_msg : string;
        warning_msg : string;
        info_msg : string;
	change_detect_count: number =0;

	subscription1: Subscription ;
	subscription2: Subscription ;
	subscription3: Subscription ;

	Constants = Constants;

	user_from_db: any = {};
	show_detail = false;

	constructor(
		  private dbService		: DBService
		//, private form_builder		: FormBuilder
		, private changeDetectorRef	: ChangeDetectorRef
		, private communicationService	: CommunicationService
	//	, private zone: NgZone
	){ 
  		console.debug("201809262245 DepositComponent.constructor() enter")  ;
  		console.debug("201809262245 DepositComponent.constructor() exit")  ;
  	} 

	ngOnInit() {
		console.debug("201809262246 DepositComponent.ngOnInit() enter");
		this.warning_msg='You have not signed in';
		this.action(null, null, Constants.GET_USER_URL);
		console.debug("201809262246 DepositComponent.ngOnInit() exit");
  	}

	ngOnDestroy() {
		// prevent memory leak when component destroyed
		//this.subscription1.unsubscribe();
		//this.subscription2.unsubscribe();
	}

	onSubmit(){}

	reset_msg(index: number) : void{
		//this.deposit_from_db[index].show_fail_msg=false;
		//this.deposit_from_db[index].show_update_msg=false;
		this.error_msg=null ;
		this.warning_msg=null ;
		this.info_msg=null ;
	}

/*
	reset_button(index: number) : void{
		this.deposit_from_db[index].show_driver_cancel_button=false;
		this.deposit_from_db[index].show_rider_cancel_button=false;
		this.deposit_from_db[index].show_reject_button=false;
		this.deposit_from_db[index].show_confirm_button=false;
		this.deposit_from_db[index].show_finish_button=false;
		this.deposit_from_db[index].show_msg_button=false;
	}
*/

	action(form: any, index: number, action : string): void {
		let data_from_db_observable     = this.dbService.call_db(action, {});
		data_from_db_observable.subscribe(
	    		user_from_db => {
				console.debug("201810072326 DepositComponent.action() user_from_db =" 
					+ JSON.stringify(user_from_db));
				this.user_from_db= user_from_db;

				if ( this.user_from_db.deposit_id != null)
				{
					this.reset_msg(0); 
					this.show_detail=true;
				}
				else {
					this.warning_msg='You have not signed in';
				}
				this.changeDetectorRef.detectChanges() ;
				
			},
			error => {
				this.changeDetectorRef.detectChanges() ;
			}
		)
		
	}


	change_detect_counter(e): number
	{
  		console.debug("201810131845 DepositComponent.change_detect_counter() event=", e)  ;
		return this.change_detect_count ++;	
	}
}
