$(function(){
	$("#activity-type").live('change', function(){
		//console.log('change to: '+$(this).val() );
		if( $(this).val() == "text" ){
			$("#link-holder").hide();
		}else{
			$("#link-holder").show();
		}
	});
	
	$("#submit-activity").live('vclick', function(){
		// get current time
		var date = new Date();
	
		// update endpoint
		var epurl = dssn.userData.get("dssn:updateService")[0];
		// get default graph uri
		var graph = epurl.split('?')[1].replace("default-graph-uri=", ""); // /default-graph-uri=(.+)/.exec(epurl)[1];
		// get user
		var user = dssn.userURI;
		// post type
		var ptype = $("#activity-type").val();
		// get object
		//var object = $("#link").val();
		//if( typeof object == 'undefined' || object.length < 1 ) object = graph+"/activity/object/"+date.getTime();
		var objectURL = $("#link").val();
		var object = graph+"/activity/object/"+date.getTime();
		// get text
		var content = $("#textarea").val();
		// get verb
		var verb = "<http://xmlns.notu.be/aair#" + ( ptype == "text" ? 'Post' : 'Share' ) + ">";
		
		// create activity uri using time
		var activityURI = graph+"/activity/"+date.getTime();
		// generate time
		var time = date.getFullYear()+"-"+( (date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1) )+"-"+( date.getDate() < 10 ? "0"+date.getDate() : date.getDate() )+"T";
		time += ( date.getHours() < 10 ? "0"+date.getHours() : date.getHours() )+":"+( date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes() )+":"+( date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds() );
		
		var tz = Math.abs(date.getTimezoneOffset());
			var hr = tz/60;
			hr = hr < 10 ? "0"+hr : hr;
			var min = tz - hr*60;
			min = min < 10 ? "0"+min : min;
		if( date.getTimezoneOffset() < 0 ){
			time += "+"+hr+":"+min;
		}else{
			time += "-"+hr+":"+min;
		}
//		2011-08-25T11:40:01+02:00
		
		// generate query
		var query =  //"PREFIX aair: <http://xmlns.notu.be/aair#> \
					  //PREFIX dcterms: <http://purl.org/dc/terms/> \
					  "INSERT DATA INTO <"+graph+"> { \
						<"+activityURI+"> a <http://xmlns.notu.be/aair#Activity> . \
					 	<"+activityURI+"> <http://xmlns.notu.be/aair#activityActor> <"+user+"> . \
					 	<"+activityURI+"> <http://xmlns.notu.be/aair#activityVerb> "+verb+" . \
						<"+activityURI+"> <http://xmlns.notu.be/aair#activityObject> <"+object+"> . \
						<"+activityURI+"> <http://www.w3.org/2005/Atom/published> \""+time+"\"^^<http://www.w3.org/2001/XMLSchema#dateTime>";
			
		// describe object
		if( ptype == "text" ){
			query += "<"+object+"> a <http://xmlns.notu.be/aair#Note> . \
					  <"+object+"> <http://xmlns.notu.be/aair#content> \""+content+"\" . ";
		}else if(ptype == "link"){
			query += "<"+object+"> a <http://xmlns.notu.be/aair#Bookmark> . \
					  <"+object+"> <http://xmlns.notu.be/aair#targetUrl> <"+objectURL+"> . \
					  <"+object+"> <http://purl.org/dc/terms/description> \""+content+"\" . ";
		}else if(ptype == "photo"){
			query += "<"+object+"> a <http://xmlns.notu.be/aair#Photo> . \
					  <"+object+"> <http://xmlns.notu.be/aair#largerImage> <"+objectURL+"> . \
					  <"+object+"> <http://purl.org/dc/terms/description> \""+content+"\" . ";
		}else if(ptype == "video"){
			query += "<"+object+"> a <http://xmlns.notu.be/aair#Video> . \
					  <"+object+"> <http://xmlns.notu.be/aair#videoStream> <"+objectURL+"> . \
					  <"+object+"> <http://purl.org/dc/terms/description> \""+content+"\" . ";
		}else{
			alert('unknown post type!');
			return;
		}
		
		query += " }";
			
		//console.log(query);
		
		// create url
		epurl += "&query=" + encodeURIComponent( query );
		
		// form url with ajax proxy
		var url = dssn.ajaxproxy+encodeURIComponent( epurl );
		
		$.getJSON(url, function(data){
			console.log(data);
		});
		
		$.mobile.changePage("activities.html");
	});
});