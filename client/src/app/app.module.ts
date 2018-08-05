//general modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//modules the application uses
import { FormsModule }          from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

//third party modules
import { LeafletModule } from '@asymmetrik/ngx-leaflet';


//appplication modules
import { AppComponent } from './app.component';
import { NavComponent } from './views/nav/nav.component';
import { MapComponent } from './views/map/map.component';
import { UserComponent } from './views/user/user.component';
import { TripComponent } from './views/trip/trip.component';
import { LinkedinComponent } from './views/linkedin/linkedin.component';
import { LinkedinService } from './models/linkedin/linkedin.service';

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
    MapComponent,
    UserComponent,
    TripComponent,
    LinkedinComponent,
  ],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    FormsModule,
    LeafletModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
