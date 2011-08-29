// constructor
$(document).ready(function(){
	// last page 
	// TODO: is there default thing for this in jqm?
	var lastPage = "homePage";
		
	// load and render profile
	var loadAndRenderProfile = function(uri, fromRoot){
		fromRoot = fromRoot || false;
	
		// listen for results
		dssn.bind(dssn.READY, function(event, data){
			dssn.unbind(event);
			$.mobile.hidePageLoadingMsg();
			
			/*
			$("#loadNetwork").data('knows', user.knows);
			$("#loadActivities").data('stream', user.streams[0]);*/
				
			// change page
			if( fromRoot ){
				$.mobile.changePage("pages/profile.html");
			}else{
				$.mobile.changePage("profile.html");
			}
		});
		
		// show loader
		$.mobile.showPageLoadingMsg();
		
		// load profile
		dssn.loadProfile(uri);
	}
		
	// loads profile
	$('#loadProfile').live('vclick',function(event){
		// foaf profile uri
		var resourceURI = "http://bob.lod2.eu/id/bob";
		
		loadAndRenderProfile(resourceURI, true);
	});
	
	// render profile data
	$("#profilePage").live('pagebeforeshow', function(){
		var user = dssn.user;
		
		lastPage = "profilePage";
	
		$("#user_image").attr('src', user.pics[0]);
		$("#user_name").text(user.nicks[0]);
		$("#user_bday").text(user.bdays[0]);
		$("#user_weblog").text(user.weblogs[0]);
	});
	
	// get and render feed
	$("#feedPage").live('pageshow', function(){
		var user = dssn.user;
		
		lastPage = "feedPage";
		
		var resourceURI = user.streams[0];
		
		// listen for results
		dssn.bind(dssn.READY, function(event, data){
			dssn.unbind(event);
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
		
		lastPage = "networkPage";
		
		dssn.bind(dssn.READY, function(event,data){
			dssn.unbind(event);
			$.mobile.hidePageLoadingMsg();
			
			var network = data;
			
			$("#networkTemplate").tmpl(network).appendTo("#network_items");
			
			$("#network_items").listview('refresh');
		});
		
		// show loader
		$.mobile.showPageLoadingMsg();
				
		dssn.getKnowsPeople(user.knows);
	});
	
	// configure menu
	$("#menuPage").live('pagebeforeshow', function(){
		switch(lastPage){
			case "profilePage":
				$("#add-activity").hide();
				$("#add-relation").hide();
				break;
			case "feedPage":
				$("#add-activity").show();
				$("#add-relation").hide();
				break;
			case "networkPage":
				$("#add-activity").hide();
				$("#add-relation").show();
				break;
		}
	});
	
	// show friend profile
	$(".network_profile").live('vclick', function(event){
		var url = $(this).attr('data');
		
		console.log(url);
		
		loadAndRenderProfile(url);
	});
});