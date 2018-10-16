import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs';

import * as L from "leaflet";

import {MapService} from "../../models/map.service"
import {CommunicationService} from "../../models/communication.service"
import {DotIcon} from "../../models/map.service"
import {PinIcon} from "../../models/map.service"


@Component({
  selector: 'app-map2',
  templateUrl: './map2.component.html',
  styleUrls: ['./map2.component.css'],
  //providers: [CommunicationService],

})
export class Map2Component implements OnInit , OnDestroy {
	subscription1: Subscription;
	subscription2: Subscription;
	subscription3: Subscription;

	constructor(private communicationService: CommunicationService
		, private mapService: MapService) { 
		this.subscription1 =this.communicationService.trip_msg.subscribe(
      			trip  => {
				console.debug("201808222332 Map2Component.constructor. trip="
					, JSON.stringify(trip));
				mapService.tryFlyTo(trip, PinIcon);
			}
    		);
		this.subscription2 =this.communicationService.marker_pair_msg.subscribe(
      			pair  => {
				console.debug("201808222332 Map2Component.constructor. pair="
					, JSON.stringify(pair));
				mapService.place_marker_pair(
					pair.start_lat, pair.start_lon, pair.start_display_name
					, pair.end_lat, pair.end_lon  , pair.end_display_name
					, DotIcon
					, 'random_same'
					, pair.markertext
					);
			}
    		);
	}

	ngOnInit() {
		this.mapService.createMap('map', 41.889489, -87.633229, 12) ;
	}

	ngOnDestroy() {
	    // prevent memory leak when component destroyed
		this.subscription1.unsubscribe();
		this.subscription2.unsubscribe();
	}
}
