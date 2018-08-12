import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class GeocodeService {
	public loc:Vec<Loc>;
	public headers: Any;
	public body: string ;
	public distance: number ;

  	constructor(private http: HttpClient) { }

  	private handleError(error: HttpErrorResponse) {
  		if (error.error instanceof ErrorEvent) {
  	  	// A client-side or network error occurred. Handle it accordingly.
  	  	console.error('An error occurred:', error.error.message);
  		} else {
  		 	// The backend returned an unsuccessful response code.
  		 	// The response body may contain clues as to what went wrong,
  	  	console.error(
  	    	`Backend returned code ${error.status}, ` +
  	    	`body was: ${error.error}`);
  		}
  	// return an observable with a user-facing error message
  		return throwError(
    		'Something bad happened; please try again later.');
	};

	geocode(address: string)   {
		//request:   https://nominatim.openstreetmap.org/search/135%20pilkington%20avenue,%20birmingham?format=json&polygon=0&addressdetails=0
		//response:   [{"place_id":"91015286","licence":"Data © OpenStreetMap contributors, ODbL 1.0. https:\/\/osm.org\/copyright","osm_type":"way","osm_id":"90394480","boundingbox":["52.5487473","52.5488481","-1.816513","-1.8163464"],"lat":"52.5487921","lon":"-1.8164308339635","display_name":"135, Pilkington Avenue, Sutton Coldfield, Birmingham, West Midlands Combined Authority, West Midlands, England, B72 1LH, United Kingdom","class":"building","type":"yes","importance":0.411}]
		let url="https://nominatim.openstreetmap.org/search/" ;
		//	input = 135%20pilkington%20avenue,%20birmingham ;
		query="?format=json&polygon=0&addressdetails=0" ;
		var urlEncoded = url+encodeURIComponent(address)+query ;
		console.log("geocode urlEncoded="+urlEncoded) ;
		let response : Observable<HttpResponse<Config>> = this.http.get<Loc>(urlEncoded, { observe: 'response' }) ;
		response.subscribe(
			resp => {
      		// display its headers
		      const keys = resp.headers.keys();
      				this.headers = keys.map(key =>
        			`${key}: ${resp.headers.get(key)}`);

      		// access the body directly, which is typed as `Config`.
      		this.loc = { ... resp.body };
    	});
	}

	routingUrl(start_lat, start_lon, end_lat, end_lon){
		var url= "http://router.project-osrm.org/route/v1/driving/" ;
		points=start_lon+","+ start_lat + ";" + end_lon+ ","+ end_lat  ;
		var query="?overview=false"  ;
		var urlEncoded=url+points+query ;
		return urlEncoded;
	}

	routing(start_lat, start_lon, end_lat, end_lon) {
		// curl 'http://router.project-osrm.org/route/v1/driving/13.388860,52.517037;13.397634,52.529407;13.428555,52.523219?overview=false'
		// response: {"routes":[{"legs":[{"summary":"","weight":534.5,"duration":354.1,"steps":[],"distance":1880.2},{"summary":"","weight":679.8,"duration":483.4,"steps":[],"distance":2947.6}],"weight_name":"routability","weight":1214.3,"duration":837.5,"distance":4827.8}],"waypoints":[{"hint":"09sJgLtb54QkAAAADwAAAAMAAAAAAAAAeOI0QY6li0FoZYRAAAAAACQAAAAPAAAAAwAAAAAAAACyowAAAEzMAKlYIQM8TMwArVghAwEA3wqcmk-F","name":"Friedrichstraße","location":[13.3888,52.517033]},{"hint":"KpYTgKABvYEMAAAACgAAANYBAAAAAAAA4pzIQFu_j0CGdCVDAAAAAAwAAAAKAAAAXgEAAAAAAACyowAAf27MABiJIQOCbswA_4ghAwQAnxCcmk-F","name":"Torstraße","location":[13.397631,52.529432]},{"hint":"9n8YgP___38cAAAA2AAAACIAAABQAAAAsowKQkpQX0Lx6yZC8esmQhwAAABsAAAAIgAAACkAAACyowAASufMAOdwIQNL58wA03AhAwMAvxCcmk-F","name":"Platz der Vereinten Nationen","location":[13.428554,52.523239]}],"code":"Ok"}
		let routingUrl = routingUrl(start_lat, start_lon, end_lat, end_lon);
		let response = this.http.get(routingUrl, { observe: 'response' }) ;
		response.subscribe(
			resp => {
      		// display its headers
		      const keys = resp.headers.keys();
      				this.headers = keys.map(key =>
        			`${key}: ${resp.headers.get(key)}`);
      		this.body = resp.body;
    	});

    	let responseTextJson=JSON.parse(this.body) ;
		this.distance= Math.round(responseTextJson.routes[0].distance /160)/10;
	}



function validatenewtrip(form) {
	console.log("INFO 201807142230 validatenewtrip enter " ) ; 
        var formData 	= getFormData(form);
        distance	= formData.get("distance") ;
        start_date 	= Date.parse(formData.get("start_date"))/(24.0*60*60*1000) ; // days from epoch
        departure_time  = formData.get("departure_time ") ;
        seats   	= formData.get("seats") ;
        price   	= formData.get("price") ;
        recur_ind    	= formData.get("recur_ind") ;
        end_date     	= Date.parse(formData.get("end_date"))/(24.0*60*60*1000) ; // days from epoch
        day0_ind      	= formData.get("day0_ind") ;
        day1_ind      	= formData.get("day1_ind") ;
        day2_ind      	= formData.get("day2_ind") ;
        day3_ind      	= formData.get("day3_ind") ;
        day4_ind      	= formData.get("day4_ind") ;
        day5_ind      	= formData.get("day5_ind") ;
        day6_ind      	= formData.get("day6_ind") ;

	nowtime		= Math.floor(Date.now()/(24.0*60*60*1000)) ; // days from epoch

	console.log("INFO 201807142019  nowtime = " + start_date + " " +  nowtime ) ; 
	console.log("INFO 201807142019 start_date - nowtime = " + (start_date - nowtime ) ) ; 
	if(distance ==="" ) {
	  console.log("ERROR 201807142049 distance unset") ; 
	  formData = null;
	}
	else if( isNaN(start_date)  ) {
	  console.log("ERROR 201807142049 start_date unset") ; 
	  formData = null;
	}
        else if(start_date - nowtime < -1) { 
	  console.log("ERROR 201807142019 start_date -  nowtime =" + (start_date - nowtime) +" < -1" ) ; 
	  formData = null;
	}
	else if(departure_time ==="" ) 
	{
	  console.log("ERROR 201807142049 departure_time unset") ; 
	  formData = null;
	}
	else if(seats ==="" )
	{
	  console.log("ERROR 201807142049 seats unset") ; 
	  formData = null;
	}
	else if ( seats <0 || seats > 6 ) 
	{
	  console.log("ERROR 201807142049 seats out of range") ; 
	  formData = null;
	}
	else if(price ==="" )
	{
	  console.log("ERROR 201807142049 price unset") ; 
	  formData = null;
	}
	else if ( price <0 || price > 0.2 ) 
	{
	  console.log("ERROR 201807142049 price out of range") ; 
	  formData = null;
	}
        else if (recur_ind ==="on" && isNaN(end_date) ) 
	{
	  console.log("ERROR 201807142049 recurring but end_date unset") ; 
	  formData = null;
	}
        else if (recur_ind ==="on" && (end_date < start_date)   ) 
        {
	  console.log("ERROR 201807142020  end_date < start_date " );
	  formData = null;
 	}
        else if (recur_ind ==="on" && (end_date - start_date) > 92 ) 
        {
	  console.log("ERROR 201807142301  end_date - start_date = " + (end_date - start_date) + " > 92" );
	  formData = null;
 	}
        else if (recur_ind ==="on" && day0_ind !== "on" && day1_ind !== "on" && day2_ind !== "on" && day3_ind !== "on" && day4_ind !== "on" && day5_ind !== "on" && day6_ind !== "on" ) {
	  console.log("ERROR 201807142027  recurring but no day of week is selected" );
	  formData = null;
        }
      
	if (formData === null) 
        {
	  document.getElementById("submit").disabled=true;
          console.log("ERROR 201807291017 validatenewtrip failed") ;
	  return false ;
 	}
	else 
	{
	  document.getElementById("submit").disabled=false;
          console.log("INFO 201807291018 validatenewtrip passed") ;
	  return true;
	}
	//return formData;
}
}

export interface loc {
	lat string;
	lon string;
	display_name string; 
}

