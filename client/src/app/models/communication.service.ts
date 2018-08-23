import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
import { BehaviorSubject } from 'rxjs';
 
@Injectable()
//@Injectable({
//providedIn: 'root'
//})

export class CommunicationService {
// for inter component communication
 
  // Observable string sources
  	private missionAnnouncedSource = new Subject<string>();
  	private missionConfirmedSource = new Subject<string>();

  	private mapbound_source = new Subject<any>();
 
  // Observable string streams
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  missionConfirmed$ = this.missionConfirmedSource.asObservable();

  mapbound$= this.mapbound_source.asObservable();

	private messageSource = new BehaviorSubject('default message');
	currentMessage = this.messageSource.asObservable();
	send(message: string) {
		console.info("201808230806 CommunicationService.sendMessage() message=" + message);
	    	this.messageSource.next(message)
	}
  	
 
  	// Service message commands
  	announceMission(mission: string) {
    		this.missionAnnouncedSource.next(mission);
  	}
 	
  	confirmMission(astronaut: string) {
    		this.missionConfirmedSource.next(astronaut);
  	}
	
  	mapbound(trip: any) {
    		console.info("201808222339 CommunicationService.mapbounde() trip=" + JSON.stringify(trip));
    		this.mapbound_source.next(trip);
  	}
}
