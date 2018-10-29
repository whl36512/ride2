import { Component} 		from '@angular/core';
import { OnInit } 		from '@angular/core';
import { UserService } 		from '../../models/gui.service';
import { C } 			from '../../models/constants';
import { Ridebase } 		from '../../models/ridebase';
import { CommunicationService } from '../../models/communication.service';
 

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'] ,
})
export class NavComponent extends Ridebase implements OnInit {

	show_nav=false ;
	public constructor( public communicationService: CommunicationService) {
		super(communicationService);
	}

	ngOnInit() {}

	select(elem:string) {
		this.show_nav=false;
		console.debug('201808031521 NavComponent.select elem='+ elem) ;
		this.communicationService.send_msg(C.MSG_KEY_PAGE_OPEN, {page:elem});
	}

	nav_menu_off():boolean  {
		this.show_nav = false ;
		this.Util.hide_map();
		return true;

	}

	toggle()  {
		this.show_nav =!this.show_nav ;
		this.is_signed_in= UserService.is_signed_in();
		console.log('301808221747 NavComponent.constructor this.is_signed_in='+ this.is_signed_in) ;
	}
        subscription_action(msg): void {
                console.debug("201808222332 NavComponent.subscription_action. ignore msg");
        }

	map_search_stop() {
		this.Util.map_search_stop();
	}
	map_search_start() {
		this.Util.map_search_start();
	}

}
