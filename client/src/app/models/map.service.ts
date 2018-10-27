import { Injectable } from "@angular/core";
//import { HttpClient } from "@angular/common/http";
//import { Location } from "./location";
import * as L from "leaflet";

import { C } from "./constants";

@Injectable()
export class MapService {
	public map: L.Map;
	public baseMaps: any;
	private vtLayer: any;
	private marker: any;
	private markerFrom: any;
	private markerTo: any;

	private marker_arr: any =[];
	private lines: any =[];

	constructor() {
		const osmAttr =
			"&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>, " +
			"Tiles courtesy of <a href='http://hot.openstreetmap.org/' target='_blank'>Humanitarian OpenStreetMap Team</a>";
	
		const esriAttr =
			"Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, " +
			"iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, " +
			"Esri China (Hong Kong), and the GIS User Community";
		
		const cartoAttr =
			"&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> " +
			"&copy; <a href='https://cartodb.com/attributions'>CartoDB</a>";
		
		this.baseMaps = {

			OpenStreetMapBusy: L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		  		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			  	subdomains: ['a', 'b', 'c']
				}
		        ) ,
			OpenStreetMap: L.tileLayer(
				"https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
				{
				//zIndex: 1,
					attribution: osmAttr ,
				}
			),
			Esri: L.tileLayer(
				"https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
				{
					zIndex: 1,
					attribution: esriAttr
				}
			),
		CartoDB: L.tileLayer(
		"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
		{
		zIndex: 1,
		attribution: cartoAttr
		}
		)
		};
	}

	clear_markers(){
		for (let index in this.marker_arr){
			this.map.removeLayer(this.marker_arr[index]);
		}
		this.marker_arr=[];

		this.clear_lines();
	}

	clear_lines(){
		for (let index in this.lines){
			this.map.removeLayer(this.lines[index]);
		}
		this.lines=[];
	}


	disableMouseEvent(elementId: string) {
		const element = <HTMLElement>document.getElementById(elementId);
		
		L.DomEvent.disableClickPropagation(element);
		L.DomEvent.disableScrollPropagation(element);
	}
		
	/*
	toggleMarkerEditing(on: boolean) {
		if (on) {
		this.map.on("click", this.addMarker.bind(this));
		} else {
		this.map.off("click");
		}
	}
	*/
		
	/*
	fitBounds(bounds: L.LatLngBounds) {
		this.map.fitBounds(bounds, {});
	}
	*/
		
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

	search_marker(lat, lon): number{
		for ( let index in this.marker_arr) {
			let latlon= this.marker_arr[index].getLatLng();
			let found = latlon.equals(L.latLng(lat, lon));
			if ( found) return Number(index);
		}
		return -1;
	}

	place_marker(lat: number, lon: number, popup_string:string
			, icon_type: any, color: string, text: string):boolean {
	
	  	if (lat == null || lon == null ) return false	; // failed to place marker
		if (this.search_marker(lat,lon) != -1) return true;
		if (icon_type== undefined || icon_type== null ) icon_type= PinIcon;
		if (color== undefined || icon_type== null ) color= 'blue';

		let popup = `<div>${lat} ${lon}</div><div>${popup_string}<div>`;
		let marker=   L.marker([lat,lon], {icon:icon_type.get(color,text)} )
				.addTo(this.map).bindPopup(popup) ;
		this.marker_arr.push(marker);
		return true; // success
	}

	mark_point(point: any): boolean {
		// point has properties: lat, lon, display_name, color, marker_text, icon_type

		//let p = {...point} // we don't want to modify input
		let p=point;
	
	  	if (!p) 	return false	; 
	  	if (!p.lat) 	return false	; 
		p.icon_type	= p.icon_type 	? p.icon_type 	: PinIcon	;
		p.color		= p.color 	? p.color	: 'blue' 	;
		p.marker_text	= p.marker_text ? p.marker_text : ''		;
		p.display_name	= p.display_name? p.display_name: '' 		;

		console.debug('201810210205 MapService.mark_point() p=\n', C.stringify(p));


		let popup = `<div>${p.lat} ${p.lon}</div><div>${p.display_name}<div>`;
		// if mark location has alread a marker, move a bit
		p.lat_offset = p.lat_offset?p.lat_offset:p.lat ;
		p.lon_offset = p.lon_offset?p.lon_offset:p.lon ;
		if (this.search_marker(p.lat_offset, p.lon_offset) != -1) {
			p.lat_offset = p.lat + C.MAP_OVERLAP_OFFSET * 5*(Math.random()-0.5);
			p.lon_offset = p.lon + C.MAP_OVERLAP_OFFSET * 5*(Math.random()-0.5);
		}
		let marker=   L.marker([p.lat_offset, p.lon_offset]
					, {icon:p.icon_type.get(p.color,p.marker_text)} )
				.addTo(this.map).bindPopup(popup) ;
		this.marker_arr.push(marker);
		return true; // success
	}

	place_marker_pair(start_lat	, start_lon	, start_display_name
			, end_lat	, end_lon	, end_display_name
			, icon_type
			, color:string
			, text: string ):boolean
	{
		let color1 ='green';
		let color2 ='red';

		if ( color == undefined || color == null)
		{
		}
		else if ( color == 'random') {
			color1 = this.getRandomColor();
			color2 = this.getRandomColor()
		}
		else if (  color == 'random_same' ) {
			color1 = this.getRandomColor();
			color2 = color1;
		}
		else {
			color1=color;
			color2=color;
		}
		let ok=this.place_marker( start_lat, start_lon,start_display_name,icon_type, color1, text);
		if (! ok) return ok
		ok = this.place_marker( end_lat, end_lon,end_display_name,icon_type, color2, text);
		return ok;
	}

 	getRandomColor():string {
  		var letters = '23456789AB';
  		var color = '#';
  		for (var i = 0; i < 6; i++) {
    		color += letters[Math.floor(Math.random() * 10)];
  		}
  		return color;
	}

	createMap(mapTag: string, lat: number, long: number, zoom: number): L.Map
	{
		//map = L.map('map').setView([lat, long], zoom);
		this.map = L.map(mapTag).setView([lat, long], zoom);

		this.baseMaps.OpenStreetMapBusy.addTo( this.map ) ;
		return this.map;
	}

	flyTo(lat,lon,display_name, icon_type, color:string): boolean{ // display_name will be shown in popup
		console.debug("flyTo");
		this.clear_markers();
		let ok = this.place_marker(lat,lon, display_name, icon_type, color, '') ;
		if (!ok) return ok;
		this.map.setView([lat,lon],12);
		//this.map.flyTo([lat,lon],12);
		return true;
	}

	set_view(point: any) : boolean {
		if ( point ==undefined || point == null) return false;
		let p = point;
		if ( p.lat == undefined || p.lat == null) return false;
		this.map.setView([p.lat, p.lon],12);
		return true;
	}


	flyToBounds(start_lat, start_lon, start_display_name, end_lat, end_lon, end_display_name, icon_type)
		: boolean
	{
		console.debug("flyToBounds");
		this.clear_markers();
		let ok = this.place_marker_pair( start_lat, start_lon, start_display_name
						, end_lat, end_lon, end_display_name, icon_type, null, '');
	 	if (!ok) return ok;	

		let corner1 = L.latLng(start_lat, start_lon);
		let corner2 = L.latLng(end_lat, end_lon);
		let bounds = L.latLngBounds(corner1, corner2);


		//if(this.marker)     {     this.map.removeLayer(this.marker); }
		//if(this.markerTo)   {     this.map.removeLayer(this.markerTo); }
		//if(this.markerFrom) {     this.map.removeLayer(this.markerFrom); }
		this.map.fitBounds(bounds);
		//this.map.flyToBounds(bounds);
		return true;
	}

	fit_pair(pair: any) : boolean
	{
		let p1 = pair.p1 ;
		let p2 = pair.p2 ;
		if (p1 == undefined) return false;
		if (p2 == undefined) return false;
		if (p1.lat == undefined || p1.lat == null 
			|| p2.lat == undefined || p2.lat == null) return false;
		let corner1 = L.latLng(p1.lat, p1.lon);
		let corner2 = L.latLng(p2.lat, p2.lon);
		let bounds = L.latLngBounds(corner1, corner2);

		this.map.fitBounds(bounds);
		//this.map.flyToBounds(bounds);
		return true;
	}

	mark_pair(pair:any) : boolean
	{
		let p1 = pair.p1 ;
		let p2 = pair.p2 ;
		if ( p1 == undefined) return false;
		if ( p2 == undefined) return false;
		if (p1.lat == undefined || p1.lat == null 
			|| p2.lat == undefined || p2.lat == null) return false;
		
		
		if( p1.color == undefined || p1.color == null)  p1.color = C.COLOR_GREEN;
		if( p2.color == undefined || p2.color == null)  p2.color = C.COLOR_RED ;

		if (p1.color == 'random') p1.color = this.getRandomColor();
		if (p2.color == 'random') p2.color = this.getRandomColor();
		if ( p1.color == 'random_same')
		{
			p1.color = this.getRandomColor();
			p2.color = p1.color;
		}

		let ok=this.mark_point( p1);
		if (! ok) return ok
		ok = this.mark_point(p2);
		return ok;
	}

	try_mark_pair (pair: any) : boolean {
		let ok = this.mark_pair (pair);
		if (ok) return ok;
		ok = this.mark_point(pair.p1) ;
		if (ok) return ok;
		ok = this.mark_point(pair.p2) ;
		return ok;
	}

	try_fit_pair (pair: any) : boolean {
		let ok = this.fit_pair (pair);
		if (ok) return ok;

		ok= this.set_view(pair.p1);
		if (ok) return ok;

		ok = this.set_view(pair.p2) ;
		return ok;
	}

        tryFlyTo (trip: any, icon_type: any): boolean
        {
                let ok= this.flyToBounds(trip.start_lat, trip.start_lon, trip.start_display_name
                                , trip.end_lat, trip.end_lon, trip.end_display_name
                                , icon_type 
                        )
                if (ok) return ok;

                ok = this.flyTo(trip.start_lat, trip.start_lon, trip.start_display_name
                                                , icon_type, 'green'
                        );
                if (ok) return ok;
                ok=     this.flyTo(trip.end_lat, trip.end_lon, trip.end_display_name, icon_type, 'red');
                return ok
        }

	
	
	routingUrl(start_lat, start_lon, end_lat, end_lon){
	// curl 'http://router.project-osrm.org/route/v1/driving/13.388860,52.517037;13.397634,52.529407;13.428555,52.523219?overview=false'
		let url= "https://router.project-osrm.org/route/v1/driving/" ;
		let points=start_lon+","+ start_lat + ";" + end_lon+ ","+ end_lat  ;
		let query="?overview=false"  ;
		let urlEncoded=url+points+query ;
		return urlEncoded;
	}
	
	draw_line(pair: any):boolean {
		if ( !pair) 		return false;
		if ( !pair.p1) 		return false;
		if ( !pair.p2)   	return false;
		if ( !pair.p1.lat ) 	return false;
		if ( !pair.p2.lat ) 	return false;
		var polyline = L.polyline
		(
			[
            			[pair.p1.lat, pair.p1.lon],
            			[pair.p2.lat, pair.p2.lon],
            		],
            		{
                		color: pair.line_color?pair.line_color:C.MAP_LINE_COLOR_REGULAR,
                		weight: 1,
                		opacity: 1 ,
                		//dashArray: '20,15',
                		//lineJoin: 'round'
            		}
            	).addTo(this.map);
		this.lines.push(polyline);
		return true;
	}
}


