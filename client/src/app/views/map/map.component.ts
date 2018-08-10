import { Component, OnInit } from '@angular/core';
//import { LeafletModule } from '@asymmetrik/ngx-leaflet';
//import { latLng, LatLng, tileLayer } from 'leaflet';

import * as L from "leaflet";
import { MapService } from "../../models/map/map.service";

@Component({
	selector: 'app-map',
  	templateUrl: './map.component.html',
  	styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

	constructor( private mapService: MapService) {
	}

  	ngOnInit() {
		this.mapService.createMap('map', 41.893194, -87.629226, 12);

  	}
}
