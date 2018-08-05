import { Component, OnInit } from '@angular/core';
import {Usr} from '../../models/tables'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    user: Usr  = new Usr({last_name:'Lin'});
    saved=false;


    name: string;
    value: string;
    constructor() { 
  		console.log('UserComponent.constructor this.user.last_name='+ this.user.last_name)  ;
  	}

  	ngOnInit() {
  	}

  	addEmail(input:HTMLInputElement) {
  		this.name= input.name ;
  		this.value = input.value;
	}
}
