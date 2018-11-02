import { Component, OnInit } 	from '@angular/core';
import { OnDestroy } 		from '@angular/core';
import { Subscription }   	from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';


import * as L from "leaflet";

import {MapService} from "../../models/map.service"
import {DotIcon} 	from "../../models/map.service"
import {PinIcon} 	from "../../models/map.service"
import {C} 			from "../../models/constants"
//import {Ridebase} 	from "../../models/ridebase"
import {Util} 		from "../../models/gui.service"
//import {DBService} 	from '../../models/remote.service' ;
import {Status} 	from "../../models/gui.service"
import { StorageService     } from '../../models/gui.service';
//import {CommunicationService} from "../../models/communication.service"
import { BaseComponent      } from '../base/base.component' ;


@Component({
	selector: 'app-map-controller',
	templateUrl: './map-controller.component.html',
	styleUrls: ['./map-controller.component.css'],
	//providers: [CommunicationService],
	changeDetection: ChangeDetectionStrategy.OnPush , 
		
})
export class MapControllerComponent extends BaseComponent {

	constructor( public changeDetectorRef   : ChangeDetectorRef ) { 
		super(changeDetectorRef);
	}
		
	ngoninit() {
		console.debug('201810291007 MapControllerComponent.ngOnInit() enter');

		//change class of the div#main to change style
		let element = document.getElementById("main");
    	if(element) element.classList.add("map-controller"); // for changing style

        let rider_criteria = StorageService.getForm(C.KEY_FORM_SEARCH) ;

		if (! rider_criteria || rider_criteria.distance== C.ERROR_NO_ROUTE ) 
			this.error_msg
				='Search criteria is not available.<br/> Please use Search Setting to set it up';
		else {
			this.warning_msg = 'Please adjust map area to search for available trips' ;

			// javascript style calling does not recognize this in this.map
			// So create local variables
			let this_var = this;
			let func_var = this.search ;
			this.mapService.map.on('moveend' , function(e){ func_var(e, this_var )} ) ;
			Util.map_search_start();


			//move map viewport to contain rider_criteria
			//let rc_pair = Util.deep_copy(rider_criteria);
			let viewport= MapService.map_viewport_with_margin(rider_criteria, C.MAP_VIEWPORT_MARGIN);
            this.communicationService.send_msg(C.MSG_KEY_MARKER_FIT, viewport);

			//this.search(null, this);
		}
		
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
		
        this_var.changeDetectorRef.detectChanges() ;


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


        let rider_criteria = StorageService.getForm(C.KEY_FORM_SEARCH) ;
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
				// save both search result and rider criteria at the same time
				// rider criteria will be used to determin the Book button in journey page
				this_var.Status.search_result= journeys_from_db;
				this_var.Status.rider_criteria= rider_criteria;
				let rows_found = journeys_from_db.length ;

				if(rows_found == 0 ) this_var.warning_msg = 'Nothing found in the map region';
				else if(rows_found >= C.MAX_SEARCH_RESULT ) 
					this_var.warning_msg = 'Found more than ' + C.MAX_SEARCH_RESULT 
						+ ' offers. Showing ' + C.MAX_SEARCH_RESULT
						+ '. <br/>Please adjust map area to found more relevant offers';
				else this_var.info_msg = `Found ${rows_found} offers.`

				this_var.communicationService.send_msg(C.MSG_KEY_MARKER_CLEAR, {});
				this_var.communicationService.send_msg(C.MSG_KEY_MARKER_BOOKS , journeys_from_db);
				let pair = Util.deep_copy(rider_criteria);
				this_var.communicationService.send_msg(C.MSG_KEY_MARKER_PAIR , pair);
				this_var.changeDetectorRef.detectChanges() ;
			},
			error => {
				this_var.reset_msg();
				this_var.error_msg=error;
				this_var.changeDetectorRef.detectChanges() ;
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

	onngdestroy()
	{
		Util.map_search_stop();
		let element = document.getElementById("main");
    	if(element) element.classList.remove("map-controller");
		
	}
}
		
