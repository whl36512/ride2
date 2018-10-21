import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { C } from './constants';

 
@Injectable()
//@Injectable({
//providedIn: 'root'
//})

export class CommunicationService {
	// for inter component communication
 
  // Observable string sources
	private messageSource = new BehaviorSubject<any> ('default message');
	currentMessage = this.messageSource.asObservable();  // all components subscribing to this message will get the message
	send(message: any) {
		console.info("201808230806 CommunicationService.sendMessage() message=" + message);
	    	this.messageSource.next(message)
	}

	private trip_msg_subject = new BehaviorSubject<any> ('default message');
	trip_msg = this.trip_msg_subject.asObservable();  // all components subscribing to this message will get the message
	send_trip_msg(message: any) {
		console.info("201808230806 CommunicationService.sendMessage() message=" + JSON.stringify(message));
	    	this.trip_msg_subject.next(message) ;
	}

	private marker_pair_msg_subject = new BehaviorSubject<any> ('default message');
	marker_pair_msg = this.marker_pair_msg_subject.asObservable();  // all components subscribing to this message will get the message
	send_marker_pair_msg(message: any) {
		console.info("201808230806 CommunicationService.sendMessage() message=" + JSON.stringify(message));
	    	this.marker_pair_msg_subject.next(message) ;
	}

	private menu_msg_subject = new BehaviorSubject<string> ('default message');
	menu_msg = this.menu_msg_subject.asObservable();  // all components subscribing to this message will get the message
	send_selected_menu(message: string) {
		console.info("201808230806 CommunicationService.send_selected_menu() message=" + message);
	    	this.menu_msg_subject.next(message) ;
	}

	private close_page_msg_subject = new BehaviorSubject<string> ('default message');
	close_page_msg = this.close_page_msg_subject.asObservable();  // all components subscribing to this message will get the message
	close_page(message: string) {
		console.info("201808230806 CommunicationService.close_page() message=" + message);
	    	this.close_page_msg_subject.next(message) ;
	}





	// generic message. use msgKey to differantiate messages
	private msg_subject = new BehaviorSubject<any> ('{}');
	// all components subscribing to this message will get the message
	msg = this.msg_subject.asObservable();  

	send_msg(msg_key:string, message: any) {
		let outgoing = {};
		if (typeof(message) == 'string') outgoing = JSON.parse(message);
		else outgoing = {...message};
		outgoing= {...outgoing, msgKey: msg_key};
		console.debug("201808230806 CommunicationService.send_msg() key and message=\n" 
			, C.stringify(outgoing));
	    	this.msg_subject.next(outgoing) ;
	}
}
