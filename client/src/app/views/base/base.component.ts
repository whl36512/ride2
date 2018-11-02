//https://blogs.msdn.microsoft.com/premier_developer/2018/06/17/angular-how-to-simplify-components-with-typescript-inheritance/

import { Component} 			from '@angular/core';
import { OnInit } 				from '@angular/core';
import { OnDestroy } 			from '@angular/core';
import { Subscription }   		from 'rxjs';
import { ChangeDetectorRef }	from '@angular/core';
import { FormBuilder	}		from '@angular/forms';
import { FormGroup } 			from '@angular/forms';

//import { EventEmitter, Input, Output} from '@angular/core';


import { AppInjector} 			from '../../models/app-injector.service' ;
import { GeoService} 			from '../../models/remote.service' ;
import { DBService} 			from '../../models/remote.service' ;
import { CommunicationService} 	from '../../models/communication.service' ;
import { AppComponent } 		from '../../app.component';
import { C }					from '../../models/constants';
import { StorageService } 		from '../../models/gui.service';
import { UserService } 			from '../../models/gui.service';
import { DotIcon } 				from '../../models/map.service';
import { PinIcon } 				from '../../models/map.service';
import { MapService } 			from '../../models/map.service';
import { Util	  } 			from '../../models/gui.service';
import { Status	  } 			from '../../models/gui.service';



@Component({
  //selector: 'app-base',
  //templateUrl: './base.component.html',
  template: '',
  //styleUrls: ['./base.component.css']
})
export abstract class BaseComponent implements OnInit, OnDestroy {

	mapService				: MapService			;
	storageService			: StorageService		;	
	communicationService	: CommunicationService	;	
	dbService 				: DBService				;	
	geoService				: GeoService			;	
	changeDetectorRef       : ChangeDetectorRef 	;
	form_builder	    	: FormBuilder 			;


	error_msg   		: string|null   = null;
	warning_msg 		: string|null   = null;
	info_msg			: string|null   = null;
	change_detect_count	: number 		= 0;
	show_body		   	: string|null	= C.BODY_SHOW ;
	is_signed_in		: boolean 		= false;
	page_name 			: string| null 	= null;
	form 				: FormGroup|null=null;   // main for of a page

	class_name = this.constructor.name;

	subscription0: Subscription |null = null;
	subscription1: Subscription |null = null;
	subscription2: Subscription |null = null;
	subscription3: Subscription |null = null;

	C = C;
	Constants = C;
	Util = Util;
	Status = Status;



  constructor() { 
		// this could return undefined even run it 1000 time. 
		// It happens when not starting from home page
		// the browser will automatically start from home page
		// and then everything is fine. Don't know why
		this.is_signed_in= UserService.is_signed_in();
		let injector = AppInjector.getInjector();	
		this.mapService 			= injector.get(MapService);	
		this.storageService 		= injector.get(StorageService);	
		this.communicationService 	= injector.get(CommunicationService);	
		this.dbService 				= injector.get(DBService);	
		this.geoService 			= injector.get(GeoService);	
		//this.changeDetectorRef 		= injector.get(ChangeDetectorRef);	
		this.form_builder 			= injector.get(FormBuilder);	
			//this.logNavigation();

		this.subscription0 =this.communicationService.msg.subscribe(
			msg  => {
				//console.debug("201810211343 Ridebase.subscription0. msg=\n"
					//, C.stringify(msg));
				this.subscription_action(msg);
			}
		);

	
	}


		//protected logError(errorMessage: string) { . . . }	
		//private logNavigation() { . . . }
  	ngOnInit() { }

	ngOnDestroy(): void {
		console.debug ('201810290932 ', this.class_name,'.ngOnDestroy() enter.');
		// prevent memory leak when component destroyed
		if( this.subscription0!= null) this.subscription0.unsubscribe();
		if( this.subscription1!= null) this.subscription1.unsubscribe();
		if( this.subscription2!= null) this.subscription2.unsubscribe();
		if( this.subscription3!= null) this.subscription3.unsubscribe();
		this.communicationService.send_msg(C.MSG_KEY_MAP_BODY_NOSHOW, {});
		this.onngdestroy();
	}

