import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { NgZone  } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
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

import {GeoService} from '../../models/remote.service' ;
import {DBService} from '../../models/remote.service' ;
import {CommunicationService} from '../../models/communication.service' ;
import { AppComponent } from '../../app.component';
import { Constants } from '../../models/constants';
//import { StorageService } from '../../models/gui.service';
import { UserService } from '../../models/gui.service';

@Component({
  selector: 'app-mybooking',
  templateUrl: './mybooking.component.html',
  styleUrls: ['./mybooking.component.css']
  //changeDetection: ChangeDetectionStrategy.OnPush ,  // prevent change detection unless @Input reference is changed
})

export class MybookingComponent implements OnInit, OnDestroy {
	error_msg : string;
	warning_msg : string;
	info_msg : string;
	bookings_from_db: any= [];
	form_mybooking: FormGroup;
	


        constructor(
                  private dbService             : DBService
                , private form_builder          : FormBuilder
        	, private communicationService  : CommunicationService
        //      , private zone: NgZone
        ){
                console.debug("201810091809 MyBookingComponent.constructor() enter")  ;
                console.debug("201810091809 MyBookingComponent.constructor() exit")  ;
        }


	ngOnInit() {
                this.form_mybooking = this.form_builder.group({
                        start_date      : [Constants.TODAY(), [Validators.min]],
                        end_date        : ['', [Validators.min] ],
                });
		this.onChange();
	}

        ngOnDestroy() {
                // prevent memory leak when component destroyed
                //this.subscription1.unsubscribe();
                //this.subscription2.unsubscribe();
        }
        close_page() {
                this.communicationService.close_page(Constants.PAGE_MYBOOKING);
        }

	onChange()
	{
		this.bookings_from_db = [] ;	 //remove list of journeys
	        let bookings_from_db_observable     
			= this.dbService.call_db(Constants.URL_MYBOOKING, this.form_mybooking.value);
		bookings_from_db_observable.subscribe(
			bookings_from_db => {
				console.debug("201810091810 MyBookingComponent.onChange() bookings_from_db =" + JSON.  stringify(bookings_from_db));
				this.bookings_from_db = bookings_from_db ;	
			},
			error	=> { this.error_msg= error;
			}
		)
	}
}


