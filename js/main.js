// global service
var dssn;

// constructor
$(document).ready(function(){
	// create new dssn controller
	dssn = new DSSN();
});

$('#loadProfile').live('vclick',function(event){
	// foaf profile uri
	var resourceURI = "http://bob.lod2.eu/id/bob";
	
	// listen for results
	$(document).bind(dssn.READY, function(event, data){
		$(document).unbind(event);
		$.mobile.hidePageLoadingMsg();
		
		var user = data;
		
		$("#user_image").attr('src', user.pics[0]);
		$("#user_name").text(user.nicks[0]);
		$("#user_bday").text(user.bdays[0]);
		$("#user_weblog").text(user.weblogs[0]);
		for(var i in user.knows){
			$("#user_knows").append("<li><a href='#'>"+user.knows[i]+"</a></li>");
		}
		$("#user_stream").data('stream', user.streams[0]);
			
		// change page
		$.mobile.changePage("#profilePage");
	});
	
	// show loader
	$.mobile.showPageLoadingMsg();
	
	// load profile
	dssn.loadProfile(resourceURI);
});

$("#user_stream").live('vclick', function(event){
	var resourceURI = $(this).data('stream');
	
	// listen for results
	$(document).bind(dssn.READY, function(event, data){
		$(document).unbind(event);
		$.mobile.hidePageLoadingMsg();
		
		var feed = data;
		
		$("#feed_title").text(feed.title);
		$("#feedTemplate").tmpl(feed.items).appendTo("#feed_items");
					
		// change page
		$.mobile.changePage("#feedPage");
	});
	
	// show loader
	$.mobile.showPageLoadingMsg();
	
	dssn.loadFeed(resourceURI);
});