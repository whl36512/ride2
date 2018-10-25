// https://angular.io/guide/reactive-forms
// https://angular.io/guide/form-validation

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';



import {AbstractControl,  ValidatorFn} from '@angular/forms';
import {EventEmitter, Input, Output} from '@angular/core';

import {Usr} from '../../models/tables' ;
//import {Constants} from '../../models/constants' ;
import {C} from '../../models/constants' ;
import {Ridebase} from '../../models/ridebase' ;
import {UserService} from '../../models/gui.service' ;
import {DBService} from '../../models/remote.service' ;
import {CommunicationService} from '../../models/communication.service' ;
import { AppComponent } from '../../app.component';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent extends Ridebase implements OnInit {
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  user to populate its input fields. If user==undefined, angular will keep calling constructor. 
	// By initialize user to an empty structure, repeated calling of constructor can be avoided
	user_from_db: Usr =new Usr  ; 

    	saved=false;
	//error_msg: string ;
	//EMAIL_PATTERN = Constants.EMAIL_PATTERN ;
	user_form = this.form_builder.group({
		email: ["",  [Validators.required, Validators.pattern]],     // sync validators must be in an array
		//last_name: [''],
	});


	constructor(
		  private dbService: DBService
		, private form_builder: FormBuilder
		, public communicationService: CommunicationService
	)   { 
		super(communicationService);
  		console.log("UserComponent.constructor() enter")  ;
		this.page_name = C.PAGE_USER;
		let user_from_cookie 	= UserService.get_profile_from_session();
		let user_from_db_observable 	= this.dbService.get_user_from_db(user_from_cookie); 
		user_from_db_observable.subscribe(
			user_from_db => {
				console.info("201808201201 UserComponent.constructor() user_from_db =" 
					, C.stringify(user_from_db));
				if (user_from_db.error == undefined )	
				{
					this.user_from_db=user_from_db;
					this.user_form.value.email = this.user_from_db.email;
				} else {
					this.error_msg= user_from_db.error;
				}
			}
		);

		//this.user_form.valueChanges.subscribe(data => console.log('Form value changes', data));
		//this.user_form.statusChanges.subscribe(data => console.log('Form status changes', data));
  	}

	ngOnInit() {
		console.info("UserComponent.ngOnInit() enter");
  	}

	onSubmit() {
		this.reset_msg();
	  	// TODO: Use EventEmitter with form value
	    	console.warn("201808201534 UserComponent.onSubmit() this.user_form.value=" + this.user_form.value );
	    	let user_from_db_observable     = this.dbService.get_user_from_db(this.user_form.value);
	    	user_from_db_observable.subscribe(
	    		user_from_db => {
				console.info("201808201201 UserComponent.constructor() user_from_db =" 
					, C.stringify(user_from_db));
				this.user_from_db =user_from_db
				this.saved=true;
				this.info_msg ='Profile saved';
			},
			error => {
				this.error_msg = error;
				this.error_msg ='Action failed';
			}
		)
	}
        subscription_action ( msg: any): void{
                console.debug("201810220042 UserComponent.subscriptio_action(). ignore msg");
        }



	
	get email() { return this.user_form.get('email'); }  // the getter is required for reactive form validation to work 
}
