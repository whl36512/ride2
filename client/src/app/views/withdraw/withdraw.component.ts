// https://angular.io/guide/reactive-forms
// https://angular.io/guide/form-validation

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';



import {AbstractControl,  ValidatorFn} from '@angular/forms';
import {EventEmitter, Input, Output} from '@angular/core';

//import {Usr} from '../../models/tables' ;
import {Constants} from '../../models/constants' ;
import {UserService} from '../../models/gui.service' ;
import {DBService} from '../../models/remote.service' ;
import {C} from '../../models/constants' ;
import {Ridebase} from '../../models/ridebase' ;
import {CommunicationService} from '../../models/communication.service' ;
import { AppComponent } from '../../app.component';


@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})

export class WithdrawComponent extends Ridebase implements OnInit {
	// when *ngIf is true, both constructor() and ngOnInit() are called. 
	// constructor is called first then ngOnInit
	// the html needs  user to populate its input fields. If user==undefined, angular will keep calling constructor. 
	// By initialize user to an empty structure, repeated calling of constructor can be avoided
	user_from_db: any =null  ; 

    	saved : boolean = false;

	form : FormGroup;
	is_signed_in: boolean = false;


	constructor(
		  private dbService: DBService
		, private form_builder: FormBuilder
		, public communicationService: CommunicationService
	)   { 
		super(communicationService);
  		console.debug("WithdrawComponent.constructor() enter")  ;
  		console.debug("WithdrawComponent.constructor() exit")  ;
  	}

ngOnInit() {
	console.debug("WithdrawComponent.ngOnInit() enter");
	let is_signed_in = UserService.is_signed_in();
	if(! is_signed_in) {
		this.warning_msg=C.WARN_NOT_SIGNED_IN ;
		return;
	}
	let user_from_db_observable 	= this.dbService.call_db(C.URL_GET_USER, {});
	user_from_db_observable.subscribe(
		user_from_db => {
			if (user_from_db.usr_id != null )	{
				this.user_from_db=user_from_db;
				this.form = this.form_builder.group({
					usr_id: [this.user_from_db.usr_id,  []],     
					bank_email: ["",  [Validators.required, Validators.pattern]],  
					requested_amount: [this.user_from_db.balance,  [Validators.required
					//trnx_cd: ['W',  [Validators.required
					, Validators.min, Validators.max]],  
				});
				this.is_signed_in = true;
			} else {
				this.error_msg= user_from_db.error;
				this.warning_msg=C.WARN_NOT_SIGNED_IN;
				}
		},
		error => {
			this.error_msg=error;
		}
	);
	console.debug("WithdrawComponent.ngOnInit() exit");
}

onSubmit() {
	// TODO: Use EventEmitter with form value
	this.reset_msg();
	console.warn("201808201534 WithdrawComponent.onSubmit() this.form.value=" + this.form.value );
	let data_from_db_observable 
		= this.dbService.call_db(C.URL_WITHDRAW, this.form.value);

	data_from_db_observable.subscribe(
		money_trnx_from_db=> {
			console.info("201808201201 WithdrawComponent.onSubmit() money_trnx_from_db =\n" 
				, C.stringify(money_trnx_from_db));
			if(money_trnx_from_db.requested_amount > 0 ) {
				this.saved=true;
				this.info_msg='Request sent';
			}
		},
		error => { 
			this.saved=false;
			this.error_msg= error;
		},
	)
}
		
close_page() {
	this.communicationService.send_msg(C.MSG_KEY_PAGE_CLOSE,{page:C.PAGE_WITHDRAW} );
}
subscription_action ( msg: any): void{
	console.debug("201810212010 WithdrawComponent.subscriptio_action(). ignore msg");
}



// the getter is required for reactive form validation to work 
get bank_email() { return this.form.get('bank_email'); }  
get requested_amount () { return this.form.get('requested_amount'); }  
}
