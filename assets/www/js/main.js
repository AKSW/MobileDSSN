$(function(){
	// check if user default URI is set
	var userURI = localStorage['userURI'];
	// if not set load settings page
	if( typeof userURI == "undefined" ){
		console.log('no uri set');
		$.mobile.changePage("pages/settings.html");
	}else{
		console.log('user: '+userURI);
		dssn.userURI = userURI;
		loadAndRenderProfile(userURI, true);
	}
	
	$("#settingsPage").live('pagebeforeshow', function(){
		$("#webiduri").val(localStorage['userURI']);
	});
		
	$("#save-settings").live('vclick', function(){
		var userURI = $("#webiduri").val();
		localStorage['userURI'] = dssn.userURI = userURI;
		loadAndRenderProfile(userURI);
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
			$("#sync").hide();
			
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
					$("#sync").hide();
					$("#edit-view").attr('href', 'edit-profile.html');
					break;
				case "feedPage":
					$("#add-activity").show();
					$("#add-relation").hide();
					$("#sync").hide();
					$("#edit-view").attr('href', '#');
					break;
				case "networkPage":
					$("#add-activity").hide();
					$("#add-relation").show();
					$("#sync").show();
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



