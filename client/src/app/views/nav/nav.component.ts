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
    this.toggle();
    console.debug('201808031521 NavComponent.select elem='+ elem) ;
    console.log('201808031521 NavComponent.select elem='+ elem) ;
  	this.parent.select(elem) ;
  }
  toggle()  {
  	this.show_nav =!this.show_nav ;
  }

}

  
