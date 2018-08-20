import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
 

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'] ,
})
export class NavComponent implements OnInit {
  signed_in = false;
  //parent:AppComponent ;
  show_nav=false ;
  public constructor(public parent:AppComponent)  {
  	//this.parent = parent ;
  }

  ngOnInit() {
  }

  select(elem:string) {
  	this.show_nav=false;
    	console.debug('201808031521 NavComponent.select elem='+ elem) ;
    	console.log('201808031521 NavComponent.select elem='+ elem) ;
  	this.parent.select(elem) ;
  }

  nav_menu_off()  {
  	this.show_nav = false ;
  }
  toggle()  {
  	this.show_nav =!this.show_nav ;
  }

}

  
