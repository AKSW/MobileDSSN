// last page 
// TODO: is there default thing for this in jqm?
var lastPage = "homePage";
var relationURI = null;
var fromSearch = false;
	
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

// render profile data
function renderProfile(){
	checkCurrentUser();

	var user = dssn.user;
	
	lastPage = "profilePage";

	$("#user_image").attr('src', user.get('userpics')[0]);
	$("#user_name").text(user.get('nicknames')[0]);
	$("#user_bday").text(user.get('birthdays')[0]);
	$("#user_weblog").text(user.get('weblogs')[0]);
}

// check user
var checkCurrentUser = function(){
	if( fromSearch ){
		// position icon left
		$(".homebtn").removeClass('ui-btn-icon-notext').addClass('ui-btn-icon-left');
		// change home icon to left arrow
		$(".homebtn .ui-icon").removeClass('ui-icon-home').addClass('ui-icon-arrow-l');
		// change attributes
		$(".homebtn").attr('href', 'searchres.html').data('rel', 'back').data('direction', 'reverse');//. data('iconpos', '').data('icon', 'arrow-l');
		// change text
		$(".homebtn .ui-btn-text").text("Back");
		// show
		$(".homebtn").show();
		return;
	}
	
	// toggle home
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