import { Component} 		from '@angular/core';
import { OnInit } 		from '@angular/core';
import { UserService } 		from '../../models/gui.service';
import { C } 			from '../../models/constants';
import { Ridebase } 		from '../../models/ridebase';
import { CommunicationService } from '../../models/communication.service';
 

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css'] ,
})
export class NavComponent extends Ridebase implements OnInit {
	signed_in = false;

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

	nav_menu_off()  {
		this.show_nav = false ;
	}

	toggle()  {
		this.show_nav =!this.show_nav ;
		this.signed_in= UserService.is_signed_in();
		console.log('301808221747 NavComponent.constructor this.signed_in='+ this.signed_in) ;
	}
        subscription_action(msg): void {
                console.debug("201808222332 NavComponent.subscription_action. ignore msg");
        }

}
