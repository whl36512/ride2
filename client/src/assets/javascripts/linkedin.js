    // Setup an event listener to make an API call once auth is complete
    // Handle the successful return from the API call
    // Use the API call wrapper to request the member's basic profile data

var ride = {

    onLinkedInLoad: function () {
      IN.Event.on(IN, "auth", ride.getProfileData);
      var auth_status= ride.checkAuth();
      ride.change_gui_show(auth_status);
    },

    onSuccess: function (data) {
        console.log("INFO 201807131656");
        console.log(data);
    }, 

    // Handle an error response from the API call
    onError: function (error) {
        console.log("ERROR 201807131657");
        console.log(error);
    } ,


    getProfileData : function () {
        console.log("INFO 201807131627 getProfileData() enter") ;
        //IN.API.Raw("/people/~").result(onSuccess).error(onError);
        IN.API.Raw("/people/~").result(ride.getProfileDataOnSuccess).error(ride.onError);
        console.log("INFO 201807131627 getProfileData() done") ;

    },


    getProfileDataOnSuccess : function (data) {
        console.log("INFO 2017131508 getProfileDataOnSuccess() data-");
        console.log(data);
	//profileJson = JSON.parse(data)
        setCookie("first_name", data.firstName, 1 ) ;
        setCookie("last_name", data.lastName, 1 );
        setCookie("headline", data.headline, 1 );
        setCookie("oauth_id", data.id, 1 );

        console.log("INFO 2017131508 getProfileDataOnSuccess() oauth_id =" + getCookie("oauth_id"));
        console.log("INFO 2017131508 getProfileDataOnSuccess() last_name =" + getCookie("last_name"));
        ride.change_gui_show(true);
        ride.get_session()        ;

	//window.location.reload(true);              // use true to reload page from server
    },

    get_session: function()
    {
	    var encodedRelativeUrl = "/get_session" ;
	    var data = {"first_name": getCookie("first_name"), 
		    	"last_name" : getCookie("last_name"),
		    	"headline" : getCookie("headline"),
		    	"oauth_id" : getCookie("oauth_id")
	    } ;

	    var json_string = JSON.stringify(data);


	    rideHttpClient.sendRequestToServerWithCallback(json_string, "POST", encodedRelativeUrl , null, ride.get_session_callback ) ;

    },

    get_session_callback: function (httpRequest, elem)
    {
	var	httpResponseTextJson = rideHttpClient.httpResponseTextJson(httpRequest);
	//if (httpResponseTextJson != null) 
    },

    change_gui_show :function(signed_in)
    {
      document.getElementById("signin").setAttribute("show", !signed_in);
      document.getElementById("signout").setAttribute("show", signed_in);
    },


    newtrip : function () {
	     this.checkAuth();
	     if (getCookie("profile.id") !== "") window.location = '/newtrip';
    },

    checkAuth: function () {
      
      console.debug("201807131928 checkAuth");
      console.debug("201807131928 oauth_id = " + getCookie("oauth_id") );
      if ( !IN.User.isAuthorized() ) {
        ride.clearProfileInCookie() ;  //just in case the cookie still holds the profile
        ride.change_gui_show(false);
        //IN.User.authorize(this.getProfileData, null);
	return flase;
      }
      else if ( IN.User.isAuthorized() && getCookie("oauth_id") === "" ) 
      {
	IN.User.authorize(this.getProfileData, null);
	return true;
      }
      else {
	console.log("INFO 201807131924 Already authed");
      	return true;
      }
      return false;
    },

    signout: function () {
      IN.User.logout(this.signoutCallback, null) ;
      ride.clearProfileInCookie() ;
      ride.change_gui_show(false);
    },

    signoutCallback: function () {
        console.log("INFO 201807131556 Signed Out !") ;
//	       window.location.replace("/signout");              // use true to reload page from server
    },

    clearProfileInCookie: function () {
	console.debug("201808161126 clearProfileInCookie()");
        setCookie("oauth_id", "", -1 ) ;
        setCookie("first_name", "", -1 ) ;
        setCookie("last_name", "", -1 ) ;
        setCookie("headline", "", -1 ) ;
        setCookie("ss", "", -1 ) ;  //iron secure session cookie
        //setCookie("PLAY_SESSION", "", -1 ) ;  // cannot remove PLAY_SESSION because it has "same site" attribute
    }
};




function setCookie (cname, cvalue, exhours) {
    var d = new Date();
    d.setTime(d.getTime() + (exhours*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie (cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) === ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
    }
