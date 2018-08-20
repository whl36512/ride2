//general modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//modules the application uses
import { FormsModule }          from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

//third party modules
import { LeafletModule } from '@asymmetrik/ngx-leaflet';


//appplication components
import { AppComponent } 	from './app.component';
import { NavComponent } 	from './views/nav/nav.component';
import { UserComponent } 	from './views/user/user.component';
import { TripComponent } 	from './views/trip/trip.component';
import { LinkedinComponent } 	from './views/linkedin/linkedin.component';
import { Map2Component } 	from './views/map2/map2.component';

//appplication services
import { LinkedinService } 	from './models/linkedin.service';
import { MapService } 		from './models/map.service';
//import { GeoService } 		from './models/remote.service';
import { DBService } 		from './models/remote.service';
import { HttpService } 		from './models/remote.service';

const appRoutes: Routes = [
/*
  { path: 'linked/callback', component:LinkedinService },
  { path: 'linked/accesstoken', component: CrisisListComponent },
  { path: 'hero/:id',      component: HeroDetailComponent },
  {
    path: 'heroes',
    component: HeroListComponent,
    data: { title: 'Heroes List' }
  },
  { path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
  */
]

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    //MapComponent,
    UserComponent,
    TripComponent,
    LinkedinComponent,
    Map2Component,
  ],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    //        LeafletModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
  ],
  providers: [
    MapService,
    //   GeoService,
    DBService,
    HttpService,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
