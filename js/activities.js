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
		// update endpoint
		var epurl = dssn.userData.get("updates")[0];
		// get default graph uri
		var graph = epurl.split('?')[1].replace("default-graph-uri=", ""); // /default-graph-uri=(.+)/.exec(epurl)[1];
		// get user
		var user = dssn.userURI;
		// post type
		var ptype = $("#activity-type").val();
		// get object
		var object = $("#link").val();
		if( typeof object == 'undefined' || object.length < 1 ) object = graph+"/activity/object/"+new Date().getTime();
		// get text
		var content = $("#textarea").val();
		// get verb
		var verb = "<http://xmlns.notu.be/aair#" + ( ptype == "text" ? 'Post' : 'Share' ) + ">";
		
		// create activity uri using time
		var activityURI = graph+"/activity/"+new Date().getTime();
		
		// generate query
		var query =  //"PREFIX aair: <http://xmlns.notu.be/aair#> \
					  //PREFIX dcterms: <http://purl.org/dc/terms/> \
					  "INSERT DATA INTO <"+graph+"> { \
						<"+activityURI+"> a <http://xmlns.notu.be/aair#Activity> . \
					 	<"+activityURI+"> <http://xmlns.notu.be/aair#activityActor> <"+user+"> . \
					 	<"+activityURI+"> <http://xmlns.notu.be/aair#activityVerb> "+verb+" . \
						<"+activityURI+"> <http://xmlns.notu.be/aair#activityObject> <"+object+"> . ";
			
		// describe object
		if( ptype == "text" ){
			query += "<"+object+"> a <http://xmlns.notu.be/aair#Note> . \
					  <"+object+"> <http://xmlns.notu.be/aair#content> \""+content+"\" . ";
		}else{
			query +=	"<"+object+"> <http://purl.org/dc/terms/description> \""+content+"\" . ";
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