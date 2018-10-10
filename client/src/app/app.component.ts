import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs';

import {CommunicationService} from "./models/communication.service"


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  	title = 'ride2';
	pages: any ;
	subscription1: Subscription;
	subscription2: Subscription;


  constructor (private communicationService: CommunicationService){
  	this.pages= {};
  	this.setFalse();
    	this.pages.nav=true;
    	this.pages.map=true;

	this.subscription1 =this.communicationService.menu_msg.subscribe(
		message  => {
			console.info("201808222332 Map2Component.constructor.  subscription got message. message="+ JSON.stringify(message));
			this.select(message);
		}
	);
	this.subscription2 =this.communicationService.close_page_msg.subscribe(
		message  => {
			console.info("201808222332 Map2Component.constructor.  subscription got message. message="+ JSON.stringify(message));
			this.deselect(message);
		}
	);
  }

	setFalse ()
	{
		this.pages.search 	= false;
		this.pages.user 	= false;
		this.pages.trip 	= false;
		this.pages.signout 	= false;
		this.pages.myoffers	= false;
		this.pages.mybooking 	= false;
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

  	deselect(page:string) {
		console.log("201808201649 AppComponent.deselect() page=" + page);
		let json = JSON.parse(`{"${page}":false}`);
	
		this.pages = { ...this.pages, ...json} ;
		console.info("201808221510 AppComponent.select()  this.pages="+  JSON.stringify(this.pages) ) ;
  	}
	
	ngOnDestroy() {
		// prevent memory leak when component destroyed
		this.subscription1.unsubscribe();
		this.subscription2.unsubscribe();
	}
}
