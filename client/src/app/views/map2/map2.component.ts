import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs';

import * as L from "leaflet";

import {MapService} from "../../models/map.service"
import {CommunicationService} from "../../models/communication.service"


@Component({
  selector: 'app-map2',
  templateUrl: './map2.component.html',
  styleUrls: ['./map2.component.css'],
  //providers: [CommunicationService],

})
export class Map2Component implements OnInit , OnDestroy {
	subscription: Subscription;

	map; 

	constructor(private communicationService: CommunicationService) { 
		this.subscription =this.communicationService.currentMessage.subscribe(
      			trip  => {
					console.info("201808222332 Map2Component.constructor.  subscription got message. trip="+ JSON.stringify(trip));
					//this.flyTo(trip);
				}
    		);	  
	}

	ngOnInit() {
		let mapService = new MapService();
		this.map= mapService.createMap('map', 41.889489, -87.633229, 12) ;
	}

	ngOnDestroy() {
	    // prevent memory leak when component destroyed
		this.subscription.unsubscribe();
	}

	flyTo (trip: any)
	{
		if (trip.start_lat && trip.end_lat) {
			this.map.flyToBounds(trip.start_lat, trip.start_lon, trip.start_display_name
				, trip.end_lat, trip.end_lon, trip.end_display_name
			)
			
		}
		else if ( trip.start_lat) {
			this.map.flyTo(trip.start_lat, trip.start_lon, trip.start_display_name);
		}
		else if (trip.end_lat) {
			this.map.flyTo(trip.end_lat, trip.end_lon, trip.end_display_name);
		}
		else {} 
	}
}
