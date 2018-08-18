import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http'; 
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// code sample from https://angular.io/guide/http

@Injectable({
  providedIn: 'root'
})

export class RemoteService {
	body: any;
  	constructor(private httpClient: HttpClient) { }

	private routingUrl(start_lat, start_lon, end_lat, end_lon){
		let url= "http://router.project-osrm.org/route/v1/driving/" ;
		let points=start_lon+","+ start_lat + ";" + end_lon+ ","+ end_lat  ;
		let query="?overview=false"  ;
		let encodedUrl=url+points+query ;
		return encodedUrl;
	}

	routing(start_lat, start_lon, end_lat, end_lon) : number {
		// curl 'http://router.project-osrm.org/route/v1/driving/13.388860,52.517037;13.397634,52.529407;13.428555,52.523219?overview=false'
		// response: {"routes":[{"legs":[{"summary":"","weight":534.5,"duration":354.1,"steps":[],"distance":1880.2},{"summary":"","weight":679.8,"duration":483.4,"steps":[],"distance":2947.6}],"weight_name":"routability","weight":1214.3,"duration":837.5,"distance":4827.8}],"waypoints":[{"hint":"09sJgLtb54QkAAAADwAAAAMAAAAAAAAAeOI0QY6li0FoZYRAAAAAACQAAAAPAAAAAwAAAAAAAACyowAAAEzMAKlYIQM8TMwArVghAwEA3wqcmk-F","name":"Friedrichstraße","location":[13.3888,52.517033]},{"hint":"KpYTgKABvYEMAAAACgAAANYBAAAAAAAA4pzIQFu_j0CGdCVDAAAAAAwAAAAKAAAAXgEAAAAAAACyowAAf27MABiJIQOCbswA_4ghAwQAnxCcmk-F","name":"Torstraße","location":[13.397631,52.529432]},{"hint":"9n8YgP___38cAAAA2AAAACIAAABQAAAAsowKQkpQX0Lx6yZC8esmQhwAAABsAAAAIgAAACkAAACyowAASufMAOdwIQNL58wA03AhAwMAvxCcmk-F","name":"Platz der Vereinten Nationen","location":[13.428554,52.523239]}],"code":"Ok"}
		let encodedUrl = this.routingUrl(start_lat, start_lon, end_lat, end_lon);

		let response= this.request(encodedUrl) ;
		this.subscribe(response);
		let distance=this.body.routes[0].distance ;
		return  Math.round(distance /160)/10;
	}



	geocode(address: string) :any     {
		//request:   https://nominatim.openstreetmap.org/search/135%20pilkington%20avenue,%20birmingham?format=json&polygon=0&addressdetails=0
		//response:   [{"place_id":"91015286","licence":"Data © OpenStreetMap contributors, ODbL 1.0. https:\/\/osm.org\/copyright","osm_type":"way","osm_id":"90394480","boundingbox":["52.5487473","52.5488481","-1.816513","-1.8163464"],"lat":"52.5487921","lon":"-1.8164308339635","display_name":"135, Pilkington Avenue, Sutton Coldfield, Birmingham, West Midlands Combined Authority, West Midlands, England, B72 1LH, United Kingdom","class":"building","type":"yes","importance":0.411}]

		let url="https://nominatim.openstreetmap.org/search/" ;
		//	address = 135%20pilkington%20avenue,%20birmingham ;

		let query="?format=json&polygon=0&addressdetails=0" ;
		let encodedUrl = url+encodeURIComponent(address) +query;
		console.debug("20180815 geocode() encodedUrl="+encodedUrl) ;
		let response= this.request(encodedUrl) ;
		this.subscribe(response);
		return this.body ;
	}

	private request( url: string) : Observable<HttpResponse<string>>
	{
		let httpHeaders = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Cache-Control': 'no-cache'
		});    

		//let params= new HttpParams().set('format', 'json').set('polygon', '0').set('addressdetails','0);

		let options = {
			//body: null,
			//headers: null ,
			//headers: httpHeaders ,
			//params : params ,
			observe: 'response',  //observe : 'response' for complete response. 
			//observe : 'body' , //for response with body. this is default
			//observe : 'events' , // for response with events. 
			responseType: 'text'  // The values of responseType are arraybuffer, blob, json and text. json is default
			//responseType: 'json' , // The values of responseType are arraybuffer, blob, json and text. json is default
			//reportProgress: false,
			//withCredentials: false
		};        
		// documentattion :  https://angular.io/api/common/http/HttpClient
		//let response : Observable<HttpResponse<string>> = this.httpClient.request('GET', url, options)  ; //this cause assignment error. Not assignable. Why?
		let response : Observable<HttpResponse<string>> = this.httpClient.request('GET', url, {observe: 'response',responseType: 'text'})  ;
		return response;

	}

	private subscribe(response: Observable<HttpResponse<string>>) 
	{
		return response.subscribe(
		       res => 	{ 
					let body = res.body;
					console.info("201808151825 httpClient subscribe() res.body=\n");
					console.info(res.body);
					//console.log(res.headers.get('Content-Type'));		
					this.body= JSON.parse(res.body);
				},
			(err: HttpErrorResponse) => {
				if (err.error instanceof Error) {
				//A client-side or network error occurred.				 
					console.error('201808152105 An error occurred:', err.error.message);
					
				} 
				else 
				{
					//Backend returns unsuccessful response codes such as 404, 500 etc.				 
					console.error('201808152106 Backend returned status code: ', err.status);
					console.error('201808152106 Response body:', err.error);
				}
			}
		);
	}

	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error( `Backend returned code ${error.status}, ` + `body was: ${error.error}`);
		}
			// return an observable with a user-facing error message
		return throwError( 'Something bad happened; please try again later.');
	};

	get_user_from_db(user: string) {
	}
}





