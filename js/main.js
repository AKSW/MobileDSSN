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
		
		var resourceURI = user.get('dssn:activityFeed')[0];
		
		// listen for results
		dssn.bind(dssn.READY, function(event, data){
			dssn.unbind(dssn.READY);
			$.mobile.hidePageLoadingMsg();
			
			var feed = dssn.feed;
			
			$("#feed_title").text(feed.title);
			$("#feedTemplate").tmpl(feed.items,{
				title: function(){
					return this.data.title.split(":")[0];
				},
				post: function(){
					var post = this.data.title.split(":");
					post.splice(0,1);
					return post.join(":");
				}
			}).appendTo("#feed_items");
			
			$("#feed_items").listview('refresh');
		});
		
		// show loader
		$.mobile.showPageLoadingMsg();
		
		dssn.loadFeed(resourceURI);
	});
	
	// configure menu
	$("#menuPage").live('pagebeforeshow', function(){
		if(dssn.userURI != dssn.user.get('id')){
			$("#add-activity").hide();
			$("#edit-view").hide();
			$("#settings").hide();
			
			$("#add-relation").show();
			$("#add-relation .ui-btn-text").text("Add as friend");
			relationURI = dssn.user.get('id');
		}else{
			$("#edit-view").show();
			$("#settings").show();
			$("#add-relation .ui-btn-text").text("Add relation");
	
			switch(lastPage){
				case "profilePage":
					$("#add-activity").hide();
					$("#add-relation").hide();
					$("#edit-view").attr('href', 'edit-profile.html');
					break;
				case "feedPage":
					$("#add-activity").show();
					$("#add-relation").hide();
					$("#edit-view").attr('href', '#');
					break;
				case "networkPage":
					$("#add-activity").hide();
					$("#add-relation").show();
					$("#edit-view").attr('href', 'edit-network.html');
					break;
			}
		}
	});
	
	// go home
	$(".homebtn").live('vclick', function(){
		var url = dssn.userURI;
		
		loadAndRenderProfile(url);
	});
});



