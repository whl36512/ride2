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

	constructor(	  public communicationService: CommunicationService
			, private mapService: MapService) 
	{ 
		super(communicationService);
		this.show_body=C.BODY_NOSHOW;
	}

	ngOnInit() {
		console.debug('201810242021 Map2Component.ngOnInit() enter');
		this.mapService.createMap('map', 41.889489, -87.633229, 12) ;
	}

        subscription_action(msg): void {
		if (msg.msgKey==C.MSG_KEY_MAP_BODY_SHOW) {
			this.show_body=C.BODY_SHOW
		}
		if (msg.msgKey==C.MSG_KEY_MAP_BODY_NOSHOW) {
			this.show_body=C.BODY_NOSHOW
		}
		else if (msg.msgKey==C.MSG_KEY_MARKER_CLEAR) {
			this.mapService.clear_markers();
		}
		else if (msg.msgKey == C.MSG_KEY_MARKER_PAIR ) {
			this.mapService.try_mark_pair(msg);
		}
		else if (msg.msgKey == C.MSG_KEY_MARKER_FIT ) {
			this.mapService.try_fit_pair(msg);
		}
		else {
			console.debug("201808222332 Map2Component.subscription_action. ignore msg");
		}
        }
}
