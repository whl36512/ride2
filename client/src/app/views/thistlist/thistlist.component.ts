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
  selector	: 'app-thistlist'		,
  templateUrl	: './thistlist.component.html'	,
  styleUrls	: ['./thistlist.component.css']	,
  changeDetection: ChangeDetectionStrategy.OnPush ,  // prevent change detection unless @Input reference is changed
})

export class ThistlistComponent extends Ridebase implements OnInit{
	// when *ngIf is true, both constructor() and ngOnInit() are called. constructor is called first then ngOnInit
	// the html needs  trip to populate its input fields. If trip==undefined, angular will keep calling constructor. 
	// By initialize trip to an empty structure, repeated calling of constructor can be avoided

	@Input()
    	trnx_from_db: any;

	@Input()
    	filter: any;

	@HostListener('keydown', ['$event']) 
	onAnyEvent(e) {
       		 console.debug('201810131753 ThistlistComponent.onAnyEvent() event=', e);
    	}

	forms: any =[];

	constructor(
		  private dbService		: DBService
		, private form_builder		: FormBuilder
		, private changeDetectorRef	: ChangeDetectorRef
		, public communicationService	: CommunicationService
	//	, private zone: NgZone
	){ 

		super(communicationService);
  		console.debug("201809262245 ThistlistComponent.constructor() enter")  ;
  		console.debug("201809262245 ThistlistComponent.constructor() exit")  ;
  	} 

	ngOnInit() {
		console.debug("201809262246 ThistlistComponent.ngOnInit() enter");
		console.debug("201809262246 ThistlistComponent.ngOnInit() this.trnx_from_db = "
			+ C.stringify(this.trnx_from_db) );
		//this.subscription1 = this.form.valueChanges.subscribe(data => console.log('Form value changes', data));
		//this.subscription2 = this.form.statusChanges.subscribe(data => console.log('Form status changes', data));

		console.debug("201809262246 ThistlistComponent.ngOnInit() exit");
  	}
	
	subscription_action ( msg: any): void{
	// overides Ridebase.subscription_action
		console.debug("201810211344 ThistlistComponent.subscriptio_action(). ignore msg");
	}
}
