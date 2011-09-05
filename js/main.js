$(function(){
	// loads profile
	$('#loadProfile').live('vclick',function(event){
		// foaf profile uri
		var resourceURI = "http://localhost/ontowiki/tim/foaf_Person/Bob";
		
		dssn.userURI = resourceURI;
		
		loadAndRenderProfile(resourceURI, true);
	});
	
	// do rendering on show
	$("#profilePage").live('pageshow', renderProfile);
	
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
		if(dssn.userURI != dssn.user.get('uri')){
			$("#add-activity").hide();
			$("#edit-view").hide();
			$("#settings").hide();
			
			$("#add-relation").show();
			$("#add-relation .ui-btn-text").text("Add as friend");
			relationURI = dssn.user.get('uri');
		}else{
			$("#edit-view").show();
			$("#settings").show();
			$("#add-relation .ui-btn-text").text("Add relation");
	
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
		}
	});
	
	// go home
	$(".homebtn").live('vclick', function(){
		var url = dssn.userURI;
		
		loadAndRenderProfile(url);
	});
	
	// show friend profile
	$(".network_profile").live('vclick', function(event){
		var url = $(this).data('url');
		var search = $(this).data('search');
		
		fromSearch = search;
		
		loadAndRenderProfile(url);
	});
	
	$("#addRelationPage").live('pagebeforeshow', function(){
		if( relationURI != null ) $("#webiduri").val(relationURI);
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
		
		$.mobile.changePage("profile.html");
	});
});



