import { Injectable } from "@angular/core";
//import { HttpClient } from "@angular/common/http";
//import { Location } from "./location";
import * as L from "leaflet";

@Injectable()
export class MapService {
	public map: L.Map;
	public baseMaps: any;
	private vtLayer: any;
	private maker: any;
	private maker: any;
	private makerFrome: any;
	private makerTo: any;

	constructor() {
		const osmAttr =
			"&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>, " +
			"Tiles courtesy of <a href='http://hot.openstreetmap.org/' target='_blank'>Humanitarian OpenStreetMap Team</a>";
	
		const esriAttr =
			"Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, " +
			"iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, " +
			"Esri China (Hong Kong), and the GIS User Community";
		
		const cartoAttr =
			"&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> " +
			"&copy; <a href='http://cartodb.com/attributions'>CartoDB</a>";
		
		this.baseMaps = {

			OpenStreetMapBusy: L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		  		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			  	subdomains: ['a', 'b', 'c']
				}
		        ) ,
			OpenStreetMap: L.tileLayer(
				"http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
				{
				//zIndex: 1,
					attribution: osmAttr ,
				}
			),
			Esri: L.tileLayer(
				"http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
				{
					zIndex: 1,
					attribution: esriAttr
				}
			),
		CartoDB: L.tileLayer(
		"http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
		{
		zIndex: 1,
		attribution: cartoAttr
		}
		)
		};
	}
		
	disableMouseEvent(elementId: string) {
		const element = <HTMLElement>document.getElementById(elementId);
		
		L.DomEvent.disableClickPropagation(element);
		L.DomEvent.disableScrollPropagation(element);
	}
		
	toggleMarkerEditing(on: boolean) {
		if (on) {
		this.map.on("click", this.addMarker.bind(this));
		} else {
		this.map.off("click");
		}
	}
		
	fitBounds(bounds: L.LatLngBounds) {
		this.map.fitBounds(bounds, {});
	}
		
	/*
	private addMarker(e: L.LeafletMouseEvent) {
		const shortLat = Math.round(e.latlng.lat * 1000000) / 1000000;
		const shortLng = Math.round(e.latlng.lng * 1000000) / 1000000;
		const popup = `<div>Latitude: ${shortLat}<div><div>Longitude: ${shortLng}<div>`;
		const icon = L.icon({
			iconUrl: "assets/marker-icon.png",
			shadowUrl: "assets/marker-shadow.png"
		});
		
		const marker = L.marker(e.latlng, {
			draggable: true,
			icon
		})
		.bindPopup(popup, {
		offset: L.point(12, 6)
		})
		.addTo(this.map)
		.openPopup();
		
		marker.on("click", () => marker.remove());
	}
	*/
	
	createMap(mapTag: string, lat: number, long: number, zoom: number)
	{
		//map = L.map('map').setView([lat, long], zoom);
		this.map = L.map(mapTag).setView([lat, long], zoom);

		this.baseMaps.OpenStreetMapBusy.addTo( this.map ) ;
		return this.map;
	}

	function flyTo(lat,lon,name){
		console.log("flyTo");
		this.map.setView([lat,lon],12);
		//this.map.flyTo([lat,lon],12);
		if(marker) {         map.removeLayer(marker); }
		if(markerTo) {         map.removeLayer(markerTo); }
		if(markerFrom) {         map.removeLayer(markerFrom); }
		//marker1= L.marker([lat,lon]).addTo(map).bindPopup(name) ;
		marker= L.marker([lat,lon], {icon:MyIcon.get('#583470')}).addTo(map).bindPopup(name) ;
	}


	function flyToBounds(start_lat, start_lon, start_display_name, end_lat, end_lon, end_display_name)
	{
		console.debug("flyToBounds");
		fitB= this.map.fitBounds([
			[start_lat, start_lon],
			[end_lat, end_lon]
		]);
		if(marker)     {     this.map.removeLayer(marker); }
		if(markerTo)   {     this.map.removeLayer(markerTo); }
		if(markerFrom) {     this.map.removeLayer(markerFrom); }
		this.map.flyToBounds(fitB);
		markerFrom= L.marker([start_lat,start_lon], {icon:MyIcon.get('green')} ).addTo(this.map).bindPopup(start_display_name) ;
		markerTo=   L.marker([end_lat,end_lon], {icon:MyIcon.get('red')} ).addTo(this.map).bindPopup(end_display_name) ;
	}
	
	
	function routingUrl(start_lat, start_lon, end_lat, end_lon){
	// curl 'http://router.project-osrm.org/route/v1/driving/13.388860,52.517037;13.397634,52.529407;13.428555,52.523219?overview=false'
		var url= "http://router.project-osrm.org/route/v1/driving/" ;
		points=start_lon+","+ start_lat + ";" + end_lon+ ","+ end_lat  ;
		var query="?overview=false"  ;
		var urlEncoded=url+points+query ;
		return urlEncoded;
	}

}

class MyIcon {
 	function get (myCustomColour) {
		//var myCustomColour = '#583470' ;
		
		private markerHtmlStyles = 
		'background-color: ' + myCustomColour + ';' 				+
		'width: 3rem;' 				+
		'height: 3rem;' 				+
		'display: block;' 				+
		'left: -1.5rem;' 				+
		'top: -1.5rem;' 				+
		'position: relative;' 				+
		'border-radius: 3rem 3rem 0;' 				+
		'transform: rotate(45deg);' 				+
		'border: 1px solid #FFFFFF; '   ;
		
		private markerHtmlStylesSmall = 
		'background-color: ' + myCustomColour + ';' 				+
		'width: 2rem;' 				+
		'height: 2rem;' 				+
		'display: block;' 				+
		'left: -1rem;' 				+
		'top: -1rem;' 				+
		'position: relative;' 				+
		'border-radius: 2rem 2rem 0;' 				+
		'transform: rotate(45deg);' 				+
		'border: 1px solid #FFFFFF; '   ;
		
		private 	html= 	''  ;
		html +='<span class="mapiconfrom" style="background: radial-gradient(red,white, red 70%); width:1.5rem;height:1.5rem;display: block; left: -0.75rem;top: -1.5rem;position: absolute; border: 0px solid white; border-radius: 20rem" ></span>'  ;
		//html +='<span class="mapiconcenter" style="background: linear-gradient(to bottom right, white, white);; width:0.5rem;height: 0.5rem;display: block; left: -0.25rem;top: -1.0rem;position: absolute; border: 0rem solid red; border-radius: 20rem" ></span>' ;
		html +='<span class="mapiconstemfrom" style=" background-color: red; width: 0.2rem;height: 1.5rem;display: block; left: -0.1rem;top: -0.1rem;position: absolute; border: 0rem solid red; border-radius: 8rem" ></span> ' ;
		html = html.replace(/red/g, myCustomColour);
		
		
		
		
		//console.log ("DEBUG 201807181726 markerHtmlStyles= " + markerHtmlStyles) ;
		
		var colorIcon = L.divIcon({
		className: "my-custom-pin",
		//className: "",
		iconAnchor: [0, 24],
		labelAnchor: [-6, 0],
		popupAnchor: [0, -36],
		//html: '<span style="'+ markerHtmlStylesSmall+ '" />'
		html: html
		})   ;
		return colorIcon;
	}
}
	
	