	onngdestroy(){}

	subscription_action(msg): void{
		this.subscription_action_ignore();
	}
	
	subscription_action_ignore()
	{
		console.debug('DEBUG 201810312014', this.class_name, '.subscription_action() ignore msg'); 
	}

    reset_msg() : void{
	this.error_msg	=null ;
	this.warning_msg=null ;
	this.info_msg	=null ;
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

    list_global_objects() {
	Util.list_global_objects();
    }

	geocode(element_id: string, pair, form):any {
		console.debug('201800111346', this.class_name, '.geocode() element_id =' , element_id);

		let pair_before_geocode = Util.deep_copy(pair) ;
		var p :any ;
		let loc_old  ='';

		if (element_id == "p1_loc" ) {
			p= pair.p1 ;
			loc_old = p.loc
			p.loc = form.value.p1_loc;
		} else {
			p= pair.p2;
			loc_old= p.loc
			p.loc = form.value.p2_loc;
		}

		if(loc_old.trim() === p.loc.trim()) return; // no change
		if (p.loc.length < 3) {
			p.lat = null;
			p.lon = null;
			p.display_name= null;
			this.communicationService.send_msg(C.MSG_KEY_MARKER_CLEAR, {});
			this.communicationService.send_msg(C.MSG_KEY_MARKER_PAIR, pair);
			this.communicationService.send_msg(C.MSG_KEY_MARKER_FIT, pair);

			this.changeDetectorRef.detectChanges();
			this.routing(pair, pair_before_geocode);
			return; // must type at least 3 letters before geocoding starts
		}

		else {
			let loc_response = this.geoService.geocode(p.loc) ;
			loc_response.subscribe(
				body =>	 {
					console.debug('201809111347 SearchSettingComponent.geocode()  body=' );
					console.debug( C.stringify(body) );
					if (body[0]) {
						p.lat		   =body[0].lat ;
						p.lon		   =body[0].lon ;
						p.display_name=body[0].display_name ;
					}
					else {
						p.lat = null;
						p.lon = null;
						p.display_name= null;
					}
					this.communicationService.send_msg(C.MSG_KEY_MARKER_CLEAR, {});
					this.communicationService.send_msg(C.MSG_KEY_MARKER_PAIR, pair);
					this.communicationService.send_msg(C.MSG_KEY_MARKER_FIT, pair);
					this.changeDetectorRef.detectChanges();
					this.routing(pair, pair_before_geocode);
					//this.mapService.try_mark_pair ( pair);
				//      this.show_map()
				}
			);
		}
	}

	routing(pair, pair_before_geocode)
	{
		if ( !pair.p1.display_name || ! pair.p2.display_name) {
			pair.distance=C.ERROR_NO_ROUTE ;
			this.changeDetectorRef.detectChanges();
			return;
		}
		else if (	pair.p1.lat == pair_before_geocode.p1.lat
				&&	pair.p1.lon == pair_before_geocode.p1.lon
				&&	pair.p2.lat == pair_before_geocode.p2.lat
				&&	pair.p2.lon == pair_before_geocode.p2.lon) {
				// no change of latlon. Skip routing
				//pair.distance= oair_before_geocode.distance;
				this.changeDetectorRef.detectChanges();
				return;
		}

		//both start and end are geocoded. So we can calc routes
		let route_response = this.geoService.routing(
				  pair.p1.lat
				, pair.p1.lon
				, pair.p2.lat
				, pair.p2.lon
			);
		route_response.subscribe(
			body => {
				console.info("201808201201", this.class_name, '.routing() body =\n' , C.stringify(body));
				if( body.routes.length >0 ) {
					let distance=body.routes[0].distance ;
					pair.distance= Math.round(distance /160)/10;
					this.changeDetectorRef.detectChanges();
				}
				else {
					pair.distance=C.ERROR_NO_ROUTE ;
					this.changeDetectorRef.detectChanges();
				}
			},
			error => {
				pair.distance=C.ERROR_NO_ROUTE ;
				this.changeDetectorRef.detectChanges();
			}
		);
	}

}


