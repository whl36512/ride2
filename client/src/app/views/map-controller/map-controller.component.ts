import { Component, OnInit } 	from '@angular/core';
import { OnDestroy } 		from '@angular/core';
import { Subscription }   	from 'rxjs';

import * as L from "leaflet";

import {MapService} 	from "../../models/map.service"
import {CommunicationService} from "../../models/communication.service"
import {DotIcon} 	from "../../models/map.service"
import {PinIcon} 	from "../../models/map.service"
import {C} 		from "../../models/constants"
import {Ridebase} 	from "../../models/ridebase"
import {Util} 		from "../../models/gui.service"
import {DBService} 	from '../../models/remote.service' ;
import {Status} 		from "../../models/gui.service"
import { StorageService     } from '../../models/gui.service';




@Component({
	selector: 'app-map-controller',
	templateUrl: './map-controller.component.html',
	styleUrls: ['./map-controller.component.css'],
	//providers: [CommunicationService],
		
})
export class MapControllerComponent extends Ridebase implements OnInit  {
	constructor(public communicationService	: CommunicationService
			    , private dbService             : DBService
			)
	{ 
		super(communicationService);
	}
		
	ngOnInit() {
		console.debug('201810291007 MapControllerComponent.ngOnInit() enter');
		
		// javascript style calling does not recognize this in this.map
		// So create local variables
		let this_var = this;
		let func_var = this.search ;
		MapService.static_map.on('moveend' , function(e){ func_var(e, this_var )} ) ;
		Util.map_search_start();
		this.search(null, this);
		//Util.show_map();
	
		// resetting zoom not working.  It requires browser extension.
		// and it causes problem in android chrome when try to change z-index of the map.
		//let reset_zoom_var = Util.reset_zoom;
		//window.onresize = function(){ reset_zoom_var()};
		//window.addEventListener("resize", function(){reset_zoom_var()} );
	}
		
	search(event, this_var){
		if ( !Util.is_in_map_search()) {
			console.debug ('201810272312 MapControllerComponent.search() No Map searching.') ;
			return;
		}
		this_var.reset_msg();
		this_var.warning_msg = 'Searching ...';
		this_var.journeys_from_db =[]; // remove previous search result from screen

        let rider_criteria = StorageService.getForm(C.KEY_FORM_SEARCH);

			
		let region_search_criteria  
			={	  
				p1:		{ 
							  lat	:MapService.static_map.getBounds().getSouth()
							, lon 	:MapService.static_map.getBounds().getWest()
						}
				, p2:		{ 
							  lat	:MapService.static_map.getBounds().getNorth()
							, lon 	:MapService.static_map.getBounds().getEast()
						}
			} ;


		// region p1,p2 overwrite rider_criteria.p1,p2
		let search_criteria_combined = {...rider_criteria, ... region_search_criteria};
		
		console.debug ('201810270146 MapControllerComponent.search() search_criteria_combined=\n'
					, search_criteria_combined);
		let data_from_db_observable     
			= this_var.dbService.call_db(C.URL_SEARCH_REGION, search_criteria_combined);
		
		data_from_db_observable.subscribe(
			journeys_from_db => {
				this_var.reset_msg();
				console.info("201808201201 MapControllerComponent.search() journeys_from_db ="
						, C.stringify(journeys_from_db));
				this_var.Status.search_result= journeys_from_db;
				//this_var.journeys_from_db = journeys_from_db;
				if(journeys_from_db.length == 0 ) 
					this_var.warning_msg = 'Nothing found in the map region';
				this_var.communicationService.send_msg(C.MSG_KEY_MARKER_CLEAR, {});
				this_var.communicationService.send_msg(C.MSG_KEY_MARKER_BOOKS , journeys_from_db);
				let pair = JSON.parse(C.stringify(rider_criteria));
				this_var.communicationService.send_msg(C.MSG_KEY_MARKER_PAIR , pair);
			},
			error => {
				this_var.reset_msg();
				this_var.error_msg=error;
			}
		)
	}
		
	resize()
	{// not working
		//let height = window.innerHeight;
		//let width  = window.innerWidth;
		//document.getElementById("map").style.height = height + "px";
		//document.getElementById("map").style.width = height + "px";
	}
	subscription_action ( msg: any): void{
		console.debug("201810271226 MapControllerComponent.subscriptio_action(). ignore msg");
	}
}
		
