import { Component, OnInit } from '@angular/core';
import {Usr} from '../../models/tables'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
// when *ngIf is true, both constructor() and ngOnInit() are called
    user: Usr  = new Usr({last_name:'Lin'});
    saved=false;


    	name: string;
    	value: string;
    	constructor() { 
  		console.log("user.component.ts UserComponent.constructor() enter")  ;
		//let user_from_cookie = get_user_from_cookie();
		//let user_from_db =     get_user_from_db(user_from_cookie);
  	}

	ngOnInit() {
		console.info("user.component.ts UserComponent.ngOnInit() enter");
  	}

  	addEmail(input:HTMLInputElement) {
  		this.name= input.name ;
  		this.value = input.value;
	}
}
