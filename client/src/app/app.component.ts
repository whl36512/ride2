import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ride2';
 
  user :boolean;
  trip :boolean;
  signout :boolean;
  mytrips:boolean;
  mybookings :boolean;
  map :boolean;
  nav :boolean;

  constructor (){
  	this.setFalse();
    this.nav=true;
    this.map=true;
  }

  setFalse ()
  {
  	this.user =false;
  	this.trip = false;
  	this.signout = false;
  	this.mytrips= false;
  	this.mybookings = false;
  }

  select(page:string) {
  	this.setFalse();
  	switch (page) {
  		case "signout" : {
  			this.signout=true;
  			break;
  		}
 
  		case "user" : {
  			this.user=true;
  			break;
  		}
  		case "trip" : {
  			this.trip=true;
  			break;
  		}
 
   		case "mytrips" : {
  			this.mytrips=true;
  			break;
  		}
 
   		case "mybookings" : {
  			this.mybookings=true;
  			break;
  		}
  	}

  }
}
