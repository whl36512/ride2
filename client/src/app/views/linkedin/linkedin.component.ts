import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-linkedin',
//  templateUrl: './linkedin.component.html',
  template: '<a [href]="url">LinkedIn</a>' ,
  styleUrls: ['./linkedin.component.css']
})
export class LinkedinComponent implements OnInit {

	client_id   :String = '86xvjldqclucd9';
	redirect_uri:String = encodeURI("http://rideshare.beegrove.com:4201/linkedin/callback");
	state 	    : String ='aekjfafoeriugarherug0iglwup34pfuqp3aeoq3ue3' ;
	url         : String = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.client_id}&redirect_uri=${this.redirect_uri}&state=${this.state}`;

	constructor() { }
	ngOnInit() {
	}
}