export class PinIcon {
		//var myCustomColour = '#583470' ;
		
 	public static get (myCustomColour: string, text: string) {
		let markerHtmlStyles = 
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
		
		let markerHtmlStylesSmall = 
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
		
		let html= 	''  ;
		html +=`<span class="mapicon" style="background: radial-gradient(red,white, red 70%); width:1.5rem;height:1.5rem;display: block; left: -0.75rem;top: -1.5rem;position: absolute; border: 0px solid white; border-radius: 20rem" >${text}</span>`  ;
		//html +='<span class="mapiconcenter" style="background: linear-gradient(to bottom right, white, white);; width:0.5rem;height: 0.5rem;display: block; left: -0.25rem;top: -1.0rem;position: absolute; border: 0rem solid red; border-radius: 20rem" ></span>' ;
		html +='<span class="mapiconstemfrom" style=" background-color: red; width: 0.2rem;height: 1.5rem;display: block; left: -0.1rem;top: -0.1rem;position: absolute; border: 0rem solid red; border-radius: 8rem" ></span> ' ;
		html = html.replace(/red/g, myCustomColour);
		
		
		
		
		//console.log ("DEBUG 201807181726 markerHtmlStyles= " + markerHtmlStyles) ;
		
		let colorIcon = L.divIcon({
		className: "my-custom-pin",
		//className: "",
		iconAnchor: [0, 24],
		//labelAnchor: [-6, 0],
		popupAnchor: [0, -36],
		//html: '<span style="'+ markerHtmlStylesSmall+ '" />'
		html: html
		})   ;
		return colorIcon;
	}
}

