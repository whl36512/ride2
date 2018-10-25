import { Injectable } from '@angular/core';

import {DBService} from './remote.service'
import { C} from './constants';


//in order for require to work, change  src/tsconfig.app.json to read 
//     "types": ["node"]

var forge = require('node-forge');

@Injectable({
  providedIn: 'root'
})
export class GuiService {

  constructor() { } ;
}

export class UserService {
	constructor(  ) {};

	static is_signed_in ():boolean
	{
        	let profile =  UserService.get_profile_from_session();
        	let jwt = UserService.get_jwt_from_session();
        	if ( profile == null  || jwt == null)
        	{
                	return false;
        	}
        	return true;
  	}

	static get_profile_from_session(): object|null {
        	let encrypted_profile = StorageService.getSession(C.PROFILE);
		let profile = CryptoService.decrypt(encrypted_profile);
		if ( profile == null) {return null;} ;
		return JSON.parse(profile);
	}

	static get_jwt_from_session(): object|null {
        	let jwt = StorageService.getSession(C.JWT);
		if (jwt == undefined || jwt==null || jwt=='' ) { return null;} ;
		return {'jwt' : jwt}
	}
}

export class Util {
	constructor(  ) {};
	static sleepFor( sleepDuration: number ){
		var now = new Date().getTime();
	        while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
	}

}

/*
export class CookieService {
  	constructor() { } ;
	
	static setCookie (cname, cvalue, exhours) {
    		let d = new Date();
        	d.setTime(d.getTime() + (exhours*60*60*1000));
	    	let expires = "expires="+ d.toUTCString();
	        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	static getCookie (cname) : string {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
}
*/


export class CryptoService {
//private static forge = new Forge();

	private static salt_hex ="d043f85493366994d4e73441e2bd387be856c815a924ffb295ee53125df26d8b";
	private static salt = forge.util.hexToBytes(CryptoService.salt_hex);
	//rideCrypt.salt = forge.random.getBytesSync(32);
	private static numIterations = 10;
	private static key = forge.pkcs5.pbkdf2('password', CryptoService.salt, CryptoService.numIterations, 16);
	private static iv = forge.util.hexToBytes(CryptoService.salt_hex);

	constructor(  ) {
	}


	// generate a random key and IV
	// Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256

	/* alternatively, generate a password-based 16-byte key
	var salt = this.forge.random.getBytesSync(128);
	var key = this.forge.pkcs5.pbkdf2('password', salt, numIterations, 16);
	*/

	// encrypt some bytes using CBC mode
	// (other modes include: ECB, CFB, OFB, CTR, and GCM)
	// Note: CBC and ECB modes use PKCS#7 padding as default

	static encrypt  (content : string) : string {
		let cipher = forge.cipher.createCipher('AES-CBC', CryptoService.key);
		cipher.start({iv: CryptoService.iv});
		cipher.update(forge.util.createBuffer(content));
		cipher.finish();
		let encrypted = cipher.output;
		let hex = encrypted.toHex() ;
		console.info('201808171902 CryptoService.encrypt() encrypted_hex=' + hex);
		return hex;
	};

	static decrypt(encrypted_hex: string): string|null
	{
		if (encrypted_hex== undefined || encrypted_hex== null || encrypted_hex=="") return null ;
		// decrypt some bytes using CBC mode
		// (other modes include: CFB, OFB, CTR, and GCM)
		let encrypted = forge.util.hexToBytes(encrypted_hex) ;
		let buffer    = forge.util.createBuffer(encrypted);

		let decipher = forge.cipher.createDecipher('AES-CBC', CryptoService.key);
		decipher.start({iv: CryptoService.iv});
		decipher.update(buffer);
		let result = decipher.finish(); // check 'result' for true/false
		// outputs decrypted hex
		let decrypted = decipher.output.toString('utf8') ;
		console.info("201808171500 CryptoService.decrypt() decrypted=" + decrypted);
		return decrypted;
	}

	private byteToHexString (uint8arr: Uint8Array) {
		if (!uint8arr) {
			return '';
		}
	  	
		var hexStr = '';
		for (var i = 0; i < uint8arr.length; i++) {
			var hex = (uint8arr[i] & 0xff).toString(16);
			hex = (hex.length === 1) ? '0' + hex : hex;
			hexStr += hex;
		}
	  	
		return hexStr.toUpperCase();
	}
	
	private hexStringToByte (str: String): Uint8Array {
		if (!str) {
		      	return new Uint8Array();
		}
		var a = [];
		for (var i = 0, len = str.length; i < len; i+=2) {
			a.push(parseInt(str.substr(i,2),16));
		}
		return new Uint8Array(a);
	}
}

export class StorageService {
	static setLocal(key: string, value: any): void{
		localStorage.setItem(key, value);
	}
	static getLocal(key: string): any{
		let value=localStorage.getItem(key);
		return value;
	}
	static setSession(key: string, value: any): void{
		sessionStorage.setItem(key, value);
	}
	static getSession(key: string): any{
		let value=sessionStorage.getItem(key);
		return value;
	}

	static storeForm(key : string, json_value) : void {
		StorageService.setLocal(key, C.stringify(json_value));
	}

	static getForm(key) : any{
		console.debug('StorageService.getForm() 201809241133 key =' + key);
		let form_value= StorageService.getLocal (key);
		if (form_value== undefined || form_value == null) return null;
		console.debug('StorageService.getForm() 201809241133 form_value =' + form_value);
		let form_value1 = JSON.parse(form_value);

		//console.info('201809241146 form_value1 =' + C.stringify(form_value1));
		return form_value1;
	}
}
