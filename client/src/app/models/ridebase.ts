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
import {CommunicationService} from './communication.service' ;
//import { AppComponent } from '../../app.component';
import { C } from './constants';
//import { StorageService } from '../../models/gui.service';
//import { UserService } from '../../models/gui.service';


export abstract class Ridebase implements OnDestroy{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided


        error_msg	: string|null 	= null;
        warning_msg	: string|null 	= null;
        info_msg	: string|null 	= null;
        change_detect_count: number =0;
	show_body			='show';
	is_signed_in: boolean = false;
	page_name : string| null = null;




	subscription0: Subscription |null = null;
	subscription1: Subscription |null = null;
	subscription2: Subscription |null = null;
	subscription3: Subscription |null = null;
	//communicationService: CommunicationService = new CommunicationService();

        C = C;
        Constants = C;

	constructor( 
    		// must use public or private
		//otherwise Compiler error: Property 'communicationService' does not exist on type 'Ridebase'.
		public communicationService: CommunicationService
	){ 
                this.subscription0 =this.communicationService.msg.subscribe(
                        msg  => {
                                //console.debug("201810211343 Ridebase.subscription0. msg=\n"
                                        //, C.stringify(msg));
				this.subscription_action(msg);
                        }
                );

	} 

	ngOnDestroy(): void {
		// prevent memory leak when component destroyed
		if( this.subscription0!= null) this.subscription0.unsubscribe();
		if( this.subscription1!= null) this.subscription1.unsubscribe();
		if( this.subscription2!= null) this.subscription2.unsubscribe();
		if( this.subscription3!= null) this.subscription3.unsubscribe();
	}
	
	abstract subscription_action(msg): void;
//{
		//console.debug('201810211444 Ridebase.subscription_action() ignore msg');
	//}

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
	
	close_page(): boolean{
		this.communicationService.send_msg(C.MSG_KEY_PAGE_CLOSE, {page:this.page_name});
		return false;
	}
	onSubmit(){}

        trackByFunc (index, item) {
                if (!item) return null;
                return index;
        }

}
