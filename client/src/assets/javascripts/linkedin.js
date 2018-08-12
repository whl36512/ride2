    // Setup an event listener to make an API call once auth is complete
    // Handle the successful return from the API call
    // Use the API call wrapper to request the member's basic profile data
var ride = {

    onLinkedInLoad: function () {
       // IN.Event.on(IN, "auth", ride.getProfileData);
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
        console.log("INFO 201807131627 Authorized") ;
        //IN.API.Raw("/people/~").result(onSuccess).error(onError);
        IN.API.Raw("/people/~").result(ride.getProfileDataOnSuccess).error(ride.onError);
    },


    getProfileDataOnSuccess : function (data) {
        console.log("INFO 2017131508 data");
        console.log(data);
	//profileJson = JSON.parse(data)
        setCookie("first_name", data.firstName, 1 ) ;
        setCookie("last_name", data.lastName, 1 );
        setCookie("headline", data.headline, 1 );
        setCookie("auth_id", data.id, 1 );

        console.log("INFO 2017131508 auth_id =" + getCookie("auth_id"));
        console.log("INFO 2017131508 last_name =" + getCookie("last_name"));
        ride.change_gui_show(true);
        ride.get_session()        ;

	       //window.location.reload(true);              // use true to reload page from server
    },

    get_session: function()
    {
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
      
      console.log("INFO 201807131928 checkAuth");
      console.log("INFO 201807131928 auth_id = " + getCookie("auth_id") );
      if ( !IN.User.isAuthorized() ) {
        ride.clearProfileInCookie() ;  //just in case the cookie still holds the profile
        IN.User.authorize(this.getProfileData, null);
        ride.change_gui_show(false);
      }
      else if ( IN.User.isAuthorized() && getCookie("auth_id") === "" ) IN.User.authorize(this.getProfileData, null);
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
        setCookie("auth_id", "", -1 ) ;
        setCookie("first_name", "", -1 ) ;
        setCookie("last_name", "", -1 ) ;
        setCookie("headline", "", -1 ) ;
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
