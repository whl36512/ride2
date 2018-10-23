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
import { C } from '../../models/constants';
import { Ridebase } from '../../models/ridebase';
import { StorageService } from '../../models/gui.service';
import { UserService } from '../../models/gui.service';

@Component({
  selector: 'app-thist',
  templateUrl: './thist.component.html',
  styleUrls: ['./thist.component.css']
  //changeDetection: ChangeDetectionStrategy.OnPush ,  // prevent change detection unless @Input reference is changed
})

export class ThistComponent extends Ridebase implements OnInit {
	trnx_from_db: any= [];
	form: FormGroup;
	filter:any ;

        constructor(
                  private dbService             : DBService
                , private form_builder          : FormBuilder
        	, public communicationService  : CommunicationService
        //      , private zone: NgZone
        ){
		super(communicationService);
                console.debug("201809262245 ThistComponent.constructor() enter")  ;
                console.debug("201809262245 ThistComponent.constructor() exit")  ;
        }


	ngOnInit() {
		let form_value_from_storage = StorageService.getForm(C.KEY_FORM_THIST);
		if ( form_value_from_storage == null) {
                	this.form = this.form_builder.group({
                        start_date		: ['', []],
                        end_date		: ['', [Validators.min] ],
                        show_booking		: [true, [] ],
                        show_return		: [true, [] ],
                        show_penalty		: [true, [] ],
                        show_deposit		: [true, [] ],
                        show_withdraw		: [true, [] ],
                        show_finished		: [true, [] ],
                        show_pending		: [true, [] ],
                	});
		}
		else {
                	this.form = this.form_builder.group({
                        start_date		: [form_value_from_storage.start_date, []],
                        end_date		: [form_value_from_storage.end_date, [Validators.min] ],
                        show_booking		: [form_value_from_storage.show_booking, [] ],
                        show_return		: [form_value_from_storage.show_return, [] ],
                        show_penalty		: [form_value_from_storage.show_penalty, [] ],
                        show_deposit		: [form_value_from_storage.show_deposit, [] ],
                        show_withdraw		: [form_value_from_storage.show_withdraw, [] ],
                        show_finished		: [form_value_from_storage.show_finished, [] ],
                        show_pending		: [form_value_from_storage.show_pending, [] ],
                	});
		}

		this.onChange();
	}

	onChange()
	{
		this.reset_msg();
		this.warning_msg='loading ...' ;

		StorageService.storeForm(C.KEY_FORM_THIST, this.form.value); 
		this.trnx_from_db = [] ;	 //remove list of journeys
	        let data_from_db_observable     
			= this.dbService.call_db(C.URL_THIST, this.form.value);
		data_from_db_observable.subscribe(
			trnx_from_db => {
				this.warning_msg= null;
				console.debug("201810071557 ThistComponent.onChange() trnx_from_db =" 
					, C.stringify(trnx_from_db));
				this.trnx_from_db = trnx_from_db ;	
				if (this.trnx_from_db.length==0) this.warning_msg='Nothing found' ; 
				this.on_filter();
			},
			error	=> { 
				this.error_msg= error;
			}
		)
		
	}

	on_filter()
	{
		StorageService.storeForm(C.KEY_FORM_THIST, this.form.value); 

		for ( let index in this.trnx_from_db) {
			this.trnx_from_db[index].show_booking
				=this.show_filtered(this.trnx_from_db[index], Number(index));
			
		}
	}

        show_filtered(tran: any, index: number): boolean {
                console.debug("201810131007 BookingsComponent.show_filtered() tran.trnx_cd="
			, tran.trnx_cd)  ;
                console.debug("201810131007 BookingsComponent.show_filtered() index=", index)  ;
                let status  =false;
                if      (tran.trnx_cd =='P' && this.form.value.show_penalty     ) status=true;
                else if (tran.trnx_cd =='B' && this.form.value.show_booking     ) status=true;
                else if (tran.trnx_cd =='J' && this.form.value.show_rejected    ) status=true;
                else if (tran.trnx_cd =='D' && this.form.value.show_deposit	) status=true;
                else if (tran.trnx_cd =='W' && this.form.value.show_withdraw    ) status=true;
                else if (tran.trnx_cd =='F' && this.form.value.show_finished    ) status=true;
                else if (tran.actual_ts ==null && this.form.value.show_pending  ) status=true;

                return status;
        }

        subscription_action(msg): void {
                	console.debug('201810211444 ThistComponent.subscription_action() ignore msg');
        }
}
