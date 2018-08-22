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
import {UserService} from '../../models/gui.service' ;
import {DBService} from '../../models/remote.service' ;
import { AppComponent } from '../../app.component';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  user to populate its input fields. If user==undefined, angular will keep calling constructor. 
	// By initialize user to an empty structure, repeated calling of constructor can be avoided
	user: Usr =new Usr  ; 

    	saved=false;
	signed_in= false;
	EMAIL_PATTERN = String.raw`^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]{1,30}\.){1,4}([a-zA-Z]{2,5})$` ;

	user_form = this.form_builder.group({
	email: ['', [Validators.required, Validators.pattern]],     // sync validators must be in an array
		//last_name: [''],
	});

	constructor(public parent: AppComponent, private dbService: DBService, private form_builder: FormBuilder)   { 
  		console.log("UserComponent.constructor() enter")  ;
		console.log( "201808201325 UserComponent EMAIL_PATTERN=" + this.EMAIL_PATTERN);
		let user_from_cookie 	= UserService.get_user_from_cookie();
		// this.user_from_db will be assigned a value after the function call returns
		let user_from_db_observable 	= this.dbService.get_user_from_db(user_from_cookie); 
		// db returns a lot of field. we need only 3 of them
		user_from_db_observable.subscribe(
			user_from_db => {
				console.info("201808201201 UserComponent.constructor() user_from_db =" + JSON.stringify(user_from_db));
				if (user_from_db.error == undefined )	
				{
					this.signed_in = true;
				this.user = new Usr( {	
				 	last_name	: user_from_db.last_name  ,
					first_name	: user_from_db.first_name ,
					email		: user_from_db.email 	  ,
				});
				} else {
					this.signed_in= false;
				}
			}
		)

		//this.user_form.valueChanges.subscribe(data => console.log('Form value changes', data));
		//this.user_form.statusChanges.subscribe(data => console.log('Form status changes', data));
  	}

	ngOnInit() {
		console.info("UserComponent.ngOnInit() enter");
  	}

	/*
	addEmail(input:HTMLInputElement) {
		this.name= input.name ;
		this.value = input.value;
	}
	*/
	onSubmit() {
	  	// TODO: Use EventEmitter with form value
	    	console.warn("201808201534 UserComponent.onSubmit() this.user_form.value=" + this.user_form.value );
		if (this.saved) 
		{
			this.parent.pages.user = false;
		}
		else {
	    		let user_from_db_observable     = this.dbService.get_user_from_db(this.user_form.value);
	    		user_from_db_observable.subscribe(
	    			user_from_db => {
					console.info("201808201201 UserComponent.constructor() user_from_db =" + JSON.stringify(user_from_db));
					this.user = new Usr( {
						last_name       : user_from_db.last_name  ,
						first_name      : user_from_db.first_name ,
						email           : user_from_db.email      ,
					});
					this.saved=true;
				}
			)
		}
	}
	
	get email() { return this.user_form.get('email'); }  // the getter is required for reactive form validation to work 
}
