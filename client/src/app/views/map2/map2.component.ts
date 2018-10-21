import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs';

import * as L from "leaflet";

import {MapService} from "../../models/map.service"
import {CommunicationService} from "../../models/communication.service"
import {DotIcon} from "../../models/map.service"
import {PinIcon} from "../../models/map.service"
import {C} from "../../models/constants"
import {Ridebase} from "../../models/ridebase"


@Component({
  selector: 'app-map2',
  templateUrl: './map2.component.html',
  styleUrls: ['./map2.component.css'],
  //providers: [CommunicationService],

})
export class Map2Component extends Ridebase implements OnInit  {
	subscription1: Subscription;
	subscription2: Subscription;
	subscription3: Subscription;

	constructor(private communicationService: CommunicationService
		, private mapService: MapService) { 
		super();
		this.subscription1 =this.communicationService.trip_msg.subscribe(
      			pair  => {
				console.debug("201808222332 Map2Component.subscription1. pair="
					, C.stringify(pair));
				//mapService.tryFlyTo(trip, PinIcon);
				//let pair = C.convert_trip_to_pair(trip);

				mapService.clear_markers();
				mapService.try_mark_pair(pair);
				mapService.fit_pair(pair);
			}
    		);
		this.subscription2 =this.communicationService.marker_pair_msg.subscribe(
      			pair  => {
				console.debug("201808222332 Map2Component.subscription2. pair="
					, C.stringify(pair));

				//let pair = C.convert_trip_to_pair(trip);
				if (pair.p1 != undefined) pair.p1.icon_type=DotIcon;
				if (pair.p2 != undefined) pair.p2.icon_type=DotIcon;
				mapService.mark_pair(pair);

/*
				mapService.place_marker_pair(
					pair.start_lat, pair.start_lon, pair.start_display_name
					, pair.end_lat, pair.end_lon  , pair.end_display_name
					, DotIcon
					//, 'random_same'
					, null // default green and red color
					, pair.markertext
					);
*/
			}
    		);
	}

	ngOnInit() {
		this.mapService.createMap('map', 41.889489, -87.633229, 12) ;
	}
}
