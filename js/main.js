$(function(){
	// last page 
	// TODO: is there default thing for this in jqm?
	var lastPage = "homePage";
		
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
	
	// check user
	var checkCurrentUser = function(){
		if(dssn.userURI != dssn.user.get('uri')){
			$(".topmenu").css('display', 'none');
		}else{
			$(".topmenu").css('display', '');
		}
	}
		
	// loads profile
	$('#loadProfile').live('vclick',function(event){
		// foaf profile uri
		var resourceURI = "http://localhost/ontowiki/tim/foaf_Person/Bob";
		
		dssn.userURI = resourceURI;
		
		loadAndRenderProfile(resourceURI, true);
	});
	
	// render profile data
	$("#profilePage").live('pageshow', function(){
		checkCurrentUser();
	
		var user = dssn.user;
		
		lastPage = "profilePage";
	
		$("#user_image").attr('src', user.get('userpics')[0]);
		$("#user_name").text(user.get('nicknames')[0]);
		$("#user_bday").text(user.get('birthdays')[0]);
		$("#user_weblog").text(user.get('weblogs')[0]);
	});
	
	// get and render feed
	$("#feedPage").live('pageshow', function(){
		checkCurrentUser();
	
		var user = dssn.user;
		
		lastPage = "feedPage";
		
		var resourceURI = user.get('streams')[0];
		
		// listen for results
		dssn.bind(dssn.READY, function(event, data){
			dssn.unbind(dssn.READY);
			$.mobile.hidePageLoadingMsg();
			
			var feed = dssn.feed;
			
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
		checkCurrentUser();
	
		var user = dssn.user;
		
		lastPage = "networkPage";
		
		dssn.bind(dssn.READY, function(event){
			dssn.unbind(dssn.READY);
			$.mobile.hidePageLoadingMsg();
			
			var network = dssn.knows;
			
			$("#networkTemplate").tmpl(network.models, {
				name: function(){
					return this.data.attributes.nicknames[0];
				},
				uri: function(){
					return this.data.id;
				},
				image: function(){
					return this.data.attributes.userpics[0];
				}
			}).appendTo("#network_items");
			
			$("#network_items").listview('refresh');
		});
		
		// show loader
		$.mobile.showPageLoadingMsg();
				
		dssn.getKnowsPeople(user.get('knows'));
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
		
		loadAndRenderProfile(url);
	});
	
	// add relation button clicked
	$("#addrelation").live('vclick', function(){
		var subject = "<"+dssn.userURI+">";
		var predicate = "<http://xmlns.com/foaf/0.1/knows>";
		var object = "<"+$("#webiduri").val()+">";
		
		var epurl = dssn.userData.get("updates")[0];
		var graph = epurl.split('?')[1].replace("default-graph-uri=", "");
		
		var query = "INSERT DATA INTO <"+graph+"> { " +subject+" "+predicate+" "+object+" }";
		
		epurl += "&query=" + encodeURIComponent( query );
		
		// form url with ajax proxy
		var url = dssn.ajaxproxy+encodeURIComponent( epurl );
		
		$.getJSON(url, function(data){
			console.log(data);
		});
	});
});