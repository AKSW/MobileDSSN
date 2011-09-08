$(function(){
	var toDel = [];

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
					return this.data.attributes["foaf:nick"][0];
				},
				uri: function(){
					return this.data.id;
				},
				image: function(){
					return this.data.attributes["foaf:depiction"][0];
				}
			}).appendTo("#network_items");
			
			$("#network_items").listview('refresh');
		});
		
		// show loader
		$.mobile.showPageLoadingMsg();
				
		dssn.getKnowsPeople(user.get('foaf:knows'));
	});
	
	// on edit page show
	$("#networkEditPage").live('pagebeforeshow', function(){
		var user = dssn.userData;
		toDel = [];
		
		dssn.bind(dssn.READY, function(event){
			dssn.unbind(dssn.READY);
			$.mobile.hidePageLoadingMsg();
			
			var network = dssn.knows;
			
			$("#networkEditTemplate").tmpl(network.models, {
				name: function(){
					return this.data.attributes["foaf:nick"][0];
				},
				uri: function(){
					return this.data.id;
				},
				image: function(){
					return this.data.attributes["foaf:depiction"][0];
				}
			}).appendTo("#network_items");
			
			$("#network_items").listview('refresh');
		});
		
		// show loader
		$.mobile.showPageLoadingMsg();
				
		dssn.getKnowsPeople(user.get('foaf:knows'));
	});
	
	// add item do del queue
	$(".del_network_profile").live('vclick', function(event){
		var url = $(this).data('url');
		
		// add to del queue
		toDel.push(url);
		
		// del visual element
		$(this).closest('li').remove();
	});
	
	$("#save-net").live('vclick', function(){
		// user uri
		var subject = dssn.userURI;
		// update endpoint
		var epurl = dssn.userData.get("dssn:updateService")[0];
		// get default graph uri
		var graph = epurl.split('?')[1].replace("default-graph-uri=", "");
		// predicate
		var predicate = "foaf:knows";
		
		// form delete
		var delQuery = "DELETE DATA FROM <"+graph+"> { "
		for(var i = 0; i < toDel.length; i++){
			delQuery += "<"+subject+"> <"+dssn.prepareNs(predicate)+"> <"+toDel[i]+"> . ";
			
			dssn.updateLocalProfile(predicate, toDel[i], null);
		}
		// end delete 
		delQuery += "} ";
		
		// create url &
		// form url with ajax proxy
		var url = dssn.ajaxproxy+encodeURIComponent( epurl + "&query=" + encodeURIComponent( delQuery ) );
		$.getJSON(url, function(data){
			console.log(data);
		});
		
		$.mobile.changePage("network.html");
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
		
		var epurl = dssn.userData.get("dssn:updateService")[0];
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