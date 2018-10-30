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



@Component({
  selector: 'app-map2',
  templateUrl: './map2.component.html',
  styleUrls: ['./map2.component.css'],
  //providers: [CommunicationService],

})
export class Map2Component extends Ridebase implements OnInit  {

	map: L.Map ;
	journeys_from_db = [];

	constructor(	  public communicationService	: CommunicationService
	                , private dbService             : DBService
			, private mapService		: MapService) 
	{ 
		super(communicationService);
		this.page_name=C.PAGE_MAP;

		// body_show indicates the map page either has a high z-index or low z-index
		// it does not control the z-index. It is a status indeicator.
		this.show_body=C.BODY_NOSHOW; 
	}

	ngOnInit() {
		console.debug('201810242021 Map2Component.ngOnInit() enter');
		if( this.mapService.current_loc.lat) {
			this.map=this.mapService.createMap('map'
				, this.mapService.current_loc.lat, this.mapService.current_loc.lon, 12);
		} else {
			this.map=this.mapService.createMap('map', 39.264283, -96.786196, 4) ;
		}
		console.debug ('201810270221 this.map=\n', this.map);

		// javascript style calling does not recognize this in this.map
		// So create local variables
/*
		let this_var = this;
		let func_var = this.search ;
		this.map.on('moveend' , function(e){ func_var(e, this_var )} ) ;
		this.search(null, this);
*/

		// resetting zoom not working.  It requires browser extension.
		// and it causes problem in android chrome when try to change z-index of the map.
		//let reset_zoom_var = Util.reset_zoom;
            	//window.onresize = function(){ reset_zoom_var()};
		//window.addEventListener("resize", function(){reset_zoom_var()} );
	}

        subscription_action(msg): void {
		if (msg.msgKey==C.MSG_KEY_MAP_BODY_SHOW) {
			this.show_body=C.BODY_SHOW ;
			Util.show_map();
		}
		if (msg.msgKey==C.MSG_KEY_MAP_BODY_NOSHOW) {
			this.show_body=C.BODY_NOSHOW ;
			Util.hide_map();
		}
		else if (msg.msgKey==C.MSG_KEY_MARKER_CLEAR) {
			this.mapService.clear_markers();
		}
		else if (msg.msgKey == C.MSG_KEY_MARKER_PAIR ) {
			this.mapService.try_mark_pair(msg);
		}
		else if (msg.msgKey == C.MSG_KEY_MARKER_BOOKS ) {
			this.mapService.mark_books(msg, -1);
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
		// close page using a common interface
		this.communicationService.send_msg(C.MSG_KEY_MAP_BODY_NOSHOW, {});
		
		//document.getElementById('map').style.zIndex = '100';
		//document.getElementById('map-close-button').style.zIndex = '100';	
		return false;
	}


/*
        search(event, this_var){
		console.debug ('201810271222 Map2Component.search() map=', this_var.map);

		
		if ( !Util.is_in_map_search()) {
			console.debug ('201810272312 map2Component.search() No Map searching.') ;
			return;
		}
                this_var.reset_msg();
                this_var.warning_msg = 'Searching ...';
                this_var.journeys_from_db =[]; // remove previous search result from screen
	
		let search_criteria 
			={	  start_lat	:this_var.map.getBounds().getSouth()
				, start_lon	:this_var.map.getBounds().getWest()
				, end_lat	:this_var.map.getBounds().getNorth()
				, end_lon	:this_var.map.getBounds().getEast()
			 } ;
                search_criteria = {...search_criteria, ...this_var.Status.rider_criteria};

                console.debug ('201810270146 Map2Component.search() search_criteria=\n'
			, search_criteria);
		let data_from_db_observable     
			= this_var.dbService.call_db(C.URL_SEARCH_REGION, search_criteria);


                data_from_db_observable.subscribe(
                        journeys_from_db => {
                                console.info("201808201201 Map2Component.search() journeys_from_db ="
                                        , C.stringify(journeys_from_db));
                                this_var.reset_msg();
				this_var.Status.search_result= journeys_from_db;
                                this_var.journeys_from_db = journeys_from_db;
                                if(this_var.journeys_from_db.length == 0 ) 
					this_var.warning_msg = 'Nothing found in the map region';
				this_var.communicationService.send_msg(C.MSG_KEY_MARKER_CLEAR, {});

				this_var.communicationService.send_msg(C.MSG_KEY_MARKER_BOOKS
					, journeys_from_db);

                        },
                        error => {
                                        this_var.error_msg=error;
                                }
                )
        }
*/

 	resize()
        {// not working
               //let height = window.innerHeight;
               //let width  = window.innerWidth;
               //document.getElementById("map").style.height = height + "px";
               //document.getElementById("map").style.width = height + "px";
        }
}
