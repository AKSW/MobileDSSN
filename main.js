$('#loadProfile').live('vclick',function(event){
	// rdf2json uri
	var rdf2json = "http://localhost/MobileDSSN/rdf2json.php?url=";
	// foaf profile uri
	var resourceURI = "http://bob.lod2.eu/id/bob";
	// rdf-json uri
	var loadingURI = rdf2json+encodeURIComponent(resourceURI);
	
	// show loader
	$.mobile.showPageLoadingMsg();
	
	// rdf db
	var db = $.rdf();
	db.prefix('foaf', 'http://xmlns.com/foaf/0.1/');
	db.prefix('aair', 'http://xmlns.notu.be/aair#');
	
	// get user profile
	$.getJSON(loadingURI, function(data){
		//console.log(data);
		db.load(data);
		
		// get depiction
		db.where("?s foaf:depiction ?depiction").each(function(){
			var img = this.depiction.value.toString();
			$("#user_image").attr('src', img);
		});
		
		// get name
		db.where("?s aair:name ?name").each(function(){
			var name = this.name.value.toString();
			$("#user_name").text(name);
		});
		
		//get bday
		db.where("?s foaf:birthday ?bday").each(function(){
			var bday = this.bday.value.toString();
			$("#user_bday").text(bday);
		});
		
		//get weblog
		db.where("?s foaf:weblog ?weblog").each(function(){
			var weblog = this.weblog.value.toString();
			$("#user_weblog").html("<a href='"+weblog+"'>"+weblog+"</a>");
		});
		
		// get knows
		db.where("?s foaf:knows ?user").each(function(){
			var user = this.user.value.toString();
			var dataURL = rdf2json+encodeURIComponent(user);
			$.getJSON(dataURL, function(data){
				var userdb = $.rdf();
				userdb.load(data);
				userdb.prefix('foaf', 'http://xmlns.com/foaf/0.1/');
				userdb.prefix('aair', 'http://xmlns.notu.be/aair#');
				userdb.where("?s foaf:nick ?nick").each(function(){
					var nick = this.nick.value.toString();
					$("#user_knows").append( $("<li><a href='"+user+"'>"+nick+"</a></li>") );
					$("#user_knows").listview('refresh');
				});
			});
		});
		
		var activity = db.where("?s <http://purl.org/net/dssn/activityFeed> ?stream");
		activity.each(function(){
			var stream = this.stream.value.toString();
			//$("body").html("stream is "+stream);
			console.log(stream)
		})
		
		console.log(activity);
		
		// change page
		$.mobile.changePage("#profilePage")
	})
});