export class DotIcon {
		//var myCustomColour = '#583470' ;
		
 	public static get (myCustomColour: string, text: string) {
		let markerHtmlStyles = 
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
		
		let markerHtmlStylesSmall = 
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
		
		let html= 	''  ;
		html +=`<span class="mapicon" style="background: radial-gradient(white, red ); width:1rem;height:1rem;display: block; left: -0.5rem;top: 1rem;position: absolute; border: 0px solid white; border-radius: 20rem" >${text}</span>`  ;
		//html +='<span class="mapiconcenter" style="background: linear-gradient(to bottom right, white, white);; width:0.5rem;height: 0.5rem;display: block; left: -0.25rem;top: -1.0rem;position: absolute; border: 0rem solid red; border-radius: 20rem" ></span>' ;
		//html +='<span class="mapiconstemfrom" style=" background-color: red; width: 0.2rem;height: 1.5rem;display: block; left: -0.1rem;top: -0.1rem;position: absolute; border: 0rem solid red; border-radius: 8rem" ></span> ' ;
		html = html.replace(/red/g, myCustomColour);
		
		
		
		
		//console.log ("DEBUG 201807181726 markerHtmlStyles= " + markerHtmlStyles) ;
		
		let colorIcon = L.divIcon({
		className: "my-custom-dot",
		//className: "",
		iconAnchor: [0, 24],
		//labelAnchor: [-6, 0],
		popupAnchor: [0, -36],
		//html: '<span style="'+ markerHtmlStylesSmall+ '" />'
		html: html
		})   ;
		return colorIcon;
	}
}
	
	
