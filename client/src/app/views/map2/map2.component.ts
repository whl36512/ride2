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

	map: L.Map ;

	constructor(	  public communicationService: CommunicationService
			, private mapService: MapService) 
	{ 
		super(communicationService);
		this.page_name=C.PAGE_MAP;
		this.show_body=C.BODY_SHOW;
	}

	ngOnInit() {
		console.debug('201810242021 Map2Component.ngOnInit() enter');
		this.map=this.mapService.createMap('map', 39.264283, -96.786196, 4) ;
		console.debug ('201810270221 this.map=\n', this.map);
		//this.map.on('dragend', this.onDragEnd);
		
		this.map.on('moveend', this.onDragEnd);
	}

        subscription_action(msg): void {
		if (msg.msgKey==C.MSG_KEY_MAP_BODY_SHOW) {
			this.show_body=C.BODY_SHOW ;
			document.getElementById('map').style.zIndex = '300';	
			document.getElementById('map-close-button').style.zIndex = '301';	
		}
		if (msg.msgKey==C.MSG_KEY_MAP_BODY_NOSHOW) {
			this.show_body=C.BODY_NOSHOW ;
			document.getElementById('map').style.zIndex = '100';	
			document.getElementById('map-close-button').style.zIndex = '100';	
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
		else if (msg.msgKey == C.MSG_KEY_MAP_LINE ) {
			this.mapService.draw_line(msg);
		}
		else {
			console.debug("201808222332 Map2Component.subscription_action. ignore msg");
		}
        }
	//override Ridebase.close_page()
	close_page():boolean {
			document.getElementById('map').style.zIndex = '100';
			document.getElementById('map-close-button').style.zIndex = '100';	
		return false;
	}

        onDragEnd(){
		console.debug ('201810270219 Map2Component.onDragEnd() enter');
		console.debug ('201810270221 this.map=\n', this.map);
		return;
/*
                var width = this.map.getBounds().getEast() - this.map.getBounds().getWest();
                var height = this.map.getBounds().getNorth() - this.map.getBounds().getSouth();

                console.debug ('201810270146 mapService.onDragEnd()'
                        + '\ncenter:' + this.map.getCenter()
                        + '\neast:' + this.map.getBounds().getEast()
                        + '\nwest:' + this.map.getBounds().getWest()
                        + '\nnorth:' + this.map.getBounds().getNorth()
                        + '\nsouth:' + this.map.getBounds().getSouth()
                );
*/
        }
}
