// https://angular.io/guide/reactive-forms
// https://angular.io/guide/form-validation

//import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
//import { HostListener } from '@angular/core';
//import { NgZone  } from '@angular/core';
//import { ChangeDetectionStrategy } from '@angular/core';
//import { ChangeDetectorRef } from '@angular/core';
//import { FormControl } from '@angular/forms';
//import { FormGroup } from '@angular/forms';
//import { FormArray } from '@angular/forms';
//import { FormBuilder } from '@angular/forms';
//import { Validators } from '@angular/forms';
//import { ValidatorFn } from '@angular/forms';
//import { ValidationErrors } from '@angular/forms';
//import { AbstractControl} from '@angular/forms';
import { Subscription }   from 'rxjs';

//import { EventEmitter, Input, Output} from '@angular/core';
//import { timer } from 'rxjs' ;

//import {GeoService} from '../../models/remote.service' ;
//import {DBService} from '../../models/remote.service' ;
//import {CommunicationService} from '../../models/communication.service' ;
//import { AppComponent } from '../../app.component';
import { C } from './constants';
//import { StorageService } from '../../models/gui.service';
//import { UserService } from '../../models/gui.service';


export class Ridebase implements OnDestroy{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided


        error_msg	: string|null = null;
        warning_msg	: string|null = null;
        info_msg	: string|null = null;
        change_detect_count: number =0;


	subscription1: Subscription |null = null;
	subscription2: Subscription |null = null;
	subscription3: Subscription |null = null;

        C = C;
        Constants = C;

	constructor(){ } 

	ngOnDestroy(): void {
		// prevent memory leak when component destroyed
		if( this.subscription1!= null) this.subscription1.unsubscribe();
		if( this.subscription2!= null) this.subscription2.unsubscribe();
		if( this.subscription3!= null) this.subscription3.unsubscribe();
	}

	reset_msg() : void{
		this.error_msg=null ;
		this.warning_msg=null ;
		this.info_msg=null ;
	}

        change_detect_counter(e): number
        {
                console.debug("201810131845 Constants.change_detect_counter() event=", e)  ;
                return this.change_detect_count ++;
        }
}
