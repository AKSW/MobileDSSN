// last page 
// TODO: is there default thing for this in jqm?
var lastPage = "homePage";
var relationURI = null;
	
// load and render profile
var loadAndRenderProfile = function(uri, fromRoot){
	fromRoot = fromRoot || false;

	// listen for results
	dssn.bind(dssn.READY, function(event){
		dssn.unbind(dssn.READY);
		$.mobile.hidePageLoadingMsg();
		
		/*
		$("#loadNetwork").data('knows', user.knows);
		$("#loadActivities").data('stream', user.streams[0]);*/
			
		// change page
		if( $.mobile.activePage.attr('id') == "profilePage" ){
			renderProfile();
		}else{
			if( fromRoot ){
				$.mobile.changePage("pages/profile.html");
			}else{
				$.mobile.changePage("profile.html");
			}
		}
	});
	
	// show loader
	$.mobile.showPageLoadingMsg();
	
	// load profile
	dssn.loadProfile(uri);
}

// check user
var checkCurrentUser = function(){
	if(dssn.userURI != dssn.user.get('uri')){
		$(".homebtn").show();
	}else{
		$(".homebtn").hide();
	}//*/
}

// show error message
var showMessage = function(text){
	//show error message
	$( "<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>"+ text +"</h1></div>" )
		.css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
		.appendTo( 'body' )
		.delay( 800 )
		.fadeOut( 400, function() {
			$( this ).remove();
		});
}