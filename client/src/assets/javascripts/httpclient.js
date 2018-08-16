var rideHttpClient = {
	port : 4201,
	sendRequestWithCallback: function (urlEncoded, method, action, elem, callback)
	{
		// if GET, urlEncoded is empty and action has the full url
		// if POST, urlEncoded is the qury part 
		method = method.toUpperCase() ;
        	console.log("INFO 201807141033 sendRequestWithCallback urlEncoded= <"+urlEncoded+">") ;
        	console.log("INFO 201807141033 sendRequestWithCallback method= "+ method) ;
        	console.log("INFO 201807141033 sendRequestWithCallback action= "+action) ;
        	console.log("INFO 201807141033 sendRequestWithCallback callback= "+callback) ;
        	var xhr = new XMLHttpRequest();

        	xhr.onreadystatechange = function(){ callback(xhr, elem); } ;

        	xhr.open (method, action, true);
		if ( method == "POST"  )
		{
        		console.log("INFO 201807140938 setting POST headers" );
			//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.setRequestHeader('Content-Type', 'application/json');
			// xhr.setRequestHeader('Content-Length', urlEncoded.length); // Refused to set unsafe header "Content-Length"
		}
        	xhr.send (urlEncoded);
        	console.log("INFO 201807141033 sendRequestWithCallback done");
        	return false;
	} ,

	sendRequestToServerWithCallback: function (data, method, encodedRelativeUrl, elem, callback)
	{
		//disregard method. Always POST
		var root = "http://"+window.location.hostname + ":"+ this.port ;
		var url = root + encodedRelativeUrl ;
		return rideHttpClient.sendRequestWithCallback(data, "POST", url, null,  callback);
	},

	httpResponseTextJson: function (httpRequest) {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
                	if (httpRequest.status === 200) {
				var response=httpRequest.responseText;
                        	console.log("INFO 201807132315 callbackRouting response.length=" + response.length );
                        	console.log("INFO 201807132315 callbackRouting response=" + response );
				var responseTextJson=JSON.parse(response) ;
				console.log("callbackRouting responseTextJson.length=" +  responseTextJson.length );
				return responseTextJson ;
                	}
                	else {
                        	console.log('ERROR 201807102058: return status '+ httpRequest.status + "\n" + httpRequest.responseText.replace(/\s+/g,''));
				return null;
                	}
		}
		return null;
	}
}
