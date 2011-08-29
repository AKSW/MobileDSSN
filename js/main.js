// global service
var dssn;

// constructor
$(document).ready(function(){
	// create new dssn controller
	dssn = new DSSN();
});

// loads profile
$('#loadProfile').live('vclick',function(event){
	// foaf profile uri
	var resourceURI = "http://bob.lod2.eu/id/bob";
	
	// listen for results
	$(document).bind(dssn.READY, function(event, data){
		$(document).unbind(event);
		$.mobile.hidePageLoadingMsg();
		
		/*
		$("#loadNetwork").data('knows', user.knows);
		$("#loadActivities").data('stream', user.streams[0]);*/
			
		// change page
		$.mobile.changePage("pages/profile.html");
	});
	
	// show loader
	$.mobile.showPageLoadingMsg();
	
	// load profile
	dssn.loadProfile(resourceURI);
});

// render profile data
$("#profilePage").live('pagebeforeshow', function(){
	var user = dssn.user;

	$("#user_image").attr('src', user.pics[0]);
	$("#user_name").text(user.nicks[0]);
	$("#user_bday").text(user.bdays[0]);
	$("#user_weblog").text(user.weblogs[0]);
});

// get and render feed
$("#feedPage").live('pageshow', function(){
	var user = dssn.user;
	
	var resourceURI = user.streams[0];
	
	// listen for results
	$(document).bind(dssn.READY, function(event, data){
		$(document).unbind(event);
		$.mobile.hidePageLoadingMsg();
		
		var feed = data;
		
		$("#feed_title").text(feed.title);
		$("#feedTemplate").tmpl(feed.items).appendTo("#feed_items");
		
		$("#feed_items").listview('refresh');
	});
	
	// show loader
	$.mobile.showPageLoadingMsg();
	
	dssn.loadFeed(resourceURI);
});

// get and render network
$("#networkPage").live('pageshow', function(){
	var user = dssn.user;
	
	$(document).bind(dssn.READY, function(event,data){
		$(document).unbind(event);
		$.mobile.hidePageLoadingMsg();
		
		console.log(data);
		
		var network = data;
		
		$("#networkTemplate").tmpl(network).appendTo("#network_items");
		
		$("#network_items").listview('refresh');
	});
	
	// show loader
	$.mobile.showPageLoadingMsg();
			
	dssn.getKnowsPeople(user.knows);
});