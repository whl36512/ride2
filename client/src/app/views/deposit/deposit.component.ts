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
import { C} 		from '../../models/constants';
import { Ridebase } 	from '../../models/ridebase';
//import { StorageService } from '../../models/gui.service';
import { UserService } from '../../models/gui.service';


@Component({
  selector	: 'app-deposit'			,
  templateUrl	: './deposit.component.html'	,
  styleUrls	: ['./deposit.component.css']	,
  changeDetection: ChangeDetectionStrategy.OnPush ,  // prevent change detection unless @Input reference is changed
})

export class DepositComponent extends Ridebase implements OnInit{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided

	user_from_db: any = {};
	show_detail = false;

	constructor(
		  private dbService		: DBService
		//, private form_builder		: FormBuilder
		, private changeDetectorRef	: ChangeDetectorRef
		, public communicationService	: CommunicationService
	//	, private zone: NgZone
	){ 
		super(communicationService);
  		console.debug("201809262245 DepositComponent.constructor() enter")  ;
  		console.debug("201809262245 DepositComponent.constructor() exit")  ;
  	} 

	ngOnInit() {
		console.debug("201809262246 DepositComponent.ngOnInit() enter");
		this.warning_msg=C.WARN_NOT_SIGNED_IN;
		this.action(null, null, C.GET_USER_URL);
		console.debug("201809262246 DepositComponent.ngOnInit() exit");
  	}

	onSubmit(){}

	action(form: any, index: number, action : string): void {
		this.reset_msg();
		let data_from_db_observable     = this.dbService.call_db(action, {});
		data_from_db_observable.subscribe(
	    		user_from_db => {
				console.debug("201810072326 DepositComponent.action() user_from_db =" 
					+ JSON.stringify(user_from_db));
				this.user_from_db= user_from_db;

				if ( this.user_from_db.deposit_id != null)
				{
					this.show_detail=true;
				}
				else {
					this.warning_msg=C.WARN_NOT_SIGNED_IN;
				}
				this.changeDetectorRef.detectChanges() ;
				
			},
			error => {
				this.error_msg=error;
				this.changeDetectorRef.detectChanges() ;
			}
		)
		
	}

subscription_action ( msg: any): void{
	console.debug("201810212010 WithdrawComponent.subscriptio_action(). ignore msg");
}

}
