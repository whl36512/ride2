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
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
  //changeDetection: ChangeDetectionStrategy.OnPush ,  // prevent change detection unless @Input reference is changed
})

export class ActivityComponent implements OnInit, OnDestroy {
	error_msg : string;
	warning_msg : string;
	info_msg : string;
	bookings_from_db: any= [];
	trip_form: FormGroup;
	filter:any ;
	


        constructor(
                  private dbService             : DBService
                , private form_builder          : FormBuilder
        	, private communicationService  : CommunicationService
        //      , private zone: NgZone
        ){
                console.debug("201809262245 ActivityComponent.constructor() enter")  ;
                console.debug("201809262245 ActivityComponent.constructor() exit")  ;
        }


	ngOnInit() {
                this.trip_form = this.form_builder.group({
                        start_date		: [Constants.TODAY(), [Validators.min]],
                        end_date		: ['', [Validators.min] ],
                        show_driver		: [true, [] ],
                        show_rider		: [true, [] ],
                        show_seats_available	: [true, [] ],
                        show_pending		: [true, [] ],
                        show_confirmed		: [true, [] ],
                        show_rejected		: [false, [] ],
                        show_cancelled_by_driver: [false, [] ],
                        show_cancelled_by_rider	: [false, [] ],
                        show_finished		: [true, [] ],
                });
		this.filter= this.trip_form.value;

		this.onChange();
	}
        ngOnDestroy() {
                // prevent memory leak when component destroyed
                //this.subscription1.unsubscribe();
                //this.subscription2.unsubscribe();
        }
        close_page() {
                this.communicationService.close_page(Constants.PAGE_ACTIVITY);
        }

	onChange()
	{
		this.bookings_from_db = [] ;	 //remove list of journeys
	        let bookings_from_db_observable     
			= this.dbService.call_db(Constants.URL_ACTIVITY, this.trip_form.value);
		bookings_from_db_observable.subscribe(
			bookings_from_db => {
				console.debug("201810071557 ActivityComponent.onChange() bookings_from_db =" + JSON.  stringify(bookings_from_db));
				this.bookings_from_db = bookings_from_db ;	
				this.set_filter();
			},
			error	=> { this.error_msg= error;
			}
		)
		
	}

	set_filter()
	{
		this.filter= this.trip_form.value;

		for ( let index in this.bookings_from_db) {
			this.bookings_from_db[index].show_booking
				=this.show_booking(this.bookings_from_db[index], Number(index));
			
		}
	}

        show_booking(booking: any, index: number): boolean {
                console.debug("201810131007 BookingsComponent.show_this() booking.status_cd="
			, booking.status_cd)  ;
                console.debug("201810131007 BookingsComponent.show_this() index=", index)  ;
                console.debug("201810131007 BookingsComponent.show_this() this.filter"
			, this.filter)  ;
                let status  =false;
                if      (booking.status_cd =='P' && this.filter.show_pending            ) status=true;
                else if (booking.status_cd =='B' && this.filter.show_confirmed          ) status=true;
                else if (booking.status_cd =='J' && this.filter.show_rejected           ) status=true;
                else if (booking.status_cd =='D' && this.filter.show_cancelled_by_driver) status=true;
                else if (booking.status_cd =='R' && this.filter.show_cancelled_by_rider ) status=true;
                else if (booking.status_cd =='F' && this.filter.show_finished           ) status=true;
                else if (booking.status_cd =='S' && this.filter.show_seats_available    ) status=true;
                else if (booking.status_cd ==null && this.filter.show_seats_available   ) status=true;

                let ret=false;
                if ( booking.is_rider && this.filter.show_rider && status) ret= true;
                else if ( booking.is_driver && this.filter.show_driver && status) ret= true;

                console.debug("201810131045 BookingsComponent.show_this() ret="+ ret)  ;

                return ret;
        }
}


