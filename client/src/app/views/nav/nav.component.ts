import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { CookieService } from '../../models/gui.service';
import { Constants } from '../../models/constants';
import { CommunicationService } from '../../models/communication.service';
 

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'] ,
})
export class NavComponent implements OnInit {
  signed_in = false;
  //parent:AppComponent ;
  show_nav=false ;
  public constructor(
  	//public parent:AppComponent
	private communicationService: CommunicationService
  ) {
  	//this.parent = parent ;

  }

  ngOnInit() {
  }

  select(elem:string) {
  	this.show_nav=false;
    	console.debug('201808031521 NavComponent.select elem='+ elem) ;
    	console.log('201808031521 NavComponent.select elem='+ elem) ;
	//this.parent.select(elem) ;
	this.communicationService.send_selected_menu(elem);
  }

  nav_menu_off()  {
  	this.show_nav = false ;
  }
  toggle()  {
  	this.show_nav =!this.show_nav ;
	this.signed_in= this.is_signed_in();
    	console.log('301808221747 NavComponent.constructor this.signed_in='+ this.signed_in) ;

  }

  is_signed_in ()
  {
  	let encrypted_profile = CookieService.getCookie(Constants.PROFILE);
  	let jwt =CookieService.getCookie(Constants.JWT);
	if ( encrypted_profile == undefined || encrypted_profile == null || encrypted_profile == "")
	{
		return false;
	} 
	if ( jwt == undefined || jwt == null || jwt == "" ) {
		return false;
	} 
	return true;
  }

}

  
