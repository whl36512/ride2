import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  	title = 'ride2';
	pages: any ;

  constructor (){
  	this.pages= {};
  	this.setFalse();
    	this.pages.nav=true;
    	this.pages.map=true;
  }

  setFalse ()
  {
  	this.pages.user 	= false;
  	this.pages.trip 	= false;
  	this.pages.signout 	= false;
  	this.pages.mytrips	= false;
  	this.pages.mybookings 	= false;
  	this.pages.deposit 	= false ;
  	this.pages.withdraw	= false ;
  	this.pages.contact_us	= false ;
  	this.pages.tou		= false ;
  }

  select(page:string) {
	console.log("201808201649 AppComponent.select() page=" + page);
	this.setFalse();
	let json = JSON.parse(`{"${page}":true}`);

	this.pages = { ...this.pages, ...json} ;
	console.info("201808221510 AppComponent.select()  this.pages="+  JSON.stringify(this.pages) ) ;
  }
}
