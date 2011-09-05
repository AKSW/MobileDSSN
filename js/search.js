$(function(){
	var searchResData = null;
	
	var loadAndRenderSearch = function(url, internal){
		internal = internal || false;
	
		$.getJSON(url, function(data){
			searchResData = data;
			console.log(searchResData);
		
			// append results
			$("#search_items").empty();
			$("#searchTemplate").tmpl(data.entries, {
				name: function(){
					return this.data.title[0].value;
				}
			}).appendTo("#search_items");
			// refresh list
			$("#search_items").listview("refresh");
			
			// assign next/prev btns
			if( data.link != data.previous ){
				$("#sprev").data('url', data.previous);
			}else{
				$("#sprev").data('url', '');
			}
			if( data.link != data.last ){
				$("#snext").data('url', data.next);
			}else{
				$("#snext").data('url', '');
			}
					
			// hide loader
			$.mobile.hidePageLoadingMsg();
			
			// scroll to top if page change
			if( internal ) $.mobile.silentScroll(0);
		});
		
		if( internal ){
			// show loader
			$.mobile.showPageLoadingMsg();
		}else{
			// change page
			$.mobile.changePage("searchres.html");	
		}
	}
	
		
	// sindice search
	$("#dosearch").live('vclick', function(){
		var url = "http://api.sindice.com/v3/search?q="+encodeURIComponent( $("#searchreq").val() )+"&fq=format:RDF&fq=class:foaf:person&format=json";
		url = dssn.ajaxproxy + encodeURIComponent( url );
		
		loadAndRenderSearch(url);
	});
	
	// show loader
	$("#searchResultPage").live("pagebeforeshow", function(){
		// show loader
		$.mobile.showPageLoadingMsg();
	});
	
	// pagination
	$("#sprev").live('vclick', function(){
		$(this).removeClass('ui-btn-down-a').removeClass('ui-btn-active');
		
		var url = $(this).data('url');
		console.log(url);
		if(url.length > 0){
			loadAndRenderSearch(url, true);
		}else{
			showMessage("This is first page!");
		}
	});
	$("#snext").live('vclick', function(){
		$(this).removeClass('ui-btn-down-a').removeClass('ui-btn-active');
	
		var url = $(this).data('url');
		console.log(url);
		if(url.length > 0){
			loadAndRenderSearch(url, true);
		}else{
			showMessage("This is last page!");
		}
	});
});