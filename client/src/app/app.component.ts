import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  	title = 'ride2';
 
  	map :boolean;
  	nav :boolean;

  	user :boolean;
  	trip :boolean;
  	signout :boolean;
  	mytrips:boolean;
  	mybookings :boolean;
  	deposit :boolean;
  	withdraw :boolean;
  	contact_us :boolean;
  	tou :boolean;

  constructor (){
  	this.setFalse();
    	this.nav=true;
    	this.map=true;
  }

  setFalse ()
  {
  	this.user 	= false;
  	this.trip 	= false;
  	this.signout 	= false;
  	this.mytrips	= false;
  	this.mybookings = false;
  	this.deposit 	= false
  	this.withdraw	= false
  	this.contact_us	= false
  	this.tou	= false
  }

  select(page:string) {
	console.log("201808201649 AppComponent.select() page=" + page);
  	switch (page) {
  		case "signout" : {

			if (!this.signout)
			{	
  				this.setFalse();
				this.signout= true;
			};
  			break;
  		}
 
  		case "user" : {
			if (!this.user)
			{	
				console.log("201808201649 AppComponent.select() this.user=" + this.user);
  				this.setFalse();
				this.user= true;
			};
  			break;
  		}
  		case "trip" : {
			if (!this.trip)
			{	
  				this.setFalse();
				this.trip= true;
			};
  			break;
  		}
 
   		case "mytrips" : {
			if (!this.mytrips)
			{	
  				this.setFalse();
				this.mytrips= true;
			};
  			break;
  		}
 
   		case "mybookings" : {
			if (!this.mybookings)
			{	
  				this.setFalse();
				this.mybookings= true;
			};
  			break;
  		}
  	}
  }
}
