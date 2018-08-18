import { Component, OnInit } from '@angular/core';
import * as L from "leaflet";
import {MapService} from "../../models/map.service"

@Component({
  selector: 'app-map2',
  templateUrl: './map2.component.html',
  styleUrls: ['./map2.component.css']
})
export class Map2Component implements OnInit {

	map; 

	constructor() { }

	ngOnInit() {
		let mapService = new MapService();
		this.map= mapService.createMap('map', 41.889489, -87.633229, 12) ;
	}
}
