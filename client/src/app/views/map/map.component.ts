import { Component, OnInit } from '@angular/core';
//import { LeafletModule } from '@asymmetrik/ngx-leaflet';
//import { latLng, LatLng, tileLayer } from 'leaflet';

import * as L from "leaflet";

@Component({
	selector: 'app-map',
  	templateUrl: './map.component.html',
  	styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
	imports: [
    	LeafletModule
	]

	options = {
		layers: [
			tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
		],
		zoom: 5,
		center: latLng(46.879966, -121.726909)
	};
  	constructor() { }
	
  	ngOnInit() {
  }
}
