import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
//import { CookieService } from '../../models/gui.service';
import { StorageService } from '../../models/gui.service';
import { UserService } from '../../models/gui.service';
import { Constants } from '../../models/constants';
import { CommunicationService } from '../../models/communication.service';
 

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'] ,
})
export class NavComponent implements OnInit {
  signed_in = false;
  show_nav=false ;
  public constructor(
	private communicationService: CommunicationService
  ) {
  }

  ngOnInit() {
  }

  select(elem:string) {
  	this.show_nav=false;
    	console.debug('201808031521 NavComponent.select elem='+ elem) ;
    	console.log('201808031521 NavComponent.select elem='+ elem) ;
	this.communicationService.send_selected_menu(elem);
  }

  nav_menu_off()  {
  	this.show_nav = false ;
  }

  toggle()  {
  	this.show_nav =!this.show_nav ;
	this.signed_in= UserService.is_signed_in();
    	console.log('301808221747 NavComponent.constructor this.signed_in='+ this.signed_in) ;

  }

/*
  is_signed_in ()
  {
  	//let encrypted_profile = CookieService.getCookie(Constants.PROFILE);
  	let encrypted_profile = StorageService.getSession(Constants.PROFILE);
  	//let jwt =CookieService.getCookie(Constants.JWT);
  	let jwt = StorageService.getSession(Constants.JWT);
	if ( encrypted_profile == undefined || encrypted_profile == null || encrypted_profile == "")
	{
		return false;
	} 
	if ( jwt == undefined || jwt == null || jwt == "" ) {
		return false;
	} 
	return true;
  }
*/

}

  
